"""Public employees from official company pages. No LinkedIn crawl. No guessed emails."""

from __future__ import annotations

import sys
from pathlib import Path

from config import today_iso
from scraper.contact_extractor import attach_published_email, extract_emails
from scraper.deduplication import dedupe_employees
from scraper.social_sources import extract_socials
from scraper.validation import is_priority_title, qualification_from, seniority_for, split_name

ROOT = Path(__file__).resolve().parents[2]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from lib.website_people import extract_people_from_html  # noqa: E402


def people_from_pages(pages: list[dict], company: dict) -> list[dict]:
    rows: list[dict] = []
    for page in pages:
        url = page.get("url") or ""
        content = page.get("text") or ""
        try:
            extracted = extract_people_from_html(content, url)
        except Exception:  # noqa: BLE001
            extracted = []
        emails = extract_emails(content, company.get("website") or "")
        socials = extract_socials(content)
        for person in extracted:
            full = person.get("person_name") or ""
            title = person.get("role") or None
            first, last = split_name(full)
            row = {
                "company_id": company.get("company_id"),
                "company_name": company.get("company_name"),
                "first_name": first,
                "last_name": last,
                "full_name": full,
                "job_title": title,
                "seniority": seniority_for(title or ""),
                "qualification": qualification_from(f"{title or ''} {full}"),
                "location": company.get("suburb") or company.get("address"),
                "public_work_email": None,
                "email_type": None,
                "email_source_url": None,
                "business_phone": None,
                "linkedin_url": person.get("linkedin_profile_url") or socials.get("linkedin_person_url"),
                "social_url": None,
                "source_url": person.get("source_url") or url,
                "source_type": person.get("source_type") or "company website",
                "date_found": today_iso(),
                "priority_role": "yes" if is_priority_title(title or "") else "no",
            }
            row = attach_published_email(row, emails)
            rows.append(row)
    return dedupe_employees(rows)
