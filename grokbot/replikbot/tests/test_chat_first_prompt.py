#!/usr/bin/env python3
"""Validate ReplikBot Grok prompt and n8n graphs for the chat-first flow."""

from __future__ import annotations

import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
PROMPT = (ROOT / "GROKBOT_CREATE_PROMPT.md").read_text(encoding="utf-8")
README = (ROOT / "README.md").read_text(encoding="utf-8")
N8N = ROOT / "n8n"

REQUIRED_PHRASES = [
    "Website link",
    "Website name",
    "First name",
    "Surname",
    "template name",
    "qualify grade",
    "1 to 10",
    "7 through 10",
    "You are already ReplikBot",
    "Do not create a new Bot",
    "Do not create a timed routine",
    "Do not poll the sheet",
    "small intro",
    "website as the full-screen background",
    "launchTemplate",
    "REPLIQ_API_KEY",
    "Sheet1",
]

FORBIDDEN_PHRASES = [
    "Every 10 minutes, run the RepliQ Pipeline",
    "I create the task in that sheet",
    "Create a new Bot",
]

def _plain(text: str) -> str:
    return text.replace("**", "").replace("`", "").lower()


PROMPT_PLAIN = _plain(PROMPT)
README_PLAIN = _plain(README)
errors: list[str] = []

for phrase in REQUIRED_PHRASES:
    if _plain(phrase) not in PROMPT_PLAIN:
        errors.append(f"prompt missing: {phrase}")

for phrase in FORBIDDEN_PHRASES:
    if phrase in PROMPT:
        errors.append(f"prompt still has old sheet-timer language: {phrase}")

if "10-minute routine" not in README and "10-minute" not in README:
    errors.append("README should tell the user not to add a 10-minute routine")

for name in ("01-launch.json", "02-ready-gate.json", "03-sheets-gate.json"):
    path = N8N / name
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        errors.append(f"{name} is not valid JSON: {exc}")
        continue
    blob = json.dumps(data)
    if "everyX" in blob and name != "02-ready-gate.json":
        errors.append(f"{name} still polls on a timer (everyX)")
    if name == "01-launch.json":
        if "replikbot-launch" not in blob:
            errors.append("01-launch.json missing chat webhook path")
        if "qualifyGrade" not in blob:
            errors.append("01-launch.json missing qualifyGrade")
        if "templateId" not in blob:
            errors.append("01-launch.json missing templateId from chat")
        if "googleSheetsTrigger" in blob:
            errors.append("01-launch.json still uses a Google Sheets trigger")
    if name == "03-sheets-gate.json":
        if "googleSheetsTrigger" in blob:
            errors.append("03-sheets-gate.json still uses a Google Sheets poll trigger")
        if "replikbot-check" not in blob:
            errors.append("03-sheets-gate.json missing manual check webhook")

if errors:
    print("FAIL")
    for item in errors:
        print(f"- {item}")
    sys.exit(1)

print("OK")
print(f"prompt_chars={len(PROMPT)}")
print("n8n_graphs=3 valid JSON, no sheet timers")
print("chat_fields=website link, website name, first name, surname, template name")
print("quality=1-10, pass 7-10, skip below 7")
print("trigger=chat only, no 10-minute routine")
