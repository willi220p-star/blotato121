"""Deduplicate companies by official domain, name, LinkedIn, or ABN."""

from __future__ import annotations

import re
from urllib.parse import urlparse

LEGAL_SUFFIXES = (
    "pty",
    "pty ltd",
    "pty. ltd.",
    "pty limited",
    "proprietary",
    "proprietary limited",
    "limited",
    "ltd",
    "inc",
    "incorporated",
    "australia",
    "australian",
    "corp",
    "corporation",
    "group",
    "the",
)


def canonical_name(name: str) -> str:
    value = re.sub(r"[^\w\s&/+-]", " ", (name or "").lower())
    value = re.sub(r"\s+", " ", value).strip()
    parts = [part for part in value.split() if part not in LEGAL_SUFFIXES]
    return " ".join(parts) or value


def domain_key(url: str) -> str:
    if not url or url in {"Unknown", "Not found"}:
        return ""
    host = urlparse(url).netloc.lower() or url.lower()
    host = host.split("@")[-1]
    if host.startswith("www."):
        host = host[4:]
    return host.rstrip("/")


def _linkedin_key(url: str) -> str:
    if not url or url in {"Unknown", "Not found"}:
        return ""
    path = urlparse(url).path.lower().rstrip("/")
    match = re.search(r"/company/([^/]+)", path)
    return match.group(1) if match else path


def company_identity(row: dict) -> tuple[str, ...]:
    return (
        domain_key(row.get("company_website") or row.get("website") or ""),
        canonical_name(row.get("company_name") or row.get("name") or ""),
        _linkedin_key(row.get("linkedin_url") or ""),
        re.sub(r"\D", "", str(row.get("abn") or "")),
    )


def _score(row: dict) -> int:
    score = 0
    website = row.get("company_website") or row.get("website") or ""
    if website and website not in {"Unknown", "Not found"}:
        score += 5
    if row.get("linkedin_url") not in {None, "", "Unknown", "Not found"}:
        score += 2
    if (row.get("employee_count") or "Unknown") != "Unknown":
        score += 2
    if (row.get("research_confidence") or "") == "High":
        score += 3
    elif (row.get("research_confidence") or "") == "Medium":
        score += 1
    score += len(row.get("discovery_sources") or [])
    return score


def _merge(primary: dict, extra: dict) -> dict:
    merged = dict(primary)
    for key, value in extra.items():
        if key == "discovery_sources":
            seen = list(merged.get("discovery_sources") or [])
            for item in value or []:
                if item not in seen:
                    seen.append(item)
            merged["discovery_sources"] = seen
            continue
        current = merged.get(key)
        empty = current in {None, "", "Unknown", "Not found"}
        if empty and value not in {None, "", "Unknown", "Not found"}:
            merged[key] = value
    return merged


def dedupe_companies(rows: list[dict]) -> list[dict]:
    buckets: list[dict] = []
    for row in rows:
        domain, name, linkedin, abn = company_identity(row)
        match = None
        for existing in buckets:
            e_domain, e_name, e_linkedin, e_abn = company_identity(existing)
            if domain and e_domain and domain == e_domain:
                match = existing
                break
            if linkedin and e_linkedin and linkedin == e_linkedin:
                match = existing
                break
            if abn and e_abn and abn == e_abn:
                match = existing
                break
            if name and e_name and name == e_name:
                match = existing
                break
        if match is None:
            buckets.append(dict(row))
            continue
        winner, loser = (row, match) if _score(row) > _score(match) else (match, row)
        merged = _merge(winner, loser)
        buckets[buckets.index(match)] = merged
    buckets.sort(key=lambda item: canonical_name(item.get("company_name") or item.get("name") or ""))
    return buckets
