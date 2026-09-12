import { uid } from './scheduler'
import { PROFESSOR_COLORS, type AppState, type Day } from './types'

const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function avail(day: Day, start: string, end: string) {
  return { id: uid('av'), day, start, end }
}

export function sampleState(base: AppState): AppState {
  const rooms = [
    { id: uid('rm'), name: 'Room 101', block: 'Block A' },
    { id: uid('rm'), name: 'Room 102', block: 'Block A' },
    { id: uid('rm'), name: 'Room 103', block: 'Block A' },
    { id: uid('rm'), name: 'Lab 1', block: 'Block A' },
    { id: uid('rm'), name: 'Room 201', block: 'Block B' },
    { id: uid('rm'), name: 'Room 202', block: 'Block B' },
    { id: uid('rm'), name: 'Room 203', block: 'Block B' },
    { id: uid('rm'), name: 'Seminar Hall', block: 'Block B' },
    { id: uid('rm'), name: 'Room 301', block: 'Block C' },
    { id: uid('rm'), name: 'Room 302', block: 'Block C' },
    { id: uid('rm'), name: 'Computer Lab', block: 'Block C' },
    { id: uid('rm'), name: 'Room 401', block: 'Block D' },
  ]

  const professors = [
    {
      name: 'Dr. Mehta',
      subject: 'Networks',
      classesNeeded: 2,
      days: [
        avail('Monday', '09:00', '15:00'),
        avail('Wednesday', '09:00', '15:00'),
      ],
      rooms: [rooms[0].id, rooms[1].id],
    },
    {
      name: 'Prof. Iyer',
      subject: 'Databases',
      classesNeeded: 3,
      days: [
        avail('Monday', '08:00', '17:00'),
        avail('Tuesday', '08:00', '17:00'),
        avail('Thursday', '08:00', '17:00'),
      ],
      rooms: [rooms[4].id, rooms[10].id],
    },
    {
      name: 'Dr. Khan',
      subject: 'Operating Systems',
      classesNeeded: 2,
      days: [avail('Tuesday', '10:00', '16:00'), avail('Friday', '10:00', '16:00')],
      rooms: [rooms[5].id],
    },
    {
      name: 'Prof. Silva',
      subject: 'Web Engineering',
      classesNeeded: 2,
      days: [avail('Wednesday', '08:00', '14:00'), avail('Friday', '08:00', '14:00')],
      rooms: [rooms[10].id, rooms[6].id],
    },
    {
      name: 'Dr. Chen',
      subject: 'Security',
      classesNeeded: 1,
      days: [avail('Thursday', '13:00', '18:00')],
      rooms: [rooms[7].id],
    },
    {
      name: 'Prof. Nair',
      subject: 'Software Design',
      classesNeeded: 3,
      days: DAYS.map((d) => avail(d, '09:00', '12:00')),
      rooms: [rooms[2].id, rooms[8].id],
    },
  ].map((p, i) => ({
    id: uid('pr'),
    name: p.name,
    subject: p.subject,
    classesNeeded: p.classesNeeded,
    preferredRoomIds: p.rooms,
    availability: p.days,
    color: PROFESSOR_COLORS[i % PROFESSOR_COLORS.length],
  }))

  return {
    ...base,
    settings: {
      ...base.settings,
      orgName: 'Riverside College',
      slotHours: 3,
    },
    rooms,
    professors,
    placements: [],
  }
}
