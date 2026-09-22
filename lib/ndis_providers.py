"""NDIS Provider Finder / Commission register: disability companies and non-profits."""

from __future__ import annotations

import csv
import io
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.worksheet import Worksheet

FEED_NAME = "ndis-disability-nonprofit"
REGISTER_CSV_URL = "https://www.ndiscommission.gov.au/provider-registration/find-registered-provider/download-csv"
FINDER_URL = "https://www.ndis.gov.au/participants/working-providers/finding-providers/provider-finder"
COMMISSION_FINDER_URL = "https://www.ndiscommission.gov.au/provider-registration/find-registered-provider"

COLUMNS = (
    "category",
    "category_reason",
    "business_name",
    "legal_name",
    "abn",
    "head_office",
    "website",
    "registration_status",
    "registered_until",
    "registration_groups",
    "has_nt_presence",
    "has_darwin_presence",
    "nt_outlets",
    "darwin_outlets",
    "outlet_phone",
    "source_url",
)

PTY_RE = re.compile(r"\bPTY\.?\s*(LTD|LIMITED)\b|\bPROPRIETARY\s+LIMITED\b", re.I)
NFP_FORM_RE = re.compile(
    r"\b("
    r"INC(?:ORPORATED)?|"
    r"ASSOCIATION|FOUNDATION|"
    r"ABORIGINAL CORPORATION|TORRES STRAIT ISLANDER CORPORATION|"
    r"CHARITABLE|CHARITY|"
    r"CO-?OPERATIVE|"
    r"LIMITED BY GUARANTEE|"
    r"CHURCH|PARISH|"
    r"BENEVOLENT|HOSPICE|"
    r"COMMUNITY CENTRE"
    r")\b",
    re.I,
)
LTD_RE = re.compile(r"\b(LTD|LIMITED)\b", re.I)
GOV_RE = re.compile(
    r"\b(CITY OF|SHIRE OF|REGIONAL COUNCIL|TERRITORY OF|STATE OF|DEPARTMENT OF|"
    r"LOCAL HEALTH|HOSPITAL AND HEALTH|LOCAL HOSPITAL|HEALTH SERVICE|"
    r"NORTHERN TERRITORY GOVERNMENT|AUSTRALIAN GOVERNMENT)\b",
    re.I,
)
SOLE_TRADER_RE = re.compile(r"^[A-Z][A-Z'’\-]+,\s+[A-Z]", re.I)
PARTNERSHIP_RE = re.compile(r"\b[A-Z]\.[A-Z] [A-Z]|& [A-Z]\.[A-Z]")
COMMERCIAL_LTD_RE = re.compile(
    r"\b(INSURANCE|BANK|SUPERANNUATION|UNDERWRIT|BROKER|ALLIANZ|QBE|SUNCORP|HEALTHIA)\b",
    re.I,
)
CLINIC_BRAND_RE = re.compile(r"\b(PODIATRY|PHYSIOTHERAP|DENTAL|OPTICAL|RADIOL|PHARMACY)\b", re.I)

CORE_DISABILITY_RE = re.compile(
    r"assist-personal activities|assist personal activities|daily tasks/shared living|"
    r"supported independent living|specialised disability accommodation|"
    r"participate community|group/centre activities|development-life skills|"
    r"assist-life stage|support coordination|behaviour support|"
    r"innov community participation|assist access/maintain employ|"
    r"community nursing care|assistance animals|spec support employ|"
    r"early childhood supports|household tasks|assist-travel/transport|"
    r"accommodation/tenancy|assist personal activities high",
    re.I,
)

NT_RE = re.compile(r"\bNT\b|NORTHERN TERRITORY", re.I)
DARWIN_HINTS = (
    "darwin",
    "palmerston",
    "casuarina",
    "coconut grove",
    "nightcliff",
    "parap",
    "stuart park",
    "tiwi",
    "farrar",
    "winnellie",
    "humpty doo",
    "howard springs",
    "leanyer",
    "karama",
    "malak",
    "bakewell",
    "driver",
    "rosebery",
    "yarrawonga",
    "larrakeyah",
    "fannie bay",
    "rapid creek",
    "jingili",
    "millner",
    "alawa",
    "wagaman",
    "moil",
    "anula",
    "woodroffe",
    "gray",
    "maitland",
    "virginia nt",
    "coolalinga",
    "bees creek",
)

HEADER_FILL = PatternFill("solid", fgColor="D9FF4F")
HEADER_FONT = Font(bold=True, color="14160F")
TITLE_FONT = Font(bold=True, size=14, color="14160F")
WRAP = Alignment(wrap_text=True, vertical="top")
THIN = Border(
    left=Side(style="thin", color="C5C9B8"),
    right=Side(style="thin", color="C5C9B8"),
    top=Side(style="thin", color="C5C9B8"),
    bottom=Side(style="thin", color="C5C9B8"),
)


def norm_abn(value: str | None) -> str:
    return re.sub(r"\D", "", value or "")


def is_nt_text(text: str | None) -> bool:
    return bool(NT_RE.search(text or ""))


def is_darwin_text(text: str | None) -> bool:
    blob = (text or "").lower()
    return any(hint in blob for hint in DARWIN_HINTS)


def has_core_disability_groups(groups: str | None) -> bool:
    return bool(CORE_DISABILITY_RE.search(groups or ""))


def classify_provider(legal_name: str, business_name: str, groups: str) -> tuple[str, str] | None:
    """Return (category, reason) or None if the provider is not a target."""
    name = f"{legal_name or ''} {business_name or ''}".strip()
    if not name:
        return None
    if GOV_RE.search(name):
        return None
    if SOLE_TRADER_RE.search(legal_name or "") or PARTNERSHIP_RE.search(legal_name or ""):
        return None
    if NFP_FORM_RE.search(name) and not PTY_RE.search(name):
        return "nonprofit", "Legal form looks like a non-profit (Inc, Association, Foundation, Aboriginal Corporation, etc.)"
    if LTD_RE.search(name) and not PTY_RE.search(name):
        if COMMERCIAL_LTD_RE.search(name) or CLINIC_BRAND_RE.search(name):
            return None
        if has_core_disability_groups(groups):
            return "nonprofit", "Ltd / Limited without Pty and core disability groups — usually limited by guarantee"
        return None
    if PTY_RE.search(name) and has_core_disability_groups(groups):
        return "disability_company", "Pty Ltd / Pty Limited with core disability registration groups"
    return None


def parse_register_rows(text: str) -> list[dict]:
    return list(csv.DictReader(io.StringIO(text)))


def aggregate_providers(rows: list[dict]) -> list[dict]:
    by_abn: dict[str, dict] = {}
    for raw in rows:
        if (raw.get("Registration status") or "").strip().lower() != "approved":
            continue
        abn = norm_abn(raw.get("ABN"))
        if not abn:
            continue
        rec = by_abn.get(abn)
        if rec is None:
            rec = {
                "business_name": (raw.get("Provider business name") or "").strip(),
                "legal_name": (raw.get("Legal name") or "").strip(),
                "abn": abn,
                "head_office": (raw.get("Head office address") or "").strip(),
                "website": (raw.get("Website") or "").strip(),
                "registration_status": "Approved",
                "registered_until": (raw.get("Period of registration in force until") or "").strip(),
                "groups": set(),
                "nt_outlets": [],
                "darwin_outlets": [],
                "phones": [],
            }
            by_abn[abn] = rec
        for part in (raw.get("Approved registration groups") or "").split(";"):
            part = part.strip()
            if part:
                rec["groups"].add(part)
        outlet = (raw.get("Outlet name") or "").strip()
        oaddr = (raw.get("Outlet address") or "").strip()
        phone = (raw.get("Outlet phone") or "").strip()
        label = ", ".join(p for p in (outlet, oaddr) if p)
        loc_blob = " ".join(p for p in (rec["head_office"], oaddr) if p)
        if phone and phone not in rec["phones"]:
            rec["phones"].append(phone)
        if label and is_nt_text(loc_blob + " " + label) and label not in rec["nt_outlets"]:
            rec["nt_outlets"].append(label)
        if label and is_darwin_text(loc_blob + " " + label) and label not in rec["darwin_outlets"]:
            rec["darwin_outlets"].append(label)

    out: list[dict] = []
    for rec in by_abn.values():
        groups = "; ".join(sorted(rec["groups"]))
        classified = classify_provider(rec["legal_name"], rec["business_name"], groups)
        if not classified:
            continue
        category, reason = classified
        hq = rec["head_office"]
        has_nt = bool(rec["nt_outlets"]) or is_nt_text(hq)
        has_darwin = bool(rec["darwin_outlets"]) or is_darwin_text(hq)
        out.append(
            {
                "category": category,
                "category_reason": reason,
                "business_name": rec["business_name"],
                "legal_name": rec["legal_name"],
                "abn": rec["abn"],
                "head_office": hq,
                "website": rec["website"],
                "registration_status": rec["registration_status"],
                "registered_until": rec["registered_until"],
                "registration_groups": groups,
                "has_nt_presence": "yes" if has_nt else "",
                "has_darwin_presence": "yes" if has_darwin else "",
                "nt_outlets": " | ".join(rec["nt_outlets"][:8]),
                "darwin_outlets": " | ".join(rec["darwin_outlets"][:8]),
                "outlet_phone": rec["phones"][0] if rec["phones"] else "",
                "source_url": COMMISSION_FINDER_URL,
            }
        )
    out.sort(key=lambda r: (r["category"], r["has_darwin_presence"] != "yes", r["has_nt_presence"] != "yes", (r["business_name"] or "").lower()))
    return out


def fetch_register_csv(timeout: int = 180, dest: Path | None = None) -> str:
    if dest and dest.is_file() and dest.stat().st_size > 1000:
        return dest.read_text(encoding="utf-8-sig")
    req = Request(
        REGISTER_CSV_URL,
        headers={
            "User-Agent": "Mozilla/5.0 (compatible; DGK-list-enrichment/1.0)",
            "Accept": "text/csv,*/*",
        },
    )
    with urlopen(req, timeout=timeout) as resp:
        data = resp.read().decode("utf-8-sig", "replace")
    if dest:
        dest.write_text(data, encoding="utf-8")
    return data


def _style_header(ws: Worksheet, headers: tuple[str, ...]) -> None:
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:{get_column_letter(len(headers))}1"
    for col, header in enumerate(headers, 1):
        cell = ws.cell(1, col, header)
        cell.fill = HEADER_FILL
        cell.font = HEADER_FONT
        cell.alignment = Alignment(vertical="center")
        cell.border = THIN


def _write_rows(ws: Worksheet, rows: list[dict]) -> None:
    _style_header(ws, COLUMNS)
    for r_idx, row in enumerate(rows, 2):
        for c_idx, key in enumerate(COLUMNS, 1):
            cell = ws.cell(r_idx, c_idx, row.get(key) or "")
            cell.alignment = WRAP
            cell.border = THIN
    widths = {
        "A": 20,
        "B": 36,
        "C": 36,
        "D": 36,
        "E": 14,
        "F": 28,
        "G": 32,
        "H": 14,
        "I": 16,
        "J": 42,
        "K": 12,
        "L": 14,
        "M": 40,
        "N": 40,
        "O": 16,
        "P": 42,
    }
    for col, width in widths.items():
        ws.column_dimensions[col].width = width
    ws.row_dimensions[1].height = 22


def _how_to_use(ws: Worksheet, counts: dict[str, int]) -> None:
    lines = [
        ("NDIS providers — disability companies and non-profits", TITLE_FONT),
        ("", None),
        ("Source: official NDIS Commission provider register CSV (same registered providers the ndis.gov.au Provider Finder searches).", None),
        (f"Finder page: {FINDER_URL}", None),
        (f"Register download: {REGISTER_CSV_URL}", None),
        ("", None),
        ("What is included", None),
        ("Disability company = Pty Ltd / Pty Limited with core disability registration groups (personal care, SIL, SDA, community participation, support coordination, etc.).", None),
        ("Non-profit = Inc / Association / Foundation / Aboriginal Corporation / charity-style names, or Ltd without Pty plus core disability groups (usually limited by guarantee). Insurers and clinic brands are excluded.", None),
        ("Approved registrations only. Sole traders, partnerships, government, and clinic-only Pty Ltds (therapy / plan management / equipment only) are left out.", None),
        ("", None),
        ("Counts", None),
        (f"Disability companies (national): {counts.get('disability_company', 0)}", None),
        (f"Non-profits (national): {counts.get('nonprofit', 0)}", None),
        (f"Disability companies with NT presence: {counts.get('disability_company_nt', 0)}", None),
        (f"Non-profits with NT presence: {counts.get('nonprofit_nt', 0)}", None),
        (f"Disability companies with Darwin / Palmerston presence: {counts.get('disability_company_darwin', 0)}", None),
        (f"Non-profits with Darwin / Palmerston presence: {counts.get('nonprofit_darwin', 0)}", None),
        ("", None),
        ("ACNC charity register was not downloaded (data.gov.au robots Disallow: /). Non-profit is inferred from the legal name on the NDIS register.", None),
        ("LinkedIn is not crawled. ndis.gov.au /search/ is robots-blocked; the finder page itself is allowed.", None),
    ]
    ws.column_dimensions["A"].width = 130
    for idx, (text, font) in enumerate(lines, 1):
        cell = ws.cell(idx, 1, text)
        cell.alignment = WRAP
        if font:
            cell.font = font
        ws.row_dimensions[idx].height = 20 if text else 10


def write_workbook(path: Path, rows: list[dict]) -> dict:
    disability = [r for r in rows if r["category"] == "disability_company"]
    nonprofit = [r for r in rows if r["category"] == "nonprofit"]
    d_nt = [r for r in disability if r["has_nt_presence"] == "yes"]
    n_nt = [r for r in nonprofit if r["has_nt_presence"] == "yes"]
    d_dar = [r for r in disability if r["has_darwin_presence"] == "yes"]
    n_dar = [r for r in nonprofit if r["has_darwin_presence"] == "yes"]
    counts = {
        "disability_company": len(disability),
        "nonprofit": len(nonprofit),
        "disability_company_nt": len(d_nt),
        "nonprofit_nt": len(n_nt),
        "disability_company_darwin": len(d_dar),
        "nonprofit_darwin": len(n_dar),
        "all": len(rows),
    }
    wb = Workbook()
    how = wb.active
    how.title = "How to use"
    _how_to_use(how, counts)
    _write_rows(wb.create_sheet("NT disability companies"), d_nt)
    _write_rows(wb.create_sheet("NT non-profits"), n_nt)
    _write_rows(wb.create_sheet("Darwin disability cos"), d_dar)
    _write_rows(wb.create_sheet("Darwin non-profits"), n_dar)
    _write_rows(wb.create_sheet("National disability cos"), disability)
    _write_rows(wb.create_sheet("National non-profits"), nonprofit)
    path.parent.mkdir(parents=True, exist_ok=True)
    wb.save(path)
    return counts


def rows_to_csv(rows: list[dict]) -> str:
    buf = io.StringIO()
    writer = csv.DictWriter(buf, fieldnames=list(COLUMNS))
    writer.writeheader()
    for row in rows:
        writer.writerow({key: row.get(key) or "" for key in COLUMNS})
    return buf.getvalue()


def feed_payload(rows: list[dict], counts: dict[str, int]) -> dict:
    return {
        "feed": FEED_NAME,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source": {
            "finder": FINDER_URL,
            "register_csv": REGISTER_CSV_URL,
            "commission_finder": COMMISSION_FINDER_URL,
        },
        "policy": {
            "people": "Organisation names only. Sole traders filtered out.",
            "nonprofit": "Inferred from legal name. ACNC bulk register not fetched (data.gov.au robots Disallow: /).",
            "linkedin": "Not crawled.",
        },
        "counts": counts,
        "records": rows,
    }


def feed_markdown(payload: dict) -> str:
    counts = payload.get("counts") or {}
    return (
        f"# {payload.get('feed')}\n\n"
        f"{counts.get('all', 0)} approved NDIS providers kept "
        f"({counts.get('disability_company', 0)} disability companies · {counts.get('nonprofit', 0)} non-profits).\n\n"
        f"NT: {counts.get('disability_company_nt', 0)} companies · {counts.get('nonprofit_nt', 0)} non-profits. "
        f"Darwin/Palmerston: {counts.get('disability_company_darwin', 0)} companies · {counts.get('nonprofit_darwin', 0)} non-profits.\n"
    )


def write_outputs(feeds_dir: Path, rows: list[dict]) -> dict:
    xlsx = feeds_dir / "NDIS_disability_nonprofit.xlsx"
    counts = write_workbook(xlsx, rows)
    payload = feed_payload(rows, counts)
    (feeds_dir / "ndis-disability-nonprofit.json").write_text(json.dumps({**payload, "records": rows[:50]}, indent=2, ensure_ascii=False), encoding="utf-8")
    (feeds_dir / "ndis-disability-nonprofit.md").write_text(feed_markdown(payload), encoding="utf-8")
    nt_rows = [r for r in rows if r["has_nt_presence"] == "yes"]
    (feeds_dir / "ndis-disability-nonprofit.nt.csv").write_text(rows_to_csv(nt_rows), encoding="utf-8")
    payload["xlsx"] = str(xlsx)
    payload["counts"] = counts
    return payload
