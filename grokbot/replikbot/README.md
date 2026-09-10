# ReplikBot

Paste `GROKBOT_CREATE_PROMPT.md` into Grok Bot (New → Create new agent, or ask your current Bot to create this teammate). That file is the full create-prompt.

## What it automates

Airtable tag `Generate` → watch the YouTube original → write a 2–3s icebreaker in that voice → RepliQ launch (site background + lower-left face bubble) → ready gate → write `REPLIQ DATABASE` Sheet1.

## Systems already wired in the prompt

- Airtable: [ReplikBot](https://airtable.com/appyGe81SFdPW8Ivz)
- Google Sheet: [REPLIQ DATABASE](https://docs.google.com/spreadsheets/d/1lnmnTMi6pLVSIaFH73YWg8qdTZPCA95S5LspaNVQzPI/edit)
- n8n graphs (import if you still use n8n): `n8n/01-launch.json`, `n8n/02-ready-gate.json`, `n8n/03-sheets-gate.json`

Put YouTube URLs and RepliQ template IDs on Original Videos rows `Original 1` and `Original 2`. Store the RepliQ key as `REPLIQ_API_KEY` via Grok Bot’s secure secret flow — never in the prompt.
