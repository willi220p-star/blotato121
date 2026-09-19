import { describe, expect, it } from 'vitest'
import { coverPrompt, fitType, planRoles, pointsFromText, slideMode } from './slideLayout'

describe('carousel planning', () => {
  it('plans intro, middle ideas, and an outro', () => {
    expect(planRoles(5)).toEqual(['intro', 'stat', 'content', 'content', 'outro'])
    expect(planRoles(6)[0]).toBe('intro')
    expect(planRoles(6).at(-1)).toBe('outro')
  })

  it('uses a full-bleed cover for intro and a split for odd content', () => {
    expect(slideMode('intro', 0)).toBe('cover')
    expect(slideMode('content', 1)).toBe('split')
    expect(slideMode('content', 2)).toBe('fill')
    expect(slideMode('outro', 4)).toBe('cover')
  })

  it('sizes type to fill the box instead of a tiny strip', () => {
    expect(fitType('Workplace access', 900, 400, 40, 120)).toBeGreaterThan(50)
  })

  it('asks cover photos to fill the frame', () => {
    expect(coverPrompt('disability access at work', 'intro')).toMatch(/fills the frame|full-bleed|edge to edge/i)
  })

  it('turns copy into short points', () => {
    expect(pointsFromText('Ramps at every door. Captions on every call. Flexible hours.')).toHaveLength(3)
  })
})
