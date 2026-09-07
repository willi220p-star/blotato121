# Dgk Sales Playbook

Source skill pack: `dgk-sales-playbook.skill`

Converted to Markdown so Cognee Brain (TextLoader) can ingest it.



---

## File: `SKILL.md`

---
name: dgk-sales-playbook
description: DGK Business Consultancy's complete sales knowledge base — 47 frameworks covering DM outreach, follow-up, discovery calls, objection handling, closing, pricing, negotiation, buyer psychology, client retention, referrals, and pipeline operations. ALWAYS use this skill for ANY sales question, however casually phrased — "what do I say to this prospect", "they went quiet, what now", "how do I handle the price question", "is this a good lead", "how do I close this", "write me a DM", "score this conversation", "they said they'd think about it", "how do I ask for a referral", "what's my follow-up cadence". Also trigger when Dilip pastes a LinkedIn profile, a DM thread, an email exchange, a call transcript, or a company name with any intent to sell to them. Trigger even when the word "sales" never appears — a question about what to say to a prospect, how to price something, why a deal died, or how to get a client to reply IS a sales question. Internal DGK use only.
---

# DGK Sales Playbook

The complete DGK sales system: 47 frameworks, ~50,000 words, covering every stage from first contact to referral. Built from Ty Frankel's LinkedIn system, Alex Hormozi's $100M playbooks, BowTiedSalesGuy's frame control, ColdIQ's outbound frameworks, HBR's Challenger research, McKinsey's B2B buyer studies, Cialdini, and Kahneman — all adapted to DGK's Australian B2B market and Done-With-You model.

## Step 1: Always run the intake first

**Never answer a sales question cold.** The same question has completely different answers depending on stage, industry, and what Dilip actually needs. Run this intake with `ask_user_input_v0` before every substantive answer — even for questions that look simple.

Ask these three, adapted to what was asked:

```
Q1 — Where is this at?
  Cold outreach (no contact yet) | In conversation (DMs/email) |
  Call booked or completed | Proposal out / closing | Existing client

Q2 — Who's the prospect?
  IT / MSP | NDIS provider | Trades | Cleaning |
  Professional services | Other / not specific

Q3 — What do you need?
  Exact words to send | The framework explained |
  Audit what I already did | A plan for the whole deal
```

Adapt the options when the question makes one obviously irrelevant — if Dilip pastes a DM thread, Q1 is already answered, so replace it with something that isn't ("How warm did they feel — hot, lukewarm, or going cold?"). Never ask a question the message already answered.

Two exceptions where you skip straight to the answer: Dilip explicitly says to skip the questions, or he's already answered all three in his message.

After the intake, your turn is over. The answers arrive as his next message.

## Step 2: Load the right reference

Read only what the question needs. Each file is self-contained.

| Question is about | Read |
|---|---|
| DGK's own positioning, pricing, case studies, ICP, buyer personas, competitors, reading personality types | `references/01-dgk-context.md` |
| First contact — DM openers, connection requests, who to target, warmth levels, cold email, cold calls, Trojan Horse, signal-based selling, PAS, wedge offers | `references/02-outreach.md` |
| They went quiet, nudging, throwing rope, breakup messages, reactivation, ghosts who came back | `references/03-followup.md` |
| Running the call — PICS pain mapping, cold reads, discovery structure, question technique, second calls, building trust fast, future pacing | `references/04-discovery-and-calls.md` |
| "How much?", stalls, competitor comparisons, closing techniques, tier pricing, discounting, whether to walk away, status-quo bias | `references/05-objections-closing-pricing.md` |
| Frame control, status, cognitive biases, the IKEA Effect, Challenger/insight selling, choice architecture, decision fatigue, emotional state, commitment psychology | `references/06-psychology.md` |
| After they sign — onboarding, buyer's remorse, health scoring, churn, upsells, referral asks, testimonials, selling to a committee, when things go wrong | `references/07-clients-and-growth.md` |
| Pipeline stages, CRM fields, why deals died, offer construction, brand/dark funnel, LinkedIn content, hiring salespeople, handling rejection | `references/08-operations.md` |

Read `01-dgk-context.md` alongside the topic file whenever the answer needs DGK's pricing, case studies, or positioning — which is most of the time for anything client-facing.

Cross-cutting questions need two files. "How do I close someone who keeps stalling?" is `05` plus `06`. "What do I send a client who just got their first result?" is `07` plus `03`.

## Step 3: Answer in DGK's voice

Match the output to what Dilip picked in Q3.

**Exact words to send** — Give the message, ready to paste. Separate sends as M1/M2/M3, not one block. Australian, casual, non-needy. Restrained compliments at 4-6/10, never higher. Hyphens over commas. "lmk" over "let me know". No exclamation marks. Then one line on why it lands.

**The framework explained** — Name it, explain the mechanism, then show it applied to the prospect in front of him. Never explain a framework in the abstract when there's a real prospect on the table.

**Audit what I did** — Quote the exact line that went wrong. Say why it failed and which framework it broke. Write the replacement. Score it out of 10 with a one-line reason. Be direct — Dilip wants the real read, not encouragement.

**A plan for the whole deal** — Sequence it with timing in days. What to send, when, which framework if they go quiet, when to pitch the call, which close to use, what objections to expect, and honest odds based on warmth level.

Whatever the format, ground it in DGK's actual business — real case studies (IT Together 0→6 enquiries in 60 days, Triple R's same-week SEEK signals, A Plus Autorepair's 12-week handover, CPL down 62%), real pricing tiers, and the Done-With-You positioning. Match the case study to the prospect's industry; an IT story lands flat on an NDIS provider.

## Non-negotiables

These hold across every answer. They're the difference between the playbook and generic sales advice.

- **Give the price and stop talking.** Every time. The first person to break silence loses.
- **Never pitch price in DMs.** Redirect to a call: "Depends which system — easiest on a quick call."
- **Never follow up inside 24 hours.** It reads as needy and it costs you the frame.
- **Stop after 3-4 unanswered touches.** Send the breakup, then actually stop. Fake breakups destroy credibility.
- **No signal, no reason to write.** If there's no trigger — a SEEK post, a funding round, a new hire, a relevant post — skip the prospect rather than sending something generic.
- **Quantify the pain before naming the price.** $10K against a $240K annual gap is obvious. $10K against nothing is expensive.
- **The prospect is the hero.** DGK is the guide. Every story follows that shape.
- **Disqualify openly when the fit is wrong.** Saying "I don't think we're right for you" builds more trust than any pitch, and it frees the calendar for a better deal.
- **Done With You is the IKEA Effect.** Harvard: people value what they helped build 63% more. It's the moat, not just a tagline — use it in the close.

## Judgment calls

**Dilip disagrees with the framework.** He runs the business and knows his market. Explain the reasoning once, then defer. The playbook is a default, not a rule.

**The prospect isn't a fit.** Say so plainly and explain which BANT-F criteria fail. A fast no is worth more than a slow maybe.

**No framework fits cleanly.** Reason from the principles rather than forcing the nearest framework. Say when you're extrapolating.

**Something looks off in a pasted conversation.** Flag it even if he didn't ask — a prospect showing three red flags matters more than the question about opener wording.

**The real problem isn't what he asked about.** Answer the question, then say what you actually think. If close rate is 5%, more DMs won't fix it, and saying so is more useful than writing better DMs.




---

## File: `references/01-dgk-context.md`

# DGK Context: Business, ICP, Personas, Positioning

> DGK Sales Knowledge Base — reference file. Source files listed below.

## Contents
- 05 FULL LINKEDIN SYSTEM
- 18 BUYER PERSONAS
- 17 COMPETITIVE BATTLE CARDS
- 15 STORYTELLING IN SALES
- 22 EMOTIONAL INTELLIGENCE

---

# The Complete LinkedIn Client Acquisition & LTV System — DGK Edition

> **For:** DGK team running the full system + delivering it to DGK clients
> Sources: Ty Frankel ($3.9M+), Alex Hormozi ($100M Playbooks), DGK proprietary systems
> DGK = Self-running growth systems for Australian B2B. Foundation, Outbound, Content, Ads. Done with you. Owned by you.

---

## THE 6-STEP LINKEDIN ACQUISITION FORMULA

### Step 1 — Craft a High-Ticket Offer
- Solve a problem that heavily affects revenue
- Guarantee results
- Make sure target client is active on LinkedIn
- DGK offer: "We build the growth system with you. You own it when we're done. No lock-in."
- DGK packages: Foundation ($X) → Outbound ($X) → Content ($X) → Ads ($X) → Stack as needed

### Step 2 — Optimize LinkedIn Profile
Profile = landing page. Every piece of real estate is intentional.

**Visual Branding:** 2 brand colors, cohesive logo/banner/photo. Great photos. Be genuine.

**Messaging:** Sell 1 thing to 1 niche. Speak in THEIR language.

**Profile Sections:**
- **Tagline:** Call out ICP. DGK: "Building self-running growth systems for Australian B2B | Done with you. Owned by you."
- **About:** History → current offer → pitch → CTA
- **Featured:** Case studies with visuals (IT Together, Triple R, A Plus)
- **Experiences:** Trust-building. Omit irrelevant.
- **Skills:** 2 core skills, 99+ endorsements
- **Recommendations:** 2+ from clients

**What to convey:** Highly relevant. Highly competent/high IQ. High EQ. Genuine care. Non-needy/outcome independent.

### Step 3 — Publish 5 Weekly Posts
Post weekdays 8-9 AM AEST.

**Top of Funnel (ToFu):** Opinions + stories. Grows following. Not niche-specific.
**Middle of Funnel (MoFu):** Opinions + stories + education. More niche-specific. Builds authority.
**Bottom of Funnel (BoFu):** Educational, detailed, technical. Actionable. Converts.

**DGK Content Buckets:**
- ToFu: Hot takes on B2B growth, referral dependency, Australian business culture
- MoFu: How-to on outbound, CRM setup, content systems, signal-based targeting
- BoFu: Case studies (IT Together 0→6 enquiries, Triple R same-week signals, CPL down 62%)

**Content Rules:**
- No vague statements without specifics
- No long paragraphs — make it skimmable
- Hooks must be specific and captivating
- CTAs (comment keyword / book call) in max 20% of posts
- Use parentheses, quotes, names, numbers
- ~10-20% lifestyle content
- Distribute across: LinkedIn, Facebook, IG, X, Threads, YouTube

### Step 4 — Send 200 Weekly Connection Requests
EMPTY (no text). 8-10 AM prospect timezone. 40-60% acceptance. Start DMs with everyone who accepts.

### Step 5 — Start 100 DM Convos a Week
30-35% reply rate. 1 call per 10 convos. Use all frameworks from 01_DM_OUTREACH_PLAYBOOK.

### Step 6 — Close Clients
Qualify hard. Be genuine. Lead with value. 20-30% close rate on qualified. Send agreement → invoice → onboard.

---

## DGK'S 4-PHASE SYSTEM (Client Delivery Map)

### Phase 1 — Foundation (Weeks 1-12)
Build the machine before feeding it:
- Research, strategy, offer positioning, GTM direction
- Website + funnel (converting pages, forms, lead capture)
- CRM + booking + payment (pipeline, calendar, Stripe)
- SEO system (technical, on-page, backlinks, parasite SEO)
- Automation (follow-ups, reminders, lead routing, chatbot)
- Tracking (GA4, Meta Pixel, CRM attribution, dashboard)
- Sales enablement (scripts, pipeline stages, SOPs)

### Phase 2 — Outbound (Ongoing after Foundation)
Qualified meetings every week:
- Email infrastructure (domains, inboxes, warmup, deliverability)
- ICP matrix + TAM (know exactly who you're targeting)
- Signal-based lists (130+ sales triggers)
- 3-tier system (omnichannel, multichannel, email-only)
- Automated sequences (personalised, running without client)
- Reply to CRM (positive replies land in pipeline automatically)

### Phase 3 — Content (Ongoing after Foundation)
Daily content without the client doing it daily:
- Competitor research (LinkedIn, Reddit, TikTok)
- Brand voice guide (experience, POV, tone)
- Content buckets (ToF hot takes, MoF how-to, BoF case studies)
- AI writing workflow (hooks, drafts, anti-AI tone)
- Canva brand templates
- Content hub (tracked in Airtable or Notion)
- Distribution (LinkedIn, Facebook, IG, X, Threads, YouTube)

### Phase 4 — Ads (When Foundation is solid)
Spend you can trace to closed revenue:
- ICP + account list (defined before a dollar is spent)
- Custom audiences (CRM + lookalike)
- Creatives per tier (thought leader, case studies, direct CTA)
- Full attribution (Pixel + GA4 + UTMs + CRM)
- Monthly review (CPL, cost per booking, ROI)

---

## HORMOZI'S CRAZY 8 — LTV OPTIMIZATION (For DGK + DGK Clients)

8 ways to get customers to spend more money. Every business should work through all 8:

### 1 — INCREASE PRICE
Pricing affects gross profit more than anything else. If you double price and close 20% fewer deals, you still make 60% more revenue. Test prices every quarter. (See 04_OBJECTION_HANDLING for full pricing framework)
- DGK action: Test price nudges of 20% every 10 new clients until conversion drops dramatically

### 2 — DECREASE COST OF DELIVERY
Lower what it costs to deliver without hurting quality. Automate. Use AI. Build SOPs.
- DGK action: AI writing workflows, templated systems, Canva templates = lower delivery cost per client

### 3 — INCREASE NUMBER OF PURCHASES (Recurring / Reduce Churn)
Three ways: add recurring, decrease churn, make regular follow-up offers.
- **Add recurring:** Turn one-time into subscription. Even high-churn recurring beats one-and-done.
- **Decrease churn:** Price / Churn = LTV. Cut churn in half = double LTV.
- **Regular follow-up offers:** Systematic re-engagement after initial purchase.
- DGK action: Foundation is one-time → upsell to Outbound (monthly management) or Content (monthly retainer). Retainer = recurring.

### 4 — CROSS-SELL SOMETHING DIFFERENT
Sell a complementary product. Add conversion rate × gross profit of upsell to original LTV.
- DGK action: Foundation client → cross-sell Content System. Outbound client → cross-sell LinkedIn Ads. Any client → cross-sell DGK CRM.

### 5 — SELL MORE (INCREASE QUANTITY)
Bulk, more often, or bigger:
- Bulk: Prepay for 6 or 12 months
- More often: Increase posting frequency from 3x/week to daily
- Bigger: Add more channels (LinkedIn + email + phone = omnichannel tier)
- DGK action: Offer annual packages. Upsell from email-only to omnichannel outbound.

### 6 — UPSELL HIGHER QUALITY
Premium version: better talent working on it, faster turnaround, more personalization, done-for-you vs done-with-you.
- Quality upsell levers: faster, more personalized, less risk, better guarantee, more senior team, in-person vs remote, live vs recorded, DIY→DWY→DFY
- DGK action: DWY is standard. DFY is the quality upsell (we run everything, client just approves). Premium = Dilip personally involved.

### 7 — DOWNSELL FEWER (LOWER QUANTITY)
Sell a smaller version. If it's this or nothing, this beats nothing.
- DGK action: Can't afford full Foundation? Offer CRM-only setup or audit-only package.

### 8 — DOWNSELL LOWER QUALITY
Less valuable version: slower response, fewer meetings, more junior team, more DIY.
- DGK action: Full DWY is standard → DIY with templates is the downsell. "Here are the SOPs and templates, you build it yourself, we do a monthly check-in."

### LTV Formula
- **Transactional:** Gross profit × average transactions = LTGP
- **Recurring:** Gross profit / Churn % = LTGP
- He who makes customers more valuable than competitors wins.

---

## HOW TO CONVEY YOURSELF — The "Friendly Helper" Mindset

### Core Identity Pillars:
1. Help at all costs — detach from "making the sale"
2. Multi-thread conversations — personal + business
3. Foreshadow value & throw rope — relevance is everything
4. Hyper-personalize everything — opposite of formulaic
5. Resonate & reflect — don't just sell
6. Authority-building observations — show deep understanding
7. Think outside the box

### How Prospects Should See DGK:
- **Highly relevant:** Case studies in their industry. Signal-based outreach. Specific numbers.
- **Highly competent:** Sophisticated but friendly. Systems-thinking language. Data-driven.
- **High EQ:** Non-needy. Light humor. Mirror energy. No pressure.
- **Genuine care:** "No pitch. No pressure. Just a diagnosis."
- **Non-needy:** Enforce boundaries. Time is scarce. "We're taking on 2 more this quarter."

---

## SALES SYSTEMS (Post-DM)

### 1 — Calendly/Booking Setup
Questionnaire for qualification. Set availability AEST. "Book a 30-min strategy call."

### 2 — Pre-Call Drip
Automated sequence after booking:
- Confirmation email with case study
- 24hr reminder with "I prepped something specific for your business"
- 2hr reminder text

### 3 — Day-Of Text
"Hey NAME it's Dilip from DGK. Talk to you soon. [TIME] AEST" — human, friendly, reminds of time.

### 4 — Post-Call Drips
- Hot Drip: shorter gaps (warm prospects close to buying)
- Follow-Up Drip: longer gaps (need more nurturing)
- Combine automated (email) with manual (LinkedIn DM, text)

### 5 — Unqualified/Cancelled Call
Score leads before call. Auto-cancel unqualified. Don't waste time.

### 6 — Sales Call Framework
- Calm, relaxed, good posture
- Speak slowly from diaphragm
- REALLY show you care
- Disqualify HARD (play devil's advocate)
- Future pace — paint the picture of their business with the system built
- Go deep with follow-up questions
- "Is it ok if I write some notes down while we talk?" (shows care)
- TRY to close on call. Offer discount if needed to close same-day.
- DGK close: "Based on what you've told me, I think Foundation + Outbound is where we start. We'd build the system with you over 8-12 weeks, and you'd own it completely. Want to get started?"

---

## THE MICRO-SALES FRAMEWORK

Break your entire sales process into small, sequential "micro-sales." Each step sells the NEXT step — not the final outcome:

1. **Cold call / cold email / DM** → Sell the discovery meeting (not the product)
2. **Discovery call** → Sell the idea of letting you help (not the product)
3. **Demo / strategy session** → Sell the solution to their pain (match product to pain)
4. **Close** → Sell the outcome of working together (future-pace the results)

**Why this matters:** Most salespeople try to close on the first touch. That's like proposing marriage on a first date. Each micro-sale builds trust and moves them one step closer. If you can't close the deal, close them on something smaller — a paid audit, a trial, a strategy session. Small commitments make bigger commitments more likely.

**DGK micro-sales:**
1. LinkedIn DM → sell the strategy call
2. Strategy call → sell the Foundation audit
3. Foundation audit → sell the full build
4. Full build → upsell Outbound or Content retainer

---

## AI CONTENT BOT TEMPLATE (For DGK + DGK Clients)

When setting up an AI content writing partner, provide:

1. Your name + company
2. Your offer explanation
3. Customer beliefs (5-20)
4. Full offer checklist
5. Existing content examples
6. Social proof, history, results
7. Strategies/frameworks (be specific)
8. Content goals
9. Brand voice guidelines
10. Topics to avoid
11. Long-term business goals
12. USP / what makes you different
13. Content matrix with buckets

**AI Content Rules:**
- No vague statements without specifics
- No long paragraphs
- No generic advice without examples
- No unnecessary jargon
- No pushy/aggressive tone
- Get to the point quickly
- Hooks = specific and captivating
- CTAs in max 20% of posts
- Use parentheses, quotes, names, numbers

---

## DGK TOOL STACK

| Tool | Purpose |
|---|---|
| DGK CRM (GoHighLevel) | Pipeline, automation, sequences, dashboards |
| Airtable / Notion | Content hub, project management |
| Canva | Brand templates, carousels, visuals |
| Calendly | Booking + qualification |
| LinkedIn Sales Navigator | Prospect targeting |
| Smartlead / Instantly | Email outbound automation |
| Stripe | Payments |
| GA4 + Meta Pixel | Attribution + tracking |
| Clay / Apollo | Signal-based list building |
| AI tools | Content writing, research, personalization |

---

## DGK RESULTS (For Social Proof in Outreach)

| Client | Industry | Result |
|---|---|---|
| IT Together | IT/MSP | 0 → 6 qualified enquiries/mo in 60 days |
| Smartserve | Cleaning | Marketing hire ramped in 3 weeks vs 3+ months |
| Triple R Community (Sydney) | NDIS | Daily content across 6 platforms, owner offline |
| IT Together (Ads) | IT/MSP | CPL down 62% in Q1 |
| A Plus Autorepair | Mechanic | Full system handover in 12 weeks |
| Triple R Community (VIC) | NDIS | Same-week outreach on SEEK hiring signals |

---

# 18 — Buyer Persona Deep Dives

> **For:** DGK team adapting their approach to different buyer types + DGK clients building their own personas
> **Why this matters:** A 55-year-old sceptical tradesman buys completely differently from a 30-year-old ambitious NDIS director. Same product, different conversation.

---

## DGK'S 5 CORE BUYER PERSONAS

### Persona 1: "Dave the Overwhelmed Founder"
**Demographics:** Male, 40-55, owns a services business (IT, trades, professional services), 5-20 staff, in business 5-15 years.

**Situation:** Does everything himself — sales, delivery, marketing, admin. Revenue is $500K-$2M but feels like it should be more. Gets clients from referrals and word of mouth only.

**Pain (in his words):**
- "I haven't had a proper holiday in years"
- "If I stop hustling, the pipeline dries up"
- "I tried an agency once and it was a waste of money"
- "I don't understand marketing — I just want clients"

**What scares him:** Wasting money again. Looking foolish. Technology he doesn't understand. Being locked into another retainer.

**What excites him:** The idea of a system that runs without him. Owning it. Predictability. "You mean I don't need to be the one doing this?"

**How he makes decisions:** Slowly. Needs trust. Needs to see proof from someone LIKE HIM. Won't respond to hype. Values straight talk and no bullshit.

**How to sell to Dave:**
- Lead with empathy: "I get it. You've been burned before."
- Use the A Plus Autorepair story (trades, built, handed over)
- Emphasise OWNERSHIP: "No lock-in. You own everything."
- Don't use jargon. Plain English only.
- Give him control: "You're in every session. You'll understand how it all works."
- Trial close with the wedge: "Let's start with just the Foundation. $5K. You'll see if the approach works before committing to anything bigger."

### Persona 2: "Sarah the Ambitious Scaler"
**Demographics:** Female, 28-40, director/founder of a growing business (NDIS, healthcare, professional services), 10-50 staff, scaling fast.

**Situation:** Business is growing but systems can't keep up. Hiring fast. Knows she needs marketing but hasn't had time to build it properly. May have a junior marketing person who's overwhelmed.

**Pain (in her words):**
- "We're growing but it feels chaotic"
- "I'm hiring but I can't find participants/clients to match the team growth"
- "We post on socials but it's random and nobody engages"
- "I need a SYSTEM, not more random tactics"

**What scares her:** Slowing down growth. Competitors overtaking her. Building on a shaky foundation.

**What excites her:** Systems. Scalability. Data. Dashboards. "Show me the numbers."

**How she makes decisions:** Fast, once she sees the logic. Wants data, not stories. Values competence over rapport. Will check references.

**How to sell to Sarah:**
- Lead with data: "0 to 6 enquiries in 60 days. CPL down 62%."
- Use the IT Together or Triple R story (growth-stage, systems focus)
- Show the DGK 4-phase system visually
- Emphasise scalability: "This system grows with you."
- Don't over-build rapport — get to the point
- Close faster: she doesn't need 3 follow-ups if the logic is sound

### Persona 3: "Marcus the Sceptic"
**Demographics:** Male, 35-50, technically skilled founder (IT/MSP, engineering, consulting), analytical mindset.

**Situation:** Smart enough to know he needs outbound but sceptical of marketing people. Has probably tried to build it himself and got 60% of the way. Respects competence, distrusts salespeople.

**Pain (in his words):**
- "Marketing people don't understand our business"
- "I've been burned by agencies who talk big and deliver nothing"
- "Show me the mechanics, not the pitch"
- "I could do this myself, I just don't have time"

**How to sell to Marcus:**
- Lead with TECHNICAL depth: Show the domain stacking, signal-based targeting, CRM architecture
- Use the WDYM technique — he'll love the technical explanation
- Don't be salesy — be a peer. "Here's how the system works under the hood."
- Offer the paid audit as proof of competence before he commits
- Let him challenge you — Marcus respects people who can hold their own

### Persona 4: "Lisa the First-Timer"
**Demographics:** Female/Male, 25-35, started a business recently (1-3 years), small team (1-5 staff), limited budget.

**Situation:** Has never done structured outbound or marketing. May not even have a CRM. Excited but overwhelmed by options.

**Pain:** "I don't know where to start."

**How to sell to Lisa:**
- Lead with SIMPLICITY: "We'll build the foundation. Step by step. Nothing overwhelming."
- Use the wedge offer — Lisa can't afford the full system yet
- Emphasise the "done-with-you" learning component — she WANTS to learn
- Be patient. She'll ask basic questions. Answer them without condescension.
- If budget is truly tight, recommend Foundation Essentials only

### Persona 5: "The Partnership Buyer"
**Demographics:** Any age, business has 2+ partners/directors making joint decisions.

**Situation:** One person is interested. The other is sceptical or uninformed. The interested one can't close without the other's buy-in.

**Pain:** "I need to run it by my partner."

**How to sell to the Partnership:**
- Get BOTH on the call. "Would it make sense to get [partner] on this call too?"
- If only one is on the call, arm them with a 1-page summary to present to the partner
- Address the partner's likely concerns proactively: "Your partner will probably want to know about ROI and timeline. Here's the answer to both..."
- Offer a brief 10-min call with both parties: "Happy to jump on a quick call with both of you to answer any questions."

---

## ADAPTING FOR DGK CLIENTS

Teach clients to build their own personas using this template:

**Persona Template:**
1. Give them a name and demographic snapshot
2. What is their current situation?
3. What do they say when describing their pain? (Use their exact words)
4. What scares them about buying?
5. What excites them about the solution?
6. How do they make decisions? (Fast/slow? Data/emotion? Alone/committee?)
7. How should you adapt your sales approach for this person?

**Exercise:** Have clients interview their 3 best customers and 3 worst customers. The patterns reveal who to target and who to avoid.

---

# 17 — Competitive Battle Cards

> **For:** DGK team handling competitor comparisons + DGK clients positioning against their own competitors
> **Why this matters:** When a prospect says "we're talking to 3 other providers," your team has 5 seconds to respond. Battle cards give them the answer instantly.

---

## HOW TO USE THIS FILE

When a prospect mentions a competitor or alternative, find the category below and use the positioning script. Don't badmouth competitors — DIFFERENTIATE.

---

## BATTLE CARD 1: DGK vs. Marketing Agencies

**What they offer:** Monthly retainer. They do it FOR you. You pay monthly, they run campaigns.

**DGK's differentiator:**
- Agencies own everything. When you stop paying, everything stops.
- DGK builds it WITH you. When we're done, you own the CRM, the sequences, the dashboards, the SOPs. No retainer dependency.
- Agency model: rent the system. DGK model: own the system.

**Script:** "Agencies are great if you want someone running things forever. The difference with us is you OWN everything when we're done. No lock-in, no monthly dependency. Most of our clients come to us AFTER an agency because they spent $20-40K and have nothing to show for it."

**Killer question:** "When your agency contract ends, what do you actually own?"

---

## BATTLE CARD 2: DGK vs. Freelancers / Upwork

**What they offer:** Cheap, task-based work. Build a website for $2K. Set up a CRM for $500.

**DGK's differentiator:**
- Freelancers do tasks. DGK builds systems.
- No strategy. No integration. No training. No ownership of how it all connects.
- You get a website but no lead capture. A CRM but no sequences. Pieces but no machine.

**Script:** "Freelancers are great for one-off tasks. The challenge is nobody connects the dots — your website doesn't talk to your CRM, your CRM doesn't trigger follow-ups, your emails aren't tracked. We build the whole machine so every piece works together."

---

## BATTLE CARD 3: DGK vs. DIY (Courses, YouTube, Templates)

**What they offer:** Learn it yourself for $0-$500. Watch tutorials. Use templates.

**DGK's differentiator:**
- DIY takes 6-12 months of trial and error
- No accountability, no customisation, no one checking your work
- DGK is done-WITH-you: you learn AND get it built in 12 weeks

**Script:** "You could absolutely do this yourself — the information is out there. The question is time. Most founders try DIY for 6 months, get 40% done, then hire someone to fix it anyway. We compress that into 12 weeks and you learn how it works while we build it."

---

## BATTLE CARD 4: DGK vs. Hiring In-House

**What they offer:** Full-time marketing hire. $80-120K/year + super + ramp time.

**DGK's differentiator:**
- In-house hire takes 3-6 months to ramp
- They know marketing but not YOUR systems, YOUR ICP, YOUR sales process
- If they leave, the knowledge walks out the door
- DGK: $8-15K once, built in 12 weeks, the system stays forever

**Script:** "A marketing hire is $100K+ per year before they're productive. We build the system for a fraction of that in 12 weeks, and if your marketing person leaves in 6 months, the system doesn't leave with them. It's yours."

---

## BATTLE CARD 5: DGK vs. "We'll Do It Later"

**What they offer:** Nothing. The status quo. Keep relying on referrals.

**DGK's differentiator:** This is your biggest competitor. Inaction.

**Script:** "Totally understand. The thing I'd flag is — every month without a system is $15-20K in revenue you're not capturing. Over a year that's $180-240K. The question isn't whether you can afford to do it — it's whether you can afford not to."

**Killer question:** "If nothing changes in 12 months, where does that leave the business?"

---

## BUILDING BATTLE CARDS FOR DGK CLIENTS

Teach clients to build their own using this template:

| Field | What to fill in |
|---|---|
| Competitor name | Who are they compared against? |
| What competitor offers | Their model in 1 sentence |
| Your differentiator | What YOU do that they don't |
| Script | 2-3 sentences to say in conversation |
| Killer question | The question that makes the prospect think |

**Rule:** Update battle cards quarterly. Competitors change. Your positioning should too.

---

# 15 — Storytelling in Sales: Case Studies That Close Deals

> **For:** DGK team learning to tell client stories that sell — not just state results
> **The gap this fills:** "We got 6 enquiries in 60 days" is a stat. A story makes the prospect FEEL what the client felt. Stories close deals; stats support them.

---

## WHY STORIES BEAT STATS

When you say "we helped IT Together get 6 qualified enquiries per month," the prospect's brain processes it as information. Interesting, but not emotional.

When you say "When David from IT Together first called us, he was doing everything — sales, delivery, marketing. He hadn't had a holiday in 2 years because if he stopped hustling, the leads stopped. He was exhausted. 60 days later, he had 6 qualified enquiries landing in his inbox every month without touching a thing. He called me from Bali last week" — the prospect's brain processes it as an experience. They SEE themselves in David's shoes. They FEEL the exhaustion. They WANT the Bali ending.

**Stats inform. Stories transform.**

---

## THE 5-PART CASE STUDY STORY FRAMEWORK

### 1 — The Character (Who is the hero?)
The hero is your CLIENT — not you. DGK is the guide, not the hero. Think Yoda (DGK) helping Luke (client).

"David runs a 12-person IT managed services company in Sydney."

**Make them relatable:** Same size, same industry, same stage as your prospect. The prospect should think "that sounds like me."

### 2 — The Struggle (What was broken?)
Describe the PAIN — not just the problem. Use Level 3 emotional pain from the PICS chart.

"He was getting all his clients from referrals and word of mouth. Revenue was feast or famine — some months great, some months terrifying. He told me he hadn't taken a proper holiday in 2 years because he was scared that if he stepped away for a week, the pipeline would dry up."

### 3 — The Turning Point (When did they find DGK?)
Describe what made them act. The moment of decision.

"He reached out to us after trying a marketing agency for 6 months that cost $24K total. They built a website, ran some ads, and generated 'leads' — but none of them were qualified. When the agency left, everything stopped. He was back to square one, $24K lighter."

### 4 — The Transformation (What did DGK do?)
Briefly describe the PROCESS — not every detail, just enough to show it's real and systematic.

"We built his Foundation in 8 weeks — CRM, website with proper lead capture, email infrastructure, and signal-based outbound targeting IT decision makers in Sydney. By week 6, the first leads started coming in. By week 10, he had a full pipeline."

### 5 — The Result (Specific, measurable, emotional)
Numbers first, then emotional impact.

"60 days: 0 to 6 qualified enquiries per month. But here's what actually matters — David called me from Bali last month. First proper holiday in 2 years. The system was running without him. That's what 'Done with you, owned by you' actually means."

---

## DGK CASE STUDY STORY LIBRARY

### Story 1: IT Together (MSP)
**For prospects who are:** Referral-dependent, founder-bottleneck, tried agencies before

"David runs IT Together, a 12-person MSP in Sydney. When he came to us, every client was a referral. Revenue was unpredictable — some months $40K, some months $15K. He'd tried an agency that cost $24K over 6 months. When they left, he had nothing to show for it. We built his Foundation in 8 weeks and layered Outbound on top. 60 days later: 6 qualified enquiries per month on autopilot. He owns the entire system. No retainer. No dependency."

**Best line to use on calls:** "He told me he hadn't taken a holiday in 2 years. He called me from Bali last month."

### Story 2: Triple R Community (NDIS)
**For prospects who are:** Growing fast, hiring, need participants not just staff

"Triple R Community in Sydney was scaling fast — posting multiple support coordinator roles on SEEK. But their participant pipeline was still word of mouth. We set up signal-based outreach so that every time a competitor posted a job or an NDIS plan review was coming up in their area, they were reaching out that same week. Plus daily content across 6 platforms — the director didn't have to touch it."

**Best line:** "They went from reactive to proactive. Instead of waiting for referrals, they're reaching the right people the same week the opportunity appears."

### Story 3: A Plus Autorepair (Trades)
**For prospects who are:** Trades/services, sceptical, "I'm just a tradie" mindset

"Greg at A Plus Autorepair didn't think digital marketing applied to mechanics. He was getting work from Google Maps and repeat customers. We built his Foundation — website with booking form, CRM to capture every enquiry, and basic automation. Full handover in 12 weeks. He now runs the system himself. No agency. No retainer."

**Best line:** "He went from 'I'm just a mechanic' to 'I've got a system.' That shift is everything."

---

## WHEN TO USE STORIES (Timing Is Everything)

| Moment | Use this story type |
|---|---|
| Opening a DM | "Just helped a [similar business]..." (1 sentence) |
| During discovery (after uncovering pain) | Full 5-part story matching their pain |
| Handling "we tried an agency before" | IT Together story (agency failed → DGK fixed) |
| Handling "we're too small" | A Plus story (small trades business) |
| Handling "how do I know it works?" | Specific numbers: "0→6 in 60 days" |
| Presenting pricing | Anchor against the client's wasted spend: "David spent $24K on an agency and got nothing" |
| Post-call follow-up email | 2-sentence case study as social proof |
| LinkedIn content | Full stories as posts (ToFu/MoFu/BoFu) |

---

## STORYTELLING RULES

1. **The hero is the CLIENT, not DGK.** You're Yoda. They're Luke.
2. **Match the story to the prospect.** Same industry, same size, same pain. If you tell an IT story to an NDIS provider, it doesn't land.
3. **Include emotion, not just numbers.** "He hadn't taken a holiday in 2 years" > "revenue increased by 40%."
4. **Keep it under 60 seconds on calls.** Long stories lose attention. Short stories create intrigue.
5. **Use their NAME and COMPANY** (with permission). Specific = believable. Generic = suspicious.
6. **End with the transformation, not the deliverables.** "He called me from Bali" > "we set up GoHighLevel and Smartlead."

---

# 22 — Emotional Intelligence & Personality Reading

> **For:** DGK team adapting communication to different personality types + DGK clients improving their sales conversations
> **Why:** The same pitch lands completely differently depending on WHO you're talking to. A dominant CEO needs directness. An analytical CTO needs data. An expressive founder needs energy.

---

## THE 4 BUYER COMMUNICATION STYLES (Simplified DISC)

### Style D — The Driver (Dominant, Direct, Decisive)
**How to spot them:** Talks fast. Gets to the point. Interrupts. Values their time. Wants results, not process. Might seem impatient or blunt.

**Examples:** CEO types, serial entrepreneurs, fast-growth founders.

**How to sell to a Driver:**
- Get to the point FAST — skip small talk after 30 seconds
- Lead with RESULTS: "6 enquiries/month in 60 days"
- Don't over-explain the process — they don't care HOW, they care WHAT
- Give them control: "Here are two options. Which makes more sense?"
- Be confident. Don't hedge. Don't say "maybe" or "possibly"
- Close directly: "Want to get started?"

**What kills the deal:** Rambling, too much detail, being wishy-washy, wasting their time.

### Style I — The Influencer (Expressive, Enthusiastic, Social)
**How to spot them:** Talkative. Tells stories. Gets excited. Cares about people and relationships. Might go off-topic. Loves new ideas.

**Examples:** Marketing directors, creative founders, community builders.

**How to sell to an Influencer:**
- Build rapport first — they need to LIKE you before they buy
- Tell stories (File 15) — they respond to narratives, not spreadsheets
- Show enthusiasm (5-6/10, not 9/10) — match their energy
- Use social proof: "Other founders love this because..."
- Let them talk — they'll sell themselves if you listen
- Don't rush the close — they need to FEEL good about it

**What kills the deal:** Being too rigid, too data-heavy, not enough warmth, rushing them.

### Style S — The Steady (Patient, Reliable, Risk-Averse)
**How to spot them:** Speaks slowly. Asks careful questions. Wants reassurance. Avoids conflict. Values stability and trust. Takes time to decide.

**Examples:** Operations managers, family business owners, conservative industries.

**How to sell to a Steady:**
- Be patient. Don't rush. Let them process.
- Provide reassurance: "You own everything. No lock-in. No risk."
- Use testimonials from people LIKE them
- Follow up gently — they need time but DO want to buy
- Don't use high-pressure tactics — they'll shut down
- Close softly: "Does this feel right for your business?"

**What kills the deal:** Pressure, urgency tactics, being too aggressive, making them feel unsafe.

### Style C — The Analyst (Precise, Data-Driven, Sceptical)
**How to spot them:** Asks detailed questions. Wants specifics. Needs to understand the mechanics. May ask for documentation. Values accuracy over enthusiasm.

**Examples:** IT directors, engineers, accountants, technical founders.

**How to sell to an Analyst:**
- Lead with DATA: numbers, percentages, timelines, ROI calculations
- Show the process: walk through exactly how the system works
- Answer every question thoroughly — don't say "trust me"
- Provide documentation: case studies with numbers, scope documents, timelines
- Use the WDYM technique (File 04) — they'll love the technical explanation
- Close with logic: "Based on the numbers, this pays for itself in 60 days."

**What kills the deal:** Vagueness, "just trust the process," hype without substance, unsubstantiated claims.

---

## HOW TO IDENTIFY THE STYLE IN 60 SECONDS

**In the first minute of a call, listen for:**

| Signal | Likely Style |
|---|---|
| "Let's get straight to it" | Driver |
| "So I was just telling my partner about..." | Influencer |
| "I want to make sure I understand this properly" | Analyst |
| "I appreciate you taking the time to explain" | Steady |
| They interrupt you | Driver |
| They tell a story about their weekend | Influencer |
| They ask about your methodology | Analyst |
| Long pauses before answering | Steady |

**Once identified, adapt your entire approach for the remaining call.**

---

## READING ZOOM BODY LANGUAGE

| Signal | Likely meaning | Your move |
|---|---|---|
| Leaning forward | Interested, engaged | Keep going. They're hooked. |
| Leaning back, arms crossed | Sceptical or closed off | Ask a question. Re-engage them. |
| Nodding frequently | Agreeing. Buying signal. | Trial close: "Sound about right?" |
| Looking away / checking phone | Losing interest | Change topic. Ask a question. Create a curiosity gap. |
| Smiling + eye contact | Strong rapport | Match their energy. Build relationship. |
| Furrowed brow | Confused or concerned | "What are you thinking? I want to make sure I'm explaining this clearly." |

---

## THE MIRRORING TECHNIQUE (Advanced)

Match their:
- **Speed:** If they talk slow, slow down. Fast talker? Speed up slightly.
- **Volume:** Quiet person? Lower your voice. Loud? Match (not exceed) it.
- **Energy:** If they're at 4/10, be at 5/10 (one notch above). Never 9/10 when they're at 3.
- **Language:** If they say "revenue," say "revenue." If they say "turnover," say "turnover." Use THEIR words.
- **Formality:** "G'day" person? Be casual. "Good morning" person? Be professional.

**Why:** Mirroring creates subconscious rapport. The prospect feels "this person is like me" — and people trust people who are like them.

---




---

## File: `references/02-outreach.md`

# Outreach: DMs, Targeting, Cold Email, Cold Calls, Advanced Frameworks

> DGK Sales Knowledge Base — reference file. Source files listed below.

## Contents
- 01 DM OUTREACH PLAYBOOK
- 03 PROSPECT WARMTH AND TARGETING
- 08 COLD CALLING AND EMAIL OUTBOUND
- 09 ADVANCED OUTREACH FRAMEWORKS

---

# DM Outreach Playbook — DGK's Complete LinkedIn DM System

> **For:** DGK team prospecting Australian B2B clients + DGK clients running their own outreach
> Core principle: Your prospect decides to pay attention or not in the first 5 words. Book 1 call per 10 DM convos. 30-35% reply rate target.
> DGK context: We sell self-running growth systems (Foundation, Outbound, Content, Ads) to Australian B2B businesses. Done-with-you model. No lock-in.

---

## SECTION 1: The 10 Greatest DM Greetings

Never send "Hello Sir" or "Dear Madam." Be casual, sophisticated, and friendly.

| # | Greeting Format |
|---|---|
| 1 | **M1:** Hey NAME. / Hey NAME, / Hey NAME - MSG |
| 2 | **M1:** NAME. **M2:** Hey / Hey there |
| 3 | **M1:** Yoooooooooo. / Yooooooo **M2:** NAME |
| 4 | **M1:** Hey there NAME |
| 5 | **M1:** Yo NAME |
| 6 | **M1:** What's up NAME |
| 7 | **M1:** So NAME. I wanted to ask you something. |
| 8 | **M1:** NAME? |
| 9 | **M1:** NAME - / NAME. / NAME, / NAME — |
| 10 | **M1:** Hey. **M2:** NAME. |

**Rules:** M1 and M2 are SEPARATE messages. Cater greeting to audience. Send 2-6 opening DMs before they reply to bypass automation radar.

### DGK-Specific Opener Examples (Australian B2B)
- "Hey NAME. Noticed you're scaling [COMPANY] out of [CITY]. Pretty solid."
- "NAME. Hey — saw you're hiring a [ROLE] on SEEK. Growing fast?"
- "Hey NAME - dig what you guys are building at [COMPANY]. How's the pipeline looking?"
- "So NAME. Had a look at your site. Quick thought on your lead gen if you're open to it."

---

## SECTION 2: Top 10 Private DM Sales Tactics

### Tactic 1 — The Authoritative Profile (Non-Negotiable)
Profile = landing page. Post 2-5x/week, build trust with case studies (specific numbers), get 99+ endorsements, 2+ recommendations.

### Tactic 2 — The Empty Connection Request
NEVER include a message. Use Sales Nav filters. Send 200+/week at 8-10 AM in prospect's timezone. Aim 40-60% acceptance. Start convos with everyone who accepts.

### Tactic 3 — The Restrained Compliment
Tone down to 4-6/10 enthusiasm.
- **BAD:** "I absolutely LOVE your growth story!"
- **GOOD:** "Solid growth at [COMPANY]. 20 staff in 2 years is pretty good for a services business."

### Tactic 4 — The Question Attack
Send 2-4 questions at once: "How's the pipeline? Running outbound? And are you hitting your targets this quarter?"

### Tactic 5 — The Value Foreshadower
Add value at all costs. For DGK:
- "Actually just built a signal-based list system for an IT MSP in Sydney — want me to show you how it works?"
- "Got a free outbound audit framework I put together. Might help you spot where leads are leaking."

### Tactic 6 — The Connector
For DGK: "Noticed you're looking for a VA for admin. Know a killer ops person in Melbourne. Want me to connect you?"

### Tactic 7 — The Outcome Independent Voice Message
(See Section 3 below)

### Tactic 8 — The Commonality Finder
Find common ground: same city/region, same industry, same opinion. Works especially well in Australian market where business community is tight.

### Tactic 9 — Address Objections
Objections = still hot. Address and send call link anyway. Craft scripts for every objection.

### Tactic 10 — Multiple Touch Points
5+ touch points to book. Like/comment on posts, endorse skills, engage across platforms.

---

## SECTION 3: The Voice Message Framework (3x More Calls)

### When to Send
Best: during live conversations, 8 AM - 12 PM their timezone. Never first message. Only when 2/10–7/10 interest. Perfect for objections.

### 4-Step Framework (30-60 seconds)
1. **Intro + genuine connection (10-15 sec)** — "Hey NAME, pleasure. Good chatting so far. Really dig what you're building at COMPANY."
2. **Get into their situation (5-15 sec)** — "Noticed you're growing the team — saw the SEEK listing."
3. **Liken to what you do / social proof (5-15 sec)** — "Actually just helped an IT company in Sydney go from 0 to 6 qualified leads a month in 60 days with outbound."
4. **Pitch call non-needy (5-15 sec)** — "Could potentially show you how. Should have a pocket of time next week if you're keen."

### Tonality: High energy, 4-6/10 enthusiasm. Neutral/downward inflection. Relaxed. Grounded. Speak slow.

### DGK VM Example
"Hey Raj, it's Dilip from DGK. Just had a look at Triple R's site — really solid operation you've built. Actually just set up a full outbound system for another NDIS provider in Vic. They're getting same-week outreach on hiring signals now. Could be worth a quick chat to see if something similar makes sense for you. Should have some time Thursday or Friday if you're open to it."

---

## SECTION 4: 15 Sales DM CTAs

| # | CTA |
|---|---|
| 1 | Wanna grab some time together this week? |
| 2 | Want me to send you my calendar link? |
| 3 | (pitch call) wanna do that? |
| 4 | Should have some free time early next week - wanna get some time together? |
| 5 | Excited to talk - feel free to book this /w me… (calendar link) |
| 6 | Here, let's do this. (link) book this call with me and we'll chat. |
| 7 | Let's do it. Book this link with me: (link) |
| 8 | Thoughts? |
| 9 | What do you think? Make sense to talk? |
| 10 | When's a good time to talk and see if we could potentially be a good fit? |
| 11 | I should have a couple slots next week. Book this with me and we'll talk (call link) |
| 12 | Would (time) AEST tomorrow work for you? |
| 13 | Worth exploring this? |
| 14 | I have (time 1) and (time 2) open this week. Which is better for you? |
| 15 | Excited to help you build this out. Here's the call link, book this with me and let me know once you found a time: (link) |

---

## SECTION 5: Anti-Automation Phrases

Prove you're human and typing off the dome:

"Was actually just thinking…" · "Actually it's funny…" · "Hmmm" · "Sitting here on your site right now" · "I'm actually in Darwin right now" · "Just hopped off a call. Made me think of you…" · "Phone's dying but real quick…" · "Peeking at your latest post rn…" · "Just had a thought actually…" · "Give me a sec" · "This just popped in my head by the way" · "I just realized…" · "My bad on the typos. In a bumpy Uber" · "At the gym right now but wanna get to this…" · "1 sec gonna get some water" · "One sec. Dog barking"

---

## SECTION 6: Status-Signaling Language in DMs

Small word choices signal whether you're high or low status. Train yourself to default to these:

**Abbreviations = High Status:**
- "let me know" → "lmk"
- "thanks!" → "thx"
- "nevermind" → "nvm"
- "honestly" → "tbh"

**Restrained Responses = High Status:**
- Instead of "Well done!" → "nice"
- Instead of "Sure!" → "ya i'll send it in a bit"
- Instead of "Thanks for your time!" → "sure"
- Instead of "That's amazing!!" → "solid"

**Use Hyphens Instead of Commas:** More casual, more off-the-cuff. "Hey - had a look at your site - pretty solid setup" reads higher status than "Hey, I had a look at your site, and it's a pretty solid setup."

**Start Key Messages With "I":** "I feel like...", "I think...", "I noticed..." — reminds them there's a real person with authority behind the screen.

**Use "unfortunately" for soft power:** "Unfortunately I won't be free this week" carries more weight than "Sorry can't do this week!"

---

## SECTION 7: Non-Needy Call-Pitch Language

"I'm willing to…" · "I might be down to…" · "Could maybe find a pocket of time…" · "I should be able to…" · "I should have a bit of time…" · "Could potentially fit you in next week…" · "Gotta see what's on my plate but…" · "Let me check my calendar real quick…" · "Actually idk if I have time next week but I'll check my calendar…"

---

## SECTION 8: Advanced DM Micro-Tactics

### Line Length Variation
Vary lengths — sometimes a full paragraph, sometimes 1 word. Looks off-the-cuff and genuine.

### Multi-Threading
Run 2 conversations: 1 personal, 1 business. Personal thread builds warmth, then naturally drops as you transition to booking the call.

### Vulnerability & Openness
Open up → they open up → connection deepens → hyper-relevance increases. Tell stories. Layer in social proof. Give opinions.

### Skepticism (Devil's Advocate)
Don't be 100% sold on their business. Play devil's advocate to control frame.
Phrases: "Why do that?" · "I have a completely different approach actually" · "I've actually never seen it work well like that" · "Huh OK" · "I don't get why you'd do that"

### Throwing Rope (Hormozi: Personalization Pillar)
Give prospects reasons to reply. Answer "What's in it for me?" detached from the sale:
- Foreshadow valuable/relevant intros
- Give away COURSE-LEVEL value
- Build RELEVANT social proof
- Authority-building observations
- "Got quite a few friends in your space" sentences

**Hormozi addition — Do Your Homework on Good Leads:**
Before reaching out to a high-value prospect, spend 5 minutes:
- Look at their LinkedIn profile and recent activity
- Check their website (traffic, hiring, recent news)
- Search them on SEEK for hiring signals
- Check their Google reviews / industry presence
Then personalize: "Hey Greg, I see your site traffic is showing [X]. Had another client in a similar spot — they're up 100% 90 days later. Prepped a quick walkthrough if you're keen."

### Mirroring & Resonating
Mirror energy +1 notch. Don't be at 9/10 if they're at 3/10.
- **GOOD:** "Yeah that makes sense… 100%. Have you tried [alternative]? Crazy how fast…"

### Remove Question Marks Strategically
No question mark at end of single-sentence messages. Conveys "I care but I don't really care." Casual, spontaneous, not conveying low competence.

---

# Prospect Warmth, Targeting & Lead Scoring — DGK's Prioritization System

> **For:** DGK team prioritizing outreach + DGK clients building their targeting systems
> Warmer prospects = more likely to reply and book. Prioritize outreach by warmth + lead score.
> DGK targets: Australian B2B businesses (IT/MSP, NDIS, trades, professional services, SaaS) stuck on referrals.

---

## THE 6 LEVELS OF LINKEDIN PROSPECT WARMTH

### Level 1 — Neutral (70-95% of prospects) → 5-10% call booked rate
Connections who haven't engaged with content or viewed profile. Can reach out anytime. Nurture with content.

### Level 2 — Profile Viewers (5-15%) → 10-20% call booked rate
Anyone who viewed your profile. Reach out ASAP — 24-hour window is key.

### Level 3 — Requests Received (10-15%) → 10-20% call booked rate
Anyone who sent YOU a connection request. They made the first move.

### Level 4 — Content Engagers (5-10%) → 15-25% call booked rate
People who liked/commented on your post. Use that post as convo starter.

### Level 5 — Lead Magnet Engagers (5-30%) → 10-30% call booked rate
Commented on a lead magnet post (keyword to receive). Send resource + pry pain points.

### Level 6 — Inbound Leads (1-10%) → 50-90% call booked rate
HOT. Message you first with high intent. Pre-built trust. Hard to mess up.

**Priority order:** 6 → 5 → 4 → 2 → 3 → 1

---

## HORMOZI LEAD SCORING SYSTEM (Layered On Top)

Beyond warmth level, score leads on QUALIFICATION:

### Step 1: Define Your Best Customer Profile
Look at your best customers — the actions they take and who they are (demographics).
For DGK: B2B founder/director, 5-50 staff, services business, active on LinkedIn, frustrated with referral dependency, has budget for growth systems.

### Step 2: Build Scoring Questions
Ask during opt-in, application, booking form, or discovery in DMs:
- Company size / revenue range
- Current lead generation method (referrals only = high score)
- Have they hired for marketing before? (yes + failed = high score)
- Are they posting on LinkedIn? (active = easier to help)
- Timeline urgency (this quarter = high score)

### Step 3: Score Leads (Traffic Light System)
- 🟢 **GREEN (Hot):** Matches ICP perfectly, has budget, has urgency, active on LinkedIn. Route to Dilip / senior closer.
- 🟡 **YELLOW (Warm):** Matches ICP partially, may need nurturing, exploring options. Standard follow-up sequence.
- 🔴 **RED (Cold):** Wrong fit, no budget, tire-kicker. Minimal effort — long-term content nurture only.

### Step 4: Route Best Leads to Best Closers
Don't waste your best leads on junior team members. DGK rule: GREEN leads go to Dilip directly.

### Step 5: Segment Your Messaging
Personalize outreach based on what you know:
- **IT/MSP prospect:** Reference IT Together case study (0→6 enquiries in 60 days)
- **NDIS provider:** Reference Triple R case study (same-week outreach on SEEK hiring signals)
- **Trades/services:** Reference A Plus Autorepair (full system handover in 12 weeks)
- **General B2B:** Reference CPL down 62% in Q1

---

## DGK'S 130+ SALES SIGNALS FOR TARGETING

Signal-based outreach = reaching out when timing is perfect. DGK tracks:
- **Hiring signals:** Job posted on SEEK/Indeed for roles you can help with (marketing hire = they need systems)
- **Funding signals:** Received investment, grants, government contracts
- **Tech stack signals:** Adopted new CRM, marketing tool, or dropped one
- **Growth signals:** New office, new location, team expansion
- **Pain signals:** Negative reviews mentioning service gaps, website issues
- **Content signals:** Started posting on LinkedIn (or stopped = they need help)
- **Competitor signals:** Their competitor just launched outbound

For DGK clients: Build signal-based lists using these triggers. Automate into outbound sequences.

---

## 50%+ CONNECTION REQUEST ACCEPTANCE RATE CHECKLIST

### 1 — Time of Day
Send at 8-11 AM in prospect's timezone (Mon-Thu). For Australian prospects: AEST/AEDT morning.

### 2 — Active Profile
Check recent activity. Filter with "Posted on LinkedIn" in Sales Nav.

### 3 — Invested Profile
Look for: profile picture, banner, tagline, about section, 500+ connections.

### 4 — Your Profile
500+ connections, trust-building photo, banner calling out ICP, 2+ recommendations, experiences filled out.
DGK profile: "We build self-running growth systems for Australian B2B. Done with you. Owned by you."

### 5 — Your Content
At least 2 posts/week. Prospects check. Inactive = looks automated.

### 6 — Mutual Connections
More mutuals = more familiarity = higher acceptance. Build connections in target industries.

### 7 — Hyper-Target
Only send to target market. Use Sales Nav filters + boolean exclusions.

### 8 — Manual vs. Automation
If below 40-50% acceptance: go manual. Manual = 10-15% higher acceptance. 40 requests/day Mon-Fri.

---

## COMPETITOR INTELLIGENCE

**Mystery shop your competitors:** Study their sales process, the quality of questions they ask, their mannerisms. Take notes. Then do the opposite. This gives you guaranteed positive ROI on your own sales approach.

**Use Google Maps for local targeting:** If you're selling to local businesses, search their closest competitors by radius, then name-drop them. "I noticed [competitor 2 blocks away] is running outbound now. Have you thought about it?"

**Research tools for prospect homework:**
- Crunchbase (funding, investors, growth stage)
- LinkedIn (team size, hiring, recent posts)
- Google News (press, events, acquisitions)
- BuiltWith (tech stack)
- SEEK/Indeed (hiring signals)
- Google Reviews (customer sentiment)

---

## WEEKLY VOLUME TARGETS

| Metric | Target |
|---|---|
| Connection requests/week | 200 hyper-targeted |
| Expected accepted/week | 80-100+ (40-50%+) |
| New people to DM/month | 320-400 |
| Call booked rate from DMs | 1 per 10-15 convos |
| Sales calls/month | 20-40+ |
| Close rate on qualified calls | 20-30% |

**Hormozi reminder:** Volume negates luck. Don't be afraid to reach out more than once. They gave you permission — contact them like you mean it.

---

# Cold Calling & Email Outbound — DGK's Multi-Channel Outreach Playbook

> **For:** DGK team running outbound campaigns + DGK clients learning cold outreach beyond LinkedIn
> **Why this matters:** LinkedIn DMs are powerful but they're ONE channel. The best outbound systems use multiple channels — email, phone, LinkedIn, text — working together. This file covers cold calling scripts and cold email sequences.
> **DGK context:** Our Outbound phase builds 3 tiers for clients: omnichannel (email + LinkedIn + phone), multichannel (email + LinkedIn), and email-only. This file is the playbook for channels beyond LinkedIn.

---

## SECTION 1: THE COLD CALL SCRIPT

Cold calling is the fastest way to book a meeting — IF you do it right. Most people are terrible at cold calls because they pitch immediately. Your job on a cold call is NOT to sell. It's to get the prospect feeling emotional about the problems you fix, and then book a discovery call.

### The Structure: Intro → Bridge → Q&A → Book

### Step 1 — The Intro (5 seconds)
Keep it dead simple. No pitch. No explanation. Just your name.

Them: "Hello?"
You: "Oh hey... [slight pause] ...John?"
Them: "Yes?"
You: "John, this is Dilip."
[Move straight to Bridge]

**Why it works:**
- "Oh hey" sounds like you know them (pattern interrupt — they think they should know you)
- The slight pause creates intrigue
- Just your first name — casual, not corporate
- NO "Hi I'm Dilip from DGK Business Consultancy calling about..." — that's an instant hang-up trigger

### Step 2 — The Bridge (15 seconds)
This is the make-or-break moment. You acknowledge it's a cold call (honesty = respect) and give them a choice (autonomy = disarms defensiveness).

You: "I'm... [slight pause] ...gonna be upfront. This is a cold call. Do you want to hang up, or should I tell you why I'm calling?"

**If they say "No / Hang up":**
You: "So you're not the least bit curious to know why I'm calling?"
Them: "Nope."
You: "So does that mean even if we could fix problems that [job title]s like yourself deal with — like [problem 1], [problem 2], and [problem 3] — you wouldn't care to explore that?"
Them: "Nope."
You: NEXT. Move on. Don't beg. (But note: most people will engage after the second question.)

**If they say "Yes / Go ahead":**
You: "So I mostly work with [job title]s like yourself who are responsible for [their main responsibility]. Not much different than you guys. They tell me they struggle with [problem 1], [problem 2], and [problem 3], and as a result it causes [undesirable outcome 1] and [undesirable outcome 2]. Am I correct in assuming you DON'T relate to any of what I just said?"

**DGK Cold Call Bridge Example:**
"So I mostly work with founders and directors of B2B services businesses — not much different from you guys. They tell me they're stuck relying on referrals, their website generates zero leads, and when they try outbound it falls flat. As a result, revenue is unpredictable and they can't hire or grow with confidence. Am I correct in assuming you don't relate to any of that?"

**Why "don't relate" works:** It's a negative assumption. Psychologically, people correct negative assumptions. They'll say "No, actually we DO have those problems." Now THEY'RE telling YOU why they need help. Frame = flipped.

### Step 3 — Q&A (5-15 minutes, if they engage)
Regardless of what they say to your bridge, follow up with:
You: "Oh. [genuinely curious tone] Can you tell me more about that?"

Then just listen. Ask follow-up questions. Try to do discovery on the call. If there isn't enough time, book the appointment.

**Key questions:**
- "How long has that been going on?"
- "What have you tried so far?"
- "How's that affecting the business?"
- "What would it look like if that was solved?"

### Step 4 — Book the Meeting
You: "Look, I think it'd be worth a proper conversation. I've got 30 minutes Thursday or Friday — which works better for you?"

**Rules:**
- Give TWO options (not "when are you free?" which is too open)
- Don't pitch your product on the cold call — save it for the discovery call
- If they push back: "Totally get it. It's a 15-minute call — if nothing comes of it, no worries at all."

### Cold Call Pro Tips
1. **Double-dial:** Call twice back-to-back. Many phones block the first unknown call but let the second through.
2. **Use wireless headphones and walk around.** The energy from walking makes you more optimistic and calm. The prospect will mirror your energy.
3. **Call lowest-value leads first** in the morning to warm up and "grease the rust." Save high-value leads for when you're sharp.
4. **5 minutes before each call:** Close your eyes and ask: "How would someone who is financially set and not intimidated by anyone act on this call?" Visualize it. Feel it. Then dial.
5. **Let the prospect talk first** on scheduled calls. Listen to their tonality so you can mirror them.
6. **If the prospect is 7+ minutes late:** Leave the meeting and decline the calendar invite. Don't chase. They'll see the notification, feel bad, and reach out to apologize. Rebook on YOUR terms.
7. **Break your sales process into micro-sales:** Cold call = sell the discovery meeting. Discovery = sell the idea of letting you help. Demo = sell the solution. Close = sell the outcome.

---

## SECTION 2: COLD EMAIL SEQUENCES

Cold email is a numbers game with a skill ceiling. The right subject line and body can 10x your response rate. Below are tested frameworks.

### Email Signature Rules
- Remove "Sales" from your title. Use "Business Development," "[Industry] Advisor," or "Growth Consultant."
- Keep it minimal: just your name and company name/site
- Use lowercase for casual, high-status feel when appropriate
- DGK signature: "Dilip Sapkota | DGK Business Consultancy | dgkbusinessconsultancy.com"

### Email 1 — The Partnership Frame
**Subject:** DGK x [their first name]
**Body:**
Hey [Name], not sure if this is for you but figured I'd ask.

We've been partnering with B2B founders in [their industry] and supporting them with building predictable pipeline systems.

Worth a chat?

- Dilip

**Why it works:** "Not sure if this is for you" = pattern interrupt + non-needy. "Worth a chat?" = the easiest possible CTA to say yes to.

### Email 2 — The Hand-Selection Frame
**Subject:** Re: Hi [first name]
**Body:**
Hi [Name], we've been hand-selecting B2B services businesses in [city/industry] to pilot our outbound system.

LMK if you want to explore opportunities.

- Dilip

**Why it works:** "Hand-selecting" = you're the prize. "Pilot" = exclusive, limited access. "LMK" = casual, not desperate.

### Email 3 — The Referral Frame
**Subject:** via [high-status referral name]
**Body:**
[Name], [referral] suggested we talk about how we can help you build a pipeline that doesn't depend on referrals.

What do you propose as next steps?

- Dilip

**How to get the referral:** Cold call a different decision maker in a different department (or a mutual connection) and ask to be pointed to the right person. Use their name as the referral. Even a brief "Katie said I should reach out" is enough.

### Email 4 — The FOMO Frame
**Subject:** should we explore?
**Body:**
Hey [Name], we've been partnering with multiple companies in your space (can't name-drop out of respect for privacy).

So far we've supported ~75% of them and I realized you're one of the 25% we haven't had a conversation with yet.

Let's jump on a call sometime early next week to explore opportunities?

### Email 5 — The Direct Frame
**Subject:** [DGK] <> [their company name]
**Body:**
[Name], I'd be happy to discuss a partnership opportunity with you.

[Wait 2 days, then reply to this email with Email 6]

### Email 6 — The Follow-Up (Reply to Email 5)
**Subject:** Re: [DGK] <> [their company name]
**Body:**
Hey [Name], just following up on this. Worth a quick call to see if there's a fit?

If not, no worries — I'll stop reaching out.

- Dilip

**Why "I'll stop reaching out" works:** Creates scarcity. The prospect realizes this is their last chance. Many will reply at this point.

### Cold Email Sequence Timing
- **Day 1:** Email 1
- **Day 3:** Email 2 (reply to Email 1)
- **Day 6:** Email 3 or 4
- **Day 9:** Email 5
- **Day 11:** Email 6 (reply to Email 5)
- **Day 14+:** Move to long-term nurture or LinkedIn DM outreach

### Cold Email Pro Tips

1. **Lead with CURIOSITY, not interest.** Don't pitch. Make them curious enough to reply.
   - Clown: "We help companies like yours increase revenue!"
   - Chad: "We just helped [competitor name] generate $50K in 60 days. Got me thinking — maybe we should explore some opportunities together."

2. **Use hyphens instead of commas** for a more casual, high-status feel in email/text.

3. **Use abbreviations** to signal high status: lmk, thx, nvm, tbh. Casual = confident.

4. **Add "unfortunately" before bad news.** Slightly patronizing, reaffirms status.
   - Clown: "I can't make it, sorry!"
   - Chad: "Unfortunately I won't be able to attend."

5. **Structure questions to anticipate all answers.** Don't box yourself in:
   - Clown: "Are you concerned with X?" (yes/no = dead end)
   - Chad: "How concerned are you with X?" (opens up probing regardless of answer)

6. **When sending agreements, don't write "[Their Company] Agreement."** That makes them feel too important. Instead: "PO-2716" — commoditize it as routine. You send POs out every day.

7. **Only do paid proposals.** If they move forward, it gets deducted from the price. Prevents: doing nothing, shopping your deal to competitors, using you for free consulting.

8. **Mystery shop your competitors.** Study their sales process, question quality, mannerisms. Take notes. Then do the opposite.

---

## SECTION 3: DGK'S 3-TIER OUTBOUND SYSTEM

When building outbound for DGK clients, implement one of three tiers based on their capacity:

### Tier 1 — Email Only (Entry Level)
- 3-5 sending domains, warmed inboxes
- Signal-based lists (130+ triggers)
- 5-email sequence per prospect
- Positive replies route to CRM
- Volume: 200-500 prospects/month
- Best for: Clients with no sales team, just the founder

### Tier 2 — Multichannel (Email + LinkedIn)
- Everything in Tier 1 PLUS:
- LinkedIn connection requests + DM sequences (from File 01)
- Follow-up frameworks (from File 02)
- Lead scoring + warmth prioritization (from File 03)
- Volume: 500-1000 prospects/month
- Best for: Clients with 1-2 people doing sales

### Tier 3 — Omnichannel (Email + LinkedIn + Phone)
- Everything in Tier 2 PLUS:
- Cold calling using the script above
- Double-dial cadence (from Hormozi's 7-day framework in File 02)
- Day-of texting for booked calls
- Voicemail drops
- Volume: 1000+ prospects/month
- Best for: Clients with a dedicated sales team or SDR

### Channel Coordination
The power is in hitting prospects across MULTIPLE channels in a coordinated sequence:
- **Day 1:** Email 1 + LinkedIn connection request
- **Day 2:** If connected on LinkedIn, send DM opener (File 01)
- **Day 3:** Email 2 (reply to Email 1) + cold call attempt
- **Day 4:** LinkedIn voice message if connected (File 01, Section 3)
- **Day 6:** Email 3 + second cold call
- **Day 8:** LinkedIn follow-up (File 02 frameworks)
- **Day 11:** Email follow-up + final cold call
- **Day 14:** LinkedIn "Fuck It" follow-up (File 02, Framework 8) OR move to long-term nurture

**Principle:** Each channel reinforces the others. By the time they see your email, they've already seen your LinkedIn profile. By the time you call, they recognize your name. Multi-channel creates familiarity, and familiarity creates trust.

---

# 09 — Advanced Outreach Frameworks for DGK

> **For:** DGK team running outbound to acquire Australian B2B clients
> **Assumes:** You've read Files 01-08. This file builds on those foundations with advanced frameworks.
> **How to use this file:** Each framework is rated for DGK on a 1-5 scale. Start with the 5/5 frameworks. Layer in others as you get comfortable.

---

## DGK RATING SYSTEM

| Rating | Meaning | When to learn |
|---|---|---|
| ⭐⭐⭐⭐⭐ | Essential for DGK — use daily | Week 1 |
| ⭐⭐⭐⭐ | High impact — use weekly | Week 2-3 |
| ⭐⭐⭐ | Situational — use when the trigger fits | Week 4+ |
| ⭐⭐ | Nice to have — use occasionally | After mastering 4-5 star frameworks |
| ⭐ | Low priority for DGK's model | Only if you have bandwidth |

---

## PART 1: THE 9 CORE ADVANCED FRAMEWORKS

---

### FRAMEWORK 1 — The Trojan Horse DM
**DGK Rating:** ⭐⭐⭐⭐⭐

**What it is:** Send something they'd keep even if they never buy. The gift carries the pitch — it demonstrates your process, your proof, and your capability without you saying "hire me."

**The psychology:** People feel obligated to reciprocate gifts (Cialdini's reciprocity principle). But the real trick is the gift itself IS the proof. They use your signal list or domain map and think "if the free thing is this good, what does the paid version look like?"

**When to use:**
- Your DMs get opened and ignored
- Prospect is Bucket 1 (1-6/10 interest)
- You've researched them enough to build something specific
- You need to stand out from 50 other DMs they got today

**When NOT to use:**
- Prospect is already Bucket 2 (just nudge them to book)
- You don't have time to build something custom (a generic PDF isn't a Trojan Horse)
- The gift doesn't work on its own without buying from you

**How DGK uses it:**
1. Research: check their website, SEEK listings, LinkedIn activity (5-10 min)
2. Build: create a small deliverable specific to them. Examples:
   - Domain health map showing their outbound infrastructure gaps
   - 12-signal target list for their specific ICP
   - Quick website audit — 3 conversion killers they're missing
   - Content calendar template pre-filled with topics for their industry
3. Send: "Hey NAME. Noticed [signal]. Built you [specific thing]. Attached. No ask. Use it or bin it, either way it's yours."
4. Wait: they use it → reply to say thanks → NOW you pitch

**DGK-specific templates:**

For IT/MSP prospects:
"Hey NAME. Saw you're scaling the MSP. Built you a quick outbound target list — 15 companies in [CITY] that just posted IT roles on SEEK this month. Attached. No ask. Use it or don't."

For NDIS providers:
"Hey NAME. Noticed Triple R is growing — the SEEK listings gave it away. Put together a 1-page participant acquisition map showing 3 channels most NDIS providers miss. Attached. Yours to keep."

**Rules:**
- The gift MUST work on its own. If it's useless without buying from you, it's bait, not a gift.
- Spend 15-30 min max building it. It's a wedge, not a proposal.
- Don't attach a price list or CTA. The gift does the selling.
- Follow up 3-4 days later: "Did you get a chance to look at that? Curious what you thought."

---

### FRAMEWORK 2 — Signal Based Selling
**DGK Rating:** ⭐⭐⭐⭐⭐

**What it is:** Stop blasting a static list. Only write when something just CHANGED in the prospect's world. The signal is line one of your message — everything else is filler.

**The psychology:** Timing beats messaging. A perfectly written email to someone with no pain = deleted. A mediocre email to someone who just lost their marketing hire = "tell me more." Signals catch people at the moment of maximum pain.

**The 5 signals (priority order):**

| Signal | Where to find it | Why it matters |
|---|---|---|
| 1. Funding round closed (last 60 days) | Crunchbase, LinkedIn announcements | They have money AND pressure to deploy it |
| 2. New VP/Director of Sales/Marketing (last month) | LinkedIn job changes | New leader = new initiatives = budget for systems |
| 3. Job ads for marketing/sales roles open now | SEEK, Indeed, LinkedIn Jobs | They KNOW they need help and are spending to find it |
| 4. Tools added or dropped from stack | BuiltWith, LinkedIn posts | They're actively changing their systems = open to new approaches |
| 5. They posted about the exact problem you solve | LinkedIn feed, comments | They've publicly admitted the pain = warmest signal |

**When to use:**
- Your reply rate is below 15%
- Your list is going stale (same names, no replies)
- You want to sound relevant, not random
- You're doing outbound for DGK clients (signal-based IS DGK's product)

**When NOT to use:**
- Inbound leads (they already signaled by reaching out)
- Warm conversations already in progress (don't restart with a signal)

**How DGK uses it:**
Your opener IS the signal. Nothing else first.

- "Hey NAME — saw you posted a marketing coordinator role on SEEK this week. Growing the team?"
- "NAME. Noticed you just dropped HubSpot and picked up GoHighLevel. Big migration. How's it going?"
- "Hey NAME — saw your post about referral dependency yesterday. Hit close to home honestly."

**Rule:** No signal = no reason to write. If you can't find a signal, skip them and move to the next prospect. Better to send 20 signal-based messages than 100 generic ones.

---

### FRAMEWORK 3 — Micro Commitment Laddering
**DGK Rating:** ⭐⭐⭐⭐⭐

**What it is:** Nobody goes from cold email to signed contract in one step. Each ask costs a little more commitment than the last. Skip a rung and they no-show.

**The psychology:** Consistency principle (Cialdini). Once someone says yes to something small, they're psychologically wired to stay consistent with that identity. A person who replied "yes" to your DM is now "someone who engages with Dilip" — making it easier to say yes to the next ask.

**The 6 rungs for DGK:**

| Rung | Ask | Commitment cost |
|---|---|---|
| 1 | Get a one-word reply | Almost zero — just typing a word |
| 2 | "Yes, send it over" | Small — agreeing to receive something |
| 3 | They open/read the resource | Medium — investing time |
| 4 | They answer 2 questions about their business | Higher — sharing information |
| 5 | 15-minute call (not 30) | Significant — blocking calendar time |
| 6 | Paid audit → then Foundation build | Real money committed |

**When to use:**
- Calls get booked then no-showed
- Prospects agree to "chat sometime" but never follow through
- You're pitching too much too fast

**When NOT to use:**
- Inbound leads at 8-10/10 interest (they're ready, don't slow them down)
- Prospect explicitly asked for pricing/proposal (give it to them)

**How DGK uses it:**
Instead of DM → "book a 30-min strategy call" (skipping rungs 1-4), do:

DM → get a reply (rung 1) → offer to send something (rung 2) → they read it (rung 3) → ask 2 questions: "How are you getting clients right now? And are you mostly referral-dependent?" (rung 4) → "Could walk you through how we fixed that for IT Together in 15 min. Want me to send a link?" (rung 5) → paid Foundation audit (rung 6)

**Rule:** Ask for the next rung, never the whole ladder. "Want to jump on a call and I'll walk you through our full system and pricing" = 4 rungs at once = no-show.

---

### FRAMEWORK 4 — Warm-Up Domain Stacking
**DGK Rating:** ⭐⭐⭐⭐⭐

**What it is:** One domain sending 500/day = spam. Spread volume across multiple burner domains. Protect the brand.

**The structure:**
- **yourbrand.com** → NEVER sends cold. Ever. This is your reputation.
- **trybrand1.com / trybrand2.com / trybrand3.com** → Warmed for 3 weeks each
- Each domain gets 3 inboxes (dilip@, team@, hello@)
- Each inbox sends max 30/day
- **3 domains × 3 inboxes × 30 sends = 270/day**

**When to use:**
- Setting up cold email for DGK
- Setting up outbound for any DGK client
- Scaling volume beyond 50 emails/day

**Rules:**
- Volume comes from more inboxes, never more sends per inbox
- One bad list should cost you a burner, not your company
- Warm every domain for minimum 3 weeks before sending cold
- Monitor deliverability weekly (check spam rates, bounce rates)
- Rotate domains if one gets burned — don't try to save it

**DGK client setup standard:**
For every client, set up minimum 3 burner domains + 3 inboxes each = 270/day capacity. Primary domain never touches cold. This is Phase 2 (Outbound) foundational infrastructure.

---

### FRAMEWORK 5 — ICP Psychographic Mapping
**DGK Rating:** ⭐⭐⭐⭐⭐

**What it is:** Firmographics tell you WHO to send to (title, headcount, industry). Anyone can pull that list. Psychographics tell you WHAT TO SAY — and that's where conversion lives.

**The iceberg:**
- **Above water (Firmographics):** Title, headcount, tools, location → anyone can filter for these
- **Below water (Psychographics):** What they've been blamed for, where budget usually goes, what they've already tried, the WORDS they use for the problem, the number they report up to their boss

**When to use:**
- Every message you write sounds like everyone else's
- Reply rates are fine but conversion to calls is low
- You're writing copy for DGK outbound sequences
- You're building content for LinkedIn

**How to map psychographics:**

| Source | What to mine |
|---|---|
| Their LinkedIn posts | The language they use to describe their problems |
| Their LinkedIn comments | What topics get them heated/engaged |
| Google Reviews of their business | What their customers complain about (= their pain) |
| SEEK job listings | What skills they're hiring for (= what they lack internally) |
| Competitor websites | What language competitors use (= what the market expects) |
| Industry forums/Reddit | Unfiltered complaints and frustrations |

**DGK application:** Don't say "we help with lead generation." Say what THEY say: "stuck on referrals," "wasted money on an agency that owned everything," "can't predict next quarter's revenue," "tired of being the bottleneck." Pull language from their posts and calls, not from your website.

**Rule:** The words THEY use to describe the problem are always more powerful than the words YOU use to describe your solution.

---

### FRAMEWORK 6 — Pain Agitate Solution (PAS)
**DGK Rating:** ⭐⭐⭐⭐

**What it is:** Three moves, under 75 words total. Name what hurts BEFORE you name what you sell. Two lines of pain buy you one line of pitch.

**The formula:**
1. **PAIN** — Name one thing they already feel on Monday morning
2. **AGITATE** — Show what it costs if it stays that way
3. **SOLUTION** — One-line fix, then one very small ask

**When to use:**
- Writing cold emails (this IS your email body structure)
- Writing LinkedIn DM openers for Bucket 1 prospects
- Creating ad copy for DGK's LinkedIn Ads phase
- Any time your copy opens with what you DO instead of what HURTS

**When NOT to use:**
- Warm conversations (they already know the pain — don't re-agitate)
- Voice messages (too scripted for VM; keep VMs conversational)

**DGK PAS examples by industry:**

**IT/MSP:**
P: "You're running a 12-person MSP and every new client comes from referrals or a lucky Google search."
A: "That's $20K+ in monthly revenue you're leaving to chance."
S: "We built IT Together a system that generates 6 qualified enquiries a month. Want the breakdown, or not a priority right now?"

**NDIS:**
P: "You posted 3 support coordinator roles on SEEK but you're still finding participants by word of mouth."
A: "Every week without outbound is participants going to your competitor down the road."
S: "Fixed this for another NDIS provider in 60 days. Worth a look?"

**Trades:**
P: "Your website looks great but there's no booking form above the fold and no retargeting."
A: "Every visitor who leaves without enquiring is a job going to the guy with the uglier site but better funnel."
S: "We sorted this for a mechanic in Darwin in 3 weeks. Want me to send the before/after?"

**Rule:** Twist once, then stop. Pain they recognise in THEIR words, not your category jargon.

---

### FRAMEWORK 7 — The Breakup Email
**DGK Rating:** ⭐⭐⭐⭐

**What it is:** The last email in the sequence gets more replies than the first four combined. People reply to an ending, not to a beginning. Losing the contact is what wakes them up.

**The psychology:** Loss aversion — humans feel losses 2x more intensely than equivalent gains. When you say "I'm closing your file," the prospect feels they're LOSING access to you. That fear of loss triggers a reply.

**When to use:**
- After 3-4 unanswered emails/DMs
- As the final email in any cold sequence
- When you genuinely intend to stop (don't fake breakups)

**When NOT to use:**
- After only 1-2 touches (too early)
- With warm leads who just need a nudge
- If you're going to keep messaging anyway (fake breakups kill credibility)

**The structure:**
Email 1 → Email 2 → Email 3 → Email 4 → **BREAKUP**

Reply rate across the sequence rises sharply at the breakup. The breakup gets more replies than emails 1-4 combined.

**What the breakup email says:**
"I'm closing your file on [day]." No guilt trip. No last chance pitch. One useful thing left behind. Then actually stop.

**DGK breakup templates:**

**LinkedIn DM breakup:**
"Hey NAME — I'll leave it here. Left a quick outbound audit template in case it's ever useful: [link]. All the best with the business."

**Cold email breakup:**
Subject: closing your file
"NAME — going to close this out on Friday. No stress. If the timing's ever better, I'm around. Left a quick domain health checker here if useful: [link]. Cheers, Dilip"

**Rule:** "Just checking in" is not a reason to write. Closing the loop IS. Write the ending you mean. Then actually stop.

---

### FRAMEWORK 8 — Negative CTA
**DGK Rating:** ⭐⭐⭐⭐

**What it is:** Stop asking for the meeting. Give them an easy way to say NO. Counterintuitively, this gets more replies AND cleaner data.

**The psychology:** Decision paralysis. When you say "Got 15 minutes Thursday at 2?" it feels like a trap. They have to commit time, energy, and emotional risk. When you say "Want me to send it over instead?" or "Or is this not a priority?" — you've lowered the cost of replying to almost zero. Even a "no" is valuable because it cleans your list.

**Comparison:**

| The Usual Ask | Result | The Negative CTA | Result |
|---|---|---|---|
| "Got 15 minutes Thursday?" | Feels like a trap before they trust you | "Want me to send it over instead?" | Easy yes — just permission to receive |
| Silence | Nothing learned | "Or is this not a priority right now?" | Honest reply, even when it's a no |
| Reply rate stays flat | | More replies, cleaner list | |

**When to use:**
- Your open rate is fine but nobody replies
- Early in the sequence (emails 1-2) when trust is low
- LinkedIn DMs where the prospect hasn't shown interest yet
- Any time you'd normally end with "can we hop on a call?"

**When NOT to use:**
- Prospect is Bucket 2 (already said they want to talk — just send the link)
- You've already built rapport and they're warm

**DGK negative CTA examples:**
- "Want me to send the breakdown, or not a priority right now?"
- "Worth a look, or is the timing off?"
- "Happy to send the case study over — or should I check back in a few months?"
- "Want me to put together a quick audit, or is this not on your radar?"

**Rule:** The easiest yes to give is permission to send something. The second easiest is telling you it's not a priority. Both are better than silence.

---

### FRAMEWORK 9 — Wedge Offer Positioning
**DGK Rating:** ⭐⭐⭐⭐⭐

**What it is:** Don't sell the whole thing first. Sell the one small painful piece they already know is broken. Small job in, big contract later.

**The psychology:** A big proposal triggers the "I need to think about it" response because the decision feels irreversible and high-risk. A small wedge feels low-risk — "worst case I'm out $500 and I got an audit." Once they experience your work quality on the wedge, the bigger commitment feels safe.

**The ladder:**
1. **WEDGE** → the one job they already know is broken (free or very cheap)
2. **AUDIT** ($) → one narrow fix, paid, small scope
3. **PILOT** ($$) → paid project, limited duration
4. **RETAINER** ($$$) → the real contract, ongoing

**Rule:** A big first ask goes to legal and dies there. A small paid job now beats a big proposal never.

**When to use:**
- The full offer keeps getting "we'll think about it"
- Prospect is price-sensitive
- They've been burned by agencies before (high trust barrier)
- Long sales cycle with multiple decision makers

**DGK's wedge ladder:**

| Stage | DGK Offer | Price Range | Commitment |
|---|---|---|---|
| Wedge | Free outbound health check / website audit | Free | 15-min call or async delivery |
| Audit | Paid Foundation diagnostic | $500-$1,500 | 2-3 hours of work |
| Pilot | Foundation build (Phase 1 only) | $3,000-$6,000 | 4-6 weeks |
| Retainer | Outbound + Content management | $2,000-$5,000/mo | Ongoing |

**How to pitch the wedge:**
"Let me do a quick outbound health check — I'll map your domain setup, list quality, and sequence gaps. Takes me a couple hours. If it's useful, we talk about fixing it together. If not, you keep the audit. No strings."

---

## PART 2: ADDITIONAL ADVANCED FRAMEWORKS

---

### FRAMEWORK 10 — Before-After-Bridge (BAB)
**DGK Rating:** ⭐⭐⭐⭐

**What it is:** Paint the BEFORE state (their current pain), the AFTER state (life with the problem solved), and the BRIDGE (how to get there). Similar to PAS but more aspirational.

**The formula:**
1. **BEFORE** — "Right now you're [current painful reality]"
2. **AFTER** — "Imagine [life with the problem solved]"
3. **BRIDGE** — "Here's how we got [client] there: [one sentence]. Worth exploring?"

**When to use:**
- LinkedIn posts and content (drives engagement)
- DMs to prospects who are problem-aware but haven't taken action
- Cold emails to prospects who've been sitting on the problem for months

**DGK BAB example:**
"Right now your pipeline depends on who you know and who refers you. Imagine having 6 qualified enquiries landing in your CRM every month without you lifting a finger. That's exactly what IT Together got in 60 days. Want me to show you how?"

**Rule:** The AFTER has to be specific and believable. "Imagine growing your business" = vague. "Imagine 6 qualified enquiries a month in your CRM" = specific. Numbers make the AFTER real.

---

### FRAMEWORK 11 — The Social Surround
**DGK Rating:** ⭐⭐⭐⭐

**What it is:** Before you ever cold message someone, make sure they've seen your name 3-5 times across multiple surfaces. By the time your DM arrives, you're not a stranger — you're "that person I keep seeing."

**The sequence (5-7 days before your DM):**
1. **Day 1:** View their LinkedIn profile (they see the notification)
2. **Day 2:** Like one of their posts (genuine, not random)
3. **Day 3:** Comment on a post with a thoughtful 2-sentence response
4. **Day 4:** Follow their company page
5. **Day 5:** Endorse their top 2 skills
6. **Day 6-7:** Send the DM

**When to use:**
- High-value prospects you really want to win
- Prospects who are active on LinkedIn (post regularly)
- When you have time to play the long game (1-2 weeks)

**When NOT to use:**
- Prospects who are inactive on LinkedIn (no posts to engage with)
- High volume outbound (too time-intensive per prospect)
- Inbound leads (they're already warm — just respond)

**DGK application:** Reserve this for your top 10-20 "dream clients" per month. The prospects where one deal would be worth $10K+. For everyone else, use standard signal-based outreach.

**Rule:** Every touch must be genuine. Liking 5 posts in a row or commenting "Great post!" on everything = obvious and creepy. One genuine comment that shows you read the post > five lazy likes.

---

### FRAMEWORK 12 — The 3x3 Research Method
**DGK Rating:** ⭐⭐⭐⭐

**What it is:** Before reaching out, find 3 things about the COMPANY and 3 things about the PERSON in 3 minutes. This gives you enough personalization to sound relevant without spending an hour per prospect.

**The 3x3:**

| About the Company (3 min) | About the Person (3 min) |
|---|---|
| 1. What do they sell / who do they serve? | 1. How long in current role? |
| 2. Any recent news, hiring, or growth? | 2. Any recent posts or content? |
| 3. One obvious gap or opportunity? | 3. Any shared connection or background? |

**When to use:**
- Every single outreach message (non-negotiable for DGK)
- Before every discovery call (see File 06 Cold Read)
- When building Trojan Horse gifts

**How to do it fast:**
- LinkedIn profile (30 sec) — role, tenure, recent activity
- Company website (60 sec) — services, team size, obvious gaps
- SEEK listing (30 sec) — are they hiring?
- Google "[company name] news" (30 sec) — any press?
- Google Reviews (30 sec) — what do customers say?

**DGK rule:** No outreach without at least 2 of the 6 data points. If you can't find anything in 3 minutes, skip them and move to the next prospect. A generic message wastes both your time and theirs.

---

### FRAMEWORK 13 — The Case Study Bridge
**DGK Rating:** ⭐⭐⭐⭐

**What it is:** Use a specific client result as the REASON for reaching out. Instead of "we can help you," say "we just helped someone exactly like you and the results were [specific]. Made me think of you."

**The formula:**
1. Reference a result: "Just helped [client type] achieve [specific outcome]"
2. Connect to them: "Noticed you're in a similar situation"
3. Low-friction CTA: "Want me to send the breakdown?"

**When to use:**
- You have strong case studies with specific numbers (DGK does)
- The prospect matches the case study's industry/size/problem
- Follow-ups where you need a fresh reason to re-engage

**DGK Case Study Bridge library:**

| Prospect Type | Bridge |
|---|---|
| IT/MSP | "Just helped an IT company go from 0 to 6 qualified enquiries a month in 60 days. They were referral-dependent too." |
| NDIS | "Set up outbound for an NDIS provider — they're getting same-week outreach on SEEK hiring signals now." |
| Cleaning | "Helped a cleaning company ramp a marketing hire in 3 weeks instead of 3+ months." |
| Trades | "Built a full growth system for a mechanic — complete handover in 12 weeks." |
| Any B2B | "Just ran a campaign that dropped cost per lead by 62% in one quarter." |

**Rule:** Match the case study to their industry/size as closely as possible. "We helped a Fortune 500 company" means nothing to a 10-person NDIS provider. "We helped another NDIS provider your size" = instant credibility.

---

### FRAMEWORK 14 — The Curiosity Gap
**DGK Rating:** ⭐⭐⭐

**What it is:** Open a loop in the prospect's mind that can only be closed by replying. Humans are hardwired to close open loops — it's why you can't stop watching a show after a cliffhanger.

**How to create a curiosity gap:**
- State a result without explaining how: "We cut an MSP's lead cost by 62% using one change."
- Reference something specific they don't expect you to know: "Noticed something on your website that's probably costing you 20-30% of your leads."
- Name a problem they'll recognise but give an unexpected cause: "Most NDIS providers think their problem is marketing. It's actually infrastructure."

**When to use:**
- Subject lines for cold emails
- First line of DM openers
- LinkedIn post hooks

**When NOT to use:**
- Don't be clickbaity. The payoff MUST match the tease.
- Don't create gaps you can't close with real substance.

**DGK curiosity gap examples:**
- Subject: "one thing on your website" → Body reveals the specific conversion gap
- DM: "Hey NAME. Noticed something about your outbound setup that might explain the reply rates." → They ask what → You explain (then offer to fix it)
- Post hook: "We dropped a client's cost per lead by 62%. It had nothing to do with their ads."

**Rule:** The gap must be closeable with real, specific information. If the payoff is vague ("we're just really good"), the trust breaks permanently.

---

### FRAMEWORK 15 — Multi-Threading
**DGK Rating:** ⭐⭐⭐

**What it is:** Reaching out to 2-3 people at the same company simultaneously, through different channels. If one thread goes cold, the others keep the opportunity alive. Also creates internal pressure ("did you see what DGK sent Sarah?").

**The structure:**
- **Thread 1:** DM the founder/CEO (decision maker) on LinkedIn
- **Thread 2:** Email the operations/marketing manager (influencer)
- **Thread 3:** Engage with their content creator's posts (visibility)

**When to use:**
- High-value accounts worth $10K+
- Companies with 10+ employees (multiple stakeholders)
- When the decision maker hasn't responded after 2-3 touches

**When NOT to use:**
- Small businesses where the founder IS the only person (most DGK prospects)
- If it would feel like you're going around someone who said no

**DGK application:** Most DGK prospects are founder-led small businesses, so multi-threading is less common. But for larger prospects (20+ staff): DM the founder on LinkedIn, email the operations manager with a PAS email, and comment on the marketing person's posts. If one path opens, take it.

**Rule:** Don't send identical messages to multiple people at the same company. Personalise each thread to their specific role and concerns.

---

### FRAMEWORK 16 — The Reactivation Campaign
**DGK Rating:** ⭐⭐⭐⭐

**What it is:** Systematically re-engage prospects who went cold 30-90+ days ago. Dead leads aren't dead — they're dormant. Timing was wrong before; it might be right now.

**When to use:**
- Quarterly (go through your entire cold pipeline)
- When you've exhausted your current active list
- After launching a new service or case study (gives fresh reason to reach out)

**The reactivation formula:**
1. Reference the previous conversation (they remember more than you think)
2. Share something NEW (a result, a post, a resource)
3. Low-friction negative CTA

**DGK reactivation template:**
"Hey NAME — we chatted a few months back about your pipeline. Since then we helped [new client] achieve [new result]. Made me think of your situation. Worth a fresh look, or still not the right time?"

**Rule:** Don't just say "following up on our previous conversation." That's lazy. Bring something NEW — a result, a resource, a relevant observation. Give them a reason to reconsider.

---

### FRAMEWORK 17 — The Permission-Based Opener
**DGK Rating:** ⭐⭐⭐

**What it is:** Instead of pitching or even making an observation, simply ask PERMISSION to share something. This lowers the barrier to the absolute minimum.

**Examples:**
- "Hey NAME — cool if I share a quick thought on your outbound setup?"
- "NAME. Would you be open to a 2-minute observation about your website?"
- "Hey — mind if I send over something I put together for businesses like yours?"

**When to use:**
- Very cold prospects with no signals
- When you have nothing specific to personalise with
- Risk-averse industries (finance, legal, healthcare)

**When NOT to use:**
- If you have a signal — lead with the signal instead
- If you've done research — lead with the observation instead
- Permission-based is the fallback, not the default

**DGK application:** Use this as a last resort when you can't find a signal, can't do a Trojan Horse, and can't find anything specific to personalise. "Hey NAME — cool if I share a quick observation about your website?" is better than a generic pitch, but worse than a signal-based opener.

---

### FRAMEWORK 18 — The Referral Engine
**DGK Rating:** ⭐⭐⭐⭐

**What it is:** Systematically turn every happy client into 2-3 warm introductions. The highest-converting leads in any business are referrals — but most businesses leave them to chance.

**The system:**
1. **When to ask:** After delivering a result (not before). Best timing: the moment a client says "wow" or shares a positive number.
2. **How to ask:** "Hey NAME — glad the system is working. Quick question: do you know 2-3 other business owners who might be dealing with the same referral-dependency problem you had? Happy to help them out the same way."
3. **Make it easy:** Don't ask "who do you know?" — that's too broad. Ask "do you know any [specific industry] business owners in [specific city] who are frustrated with [specific problem]?"
4. **Follow up:** If they say yes, ask for a warm intro via email or LinkedIn. If they just give a name, ask "cool if I mention you when I reach out?"

**When to use:**
- After every successful Foundation or Outbound delivery
- At the 30-day, 60-day, and 90-day milestones
- When a client shares a win publicly (like/comment then DM asking for intros)

**DGK rule:** Build referral asks into your delivery process. At the 60-day milestone, every client gets: "Hey — results are tracking well. Know 2-3 other [industry] business owners who might be dealing with the same pipeline problem?"

---

### FRAMEWORK 19 — AIDA (Attention Interest Desire Action)
**DGK Rating:** ⭐⭐⭐

**What it is:** Classic copywriting framework. Useful for longer-form outreach (emails, LinkedIn posts, landing pages).

**The formula:**
1. **Attention** — Hook that stops the scroll
2. **Interest** — Relevant information that keeps them reading
3. **Desire** — Benefits/outcomes that make them want it
4. **Action** — Clear single CTA

**DGK AIDA email example:**
- A: Subject: "62% less per lead" (attention)
- I: "Most B2B businesses in Australia spend $200+ per qualified lead because they're running ads into broken funnels." (interest)
- D: "We helped IT Together get to $75/lead with a system they own — no monthly retainer, no agency dependency." (desire)
- A: "Want me to send the breakdown? Or not a priority right now?" (action with negative CTA)

**When to use:** LinkedIn content, landing page copy, longer cold emails. Less useful for short DMs.

---

### FRAMEWORK 20 — The Video Loom DM
**DGK Rating:** ⭐⭐⭐

**What it is:** Record a 30-60 second personalised Loom video walking through something specific about their business (their website, their LinkedIn, a gap you spotted). Send the link in a DM.

**When to use:**
- High-value prospects worth the extra effort
- When text DMs haven't worked
- When you've found something visual to point out (website gap, SEEK listing)

**How DGK uses it:**
Screen-record their website for 45 seconds. Point out 1-2 specific things: "See this — no booking form above the fold. And here — no retargeting pixel. Those two things alone are probably costing you 30% of your leads." Send the Loom link in a DM.

**Rule:** Keep it under 60 seconds. Show their screen, not yours. Point out THEIR problem, not YOUR solution. End with: "Thought you'd want to see that. Happy to chat about it if useful."

---

## PART 3: DGK FRAMEWORK SELECTOR

### Quick Reference — Which Framework For Which Situation

| Situation | Best Framework | Runner-Up |
|---|---|---|
| Cold prospect, no signal | Permission-Based Opener | 3x3 Research + Restrained Compliment |
| Cold prospect WITH a signal | Signal Based Selling | PAS Email |
| DMs getting opened but ignored | Trojan Horse DM | Curiosity Gap |
| Reply rate flat, list going stale | Signal Based Selling | Reactivation Campaign |
| Open rate fine, nobody replies | Negative CTA | Permission-Based Opener |
| Calls booked then no-showed | Micro Commitment Laddering | Social Surround before the DM |
| Full offer keeps getting "we'll think about it" | Wedge Offer Positioning | Case Study Bridge |
| Copy sounds like everyone else's | ICP Psychographic Mapping | BAB Framework |
| Prospect gone quiet after 3-4 touches | Breakup Email | Reactivation Campaign (in 60 days) |
| Writing cold email sequences | PAS + Negative CTA + Breakup | Domain Stacking for infrastructure |
| High-value dream prospect | Social Surround + Trojan Horse | 3x3 Research + Video Loom |
| Client just hit a milestone | Referral Engine | Case Study Bridge to new prospects |
| Setting up outbound infrastructure | Domain Stacking | Signal Based list building |
| Need volume without burning brand | Domain Stacking | 3-tier system from File 08 |

---

## PART 4: THE DGK OUTBOUND STACK (Recommended Order)

If you're starting from scratch, implement these frameworks in this order:

**PHASE 1 — Infrastructure (Week 1-2)**
1. Domain Stacking — set up 3 burner domains + 9 inboxes
2. ICP Psychographic Mapping — build your language bank from prospect posts/reviews

**PHASE 2 — List Building (Week 2-3)**
3. Signal Based Selling — build lists triggered by SEEK listings, funding, job changes
4. 3x3 Research — 3 min per prospect before any outreach

**PHASE 3 — Messaging (Week 3-4)**
5. PAS — structure every cold email as Pain → Agitate → Solution
6. Negative CTA — end every email/DM with an easy out
7. Micro Commitment Laddering — map your ask sequence (reply → resource → questions → 15 min → audit)

**PHASE 4 — Scaling (Month 2+)**
8. Trojan Horse DM — build custom gifts for top 10 prospects/month
9. Case Study Bridge — match results to prospect industry
10. Breakup Email — close sequences properly
11. Social Surround — pre-warm dream prospects
12. Referral Engine — systematise referral asks at 60-day milestones

**PHASE 5 — Optimisation (Month 3+)**
13. Reactivation Campaign — quarterly re-engagement of cold pipeline
14. Wedge Offer — test small paid entry points
15. Video Loom — personalised videos for highest-value targets
16. Multi-Threading — for larger accounts with multiple stakeholders
17. Curiosity Gap — A/B test subject lines
18. BAB — longer-form content and posts
19. AIDA — landing pages and LinkedIn posts
20. Permission-Based — fallback for zero-signal prospects

---

## GOLDEN RULES FOR ALL FRAMEWORKS

1. **No signal = no reason to write.** If you can't find a trigger, skip to the next prospect.
2. **Two lines of pain buy you one line of pitch.** Never pitch without establishing pain first.
3. **The easiest yes is permission to send something.** Lower the ask, raise the reply rate.
4. **Volume comes from more inboxes, not more sends per inbox.** Protect the brand domain always.
5. **Pull language from their posts, not your website.** Their words > your jargon.
6. **Ask for the next rung, never the whole ladder.** Skip a step and they no-show.
7. **Write the ending you mean, then actually stop.** Fake breakups kill trust permanently.
8. **A small paid job now beats a big proposal never.** Wedge in, expand later.
9. **The gift must work on its own.** If it's useless without buying from you, it's bait.
10. **Match the case study to their industry/size.** Fortune 500 results mean nothing to a 10-person NDIS provider.

---




---

## File: `references/03-followup.md`

# Follow-Up: Frameworks, Buckets, Reactivation, Comebacks

> DGK Sales Knowledge Base — reference file. Source files listed below.

## Contents
- 02 FOLLOW UP FRAMEWORKS
- 35 THE COMEBACK CONVERSATION

---

# Follow-Up & Lead Nurture Playbook — DGK's Complete System

> **For:** DGK team following up with prospects + building nurture systems for DGK clients
> Follow-ups = high leverage. Copy-paste, change name, send. 20-50% of calls come from follow-ups.
> Hormozi insight: A 20-40% increase in show rate can 2-3x the profit of a business.

---

## HORMOZI'S 4 PILLARS OF LEAD NURTURE (Merged with Ty's System)

Every follow-up and nurture sequence should optimize for these 4 pillars:

### Pillar 1 — AVAILABILITY (Make It Easy to Schedule)
- Reduce friction: fewer clicks to book, more time slots available
- Offer multiple scheduling options (morning, afternoon, timezone-friendly for AEST/AEDT)
- If too many bad appointments: ADD friction (video to watch before scheduler, price on page, qualification questions)
- For DGK: Use Calendly with questionnaire. Offer 30-min strategy calls. No pitch, no pressure framing.

### Pillar 2 — SPEED (Contact Fast, Book Fast)
- Respond to new leads ASAP — speed-to-lead is everything
- Aim to set appointments within 72 hours (same day, next day, day after)
- If they reach back out after booking, respond fast — shows you're serious
- Front-load reach-outs in first 48 hours
- For DGK: Positive replies from outbound sequences route straight to CRM + calendar. Automate speed.

### Pillar 3 — PERSONALIZATION (Make It Feel Just For Them)
- Collect info during opt-in/application/booking
- Score leads 1-5 or red-yellow-green based on qualification
- Route best leads to best closers
- Segment messaging based on what you know about them
- Do 5 minutes of homework on good leads (website, LinkedIn, hiring signals, Google reviews)
- Show personalized proof (testimonials matching their demographics/industry)
- For DGK: Use 130+ sales signals. Match case studies by industry (IT, NDIS, cleaning, trades, etc.)

### Pillar 4 — VOLUME (Don't Be Afraid to Reach Out)
- They gave you permission to contact them — contact them like you mean it
- More reach-outs in first 48 hours, taper off over the week
- Multiple channels: call, text, email, LinkedIn DM, voicemail
- For DGK: Omnichannel approach (email + LinkedIn + phone). Automated sequences in DGK CRM.

---

## HORMOZI'S 7-DAY REACH-OUT CADENCE

For new leads who show interest but haven't booked:

1. **Immediately:** Double-dial (call twice back-to-back — many phones block first call, let second through)
2. **If no answer:** Leave a voicemail
3. **Immediately after voicemail:** Send a text
4. **Same day:** Double-dial and text 2 more times (hours apart)
5. **Days 2-3:** Call twice per day (once early, once late). Text after second call each day.
6. **Days 4-7:** Call and text once per day
7. **After Day 7:** Transition to long-term nurture (content, soft CTAs to re-engage)

**Key:** Front-load reach-outs. More days that pass = less likely they schedule. When they re-engage, start back at top.

**Pro tip:** Get an automatic dialer — improves team efficiency 2-3x. Brings up highest-likelihood leads first.

---

## TY'S 2-BUCKET SYSTEM (Enhanced with Hormozi)

### Bucket 1: Interest 1-6/10 — THROW ROPE + NURTURE
- Haven't said they want a call
- Strategy: Give reasons to reply (foreshadow value, add value, foreshadow intros)
- Hormozi add: Personalize messaging based on lead score. Show proof matching their industry.
- For DGK: Send relevant case study (IT Together for MSPs, Triple R for NDIS, A Plus for trades)

### Bucket 2: Interest 7-9/10 — FRIENDLY CHECK-IN + SPEED
- Already said they want to book
- Strategy: Simple non-needy nudge. No more rope needed.
- Hormozi add: Speed is critical here. Contact within hours. Make scheduling frictionless.
- For DGK: "Hey NAME, got a couple slots Thursday arvo AEST. Want me to send the link?"

**Interest is malleable:** Someone at 7-9/10 who doesn't respond twice may drop to 3-4/10 — start throwing rope again.

---

## TIMING RULES

- Never follow up within 20-24 hours — needy and disrespectful
- If they said they'd book: wait 1-2 days
- If cooler (1-6/10): wait 3-4 days between messages
- Increase gaps if no response (3 days → 5 days → 1-2 weeks)
- After 3-4 unanswered follow-ups: make a LOGICAL decision to stop (not emotional)
- Revisit after a few weeks or 1-2 months

---

## THE 11 FOLLOW-UP FRAMEWORKS

### 1 — Foreshadow Value (1-6/10)
Tease intros, assets, free resources. Keep relevant. Don't pitch call.
DGK example: "Hey NAME — just put together a free outbound health check for B2B businesses. Want me to send it over?"

### 2 — Add Value (3-6/10)
Send a valuable asset (training, PDF, audit). Find their need → solve with asset → provide context.
DGK example: Send the AI Health Checkup or a relevant blog post from dgkbusinessconsultancy.com/blog

### 3 — Non-Threatening Check-In
Friendly, helpful check-in. NOT "?" or "Just bumping this up." Be different.

### 4 — Solicit a Reply With Introductions
Offer to connect them with someone valuable. Build referral partnerships.
DGK example: "Know a killer recruiter in Melbourne who specialises in your space. Want me to make the intro?"

### 5 — The Voice Message (1-6/10)
Under 60 seconds. Outcome independent, sincere, foreshadow value. Use 4-step VM framework.

### 6 — Friendly Check-In (6-8/10)
Post-call no-close follow-up. Quick genuine check-in. Endorse skills. Like posts.

### 7 — Restart With a Resource
Post a resource (keyword comment to receive). Jump back in DMs, send resource, restart convo.

### 8 — The "Fuck It" Follow-Up
Last bullet. Direct message HARD pushing for the call. Bold, confident.

### 9 — The "Valuable New Post" Follow-Up
Write a new post related to previous convo. Link it in the DM thread.

### 10 — The "We Should Talk" Follow-Up
Non-threatening pitch after they stalled on booking.
DGK example: "Think we should chat. Got a couple of ideas for your pipeline that might help. Should have time Thursday or Friday AEST."

### 11 — Scarcity & Urgency
Create urgency with limited availability.
DGK example: "Hey NAME — we're taking on 2 more Foundation clients this quarter before we cap it. Want you to potentially be one of them."

---

## SHOW-RATE OPTIMIZATION (Hormozi Framework)

To maximize the % of booked calls that actually show up:

1. **Personalized proof:** Send a case study matching their industry before the call
2. **Demonstrate cost incurred:** "I prepped a walkthrough specific to your business for our call"
3. **Remove risk of wasted time:** "No pitch. Just a diagnosis of your current pipeline."
4. **Day-of text:** "Hey NAME it's Dilip from DGK. Talk to you soon. [TIME] AEST"
5. **Multiple reminders:** Automated email + text reminders at 24hr, 2hr, and 15min before
6. **Gift/bribe for showing:** "I'll send you our full outbound playbook after the call regardless"

---

## NO-SHOW HANDLING PROTOCOL

When a prospect doesn't show up for a booked call:

**If 7+ minutes late:**
1. Leave the meeting
2. Decline the calendar invite (they'll see the notification)
3. Don't chase. Don't text "hey are you coming?"
4. They will see the declined invite, feel compelled to apologize, and reach out to YOU
5. When they do: rebook on YOUR terms with higher status than before

**If they reschedule:**
- Use a friendly but time-constrained tone: "No worries. I've got Thursday at 2 or Friday at 10 AEST. Which works?"
- Send day-of text reminder for the rescheduled call
- Show that your time is valuable but you're not holding a grudge

**Pro tip:** The pattern interrupt for inbound leads who don't remember you:
"Got your demo request. Sometimes people fill out forms by accident — is that the case here?"
This snaps them to attention immediately.

---

## DGK AUTOMATION CONTEXT

For DGK client delivery, build these into DGK CRM:
- **Hot Drip:** Shorter gaps between follow-ups (for warm leads)
- **Follow-Up Drip:** Longer gaps (for cooler leads)
- **Positive Reply → CRM Pipeline:** Auto-route to calendar
- **Lead Scoring:** Score on qualification (budget, authority, need, timeline)
- **Sequence Triggers:** Based on 130+ sales signals (hiring on SEEK, funding, tech stack changes)

**Hormozi tip:** Best closers are typically the best setters. Same skill set, lower stakes. Great for onboarding new team members.

---

# 35 — The Comeback Conversation: When Ghosts Return

> **For:** DGK team handling prospects who disappeared and came back
> **Why:** 20-30% of your eventual clients will come from people who initially ghosted or said "not now." How you handle their return determines if you close or lose them again.

---

## THE 3 TYPES OF COMEBACKS

### Type 1 — The Ghost Who Returns (They disappeared, now they're back)
They ignored your follow-ups for weeks/months. Now they reply or reach out.

**What happened:** Their pain got worse. A competitor made a move. They saw your content. Something changed.

**How to handle:**
- Do NOT say "where have you been?!" or "glad you finally replied!"
- Do NOT punish them or make them feel guilty
- DO act like it's completely normal: "Hey NAME — good to hear from you. What's going on?"
- Restart light discovery: "What's changed since we last chatted?"
- Requalify: their situation may be different now. Don't assume the old context still applies.

**Script:**
"Hey NAME — good timing actually. What prompted you to reach out again?"
[Listen]
"Makes sense. A lot can change in a few months. Let me ask a couple quick questions so I'm up to speed, then we can figure out if it still makes sense to work together."

### Type 2 — The "Not Now" Who's Ready (They declined politely, now the timing is right)
They said "not the right time" 3-6 months ago. Now they're reaching out.

**How to handle:**
- Acknowledge the history warmly: "Good to reconnect. You mentioned back in [month] that the timing wasn't right — sounds like things have shifted?"
- Don't re-pitch from scratch. They already know what you do. Jump to what's CHANGED.
- Close faster. They've had months to think. They're reaching out because they're ready.

**Script:**
"Hey NAME — great to hear from you again. I remember we chatted back in [month] about your pipeline situation. What's changed that's got you thinking about this again?"
[Listen]
"Got it. Well the good news is everything I showed you still applies — and we've actually refined the system since then. Want to jump on a quick call this week and pick up where we left off?"

### Type 3 — The Failed Client Who Comes Back (They left, regretted it, and want round 2)
A previous client who churned or didn't renew. Now they want back in.

**How to handle:**
- Be warm but set new expectations
- Understand WHY they left and what's different now
- Don't hold grudges — but don't pretend it didn't happen

**Script:**
"Good to hear from you, NAME. Always happy to chat. Before we dive in — last time we wrapped up, things didn't end exactly as planned. What would you want to be different this time?"
[Listen]
"Makes sense. I think we can absolutely make this work — but I want to make sure we're both clear on expectations going in. Let's hop on a call and map it out properly."

---

## THE GOLDEN RULES FOR COMEBACKS

1. **Never punish.** They're already vulnerable reaching out. Make it easy.
2. **Don't over-celebrate.** "OMG so glad you're back!!!" = desperate. "Good to hear from you" = grounded.
3. **Requalify every time.** Their budget, timeline, authority, and fit may have changed.
4. **Move faster.** They've been thinking for months. They don't need another month of DM warm-up.
5. **Find out what changed.** The trigger that brought them back = their current pain. Lead with it.
6. **Don't discount.** Comebacks aren't a reason to drop your price. If anything, the price should reflect current rates (which may be higher).

---




---

## File: `references/04-discovery-and-calls.md`

# Discovery & Calls: PICS, Questions, Second Calls, Trust, Future Pacing

> DGK Sales Knowledge Base — reference file. Source files listed below.

## Contents
- 06 SALES CALLS AND DISCOVERY
- 28 ASKING POWERFUL QUESTIONS
- 27 THE SECOND CALL
- 33 TRUST ACCELERATION
- 31 FUTURE PACING

---

# Sales Calls & Discovery — DGK's Complete Call Playbook

> **For:** DGK team running strategy calls + DGK clients learning to close on calls
> **Why this matters:** Your DMs get the prospect to the call. But the CALL is where revenue happens. A bad discovery call kills deals that great DMs created. This file teaches you how to run a call like a doctor diagnosing a patient — not a salesperson pitching a product.
> **Key principle:** You are not selling. You are diagnosing. The prospect has the problem, NOT you. They came to YOU.

---

## SECTION 1: THE PICS CHART — Understanding Pain Better Than Your Prospect Does

The PICS Chart is a framework for mapping out your prospect's entire pain landscape BEFORE you ever get on a call. Review this DAILY and BEFORE every call.

### What PICS Stands For:

**P — Problems (Level 1 Pain: Technical/Surface-Level)**
These are the obvious, tactical problems your solution fixes. They're what the prospect THINKS their problem is.

DGK examples:
- "We only get clients from referrals"
- "Our website doesn't generate any leads"
- "We tried cold email but got no replies"
- "We post on LinkedIn but nobody engages"
- "We don't have a CRM"
- "We hired a marketing agency and it didn't work"

**I — Impacts (Level 2 Pain: Business Impact)**
These are what happens to their BUSINESS because of the Level 1 problems. This is where the pain gets real.

For each Level 1 problem, ask: "So what? What does that cause?"

DGK examples:
- "We only get clients from referrals" → Revenue is unpredictable month to month → Can't hire confidently → Growth is capped by how many people they know → Pipeline is feast or famine
- "Our website doesn't generate leads" → Wasting money on a site that looks nice but does nothing → Every lead costs more because there's no inbound engine → Competitors with worse services are winning because they have better funnels

**I (continued) — Impacts (Level 3 Pain: PERSONAL Impact on the Decision Maker)**
This is the deepest level — how the business problems make the PERSON feel. This is where buying decisions are made. People buy on emotion, justify with logic.

DGK examples:
- The founder is frustrated because they're stuck doing everything themselves
- They feel anxious because revenue is unpredictable and they can't plan
- They're embarrassed they've been in business 5 years and still rely on word of mouth
- They feel like they wasted money on the last agency and are scared to invest again
- They're tired and burning out because they're the bottleneck for every new client

**C — Causes (What's ACTUALLY Causing the Level 1 Problems)**
These are the root causes. The prospect often doesn't know these — but YOU do. That's why you're the expert.

DGK examples:
- No CRM or pipeline system → leads fall through the cracks
- No outbound infrastructure → they've never had email domains, sequences, or signal-based targeting
- Poor website → no forms, no tracking, no clear CTA, no SEO
- Tried an agency that did it FOR them → never learned how it works, so when the agency left, everything stopped
- No content system → they post randomly with no strategy, no hooks, no distribution

**S — Solutions (All Possible Ways to Fix the Level 1 Problems)**
List EVERY option, including competitors and DIY. This shows the prospect you're objective and not just pushing your thing.

DGK examples:
- Do nothing (keep relying on referrals)
- Hire a full-time marketing person ($80K-$120K/year + ramp time)
- Hire another agency (monthly retainer, they do it for you, you own nothing)
- Use DGK's Done-With-You model (build the system together, you own it)
- DIY with templates and courses (cheapest but slowest and highest failure rate)

### How to Use the PICS Chart:
1. Build your PICS chart for your ICP ONCE (takes 1-2 hours)
2. Review it before EVERY call — know every possible pain point before they tell you
3. During the call, listen for Level 1 pains, then dig to Level 2 and Level 3
4. When you hear Level 3 pain (emotion), you've found the buying trigger
5. Present your solution as the fix for all 3 levels

---

## SECTION 2: PRE-CALL PREPARATION

### The Cold Read (Do This BEFORE Every Call)
A Cold Read is an informed guess about the prospect's situation based on your research. It makes you look like you already understand their business — massive credibility builder.

**Where to research (spend 5-10 minutes):**
- LinkedIn profile (role, tenure, company size, recent posts)
- Company website (services, team size, tech stack, messaging)
- SEEK / Indeed (are they hiring? For what roles?)
- Google reviews (what do their customers say?)
- Google News (any press, awards, funding?)
- Crunchbase (if applicable — funding rounds, investors)
- BuiltWith (what tech are they using?)

**Example Cold Read for DGK Call:**
"So before we get started, let me confirm a few things. I can see Triple R Community is an NDIS provider based in Sydney, about 15 staff. You've been growing — I noticed you posted 3 support coordinator roles on SEEK in the last month. Which tells me you're probably scaling service delivery but might be hitting a wall on finding participants consistently outside of referrals. Am I in the ballpark?"

**Why this works:**
- Shows you've done your homework (respect)
- Positions you as someone who understands their industry (competence)
- Gets them nodding "yes" early (agreement pattern)
- Saves 10 minutes of basic questions they'd find boring

### Pre-Call Checklist (Print This Out)
Before EVERY call, confirm:
- [ ] Reviewed PICS chart for their industry
- [ ] Completed Cold Read (wrote it out)
- [ ] Know the objective of the call (discovery? demo? close?)
- [ ] Checked their LinkedIn activity (recent posts, engagement)
- [ ] Checked their website (services, messaging, obvious gaps)
- [ ] Checked SEEK/Indeed for hiring signals
- [ ] Know their assumed tech stack
- [ ] Understand the social dynamics (are they the sole decision maker? Or do they need to check with a partner/board?)

---

## SECTION 3: THE DISCOVERY CALL STRUCTURE

### Phase 1 — The Intro (First 2 Minutes)
**Goal:** Build instant rapport and set the tone. You are calm, grounded, competent.

**The 4 Yes's Checklist:**
1. Do I sound powerful? (Slow, deep, grounded voice. Not eager or rushed.)
2. Am I mirroring the prospect? (Match their energy level, take it up a notch.)
3. Am I using positive associations? ("Super busy here, business is booming, can't complain!")
4. Is the prospect engaged? (Are they leaning in, asking questions, or are they distracted?)

**Example Intro:**
"Hey NAME, good to connect. How's your day going?"
[Let them answer]
"Yeah doing great. Crazy busy here but can't complain. Hey before we dive in — I've got a hard stop in 30 minutes, so if it's alright with you can we get right into it?"

**Why the time constraint matters:** Whoever is more conscious of time has higher status. Saying "I have a hard stop" signals you're busy and important. It also creates urgency and keeps the call focused.

### Phase 2 — The Bridge (30 Seconds)
**Goal:** Transition from small talk to business. Set the agenda on YOUR terms.

**The Bridge Formula:**
"So here's what I was thinking for today. I'll ask you some questions to understand where you're at, and by the end we'll figure out if there's a potential fit. If there is, we'll talk about next steps. If not, no worries at all. Sound good?"

**Why this works:**
- YOU set the agenda (not them)
- "No worries at all" = outcome independent = high status
- They agree to answer your questions = you're leading

**Alternative Bridge (for DGK):**
"Cool. So to be transparent — we're pretty selective about who we work with. We invest a lot into our clients and we expect the same level of investment back. That's how we get results. So I've got a few questions, and by the end let's see if there's a fit. Cool?"

### Phase 3 — The Cold Read + Questions (15-20 Minutes)
**Goal:** Uncover their pain at all 3 levels. Get them FEELING the pain emotionally.

**Start with your Cold Read:**
Deliver your researched Cold Read (from pre-call prep). Then ask: "Am I in the ballpark?"

**Then dig with questions:**

**Level 1 (Surface Problems):**
- "What's your current lead generation setup look like?"
- "How are you getting clients right now?"
- "Walk me through what happens when someone shows interest"
- "What have you tried before?"

**Level 2 (Business Impact):**
- "How is that affecting your revenue?"
- "What does that look like month to month?"
- "How much do you think that's costing you?"
- "If nothing changes in 6 months, what happens?"

**Level 3 (Personal/Emotional Impact):**
- "How does that make you feel as the business owner?"
- "What keeps you up at night about this?"
- "How long have you been dealing with this?"
- "What would it mean for you personally if this was solved?"

**Critical Rules:**
- Ask ONE question at a time. Then SHUT UP and listen.
- Pause 2-3 seconds after they stop talking. They'll often keep going and reveal more.
- When you hear emotionally charged words (frustrated, stressed, exhausted, scared, stuck), you've hit Level 3. DIG DEEPER HERE.
- Don't pitch yet. Just diagnose. You're a doctor, not a salesman.
- Mirror what they say: "So what I'm hearing is..." (builds trust)
- Take notes and say "Is it ok if I write some notes while we talk?" (shows you care)

### Phase 4 — The Shortcut to Pain (Advanced Technique)
When you only have 25 minutes, use Cold Read Stacking + Pain Framing to get to the pain FAST.

**Cold Read Stacking:**
Stack multiple cold reads back-to-back to establish facts quickly, then confirm.

**Example:**
"So you raised your Series A about 7 months ago, which means you're focused on scaling go-to-market. You've got about 11 AEs, 4 SDRs, and 5 marketing people. Am I in the ballpark?"

**Pain Framing (Using Other Decision Makers' Pain):**
Instead of asking "do you have this problem?", tell them OTHER decision makers in their position have this problem, then ask if they relate.

**Example:**
"So I mostly work with managing directors like yourself who are responsible for growth but are stuck relying on referrals. They tell me they struggle with inconsistent pipeline, wasted marketing spend, and not knowing which channel actually works. As a result they can't forecast revenue or hire confidently. Am I correct in assuming you DON'T relate to any of that?"

**Why "don't relate" works:** It's a negative assumption (pattern interrupt). The prospect will naturally correct you and say "No, actually we DO have those problems" — and now THEY'RE selling YOU on why they need help. The frame has flipped.

### Phase 5 — Recap + Next Steps (5 Minutes)
**Goal:** Confirm the pain, quantify it, and set up the close.

**Recap what you heard:**
"So let me make sure I've got this right. You're currently getting about 2-3 clients a month from referrals, which is unpredictable. You tried a marketing agency last year that cost $4K/month for 6 months with no real results. And right now you're the bottleneck — you're doing the selling, the delivery, AND trying to figure out marketing. Did I miss anything?"

**Quantify the cost of inaction:**
"Based on what you've told me, it sounds like the referral dependency is costing you roughly $15-20K a month in missed revenue — just from the clients you're NOT getting. Over 12 months that's $180-240K. Does that feel about right?"

**Then (and ONLY then) talk about your solution:**
"OK so here's what I think could help..."

**Ask about decision making:**
"Other than yourself, is there anyone else who'd need to be involved in a decision like this?"

---

## SECTION 4: HANDLING INBOUND LEADS ON CALLS

Inbound leads are NOT always hot. Just because they filled a form doesn't mean they're ready to buy. Most are "fishing" for information.

**Your job:** Show them how to BUY from you. Don't figure out how to SELL to them. They came to YOU. They have the problem, NOT you.

### Scenario 1 — The "Just Wanted to Learn More" Lead
They're fishing. Challenge them, engulf their frame, reset the call.

**Script:**
You: "So I'm gonna be upfront — I'm between meetings. To make the best use of our time, what were you hoping to have happen by the end of this call?"
Them: "Just wanted to learn more."
You: "OK. Let's pretend you heard everything you wanted to hear. Then what?"
Them: "We'd discuss internally and decide."
You: "Got it. Here's how we typically run these. By the end, one of two things happens: either of us determines it's not a fit, or we move to next steps. But we can't do that until I understand your situation. Cool?"

**What you did:** Challenged their vague frame. Showed you're not desperate. Set YOUR agenda.

### Scenario 2 — The Price Shopper
They see you as a commodity. They're shopping 3-5 vendors for the cheapest quote. Commoditize them BACK.

**Script:**
Them: "Just wanted to know the price."
You: "I have to be upfront — you're bringing up price really early, which tells me price might be the most important thing to you. Am I right?"
Them: "No, but it's obviously important."
You: "So I'll tell you now — we're not cheap. Usually our customers underestimate our price by at least 25%. How much were you planning to invest in this?"
Them: "No more than a few thousand."
You: "My point exactly. [slight laugh] If you're basing this decision solely on the cheapest quote, it's not going to work for us. But if you want to have a real conversation about how we can actually help, we can do that."

**What you did:** Anchored high ("underestimate by 25%"). Challenged their price-first mindset. Positioned yourself as premium. Made them earn YOUR time.

### Scenario 3 — The "Free Trial Guy" / Freeloader
They want free access, free consulting, free everything. And they'll barely use it.

**Script:**
Them: "I just wanted the free trial / audit / consultation."
You: "Sure. In order for us to approve that, we need to establish a few things first — what you hope to accomplish, what success looks like, how we'll measure it, and the timeframe. We also do daily check-ins during trials. Still interested?"

**What you did:** Added friction. Made the "free" thing feel like work. Serious prospects will stay; tire-kickers will bail.

### Bonus — The Swiss Army Knife Response
Use this for ANY inbound follow-up:

You: "Hey NAME, it's Dilip getting back to you from DGK. Did I catch you at a bad time?"
Them: "No, go ahead."
You: "Cool. So I saw you requested a [call/audit/consultation]. Did you fill out the form by accident? Sometimes that happens."
Them: "No, that was intentional!"
You: "Oh OK. So tell me — what were you hoping to have happen by the end of this?"

**Why this works:** "Did you fill it out by accident?" is a pattern interrupt. It snaps them to attention. Instead of chasing them ("So excited you filled out our form!"), you're testing THEIR interest. Frame: flipped.

---

## SECTION 5: BRINGING IT ALL TOGETHER — DGK CALL FLOW

Here's the exact flow for a DGK strategy call:

1. **Pre-call (10 min before):** Review PICS chart. Read Cold Read notes. Check LinkedIn/SEEK. Deep breath. Visualize: "How would someone financially set and not intimidated act on this call?"

2. **Intro (2 min):** Friendly, grounded. Time constraint. "Super busy, can't complain."

3. **Bridge (30 sec):** "I'll ask some questions, we'll see if there's a fit. If not, no worries."

4. **Cold Read (1 min):** Deliver your researched cold read. "Am I in the ballpark?"

5. **Discovery (15-20 min):** Dig through Level 1 → Level 2 → Level 3 pain. Listen more than you talk. Take notes. Mirror. Pause after they finish speaking.

6. **Quantify (2 min):** "It sounds like this is costing you roughly $X per month. Over 12 months that's $Y."

7. **Present Solution (5 min):** Map DGK's system to their specific pain. "Based on what you've told me, I think Foundation + Outbound is where we start."

8. **Close (3 min):** "Want to get started?" If objection → handle it (see File 04). If yes → send agreement.

9. **Post-call:** Day-of text confirmation. Pre-call drip. Enter into CRM pipeline.

---

# 28 — The Art of Asking Powerful Questions

> **For:** DGK team learning to ask questions that make prospects sell themselves
> **Why:** The salesperson who asks the best questions wins every time. Average salespeople pitch. Great salespeople ask.

---

## THE HIERARCHY OF QUESTIONS

### Level 1 — Surface Questions (Weak)
Gather facts. Easy to answer. Low emotional impact.
- "How many staff do you have?"
- "What CRM do you use?"
- "How do you get clients?"

**When to use:** Early in discovery for context. But don't stay here.

### Level 2 — Impact Questions (Strong)
Reveal consequences. Make them THINK about their problem.
- "How is that affecting your revenue month to month?"
- "What does that look like in dollar terms over a year?"
- "How many clients did you miss out on because of that?"

**When to use:** After Level 1 establishes the problem. This is where pain gets real.

### Level 3 — Emotional Questions (Powerful)
Reveal feelings. Make them FEEL the problem. This is where buying decisions happen.
- "How does that make you feel as the business owner?"
- "What keeps you up at night about this?"
- "If nothing changes in 12 months, what happens to you personally — not the business, YOU?"

**When to use:** After Level 2 quantifies the impact. This is the buying trigger.

### Level 4 — Socratic Questions (Elite)
Guide the prospect to discover the answer THEMSELVES. You don't tell them they need DGK — they tell you.
- "What would need to change for your pipeline to be predictable?"
- "If you could fix one thing in your business tomorrow, what would it be?"
- "What's stopping you from solving this yourself?"

**When to use:** When you want them to articulate their own need. A prospect who says "I need a system" is 10x more likely to buy than one YOU told needs a system.

---

## 7 QUESTION TECHNIQUES

### 1 — The Peel-Back
Ask "why" without saying "why" (which sounds confrontational).
- "Tell me more about that"
- "What do you mean by that?"
- "Can you walk me through that?"
- "What does that look like in practice?"

Each peel-back goes one layer deeper. Surface → impact → emotion → root cause.

### 2 — The Mirror Question
Repeat their last 2-3 words as a question. They'll keep talking.
- Them: "Revenue has been really inconsistent."
- You: "Inconsistent?" [silence]
- Them: "Yeah, like some months we do $40K and others we barely hit $15K and it's terrifying honestly..."

You just got a Level 3 emotional answer by saying ONE WORD.

### 3 — The Negative Assumption
Assume the OPPOSITE of what you expect. People correct negative assumptions.
- "So I'm guessing outbound probably isn't something you'd consider?"
- "You probably don't have budget for something like this right now?"
- "Am I correct in assuming you DON'T relate to any of that?"

### 4 — The Scale Question
Put them on a 1-10 scale. Whatever they say, ask about the gap.
- "On a scale of 1-10, how important is fixing this?"
- If they say 7: "What would make it a 10?"
- If they say 4: "What's keeping it from being higher?"

### 5 — The "What If" Question
Future pace through a question.
- "What if this was solved? What would your business look like in 6 months?"
- "What if you had 6 qualified leads landing every month — how would that change things?"

### 6 — The Permission Question
Ask permission before going deeper. Lowers their guard.
- "Can I ask you something a bit direct?"
- "Mind if I challenge that for a second?"
- "Is it OK if I ask an uncomfortable question?"

Almost everyone says yes. And now they're psychologically committed to answering honestly.

### 7 — The Silence
Not technically a question — but the most powerful tool. After they answer, wait 3 seconds. They'll keep talking. The second thing they say is always more honest.

---

## QUESTIONS TO NEVER ASK

| Bad Question | Why It Fails | Better Alternative |
|---|---|---|
| "Does that make sense?" | Makes them feel dumb if they say no | "What questions do you have about that?" |
| "Can I be honest with you?" | Implies you haven't been honest before | Just be honest — no preamble needed |
| "What's your budget?" | Too direct too early. Feels transactional. | "Companies your size typically invest $X-$Y. Does that align with your thinking?" |
| "Who's the decision maker?" | Insulting if they think they are | "Other than yourself, who else needs to weigh in?" |
| "Are you interested?" | Binary yes/no = dead end | "How are you feeling about what we've discussed?" |

---

## DGK POWER QUESTIONS (Use These on Every Call)

1. "How are you getting clients right now?" (Surface)
2. "What happens in months when referrals dry up?" (Impact)
3. "How long have you been dealing with this?" (Emotional context)
4. "If nothing changes in 12 months, what happens?" (Future pain)
5. "What would predictable pipeline mean for you personally?" (Emotional gain)
6. "What have you tried before to fix this?" (Uncover past failures)
7. "What stopped it from working?" (Root cause of past failures)
8. "What would need to be true for this to be a no-brainer?" (Buying criteria)
9. "Other than yourself, who needs to weigh in?" (Decision dynamics)
10. "If we could solve this, when would you want to start?" (Timeline + trial close)

---

# 27 — The Second Call: When They Don't Close on Call 1

> **For:** DGK team handling prospects who said "let me think" and booked a follow-up
> **Why:** 40-60% of deals close on call 2 or 3, not call 1. If you run call 2 the same as call 1, you lose them.

---

## WHY CALL 2 IS DIFFERENT FROM CALL 1

Call 1 (Discovery): You're diagnosing. You're asking questions. You're learning about them.
Call 2 (Resolution): They already KNOW the problem. They already KNOW your solution. Something is stopping them. Your job is to find WHAT and fix it.

---

## THE 3 REASONS THEY DIDN'T CLOSE ON CALL 1

### Reason 1: Unresolved Objection (Most Common — 60%)
They have a concern they didn't voice. Usually: price, trust, timing, or fear.

### Reason 2: Decision Maker Wasn't Present (25%)
They need to "run it by" someone. The real buyer hasn't heard the pitch.

### Reason 3: Genuine Need for Processing Time (15%)
Some people (Style S and C from File 22) genuinely need 24-48 hours to process. This is real and valid.

---

## THE CALL 2 STRUCTURE (20 Minutes Max)

### Open (2 min):
"Hey NAME — good to reconnect. So you've had a couple of days to sit with everything. What's your thinking?"

Then STOP. Let them talk. Their first 30 seconds will reveal which of the 3 reasons is in play.

### Diagnose (5 min):
**If unresolved objection:** "What's the main thing holding you back?"
- Then handle per File 04, re-close per File 10

**If decision maker absent:** "What did your partner think? What were their main questions?"
- Answer each concern. Then: "Would it help if I jumped on a quick 10-min call with both of you?"

**If processing time:** "Totally understand. Now that you've had time — does it feel like the right move?"
- If yes → close immediately
- If hesitation → probe: "What would need to be true for this to feel like a no-brainer?"

### Re-Close (5 min):
Use a DIFFERENT closing technique than Call 1. If you used Assumptive on Call 1, use Summary or Either/Or on Call 2.

"Based on our last conversation, you said [their pain in their words]. The Foundation build solves that in 12 weeks and you own everything. I've got a spot opening next Monday. Want to lock it in?"

### If They STILL Don't Close:
One more attempt: "I want to be straight with you — I think this would genuinely help your business. But I also respect your process. What would make this a definite yes or a definite no?"

If no clear path: "Tell you what — I'll send the scope over. Take the weekend. But let's set a hard deadline — if we're going to do this, we need to start by [date] to hit your timeline. After that, the next intake is [later date]. Fair?"

**Never leave Call 2 without either a YES or a HARD DEADLINE for the decision.**

---

## BETWEEN CALL 1 AND CALL 2

### Day of Call 1 (after they leave):
- Send summary email: "Great chatting. Here's what we discussed: [3 bullet recap]. Looking forward to reconnecting [date]."
- Include one case study matching their industry

### Day before Call 2:
- Text: "Hey NAME — looking forward to tomorrow. Had another thought on your pipeline situation I want to share."
- This seeds curiosity AND confirms the meeting

### If they try to cancel Call 2:
- "No worries. Before we reschedule — quick question: is it the timing that's off, or are you leaning away from moving forward? Either is fine — just want to know where your head's at."

---

# 33 — Trust Acceleration: Building Trust Fast

> **For:** DGK team that needs to build trust in one call, not over 10 DM touches
> **Why:** Inbound leads, referrals, and cold calls don't give you weeks to build rapport. You need trust in 15 minutes.

---

## THE 5 TRUST ACCELERATORS

### 1 — The Informed Cold Read
Show you know their business BEFORE they tell you. Instant credibility.
"Before we start — I had a look at your business. You're a 15-person NDIS provider in Sydney, hiring support coordinators, getting participants mostly from referrals. Revenue is probably inconsistent month to month. Am I in the ballpark?"

**Why it accelerates trust:** They think "this person did their homework." Homework = respect = trust.

### 2 — The Vulnerable Admission
Share something real about YOUR journey that mirrors their struggle.
"I'll be honest — when I started DGK, I was in the exact same position. All referrals. No system. Couldn't predict next month's revenue. That's actually why I built this — because I lived the problem first."

**Why it works:** Vulnerability from a position of strength = authenticity. They see you as a real person, not a salesperson.

### 3 — The Specific Social Proof Drop
Not "we've helped lots of businesses." Specific name, specific number, specific timeline.
"IT Together — 12-person MSP in Sydney. Zero outbound. 60 days later: 6 qualified enquiries a month. David called me from Bali last month — first holiday in 2 years."

**Why it works:** Specificity is the currency of trust. Vague claims = suspicion. Specific claims = believability.

### 4 — The Transparent Disqualification
Tell them reasons you might NOT be the right fit. This sounds insane but builds massive trust.
"I should be upfront — we're not for everyone. If you're looking for someone to run everything forever, we're not the right fit. Our model is we build it with you and you own it. That requires you to show up for sessions. If that's not realistic, I'd rather save us both the time."

**Why it works:** A salesperson who tries to LOSE the sale must be genuinely confident. Disqualifying yourself = highest possible trust signal.

### 5 — The "Let Me Show You Something" Move
Provide instant value ON THE CALL by showing them something about their own business.
"Mind if I share my screen for a second? I pulled up your website earlier and noticed something..." [Show a specific gap, opportunity, or observation they hadn't noticed]

**Why it works:** You just taught them something valuable for FREE. Reciprocity + demonstrated competence = trust in 60 seconds.

---

## THE TRUST EQUATION

**Trust = (Credibility + Reliability + Intimacy) ÷ Self-Interest**

- **Credibility:** Do they believe you KNOW what you're talking about? (Cold reads, specific proof)
- **Reliability:** Do they believe you'll DO what you say? (Follow through, punctuality, consistency)
- **Intimacy:** Do they feel SAFE sharing with you? (Vulnerability, active listening, empathy)
- **Self-Interest (divider):** Do they think you're in this for THEM or for yourself? (Disqualification, outcome independence, genuine care)

**The fastest way to build trust:** Increase intimacy (be real) and decrease perceived self-interest (disqualify yourself). Most salespeople do the opposite — they prove credibility (brag) while dripping self-interest (pitch).

---

## SPEED-TO-TRUST CHECKLIST (First 5 Minutes)

- [ ] Delivered a cold read that showed homework (Credibility)
- [ ] Shared one real, vulnerable truth about your own experience (Intimacy)
- [ ] Dropped one specific case study with name + number (Credibility)
- [ ] Disqualified yourself in some way (Reduced Self-Interest)
- [ ] Asked a question that showed genuine curiosity about THEM (Intimacy)

---

# 31 — Future Pacing & Vision Selling

> **For:** DGK team making prospects FEEL the transformation before they buy
> **Why:** People don't buy products. They buy the future version of themselves. If you can make them SEE and FEEL that future, they'll buy.

---

## WHAT IS FUTURE PACING?

Future pacing = describing the prospect's life AFTER they buy, in such vivid detail that they can feel it right now. It bridges the gap between "I'm thinking about it" and "I need this."

**Without future pacing:** "We'll build you a CRM and outbound system." (Features. Boring.)
**With future pacing:** "Imagine it's 90 days from now. You open your laptop on Monday morning, coffee in hand, and there are 4 qualified enquiries sitting in your pipeline from the weekend. You didn't send a single DM. You didn't make a single call. The system did it while you were at the beach with your kids. That's what we're building."

---

## THE 3-STEP FUTURE PACE FORMULA

### Step 1 — Set the Scene (5 seconds)
Place them in a specific moment in the future.
- "Imagine it's 90 days from now..."
- "Picture this — it's a Monday morning, 3 months from today..."
- "Fast forward to December..."

### Step 2 — Describe the Transformed Reality (15-20 seconds)
Paint what their life looks like with the problem SOLVED. Use sensory details.
- What do they SEE? (Dashboard with leads, full pipeline)
- What do they FEEL? (Relaxed, confident, in control)
- What are they DOING? (Taking a holiday, hiring, planning expansion)
- What are they NOT doing? (Hustling for referrals, stressing about revenue)

### Step 3 — Anchor Back to Now (5 seconds)
Bring them back to the present and connect it to the decision.
- "That's what we're building together. The question is whether you want to start this week or next month."

---

## DGK FUTURE PACE SCRIPTS

### For the overwhelmed founder:
"Picture this — it's 3 months from now. You wake up, check your phone, and there are 3 new enquiries in your CRM from last night. Qualified. In your target market. You didn't send a single message. You're having breakfast with your family instead of stressing about where the next client is coming from. That's what 'done with you, owned by you' actually looks like in practice."

### For the NDIS provider:
"Imagine it's 90 days from now. Every time a competitor posts a support coordinator role on SEEK, your system automatically reaches out to participants in that area THAT WEEK. Your content is publishing daily across 6 platforms. Your director hasn't touched marketing in weeks. Participants are finding you instead of the other way around."

### For the sceptic:
"Look — I know you've been burned before. So let me paint a different picture. It's 12 weeks from now. You own the CRM. You own the sequences. You own the dashboards. If you decided tomorrow that you never wanted to talk to me again, the system keeps running. No retainer. No dependency. That's the difference."

---

## WHEN TO USE FUTURE PACING

| Moment | How to use it |
|---|---|
| During discovery (after uncovering pain) | "What would it mean for you if that was solved?" → then paint the picture |
| Before presenting price | Future pace the outcome so price feels like an investment |
| When they hesitate to close | "Let me paint a picture of what this looks like 90 days from now..." |
| In follow-up DMs | "Kept thinking about our chat. Just imagine having [specific outcome] by Q4." |
| LinkedIn content | Posts that paint the before/after transformation |

**Rule:** Always use THEIR specific situation. Don't say "imagine having more leads." Say "imagine having 6 qualified IT decision makers in your pipeline every month without cold calling."

---




---

## File: `references/05-objections-closing-pricing.md`

# Objections, Closing, Pricing, Negotiation, Qualifying

> DGK Sales Knowledge Base — reference file. Source files listed below.

## Contents
- 04 OBJECTION HANDLING AND REPLIES
- 21 OBJECTION PREVENTION
- 10 THE CLOSE
- 11 PROPOSAL AND PRICING
- 13 NEGOTIATION
- 12 QUALIFYING AND DISQUALIFYING
- 32 SELLING AGAINST INERTIA

---

# Objection Handling, Replies & Pricing Strategy — DGK's Complete Framework

> **For:** DGK team handling prospect resistance + DGK clients handling their own objections + pricing conversations
> You'll ALWAYS get objections. Dozens of deals signed after thinking "no way they book."
> Hormozi: "The cheapest customers ask for the most. The best price is the one that makes you the most money."

---

## CORE PHILOSOPHY

1. **Resonate first** — "great question", "100%", "ahh solid"
2. **Restate their concern** — show you heard them
3. **Address the objection** with value-first framing
4. **Send the call link anyway** — you'd be surprised

---

## DM OBJECTION SCRIPTS

### "How much is it?"
Don't answer price in DMs. Redirect to call.
"Totally fair question. Honestly it depends on your situation — that's kinda why I'd want to hop on a quick call, see what's going on and if it even makes sense. Wanna grab 15 min?"

DGK-specific: "It depends on which system you need — Foundation, Outbound, Content, or a combo. Easiest if we jump on a quick call and I can map it out based on where you're at. No pitch, just a diagnosis."

### "Sorry I don't have the time"
Still HOT. Address with empathy: "100% get it. The call is 30 min max. Could do early morning or late arvo AEST — whatever suits."

### "I need to make more to afford it"
Buying signal — they're interested. Redirect to call to discuss ROI/structuring.
DGK-specific: "That's actually exactly why this conversation might be worth it. The system is designed to generate pipeline so you're not waiting on referrals. Let's at least look at the numbers together."

### "What are you trying to do?" / "Are you trying to sell me?"
Stay grounded: "Nah honestly I just noticed [specific thing] and thought there might be a way I could help. No pressure at all."

### "I'm not looking for what you offer"
- "100%" — acknowledge with a single message, give it room to breathe
- Then: "Yeah I'm down for just a chat where I get under the hood of what you do & find blind spots"
- "No strings or anything."
- Send calendar + "Feel free to book with that" + "Let me know once you did it"

### "We already have a marketing agency"
DGK-specific: "Yeah that makes sense. DGK is a bit different — we build the system with you and you own it when we're done. No retainer, no dependency. Might be worth a quick look to see if there are gaps."

### "We're too small for this"
DGK-specific: "Some of our best results have been with teams of 5-15. The system scales with you. IT Together went from 0 to 6 qualified enquiries a month in 60 days — they were a team of 8."

### When someone wants to book but scheduling is far out
1. Take control: "Here let's do this"
2. "Book this with me" + send link
3. If next week: "I'll adjust it to the same time next week for us"
4. "Let me know once you did it and I'll adjust"

### When someone said they'd book but hasn't
Wait 20-24 hours. Friendly nudge (Bucket 2). Don't add more value — focus on booking.

### When someone declines multiple times
Stop after 2-3 addressed objections. Leave with: "Let me know if there's any way I can help." Follow up in 1-2 weeks softly.

---

## THE WDYM (WHAT DO YOU MEAN) PHRASE TECHNIQUE

Drop specific phrases that make prospects ask "What do you mean?" — then explain with authority.

### How it works:
1. Drop a phrase naturally ("signal-based targeting", "outbound infrastructure", "system ownership")
2. When they ask, explain in depth with specific example
3. Provide value through explanation without mentioning sales
4. Transition to call pitch

### DGK Example — "Signal-Based Targeting":
Prospect: "What do you mean signal-based?"
You: "So instead of just blasting cold emails to a list, we track 130+ triggers — like when a company posts a job on SEEK for a support coordinator, or when they get new funding. Then we reach out that same week while the pain is fresh. One of our NDIS clients is getting same-week outreach on hiring signals now. Way higher response rates than generic cold."
Then: "Down to walk you through how we'd set that up for your business on a quick call. Wanna grab some time?"

### Other DGK WDYM Phrases:
- **"System ownership"** → "Most agencies build it, run it for 3 months, leave. You own nothing. We build it with you in the room. When we're done, the CRM, the sequences, the dashboards — all yours. No retainer."
- **"Foundation before fuel"** → "Most businesses start running ads or cold email before they have a CRM, tracking, or automation. That's like pouring fuel with no engine. We build the engine first."
- **"Done with you"** → "It's not an agency. We don't do it for you and charge monthly forever. We build it together, you're in every session. When we finish, you run it."

---

## HORMOZI'S PRICING STRATEGY (For DGK + DGK Clients)

### The Vicious Price Cycle (What Most Businesses Do WRONG)
As you DECREASE prices:
- Client emotional investment DECREASES
- Perceived value DECREASES
- Results DECREASE
- Client demandingness INCREASES (cheapest customers ask for the most)
- Your profit erodes, conviction drops, team burns out

### The Virtuous Price Cycle (What To Do Instead)
As you INCREASE prices:
- Attract better customers
- More profit per customer → invest in better experience
- Better results → more conviction in sales process
- Keep best talent (you can pay them more)
- Unlock expensive acquisition channels competitors can't use

### How To Pick Your Price (For DGK Clients)
Best price = price that makes you the most money (not the most sales).
- Sales conversion rate × lifetime gross profit = the metric that matters
- Test prices every quarter
- Double price → if you close 20% fewer but make 60% more revenue = DO IT
- Start low, nudge up 20% every 10 sales until you notice dramatic drop, then go back to sweet spot

### Hormozi's RAISE Framework — The Perfect Price Raise Letter
For when DGK clients need to raise prices on existing customers:

**R — Remind** them of value you've already provided (1-5 bullets with data)
**A — Address** the price change directly (don't hide it)
**I — Invest** in their future (3 bullets of what you'll do with the extra revenue — frame as value FOR them)
**S — Soften** with a loyalty reward (expiring discount. People handle vanishing discounts better than raised prices)
**E — Explain** away concerns (PS statement: "If this materially impacts your business, let me know and we'll work something out")

**Rules:**
- Test on new customers first. If they buy and stay at profitable rates, then raise on existing.
- If raising 50%+: do it over a phone call, not email
- Stair-step option: drop off discount at 6-month intervals (2-3 mini jumps vs one big one)
- Sign in ink if physical. Sign email personally.
- Do the math beforehand: know what % of customers you can lose and still make more money

### Price Raise Checklist
1. Decide on increase amount
2. Test with new customers first
3. Segment old customers
4. Write 1-5 bullets of current value delivered
5. Tell them the raise happens now
6. Write 3 bullets of investments you'll make with the profit
7. Explain how investments benefit them
8. Give expiring loyalty discount
9. Tell them you respond personally to any issues
10. Sign personally
11. Strong PS statement
12. If 50%+: do individually by call
13. Optional stair-step for large raises

---

## PRICE PRESENTATION TACTICS (From Pro Tips)

**Say "only" before the number:** "Only" is a minimizing word that makes the price feel cheaper than it is. "It's only $6,000 for the full Foundation build."

**Give the price and shut up:** Once you're in the close, stop selling. Say less. Let them come to you. Just answer their questions concisely and close.

**Before revealing price, pause and reframe internally:** Tell yourself "at least it doesn't cost a million dollars." The mental contrast primes you to deliver the number with strong, confident tonality.

**If on screen share:** Make the pricing font slightly smaller so the prospect leans in to see it. The act of leaning in subconsciously moves them "closer" to buying.

**Use "investment" not "cost":** "Let's talk about the investment it'll take to sort all this out" frames it as value, not expense.

**Never be the first to bring up price.** End your presentation with: "Alright, we're coming up on our time. Let's discuss next steps — any questions before we wrap up?" They'll ask about price themselves, which puts them in the pursuing position.

**Paid proposals only (for DGK clients to use):** If a client needs to send a proposal, make it paid. If the prospect moves forward, deduct it from the total. This prevents: doing nothing, shopping your deal to competitors, or using you for free consulting.

---

## THE 3 COMMUNICATION MODES (Always Choose #3)

1. **Me Me Me** — selfish, "I want something from you." Never.
2. **Horse Trading** — "Favor for favor." Better but not ideal.
3. **Your Needs Are My Needs** — "I genuinely want to help you." Books calls.

DGK lives in Mode 3: "No pitch. No pressure. Just a diagnosis." The Done-With-You model IS Mode 3 — your success is our success because you own the system.

---

## REPLY FRAMEWORK FOR LIVE CONVERSATIONS

When a prospect replies:
1. **Mirror & Resonate** — don't jump to selling
2. **Ask follow-up questions** — show genuine curiosity
3. **Make authority-building observations** — show you understand their business
4. **Foreshadow value** — "Got quite a few friends in your space…"
5. **Multi-thread** — personal + business conversations
6. **Pry pain points** — AFTER building rapport
7. **Pitch the call** — only after enough value demonstrated

### Tone:
Acknowledge → "Ahh solid" · Non-supplicating · Foreshadow value BEFORE pitching · Casual, spontaneous tonality · "You know I like [their company]" · "Got a bunch of friends…" · "Helped a few of them scale up. Could possibly help you too"

---

# 21 — Objection Prevention: Stop Objections Before They Start

> **For:** DGK team proactively addressing concerns + DGK clients learning preemptive selling
> **Why:** The best salespeople don't handle objections. They prevent them. If 80% of prospects ask about price, weave the value story so deep into discovery that the price objection never surfaces.

---

## THE 5 MOST COMMON DGK OBJECTIONS (And How to Prevent Each)

### Objection: "How much is it?"
**Prevention:** Quantify the cost of inaction BEFORE price comes up.

**In discovery, say:** "Based on what you've told me, the referral dependency is costing you roughly $15-20K a month in missed revenue. Over 12 months that's $180-240K."

Now when you say "$10,000 for the build" — they're comparing $10K against $240K, not against $0.

### Objection: "We already have an agency"
**Prevention:** Ask about their current setup in discovery and expose the gap naturally.

**In discovery, say:** "Walk me through your current marketing setup. Who handles what? And when the engagement ends, what do you own?"

They'll realise they own nothing. You don't need to say "agencies are bad" — the question reveals it.

### Objection: "We're too small"
**Prevention:** Drop the case study early.

**In discovery, say:** "We actually work mostly with businesses your size. IT Together was a team of 8 when we started." Now "too small" never comes up because you've already normalised their size.

### Objection: "I need to think about it"
**Prevention:** Identify ALL decision makers early and get commitment to decide on the call.

**In the bridge, say:** "By the end of this call, one of two things will happen — either we see a fit and talk next steps, or we don't and that's totally fine. Sound fair?"

They've agreed to make a decision TODAY. "I need to think about it" now contradicts their own agreement.

### Objection: "What if it doesn't work?"
**Prevention:** Address risk before they feel it.

**In your solution presentation, say:** "And just to be transparent — you own everything we build. If for any reason you decided to stop halfway, you'd keep the CRM, the website, the sequences — everything done to that point is yours. There's no lock-in."

---

## THE PREEMPTIVE SEEDING TECHNIQUE

Instead of waiting for objections, DROP the answer into conversation naturally:

| Concern they'll have | Seed to plant (casually, during discovery) |
|---|---|
| "Is it expensive?" | "Companies your size typically invest $8-15K but the ROI usually pays for itself in month 1-2." |
| "Will it work for my industry?" | "We've done this for IT, NDIS, trades, cleaning — the system adapts to any B2B." |
| "How long will it take?" | "Most clients see first results by week 6, full system by week 12." |
| "Do I need to be technical?" | "We build everything in plain English. You don't need to know code." |
| "What if my team can't run it?" | "Part of the done-with-you model is training. By handover, your team runs it independently." |

**Rule:** Plant these seeds in the first 15 minutes. By the time you present the solution, the objections have already been answered — without them even asking.

---

## ADAPTING FOR CLIENTS

Teach clients to:
1. List their top 5 most common objections
2. For each, write a "seed" sentence that addresses it proactively
3. Practice weaving seeds into the first half of their sales conversations
4. Track which objections still come up — if one keeps appearing, the seed isn't working and needs rewording

---

# 10 — The Close: How to Turn Discovery Into Signed Deals

> **For:** DGK team converting strategy calls into paying clients
> **The gap this fills:** Files 01-09 get prospects to the call and through discovery. This file teaches the actual moment money changes hands.
> **Core truth:** If your discovery was done right (File 06), the close should feel like a natural next step — not a high-pressure event.

---

## WHY MOST CLOSES FAIL

The close doesn't fail at the close. It fails 15 minutes earlier during discovery. If you didn't uncover Level 3 pain (emotional), quantify the cost of inaction, and get the prospect to articulate their own problem — no closing technique will save you.

**Pre-close checklist (before attempting ANY close):**
- [ ] Prospect stated their problem in their own words
- [ ] You dug to Level 3 pain (how it makes them FEEL)
- [ ] You quantified the cost of inaction ("$15-20K/mo in missed revenue")
- [ ] You asked "other than yourself, who else needs to be involved?"
- [ ] You mapped your solution to their specific pain (not a generic pitch)

If any box is unchecked, go back to discovery. Don't close yet.

---

## THE 8 CLOSING TECHNIQUES

### 1 — The Assumptive Close ⭐⭐⭐⭐⭐
**What it is:** Assume the sale is happening and talk about next steps as if they've already decided.

**Script:** "Based on everything you've told me, Foundation + Outbound is where we'd start. We'd kick off next Monday with the CRM setup. Want me to send the agreement over this afternoon?"

**Why it works:** You're not asking IF they want to proceed. You're asking about logistics. The psychological shift from "should I buy?" to "when do we start?" is massive.

**When to use:** When discovery went well, they're nodding, and the energy is positive.

### 2 — The Silence Close ⭐⭐⭐⭐⭐
**What it is:** Present your solution, state the price, then STOP TALKING. The first person to speak loses.

**Script:** "The investment for Foundation is $8,000 over 12 weeks. [SILENCE]"

Count in your head. 5 seconds. 10 seconds. 15 seconds. Do NOT fill the silence. They will speak first. And when they do, they'll either say yes, ask a question (which you answer then re-close), or raise an objection (which you handle per File 04).

**Why it works:** Silence creates tension. Tension demands resolution. If YOU break the silence, you signal anxiety. If THEY break it, they're processing and moving toward a decision.

**When to use:** Every single time you state a price. Non-negotiable.

### 3 — The Summary Close ⭐⭐⭐⭐
**What it is:** Recap everything they told you — their pain, the cost of inaction, and how your solution fixes each point — then ask for the close.

**Script:** "So let me make sure I've got this right. You're getting 2-3 clients a month from referrals, which means revenue is unpredictable. You tried an agency for 6 months that cost $24K total with no real results. And right now you're the bottleneck — selling, delivering, and trying to figure out marketing. The Foundation build would give you a CRM that captures every lead, outbound sequences that run without you, and tracking so you know exactly what's working. That solves all three problems. Want to get started?"

**Why it works:** You're using THEIR words to describe THEIR problems. Then you map YOUR solution to each one. It feels inevitable, not salesy.

### 4 — The Either/Or Close ⭐⭐⭐⭐
**What it is:** Give two options — both of which result in a sale. The question isn't IF they buy, but WHICH option they choose.

**Script:** "We could do Foundation only and get your CRM and website sorted — that's $6,000. Or we could do Foundation + Outbound together and have leads coming in by week 8 — that's $12,000. Which makes more sense for where you're at?"

**Why it works:** Choice architecture. Choosing between two options is easier than deciding yes or no. Both options are a yes.

### 5 — The Urgency Close ⭐⭐⭐
**What it is:** Create genuine scarcity. Only works if it's TRUE.

**Script:** "We're taking on two more Foundation clients this quarter then closing the books to focus on delivery. I'd want you to be one of them if the timing works."

**Rule:** NEVER fake urgency. If they find out your "limited spots" are unlimited, trust is destroyed forever. Only use when you genuinely have capacity constraints.

### 6 — The Trial Close ⭐⭐⭐⭐⭐
**What it is:** Test the water before going for the full close. A trial close asks a hypothetical that reveals their readiness.

**Script examples:**
- "If we could solve the referral dependency problem, would that be worth exploring?"
- "If the numbers made sense, when would you ideally want to start?"
- "Does this sound like it would fix the problem you described?"
- "On a scale of 1-10, how interested are you in moving forward?"

**Why it works:** If they say 7+, go for the full close. If they say 4-6, more discovery needed. If they say 1-3, you've got a qualification issue.

**When to use:** Midway through the call before you present pricing. Trial closes prevent awkward hard closes at the end.

### 7 — The Take-Away Close ⭐⭐⭐⭐
**What it is:** Suggest that maybe this ISN'T right for them. Humans want what they can't have. Taking it away makes them fight for it.

**Script:** "Honestly, based on what you've told me about your timeline, I'm not sure this is the right fit right now. We need clients who can commit to 12 weeks of building together. If that's not realistic for your schedule, I totally understand."

**Why it works:** You've just told them they might NOT qualify. Their brain shifts from "should I buy?" to "wait, am I good enough?" Now they're selling YOU on why they should be accepted.

### 8 — The Next-Step Close ⭐⭐⭐
**What it is:** When you can't close on the call, close them on the NEXT step instead. Never end a call without a defined next action.

**Script:** "I think there's a real fit here. Let's do this — I'll send over a 1-page scope document today, and let's jump on a 15-minute call Thursday to lock in the details. Does 10 AM AEST work?"

**Why it works:** You're keeping momentum. A call that ends with "I'll think about it" and no next step is a dead deal 80% of the time.

---

## THE DGK CLOSE FLOW (Exact Sequence)

After discovery is complete:

1. **Summary:** "So what I'm hearing is [recap their 3 biggest pains in their words]."
2. **Quantify:** "That's costing you roughly $X per month. Over a year, that's $Y."
3. **Trial close:** "If we could fix that, would it be worth exploring?"
4. **Present solution:** "Based on everything, I'd recommend [specific DGK package]. We'd build it with you over [X] weeks and you'd own it completely."
5. **State price + silence:** "The investment is $[X]. [STOP TALKING]"
6. **Handle response:**
   - If YES → "Amazing. I'll send the agreement over today. Want me to email or DM it?"
   - If objection → Handle per File 04, then re-close
   - If "I need to think about it" → "What specifically? Usually that means there's something I haven't addressed."
   - If "I need to talk to my partner" → "100%. What do you think they'd want to know? Let's get ahead of their questions right now."

---

## HANDLING "LET ME THINK ABOUT IT" (The Deal Killer)

This phrase kills more deals than any objection. Here's how to handle it:

**Step 1 — Isolate the concern:**
"Totally get it. Can I ask — is it the price, the timing, or something about the approach that you want to think about?"

**Step 2 — Address what they reveal:**
- If price → "What were you expecting the investment to be?" (then re-anchor)
- If timing → "When would be better? Let's lock in a start date that works."
- If approach → "What part concerns you? Let me address that right now."

**Step 3 — If they still won't commit:**
"No pressure at all. Let me send you the scope document so you have everything in writing. Can we lock in a 10-minute call Thursday to go through any final questions? That way you've got all the info you need to decide."

**NEVER say:** "Sure, take your time!" — that's giving them permission to ghost you.

---

## CLOSING ON THE CALL vs. POST-CALL

**Always try to close ON the call.** Reasons:
- Momentum is highest during the conversation
- Every hour that passes after the call, their emotional investment drops
- They'll talk to people who talk them out of it
- Competitors will reach them

**DGK on-call close incentive:**
"If we lock this in today, I can start the Foundation setup this week and give you priority onboarding. I can also take $500 off the build as a same-day commitment. Does that work?"

**If they need 24-48 hours (max):**
"Totally understand. I'll send the agreement now. Let's reconnect tomorrow at [time] to finalise. Sound good?"

Set the follow-up call BEFORE you hang up. Never leave it open-ended.

---

## READING BUYING SIGNALS

### Verbal Buying Signals (They're Ready):
- "How soon could we start?"
- "What does the onboarding look like?"
- "Can you send me the agreement?"
- "What payment options do you have?"
- "Do you have availability next month?"
- They start talking in terms of "when" not "if"
- They ask about details beyond the sale (implementation, timelines)

### Verbal Warning Signals (They're Not Ready):
- "This is really interesting" (polite brush-off)
- "We'll definitely keep you in mind" (= no)
- "Can you send me some information?" (= I want off this call)
- "We're just exploring right now" (= no urgency)
- Lots of "we" and "the team" (= hiding behind others)

**When you hear buying signals:** Stop selling and start closing. Don't add more information. Don't show more features. Just close.

**When you hear warning signals:** Go back to discovery. You missed something. Ask: "What would need to be true for this to make sense for you?"

---

# 11 — Proposal & Pricing Presentation

> **For:** DGK team presenting pricing on calls and sending proposals
> **The gap this fills:** Knowing WHEN and HOW to present price so the number feels like an investment, not an expense.

---

## THE GOLDEN RULE OF PRICING

**Never present price before pain is quantified.**

If the prospect's problem costs them $180K/year and your solution is $8K, it's a no-brainer. But if you present $8K before they know the cost of doing nothing — $8K feels expensive.

**The sequence:**
1. Quantify pain ("$15-20K/mo in missed revenue = $180-240K/year")
2. Present solution mapped to pain
3. Present price
4. Silence

---

## DGK PRICING ARCHITECTURE (3-Tier Model)

Present three options. The middle option is what you actually want them to buy. The top option makes the middle feel reasonable. The bottom option exists so they don't say "no" entirely.

### Tier 1 — Foundation Essentials (The Wedge)
**What's included:** CRM setup, website audit + fixes, basic automation, tracking setup
**Timeline:** 6-8 weeks
**Price:** $4,000-$6,000
**Who it's for:** "If you just want the engine built and you'll handle fuel yourself"

### Tier 2 — Foundation + Outbound (The Sweet Spot) ★ RECOMMENDED
**What's included:** Everything in Tier 1 + email infrastructure, signal-based lists, 5-email sequence, reply routing to CRM
**Timeline:** 10-14 weeks
**Price:** $8,000-$12,000
**Who it's for:** "If you want leads coming in by week 8"

### Tier 3 — Full Growth System (The Premium)
**What's included:** Everything in Tier 2 + daily content across 6 platforms + LinkedIn Ads (3-tier)
**Timeline:** 14-20 weeks
**Price:** $15,000-$20,000+
**Who it's for:** "If you want the full system — pipeline, content, and ads — built and running"

### How to Present the 3 Tiers:
"So based on what you've told me, here are three ways we could approach this."

Start with Tier 3 (highest). This is your anchor. Then work DOWN to Tier 2. Tier 2 now feels like a deal by comparison.

"Most clients in your situation go with the middle option — it gets the outbound engine running without the full content and ads commitment."

Then mention Tier 1: "Or if you just want the foundation sorted first and add outbound later, there's that option too."

**Let THEM choose.** Don't push. The architecture does the selling.

### The Psychology of 3 Options:
- 3 options reduces decision paralysis (vs. yes/no binary)
- Most people pick the middle (compromise effect)
- The top tier makes the middle feel like smart value
- The bottom tier catches people who would have said "no" entirely

---

## PRICE ANCHORING TECHNIQUES

### Anchor Against Alternatives:
"A full-time marketing hire would cost you $80-120K per year plus 3-6 months ramp time. An agency retainer runs $3-5K/month with no ownership. The Foundation build is $8K once, you own it forever, and it's running in 12 weeks."

### Anchor Against Inaction:
"You said the referral dependency costs roughly $15-20K/month in missed revenue. Over 12 months that's $180-240K. The system to fix it is $8K. That pays for itself in month one."

### Anchor Against Their Words:
Use the exact pain they described: "You told me you're frustrated, you've wasted $24K on an agency that left you with nothing, and you can't forecast next quarter. What would it be worth to never feel that way again?"

---

## PRESENTING PRICE ON THE CALL

### The Script:
"So the investment for Foundation + Outbound is $10,000 over 14 weeks."

Then:
1. **State the number clearly.** Don't mumble, don't rush, don't apologise.
2. **Say "investment" not "cost" or "price."**
3. **Put "only" before the number if you can do it naturally:** "It's only $10,000 over 14 weeks."
4. **Stop talking.** Count to 10 in your head. Wait for them.
5. **Maintain eye contact** (on Zoom, look at the camera, not their face).
6. **Don't add disclaimers:** No "I know that might seem like a lot" or "But we're flexible."

### If They React Positively:
"Want me to send the agreement over now?"

### If They Hesitate:
"What are you thinking?" (genuinely curious, not pressured)

### If They Say It's Too Expensive:
"Totally understand. What were you expecting the investment to be?"

Then: "What would need to be true about the ROI for this to make sense?"

Then if needed, offer Tier 1 as the wedge: "We could also start with just the Foundation — $5,000, get your CRM and website sorted — and add outbound later."

---

## PROPOSALS: HOW TO SEND THEM

### Rule 1: Never Send a Proposal Without a Call
A proposal should confirm what was discussed on a call — not replace the call. If someone says "just send me a proposal" without a discovery call, it's a brush-off.

### Rule 2: Keep It to 1-2 Pages
Nobody reads 15-page proposals. One page that shows:
1. Their problem (in their words)
2. Your solution (mapped to each problem)
3. Timeline
4. Investment
5. What happens next

### Rule 3: Paid Proposals for Complex Deals
For custom or high-value deals, charge for the proposal itself. Deducted from the total if they proceed.

"To put together a detailed scope, there's a $500 diagnostic fee. That covers 2 hours of analysis and a custom implementation plan. If you move forward, it gets deducted from the project total."

This prevents: doing nothing, shopping your proposal to competitors, free consulting.

### Rule 4: Follow Up Within 24 Hours
Send proposal immediately after the call. Follow up next morning: "Hey NAME — sent the scope over last night. Had a look? Happy to jump on a quick call to walk through anything."

Never let a proposal sit for more than 48 hours without a follow-up.

---

# 13 — Negotiation: Discounts, Scope, and Payment Terms

> **For:** DGK team handling pricing pushback and scope discussions
> **Core principle:** Negotiation is not about winning. It's about finding a deal that works for both sides while protecting your value.

---

## THE 4 RULES OF DGK NEGOTIATION

### Rule 1: Never Discount Without Removing Scope
If they want to pay less, they get less. Never reduce price while keeping the same deliverables — that trains clients to negotiate every time.

**Script:** "I can definitely work with a lower budget. If we drop [specific deliverable], the investment comes down to $[reduced amount]. Which parts are most important to you?"

### Rule 2: Anchor First, Negotiate Second
Always state your price first (see File 11). The first number on the table sets the anchor. If they anchor first ("we were thinking $3K"), you're negotiating DOWN from their frame instead of up from your value.

### Rule 3: Trade, Don't Concede
Every concession you make should get something in return.

**Script:** "I can bring it down to $[X] if we start this week and you can commit to the full 12-week timeline. Does that work?"

Trades you can offer:
- Lower price → faster start date
- Lower price → case study permission (use their results publicly)
- Lower price → prepaid in full (vs. instalments)
- Lower price → referral commitment (introduce 2 business owners)
- Lower price → reduced scope (remove specific deliverables)

### Rule 4: Be Willing to Walk Away
The moment you NEED the deal, you've lost all leverage. If the numbers don't work, say so clearly and kindly.

**Script:** "I really appreciate the conversation. At that price point, I can't deliver the quality you need without cutting corners — and I won't do that. If the budget shifts, I'm here. All the best."

---

## THE 7 MOST COMMON NEGOTIATION SCENARIOS

### 1 — "Can you do it cheaper?"
**Script:** "I hear you. Which parts are most important? I can adjust the scope to fit a tighter budget. Or — if we start this week, I can take $500 off as a fast-start incentive."

### 2 — "Your competitor quoted $X less"
**Script:** "Yeah that tracks. Most agencies charge monthly retainers and own everything. We build the system WITH you and you own it when done — no ongoing dependency. Different model, different value."

### 3 — "Can we do a payment plan?"
**Script:** "Absolutely. We can split it into [2-3 instalments] across the project timeline. First payment kicks things off, second at the midpoint, final at handover. Sound fair?"

DGK standard: 50% upfront, 50% at completion. Or 3 monthly payments.

### 4 — "Can we start smaller and see how it goes?"
**Script:** "100%. The Foundation Essentials is exactly that — it's $5K, gets your CRM and website sorted in 6-8 weeks. If the results are there, we add Outbound. No pressure to commit to the full thing upfront."

This is the Wedge Offer from File 09. Use it.

### 5 — "I need to talk to my partner"
**Script:** "Makes sense. What do you think they'd be most concerned about — the price, the timeline, or the approach? Let's get ahead of their questions now so you've got answers ready."

If possible: "Would it be easier if we did a quick 15-minute call with both of you? That way they get to hear it direct and ask questions."

### 6 — "Can you throw in [extra thing]?"
**Script:** "I'd love to — but if I add that in, I'd need to either extend the timeline or adjust the investment. Which would you prefer?"

Never give extras for free. It devalues everything else.

### 7 — "We need to think about it" (with no timeline)
**Script:** "Totally understand. Quick question — if you HAD to decide today, which way would you lean? Just so I know whether to hold a spot for you."

This forces a soft commitment. If they lean yes, close. If they lean no, dig into why.

---

## PAYMENT COLLECTION

### Collect on the Call When Possible
"Amazing — let me send the agreement right now. If you sign today, I'll send the invoice and we can kick off next Monday. I've got Stripe set up so payment is instant."

### DGK Standard Terms:
- Foundation: 50% upfront, 50% at completion
- Foundation + Outbound: 3 monthly instalments
- Full Growth System: 4 monthly instalments
- Retainers: Monthly auto-debit

### Overdue Payments:
- Day 1 overdue: Friendly reminder email
- Day 7: Personal text or DM
- Day 14: Call. "Hey NAME, noticed the invoice is outstanding. Everything OK?"
- Day 21+: Pause work. "We've paused the build until the outstanding invoice is sorted. Want to jump on a call to work it out?"

---

# 12 — Qualifying & Disqualifying: When to Say No

> **For:** DGK team learning who to pursue and who to walk away from
> **The gap this fills:** Most salespeople try to close everyone. The best salespeople are ruthless about who they DON'T pursue. Bad clients cost more than no clients.

---

## WHY DISQUALIFYING IS MORE IMPORTANT THAN QUALIFYING

A bad-fit client:
- Takes 3x longer to deliver (scope creep, misaligned expectations)
- Drains your team's energy and morale
- Won't refer you (or refers other bad-fit clients)
- Leaves a bad review when it doesn't work (because it was never going to)
- Costs you the TIME you could have spent on 2-3 good clients

**DGK rule:** Saying no to a $5K bad-fit deal frees you to say yes to a $15K great-fit deal next week.

---

## DGK QUALIFICATION FRAMEWORK: BANT-F

Adapted from the classic BANT framework with a DGK-specific fifth criteria:

### B — BUDGET
**Question:** "Companies your size typically invest $6-12K in systems like this. Is that in the range you're thinking?"

**Green:** They confirm budget or say "depends on what we get" (= they have it)
**Yellow:** "We need to check internally" (= possible but needs approval)
**Red:** "We were thinking more like $500/month" (= fundamentally misaligned)

**DGK rule:** Always anchor high early. "Companies your size typically invest $8-15K with us." If they don't flinch, you're in range. If they gasp, they're probably not a fit.

### A — AUTHORITY
**Question:** "Other than yourself, who else needs to be involved in a decision like this?"

**Green:** "I make the final call" (sole founder/director)
**Yellow:** "I'd need to run it by my partner/board" (one more step)
**Red:** "I'm just researching for my boss" (you're not talking to the decision maker)

**DGK rule:** If they're not the decision maker, ask: "Would it make sense to get [decision maker] on this call so they can hear it firsthand?" Getting the DM on the call is critical. Presentations that get relayed through a gatekeeper lose 80% of their impact.

### N — NEED
**Question:** "What's driving the urgency to look at this now?"

**Green:** "We need to fix this this quarter" or "We're losing money every month"
**Yellow:** "We're exploring options" (= no urgency yet)
**Red:** "Just curious" or "Saw your post and thought I'd check it out" (= tire-kicker)

**DGK rule:** No urgency = no deal. If there's no pain driving action NOW, they'll "think about it" forever. Either create urgency (quantify cost of inaction) or move on.

### T — TIMELINE
**Question:** "If we decided to move forward, when would you ideally want to start?"

**Green:** "As soon as possible" or "This month"
**Yellow:** "Next quarter" (= real but needs nurturing)
**Red:** "Maybe next year" or "No rush" (= dead lead for now)

**DGK rule:** If timeline is 3+ months out, put them in long-term nurture (Follow-Up Framework 2: Add Value). Don't waste discovery call time on people who won't act for months.

### F — FIT (DGK-Specific)
**Question:** "How are you getting clients right now?" + "Have you worked with an agency or consultant before?"

**Green:** Referral-dependent, no systems, no bad agency experience (= perfect DGK client)
**Yellow:** Has some systems but gaps, OR had a bad agency experience (= needs trust-building)
**Red:** Already has outbound running well, OR wants DGK to do it ALL for them (done-for-you), OR in an industry DGK doesn't serve

**DGK fit criteria:**
- Australian B2B business ✓
- 5-50 staff ✓
- Services/products (not e-commerce or pure retail) ✓
- Founder/director accessible ✓
- Willing to participate (Done-With-You model requires their involvement) ✓
- Stuck on referrals or broken outbound ✓

---

## THE TRAFFIC LIGHT DECISION

After every discovery call, score the prospect:

**🟢 GREEN — Close now:**
All 5 BANT-F criteria met. Send proposal same day. Follow up within 24 hours.

**🟡 YELLOW — Nurture:**
3-4 criteria met, 1-2 weak. Follow up per File 02 frameworks. Book a second call if needed. Address the weak criteria specifically.

**🔴 RED — Disqualify gracefully:**
2+ criteria are red. Don't waste more time. Exit with class.

### How to Disqualify Gracefully:
"Hey NAME, really appreciate the conversation. Honestly, based on where you're at right now, I don't think we're the right fit — and I'd rather be upfront about that than waste your time. If things change down the track, I'm around. In the meantime, [offer one piece of free value]. All the best."

**Why this works:** You're the one saying no — which raises your status. And leaving them with value keeps the door open for later.

---

## 5 TYPES OF PROSPECTS TO AVOID

### 1 — The Price Shopper
**Signs:** Asks for pricing before anything else. Mentions they're "talking to 3-4 providers." Compares you to Fiverr/Upwork.
**Cost to DGK:** You'll win on depth but lose on price. They'll grind you down on scope and leave at the first cheaper option.

### 2 — The Ghost Decision Maker
**Signs:** "I love this but I need to check with my partner/boss/board." Never brings the DM to a call despite asking.
**Cost to DGK:** Weeks of follow-up with someone who can't actually say yes.

### 3 — The "Do It For Me" Client
**Signs:** "I just want it done. I don't have time to be involved." Pushes back on the Done-With-You model.
**Cost to DGK:** They won't engage in sessions, won't learn the system, then blame you when it doesn't work after handover.

### 4 — The Tyre-Kicker
**Signs:** "Just exploring." No urgency. No pain. Lots of questions, zero commitment signals.
**Cost to DGK:** Hours of calls and follow-ups that never convert.

### 5 — The Scope Creeper
**Signs:** "Can you also add..." before they've even signed. Treats every conversation as a negotiation for more.
**Cost to DGK:** They'll consume 2x the hours for the same fee.

---

# 32 — Selling Against Inertia: Overcoming "We're Fine For Now"

> **For:** DGK team handling the #1 deal killer — prospects who genuinely believe they don't need to change
> **Why:** Your biggest competitor isn't another agency. It's the status quo. 60% of lost B2B deals are lost to "no decision," not to competitors.

---

## WHY PEOPLE RESIST CHANGE

### The 4 Forces Model:
Two forces push toward change. Two push against it. You need to strengthen the pushes AND weaken the resistance.

**Forces FOR Change:**
1. **Push (Dissatisfaction):** How unhappy they are with current state → Make the pain visible
2. **Pull (Attraction):** How appealing the future looks → Future pacing (File 31)

**Forces AGAINST Change:**
3. **Anxiety:** Fear of the unknown, risk, wasting money → Reduce with guarantees, proof, risk reversal
4. **Habit:** Comfort with current way, "it works OK" → Challenge with cost of inaction

**Most salespeople only work on #1 and #2 (push harder, paint a bigger vision). The real unlock is reducing #3 and #4.**

---

## 6 TECHNIQUES TO BREAK INERTIA

### Technique 1 — Cost of Inaction (COI)
Quantify what "doing nothing" actually costs them.
"You said you get 2-3 referrals a month. Your average client is worth $10K. If a system could add 4-5 more per month, that's $40-50K in missed revenue EVERY month you wait. In 12 months, that's half a million dollars. Doing nothing has a price tag."

### Technique 2 — The Competitor Move
Show that their competitors are NOT standing still.
"I should mention — we're working with 2 other [industry] businesses in [city] right now. They're building these systems as we speak. In 6 months, they'll have predictable pipeline and you'll still be relying on referrals. The window to move first is now."

### Technique 3 — The Shrinking Window
Create urgency through real external forces.
"The cost of email infrastructure is going up. Deliverability rules are tightening. The businesses that build outbound NOW have a 12-month head start on everyone who waits."

### Technique 4 — The Small First Step
Reduce the size of the commitment to bypass the anxiety force.
"You don't have to commit to the full build. Let's start with a paid diagnostic — $500, 2 hours, I'll map exactly where your pipeline is leaking. If it's useful, we talk about fixing it. If not, you keep the audit."

### Technique 5 — Social Proof Stacking
Show that people LIKE THEM already made the decision.
"IT Together was in your exact position 6 months ago. Same size, same industry, same referral dependency. They're now at 6 qualified enquiries a month. They'll tell you themselves — happy to connect you."

### Technique 6 — The "What Changed" Question
When someone who was interested goes back to inertia:
"Last time we spoke, you said [their pain in their words]. What's changed since then? Did the problem go away, or did you just get used to it?"

This is powerful because it challenges whether they actually solved the problem or just stopped thinking about it.

---

## THE STATUS QUO TRAP SCRIPT

"Here's what I see a lot. A business owner knows they need a system. They think about it for a few months. Then things get busy, a couple of referrals come in, and they think 'maybe we're fine.' Six months later, the same problems are still there. The referrals slow down again. And now they're 6 months behind their competitors who built the system in January. The trap isn't that you're failing — it's that you're surviving just enough to delay the fix."

---




---

## File: `references/06-psychology.md`

# Buyer Psychology: Frame, Bias, Influence, Decision Science

> DGK Sales Knowledge Base — reference file. Source files listed below.

## Contents
- 07 FRAME CONTROL AND SALES MINDSET
- 37 COGNITIVE BIAS PLAYBOOK
- 38 THE IKEA EFFECT
- 39 INSIGHT SELLING
- 42 CHOICE ARCHITECTURE
- 43 DECISION FATIGUE
- 44 EMOTIONAL CONTAGION
- 45 CONSISTENCY PRINCIPLE
- 46 THE MESSENGER EFFECT

---

# Frame Control & Sales Mindset — DGK's Complete Status & Psychology Playbook

> **For:** DGK team mastering sales psychology + DGK clients learning to sell with authority
> **What is Frame Control?** In every conversation, there's an invisible battle for who's leading. The person who controls the "frame" (the lens through which the conversation is interpreted) controls the outcome. Frame = perspective. Whoever has the bigger perspective wins.
> **Why this matters:** You can know every script and framework, but if you don't control the frame, you'll still lose deals. Frame control is the difference between "I hope they buy" (low status) and "Let's see if they're a fit" (high status).
> **DGK context:** Our positioning — "Done with you. Owned by you. No lock-in." — IS a frame. It frames us as partners, not vendors. Builders, not agencies. This file teaches you how to hold that frame in every interaction.

---

## SECTION 1: THE 9 STATUS HACKS

Status = perceived authority and social standing. The higher your status relative to the prospect, the easier it is to close. These 9 hacks subtly raise your status without being arrogant.

### Status Hack #1 — The Time Constraint
**What it is:** Whoever is more conscious of time has higher status. A CEO doesn't have unlimited time for you. Neither should you for them.

**How to use it:**
- "Hey NAME, good to connect. I've got a hard stop in 30 minutes — if it's alright with you, can we get started?"
- "Really busy here today, actually in back-to-back meetings [slight laugh] — so if it's cool let's jump right in?"
- Then after delivering the constraint: "Great, thank you!" — this softens the directness and warms them up.

**Why it works:** You're subtly communicating "my time is valuable." The prospect adjusts their behavior — they get more focused, more respectful, more efficient. They unconsciously recognize you as someone worth paying attention to.

**DGK example:** "Hey Sarah, good to connect. I've got another client call in 30, so let's make the most of this. How's your week going?"

### Status Hack #2 — Check Your Tech
**What it is:** Telling the prospect their audio or connection seems off. Makes them feel slightly flustered while you remain calm and unbothered.

**How to use it:**
You: "Oh hey NAME, I think something's up with your audio — can you check? It's cutting in and out."
[Let them fumble for a minute. DO NOT rescue them. Sit in silence.]
Them: "How about now?"
You: [wait 1-2 seconds] "Yeah that's a bit better." [stay silent]
Them: "One second..." [adjusts more]
You: "Oh, there it is!"

**Why it works:** They feel "incompetent" for a moment. You remain composed. The status gap widens. This isn't cruel — it's a micro-moment that shifts the power dynamic. Use sparingly and early in the call.

**When to use:** Early in calls where the prospect seems overconfident or is trying to dominate the conversation.

### Status Hack #3 — Rephrase to Reframe
**What it is:** The same idea said differently carries completely different weight. How you phrase things determines how people perceive you.

**Examples:**

| Low Status (Clown) | High Status (Chad) |
|---|---|
| "We help local businesses with marketing" | "Restaurant owners seek us out to fix their marketing and grow revenue" |
| "We're looking to partner with execs like you" | "We're hand-selecting a few partners to pilot our new program" |
| "We do cold email for B2B companies" | "B2B founders come to us when referrals dry up and they need a predictable pipeline" |

**DGK reframes:**
- Clown: "We build marketing systems for businesses"
- Chad: "Australian B2B founders seek us out when they're tired of unpredictable revenue and agencies that own everything"
- Clown: "We can help you with lead generation"
- Chad: "We've been carefully selecting a handful of B2B businesses to pilot our outbound system this quarter"

**Key insight:** Notice "seek us out" vs "we help." One frames you as the prize being pursued. The other frames you as the pursuer. Always frame yourself as the prize.

### Status Hack #4 — Strategic Impatience
**What it is:** Showing SOME impatience AT TIMES signals you've solved this problem a million times and it's almost boring to you. Impatience implies competence.

**How to use it:**
- Let out a slight sigh before answering a basic question (implies you've answered this a thousand times)
- "Yeah [slight laugh] and let me guess, now you need someone to fix all that?" (bored/knowing tone)
- Cut through long-winded explanations: "Right, so essentially you need [concise summary]."

**CAUTION:** There's a fine line between competence and rudeness. Use this sparingly. Works best when the prospect is rambling or trying to commoditize you.

### Status Hack #5 — Subtle Disagreements
**What it is:** A single "Hmm..." in a disagreeing tone is enough to position you as the authority. You don't argue. You just... don't fully agree.

**How to use it:**
Prospect: "We think the new feature is going to be important for our workflow."
You: [pause] "Hmm..." [disagreeing tone, pause for a moment] "I'm not so sure about that." [pause — let them respond]
Prospect: "Care to explain?"
You: "There's certainly merit to doing it that way. But if you're open to it, I can suggest a more efficient approach."

**DGK example:**
Prospect: "We just need more leads."
You: [pause] "Hmm. Maybe. But in my experience, more leads into a broken system just creates more mess. I'd want to look at what happens AFTER the lead comes in before we worry about volume."

**Why it works:** You're not arguing. You're offering a bigger perspective. The prospect learns: this person sees things I don't. Trust increases.

### Status Hack #6 — Hello? Let Them Come to You
**What it is:** On Zoom, don't be the first to speak. Let the prospect initiate. Most salespeople jump in with an eager "Hey John?" the moment they see someone. That's the equivalent of a child walking into a room saying "Mommy?"

**How to use it:**
- Join the call. Video off initially.
- Wait in silence. Let 10-15 seconds pass.
- Prospect will say: "Hello? Chad?"
- You: [wait 1-2 seconds] "Heeey John." (strong, friendly, neutral inflection — not upward/eager)
- Then: "Doing great. Super busy here. What about yourself?"

**Why it works:** They came to YOU. They initiated. You responded from a position of being found, not seeking. Subtle but powerful.

### Status Hack #7 — Say Less
**What it is:** The more you talk, the more likely you lose frame and status. Deliver messages with strong, certain tonality and you won't need to explain yourself.

**Examples:**

| Low Status (Over-Explains) | High Status (Concise) |
|---|---|
| "Absolutely! You also get integrations and unrestricted access to the platform and..." | "That's correct." |
| "I completely understand. How can I help you make sense of the decision?" | [silent for 3 seconds — prospect keeps talking and reveals more] |

**The 3-Second Rule:** After the prospect stops talking, wait 3 full seconds before responding. They will almost always keep talking. When they do, they reveal more information AND lower their own status by rambling. The more they talk, the more invested they get. The more invested, the easier to influence.

### Status Hack #8 — Be the Judge
**What it is:** He who judges the other person has higher status. Think of a king judging his subjects. Normally the PROSPECT judges YOU. Flip it.

**Examples:**

| Low Status (Worshipping) | High Status (Judging) |
|---|---|
| "I heard great things about you guys. Really impressive!" | "I heard your product came a long way since the last funding round. I'm curious to learn more." |
| "That's awesome! You guys are market leaders!" | "Aw, good for you guys. That's awesome." (said in an "atta boy" / proud-parent tone) |
| "Your content is so good!" | "You guys have a lot of potential in your industry." (implies you work with MORE successful companies) |

**DGK example:**
Prospect: "We've been growing and just hit 20 staff."
You: "That's really solid for a business your age. I think you guys have a lot of runway ahead." (you're evaluating THEM, not seeking their approval)

### Status Hack #9 — Don't Over-Reciprocate
**What it is:** When someone says something nice, most salespeople escalate the niceness. "Great to meet you!" "GREAT to meet you TOO!" This is supplications. Acknowledge niceties but don't always match or exceed them.

**Examples:**

| Low Status (Over-Reciprocates) | High Status (Acknowledges) |
|---|---|
| Them: "Great to meet you." You: "GREAT to meet you too!" | You: "Yeah thanks. I see you're based out of Sydney?" |
| Them: "We're excited to see the product!" You: "Awesome! You're gonna LOVE it!" | You: "Ha, I think you're gonna like it." |
| Them: "We got amazing results!" You: "Amazing!!" | You: "Glad to hear." |

**Principle:** By not fully reciprocating, you maintain a status gap. You're friendly but not eager. Warm but not desperate.

---

## SECTION 2: REFRAMES — Clown vs. Chad Thinking

A reframe is taking a situation and looking at it through a different, more powerful lens. Below are the most important reframes for DGK team members to internalize.

### Sales Call Reframes

| Situation | Clown Thinking 🤡 | Chad Thinking 🐉 |
|---|---|---|
| Prospect says "tell me more" | Launches into product pitch | "Before we get to that, tell me more about how you're currently handling [problem]" |
| Prospect asks price early | Scrambles to justify or discount | "Is that a question or a statement? [smirk]" |
| Prospect says "we need to think about it" | "OK take your time!" | "Hmm. What specifically do you need to think about? Because in my experience that usually means there's something I haven't addressed." |
| Prospect says "your competitor is cheaper" | "But we're better!" | "Ha, yeah I remember when they changed their pricing. I'll just say — they're not cheaper because they're being generous." |
| Prospect compliments you after demo | Feels great, thinks deal is closing | Knows: when they compliment you, there's a good chance you're NOT getting the deal. Stay sharp. |
| You get rejected | "I suck. Sales isn't for me." | "They're just not a good fit for us." |
| Prospect goes dark after proposal | "I'm a failure." | "Getting rugged is part of the game. On to the next." |
| Prospect says "we have a vendor" | "What do you like about them?" | "Sounds like you're all set. Maybe we should put a pin in this and circle back next quarter." (willingness to walk away = instant trust) |
| You keep getting "no" | "What's wrong with me?" | "Another no. Based on my closing %, only 3 more to go before a yes." |

### DGK-Specific Reframes

| Situation | Clown | Chad |
|---|---|---|
| "We already have a marketing agency" | "We're different because..." | "Sounds like you're sorted then. Out of curiosity, do you own the system or does the agency?" |
| "We're not big enough for this" | "We work with all sizes!" | "Some of our best results have been with teams under 15. IT Together was 8 people when we started." |
| "How much?" | "$X per month for Y" | "Depends entirely on what we find in your pipeline. That's what the call is for." |
| Prospect is cocky/confident | Match their energy, try to impress | Pepper in awkward silences, subtle disagreements: "Hmm, not really." Stay ambiguous. You are the conductor. |

### Key Reframe Principles
1. **Start reframes with "I"** — "I feel that...", "I don't think so because...", "I think that..." — reminds them you're a person with authority, not just words.
2. **Challenge, don't chase** — "So does that mean even if we could fix [problem 1] and [problem 2], you wouldn't care to explore that?"
3. **Test for NON-interest instead of creating interest** — The more you try to create interest, the less interested they become. The more you test for non-interest, the more interested they become.
4. **The bigger perspective always wins** — If they say "I'm disappointed," you say "I'm even MORE disappointed." Bigger perspective = higher status.

---

## SECTION 3: THE CHAD MAXIMS — 30 Essential Sales Laws

These are laws of sales psychology. Read one before every call. Internalize them over time.

### On Status & Frame
1. **The higher your perceived status, the more likely you get quality answers from your questions.** Corollary: low status = BS answers.
2. **Whoever needs the other party least has the most power.**
3. **The person judging the other party has higher status.**
4. **The longer you've lost the frame, the harder it is to get back.** You only have 60 seconds at the start of a call to convey power.
5. **The more competent you are at frame control, the less reliant you'll be on scripts.**
6. **Ruthlessly control the frame while giving the impression you're not controlling anything.**

### On Interest & Desire
7. **Your desire for the deal is what prevents you from getting the deal.**
8. **The less desire you have, the more likely you receive what you desire.** Being without desire doesn't mean you don't want the deal — it means you treat the prospect as a regular person.
9. **The more you try to create interest, the less interested the prospect will be.** Test for non-interest instead.
10. **We chase what moves away from us.** The more you chase, the more they run.
11. **Try to be one level BELOW your prospect's interest during the sales process.** If you show more interest than them, you reduce theirs.

### On Emotion & Energy
12. **The moment you feel excited during the sale is the moment you start losing it.**
13. **The more excited you sound, the less experienced you look.** Replace enthusiasm with passion.
14. **The more emotional you get, the harder it is to control the frame.**
15. **The more animated you are before closing, the more likely you WON'T close.**

### On Qualifying & Pain
16. **The harder you qualify, the easier the sale.** The easier you qualify, the harder the sale.
17. **Average salespeople stop probing when they hear a problem. Champions continue until they get a price tag on the problem.**
18. **Never begin the presentation without first discovering and quantifying the pain.**
19. **The more expensive your solution, the bigger the PERCEIVED problem needs to be.**

### On Competence & Trust
20. **The more you reveal about your credentials, the less experienced you look.** Let competence show through your questions, not your resume.
21. **Never let a prospect tell you something you didn't know.** Assume mastery. "Been there, done that" attitude.
22. **The more fluff in your language, the lower your perceived status.**
23. **When trust is low, uncertainty is high. When uncertainty is high, there is no sale.**
24. **Prospects want you to prioritize the relationship over the deal.**

### On Closing
25. **The same prospect telling you "I need to think about it" is telling your competitor "Let's do it."**
26. **Always be willing to walk away from a deal.**
27. **Small commitments make bigger commitments more likely.** If you can't close the deal, close them on a paid trial, POC, or audit.
28. **You only accept lukewarm responses because somewhere deep down you believe you're not worth it.**
29. **Never end a call without action items or next steps.** If long sales cycle, end with a cliffhanger.
30. **Getting the sale is not success. Getting the sale with customers you're excited to work with and respect IS.**

---

## SECTION 4: THE CHAD CHRONICLES — Sales Parables (For Team Study)

### Parable 1: "A New Day" — The Industry Expert Frame
A clown salesperson starts a call by asking basic questions and pitching features. The prospect is bored.

A Chad Salesman starts the SAME call with an IDEA — framing the entire industry landscape:

"Your industry exceeded $200B last year and it's growing 6-7% annually. Question is, who's gonna get the spoils? You've got big players acquiring companies like yours to innovate. You've got smaller companies raising capital to grab market share. And now you've got privacy changes that will affect how you communicate with customers. Only a FEW are prepared — which is why we're on this call. To help you adapt and make sure your business succeeds. Now, to do that, I need to ask you a few questions..."

**The lesson:** Clowns sell products. Chads sell perspective. The clown has nothing to offer except features. The Chad has DEEP industry knowledge that RAISES THE STAKES. Now there's something to lose if the prospect doesn't act.

**DGK application:** Don't start calls with "So we help with lead generation." Start with: "The B2B landscape in Australia is shifting. The businesses winning right now aren't the ones with the best service — they're the ones with predictable pipeline. And most of your competitors are still stuck on referrals, which means there's a massive window right now for whoever builds the system first."

### Parable 2: "Born Again" — You Are The Prize
A salesperson is getting grilled with endless feature questions. He answers every one, getting more deflated. Then he realizes: "How many companies in the world can benefit from our product? Millions. How many can do what WE do? Five or six."

He stands up and says: "ENOUGH. We're simply nitpicking nice-to-have features. Our product solves all your core problems more efficiently than competitors. That's why [big company 1] and [big company 2] spend hundreds of thousands with us. If these features are a dealbreaker, I'm happy to refer you to [competitor]. They're not as good, but they might have what you need."

The prospect immediately asked for the agreement.

**The lesson:** YOU are the prize. Not them. When you internalize that, you stop chasing and start qualifying. The prospect NEEDS you more than you need them — they just don't know it yet.

**DGK application:** "Look, we've helped 20+ Australian B2B businesses build predictable pipeline in the last year. We're selective about who we take on because we invest heavily in each client. If this isn't the right fit, no hard feelings — but I'd hate for you to miss the window while your competitors are building these systems right now."

---

# 37 — The Cognitive Bias Playbook: 12 Psychological Weapons for Ethical Selling

> **Source:** Kahneman & Tversky (Nobel Prize), Cialdini (Influence), HBR, McKinsey
> **For:** DGK team using buyer psychology to close more deals + DGK clients doing the same
> **Rule:** Use these ethically. These tools help people make BETTER decisions faster — not manipulate them into bad ones.

---

## THE 12 BIASES THAT DRIVE B2B BUYING DECISIONS

### 1 — Anchoring Bias
**What:** The first number someone hears becomes the reference point for everything after.
**Research:** Tversky & Kahneman (1974) — even random numbers influence estimates.

**DGK application:** Always anchor HIGH first.
- "Companies your size typically invest $12-20K with us" (even if you expect them to buy the $8K package)
- "A full-time marketing hire costs $100-120K/year" (makes $8K feel tiny)
- "The referral dependency is costing you roughly $180-240K per year" (makes your fee feel like pocket change)

**On calls:** State the highest tier first, then work down. The first number they hear sets their mental benchmark.

### 2 — Loss Aversion
**What:** Losing $100 feels 2x more painful than gaining $100 feels good.
**Research:** Kahneman & Tversky (1979) — people are wired to avoid loss more than seek gain.

**DGK application:** Frame everything as what they LOSE by not acting.
- Instead of: "You'll gain 6 leads per month" → "You're losing $15-20K per month in missed revenue"
- Instead of: "You'll own the system" → "Without a system, every lead that visits your site and leaves is gone forever"
- Breakup emails work because losing access to you feels worse than never having it

### 3 — Social Proof Bias
**What:** People look to others similar to them to decide what's correct.
**Research:** Cialdini (1984) — "When uncertain, we look to see what others like us are doing."

**DGK application:** Always match proof to the prospect's identity.
- NDIS provider → Triple R case study. Not IT Together.
- 8-person team → "IT Together was a team of 8." Not "we work with enterprises."
- The closer the proof matches their situation, the stronger it hits.
- "20+ Australian B2B businesses in the last year" is good. "Another NDIS provider in Sydney your size" is 10x better.

### 4 — Confirmation Bias
**What:** People seek information that confirms what they already believe.
**Research:** Wason (1960) — people actively avoid information that contradicts their views.

**DGK application:** Find out what they already believe, then ALIGN your pitch with it.
- If they believe agencies are a waste of money → "You're right. That's exactly why we built the Done-With-You model."
- If they believe outbound is spammy → "Most outbound IS spammy. That's why we only reach out when there's a real signal — like a job posting or funding round."
- Don't fight their beliefs. Ride them to your conclusion.

### 5 — The Endowment Effect
**What:** People value things more once they feel ownership over them.
**Research:** Thaler (1980) — people demand 2x more to give up something they own vs. what they'd pay to acquire it.

**DGK application:** Give them a taste of ownership before they buy.
- Free audit: "Here's your domain health report. These are YOUR numbers."
- Show them the CRM during the call: "This would be YOUR dashboard."
- Trojan Horse gifts: once they USE your template, they feel ownership. Taking it away (by not buying) triggers loss aversion.

### 6 — The IKEA Effect ⭐ (See File 38 for deep dive)
**What:** People value things 63% more when they helped create them.
**DGK application:** This IS your business model. Use it as a selling point.

### 7 — The Bandwagon Effect
**What:** People want to do what everyone else is doing.
**Research:** Asch conformity experiments (1951) — people conform even when they know the group is wrong.

**DGK application:**
- "We've helped 20+ Australian B2B businesses build these systems in the last year"
- "Most of our clients add Outbound at this stage"
- "The businesses winning right now aren't the ones with the best service — they're the ones building outbound systems"

### 8 — Authority Bias
**What:** People defer to perceived experts.
**Research:** Milgram (1963) — people follow authority figures even against their own judgment.

**DGK application:** Position yourself as THE authority, not A vendor.
- Speak with certainty: "Based on what I've seen across 20+ businesses..." (not "I think maybe...")
- Use industry data: "McKinsey's research shows buyers use 10 channels before deciding"
- Publish content that demonstrates expertise (File 26)
- The cold read technique (File 06) immediately establishes authority

### 9 — The Framing Effect
**What:** The same information presented differently leads to different decisions.
**Research:** Tversky & Kahneman (1981) — "90% survival rate" vs "10% mortality rate" changes decisions dramatically.

**DGK application:**
- "Investment" not "cost". "System" not "project". "Partnership" not "engagement".
- "$8,000 over 12 weeks" feels smaller than "$8,000."
- "$667 per week" feels even smaller.
- "You own everything" (positive frame) vs "No lock-in" (negative frame) — use BOTH.

### 10 — Reciprocity Bias
**What:** When someone gives you something, you feel obligated to give back.
**Research:** Cialdini (1984) — the most powerful influence principle.

**DGK application:** Give FIRST. Always.
- Trojan Horse gifts (File 09) trigger reciprocity
- Free audits, valuable resources, genuine introductions
- The more valuable the gift, the stronger the obligation
- "I put this together specifically for your business" → they feel they OWE you a conversation

### 11 — Sunk Cost Fallacy
**What:** People continue investing because of what they've ALREADY invested, not future returns.
**Research:** Arkes & Blumer (1985).

**DGK application (use ethically):**
- During the call: "You've already invested [X hours/dollars] exploring this. Makes sense to take the next step and see it through."
- For existing clients considering cancellation: "You've already built 70% of the system. Walking away now means that investment was for nothing."
- The micro-commitment ladder (File 09) creates small sunk costs at each step.

### 12 — The Decoy Effect
**What:** Adding a third option that's slightly worse than your target option makes the target look better.
**Research:** Huber, Payne & Puto (1982).

**DGK application in 3-tier pricing:**
Your Tier 1 ($5K, Foundation only) acts as the decoy. It's close enough to Tier 2 ($10K, Foundation + Outbound) that Tier 2 feels like obviously better value. Nobody wants "just the engine" when they can get "engine + fuel" for a bit more.

---

# 38 — The IKEA Effect: DGK's Secret Weapon

> **Source:** Norton, Mochon & Ariely (2012), Harvard Business School
> **Why this gets its own file:** This is the single most powerful psychological principle for DGK's business model. "Done With You" literally triggers the IKEA Effect — but you've never weaponised it in sales conversations.

---

## THE RESEARCH

Harvard researchers found that people who assembled IKEA furniture valued it **63% more** than identical pre-assembled furniture. The act of BUILDING something creates emotional ownership that far exceeds the object's actual value.

This extends to everything: food you cooked tastes better than food someone cooked for you. Code you wrote feels more elegant. A garden you planted feels more beautiful.

**The principle:** Effort invested in creation → dramatically increased perceived value and emotional attachment.

---

## WHY THIS IS DGK'S NUCLEAR WEAPON

Every DGK competitor either:
- **Does it FOR the client** (agency model) → Client owns nothing, values nothing, leaves when price matters
- **Gives DIY tools** (courses/templates) → Client builds alone, gets frustrated, quits

DGK does it WITH the client. Which means:
- They invest effort → IKEA Effect activates → they value the system MORE
- They understand how it works → they feel COMPETENT → they trust it
- They own it → they protect it → they don't churn
- They built it → they show it off → they refer others

**This is why DGK clients stay and refer. It's not just good delivery. It's psychology.**

---

## HOW TO USE THE IKEA EFFECT IN SALES CONVERSATIONS

### In Discovery:
"Here's what's different about how we work. Most agencies build the system and run it for you. Which sounds great — until they leave and everything stops. We build it WITH you. You're in every session. You see every step. By the end, you don't just have a system — you understand it, you own it, and frankly, you'll value it a hell of a lot more because you helped create it. There's actually research on this — Harvard found that people value things 63% more when they helped build them. That's the whole reason we designed DGK this way."

### When Handling "Why Not Just Hire an Agency?":
"An agency builds it for you. When they leave, you've got a system you don't understand and can't maintain. We build it WITH you. When we're done, you built it. You get it. You run it. And here's the thing — because you helped build it, you'll actually invest more in keeping it running well. That's not just my opinion — Harvard research shows people value things dramatically more when they participated in creating them."

### When Handling "Can't You Just Do It For Me?":
"I could. But honestly, it wouldn't work as well for you long-term. The clients who get the best results are the ones in the room with me during the build. They understand the system. They spot opportunities I'd miss because they know their business better than anyone. And when we're done, they RUN it confidently. The ones who wanted done-for-you always came back 6 months later needing it rebuilt because they never understood it."

### In Onboarding (File 14):
Involve the client in EVERY step. Don't just show them the finished CRM — build it together. When they see their own hands on the work, the IKEA Effect locks in.

---

## THE IKEA EFFECT IN PRICING

The IKEA Effect also means clients will pay MORE for DWY than DFY — when framed correctly.

**Counterintuitive:** "Wait — they do MORE work and pay the SAME price?"

**The reframe:** "The $8K isn't for me doing less work. It's for the RESULT: a system you understand, own, and can run independently forever. That's worth more than a system someone built that you can't touch when they leave."

**Comparison:**
- Agency (DFY): $3-5K/month × 12 months = $36-60K. You own nothing at the end.
- DGK (DWY): $8K once. You own everything forever. And you VALUE it more because you built it.

---

## TEACHING THIS TO DGK CLIENTS

When clients want to build DWY offers for THEIR customers:
1. Explain the IKEA Effect: "Your customers will value your product more if they're involved in creating it"
2. Find the participation point: where can the customer contribute effort?
3. Frame effort as a FEATURE: "You'll be in the room for every step" = premium positioning
4. Use the Harvard research as proof: "Research shows 63% higher perceived value"

---

# 39 — Insight Selling: The Challenger Approach for DGK

> **Source:** Dixon & Adamson (The Challenger Sale), HBR "The End of Solution Sales" (2012), CEB research on 6,000 sales reps
> **The shift:** Stop asking "what's your problem?" Start saying "here's a problem you don't know you have."

---

## CONSULTATIVE vs. CHALLENGER (The Difference)

**Consultative (What DGK does now — Files 06, 28):**
"Tell me about your business. What challenges are you facing? How does that affect revenue?"
→ You diagnose THEIR known pain. Good. But limited.

**Challenger (What the top 40% of sellers do — HBR research):**
"Based on what I've seen across 20+ businesses your size, there's a problem you probably don't know you have. Your website gets 500 visitors a month but you have zero retargeting. That means 490 people leave and never come back. That's $50K+ in annual revenue walking out the door."
→ You reveal UNKNOWN pain. They didn't know this was a problem. Now they can't unknow it.

**Why Challenger closes more:** Consultative relies on the buyer knowing their problem. But McKinsey found 54% of buyers misdefine their own problem. The seller who TEACHES wins.

---

## THE 3-STEP CHALLENGER FRAMEWORK FOR DGK

### Step 1 — The Warmer (Build Credibility)
Start with something they'd agree with. Establish shared reality.

"Most B2B businesses in Australia get 70-80% of their clients from referrals. Sound about right?"
[They nod]

### Step 2 — The Reframe (Introduce Unknown Pain)
Challenge their assumption. Show them something they didn't see.

"Here's what most founders miss though. Referrals feel free — but they're actually the most EXPENSIVE lead source you have. Because every referral you rely on has an opportunity cost. While you're waiting for someone to mention your name, your competitor is reaching 200 prospects a week with a system. They're not better than you. They just built the engine."

### Step 3 — The Rational Drowning (Quantify the Unknown Pain)
Make the new pain UNDENIABLE with numbers.

"Let me put a number on it. If outbound could generate even 4 extra clients per month at your average deal size, that's $40K/month you're leaving on the table. Over a year, $480K. Not because you're doing anything wrong — but because you're relying on a channel you can't control or scale."

### Then Connect to DGK's Solution:
"That's exactly what we fix. The Foundation build gives you a system that doesn't depend on who you know."

---

## 5 DGK INSIGHT BOMBS (Use on Calls)

### Insight 1: "Your Website Is a Leaking Bucket"
"You're getting 300-500 visitors a month but you have no retargeting pixel, no lead capture form above the fold, and no automated follow-up. That means 95% of interested people leave and never come back. You're paying for traffic (through SEO or content) and catching almost none of it."

### Insight 2: "Your Best Clients Are Being Poached Right Now"
"Your competitors are running outbound to your exact ICP. Every week that passes without a system, they're reaching YOUR ideal clients before you do. You can't see it because it's happening in their inbox, not yours."

### Insight 3: "Referrals Are a Trap"
"Referrals feel great when they come in. But here's the trap: you can't control volume, timing, or quality. One month you get 5, next month you get zero. That unpredictability means you can't hire confidently, can't forecast revenue, and can't grow intentionally. Referrals aren't a strategy — they're a side effect of good work. You need both."

### Insight 4: "You're Training Your Brain to Rely on Hustle"
"Every time you personally land a client through networking, your brain reinforces 'I need to hustle harder.' That's a neural pathway that caps your growth at your personal bandwidth. A system breaks that pattern because results happen WITHOUT your direct effort."

### Insight 5: "The Agency Model Is Designed to Keep You Dependent"
"Agencies charge monthly because their model depends on you NEEDING them every month. If they built you something you could run yourself, they'd lose the retainer. That's not malicious — it's just their business model. It's also why most businesses leave agencies with nothing to show for $30-50K spent."

---

## ADAPTING FOR DGK CLIENTS

Teach clients to build their own insight bombs:
1. What does your customer THINK their problem is?
2. What is their ACTUAL problem (that they can't see)?
3. What data or story proves the hidden problem is real?
4. How does YOUR solution fix the real problem?

The formula: "Most [prospects] think the problem is [surface]. But the real issue is [hidden]. Here's proof: [data/story]. That's what we fix."

---

# 42 — Choice Architecture: Designing Decisions Before They're Made

> **Source:** Thaler & Sunstein (Nudge, Nobel Prize 2017), HBR, Behavioral Economics
> **The insight:** People don't make decisions in a vacuum. The WAY choices are structured determines WHAT people choose — before they even start evaluating.

---

## THE 5 PRINCIPLES OF CHOICE ARCHITECTURE

### 1 — The Default Effect
People overwhelmingly stick with the default option. Whatever you present as the "standard" or "recommended" path, most people will choose it.

**DGK application:** In your 3-tier pricing, explicitly label Tier 2 as "★ RECOMMENDED" or "Most Popular." Say: "Most clients in your situation go with the middle option." That's now the default.

### 2 — The Decoy Effect
Adding a strategically inferior option makes the target option look better by comparison.

**DGK application:**
- Tier 1 ($5K) = Foundation only (no outbound, no leads — just the engine)
- Tier 2 ($10K) = Foundation + Outbound (engine + fuel — leads by week 8) ★
- Tier 3 ($18K) = Full system (engine + fuel + content + ads)

Tier 1 is the decoy. It's close enough to Tier 2 in price that Tier 2 feels like obviously better value. "Why would I pay $5K for just the engine when $10K gets me the engine AND leads?"

### 3 — The Paradox of Choice
More options = more paralysis = more "no decision." Psychologist Barry Schwartz found that when people face too many choices, they choose nothing.

**DGK application:** NEVER present more than 3 options. If you have 7 services, group them into 3 tiers. On your website, one CTA per page. In DMs, one question at a time. In proposals, 3 options max.

### 4 — The Framing Effect
Same information, different frame, different decision.

**DGK examples:**
- "Save $15K/month" vs "Stop losing $15K/month" → Loss frame is stronger (loss aversion)
- "$667/week" vs "$8,000" → Smaller units feel smaller
- "92% of clients see results by week 8" vs "8% don't see results by week 8" → Same stat, different impact
- "No lock-in" (negative frame) vs "You own everything" (positive frame) → Use BOTH

### 5 — The Order Effect (Primacy & Recency)
People remember the FIRST thing and the LAST thing. Everything in the middle gets forgotten.

**DGK application:**
- On calls: Start with the strongest insight. End with the strongest CTA. The middle is for discovery.
- In proposals: First bullet = biggest result. Last bullet = most emotional benefit. Middle = details.
- In 3-tier pricing: Present Tier 3 FIRST (anchoring), Tier 2 SECOND (the contrast feels good), Tier 1 LAST (the safety net).

---

## DESIGNING THE DGK DECISION

Before every close, structure the choice:

1. **Anchor high** (Tier 3 / cost of inaction)
2. **Present the recommended path** (Tier 2, explicitly labelled)
3. **Offer the safety net** (Tier 1 / wedge)
4. **Frame as loss** ("Every month without this = $15K lost")
5. **Remove complexity** (one clear next step: "Want me to send the agreement?")

The prospect should feel like choosing Tier 2 is the OBVIOUS, EASY, SAFE decision. That's not manipulation — that's good architecture.

---

# 43 — Decision Fatigue & The Buyer's Paradox

> **Source:** Baumeister (2011), HBR, Gartner — 60% of B2B deals lost to "no decision"
> **The insight:** Your #1 competitor isn't another agency. It's the buyer's inability to decide. Decision fatigue is why deals die in the "thinking about it" phase.

---

## THE SCIENCE

Every decision depletes mental energy. By the end of a busy day, a person's ability to make good decisions is physically impaired. Judges grant parole 65% of the time in the morning and nearly 0% by late afternoon (Danziger et al., 2011). Same prisoners. Same judges. Different time of day.

**For sales:** If your prospect is evaluating your proposal at 4pm after a day of back-to-back meetings, they don't have the mental energy to say "yes." The default under fatigue = do nothing.

---

## HOW DECISION FATIGUE KILLS DGK DEALS

1. **Too many options in the proposal** → They can't compare → Delay
2. **Too much information in the DM** → Cognitive overload → Ignore
3. **Too many steps to say yes** → Each step costs energy → Drop off
4. **Call scheduled at end of day** → Low willpower → "Let me think about it"
5. **Prospect evaluating 3+ vendors** → Comparison fatigue → Choose nobody

---

## 7 TACTICS TO BEAT DECISION FATIGUE

### 1 — Book Calls in the Morning
Schedule discovery calls between 9-11 AM in the prospect's timezone. Their decision-making capacity is highest. Avoid Friday afternoons and late-day slots.

### 2 — Reduce Steps to Yes
DGK current path: DM → reply → more DMs → book call → discovery → proposal → sign → pay
Better: DM → reply → book call → discovery + close on same call → sign + pay same day

Every step you remove increases conversion. Can you close on Call 1? Can you collect payment during the call?

### 3 — Make the Default Action "Yes"
Instead of: "Let me know what you think" (requires them to initiate)
Say: "I'll send the agreement at 3pm and follow up tomorrow at 10. If anything changes, just let me know." (Default = it's happening unless they stop it)

### 4 — One Decision at a Time
Don't ask them to choose the tier, the start date, the payment plan, AND sign the agreement in the same moment. Sequence it:
1. "Which tier makes sense?" [They choose]
2. "When would you want to start?" [They answer]
3. "I'll send the agreement now." [They sign]

### 5 — Remove Comparison from the Equation
If they're comparing you to competitors: "I know you're evaluating a few options. Let me make this simple — here's the one question that matters: at the end of the engagement, do you own the system or not? That's the difference."

Reduce their evaluation to ONE criterion where you win.

### 6 — Use "If... Then" Micro-Agreements
Instead of asking for a big decision, get small conditional agreements that chain together:
- "IF the numbers work, THEN would you want to start this month?"
- "IF I can show you how IT Together got 6 leads in 60 days, THEN would it be worth a deeper conversation?"

Each "yes" is a micro-decision that costs almost no energy.

### 7 — Give Them Permission to Decide
Sometimes people need PERMISSION. They want to say yes but feel like they should "sleep on it" because that's what responsible adults do.

"Look — you've done the research. You've seen the proof. You know the cost of waiting. If your gut says this is right, trust it. I've seen too many business owners delay by 6 months and regret it."

---

# 44 — Emotional Contagion: Your State Becomes Their State

> **Source:** Barsade (2002, HBR), Hatfield et al. (Emotional Contagion, 1994), Mirror Neuron research
> **The insight:** Emotions are literally contagious. Your prospect's brain MIRRORS your emotional state through facial expressions, vocal tone, and body language — unconsciously, in milliseconds. If you're calm and confident, they feel safe. If you're anxious, they feel uncertain.

---

## THE SCIENCE

Mirror neurons fire both when you PERFORM an action and when you WATCH someone else perform it. When you smile, the person watching unconsciously activates the same neural pathways. They don't decide to feel what you feel — their brain does it automatically.

**Barsade (HBR):** In controlled experiments, a single person's emotional state measurably shifted the mood of an entire group — and the group didn't know it was happening.

**For sales:** You are not just presenting information. You are BROADCASTING an emotional signal. Your prospect's buying decision is partially determined by the emotional state YOUR presence creates in them.

---

## THE 4 EMOTIONAL STATES AND WHAT THEY TRANSMIT

### State 1: Anxiety / Neediness
**What the prospect feels:** "Something is off. This person needs my money. I should be careful."
**Signs you're in this state:** Talking fast, filling silences, over-explaining, qualifying yourself, saying "does that make sense?"
**Result:** They pull away. They want to "think about it."

### State 2: Over-Enthusiasm
**What the prospect feels:** "This person is trying too hard. What are they hiding?"
**Signs:** Too many exclamation marks. Nodding too much. "That's AMAZING!" Upward inflection.
**Result:** They doubt your competence. Enthusiasm signals inexperience (File 07, Maxim 3).

### State 3: Detached / Bored
**What the prospect feels:** "This person doesn't care about my business."
**Signs:** Flat tone. Looking away. Minimal engagement. Robotic responses.
**Result:** No connection. No trust. Dead deal.

### State 4: Calm Confidence ⭐ (THE TARGET STATE)
**What the prospect feels:** "This person has done this before. I'm in good hands. I feel safe."
**Signs:** Steady voice. Measured pace. Comfortable silences. Grounded body language. Occasional warmth and humor.
**Result:** They relax. They open up. They trust. They buy.

---

## HOW TO ENTER CALM CONFIDENCE BEFORE EVERY CALL

### The 5-Minute Pre-Call Protocol:
1. **Physiology first (2 min):** Stand up. Shoulders back. Deep breath — 4 seconds in, 7 hold, 8 out. Smile for 10 seconds (forces your brain into a positive state).
2. **Visualise success (1 min):** Picture your best-ever sales call. Feel that confidence. Carry it.
3. **Reframe the stakes (1 min):** "This is ONE conversation. If it goes well, great. If not, I have 200 more prospects this month. Nothing rides on this single call."
4. **The identity question (30 sec):** "How would someone who is financially comfortable and not intimidated by anyone act right now?" BE that person.
5. **Power phrase (30 sec):** "I am the prize. They need what I have. Let's see if they qualify."

### During the Call:
- **Speak 10% slower than feels natural.** Slow = confident. Fast = anxious.
- **Lower your vocal pitch slightly.** Deep voice = authority. High pitch = nervousness.
- **Pause after key statements.** Let the words land. Don't fill the silence.
- **Match their energy +1 notch.** They're at 4/10? You're at 5/10. Not 9/10.

---

## THE CONTAGION CHAIN IN A DGK SALE

**Your calm confidence** → Prospect feels safe → They open up in discovery → Better pain uncovering → Stronger close → Higher close rate → More results → More conviction → Even more calm confidence

**Your anxiety** → Prospect feels uncertain → They hold back in discovery → Shallow pain → Weak close → Lost deal → Lower conviction → Even more anxiety

**The chain is self-reinforcing.** Emotional state isn't just a nice-to-have — it's the ENGINE of your sales performance.

---

## ADAPTING FOR CLIENTS

When coaching DGK clients on sales calls:
1. Record their calls (with permission). Listen for vocal tone, pace, and energy.
2. Ask: "What emotional state were you in during that call?"
3. Teach the 5-minute pre-call protocol
4. Simple rule: "If you wouldn't buy from yourself in that state, your prospect won't either."

---

# 45 — The Consistency Principle: Engineering Public Commitments

> **Source:** Cialdini (Influence, 1984), Festinger (Cognitive Dissonance, 1957), HBR
> **The insight:** Once someone makes a public statement, they feel psychologically COMPELLED to act consistently with it. You can engineer these micro-commitments throughout the sales process.

---

## THE SCIENCE

Cognitive dissonance: when your actions contradict your beliefs, your brain experiences discomfort and works to resolve it — usually by changing behavior to match the stated belief.

**Classic study (Freedman & Fraser, 1966):** People who agreed to put a small sign in their window were 4x more likely to later agree to put a large sign in their yard. The small commitment changed their self-image to "someone who supports this cause" — and the large request was now consistent with that identity.

---

## HOW TO ENGINEER CONSISTENCY IN DGK SALES

### Step 1 — Get Verbal Agreement on the Problem
Early in discovery, get them to SAY the problem out loud.

"So it sounds like the referral dependency is the core issue. Would you agree?"
[They say yes]

Now they've PUBLICLY declared the problem. Walking away from a solution to that problem creates dissonance.

### Step 2 — Get Agreement on the Cost
"And you said that's costing roughly $15-20K per month. Does that sound right?"
[They confirm]

Now they've publicly quantified their loss. Choosing to keep losing that money contradicts their stated concern.

### Step 3 — Get Agreement on the Solution Criteria
"If a system could generate 5-6 qualified leads per month, own it completely, no lock-in — would that solve the problem?"
[They say yes]

They've now described YOUR solution as the answer to THEIR problem — using their own words.

### Step 4 — The Close Becomes Consistent
"Based on everything you've said — the referral dependency is costing $15K+ per month, and a system that generates leads and you own completely would solve it. That's exactly what we build. Want to get started?"

**They can't say no without contradicting THREE things they already publicly agreed to.** That's not manipulation — you genuinely DO solve the problem they described. You just made sure they articulated it before you presented the solution.

---

## 5 CONSISTENCY TRIGGERS FOR DGK

### 1 — The Written Commitment
After discovery, send a recap email: "Just to confirm — here's what you said your main challenges are: [list]. And here's what success looks like: [their words]. Did I capture that right?"

When they reply "yes" to that email, they've now committed IN WRITING. That written commitment is even more powerful than verbal.

### 2 — The Public Commitment
If they mentioned the problem in front of their team: "You mentioned in front of Sarah and Marcus that the referral thing is a problem. Have they noticed it too?"

Involving witnesses makes the commitment social. Backing away now means looking inconsistent in front of their own team.

### 3 — The Identity Commitment
Link the purchase to their IDENTITY, not just their business.

"You struck me as someone who doesn't leave problems unsolved. Most founders I talk to know they need this but keep putting it off. You seem different — you're actually doing something about it."

Now "buying" is consistent with being a decisive, action-taking founder. "Not buying" means they're like everyone else who procrastinates.

### 4 — The Small-to-Large Chain
Each micro-commitment makes the next one easier:
- "Would you agree that referral dependency is a risk?" (tiny)
- "Would it be worth exploring a solution?" (small)
- "Would you be open to a quick call?" (medium)
- "Does this scope look right for your business?" (large)
- "Want to get started?" (close)

Each "yes" reinforces the identity: "I'm someone who's moving forward on this."

### 5 — The Calendar Commitment
When they book a call, they've made a COMMITMENT. Reference it: "You booked this call because something about the referral problem resonated. What was it?"

Now they have to explain WHY they took action — which reinforces their own motivation.

---

# 46 — The Messenger Effect: WHO You Are Determines WHAT They Hear

> **Source:** McKinsey, Cialdini (Pre-Suasion, 2016), HBR, Harvard Social Identity research
> **The insight:** The same message from a perceived PEER lands completely differently than from a perceived VENDOR. Positioning yourself as an advisor/peer rather than a salesperson changes everything — before you say a single word about your product.

---

## THE RESEARCH

McKinsey: "WHO delivers the message affects reception as much as the message itself."

HBR (2023): 82% of B2B buyers prioritise credibility over likability. 54% said they don't need to LIKE the salesperson — but they absolutely need to TRUST their expertise.

Cialdini (Pre-Suasion): What happens BEFORE the message determines how the message is received. The messenger's perceived identity is the most powerful pre-suasive factor.

---

## THE 4 MESSENGER POSITIONS (Ranked by Influence)

### Position 1: The Vendor (Lowest Influence)
**How the prospect sees you:** "Someone trying to sell me something."
**Signals:** You talk about your product. You pitch early. Your LinkedIn says "Sales" or "Business Development."
**Result:** Everything you say is filtered through skepticism.

### Position 2: The Expert (Medium Influence)
**How they see you:** "Someone who knows their stuff."
**Signals:** You demonstrate knowledge. You drop data. You use industry terminology.
**Result:** They respect your competence but still feel you have an agenda.

### Position 3: The Advisor/Peer (High Influence)
**How they see you:** "Someone like me who understands my world and wants to help."
**Signals:** You've been where they are. You share insights, not pitches. You disqualify yourself. You recommend alternatives (even competitors).
**Result:** They drop their guard. They share real information. They trust your recommendations.

### Position 4: The Authority Peer (Highest Influence)
**How they see you:** "Someone who's been where I am, succeeded, and is now guiding others from a position of strength."
**Signals:** Combination of peer relatability + demonstrated authority + genuine care + outcome independence.
**Result:** They follow your lead. They implement your suggestions. They refer others to you.

**DGK's target: Position 4.** Dilip IS a business owner who built systems for his own business first (peer). He's now helped 20+ others do the same (authority). And he genuinely doesn't need any single deal (outcome independent).

---

## HOW TO SHIFT FROM VENDOR TO AUTHORITY PEER

### 1 — Lead With Insight, Not Product
- Vendor: "We build growth systems for B2B businesses."
- Authority Peer: "Most B2B businesses in Australia are one referral drought away from a bad quarter. I've seen it happen to 15 businesses this year alone."

### 2 — Share Your Own Journey
- Vendor: "We've helped 20+ businesses."
- Authority Peer: "I was in the exact same position 3 years ago. Referral-dependent, couldn't predict revenue, couldn't take a holiday. I built the system for my own business first. Then I started building it for others."

### 3 — Recommend Against Your Interest
- Vendor: "You should definitely do Foundation + Outbound."
- Authority Peer: "Honestly? Based on where you're at, I'd start with just the Foundation. You don't need Outbound yet. Let's get the basics right first and see where things stand in 8 weeks."

This counterintuitive move MASSIVELY increases trust. A vendor who recommends LESS = not a vendor.

### 4 — Use "We" and "Us" Language
- Vendor: "I'll build you a system."
- Authority Peer: "We'll build this together. By week 12, you'll run it better than I do."

### 5 — Never Pitch First
- Vendor: Opens with what they sell.
- Authority Peer: Opens with an observation about the prospect's business. Asks questions. Shares insights. Only presents a solution when the prospect is ready to hear it.

---

## THE MESSENGER POSITIONING CHECKLIST

Before every interaction, check:
- [ ] Am I leading with insight or product? (Insight = peer. Product = vendor.)
- [ ] Am I sharing my own experience? (Personal story = relatable. Corporate pitch = distant.)
- [ ] Am I willing to recommend less? (Saying "you don't need that yet" = massive trust.)
- [ ] Am I asking more than telling? (Advisors ask. Vendors tell.)
- [ ] Am I outcome independent? (If I NEED this deal, I'm a vendor. If I'm exploring fit, I'm an advisor.)
- [ ] Does my LinkedIn profile say "advisor" or "salesperson"? (Words matter.)

---

## THE DGK MESSENGER IDENTITY STATEMENT

Use this to open calls, DMs, and proposals:

"I built this system for my own business first — because I was dealing with the same referral dependency most B2B founders face. Once it worked for me, I started building it with other business owners. 20+ so far across IT, NDIS, trades, and professional services. The model is simple: we build it together, you own it, and when we're done you run it independently. I'm not an agency and I'm not a consultant. I'm a business owner who figured out the system and now helps other business owners build theirs."

**Why this works:**
- "I built this for my own business first" = peer, not vendor
- "Same referral dependency" = I understand your world
- "20+ so far" = proven authority
- "We build it together, you own it" = advisor, not salesperson
- "I'm a business owner" = identity alignment

---




---

## File: `references/07-clients-and-growth.md`

# Clients: Onboarding, Retention, Upsell, Referrals, Committees, Crisis

> DGK Sales Knowledge Base — reference file. Source files listed below.

## Contents
- 14 POST SALE AND ONBOARDING
- 19 CLIENT RETENTION
- 29 UPSELLING AND EXPANSION
- 24 REFERRAL AND PARTNERSHIPS
- 34 HARVESTING SOCIAL PROOF
- 41 BUYING COMMITTEE NAVIGATION
- 25 CRISIS MANAGEMENT

---

# 14 — Post-Sale & Onboarding: The First 48 Hours

> **For:** DGK team managing the transition from "they said yes" to "they're a happy client"
> **The gap this fills:** Most sales training stops at the close. But buyer's remorse kills deals within 48 hours. This file prevents that.

---

## WHY THE FIRST 48 HOURS MATTER MORE THAN THE SALE

The moment someone says yes, a clock starts. In their head:
- "Did I make the right decision?" (doubt creeps in)
- "Was I pressured?" (they reconstruct the conversation)
- "What will my partner/team think?" (social validation anxiety)
- "Is there something cheaper?" (post-decision comparison shopping)

**Your job in the first 48 hours:** Make them feel SO confident in their decision that when doubt whispers, the answer is already "yes, this was right."

---

## THE DGK 48-HOUR ONBOARDING SEQUENCE

### Hour 0 — The "Welcome" Message (Within 10 Minutes of Close)

Send a personal DM or text — NOT a corporate welcome email.

**Script (DM):** "Hey NAME — really excited to get this rolling. You made a great call. I'll send the onboarding details over shortly but just wanted to say welcome to DGK. Let's build something solid."

**Why:** This is the warmest moment in the relationship. Capitalize on it. A human message within 10 minutes locks in the positive feeling.

### Hour 1 — Onboarding Email

Subject: "Welcome to DGK — here's what happens next"

Include:
1. **Confirm what they bought** (scope, timeline, deliverables — in plain English)
2. **First session date + time** (already booked during the call if possible)
3. **What to prepare** (login access, branding assets, current client list — keep it simple)
4. **What to expect in week 1** (specific, not vague)
5. **Your direct contact** (mobile number + DM — they should feel they can reach you)

**Key line:** "No jargon, no mystery. Here's exactly what happens, when, and what you'll have at the end."

### Hour 24 — The "Confirmation" Check-In

**Script (text or DM):** "Hey NAME — just making sure the onboarding email landed. Any questions before we kick off? Excited to get started."

**Why:** This does two things. First, it catches any buyer's remorse early. If they're having second thoughts, you'll hear it here — and you can address it BEFORE they ghost you. Second, it makes them feel cared for.

### Hour 48 — Share a Quick Win

Before the first session, send them something valuable that makes them feel the investment is already paying off.

**DGK examples:**
- "Ran a quick check on your website. Found 3 things we'll fix in week 1 — here's a preview."
- "Had a look at your domain health. Your primary domain is clean but you've got no sending infrastructure — we'll sort that first."
- "Pulled a snapshot of your competitors' outbound setup. Interesting findings — I'll walk you through them in our first session."

**Why:** This is the Trojan Horse principle applied post-sale. The quick win validates their purchase decision. They think "it's only been 2 days and I'm already getting value."

---

## SETTING EXPECTATIONS (Preventing Future Problems)

### The Expectation Script (Deliver in Session 1):
"Before we dive in, I want to be really transparent about how this works. We're building this system together. That means I need you in the room for these sessions — not just your VA or team member. The system only works if the person running the business understands it. In return, I commit to delivering everything on time, explaining things clearly, and making sure you can run this independently when we're done. Deal?"

### What to Cover:
- **Communication:** "I'm available on [channels]. Response time is [timeframe]."
- **Sessions:** "We meet [frequency] for [duration]. Please be on time — I'll do the same."
- **Homework:** "Between sessions there'll be small tasks — logins, approvals, content reviews. Delays on your side = delays in the timeline."
- **Timeline:** "We'll hit [milestone 1] by week [X], [milestone 2] by week [Y], and full handover by week [Z]."
- **What success looks like:** "At the end you'll have [specific deliverables] running independently. You own all of it."

---

## PREVENTING BUYER'S REMORSE

### The 3 Triggers and How to Counter Them:

**Trigger 1: "Was it worth the money?"**
Counter: Show ROI math early. "Based on your average client value, you only need [X] new clients to pay off the entire build."

**Trigger 2: "My partner thinks it was too expensive"**
Counter: In the onboarding email, include a 1-paragraph summary specifically written for the partner/spouse: "Hi [partner name] — just a quick note. [Client] and I are working together to build a growth system for the business. The goal is [specific outcome] within [timeline]. Here's what that looks like in numbers: [ROI projection]."

**Trigger 3: "The competitor's offer looks better now"**
Counter: Reinforce the DGK differentiator in every early interaction: "Remember — at the end of this you OWN everything. No retainer. No lock-in. That's worth more than any monthly agency fee."

---

## THE HANDOFF TO DELIVERY

If someone other than Dilip is delivering:

1. **Warm introduction:** Dilip introduces the delivery person on a 3-way call or DM. "NAME, meet [delivery person] — they'll be running your build sessions. I'm still overseeing everything and you can reach me anytime."
2. **Context transfer:** Deliver person gets: discovery call notes, PICS chart, what the client said in their own words, their personality/communication style, and any specific concerns raised during the sale.
3. **Dilip checks in at Day 7:** "Hey NAME — how's the first week going? Everything tracking?"

**Rule:** The client should never feel "sold and forgotten." The person who built the relationship stays visible.

---

## BUILDING TOWARD UPSELLS (Seeds, Not Pitches)

Don't pitch upsells during onboarding. But plant seeds:

**Week 2:** "By the way, once the Foundation is solid, outbound sequences are the logical next step. We'll talk about it when the time is right — but just know that option is there."

**Week 6:** "Your CRM is looking clean. The clients who see the biggest results are the ones who layer Outbound or Content on top. Want me to scope what that would look like for you? No pressure — just for your planning."

**At handover:** "Everything is built and running. There are two paths from here: you run it yourself (which you're fully capable of), or we add Outbound/Content and keep scaling together. Let me know whenever you want to explore that."

**Rule:** Seeds, not pitches. The best upsell is a client who says "what else can you do for me?" — not one who gets pitched on day 3.

---

# 19 — Client Retention & Churn Prevention

> **For:** DGK team keeping clients long-term + DGK clients reducing their own churn
> **Why:** Acquiring a new client costs 5-7x more than keeping an existing one. A 5% reduction in churn can double LTV (Hormozi: Price ÷ Churn = LTV).

---

## THE CLIENT HEALTH SCORE

Rate every active client monthly on 5 factors (1-5 each, max 25):

| Factor | Score 1-5 | What to assess |
|---|---|---|
| Engagement | _/5 | Do they attend sessions? Respond to messages? Complete homework? |
| Results | _/5 | Are they seeing leads/enquiries/pipeline growth? |
| Satisfaction | _/5 | Have they expressed happiness? Or complaints? |
| Usage | _/5 | Are they using the CRM, checking dashboards, running the system? |
| Growth potential | _/5 | Is there an upsell opportunity? Are they outgrowing current scope? |

**20-25: Healthy** — Keep doing what you're doing. Ask for referral + testimonial.
**15-19: Watch** — Proactive check-in. Find what's slipping. Fix it before they complain.
**10-14: At Risk** — Immediate intervention. Call the client. Diagnose the issue.
**Below 10: Critical** — You're about to lose them. Escalate to Dilip.

---

## THE 5 CHURN TRIGGERS (And How to Prevent Each)

### Trigger 1: "I'm not seeing results"
**Prevention:** Set clear success metrics in onboarding (File 14). Share progress reports monthly with THEIR numbers. Don't wait for them to ask — show them proactively.
**Recovery:** "Let me pull the data and walk you through what's working and where we need to adjust. Can we jump on a 15-min call Thursday?"

### Trigger 2: "I don't feel like a priority"
**Prevention:** Respond to client messages within 4 hours during business hours. Never let a client feel forgotten between sessions.
**Recovery:** "You're right — I should've been more proactive here. Let me fix that. Here's what I've been working on behind the scenes for your account: [specific update]."

### Trigger 3: "I could do this cheaper myself now"
**Prevention:** Continuously demonstrate the value of the SYSTEM, not just the setup. Show what would break if they tried to run it without support.
**Recovery:** "You could absolutely take it from here. Let me make sure the handoff is clean and you've got SOPs for everything. Want me to do a final session where I document the whole process?"

### Trigger 4: "The scope keeps growing but I'm paying the same"
**Prevention:** Define scope clearly at the start (File 14). When they ask for extras, say "Absolutely — that falls outside the current scope. Want me to quote that as an add-on?"
**Recovery:** Acknowledge, apologise if scope was unclear, and re-scope with a change order.

### Trigger 5: "Something changed in my business"
**Prevention:** You can't prevent external changes (funding cut, partner left, pivot). But you CAN check in regularly to catch changes early.
**Recovery:** "I get it — priorities shift. Let's pause the build and pick it back up when the timing's right. Everything we've built so far is yours."

---

## THE QUARTERLY BUSINESS REVIEW (QBR)

For retainer clients, run a QBR every 90 days:

**Agenda (30 minutes):**
1. **Results review (10 min):** Share metrics — leads generated, pipeline value, cost per lead, system usage. Use THEIR dashboard.
2. **What's working (5 min):** Celebrate wins. Specific examples.
3. **What needs improvement (5 min):** Be honest. Don't hide problems.
4. **Next quarter plan (5 min):** What you'll focus on. What changes.
5. **Growth conversation (5 min):** "Based on what we're seeing, the logical next step would be [upsell]. Want me to scope it out?"

**Rule:** QBRs are NOT sales calls. They're VALUE calls. But the upsell conversation happens naturally when results are strong.

---

## ADAPTING FOR DGK CLIENTS

Teach clients to:
1. Score their own customers monthly (health score above)
2. Run QBRs with their top 10 clients
3. Build an early warning system: if a client misses 2 sessions or stops replying, flag immediately
4. Calculate their churn: clients lost ÷ total clients at start of month = churn %
5. Set a churn target: below 5%/month for services, below 10% for products

---

# 29 — Upselling & Expansion: Growing Existing Clients

> **For:** DGK team turning $5K clients into $15K+ clients
> **Why:** Selling to an existing happy client is 5-7x easier than winning a new one. Close rate on upsells: 60-70% vs. 20-30% for new deals.

---

## THE 3 UPSELL WINDOWS

### Window 1 — The Results Window (Day 30-60)
**Trigger:** Client hits their first milestone. Leads coming in. CRM working. They're excited.
**Script:** "Results are tracking well. Most clients at this stage start thinking about layering Outbound on top of the Foundation. Want me to scope what that would look like for your business? No rush — just wanted to flag the option."

### Window 2 — The Capacity Window (Day 60-90 / QBR)
**Trigger:** System is working. They're seeing ROI. They have capacity to invest more.
**Script:** "Based on your numbers, you're getting $X in pipeline from the Foundation alone. If we added Content across 6 platforms, that compounds — your brand builds while outbound fills the pipeline. Most clients who add Content see a 30-40% lift within 90 days."

### Window 3 — The Organic Ask (Anytime)
**Trigger:** Client says "can you also help with...?" — they're asking YOU to upsell them.
**Script:** "Yeah absolutely we can do that. Let me put together a quick scope and we'll add it in. I'll send it over today."

**Rule:** Never pitch an upsell when results are bad. Fix the current deliverable first. Upselling a frustrated client = losing a client.

---

## DGK UPSELL PATHS

| Currently on | Natural upsell | Script |
|---|---|---|
| Foundation only | + Outbound | "Your CRM is clean and tracking is live. The next step is putting fuel in the engine — outbound sequences that fill your pipeline." |
| Foundation + Outbound | + Content | "Outbound is booking calls. Content would compound that — builds brand while you sleep. Most clients add it at this stage." |
| Foundation + Content | + Outbound | "Your brand is building. Now let's add direct outreach to accelerate pipeline while content works in the background." |
| Any combination | + LinkedIn Ads | "You've got the organic engine running. Paid ads would amplify everything — retarget website visitors, boost posts, drive to the booking page." |
| Project-based | Monthly retainer | "Everything's built and running. The question is — do you want to run it yourself, or do you want us to manage it monthly so you stay focused on delivery?" |

---

## THE EXPANSION CONVERSATION STRUCTURE

1. **Acknowledge results:** "The system is performing well. You're at X leads/month now."
2. **Plant the seed:** "Most clients at your stage start thinking about [next phase]."
3. **Connect to their stated goal:** "You mentioned wanting to hit $Y revenue by Q4. Adding [upsell] is how we get there."
4. **Low-pressure CTA:** "Want me to put together a quick scope? No obligation — just so you can see what it would look like."
5. **Let them decide:** Don't push. If the results are good, the upsell sells itself.

**Rule:** The upsell should feel like a NATURAL NEXT STEP, not a surprise pitch. If you've been seeding (File 14), they're expecting this conversation.

---

# 24 — Referral & Partnership Ecosystem

> **For:** DGK building a referral machine + DGK clients creating their own referral networks
> **Why:** Referral leads close at 50-70% (vs. 5-15% for cold outreach). One good partnership can be worth more than 1,000 cold DMs.

---

## DGK'S 3-TIER REFERRAL SYSTEM

### Tier 1 — Client Referrals (Easiest, Highest Quality)
**When to ask:** After a milestone result (not before). The moment a client says "wow" or shares a positive number.

**Script:** "Glad the system is working. Quick question — do you know 2-3 other [industry] business owners who might be dealing with the same referral-dependency problem? Happy to help them out."

**Make it specific:** Don't ask "who do you know?" — too broad. Ask "do you know any IT business owners in Sydney who are frustrated with unpredictable pipeline?"

**Systematise it:** Ask at these touchpoints:
- Day 30 (first result)
- Day 60 (system running)
- Day 90 (handover / QBR)
- Every QBR for retainer clients

**Incentive (optional):** "By the way, anyone you refer who comes on board — I'll give you $500 off your next project." Or offer a free month of retainer. Something tangible.

### Tier 2 — Strategic Partnerships (High Volume, Ongoing)
**Who to partner with:** Professionals who serve the same ICP but don't compete with DGK.

| Partner Type | Why They Refer to DGK | What DGK Refers to Them |
|---|---|---|
| Accountants/Bookkeepers | Their clients need marketing systems | DGK clients need tax/financial help |
| Business coaches | Clients need execution, not just strategy | DGK clients need strategic guidance |
| Web designers (non-marketing) | They build sites but don't do outbound/CRM | DGK clients who need design-heavy work |
| IT managed services | Their clients need lead gen | DGK IT/MSP clients who need IT support |
| HR/recruitment firms | They see businesses hiring (= growth signal) | DGK clients who need hiring support |
| Industry associations | They have member directories | DGK provides value to their members |

**How to approach a potential partner:**
"Hey NAME — I run DGK, we build growth systems for B2B businesses. I keep meeting [their type of client] who need [what the partner does]. Wondering if it'd make sense to set up a referral exchange — I send clients your way, you send them mine. No formal agreement needed, just a mutual thing. Worth a coffee?"

**Formalise over time:**
- Start informal (just introduce clients to each other)
- If it works, agree on a referral fee (10-20% of first deal)
- Track referrals in CRM (tag source as "Partner: [name]")
- Quarterly catch-up to share pipeline and keep the relationship warm

### Tier 3 — Referral Content Engine
**What it is:** Create content that generates referrals passively.

- Write LinkedIn posts featuring partner businesses (they share it → their audience sees DGK)
- Co-host webinars with partners for each other's audiences
- Create free resources that partners can share with their clients: "Here's a guide our friends at DGK put together on outbound for B2B."
- Guest on partner podcasts or invite them on yours

---

## TRACKING REFERRAL ROI

| Metric | How to track |
|---|---|
| Referrals received per month | CRM tag: "Source: Referral - [Partner Name]" |
| Referral close rate | Won deals from referrals ÷ Total referral leads |
| Revenue from referrals | Sum of closed deal values from referral source |
| Top referring partner | Rank partners by deals referred per quarter |
| Cost per referral acquisition | Referral fees paid ÷ Deals closed |

**Target:** 20-30% of new clients should come from referrals/partnerships within 12 months.

---

# 34 — Harvesting Social Proof: Getting Testimonials That Sell

> **For:** DGK team collecting testimonials, reviews, and case studies from clients
> **Why:** Every testimonial you collect multiplies the effectiveness of Files 01-33. Social proof is the fuel for the entire system.

---

## WHEN TO ASK (The 5 Trigger Moments)

### Trigger 1 — The "Wow" Moment
They just saw their first result. They said "wow" or sent an excited message. ASK NOW.
"So glad it's working! Quick favour — would you mind sharing what you just told me as a short testimonial? Even 2-3 sentences would be amazing. I can send you a quick template if that helps."

### Trigger 2 — The Milestone
Day 30, Day 60, Day 90, or project handover.
"We've hit the 60-day mark and your numbers are looking strong. Would you be open to doing a quick 5-minute video call where I ask you 3 questions about the experience? I'll edit it down — you don't need to prep anything."

### Trigger 3 — The Referral Moment
They just referred someone to you. They're already advocating — formalise it.
"By the way — since you're recommending us anyway, would you mind putting something in writing? Even a quick LinkedIn recommendation or a Google review would mean a lot."

### Trigger 4 — The Unprompted Compliment
They message you something positive out of the blue. Screenshot it AND ask if you can share it.
"That means a lot — thank you. Mind if I use this as a testimonial on our site? Happy to keep it anonymous if you prefer."

### Trigger 5 — The QBR
End every Quarterly Business Review with: "Based on everything we've reviewed today, would you feel comfortable sharing your experience? A short testimonial or case study would help other business owners in your situation find us."

---

## 3 FORMATS TO COLLECT

### Format 1 — Written Testimonial (Easiest)
Send them this template:
"Hey NAME — here are 3 questions. Just answer in 2-3 sentences each. I'll tidy it up:
1. What was the situation before working with DGK?
2. What results have you seen?
3. What would you say to someone considering DGK?"

### Format 2 — Video Testimonial (Most Powerful)
Book a 10-minute Zoom. Record it. Ask these questions:
1. "What was your business situation before DGK?"
2. "What specific results have you seen?"
3. "What surprised you about the experience?"
4. "What would you tell someone who's on the fence?"

Edit to 60-90 seconds. Use as LinkedIn content, website hero, and DM social proof.

### Format 3 — Case Study (Most Detailed)
Full 5-part story (File 15 framework):
Character → Struggle → Turning Point → Transformation → Result
Write it yourself based on the data. Send to client for approval.

---

## MAKING IT EASY (Remove All Friction)

- **Don't ask for "a testimonial"** — sounds like work. Say "Would you mind sharing 2-3 sentences about your experience?"
- **Send a template** with starter questions — never make them start from blank
- **Offer to write it for them** — "I can draft something based on our results and you just approve it?"
- **Google Review shortcut** — send them a direct link to your Google review page
- **LinkedIn recommendation** — send the recommendation request directly through LinkedIn

---

## WHERE TO USE SOCIAL PROOF

| Social Proof Type | Where it goes |
|---|---|
| Written testimonial | Website, proposals, DM conversations, email signatures |
| Video testimonial | LinkedIn posts, website hero, pre-call drip emails |
| Case study | DM outreach (Case Study Bridge), discovery calls, LinkedIn content |
| Google review | SEO, local credibility, prospect due diligence |
| LinkedIn recommendation | Profile credibility, connection request acceptance |
| Screenshots of results | DM value bombs, LinkedIn posts, proposals |

---

# 41 — Buying Committee Navigation: Selling When You're Not in the Room

> **Source:** Gartner (2025): Average B2B purchase involves 6-10 decision-makers. Forrester: 73% of B2B purchases involve 3+ departments.
> **The problem:** You sell to ONE person on the call. But the decision happens in a room you're not in.

---

## WHY DGK DEALS DIE IN THE COMMITTEE

Your prospect (the "Champion") loves the idea. They had a great discovery call. They're ready to buy. Then they go to their partner/board/team and say "I found this company called DGK that can help us with marketing" — and the partner says "how much?" and the answer kills it. Not because the price is wrong, but because the Champion couldn't explain the VALUE.

**The rule:** Your Champion can only sell internally as well as YOU equipped them to sell.

---

## THE CHAMPION ENABLEMENT TOOLKIT

### 1 — The 1-Page Summary (Give This to Every Champion)
After every discovery call where there's another decision-maker, send a 1-page document designed for the PERSON WHO WASN'T ON THE CALL.

**Structure:**
- **Line 1:** What DGK does (1 sentence)
- **Line 2:** The problem we solve (in THEIR company's words)
- **Line 3:** The result (specific case study with numbers)
- **Line 4:** The investment + ROI comparison
- **Line 5:** What happens next

**DGK example:**
"DGK builds self-running growth systems for B2B businesses. Based on our conversation, [COMPANY]'s referral dependency is costing approximately $15-20K/month in missed revenue. We helped IT Together (similar size, similar industry) go from 0 to 6 qualified enquiries per month in 60 days. The investment is $10K over 12 weeks — pays for itself in month 1. You own everything when we're done. No lock-in."

### 2 — Anticipate the Committee's Questions
Before the Champion leaves the call, ask: "Who else needs to weigh in? What will THEY want to know?"

Common committee questions and pre-written answers:
- **The CFO/Partner:** "What's the ROI?" → "The system costs $10K. The referral gap costs $180-240K/year."
- **The Operations Person:** "How much of our time does this take?" → "One hour per week for 12 weeks."
- **The Sceptic:** "How do we know it'll work?" → "IT Together went 0→6 in 60 days. Plus we have no lock-in — you own everything regardless."

### 3 — Offer a Committee Call
"Would it help if I jumped on a quick 15-minute call with both of you? That way your partner hears it directly and can ask questions. Usually clears things up faster than a second-hand summary."

### 4 — The "Internal Champion" Script
Teach your Champion how to pitch internally:

"Here's how I'd position this to your partner if I were you: 'I found a company that builds growth systems for businesses like ours. They've done it for 20+ businesses. One similar to us went from zero to 6 enquiries a month in 60 days. It costs $10K once, we own everything, no retainer. I think we should at least have a 15-minute call with them. Worst case, we learn something.'"

---

## FOR DGK CLIENTS

Teach clients with partnership/board structures:
1. Never pitch to the Champion alone if there's a committee
2. Always create a 1-page summary for the absent decision-maker
3. Offer the short committee call proactively
4. Arm the Champion with answers to the 3 most common committee objections

---

# 25 — Crisis Management in Sales: When Things Go Wrong

> **For:** DGK team handling client complaints, delivery issues, and relationship repairs + DGK clients managing their own crises
> **Why:** Things WILL go wrong. The businesses that survive aren't the ones that never make mistakes — they're the ones that recover brilliantly.

---

## THE 5 MOST COMMON CRISES (And How to Handle Each)

### Crisis 1: Delivery Delay
**Situation:** You promised week 8 delivery. It's week 10. Client is frustrated.

**The wrong response:** "Sorry, we've been really busy." (Excuse. Puts yourself first.)

**The right response:**
1. **Own it immediately:** "Hey NAME — I need to be upfront. We're behind schedule on your build. That's on us."
2. **Explain what happened (briefly):** "We hit a technical issue with [specific thing]." (Not excuses — just facts.)
3. **Present the fix:** "Here's exactly what we're doing to get back on track: [specific steps]. New target is [date]."
4. **Offer compensation:** "I want to make this right. I'm adding [specific extra] at no charge for the delay."
5. **Set next check-in:** "I'll update you Friday on where we are. Sound good?"

### Crisis 2: Client Wants to Cancel
**Situation:** Client says "This isn't working. I want out."

**Script:**
"I hear you and I respect that. Before we finalise anything — can I ask what specifically isn't working? I want to understand so I can either fix it or at least learn from it."

Then LISTEN. Don't defend. Don't argue.

If it's fixable: "Here's what I propose. Give me 2 weeks to [specific fix]. If it's still not right after that, we'll part ways cleanly and I'll refund [X]."

If it's not fixable: "I understand. Let me make the handoff as clean as possible. Everything we've built is yours — I'll document the SOPs and do a final walkthrough session so your team can run it."

**Rule:** A graceful exit creates future referrals. A messy exit creates bad reviews.

### Crisis 3: Scope Dispute
**Situation:** Client says "I thought [X] was included" but it wasn't in the scope.

**Script:**
"Let me pull up the scope document so we're looking at the same thing. [Review together.] I can see how that might have been unclear. Here's what I propose: I'll add [X] to the current build for [reduced rate / no charge if it's small]. And let's update the scope document so we're both clear going forward."

**Prevention:** Always have a written scope signed before work starts. Reference it when extras come up.

### Crisis 4: Client Complaint About Quality
**Situation:** "This doesn't look professional" or "The emails aren't getting replies."

**Script:**
"Thank you for flagging that — I take this seriously. Let me review [specific deliverable] today and come back to you with 3 specific improvements by [tomorrow/Friday]. I want to make sure this hits the standard you're expecting."

**Rule:** Don't argue about quality. Fix it. Fast. Then follow up to confirm they're happy.

### Crisis 5: You Made a Mistake (Wrong data, sent to wrong person, etc.)
**Script:**
"Hey NAME — I need to flag something. [What happened]. It's my mistake and I've already [what you did to fix it]. I want to make sure [impact] is minimised. Here's what I'm doing next: [prevention step]. I'm sorry about this."

**Rule:** Own mistakes fast. Don't hide them. Don't minimise. The faster you own it, the faster trust recovers.

---

## THE RECOVERY FRAMEWORK: A.C.T.

**A — Acknowledge** the problem immediately. Don't wait for them to escalate.
**C — Correct** with specific actions and timelines. Not "we'll look into it" — "I'll have this fixed by Friday."
**T — Thank** them for telling you. "I appreciate you flagging this. It helps me improve."

**The paradox:** Clients who experience a problem that gets resolved WELL often become MORE loyal than clients who never had a problem at all. This is called the "service recovery paradox." Brilliant recovery = deeper trust.

---




---

## File: `references/08-operations.md`

# Operations: Pipeline, CRM, Win/Loss, Offer, Brand, Hiring, Resilience

> DGK Sales Knowledge Base — reference file. Source files listed below.

## Contents
- 16 PIPELINE MANAGEMENT
- DGK CRM FIELD STRUCTURE
- 20 WIN LOSS ANALYSIS
- 30 OFFER CREATION
- 40 THE DARK FUNNEL
- 26 SOCIAL SELLING AND PERSONAL BRAND
- 23 HIRING AND COACHING
- 36 SALES RESILIENCE

---

# 16 — Pipeline Management & Daily Operations

> **For:** DGK team managing multiple conversations, tracking deals, and staying consistent
> **The gap this fills:** You can master every framework in Files 01-15, but without a system to manage 50+ conversations at different stages, things slip through the cracks. This file is the operating system for your sales day.

---

## DGK PIPELINE STAGES

Every conversation lives in one of these stages. Move them forward or kill them — never let them sit.

| Stage | Definition | Max Days Here | Action Required |
|---|---|---|---|
| 1. New Lead | Just connected / first DM sent | 7 days | Follow up per File 02 |
| 2. Conversation | Replied, chatting | 14 days | Build rapport, throw rope, qualify |
| 3. Discovery Booked | Call scheduled | Until call | Pre-call prep (File 06) |
| 4. Discovery Done | Call completed, qualifying | 3 days | Send proposal or disqualify |
| 5. Proposal Sent | Scope/agreement sent | 5 days | Follow up within 24hr, then Day 3, Day 5 |
| 6. Negotiation | Discussing terms/pricing | 7 days | Handle per File 13 |
| 7. Closed Won ✓ | Signed + paid | — | Onboard per File 14 |
| 8. Closed Lost ✗ | Dead or disqualified | — | Add to reactivation list (60-day cycle) |
| 9. Nurture | Not now, maybe later | 60-day cycle | Quarterly reactivation (File 09) |

**Rule:** If a deal sits in one stage longer than the max days, it either moves forward or moves to Nurture/Lost. Stale pipeline = false hope.

---

## THE DAILY SALES ROUTINE (2-3 Hours)

### Morning Block: 9:00 - 10:30 AM AEST

**9:00-9:10 — Warm Up (10 min)**
- Read 1 Chad Maxim from File 07
- Review today's booked calls (prep Cold Reads)
- Check LinkedIn notifications (profile views, post engagement)

**9:10-9:30 — Connection Requests (20 min)**
- Send 40 empty requests to hyper-targeted prospects
- Focus on signal-based targets from SEEK/LinkedIn activity

**9:30-10:00 — New DM Openers (30 min)**
- Start conversations with yesterday's new connections
- Use frameworks from File 01 + signals from File 09

**10:00-10:30 — Follow-Ups (30 min)**
- Check Bucket 1 (throw rope) and Bucket 2 (nudge) conversations
- Send 3-5 voice messages to lukewarm prospects
- Use frameworks from File 02

### Afternoon Block: 2:00 - 3:00 PM AEST

**2:00-2:30 — Reply Management (30 min)**
- Respond to all DM replies
- Handle objections (File 04)
- Move conversations forward on the commitment ladder

**2:30-3:00 — Calls + CRM (30 min)**
- Run any scheduled calls (File 06 + 10)
- Update CRM after every call (stage, notes, next action)
- Send proposals for today's closed discoveries

---

## WEEKLY PIPELINE REVIEW (Every Friday, 30 Minutes)

### Step 1: Count Your Pipeline
| Metric | This Week | Target |
|---|---|---|
| Connection requests sent | ___ | 200 |
| New conversations started | ___ | 20-25 |
| Discovery calls booked | ___ | 5-10 |
| Discovery calls completed | ___ | 4-8 |
| Proposals sent | ___ | 2-4 |
| Deals closed | ___ | 1-2 |
| Revenue closed | $___ | Depends on avg deal size |

### Step 2: Diagnose the Bottleneck
If your numbers are off, work backwards:

- **Not enough closes?** → Review call recordings. Are you doing discovery right? (File 06). Are you closing properly? (File 10). Are you qualifying? (File 12).
- **Not enough proposals?** → Are calls converting? Check objection handling (File 04).
- **Not enough calls?** → Check follow-up volume (File 02). Check voice message count (File 01).
- **Not enough replies?** → Check opener quality (File 01). Check signal usage (File 09).
- **Not enough connections?** → Check targeting (File 03). Check acceptance rate checklist.

### Step 3: Clean the Pipeline
- Move stale deals to Nurture or Lost
- Update notes on every active deal
- Set specific next actions for Monday

### Step 4: Plan Next Week
- Which high-value prospects to prioritize?
- Any follow-ups overdue?
- Any reactivation targets (60+ days cold)?

---

## CRM HYGIENE RULES

### Every Deal MUST Have:
1. **Contact info:** Name, company, email, LinkedIn URL
2. **Current stage** (from the 9 stages above)
3. **Last contact date** and last contact method
4. **Next action** with specific date
5. **Notes from every interaction** (what they said, what pain was uncovered)
6. **Lead score** (Green / Yellow / Red)
7. **Deal value** (estimated based on which DGK package fits)

### Weekly CRM Cleanup (15 min every Friday):
- Delete or archive contacts with no activity in 90+ days
- Update all stages to reflect reality
- Make sure every active deal has a scheduled next action
- Flag any deals stuck past the max days for their stage

---

## WHEN TO KILL A DEAL

Kill a deal when:
- They've said "no" explicitly (respect it)
- You've followed up 4+ times with no response AND the deal doesn't justify more effort
- They fail 2+ BANT-F criteria and show no path to qualifying
- Your gut says it's a bad fit (after confirming with logic)
- The deal value doesn't justify the time investment
- They're disrespectful of your time or boundaries

**How to kill it:** Move to Closed Lost + add to 60-day reactivation list. Send the breakup message (File 09, Framework 7). Then genuinely stop.

**Mindset:** Killing a deal isn't failure. It's resource allocation. Every minute on a dead deal is a minute NOT spent on a live one.

---

## METRICS THAT ACTUALLY MATTER

### Lead Indicators (Predict future results):
- Connection requests sent per week
- Conversations started per week
- Voice messages sent per week
- Discovery calls booked per week

### Lag Indicators (Measure past results):
- Close rate (proposals → signed)
- Average deal value
- Revenue per month
- Cost per acquisition

### The One Metric That Rules Them All:
**Calls-to-close percentage** = (Deals closed ÷ Discovery calls completed) × 100

This single number measures your ENTIRE funnel efficiency. If it's below 15%, something is broken upstream. If it's above 25%, you're doing it right.

---

## THE DGK SALES OPERATING RHYTHM

| Cadence | Activity |
|---|---|
| Daily (2-3 hours) | Connection requests, DMs, follow-ups, calls, CRM updates |
| Weekly (Friday 30 min) | Pipeline review, metrics check, bottleneck diagnosis, next week plan |
| Monthly (1 hour) | Reactivation campaign, case study updates, outreach template refresh |
| Quarterly (2 hours) | Full pipeline audit, pricing review, framework assessment, team skill gaps |

---

# DGK CRM Field Structure — GoHighLevel Full Lifecycle

> **For:** DGK's own GoHighLevel CRM
> **Covers:** Prospect → Sale → Delivery → Retention → Upsell → Referral
> **Mapped to:** All 47 knowledge base files — every field exists because a framework needs it

---

## SECTION 1: CONTACT INFORMATION (Standard + Custom)

### Standard GHL Fields (Already Exist)
- First Name
- Last Name
- Email
- Phone
- Company Name
- Website

### Custom Contact Fields

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| LinkedIn URL | Text | URL | DM outreach (File 01), Social Surround (File 09) |
| Job Title | Text | e.g., "Director", "Founder" | Buyer persona matching (File 18) |
| State / Territory | Dropdown | NT, QLD, WA, NSW, VIC, SA, TAS, ACT | Multi-state delivery tracking |
| City | Text | e.g., "Darwin", "Sydney" | Localised outreach |
| Company Size (Staff) | Dropdown | 1-5, 6-10, 11-20, 21-50, 51-100, 100+ | BANT-F qualification (File 12) |
| Industry | Dropdown | IT/MSP, NDIS, Trades, Cleaning, Professional Services, SaaS, Healthcare, Construction, Recruitment, Education, Other | Case study matching (File 15), Persona matching (File 18) |
| Annual Revenue (Est.) | Dropdown | Under $250K, $250K-$500K, $500K-$1M, $1M-$2M, $2M-$5M, $5M+ | BANT-F Budget qualification (File 12) |
| Decision Maker? | Dropdown | Yes - Sole, Yes - With Partner, No - Influencer Only | Authority check (File 12), Committee navigation (File 41) |
| Other Decision Makers | Text | Names/roles of other people involved | Buying committee tracking (File 41) |
| Timezone | Dropdown | AEST, ACST, AWST, NZST | DM timing, call scheduling (Files 01, 03) |

---

## SECTION 2: LEAD SOURCE & ACQUISITION

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Lead Source | Dropdown | LinkedIn DM, Cold Email, Cold Call, Website Inbound, Referral - Client, Referral - Partner, Content/Lead Magnet, LinkedIn Ads, Google, Event/Networking, Reactivation, Other | Win/Loss analysis (File 20), Channel ROI tracking |
| Referral Source Name | Text | Name of person who referred | Referral tracking (File 24) |
| Partner Source | Dropdown | [List of referral partners] | Partnership ecosystem (File 24) |
| Signal That Triggered Outreach | Dropdown | SEEK Job Posting, Funding Round, New Hire, Tech Stack Change, LinkedIn Post, Content Engagement, Profile Viewer, Inbound Request, No Signal (Cold), Other | Signal-based selling (File 09) |
| Signal Detail | Text | e.g., "Posted SDR role on SEEK 12 July" | Personalisation for outreach (File 09) |
| Warmth Level (At First Contact) | Dropdown | L1 - Neutral, L2 - Profile Viewer, L3 - Request Received, L4 - Content Engager, L5 - Lead Magnet, L6 - Inbound | 6 warmth levels (File 03) |
| First Contact Date | Date | Auto or manual | Pipeline velocity tracking (File 16) |
| First Contact Method | Dropdown | LinkedIn DM, Cold Email, Cold Call, Inbound Form, Referral Intro, Voice Message | Channel tracking |

---

## SECTION 3: QUALIFICATION & SCORING

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Lead Score | Dropdown | 🟢 GREEN (Hot), 🟡 YELLOW (Warm), 🔴 RED (Cold) | Hormozi lead scoring (File 03) |
| BANT-B: Budget | Dropdown | Confirmed ($8K+), Possible (Needs Check), Misaligned (Under $3K), Unknown | BANT-F framework (File 12) |
| BANT-A: Authority | Dropdown | Sole Decision Maker, With Partner, Influencer Only, Unknown | File 12 |
| BANT-N: Need/Urgency | Dropdown | This Month, This Quarter, Exploring, No Urgency, Unknown | File 12 |
| BANT-T: Timeline | Dropdown | ASAP, 1-3 Months, 3-6 Months, 6+ Months, Unknown | File 12 |
| BANT-F: Fit | Dropdown | Perfect Fit, Partial Fit, Wrong Fit | DGK-specific fit criteria (File 12) |
| Current Lead Gen Method | Dropdown | Referrals Only, Some Outbound, Agency, In-House Marketing, Nothing, Mix | Discovery intel |
| Had Agency Before? | Dropdown | Yes - Bad Experience, Yes - OK Experience, No | Objection prevention (File 21), Battle card (File 17) |
| Buyer Persona | Dropdown | Dave (Overwhelmed Founder), Sarah (Ambitious Scaler), Marcus (Sceptic), Lisa (First-Timer), Partnership Buyer | Persona matching (File 18) |
| Communication Style | Dropdown | D - Driver (Direct), I - Influencer (Expressive), S - Steady (Patient), C - Analyst (Data-Driven) | EQ adaptation (File 22) |

---

## SECTION 4: SALES PIPELINE TRACKING

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Pipeline Stage | Dropdown | 1-New Lead, 2-Conversation, 3-Discovery Booked, 4-Discovery Done, 5-Proposal Sent, 6-Negotiation, 7-Closed Won, 8-Closed Lost, 9-Nurture | 9-stage pipeline (File 16) |
| Stage Entry Date | Date | Auto-update on stage change | Deal velocity tracking (File 16) |
| Bucket | Dropdown | Bucket 1 (Throw Rope), Bucket 2 (Friendly Check-In) | 2-bucket follow-up system (File 02) |
| Interest Level | Dropdown | 1/10, 2/10, 3/10, 4/10, 5/10, 6/10, 7/10, 8/10, 9/10, 10/10 | Bucket assignment (File 02) |
| Follow-Up Framework Used | Multi-Select | Foreshadow Value, Add Value, Non-Threatening, Solicit Intros, Voice Message, Friendly Check-In, Restart Resource, Fuck It, Valuable Post, We Should Talk, Scarcity, Trojan Horse, Breakup | Track which frameworks work (Files 02, 09) |
| Follow-Up Count | Number | Auto-increment | Know when to stop (File 02) |
| Last Follow-Up Date | Date | Manual/auto | Timing rules (File 02) |
| Next Follow-Up Date | Date | Manual | Pipeline hygiene (File 16) |
| Next Action | Text | e.g., "Send Trojan Horse audit", "VM Thursday AM" | Pipeline management (File 16) |
| Outreach Channel | Multi-Select | LinkedIn DM, Cold Email, Cold Call, Voice Message, Text, Video Loom | Multi-channel tracking (File 08) |
| Trojan Horse Sent? | Dropdown | Not Yet, Sent (Awaiting Response), Sent (They Used It), N/A | Framework 1 tracking (File 09) |
| Voice Messages Sent | Number | Count | VM tracking (File 01) |
| DM Conversation Link | Text | URL to LinkedIn DM thread | Quick reference for follow-ups |

---

## SECTION 5: DISCOVERY CALL TRACKING

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Discovery Call Date | Date | | Track velocity |
| Discovery Call Completed? | Dropdown | Yes, No-Show, Rescheduled, Cancelled, Not Yet Scheduled | Show rate tracking (File 02) |
| No-Show Count | Number | | Pattern tracking |
| Cold Read Delivered? | Checkbox | Y/N | Pre-call prep tracking (File 06) |
| Level 1 Pain (Surface) | Text | Their words: e.g., "Only get referrals" | PICS chart (File 06) |
| Level 2 Pain (Business Impact) | Text | Their words: e.g., "Revenue unpredictable, can't hire" | PICS chart (File 06) |
| Level 3 Pain (Emotional) | Text | Their words: e.g., "Haven't had a holiday in 2 years" | PICS chart — buying trigger (File 06) |
| Cost of Inaction (Monthly) | Currency | e.g., $15,000 | Pain quantification (File 06, 10) |
| Cost of Inaction (Annual) | Currency | Auto-calculate: monthly × 12 | Anchor for pricing (File 11) |
| Consistency Commitments Made | Text | What they agreed to on the call: "Agreed referral dependency is the core issue" | Consistency principle (File 45) |
| Insight Bomb Used | Dropdown | Leaking Bucket, Being Poached, Referrals Are a Trap, Hustle Brain, Agency Dependency, Custom | Challenger tracking (File 39) |
| Call Recording Link | Text | URL | Coaching review (File 23) |
| Call Score (1-10) | Number | Self-assessed or coach-assessed | Performance tracking (File 23) |

---

## SECTION 6: PROPOSAL & CLOSE TRACKING

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Package Interest | Dropdown | Foundation Essentials, Foundation + Outbound, Full Growth System, Custom, Undecided | 3-tier pricing (File 11) |
| Proposed Value | Currency | Dollar amount quoted | Revenue forecasting |
| Proposal Sent Date | Date | | Velocity tracking |
| Proposal Follow-Up Count | Number | | Follow-up tracking |
| Closing Technique Used | Dropdown | Assumptive, Silence, Summary, Either/Or, Urgency, Trial, Take-Away, Next-Step | Track what works (File 10) |
| Objections Raised | Multi-Select | Price, Timing, Already Have Agency, Too Small, Not Interested, Need to Think, Need Partner Approval, Send Info, What Do You Do, Other | Objection tracking (File 04), pattern detection (File 20) |
| Objection Resolved? | Dropdown | Yes - Booked, Yes - Pending, No - Deal Lost, No Objection Raised | Objection resolution tracking |
| Discount Applied? | Dropdown | None, Same-Day Incentive, Payment Plan, Scope Reduction, Referral Trade, Other | Negotiation tracking (File 13) |
| Discount Amount | Currency | | Margin tracking |
| Close Date | Date | | Revenue reporting |
| Deal Value (Actual) | Currency | Signed amount | Revenue tracking |
| Payment Structure | Dropdown | Full Upfront, 50/50, 3 Instalments, 4 Instalments, Monthly Retainer | Payment tracking (File 13) |
| Contract/Agreement Link | Text | URL to signed document | Record keeping |

---

## SECTION 7: WIN/LOSS ANALYSIS

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Deal Outcome | Dropdown | Won, Lost - Price, Lost - Timing, Lost - Competitor, Lost - No Decision, Lost - Wrong Fit, Lost - Ghost, Lost - Other | Win/Loss analysis (File 20) |
| Real Loss Reason (Internal) | Text | Your honest assessment of why it died | 5 Whys analysis (File 20) |
| Loss Stage | Dropdown | No Reply, Conversation Died, No-Show, Post-Call, Post-Proposal, Post-Negotiation | Stage analysis (File 20) |
| Competitor Lost To | Text | Name of competitor if known | Battle card updates (File 17) |
| Reactivation Date | Date | When to re-engage (60-90 days out) | Reactivation campaign (File 09) |
| Reactivation Attempted? | Dropdown | Not Yet, Attempted - No Response, Attempted - Re-engaged, N/A | Reactivation tracking |
| Days to Close (Auto) | Number | Close Date - First Contact Date | Deal velocity metric (File 16) |
| Touches to Close | Number | Total messages/calls/emails before close | Conversion efficiency |

---

## SECTION 8: DELIVERY TRACKING (Post-Sale)

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Delivery Phase | Dropdown | Onboarding, Foundation - In Progress, Foundation - Complete, Outbound - Setup, Outbound - Running, Content - Setup, Content - Running, Ads - Setup, Ads - Running, Handover, Complete | DGK 4-phase tracking (File 05) |
| Delivery Start Date | Date | | Timeline tracking |
| Expected Completion Date | Date | | Milestone management |
| Actual Completion Date | Date | | Delivery accuracy tracking |
| Session Count (Completed) | Number | e.g., 8 of 12 | DWY engagement tracking |
| Session Attendance Rate | Dropdown | Excellent (90%+), Good (70-89%), Poor (Below 70%) | IKEA Effect engagement (File 38) |
| Deliverables Completed | Multi-Select | CRM Setup, Website, Email Infrastructure, Domain Stacking, Signal Lists, Sequences Built, Automation, Tracking, Content Calendar, Canva Templates, SOPs, Dashboards, Ad Creatives, Ad Campaigns | Delivery checklist |
| Delivery Notes | Text (Long) | Session notes, decisions, changes | Knowledge transfer |
| Client Satisfaction (Pulse) | Dropdown | Very Happy, Happy, Neutral, Concerned, At Risk | Client health score (File 19) |
| Welcome Message Sent? | Checkbox | Y/N | 48-hour onboarding (File 14) |
| Quick Win Delivered? | Checkbox | Y/N | 48-hour quick win (File 14) |
| Expectations Set? | Checkbox | Y/N | Expectation script (File 14) |

---

## SECTION 9: CLIENT HEALTH & RETENTION

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Client Health Score | Dropdown | 20-25 Healthy, 15-19 Watch, 10-14 At Risk, Below 10 Critical | Health scoring (File 19) |
| Health - Engagement (1-5) | Number | Are they attending sessions? Responding? | File 19 |
| Health - Results (1-5) | Number | Seeing leads/pipeline growth? | File 19 |
| Health - Satisfaction (1-5) | Number | Expressed happiness or complaints? | File 19 |
| Health - Usage (1-5) | Number | Using CRM, checking dashboards? | File 19 |
| Health - Growth Potential (1-5) | Number | Upsell opportunity? | File 19 |
| Last Health Check Date | Date | | Monthly cadence |
| Last QBR Date | Date | | Quarterly cadence (File 19) |
| Next QBR Date | Date | | QBR scheduling |
| Churn Risk? | Dropdown | No Risk, Low Risk, Medium Risk, High Risk, Churned | Early warning (File 19) |
| Churn Trigger (If At Risk) | Dropdown | Not Seeing Results, Feels Deprioritised, Wants Cheaper, Scope Creep, Business Change, Other | 5 churn triggers (File 19) |
| Crisis Active? | Dropdown | None, Delivery Delay, Quality Complaint, Scope Dispute, Client Wants to Cancel, Mistake Made | Crisis management (File 25) |
| Crisis Resolution Notes | Text | How it was resolved | File 25 |

---

## SECTION 10: UPSELL & EXPANSION

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Current Package | Dropdown | Foundation, Foundation + Outbound, Foundation + Content, Full Growth System, Retainer Only, Custom | What they're on now |
| Upsell Opportunity | Dropdown | + Outbound, + Content, + Ads, + Retainer, Full System Upgrade, None Right Now | Upsell path (File 29) |
| Upsell Window | Dropdown | Results Window (Day 30-60), Capacity Window (Day 60-90), QBR Window, Organic Ask, Not Yet | 3 upsell windows (File 29) |
| Upsell Seed Planted? | Checkbox | Y/N | Seeding tracking (File 14, 29) |
| Upsell Pitched? | Dropdown | Not Yet, Pitched - Interested, Pitched - Declined, Pitched - Pending, Converted | Expansion tracking |
| Upsell Value | Currency | Additional revenue from expansion | Revenue growth tracking |
| Upsell Close Date | Date | | Expansion revenue timing |
| Lifetime Value (Running) | Currency | Total revenue from this client to date | LTV tracking (Hormozi Crazy 8, File 05) |

---

## SECTION 11: REFERRAL & SOCIAL PROOF

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Referral Ask Made? | Dropdown | Not Yet, Asked - Got Referrals, Asked - No Referrals, Too Early | Referral engine (File 24) |
| Referrals Given (Count) | Number | How many people they referred | Referral tracking |
| Referrals Given (Names) | Text | Names of people referred | Link referrals to new leads |
| Testimonial Collected? | Dropdown | Not Yet, Written, Video, Case Study, Google Review, LinkedIn Recommendation, Multiple | Social proof harvesting (File 34) |
| Testimonial Type | Multi-Select | Written Quote, Video Testimonial, Full Case Study, Google Review, LinkedIn Recommendation | Format tracking |
| Case Study Permission? | Dropdown | Yes - Named, Yes - Anonymous, Not Asked, Declined | Content usage rights |
| Case Study Published? | Checkbox | Y/N | Social proof deployment |
| Client Willing to Be Reference? | Dropdown | Yes, Not Asked, No | Reference for new prospects |
| Comeback? | Dropdown | No - First Time Client, Yes - Ghost Returned, Yes - Said Not Now Before, Yes - Previous Client Round 2 | Comeback tracking (File 35) |

---

## SECTION 12: INTERNAL TRACKING & NOTES

| Field Name | Type | Options / Format | Why It Exists |
|---|---|---|---|
| Assigned To | Dropdown | Dilip, [Team Member 2], [Team Member 3] | Lead routing |
| Priority | Dropdown | A (Close This Week), B (Active - Nurturing), C (Long-Term), D (Parked) | Focus management |
| Dark Funnel Score (1-5) | Number | How strong is our presence across their 10 touchpoints? | Dark funnel audit (File 40) |
| Consistency Commitments Log | Text (Long) | Running log of what they've publicly agreed to | Consistency principle (File 45) |
| Emotional State (Last Interaction) | Dropdown | Enthusiastic, Positive, Neutral, Hesitant, Sceptical, Frustrated | Emotional contagion awareness (File 44) |
| Internal Notes | Text (Long) | Free-form notes, observations, strategy thoughts | General CRM hygiene |
| Tags | Multi-Tag | e.g., "high-value", "sceptic", "referral-partner", "case-study-candidate" | Segmentation |

---

## GHL PIPELINE STAGES (Set These Up)

### Pipeline 1: Sales Pipeline
| Stage | Colour | Auto-Actions |
|---|---|---|
| 1 - New Lead | Blue | Auto-assign, trigger notification |
| 2 - Conversation | Blue | |
| 3 - Discovery Booked | Yellow | Trigger pre-call drip |
| 4 - Discovery Done | Yellow | |
| 5 - Proposal Sent | Orange | Trigger proposal follow-up sequence |
| 6 - Negotiation | Orange | |
| 7 - Closed Won | Green | Trigger onboarding sequence, move to Delivery pipeline |
| 8 - Closed Lost | Red | Trigger breakup email, set reactivation date |
| 9 - Nurture | Grey | Add to long-term nurture sequence |

### Pipeline 2: Delivery Pipeline
| Stage | Colour |
|---|---|
| Onboarding | Blue |
| Foundation - In Progress | Yellow |
| Foundation - Complete | Green |
| Outbound - Setup | Yellow |
| Outbound - Running | Green |
| Content - Setup | Yellow |
| Content - Running | Green |
| Ads - Setup | Yellow |
| Ads - Running | Green |
| Handover | Orange |
| Complete - Active Retainer | Green |
| Complete - No Retainer | Grey |

---

## GHL AUTOMATIONS TO BUILD

| Automation | Trigger | Action |
|---|---|---|
| Lead Assignment | New contact created | Assign to Dilip, send notification |
| Pre-Call Drip | Stage → Discovery Booked | Send case study email, 24hr reminder, 2hr text |
| Day-Of Text | Call date = today | Send "Hey NAME it's Dilip. Talk soon. [TIME] AEST" |
| No-Show Handler | Call marked "No-Show" | Wait 24hr → send "No worries, want to reschedule?" |
| Proposal Follow-Up | Stage → Proposal Sent | Wait 24hr → follow-up email. Wait 72hr → second follow-up. |
| Breakup Sequence | Stage → Closed Lost | Send breakup message (File 09). Set reactivation date +60 days. |
| Onboarding Sequence | Stage → Closed Won | Send welcome DM (10 min), onboarding email (1 hr), check-in (24 hr), quick win (48 hr) |
| Health Check Reminder | Monthly | Prompt to update health score for all active clients |
| QBR Reminder | Every 90 days from delivery start | Prompt to schedule QBR |
| Referral Ask Reminder | Day 60 of delivery | Prompt: "Ask for referral" |
| Testimonial Ask Reminder | Day 90 of delivery OR health score 20+ | Prompt: "Ask for testimonial" |
| Reactivation Trigger | Reactivation Date = today | Send reactivation message, move to Nurture pipeline |
| Upsell Seed Reminder | Day 30 and Day 60 of delivery | Prompt: "Plant upsell seed" |

---

## DASHBOARD VIEWS TO CREATE IN GHL

### Dashboard 1: Sales Overview
- Deals by stage (visual pipeline)
- Revenue closed this month vs. target
- Close rate (proposals → won)
- Average deal velocity (days to close)
- Lead source breakdown (pie chart)
- Top 5 hottest deals (GREEN score, highest value)

### Dashboard 2: Activity Metrics
- DMs sent this week
- Follow-ups sent this week
- Voice messages sent this week
- Calls booked this week
- Calls completed vs. no-shows

### Dashboard 3: Client Health
- All active clients by health score
- At-risk clients (flagged red)
- QBRs due this month
- Upsell pipeline (opportunities in progress)
- Referrals received this month

### Dashboard 4: Win/Loss Intelligence
- Loss reasons breakdown (pie chart)
- Stage where deals die most (bar chart)
- Average touches to close (trend line)
- Reactivation success rate
- Competitor loss tracking

---

# 20 — Win/Loss Analysis: Learning From Every Deal

> **For:** DGK team extracting insights from won and lost deals to improve the system
> **Why:** Every lost deal is data. Every won deal reveals what worked. Without this, you repeat mistakes.

---

## THE WIN/LOSS REVIEW PROCESS

### After Every Closed Deal (Won or Lost), Answer These:

**For WINS:**
1. Where did this lead come from? (LinkedIn DM, cold email, referral, inbound?)
2. What signal triggered the outreach?
3. What was the prospect's primary pain? (Level 1, 2, 3)
4. Which framework/technique worked best? (Trojan Horse, PAS, case study bridge?)
5. How many touches before the call was booked?
6. What closed the deal? (Specific moment on the call)
7. How long from first contact to signed agreement?
8. What objections came up and how were they handled?
9. What can we replicate for similar prospects?

**For LOSSES:**
1. At what stage did the deal die? (No reply, no-show, post-call, post-proposal?)
2. What reason did they give? (Price, timing, competitor, no need, ghosted?)
3. What's the REAL reason? (Often different from what they said)
4. Did we qualify properly? (Score against BANT-F from File 12)
5. Did we miss any signals or red flags early?
6. What would we do differently next time?
7. Is there a reactivation opportunity? (If yes, when?)
8. Should we update our battle cards? (If they went to a competitor)

---

## MONTHLY PATTERN REVIEW (30 Minutes, Last Friday of Month)

Review all wins and losses for the month. Look for patterns:

**Win patterns:**
- Which industries close fastest?
- Which lead source has the highest close rate?
- Which signal produces the best prospects?
- Which DGK package sells most?
- Average deal velocity (first contact → close)?

**Loss patterns:**
- Where do most deals die? (Stage analysis)
- Most common real reason for losing?
- Are we attracting the wrong ICP? (Red flags in targeting)
- Are we losing on price? (Need to anchor better or adjust tiers)
- Are we losing to a specific competitor? (Need better battle card)

**Action:** Pick the top 1-2 insights and update the relevant knowledge base file. Sales systems are living documents.

---

## THE "5 WHYS" FOR LOST DEALS

When a deal dies, ask "why" 5 times to find the root cause:

**Example:**
1. Why did we lose? "They went with a cheaper agency."
2. Why did they choose cheaper? "They didn't see enough value difference."
3. Why didn't they see the difference? "We didn't quantify the cost of inaction well enough."
4. Why didn't we quantify it? "We rushed discovery and moved to the pitch too fast."
5. Why did we rush? "We only had 20 minutes because the prospect was late and we didn't reschedule."

**Root cause:** Not enforcing the time constraint at the start of the call (File 07, Status Hack #1) and not rescheduling when the call was compromised.

**Fix:** Add to pre-call checklist: "If prospect is 7+ minutes late, leave and reschedule."

---

## ADAPTING FOR CLIENTS

Teach clients to:
1. Log every deal outcome (won/lost/stalled) in their CRM
2. Add a "loss reason" dropdown to their pipeline
3. Review patterns monthly — even 5 minutes looking at loss reasons reveals trends
4. Share losses with their team without blame — frame as learning opportunities

---

# 30 — Offer Creation: The Grand Slam Offer (Hormozi Framework)

> **For:** DGK team crafting offers so good prospects feel stupid saying no + DGK clients building their own offers
> **Why:** A great salesperson with a mediocre offer will always lose to a mediocre salesperson with a great offer. The offer does the heavy lifting.

---

## THE GRAND SLAM OFFER FORMULA

**Dream Outcome × Perceived Likelihood of Achievement ÷ Time Delay × Effort & Sacrifice = Value**

To increase value, you either:
- ↑ Increase the dream outcome (make the result bigger)
- ↑ Increase perceived likelihood (make them believe it'll work)
- ↓ Decrease time delay (make it happen faster)
- ↓ Decrease effort & sacrifice (make it easier for them)

---

## APPLYING THE FORMULA TO DGK

### Dream Outcome (What they REALLY want):
Not "a CRM" or "email sequences." They want:
- Predictable revenue every month
- Freedom from being the bottleneck
- A system that works while they sleep
- To never worry about where the next client is coming from
- To take a holiday without the pipeline dying

**DGK language:** "6 qualified enquiries landing in your CRM every month without you lifting a finger."

### Perceived Likelihood (Why they believe it'll work):
- Case studies with SPECIFIC numbers (not vague "we help businesses grow")
- Industry-matched proof: "We did this for an NDIS provider just like you"
- "Done with you" model = they SEE it being built, they UNDERSTAND it
- No lock-in = low risk. "If it doesn't work, you still own everything we built."

### Time Delay (How fast they see results):
- "First leads by week 6. Full system by week 12."
- Compress the timeline wherever possible
- Quick wins in first 48 hours (File 14) validate the purchase early

### Effort & Sacrifice (How easy it is for them):
- "You show up to weekly sessions. We do the heavy lifting."
- "You don't need to be technical. We build it in plain English."
- "One hour a week of your time. That's it."

---

## THE DGK GRAND SLAM OFFER

**Before (generic):** "We build growth systems for B2B businesses."

**After (Grand Slam):** "We build you a self-running growth system that generates 5-10 qualified enquiries per month within 60 days. You own the entire system — CRM, sequences, dashboards, everything. No lock-in contract. If you're not getting results by week 8, we keep working until you do. You invest one hour a week. We do the rest."

### Breaking down why this works:
- **Dream Outcome:** "5-10 qualified enquiries per month" (specific, measurable)
- **Perceived Likelihood:** "within 60 days" + "if not getting results, we keep working" (guarantee)
- **Time Delay:** "60 days" (fast)
- **Effort:** "one hour a week" (easy)
- **Risk Reversal:** "No lock-in" + "you own everything" + implicit guarantee

---

## THE VALUE STACKING TECHNIQUE

List EVERYTHING the client gets. Stack it so the perceived value is 10x the price.

| Component | What it is | Perceived value |
|---|---|---|
| CRM setup + configuration | GoHighLevel fully built | $3,000 |
| Website audit + fixes | Conversion-optimised pages | $2,000 |
| Email infrastructure | 3 domains, 9 inboxes, warmed | $1,500 |
| Signal-based prospect lists | 130+ trigger targeting | $2,000 |
| 5-email outbound sequence | Personalised, tested copy | $1,500 |
| Automation workflows | Follow-ups, reminders, routing | $2,000 |
| Tracking + dashboards | GA4, Pixel, CRM attribution | $1,500 |
| Sales enablement | Scripts, pipeline stages, SOPs | $1,000 |
| 12 weeks of DWY sessions | Training + implementation | $5,000 |
| **Total perceived value** | | **$19,500** |
| **DGK price** | | **$8,000** |

"You're getting $19,500 worth of systems for $8,000. And you own all of it when we're done."

---

## BUILDING OFFERS FOR DGK CLIENTS

Walk clients through the same formula:
1. What's the dream outcome your customer wants? (Not your product — their RESULT)
2. Why should they believe it'll work? (Proof, guarantees, risk reversal)
3. How fast can you deliver? (Compress timeline)
4. How easy is it for them? (Remove friction)
5. Stack the value: list everything they get and put a dollar value on each component

---

# 40 — The Dark Funnel: Winning Before the Conversation Starts

> **Source:** McKinsey 2026 B2B Pulse (4,000 decision-makers), 6sense 2025 Buyer Experience Report, Gartner
> **The insight:** 80% of the buyer's journey happens BEFORE they talk to you. The "Dark Funnel" is everything they do that you can't see — Googling you, reading your content, checking your LinkedIn, asking AI to compare you. By the time they reply to your DM, they've already decided whether you're credible.

---

## THE RESEARCH THAT CHANGES EVERYTHING

**McKinsey 2026:** Buyers use an average of 10 channels across the purchasing journey. They expect seamless, consistent information across ALL of them.

**6sense 2025:** Buyers often have a preferred vendor BEFORE they speak to sales. That preferred vendor wins 80% of deals.

**What this means for DGK:** If your website, LinkedIn, content, case studies, and outbound messages don't tell the SAME story with the SAME quality — you lose before you start.

---

## THE 10 TOUCHPOINTS BUYERS CHECK (In Order)

1. **Your LinkedIn profile** — Is it professional? Does it speak to THEIR problem?
2. **Your LinkedIn content** — Are you active? Do you post valuable insights?
3. **Your website** — Does it look trustworthy? Is it clear what you do?
4. **Your case studies** — Do you have proof? Is it specific? Does it match their industry?
5. **Your Google presence** — Google reviews? News mentions? Directory listings?
6. **AI search** — They might ask ChatGPT/Perplexity "who does B2B outbound in Australia?" — do you show up?
7. **Your email** — Is the domain legit? Does the signature look professional?
8. **Your DM** — Does it feel personal or mass-sent?
9. **Referral check** — They ask their network "anyone heard of DGK?"
10. **Competitor comparison** — They look at 2-3 alternatives before deciding

---

## THE DARK FUNNEL AUDIT (Do This Quarterly)

Google yourself. Check every touchpoint. Score each 1-5:

| Touchpoint | Score 1-5 | Action needed |
|---|---|---|
| LinkedIn profile | /5 | Does tagline call out ICP? Featured section = case studies? |
| LinkedIn activity (last 30 days) | /5 | 5+ posts/month? Engagement on each? |
| Website homepage | /5 | Clear headline, proof, CTA? Mobile-friendly? |
| Website case studies page | /5 | Specific numbers? Industry-matched? |
| Google "[your name]" results | /5 | What shows up? Professional? |
| Google "[DGK Business Consultancy]" reviews | /5 | Any reviews? How many? Rating? |
| AI search test ("B2B outbound Australia") | /5 | Does DGK appear in AI results? |
| Email signature | /5 | Professional? Consistent with brand? |
| Competitor comparison | /5 | How does DGK stack up visually? |

**Score below 35/45?** The Dark Funnel is working against you. Prospects are researching you and walking away before you ever know they existed.

---

## HOW TO WIN THE DARK FUNNEL

### 1 — Message Consistency
Every touchpoint must tell the same story: "Self-running growth systems for Australian B2B. Done with you. Owned by you."
If your website says one thing, your LinkedIn says another, and your DM says a third — the buyer notices and trusts drops.

### 2 — Proof Everywhere
Case studies on your website. Social proof in your LinkedIn featured section. Numbers in your DM openers. Testimonials in your email signature. Results in your content. The buyer should be UNABLE to avoid your proof no matter where they look.

### 3 — Be Findable
- Optimise LinkedIn for search (keywords in headline, about, experience)
- Publish content that AI tools can index (blog posts, LinkedIn articles)
- Get listed in relevant directories
- Ask clients for Google reviews (File 34)

### 4 — Pre-Sale Content Assets
Create content that answers every question a buyer has BEFORE they talk to you:
- "How DGK Works" page (process explanation)
- "Results" page (case studies with numbers)
- "FAQ" page (address objections pre-emptively — File 21)
- "Compare" page (DGK vs. agencies vs. freelancers vs. DIY — File 17 made public)

**The goal:** By the time they get on a call with you, they already WANT to work with you. The call is just confirming what they've already decided.

---

# 26 — Social Selling & Personal Brand System

> **For:** DGK team (especially Dilip) building a personal brand that generates inbound leads + DGK clients doing the same
> **Why:** Cold outbound gets you meetings. Personal brand gets meetings coming to YOU. The best sales systems combine both — outbound for volume, inbound for quality.

---

## THE PERSONAL BRAND FLYWHEEL

Content → Visibility → Trust → Inbound Leads → Clients → Case Studies → Better Content → More Visibility → More Trust → More Leads

Every piece of content feeds the next cycle. The more you post, the more visible you get. The more visible, the more people trust you. The more trust, the more leads come inbound. The more clients, the better your case studies. The better your case studies, the better your content. Repeat.

---

## THE 5 CONTENT PILLARS FOR DGK

### Pillar 1 — Hot Takes (ToFu — Grows Following)
Bold opinions about the B2B/marketing world that get people to agree or disagree.

Examples:
- "Agencies are built to keep you dependent. That's the model."
- "If your marketing stops working when you stop paying, you never had marketing — you had rented access."
- "Most B2B businesses in Australia are one referral away from a bad quarter."

### Pillar 2 — Frameworks (MoFu — Builds Authority)
Share the actual systems you use (from these knowledge base files) in digestible format.

Examples:
- "The 2-Bucket Follow-Up System that books 20-50% of our calls"
- "Why I never include a message with my connection requests"
- "The 3-second rule that gets prospects to keep talking"

### Pillar 3 — Case Studies (BoFu — Converts)
Real results with real numbers. Use the storytelling framework from File 15.

Examples:
- "IT Together: 0→6 qualified enquiries/month in 60 days. Here's exactly how."
- "Why this NDIS provider gets same-week outreach on hiring signals"

### Pillar 4 — Behind the Scenes (Humanises)
Show the real work. The messy middle. Not just wins.

Examples:
- "Here's what my Monday morning looks like (200 connection requests before coffee)"
- "Lost a deal last week. Here's what I learned."
- "Building a client's outbound system live — here's the domain setup"

### Pillar 5 — DGK Philosophy (Differentiates)
"Done with you. Owned by you." Make this a movement, not just a tagline.

Examples:
- "Why I don't do retainers"
- "The day a client said 'I don't need you anymore' was the best day of my business"
- "What 'system ownership' actually means and why it matters"

---

## THE CONTENT-TO-DM PIPELINE

Every post should be a potential conversation starter:

1. **Post a valuable framework** on LinkedIn
2. **People engage** (like, comment, share)
3. **DM the engagers** using Framework 4 from File 03 (Content Engagers = Level 4 warmth, 15-25% call rate)
4. **Reference the post** in your DM: "Hey NAME — saw you liked my post about [topic]. Curious — is that something you're dealing with?"

This turns every LinkedIn post into a lead generation tool.

---

## THE LINKEDIN ALGORITHM PLAYBOOK (What Gets Reach)

| Do this | Avoid this |
|---|---|
| Post between 8-9 AM AEST | Posting at night or weekends |
| Write a hook that stops the scroll (first 2 lines) | Starting with "I'm excited to announce..." |
| Use line breaks for readability | Dense paragraphs |
| Include a question at the end (drives comments) | Ending without a CTA |
| Reply to every comment within 1 hour | Ignoring comments |
| Tag 1-2 relevant people (not 20) | Tag-spamming for visibility |
| Post 5x/week consistently | Posting 10x one week then nothing for 2 weeks |
| Share genuine insights and opinions | Reposting generic motivational quotes |

---

## THE INBOUND LEAD MAGNET SYSTEM

Create content assets that people comment a keyword to receive:

1. **Create a valuable resource** (e.g., "12-Signal Prospect Targeting Template")
2. **Write a post** explaining WHY it's valuable with a hook
3. **CTA:** "Comment 'SIGNALS' and I'll send it over"
4. **DM everyone who comments** — send the resource + start a conversation
5. **These are Level 5 warm leads** (10-30% call rate from File 03)

**DGK lead magnets to create:**
- "The DGK Outbound Health Check Template"
- "5-Domain Email Infrastructure Map"
- "B2B LinkedIn Profile Audit Checklist"
- "Signal-Based Prospect List Template (130+ Triggers)"

---

## MEASURING PERSONAL BRAND ROI

| Metric | Track weekly |
|---|---|
| LinkedIn post impressions | Are people seeing your content? |
| Engagement rate (likes + comments ÷ impressions) | Is the content resonating? Target: 3%+ |
| Profile views per week | Are people checking you out? |
| Connection requests received | Are people coming to YOU? |
| Inbound DMs per week | Are people reaching out without you initiating? |
| Leads from content (tagged in CRM) | How many deals originated from content? |

**Target:** Within 6 months of consistent posting, 20-30% of new leads should come inbound from content. This reduces dependence on cold outbound and improves close rates (inbound closes at 50-90% vs cold at 5-15%).

---

# 23 — Sales Team Hiring & Coaching

> **For:** DGK as it grows beyond Dilip selling alone + DGK clients building their own sales teams
> **Why:** The playbook is only as good as the person running it. The wrong hire with the right script still fails.

---

## WHAT TO LOOK FOR IN A DGK SALES HIRE

### The 6 Traits (Ranked by Importance)

1. **Coachability** — Can they take feedback and implement it immediately? (Test: give them feedback mid-interview and see if they adjust)
2. **Curiosity** — Do they ask good questions? (Salespeople who ask > salespeople who tell)
3. **Resilience** — How do they handle rejection? (Ask: "Tell me about a time you failed and what you did next")
4. **Work ethic** — Will they do 200 connection requests/week without being reminded?
5. **Communication clarity** — Can they explain something complex simply?
6. **Industry knowledge** — Nice to have, not need to have. Skills 1-5 can't be trained; this can.

### Interview Questions That Reveal Truth

| Question | What it reveals |
|---|---|
| "Sell me this pen" (don't actually ask this) | Nothing. It's a cliché. Skip it. |
| "Walk me through your last week — hour by hour" | Work ethic and organisation |
| "Tell me about a time you convinced someone who said no" | Resilience and persuasion |
| "What questions would you ask me if you were selling DGK's services?" | Curiosity and sales instinct |
| "I'm going to give you some feedback on your answer. Ready?" (then give feedback and see if they adjust in real-time) | Coachability — THE most important trait |
| "Why do you want to work in sales specifically?" | Motivation and self-awareness |

### Red Flags
- They talk more than they listen during the interview
- They can't name a specific time they failed
- They get defensive when you give feedback
- They badmouth their previous employer
- They ask about commission before asking about the product

---

## THE 30-60-90 DAY ONBOARDING PLAN

### Days 1-30: LEARN
- Read Files 00-16 (entire knowledge base)
- Complete all 10 training decks + pass all quizzes
- Shadow Dilip on 5+ sales calls (observe only, take notes)
- Role-play: 20 practice DM openers, 10 mock discovery calls
- Start sending 100 connection requests/week (low stakes)

### Days 31-60: PRACTICE
- Start sending DM openers independently (Dilip reviews first 20)
- Run 2-3 discovery calls with Dilip listening in (debrief after each)
- Send first voice messages (review recordings together)
- First follow-up sequences independently
- Weekly 30-min coaching session with Dilip

### Days 61-90: PERFORM
- Run discovery calls independently
- Own 50+ pipeline conversations
- Book 5+ calls/week
- Close first deal (with Dilip's support)
- Monthly pipeline review independently

**Day 90 assessment:** Can they independently run the full cycle from DM to close? If yes, they're operational. If not, extend the practice phase.

---

## WEEKLY COACHING CADENCE

### 30-Minute Weekly 1:1 (Every Monday)

**Agenda:**
1. **Numbers review (5 min):** Connections, DMs, replies, calls, proposals, closes
2. **Call review (15 min):** Listen to 1 recorded call together. Score on: discovery depth, frame control, objection handling, close attempt
3. **Skill focus (5 min):** Pick ONE area to improve this week (e.g., "This week, focus on using the 3-second rule after every question")
4. **Pipeline check (5 min):** Any stuck deals? Any deals to kill? Any deals ready to close?

### Monthly Call Review Session (1 Hour)
- Review 3 calls (1 won, 1 lost, 1 in progress)
- Score each on a 1-10 rubric
- Identify patterns: what's consistently strong? What's consistently weak?
- Update training priorities

---

## ADAPTING FOR CLIENTS

When DGK clients need to hire their first salesperson:
1. Share the 6 traits framework — coachability is #1
2. Help them write the job listing using the interview questions above
3. Offer to sit in on the final interview as an advisor
4. Build a simplified 30-day onboarding plan using their own sales materials
5. Set up a weekly coaching cadence they can run independently

---

# 36 — Sales Resilience & The Daily Mental Game

> **For:** DGK team maintaining peak performance through rejection, slumps, and the emotional rollercoaster of selling
> **Why:** Sales is 80% mental. You can master every framework in Files 01-35 and still fail if your head isn't right. This file keeps your head right.

---

## THE REALITY OF SALES (Numbers Don't Lie)

At DGK's current benchmarks:
- 200 connection requests/week = 80-100 accepted
- 80-100 DMs sent = 25-35 replies (65-75 IGNORED you)
- 25-35 replies = 5-10 calls booked (20-25 said no or went quiet)
- 5-10 calls = 1-3 closes (7-9 didn't buy)

**That means in a typical week, you'll hear "no" (explicitly or through silence) approximately 170+ times to get 1-3 "yes" responses.**

This is NORMAL. This is not failure. This is the math of outbound selling. The best salespeople in the world operate at these same ratios. The difference is they don't let the 170 rejections affect how they show up for the 3 opportunities.

---

## THE 5 MENTAL TRAPS (And How to Escape Each)

### Trap 1: "I'm bothering people"
**The truth:** You're offering a valuable system to people who need it. THEY are stuck on referrals. THEY are losing $15-20K/month. You're not interrupting — you're intervening.
**Reset phrase:** "I have something that solves a real problem. The right people will appreciate hearing from me."

### Trap 2: "That rejection was personal"
**The truth:** They didn't reject YOU. They rejected the timing, the offer, the situation. You are not your sales results.
**Reset phrase:** "They're not a fit for us right now. Next."

### Trap 3: "I'm not good enough to sell this"
**The truth:** Imposter syndrome hits every salesperson. Even the best. The cure is reps, not reassurance.
**Reset phrase:** "I don't need to be perfect. I need to be prepared and genuine."

### Trap 4: "This slump will never end"
**The truth:** Slumps are mathematical. If your close rate is 20%, you WILL have stretches of 5-10 "no's" in a row. That's just probability, not a trend.
**Reset phrase:** "Based on my closing rate, I'm only X more 'no's' away from the next 'yes.'"

### Trap 5: "I should be further along by now"
**The truth:** Comparison kills conviction. Your timeline is your timeline.
**Reset phrase:** "I'm further today than I was yesterday. That's the only comparison that matters."

---

## THE DAILY RESET ROUTINE (15 Minutes)

### Morning (Before First DM — 10 min):
1. **Read 1 Chad Maxim** from File 07 (2 min)
2. **Visualise:** Close your eyes. Picture the best sales conversation you've ever had. Feel that confidence. Carry it into today. (3 min)
3. **Set ONE number goal:** "Today I will start 20 new DM conversations" — not revenue, not closes, just activity. Activity is the only thing you control. (1 min)
4. **Gratitude check:** Name 1 client who's getting results because of your work. That's why you do this. (1 min)
5. **Energy check:** Am I hydrated? Did I sleep? Am I sitting up straight? Physical state drives mental state. (3 min)

### After a Rejection (2 min):
1. Breathe. 4 seconds in. 7 seconds hold. 8 seconds out.
2. Say out loud: "Not a fit. Next."
3. Don't analyse the rejection right now. Log it for the weekly review (File 20).
4. Send the next DM within 60 seconds. Momentum beats motivation.

### End of Day (5 min):
1. Log your numbers (connections, DMs, replies, calls, closes)
2. Write down 1 win from today — even if it was small ("got a reply from a tough prospect")
3. Write down 1 thing to improve tomorrow
4. Close the laptop. Sales is not your identity. Turn it off.

---

## SLUMP BREAKERS (When Nothing Is Working)

### 1 — Go Back to Basics
When you're in a slump, the instinct is to try something new. Don't. Go back to what worked before. Re-read Files 01 and 06. Do the fundamentals perfectly.

### 2 — Change the Medium
If DMs aren't working, switch to voice messages. If calls aren't closing, try sending Trojan Horse gifts. Sometimes a change of channel breaks the pattern.

### 3 — Call Your Best Client
Call a happy client and ask how things are going. Their enthusiasm will remind you why you do this. Bonus: ask for a referral while you're at it.

### 4 — Lower the Stakes
Instead of trying to close deals, set a goal to just have 5 genuine conversations. Remove the pressure. When the pressure drops, performance rises.

### 5 — Exercise
Seriously. 30 minutes of exercise changes your brain chemistry. Walk, run, lift — anything. Then come back to the desk. You'll be a different person.

---

## THE CONVICTION CYCLE

Results → Conviction → Better Performance → More Results → More Conviction

The challenge: when you're NEW, you don't have results yet. So conviction is low. And low conviction = bad performance = no results = lower conviction. Downward spiral.

**How to break in:**
- Borrow conviction from CASE STUDIES. You don't have results yet, but DGK does. IT Together got 6 enquiries in 60 days. Triple R got same-week signals. These are YOUR results because you're selling the same system.
- Borrow conviction from FRAMEWORKS. You've read Files 01-35. You know more about B2B outbound than 95% of salespeople. That knowledge IS your conviction.
- Get ONE result. Just one. Then the cycle starts spinning.

---

## THE SALES PROFESSIONAL'S CREED

"I am not begging for business. I am offering a system that solves a real problem.
Every 'no' brings me closer to a 'yes.'
My value is not determined by today's close rate.
I control my activity. The results will follow.
I show up prepared, genuine, and grounded — every single day.
I am the prize."

---
