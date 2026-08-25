#!/usr/bin/env python3
"""Smoke-check the pre-sales page files Replit will import."""

from pathlib import Path
import re
import sys

root = Path(__file__).resolve().parents[1]
required = [
    ".replit",
    "index.html",
    "styles.css",
    "app.js",
    "config.js",
    "assets/your-logo.svg",
    "assets/their-logo.svg",
    "assets/headshot.svg",
]
missing = [name for name in required if not (root / name).exists()]
if missing:
    print("missing files:", ", ".join(missing))
    sys.exit(1)

html = (root / "index.html").read_text()
for needle in (
    'id="hero-line"',
    'id="noticed"',
    'id="gap"',
    'id="agenda"',
    'id="proof"',
    'id="who-name"',
    'id="cta"',
    "config.js",
    "app.js",
):
    if needle not in html:
        print(f"index.html missing {needle}")
        sys.exit(1)

if len(re.findall(r'class="cta"', html)) != 1:
    print("expected exactly one CTA button")
    sys.exit(1)

config = (root / "config.js").read_text()
for key in ("yourCompany", "prospectCompany", "noticed", "gap", "agenda", "cases", "ctaUrl"):
    if key not in config:
        print(f"config.js missing {key}")
        sys.exit(1)

print("pre-sales page files ok")
