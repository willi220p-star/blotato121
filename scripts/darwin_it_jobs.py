#!/usr/bin/env python3
"""Research Darwin IT companies, official-site jobs, and resume emails."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.darwin_it import build_workbook


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Build a Darwin IT company, job and resume-email workbook"
    )
    parser.add_argument(
        "--out",
        type=Path,
        default=ROOT / "feeds" / "Darwin_IT_companies_jobs.xlsx",
    )
    parser.add_argument(
        "--extras",
        type=Path,
        default=ROOT / "feeds" / "darwin-it-extra-companies.json",
    )
    parser.add_argument(
        "--json-out",
        type=Path,
        default=ROOT / "feeds" / "darwin-it-companies-jobs.json",
    )
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--timeout", type=int, default=12)
    parser.add_argument(
        "--ntg-job",
        action="append",
        default=[],
        help="Official jobs.nt.gov.au/Home/JobDetails URL to include",
    )
    parser.add_argument("--skip-directory", action="store_true")
    args = parser.parse_args()
    payload = build_workbook(
        args.out,
        args.extras,
        workers=args.workers,
        timeout=args.timeout,
        ntg_job_urls=args.ntg_job,
        include_directory=not args.skip_directory,
    )
    slim = []
    for row in payload["results"]:
        slim.append(
            {
                "name": row.get("name"),
                "website": row.get("website"),
                "jobs_available": row.get("jobs_available"),
                "best_resume_email": row.get("best_resume_email"),
                "gmail_email": row.get("gmail_email"),
                "research_status": row.get("research_status"),
                "openings": row.get("openings") or [],
            }
        )
    args.json_out.write_text(
        json.dumps({"summary": payload["summary"], "companies": slim}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print(json.dumps(payload["summary"], indent=2))
    print(f"Wrote {args.out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
