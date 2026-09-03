#!/usr/bin/env bash
# Build a Claude-uploadable zip: SKILL.md at the archive root (not nested).
set -euo pipefail
cd "$(dirname "$0")"
out="${1:-../voice-editor.zip}"
rm -f "$out"
zip -r "$out" SKILL.md README.md pack.sh references -x "*.DS_Store"
echo "Wrote $out"
unzip -l "$out"
