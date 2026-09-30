"""Load curated Darwin IT discovery seeds gathered from public directories and search."""

from __future__ import annotations

import json
from pathlib import Path

SEED_PATH = Path(__file__).with_name("seed_companies.json")


def load_seed_companies(path: Path | None = None) -> list[dict]:
    target = path or SEED_PATH
    payload = json.loads(target.read_text(encoding="utf-8"))
    companies = payload.get("companies") if isinstance(payload, dict) else payload
    rows = []
    for item in companies or []:
        row = dict(item)
        row.setdefault("company_name", item.get("name"))
        row.setdefault("company_website", item.get("website"))
        rows.append(row)
    return rows
