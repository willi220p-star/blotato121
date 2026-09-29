"""Generate the ARRCS Darwin teams/roles Excel workbook."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from lib.arrcs_darwin import write_outputs


def main() -> int:
    parser = argparse.ArgumentParser(description="Write ARRCS Darwin teams and positions Excel (roles only)")
    parser.add_argument("--feeds-dir", default=str(ROOT / "feeds"))
    args = parser.parse_args()
    payload = write_outputs(Path(args.feeds_dir))
    print(json.dumps(payload["counts"], indent=2))
    print(f"Wrote {payload['xlsx']}", flush=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
