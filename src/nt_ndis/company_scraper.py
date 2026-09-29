"""Official-website enrichment: description, phone, email, LinkedIn, employee count."""

from __future__ import annotations

import re

from lxml import html

from src.darwin_it.employees.extract import extract_employee_count
from src.darwin_it.http import fetch
from src.nt_ndis.config import UNKNOWN, today_iso
from src.nt_ndis.email_finder import company_email, extract_emails
from src.nt_ndis.linkedin_research import company_linkedin_from_html
from src.nt_ndis.validation import PHONE_RE, looks_like_website


def _safe_html(content: str):
    if not (content or "").strip():
        return None
    try:
        return html.fromstring(content)
    except Exception:  # noqa: BLE001
        return None


def _page_text(content: str) -> str:
    document = _safe_html(content)
    if document is None:
        return content or ""
    return " ".join(str(text) for text in document.xpath("//body//text()")[:400])


def summarise_description(content: str, company_name: str) -> str:
    document = _safe_html(content)
    if document is None:
        return UNKNOWN
    for xpath in ("//meta[@name='description']/@content", "//meta[@property='og:description']/@content"):
        values = document.xpath(xpath)
        if values and str(values[0]).strip():
            return re.sub(r"\s+", " ", str(values[0])).strip()[:400]
    paragraphs = [re.sub(r"\s+", " ", text).strip() for text in document.xpath("//p//text()") if len(text.strip()) > 40]
    if paragraphs:
        return " ".join(paragraphs[:2])[:400]
    return UNKNOWN


def extract_phone(text: str, fallback: str = "") -> str:
    match = PHONE_RE.search(text or "")
    if match:
        return re.sub(r"\s+", " ", match.group(0)).strip()
    return fallback or UNKNOWN


def enrich_company_site(company: dict) -> tuple[dict, dict]:
    """Return (updated company, page payload {url,text,status})."""
    website = company.get("website") or ""
    page = {"ok": False, "text": "", "url": website, "source_status": "Unknown"}
    if not looks_like_website(website):
        company["website"] = UNKNOWN
        company["scrape_status"] = "no official website"
        return company, page
    if not website.startswith(("http://", "https://")):
        website = "https://" + website
    page = fetch(website)
    company["last_verified"] = today_iso()
    if not page.get("ok"):
        company["scrape_status"] = "blocked" if page.get("source_status") == "Blocked" else f"error:{page.get('error') or page.get('source_status')}"
        return company, page
    content = page.get("text") or ""
    text = _page_text(content)
    company["website"] = page.get("url") or website
    company["description"] = summarise_description(content, company.get("company_name") or "This provider")
    company["phone"] = extract_phone(text, company.get("phone") or "")
    emails = extract_emails(content + " " + text, company["website"])
    company["email"] = company_email(emails)
    company["linkedin"] = company_linkedin_from_html(content, company["website"])
    employees = extract_employee_count(text, company["website"], "Company website")
    if employees.get("employee_count") not in {None, "", "Unknown"}:
        company.update(employees)
    company["scrape_status"] = "ok"
    if company.get("research_confidence") != "High":
        company["research_confidence"] = "High" if company["email"] != UNKNOWN or company["linkedin"] != UNKNOWN else "Medium"
    sources = company.get("source_urls") or ""
    final = page.get("url") or website
    if final not in sources:
        company["source_urls"] = f"{sources} | {final}".strip(" |")
    return company, page
