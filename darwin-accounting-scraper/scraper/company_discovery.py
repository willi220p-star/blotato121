"""Discover Darwin accounting firms from public directories. No invented companies."""

from __future__ import annotations

import logging
import re
from urllib.parse import urljoin

from lxml import html

from config import BEST_ACCOUNTANTS_URL, PINK_PAGES_URLS, SEARCH_QUERIES, today_iso
from scraper.http import fetch
from scraper.validation import extract_postcode, extract_suburb, is_darwin_area, looks_like_website, normalize_phone

logger = logging.getLogger("darwin_accounting.discovery")

PHONE_IN_TEXT = re.compile(r"\(0[2-8]\)\s?\d{4}\s?\d{4}|0[2-8]\s?\d{4}\s?\d{4}|04\d{2}\s?\d{3}\s?\d{3}|1300\s?\d{3}\s?\d{3}")


def _blank_company() -> dict:
    return {
        "company_name": None,
        "trading_name": None,
        "legal_name": None,
        "abn": None,
        "acn": None,
        "description": None,
        "website": None,
        "industry": "Accounting",
        "services": None,
        "address": None,
        "suburb": None,
        "state": "NT",
        "postcode": None,
        "country": "Australia",
        "phone": None,
        "phone_original": None,
        "phone_normalized": None,
        "email": None,
        "general_email": None,
        "accounts_email": None,
        "info_email": None,
        "contact_email": None,
        "website_contact_page": None,
        "linkedin_url": None,
        "facebook_url": None,
        "instagram_url": None,
        "source_url": None,
        "source_type": None,
        "date_found": today_iso(),
        "scrape_status": "discovered",
    }


def parse_best_accountants(content: str, page_url: str) -> list[dict]:
    if not (content or "").strip():
        return []
    try:
        document = html.fromstring(content)
    except Exception:  # noqa: BLE001
        return []
    rows = []
    for heading in document.xpath("//h3"):
        name = " ".join(heading.xpath(".//text()")).strip()
        if not name or len(name) < 3:
            continue
        card = None
        parent = heading
        for _ in range(8):
            if parent is None:
                break
            hrefs = parent.xpath(".//a[@href]/@href")
            external = [
                href
                for href in hrefs
                if looks_like_website(href) and "bestaccountants" not in href and "tpb.gov.au" not in href
            ]
            tels = [href for href in hrefs if str(href).startswith("tel:")]
            if (external or tels) and len(external) <= 2:
                card = parent
                break
            parent = parent.getparent()
        if card is None:
            sibling = heading.getnext()
            card = sibling if sibling is not None else heading.getparent()
        if card is None:
            continue
        texts = card.xpath(".//text()")
        text = re.sub(r"\s+", " ", " ".join(texts))
        if not is_darwin_area(text + " Darwin NT"):
            if not re.search(r"darwin|palmerston|woolner|fannie bay|winnellie|stuart park|yarrawonga", text, re.I):
                continue
        website = None
        hrefs = card.xpath(".//a[@href]/@href")
        for href in hrefs:
            if looks_like_website(href) and "bestaccountants" not in href and "tpb.gov.au" not in href:
                website = href
                break
        tel = next((href.split(":", 1)[1] for href in hrefs if str(href).startswith("tel:")), "")
        phone_match = PHONE_IN_TEXT.search(tel) or PHONE_IN_TEXT.search(text)
        original, normalized = normalize_phone(phone_match.group(0) if phone_match else tel)
        services = None
        special = re.search(r"Specialises in:\s*([^.]+)", text, re.I)
        if special:
            services = special.group(1).strip()
        desc = None
        sentences = [part.strip() for part in re.split(r"(?<=[.!?])\s+", text) if name.split()[0] in part]
        if sentences:
            desc = sentences[0][:400]
        row = _blank_company()
        row.update(
            {
                "company_name": name,
                "trading_name": name,
                "description": desc,
                "website": website,
                "services": services,
                "address": None,
                "suburb": extract_suburb(text),
                "phone": original,
                "phone_original": original,
                "phone_normalized": normalized,
                "source_url": page_url,
                "source_type": "industry directory",
                "scrape_status": "directory",
            }
        )
        note = re.search(r"(Level [^.]{8,120}|Unit [^.]{8,120}|\d+[^.]{8,80}NT 0\d{3})", text)
        if note:
            row["address"] = note.group(1).strip()
            row["postcode"] = extract_postcode(row["address"] or "")
            row["suburb"] = extract_suburb(row["address"] or text) or row["suburb"]
        rows.append(row)
    return rows


def parse_pink_pages(content: str, page_url: str) -> list[dict]:
    if not (content or "").strip():
        return []
    try:
        document = html.fromstring(content)
    except Exception:  # noqa: BLE001
        return []
    rows = []
    seen = set()
    for anchor in document.xpath("//a[contains(@href,'/businesses/')]"):
        href = urljoin(page_url, anchor.get("href") or "")
        if href in seen:
            continue
        name = " ".join(text.strip() for text in anchor.xpath(".//text()") if text.strip())
        if not name or name.lower() in {"review this business"}:
            continue
        seen.add(href)
        parent = anchor
        address_bits: list[str] = []
        blob = ""
        for _ in range(8):
            if parent is None:
                break
            address_bits = [text.strip() for text in parent.xpath('.//*[contains(@class,"listing_address")]//text()') if text.strip()]
            blob = " ".join(text.strip() for text in parent.xpath(".//text()") if text.strip())
            if address_bits:
                break
            parent = parent.getparent()
        address = re.sub(r"\s+", " ", " ".join(address_bits))
        address = re.sub(r"0[2-8]\s?[\d.]+\s*Click to show.*$", "", address, flags=re.I).strip(" ,")
        phone_match = PHONE_IN_TEXT.search(blob)
        original, normalized = normalize_phone(phone_match.group(0) if phone_match else "")
        if not is_darwin_area(address + " " + blob):
            continue
        row = _blank_company()
        row.update(
            {
                "company_name": name,
                "trading_name": name,
                "address": address or None,
                "suburb": extract_suburb(address or blob),
                "postcode": extract_postcode(address or blob),
                "phone": original,
                "phone_original": original,
                "phone_normalized": normalized,
                "source_url": href,
                "source_type": "business directory",
                "scrape_status": "directory",
            }
        )
        rows.append(row)
    return rows


def discover_companies(max_companies: int = 80) -> tuple[list[dict], list[dict], list[str]]:
    companies: list[dict] = []
    sources: list[dict] = []
    logs = [f"Generated public search queries: {len(SEARCH_QUERIES)} (directories used; search engines not scraped)"]
    page = fetch(BEST_ACCOUNTANTS_URL)
    sources.append(
        {
            "source_url": BEST_ACCOUNTANTS_URL,
            "source_type": "industry directory",
            "date_accessed": today_iso(),
            "information_found": "Best Accountants Australia Darwin ranking",
            "http_status": page.get("status"),
            "error": page.get("error"),
        }
    )
    if page.get("ok"):
        found = parse_best_accountants(page.get("text") or "", page.get("url") or BEST_ACCOUNTANTS_URL)
        companies.extend(found)
        logs.append(f"Best Accountants Darwin listings: {len(found)}")
    else:
        logs.append(f"Best Accountants blocked/error: {page.get('error')}")
    for list_url in PINK_PAGES_URLS:
        page = fetch(list_url)
        sources.append(
            {
                "source_url": list_url,
                "source_type": "business directory",
                "date_accessed": today_iso(),
                "information_found": "Pink Pages Darwin-region accountants",
                "http_status": page.get("status"),
                "error": page.get("error"),
            }
        )
        if not page.get("ok"):
            logs.append(f"Pink Pages error {list_url}: {page.get('error')}")
            continue
        found = parse_pink_pages(page.get("text") or "", page.get("url") or list_url)
        companies.extend(found)
        logs.append(f"Pink Pages {list_url}: {len(found)}")
    if max_companies:
        companies = companies[:max_companies]
    return companies, sources, logs
