import { DAYS, type AppState, type Day } from './types'

const KEY = 'tabletime-state-v2'

export const DEFAULT_STATE: AppState = {
  settings: {
    orgName: 'College',
    dayStart: '08:00',
    dayEnd: '18:00',
    activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as Day[],
  },
  professors: [],
  slots: [],
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
      professors: parsed.professors ?? [],
      slots: parsed.slots ?? [],
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
  if (!parsed.settings || !Array.isArray(parsed.professors)) {
    throw new Error('Not a TableTime file')
  }
  return {
    ...DEFAULT_STATE,
    ...parsed,
    settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
    slots: parsed.slots ?? [],
  }
}

export { DAYS, KEY }
