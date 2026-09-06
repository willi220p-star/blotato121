# blotato121

Self-hosted [Cognee](https://github.com/topoteretes/cognee) deployment: AI memory API plus local UI.

Upstream source: https://github.com/topoteretes/cognee.git

## What runs here

| Service | URL | How it starts |
| --- | --- | --- |
| Cognee API | http://127.0.0.1:8000 | `scripts/start-api.sh` |
| Interactive docs | http://127.0.0.1:8000/docs | same process |
| Health | http://127.0.0.1:8000/health | same process |
| Cognee UI | http://127.0.0.1:3000 | `scripts/start-ui.sh` |

This host does not have Docker. The default path clones Cognee, installs it into `.venv`, and runs uvicorn plus the Next.js UI.

## Setup

```bash
./scripts/bootstrap.sh
cp .env.example .env   # already created by bootstrap if missing
# Set LLM_API_KEY in .env to enable remember / cognify / recall
```

## Start

```bash
./scripts/start-api.sh
./scripts/start-ui.sh
```

Smoke-check the API:

```bash
curl -f http://127.0.0.1:8000/health
curl -s http://127.0.0.1:8000/
```

With an `LLM_API_KEY` you can ingest and query:

```bash
printf "Cognee turns data into searchable AI memory." > /tmp/cognee-smoke.txt
curl -X POST http://127.0.0.1:8000/api/v1/remember \
  -F "data=@/tmp/cognee-smoke.txt" \
  -F "datasetName=smoke_test" \
  -F "run_in_background=false"
```

## Docker (optional)

If Docker is available:

```bash
export LLM_API_KEY=sk-...
docker compose up
docker compose --profile ui up
```

## Notes

- `ENABLE_BACKEND_ACCESS_CONTROL=false` is set for a local single-user demo. Turn it on before exposing the API.
- Without `LLM_API_KEY`, the API and UI still start; graph build and LLM-backed recall fail until a provider key is set.
