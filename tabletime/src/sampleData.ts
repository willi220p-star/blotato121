import { PROFESSOR_COLORS, type AppState } from './types'
import { uid } from './scheduler'

export function sampleState(base: AppState): AppState {
  const mehta = {
    id: uid('pr'),
    name: 'Dr. Mehta',
    department: 'IT',
    subjects: ['Networks'],
    color: PROFESSOR_COLORS[0],
  }
  const iyer = {
    id: uid('pr'),
    name: 'Prof. Iyer',
    department: 'IT',
    subjects: ['Databases'],
    color: PROFESSOR_COLORS[1],
  }
  const khan = {
    id: uid('pr'),
    name: 'Dr. Khan',
    department: 'IT',
    subjects: ['Operating Systems'],
    color: PROFESSOR_COLORS[2],
  }

  return {
    ...base,
    settings: { ...base.settings, orgName: 'Riverside College' },
    professors: [mehta, iyer, khan],
    slots: [
      { id: uid('sl'), professorId: mehta.id, subject: 'Networks', day: 'Monday', start: '09:00', durationMinutes: 120, room: '101' },
      { id: uid('sl'), professorId: mehta.id, subject: 'Networks', day: 'Wednesday', start: '09:00', durationMinutes: 120, room: '101' },
      { id: uid('sl'), professorId: iyer.id, subject: 'Databases', day: 'Monday', start: '09:00', durationMinutes: 120, room: '102' },
      { id: uid('sl'), professorId: iyer.id, subject: 'Databases', day: 'Tuesday', start: '10:00', durationMinutes: 90, room: 'Lab' },
      { id: uid('sl'), professorId: khan.id, subject: 'Operating Systems', day: 'Tuesday', start: '09:00', durationMinutes: 180, room: '201' },
      { id: uid('sl'), professorId: khan.id, subject: 'Operating Systems', day: 'Friday', start: '13:00', durationMinutes: 45, room: '201' },
    ],
  }
}
