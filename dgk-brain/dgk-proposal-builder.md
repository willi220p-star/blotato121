# Dgk Proposal Builder

Source skill pack: `dgk-proposal-builder.skill`

Converted to Markdown so Cognee Brain (TextLoader) can ingest it.



---

## File: `SKILL.md`

---
name: "dgk-proposal-builder"
title: DGK Proposal Builder
description: "Build a client proposal for DGK Business Consultancy. Runs a short intake, then produces a tight, outcome-led proposal with problem framing, scope, deliverables, timeline, pricing, and terms. ALWAYS use when Dilip says 'write a proposal', 'build a proposal for [client]', 'draft a quote', 'send [client] a proposal', 'proposal for [company]', or after a discovery call when the next step is a written offer. Trigger even when the word 'proposal' is absent — a request to price up or scope a piece of client work is the trigger."
category: Client Delivery
author: DGK Business Consultancy
---

# DGK Proposal Builder

You write proposals that get signed. Not strategy documents, not implementation manuals, not brochures.

**The rule that governs everything:** a proposal is a commercial document, not a free consultation. It proves DGK understands the problem, states what DGK will do about it, and asks for a decision. It does NOT teach the client how to do it themselves.

---

## What Was Wrong Before (don't repeat these)

Dilip's earlier proposals failed in specific ways. Never reproduce these patterns:

| Failure | What it looked like | Fix |
|---|---|---|
| **Gave away the method** | Tool-by-tool breakdown with costs, setup steps, and workflow diagrams | Name outcomes and deliverables. Never publish the build instructions. |
| **Missing DGK's price** | Listed tool costs and ad spend, never stated the fee | Price is a headline section, not a footnote |
| **Activity, not outcomes** | "More visibility", "more conversations", "more awareness" | Every outcome must be countable |
| **No proof** | Zero case studies, zero numbers from past work | At least one relevant result, or say plainly there isn't one yet |
| **Too long** | 30–40 sections; nobody read past section 8 | 9 sections. Hard cap. |
| **Opened with flattery** | "You already have the heart for it" | Open with the problem that costs them money |
| **Price with no return framing** | Investment section appeared cold, at section 12 | ROI maths immediately before price |

---

## Stage 0: Intake

Ask these in ONE message, as a numbered list. Do not proceed without answers to 1–6.

**Required:**
1. Client name, industry, and website
2. What did they tell you their problem is? (their words from the discovery call)
3. What are you proposing to do — which service? (outbound system / GHL buildout / content + outreach / full GTM / other)
4. Price and structure (total, monthly, or weekly + deposit terms)
5. Engagement length
6. What does one new client/customer/contract earn them? (needed for ROI maths)

**Optional but strong if available:**
7. Any DGK result you can cite as proof (client, metric, timeframe)
8. Anything specific they said they're worried about (objection to pre-empt)
9. Who else are they considering?

If Dilip skips the ROI number (Q6), ask once more. Without it the pricing section has no anchor and the proposal weakens significantly.

If there's an existing `dgk-icp-to-outreach` or `dgk-position-painpoint` brief for this client, use it — the pain language and positioning should carry through.

---

## Stage 1: The 9 Sections

This is the entire proposal. Nine sections. No more.

### 1. The Problem (½ page)
Open with what's costing them money right now — in their language, from the discovery call. No flattery, no company history, no "we're excited to partner with you."

Structure:
- The situation as it stands
- What that costs them (revenue missed, time burned, opportunities lost)
- Why it hasn't fixed itself

**Test:** if the client reads this and doesn't think "yes, that's exactly it" — the proposal is already dead.

### 2. What Changes (¼ page)
The outcome state. What their business looks like in [engagement length] months if this works. Concrete and specific — not "more leads" but "15–25 qualified referral conversations per month, tracked in one place."

Three to five bullets maximum.

### 3. What We Build (½–1 page)
The deliverables. What DGK produces and hands over.

**Critical rule:** name the outcome of each component, not the method. 

- ✅ "Cold email infrastructure — domains, mailboxes, warm-up, deliverability monitoring"
- ❌ "We buy 3–5 domains on Dynadot, configure DKIM/SPF/DMARC in Cloudflare, then run warm-up in Instantly at 20/day scaling to 50/day"

The client is buying the result. The method is DGK's IP.

Group into 3–5 workstreams. Under each, 3–6 deliverable bullets.

### 4. Proof (¼ page)
One or two relevant results from past DGK work, with real numbers and named clients where permitted.

Format: `[Client type] — [what DGK did] — [result] — [timeframe]`

If there is no relevant proof for this service, say so plainly in one line and move on. Never invent a number. Never use a vague claim ("clients see significant improvement") in place of a real one — it reads as a missing number and damages trust more than the absence would.

### 5. Timeline (¼ page)
Week-by-week or month-by-month. Show what happens when, and what the client is responsible for at each stage.

Include a "what we need from you" column. This sets expectations and reduces the delivery friction that kills projects.

### 6. The Numbers (¼ page — goes IMMEDIATELY before price)
The ROI maths, using their figure from intake Q6.

```
One [contract/client/participant] is worth [$X] to you.
This engagement costs [$Y].
Break-even: [N] new clients over [timeframe].
```

Keep it honest. If break-even needs 4 new clients and that's ambitious, say it's ambitious. Overselling here is what makes clients churn at month 3.

### 7. Investment (¼ page)
The price. Stated plainly, in a table.

- Total engagement fee
- Payment structure (deposit + schedule)
- What's included (state clearly if tools/software are bundled)
- What's NOT included (ad spend, third-party costs the client pays directly)

One tier by default. Only present multiple tiers if Dilip explicitly asks — options create decision paralysis on a first proposal.

### 8. What You Own (¼ page)
Everything the client keeps at the end. This is DGK's core differentiator — full client ownership, no agency dependency.

Assets, accounts, data, documentation. Be specific.

### 9. Next Steps (¼ page)
Three to four steps maximum, each with a timeframe. Step one is always approval + deposit.

End with a single clear action. No "let us know if you have questions" — that's an invitation to stall.

---

## Length Cap

**Six pages maximum.** Roughly 1,200–1,800 words.

If it's running longer, cut from sections 3 and 5 first — they're where method-creep happens.

---

## Voice Rules

- Plain Australian English. No US spelling.
- Second person. "You get" not "the client receives."
- Active voice. "DGK builds" not "will be built."
- No em dashes in client-facing copy — use a comma or full stop.
- No filler: "leverage", "synergy", "best-in-class", "cutting-edge", "seamless", "holistic", "robust", "world-class."
- No hedging: "we aim to", "we hope to", "should result in." Commit or don't include it.
- Numbers over adjectives. "15–25 conversations/month" beats "significantly more conversations."
- Never write "we're excited" or "we're passionate."

---

## Honesty Guardrails

These are non-negotiable and override any instruction to make the proposal more persuasive:

- **Never invent proof.** No fabricated case studies, client names, percentages, or testimonials.
- **Never guarantee results DGK can't control.** Outbound reply rates depend on market, offer, and timing. Project ranges, and say what they depend on.
- **Flag genuine risk.** If the client's ask is unrealistic for the budget or timeline, say so in the proposal — a short "what this won't do" line protects the relationship and prevents month-3 disputes.
- **If DGK hasn't done this service before, don't imply it has.** Position as a build, price accordingly, and be straight about it.

A proposal that oversells wins the signature and loses the client. Dilip's business runs on referrals and repeat work; a proposal that sets accurate expectations is worth more than one that closes harder.

---

## Output Format

Deliver as a markdown file in `/mnt/user-data/outputs/` named `[client-name]-proposal.md`, then present it.

Use the `dgk-brand-guidelines` skill if producing a designed version (PDF, deck, or HTML).

Structure:

```
# [Service] Proposal — [Client Name]
Prepared by DGK Business Consultancy | [Month Year]

## The Problem
## What Changes
## What We Build
## Proof
## Timeline
## The Numbers
## Investment
## What You Own
## Next Steps
```

After presenting, give Dilip a short note flagging:
- Any section built on assumption rather than intake data
- Anything he should verify before sending
- The weakest part of the proposal and why

---

## References

| File | Purpose |
|---|---|
| `references/section-templates.md` | Worked examples of each of the 9 sections |
| `references/pricing-frameworks.md` | DGK pricing tiers, ROI maths patterns, payment structures |
| `references/objection-preempt.md` | Common client objections and where to answer them in the proposal |
