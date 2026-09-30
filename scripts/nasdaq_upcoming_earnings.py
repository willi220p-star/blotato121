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

from lib.nasdaq_earnings import (
    build_rows,
    fetch_earnings_range,
    fetch_technicals,
    us_market_cap_rows,
    write_csv,
    write_workbook,
)


def main() -> int:
    parser = argparse.ArgumentParser(description="One month of Nasdaq earnings with technical indicators")
    parser.add_argument("--start", type=date.fromisoformat, default=date.today() + timedelta(days=1))
    parser.add_argument("--days", type=int, default=30)
    parser.add_argument("--out", type=Path, default=ROOT / "feeds" / "NASDAQ_upcoming_earnings_technical.xlsx")
    parser.add_argument("--cache", type=Path, default=ROOT / "feeds" / "nasdaq-upcoming-earnings-cache.json")
    parser.add_argument(
        "--us-only",
        action="store_true",
        help="Include only companies identified by TradingView as United States",
    )
    parser.add_argument(
        "--sort-market-cap",
        action="store_true",
        help="Order largest to smallest by TradingView market cap, falling back to Nasdaq market cap",
    )
    args = parser.parse_args()
    end = args.start + timedelta(days=args.days - 1)
    earnings = fetch_earnings_range(args.start, end, cache=args.cache)
    symbols = sorted({str(row.get("symbol") or "").upper() for row in earnings if row.get("symbol")})
    technicals = fetch_technicals(symbols)
    rows = build_rows(earnings, technicals)
    if args.us_only:
        rows = [row for row in rows if row.get("country") == "United States"]
    if args.sort_market_cap:
        rows = us_market_cap_rows(rows) if args.us_only else sorted(
            rows,
            key=lambda row: (
                -(row.get("technical_market_cap") or row.get("nasdaq_market_cap") or 0),
                row.get("symbol") or "",
            ),
        )
    write_workbook(
        args.out,
        rows,
        args.start,
        end,
        scope_description=(
            "United States-domiciled companies on the Nasdaq earnings calendar"
            if args.us_only
            else "All companies on the Nasdaq earnings calendar"
        ),
        order_description=(
            "Market capitalization, largest to smallest"
            if args.sort_market_cap
            else "Earnings date, report time, then market cap"
        ),
    )
    write_csv(args.out.with_suffix(".csv"), rows)
    summary = {
        "start": args.start.isoformat(),
        "end": end.isoformat(),
        "companies": len(rows),
        "us_only": args.us_only,
        "sorted_by_market_cap_desc": args.sort_market_cap,
        "technical_matches": sum(row["data_status"] == "Complete" for row in rows),
        "bullish_bias": sum(row["future_bias_not_forecast"] == "Bullish technical bias" for row in rows),
        "bearish_bias": sum(row["future_bias_not_forecast"] == "Bearish technical bias" for row in rows),
        "workbook": str(args.out),
    }
    print(json.dumps(summary, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
