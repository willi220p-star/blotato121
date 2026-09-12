import type { AppState, Day } from './types'

const KEY = 'tabletime-state-v1'

export const DEFAULT_STATE: AppState = {
  settings: {
    orgName: 'College IT Services',
    slotHours: 3,
    dayStart: '08:00',
    dayEnd: '18:00',
    stepMinutes: 30,
    activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as Day[],
  },
  rooms: [],
  professors: [],
  placements: [],
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
  if (!parsed.settings || !Array.isArray(parsed.professors) || !Array.isArray(parsed.rooms)) {
    throw new Error('Not a TableTime file')
  }
  return {
    ...DEFAULT_STATE,
    ...parsed,
    settings: { ...DEFAULT_STATE.settings, ...parsed.settings },
    placements: parsed.placements ?? [],
  }
}
