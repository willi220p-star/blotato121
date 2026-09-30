#!/usr/bin/env python3
"""Discover NT private NDIS providers, then enrich websites, people, emails and vacancies."""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.nt_ndis.pipeline import run_research


def main() -> int:
    parser = argparse.ArgumentParser(description="NT private NDIS provider intelligence")
    parser.add_argument("--limit", type=int, help="Enrich only the first N discovered companies (website-bearing first)")
    parser.add_argument("--workers", type=int, default=6, help="Parallel official-website workers")
    parser.add_argument("--no-seek", action="store_true", help="Skip SEEK keyword search")
    parser.add_argument("--reprocess", action="store_true", help="Rebuild exports from cached register and prior enrichment")
    parser.add_argument("--output-dir", type=Path, default=ROOT / "output")
    parser.add_argument("--data-dir", type=Path, default=ROOT / "data" / "nt-ndis")
    parser.add_argument("--reports-dir", type=Path, default=ROOT / "reports")
    parser.add_argument("--feeds-dir", type=Path, default=ROOT / "feeds")
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    if args.reprocess:
        from src.nt_ndis.pipeline import reprocess_existing

        payload = reprocess_existing(
            output_dir=args.output_dir,
            data_dir=args.data_dir,
            reports_dir=args.reports_dir,
            feeds_dir=args.feeds_dir,
        )
    else:
        payload = run_research(
            output_dir=args.output_dir,
            data_dir=args.data_dir,
            reports_dir=args.reports_dir,
            feeds_dir=args.feeds_dir,
            limit=args.limit,
            workers=args.workers,
            seek=not args.no_seek,
        )
    stats = payload["stats"]
    print(
        f"Companies {stats['total_companies_discovered']} · "
        f"verified {stats['total_verified_nt_ndis_providers']} · "
        f"private {stats['private_companies']} · "
        f"employees {stats['total_employees_found']} · "
        f"emails {stats['total_public_work_emails']} · "
        f"vacancies {stats['total_active_vacancies']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
