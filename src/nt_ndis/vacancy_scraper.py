"""Official career-page vacancies. SEEK is handled separately and never bypassed."""

from __future__ import annotations

import re

from lib.disability_roles import extract_job_openings
from src.darwin_it.careers.pages import career_candidates, extract_vacancies
from src.nt_ndis.config import UNKNOWN, today_iso

JUNK_VACANCY_RE = re.compile(
    r"properties on the way|programs? and events|disability confident recruiter|"
    r"specialist network|^level \d\b|take your next step|our new graduate program|"
    r"footprint|job openings|(?<![a-z])jobs$|we are a disability",
    re.I,
)


def plausible_vacancy(title: str) -> bool:
    value = (title or "").strip()
    if len(value) < 8 or JUNK_VACANCY_RE.search(value):
        return False
    if re.fullmatch(r"(?:new\s+)?graduate programs?(?:\s+and events)?\.?", value, re.I):
        return False
    return True


def vacancies_from_html(content: str, source_url: str, company: dict) -> list[dict]:
    found: list[dict] = []
    for opening in extract_job_openings(content, source_url):
        found.append(
            {
                "company_id": company.get("company_id") or company.get("abn"),
                "company_name": company.get("company_name"),
                "job_title": opening.get("position_title") or UNKNOWN,
                "location": opening.get("location") or UNKNOWN,
                "employment_type": opening.get("employment_type") or UNKNOWN,
                "description": opening.get("status") or UNKNOWN,
                "date_posted": opening.get("date_posted") or UNKNOWN,
                "job_url": opening.get("job_url") or source_url,
                "source": "Company Career Page",
                "active": "yes",
                "last_checked": today_iso(),
            }
        )
    for job in extract_vacancies(content, source_url):
        found.append(
            {
                "company_id": company.get("company_id") or company.get("abn"),
                "company_name": company.get("company_name"),
                "job_title": job.get("vacancy_title") or UNKNOWN,
                "location": job.get("vacancy_location") or UNKNOWN,
                "employment_type": job.get("employment_type") or UNKNOWN,
                "description": job.get("job_description_summary") or UNKNOWN,
                "date_posted": UNKNOWN,
                "job_url": job.get("vacancy_url") or source_url,
                "source": "Company Career Page",
                "active": "yes",
                "last_checked": today_iso(),
            }
        )
    unique: dict[tuple[str, str], dict] = {}
    for row in found:
        if not plausible_vacancy(str(row.get("job_title") or "")):
            continue
        key = (str(row["job_url"]).lower().rstrip("/"), str(row["job_title"]).lower())
        unique[key] = row
    return list(unique.values())


def career_urls(home_url: str, content: str) -> list[str]:
    pages, external = career_candidates(home_url, content)
    return pages[:6] + external[:2]
