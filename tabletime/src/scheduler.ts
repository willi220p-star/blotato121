import {
  DAYS,
  type AppState,
  type Conflict,
  type Day,
  type Placement,
  type Professor,
  type Room,
  type Suggestion,
} from './types'

export function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + (m || 0)
}

export function fromMinutes(mins: number): string {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

export function rangesOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return toMinutes(aStart) < toMinutes(bEnd) && toMinutes(bStart) < toMinutes(aEnd)
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`
}

function roomOrder(rooms: Room[], preferred: string[]): Room[] {
  const preferredSet = new Set(preferred)
  return [
    ...rooms.filter((r) => preferredSet.has(r.id)),
    ...rooms.filter((r) => !preferredSet.has(r.id)),
  ]
}

function isFree(
  placements: Placement[],
  professorId: string,
  roomId: string,
  day: Day,
  start: string,
  end: string,
  ignoreId?: string,
): { ok: true } | { ok: false; why: 'professor' | 'room' } {
  for (const p of placements) {
    if (p.id === ignoreId || p.day !== day) continue
    if (!rangesOverlap(start, end, p.start, p.end)) continue
    if (p.professorId === professorId) return { ok: false, why: 'professor' }
    if (p.roomId === roomId) return { ok: false, why: 'room' }
  }
  return { ok: true }
}

function candidateStarts(availStart: string, availEnd: string, slotMins: number, step: number): string[] {
  const starts: string[] = []
  const first = toMinutes(availStart)
  const last = toMinutes(availEnd) - slotMins
  for (let t = first; t <= last; t += step) {
    starts.push(fromMinutes(t))
  }
  return starts
}

export function findConflicts(
  placements: Placement[],
  professors: Professor[],
  rooms: Room[],
): Conflict[] {
  const conflicts: Conflict[] = []
  const nameOf = (id: string) => professors.find((p) => p.id === id)?.name ?? 'Professor'
  const roomOf = (id: string) => {
    const r = rooms.find((x) => x.id === id)
    return r ? `${r.block} · ${r.name}` : 'Room'
  }

  for (let i = 0; i < placements.length; i++) {
    for (let j = i + 1; j < placements.length; j++) {
      const a = placements[i]
      const b = placements[j]
      if (a.day !== b.day || !rangesOverlap(a.start, a.end, b.start, b.end)) continue
      if (a.professorId === b.professorId) {
        conflicts.push({
          id: uid('cf'),
          kind: 'professor',
          placementIds: [a.id, b.id],
          message: `${nameOf(a.professorId)} is booked twice on ${a.day} (${a.start}–${a.end} and ${b.start}–${b.end}).`,
        })
      }
      if (a.roomId === b.roomId) {
        conflicts.push({
          id: uid('cf'),
          kind: 'room',
          placementIds: [a.id, b.id],
          message: `${roomOf(a.roomId)} is double-booked on ${a.day} (${a.start}–${a.end} and ${b.start}–${b.end}).`,
        })
      }
    }
  }
  return conflicts
}

export function suggestSlots(
  state: AppState,
  professorId: string,
  limit = 6,
): Suggestion[] {
  const professor = state.professors.find((p) => p.id === professorId)
  if (!professor) return []
  const slotMins = Math.round(state.settings.slotHours * 60)
  const step = state.settings.stepMinutes
  const rooms = roomOrder(state.rooms, professor.preferredRoomIds)
  const suggestions: Suggestion[] = []

  for (const avail of professor.availability) {
    if (!state.settings.activeDays.includes(avail.day)) continue
    for (const start of candidateStarts(avail.start, avail.end, slotMins, step)) {
      const end = fromMinutes(toMinutes(start) + slotMins)
      for (const room of rooms) {
        const free = isFree(state.placements, professor.id, room.id, avail.day, start, end)
        if (!free.ok) continue
        const preferred = professor.preferredRoomIds.includes(room.id)
        const dayIndex = DAYS.indexOf(avail.day)
        suggestions.push({
          id: uid('sg'),
          professorId: professor.id,
          roomId: room.id,
          day: avail.day,
          start,
          end,
          reason: preferred
            ? `Fits ${professor.name}'s availability in a preferred room (${room.block} · ${room.name}).`
            : `Fits ${professor.name}'s availability in ${room.block} · ${room.name}.`,
          score: (preferred ? 100 : 0) - dayIndex * 4 - toMinutes(start) / 60,
        })
      }
    }
  }

  suggestions.sort((a, b) => b.score - a.score)
  const seen = new Set<string>()
  const unique: Suggestion[] = []
  for (const s of suggestions) {
    const key = `${s.day}-${s.start}-${s.roomId}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(s)
    if (unique.length >= limit) break
  }
  return unique
}

export function buildTimetable(state: AppState): {
  placements: Placement[]
  unplaced: { professorId: string; remaining: number }[]
} {
  const slotMins = Math.round(state.settings.slotHours * 60)
  const step = state.settings.stepMinutes
  const placements: Placement[] = []
  const unplaced: { professorId: string; remaining: number }[] = []

  for (const professor of state.professors) {
    let remaining = professor.classesNeeded
    const rooms = roomOrder(state.rooms, professor.preferredRoomIds)

    for (const avail of professor.availability) {
      if (remaining <= 0) break
      if (!state.settings.activeDays.includes(avail.day)) continue
      for (const start of candidateStarts(avail.start, avail.end, slotMins, step)) {
        if (remaining <= 0) break
        const end = fromMinutes(toMinutes(start) + slotMins)
        for (const room of rooms) {
          const free = isFree(placements, professor.id, room.id, avail.day, start, end)
          if (!free.ok) continue
          placements.push({
            id: uid('pl'),
            professorId: professor.id,
            roomId: room.id,
            day: avail.day,
            start,
            end,
          })
          remaining -= 1
          break
        }
      }
    }

    if (remaining > 0) {
      unplaced.push({ professorId: professor.id, remaining })
    }
  }

  return { placements, unplaced }
}

export function applySuggestion(suggestion: Suggestion): Placement {
  return {
    id: uid('pl'),
    professorId: suggestion.professorId,
    roomId: suggestion.roomId,
    day: suggestion.day,
    start: suggestion.start,
    end: suggestion.end,
  }
}

export function canApplySuggestion(state: AppState, suggestion: Suggestion): boolean {
  return isFree(
    state.placements,
    suggestion.professorId,
    suggestion.roomId,
    suggestion.day,
    suggestion.start,
    suggestion.end,
  ).ok
}

export function layoutDayColumns(placements: Placement[]): Map<string, { col: number; cols: number }> {
  const sorted = [...placements].sort((a, b) => {
    const startDiff = toMinutes(a.start) - toMinutes(b.start)
    if (startDiff !== 0) return startDiff
    return a.id.localeCompare(b.id)
  })
  const colEnd: number[] = []
  const colOf = new Map<string, number>()

  for (const placement of sorted) {
    const start = toMinutes(placement.start)
    let col = colEnd.findIndex((end) => end <= start)
    if (col === -1) {
      col = colEnd.length
      colEnd.push(toMinutes(placement.end))
    } else {
      colEnd[col] = toMinutes(placement.end)
    }
    colOf.set(placement.id, col)
  }

  const cols = Math.max(colEnd.length, 1)
  const layout = new Map<string, { col: number; cols: number }>()
  for (const placement of placements) {
    layout.set(placement.id, { col: colOf.get(placement.id) ?? 0, cols })
  }
  return layout
}
