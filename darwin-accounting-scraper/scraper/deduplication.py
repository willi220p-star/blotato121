"""Deduplicate companies and employees from multiple public sources."""

from __future__ import annotations

import re

from scraper.validation import canonical_name, domain_of


def phone_key(value: str | None) -> str:
    digits = re.sub(r"\D", "", value or "")
    return digits[-9:] if len(digits) >= 9 else digits


def company_keys(row: dict) -> tuple[str, str, str, str]:
    return (
        re.sub(r"\D", "", str(row.get("abn") or "")),
        domain_of(row.get("website") or ""),
        canonical_name(row.get("legal_name") or row.get("company_name") or ""),
        phone_key(row.get("phone") or row.get("phone_normalized") or ""),
    )


def merge_company(primary: dict, extra: dict) -> dict:
    merged = dict(primary)
    for key, value in extra.items():
        if key in {"source_url", "source_urls"}:
            seen = [item for item in str(merged.get("source_url") or "").split(" | ") if item]
            for item in str(value or "").split(" | "):
                if item and item not in seen:
                    seen.append(item)
            merged["source_url"] = " | ".join(seen)
            continue
        if key == "source_count":
            merged["source_count"] = int(merged.get("source_count") or 1) + 1
            continue
        current = merged.get(key)
        if current in {None, "", "null"} and value not in {None, "", "null"}:
            merged[key] = value
    merged["source_count"] = int(merged.get("source_count") or 1)
    return merged


def dedupe_companies(rows: list[dict]) -> tuple[list[dict], int]:
    buckets: list[dict] = []
    removed = 0
    for row in rows:
        abn, domain, name, phone = company_keys(row)
        match = None
        for existing in buckets:
            e_abn, e_domain, e_name, e_phone = company_keys(existing)
            if abn and e_abn and abn == e_abn:
                match = existing
                break
            if domain and e_domain and domain == e_domain:
                match = existing
                break
            if name and e_name and name == e_name:
                match = existing
                break
            if phone and e_phone and phone == e_phone and name and e_name and name[:8] == e_name[:8]:
                match = existing
                break
        if match is None:
            row = dict(row)
            row["source_count"] = int(row.get("source_count") or 1)
            buckets.append(row)
        else:
            buckets[buckets.index(match)] = merge_company(match, row)
            removed += 1
    return buckets, removed


def dedupe_employees(rows: list[dict]) -> list[dict]:
    unique: dict[tuple[str, str], dict] = {}
    for row in rows:
        key = (
            str(row.get("company_id") or row.get("company_name") or ""),
            re.sub(r"\W", "", str(row.get("full_name") or "").lower()),
        )
        current = unique.get(key)
        if current is None:
            unique[key] = row
            continue
        if row.get("date_found") and (row.get("date_found") or "") >= (current.get("date_found") or ""):
            if current.get("job_title") and row.get("job_title") != current.get("job_title"):
                row = dict(row)
                row["previous_job_title"] = current.get("job_title")
            unique[key] = {**current, **{k: v for k, v in row.items() if v not in {None, ""}}}
        elif row.get("linkedin_url") and not current.get("linkedin_url"):
            current["linkedin_url"] = row["linkedin_url"]
    return list(unique.values())
