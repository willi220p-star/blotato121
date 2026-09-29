"""Confidence, vacancy status, size segment, and hiring signal — evidence only."""

from __future__ import annotations

from src.darwin_it.models import UNKNOWN


def parse_range(value: str) -> tuple[str, str]:
    text = str(value or "").replace(",", "").strip()
    match = __import__("re").search(r"(\d+)\s*[-–to]+\s*(\d+)", text, __import__("re").I)
    if match:
        return match.group(1), match.group(2)
    match = __import__("re").search(r"(\d+)\s*\+", text)
    if match:
        return match.group(1), ""
    match = __import__("re").fullmatch(r"(\d+)", text)
    if match:
        return match.group(1), match.group(1)
    return "", ""


def size_segment(employee_count: str, minimum: str = "", maximum: str = "") -> str:
    low, high = minimum, maximum
    if not low and not high:
        low, high = parse_range(employee_count)
    try:
        number = int(high or low)
    except ValueError:
        return UNKNOWN
    if number <= 10:
        return "1-10"
    if number <= 50:
        return "11-50"
    if number <= 200:
        return "51-200"
    if number <= 500:
        return "201-500"
    return "500+"


def vacancy_status(company_count: int, seek_count: int, career_found: str, career_status: str) -> str:
    if company_count and seek_count:
        return "Company + SEEK vacancies found"
    if company_count:
        return "Active vacancies found"
    if seek_count:
        return "SEEK vacancies found"
    if career_found == "YES" and "no vacancy" in (career_status or "").lower():
        return "Career page exists but no vacancy"
    if career_status == "Unable to verify" or "blocked" in (career_status or "").lower():
        return "Unable to verify"
    return "No vacancies found"


def hiring_signal(company_count: int, seek_count: int, seek_status: str) -> str:
    total = company_count + seek_count
    if total >= 3:
        return "Strong"
    if total >= 1:
        return "Moderate"
    if seek_status == "Unable to verify" and company_count == 0:
        return UNKNOWN
    return "None"


def research_confidence(
    *,
    website: str,
    website_ok: bool,
    employee_count: str,
    employee_type: str,
    vacancy_count: int,
    career_found: str,
    darwin_verified: bool,
) -> str:
    official = bool(website and website not in {UNKNOWN, "Not found"} and website_ok)
    employee_ok = employee_count not in {None, "", UNKNOWN} and employee_type != UNKNOWN
    if official and darwin_verified and (employee_ok or vacancy_count or career_found == "YES"):
        if employee_ok and (vacancy_count or career_found == "YES"):
            return "High"
        return "Medium"
    if official and darwin_verified:
        return "Medium"
    return "Low"
