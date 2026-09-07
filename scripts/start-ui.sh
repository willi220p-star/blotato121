#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND="$ROOT/cognee/cognee-frontend"

if [[ ! -d "$FRONTEND/node_modules" ]]; then
  echo "Frontend dependencies missing. Run scripts/bootstrap.sh first." >&2
  exit 1
fi

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$ROOT/.env"
  set +a
fi

export NEXT_PUBLIC_IS_CLOUD_ENVIRONMENT="${NEXT_PUBLIC_IS_CLOUD_ENVIRONMENT:-false}"
export COGNEE_BACKEND_URL="${COGNEE_BACKEND_URL:-http://127.0.0.1:8000}"

cd "$FRONTEND"
exec npm run dev -- --hostname 0.0.0.0 --port 3000
