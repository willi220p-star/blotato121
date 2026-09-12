import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import {
  applySuggestion,
  buildTimetable,
  canApplySuggestion,
  findConflicts,
  layoutDayColumns,
  suggestSlots,
  toMinutes,
  uid,
} from './scheduler'
import { sampleState } from './sampleData'
import { exportState, importState, loadState, saveState } from './storage'
import { DAYS, PROFESSOR_COLORS, type AppState, type Day, type Professor, type Suggestion } from './types'
import './App.css'

type Tab = 'setup' | 'rooms' | 'professors' | 'timetable'

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [tab, setTab] = useState<Tab>('setup')
  const [notice, setNotice] = useState('')
  const [unplaced, setUnplaced] = useState<{ professorId: string; remaining: number }[]>([])
  const [openSuggestions, setOpenSuggestions] = useState<Record<string, Suggestion[]>>({})

  useEffect(() => {
    saveState(state)
  }, [state])

  const conflicts = useMemo(
    () => findConflicts(state.placements, state.professors, state.rooms),
    [state.placements, state.professors, state.rooms],
  )

  function flash(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 4000)
  }

  function generate() {
    if (state.rooms.length === 0) {
      flash('Add rooms first.')
      setTab('rooms')
      return
    }
    if (state.professors.length === 0) {
      flash('Add professors first.')
      setTab('professors')
      return
    }
    const result = buildTimetable(state)
    setState((s) => ({ ...s, placements: result.placements }))
    setUnplaced(result.unplaced)
    const next: Record<string, Suggestion[]> = {}
    for (const item of result.unplaced) {
      next[item.professorId] = suggestSlots({ ...state, placements: result.placements }, item.professorId)
    }
    setOpenSuggestions(next)
    setTab('timetable')
    flash(
      result.unplaced.length
        ? `Timetable built. ${result.unplaced.length} professor(s) still need a slot — see suggestions.`
        : `Timetable built with ${result.placements.length} class${result.placements.length === 1 ? '' : 'es'}.`,
    )
  }

  function confirmSuggestion(suggestion: Suggestion) {
    if (!canApplySuggestion(state, suggestion)) {
      flash('That slot now overlaps a professor or room. Pick another free slot.')
      setOpenSuggestions((prev) => ({
        ...prev,
        [suggestion.professorId]: suggestSlots(state, suggestion.professorId),
      }))
      return
    }
    const placement = applySuggestion(suggestion)
    const placements = [...state.placements, placement]
    setState((s) => ({ ...s, placements }))
    setUnplaced((rows) =>
      rows
        .map((row) =>
          row.professorId === suggestion.professorId ? { ...row, remaining: row.remaining - 1 } : row,
        )
        .filter((row) => row.remaining > 0),
    )
    setOpenSuggestions((prev) => {
      const nextState = { ...state, placements }
      return {
        ...prev,
        [suggestion.professorId]: suggestSlots(nextState, suggestion.professorId),
      }
    })
    flash('Slot confirmed and added to the timetable.')
  }

  function refreshSuggestions(professorId: string) {
    setOpenSuggestions((prev) => ({
      ...prev,
      [professorId]: suggestSlots(state, professorId),
    }))
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <p className="eyebrow">IT service management</p>
          <h1>TableTime</h1>
          <p className="org">{state.settings.orgName}</p>
        </div>
        <nav>
          {(
            [
              ['setup', '1. Slot setup'],
              ['rooms', '2. Rooms'],
              ['professors', '3. Professors'],
              ['timetable', '4. Timetable'],
            ] as const
          ).map(([id, label]) => (
            <button key={id} className={tab === id ? 'nav on' : 'nav'} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </nav>
      </header>

      {notice ? <div className="notice">{notice}</div> : null}

      {tab === 'setup' ? (
        <SetupView
          state={state}
          setState={setState}
          onContinue={() => setTab('rooms')}
          onSample={() => {
            setState(sampleState(state))
            setUnplaced([])
            setOpenSuggestions({})
            flash('Sample college loaded. Generate the timetable when you are ready.')
          }}
        />
      ) : null}
      {tab === 'rooms' ? (
        <RoomsView state={state} setState={setState} onContinue={() => setTab('professors')} />
      ) : null}
      {tab === 'professors' ? (
        <ProfessorsView state={state} setState={setState} onGenerate={generate} />
      ) : null}
      {tab === 'timetable' ? (
        <TimetableView
          state={state}
          setState={setState}
          conflicts={conflicts}
          unplaced={unplaced}
          suggestions={openSuggestions}
          onGenerate={generate}
          onConfirm={confirmSuggestion}
          onSuggest={refreshSuggestions}
          onImport={(json) => {
            try {
              setState(importState(json))
              setUnplaced([])
              setOpenSuggestions({})
              flash('Imported timetable file.')
            } catch (error) {
              flash(error instanceof Error ? error.message : 'Import failed.')
            }
          }}
        />
      ) : null}
    </div>
  )
}

function SetupView({
  state,
  setState,
  onContinue,
  onSample,
}: {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  onContinue: () => void
  onSample: () => void
}) {
  const s = state.settings
  return (
    <section className="panel">
      <h2>First page — slot length and campus hours</h2>
      <p className="lede">
        Set how long each class is. TableTime then cuts every professor’s availability into those
        blocks. Example: 3 hours means a professor free 09:00–15:00 can take 09:00–12:00 and
        12:00–15:00.
      </p>
      <div className="grid two">
        <label>
          Organization
          <input
            value={s.orgName}
            onChange={(e) => setState({ ...state, settings: { ...s, orgName: e.target.value } })}
          />
        </label>
        <label>
          Hours per class slot
          <input
            type="number"
            min={1}
            max={8}
            step={0.5}
            value={s.slotHours}
            onChange={(e) =>
              setState({ ...state, settings: { ...s, slotHours: Number(e.target.value) || 1 } })
            }
          />
        </label>
        <label>
          Campus opens
          <input
            type="time"
            value={s.dayStart}
            onChange={(e) => setState({ ...state, settings: { ...s, dayStart: e.target.value } })}
          />
        </label>
        <label>
          Campus closes
          <input
            type="time"
            value={s.dayEnd}
            onChange={(e) => setState({ ...state, settings: { ...s, dayEnd: e.target.value } })}
          />
        </label>
      </div>
      <fieldset>
        <legend>Teaching days</legend>
        <div className="chips">
          {DAYS.map((day) => {
            const on = s.activeDays.includes(day)
            return (
              <button
                key={day}
                type="button"
                className={on ? 'chip on' : 'chip'}
                onClick={() => {
                  const activeDays = on
                    ? s.activeDays.filter((d) => d !== day)
                    : [...s.activeDays, day]
                  setState({ ...state, settings: { ...s, activeDays } })
                }}
              >
                {day.slice(0, 3)}
              </button>
            )
          })}
        </div>
      </fieldset>
      <div className="actions">
        <button className="primary" onClick={onContinue}>
          Continue to rooms
        </button>
        <button onClick={onSample}>Load sample college</button>
      </div>
    </section>
  )
}

function RoomsView({
  state,
  setState,
  onContinue,
}: {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  onContinue: () => void
}) {
  const [name, setName] = useState('')
  const [block, setBlock] = useState('Block A')

  function addRoom() {
    if (!name.trim()) return
    setState({
      ...state,
      rooms: [...state.rooms, { id: uid('rm'), name: name.trim(), block: block.trim() || 'Campus' }],
    })
    setName('')
  }

  return (
    <section className="panel">
      <h2>Campus rooms</h2>
      <p className="lede">Add the 10–15 teaching rooms. Preferred rooms on a professor will be tried first.</p>
      <div className="row">
        <input placeholder="Room 204" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Block B" value={block} onChange={(e) => setBlock(e.target.value)} />
        <button className="primary" onClick={addRoom}>
          Add room
        </button>
      </div>
      <ul className="cards">
        {state.rooms.map((room) => (
          <li key={room.id}>
            <strong>
              {room.block} · {room.name}
            </strong>
            <button
              className="text"
              onClick={() => setState({ ...state, rooms: state.rooms.filter((r) => r.id !== room.id) })}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="actions">
        <button className="primary" onClick={onContinue}>
          Continue to professors
        </button>
      </div>
    </section>
  )
}

function ProfessorsView({
  state,
  setState,
  onGenerate,
}: {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  onGenerate: () => void
}) {
  const [draft, setDraft] = useState<Professor>(() => emptyProfessor(state.professors.length))
  const [day, setDay] = useState<Day>('Monday')
  const [start, setStart] = useState('09:00')
  const [end, setEnd] = useState('15:00')

  function saveProfessor() {
    if (!draft.name.trim()) return
    const existing = state.professors.some((p) => p.id === draft.id)
    setState({
      ...state,
      professors: existing
        ? state.professors.map((p) => (p.id === draft.id ? draft : p))
        : [...state.professors, draft],
    })
    setDraft(emptyProfessor(state.professors.length + 1))
  }

  return (
    <section className="panel">
      <h2>Professors and availability</h2>
      <p className="lede">
        Some staff teach two days, some three. Add every free window. Classes needed is how many{' '}
        {state.settings.slotHours}-hour slots TableTime should place.
      </p>
      <div className="grid two">
        <label>
          Name
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
        </label>
        <label>
          Subject
          <input
            value={draft.subject}
            onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
          />
        </label>
        <label>
          Classes needed
          <input
            type="number"
            min={1}
            max={20}
            value={draft.classesNeeded}
            onChange={(e) => setDraft({ ...draft, classesNeeded: Number(e.target.value) || 1 })}
          />
        </label>
        <label>
          Preferred rooms
          <select
            multiple
            value={draft.preferredRoomIds}
            onChange={(e) =>
              setDraft({
                ...draft,
                preferredRoomIds: Array.from(e.target.selectedOptions).map((o) => o.value),
              })
            }
          >
            {state.rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.block} · {room.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="row">
        <select value={day} onChange={(e) => setDay(e.target.value as Day)}>
          {DAYS.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <input type="time" value={start} onChange={(e) => setStart(e.target.value)} />
        <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
        <button
          onClick={() =>
            setDraft({
              ...draft,
              availability: [...draft.availability, { id: uid('av'), day, start, end }],
            })
          }
        >
          Add availability
        </button>
      </div>
      <ul className="mini">
        {draft.availability.map((a) => (
          <li key={a.id}>
            {a.day} {a.start}–{a.end}
            <button
              className="text"
              onClick={() =>
                setDraft({
                  ...draft,
                  availability: draft.availability.filter((x) => x.id !== a.id),
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="actions">
        <button className="primary" onClick={saveProfessor}>
          Save professor
        </button>
        <button onClick={onGenerate}>Create timetable</button>
      </div>
      <ul className="cards">
        {state.professors.map((p) => (
          <li key={p.id}>
            <div>
              <strong style={{ color: p.color }}>{p.name}</strong>
              <span>
                {p.subject} · {p.classesNeeded} class{p.classesNeeded === 1 ? '' : 'es'} ·{' '}
                {p.availability.length} window{p.availability.length === 1 ? '' : 's'}
              </span>
            </div>
            <div className="row tight">
              <button onClick={() => setDraft(p)}>Edit</button>
              <button
                className="text"
                onClick={() =>
                  setState({
                    ...state,
                    professors: state.professors.filter((x) => x.id !== p.id),
                    placements: state.placements.filter((x) => x.professorId !== p.id),
                  })
                }
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function TimetableView({
  state,
  setState,
  conflicts,
  unplaced,
  suggestions,
  onGenerate,
  onConfirm,
  onSuggest,
  onImport,
}: {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  conflicts: ReturnType<typeof findConflicts>
  unplaced: { professorId: string; remaining: number }[]
  suggestions: Record<string, Suggestion[]>
  onGenerate: () => void
  onConfirm: (s: Suggestion) => void
  onSuggest: (professorId: string) => void
  onImport: (json: string) => void
}) {
  const leftoverCount = unplaced.reduce((sum, row) => sum + row.remaining, 0)
  const conflictIds = new Set(conflicts.flatMap((c) => c.placementIds))

  return (
    <section className="panel wide">
      <div className="split">
        <div>
          <h2>Weekly timetable</h2>
          <p className="lede">
            Each block is one {state.settings.slotHours}-hour class and is drawn for its full duration.
            If a person or room is double-booked, it turns red and TableTime lists other free{' '}
            {state.settings.slotHours}-hour slots you can confirm.
          </p>
          <p className="stats" aria-live="polite">
            <strong>{state.placements.length}</strong> scheduled
            <span>·</span>
            <strong>{leftoverCount}</strong> leftover
            <span>·</span>
            <strong>{conflicts.length}</strong> overlap{conflicts.length === 1 ? '' : 's'}
          </p>
        </div>
        <div className="actions">
          <button className="primary" onClick={onGenerate}>
            Rebuild timetable
          </button>
          <button
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
            Export
          </button>
          <label className="file">
            Import
            <input
              type="file"
              accept="application/json"
              hidden
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                onImport(await file.text())
              }}
            />
          </label>
        </div>
      </div>

      {conflicts.length ? (
        <aside className="alert">
          <h3>Overlaps</h3>
          {conflicts.map((c) => (
            <p key={c.id}>{c.message}</p>
          ))}
        </aside>
      ) : null}

      {Object.values(suggestions).some((list) => list.length) ? (
        <aside className="suggest">
          <h3>Other free slots</h3>
          {state.professors
            .filter((p) => (suggestions[p.id] ?? []).length)
            .map((professor) => (
              <div key={`alt-${professor.id}`} className="suggest-card">
                <p>
                  <strong>{professor.name}</strong> can also take these{' '}
                  {state.settings.slotHours}-hour slots.
                </p>
                <ul>
                  {(suggestions[professor.id] ?? []).map((s) => {
                    const room = state.rooms.find((r) => r.id === s.roomId)
                    return (
                      <li key={s.id}>
                        <span>
                          {s.day} {s.start}–{s.end} · {room?.block} {room?.name}
                          <em> {s.reason}</em>
                        </span>
                        <button className="primary" onClick={() => onConfirm(s)}>
                          Confirm this slot
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
        </aside>
      ) : null}

      {unplaced.length ? (
        <aside className="suggest">
          <h3>Could not place every class</h3>
          {unplaced.map((row) => {
            const professor = state.professors.find((p) => p.id === row.professorId)
            const options = suggestions[row.professorId] ?? []
            return (
              <div key={row.professorId} className="suggest-card">
                <p>
                  <strong>{professor?.name}</strong> still needs {row.remaining} slot
                  {row.remaining === 1 ? '' : 's'}.
                  {options.length === 0
                    ? ` No other ${state.settings.slotHours}-hour window fits their availability without a clash.`
                    : ''}
                </p>
                <button onClick={() => onSuggest(row.professorId)}>
                  Show other {state.settings.slotHours}h slots
                </button>
              </div>
            )
          })}
        </aside>
      ) : null}

      <WeekCalendar
        state={state}
        conflictIds={conflictIds}
        onRemove={(id) =>
          setState({
            ...state,
            placements: state.placements.filter((x) => x.id !== id),
          })
        }
        onSuggest={onSuggest}
      />
    </section>
  )
}

function WeekCalendar({
  state,
  conflictIds,
  onRemove,
  onSuggest,
}: {
  state: AppState
  conflictIds: Set<string>
  onRemove: (id: string) => void
  onSuggest: (professorId: string) => void
}) {
  const startM = toMinutes(state.settings.dayStart)
  const endM = toMinutes(state.settings.dayEnd)
  const hours = hourLabels(state.settings.dayStart, state.settings.dayEnd)
  const pxPerHour = 72
  const height = Math.max(((endM - startM) / 60) * pxPerHour, pxPerHour)

  return (
    <div className="week-wrap">
      <div className="week" style={{ ['--week-height' as string]: `${height}px` }}>
        <div className="week-times">
          <div className="week-head">Time</div>
          <div className="week-lane">
            {hours.map((hour) => (
              <div key={hour} className="week-hour">
                {hour}
              </div>
            ))}
          </div>
        </div>
        {state.settings.activeDays.map((day) => {
          const items = state.placements.filter((p) => p.day === day)
          const layout = layoutDayColumns(items)
          return (
            <div key={day} className="week-day">
              <div className="week-head">{day}</div>
              <div className="week-lane">
                {hours.map((hour) => (
                  <div key={hour} className="week-gridline" />
                ))}
                {items.map((p) => {
                  const professor = state.professors.find((x) => x.id === p.professorId)
                  const room = state.rooms.find((x) => x.id === p.roomId)
                  const top = ((toMinutes(p.start) - startM) / 60) * pxPerHour
                  const blockHeight = ((toMinutes(p.end) - toMinutes(p.start)) / 60) * pxPerHour
                  const { col, cols } = layout.get(p.id) ?? { col: 0, cols: 1 }
                  const width = `calc((100% - 8px) / ${cols})`
                  const left = `calc(4px + ${col} * (100% - 8px) / ${cols})`
                  return (
                    <article
                      key={p.id}
                      className={conflictIds.has(p.id) ? 'block clash' : 'block'}
                      style={{
                        borderColor: professor?.color,
                        top,
                        height: Math.max(blockHeight - 4, 44),
                        left,
                        width,
                      }}
                    >
                      <strong>{professor?.name}</strong>
                      <span>
                        {p.start}–{p.end}
                      </span>
                      <span>
                        {room?.block} · {room?.name}
                      </span>
                      {conflictIds.has(p.id) ? <b className="clash-tag">Overlap</b> : null}
                      <div className="block-actions">
                        <button className="text" onClick={() => onRemove(p.id)}>
                          Remove
                        </button>
                        <button className="text" onClick={() => onSuggest(p.professorId)}>
                          Other slots
                        </button>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function emptyProfessor(index: number): Professor {
  return {
    id: uid('pr'),
    name: '',
    subject: '',
    classesNeeded: 2,
    preferredRoomIds: [],
    availability: [],
    color: PROFESSOR_COLORS[index % PROFESSOR_COLORS.length],
  }
}

function hourLabels(start: string, end: string): string[] {
  const out: string[] = []
  const [sh] = start.split(':').map(Number)
  const [eh] = end.split(':').map(Number)
  for (let h = sh; h < eh; h++) {
    out.push(`${String(h).padStart(2, '0')}:00`)
  }
  return out
}
