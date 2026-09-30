"""Extract public business emails, phones, ABN and addresses. No guessing."""

from __future__ import annotations

import re
from urllib.parse import urlparse

from scraper.validation import ABN_RE, ACN_RE, EMAIL_RE, PHONE_RE, domain_of, normalize_email, normalize_phone

MAILTO_RE = re.compile(r"mailto:([^?\"'\s>]+)", re.I)
GENERAL_LOCALS = {"info", "admin", "contact", "hello", "office", "reception", "enquiries", "enquiry"}
ACCOUNTS_LOCALS = {"accounts", "billing", "payables", "receivables"}


def extract_emails(text: str, website: str = "") -> list[dict]:
    found: list[dict] = []
    seen = set()
    site = domain_of(website)
    for raw in MAILTO_RE.findall(text or "") + EMAIL_RE.findall(text or ""):
        email = normalize_email(raw)
        if not email or email in seen:
            continue
        seen.add(email)
        local = email.split("@", 1)[0]
        if local in GENERAL_LOCALS:
            email_type = "general"
        elif local in ACCOUNTS_LOCALS:
            email_type = "department"
        elif site and email.endswith("@" + site) and "." in local:
            email_type = "unknown"
        else:
            email_type = "company"
        found.append({"email": email, "email_type": email_type})
    return found


def classify_company_emails(emails: list[dict]) -> dict:
    out = {"general_email": None, "accounts_email": None, "info_email": None, "contact_email": None, "email": None}
    for row in emails:
        local = row["email"].split("@", 1)[0]
        if local == "info" and not out["info_email"]:
            out["info_email"] = row["email"]
        if local in {"contact", "hello", "enquiries", "enquiry"} and not out["contact_email"]:
            out["contact_email"] = row["email"]
        if local in ACCOUNTS_LOCALS and not out["accounts_email"]:
            out["accounts_email"] = row["email"]
        if row["email_type"] == "general" and not out["general_email"]:
            out["general_email"] = row["email"]
    out["email"] = out["info_email"] or out["general_email"] or out["contact_email"] or out["accounts_email"]
    if not out["email"] and emails:
        out["email"] = emails[0]["email"]
    return out


def extract_phones(text: str) -> list[dict]:
    found = []
    seen = set()
    for match in PHONE_RE.finditer(text or ""):
        original, normalized = normalize_phone(match.group(0))
        if not original or original in seen:
            continue
        seen.add(original)
        digits = re.sub(r"\D", "", normalized or original)
        phone_type = "mobile_business" if digits.startswith("614") or original.strip().startswith("04") else "main_business"
        found.append({"phone": original, "phone_normalized": normalized, "phone_type": phone_type})
    return found


def extract_abn(text: str) -> str | None:
    match = ABN_RE.search(text or "")
    return re.sub(r"\s+", "", match.group(1)) if match else None


def extract_acn(text: str) -> str | None:
    match = ACN_RE.search(text or "")
    return re.sub(r"\s+", "", match.group(1)) if match else None


def attach_published_email(person: dict, emails: list[dict]) -> dict:
    first = re.sub(r"[^a-z]", "", str(person.get("first_name") or "").lower())
    last = re.sub(r"[^a-z]", "", str(person.get("last_name") or "").lower())
    if len(first) < 2 or len(last) < 2:
        return person
    matches = [row for row in emails if first in re.sub(r"[^a-z]", "", row["email"].split("@", 1)[0]) and last in re.sub(r"[^a-z]", "", row["email"].split("@", 1)[0])]
    if len(matches) != 1:
        return person
    person["public_work_email"] = matches[0]["email"]
    person["email_type"] = "individual_public"
    person["email_source_url"] = person.get("source_url")
    return person


def contact_page_url(website: str, html_text: str) -> str | None:
    if not website:
        return None
    host = urlparse(website if website.startswith("http") else "https://" + website)
    base = f"{host.scheme}://{host.netloc}"
    for href in re.findall(r'href=["\']([^"\']+)["\']', html_text or "", flags=re.I):
        if re.search(r"contact", href, re.I):
            if href.startswith("http"):
                return href
            return base + (href if href.startswith("/") else "/" + href)
    return None
