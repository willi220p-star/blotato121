"""Shared Scrapling helpers for the local scrape API and CLI."""

from __future__ import annotations

import json
from urllib.parse import urlparse

ALLOWED_FETCHERS = ("http", "stealthy", "dynamic")


def validate_url(url: str) -> str:
    if not isinstance(url, str) or not url.strip():
        raise ValueError("url is required")
    parsed = urlparse(url.strip())
    if parsed.scheme not in {"http", "https"} or not parsed.netloc:
        raise ValueError("Only http(s) URLs can be scraped")
    return url.strip()


def fetch_page(url: str, fetcher: str = "http", timeout: int = 30):
    fetcher = (fetcher or "http").lower()
    if fetcher not in ALLOWED_FETCHERS:
        raise ValueError(f"fetcher must be one of: {', '.join(ALLOWED_FETCHERS)}")
    url = validate_url(url)
    if fetcher == "http":
        from scrapling.fetchers import Fetcher

        return Fetcher.get(url, timeout=timeout)
    if fetcher == "stealthy":
        from scrapling.fetchers import StealthyFetcher

        return StealthyFetcher.fetch(url, headless=True, network_idle=True, timeout=timeout * 1000)
    from scrapling.fetchers import DynamicFetcher

    return DynamicFetcher.fetch(url, headless=True, network_idle=True, timeout=timeout * 1000)


def extract(page, css: str | None = None, xpath: str | None = None) -> dict:
    matches: list[str] = []
    if css:
        matches = [str(item) for item in page.css(css).getall()]
    elif xpath:
        matches = [str(item) for item in page.xpath(xpath).getall()]
    title = page.css("title::text").get()
    heading = page.css("h1::text").get()
    return {
        "status": getattr(page, "status", None),
        "url": getattr(page, "url", None),
        "title": str(title) if title else None,
        "heading": str(heading) if heading else None,
        "matches": matches,
        "text_preview": str(page.get_all_text(strip=True)[:2000]) if hasattr(page, "get_all_text") else None,
    }


def scrape(url: str, fetcher: str = "http", css: str | None = None, xpath: str | None = None, timeout: int = 30) -> dict:
    page = fetch_page(url, fetcher=fetcher, timeout=timeout)
    payload = extract(page, css=css, xpath=xpath)
    payload["fetcher"] = fetcher
    return payload


def dumps(payload: dict) -> str:
    return json.dumps(payload, indent=2, ensure_ascii=False)
