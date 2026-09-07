# Dgk Company Qualification

Source skill pack: `dgk-company-qualification.skill`

Converted to Markdown so Cognee Brain (TextLoader) can ingest it.



---

## File: `SKILL.md`

---
name: dgk-company-qualification
description: Qualify a company against DGK Business Consultancy's Ideal Customer Profile and assign the right service, tier, and next action. ALWAYS use this skill whenever the user asks whether a company is a good fit, a good lead, worth reaching out to, or "should we target this business" — and whenever they paste a company name, website, ABN, LinkedIn URL, SEEK job ad, or a list of companies with any intent to assess them. Also trigger for phrases like "qualify this lead", "is this a fit", "check this against our ICP", "score these companies", "which of these should we target", "run qualification on", "vet this prospect", or when processing website visitors, inbound enquiries, referral introductions, or a Clay table of scraped companies. Trigger even when the user does not say the word "qualify" — assessing fit is the trigger, not the vocabulary.
---

# DGK Company Qualification

Decide whether a company fits DGK Business Consultancy, which service to lead with, what outreach tier they belong in, and what happens next.

The output of this skill is a decision a person can act on immediately — not an essay. Every qualification ends with a service, a tier, and a next action, or a specific disqualification reason.

## The one rule that overrides everything

**Check cheap things before expensive things. Stop at the first failure.**

Enrichment costs credits. Research costs time. A company that fails on geography does not need a revenue lookup. Work down the disqualifier ladder in order and stop the moment something fails.

## Before you start

**Check whether this company was already qualified.** Look for an existing qualification record in the Clay table or DGKCRM. If a result exists:

- **Disqualified less than 90 days ago** → do not re-qualify. Return the existing result and reason.
- **Unclear less than 180 days ago** → do not re-qualify. Return the existing result.
- **Permanently excluded** (see the permanent exclusion list) → never re-qualify. Ever.
- **Qualified previously** → return the existing result unless the user explicitly asks for a re-check or new information has arrived that would plausibly change the outcome.

Re-qualifying a company that was assessed three weeks ago wastes credits and produces the same answer.

## Step 1 — Fast disqualifier ladder

Work through these in order. Stop at the first failure. Most disqualifications happen in the first three checks and cost nothing.

### 1.1 — Already a DGK client?

Check DGKCRM. If they are an existing client, this is not a qualification question. Flag it and ask the user what they actually need — an upsell assessment, a service expansion, or something else entirely.

### 1.2 — Permanently excluded?

These are never DGK clients, regardless of revenue, size, or how good the fit otherwise looks. Never re-qualify.

- MLM, network marketing, or any pyramid-structured business
- Crypto, NFT, Web3 token projects, or trading signal services
- Gambling, betting, casino, or sports wagering
- Adult content or adult services
- Vape, tobacco, or nicotine products
- Payday lending, debt consolidation, or high-interest credit
- Direct competitors — marketing agencies, growth consultancies, SEO agencies, lead generation agencies, or anyone selling outbound-as-a-service

Reason: reputational risk, ad platform bans, payment processor refusal, and conflict of interest. These are permanent, not temporary.

### 1.3 — Geography

DGK is an Australian consultancy. Australian local search, Australian directories, and SEEK signals are the core competitive advantage — none of that transfers offshore.

| Geography | Status | Note |
|---|---|---|
| Darwin and NT | **Tier 1 geography** | Home market, in-person capability |
| Sydney, Melbourne, Brisbane, Perth, Adelaide | **Tier 2 geography** | Full service, remote delivery |
| Regional Australia | **Tier 3 geography** | Full service, remote delivery |
| International (USA, NZ, Nepal, India, elsewhere) | **Qualified but flagged** | Inbound or referral only — never targeted in outbound campaigns |

If a company is international and the source is an outbound campaign, disqualify with reason: "International — outbound targeting is Australia only."

If a company is international and the source is inbound, referral, or an existing relationship, continue qualifying but flag it as `International — Referral Only`.

### 1.4 — Business model fit

Determine whether they are **B2B** (sell to other businesses or organisations) or **B2C** (sell to individual consumers).

This does not disqualify — it routes. A B2C tradie is a perfectly good DGK client. They just get SEO, not outbound. Never disqualify a company for being B2C. Route them instead.

### 1.5 — Time in business

| Client Type | Minimum | Reason |
|---|---|---|
| Tradie / local service | **6 months** | Enough operating history to have a Google presence to work with |
| Professional services | **6 months** | Enough to prove they can win a client and keep them |

Under 6 months → disqualify with reason: "Under 6 months in business — insufficient operating history."

### 1.6 — Client base

| Client Type | Minimum | Reason |
|---|---|---|
| Tradie / local service | Operating with regular work | Proof they can deliver |
| Professional services | **3+ existing clients** | Proof of concept — a firm with 1 client has not validated their offer |

Professional services with fewer than 3 clients → disqualify with reason: "Fewer than 3 existing clients — no proven product-market fit."

### 1.7 — Team size

| Client Type | Minimum |
|---|---|
| Tradie / local service | Solo operator acceptable |
| Professional services | **Solo operator with 3+ clients, OR 2+ employees** |

A solo professional services operator with 3 or more clients qualifies. A solo operator with 1 client does not.

### 1.8 — Revenue (check last — usually requires enrichment)

| Client Type | Minimum Monthly Revenue |
|---|---|
| Tradie / local service | **$3,000 AUD** |
| Professional services | **$5,000 AUD** |

Below threshold → disqualify with reason stating the actual figure and the requirement, for example: "$1,800/month — tradie minimum is $3,000/month."

If revenue cannot be determined after reasonable effort, do not fabricate a number. Mark as `Unclear` and note that revenue could not be established.

### 1.9 — Behavioural disqualifiers

These come from conversation, an enquiry form, a discovery call, or an email exchange. They are not found through enrichment — they surface through interaction. Apply them whenever the information is available.

| Signal | Reason to disqualify |
|---|---|
| Cannot define their ideal client when asked | Every DGK service starts with ICP. If they cannot answer this, the engagement fails at step one. |
| Wants guaranteed results or performance-only pricing | Not DGK's model. Legal and financial risk. |
| Wants done-for-you with zero involvement | Fundamentally incompatible with the done-with-you model. |
| Expects results in under 30 days | Expectation mismatch. SEO takes 3–4 months. Outbound takes 2–3 months to first client. |
| Says "marketing never works" without specifics | Coachability red flag. Usually indicates unrealistic expectations or unwillingness to do their part. |
| Refuses to grant access to their own accounts | DGK cannot build on infrastructure it cannot access. |

## Step 2 — Assign the lead service

If the company passes every disqualifier, work down this priority order and assign the **first** service that matches. This order is fixed.

### Priority 1 — Foundation Plan

**Assign if any of these are true:**
- No website, or a website that is broken, slow, or not mobile-friendly
- No CRM, or leads managed in an email inbox or spreadsheet
- No online booking or automated follow-up when someone enquires
- Spending on ads or marketing but not converting the traffic
- Recently started and building properly from day one

Foundation always comes first when the infrastructure is missing. Nothing else works without it — outbound generates replies that land on a broken website, SEO delivers traffic that converts nowhere, ads waste budget into a leaky bucket.

### Priority 2 — Outbound Lead Generation

**Assign if all of these are true:**
- Business model is **B2B** — sells to other businesses or organisations
- Working digital infrastructure already exists (or Foundation is being delivered alongside)
- Deal value justifies the effort — typically $2,000+ per client engagement
- A signal source exists for their target market (SEEK job ads, LinkedIn job titles, or an equivalent trigger)

**Never assign outbound to a B2C business.** A residential plumber does not cold email homeowners. Route them to SEO.

**Signal map by target industry:**

| Their target is... | SEEK / LinkedIn signal | Meaning |
|---|---|---|
| Accounting firms targeting growing businesses | Financial Controller, CFO, Accounts Manager, Bookkeeper, Finance Manager | Company is scaling its finance function |
| IT/MSP targeting companies outgrowing self-managed IT | IT Manager, Systems Administrator, IT Support, Network Engineer | Company needs IT capacity — plus BuiltWith showing no MSP detected |
| Commercial cleaning / real estate targeting property owners | Facilities Manager, Property Manager, Asset Manager, Building Manager | Company is expanding its property footprint |
| Education consultancy targeting corporate training buyers | L&D Manager, Training Coordinator, HR Manager, People and Culture | Company has an active training budget |
| NDIS provider targeting referrers | Support Coordinator, Physiotherapist, Occupational Therapist, Social Worker (LinkedIn, by location) | Allied health professionals who refer participants |
| Recruitment agency targeting hiring businesses | Any active hiring across multiple roles | Company is in a growth phase |

### Priority 3 — SEO System

**Assign if all of these are true:**
- Business model is **B2C** or local service — customers search Google before buying
- Working website exists (or Foundation is being delivered alongside)
- They serve a defined geographic area
- Google Maps and organic search are realistic lead sources for their category

This is the default lead service for tradies: plumbers, electricians, cleaners, roofers, tilers, mechanics, barbers, cafés, restaurants.

### Priority 4 — Automation Systems

**Assign if all of these are true:**
- Working infrastructure already exists — website, CRM, tools in place
- Repetitive manual work is consuming meaningful time
- Multiple disconnected tools that do not talk to each other
- They have described a manual process they repeat weekly

### Priority 5 — Content System

**Assign if:**
- Foundation exists and at least one lead generation channel is already running
- They are posting inconsistently or not at all
- Their buyers research before purchasing — long consideration cycles, trust-driven decisions

Content is a layer, not a starting point. It multiplies other channels rather than generating leads alone.

### Priority 6 — LinkedIn Ads

**Assign only if all of these are true:**
- Foundation, plus at least one of Outbound or SEO, is already running
- B2B with average deal value above $3,000 AUD
- Decision-makers are identifiable by job title on LinkedIn
- Budget exists beyond the service fee for actual ad spend

LinkedIn Ads is never a starting point. It amplifies a working system. Assigning it to a company with no website, no CRM, and no content wastes their money and damages the relationship.

### Standalone — DGKCRM

DGKCRM is bundled inside every Foundation Plan, but it is also a valid standalone entry point.

**Assign DGKCRM as the lead service if:**
- They are paying for multiple disconnected tools — a separate CRM, email marketing platform, booking tool, invoicing tool, and review management tool
- They want consolidation more than they want lead generation
- Their budget suits a $99–149/month recurring engagement rather than a full build

This is a low-delivery-cost recurring client. Worth qualifying for on its own.

## Step 3 — Assign the outreach tier

| Tier | Channels | Revenue | Signal | Contact data | Geography |
|---|---|---|---|---|---|
| **T1 — Omnichannel** | Email + LinkedIn + phone | $15,000+/month | Active signal within 14 days | Verified email + LinkedIn + phone | Darwin or major AU city |
| **T2 — Multichannel** | Email + LinkedIn | $6,000–15,000/month | Signal within 30 days, or strong ICP fit without a signal | Verified email + LinkedIn | Anywhere in Australia |
| **T3 — Email only** | Email | $3,000–6,000/month | No active signal, but fits the profile | Verified email minimum | Anywhere in Australia |

If a company sits between tiers, assign the lower tier. Over-investing outreach effort in a marginal fit costs more than under-investing in a good one.

## Step 4 — Write the result back

Write these seven fields to the Clay table. Qualified companies then push to DGKCRM. Disqualified companies stay in Clay with the reason logged, and are never re-enriched.

| Field | Values | Notes |
|---|---|---|
| `Qualification Status` | Qualified / Disqualified / Unclear / Unclear — High Priority | Four possible values only |
| `Matched Service` | Foundation Plan / Outbound / SEO / Automation / Content / LinkedIn Ads / DGKCRM | The lead service, singular — never a list |
| `Tier` | T1 / T2 / T3 | Blank if disqualified |
| `Disqualification Reason` | Free text | Must be specific and include the actual figure — "8 months in business, $2,400/month — tradie minimum is $3,000/month" |
| `Qualified Date` | Date | Drives the 90-day and 180-day re-check windows |
| `Signal Detected` | Free text | Which SEEK role, LinkedIn title, or intent trigger fired — blank if none |
| `Next Action` | Free text | The single concrete next step — "Add to T2 Smartlead sequence — accounting ICP" or "Park until March 2027 — revenue below threshold" |

## Making the call

**Qualified** — passes every disqualifier and matches at least one service. Assign the service, the tier, and a next action.

**Disqualified** — fails one or more criteria. Always state the specific figure and the requirement. Never write "does not meet ICP" with no detail — that tells nobody anything and forces a re-check later.

**Unclear** — a critical data point could not be found after reasonable effort. State exactly what is missing and whether it is worth pursuing. Route to the Manual Review Queue for weekly batch review.

**Unclear — High Priority** — genuinely uncertain but obviously high value, for example a 40-person accounting firm in Sydney with an active SEEK signal but no revenue data available. Surface these immediately rather than parking them for the weekly batch.

## Edge cases

**Multiple services match.** Assign only the first match in the priority order. Note the secondary opportunity in `Next Action` — for example: "Lead with Foundation. Outbound is the natural follow-on once infrastructure is live."

**B2C business asking about outbound.** Never disqualify for this. Requalify them for SEO and note it: "B2C — outbound not applicable. Routed to SEO System."

**Borderline on one criterion.** A company at $2,800/month against a $3,000 minimum, or 5 months in business against a 6-month minimum, is worth flagging rather than hard-rejecting. Mark as `Unclear` with the specific figure noted and let a human decide.

**Company has grown since a previous disqualification.** If more than 90 days have passed and there is evidence of growth — new job ads, expanded team, new website — re-qualify. That is exactly what the 90-day window exists for.

**No revenue data available anywhere.** Do not guess. Do not estimate from employee count alone. Mark as `Unclear`, note that revenue could not be established, and specify what would resolve it.

**International company arrives through inbound or referral.** Continue qualifying. Flag as `International — Referral Only` so it never enters an outbound campaign.

**Existing client appears in a prospect list.** Flag immediately. Do not qualify. Ask the user whether they meant to assess an upsell or expansion opportunity.

## Output format

Return a compact block. No essay, no preamble.

```
COMPANY: [name]
STATUS: Qualified
SERVICE: Outbound Lead Generation
TIER: T2
SIGNAL: SEEK — Financial Controller, posted 8 days ago
GEOGRAPHY: Sydney, NSW
NEXT ACTION: Add to T2 Smartlead sequence — accounting ICP. Enrich decision-maker LinkedIn before launch.
```

For a disqualification:

```
COMPANY: [name]
STATUS: Disqualified
REASON: 4 months in business, 1 client — minimum is 6 months and 3+ clients for professional services.
RE-CHECK: After 90 days (from date of assessment)
```

When qualifying a list, return one block per company, then a summary line: how many qualified, how many disqualified, how many unclear, and the tier breakdown of the qualified ones.
