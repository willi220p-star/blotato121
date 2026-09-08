# Live smoke test — 2026-09-08

Connected Composio toolkit `supadata`. Plan: Free (100/mo). Credits used during this run: 1 → 4.

## 1. Account

`SUPADATA_GET_ME` returned plan `Free (100/mo)`, `maxCredits` 100. No credit spent.

## 2. Transcript

`SUPADATA_GET_TRANSCRIPT` on https://www.youtube.com/watch?v=jNQXAC9IVRw

Requested `text: true`, `mode: auto`, `lang: en`. Response was still timestamped chunks (6 lines, langs `en` and `de`). Flattened text:

> All right, so here we are, in front of the elephants the cool thing about these guys is that they have really... really really long trunks and that's cool (baaaaaaaaaaahhh!!) and that's pretty much all there is to say

## 3. Video metadata

`SUPADATA_GET_YOUTUBE_VIDEO` with `video_id=jNQXAC9IVRw`

- Title: Me at the zoo
- Channel: jawed
- Duration: 19 seconds
- Uploaded: 2005-04-23

## 4. Web scrape

`SUPADATA_GET_WEB_SCRAPE` on https://docs.supadata.ai

- Name: Getting Started | Supadata
- Characters: 3486
- Confirmed services listed: video transcripts, media metadata, structured extract, web reader, YouTube metadata

Payloads: `me-at-the-zoo-transcript.json`, `me-at-the-zoo-video.json`.
