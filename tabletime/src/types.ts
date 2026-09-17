export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export type Day = (typeof DAYS)[number]

export interface Professor {
  id: string
  name: string
  department: string
  subjects: string[]
  color: string
}

export interface ClassSlot {
  id: string
  professorId: string
  subject: string
  day: Day
  start: string
  durationMinutes: number
  room: string
}

export interface Conflict {
  id: string
  kind: 'professor' | 'time'
  slotIds: [string, string]
  message: string
}

export interface Settings {
  orgName: string
  dayStart: string
  dayEnd: string
  activeDays: Day[]
}

export interface AppState {
  settings: Settings
  professors: Professor[]
  slots: ClassSlot[]
}

export const PROFESSOR_COLORS = [
  '#0a84ff',
  '#ff375f',
  '#30d158',
  '#bf5af2',
  '#ff9f0a',
  '#64d2ff',
  '#ffd60a',
  '#ff6482',
]

export const DURATION_OPTIONS: { label: string; minutes: number }[] = [
  { label: '15 minutes', minutes: 15 },
  { label: '30 minutes', minutes: 30 },
  { label: '45 minutes', minutes: 45 },
  { label: '1 hour', minutes: 60 },
  { label: '1 hour 15 minutes', minutes: 75 },
  { label: '1 hour 30 minutes', minutes: 90 },
  { label: '1 hour 45 minutes', minutes: 105 },
  ...Array.from({ length: 9 }, (_, i) => {
    const hours = i + 2
    return { label: `${hours} hours`, minutes: hours * 60 }
  }),
]
