#!/usr/bin/env bash
set -euo pipefail

export PATH="${HOME}/.local/bin:${PATH}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="${ROOT}/cloned/scrapling"

mkdir -p "${ROOT}/cloned"

if [[ ! -d "${DEST}/.git" ]]; then
  git clone --depth 1 --single-branch https://github.com/D4Vinci/Scrapling.git "${DEST}"
fi

python3 -m pip install --user -e "${DEST}[fetchers]"
python3 -m pip install --user pypdf
scrapling install
python3 - <<'PY'
import scrapling
from scrapling.parser import Selector
print(f"scrapling {scrapling.__version__}")
print("parser", Selector("<h1>ok</h1>").css("h1::text").get())
PY
