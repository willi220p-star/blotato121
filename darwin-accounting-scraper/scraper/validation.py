"""Normalize and validate public Darwin accounting records. Never invent values."""

from __future__ import annotations

import re
from urllib.parse import urlparse

from config import DARWIN_SUBURBS, PERSONAL_EMAIL_DOMAINS, PRIORITY_TITLES

EMAIL_RE = re.compile(r"[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}", re.I)
PHONE_RE = re.compile(
    r"(?<!\d)(?:\+?61[\s-]?)?(?:\(0?[2-8]\)[\s-]?\d{4}[\s-]?\d{4}|0?[2-8][\s-]?\d{4}[\s-]?\d{4}|0?4\d{2}[\s-]?\d{3}[\s-]?\d{3}|1300[\s-]?\d{3}[\s-]?\d{3}|1800[\s-]?\d{3}[\s-]?\d{3})(?!\d)"
)
ABN_RE = re.compile(r"\bABN[:\s]*([0-9]{2}\s?[0-9]{3}\s?[0-9]{3}\s?[0-9]{3})\b", re.I)
ACN_RE = re.compile(r"\bACN[:\s]*([0-9]{3}\s?[0-9]{3}\s?[0-9]{3})\b", re.I)
NT_RE = re.compile(r"\bNT\b|NORTHERN TERRITORY", re.I)
NT_POSTCODE_RE = re.compile(r"\b0[89]\d{2}\b")
QUAL_RE = re.compile(r"\b(FCPA|CPA|FCA|CA|IPA|CTA|TPB)\b")


def domain_of(url: str) -> str:
    host = urlparse(url or "").netloc.lower()
    return host[4:] if host.startswith("www.") else host


def valid_email(value: str) -> bool:
    email = (value or "").strip().lower()
    if not EMAIL_RE.fullmatch(email):
        return False
    return email.split("@", 1)[1] not in PERSONAL_EMAIL_DOMAINS


def normalize_email(value: str) -> str | None:
    email = (value or "").strip().rstrip(".,;").lower()
    return email if valid_email(email) else None


def normalize_phone(value: str) -> tuple[str | None, str | None]:
    raw = re.sub(r"\s+", " ", (value or "").strip())
    if not raw or not PHONE_RE.search(raw):
        return None, None
    digits = re.sub(r"\D", "", raw)
    if digits.startswith("61") and len(digits) >= 10:
        digits = "0" + digits[2:]
    if len(digits) == 10 and digits.startswith("0"):
        return raw, f"+61{digits[1:]}"
    if digits.startswith("1300") or digits.startswith("1800"):
        return raw, digits
    return raw, digits or None


def canonical_name(name: str) -> str:
    value = re.sub(r"[^\w\s&/+-]", " ", (name or "").lower())
    drop = {"pty", "ltd", "limited", "proprietary", "the", "accountants", "accountant", "accounting"}
    return " ".join(part for part in value.split() if part not in drop)


def looks_like_website(value: str) -> bool:
    text = (value or "").strip()
    if not text or " " in text:
        return False
    if not text.startswith(("http://", "https://")):
        text = "https://" + text
    host = domain_of(text)
    return bool(host) and "." in host and not host.isdigit()


def extract_suburb(address: str) -> str | None:
    blob = address or ""
    for suburb in sorted(DARWIN_SUBURBS, key=len, reverse=True):
        if re.search(rf"\b{re.escape(suburb)}\b", blob, re.I):
            return suburb
    return None


def extract_postcode(address: str) -> str | None:
    match = NT_POSTCODE_RE.search(address or "")
    return match.group(0) if match else None


def is_darwin_area(text: str) -> bool:
    blob = text or ""
    if not (NT_RE.search(blob) or NT_POSTCODE_RE.search(blob)):
        return False
    if extract_suburb(blob):
        return True
    return bool(re.search(r"\bdarwin\b|\bpalmerston\b", blob, re.I) or NT_POSTCODE_RE.search(blob))


def split_name(full_name: str) -> tuple[str | None, str | None]:
    parts = [part for part in re.split(r"\s+", (full_name or "").strip()) if part]
    if not parts:
        return None, None
    if len(parts) == 1:
        return parts[0], None
    return parts[0], " ".join(parts[1:])


def seniority_for(title: str) -> str | None:
    value = (title or "").lower()
    if not value:
        return None
    if re.search(r"managing director|founder|owner|principal|partner|director|cfo", value):
        return "leadership"
    if re.search(r"senior|manager|practice", value):
        return "manager"
    if re.search(r"accountant|advisor|adviser|bookkeeper|consultant", value):
        return "professional"
    return "other"


def qualification_from(text: str) -> str | None:
    found = QUAL_RE.findall(text or "")
    return ", ".join(dict.fromkeys(found)) if found else None


def is_priority_title(title: str) -> bool:
    value = (title or "").lower()
    return any(token in value for token in PRIORITY_TITLES)


def confidence_score(*, official_website: bool, source_count: int, has_contact: bool, darwin_ok: bool) -> tuple[int, str]:
    if not darwin_ok:
        return 35, "uncertain"
    if official_website and has_contact:
        return 92, "verified_website"
    if official_website:
        return 85, "verified_website"
    if source_count >= 2:
        return 78, "multi_source"
    if has_contact:
        return 62, "directory"
    return 52, "directory"
