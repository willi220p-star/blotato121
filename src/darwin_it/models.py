"""Shared constants, column lists, and date helpers."""

from __future__ import annotations

from datetime import date, datetime, timezone

UNKNOWN = "Unknown"
NOT_FOUND = "Not found"
BLOCKED = "Blocked"

COMPANY_COLUMNS = [
    "company_name",
    "company_description",
    "company_category",
    "company_status",
    "darwin_location",
    "suburb",
    "employee_count",
    "employee_count_min",
    "employee_count_max",
    "employee_count_type",
    "employee_count_source",
    "employee_count_source_url",
    "employee_count_date",
    "company_website",
    "website_domain",
    "website_source",
    "linkedin_url",
    "career_page_found",
    "career_page_url",
    "career_page_status",
    "career_page_last_checked",
    "vacancy_status",
    "company_vacancy_count",
    "seek_vacancy_count",
    "total_vacancy_count",
    "seek_status",
    "company_size_segment",
    "technology_service_type",
    "hiring_signal",
    "last_checked",
    "research_confidence",
    "notes",
]

VACANCY_COLUMNS = [
    "company_name",
    "vacancy_title",
    "vacancy_source",
    "vacancy_url",
    "vacancy_location",
    "employment_type",
    "job_category",
    "job_description_summary",
    "date_found",
    "is_current",
    "company_match_confidence",
]

SOURCE_COLUMNS = [
    "company_name",
    "data_field",
    "value",
    "source_name",
    "source_url",
    "source_type",
    "date_checked",
    "confidence",
    "source_status",
]


def today_iso() -> str:
    return date.today().isoformat()


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()
