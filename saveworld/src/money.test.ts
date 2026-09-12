import { describe, expect, it } from 'vitest'
import { lastMonths, money, monthTotals, shiftMonth } from './money'
import type { AppState } from './types'

function state(partial: Partial<AppState> = {}): AppState {
  return {
    settings: { householdName: 'Test', currency: '$' },
    people: [
      { id: 'a', name: 'Ada', color: '#111' },
      { id: 'b', name: 'Ben', color: '#222' },
    ],
    categories: [{ id: 'food', name: 'Food' }],
    incomes: [],
    expenses: [],
    investments: [],
    actuals: [],
    ...partial,
  }
}

describe('month math', () => {
  it('shifts across year boundaries', () => {
    expect(shiftMonth('2026-01', -1)).toBe('2025-12')
    expect(shiftMonth('2025-12', 1)).toBe('2026-01')
  })

  it('builds 24 months ending on the current key', () => {
    const months = lastMonths(24, '2026-09')
    expect(months).toHaveLength(24)
    expect(months[0]).toBe('2024-10')
    expect(months[23]).toBe('2026-09')
  })
})

describe('monthTotals', () => {
  const household = state({
    incomes: [
      { id: '1', personId: 'a', month: '2026-09', source: 'Job', amount: 4000 },
      { id: '2', personId: 'b', month: '2026-09', source: 'Job', amount: 3000 },
    ],
    expenses: [
      { id: '3', personId: 'a', month: '2026-09', categoryId: 'food', note: '', amount: 500 },
      { id: '4', personId: 'b', month: '2026-09', categoryId: 'food', note: '', amount: 200 },
    ],
    investments: [{ id: '5', personId: 'a', month: '2026-09', name: 'ISA', amount: 100 }],
    actuals: [
      { personId: 'a', month: '2026-09', amount: 3200 },
      { personId: 'b', month: '2026-09', amount: 2900 },
    ],
  })

  it('estimates savings as earnings minus spend', () => {
    const ada = monthTotals(household, '2026-09', 'a')
    expect(ada.earnings).toBe(4000)
    expect(ada.spending).toBe(500)
    expect(ada.estimatedSavings).toBe(3500)
    expect(ada.actualSavings).toBe(3200)
    expect(ada.difference).toBe(-300)
    expect(ada.investments).toBe(100)
  })

  it('sums a joint household dashboard', () => {
    const joint = monthTotals(household, '2026-09')
    expect(joint.earnings).toBe(7000)
    expect(joint.spending).toBe(700)
    expect(joint.estimatedSavings).toBe(6300)
    expect(joint.actualSavings).toBe(6100)
    expect(joint.difference).toBe(-200)
  })

  it('formats money with a minus for shortfalls', () => {
    expect(money(-300, '$')).toBe('-$300.00')
    expect(money(1200, '£')).toBe('£1,200.00')
  })
})
