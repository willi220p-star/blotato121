import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { EmptyPoster, Monogram, StageBackdrop } from './HeroArt'
import { importAny, sampleCsv } from './importFile'
import { sampleState } from './sampleData'
import {
  durationLabel,
  findConflicts,
  fromMinutes,
  hoursInRange,
  layoutDayColumns,
  moveSlot,
  slotEnd,
  snapTime,
  toMinutes,
  uid,
  weekdayFromDate,
} from './scheduler'
import { exportState, loadState, saveState } from './storage'
import {
  DAYS,
  DURATION_OPTIONS,
  PROFESSOR_COLORS,
  type AppState,
  type ClassSlot,
  type Day,
  type Professor,
} from './types'
import './App.css'

type Tab = 'people' | 'classes' | 'week'

const PX_PER_HOUR = 72

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [tab, setTab] = useState<Tab>('people')
  const [notice, setNotice] = useState('')
  const [selectedProfessorId, setSelectedProfessorId] = useState('')

  useEffect(() => {
    saveState(state)
  }, [state])

  const activeProfessorId =
    state.professors.some((p) => p.id === selectedProfessorId)
      ? selectedProfessorId
      : (state.professors[0]?.id ?? '')

  const conflicts = useMemo(
    () => findConflicts(state.slots, state.professors),
    [state.slots, state.professors],
  )

  function flash(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 4200)
  }

  async function ingestFile(file: File) {
    try {
      if (/\.xlsx?$/i.test(file.name)) {
        throw new Error('Save the Excel sheet as CSV (File → Save As → CSV UTF-8) and import that file.')
      }
      const next = importAny(state, file.name, await file.text())
      setState(next)
      if (next.professors[0]) setSelectedProfessorId(next.professors[0].id)
      flash(`Imported ${next.professors.length} professor${next.professors.length === 1 ? '' : 's'} and ${next.slots.length} class slot${next.slots.length === 1 ? '' : 's'}.`)
      if (next.slots.length) setTab('week')
    } catch (error) {
      flash(error instanceof Error ? error.message : 'Import failed.')
    }
  }

  function createTimetable() {
    if (!state.professors.length) {
      flash('Add a professor first.')
      setTab('people')
      return
    }
    if (!state.slots.length) {
      flash('Add at least one class slot, then create the week.')
      setTab('classes')
      return
    }
    setTab('week')
    flash(
      conflicts.length
        ? `Week laid out. ${conflicts.length} overlap${conflicts.length === 1 ? '' : 's'} marked on the grid.`
        : `Week laid out with ${state.slots.length} class${state.slots.length === 1 ? '' : 'es'}.`,
    )
  }

  return (
    <div className="app">
      <div className="stage">
        <StageBackdrop />
        <header className="hero">
          <p className="eyebrow">Campus week builder</p>
          <h1>TableTime</h1>
          <p className="lede">
            Add people. Give each one a class length. Drop those slots on the week. Overlaps stay
            visible — same professor twice, or two professors at the same hour.
          </p>
          <div className="hero-actions">
            <button className="primary" onClick={createTimetable}>
              Create timetable
            </button>
            <button
              onClick={() => {
                const next = sampleState(state)
                setState(next)
                setSelectedProfessorId(next.professors[0]?.id ?? '')
                setTab('week')
                flash('Sample college loaded. Monday 09:00 already overlaps.')
              }}
            >
              Load sample
            </button>
            <FileDrop onFile={ingestFile} />
          </div>
        </header>
      </div>

      <nav className="tabs" aria-label="TableTime steps">
        {(
          [
            ['people', '1. People'],
            ['classes', '2. Class slots'],
            ['week', '3. Week'],
          ] as const
        ).map(([id, label]) => (
          <button key={id} className={tab === id ? 'nav on' : 'nav'} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
        <span className="org-pill">{state.settings.orgName}</span>
      </nav>

      {notice ? <div className="notice">{notice}</div> : null}

      {tab === 'people' ? (
        <PeopleView
          state={state}
          setState={setState}
          onContinue={(id) => {
            setSelectedProfessorId(id)
            setTab('classes')
          }}
        />
      ) : null}
      {tab === 'classes' ? (
        <ClassesView
          state={state}
          setState={setState}
          selectedProfessorId={activeProfessorId}
          setSelectedProfessorId={setSelectedProfessorId}
          onCreate={createTimetable}
        />
      ) : null}
      {tab === 'week' ? (
        <WeekView
          state={state}
          setState={setState}
          conflicts={conflicts}
          onImport={ingestFile}
        />
      ) : null}
    </div>
  )
}

function FileDrop({ onFile }: { onFile: (file: File) => void }) {
  return (
    <label className="file">
      Import file
      <input
        type="file"
        hidden
        accept=".csv,.md,.json,.txt,.tsv,text/csv,text/markdown,application/json,.xlsx,.xls"
        onChange={(event) => {
          const file = event.target.files?.[0]
          if (file) onFile(file)
          event.target.value = ''
        }}
      />
    </label>
  )
}

function PeopleView({
  state,
  setState,
  onContinue,
}: {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  onContinue: (professorId: string) => void
}) {
  const [draft, setDraft] = useState<Professor>(() => emptyProfessor(state.professors.length))
  const [subjectsText, setSubjectsText] = useState('')
  const [error, setError] = useState('')

  function save() {
    if (!draft.name.trim()) {
      setError('Type the professor’s name.')
      return
    }
    const subjects = splitSubjects(subjectsText)
    const saved: Professor = {
      ...draft,
      name: draft.name.trim(),
      department: draft.department.trim() || 'General',
      subjects,
    }
    const exists = state.professors.some((p) => p.id === saved.id)
    setState({
      ...state,
      professors: exists
        ? state.professors.map((p) => (p.id === saved.id ? saved : p))
        : [...state.professors, saved],
    })
    setDraft(emptyProfessor(state.professors.length + (exists ? 0 : 1)))
    setSubjectsText('')
    setError('')
    onContinue(saved.id)
  }

  return (
    <section className="panel">
      <div className="split">
        <div>
          <h2>Professors</h2>
          <p className="lede">Name, department, and the subjects they teach. Timing comes next.</p>
        </div>
        <label className="org-field">
          College name
          <input
            value={state.settings.orgName}
            onChange={(e) =>
              setState({ ...state, settings: { ...state.settings, orgName: e.target.value } })
            }
          />
        </label>
      </div>

      <form
        className="people-form"
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
      >
        <label>
          Professor name
          <input
            value={draft.name}
            placeholder="Dr. Mehta"
            autoComplete="name"
            onChange={(e) => {
              setDraft({ ...draft, name: e.target.value })
              if (error) setError('')
            }}
          />
        </label>
        <label>
          Department
          <input
            value={draft.department}
            placeholder="IT"
            onChange={(e) => setDraft({ ...draft, department: e.target.value })}
          />
        </label>
        <label className="span-2">
          Subjects
          <input
            value={subjectsText}
            placeholder="Networks, Databases"
            onChange={(e) => setSubjectsText(e.target.value)}
          />
        </label>
        <div className="actions span-2">
          <button className="primary" type="submit">
            Save professor
          </button>
        </div>
        {error ? <p className="field-error span-2">{error}</p> : null}
      </form>

      {state.professors.length === 0 ? <EmptyPoster /> : null}

      <ul className="people-grid">
        {state.professors.map((professor) => {
          const count = state.slots.filter((s) => s.professorId === professor.id).length
          return (
            <li key={professor.id} className="person-card" style={{ ['--ink' as string]: professor.color }}>
              <Monogram name={professor.name} color={professor.color} />
              <div>
                <strong>{professor.name}</strong>
                <span>
                  {professor.department}
                  {professor.subjects.length ? ` · ${professor.subjects.join(', ')}` : ''}
                </span>
                <em>
                  {count} class slot{count === 1 ? '' : 's'}
                </em>
              </div>
              <div className="row tight">
                <button
                  type="button"
                  onClick={() => {
                    setDraft(professor)
                    setSubjectsText(professor.subjects.join(', '))
                  }}
                >
                  Edit
                </button>
                <button className="text" type="button" onClick={() => onContinue(professor.id)}>
                  Add slots
                </button>
                <button
                  className="text"
                  type="button"
                  onClick={() =>
                    setState({
                      ...state,
                      professors: state.professors.filter((p) => p.id !== professor.id),
                      slots: state.slots.filter((s) => s.professorId !== professor.id),
                    })
                  }
                >
                  Remove
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function ClassesView({
  state,
  setState,
  selectedProfessorId,
  setSelectedProfessorId,
  onCreate,
}: {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  selectedProfessorId: string
  setSelectedProfessorId: (id: string) => void
  onCreate: () => void
}) {
  const professor = state.professors.find((p) => p.id === selectedProfessorId) ?? state.professors[0]
  const [subject, setSubject] = useState(professor?.subjects[0] ?? '')
  const [day, setDay] = useState<Day>('Monday')
  const [date, setDate] = useState('')
  const [start, setStart] = useState('09:00')
  const [durationMinutes, setDurationMinutes] = useState(120)
  const [room, setRoom] = useState('')
  const [error, setError] = useState('')

  const end = fromMinutes(toMinutes(start) + durationMinutes)

  function setEnd(value: string) {
    const minutes = toMinutes(value) - toMinutes(start)
    if (minutes >= 15) setDurationMinutes(minutes)
  }

  function saveSlot() {
    if (!professor) {
      setError('Save a professor on the People page first.')
      return
    }
    if (!subject.trim()) {
      setError('Name the subject for this class.')
      return
    }
    const slot: ClassSlot = {
      id: uid('sl'),
      professorId: professor.id,
      subject: subject.trim(),
      day,
      start: snapTime(start),
      durationMinutes,
      room: room.trim(),
    }
    const subjects = professor.subjects.includes(slot.subject)
      ? professor.subjects
      : [...professor.subjects, slot.subject]
    setState({
      ...state,
      professors: state.professors.map((p) => (p.id === professor.id ? { ...p, subjects } : p)),
      slots: [...state.slots, slot],
    })
    setRoom('')
    setError('')
  }

  if (!state.professors.length) {
    return (
      <section className="panel">
        <h2>Class slots</h2>
        <p className="lede">Add a professor first, then pick how long they teach.</p>
        <EmptyPoster />
      </section>
    )
  }

  return (
    <section className="panel">
      <h2>Class slots</h2>
      <p className="lede">
        Choose the person, then the length — 15 minutes up to 10 hours. Set the day (or a date) and
        from–to. The slot is saved under that name, ready to drag onto the week.
      </p>

      <div className="prof-pills">
        {state.professors.map((p) => (
          <button
            key={p.id}
            type="button"
            className={p.id === professor?.id ? 'pill on' : 'pill'}
            style={{ ['--ink' as string]: p.color }}
            onClick={() => {
              setSelectedProfessorId(p.id)
              setSubject(p.subjects[0] ?? '')
            }}
          >
            <Monogram name={p.name} color={p.color} />
            {p.name}
          </button>
        ))}
      </div>

      <form
        className="slot-form"
        onSubmit={(event) => {
          event.preventDefault()
          saveSlot()
        }}
      >
        <label>
          Subject
          <input
            list="subject-list"
            value={subject}
            placeholder="Networks"
            onChange={(e) => setSubject(e.target.value)}
          />
          <datalist id="subject-list">
            {(professor?.subjects ?? []).map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
        </label>
        <label>
          Day
          <select value={day} onChange={(e) => setDay(e.target.value as Day)}>
            {DAYS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Date (optional)
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              const nextDay = weekdayFromDate(e.target.value)
              if (nextDay) setDay(nextDay)
            }}
          />
        </label>
        <label>
          From
          <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
        </label>
        <label>
          To
          <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        </label>
        <label>
          Room (optional)
          <input value={room} placeholder="101" onChange={(e) => setRoom(e.target.value)} />
        </label>
        <fieldset className="durations">
          <legend>How long is the class?</legend>
          <div className="chips">
            {DURATION_OPTIONS.map((option) => (
              <button
                key={option.minutes}
                type="button"
                className={durationMinutes === option.minutes ? 'chip on' : 'chip'}
                onClick={() => setDurationMinutes(option.minutes)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div className="actions">
          <button className="primary" type="submit">
            Save slot under {professor?.name ?? 'professor'}
          </button>
          <button type="button" onClick={onCreate}>
            Create timetable
          </button>
        </div>
        {error ? <p className="field-error">{error}</p> : null}
      </form>

      <ul className="slot-groups">
        {state.professors.map((p) => {
          const slots = state.slots.filter((s) => s.professorId === p.id)
          return (
            <li key={p.id} className="slot-group">
              <header>
                <Monogram name={p.name} color={p.color} />
                <div>
                  <strong>{p.name}</strong>
                  <span>{p.department}</span>
                </div>
              </header>
              {slots.length === 0 ? (
                <p className="empty">No slots yet for {p.name}.</p>
              ) : (
                <ul>
                  {slots.map((slot) => (
                    <li
                      key={slot.id}
                      className="slot-chip"
                      draggable
                      onDragStart={(event) => {
                        lastDragId = slot.id
                        event.dataTransfer.setData('text/plain', slot.id)
                      }}
                    >
                      <b>{slot.subject}</b>
                      <span>
                        {slot.day} {slot.start}–{slotEnd(slot)} · {durationLabel(slot.durationMinutes)}
                        {slot.room ? ` · ${slot.room}` : ''}
                      </span>
                      <button
                        className="text"
                        type="button"
                        onClick={() =>
                          setState({ ...state, slots: state.slots.filter((s) => s.id !== slot.id) })
                        }
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function WeekView({
  state,
  setState,
  conflicts,
  onImport,
}: {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  conflicts: ReturnType<typeof findConflicts>
  onImport: (file: File) => void
}) {
  const conflictIds = new Set(conflicts.flatMap((c) => c.slotIds))
  const hours = hoursInRange(state.settings.dayStart, state.settings.dayEnd)
  const days = state.settings.activeDays.length ? state.settings.activeDays : [...DAYS]

  function onDrop(day: Day, clientY: number, column: HTMLElement) {
    const id = lastDragId
    if (!id) return
    const rect = column.getBoundingClientRect()
    const minutesFromTop = ((clientY - rect.top) / PX_PER_HOUR) * 60
    const start = snapTime(fromMinutes(toMinutes(state.settings.dayStart) + minutesFromTop))
    setState((current) => moveSlot(current, id, day, start))
  }

  return (
    <section className="panel wide">
      <div className="split">
        <div>
          <h2>Week board</h2>
          <p className="lede">
            Drag a saved slot onto a day and hour. Two classes on the same hour sit side by side and
            glow as an overlap.
          </p>
          <p className="stats">
            <strong>{state.slots.length}</strong> classes
            <span>·</span>
            <strong>{conflicts.length}</strong> overlap{conflicts.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="actions">
          <FileDrop onFile={onImport} />
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([exportState(state)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'tabletime.json'
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => {
              const blob = new Blob([sampleCsv()], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'tabletime-sample.csv'
              a.click()
              URL.revokeObjectURL(url)
            }}
          >
            Sample CSV
          </button>
        </div>
      </div>

      {conflicts.length ? (
        <aside className="alert">
          <h3>Overlaps on this week</h3>
          {conflicts.map((c) => (
            <p key={c.id}>{c.message}</p>
          ))}
        </aside>
      ) : null}

      <div className="week-shell">
        <aside className="rail">
          <h3>Drag from here</h3>
          {state.professors.length === 0 ? <EmptyPoster /> : null}
          {state.professors.map((p) => (
            <div key={p.id} className="rail-person">
              <header>
                <Monogram name={p.name} color={p.color} />
                <strong>{p.name}</strong>
              </header>
              {state.slots
                .filter((s) => s.professorId === p.id)
                .map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    className={conflictIds.has(slot.id) ? 'rail-slot clash' : 'rail-slot'}
                    draggable
                    onDragStart={() => {
                      lastDragId = slot.id
                    }}
                    style={{ borderColor: p.color }}
                  >
                    <b>{slot.subject}</b>
                    <span>
                      {slot.day.slice(0, 3)} {slot.start} · {durationLabel(slot.durationMinutes)}
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </aside>

        <div className="board" role="grid" aria-label="Weekly timetable">
          <div className="board-head">
            <span className="time-gutter" />
            {days.map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="board-body" style={{ height: hours.length * PX_PER_HOUR }}>
            <div className="time-gutter">
              {hours.map((hour) => (
                <div key={hour} className="hour-label" style={{ height: PX_PER_HOUR }}>
                  {String(hour).padStart(2, '0')}:00
                </div>
              ))}
            </div>
            {days.map((day) => {
              const daySlots = state.slots.filter((s) => s.day === day)
              const layout = layoutDayColumns(daySlots)
              return (
                <div
                  key={day}
                  className="day-col"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => onDrop(day, event.clientY, event.currentTarget)}
                >
                  {hours.map((hour) => (
                    <div key={hour} className="hour-line" style={{ height: PX_PER_HOUR }} />
                  ))}
                  {daySlots.map((slot) => {
                    const professor = state.professors.find((p) => p.id === slot.professorId)
                    const place = layout.get(slot.id) ?? { col: 0, cols: 1 }
                    const top =
                      ((toMinutes(slot.start) - toMinutes(state.settings.dayStart)) / 60) * PX_PER_HOUR
                    const height = (slot.durationMinutes / 60) * PX_PER_HOUR
                    const width = 100 / place.cols
                    return (
                      <article
                        key={slot.id}
                        className={conflictIds.has(slot.id) ? 'block clash' : 'block'}
                        draggable
                        onDragStart={() => {
                          lastDragId = slot.id
                        }}
                        style={{
                          top,
                          height: Math.max(height, 28),
                          left: `calc(${place.col * width}% + 4px)`,
                          width: `calc(${width}% - 8px)`,
                          background: professor?.color ?? '#1f4bff',
                        }}
                      >
                        <strong>{professor?.name}</strong>
                        <span>{slot.subject}</span>
                        <span>
                          {slot.start}–{slotEnd(slot)}
                        </span>
                        {conflictIds.has(slot.id) ? <b className="clash-tag">Overlap</b> : null}
                      </article>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

let lastDragId = ''

function emptyProfessor(index: number): Professor {
  return {
    id: uid('pr'),
    name: '',
    department: '',
    subjects: [],
    color: PROFESSOR_COLORS[index % PROFESSOR_COLORS.length],
  }
}

function splitSubjects(value: string): string[] {
  return value
    .split(/[,/|]/)
    .map((item) => item.trim())
    .filter(Boolean)
}
