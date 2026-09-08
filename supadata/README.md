# Supadata pack

Cursor skill and helpers for the connected [Supadata](https://supadata.ai) account (YouTube / social transcripts, page scrape, YouTube metadata).

The API is already wired through Composio. Agents should follow [`SKILL.md`](SKILL.md) instead of asking for a key.

## What was verified live

On 2026-09-08 the connected Free plan answered all three core calls:

| Call | Source | Result |
| --- | --- | --- |
| `SUPADATA_GET_ME` | account | Free, 100 credits/month |
| `SUPADATA_GET_TRANSCRIPT` | [Me at the zoo](https://www.youtube.com/watch?v=jNQXAC9IVRw) | 6 English caption chunks |
| `SUPADATA_GET_YOUTUBE_VIDEO` | `jNQXAC9IVRw` | title, channel, duration 19s, views |
| `SUPADATA_GET_WEB_SCRAPE` | https://docs.supadata.ai | markdown + outbound URLs |

Those three paid calls moved usage from 1 → 4 of 100. Raw payloads are in [`examples/`](examples/).

## Local brief helper

Turn a saved transcript (and optional video metadata) into a social-ready brief:

```bash
python3 supadata/brief.py \
  --transcript supadata/examples/me-at-the-zoo-transcript.json \
  --video supadata/examples/me-at-the-zoo-video.json
```

Tests:

```bash
python3 -m unittest discover -s supadata -p 'test_*.py'
```

## Cursor / Claude skill zip

```bash
bash supadata/pack.sh
```

`SKILL.md` is at the archive root (Claude rejects a nested skill path).

## Official MCP (optional)

Composio is enough for Cloud Agents. To add Supadata as its own MCP in Cursor Desktop:

```json
{
  "supadata": {
    "command": "npx",
    "args": ["-y", "@supadata/mcp"],
    "env": {
      "X_API_KEY": "your-api-key"
    }
  }
}
```

Get a key from [dash.supadata.ai](https://dash.supadata.ai/). Do not commit it.

## Credit rules

- Transcript, scrape, YouTube metadata, and search each cost 1 credit.
- `GET_ME` is free.
- `GET_WEB_MAP` plus scraping every URL will burn the monthly quota. Ask first.
