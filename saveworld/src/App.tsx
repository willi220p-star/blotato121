import { useEffect, useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import {
  copyMonthForward,
  lastMonths,
  money,
  monthKey,
  monthLabel,
  monthTotals,
  removePersonRows,
  shiftMonth,
  spendingByCategory,
  uid,
} from './money'
import { sampleState } from './sampleData'
import { exportState, importState, loadState, saveState } from './storage'
import { PERSON_COLORS, type AppState, type Person } from './types'
import './App.css'

type View = 'together' | 'person' | 'people' | 'history'

export default function App() {
  const [state, setState] = useState<AppState>(() => loadState())
  const [month, setMonth] = useState(monthKey())
  const [view, setView] = useState<View>('together')
  const [personId, setPersonId] = useState<string | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    saveState(state)
  }, [state])

  function flash(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 4000)
  }

  const activePerson = state.people.find((p) => p.id === personId) ?? null
  const months = useMemo(() => lastMonths(24, monthKey()), [])

  return (
    <div className="scene">
      <div className="orb" />
      <div className="orb-2" />
      <div className="orb-3" />
      <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Savings and spend tracker</p>
          <h1>Welcome to the saving world</h1>
          <p className="welcome">
            {state.settings.householdName}: earnings, spends, estimated savings, what actually
            landed in the bank, and investments. Each person has their own glowing dashboard.
            Together is the joint total.
          </p>
        </div>
        <div className="globe" aria-hidden="true" />
      </header>
        <nav>
          <button className={view === 'together' ? 'nav on' : 'nav'} onClick={() => setView('together')}>
            Together
          </button>
          {state.people.map((person) => (
            <button
              key={person.id}
              className={view === 'person' && personId === person.id ? 'nav on' : 'nav'}
              onClick={() => {
                setPersonId(person.id)
                setView('person')
              }}
            >
              {person.name}
            </button>
          ))}
          <button className={view === 'people' ? 'nav on' : 'nav'} onClick={() => setView('people')}>
            People
          </button>
          <button className={view === 'history' ? 'nav on' : 'nav'} onClick={() => setView('history')}>
            24 months
          </button>
        </nav>

      {notice ? <div className="notice">{notice}</div> : null}

      <div className="month-bar">
        <div className="row">
          <button onClick={() => setMonth(shiftMonth(month, -1))}>Previous</button>
          <strong>{monthLabel(month)}</strong>
          <button onClick={() => setMonth(shiftMonth(month, 1))}>Next</button>
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            {months.map((key) => (
              <option key={key} value={key}>
                {monthLabel(key)}
              </option>
            ))}
          </select>
        </div>
        <div className="actions">
          <button
            onClick={() => {
              setState(copyMonthForward(state, month))
              setMonth(shiftMonth(month, 1))
              flash('Copied incomes, spends, and investments into the next month.')
            }}
          >
            Copy month forward
          </button>
          <button
            onClick={() => {
              const blob = new Blob([exportState(state)], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'saveworld.json'
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
                try {
                  setState(importState(await file.text()))
                  flash('Imported SaveWorld file.')
                } catch (error) {
                  flash(error instanceof Error ? error.message : 'Import failed.')
                }
              }}
            />
          </label>
        </div>
      </div>

      <div key={`${view}-${personId}-${month}`} className="stage">
        {view === 'together' ? (
          <TogetherView
            state={state}
            month={month}
            onOpenPerson={(id) => {
              setPersonId(id)
              setView('person')
            }}
            onSample={() => {
              setState(sampleState(state))
              flash('Sample household loaded. Edit anything — this stays on this browser.')
            }}
          />
        ) : null}

        {view === 'person' && activePerson ? (
          <PersonView state={state} setState={setState} person={activePerson} month={month} />
        ) : null}

        {view === 'people' ? (
          <PeopleView state={state} setState={setState} flash={flash} />
        ) : null}

        {view === 'history' ? <HistoryView state={state} months={months} /> : null}
      </div>
    </div>
    </div>
  )
}

function TogetherView({
  state,
  month,
  onOpenPerson,
  onSample,
}: {
  state: AppState
  month: string
  onOpenPerson: (id: string) => void
  onSample: () => void
}) {
  const joint = monthTotals(state, month)
  const currency = state.settings.currency
  return (
    <section className="panel">
      <h2>Together this month</h2>
      <p className="lede">
        Joint earnings, spends, estimated savings, actual bank savings, and the gap. Open a person
        to add their numbers — the same layout, their own figures.
      </p>
      <TotalsGrid totals={joint} currency={currency} />
      {state.people.length === 0 ? (
        <p className="empty">
          No people yet. Open People to add yourself and your partner, or load a sample household.
        </p>
      ) : null}
      <ul className="cards">
        {state.people.map((person) => {
          const totals = monthTotals(state, month, person.id)
          return (
            <li key={person.id}>
              <div>
                <strong style={{ color: person.color }}>{person.name}</strong>
                <span>
                  Est. {money(totals.estimatedSavings, currency)} · Actual{' '}
                  {money(totals.actualSavings, currency)} · Gap {money(totals.difference, currency)}
                </span>
              </div>
              <button onClick={() => onOpenPerson(person.id)}>Open dashboard</button>
            </li>
          )
        })}
      </ul>
      <CategoryBars state={state} month={month} currency={currency} />
      <InvestmentList state={state} month={month} currency={currency} />
      <div className="actions">
        <button onClick={onSample}>Load sample household</button>
      </div>
    </section>
  )
}

function PersonView({
  state,
  setState,
  person,
  month,
}: {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  person: Person
  month: string
}) {
  const totals = monthTotals(state, month, person.id)
  const currency = state.settings.currency
  const actual = state.actuals.find((row) => row.personId === person.id && row.month === month)?.amount ?? 0

  return (
    <section className="panel">
      <h2 style={{ color: person.color }}>{person.name}</h2>
      <p className="lede">
        Same tracker as Together, just {person.name}’s money. Estimated savings is earnings minus
        spends. Actual savings is what you type from the bank. Gap is actual minus estimated.
      </p>
      <TotalsGrid totals={totals} currency={currency} />

      <h3>Income sources</h3>
      <AddRow
        placeholder="Day job"
        onAdd={(source, amount) =>
          setState({
            ...state,
            incomes: [
              ...state.incomes,
              { id: uid('in'), personId: person.id, month, source, amount },
            ],
          })
        }
      />
      <ul className="mini">
        {state.incomes
          .filter((row) => row.personId === person.id && row.month === month)
          .map((row) => (
            <li key={row.id}>
              <span>
                {row.source} · {money(row.amount, currency)}
              </span>
              <button
                className="text"
                onClick={() =>
                  setState({ ...state, incomes: state.incomes.filter((x) => x.id !== row.id) })
                }
              >
                Remove
              </button>
            </li>
          ))}
      </ul>

      <h3>Monthly spends</h3>
      <AddExpense state={state} setState={setState} personId={person.id} month={month} />
      <ul className="mini">
        {state.expenses
          .filter((row) => row.personId === person.id && row.month === month)
          .map((row) => (
            <li key={row.id}>
              <span>
                {state.categories.find((c) => c.id === row.categoryId)?.name} · {row.note} ·{' '}
                {money(row.amount, currency)}
              </span>
              <button
                className="text"
                onClick={() =>
                  setState({ ...state, expenses: state.expenses.filter((x) => x.id !== row.id) })
                }
              >
                Remove
              </button>
            </li>
          ))}
      </ul>
      <CategoryBars state={state} month={month} personId={person.id} currency={currency} />

      <h3>Investments this month</h3>
      <AddRow
        placeholder="Index fund"
        onAdd={(name, amount) =>
          setState({
            ...state,
            investments: [
              ...state.investments,
              { id: uid('iv'), personId: person.id, month, name, amount },
            ],
          })
        }
      />
      <InvestmentList state={state} month={month} personId={person.id} currency={currency} />

      <h3>Actual savings from the bank</h3>
      <label>
        Amount that actually stayed this month
        <input
          type="number"
          min={0}
          step="0.01"
          value={actual}
          onChange={(e) => {
            const amount = Number(e.target.value) || 0
            setState({
              ...state,
              actuals: [
                ...state.actuals.filter((row) => !(row.personId === person.id && row.month === month)),
                { personId: person.id, month, amount },
              ],
            })
          }}
        />
      </label>
    </section>
  )
}

function PeopleView({
  state,
  setState,
  flash,
}: {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  flash: (message: string) => void
}) {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')

  return (
    <section className="panel">
      <h2>People and household</h2>
      <p className="lede">
        Add everyone who should have a dashboard. Together always sums every person you add.
      </p>
      <div className="grid two">
        <label>
          Household name
          <input
            value={state.settings.householdName}
            onChange={(e) =>
              setState({ ...state, settings: { ...state.settings, householdName: e.target.value } })
            }
          />
        </label>
        <label>
          Currency symbol
          <input
            value={state.settings.currency}
            onChange={(e) =>
              setState({ ...state, settings: { ...state.settings, currency: e.target.value || '$' } })
            }
          />
        </label>
      </div>
      <form
        className="actions"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) {
            flash('Type a name first.')
            return
          }
          setState({
            ...state,
            people: [
              ...state.people,
              {
                id: uid('pr'),
                name: name.trim(),
                color: PERSON_COLORS[state.people.length % PERSON_COLORS.length],
              },
            ],
          })
          setName('')
        }}
      >
        <input placeholder="Partner name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="primary" type="submit">
          Add person
        </button>
      </form>
      <ul className="cards">
        {state.people.map((person) => (
          <li key={person.id}>
            <strong style={{ color: person.color }}>{person.name}</strong>
            <button className="text" onClick={() => setState(removePersonRows(state, person.id))}>
              Remove
            </button>
          </li>
        ))}
      </ul>

      <h3>Spend categories</h3>
      <form
        className="actions"
        onSubmit={(e) => {
          e.preventDefault()
          if (!category.trim()) return
          setState({
            ...state,
            categories: [...state.categories, { id: uid('cat'), name: category.trim() }],
          })
          setCategory('')
        }}
      >
        <input
          placeholder="New category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <button className="primary" type="submit">
          Add category
        </button>
      </form>
      <ul className="mini">
        {state.categories.map((item) => (
          <li key={item.id}>
            <span>{item.name}</span>
            <button
              className="text"
              onClick={() =>
                setState({
                  ...state,
                  categories: state.categories.filter((c) => c.id !== item.id),
                  expenses: state.expenses.filter((row) => row.categoryId !== item.id),
                })
              }
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

function HistoryView({ state, months }: { state: AppState; months: string[] }) {
  const currency = state.settings.currency
  return (
    <section className="panel">
      <h2>Two years of months</h2>
      <p className="lede">Joint totals for the last 24 months, newest at the bottom.</p>
      <div className="table-wrap">
        <table className="history">
          <thead>
            <tr>
              <th>Month</th>
              <th>Earnings</th>
              <th>Spend</th>
              <th>Estimated</th>
              <th>Actual</th>
              <th>Gap</th>
              <th>Invested</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month) => {
              const totals = monthTotals(state, month)
              return (
                <tr key={month}>
                  <td>{monthLabel(month)}</td>
                  <td>{money(totals.earnings, currency)}</td>
                  <td>{money(totals.spending, currency)}</td>
                  <td>{money(totals.estimatedSavings, currency)}</td>
                  <td>{money(totals.actualSavings, currency)}</td>
                  <td className={totals.difference < 0 ? 'minus' : ''}>
                    {money(totals.difference, currency)}
                  </td>
                  <td>{money(totals.investments, currency)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function TotalsGrid({
  totals,
  currency,
}: {
  totals: ReturnType<typeof monthTotals>
  currency: string
}) {
  return (
    <div className="stats">
      <article className="stat">
        <span>Monthly earnings</span>
        <strong>
          <CountUp value={totals.earnings} currency={currency} />
        </strong>
      </article>
      <article className="stat">
        <span>Monthly spend</span>
        <strong>
          <CountUp value={totals.spending} currency={currency} />
        </strong>
      </article>
      <article className="stat">
        <span>Estimated savings</span>
        <strong>
          <CountUp value={totals.estimatedSavings} currency={currency} />
        </strong>
      </article>
      <article className="stat">
        <span>Actual savings</span>
        <strong>
          <CountUp value={totals.actualSavings} currency={currency} />
        </strong>
      </article>
      <article className={totals.difference < 0 ? 'stat minus' : 'stat plus'}>
        <span>Gap (actual − estimated)</span>
        <strong>
          <CountUp value={totals.difference} currency={currency} />
        </strong>
      </article>
      <article className="stat">
        <span>Invested this month</span>
        <strong>
          <CountUp value={totals.investments} currency={currency} />
        </strong>
      </article>
    </div>
  )
}

function CategoryBars({
  state,
  month,
  personId,
  currency,
}: {
  state: AppState
  month: string
  personId?: string
  currency: string
}) {
  const rows = spendingByCategory(state, month, personId)
  const max = Math.max(...rows.map((row) => row.amount), 1)
  if (!rows.length) return null
  return (
    <div className="bars">
      <h3>Spend by category</h3>
      {rows.map((row) => (
        <div key={row.categoryId} className="bar-row">
          <span>
            {row.name} · {money(row.amount, currency)}
          </span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${(row.amount / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function InvestmentList({
  state,
  month,
  personId,
  currency,
}: {
  state: AppState
  month: string
  personId?: string
  currency: string
}) {
  const rows = state.investments.filter(
    (row) => row.month === month && (!personId || row.personId === personId),
  )
  if (!rows.length) return <p className="empty">No investments recorded this month.</p>
  return (
    <ul className="mini">
      {rows.map((row) => {
        const owner = state.people.find((p) => p.id === row.personId)
        return (
          <li key={row.id}>
            <span>
              {row.name}
              {personId ? '' : ` · ${owner?.name ?? 'Someone'}`} · {money(row.amount, currency)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

function AddRow({
  placeholder,
  onAdd,
}: {
  placeholder: string
  onAdd: (label: string, amount: number) => void
}) {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  return (
    <form
      className="row"
      onSubmit={(e) => {
        e.preventDefault()
        const value = Number(amount)
        if (!label.trim() || !Number.isFinite(value) || value <= 0) return
        onAdd(label.trim(), value)
        setLabel('')
        setAmount('')
      }}
    >
      <input placeholder={placeholder} value={label} onChange={(e) => setLabel(e.target.value)} />
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className="primary" type="submit">
        Add
      </button>
    </form>
  )
}

function CountUp({ value, currency }: { value: number; currency: string }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    const start = performance.now()
    const from = 0
    const duration = 700
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - t) ** 3
      setShown(from + (value - from) * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])
  return money(shown, currency)
}

function AddExpense({
  state,
  setState,
  personId,
  month,
}: {
  state: AppState
  setState: Dispatch<SetStateAction<AppState>>
  personId: string
  month: string
}) {
  const [categoryId, setCategoryId] = useState(state.categories[0]?.id ?? '')
  const [note, setNote] = useState('')
  const [amount, setAmount] = useState('')
  return (
    <form
      className="row"
      onSubmit={(e) => {
        e.preventDefault()
        const value = Number(amount)
        if (!categoryId || !Number.isFinite(value) || value <= 0) return
        setState({
          ...state,
          expenses: [
            ...state.expenses,
            { id: uid('ex'), personId, month, categoryId, note: note.trim(), amount: value },
          ],
        })
        setNote('')
        setAmount('')
      }}
    >
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        {state.categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <input placeholder="Note" value={note} onChange={(e) => setNote(e.target.value)} />
      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button className="primary" type="submit">
        Add spend
      </button>
    </form>
  )
}
