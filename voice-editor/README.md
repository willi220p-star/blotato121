# Voice editor (Claude skill)

Edits a draft so it reads like a person wrote it. It is not an AI-detector bypass.

## Install

1. Zip the folder so `SKILL.md` is inside `voice-editor/`:

```bash
zip -r voice-editor.zip voice-editor -x "*.DS_Store"
```

2. Open [claude.ai](https://claude.ai) → **Customize** → **Skills** → **Upload skill**.
3. Upload `voice-editor.zip`.
4. Start a **new chat**. Old threads will not pick the skill up.
5. Invoke it:

```text
/voice-editor rewrite this. Keep my claims. Flag anything you invented.

[paste draft]
```

If you have three paragraphs you actually wrote, paste them first:

```text
/voice-editor match this voice. Then edit the draft below.

VOICE:
[your real writing]

DRAFT:
[the piece]
```

## What it will not do

- Optimize for Pangram, GPTZero, Turnitin, or any other classifier
- Invent a story, colleague, price, or date so the text "looks human"
- Turn a slogan into a finished newsletter without your notes
