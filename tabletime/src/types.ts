export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

export type Day = (typeof DAYS)[number]

export interface Availability {
  id: string
  day: Day
  start: string
  end: string
}

export interface Room {
  id: string
  name: string
  block: string
}

export interface Professor {
  id: string
  name: string
  subject: string
  classesNeeded: number
  preferredRoomIds: string[]
  availability: Availability[]
  color: string
}

export interface Placement {
  id: string
  professorId: string
  roomId: string
  day: Day
  start: string
  end: string
}

export interface Conflict {
  id: string
  kind: 'professor' | 'room'
  placementIds: [string, string]
  message: string
}

export interface Suggestion {
  id: string
  professorId: string
  roomId: string
  day: Day
  start: string
  end: string
  reason: string
  score: number
}

export interface Settings {
  orgName: string
  slotHours: number
  dayStart: string
  dayEnd: string
  stepMinutes: number
  activeDays: Day[]
}

export interface AppState {
  settings: Settings
  rooms: Room[]
  professors: Professor[]
  placements: Placement[]
}

export const PROFESSOR_COLORS = [
  '#1f5c4d',
  '#2b4c7e',
  '#6b2d5b',
  '#3d5a1f',
  '#1d4e6b',
  '#0f766e',
  '#4a3f72',
  '#166534',
  '#1e3a5f',
  '#5b2c6f',
]
