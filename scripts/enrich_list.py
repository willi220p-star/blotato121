#!/usr/bin/env python3
"""Scrape niche directories into a Clay/Apollo/FullEnrich-shaped list."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.enrich import build_enrichment, clay_csv, enrichment_markdown, load_enrichment_config


def main() -> int:
    parser = argparse.ArgumentParser(description="List-building enrichment via Scrapling")
    parser.add_argument("--sources", default=str(ROOT / "feeds" / "enrichment-sources.json"))
    parser.add_argument("--out", default=str(ROOT / "feeds" / "dgk-list-enrichment.json"))
    parser.add_argument("--md-out", default=str(ROOT / "feeds" / "dgk-list-enrichment.md"))
    parser.add_argument("--csv-out", default=str(ROOT / "feeds" / "dgk-list-enrichment.clay.csv"))
    args = parser.parse_args()

    config = load_enrichment_config(Path(args.sources))
    feed = build_enrichment(config)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(feed, indent=2, ensure_ascii=False), encoding="utf-8")
    if args.md_out:
        Path(args.md_out).write_text(enrichment_markdown(feed), encoding="utf-8")
    if args.csv_out:
        Path(args.csv_out).write_text(clay_csv(feed), encoding="utf-8")
    print(enrichment_markdown(feed))
    print(f"Wrote {out} ({feed['counts']['records']} records)", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
