import { describe, expect, it } from 'vitest'
import { greetingFor } from './motion'

describe('greetingFor', () => {
  it('changes with the hour', () => {
    expect(greetingFor(new Date(2026, 8, 12, 8))).toBe('Good morning')
    expect(greetingFor(new Date(2026, 8, 12, 15))).toBe('Good afternoon')
    expect(greetingFor(new Date(2026, 8, 12, 21))).toBe('Good evening')
  })
})
