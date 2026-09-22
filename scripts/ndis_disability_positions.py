#!/usr/bin/env python3
"""Filter NDIS disability roles and discover official website job positions."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.disability_roles import build_role_workbook  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Add disability role people, job openings, and company summaries"
    )
    parser.add_argument("source", type=Path)
    parser.add_argument(
        "--out",
        type=Path,
        default=ROOT / "feeds" / "NDIS_disability_nonprofit_positions.xlsx",
    )
    parser.add_argument(
        "--checkpoint",
        type=Path,
        default=ROOT / "feeds" / "ndis-disability-jobs-cache.json",
    )
    parser.add_argument("--workers", type=int, default=32)
    parser.add_argument("--timeout", type=int, default=7)
    args = parser.parse_args()
    summary = build_role_workbook(
        args.source,
        args.out,
        workers=args.workers,
        timeout=args.timeout,
        checkpoint=args.checkpoint,
    )
    print(json.dumps(summary, indent=2))
    print(f"Wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
