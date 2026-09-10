# ReplikBot

Paste `GROKBOT_CREATE_PROMPT.md` into Grok Bot (`New` → `Create new agent`). That file is the full create-prompt.

## What it automates

I add a row to Google Sheet **REPLIQ DATABASE** (Website + lead details) → ReplikBot picks the Dilip RepliQ template (site background + lower-left face bubble) → RepliQ generates the icebreaker/hook → the same row gets Video link, Video Html, and Icebreaker.

Face comes from Dilip’s video attached in Grok Bot, not from a voice-reference clip. Voice may be extracted from a separate source video and is never written to the sheet.

## Sheet

[REPLIQ DATABASE](https://docs.google.com/spreadsheets/d/1lnmnTMi6pLVSIaFH73YWg8qdTZPCA95S5LspaNVQzPI/edit) · tab Sheet1

n8n graphs (optional): `n8n/01-launch.json`, `n8n/02-ready-gate.json`, `n8n/03-sheets-gate.json`

Store the RepliQ key as `REPLIQ_API_KEY` via Grok Bot’s secure secret flow — never in the prompt.
