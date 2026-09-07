#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [[ ! -x "$ROOT/.venv/bin/uvicorn" ]]; then
  echo "Virtualenv missing. Run scripts/bootstrap.sh first." >&2
  exit 1
fi

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

export HTTP_API_HOST="${HTTP_API_HOST:-0.0.0.0}"
export HTTP_API_PORT="${HTTP_API_PORT:-8000}"
export ENABLE_BACKEND_ACCESS_CONTROL="${ENABLE_BACKEND_ACCESS_CONTROL:-false}"
export REQUIRE_AUTHENTICATION="${REQUIRE_AUTHENTICATION:-false}"
export ENV="${ENV:-local}"
export CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS:-*}"
export SYSTEM_ROOT_DIRECTORY="${SYSTEM_ROOT_DIRECTORY:-$ROOT/cognee-data/system}"
export DATA_ROOT_DIRECTORY="${DATA_ROOT_DIRECTORY:-$ROOT/cognee-data/data}"

cd "$ROOT"
exec "$ROOT/.venv/bin/uvicorn" cognee.api.client:app \
  --host "$HTTP_API_HOST" \
  --port "$HTTP_API_PORT"
