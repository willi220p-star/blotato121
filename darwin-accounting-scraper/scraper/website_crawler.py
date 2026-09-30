"""Controlled official-website crawl. Max pages per domain. Robots respected."""

from __future__ import annotations

import logging
import re
from urllib.parse import urljoin, urlparse

from lxml import html

from config import CRAWL_PATHS
from scraper.contact_extractor import classify_company_emails, contact_page_url, extract_abn, extract_acn, extract_emails, extract_phones
from scraper.http import fetch
from scraper.social_sources import extract_socials
from scraper.validation import extract_postcode, extract_suburb, is_darwin_area, looks_like_website

logger = logging.getLogger("darwin_accounting.crawler")

TEAM_HINTS = ("team", "people", "staff", "leadership", "partners", "about", "who-we-are")


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
    return " ".join(str(text) for text in document.xpath("//body//text()")[:500])


def summarise(content: str) -> str | None:
    document = _safe_html(content)
    if document is None:
        return None
    for xpath in ("//meta[@name='description']/@content", "//meta[@property='og:description']/@content"):
        values = document.xpath(xpath)
        if values and str(values[0]).strip():
            return re.sub(r"\s+", " ", str(values[0])).strip()[:400]
    paragraphs = [re.sub(r"\s+", " ", text).strip() for text in document.xpath("//p//text()") if len(text.strip()) > 40]
    return " ".join(paragraphs[:2])[:400] if paragraphs else None


def candidate_pages(home_url: str, content: str, max_pages: int) -> list[str]:
    parsed = urlparse(home_url)
    origin = f"{parsed.scheme}://{parsed.netloc}"
    ordered = [home_url]
    for path in CRAWL_PATHS:
        url = urljoin(origin, path)
        if url not in ordered:
            ordered.append(url)
    document = _safe_html(content)
    if document is not None:
        for anchor in document.xpath("//a[@href]"):
            href = urljoin(home_url, anchor.get("href") or "")
            target = urlparse(href)
            if target.netloc.lower() != parsed.netloc.lower():
                continue
            blob = f"{target.path} {' '.join(anchor.xpath('.//text()'))}".lower()
            if any(hint in blob for hint in TEAM_HINTS + ("contact", "service")):
                clean = f"{target.scheme}://{target.netloc}{target.path}"
                if clean not in ordered:
                    ordered.append(clean)
    return ordered[: max(1, max_pages)]


def crawl_company(company: dict, max_pages: int = 12) -> tuple[dict, list[dict], list[dict]]:
    """Return (company, pages[{url,text}], sources)."""
    website = company.get("website") or ""
    sources: list[dict] = []
    pages: list[dict] = []
    if not looks_like_website(website):
        company["scrape_status"] = "no official website"
        return company, pages, sources
    if not website.startswith(("http://", "https://")):
        website = "https://" + website
    home = fetch(website)
    sources.append(
        {
            "source_url": website,
            "source_type": "company website",
            "date_accessed": company.get("date_found"),
            "information_found": "official homepage",
            "http_status": home.get("status"),
            "error": home.get("error"),
        }
    )
    if not home.get("ok"):
        company["scrape_status"] = "blocked" if home.get("source_status") == "Blocked" else f"error:{home.get('error')}"
        return company, pages, sources
    home_url = home.get("url") or website
    company["website"] = home_url
    pages.append({"url": home_url, "text": home.get("text") or ""})
    combined = home.get("text") or ""
    for url in candidate_pages(home_url, home.get("text") or "", max_pages)[1:]:
        page = fetch(url)
        sources.append(
            {
                "source_url": url,
                "source_type": "company website",
                "date_accessed": company.get("date_found"),
                "information_found": "official subpage",
                "http_status": page.get("status"),
                "error": page.get("error"),
            }
        )
        if not page.get("ok"):
            continue
        pages.append({"url": page.get("url") or url, "text": page.get("text") or ""})
        combined += "\n" + (page.get("text") or "")
    text = _page_text(combined)
    emails = extract_emails(combined + " " + text, home_url)
    phones = extract_phones(text)
    socials = extract_socials(combined)
    company["description"] = company.get("description") or summarise(home.get("text") or "")
    company.update(classify_company_emails(emails))
    if phones and not company.get("phone"):
        company["phone"] = phones[0]["phone"]
        company["phone_original"] = phones[0]["phone"]
        company["phone_normalized"] = phones[0]["phone_normalized"]
    elif phones and not company.get("phone_normalized"):
        company["phone_normalized"] = phones[0]["phone_normalized"]
    company["abn"] = company.get("abn") or extract_abn(text)
    company["acn"] = company.get("acn") or extract_acn(text)
    company["linkedin_url"] = company.get("linkedin_url") or socials.get("linkedin_company_url")
    company["facebook_url"] = company.get("facebook_url") or socials.get("facebook_company_url")
    company["instagram_url"] = company.get("instagram_url") or socials.get("instagram_company_url")
    company["website_contact_page"] = contact_page_url(home_url, home.get("text") or "")
    if not company.get("address") and is_darwin_area(text):
        match = re.search(r"(?:Level|Unit|Suite|\d+)[^.]{8,90}(?:Darwin|Palmerston|Parap|Winnellie|NT)[^.]{0,30}", text, re.I)
        if match:
            company["address"] = re.sub(r"\s+", " ", match.group(0)).strip()
            company["suburb"] = company.get("suburb") or extract_suburb(company["address"])
            company["postcode"] = company.get("postcode") or extract_postcode(company["address"])
    company["scrape_status"] = "ok"
    if home_url not in (company.get("source_url") or ""):
        company["source_url"] = " | ".join(part for part in (company.get("source_url"), home_url) if part)
    return company, pages, sources
