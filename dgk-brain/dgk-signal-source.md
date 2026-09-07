# Dgk Signal Source

Source skill pack: `dgk-signal-source.skill`

Converted to Markdown so Cognee Brain (TextLoader) can ingest it.



---

## File: `SKILL.md`

---
name: dgk-signal-source
description: Design and run signal-based outbound for a DGK client — pick which buying signals to detect, build the detection stack, score and rank the signals, and turn each one into a timed play with drafted outreach. ALWAYS use when Dilip says "buying signals", "signal-based", "triggers", "what should we watch for", "intent data", "job change tracking", "hiring signals", "who's in market", "warm outbound", or pastes visitor data, engagement exports, LinkedIn viewer lists, a Swan CSV, post-engagement data, or any table of companies and people who have interacted with DGK or a client. Also trigger on "who visited the site", "score these leads by intent", "which of these are hot", "who's been engaging", "process this export", "the list is exhausted", or "we've run out of people to email". Trigger even without the word "signal" — the presence of interaction, engagement or trigger data is the trigger. Replaces the older dgk-visitor-intent skill. Internal DGK use only.
---

# DGK Signal Source

Signal-based outbound replaces volume with timing. Fifty messages sent to people with a
live reason to care outperform a thousand sent to a list that merely fits.

| Approach | Total reply | Positive reply |
|---|---|---|
| Cold, firmographics only | 4–8% | 1–2.5% |
| Single live signal | 8–15% | 3–6% |
| Three or more stacked signals | 15–25% | 6–10% |

These are Australian B2B services figures on verified lists and warmed domains. They are
**directional, not promised** — say that to clients in those words. Do not quote US SaaS
signal benchmarks; they run roughly 4–5× these and will produce a forecast DGK can't hit.

Note which column is which. A signal campaign roughly **doubles to triples the positive
reply rate**. It does not quadruple the total reply rate, and a client who has been told
"35% reply" will consider a working campaign a failure at 12%.

## Runs standalone

This skill needs nothing from any other skill. Mode B in particular is a cold entry point
— someone pastes an export and it runs. If `dgk-list-building` has produced an ICP, use
it; if not, Mode A's intake collects what's needed.

**Chain position (when chained):** `dgk-list-building` → `dgk-signal-source` →
`dgk-clay-workflow` → `dgk-email-campaign`. The list defines *who*. This skill defines
*when*, and supplies the opener.

## Two modes — read the request and pick one

- **Mode A — Design.** "What signals should we watch for [client]?" Build the signal
  strategy and the detection stack. Produces a **Signal Strategy** (client) and a
  **Detection Build Plan** (DGK internal).
- **Mode B — Process.** Data has arrived. Score it, rank it, action it. Produces a
  **Signal Report**.

If the request is "we've run out of people to email", that is Mode A. An exhausted TAM is
the single strongest reason to build signals: the same market, re-entered on timing,
becomes a renewable list instead of a finite one.

---

# The rule that overrides everything

**Never reference a website visit or a LinkedIn profile view in outreach.**

The prospect does not know they were identified. "Saw you were checking out our site"
reads as surveillance and destroys trust in one sentence. A de-anonymised visit is
internal targeting intelligence — it tells you *who* and *when*, nothing more.

| Signal source | Reference it in outreach? |
|---|---|
| Website visit (de-anonymised) | Never |
| LinkedIn profile view | Never |
| LinkedIn post like | Never — too passive to acknowledge naturally |
| LinkedIn post comment | Yes — public, deliberate, expects a response |
| Job ad, funding, expansion, hiring, tender, licence | Yes — publicly published by them |
| Newsletter or content download | Yes, if they gave the address |
| Instagram story view | Only where a relationship already exists |

Everything else anchors to: ICP fit, a pain the role owns, or a publicly observable
company event.

---

# Mode A — Design the signal strategy

## Step 1 — Intake

1. **Client and offer.** What triggers a business to actually need this?
2. **When do their best clients buy?** Ask what was happening at the business the month
   before they signed. This is the highest-value question in the whole skill — real buying
   moments beat theoretical trigger lists every time.
3. **What can we observe from outside?** Not every trigger leaves a public trace.
   Separate the ones that do from the ones that don't.
4. **Budget.** Signal detection ranges from free to several hundred a month. What will
   this client fund?
5. **Volume needed.** How many signal-triggered contacts per month does the campaign need
   to sustain itself?
6. **Who acts, and how fast?** A signal with no owner and no SLA is a dashboard. If the
   client is handling replies themselves and checks email twice a week, design for that
   rather than pretending otherwise.

If no ICP exists yet, also ask: industry, headcount band, geography, and the titles that
own the pain. Enough to qualify a signal — not a full ICP build. Point to
`dgk-list-building` if they want the full version.

## Step 2 — Select the signals

Load `references/signal-taxonomy.md` for the full set by category, with AU detectability
and window for each.

Choose against three criteria, in this order:

1. **Causality.** Does this event actually create need for the client's offer, or is it
   merely correlated with growth? A funding round makes almost everyone a "signal" — which
   makes it a weak one.
2. **Detectability.** Can DGK observe it reliably, at reasonable cost, in Australia? Many
   US-centric signals have no AU equivalent, and several AU signals have no US equivalent
   and are therefore missing from every imported playbook.
3. **Window.** How long does the opportunity stay open? A job change peaks at 14–45 days.
   A job ad is live until it's filled. A licence registration is good for months.

**Pick 2–4 signals.** More than four and nothing gets detected reliably. Fewer than two
and volume collapses when one source dries up — and sources dry up.

For most DGK clients selling to Australian SMBs, the reliable set is:

| Signal | Why it works here | Detection | Cost |
|---|---|---|---|
| **Job ads on SEEK** | Best AU signal by a distance. Budget approved, need is explicit, publicly posted, and referenceable without awkwardness | Apify actor | Free tier viable |
| **New in role** | 14–45 day window where a new leader is actively replacing vendors and processes | Sales Nav spotlight | Already licensed |
| **LinkedIn post engagement** | Public, deliberate, directly referenceable — comments especially | Apify actor on client and competitor posts | Apify compute |
| **Company expansion** | New location, new licence, new registration — highly visible for AU service businesses | Register monitoring, Google Maps, rss.app | Free to low |

## Step 3 — Build the scoring model

Load `references/signal-scoring.md` for weights, the decay curve, stacking rules, bands
and SLAs.

```
Signal points  ×  recency multiplier  =  contact score
+ stacking bonus where multiple signals hit the same account
= band  →  action + SLA
```

The bands and their SLAs are what turn a score into a system. A signal acted on in week
three is worth almost nothing — the whole advantage was timing, and it's gone.

Implement the score as a **Clay formula column**. Formulas cost zero credits and are
debuggable; an AI column doing arithmetic is neither.

## Step 4 — Write the plays

Every selected signal becomes a play. Load `references/plays.md` for worked examples
across DGK's verticals.

```
PLAY: [name]
Trigger:        [exactly what fires this — the observable event and its threshold]
Qualification:  [ICP check that must pass before acting]
Window:         [how long the signal stays live]
SLA:            [time from detection to first touch]
Sequence:       [day-by-day, channel by channel]
Opener:         [the actual first line, referencing the public signal]
Owner:          [who acts]
Exit:           [what happens on no response, and when it stops]
```

A signal without a play is a dashboard. Clients pay for the play.

## Step 5 — Output

### Artefact A — Signal Strategy (client-facing)

```
SIGNAL STRATEGY — [Client] — [date]

1. WHEN YOUR BUYERS ACTUALLY BUY
   [The 2-4 buying moments, in plain English, tied to their real client history]

2. HOW WE'LL SEE IT HAPPENING
   [Detection method per signal, non-technical]

3. WHAT WE DO WHEN IT FIRES
   [The plays: trigger -> timing -> what gets sent]

4. WHY THIS BEATS COLD OUTREACH
   [Benchmark table, framed as directional not promised.
    Show total AND positive reply. Never show total alone.]

5. EXPECTED VOLUME
   [Signals/month per source, and what that means for pipeline.
    Be conservative — under-promising volume here is cheap; over-promising
    turns a working campaign into a failed one.]

6. WHAT IT COSTS
   [Tooling, honestly, with the free-first phasing]

7. WHAT WE WON'T DO
   [The surveillance rule, stated plainly. Clients respect this and it
    pre-empts the "why didn't you mention they visited" question.]
```

### Artefact B — Detection Build Plan (DGK internal)

```
DETECTION BUILD PLAN — [Client] — [date]

SIGNAL 1: [name]
  Source:       [Apify actor / Sales Nav saved search / rss.app feed / register]
  Frequency:    [how often it runs]
  Destination:  [Clay table name]
  Dedupe key:   [so the same job ad doesn't fire twice]
  Freshness:    [how old before it's discarded]
  Volume est:   [signals/month]
  Cost:         [per month]
  Fallback:     [what to do when the source breaks — and it will]

[Repeat per signal]

SCORING
  Weights:      [per signal]
  Decay:        [curve]
  Bands + SLAs: [table]
  Implemented as: Clay formula column, 0 credits

ROUTING
  Hot   -> [action, owner, SLA]
  Warm  -> [action]
  Cool  -> [action]
  Cold  -> [log only]

MONITORING
  [ ] Weekly check that each source is still returning data
  [ ] Monthly signal-to-positive-reply rate per signal type
  [ ] Kill any signal under 2% positive reply after 100 sends
  [ ] Volume check: is each source producing the estimated monthly count?
```

---

# Mode B — Process incoming signal data

Use when a CSV, export, dashboard screenshot, or pasted table arrives.

## Step 1 — Map the fields

Column names differ across every tool. Map by meaning, not by exact name.

| What you need | Common names |
|---|---|
| Company | Company, Account, Organisation |
| Domain | Domain, Website, URL |
| Person | Name, Full Name, Contact, Visitor |
| Title | Title, Job Title, Role, Position |
| LinkedIn | LinkedIn, LI URL, Profile URL |
| Email | Email, Work Email |
| Pages viewed | Pages, Page Views, Path, URL Visited |
| Date | Date, Timestamp, Last Seen |
| Count | Visits, Sessions, Times Seen |
| Duration | Duration, Time on Site |
| Source | Source, Referrer, UTM Source |
| Size | Employees, Headcount, Company Size |

**If a field is missing, work without it.** Score what's visible, and state in the output
which fields were unavailable. Never fabricate a data point to complete a score.

## Step 2 — Check relationship status first

Before scoring anything, check the CRM.

| Status | Action |
|---|---|
| Current client | Stop. Log it. Clients browsing the site is normal. |
| Active deal in progress | Stop scoring. Notify the deal owner. Never run parallel outreach into a live sales process. |
| Closed-lost | Continue, flagged as re-engagement. See Step 6. |
| Contacted in a prior campaign | Continue only if 90+ days have passed and the angle is genuinely different. |
| No relationship | Continue. |

## Step 3 — Qualify against ICP

For DGK's own signals, run `dgk-company-qualification` — it is the source of truth for
DGK's ICP. For a client's signals, use the ICP from `dgk-list-building` if it exists; if
it doesn't, qualify against the criteria in the data itself (industry, headcount,
geography, title) and say in the output that the ICP check was approximate.

- Disqualified → stop. Log with the reason. No score, no outreach.
- Unclear → score it, but route to manual review, not to outreach.
- Qualified → continue, carrying forward the matched service and tier.

Scoring a company that fails ICP spends effort on a lead that cannot convert.

## Step 4 — Score

Load `references/signal-scoring.md`. Apply points, then recency decay, then stacking
bonus, then assign the band.

Sitting between bands? Assign the lower one. Over-investing in a marginal signal costs
more than waiting for a clearer one.

## Step 5 — Handle anonymous company visits

Company identified, no individual:

1. Qualify the company. Fails ICP → stop.
2. Build a hypothesis from the pages viewed. Which service do they point to?
3. Map the likely buyer from company size and the implied service. At 30 people that's the
   owner or GM, not a specialist. At 200 it may be a functional manager.
4. Find and rank exactly 2 candidates: name, title, LinkedIn, email if available, one-line
   rationale, confidence High/Medium/Low.
5. Re-enter at Step 4 treating the top candidate as the visitor.

No candidates findable → log as `Anonymous ICP visit — no candidate identified`. If the
same company reappears within 30 days, escalate for manual investigation.

## Step 6 — Closed-lost re-engagement

A closed-lost account returning is high value. Something changed.

Review: when and why it was lost, who was involved, how long ago. Identify what changed —
leadership, funding, growth, new job ads, a new service DGK or the client didn't offer
then. Assess whether the current visitor is the original contact or someone new.

- **High potential** — real change, high-intent behaviour, original objection likely
  resolved → draft outreach that acknowledges the history honestly. Notify the original
  owner. Get approval before sending.
- **Medium** — some change → nurture, notify the owner, monitor.
- **Low** — little changed → log and keep watching.

Never pretend it's a first conversation. They remember. Acknowledging the history openly
is what makes re-engagement work.

## Step 7 — Draft outreach for Hot only

Anchor every message to one of three things: **ICP fit**, **role pain**, or a **publicly
observable company signal.** Never the visit.

Structure: opener referencing the public signal or role pain → one sentence on the outcome
→ soft ask.

Correct:
> "Saw [Company] is hiring a Financial Controller — that usually means the finance
> function is outgrowing its systems. Worth a quick chat about what that looks like
> operationally?"

Never:
> "I noticed you were on our pricing page..."
> "Saw you checked out our services..."

The one exception, a public LinkedIn comment:
> "Thanks for the comment on the outbound post — you mentioned [specific thing]. How are
> you handling that at [Company] at the moment?"

**Draft, never send.** Hot leads get a human decision.

## Step 8 — Output

```
SIGNAL REPORT — [date]
Processed: [X] · Qualified: [X] · Hot: [X] · Warm: [X] · Cool: [X] · Cold: [X]
Fields unavailable in this data: [list, or "none"]

RANKED
| # | Person | Title | Company | Score | Band | Signal | Next action |
```

Then a detail block per Hot lead:

```
HOT — [Name], [Title] at [Company]
Score: [X] ([breakdown])
ICP: Qualified — [service], Tier [X]
Public signal: [job ad / hiring / expansion — or "none found"]
Contact: [email] · [LinkedIn]

DRAFT OUTREACH (approval required):
[Message — anchored to signal or role pain, never the visit]
```

Close with: how many need approval, how many went to nurture, how many were logged only,
and any anonymous companies where no candidate could be identified.

---

# Recommended build order for DGK

Nothing is live yet. Do not buy a signal stack. Build it in phases, and let each phase
prove itself before the next gets funded. Full detail in `references/detection-stack.md`.

**Phase 1 — free, this month.** SEEK job ads via Apify. Sales Nav "changed jobs in past 90
days" spotlight on saved searches. rss.app feeds for competitor and industry news.
LinkedIn post engagement scraped from DGK's own posts. Cost: existing tooling only. This
phase alone supports a signal-based campaign.

**Phase 2 — once Phase 1 is producing meetings.** Expand the Apify layer: competitor post
engagement, Google Maps monitoring for new locations, register change monitoring for the
verticals DGK serves. Add rss.app feeds per client. Cost: low, mostly Apify compute.

**Phase 3 — only when a client will fund it.** Website de-anonymisation. Note carefully:
**RB2B's person-level identification is US-only.** For Australian traffic it returns
company-level data only, which materially changes what it's worth. For AU, evaluate
company-level tools and treat person-level identification as unavailable — build the
workflow around company-level visits plus candidate inference (Mode B, Step 5) rather than
assuming a named person will arrive.

Do not sell person-level AU website de-anonymisation to a client. It does not reliably
exist.

---

# Absorbed from dgk-visitor-intent

This skill replaces `dgk-visitor-intent`. The surveillance rule, the scoring model, the
anonymous-visit inference, the closed-lost handling and the output format are all carried
forward. Turn the old skill off once this is installed — running both causes trigger
collisions on visitor and engagement data.

# Edge cases

**Same person appears multiple times.** Consolidate to one record. Sum points across
interactions with decay applied per interaction, not to the total.

**Company matches an existing client.** Stop immediately. Do not score, enrich or draft.

**Title missing.** Score normally, mark contact confidence Low, flag that the title needs
verification before outreach.

**No dates in the data.** Score without decay and say so in the output — the scores
overstate current intent.

**Hot lead with no findable email.** Push to CRM with LinkedIn as the channel. Note the
enrichment failure. LinkedIn Helper is the fallback path.

**Someone commented on a post and also visited the site.** Reference only the comment.

**A signal source silently stops returning data.** This is the most common failure and it
is invisible — the campaign just goes quiet. The weekly source check exists for exactly
this. Treat "no signals this week" as a fault to investigate, not a slow week.

**Client asks why we didn't mention that a prospect visited their site.** Explain the rule
and why it protects them. This conversation happens once per client and the answer is
always worth giving properly.

**Signal volume is too low to sustain the campaign.** Common in small AU niches — a
2,000-company market might generate 30 job ads a month. Signals are then a *priority
layer* on a cold campaign, not a replacement for it. Say so rather than promising a
signal-only program that can't fill a calendar.

**The client wants "intent data".** They usually mean Bombora or 6sense. At AU deal sizes
and with AU coverage, neither is worth it. Say so directly and show what the free Phase 1
stack detects instead.

**Everything is scoring Hot.** The thresholds are wrong, not the market. Recalibrate so
Hot is roughly the top 10–15% — a band that catches half the list is a list, not a band.




---

## File: `detection-stack.md`

# Detection Stack — Building It Without Buying Anything First

Nothing is live yet. The correct order is free first, prove it, then fund the next layer.
Most agencies do the reverse: buy a signal tool, discover the signals don't convert, and
have nothing to show for the spend.

---

# Phase 1 — Free, using tooling DGK already has

This phase alone supports a signal-based campaign. Do not skip to Phase 3.

## 1.1 SEEK job ads via Apify

The highest-value AU signal, and it costs Apify compute only.

```
Source:      Apify actor against SEEK search results
Query:       [target role keywords] + [location] + [classification]
Frequency:   Daily
Capture:     Company, role title, location, posted date, ad body, ad URL
Destination: Clay table, one row per ad
Dedupe key:  Ad URL (stable). Never company name — the same company posts repeatedly
             and each ad is a separate signal.
Freshness:   Discard ads over 45 days old at ingestion
Fallback:    SEEK layout changes break actors periodically. Secondary: the company's
             own careers page via Firecrawl; tertiary: Indeed.
```

**Read the ad body, not just the title.** AU job ads routinely name the systems in use,
the team size, and the actual problem. That detail is what makes the opener specific
instead of generic — and it is sitting in plain text that nobody else on the campaign is
reading.

Match the ad's company to a domain before it enters the scoring table. Ads carry company
names, not domains, and everything downstream needs the domain.

## 1.2 New in role via Sales Navigator

Free. Already inside the licence. Most under-used capability DGK owns.

```
Source:      Sales Nav saved search + "Changed jobs in past 90 days" spotlight
Setup:       One saved search per client per persona, filters matching the ICP
Frequency:   Weekly review, or set the saved-search alert
Capture:     Name, title, company, LinkedIn URL, approximate start date
Destination: Export via LinkedIn Helper or Evaboot -> Clay
Delay:       Do not action before day 14. See Play 2.
Fallback:    None needed — this is the most stable source in the stack
```

Also turn on **"Posted on LinkedIn in past 30 days"** on the same saved searches. It costs
nothing and splits the list into people who will see a LinkedIn touch and people who won't.

## 1.3 LinkedIn post engagement via Apify

```
Source:      Apify LinkedIn post-engagement actor
Targets:     The client's own posts, then competitor posts, then relevant
             industry-figure posts
Frequency:   Every 2-3 days while posts are fresh
Capture:     Name, profile URL, engagement type (comment vs like), comment text,
             post URL, date
Destination: Clay
Dedupe key:  Profile URL + post URL
Freshness:   7 days — after that the comment is stale to reference
Fallback:    Manual review of the post's engagement list. Tedious but reliable.
```

**Store the comment text.** The comment is the opener. A row that records "commented" and
discards what they said is worth almost nothing.

Requires the client to actually post. Check this at intake — if the client hasn't posted in
six months, this source produces zero and shouldn't be in the strategy document.

## 1.4 News and register monitoring via rss.app

```
Source:      rss.app feeds
Feeds:       Client's named target accounts · industry press · regulator
             announcements · state tender portals · local business press
Frequency:   Daily digest
Destination: Review manually at first. Automate into Clay once the feed proves
             it produces usable signals.
Fallback:    Google Alerts as a crude backup
```

Start manual. Most feeds produce noise for the first fortnight while you learn which ones
carry signal, and automating noise just moves the problem into Clay.

---

# Phase 2 — Once Phase 1 is producing meetings

Fund this only when Phase 1 has booked meetings attributable to signals. Cost is mostly
Apify compute.

## 2.1 Google Maps monitoring for new locations

```
Source:      Apify Google Maps actor, run on a fixed query set
Query:       [category] + [region], re-run monthly, diffed against last month
Signal:      New entries = new site or new business
Destination: Clay
Note:        The diff is the signal. Storing last month's run is the entire mechanism —
             without history there is no signal.
```

## 2.2 Register change monitoring

The AU edge. Public, free, structured, and invisible to competitors using imported
playbooks.

| Vertical | Register | What the change means |
|---|---|---|
| NDIS | NDIS Commission registered provider register | New registration group = new service line |
| Aged care | My Aged Care / ACQSC | New approved service |
| Allied health | AHPRA | Practitioner joined or left a practice |
| Construction | State licensing (QBCC, VBA, NSW Fair Trading) | New licence class = new work type |
| Childcare | ACECQA | New approved service |
| Companies | ASIC | Insolvency notices, director changes |

```
Method:      Apify or Firecrawl, monthly, diffed against the prior run
Destination: Clay
Note:        Check each register's terms before scraping and record the check in
             the build plan.
```

## 2.3 Tender portals

```
Source:      AusTender + relevant state portals via rss.app or Firecrawl
Frequency:   Daily — windows are short
Capture:     Issuing body, category, close date, value band, tender URL
SLA:         48 hours. The tightest in the stack.
```

## 2.4 Champion tracking

Costs nothing but discipline.

```
Source:      A permanent Sales Nav list per client of every positive-reply contact
Frequency:   Monthly check for job changes
Trigger:     Contact appears at a new company that passes ICP
Note:        This list only works if it is maintained from day one of every
             campaign. Start it now, for every client, even before the signal
             program exists.
```

---

# Phase 3 — Only when a client will fund it

## Website de-anonymisation

**RB2B's person-level identification is US-only.** For Australian traffic it returns
company-level data at best, which materially changes what the tool is worth and what can be
promised.

| Tool | AU coverage | Level |
|---|---|---|
| RB2B | Poor | Person-level US only; company-level at best in AU |
| Dealfront (Leadfeeder) | Best AU/EU coverage of the group | Company-level |
| Swan | Reasonable | Company-level |

For AU, treat person-level identification as unavailable and build the workflow around
**company-level visit + candidate inference** (Mode B, Step 5 in SKILL.md).

**Do not sell person-level AU website de-anonymisation to a client.** It does not reliably
exist, and the client will eventually ask why the named contacts never arrive.

## What not to buy

| Tool | Why not |
|---|---|
| Bombora | Intent topics have thin AU coverage and the price doesn't survive AU deal sizes |
| 6sense | Same, plus a platform commitment DGK doesn't need |
| Clearbit Reveal | US-weighted; Dealfront is the better AU equivalent |

If a client asks for "intent data", show them what the free Phase 1 stack detects instead.
A live SEEK job ad is a stronger buying indicator than a surge score on a research topic,
and it comes with an opener attached.

---

# Monitoring — the part that gets skipped

The most common failure in a signal program is **silent source failure**. The scraper
breaks, the campaign goes quiet, and because quiet weeks are normal nobody investigates
for a month.

**Weekly, per source:**
```
[ ] Did it return data this week?
[ ] Is the volume within the expected range?
[ ] Spot-check 3 rows — is the data still parsing into the right fields?
```

Treat **"no signals this week" as a fault to investigate, not a slow week.** Set an
expected minimum volume per source at build time so "zero" is visibly wrong rather than
plausibly quiet.

**Monthly, per signal type:**
```
Signals detected · contacts reached · total reply % · positive reply % ·
meetings booked · cost per meeting
```

Kill any signal type under 2% positive reply after 100 sends.

**Per source, document the fallback at build time.** Every scraper breaks eventually. The
plan for when it does belongs in the build plan, written before it's needed, not improvised
in the week the pipeline goes quiet.

---

# Cost summary

| Phase | Monthly cost | What it delivers |
|---|---|---|
| Phase 1 | Existing tooling only — Apify compute, Sales Nav licence, rss.app free tier | 50–140 signal contacts/month in a 2,000-company niche |
| Phase 2 | Low — additional Apify compute, rss.app paid tier if feed count grows | +20–40% signal volume, plus the AU register edge |
| Phase 3 | Per client, tool-dependent | Company-level visit data only in AU |

Phase 1 is enough to sell a signal-based campaign and enough to deliver one. Everything
after it is optimisation.




---

## File: `plays.md`

# Plays — Signal to Sequence

A play is the whole unit: trigger, qualification, window, SLA, sequence, opener, owner,
exit. A signal without a play is a dashboard.

All openers below reference something the target **published**. None reference a visit, a
profile view, or a like.

---

## Play 1 — Job ad for the role we replace

**Applies to:** accounting, bookkeeping, MSP, recruitment, virtual admin, NDIS back-office

```
Trigger:        SEEK ad posted for [target role] at an account passing ICP
Qualification:  Industry, headcount, geography match. Not an existing client,
                not in open pipeline, not contacted in the last 90 days.
Window:         Until the ad closes, typically 3-6 weeks
SLA:            24 hours from detection
Owner:          Dilip (Hot) / sequence (Warm)
```

**Sequence:**

| Day | Channel | Purpose |
|---|---|---|
| 0 | Email 1 | Reference the ad, name the implied problem, soft ask |
| 1 | LinkedIn connect | No note |
| 3 | LinkedIn message | Only if connection accepted |
| 4 | Email 2 | Proof — someone in their vertical who solved it without the hire |
| 9 | Email 3 | Smallest possible ask |

**Opener:**
> "Saw the [role] ad go up at [Company] — that's usually [the underlying problem, stated
> as a consequence, not a diagnosis]. We handle that for [2-3 similar businesses] without
> the headcount. Worth a look before you're committed to a salary?"

**Why it works:** the ad is budget already approved. You are not creating need, you are
offering a cheaper path to a decision they have already made.

**Exit:** ad closes, or no reply after email 3 → move to Cool, re-enter if a second signal
fires.

**Do not:** claim to know why they're hiring. "You must be struggling with X" invites
correction. Describe the consequence, not the cause.

---

## Play 2 — New in role

**Applies to:** every DGK vertical. The most transferable play in the set.

```
Trigger:        Sales Nav spotlight "changed jobs in past 90 days" on a saved
                search of target titles at ICP accounts
Qualification:  Title owns the pain. Account passes ICP.
Window:         Day 14 to day 45 is peak. Ignore days 0-13.
SLA:            Enter the sequence on day 14, not on detection
Owner:          Sequence
```

**Sequence:**

| Day | Channel | Purpose |
|---|---|---|
| 0 (= their day 14) | LinkedIn connect | No note |
| 2 | Email 1 | Congratulate briefly, then the first-90-days framing |
| 6 | Email 2 | What their predecessor's setup probably looks like |
| 12 | Email 3 | Offer the audit or resource, not the call |

**Opener:**
> "Congrats on the move to [Company]. Most people in [role] spend the first quarter working
> out what they've inherited — if [the function] is on that list, we map it for [vertical]
> businesses in about a week. Useful, or too early?"

**Why the day-14 delay:** week one they are drowning in onboarding. Week three they have
started forming opinions about what's broken and have not yet committed to fixing it a
particular way. That is the buying window.

**Exit:** day 90, or no reply after email 3.

---

## Play 3 — Post comment

**Applies to:** any client posting on LinkedIn, or any client with an identifiable
competitor who posts.

```
Trigger:        Comment on the client's post, or on a competitor's post
Qualification:  Commenter's title and company pass ICP
Window:         7 days. After that, referencing it is odd.
SLA:            24-48 hours
Owner:          Human. This one should never be automated — the reply has to
                engage with what they actually said.
```

**Sequence:**

| Day | Channel | Purpose |
|---|---|---|
| 0 | LinkedIn reply to the comment | Public, adds something |
| 0 | LinkedIn connect | With a note referencing the comment |
| 2 | LinkedIn DM | If accepted |
| 5 | Email | If no LinkedIn traction |

**Opener:**
> "Thanks for the comment on the [topic] post — you mentioned [the specific thing they
> said]. How are you handling that at [Company] at the moment?"

**On a competitor's post:** engage with the *topic*, never the competitor. Naming them is
a bad look and often unprofessional in a small AU market where everyone knows everyone.

**Exit:** 7 days, or no reply after the email.

---

## Play 4 — New location, licence, or registration

**Applies to:** commercial cleaning, NDIS, allied health, trades, aged care

```
Trigger:        New site on Google Maps, new licence class on a state register,
                new NDIS registration group, new practice location
Qualification:  Account passes ICP. Not already a client.
Window:         90 days
SLA:            One week — this one is not urgent, and rushing it looks automated
Owner:          Sequence
```

**Sequence:**

| Day | Channel | Purpose |
|---|---|---|
| 0 | Email 1 | Reference the expansion, name the scaling problem it creates |
| 5 | Email 2 | Proof from a business that expanded similarly |
| 12 | Email 3 | Smallest ask |
| 14 | LinkedIn | Parallel touch on the owner |

**Opener:**
> "Noticed [Company] has opened [location / added the registration]. The bit that usually
> bites at that point is [the specific operational consequence] — we sort that for
> [vertical] operators. Worth 10 minutes while it's still being set up?"

**Why it works:** expansion is a moment where existing processes visibly stop scaling, and
the owner already knows it.

---

## Play 5 — Tender issued (AU-specific)

**Applies to:** any client whose buyers procure formally — government, health, education,
large strata, aged care

```
Trigger:        Target publishes a tender or RFQ relevant to the client's category,
                on AusTender or a state portal
Qualification:  Category match. Client can actually service it.
Window:         Until the close date. Often only 2-4 weeks.
SLA:            48 hours. This is the tightest window in the set.
Owner:          Dilip or the client directly — this usually needs a real conversation
```

**Sequence:** single high-quality email plus a phone call. Do not run a nurture sequence
against a close date.

**Opener:**
> "Saw [Company]'s tender for [category], closing [date]. We work with [similar
> organisations] on exactly this — happy to send through what a compliant response
> normally needs, whether or not you shortlist us."

**Why it works:** they are buying, on a deadline, in public. It is the least speculative
signal available.

**Caution:** if the client cannot realistically deliver the tender scope, don't run this.
A failed tender response costs the client credibility with a buyer they'll meet again.

---

## Play 6 — Champion moved companies

**Applies to:** every client with any sales history at all. Costs nothing to run.

```
Trigger:        Someone who previously replied positively, took a meeting, or
                was a customer contact appears at a new company
Qualification:  New company passes ICP
Window:         30-90 days after the move
SLA:            One week
Owner:          Human. Always.
```

**Opener:**
> "[Name] — saw you're at [new company] now. We spoke back at [old company] about
> [thing]. Is [the problem] on your list there, or is it a different set of headaches?"

**Why it works:** no cold-start. They already know the offer, and the objection that
blocked it last time (budget, timing, incumbent) is usually gone with the job.

**Requirement:** DGK must maintain a monitored list of every positive-reply contact,
forever, per client. This is the cheapest signal in the entire program and it only works if
someone kept the list.

---

## Play 7 — Regulatory change (segment-level)

**Applies to:** NDIS, aged care, construction, childcare — any regulated vertical

```
Trigger:        Regulator announces a change affecting the client's buyers
Qualification:  Whole segment. Not account-level.
Window:         From announcement to compliance deadline
SLA:            Within a week of the announcement
Owner:          Sequence, to the whole segment
```

**Opener:**
> "With [change] taking effect [date], most [vertical] operators are going to need
> [consequence]. Here's what we're seeing others do about it — [resource]. Happy to walk
> through what it means for [Company] specifically."

**Why this play matters disproportionately:** it is the best available reason to
re-approach an exhausted list. It is genuinely new information, it applies to everyone in
the segment, and it doesn't read as a follow-up. When `dgk-list-building` reports the TAM
exhausting in month four, this is the play that buys month five.

**Lead with the resource, not the pitch.** A regulatory change email that opens with a
sales ask reads as opportunism.

---

# Building a new play

```
PLAY: [name]
Trigger:        [observable event + threshold — specific enough to code]
Qualification:  [ICP check before acting]
Window:         [days the signal stays live]
SLA:            [detection to first touch — must be inside the window]
Sequence:       [day | channel | purpose]
Opener:         [actual first line, referencing something they published]
Owner:          [named person or "sequence"]
Exit:           [no-response rule and stop condition]
```

Three tests before it ships:

1. **Would the recipient be comfortable knowing exactly how we found them?** If no, the
   signal is internal-use-only and the opener must anchor elsewhere.
2. **Can the owner actually meet the SLA?** A 24-hour SLA against a client who reviews
   drafts weekly is fiction. Design for the real cadence.
3. **Does the opener survive being wrong?** Signals misfire. "Saw the ad — that usually
   means X" survives a correction; "You're clearly struggling with X" does not.




---

## File: `signal-scoring.md`

# Signal Scoring — Points, Decay, Stacking, Bands

The whole model is arithmetic. Build it as **Clay formula columns**, never AI columns.
Formulas cost zero credits, run instantly, and can be debugged by reading them.

```
contact score = Σ (signal points × recency multiplier) + stacking bonus
band = threshold lookup on contact score
```

## Signal points

Base points reflect **causality**, not how impressive the signal looks. Reweight per
client — a job ad for a Financial Controller is a 30 for an accounting client and a 5 for
a cleaning client.

| Signal | Points |
|---|---|
| Job ad for the exact role the offer replaces or supports | 30 |
| Tender issued by the target (they are buying now) | 30 |
| Repeat posting of the same unfilled role | 28 |
| New in role — target title, target account | 25 |
| Champion moved to a new company in ICP | 25 |
| New licence, registration, or NDIS registration group | 22 |
| New location or branch opened | 20 |
| Comment on a relevant post (client's or competitor's) | 18 |
| Tender awarded to them (capacity pressure) | 18 |
| Job ad implying the pain indirectly | 15 |
| Newsletter signup or content download | 15 |
| Webinar or event attendance | 15 |
| Acquisition or merger | 12 |
| Volume hiring, 5+ roles | 10 |
| Award or recognition | 8 |
| Like on a relevant post | 5 |
| Repeat website visits to a buying page (internal use only) | 12 |
| Single website visit (internal use only) | 4 |
| LinkedIn profile view (internal use only) | 4 |

Marked "internal use only" means it counts toward the score and **must not** be referenced
in outreach. See the surveillance rule in SKILL.md.

## Recency decay

Timing is the entire value of a signal. A 30-point job ad found today and the same ad
found six weeks ago are not the same lead.

| Age | Multiplier |
|---|---|
| 0–3 days | 1.0 |
| 4–7 days | 0.9 |
| 8–14 days | 0.75 |
| 15–30 days | 0.5 |
| 31–60 days | 0.25 |
| 60+ days | 0.1 |

Apply decay **per interaction**, not to the summed total. Someone who commented eight
weeks ago and posted a job ad yesterday should score on the fresh signal, not have both
crushed by the older date.

Two exceptions, where the window is structurally longer:

- **New licence / registration** — flat 1.0 for 90 days, then decay. The need persists.
- **New in role** — 1.0 for the first 45 days, then decay. Peak is 14–45 days, not day one;
  a brand-new starter is still finding the bathroom.

## Stacking bonus

Multiple independent signals on one account is the strongest predictor in the model.
Independent matters — two job ads is one signal fired twice, not two signals.

| Distinct signal types on the same account | Bonus |
|---|---|
| 2 | +10 |
| 3 | +20 |
| 4+ | +30 |

Stacking applies at **account** level, then flows to every qualified contact at that
account. A company hiring, expanding, and commenting is in-market regardless of which
individual you reach.

## Bands, actions and SLAs

The SLA is the part that makes this a system. Without it the score is trivia.

| Band | Score | Action | SLA |
|---|---|---|---|
| **Hot** | 60+ | Manual review, personalised outreach drafted, email + LinkedIn, human sends | **24 hours** from detection |
| **Warm** | 35–59 | Enters the signal sequence in Smartlead, segment-level personalisation | 72 hours |
| **Cool** | 18–34 | Added to the standard cold segment with the signal as a tag | Next campaign cycle |
| **Cold** | Under 18 | Log only. Monitor for a second signal. | None |

Sitting between bands → assign the lower one.

**Calibrate the thresholds to the volume, not to the numbers above.** Hot should be
roughly the top 10–15% of qualified signals. If half the list is scoring Hot, the
thresholds are wrong — a band that catches half the list is a list, not a band. Check this
after the first 100 signals and adjust once.

## Clay implementation

Four formula columns, all zero credit.

```
Signal Points      = lookup/sum of the points table against detected signal types
Recency Multiplier = nested if/then on days-since-signal
Stacking Bonus     = count of distinct signal types on the account, mapped to bonus
Total Score        = (Signal Points × Recency Multiplier) + Stacking Bonus
Band               = if Total >= 60 "Hot" else if >= 35 "Warm" else if >= 18 "Cool" else "Cold"
```

Store the **components**, not just the total. When a band looks wrong at review, the
breakdown tells you whether the problem is the points, the decay or the stacking — and
you can fix one without rebuilding the model.

Also store `signal_detected_date` and `signal_source` on every row. The first drives decay
and must be the date of the *event*, not the date the scraper ran. The second is what lets
you kill an underperforming source in Step 4 of the monitoring plan.

## Reviewing the model

Monthly, per signal type:

```
Signals detected:              [N]
Contacts reached:              [N]
Total reply rate:              [%]
Positive reply rate:           [%]
Meetings booked:               [N]
Cost per meeting:              [$]
```

**Kill any signal type under 2% positive reply after 100 sends.** Detecting a signal that
doesn't convert costs money and, worse, dilutes the score so genuinely hot accounts don't
surface.

Compare each signal against the cold baseline for the same client. A signal that performs
at the cold rate is not a signal — it's a filter that happens to be expensive.




---

## File: `signal-taxonomy.md`

# Signal Taxonomy — What to Watch, and Whether You Can Actually See It

Each signal is rated on three axes:

- **Causality** — does the event create need, or is it just correlated with growth?
- **AU detectability** — can DGK observe it reliably in Australia, at reasonable cost?
- **Window** — how long the opportunity stays open.

Imported US playbooks are full of signals that are strong in causality and unobservable
here. They are marked accordingly. Several strong AU signals appear in no US playbook at
all; those are marked **AU-specific**.

---

## Category 1 — Hiring and headcount

The strongest category for DGK, because a job ad is budget already approved, need already
articulated, and published deliberately — so it can be referenced without awkwardness.

| Signal | Causality | AU detectability | Window |
|---|---|---|---|
| **Job ad for the role your offer replaces or supports** | Very high | High — SEEK via Apify | Until filled, typically 3–6 weeks |
| **Job ad for a role that implies the pain** (e.g. hiring an admin because ops is drowning) | High | High — SEEK | 3–6 weeks |
| **Repeat posting of the same role** | Very high — they can't fill it, which is the pain | High — requires history, so store previous runs | Ongoing |
| **Hiring a first-ever [function] leader** | Very high — new function, new budget, no incumbent vendor | Medium — needs a look at the org | 60–90 days |
| **Volume hiring** (5+ roles at once) | Medium — growth, but not necessarily your growth | High | 60 days |
| **Hiring freeze or role withdrawn** | High, inverted — cost pressure. Good for cost-saving offers, poison for growth offers | Medium | 30–60 days |
| **Headcount growth on LinkedIn** | Low — lagging and noisy | Medium — Sales Nav account filter | — |

**AU note:** SEEK is dominant and the ad copy is often far richer than the LinkedIn
equivalent — it frequently names the systems, the team size, and the problem. Read the ad
body, not just the title. Indeed and the client's own careers page are worth adding as
secondary sources for roles that never hit SEEK.

## Category 2 — People movement

| Signal | Causality | AU detectability | Window |
|---|---|---|---|
| **New in role at a target account** | Very high — new leaders replace vendors and processes in their first quarter | High — Sales Nav spotlight, already licensed | 14–45 days peak, 90 outer |
| **Champion moves to a new company** | Very high — they already know the offer | High if you're tracking past contacts | 30–90 days |
| **Departure of the person who owned the incumbent relationship** | High — the vendor relationship is now unowned | Medium — requires monitoring named individuals | 30–60 days |
| **Promotion into budget authority** | Medium | Medium — Sales Nav | 60 days |

**Champion-moves is the single most under-used signal in DGK's stack.** It costs nothing:
keep every positive-reply contact in a monitored list and watch for job changes. A person
who liked the offer at company A and now runs the function at company B is warmer than any
cold list.

## Category 3 — Company events (public)

| Signal | Causality | AU detectability | Window |
|---|---|---|---|
| **New location or branch** | Very high for service businesses — new site, new suppliers | High — Google Maps monitoring, register updates | 60–90 days |
| **New licence or registration** (AU-specific) | Very high — a licence class is a declaration of what they're about to do | High — state registers, free | 90 days |
| **New NDIS registration group** (AU-specific) | Very high | High — NDIS Commission register | 90 days |
| **Tender awarded or shortlisted** (AU-specific) | Very high — they have work and need capacity | High — AusTender, state tender portals, free | 30–60 days |
| **Tender issued by them** | Very high — they're buying, right now | High — same sources | Until close date |
| **Acquisition or merger** | High — systems consolidation, vendor rationalisation | Medium — AFR, industry press, rss.app | 90–180 days |
| **Rebrand or new website** | Medium | Medium | 60 days |
| **Award win or industry recognition** | Low causality, high as a warm opener | High | 30 days |
| **Funding round** | Low–medium — makes everyone a "signal", so it discriminates poorly. Also rare outside tech in AU | Medium — AFR, Crunchbase | 14 days before competitors swarm |

**AU-specific signals are the edge.** Tenders, licence classes and register changes are
public, free, structured, and absent from every imported playbook — which means the
client's competitors aren't watching them.

## Category 4 — Digital engagement

| Signal | Causality | AU detectability | Reference in outreach? |
|---|---|---|---|
| **Comment on a relevant LinkedIn post** | High — deliberate and public | High — Apify | **Yes** |
| **Comment on a competitor's post** | High | High — Apify | Yes, but never name the competitor |
| **Like on a relevant post** | Medium | High | No — too passive |
| **Newsletter signup / content download** | High — they gave the address | High | Yes |
| **Repeat website visits to a buying page** | High | Company-level only in AU | **Never** |
| **LinkedIn profile view** | Medium | High | **Never** |
| **Webinar or event attendance** | High | High — registration list | Yes |

## Category 5 — Operational and observable

Mostly AU-specific and mostly free. Under-used because it requires knowing the vertical.

| Signal | Applies to | Detection |
|---|---|---|
| **Fleet or vehicle count change** | Trades, cleaning, logistics | Google Maps imagery, site photos, ABN vehicle records |
| **New site added to a portfolio** | Strata, FM, cleaning | Company site, Google Maps |
| **Accreditation gained or lapsed** | NDIS, aged care, ISO-certified | Commission registers, certification bodies |
| **Practitioner joins or leaves a practice** | Allied health, medical, legal | AHPRA register, firm website |
| **Insolvency or administration of a competitor** | All | ASIC notices, published insolvency notices |
| **Regulatory change affecting the vertical** | NDIS, aged care, construction | Regulator announcements, rss.app |

The last one is a **segment-level** signal, not an account-level one — it doesn't rank
accounts, it makes the whole segment timely. Regulatory change is the best excuse for a
re-engagement campaign into an exhausted list, because it's genuinely new information.

## Category 6 — Negative and inverse signals

Watch for these to *suppress*, not to target:

- Recently signed with a competitor of the client → suppress 12 months
- Redundancies or administration → suppress
- Already contacted in a prior campaign under 90 days → suppress
- Publicly complained about vendors in this category → treat as high-risk, not high-intent
- Role vacant at the target title → no one to sell to; hold until filled, then it becomes a
  new-in-role signal

---

# Signal selection worksheet

Run each candidate signal through this before committing to detect it:

```
Signal:                [name]
Does it create need?   [yes / correlated only]     -> correlated only = drop
Public trace?          [where exactly]             -> none = drop
Detection cost:        [$ / month]
Expected volume:       [signals / month]           -> under 10/month = supporting only
Window:                [days]
Referenceable?         [yes / internal only]
SLA achievable?        [can someone act inside the window?]  -> no = drop
```

The SLA line is where most signal programs die. A 14-day window and a client who reviews
drafts fortnightly is not a signal program — it's a report.

# Volume reality check

Small AU markets produce small signal counts. Rough monthly expectations for a
2,000-company niche:

| Signal | Signals/month |
|---|---|
| Job ads (relevant roles) | 20–40 |
| New in role (target titles) | 15–30 |
| LinkedIn comments on client + competitor posts | 10–40, entirely dependent on posting activity |
| Register or licence changes | 5–20 |
| Tenders | 2–10 |

Combined, that is roughly 50–140 signal-triggered contacts a month — enough to be the
priority layer on a cold campaign, rarely enough to be the whole campaign. Size the client
promise accordingly.
