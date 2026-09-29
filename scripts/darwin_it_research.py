#!/usr/bin/env python3
"""Discover Darwin IT companies, then enrich websites, employees, careers and SEEK."""

from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from src.darwin_it.pipeline import run_research


def main() -> int:
    parser = argparse.ArgumentParser(description="Darwin IT company and vacancy research")
    parser.add_argument("--limit", type=int, help="Enrich only the first N discovered companies")
    parser.add_argument("--data-dir", type=Path, default=ROOT / "data")
    parser.add_argument("--reports-dir", type=Path, default=ROOT / "reports")
    parser.add_argument("--feeds-dir", type=Path, default=ROOT / "feeds")
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    payload = run_research(
        data_dir=args.data_dir,
        reports_dir=args.reports_dir,
        feeds_dir=args.feeds_dir,
        limit=args.limit,
    )
    stats = payload["stats"]
    print(
        f"Companies {stats['total_companies_found']} · "
        f"verified {stats['verified_companies']} · "
        f"employee data {stats['companies_with_employee_data']} · "
        f"vacancies {stats['companies_with_active_vacancies']}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
