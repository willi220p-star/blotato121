# ReplikBot

Paste `GROKBOT_CREATE_PROMPT.md` into the **already created** ReplikBot chat. That file updates this Bot. Do not create a new agent.

Do **not** keep a 10-minute routine. The bot only runs when you message it.

## What changed

You no longer create the job by editing [REPLIQ DATABASE](https://docs.google.com/spreadsheets/d/1lnmnTMi6pLVSIaFH73YWg8qdTZPCA95S5LspaNVQzPI/edit) first.

In ReplikBot chat you answer:

1. Website link (background for the rest of the video)
2. Website name
3. First name
4. Surname
5. RepliQ template name (the one you already built with a small intro clip and a large talking-head)

Then the bot:

1. Scores the website **1–10** and writes `qualify grade`
2. **Skips RepliQ** if the score is below 7
3. If 7–10, launches that named template (`url` = the website). First few seconds = the template’s small intro video; the rest uses the website as the background
4. Writes Video link + Icebreaker back to Sheet1 and pastes the link in chat

## Sheet

[REPLIQ DATABASE](https://docs.google.com/spreadsheets/d/1lnmnTMi6pLVSIaFH73YWg8qdTZPCA95S5LspaNVQzPI/edit) · tab Sheet1 is the log, not the intake form.

Optional n8n graphs: `n8n/01-launch.json` (chat/webhook, not a sheet poll), `n8n/02-ready-gate.json` (RepliQ webhook), `n8n/03-sheets-gate.json` (manual check webhook — no 2-minute poll).

Store the RepliQ key as `REPLIQ_API_KEY` via Grok Bot’s secure secret flow — never in the prompt.
