import type { AppState } from './types'

const KEY = 'saveworld-state-v1'

export const DEFAULT_STATE: AppState = {
  settings: {
    householdName: 'Our household',
    currency: '$',
  },
  people: [],
  categories: [
    { id: 'cat-rent', name: 'Rent' },
    { id: 'cat-food', name: 'Food' },
    { id: 'cat-travel', name: 'Travel' },
    { id: 'cat-bills', name: 'Bills' },
    { id: 'cat-other', name: 'Other' },
  ],
  incomes: [],
  expenses: [],
  investments: [],
  actuals: [],
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(DEFAULT_STATE)
    const parsed = JSON.parse(raw) as AppState
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
      categories: parsed.categories?.length ? parsed.categories : DEFAULT_STATE.categories,
    }
  } catch {
    return structuredClone(DEFAULT_STATE)
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function exportState(state: AppState): string {
  return JSON.stringify(state, null, 2)
}

export function importState(json: string): AppState {
  const parsed = JSON.parse(json) as AppState
  if (!parsed.settings || !Array.isArray(parsed.people)) {
    throw new Error('Not a SaveWorld file')
  }
  return {
    ...DEFAULT_STATE,
    ...parsed,
    settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
  }
}
