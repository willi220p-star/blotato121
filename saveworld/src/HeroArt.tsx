import { useEffect, useState } from 'react'

type Side = 'you' | 'partner'

interface Drop {
  from: Side
  title: string
  text: string
}

interface Beat {
  id: string
  chapter: string
  you: string
  partner: string
  youAlt: string
  partnerAlt: string
  drops: Drop[]
}

const STORY: Beat[] = [
  {
    id: 'phones',
    chapter: 'On the phone',
    you: '/you-phone.png',
    partner: '/partner-eat.png',
    youAlt: 'Him texting',
    partnerAlt: 'Her eating and texting',
    drops: [
      { from: 'you', title: 'Him', text: 'table at 8?' },
      { from: 'partner', title: 'Her', text: 'already eating. come.' },
      { from: 'you', title: 'Him', text: 'ok. add wine.' },
    ],
  },
  {
    id: 'shop',
    chapter: 'Then shopping',
    you: '/you-shop.png',
    partner: '/partner-shop.png',
    youAlt: 'Him with shopping bags',
    partnerAlt: 'Her shopping with a bag and phone',
    drops: [
      { from: 'partner', title: 'Her', text: 'these. and these.' },
      { from: 'you', title: 'Him', text: 'same. two bags.' },
      { from: 'partner', title: 'Card', text: 'store · $148' },
    ],
  },
  {
    id: 'spend',
    chapter: 'Too much',
    you: '/you-shock.png',
    partner: '/partner-shop.png',
    youAlt: 'Him seeing the spend',
    partnerAlt: 'Her still with the bags',
    drops: [
      { from: 'you', title: 'Bank', text: 'dinner $86 · wine $42' },
      { from: 'partner', title: 'Bank', text: 'food $28 · bags $148' },
      { from: 'you', title: 'Him', text: 'wait. $304 this week.' },
    ],
  },
  {
    id: 'talk',
    chapter: 'The talk',
    you: '/you-shock.png',
    partner: '/partner-talk.png',
    youAlt: 'Him listening',
    partnerAlt: 'Her saying they have to save',
    drops: [
      { from: 'partner', title: 'Her', text: 'we keep saying we will save.' },
      { from: 'you', title: 'Him', text: 'then we go out. then we shop.' },
      { from: 'partner', title: 'Her', text: 'so we write it. both of us.' },
    ],
  },
  {
    id: 'return',
    chapter: 'They come back',
    you: '/character.png',
    partner: '/partner.png',
    youAlt: 'Him holding the earth and a coin',
    partnerAlt: 'Her holding a coin and a plant',
    drops: [
      { from: 'you', title: 'Him', text: 'your number. mine.' },
      { from: 'partner', title: 'Her', text: 'what stayed. we keep it.' },
      { from: 'you', title: 'SaveWorld', text: 'welcome to the saving world.' },
    ],
  },
]

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
  const current = STORY[beat]

  useEffect(() => {
    const id = window.setInterval(() => {
      setBeat((value) => (value + 1) % STORY.length)
    }, 7000)
    return () => window.clearInterval(id)
  }, [])

  function go(index: number) {
    setBeat((index + STORY.length) % STORY.length)
  }

  return (
    <div
      className={`stage-world act-${current.id}${shortfall && current.id === 'spend' ? ' short' : ''}`}
    >
      <div className="stage-glow" />
      <div className="stage-floor" />

      <div className="story-top">
        <p className="chapter" key={current.chapter}>
          {current.chapter}
        </p>
        <div className="drops" key={current.id}>
          {current.drops.map((drop, index) => (
            <article
              key={`${current.id}-${drop.text}`}
              className={`drop from-${drop.from}`}
              style={{ animationDelay: `${0.15 + index * 0.7}s` }}
            >
              <span className="drop-who">{drop.title}</span>
              <span className="drop-text">{drop.text}</span>
            </article>
          ))}
        </div>
      </div>

      <button type="button" className="walker you" onClick={() => go(beat + 1)}>
        <img src={current.you} alt={current.youAlt} />
      </button>
      <button type="button" className="walker partner" onClick={() => go(beat + 1)}>
        <img src={current.partner} alt={current.partnerAlt} />
      </button>

      <ol className="story-dots">
        {STORY.map((scene, index) => (
          <li key={scene.id}>
            <button
              type="button"
              className={index === beat ? 'dot on' : 'dot'}
              aria-label={scene.chapter}
              onClick={(event) => {
                event.stopPropagation()
                go(index)
              }}
            />
          </li>
        ))}
      </ol>
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
