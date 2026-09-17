import { DAYS, PROFESSOR_COLORS, type AppState, type ClassSlot, type Day } from './types'
import { fromMinutes, toMinutes, uid } from './scheduler'

const DAY_ALIASES: Record<string, Day> = {
  monday: 'Monday',
  mon: 'Monday',
  tuesday: 'Tuesday',
  tue: 'Tuesday',
  tues: 'Tuesday',
  wednesday: 'Wednesday',
  wed: 'Wednesday',
  thursday: 'Thursday',
  thu: 'Thursday',
  thur: 'Thursday',
  thurs: 'Thursday',
  friday: 'Friday',
  fri: 'Friday',
  saturday: 'Saturday',
  sat: 'Saturday',
  sunday: 'Monday',
  sun: 'Monday',
}

function parseDay(value: string): Day | null {
  const trimmed = value.trim()
  const key = trimmed.toLowerCase()
  if (!key) return null
  if (DAY_ALIASES[key]) return DAY_ALIASES[key]
  return (DAYS as readonly string[]).includes(trimmed) ? (trimmed as Day) : null
}

function parseTime(value: string): string | null {
  const trimmed = value.trim()
  const match = trimmed.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i)
  if (!match) return null
  let hour = Number(match[1])
  const minute = Number(match[2] || 0)
  const mer = match[3]?.toLowerCase()
  if (mer === 'pm' && hour < 12) hour += 12
  if (mer === 'am' && hour === 12) hour = 0
  if (hour > 23 || minute > 59) return null
  return fromMinutes(hour * 60 + minute)
}

function parseDuration(value: string): number | null {
  const trimmed = value.trim().toLowerCase().replace(/\s+/g, ' ')
  if (!trimmed) return null
  const hourMin = trimmed.match(/^(\d+(?:\.\d+)?)\s*h(?:ours?)?(?:\s+(\d+)\s*m(?:in(?:utes?)?)?)?$/)
  if (hourMin) return Math.round(Number(hourMin[1]) * 60 + Number(hourMin[2] || 0))
  const onlyMin = trimmed.match(/^(\d+)\s*m(?:in(?:utes?)?)?$/)
  if (onlyMin) return Number(onlyMin[1])
  const colon = trimmed.match(/^(\d{1,2}):(\d{2})$/)
  if (colon && Number(colon[1]) <= 10) return Number(colon[1]) * 60 + Number(colon[2])
  const number = Number(trimmed)
  if (Number.isFinite(number) && number > 0) {
    return number <= 10 ? Math.round(number * 60) : Math.round(number)
  }
  return null
}

function splitCsvLine(line: string): string[] {
  const out: string[] = []
  let current = ''
  let quoted = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        current += '"'
        i += 1
      } else {
        quoted = !quoted
      }
    } else if ((ch === ',' || ch === '\t' || ch === '|') && !quoted) {
      out.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  out.push(current.trim())
  return out
}

function headerIndex(headers: string[]): Record<string, number> {
  const map: Record<string, number> = {}
  headers.forEach((header, index) => {
    const key = header.toLowerCase().replace(/[^a-z0-9]+/g, '')
    map[key] = index
  })
  return map
}

function pick(row: string[], index: Record<string, number>, names: string[]): string {
  for (const name of names) {
    const i = index[name]
    if (i != null && row[i]) return row[i]
  }
  return ''
}

interface RawRow {
  name: string
  department: string
  subject: string
  day: Day | null
  start: string | null
  durationMinutes: number | null
  room: string
}

function rowsToState(base: AppState, rows: RawRow[]): AppState {
  const professors = [...base.professors]
  const slots: ClassSlot[] = [...base.slots]
  const byName = new Map(professors.map((p) => [p.name.trim().toLowerCase(), p]))

  for (const row of rows) {
    const name = row.name.trim()
    if (!name) continue
    let professor = byName.get(name.toLowerCase())
    if (!professor) {
      professor = {
        id: uid('pr'),
        name,
        department: row.department.trim() || 'General',
        subjects: row.subject ? [row.subject] : [],
        color: PROFESSOR_COLORS[professors.length % PROFESSOR_COLORS.length],
      }
      professors.push(professor)
      byName.set(name.toLowerCase(), professor)
    } else if (row.subject && !professor.subjects.includes(row.subject)) {
      professor.subjects = [...professor.subjects, row.subject]
    } else if (row.department && professor.department === 'General') {
      professor.department = row.department
    }

    if (row.day && row.start && row.durationMinutes && row.durationMinutes > 0) {
      slots.push({
        id: uid('sl'),
        professorId: professor.id,
        subject: row.subject || professor.subjects[0] || 'Class',
        day: row.day,
        start: row.start,
        durationMinutes: row.durationMinutes,
        room: row.room,
      })
    }
  }

  return { ...base, professors, slots }
}

function parseTableRows(lines: string[][]): RawRow[] {
  if (lines.length < 2) return []
  const index = headerIndex(lines[0])
  const rows: RawRow[] = []
  for (const cells of lines.slice(1)) {
    if (cells.every((cell) => !cell)) continue
    const start = parseTime(pick(cells, index, ['start', 'from', 'time', 'begins']))
    const endRaw = pick(cells, index, ['end', 'to', 'until'])
    const durationRaw = pick(cells, index, ['duration', 'hours', 'slot', 'length', 'minutes'])
    let duration = parseDuration(durationRaw)
    if (!duration && start && endRaw) {
      const end = parseTime(endRaw)
      if (end) duration = toMinutes(end) - toMinutes(start)
    }
    rows.push({
      name: pick(cells, index, ['professor', 'name', 'teacher', 'staff']),
      department: pick(cells, index, ['department', 'dept', 'faculty']),
      subject: pick(cells, index, ['subject', 'course', 'class', 'paper']),
      day: parseDay(pick(cells, index, ['day', 'weekday', 'date'])),
      start,
      durationMinutes: duration && duration > 0 ? duration : null,
      room: pick(cells, index, ['room', 'hall', 'venue']),
    })
  }
  return rows
}

export function parseCsv(text: string): RawRow[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map(splitCsvLine)
  return parseTableRows(lines)
}

export function parseMarkdown(text: string): RawRow[] {
  const tableLines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith('|'))
    .map((line) =>
      line
        .replace(/^\|/, '')
        .replace(/\|$/, '')
        .split('|')
        .map((cell) => cell.trim()),
    )
    .filter((cells) => !cells.every((cell) => /^[-:]+$/.test(cell)))
  if (tableLines.length >= 2) return parseTableRows(tableLines)

  const rows: RawRow[] = []
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(
      /[-*]\s*(.+?)[|,]\s*(.+?)[|,]\s*(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday)[|,]\s*(\d{1,2}:\d{2})[|,]\s*(.+)/i,
    )
    if (!match) continue
    rows.push({
      name: match[1].trim(),
      department: 'General',
      subject: match[2].trim(),
      day: parseDay(match[3]),
      start: parseTime(match[4]),
      durationMinutes: parseDuration(match[5]),
      room: '',
    })
  }
  return rows
}

import { importState } from './storage'

export function importAny(base: AppState, filename: string, text: string): AppState {
  const lower = filename.toLowerCase()
  const body = text.replace(/^\uFEFF/, '')
  if (lower.endsWith('.xlsx') || lower.endsWith('.xls')) {
    throw new Error('Save the Excel sheet as CSV (File → Save As → CSV UTF-8) and import that file.')
  }
  if (lower.endsWith('.json')) {
    const parsed = importState(body)
    return {
      ...base,
      ...parsed,
      settings: { ...base.settings, ...parsed.settings },
      professors: parsed.professors.length ? parsed.professors : base.professors,
      slots: parsed.slots.length ? parsed.slots : base.slots,
    }
  }
  const rows = lower.endsWith('.md') ? parseMarkdown(body) : parseCsv(body)
  if (!rows.length) throw new Error('No professor rows found in that file.')
  return rowsToState(base, rows)
}

export function sampleCsv(): string {
  return [
    'Professor,Department,Subject,Day,Start,Duration,Room',
    'Dr. Mehta,IT,Networks,Monday,09:00,2 hours,101',
    'Dr. Mehta,IT,Networks,Wednesday,09:00,2 hours,101',
    'Prof. Iyer,IT,Databases,Monday,09:00,2 hours,102',
    'Prof. Iyer,IT,Databases,Tuesday,10:00,1 hour 30 minutes,Lab',
    'Dr. Khan,IT,Operating Systems,Tuesday,09:00,3 hours,201',
  ].join('\n')
}
