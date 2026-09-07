# Dgk Visitor Intent

Source skill pack: `dgk-visitor-intent.skill`

Converted to Markdown so Cognee Brain (TextLoader) can ingest it.



---

## File: `SKILL.md`

---
name: dgk-visitor-intent
description: Score, rank, and action website visitors, LinkedIn profile viewers, and LinkedIn post engagers for DGK Business Consultancy. ALWAYS use this skill whenever the user pastes or uploads visitor data, engagement data, a de-anonymisation export, a Swan CSV, a LinkedIn viewer list, post engagement export, or any file or table containing companies and people who have interacted with DGK. Also trigger on phrases like "who visited the site", "score these visitors", "rank these leads by intent", "who's been engaging", "check these profile views", "process this visitor export", "which of these are hot", "analyse this engagement data", or when the user asks who is worth reaching out to from a list of people or companies that have shown any interaction. Trigger even when the user does not use the word "intent" or "score" — the presence of interaction or engagement data is the trigger.
---

# DGK Visitor Intent Scoring

Turn raw visitor and engagement data into a ranked list of people worth contacting, with a score, a band, and a specific next action for each one.

## The rule that overrides everything

**Never reference a website visit or a LinkedIn profile view in outreach.**

The prospect does not know they were identified. Mentioning it — "saw you were checking out our site", "noticed you looked at my profile" — reads as surveillance and destroys trust in one sentence. The visit is internal targeting intelligence. It tells you *who* to contact and *when*. Nothing more.

**The one exception:** public LinkedIn post engagement. If someone liked or commented on a DGK post, that was a deliberate public action and they expect it to be seen. Referencing a comment is natural. Referencing a profile view is not.

| Source | Reference it in outreach? |
|---|---|
| Website visit (de-anonymised) | Never |
| LinkedIn profile view | Never |
| LinkedIn post like | Never — too passive to acknowledge naturally |
| LinkedIn post comment | Yes — public, deliberate, expects a response |
| Instagram Story view | Only if there is an existing relationship |

All other outreach anchors to: ICP fit, a pain their role typically owns, or a signal happening at their company (SEEK job ad, funding, hiring, expansion).

## Step 1 — Read the data

The input may be a CSV, a pasted table, a screenshot of a dashboard, or a written list. Work with whatever arrives.

**Look for these fields.** They will be named differently across tools — map them by meaning, not by exact column name.

| What you need | Common column names |
|---|---|
| Company name | Company, Account, Organisation, Company Name |
| Company domain | Domain, Website, URL, Company Domain |
| Person name | Name, Full Name, Contact, Visitor, First/Last Name |
| Job title | Title, Job Title, Role, Position |
| LinkedIn URL | LinkedIn, LI URL, Profile URL |
| Email | Email, Work Email, Email Address |
| Pages viewed | Pages, Page Views, URL Visited, Path |
| Visit date | Date, Timestamp, Visit Date, Last Seen |
| Visit count | Visits, Sessions, Visit Count, Times Seen |
| Session duration | Duration, Time on Site, Session Length |
| Traffic source | Source, Referrer, Channel, UTM Source |
| Employee count | Employees, Size, Headcount, Company Size |
| Industry | Industry, Vertical, Sector, SIC |
| Location | Location, City, Country, HQ |

**If a field is missing, work without it.** Score what you can see. Note in the output which fields were unavailable. Never fabricate a data point to complete a score.

**If only company-level data exists with no named person**, that is an anonymous visit. Handle it under Step 6.

## Step 2 — Check relationship status first

Before scoring anything, check DGKCRM. This determines whether to proceed at all.

| Status in CRM | Action |
|---|---|
| **Current DGK client** | Stop. Log the visit. Take no action. Clients browsing the site is normal. |
| **Active deal in progress** | Stop scoring. Notify the deal owner with the visit details. Do not run parallel outreach into an active sales process. |
| **Closed-lost** | Continue — but flag as `Re-engagement`. Something changed. See Step 7. |
| **No relationship** | Continue to Step 3. |

## Step 3 — Run ICP qualification

Before spending any effort on scoring, confirm the company is a fit.

**Use the `dgk-company-qualification` skill.** Do not duplicate ICP logic here — that skill is the single source of truth for DGK's ICP. Run it against the company and use its result.

- **Disqualified** → stop. Log the visit with the disqualification reason. No score, no outreach.
- **Unclear** → score the visit, but route to the Manual Review Queue rather than to outreach.
- **Qualified** → continue to Step 4. Carry forward the matched service and tier — outreach will be anchored to that service.

This ordering matters. Scoring a company that fails ICP wastes effort on a lead that can never convert.

## Step 4 — Score the engagement

Award points for every recorded interaction. Points accumulate across all sources and all sessions.

### Website engagement

| Action | Points |
|---|---|
| Visit to a general page (blog, about, home) | 1 |
| Visit to a service page (SEO, outbound, foundation, content, automation, DGKCRM) | 3 |
| Visit to a pricing page or case studies page | 5 |
| Repeat visit within 14 days | +5 bonus |
| Session duration over 5 minutes | +2 bonus |
| 3 or more pages in a single session | +2 bonus |
| Arrived from a paid ad or targeted campaign | +2 bonus |

### LinkedIn engagement

| Action | Points |
|---|---|
| Profile view | 2 |
| Repeat profile view | +3 bonus |
| Post like | 1 |
| Post comment | 3 |
| Connection request sent to DGK | 5 |

### Direct engagement

| Action | Points |
|---|---|
| Positive email reply | 10 |
| Form submission or content download | 8 |
| Booked a call | Skip scoring — this is a lead, route straight to CRM |

### Time decay

Engagement ages. Apply decay based on when each interaction happened:

- **0–30 days ago** — full points
- **31–60 days ago** — half points, rounded down
- **Over 60 days** — expired, score as zero

Calculate each interaction's decayed value, then total them. A prospect with 20 points earned last week is meaningfully hotter than one with 20 points earned two months ago.

### Multiple people from one company

Score each person individually. Then add a **+5 company bonus** if two or more people from the same company have engaged within a 30-day window — multiple people looking is a stronger signal than one person looking twice.

Rank the individuals within that company by their own scores. The highest scorer becomes the primary contact.

## Step 5 — Assign the band

| Band | Score | Meaning | Action |
|---|---|---|---|
| **Hot** | 15+ | Actively evaluating | Full workflow — enrich, push to CRM, draft outreach, notify for approval |
| **Warm** | 7–14 | Interested, not urgent | Add to nurture. Monitor for a second signal. Appears in the weekly digest. |
| **Cool** | 3–6 | Early awareness | Log only. Watch for a second signal before acting. |
| **Cold** | 1–2 | Passing interest | Log. No action. |

Sitting between bands? Assign the lower one. Over-investing in a marginal signal costs more than waiting for a clearer one.

## Step 6 — Handle anonymous company visits

When a company is identified but no individual is:

1. **Qualify the company first** using `dgk-company-qualification`. If it fails ICP, stop.
2. **Build a hypothesis from the pages viewed.** Which DGK service do the visited pages point to? A company reading the SEO service page has an SEO problem. A company on the outbound page is thinking about pipeline.
3. **Map the likely buying committee.** Based on company size and the service implied, identify the 2–3 roles most likely to have been the visitor. For a 30-person business, that is usually the owner, managing director, or general manager — not a specialist. For a 200-person business, it may be a marketing manager or operations manager.
4. **Find and rank exactly 2 candidates.** Search for people at that company matching those roles. For each, give: name, title, LinkedIn URL, email if available, a one-line rationale, and a confidence rating of High, Medium, or Low.
5. **Flag the top candidate clearly.** If only one strong candidate exists, return one and explain the gap.
6. **Re-enter at Step 4** treating the top candidate as the identified visitor. Score the visit against them.

If no candidates can be found after a reasonable search: log the company visit with pages and context, mark it `Anonymous ICP visit — no candidate identified`, and stop.

## Step 7 — Handle closed-lost re-engagement

A closed-lost account returning is a high-value signal. Something changed.

**Review the history:** when was the deal lost, why, who was involved, what was the scope, how much time has passed.

**Identify what changed:** new leadership, funding, growth, expansion, new job ads, a competitor relationship that may have soured, or a DGK service that did not exist when the deal was lost.

**Assess the current visit:** is the visitor the original contact or someone new? Are they on high-intent pages?

**Then choose a path:**

- **High potential** — significant change, high-intent pages, original objection likely resolved → draft outreach that acknowledges the history honestly, references what changed, and offers a fresh conversation. Notify the original owner and get approval before sending.
- **Medium potential** — some change, moderate intent → nurture sequence, notify the original owner, monitor.
- **Low potential** — little has changed, low intent → log and keep monitoring.

Never pretend it is a first conversation. They will remember. Acknowledging the history openly is what makes re-engagement work.

## Step 8 — Actions by band

### Hot (15+)

1. Confirm ICP qualification is complete and the company is Qualified
2. Enrich the decision-maker via Clay — verified email, LinkedIn, phone where available
3. Push to DGKCRM as a new deal in the `Signal Detected` stage
4. Draft outreach — anchored to ICP fit, role pain, or a company signal. Never the visit.
5. Notify Dilip for approval before anything sends

**Draft the outreach, but never send it.** Hot leads deserve a human decision.

### Warm (7–14)

1. Log to the Clay Visitor Signals table
2. Add to the nurture sequence matched to their likely service need
3. Include in the weekly digest
4. Monitor for a second signal — a second interaction usually pushes them into Hot

### Cool (3–6)

1. Log to Clay
2. No outreach
3. Watch for a second signal within 30 days

### Cold (1–2)

1. Log to Clay
2. No action

## Step 9 — Drafting outreach for Hot leads

Every message is anchored to one of three things:

**ICP fit** — what DGK does for businesses like theirs
**Role pain** — a problem their specific job title owns
**Company signal** — something publicly observable happening at their company right now

Company signals worth anchoring to: a SEEK job ad they have posted, recent hiring across multiple roles, an office or location expansion, funding or acquisition news, a new website launch, or leadership changes.

**Structure:**
1. Opener referencing the signal or a role-specific pain — never the visit
2. One sentence on the outcome DGK produces for businesses like theirs
3. A soft, low-pressure ask

**A correct opener:**
> "Saw [Company] is hiring a Financial Controller — that usually signals a growth stage where the finance function starts outgrowing its systems. Worth a quick conversation about what that looks like operationally?"

**Never write:**
> "I noticed you were on our pricing page..."
> "Saw you checked out our SEO service..."
> "You've been looking at our site a few times..."

The only outreach that may reference an interaction is a reply to a **public LinkedIn comment**:
> "Thanks for the comment on the outbound post — you mentioned [specific thing they said]. Curious how you're handling that at [Company] currently?"

## Step 10 — Output format

Return a ranked table, highest score first, then detail blocks for Hot leads only.

```
VISITOR INTENT REPORT — [date]
Processed: [X] records · Qualified: [X] · Hot: [X] · Warm: [X] · Cool: [X] · Cold: [X]

RANKED
| # | Person | Title | Company | Score | Band | Signal | Next Action |
|---|--------|-------|---------|-------|------|--------|-------------|
```

For each Hot lead, add a detail block:

```
HOT — [Person Name], [Title] at [Company]
Score: [X] ([breakdown: e.g. 5 pricing page + 5 repeat visit + 3 service page + 2 duration])
ICP: Qualified — [Matched Service], Tier [X]
Company signal: [SEEK ad, hiring, funding, expansion — or "none found"]
Contact: [email] · [LinkedIn URL]

DRAFT OUTREACH (approval required):
[The drafted message — anchored to signal or role pain, never the visit]
```

Close with a summary line: how many need approval, how many went to nurture, how many were logged only, and any anonymous companies where no candidate could be identified.

## Edge cases

**Same person appears multiple times in the data.** Consolidate into one record. Sum the points across all their interactions with decay applied per interaction.

**Company matches an existing DGK client.** Stop immediately. Do not score, do not enrich, do not draft. Log it and move on.

**Person's title is missing.** Score the visit normally but mark contact confidence as Low. Flag that the title needs verification before outreach.

**Only company data, no people, and no candidates findable.** Log it as an anonymous ICP visit with the pages viewed. If the same company appears again within 30 days, escalate — repeated anonymous visits from an ICP-fit company are worth manual investigation.

**Data has no dates.** Score without decay. Note in the output that time decay could not be applied and the scores may overstate current intent.

**A Hot lead has no findable email.** Push to CRM anyway with LinkedIn as the channel. Note that email enrichment failed and LinkedIn outreach via HeyReach is the fallback.

**Someone commented on a DGK post and also visited the site.** Reference only the comment. The comment is public and expected to be seen. The visit is not.
