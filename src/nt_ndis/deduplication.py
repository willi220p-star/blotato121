"""Deduplicate companies and employees by ABN, domain, name, phone."""

from __future__ import annotations

import re
from urllib.parse import urlparse

from src.nt_ndis.validation import domain_of


def canonical_name(name: str) -> str:
    value = re.sub(r"[^\w\s&/+-]", " ", (name or "").lower())
    value = re.sub(r"\s+", " ", value).strip()
    drop = {
        "pty",
        "ltd",
        "limited",
        "proprietary",
        "inc",
        "incorporated",
        "the",
        "australia",
        "australian",
    }
    return " ".join(part for part in value.split() if part not in drop)


def phone_key(value: str) -> str:
    digits = re.sub(r"\D", "", value or "")
    return digits[-9:] if len(digits) >= 9 else digits


def company_keys(row: dict) -> tuple[str, str, str, str]:
    return (
        re.sub(r"\D", "", str(row.get("abn") or "")),
        domain_of(row.get("website") or ""),
        canonical_name(row.get("legal_name") or row.get("company_name") or ""),
        phone_key(str(row.get("phone") or "")),
    )


def merge_company(primary: dict, extra: dict) -> dict:
    merged = dict(primary)
    for key, value in extra.items():
        if key in {"source_urls", "discovery_sources"}:
            seen = [item for item in (merged.get(key) or "").split(" | ") if item]
            for item in str(value or "").split(" | "):
                item = item.strip()
                if item and item not in seen:
                    seen.append(item)
            merged[key] = " | ".join(seen)
            continue
        current = merged.get(key)
        empty = current in {None, "", "Not publicly available", "Unknown"}
        if empty and value not in {None, "", "Not publicly available", "Unknown"}:
            merged[key] = value
    return merged


def dedupe_companies(rows: list[dict]) -> list[dict]:
    buckets: list[dict] = []
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
            buckets.append(dict(row))
        else:
            buckets[buckets.index(match)] = merge_company(match, row)
    return buckets


def dedupe_employees(rows: list[dict]) -> list[dict]:
    unique: dict[tuple[str, str], dict] = {}
    for row in rows:
        key = (
            str(row.get("company_id") or row.get("abn") or row.get("company_name") or ""),
            re.sub(r"\W", "", str(row.get("full_name") or "").lower()),
        )
        current = unique.get(key)
        if current is None or (row.get("linkedin_url") and not current.get("linkedin_url")):
            unique[key] = row
    return list(unique.values())
