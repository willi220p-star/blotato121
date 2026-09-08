---
name: supadata
description: Extract YouTube/TikTok/Instagram/X/Facebook transcripts, scrape pages to markdown, and pull YouTube metadata via the connected Supadata Composio toolkit. Use when the user says "supadata", wants a video transcript, page scrape, sitemap, YouTube search, channel, or playlist data.
---

# Supadata

Supadata is already connected through Composio. Do not ask for an API key and do not configure `@supadata/mcp` unless the user explicitly wants the official MCP instead.

Check credits with `SUPADATA_GET_ME` before a batch. The live account is **Free (100 credits/month)**. One credit per transcript, scrape, search page, or YouTube metadata call. `GET_ME` does not spend a credit.

## Tool map

| Need | Tool | Notes |
| --- | --- | --- |
| Account / remaining credits | `SUPADATA_GET_ME` | No args |
| Video transcript | `SUPADATA_GET_TRANSCRIPT` | `url` required. Platforms: YouTube, TikTok, Instagram, X, Facebook, or a public file URL |
| Long-video job poll | `SUPADATA_GET_TRANSCRIPT_BY_JOB_ID` | Use `job_id` when transcript returns a job instead of content |
| One page to markdown | `SUPADATA_GET_WEB_SCRAPE` | 1 credit. Optional `no_links`, `lang` |
| Discover URLs on a site | `SUPADATA_GET_WEB_MAP` | Can explode credits if you then scrape every URL. Ask first |
| YouTube video details | `SUPADATA_GET_YOUTUBE_VIDEO` | `video_id` only (11 chars), not a full URL |
| YouTube channel | `SUPADATA_GET_YOUTUBE_CHANNEL` | ID, handle, or URL |
| Channel video IDs | `SUPADATA_GET_YOUTUBE_CHANNEL_VIDEOS` | Then fetch metadata per ID (each costs a credit) |
| Playlist | `SUPADATA_GET_YOUTUBE_PLAYLIST` | URL or ID |
| Playlist video IDs | `SUPADATA_GET_YOUTUBE_PLAYLIST_VIDEOS` | |
| YouTube search | `SUPADATA_SEARCH_YOUTUBE` | 1 credit per ~20 results. Keep `limit` small |

Call tools through Composio: `COMPOSIO_SEARCH_TOOLS` then `COMPOSIO_MULTI_EXECUTE_TOOL`. Never invent slugs. If a slug is missing from search, search again with `search_strategy: "tool_search"`.

## Transcript

```json
{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "lang": "en",
  "mode": "auto",
  "text": true
}
```

- `mode`: `native` (captions only), `generate` (AI only), `auto` (captions then AI).
- `text: true` is supposed to return a plain string. In practice the API may still return timestamped `content` chunks. Flatten them with `supadata.brief.chunks_to_text`.
- If the payload has `jobId` / `job_id` and no `content`, poll `SUPADATA_GET_TRANSCRIPT_BY_JOB_ID` until `completed` or `failed`.
- Do not pull a long podcast or a full channel of transcripts on the free plan without saying how many credits it will cost.

## Scrape vs map

- Known URL → `SUPADATA_GET_WEB_SCRAPE`.
- Need a sitemap first → `SUPADATA_GET_WEB_MAP`, then scrape only the pages the user named.
- Never crawl a whole marketing site unprompted.

## YouTube IDs

`SUPADATA_GET_YOUTUBE_VIDEO` wants `jNQXAC9IVRw`, not `https://www.youtube.com/watch?v=jNQXAC9IVRw`. Strip `v=` or the youtu.be path.

## What Supadata is not

- Do not post to social from here. Use Blotato after the brief is written.
- Do not generate video. That is Higgsfield / Runway.
- PDFs, audio files, and Perplexity research stay on Blotato Sources (`blotato_create_source`).
- Extract-structured-data and full-site crawl exist on the HTTP API but are not in the Composio toolkit. Say so instead of inventing a slug.

## Content workflow

1. `GET_ME` if more than two paid calls are likely.
2. Transcript + `GET_YOUTUBE_VIDEO` in one `COMPOSIO_MULTI_EXECUTE_TOOL` batch.
3. Build a brief with `python3 supadata/brief.py --transcript path.json --video path.json`.
4. Hand the brief to Blotato only when the user asks to publish.

## Credit guardrails

- Skip map/search/channel dumps unless the user asked.
- Cap search `limit` at 10 unless they asked for more.
- After a batch, call `GET_ME` and report used/max credits.
