#!/usr/bin/env python3
"""Add confirmed LinkedIn organisation pages to the NDIS workbook."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.linkedin_enrichment import discover_many, enrich_workbook, nonprofit_organisations


def main() -> int:
    parser = argparse.ArgumentParser(description="Discover non-profit LinkedIn pages from official websites")
    parser.add_argument("source", type=Path)
    parser.add_argument("--out", type=Path, default=ROOT / "feeds" / "NDIS_disability_nonprofit.xlsx")
    parser.add_argument("--checkpoint", type=Path, default=ROOT / "feeds" / "ndis-nonprofit-linkedin-cache.json")
    parser.add_argument("--workers", type=int, default=20)
    parser.add_argument("--timeout", type=int, default=10)
    args = parser.parse_args()

    organisations = nonprofit_organisations(args.source)
    results = discover_many(
        organisations,
        workers=args.workers,
        timeout=args.timeout,
        checkpoint=args.checkpoint,
    )
    summary = enrich_workbook(args.source, args.out, results)
    print(json.dumps(summary, indent=2))
    print(f"Wrote {args.out}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
