"""Public search-query generation. Queries are recorded; Google is not scraped."""

from __future__ import annotations

from src.nt_ndis.config import NT_LOCATIONS, PRIORITY_TITLES

SERVICE_QUERIES = (
    "NDIS provider",
    "private NDIS provider",
    "NDIS disability services",
    "NDIS support coordinator",
    "NDIS SIL",
    "NDIS SDA",
    "NDIS STA",
    "NDIS allied health",
    "NDIS plan management",
    "NDIS behaviour support",
    "disability employment NDIS",
)


def company_discovery_queries() -> list[str]:
    queries: list[str] = []
    for location in NT_LOCATIONS:
        place = "Northern Territory" if location == "Other NT" else location
        for stem in SERVICE_QUERIES:
            queries.append(f"{stem} {place}")
            if place != "Northern Territory":
                queries.append(f"{stem} {place} NT")
    queries.extend(
        [
            "NDIS providers Darwin NT",
            "private NDIS providers Darwin",
            "NDIS disability services Northern Territory",
            "NDIS provider Palmerston NT",
            "NDIS provider Alice Springs",
            "NDIS provider Katherine NT",
            "NDIS provider Tennant Creek",
            "NDIS provider Nhulunbuy",
        ]
    )
    seen: list[str] = []
    for query in queries:
        if query not in seen:
            seen.append(query)
    return seen


def employee_queries(company_name: str) -> list[str]:
    name = (company_name or "").strip()
    if not name:
        return []
    titles = ("CEO", "director", "manager", "NDIS manager", "support coordinator", "operations manager", "LinkedIn")
    extra = tuple(title for title in PRIORITY_TITLES[:8])
    return [f"{name} {title}" for title in titles + extra]


def vacancy_queries(company_name: str) -> list[str]:
    name = (company_name or "").strip()
    if not name:
        return []
    return [f"{name} {suffix}" for suffix in ("careers", "jobs", "SEEK", "vacancies", "current vacancies Darwin")]
