"""Staged NT private NDIS intelligence: discover, verify, enrich, export."""

from __future__ import annotations

import json
import logging
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

from src.darwin_it.http import fetch
from src.nt_ndis.company_scraper import enrich_company_site
from src.nt_ndis.config import ROOT, UNKNOWN, today_iso
from src.nt_ndis.deduplication import dedupe_companies, dedupe_employees
from src.nt_ndis.discovery import discover_companies
from src.nt_ndis.email_finder import attach_published_email, extract_emails
from src.nt_ndis.employee_scraper import people_from_html, people_page_urls
from src.nt_ndis.exporters import write_outputs
from src.nt_ndis.queries import company_discovery_queries
from src.nt_ndis.seek_research import reset_seek_circuit, seek_for_company, vacancies_from_seek
from src.nt_ndis.vacancy_scraper import career_urls, plausible_vacancy, vacancies_from_html

logger = logging.getLogger("nt_ndis")


def _source(company_id: str, source_type: str, source_url: str, title: str, employee_id: str = "", vacancy_id: str = "") -> dict:
    return {
        "company_id": company_id,
        "employee_id": employee_id,
        "vacancy_id": vacancy_id,
        "source_type": source_type,
        "source_url": source_url or "",
        "source_title": title,
        "retrieved_at": today_iso(),
    }


def _dedupe_vacancies(rows: list[dict]) -> list[dict]:
    unique: dict[tuple[str, str, str], dict] = {}
    for row in rows:
        key = (
            str(row.get("company_id") or ""),
            str(row.get("job_url") or "").lower().rstrip("/"),
            str(row.get("job_title") or "").lower(),
        )
        unique[key] = row
    return list(unique.values())


def enrich_company(company: dict) -> tuple[dict, list[dict], list[dict], list[dict], list[str]]:
    name = company.get("company_name") or UNKNOWN
    cid = str(company.get("company_id") or company.get("abn") or name)
    logs = [f"[DISCOVERED] {name} ABN={company.get('abn')} type={company.get('org_type')}"]
    sources = [
        _source(cid, "NDIS Commission register", (company.get("source_urls") or "").split(" | ")[0], "Approved NT provider")
    ]
    employees: list[dict] = []
    vacancies: list[dict] = []
    try:
        company, page = enrich_company_site(company)
        website = company.get("website") or ""
        if page.get("ok"):
            logs.append(f"[VERIFIED] {name} official website {page.get('url')}")
            sources.append(_source(cid, "official website", page.get("url") or website, "Company homepage"))
            home_html = page.get("text") or ""
            home_url = page.get("url") or website
            employees.extend(people_from_html(home_html, home_url, company))
            home_emails = extract_emails(home_html, home_url)
            employees = [attach_published_email(person, home_emails) for person in employees]
            for people_url in people_page_urls(home_url, home_html, limit=4)[1:4]:
                extra = fetch(people_url, timeout=8, retries=1, delay=0.4)
                if not extra.get("ok"):
                    if extra.get("source_status") == "Blocked":
                        logs.append(f"[FAILED] {name} people page blocked {people_url}")
                    continue
                employees.extend(people_from_html(extra.get("text") or "", extra.get("url") or people_url, company))
                page_emails = extract_emails(extra.get("text") or "", extra.get("url") or people_url)
                employees = [attach_published_email(person, page_emails) for person in employees]
                sources.append(_source(cid, "official website", extra.get("url") or people_url, "Staff / about page"))
            employees = dedupe_employees(employees)
            public_emails = sum(1 for person in employees if person.get("work_email") not in {"", UNKNOWN})
            if company.get("email") not in {"", UNKNOWN}:
                public_emails += 1
            logs.append(f"[EMPLOYEES FOUND] {name} count={len(employees)}")
            logs.append(f"[EMAILS FOUND] {name} count={public_emails}")
            collected_jobs: list[dict] = []
            for career_url in career_urls(home_url, home_html):
                career = fetch(career_url, timeout=8, retries=1, delay=0.4)
                if not career.get("ok"):
                    continue
                collected_jobs.extend(vacancies_from_html(career.get("text") or "", career.get("url") or career_url, company))
                sources.append(_source(cid, "official careers page", career.get("url") or career_url, "Careers / jobs"))
            vacancies.extend(collected_jobs)
            logs.append(f"[VACANCIES FOUND] {name} official={len(collected_jobs)}")
        else:
            status = company.get("scrape_status") or page.get("source_status") or "no official website"
            logs.append(f"[FAILED] {name} website enrichment: {status}")
            if "blocked" in str(status).lower():
                company["scrape_status"] = "blocked"
        logs.append(f"[COMPLETED] {name}")
    except Exception as exc:  # noqa: BLE001
        logger.exception("Enrichment failed for %s", name)
        company["scrape_status"] = f"error:{exc}"
        logs.append(f"[FAILED] {name} {exc}")
    return company, employees, vacancies, sources, logs


def run_research(
    *,
    output_dir: Path | None = None,
    data_dir: Path | None = None,
    feeds_dir: Path | None = None,
    reports_dir: Path | None = None,
    cache_path: Path | None = None,
    log_path: Path | None = None,
    fallback_csv: Path | None = None,
    limit: int | None = None,
    workers: int = 6,
    seek: bool = True,
) -> dict:
    output_dir = output_dir or (ROOT / "output")
    data_dir = data_dir or (ROOT / "data" / "nt-ndis")
    feeds_dir = feeds_dir or (ROOT / "feeds")
    reports_dir = reports_dir or (ROOT / "reports")
    cache_path = cache_path or (data_dir / "research-cache.json")
    log_path = log_path or (ROOT / "logs" / "nt-ndis.log")
    fallback_csv = fallback_csv or (ROOT / "feeds" / "ndis-disability-nonprofit.nt.csv")
    register_cache = data_dir / "register-cache.csv"
    data_dir.mkdir(parents=True, exist_ok=True)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    reset_seek_circuit()

    run_logs = [f"[DISCOVERED] generated search queries={len(company_discovery_queries())}"]
    companies, discovery_logs = discover_companies(cache_path=register_cache, fallback_csv=fallback_csv)
    run_logs.extend(discovery_logs)
    companies = dedupe_companies(companies)
    run_logs.append(f"[DEDUPLICATED] companies={len(companies)}")
    if limit:
        website_first = [row for row in companies if row.get("website") not in {"", UNKNOWN}]
        register_only = [row for row in companies if row.get("website") in {"", UNKNOWN}]
        companies = (website_first + register_only)[:limit]
        run_logs.append(f"[DISCOVERED] limit applied companies={len(companies)}")

    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(json.dumps({"phase": "discovery", "companies": companies, "logs": run_logs}, indent=2, ensure_ascii=False), encoding="utf-8")

    enriched: list[dict] = []
    employees: list[dict] = []
    vacancies: list[dict] = []
    sources: list[dict] = []
    cache_lock = threading.Lock()
    logger.info("Enriching %s NT NDIS providers with %s workers", len(companies), workers)
    with ThreadPoolExecutor(max_workers=max(1, workers)) as pool:
        futures = {pool.submit(enrich_company, dict(row)): row.get("company_name") for row in companies}
        for future in as_completed(futures):
            name = futures[future]
            try:
                company, people, jobs, rows, logs = future.result()
            except Exception as exc:  # noqa: BLE001
                logger.exception("Worker failed for %s", name)
                company = next(row for row in companies if row.get("company_name") == name)
                company["scrape_status"] = f"error:{exc}"
                people, jobs, rows, logs = [], [], [], [f"[FAILED] {name} {exc}"]
            enriched.append(company)
            employees.extend(people)
            vacancies.extend(jobs)
            sources.extend(rows)
            run_logs.extend(logs)
            with cache_lock:
                cache_path.write_text(
                    json.dumps(
                        {
                            "phase": "enrichment",
                            "companies": enriched,
                            "employees": employees,
                            "vacancies": vacancies,
                            "logs": run_logs[-200:],
                        },
                        indent=2,
                        ensure_ascii=False,
                    ),
                    encoding="utf-8",
                )

    if seek:
        for company in enriched:
            result = seek_for_company(company.get("company_name") or "")
            seek_jobs = vacancies_from_seek(result, company)
            vacancies.extend(seek_jobs)
            sources.append(
                _source(
                    str(company.get("company_id") or ""),
                    "SEEK",
                    result.get("source_url") or "",
                    result.get("seek_status") or result.get("source_status") or "SEEK",
                )
            )
            if result.get("source_status") == "blocked":
                run_logs.append(f"[FAILED] SEEK blocked for {company.get('company_name')}: {result.get('detail')}")
                break
            if seek_jobs:
                run_logs.append(f"[VACANCIES FOUND] {company.get('company_name')} SEEK titles={len(seek_jobs)}")

    companies = dedupe_companies(enriched)
    employees = dedupe_employees(employees)
    vacancies = _dedupe_vacancies(vacancies)
    run_logs.append(f"[DEDUPLICATED] companies={len(companies)} employees={len(employees)} vacancies={len(vacancies)}")
    stats = write_outputs(
        companies,
        employees,
        vacancies,
        sources,
        output_dir=output_dir,
        data_dir=data_dir,
        feeds_dir=feeds_dir,
        reports_dir=reports_dir,
    )
    log_path.write_text("\n".join(run_logs) + "\n", encoding="utf-8")
    payload = {
        "stats": stats,
        "companies": companies,
        "employees": employees,
        "vacancies": vacancies,
        "sources": sources,
        "search_queries": company_discovery_queries(),
        "logs": run_logs,
    }
    cache_path.write_text(json.dumps({k: payload[k] for k in ("stats", "logs")}, indent=2, ensure_ascii=False), encoding="utf-8")
    return payload


def reprocess_existing(
    *,
    output_dir: Path | None = None,
    data_dir: Path | None = None,
    feeds_dir: Path | None = None,
    reports_dir: Path | None = None,
) -> dict:
    """Rebuild locations and vacancy quality from the cached register plus prior enrichment."""
    from src.nt_ndis.discovery import aggregate_nt_private
    from lib.ndis_providers import parse_register_rows

    output_dir = output_dir or (ROOT / "output")
    data_dir = data_dir or (ROOT / "data" / "nt-ndis")
    feeds_dir = feeds_dir or (ROOT / "feeds")
    reports_dir = reports_dir or (ROOT / "reports")
    register = (data_dir / "register-cache.csv").read_text(encoding="utf-8-sig")
    fresh = {row["abn"]: row for row in aggregate_nt_private(parse_register_rows(register))}
    payload = json.loads((output_dir / "nt-ndis-intelligence.json").read_text(encoding="utf-8"))
    keep_fields = (
        "description",
        "phone",
        "website",
        "email",
        "linkedin",
        "employee_count",
        "employee_count_min",
        "employee_count_max",
        "employee_count_source",
        "employee_count_source_url",
        "scrape_status",
        "research_confidence",
        "source_urls",
        "last_verified",
    )
    companies = []
    for old in payload.get("companies") or []:
        rec = fresh.get(old.get("abn"))
        if not rec:
            continue
        merged = dict(rec)
        for field in keep_fields:
            value = old.get(field)
            if value not in {None, ""}:
                merged[field] = value
        companies.append(merged)
    seen = {row["abn"] for row in companies}
    for abn, rec in fresh.items():
        if abn not in seen:
            companies.append(rec)
    ids = {str(row.get("company_id") or row.get("abn")) for row in companies}
    employees = [row for row in payload.get("employees") or [] if str(row.get("company_id")) in ids]
    vacancies = [
        row
        for row in payload.get("vacancies") or []
        if str(row.get("company_id")) in ids and plausible_vacancy(str(row.get("job_title") or ""))
    ]
    sources = [row for row in payload.get("sources") or [] if str(row.get("company_id") or "") in ids or not row.get("company_id")]
    stats = write_outputs(
        companies,
        employees,
        vacancies,
        sources,
        output_dir=output_dir,
        data_dir=data_dir,
        feeds_dir=feeds_dir,
        reports_dir=reports_dir,
    )
    return {"stats": stats, "companies": companies, "employees": employees, "vacancies": vacancies, "sources": sources}
