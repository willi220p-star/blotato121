#!/usr/bin/env python3
"""Scan watchlist companies and write the dgk-signal-source feed."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.signals import build_feed, feed_markdown, load_watchlist


def main() -> int:
    parser = argparse.ArgumentParser(description="Detect hiring/expansion/tech-stack signals for dgk-signal-source")
    parser.add_argument("--watchlist", default=str(ROOT / "feeds" / "watchlist.json"))
    parser.add_argument("--out", default=str(ROOT / "feeds" / "dgk-signal-source.json"))
    parser.add_argument("--md-out", default=str(ROOT / "feeds" / "dgk-signal-source.md"))
    parser.add_argument("--snapshots-dir", default=str(ROOT / "research" / "signal-snapshots"))
    args = parser.parse_args()

    watchlist = load_watchlist(Path(args.watchlist))
    feed = build_feed(watchlist, Path(args.snapshots_dir))
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(feed, indent=2, ensure_ascii=False), encoding="utf-8")
    markdown = feed_markdown(feed)
    if args.md_out:
        Path(args.md_out).write_text(markdown, encoding="utf-8")
    print(markdown)
    print(f"Wrote {out} ({len(feed.get('signals') or [])} signals)", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
