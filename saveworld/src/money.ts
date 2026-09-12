import type { AppState, Expense, MonthTotals } from './types'

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function monthKey(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function shiftMonth(month: string, delta: number): string {
  const [year, mon] = month.split('-').map(Number)
  const d = new Date(year, mon - 1 + delta, 1)
  return monthKey(d)
}

export function monthLabel(month: string): string {
  const [year, mon] = month.split('-').map(Number)
  return new Date(year, mon - 1, 1).toLocaleString('en-GB', { month: 'long', year: 'numeric' })
}

export function lastMonths(count: number, end = monthKey()): string[] {
  return Array.from({ length: count }, (_, i) => shiftMonth(end, i - (count - 1)))
}

export function money(amount: number, currency = '$'): string {
  const sign = amount < 0 ? '-' : ''
  return `${sign}${currency}${Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function monthTotals(state: AppState, month: string, personId?: string): MonthTotals {
  const forPerson = (id: string) => !personId || id === personId
  const earnings = state.incomes
    .filter((row) => row.month === month && forPerson(row.personId))
    .reduce((sum, row) => sum + row.amount, 0)
  const spending = state.expenses
    .filter((row) => row.month === month && forPerson(row.personId))
    .reduce((sum, row) => sum + row.amount, 0)
  const investments = state.investments
    .filter((row) => row.month === month && forPerson(row.personId))
    .reduce((sum, row) => sum + row.amount, 0)
  const estimatedSavings = earnings - spending
  const actualSavings = state.actuals
    .filter((row) => row.month === month && forPerson(row.personId))
    .reduce((sum, row) => sum + row.amount, 0)
  return {
    earnings,
    spending,
    estimatedSavings,
    actualSavings,
    difference: actualSavings - estimatedSavings,
    investments,
  }
}

export function spendingByCategory(
  state: AppState,
  month: string,
  personId?: string,
): { categoryId: string; name: string; amount: number }[] {
  const forPerson = (id: string) => !personId || id === personId
  const sums = new Map<string, number>()
  for (const row of state.expenses) {
    if (row.month !== month || !forPerson(row.personId)) continue
    sums.set(row.categoryId, (sums.get(row.categoryId) ?? 0) + row.amount)
  }
  return [...sums.entries()]
    .map(([categoryId, amount]) => ({
      categoryId,
      name: state.categories.find((c) => c.id === categoryId)?.name ?? 'Other',
      amount,
    }))
    .sort((a, b) => b.amount - a.amount)
}

export function copyMonthForward(state: AppState, from: string): AppState {
  const to = shiftMonth(from, 1)
  const clone = <T extends { id: string; month: string }>(rows: T[]) => [
    ...rows,
    ...rows
      .filter((row) => row.month === from)
      .map((row) => ({ ...row, id: uid(row.id.slice(0, 2)), month: to })),
  ]
  return {
    ...state,
    incomes: clone(state.incomes),
    expenses: clone(state.expenses),
    investments: clone(state.investments),
    actuals: state.actuals,
  }
}

export function removePersonRows(state: AppState, personId: string): AppState {
  const drop = <T extends { personId: string }>(rows: T[]) => rows.filter((row) => row.personId !== personId)
  return {
    ...state,
    people: state.people.filter((p) => p.id !== personId),
    incomes: drop(state.incomes),
    expenses: drop(state.expenses),
    investments: drop(state.investments),
    actuals: drop(state.actuals),
  }
}

export function unusedCategory(expenses: Expense[], categoryId: string): boolean {
  return !expenses.some((row) => row.categoryId === categoryId)
}
