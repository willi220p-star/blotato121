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

export function HeroArt() {
  return (
    <div className="hero-art">
      <div className="hero-glow" />
      <img
        className="hero-character"
        src="/character.png"
        alt="SaveWorld character holding the earth and a coin"
        width={510}
        height={1075}
      />
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
