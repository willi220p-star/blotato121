#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
  export PATH="$HOME/.local/bin:$PATH"
fi

if [[ ! -d "$ROOT/cognee/.git" ]]; then
  git clone --depth 1 --single-branch https://github.com/topoteretes/cognee.git "$ROOT/cognee"
fi

if [[ ! -d "$ROOT/.venv" ]]; then
  uv venv "$ROOT/.venv"
fi

uv pip install -p "$ROOT/.venv/bin/python" -e "$ROOT/cognee"

if [[ ! -f "$ROOT/.env" ]]; then
  cp "$ROOT/.env.example" "$ROOT/.env"
fi

FRONTEND_CONFIG="$ROOT/cognee/cognee-frontend/next.config.ts"
if [[ -f "$FRONTEND_CONFIG" ]] && ! grep -q "allowedDevOrigins" "$FRONTEND_CONFIG"; then
  python3 - "$FRONTEND_CONFIG" <<'PY'
from pathlib import Path
import sys
path = Path(sys.argv[1])
text = path.read_text()
needle = "const nextConfig: NextConfig = {\n"
insert = (
    needle
    + '  allowedDevOrigins: ["127.0.0.1", "localhost"],\n'
)
if needle in text:
    path.write_text(text.replace(needle, insert, 1))
PY
fi

if command -v npm >/dev/null 2>&1; then
  (cd "$ROOT/cognee/cognee-frontend" && npm ci)
fi

echo "Cognee bootstrap complete. Start the API with scripts/start-api.sh"
