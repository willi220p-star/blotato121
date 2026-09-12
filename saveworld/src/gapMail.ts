import { money, monthKey, monthLabel, monthTotals, shiftMonth } from './money'
import type { AppState } from './types'

export const GAP_MAIL_TO = ['regmisushant94@gmail.com', 'ishadhakal67@gmail.com'] as const

const SENT_KEY = 'saveworld-gap-mail-v1'

export interface PersonGapLine {
  name: string
  difference: number
  actualSavings: number
  estimatedSavings: number
  short: boolean
}

export interface GapMailPayload {
  month: string
  householdName: string
  subject: string
  message: string
  shortNames: string[]
  together: {
    earnings: number
    spending: number
    estimatedSavings: number
    actualSavings: number
    difference: number
    investments: number
  }
  people: PersonGapLine[]
}

export function closingMonthKey(now = new Date()): string | null {
  const year = now.getFullYear()
  const monthIndex = now.getMonth()
  const day = now.getDate()
  const lastDay = new Date(year, monthIndex + 1, 0).getDate()
  if (day >= lastDay - 1) return monthKey(now)
  if (day <= 3) return shiftMonth(monthKey(now), -1)
  return null
}

export function monthHasActuals(state: AppState, month: string): boolean {
  return state.actuals.some((row) => row.month === month)
}

export function buildGapReport(state: AppState, month: string): GapMailPayload | null {
  if (!monthHasActuals(state, month)) return null

  const together = monthTotals(state, month)
  const people = state.people.map((person) => {
    const totals = monthTotals(state, month, person.id)
    return {
      name: person.name,
      difference: totals.difference,
      actualSavings: totals.actualSavings,
      estimatedSavings: totals.estimatedSavings,
      short: totals.difference < 0,
    }
  })
  const shortNames = people.filter((row) => row.short).map((row) => row.name)
  if (together.difference >= 0 && shortNames.length === 0) return null

  const currency = state.settings.currency
  const label = monthLabel(month)
  const who =
    shortNames.length > 0
      ? shortNames.join(' and ')
      : 'the household'
  const subject = `SaveWorld: ${label} closed short`
  const personLines = people.length
    ? people
        .map((row) => {
          const status = row.short ? 'short' : 'on track'
          return `• ${row.name} (${status}): gap ${money(row.difference, currency)} — actual ${money(row.actualSavings, currency)} vs estimated ${money(row.estimatedSavings, currency)}`
        })
        .join('\n')
    : '• No people added'

  const message = [
    `${state.settings.householdName} finished ${label} behind the estimate.`,
    '',
    `Who was short: ${who}.`,
    '',
    'People',
    personLines,
    '',
    'Together',
    `Earnings: ${money(together.earnings, currency)}`,
    `Spend: ${money(together.spending, currency)}`,
    `Estimated savings: ${money(together.estimatedSavings, currency)}`,
    `Actual savings: ${money(together.actualSavings, currency)}`,
    `Gap: ${money(together.difference, currency)}`,
    `Invested: ${money(together.investments, currency)}`,
  ].join('\n')

  return {
    month,
    householdName: state.settings.householdName,
    subject,
    message,
    shortNames,
    together: {
      earnings: together.earnings,
      spending: together.spending,
      estimatedSavings: together.estimatedSavings,
      actualSavings: together.actualSavings,
      difference: together.difference,
      investments: together.investments,
    },
    people,
  }
}

export function readSentMonths(storage: Pick<Storage, 'getItem'> = localStorage): string[] {
  try {
    const raw = storage.getItem(SENT_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : []
  } catch {
    return []
  }
}

export function hasSentGapMail(
  month: string,
  storage: Pick<Storage, 'getItem'> = localStorage,
): boolean {
  return readSentMonths(storage).includes(month)
}

export function markSentGapMail(
  month: string,
  storage: Pick<Storage, 'getItem' | 'setItem'> = localStorage,
): void {
  const next = new Set(readSentMonths(storage))
  next.add(month)
  storage.setItem(SENT_KEY, JSON.stringify([...next]))
}
