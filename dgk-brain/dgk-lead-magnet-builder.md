# Dgk Lead Magnet Builder

Source skill pack: `dgk-lead-magnet-builder.skill`

Converted to Markdown so Cognee Brain (TextLoader) can ingest it.



---

## File: `SKILL.md`

---
name: "dgk-lead-magnet-builder"
title: DGK Lead Magnet Builder
description: "Build a complete lead magnet end to end — concept, full written content, and a designed PDF ready to publish. Runs a short intake, proposes formats, writes the content, then produces the file. Works for DGK's own funnels and for client giveaways. ALWAYS use when Dilip says 'build a lead magnet', 'create a playbook', 'we need a downloadable guide', 'make a checklist for [client]', 'opt-in gift', 'gated content', 'what should we give away', or names any downloadable asset intended to capture leads. Internal DGK use only."
category: Client Delivery
author: DGK Business Consultancy
---

# DGK Lead Magnet Builder

You build the whole thing: the concept, the written content, and the finished PDF.

**The standard:** the reader should be able to act on it within 30 minutes and get a result without hiring anyone. If the magnet only makes sense as a teaser for the paid service, it will convert badly and damage trust with the people who download it.

---

## Mode Selection

Ask which mode, or infer from context.

**Mode A — DGK's own magnet.** Used on DGK funnels (e.g. `ndis.dgkbusinessconsultancy.com`). Targets DGK's buyers: NDIS providers, IT/MSP firms, recruitment agencies, accounting practices. Apply `dgk-brand-guidelines`.

**Mode B — Client magnet.** Built for a client to give away to *their* audience. Targets the client's buyers or referral partners. Uses the client's brand, not DGK's.

The difference matters at every stage. Mode B content must sound like the client, solve the client's audience's problem, and never mention DGK.

---

## Stage 0: Intake

Ask these in one message as a numbered list. Don't proceed without 1–5.

**Required:**
1. Mode A or B? If B, which client?
2. Who is this for — exact role or audience, not a category
3. What problem does it solve for them?
4. What's the paid offer it sits in front of?
5. Where will it be used — funnel opt-in, cold email CTA, LinkedIn, sales follow-up?

**Helpful if available:**
6. Any DGK data, client results, or real examples that can go in it
7. Anything the audience already knows well (so it isn't restated)

**Shortcut:** if a `dgk-position-painpoint` brief exists for this audience, use it. The pain layers in that brief are exactly what the magnet should answer, and the language is already in the audience's own words. Same for `dgk-icp-to-outreach` — its positioning canvas tells you what the magnet should lead toward.

---

## Stage 1: Concept

Propose **5 concepts**, not 10. Ten options is a brainstorm; five is a decision.

Draw from these formats. Pick the ones that suit the audience and problem — don't default to "guide" every time.

| Format | Best when | Time to value |
|---|---|---|
| **Checklist** | The audience knows what to do but not whether they've done it all | 5 min |
| **Template / swipe file** | The hard part is starting from blank | 10 min |
| **Scorecard / self-audit** | They don't know how bad their situation is | 15 min |
| **Mistake list** | They're doing something actively wrong | 10 min |
| **Playbook / guide** | The process is genuinely multi-step | 30 min |
| **Calculator / worksheet** | The decision hinges on numbers they haven't run | 15 min |
| **Comparison table** | They're evaluating options and confused | 10 min |
| **Script pack** | They know what to do but not what to say | 10 min |
| **Case breakdown** | They don't believe it's possible for a business like theirs | 15 min |

Present each concept as:

```
**[Title]**
Format: [type]
Promise: [the exact outcome the reader gets]
Why it converts: [the specific pain it lands on]
Length: [pages]
Leads to: [how it connects to the paid offer]
```

**Title rules:**
- Specific over clever. "The 12 Referral Partners Every NDIS Provider Should Know" beats "Unlocking Growth in Disability Services."
- Put the number in if there is one.
- Name the audience in the title where possible.
- Never use: Ultimate, Complete, Definitive, Secrets, Hacks, Unlock, Mastering.

Wait for Dilip to pick one before writing.

---

## Stage 2: Write It

### Structure

Every magnet uses this shape regardless of format:

1. **Cover** — title, subtitle stating the promise, brand mark
2. **The problem** (½ page) — the situation, in the reader's own words, with what it costs them. No preamble, no "in today's competitive landscape."
3. **The body** (60–70% of the document) — the actual useful content
4. **How to use this** (¼ page) — what to do first, this week
5. **About / next step** (½ page) — who made this and one soft CTA

### Length

**4–10 pages.** A 30-page ebook doesn't get read and takes three times as long to produce. If the content genuinely needs more room, split it into two magnets.

### The give-value test

Before writing a line, answer: **could the reader solve their problem with this document alone?**

If no, the magnet is a brochure. Rewrite it.

This feels counterintuitive — why give away the answer? Because the people who can execute it themselves were never going to buy, and the people who can't will read it, recognise the depth, and call. A magnet that withholds is transparently a sales asset and converts like one.

### Writing rules

- **Second person.** "You" not "businesses" or "providers."
- **Their language.** Pull phrasing from the pain point brief. If they say "chasing providers," write "chasing providers," not "vendor management inefficiency."
- **Plain Australian English.** No US spelling.
- **Specific over general.** Real numbers, real examples, real role titles.
- **No em dashes** in the finished document.
- **Short paragraphs.** Three lines maximum. It's read on a phone.
- **Never invent data.** No fabricated statistics, percentages, or case studies. If there's no real number, make the point without one.

### Banned language

Ultimate, unlock, leverage, seamless, robust, game-changing, cutting-edge, holistic, transformative, best-in-class, "in today's fast-paced world," "at the end of the day," "here's the thing."

Also banned: negative parallelism ("it's not X, it's Y"), false-suspense transitions ("here's what nobody tells you"), and self-answered rhetorical questions ("The result? Disaster.").

### One CTA, at the end only

A single soft CTA on the final page. Not on every page, not in the middle.

> "If you'd rather have this built for you than build it yourself, [action]."

Never gate part of the content behind a call.

---

## Stage 3: Build the PDF

Read `/mnt/skills/public/pdf/SKILL.md` before generating anything.

**Mode A:** apply `dgk-brand-guidelines` for colours, type, and logo.
**Mode B:** use the client's brand assets. If none are supplied, ask before designing — don't guess a colour palette and hand back something off-brand.

Design requirements:
- Cover page with title and promise
- Consistent heading hierarchy
- White space. Dense pages don't get read.
- Page numbers
- Contact detail on the final page only
- Print-safe (some readers print checklists)

Save to `/mnt/user-data/outputs/[name].pdf`, then present it.

Also save the markdown source alongside it so Dilip can edit without regenerating from scratch.

---

## Stage 4: Deployment Notes

After presenting the file, give a short block covering:

- **Landing page headline and subhead** (two lines, ready to paste)
- **Form fields** to collect — for DGK's NDIS funnel this is name, email, phone into GHL
- **The delivery email** — subject line and 3–4 sentence body that sends the file
- **The follow-up** — what the next touch is and when

Keep this tight. It's a deployment note, not a campaign plan.

---

## Behaviour Rules

- **Concept before content.** Never write a full magnet before Dilip picks the concept. Wasted work otherwise.
- **Five concepts, not ten.**
- **Real content only.** No fabricated statistics, invented case studies, or made-up client names. If proof is needed and none exists, write it without proof rather than inventing it.
- **Mode B never mentions DGK.** The client's audience should have no idea an agency wrote it.
- **Don't pad to hit a page count.** A tight 5-page checklist outperforms a padded 15-page guide.
- **Flag the weak part.** After delivering, tell Dilip which section is thinnest and what would strengthen it — usually a real number or example only he can supply.

---

## References

| File | Purpose |
|---|---|
| `references/format-guide.md` | Deep detail on each format, with structure for each |
| `references/deployment.md` | Landing page copy, delivery email, follow-up sequence patterns |
