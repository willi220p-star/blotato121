import { useEffect, useState } from 'react'

const BEATS = [
  {
    act: 'show',
    you: 'This is the world we are keeping.',
    partner: 'Quiet. Held. Still ours.',
  },
  {
    act: 'meet',
    you: 'Your number. Their number.',
    partner: 'Then one number. Together.',
  },
  {
    act: 'coin',
    you: 'Earn. Spend. See what stayed.',
    partner: 'If the gap turns red, we both know.',
  },
  {
    act: 'plant',
    you: 'Leave something in the ground.',
    partner: 'A month is a seed, not a score.',
  },
] as const

export function Logo({
  wordmark = true,
  tone = 'light',
}: {
  wordmark?: boolean
  tone?: 'light' | 'dark'
}) {
  return (
    <span className={`brand brand-${tone}`}>
      <img className="brand-mark" src="/logo-256.png" alt="" width={80} height={80} />
      {wordmark ? <span className="brand-name">SaveWorld</span> : null}
    </span>
  )
}

export function LivingStage({ shortfall }: { shortfall: boolean }) {
  const [beat, setBeat] = useState(0)
  const [hop, setHop] = useState(false)
  const current = BEATS[beat]

  useEffect(() => {
    const id = window.setInterval(() => {
      setBeat((value) => (value + 1) % BEATS.length)
    }, 4200)
    return () => window.clearInterval(id)
  }, [])

  function advance() {
    setHop(true)
    window.setTimeout(() => setHop(false), 420)
    setBeat((value) => (value + 1) % BEATS.length)
  }

  return (
    <div className={`stage-world act-${current.act}${hop ? ' hop' : ''}${shortfall ? ' short' : ''}`}>
      <div className="stage-glow" />
      <div className="stage-floor" />
      <button type="button" className="prop earth" aria-label="Show the earth" onClick={advance}>
        <span />
      </button>
      <button type="button" className="prop coin" aria-label="Show the coin" onClick={advance}>
        <span />
      </button>
      <button type="button" className="prop sprout" aria-label="Show the plant" onClick={advance}>
        <span />
      </button>

      <button type="button" className="walker you" onClick={advance}>
        <img src="/character.png" alt="Saver holding the earth and a coin" />
        <span className="say">{shortfall && beat === 2 ? 'The gap went red. We both get the note.' : current.you}</span>
      </button>
      <button type="button" className="walker partner" onClick={advance}>
        <img src="/partner.png" alt="Partner holding a coin and a plant" />
        <span className="say">{current.partner}</span>
      </button>
    </div>
  )
}

export function PersonMark({ color }: { color: string }) {
  return (
    <svg className="person-mark" viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill={color} />
      <circle cx="32" cy="24" r="10" fill="#fff5ea" />
      <path d="M16 52c4-14 28-14 32 0" fill="#fff5ea" />
    </svg>
  )
}
