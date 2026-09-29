"""ICTNT member-directory discovery. Public HTML only."""

from __future__ import annotations

import re
from urllib.parse import urljoin

from lxml import html

from src.darwin_it.http import fetch

ICTNT_LIST = "https://www.ictnt.asn.au/ict-list-view"
ICTNT_GRID = "https://www.ictnt.asn.au/ict-directory"


def parse_ictnt_profiles(content: str, base_url: str = ICTNT_LIST) -> list[dict]:
    try:
        document = html.fromstring(content or "")
    except (TypeError, ValueError):
        return []
    found: list[dict] = []
    for anchor in document.xpath("//a[@href]"):
        href = anchor.get("href") or ""
        if "/ict-directory/" not in href:
            continue
        name = re.sub(r"\s+", " ", " ".join(anchor.itertext())).strip()
        name = re.sub(r"\s*view profile.*$", "", name, flags=re.I).strip()
        location = "Darwin"
        own = f"{name} {href}"
        if re.search(r"alice", own, re.I):
            continue
        if re.search(r"palmerston", own, re.I):
            location = "Palmerston"
        name = re.sub(r"\s+(?:Darwin|Palmerston|NT)\s*$", "", name, flags=re.I).strip()
        if not name or name.lower() in {"view profile", "ict directory"}:
            continue
        found.append(
            {
                "company_name": name,
                "profile_url": urljoin(base_url, href),
                "suburb": location,
                "darwin_location": f"{location}, NT",
                "discovery_sources": ["ICTNT directory"],
                "source": "ICTNT directory",
            }
        )
    unique = {}
    for row in found:
        unique[row["profile_url"]] = row
    return list(unique.values())


def scrape_ictnt() -> tuple[list[dict], dict]:
    page = fetch(ICTNT_LIST)
    if not page["ok"]:
        page = fetch(ICTNT_GRID)
    if not page["ok"]:
        return [], page
    return parse_ictnt_profiles(page["text"], page["url"]), page
