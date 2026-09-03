#!/usr/bin/env python3
"""Generate a one-month upcoming-earnings technical-analysis workbook."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.nasdaq_earnings import build_rows, fetch_earnings_range, fetch_technicals, write_csv, write_workbook


def main() -> int:
    parser = argparse.ArgumentParser(description="One month of Nasdaq earnings with technical indicators")
    parser.add_argument("--start", type=date.fromisoformat, default=date.today() + timedelta(days=1))
    parser.add_argument("--days", type=int, default=30)
    parser.add_argument("--out", type=Path, default=ROOT / "feeds" / "NASDAQ_upcoming_earnings_technical.xlsx")
    parser.add_argument("--cache", type=Path, default=ROOT / "feeds" / "nasdaq-upcoming-earnings-cache.json")
    args = parser.parse_args()
    end = args.start + timedelta(days=args.days - 1)
    earnings = fetch_earnings_range(args.start, end, cache=args.cache)
    symbols = sorted({str(row.get("symbol") or "").upper() for row in earnings if row.get("symbol")})
    technicals = fetch_technicals(symbols)
    rows = build_rows(earnings, technicals)
    write_workbook(args.out, rows, args.start, end)
    write_csv(args.out.with_suffix(".csv"), rows)
    summary = {
        "start": args.start.isoformat(),
        "end": end.isoformat(),
        "companies": len(rows),
        "technical_matches": sum(row["data_status"] == "Complete" for row in rows),
        "bullish_bias": sum(row["future_bias_not_forecast"] == "Bullish technical bias" for row in rows),
        "bearish_bias": sum(row["future_bias_not_forecast"] == "Bearish technical bias" for row in rows),
        "workbook": str(args.out),
    }
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
