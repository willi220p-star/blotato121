import { describe, expect, it } from 'vitest'
import { buildGapReport, closingMonthKey, hasSentGapMail, markSentGapMail } from './gapMail'
import type { AppState } from './types'

function state(partial: Partial<AppState> = {}): AppState {
  return {
    settings: { householdName: 'Ada & Ben', currency: '$' },
    people: [
      { id: 'a', name: 'Ada', color: '#111' },
      { id: 'b', name: 'Ben', color: '#222' },
    ],
    categories: [{ id: 'food', name: 'Food' }],
    incomes: [
      { id: '1', personId: 'a', month: '2026-08', source: 'Job', amount: 4000 },
      { id: '2', personId: 'b', month: '2026-08', source: 'Job', amount: 3000 },
    ],
    expenses: [
      { id: '3', personId: 'a', month: '2026-08', categoryId: 'food', note: '', amount: 500 },
      { id: '4', personId: 'b', month: '2026-08', categoryId: 'food', note: '', amount: 200 },
    ],
    investments: [{ id: '5', personId: 'a', month: '2026-08', name: 'ISA', amount: 100 }],
    actuals: [
      { personId: 'a', month: '2026-08', amount: 3200 },
      { personId: 'b', month: '2026-08', amount: 2700 },
    ],
    ...partial,
  }
}

describe('closingMonthKey', () => {
  it('reports the current month on the last two days', () => {
    expect(closingMonthKey(new Date(2026, 7, 30))).toBe('2026-08')
    expect(closingMonthKey(new Date(2026, 7, 31))).toBe('2026-08')
  })

  it('reports the previous month in the first three days', () => {
    expect(closingMonthKey(new Date(2026, 8, 1))).toBe('2026-08')
    expect(closingMonthKey(new Date(2026, 8, 3))).toBe('2026-08')
  })

  it('stays quiet mid-month so a reopen does not mail', () => {
    expect(closingMonthKey(new Date(2026, 8, 12))).toBeNull()
    expect(closingMonthKey(new Date(2026, 7, 15))).toBeNull()
  })
})

describe('buildGapReport', () => {
  it('names who was short and includes the household summary', () => {
    const report = buildGapReport(state(), '2026-08')
    expect(report).not.toBeNull()
    expect(report?.shortNames).toEqual(['Ada', 'Ben'])
    expect(report?.subject).toBe('SaveWorld: August 2026 closed short')
    expect(report?.together.difference).toBe(-400)
    expect(report?.message).toContain('Who was short: Ada and Ben.')
    expect(report?.message).toContain('Ada (short): gap -$300.00')
    expect(report?.message).toContain('Ben (short): gap -$100.00')
    expect(report?.message).toContain('Gap: -$400.00')
    expect(report?.message).toContain('Earnings: $7,000.00')
  })

  it('skips months with no bank actuals', () => {
    expect(buildGapReport(state({ actuals: [] }), '2026-08')).toBeNull()
  })

  it('skips a month that met the estimate', () => {
    const ok = state({
      actuals: [
        { personId: 'a', month: '2026-08', amount: 3600 },
        { personId: 'b', month: '2026-08', amount: 2900 },
      ],
    })
    expect(buildGapReport(ok, '2026-08')).toBeNull()
  })

  it('still mails when only one person is short', () => {
    const mixed = state({
      actuals: [
        { personId: 'a', month: '2026-08', amount: 3200 },
        { personId: 'b', month: '2026-08', amount: 2900 },
      ],
    })
    const report = buildGapReport(mixed, '2026-08')
    expect(report?.shortNames).toEqual(['Ada'])
    expect(report?.message).toContain('Ben (on track)')
    expect(report?.together.difference).toBe(-200)
  })
})

describe('sent-mail memory', () => {
  it('remembers a month so a later visit does not send again', () => {
    const memory = new Map<string, string>()
    const storage = {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => {
        memory.set(key, value)
      },
    }
    expect(hasSentGapMail('2026-08', storage)).toBe(false)
    markSentGapMail('2026-08', storage)
    expect(hasSentGapMail('2026-08', storage)).toBe(true)
    expect(hasSentGapMail('2026-09', storage)).toBe(false)
  })
})
