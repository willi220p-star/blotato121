"""SEEK keyword search only. Never fetch /job/ pages or bypass blocks."""

from __future__ import annotations

from src.darwin_it.seek.search import seek_company_search

_BLOCKED = ""


def seek_for_company(company_name: str) -> dict:
    global _BLOCKED
    if _BLOCKED:
        return {
            "seek_status": "Unable to verify",
            "vacancies": [],
            "source_status": "blocked",
            "detail": _BLOCKED,
        }
    result = seek_company_search(company_name)
    if result.get("seek_status") == "Unable to verify":
        _BLOCKED = result.get("detail") or "SEEK blocked"
        result["source_status"] = "blocked"
    return result


def reset_seek_circuit() -> None:
    global _BLOCKED
    _BLOCKED = ""


def vacancies_from_seek(result: dict, company: dict) -> list[dict]:
    from src.nt_ndis.config import UNKNOWN, today_iso

    rows = []
    for job in result.get("vacancies") or []:
        rows.append(
            {
                "company_id": company.get("company_id") or company.get("abn"),
                "company_name": company.get("company_name"),
                "job_title": job.get("vacancy_title") or UNKNOWN,
                "location": job.get("vacancy_location") or UNKNOWN,
                "employment_type": job.get("employment_type") or UNKNOWN,
                "description": job.get("job_description_summary") or "SEEK keyword search title only; /job/ pages were not fetched.",
                "date_posted": UNKNOWN,
                "job_url": job.get("vacancy_url") or result.get("source_url") or "",
                "source": "SEEK",
                "active": "unverified_search",
                "last_checked": today_iso(),
            }
        )
    return rows
