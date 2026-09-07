#!/usr/bin/env python3
"""Add publicly listed organisation people to an NDIS workbook."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.website_people import (  # noqa: E402
    discover_many_websites,
    organisations_from_workbook,
    write_enriched_workbook,
)


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Extract public staff from official organisation websites"
    )
    parser.add_argument("source", type=Path)
    parser.add_argument(
        "--out",
        type=Path,
        default=ROOT / "feeds" / "NDIS_disability_nonprofit_people.xlsx",
    )
    parser.add_argument(
        "--checkpoint",
        type=Path,
        default=ROOT / "feeds" / "ndis-public-people-cache.json",
    )
    parser.add_argument("--workers", type=int, default=24)
    parser.add_argument("--timeout", type=int, default=8)
    args = parser.parse_args()

    organisations = organisations_from_workbook(args.source)
    results = discover_many_websites(
        organisations,
        workers=args.workers,
        timeout=args.timeout,
        checkpoint=args.checkpoint,
    )
    summary = write_enriched_workbook(
        args.source,
        args.out,
        organisations,
        results,
    )
    print(json.dumps(summary, indent=2))
    print(f"Wrote {args.out}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
