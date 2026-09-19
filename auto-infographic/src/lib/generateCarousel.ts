import { parsePrompt, titleFromPrompt } from './parsePrompt'
import type { CarouselKind, CarouselModel, CarouselSlideModel, ContentItem } from './types'

function detectCarouselKind(prompt: string): Exclude<CarouselKind, 'auto'> {
  const t = prompt.toLowerCase()
  if (/(launch|drop|new product|announce)/.test(t)) return 'product-launch'
  if (/(how to|steps|playbook|brief)/.test(t)) return 'how-to'
  if (/(metric|proof|%|csat|retention|clients)/.test(t)) return 'metrics'
  if (/(offer|price|cta|buy)/.test(t)) return 'offer'
  if (/(story|journey|from|to)/.test(t)) return 'story'
  return 'thought-leadership'
}

function padItems(items: ContentItem[], needed: number, title: string): ContentItem[] {
  const extras: ContentItem[] = [
    { label: 'Name the tension', desc: `What ${title} is quietly costing people` },
    { label: 'Show the pattern', desc: 'Most teams skip the boring middle' },
    { label: 'Give a method', desc: 'One sequence they can run this week' },
    { label: 'Add proof', desc: 'A number, a name, a before/after' },
    { label: 'Remove friction', desc: 'The smallest next step' },
    { label: 'Close with taste', desc: 'Invite, don’t shout' },
  ]
  const out = [...items]
  let i = 0
  while (out.length < needed) {
    out.push(extras[i % extras.length])
    i += 1
  }
  return out.slice(0, needed)
}

function buildSlides(
  kind: Exclude<CarouselKind, 'auto'>,
  title: string,
  subtitle: string,
  items: ContentItem[],
  count: number,
): CarouselSlideModel[] {
  const n = Math.min(10, Math.max(3, count))
  const mid = Math.max(1, n - 2)
  const filled = padItems(items, mid, title)

  const intro: CarouselSlideModel = {
    role: 'intro',
    kicker: kind === 'product-launch' ? 'Now available' : 'A note for operators',
    title,
    body: subtitle,
  }

  const middle: CarouselSlideModel[] = filled.map((item, index) => {
    if (item.value && kind === 'metrics') {
      return {
        role: 'stat',
        kicker: `0${index + 1}`,
        title: item.label,
        body: item.desc,
        stat: item.value,
        statLabel: item.label,
      }
    }
    if (index === filled.length - 1 && n > 5 && kind === 'thought-leadership') {
      return {
        role: 'quote',
        kicker: 'Keep this',
        title: item.label,
        body: item.desc || 'Taste is a system, not a mood.',
      }
    }
    return {
      role: 'content',
      kicker: `0${index + 1}`,
      title: item.label,
      body: item.desc || item.label,
    }
  })

  const outro: CarouselSlideModel = {
    role: 'outro',
    kicker: 'Next',
    title: kind === 'offer' || kind === 'product-launch' ? 'If this is your season, start here.' : 'Save this. Then run it once.',
    body: 'A calm close beats a loud one. Reply when you are ready.',
  }

  return [intro, ...middle.slice(0, n - 2), outro].slice(0, n)
}

export function generateCarousel(
  prompt: string,
  slideCount: number,
  kind: CarouselKind,
  header: string,
  footer: string,
  brand: string,
  handle: string,
): CarouselModel {
  const parsed = parsePrompt(prompt)
  const resolved = kind === 'auto' ? detectCarouselKind(prompt) : kind
  const title = titleFromPrompt(prompt)
  return {
    kind: resolved,
    title,
    subtitle: parsed.subtitle,
    header,
    footer,
    brand: brand || 'Studio',
    handle: handle || '@studio',
    slides: buildSlides(resolved, title, parsed.subtitle, parsed.items, slideCount),
  }
}
