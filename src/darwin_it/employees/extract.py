"""Employee-count extraction. Never invents a number or converts a range to an exact count."""

from __future__ import annotations

import re

from src.darwin_it.models import UNKNOWN, today_iso

RANGE_RE = re.compile(
    r"\b(?:(\d{1,5})\s*[-–to]{1,3}\s*(\d{1,5})\s+employees?)\b",
    re.I,
)
EXACT_RE = re.compile(
    r"\b(?:(?:employs?|staff(?:ed)?|team of|our team of|we have|headcount(?: of)?)\s+)(\d{1,5})\s+(?:employees?|staff|people|team members)\b",
    re.I,
)
TEAM_LIST_HINT = re.compile(r"\b(?:our team|meet the team|leadership team)\b", re.I)
LINKEDIN_RANGE_RE = re.compile(r"\b(\d{1,5})\s*[-–]\s*(\d{1,5})\s+employees?\b", re.I)
LINKEDIN_EXACT_RE = re.compile(r"\b(\d{1,5})\s+employees?\b", re.I)


def _record(
    count: str,
    count_type: str,
    source: str,
    source_url: str,
    minimum: str = "",
    maximum: str = "",
) -> dict:
    return {
        "employee_count": count,
        "employee_count_min": minimum,
        "employee_count_max": maximum,
        "employee_count_type": count_type,
        "employee_count_source": source,
        "employee_count_source_url": source_url,
        "employee_count_date": today_iso(),
    }


def unknown_employee() -> dict:
    return _record(UNKNOWN, UNKNOWN, UNKNOWN, "", "", "")


def apply_employee_hint(hint: dict | None) -> dict:
    """Apply a pre-verified public snippet. Requires count and source_url."""
    if not hint:
        return unknown_employee()
    count = str(hint.get("employee_count") or "").strip()
    source_url = str(hint.get("source_url") or "").strip()
    if not count or not source_url:
        return unknown_employee()
    count_type = hint.get("employee_count_type") or UNKNOWN
    minimum = str(hint.get("employee_count_min") or "")
    maximum = str(hint.get("employee_count_max") or "")
    if "-" in count and not minimum:
        parts = re.split(r"\s*[-–]\s*", count)
        if len(parts) == 2 and parts[0].isdigit() and parts[1].isdigit():
            minimum, maximum = parts
            count_type = count_type if count_type != UNKNOWN else "range"
    elif count.isdigit() and not minimum:
        minimum = maximum = count
        count_type = count_type if count_type != UNKNOWN else "estimated"
    return _record(
        count,
        count_type,
        hint.get("source") or "Public source",
        source_url,
        minimum,
        maximum,
    )


def extract_employee_count(text: str, source_url: str, source_name: str = "Company website") -> dict:
    blob = text or ""
    range_match = RANGE_RE.search(blob) or LINKEDIN_RANGE_RE.search(blob)
    if range_match:
        low, high = range_match.group(1), range_match.group(2)
        return _record(
            f"{low}-{high}",
            "range",
            source_name,
            source_url,
            low,
            high,
        )
    exact = EXACT_RE.search(blob)
    if exact:
        number = exact.group(1)
        stated = "company stated" if "website" in source_name.lower() else "estimated"
        return _record(number, stated, source_name, source_url, number, number)
    linkedin_exact = LINKEDIN_EXACT_RE.search(blob)
    if linkedin_exact and "linkedin" in (source_name + source_url).lower():
        number = linkedin_exact.group(1)
        return _record(number, "estimated", source_name, source_url, number, number)
    return unknown_employee()
