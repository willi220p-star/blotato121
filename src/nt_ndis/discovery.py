"""Stage 1–2: discover and verify private NT NDIS providers from public registers."""

from __future__ import annotations

import logging
from pathlib import Path

from lib.ndis_providers import fetch_register_csv, is_nt_text, parse_register_rows
from src.nt_ndis.config import COMMISSION_FINDER_URL, UNKNOWN, today_iso
from src.nt_ndis.deduplication import dedupe_companies
from src.nt_ndis.validation import classify_org_type, is_nt_operation, nt_locations

logger = logging.getLogger("nt_ndis.discovery")


def _outlet_blob(raw: dict) -> str:
    return " ".join(
        str(raw.get(key) or "")
        for key in ("Head office address", "Outlet name", "Outlet address")
    )


def aggregate_nt_private(rows: list[dict]) -> list[dict]:
    by_abn: dict[str, dict] = {}
    for raw in rows:
        if (raw.get("Registration status") or "").strip().lower() != "approved":
            continue
        abn = "".join(ch for ch in str(raw.get("ABN") or "") if ch.isdigit())
        if not abn:
            continue
        legal = (raw.get("Legal name") or "").strip()
        business = (raw.get("Provider business name") or "").strip()
        org_type = classify_org_type(legal, business)
        if not org_type:
            continue
        rec = by_abn.get(abn)
        if rec is None:
            rec = {
                "abn": abn,
                "company_name": business or legal,
                "trading_name": business,
                "legal_name": legal,
                "org_type": org_type,
                "head_office": (raw.get("Head office address") or "").strip(),
                "website": (raw.get("Website") or "").strip(),
                "registration_status": "Approved",
                "registered_until": (raw.get("Period of registration in force until") or "").strip(),
                "groups": set(),
                "outlets": [],
                "phones": [],
                "location_text": [],
            }
            by_abn[abn] = rec
        for part in (raw.get("Approved registration groups") or "").split(";"):
            part = part.strip()
            if part:
                rec["groups"].add(part)
        outlet = (raw.get("Outlet name") or "").strip()
        address = (raw.get("Outlet address") or "").strip()
        phone = (raw.get("Outlet phone") or "").strip()
        label = ", ".join(p for p in (outlet, address) if p)
        blob = _outlet_blob(raw)
        rec["location_text"].append(blob)
        if phone and phone not in rec["phones"]:
            rec["phones"].append(phone)
        if label and is_nt_text(blob + " " + label) and label not in rec["outlets"]:
            rec["outlets"].append(label)

    out: list[dict] = []
    for rec in by_abn.values():
        location_blob = " ".join(rec["location_text"] + [rec["head_office"]])
        if not is_nt_operation(location_blob):
            continue
        locations = nt_locations(location_blob)
        groups = "; ".join(sorted(rec["groups"]))
        out.append(
            {
                "company_id": rec["abn"],
                "company_name": rec["company_name"],
                "trading_name": rec["trading_name"] or rec["company_name"],
                "legal_name": rec["legal_name"],
                "abn": rec["abn"],
                "org_type": rec["org_type"],
                "description": UNKNOWN,
                "services": groups or UNKNOWN,
                "locations": ", ".join(locations) or "Other NT",
                "address": rec["outlets"][0] if rec["outlets"] else rec["head_office"] or UNKNOWN,
                "website": rec["website"] or UNKNOWN,
                "phone": rec["phones"][0] if rec["phones"] else UNKNOWN,
                "email": UNKNOWN,
                "linkedin": UNKNOWN,
                "employee_count": UNKNOWN,
                "employee_count_min": "",
                "employee_count_max": "",
                "employee_count_source": UNKNOWN,
                "employee_count_source_url": "",
                "ndis_provider": "yes",
                "ndis_evidence": f"Approved NDIS registration groups: {groups}" if groups else "Approved on NDIS Commission register",
                "nt_operation_verified": "yes",
                "source_urls": COMMISSION_FINDER_URL,
                "last_verified": today_iso(),
                "scrape_status": "register_only",
                "research_confidence": "Medium",
            }
        )
    priority = {"private_company": 0, "sole_trader": 1, "private_other": 2, "nonprofit_ndis": 3}
    out.sort(key=lambda row: (priority.get(row["org_type"], 9), (row["company_name"] or "").lower()))
    return out


def discover_companies(cache_path: Path | None = None, fallback_csv: Path | None = None) -> tuple[list[dict], list[str]]:
    logs = []
    rows: list[dict] = []
    try:
        text = fetch_register_csv(dest=cache_path)
        rows = parse_register_rows(text)
        logs.append(f"[DISCOVERED] NDIS Commission register rows={len(rows)}")
    except Exception as exc:  # noqa: BLE001
        logger.exception("Register download failed")
        logs.append(f"[FAILED] register download: {exc}")
        if fallback_csv and fallback_csv.is_file():
            import csv

            fallback_rows = list(csv.DictReader(fallback_csv.open(encoding="utf-8")))
            companies = []
            for raw in fallback_rows:
                if raw.get("has_nt_presence") != "yes":
                    continue
                org_type = classify_org_type(raw.get("legal_name") or "", raw.get("business_name") or "")
                if not org_type:
                    continue
                companies.append(
                    {
                        "company_id": raw.get("abn"),
                        "company_name": raw.get("business_name") or raw.get("legal_name"),
                        "trading_name": raw.get("business_name") or "",
                        "legal_name": raw.get("legal_name") or "",
                        "abn": raw.get("abn"),
                        "org_type": org_type,
                        "description": UNKNOWN,
                        "services": raw.get("registration_groups") or UNKNOWN,
                        "locations": ", ".join(nt_locations(f"{raw.get('head_office')} {raw.get('nt_outlets')}")) or "Other NT",
                        "address": raw.get("nt_outlets") or raw.get("head_office") or UNKNOWN,
                        "website": raw.get("website") or UNKNOWN,
                        "phone": raw.get("outlet_phone") or UNKNOWN,
                        "email": UNKNOWN,
                        "linkedin": UNKNOWN,
                        "employee_count": UNKNOWN,
                        "employee_count_min": "",
                        "employee_count_max": "",
                        "employee_count_source": UNKNOWN,
                        "employee_count_source_url": "",
                        "ndis_provider": "yes",
                        "ndis_evidence": raw.get("registration_groups") or "NT row in prior NDIS register extract",
                        "nt_operation_verified": "yes",
                        "source_urls": raw.get("source_url") or COMMISSION_FINDER_URL,
                        "last_verified": today_iso(),
                        "scrape_status": "fallback_register",
                        "research_confidence": "Medium",
                    }
                )
            logs.append(f"[DISCOVERED] fallback NT CSV companies={len(companies)}")
            return dedupe_companies(companies), logs
        return [], logs
    companies = aggregate_nt_private(rows)
    logs.append(f"[VERIFIED] NT private/commercial NDIS providers={len(companies)}")
    return dedupe_companies(companies), logs
