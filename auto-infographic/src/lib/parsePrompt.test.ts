import { describe, expect, it } from 'vitest'
import { detectKind, parsePrompt } from './parsePrompt'

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

  it('does not treat a closing mention of funnel as a funnel layout', () => {
    expect(detectKind('audit their funnel')).toBe('process')
    const idea = parsePrompt(
      'LinkedIn carousel for operators: why messy pipelines kill close rates. Cover the cost of context switching. Run a 3-step weekly review.',
    )
    expect(idea.items.length).toBeGreaterThanOrEqual(2)
    expect(idea.items.some((i) => /pipeline|context|weekly/i.test(`${i.label} ${i.desc}`))).toBe(true)
  })
})

describe('generateCarousel fallback shape', () => {
  it('keeps intro and outro roles when assembling slides from a list', () => {
    const idea = parsePrompt('How to brief a designer\n1. Goal\n2. Audience\n3. References')
    expect(idea.items.map((i) => i.label)).toEqual(['Goal', 'Audience', 'References'])
  })
})
