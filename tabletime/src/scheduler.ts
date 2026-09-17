import { DAYS, type AppState, type ClassSlot, type Conflict, type Day, type Professor } from './types'

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function fromMinutes(mins: number): string {
  const wrapped = ((mins % (24 * 60)) + 24 * 60) % (24 * 60)
  const h = Math.floor(wrapped / 60)
  const m = wrapped % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function slotEnd(slot: Pick<ClassSlot, 'start' | 'durationMinutes'>): string {
  return fromMinutes(toMinutes(slot.start) + slot.durationMinutes)
}

export function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (!rest) return hours === 1 ? '1 hour' : `${hours} hours`
  return `${hours}h ${rest}m`
}

export function rangesOverlap(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd)
}

export function slotsOverlap(a: ClassSlot, b: ClassSlot): boolean {
  return a.day === b.day && rangesOverlap(a.start, slotEnd(a), b.start, slotEnd(b))
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

export function findConflicts(slots: ClassSlot[], professors: Professor[]): Conflict[] {
  const conflicts: Conflict[] = []
  const nameOf = (id: string) => professors.find((p) => p.id === id)?.name ?? 'Professor'

  for (let i = 0; i < slots.length; i++) {
    for (let j = i + 1; j < slots.length; j++) {
      const a = slots[i]
      const b = slots[j]
      if (!slotsOverlap(a, b)) continue
      if (a.professorId === b.professorId) {
        conflicts.push({
          id: uid('cf'),
          kind: 'professor',
          slotIds: [a.id, b.id],
          message: `${nameOf(a.professorId)} has two classes on ${a.day} (${a.start}–${slotEnd(a)} and ${b.start}–${slotEnd(b)}).`,
        })
      } else {
        conflicts.push({
          id: uid('cf'),
          kind: 'time',
          slotIds: [a.id, b.id],
          message: `${nameOf(a.professorId)} and ${nameOf(b.professorId)} both teach on ${a.day} at ${a.start}–${slotEnd(a)} / ${b.start}–${slotEnd(b)}.`,
        })
      }
    }
  }
  return conflicts
}

export function layoutDayColumns(slots: ClassSlot[]): Map<string, { col: number; cols: number }> {
  const sorted = [...slots].sort((a, b) => {
    const startDiff = toMinutes(a.start) - toMinutes(b.start)
    if (startDiff !== 0) return startDiff
    return a.id.localeCompare(b.id)
  })
  const colEnd: number[] = []
  const colOf = new Map<string, number>()

  for (const slot of sorted) {
    const start = toMinutes(slot.start)
    let col = colEnd.findIndex((end) => end <= start)
    if (col === -1) {
      col = colEnd.length
      colEnd.push(toMinutes(slotEnd(slot)))
    } else {
      colEnd[col] = toMinutes(slotEnd(slot))
    }
    colOf.set(slot.id, col)
  }

  const cols = Math.max(colEnd.length, 1)
  const layout = new Map<string, { col: number; cols: number }>()
  for (const slot of slots) {
    layout.set(slot.id, { col: colOf.get(slot.id) ?? 0, cols })
  }
  return layout
}

export function moveSlot(state: AppState, slotId: string, day: Day, start: string): AppState {
  return {
    ...state,
    slots: state.slots.map((slot) => (slot.id === slotId ? { ...slot, day, start } : slot)),
  }
}

export function hoursInRange(dayStart: string, dayEnd: string): number[] {
  const startH = Math.floor(toMinutes(dayStart) / 60)
  const endH = Math.ceil(toMinutes(dayEnd) / 60)
  return Array.from({ length: Math.max(endH - startH, 1) }, (_, i) => startH + i)
}

export function snapTime(hhmm: string, step = 15): string {
  return fromMinutes(Math.round(toMinutes(hhmm) / step) * step)
}

export function weekdayFromDate(iso: string): Day | null {
  if (!iso) return null
  const date = new Date(`${iso}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const name = names[date.getDay()]
  if (name === 'Sunday') return 'Monday'
  return DAYS.includes(name as Day) ? (name as Day) : null
}

export { DAYS }
