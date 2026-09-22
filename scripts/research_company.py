#!/usr/bin/env python3
"""Research a company website: team/about, pricing, blog, tech-stack signals."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.company_research import research_company, to_markdown


def main() -> int:
    parser = argparse.ArgumentParser(description="Prospect/company research via Scrapling")
    parser.add_argument("url", help="Company website, e.g. https://dgkbusinessconsultancy.com")
    parser.add_argument("--max-pages", type=int, default=18)
    parser.add_argument("--json-out")
    parser.add_argument("--md-out")
    args = parser.parse_args()
    report = research_company(args.url, max_pages=args.max_pages)
    markdown = to_markdown(report)
    if args.json_out:
        Path(args.json_out).write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    if args.md_out:
        Path(args.md_out).write_text(markdown, encoding="utf-8")
    print(markdown)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
