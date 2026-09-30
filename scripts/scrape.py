#!/usr/bin/env python3
"""Scrape a URL with the deployed Scrapling install."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.scrape import dumps, scrape


def main() -> int:
    parser = argparse.ArgumentParser(description="Scrape a page with Scrapling")
    parser.add_argument("url")
    parser.add_argument("--fetcher", choices=("http", "stealthy", "dynamic"), default="http")
    parser.add_argument("--css")
    parser.add_argument("--xpath")
    parser.add_argument("--timeout", type=int, default=30)
    args = parser.parse_args()
    print(dumps(scrape(args.url, fetcher=args.fetcher, css=args.css, xpath=args.xpath, timeout=args.timeout)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
