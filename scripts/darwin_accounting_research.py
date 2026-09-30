#!/usr/bin/env python3
"""Run the Darwin accounting research MVP from the repo root."""

from __future__ import annotations

import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
raise SystemExit(runpy.run_path(str(ROOT / "darwin-accounting-scraper" / "main.py"), run_name="__main__"))
