"""LinkedIn company URLs from official websites only. LinkedIn is never fetched."""

from __future__ import annotations

from lib.linkedin_enrichment import extract_linkedin_urls, normalise_linkedin_url
from src.nt_ndis.config import UNKNOWN


def company_linkedin_from_html(content: str, website: str = "") -> str:
    if website and "linkedin.com" in website.lower():
        return normalise_linkedin_url(website) or UNKNOWN
    urls = extract_linkedin_urls(content or "")
    return urls[0] if urls else UNKNOWN
