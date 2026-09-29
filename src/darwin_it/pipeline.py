"""Discover Darwin IT companies first, then enrich, then vacancies, then export."""

from __future__ import annotations

import json
import logging
from pathlib import Path
from urllib.parse import urlparse

from lxml import html

from src.darwin_it.careers.pages import career_candidates, extract_vacancies
from src.darwin_it.company.classify import classify_category, service_type, summarise_description
from src.darwin_it.company.verify import extract_linkedin, extract_location, official_website
from src.darwin_it.discovery.ictnt import scrape_ictnt
from src.darwin_it.discovery.seeds import load_seed_companies
from src.darwin_it.employees.extract import apply_employee_hint, extract_employee_count
from src.darwin_it.export.writers import write_outputs
from src.darwin_it.http import fetch
from src.darwin_it.models import COMPANY_COLUMNS, NOT_FOUND, UNKNOWN, today_iso
from src.darwin_it.seek.search import seek_company_search

_SEEK_BLOCKED_DETAIL = ""
from src.darwin_it.validation.confidence import hiring_signal, research_confidence, size_segment, vacancy_status
from src.darwin_it.validation.dedupe import dedupe_companies

logger = logging.getLogger("darwin_it")
ROOT = Path(__file__).resolve().parents[2]


def _source(
    company_name: str,
    field: str,
    value,
    source_name: str,
    source_url: str,
    source_type: str,
    confidence: str,
    source_status: str = "OK",
) -> dict:
    return {
        "company_name": company_name,
        "data_field": field,
        "value": value if value not in {None, ""} else UNKNOWN,
        "source_name": source_name,
        "source_url": source_url or "",
        "source_type": source_type,
        "date_checked": today_iso(),
        "confidence": confidence,
        "source_status": source_status,
    }


def discover_companies() -> tuple[list[dict], list[dict]]:
    sources: list[dict] = []
    seeds = load_seed_companies()
    for seed in seeds:
        sources.append(
            _source(
                seed.get("company_name") or seed.get("name"),
                "discovery",
                seed.get("source") or "seed",
                seed.get("source") or "Curated public discovery",
                seed.get("profile_url") or seed.get("website") or "",
                "directory/search",
                "High" if seed.get("website") else "Medium",
            )
        )
    ictnt_rows, ictnt_page = scrape_ictnt()
    sources.append(
        _source(
            "",
            "discovery_index",
            f"{len(ictnt_rows)} ICTNT Darwin/Palmerston rows",
            "ICTNT directory",
            ictnt_page.get("url") or "",
            "directory",
            "High" if ictnt_page.get("ok") else "Low",
            ictnt_page.get("source_status") or "Error",
        )
    )
    merged = dedupe_companies(seeds + ictnt_rows)
    return merged, sources


def _meta_description(content: str) -> str:
    try:
        document = html.fromstring(content or "")
    except (TypeError, ValueError):
        return ""
    for xpath in (
        "//meta[@name='description']/@content",
        "//meta[@property='og:description']/@content",
    ):
        values = document.xpath(xpath)
        if values:
            return str(values[0] or "").strip()
    paragraphs = [text.strip() for text in document.xpath("//p//text()") if len(text.strip()) > 40]
    return " ".join(paragraphs[:3])[:800]


def _page_text(content: str) -> str:
    try:
        document = html.fromstring(content or "")
    except (TypeError, ValueError):
        return content or ""
    return " ".join(document.xpath("//body//text()"))


def enrich_company(seed: dict) -> tuple[dict, list[dict], list[dict]]:
    name = seed.get("company_name") or seed.get("name") or UNKNOWN
    sources: list[dict] = []
    vacancies: list[dict] = []
    website, domain, website_source = official_website(seed.get("company_website") or seed.get("website") or "")
    home = {"ok": False, "text": "", "url": website, "source_status": "Unknown", "error": ""}
    website_ok = False
    if website not in {UNKNOWN, NOT_FOUND}:
        home = fetch(website)
        website_ok = bool(home["ok"])
        if website_ok:
            website = home["url"] or website
            parsed = urlparse(website)
            domain = parsed.netloc.lower().removeprefix("www.")
        sources.append(
            _source(
                name,
                "company_website",
                website if website_ok else NOT_FOUND,
                "Official website fetch",
                website,
                "website",
                "High" if website_ok else "Low",
                home.get("source_status") or "Error",
            )
        )
        if not website_ok:
            notes_fail = f"Website fetch failed: {home.get('error') or home.get('source_status')}"
        else:
            notes_fail = ""
    else:
        notes_fail = "No official website in discovery sources."

    page_text = _page_text(home.get("text") or "") if website_ok else ""
    meta = _meta_description(home.get("text") or "") if website_ok else ""
    location, suburb, darwin_ok = extract_location(
        f"{page_text} {seed.get('suburb') or ''} {seed.get('darwin_location') or ''}",
        seed.get("suburb") or "",
    )
    if not darwin_ok and seed.get("suburb"):
        darwin_ok = True
        suburb = seed.get("suburb")
        location = seed.get("darwin_location") or f"{suburb}, NT"

    category = classify_category(f"{seed.get('focus') or ''} {meta} {page_text[:1500]}", seed.get("focus") or "")
    tech_type = service_type(f"{seed.get('focus') or ''} {meta} {page_text[:1500]}", "")
    description = summarise_description(meta or page_text[:1200], name, suburb, category)

    linkedin = extract_linkedin(home.get("text") or "", website) if website_ok else NOT_FOUND
    if linkedin in {NOT_FOUND, ""} and seed.get("linkedin_hint"):
        linkedin = seed["linkedin_hint"]
        sources.append(
            _source(
                name,
                "linkedin_url",
                linkedin,
                "Public web search snippet",
                linkedin,
                "public search",
                "Medium",
            )
        )
    elif linkedin not in {NOT_FOUND, ""}:
        sources.append(_source(name, "linkedin_url", linkedin, "Official website", website, "website", "High"))

    employees = extract_employee_count(page_text, website, "Company website") if website_ok else apply_employee_hint(None)
    if employees["employee_count"] == UNKNOWN and seed.get("employee_hint"):
        employees = apply_employee_hint(seed["employee_hint"])
    if employees["employee_count"] != UNKNOWN:
        sources.append(
            _source(
                name,
                "employee_count",
                employees["employee_count"],
                employees["employee_count_source"],
                employees["employee_count_source_url"],
                "employee evidence",
                "Medium" if employees["employee_count_type"] in {"range", "estimated"} else "High",
            )
        )

    career_found = "NO"
    career_url = NOT_FOUND
    career_status = "No career page found"
    career_vacancies: list[dict] = []
    if website_ok:
        candidates, external = career_candidates(website, home.get("text") or "")
        if seed.get("careers_url"):
            candidates = [seed["careers_url"]] + candidates
        checked = []
        for candidate in candidates[:6]:
            page = fetch(candidate)
            checked.append(candidate)
            if not page["ok"]:
                continue
            path = urlparse(page["url"]).path.lower()
            is_career = any(token in path for token in ("career", "job", "vacanc", "work-with", "join"))
            extracted = extract_vacancies(page["text"], page["url"])
            if extracted or is_career:
                career_found = "YES"
                career_url = page["url"]
                career_vacancies = extracted
                career_status = "Vacancies listed" if extracted else "Career page exists but no vacancy"
                break
        if career_found == "NO" and external:
            career_found = "YES"
            career_url = external[0]
            career_status = "Official site links to external careers listing"
        if career_found == "NO" and checked:
            career_status = "Checked home and likely career paths; no careers page confirmed"
        sources.append(
            _source(
                name,
                "career_page_url",
                career_url,
                "Official website",
                career_url if career_url != NOT_FOUND else website,
                "website",
                "High" if career_found == "YES" else "Medium",
                "OK" if website_ok else "Error",
            )
        )

    for job in career_vacancies:
        vacancies.append(
            {
                "company_name": name,
                "vacancy_title": job["vacancy_title"],
                "vacancy_source": "Company Career Page",
                "vacancy_url": job["vacancy_url"],
                "vacancy_location": job.get("vacancy_location") or NOT_FOUND,
                "employment_type": job.get("employment_type") or UNKNOWN,
                "job_category": job.get("job_category") or "Technology",
                "job_description_summary": job.get("job_description_summary") or NOT_FOUND,
                "date_found": today_iso(),
                "is_current": "YES",
                "company_match_confidence": "High",
            }
        )

    global _SEEK_BLOCKED_DETAIL
    if _SEEK_BLOCKED_DETAIL:
        seek = {
            "seek_status": "Unable to verify",
            "vacancies": [],
            "source_url": "",
            "source_status": "Blocked",
            "detail": _SEEK_BLOCKED_DETAIL,
        }
    else:
        seek = seek_company_search(name)
        if seek["seek_status"] == "Unable to verify":
            _SEEK_BLOCKED_DETAIL = seek.get("detail") or "SEEK blocked; not retrying every employer"
    sources.append(
        _source(
            name,
            "seek_status",
            seek["seek_status"],
            "SEEK keyword search",
            seek.get("source_url") or "",
            "SEEK",
            "Low",
            seek.get("source_status") or "Blocked",
        )
    )
    seek_vacancies = []
    if seek["seek_status"] not in {"Unable to verify"}:
        for job in seek.get("vacancies") or []:
            row = {
                "company_name": name,
                "date_found": today_iso(),
                "is_current": "YES" if job.get("vacancy_title") else "Unknown",
                **job,
            }
            seek_vacancies.append(row)
            vacancies.append(row)

    company_count = len(career_vacancies)
    seek_count = len(seek_vacancies)
    notes = []
    if seed.get("notes_seed"):
        notes.append(seed["notes_seed"])
    if seed.get("national"):
        notes.append("National/multi-state firm; included because of a Darwin office, listing, or Darwin service page.")
    if seed.get("employer_type"):
        notes.append(f"Employer type: {seed['employer_type']}.")
    if notes_fail:
        notes.append(notes_fail)
    if seek["seek_status"] == "Unable to verify":
        notes.append("SEEK could not be verified from this environment (blocked or challenge). Individual SEEK /job/ pages were not fetched.")
    if career_found == "NO":
        notes.append("No verified official career page.")
    if employees["employee_count"] == UNKNOWN:
        notes.append("Employee count could not be verified from public sources.")

    status = "Active" if website_ok and darwin_ok else ("Possibly active" if darwin_ok or website_ok else "Unknown")
    confidence = research_confidence(
        website=website,
        website_ok=website_ok,
        employee_count=employees["employee_count"],
        employee_type=employees["employee_count_type"],
        vacancy_count=company_count + seek_count,
        career_found=career_found,
        darwin_verified=darwin_ok,
    )
    vac_status = vacancy_status(company_count, seek_count, career_found, career_status)
    row = {column: UNKNOWN for column in COMPANY_COLUMNS}
    row.update(
        {
            "company_name": name,
            "company_description": description,
            "company_category": category,
            "company_status": status,
            "darwin_location": location if location != UNKNOWN else (seed.get("darwin_location") or f"{suburb}, NT"),
            "suburb": suburb or UNKNOWN,
            **employees,
            "company_website": website if website_ok else (website if website not in {UNKNOWN, NOT_FOUND} else NOT_FOUND),
            "website_domain": domain if website_ok or domain not in {UNKNOWN, ""} else UNKNOWN,
            "website_source": website_source if website not in {UNKNOWN, NOT_FOUND} else UNKNOWN,
            "linkedin_url": linkedin if linkedin else NOT_FOUND,
            "career_page_found": career_found,
            "career_page_url": career_url,
            "career_page_status": career_status,
            "career_page_last_checked": today_iso(),
            "vacancy_status": vac_status,
            "company_vacancy_count": company_count,
            "seek_vacancy_count": seek_count,
            "total_vacancy_count": company_count + seek_count,
            "seek_status": seek["seek_status"],
            "company_size_segment": size_segment(
                employees["employee_count"],
                employees.get("employee_count_min") or "",
                employees.get("employee_count_max") or "",
            ),
            "technology_service_type": tech_type,
            "hiring_signal": hiring_signal(company_count, seek_count, seek["seek_status"]),
            "last_checked": today_iso(),
            "research_confidence": confidence,
            "notes": " ".join(notes) or NOT_FOUND,
        }
    )
    if employees["employee_count"] == UNKNOWN:
        row["company_size_segment"] = UNKNOWN
    sources.append(_source(name, "company_description", description[:180], "Official website summary", website, "website", confidence if website_ok else "Low"))
    return row, vacancies, sources


def run_research(
    *,
    data_dir: Path | None = None,
    reports_dir: Path | None = None,
    feeds_dir: Path | None = None,
    cache_path: Path | None = None,
    limit: int | None = None,
) -> dict:
    data_dir = data_dir or (ROOT / "data")
    reports_dir = reports_dir or (ROOT / "reports")
    feeds_dir = feeds_dir or (ROOT / "feeds")
    cache_path = cache_path or (feeds_dir / "darwin-it-research-cache.json")
    logger.info("Starting Darwin IT company discovery")
    discovered, discovery_sources = discover_companies()
    if limit:
        discovered = discovered[:limit]
    companies: list[dict] = []
    vacancies: list[dict] = []
    sources = list(discovery_sources)
    cache = {"companies": [], "vacancies": [], "sources": sources}
    cache_path.parent.mkdir(parents=True, exist_ok=True)
    cache_path.write_text(json.dumps({"phase": "discovery", "companies": discovered}, indent=2, ensure_ascii=False), encoding="utf-8")
    logger.info("Discovered %s companies; starting enrichment", len(discovered))
    for index, seed in enumerate(discovered, start=1):
        name = seed.get("company_name") or seed.get("name")
        logger.info("Enriching %s/%s %s", index, len(discovered), name)
        try:
            row, jobs, rows = enrich_company(seed)
        except Exception as exc:  # noqa: BLE001
            logger.exception("Enrichment failed for %s", name)
            row = {column: UNKNOWN for column in COMPANY_COLUMNS}
            row.update(
                {
                    "company_name": name,
                    "company_status": UNKNOWN,
                    "notes": f"Enrichment error: {exc}",
                    "research_confidence": "Low",
                    "last_checked": today_iso(),
                    "career_page_found": "NO",
                    "company_vacancy_count": 0,
                    "seek_vacancy_count": 0,
                    "total_vacancy_count": 0,
                    "hiring_signal": UNKNOWN,
                }
            )
            jobs, rows = [], []
        companies.append(row)
        vacancies.extend(jobs)
        sources.extend(rows)
        cache = {"phase": "enrichment", "companies": companies, "vacancies": vacancies, "sources": sources}
        cache_path.write_text(json.dumps(cache, indent=2, ensure_ascii=False), encoding="utf-8")
    companies = dedupe_companies(companies)
    seen_jobs = set()
    unique_jobs = []
    for job in vacancies:
        key = (job.get("company_name"), job.get("vacancy_url"), job.get("vacancy_title"))
        if key in seen_jobs:
            continue
        seen_jobs.add(key)
        unique_jobs.append(job)
    stats = write_outputs(companies, unique_jobs, sources, data_dir=data_dir, reports_dir=reports_dir, feeds_dir=feeds_dir)
    payload = {"stats": stats, "companies": companies, "vacancies": unique_jobs, "sources": sources}
    cache_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
    return payload
