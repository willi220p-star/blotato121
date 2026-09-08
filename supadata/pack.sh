#!/usr/bin/env bash
set -euo pipefail
root="$(cd "$(dirname "$0")" && pwd)"
out="${1:-/tmp/supadata-skill.zip}"
rm -f "$out"
# Claude requires SKILL.md at the archive root, not nested under a folder.
(
  cd "$root"
  zip -q "$out" SKILL.md README.md brief.py pack.sh \
    references/tools.md \
    examples/smoke-test.md \
    examples/me-at-the-zoo-transcript.json \
    examples/me-at-the-zoo-video.json
)
echo "Wrote $out"
