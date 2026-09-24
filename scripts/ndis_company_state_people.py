#!/usr/bin/env python3
"""Add company state and people-working sheets to the NDIS positions workbook."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.ndis_state import write_state_people_workbook


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Add Australian state and company-people sheets to the NDIS positions workbook"
    )
    parser.add_argument(
        "source",
        type=Path,
        nargs="?",
        default=ROOT / "feeds" / "NDIS_disability_nonprofit_positions.xlsx",
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=ROOT / "feeds" / "NDIS_disability_nonprofit_positions.xlsx",
    )
    args = parser.parse_args()
    summary = write_state_people_workbook(args.source, args.out)
    print(json.dumps(summary, indent=2))
    print(f"Wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
