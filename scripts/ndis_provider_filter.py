"""Download the NDIS Commission register and write disability-company / non-profit Excel."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.ndis_providers import aggregate_providers, fetch_register_csv, parse_register_rows, write_outputs


def main() -> int:
    parser = argparse.ArgumentParser(description="Filter NDIS Provider Finder register into disability companies and non-profits")
    parser.add_argument("--feeds-dir", default=str(ROOT / "feeds"))
    parser.add_argument("--cache", default="/tmp/ndis_register.csv")
    args = parser.parse_args()
    cache = Path(args.cache)
    text = fetch_register_csv(dest=cache)
    rows = aggregate_providers(parse_register_rows(text))
    payload = write_outputs(Path(args.feeds_dir), rows)
    print(json.dumps(payload["counts"], indent=2))
    print(f"Wrote {payload['xlsx']}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
