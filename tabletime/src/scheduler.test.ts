import { describe, expect, it } from 'vitest'
import {
  applySuggestion,
  buildTimetable,
  canApplySuggestion,
  findConflicts,
  layoutDayColumns,
  rangesOverlap,
  suggestSlots,
} from './scheduler'
import { sampleState } from './sampleData'
import type { AppState, Professor, Room } from './types'

const rooms: Room[] = [
  { id: 'r1', name: '101', block: 'A' },
  { id: 'r2', name: '102', block: 'A' },
]

function professor(partial: Partial<Professor> & Pick<Professor, 'id' | 'name'>): Professor {
  return {
    subject: 'IT',
    classesNeeded: 1,
    preferredRoomIds: ['r1'],
    availability: [],
    color: '#1f5c4d',
    ...partial,
  }
}

function state(professors: Professor[], placements: AppState['placements'] = []): AppState {
  return {
    settings: {
      orgName: 'Test',
      slotHours: 3,
      dayStart: '08:00',
      dayEnd: '18:00',
      stepMinutes: 60,
      activeDays: ['Monday', 'Tuesday', 'Wednesday'],
    },
    rooms,
    professors,
    placements,
  }
}

describe('rangesOverlap', () => {
  it('detects crossing hours', () => {
    expect(rangesOverlap('09:00', '12:00', '11:00', '14:00')).toBe(true)
    expect(rangesOverlap('09:00', '12:00', '12:00', '15:00')).toBe(false)
  })
})

describe('buildTimetable', () => {
  it('places a 3-hour class inside availability', () => {
    const result = buildTimetable(
      state([
        professor({
          id: 'p1',
          name: 'Ada',
          classesNeeded: 1,
          availability: [{ id: 'a1', day: 'Monday', start: '09:00', end: '15:00' }],
        }),
      ]),
    )
    expect(result.placements).toHaveLength(1)
    expect(result.placements[0].start).toBe('09:00')
    expect(result.placements[0].end).toBe('12:00')
    expect(result.unplaced).toHaveLength(0)
  })

  it('does not double-book a room', () => {
    const result = buildTimetable(
      state([
        professor({
          id: 'p1',
          name: 'Ada',
          preferredRoomIds: ['r1'],
          availability: [{ id: 'a1', day: 'Monday', start: '09:00', end: '12:00' }],
        }),
        professor({
          id: 'p2',
          name: 'Ben',
          preferredRoomIds: ['r1'],
          availability: [{ id: 'a2', day: 'Monday', start: '09:00', end: '12:00' }],
        }),
      ]),
    )
    expect(result.placements).toHaveLength(2)
    expect(new Set(result.placements.map((p) => p.roomId)).size).toBe(2)
  })

  it('reports leftover classes when availability is too small', () => {
    const result = buildTimetable(
      state([
        professor({
          id: 'p1',
          name: 'Ada',
          classesNeeded: 2,
          availability: [{ id: 'a1', day: 'Monday', start: '09:00', end: '12:00' }],
        }),
      ]),
    )
    expect(result.placements).toHaveLength(1)
    expect(result.unplaced).toEqual([{ professorId: 'p1', remaining: 1 }])
  })
})

describe('conflicts and suggestions', () => {
  it('flags two classes for the same professor at the same time', () => {
    const conflicts = findConflicts(
      [
        { id: 'x', professorId: 'p1', roomId: 'r1', day: 'Monday', start: '09:00', end: '12:00' },
        { id: 'y', professorId: 'p1', roomId: 'r2', day: 'Monday', start: '10:00', end: '13:00' },
      ],
      [professor({ id: 'p1', name: 'Ada' })],
      rooms,
    )
    expect(conflicts.some((c) => c.kind === 'professor')).toBe(true)
  })

  it('suggests another 3-hour window and applySuggestion keeps it', () => {
    const current = state(
      [
        professor({
          id: 'p1',
          name: 'Ada',
          classesNeeded: 2,
          availability: [
            { id: 'a1', day: 'Monday', start: '09:00', end: '12:00' },
            { id: 'a2', day: 'Tuesday', start: '09:00', end: '15:00' },
          ],
        }),
      ],
      [{ id: 'x', professorId: 'p1', roomId: 'r1', day: 'Monday', start: '09:00', end: '12:00' }],
    )
    const suggestions = suggestSlots(current, 'p1', 3)
    expect(suggestions.length).toBeGreaterThan(0)
    expect(suggestions[0].day).toBe('Tuesday')
    const placed = applySuggestion(suggestions[0])
    expect(placed.start < placed.end).toBe(true)
    expect(placed.professorId).toBe('p1')
  })

  it('refuses a suggestion that would overlap the same professor', () => {
    const current = state(
      [
        professor({
          id: 'p1',
          name: 'Ada',
          availability: [{ id: 'a1', day: 'Monday', start: '09:00', end: '15:00' }],
        }),
      ],
      [{ id: 'x', professorId: 'p1', roomId: 'r1', day: 'Monday', start: '09:00', end: '12:00' }],
    )
    expect(
      canApplySuggestion(current, {
        id: 'sg',
        professorId: 'p1',
        roomId: 'r2',
        day: 'Monday',
        start: '10:00',
        end: '13:00',
        reason: 'overlap',
        score: 1,
      }),
    ).toBe(false)
  })
})

describe('sample college', () => {
  it('builds 13 classes with no clashes or duplicate professor-day starts', () => {
    const college = sampleState({
      settings: {
        orgName: 'Test',
        slotHours: 3,
        dayStart: '08:00',
        dayEnd: '18:00',
        stepMinutes: 60,
        activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      rooms: [],
      professors: [],
      placements: [],
    })
    const result = buildTimetable(college)
    expect(result.placements).toHaveLength(13)
    expect(result.unplaced).toHaveLength(0)
    expect(findConflicts(result.placements, college.professors, college.rooms)).toHaveLength(0)
    const keys = result.placements.map((p) => `${p.professorId}-${p.day}-${p.start}`)
    expect(new Set(keys).size).toBe(keys.length)
  })
})

describe('layoutDayColumns', () => {
  it('puts two same-time rooms in separate columns', () => {
    const layout = layoutDayColumns([
      { id: 'a', professorId: 'p1', roomId: 'r1', day: 'Monday', start: '09:00', end: '12:00' },
      { id: 'b', professorId: 'p2', roomId: 'r2', day: 'Monday', start: '09:00', end: '12:00' },
    ])
    expect(layout.get('a')?.cols).toBe(2)
    expect(layout.get('a')?.col).not.toBe(layout.get('b')?.col)
  })
})
