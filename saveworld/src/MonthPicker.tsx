import { useEffect, useRef, useState } from 'react'
import { monthLabel, shiftMonth } from './money'

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function MonthPicker({
  value,
  months,
  onChange,
}: {
  value: string
  months: string[]
  onChange: (month: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [year, setYear] = useState(() => Number(value.slice(0, 4)))
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setYear(Number(value.slice(0, 4)))
  }, [value])

  useEffect(() => {
    if (!open) return
    const onPointer = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const years = [...new Set(months.map((key) => Number(key.slice(0, 4))))].sort((a, b) => a - b)
  const minYear = years[0] ?? year
  const maxYear = years[years.length - 1] ?? year

  return (
    <div className="month-picker" ref={root}>
      <button type="button" className="month-step" onClick={() => onChange(shiftMonth(value, -1))}>
        ‹
      </button>
      <button
        type="button"
        className="month-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="month-kicker">Month</span>
        <strong>{monthLabel(value)}</strong>
      </button>
      <button type="button" className="month-step" onClick={() => onChange(shiftMonth(value, 1))}>
        ›
      </button>

      {open ? (
        <div className="month-sheet" role="dialog" aria-label="Choose month and year">
          <div className="month-sheet-head">
            <button
              type="button"
              className="month-step"
              disabled={year <= minYear}
              onClick={() => setYear((current) => current - 1)}
            >
              ‹
            </button>
            <strong>{year}</strong>
            <button
              type="button"
              className="month-step"
              disabled={year >= maxYear}
              onClick={() => setYear((current) => current + 1)}
            >
              ›
            </button>
          </div>
          <div className="month-grid">
            {MONTH_NAMES.map((name, index) => {
              const key = `${year}-${String(index + 1).padStart(2, '0')}`
              const allowed = months.includes(key)
              const selected = key === value
              return (
                <button
                  key={key}
                  type="button"
                  className={selected ? 'month-cell on' : 'month-cell'}
                  disabled={!allowed}
                  onClick={() => {
                    onChange(key)
                    setOpen(false)
                  }}
                >
                  {name}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
