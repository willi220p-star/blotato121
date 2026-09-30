"""Email, URL and location validation. Never invent values."""

from __future__ import annotations

import re
from urllib.parse import urlparse

from src.nt_ndis.config import LOCATION_HINTS, PERSONAL_EMAIL_DOMAINS, UNKNOWN

EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
PHONE_RE = re.compile(
    r"(?<!\d)(?:\+?61[\s-]?)?(?:0?[2-8][\s-]?\d{4}[\s-]?\d{4}|0?4\d{2}[\s-]?\d{3}[\s-]?\d{3}|1300[\s-]?\d{3}[\s-]?\d{3}|1800[\s-]?\d{3}[\s-]?\d{3})(?!\d)"
)
GOV_RE = re.compile(
    r"\b(CITY OF|SHIRE OF|REGIONAL COUNCIL|TERRITORY OF|STATE OF|DEPARTMENT OF|"
    r"LOCAL HEALTH|HOSPITAL AND HEALTH|LOCAL HOSPITAL|HEALTH SERVICE|"
    r"NORTHERN TERRITORY GOVERNMENT|AUSTRALIAN GOVERNMENT|ROYAL DARWIN HOSPITAL|"
    r"NT HEALTH|QUEENSLAND HEALTH)\b",
    re.I,
)
PTY_RE = re.compile(r"\bPTY\.?\s*(LTD|LIMITED)\b|\bPROPRIETARY\s+LIMITED\b", re.I)
NFP_RE = re.compile(
    r"\b(INC(?:ORPORATED)?|ASSOCIATION|FOUNDATION|ABORIGINAL CORPORATION|"
    r"TORRES STRAIT ISLANDER CORPORATION|CHARITABLE|CHARITY|CO-?OPERATIVE|"
    r"LIMITED BY GUARANTEE|CHURCH|PARISH|BENEVOLENT)\b",
    re.I,
)
SOLE_TRADER_RE = re.compile(r"^[A-Z][A-Z'’\-]+,\s+[A-Z]", re.I)
NT_RE = re.compile(r"\bNT\b|NORTHERN TERRITORY", re.I)
NT_POSTCODE_RE = re.compile(r"\b0[89]\d{2}\b")
AMBIGUOUS_SUBURBS = {
    "palmerston",
    "yarrawonga",
    "durack",
    "gray",
    "driver",
    "gunn",
    "rosebery",
    "bakewell",
    "farrar",
    "woodroffe",
}


def domain_of(url: str) -> str:
    host = urlparse(url or "").netloc.lower()
    if host.startswith("www."):
        host = host[4:]
    return host


def valid_email_syntax(value: str) -> bool:
    return bool(EMAIL_RE.fullmatch((value or "").strip()))


def email_status(email: str, website: str = "", email_type: str = "public") -> str:
    if not email or email == UNKNOWN:
        return "unavailable"
    if not valid_email_syntax(email):
        return "invalid"
    domain = email.split("@", 1)[1].lower()
    if domain in PERSONAL_EMAIL_DOMAINS:
        return "invalid"
    if email_type == "inferred":
        return "inferred"
    site = domain_of(website)
    if site and (domain == site or domain.endswith("." + site) or site.endswith(domain)):
        return "verified_public"
    return "public_unverified"


def classify_org_type(legal_name: str, business_name: str = "") -> str | None:
    name = f"{legal_name or ''} {business_name or ''}".strip()
    if not name or GOV_RE.search(name):
        return None
    if PTY_RE.search(name):
        return "private_company"
    if SOLE_TRADER_RE.search(legal_name or ""):
        return "sole_trader"
    if NFP_RE.search(name):
        return "nonprofit_ndis"
    if re.search(r"\b(LTD|LIMITED)\b", name, re.I):
        return "nonprofit_ndis"
    return "private_other"


def _nt_chunks(text: str) -> list[str]:
    chunks = []
    for part in re.split(r"[|;]+", text or ""):
        part = part.strip()
        if part and (NT_RE.search(part) or NT_POSTCODE_RE.search(part)):
            chunks.append(part)
    return chunks


def nt_locations(text: str) -> list[str]:
    chunks = _nt_chunks(text)
    if not chunks:
        return []
    blob = " ".join(chunks)
    found = []
    for label, hints in LOCATION_HINTS.items():
        for hint in hints:
            pattern = rf"\b{re.escape(hint)}\b"
            if not re.search(pattern, blob, re.I):
                continue
            found.append(label)
            break
    if not found:
        found.append("Other NT")
    return found


def is_nt_operation(text: str) -> bool:
    return bool(NT_RE.search(text or "") or NT_POSTCODE_RE.search(text or ""))


def looks_like_website(value: str) -> bool:
    text = (value or "").strip()
    if not text or " " in text or text.lower() in {"not publicly available", "unknown"}:
        return False
    if not re.search(r"\.[A-Za-z]{2,}", text):
        return False
    host = domain_of(text if text.startswith(("http://", "https://")) else "https://" + text)
    return bool(host) and not host.isdigit() and "." in host


def split_name(full_name: str) -> tuple[str, str]:
    parts = [part for part in re.split(r"\s+", (full_name or "").strip()) if part]
    if not parts:
        return "", ""
    if len(parts) == 1:
        return parts[0], ""
    return parts[0], " ".join(parts[1:])


def department_for(title: str) -> str:
    value = (title or "").lower()
    mapping = (
        ("Leadership", r"ceo|founder|director|managing"),
        ("Operations", r"operations|general manager|service delivery"),
        ("Support Coordination", r"support coordinat|specialist support"),
        ("Clinical", r"clinical|allied|therap|practice manager|behaviour"),
        ("SIL / SDA", r"\bsil\b|\bsda\b|supported independent|accommodation"),
        ("Intake", r"intake|participant|client services"),
        ("Business Development", r"business development|partnership|engagement"),
        ("People", r"hr |human resources|people"),
    )
    for label, pattern in mapping:
        if re.search(pattern, value):
            return label
    return "Service delivery" if value else UNKNOWN
