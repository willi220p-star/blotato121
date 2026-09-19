import type { BriefQuestion } from '../lib/brief'

interface Props {
  questions: BriefQuestion[]
  answers: Record<string, string>
  busy?: boolean
  onChange: (id: string, value: string) => void
  onBuild: () => void
  onSkip: () => void
}

export function BriefAsk({ questions, answers, busy, onChange, onBuild, onSkip }: Props) {
  return (
    <div className="brief-ask">
      <p className="brief-ask-lead">A few things so this stays exact.</p>
      {questions.map((question) => (
        <label className="brief-q" htmlFor={`q-${question.id}`} key={question.id}>
          <span>{question.label}</span>
          {question.options ? (
            <div className="chips">
              {question.options.map((option) => (
                <button
                  className={`chip ${answers[question.id] === option ? 'active' : ''}`}
                  key={option}
                  onClick={() => onChange(question.id, option)}
                  type="button"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <textarea
              className="small-area"
              id={`q-${question.id}`}
              placeholder={question.placeholder}
              value={answers[question.id] ?? ''}
              onChange={(e) => onChange(question.id, e.target.value)}
            />
          )}
        </label>
      ))}
      <div className="actions">
        <button className="primary" disabled={busy} onClick={onBuild} type="button">
          {busy ? 'Building…' : 'Build this'}
        </button>
        <button className="ghost" disabled={busy} onClick={onSkip} type="button">
          Use my prompt only
        </button>
      </div>
    </div>
  )
}
