"""Public employees from official company websites. No LinkedIn crawl."""

from __future__ import annotations

from lib.website_people import _candidate_people_pages, extract_people_from_html
from src.nt_ndis.config import PRIORITY_TITLES, UNKNOWN, today_iso
from src.nt_ndis.deduplication import dedupe_employees
from src.nt_ndis.validation import department_for, split_name


def people_page_urls(home_url: str, content: str, limit: int = 5) -> list[str]:
    try:
        return _candidate_people_pages(home_url, content, limit=limit)
    except Exception:  # noqa: BLE001
        return [home_url] if home_url else []


def _priority(title: str) -> bool:
    value = (title or "").lower()
    return any(token in value for token in PRIORITY_TITLES)


def people_from_html(content: str, source_url: str, company: dict) -> list[dict]:
    rows = []
    try:
        extracted = extract_people_from_html(content, source_url)
    except Exception:  # noqa: BLE001
        return []
    for person in extracted:
        full = person.get("person_name") or ""
        title = person.get("role") or UNKNOWN
        first, last = split_name(full)
        rows.append(
            {
                "company_id": company.get("company_id") or company.get("abn"),
                "company_name": company.get("company_name"),
                "abn": company.get("abn"),
                "first_name": first or UNKNOWN,
                "last_name": last or UNKNOWN,
                "full_name": full,
                "job_title": title,
                "department": department_for(title),
                "location": company.get("locations") or UNKNOWN,
                "linkedin_url": person.get("linkedin_profile_url") or UNKNOWN,
                "work_email": UNKNOWN,
                "email_type": "unavailable",
                "email_verified": False,
                "email_status": "unavailable",
                "source_url": person.get("source_url") or source_url,
                "source_type": person.get("source_type") or "official website",
                "verification_status": person.get("confidence") or "medium",
                "priority_role": "yes" if _priority(title) else "no",
                "created_at": today_iso(),
                "updated_at": today_iso(),
            }
        )
    return dedupe_employees(rows)
