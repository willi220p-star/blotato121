"""Public professional emails only. Never guess Gmail or invent addresses."""

from __future__ import annotations

import re

from src.nt_ndis.config import PERSONAL_EMAIL_DOMAINS, UNKNOWN
from src.nt_ndis.validation import EMAIL_RE, domain_of, email_status

MAILTO_RE = re.compile(r"mailto:([^?\"'\s>]+)", re.I)


def extract_emails(text: str, website: str = "") -> list[dict]:
    found: list[dict] = []
    seen = set()
    site = domain_of(website)
    for raw in list(MAILTO_RE.findall(text or "")) + EMAIL_RE.findall(text or ""):
        email = raw.strip().rstrip(".,;").lower()
        if email in seen or not EMAIL_RE.fullmatch(email):
            continue
        domain = email.split("@", 1)[1]
        if domain in PERSONAL_EMAIL_DOMAINS:
            continue
        seen.add(email)
        status = email_status(email, website, "public")
        found.append(
            {
                "email": email,
                "email_type": "public",
                "email_verified": status == "verified_public",
                "email_status": status,
            }
        )
    found.sort(key=lambda row: (0 if site and row["email"].endswith("@" + site) else 1, row["email"]))
    return found


def attach_published_email(person: dict, emails: list[dict]) -> dict:
    """Attach a work email only when it is published and the local part matches the person."""
    first = re.sub(r"[^a-z]", "", str(person.get("first_name") or "").lower())
    last = re.sub(r"[^a-z]", "", str(person.get("last_name") or "").lower())
    if len(first) < 2 or len(last) < 2:
        return person
    matches = []
    for row in emails:
        local = re.sub(r"[^a-z]", "", row["email"].split("@", 1)[0].lower())
        if first in local and last in local:
            matches.append(row)
    if len(matches) != 1:
        return person
    row = matches[0]
    person["work_email"] = row["email"]
    person["email_type"] = row["email_type"]
    person["email_verified"] = row["email_verified"]
    person["email_status"] = row["email_status"]
    return person


def company_email(emails: list[dict]) -> str:
    if not emails:
        return UNKNOWN
    preferred = ("info", "admin", "enquiries", "contact", "hello", "office", "support")
    by_local = {row["email"].split("@", 1)[0]: row["email"] for row in emails}
    for local in preferred:
        if local in by_local:
            return by_local[local]
    return emails[0]["email"]
