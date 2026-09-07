# Dgk Infographic Prompt

Source skill pack: `dgk-infographic-prompt.skill`

Converted to Markdown so Cognee Brain (TextLoader) can ingest it.



---

## File: `SKILL.md`

---
name: dgk-infographic-prompt
description: >
  Build a structured infographic prompt (.md file) from a finished LinkedIn post for Dilip Sapkota / DGK Business Consultancy, using the DGK Brand × LinkedIn Visual System v2.0. ALWAYS use this skill when Dilip pastes a LinkedIn post and wants an infographic, says "infographic," "make a prompt," "image prompt," "visual for this post," "turn this into an infographic," or shares a finished caption with any intent to create a visual. Also trigger on "infographic prompt," "ChatGPT image prompt," "create a visual," "make this into an image," "carousel," or any reference to the DGK visual system. Trigger even when the word "infographic" is never used — a finished LinkedIn post with visual intent is the trigger.
---

# DGK Infographic Prompt Builder — v2.0

Convert a finished LinkedIn post into a structured `.md` prompt file for an external AI image generation tool. Output follows **DGK Brand × LinkedIn Visual System v2.0** — clean, structural, Inter-based design using the official DGK colour token system. No hand-drawn elements. No Comic Neue. No pastels. Brand-consistent every time.

---

## DGK COLOUR SYSTEM — AUTHORITATIVE REFERENCE

**Always use these tokens. Never invent colours. Never use old pastel or sketchbook colours.**

### Core Palette

| Token | Hex | Infographic use |
|---|---|---|
| `Navy Ink` | `#0d1117` | Primary text, dark header backgrounds, icon fills |
| `Paper White` | `#ffffff` | Card backgrounds, content panels |
| `Warm Cream` | `#f9f8f6` | Canvas/page background |
| `Sand Border` | `#dad4c8` | Dividers, card borders, section rules |
| `Cool Mist` | `#e6e8ec` | Input-style boxes, hover/alt card fills |
| `Stone Gray` | `#55534e` | Secondary text, captions, footer copy |
| `Ash Gray` | `#9f9b93` | Placeholder labels, tertiary detail |
| `Violet Pulse` | `#3859f9` | Primary CTA elements, active states, section dividers, "DO THIS:" action lines, key accent |
| `Lavender Banner` | `#b8a5e8` | Soft highlight panels, announcement-style callout strips |
| `Teal Mark` | `#0ec5b0` | Logo accent, icon highlights, sparingly |

### Vivid Palette — Industry / Accent Moments Only

| Token | Hex | Assigned use |
|---|---|---|
| `Lime Slide` | `#cbd810` | IT/MSP client cards |
| `Ember Orange` | `#ff7614` | Accounting client cards |
| `Signal Blue` | `#429dff` | Recruitment client cards |
| `Aqua Splash` | `#3bd3fd` | Carousel overflow accents |
| `Cobalt` | `#0667d9` | Dark contrast moments |
| `Forest` | `#02693e` | Legal client cards |
| `Magenta` | `#8b045c` | Carousel overflow accents |
| `Blush` | `#f8b9e3` | Soft variety moments |

**Rule:** Vivid colours appear only on industry-specific client cards and single accent moments per layout. Never as general fills or backgrounds.

### Colour Hierarchy for Infographic Layouts

1. **Canvas:** Warm Cream `#f9f8f6`
2. **Cards / panels:** Paper White `#ffffff` with Sand Border `#dad4c8` borders
3. **Primary text:** Navy Ink `#0d1117`
4. **Secondary text / captions:** Stone Gray `#55534e`
5. **Key accent / CTA / action lines:** Violet Pulse `#3859f9`
6. **Structural dividers:** Sand Border `#dad4c8`
7. **Soft highlight strips:** Lavender Banner `#b8a5e8`
8. **Icon / logo accents:** Teal Mark `#0ec5b0` (sparingly)
9. **Industry cards:** Vivid palette (only if post targets a named vertical)

---

## DGK TYPOGRAPHY — AUTHORITATIVE REFERENCE

**Font: Inter only.** No Comic Neue. No serif. No display fonts inside content.

| Role | Size | Weight | Letter Spacing |
|---|---|---|---|
| Canvas headline | 44–52px | 700 | -0.88px |
| Section heading | 32px | 700 | -0.32px |
| Card title | 20px | 600 | -0.16px |
| Body / insight line | 14–16px | 400 | — |
| Action line ("DO THIS:") | 14px | 600 | — |
| Caption / label / tag | 12–13px | 500 | 0.09em (uppercase) |
| Footer | 13px | 500 | — |

**Rules:**
- Negative letter spacing on all headings 32px+ — never skip
- Labels/tags always uppercase with 0.09em tracking
- Body text inside cards: **never exceed 14px** — larger sizes break compact grid on LinkedIn mobile
- "DO THIS:" lines: Violet Pulse `#3859f9`, 600 weight, 14px

---

## COMPONENT SPECS

### Cards
- Background: Paper White `#ffffff`
- Border: 1px solid Sand Border `#dad4c8`
- Border radius: 12px (standard cards), 16px (feature panels)
- Shadow: subtle — `rgba(13,17,23,0.10) 0px 1px 1px 0px`
- Padding: 24px
- One icon + one insight line per card. Optional "DO THIS:" action line below.

### Section Dividers
- 1px rule, Sand Border `#dad4c8`
- Violet Pulse `#3859f9` accent bar (4px wide) used for primary section breaks

### Tags / Chips
- Background: Cool Mist `#e6e8ec`
- Text: Stone Gray `#55534e`
- Border radius: 2.75px
- Font: 12–13px, 500, uppercase, 0.09em

### Callout / Highlight Strip
- Background: Lavender Banner `#b8a5e8`
- Used for summary strip or key-takeaway panel
- Clean rectangle, no hand-drawn treatment

### "DO THIS:" Action Lines
- Colour: Violet Pulse `#3859f9`
- Weight: 600
- Prefix always: "DO THIS:" in uppercase, followed by the action

### Footer
- Background: Warm Cream `#f9f8f6`
- Divider: 1px Sand Border `#dad4c8`
- Text: 13px, Stone Gray `#55534e`

---

## WORKFLOW — 3-STEP CONVERSATIONAL APPROVAL

**CRITICAL RULE: Stop after every step. Wait for Dilip's explicit approval before moving to the next step. Never skip ahead. Never combine steps.**

---

### ── BEFORE STEP 1: ANALYSE THE POST (SILENT) ──

Read the post silently. Identify:
- **Core framework** — what is the post teaching?
- **Number of items** — distinct points, steps, rules, or concepts
- **Content type** — Tips/Hacks, GTM/Playbook, Tool Stack, Before/After, Results/Proof, or Process/Systems
- **Vertical** — IT/MSP, Recruitment, Accounting, or Legal? Vivid accent layer applies if yes
- **Positioning** — Australian B2B outbound (Clay/Apollo/Smartlead) or general small business systems?
- **Core takeaway** — the one line someone would screenshot

**Duplicate check:** If a prompt already exists for this post or framework in this conversation, flag it before generating anything:
> "This covers the same framework as [earlier prompt name]. Replace it, or create a separate version with a different visual style?"

**Card count check:** If the post has more than 8 items and a card grid is the natural layout, flag it:
> "This post has [N] items. The DGK system caps 2-column grids at 8 cards. Options: (a) split into a carousel series, (b) consolidate to 8, (c) use a non-grid metaphor (hub-and-spoke, staircase, timeline), or (d) override with a dense grid."
> Wait for answer before generating anything.

---

### ── STEP 1: GENERATE 5 H1 HEADLINE + SUBHEADLINE PAIRS ──

Generate exactly **5 pairs**. Present all 5. Then ask:

> **"Which headline are you going with? Pick a number (1–5), or tell me what direction to push and I'll generate 5 fresh options."**

**STOP. Do not proceed until Dilip picks a number or requests new options.**

**Headline rules:**
- H1 = max 2 lines when rendered
- Direct and practical — tells people exactly what they'll learn
- Bold claims, clear payoff — "How to..." style preferred
- No wordplay, mystery, or cleverness for its own sake
- Key number or phrase gets Violet Pulse `#3859f9` highlight in the final render

**Subheadline rules:**
- Single line only
- Expands the headline promise or adds proof/context
- Rendered in Stone Gray `#55534e`, Inter 400, 16–18px

**Approved tone examples:**
- "How to Stand Out When Everyone Offers the Same Thing"
- "Why Your Cold Emails Go Straight to Spam"
- "The 10 Places Clients Check Before They Call You"
- "How to Build an AI Content System in 10 Minutes"
- "6 Things Clients Secretly Grade You On Every Call"
- "How to Turn Your Personal Brand Into a Client Machine"

**If Dilip rejects all 5:** ask what direction to push, then generate 5 entirely fresh options — never variations on the rejected set. The chosen headline + subheadline is **final** — no refinement round.

---

### ── STEP 2: CONFIRM VISUAL METAPHOR ──

Based on the post's shape, suggest the single best-fit metaphor with a one-line reason. Then ask:

> **"Does this metaphor work for you, or would you prefer a different one? Options below."**

List all available metaphors so Dilip can choose:

| Metaphor | Best for | Max items |
|---|---|---|
| 2-column card grid | Tips, rules, hacks, tools | 8 |
| Numbered staircase | Sequential steps, levels | 6–8 |
| Left-rail timeline | Process, phases, journey | 5–7 |
| Hub-and-spoke | One central idea + surrounding factors | 6–10 |
| Before / After split | Transformation, old way vs new way | 2 frames |
| Pyramid / hierarchy | Priority stack, tiers, levels | 3–5 |
| Horizontal flow | Left-to-right process, funnel stages | 4–6 |
| Comparison table | Side-by-side, contrast | 2–3 columns |
| Bullseye / concentric | Core concept with layered context | 3–4 rings |
| Flywheel loop | Self-reinforcing system, cycle | 3–5 nodes |
| Checklist | Audit, scan, quick reference | 5–12 items |

**STOP. Do not proceed until Dilip confirms or picks a metaphor.**

---

### ── STEP 3: BUILD AND PRESENT THE FULL INFOGRAPHIC PROMPT ──

Using the approved headline + subheadline (Step 1) and confirmed metaphor (Step 2), build the complete `.md` prompt file and present it.

**Output structure — 4 sections only, in this order:**
1. Headline
2. Subheadline
3. Infographic body (main visual)
4. Footer

**No summary strip. No extra sections. No additions.**

After presenting the file, ask:

> **"Does this look right? Approve to lock it in, or tell me what to change."**

**STOP. Do not package or finalise until Dilip approves.**

Once approved: save to `/mnt/user-data/outputs/` with a descriptive kebab-case filename. Call `present_files`. No post-build summary paragraph needed.

---

## CONTENT EXTRACTION RULES

**INCLUDE:**
- Core framework, steps, or system from the post
- Universal insights distilled from each point
- Real tool names where relevant (Clay, Apollo, Smartlead, Make.com)
- "DO THIS:" action lines in Violet Pulse `#3859f9` where the post gives concrete actions

**EXCLUDE:**
- Personal backstory and origin stories
- Specific client names and industries (unless Results/Proof post)
- Dollar amounts and named results unless they ARE the headline hook
- Engagement questions ("which one are you missing?")
- "Follow me" CTAs — the footer handles this
- Attribution to other creators

**RULE:** Each card, node, pill, step, or level gets ONE icon + ONE short insight line + optional "DO THIS:" action. No paragraphs inside visual elements. Body text cap: 14px max inside cards.

---

## OUTPUT FORMAT

```markdown
# Infographic Prompt — "[Approved Headline]"

**Style:** DGK Brand × LinkedIn Visual System v2.0
**Visual Metaphor:** [METAPHOR NAME] — [why it fits in one line]
**Content Type:** [Tips / GTM / Tool Stack / Before-After / Results / Process]
**Dimensions:** 1080 × 1350px (4:5 Portrait)
**Render:** 8K (4320×5400), deliver at 1080×1350

---

[Render instruction paragraph — overall visual feel, colour mood, structural approach in 3–4 sentences. Reference DGK colour tokens by name and hex.]

**Design principle:** 25% white space minimum. Clean grid. Structural precision. No decorative elements that don't carry information.

## TYPOGRAPHY
- Headline: Inter 700, 44–52px, -0.88px tracking, Navy Ink #0d1117
- Card titles: Inter 600, 20px, -0.16px tracking
- Body / insight lines: Inter 400, 14px
- Action lines: Inter 600, 14px, Violet Pulse #3859f9, prefixed "DO THIS:"
- Labels / tags: Inter 500, 12–13px, uppercase, 0.09em tracking, Stone Gray #55534e
- Footer: Inter 500, 13px, Stone Gray #55534e

## BACKGROUND
Canvas: Warm Cream #f9f8f6

---

## TOP-RIGHT — "SAVE THIS" 🔖
Small tag chip — Cool Mist #e6e8ec background, Stone Gray #55534e text, 12px uppercase, 2.75px radius.

## 1. HEADLINE (top ~10%)
[H1 in Navy Ink #0d1117, Inter 700, 44–52px. Key phrase or number in Violet Pulse #3859f9 underline or inline colour swap. Subheadline in Stone Gray #55534e, Inter 400, 16–18px.]

---

## 2. INFOGRAPHIC BODY — [METAPHOR NAME]
[Full layout spec: number of cards/nodes/steps, DGK colour assignments, icon descriptions, insight line copy per element, "DO THIS:" lines in Violet Pulse #3859f9, border and shadow specs.]

---

## 3. FOOTER (bottom ~4%)
1px divider — Sand Border #dad4c8
Background: Warm Cream #f9f8f6
LEFT:  ♻️ "Repost this" — Inter 500, 13px, Stone Gray #55534e
RIGHT: "Follow Dilip Sapkota — DGK Business Consultancy" — Inter 500, 13px, Stone Gray #55534e

## 8K CLARITY RULES
1. All text rendered as vector paths — no rasterisation
2. 1px borders minimum — hairlines vanish at 1080px delivery
3. Icon strokes minimum 2px at 1080px equivalent
4. Shadow: rgba(13,17,23,0.10) — do not increase opacity
5. No gradients on card fills — flat DGK token colours only
6. Colour accuracy: render against sRGB, deliver sRGB
7. [Any prompt-specific rules for this infographic]
```

**File naming:** `descriptive-name-infographic-prompt.md` (kebab-case)
**Save to:** `/mnt/user-data/outputs/`
**Always call `present_files`.**

---

## QUICK COLOUR CHEATSHEET — COPY INTO EVERY PROMPT

```
Canvas:           Warm Cream     #f9f8f6
Card bg:          Paper White    #ffffff
Card border:      Sand Border    #dad4c8
Primary text:     Navy Ink       #0d1117
Secondary text:   Stone Gray     #55534e
Tertiary text:    Ash Gray       #9f9b93
Key accent / CTA: Violet Pulse   #3859f9
Soft highlight:   Lavender Ban.  #b8a5e8
Alt card fill:    Cool Mist      #e6e8ec
Icon / logo acc.: Teal Mark      #0ec5b0

Vivid (industry only):
IT/MSP:           Lime Slide     #cbd810
Accounting:       Ember Orange   #ff7614
Recruitment:      Signal Blue    #429dff
Legal:            Forest         #02693e
```
