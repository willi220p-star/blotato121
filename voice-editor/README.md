# Voice editor (Claude skill)

Edits a draft so it reads like a person wrote it. It is not an AI-detector bypass.

## Fix the upload error

Claude rejects a zip when `SKILL.md` is two folders deep:

```text
anti-ai-skill/anti-ai/SKILL.md   ← fail
voice-editor/voice-editor/SKILL.md  ← fail
```

`SKILL.md` must sit in the **top-level folder of the zip** (or at the zip root). One folder is fine. Two is not.

**macOS Finder:** right-click the folder that *directly contains* `SKILL.md`. Compress that folder. Do not compress the parent (`anti-ai-skill`, `Downloads`, etc.).

**Zip from the terminal** (this is the reliable way):

```bash
cd voice-editor
zip -r ../voice-editor.zip SKILL.md README.md references -x "*.DS_Store"
```

That archive looks like:

```text
SKILL.md
README.md
references/tells.md
references/wordbank.md
```

If you already have a nested zip (`anti-ai-skill/anti-ai/SKILL.md`):

```bash
unzip anti-ai-skill.zip -d /tmp/skill-fix
cd /tmp/skill-fix/anti-ai-skill/anti-ai
zip -r ~/anti-ai.zip SKILL.md references -x "*.DS_Store"
```

Upload `~/anti-ai.zip`, not the original.

## Install

1. Build the zip with the command above (or run `bash pack.sh` from this folder).
2. Open [claude.ai](https://claude.ai) → **Customize** → **Skills** → **Upload skill**.
3. Upload `voice-editor.zip`.
4. Start a **new chat**. Old threads will not pick the skill up.
5. Invoke it:

```text
/anti-ai

[paste the AI draft]
```

It rewrites immediately. Do not wait for notes.

## What it will not do

- Optimize for Pangram, GPTZero, Turnitin, or any other classifier
- Invent a story, colleague, price, or date so the text "looks human"
- Turn a slogan into a finished newsletter without your notes
