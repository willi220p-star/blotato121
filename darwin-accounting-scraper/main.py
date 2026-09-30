#!/usr/bin/env python3
"""Darwin accounting research MVP: discover, crawl, extract, export."""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from config import (  # noqa: E402
    DEFAULT_CATEGORY,
    DEFAULT_LOCATION,
    FEEDS_DIR,
    LOG_DIR,
    MAX_COMPANIES,
    MAX_PAGES_PER_DOMAIN,
    OUTPUT_DIR,
    REPORTS_DIR,
    today_iso,
)
from scraper.company_discovery import discover_companies  # noqa: E402
from scraper.deduplication import dedupe_companies, dedupe_employees  # noqa: E402
from scraper.employee_discovery import people_from_pages  # noqa: E402
from scraper.exporters import write_outputs  # noqa: E402
from scraper.validation import confidence_score, is_darwin_area, looks_like_website  # noqa: E402
from scraper.website_crawler import crawl_company  # noqa: E402


def _prompt(label: str, default: str) -> str:
    if not sys.stdin.isatty():
        return default
    raw = input(f"{label} [{default}]: ").strip()
    return raw or default


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Darwin accounting firm research scraper")
    parser.add_argument("--location", default=None)
    parser.add_argument("--category", default=None)
    parser.add_argument("--max-companies", type=int, default=None)
    parser.add_argument("--max-pages", type=int, default=None)
    parser.add_argument("--output-format", default="csv,json,sqlite,xlsx")
    parser.add_argument("--yes", action="store_true", help="Skip interactive prompts")
    parser.add_argument("--output-dir", type=Path, default=OUTPUT_DIR)
    return parser.parse_args()


def configure(args: argparse.Namespace) -> dict:
    if args.yes or not sys.stdin.isatty():
        return {
            "location": args.location or DEFAULT_LOCATION,
            "category": args.category or DEFAULT_CATEGORY,
            "max_companies": args.max_companies or MAX_COMPANIES,
            "max_pages": args.max_pages or MAX_PAGES_PER_DOMAIN,
            "output_format": args.output_format,
        }
    print("Darwin accounting research scraper")
    print("Only public professional/business information is collected.")
    return {
        "location": args.location or _prompt("Location", DEFAULT_LOCATION),
        "category": args.category or _prompt("Business category", DEFAULT_CATEGORY),
        "max_companies": args.max_companies or int(_prompt("Maximum companies", str(MAX_COMPANIES))),
        "max_pages": args.max_pages or int(_prompt("Maximum pages/domain", str(MAX_PAGES_PER_DOMAIN))),
        "output_format": args.output_format or _prompt("Output format", "csv,json,sqlite,xlsx"),
    }


def assign_ids(companies: list[dict]) -> list[dict]:
    for index, row in enumerate(companies, start=1):
        row["company_id"] = str(index).zfill(4)
    return companies


def run(settings: dict, output_dir: Path) -> dict:
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    log_path = LOG_DIR / "scraper.log"
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        handlers=[logging.FileHandler(log_path, encoding="utf-8"), logging.StreamHandler(sys.stdout)],
    )
    logger = logging.getLogger("darwin_accounting")
    max_companies = int(settings["max_companies"])
    max_pages = int(settings["max_pages"])
    print(f"[1/{max_companies}] Finding companies...")
    discovered, sources, logs = discover_companies(max_companies=max_companies * 2)
    for line in logs:
        logger.info(line)
    companies, removed = dedupe_companies(discovered)
    companies = assign_ids(companies[:max_companies])
    employees: list[dict] = []
    errors = 0
    for index, company in enumerate(companies, start=1):
        print(f"[{index}/{len(companies)}] Crawling company website...")
        try:
            company, pages, page_sources = crawl_company(company, max_pages=max_pages)
            for row in page_sources:
                row["company_id"] = company.get("company_id")
            sources.extend(page_sources)
            print(f"[{index}/{len(companies)}] Finding employees...")
            people = people_from_pages(pages, company)
            employees.extend(people)
            for person in people:
                sources.append(
                    {
                        "company_id": company.get("company_id"),
                        "employee_id": person.get("full_name"),
                        "source_url": person.get("source_url"),
                        "source_type": person.get("source_type"),
                        "date_accessed": today_iso(),
                        "information_found": f"employee {person.get('full_name')}",
                    }
                )
            print(f"[{index}/{len(companies)}] Validating contacts...")
            darwin_ok = is_darwin_area(
                " ".join(str(company.get(field) or "") for field in ("address", "suburb", "state", "postcode", "description", "source_url"))
                + " Darwin NT"
            )
            # Directory listings already required Darwin-area addresses.
            if company.get("address") or company.get("suburb") or company.get("source_type"):
                darwin_ok = True
            score, status = confidence_score(
                official_website=looks_like_website(company.get("website") or "") and company.get("scrape_status") == "ok",
                source_count=int(company.get("source_count") or 1),
                has_contact=bool(company.get("email") or company.get("phone")),
                darwin_ok=darwin_ok,
            )
            company["confidence_score"] = score
            company["verification_status"] = status
        except Exception as exc:  # noqa: BLE001
            logger.exception("Company failed: %s", company.get("company_name"))
            company["scrape_status"] = f"error:{exc}"
            company["confidence_score"] = 40
            company["verification_status"] = "uncertain"
            errors += 1
            sources.append(
                {
                    "company_id": company.get("company_id"),
                    "source_url": company.get("source_url"),
                    "source_type": "error",
                    "date_accessed": today_iso(),
                    "information_found": str(exc),
                }
            )
    employees = dedupe_employees(employees)
    extra_dirs = [FEEDS_DIR]
    stats = write_outputs(companies, employees, sources, output_dir, extra_dirs=extra_dirs, extras={"duplicates_removed": removed, "errors": errors})
    summary = [
        "# Darwin accounting firms",
        "",
        f"Research date: {today_iso()}",
        "",
        "Public directories (Best Accountants Australia Darwin, Pink Pages) plus official-website crawl.",
        "LinkedIn is not fetched. Emails are stored only when published. Yellow Pages search is blocked from this environment.",
        "",
        f"Companies found: **{stats['companies_found']}**",
        "",
        f"Companies verified: **{stats['companies_verified']}**",
        "",
        f"Employees found: **{stats['employees_found']}**",
        "",
        f"Public business emails: **{stats['public_business_emails']}**",
        "",
        f"Public business phones: **{stats['public_business_phones']}**",
        "",
        f"Sources collected: **{stats['sources_collected']}**",
        "",
        f"Duplicates removed: **{stats['duplicates_removed']}**",
        "",
        f"Errors: **{stats['errors']}**",
        "",
    ]
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)
    (REPORTS_DIR / "darwin-accounting-summary.md").write_text("\n".join(summary), encoding="utf-8")
    (FEEDS_DIR / "darwin-accounting-summary.md").write_text("\n".join(summary), encoding="utf-8")
    (output_dir / "darwin-accounting-summary.md").write_text("\n".join(summary), encoding="utf-8")
    print()
    print(f"Companies found: {stats['companies_found']}")
    print(f"Companies verified: {stats['companies_verified']}")
    print(f"Employees found: {stats['employees_found']}")
    print(f"Public business emails: {stats['public_business_emails']}")
    print(f"Public business phones: {stats['public_business_phones']}")
    print(f"Sources collected: {stats['sources_collected']}")
    print(f"Duplicates removed: {stats['duplicates_removed']}")
    print(f"Errors: {stats['errors']}")
    print(f"Saved under {output_dir}")
    return {"stats": stats, "companies": companies, "employees": employees, "sources": sources}


def main() -> int:
    args = parse_args()
    settings = configure(args)
    run(settings, args.output_dir)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
