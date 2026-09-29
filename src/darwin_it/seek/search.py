"""SEEK access that never bypasses protections or fetches individual /job/ pages."""

from __future__ import annotations

from urllib.parse import quote_plus

from src.darwin_it.http import fetch
from src.darwin_it.models import UNKNOWN

SEEK_SEARCH = "https://www.seek.com.au/jobs?keywords={query}"


def seek_search_url(query: str) -> str:
    return SEEK_SEARCH.format(query=quote_plus(query))


def _blocked_result(url: str, detail: str) -> dict:
    return {
        "seek_status": "Unable to verify",
        "vacancies": [],
        "source_url": url,
        "source_status": "Blocked",
        "detail": detail,
    }


def seek_company_search(company_name: str) -> dict:
    """Keyword search only. Individual SEEK job URLs are never fetched."""
    query = f'"{company_name}" Darwin'
    url = seek_search_url(query)
    page = fetch(url, honor_robots=True)
    if not page["ok"]:
        return _blocked_result(url, page.get("error") or page.get("source_status") or "SEEK unavailable")
    text = page["text"]
    if "cf-challenge" in text.lower() or "attention required" in text.lower() or "captcha" in text.lower():
        return _blocked_result(url, "SEEK returned a challenge page")
    titles = []
    import re

    for match in re.findall(r'data-automation="jobTitle"[^>]*>([^<]+)', text, flags=re.I):
        title = re.sub(r"\s+", " ", match).strip()
        if title and title not in titles:
            titles.append(title)
    vacancies = []
    for title in titles:
        vacancies.append(
            {
                "vacancy_title": title,
                "vacancy_url": url,
                "vacancy_location": "Darwin NT (SEEK search)",
                "employment_type": UNKNOWN,
                "job_category": "Technology",
                "job_description_summary": "Title listed on a SEEK keyword search page. Individual SEEK job pages were not fetched.",
                "vacancy_source": "SEEK",
                "company_match_confidence": "Low",
            }
        )
    return {
        "seek_status": "OK" if vacancies else "No SEEK titles visible",
        "vacancies": vacancies,
        "source_url": url,
        "source_status": "OK",
        "detail": f"{len(vacancies)} titles on keyword search",
    }


def seek_market_search() -> dict:
    return seek_company_search("IT")
