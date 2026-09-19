import { describe, expect, it } from 'vitest'
import { generateCarousel } from './generateCarousel'
import { generateInfographic } from './generateInfographic'
import { detectKind, parsePrompt } from './parsePrompt'
import { PALETTES } from './themes'

describe('parsePrompt', () => {
  it('detects process lists', () => {
    const idea = parsePrompt('Launch plan\n1. Research\n2. Design\n3. Build\n4. Ship')
    expect(idea.title).toBe('Launch plan')
    expect(idea.items.map((i) => i.label)).toEqual(['Research', 'Design', 'Build', 'Ship'])
    expect(detectKind(idea.title + ' steps')).toBe('process')
  })

  it('detects swot', () => {
    expect(detectKind('SWOT for a bakery')).toBe('swot')
  })
})

describe('generateInfographic', () => {
  it('builds antv syntax', () => {
    const model = generateInfographic(
      'Client onboarding\n1. Call\n2. Quote\n3. Kickoff',
      'process',
      'Studio',
      'Confidential',
      PALETTES[0],
    )
    expect(model.template).toContain('list-row')
    expect(model.syntax).toContain('infographic')
    expect(model.syntax).toContain('Call')
    expect(model.header).toBe('Studio')
  })
})

describe('generateCarousel', () => {
  it('respects slide count with intro and outro', () => {
    const model = generateCarousel(
      'How to brief a designer\n1. Goal\n2. Audience\n3. References',
      5,
      'how-to',
      'Header',
      'Footer',
      'Atelier',
      '@atelier',
    )
    expect(model.slides).toHaveLength(5)
    expect(model.slides[0].role).toBe('intro')
    expect(model.slides.at(-1)?.role).toBe('outro')
  })
})
