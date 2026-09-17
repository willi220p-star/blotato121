import { describe, expect, it } from 'vitest'
import { importAny, parseCsv, parseMarkdown } from './importFile'
import { durationLabel, findConflicts, fromMinutes, layoutDayColumns, moveSlot, slotEnd, slotsOverlap, snapTime, weekdayFromDate } from './scheduler'
import { sampleState } from './sampleData'
import type { AppState, ClassSlot, Professor } from './types'

const ada: Professor = {
  id: 'p1',
  name: 'Ada',
  department: 'IT',
  subjects: ['Networks'],
  color: '#111',
}
const ben: Professor = {
  id: 'p2',
  name: 'Ben',
  department: 'IT',
  subjects: ['Databases'],
  color: '#222',
}

function slot(partial: Partial<ClassSlot> & Pick<ClassSlot, 'id' | 'professorId'>): ClassSlot {
  return {
    subject: 'IT',
    day: 'Tuesday',
    start: '08:00',
    durationMinutes: 60,
    room: '',
    ...partial,
  }
}

describe('durations', () => {
  it('builds an end time from hours and quarter hours', () => {
    expect(slotEnd({ start: '08:00', durationMinutes: 15 })).toBe('08:15')
    expect(slotEnd({ start: '08:00', durationMinutes: 90 })).toBe('09:30')
    expect(slotEnd({ start: '08:00', durationMinutes: 180 })).toBe('11:00')
    expect(durationLabel(105)).toBe('1h 45m')
    expect(fromMinutes(75)).toBe('01:15')
    expect(snapTime('09:07')).toBe('09:00')
    expect(snapTime('09:08')).toBe('09:15')
    expect(weekdayFromDate('2026-09-15')).toBe('Tuesday')
  })
})

describe('overlaps', () => {
  it('flags the same professor twice at the same time', () => {
    const conflicts = findConflicts(
      [
        slot({ id: 'a', professorId: 'p1', day: 'Tuesday', start: '08:00', durationMinutes: 60 }),
        slot({ id: 'b', professorId: 'p1', day: 'Tuesday', start: '08:00', durationMinutes: 120 }),
      ],
      [ada],
    )
    expect(conflicts.some((c) => c.kind === 'professor')).toBe(true)
  })

  it('flags two professors sharing Tuesday 08:00–09:00', () => {
    const a = slot({ id: 'a', professorId: 'p1', day: 'Tuesday', start: '08:00', durationMinutes: 60 })
    const b = slot({ id: 'b', professorId: 'p2', day: 'Tuesday', start: '08:00', durationMinutes: 60 })
    expect(slotsOverlap(a, b)).toBe(true)
    const conflicts = findConflicts([a, b], [ada, ben])
    expect(conflicts.some((c) => c.kind === 'time')).toBe(true)
    expect(conflicts[0].message).toContain('Ada')
    expect(conflicts[0].message).toContain('Ben')
    const layout = layoutDayColumns([a, b])
    expect(layout.get('a')?.cols).toBe(2)
    expect(layout.get('a')?.col).not.toBe(layout.get('b')?.col)
  })
})

describe('drag', () => {
  it('moves a saved slot onto another day and start', () => {
    const state: AppState = {
      settings: {
        orgName: 'Test',
        dayStart: '08:00',
        dayEnd: '18:00',
        activeDays: ['Monday', 'Tuesday'],
      },
      professors: [ada],
      slots: [slot({ id: 'a', professorId: 'p1', day: 'Monday', start: '09:00', durationMinutes: 120 })],
    }
    const next = moveSlot(state, 'a', 'Tuesday', '08:00')
    expect(next.slots[0].day).toBe('Tuesday')
    expect(next.slots[0].start).toBe('08:00')
  })
})

describe('file import', () => {
  it('reads a csv with professor, subject, day and duration', () => {
    const rows = parseCsv(
      'Professor,Department,Subject,Day,Start,Duration\nDr. Mehta,IT,Networks,Tuesday,08:00,2 hours\n',
    )
    expect(rows).toHaveLength(1)
    expect(rows[0].name).toBe('Dr. Mehta')
    expect(rows[0].day).toBe('Tuesday')
    expect(rows[0].start).toBe('08:00')
    expect(rows[0].durationMinutes).toBe(120)
  })

  it('reads a markdown table', () => {
    const rows = parseMarkdown(`
| Professor | Subject | Day | Start | Duration |
| --- | --- | --- | --- | --- |
| Prof. Iyer | Databases | Monday | 09:00 | 1 hour 30 minutes |
`)
    expect(rows[0].name).toBe('Prof. Iyer')
    expect(rows[0].durationMinutes).toBe(90)
  })

  it('rejects excel workbooks until they are saved as csv', () => {
    expect(() =>
      importAny(
        { settings: { orgName: 'Test', dayStart: '08:00', dayEnd: '18:00', activeDays: ['Monday'] }, professors: [], slots: [] },
        'staff.xlsx',
        'binary-junk',
      ),
    ).toThrow(/CSV/)
  })
})

describe('sample college', () => {
  it('includes a Monday overlap for Mehta and Iyer', () => {
    const college = sampleState({
      settings: {
        orgName: 'Test',
        dayStart: '08:00',
        dayEnd: '18:00',
        activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      },
      professors: [],
      slots: [],
    })
    const conflicts = findConflicts(college.slots, college.professors)
    expect(conflicts.some((c) => c.kind === 'time' && c.message.includes('Monday'))).toBe(true)
  })
})
