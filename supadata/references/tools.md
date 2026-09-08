# Supadata Composio tools

Verified connected toolkit. Search with `COMPOSIO_SEARCH_TOOLS` before calling; execute with `COMPOSIO_MULTI_EXECUTE_TOOL`.

## Account

### `SUPADATA_GET_ME`

No arguments. Returns `plan`, `maxCredits`, `usedCredits`, `organizationId`.

## Transcripts

### `SUPADATA_GET_TRANSCRIPT`

| Field | Required | Notes |
| --- | --- | --- |
| `url` | yes | YouTube, TikTok, Instagram, X, Facebook, or public file URL |
| `lang` | no | ISO 639-1, e.g. `en` |
| `mode` | no | `native` \| `auto` \| `generate` |
| `text` | no | Request plain text. May still return chunk objects |
| `chunkSize` | no | Only when structured (`text=false`) |

Immediate result: `{ lang, availableLangs, content }` where `content` is a string or `{text, offset, duration, lang}[]`.

Async result: a `jobId` / `job_id`. Poll the next tool.

### `SUPADATA_GET_TRANSCRIPT_BY_JOB_ID`

Required: `job_id`. Statuses: `queued`, `active`, `completed`, `failed`.

## Web

### `SUPADATA_GET_WEB_SCRAPE`

Required: `url`. Optional: `lang`, `no_links`.

Returns `name`, `description`, `content` (markdown), `count_characters`, `url`, `urls`, `og_url`.

### `SUPADATA_GET_WEB_MAP`

Required: `url`. Optional: `lang`. Returns discovered links. Do not scrape the full list on the free plan unless the user asked.

## YouTube

### `SUPADATA_GET_YOUTUBE_VIDEO`

Required: `video_id` (11-character id only).

### `SUPADATA_GET_YOUTUBE_CHANNEL`

Required: `id` (channel id, `@handle`, or URL).

### `SUPADATA_GET_YOUTUBE_CHANNEL_VIDEOS`

Required: `channel_id`. Optional: `type` (`all` \| `video` \| `short` \| `live`), `limit` (default 30).

### `SUPADATA_GET_YOUTUBE_PLAYLIST`

Required: `id` (playlist URL or id).

### `SUPADATA_GET_YOUTUBE_PLAYLIST_VIDEOS`

Required: `playlistId`. Optional: `limit`.

### `SUPADATA_SEARCH_YOUTUBE`

Required: `query`. Optional: `type` (`video` \| `channel` \| `playlist`), `limit` (default 10). One credit per ~20 results.

## Not in Composio (HTTP API only)

These exist in [Supadata docs](https://docs.supadata.ai/llms.txt) but have no Composio slug yet:

- Structured extract (`/extract`)
- Generic social metadata (`/metadata`)
- Site crawl job (`/web/crawl`)
- YouTube transcript batch / translate

Do not invent slugs for them. Tell the user they need the HTTP API or official MCP.
