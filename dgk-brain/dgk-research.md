# Dgk Research

Source skill pack: `dgk-research.skill`

Converted to Markdown so Cognee Brain (TextLoader) can ingest it.



---

## File: `SKILL.md`

---
name: dgk-research
description: Research a company, contact, buying team, news signals, or tech stack for DGK Business Consultancy. Pulls from GHL CRM first, then web. Writes output back to contact.research_brief. ALWAYS use this skill when the user asks to research a prospect, contact, or company — or uses phrases like "look up", "find out about", "what do we know about", "dig into", "pre-call brief", "who is this", "any news on", "what's their stack", or pastes a company name, website, LinkedIn URL, or ABN with intent to learn more. Trigger even when the word "research" is not used — the intent to learn about a target is the trigger.
---

# DGK Research

Produces a focused, actionable brief on a company, person, buying team, news signal, or tech stack. Pulls from GHL CRM first, enriches from the web second, writes the output back to `contact.research_brief` in GHL.

The output is a brief a person can act on in 60 seconds — not a dump.

---

## The one rule that overrides everything

**Check GHL before going to the web. Stop at the depth the ask requires.**

GHL already holds intake answers, pain points, ICP scores, intent levels, and service history for known contacts. A prospect that was onboarded three weeks ago does not need a web search — the answers are already in the CRM. Only go to the web when GHL has a real gap.

---

## Step 1 — Parse the ask, pick the sub-page

Route based on what the user is asking. Pick one primary sub-page. If the user explicitly chains two ("company plus buying team"), load both — but always pick a primary.

| Ask shape | Sub-page |
|---|---|
| Generic company / "what does X do" / just a company name | `Company` |
| Named person — "tell me about Jane Doe at Acme" | `Person` |
| Who are the decision-makers inside one account | `AccountTeam` |
| What's recent / news / signals in the last 30 days | `News` |
| What tools do they run / their tech stack | `TechStack` |

If the ask is ambiguous (just a name, no further context), default to `Company`.

---

## Step 2 — Pick the depth

Read the phrasing before you start:

- **Brief** (default) — "look up X", "what do we know about X", "quick brief" → 3–5 lines, essentials only.
- **Full** — "deep brief", "pre-meeting prep", "full dossier", "I'm about to call them" → run the sub-page end to end.
- **Micro** — "quick — is X worth calling?" → one paragraph, answer only.

Default to brief. Over-researching when a sentence would do is the most common failure mode.

---

## Step 3 — Execute the sub-page

### Sub-page: Company

**Goal:** Understand what the company does, its size and stage, and what DGK opportunity exists.

**Procedure — cheap before expensive:**

1. **Check GHL first** — search `dgk-ghl` for the company name or domain. Pull: `contact.industry`, `contact.company_website`, `contact.icp_score`, `contact.intent_level`, `contact.pain_points`, `contact.main_challenge`, `contact.status`, `contact.summary__csm`. If the record is rich, stop here.

2. **Web search** — if GHL has gaps, search the company name + "Australia" or their domain. Look for: what they do, who they serve, size signals (team page, LinkedIn headcount), how long they've been operating, any recent news.

3. **Compose output:**

```
COMPANY: [name]
WEBSITE: [url]
INDUSTRY: [industry]
WHAT THEY DO: [1–2 sentence plain-English description]
SIZE: [headcount or revenue signal — source it]
LOCATION: [city, state]
GHL RECORD: [Exists / Not found] — [ICP Score if exists] — [Intent Level if exists]
PAIN / CONTEXT: [what they told us, or what the web suggests]
DGK ANGLE: [which DGK service fits and why — one line]
CONFIDENCE: [High / Medium / Low — based on signal density]
SOURCES: [GHL record / web search / LinkedIn / etc.]
```

---

### Sub-page: Person

**Goal:** Know who you're talking to before a call or outreach.

**Procedure:**

1. **Check GHL first** — search for the contact by name and company. Pull: name, title, email, phone, `contact.pain_points`, `contact.what_kind_of_services_are_you_interested_in`, `contact.status`, `contact.sign_on_date`, `contact.assigned_csm_or_gtme`, `contact.summary__csm`, last activity date.

2. **Web search** — if not in GHL or GHL is thin, search "[name] [company] LinkedIn" or "[name] [company] Australia". Look for: current role and tenure, background, any public content (articles, posts, interviews), seniority signals.

3. **Compose output:**

```
PERSON: [full name]
TITLE: [current role]
COMPANY: [company name]
SENIORITY: [Founder/Owner / C-Level / VP / Director / Manager / IC]
TENURE: [how long in this role — source it]
GHL RECORD: [Exists / Not found] — [Status if exists] — [Assigned CSM if exists]
BACKGROUND: [1–2 lines — career context, relevant experience]
CONTENT / SIGNALS: [any public posts, interviews, or LinkedIn activity worth noting]
TALK TRACK HOOK: [one personalised opener based on what you found]
CONFIDENCE: [High / Medium / Low]
SOURCES: [GHL / LinkedIn / web]
```

---

### Sub-page: AccountTeam

**Goal:** Map the buying committee inside one target account — who to reach, who blocks, who champions.

**Procedure:**

1. **Check GHL** — search the company name. Pull all contacts associated with that company. Note their titles, roles, and any notes from `contact.summary__csm`.

2. **Web search** — search "[company] leadership team Australia", "[company] LinkedIn employees". Identify 2–5 decision-makers and influencers by title. Focus on: Founder/Owner/MD (economic buyer), Ops/GM (project champion), and any relevant functional leads (Sales, IT, Marketing) depending on the DGK service.

3. **Compose output — one block per person:**

```
ACCOUNT: [company name]
BUYING COMMITTEE:

1. [Name or "Unknown"] — [Title] — [Buyer type: Economic / Champion / Influencer / Blocker]
   GHL: [In CRM / Not found]
   Hook: [one-line personalised angle]

2. [repeat]

PRIMARY TARGET: [who to approach first and why]
ENTRY POINT: [recommended outreach channel — email / LinkedIn / phone]
```

---

### Sub-page: News

**Goal:** Find signals from the last 30 days that make outreach timely and relevant.

**Procedure:**

1. **Web search** — search "[company name] news 2026", "[company name] announcement", "[company name] hiring", "[company name] site:linkedin.com". Look for: new hires, expansion, new product/service, funding, leadership change, awards, press coverage.

2. **Check GHL** — pull `contact.intent_level` and any recent notes.

3. **Compose output:**

```
COMPANY: [name]
SIGNAL SCAN: Last 30 days

SIGNALS FOUND:
- [Signal 1] — [date if known] — [source]
- [Signal 2] — [date if known] — [source]

BEST HOOK: [which signal to lead with in outreach and why]
TIMING: [Hot / Warm / Neutral — based on recency and relevance]
GHL INTENT: [current intent level from CRM if available]
```

If no signals found: state that clearly — "No public signals found in the last 30 days. Outreach should lead with problem, not trigger."

---

### Sub-page: TechStack

**Goal:** Understand what tools the company runs — CRM, email, website platform, automation, comms.

**Procedure:**

1. **Check GHL first** — pull `contact.what_is_your_current_stack`. If populated, this is the answer.

2. **Web search** — search "[company website] technology" or check BuiltWith/Wappalyzer signals via web search. Look for: CRM signals (HubSpot tracking pixel, Salesforce, GHL), email platform (Klaviyo, Mailchimp), website platform (WordPress, Shopify, Webflow), ads (Meta pixel, Google Ads tag), booking tools, live chat.

3. **Compose output:**

```
COMPANY: [name]
TECH STACK:

CRM: [tool or Unknown]
EMAIL PLATFORM: [tool or Unknown]
WEBSITE: [platform + hosting signal if detectable]
BOOKING / SCHEDULING: [tool or Unknown]
AUTOMATION: [tool or Unknown]
ADS: [platforms detected or Unknown]
OTHER: [any other notable tools]

GHL SELF-REPORTED: [Yes — pulled from intake / No]
STACK GAPS: [what's missing that DGK could fill — one line]
CONFIDENCE: [High / Medium / Low]
SOURCES: [GHL intake / web detection / BuiltWith]
```

---

## Step 4 — Write back to GHL

After every research run, write the composed output to `contact.research_brief` (field ID: `m7JsFYiMEHVowImk36IX`) on the GHL contact record.

- If the contact exists in GHL: update the field via `dgk-ghl execute_operation` (update-contact).
- If the contact does not exist in GHL: skip the write-back and note it in the output — "GHL record not found — brief not saved."
- Prepend the date to the brief so records stack over time: `[2026-08-06] Company Brief — [company name]`

Do not write raw dumps to GHL. Write the composed output block only.

---

## Rules

- MUST check GHL before going to the web — every time.
- MUST cite sources inline on every claim (GHL record / web search result / LinkedIn).
- MUST flag confidence: High (multiple corroborating sources), Medium (one source, plausible), Low (inferred or unverified).
- MUST write the composed output block back to `contact.research_brief` when a GHL record exists.
- MUST surface the highest-signal finding first — never bury the lede.
- NEVER produce a raw data dump. Always synthesise into the sub-page output shape.
- NEVER invent figures, quotes, headcount, or revenue not present in a source.
- NEVER run a full dossier when a brief was the right call — read the depth signal in the ask.
- If a tool result is empty or thin, state it plainly and move on. Do not pad.
- MUST ask the user after delivering every brief: "Want me to save this to GHL?" — if yes, update or create the contact record and write the brief to `contact.research_brief`.
- MUST tag every contact created or updated through this skill with the tag `clauderesearch` — no exceptions. This applies whether creating a new contact or updating an existing one.

---

## What good looks like

- **Right depth.** A one-paragraph answer when a paragraph is enough. A full dossier only when the stakes justify it.
- **GHL-first.** A contact who filled in the onboarding form already told you their pain points, stack, and objectives. Use it.
- **Lede first.** The strongest signal is line one. Everything else supports it.
- **Knows when to stop.** If GHL covered the surface area, no web search needed. If a person has no public profile, say so and end.
- **Writes back.** The brief lands in GHL so the next person to open the record doesn't have to re-run it.
