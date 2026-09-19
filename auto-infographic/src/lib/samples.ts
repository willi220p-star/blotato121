import type { CarouselKind, InfographicKind } from './types'

export interface InfographicSample {
  id: string
  title: string
  kind: InfographicKind
  prompt: string
}

export interface CarouselSample {
  id: string
  title: string
  kind: CarouselKind
  slides: number
  prompt: string
}

export const INFOGRAPHIC_SAMPLES: InfographicSample[] = [
  {
    id: 'onboard',
    title: 'Client onboarding',
    kind: 'process',
    prompt:
      'Five-step client onboarding for a boutique studio.\n1. Discovery call\n2. Scope and quote\n3. Kickoff workshop\n4. Weekly craft\n5. Handoff and review',
  },
  {
    id: 'swot',
    title: 'Brand SWOT',
    kind: 'swot',
    prompt:
      'SWOT for a local coffee roaster expanding into subscriptions.\nStrengths: house roast, loyal neighborhood, tasting bar\nWeaknesses: tiny team, no app, limited hours\nOpportunities: office delivery, seasonal boxes, workshops\nThreats: grocery private labels, rent, delivery apps',
  },
  {
    id: 'metrics',
    title: 'Q3 snapshot',
    kind: 'stats',
    prompt:
      'Q3 growth snapshot for a B2B SaaS.\n+38% qualified pipeline\n12 day sales cycle (was 19)\n94% logo retention\n4.8 CSAT from 210 reviews',
  },
  {
    id: 'vs',
    title: 'Before / after',
    kind: 'comparison',
    prompt:
      'Before vs after a content system for a founder brand.\nBefore: random posts, no CTA, 1.2% engagement\nAfter: weekly carousel, clear offer, 4.7% engagement',
  },
  {
    id: 'funnel',
    title: 'Launch funnel',
    kind: 'funnel',
    prompt:
      'Launch funnel for a digital product.\nAwareness: 12k reach\nInterest: 2.4k site visits\nConsider: 640 waitlist\nBuy: 180 checkouts',
  },
  {
    id: 'roadmap',
    title: '90-day roadmap',
    kind: 'roadmap',
    prompt:
      '90-day product roadmap.\nDays 1–30: research and positioning\nDays 31–60: prototype and waitlist\nDays 61–90: paid launch and testimonials',
  },
]

export const CAROUSEL_SAMPLES: CarouselSample[] = [
  {
    id: 'linkedin-ops',
    title: 'Ops that feel calm',
    kind: 'thought-leadership',
    slides: 6,
    prompt:
      'LinkedIn carousel for operators: why messy pipelines kill close rates. Cover the cost of context switching, a 3-step weekly review, and a close with a simple offer to audit their funnel.',
  },
  {
    id: 'launch',
    title: 'Product drop',
    kind: 'product-launch',
    slides: 5,
    prompt:
      'Carousel announcing a limited photography preset pack. Hook on “your photos look expensive without a new camera”, three features, price, and a last-slide CTA.',
  },
  {
    id: 'howto',
    title: 'How to brief a designer',
    kind: 'how-to',
    slides: 7,
    prompt:
      'How-to carousel: brief a designer in 15 minutes. Goal, audience, references, constraints, timeline, success metric, and a closing checklist.',
  },
  {
    id: 'metrics',
    title: 'Proof slides',
    kind: 'metrics',
    slides: 4,
    prompt:
      'Proof carousel for a coaching offer. 41 clients, 3.2x average pipeline, 90-day money-back, and a quiet close.',
  },
]
