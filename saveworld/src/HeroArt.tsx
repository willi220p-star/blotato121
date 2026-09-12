export function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="hero-glow" />
      <svg className="hero-svg" viewBox="0 0 520 420" fill="none">
        <ellipse cx="260" cy="368" rx="150" ry="18" fill="#000" opacity="0.18" />
        <g className="float-slow">
          <circle cx="258" cy="168" r="86" fill="url(#earth)" />
          <path
            d="M198 140c28-18 62-10 86 8 18 14 38 16 54 6-8 28-6 52 10 74-32 22-74 28-112 8-24-12-48-10-70 8 2-36 12-70 32-104z"
            fill="#3d8f6a"
            opacity="0.85"
          />
          <path
            d="M214 214c22 8 46 4 64-12 10 18 8 38-6 54-22 8-44 4-58-12z"
            fill="#2f6d52"
          />
          <ellipse cx="232" cy="132" rx="22" ry="10" fill="#fff" opacity="0.18" />
        </g>
        <g className="float-a">
          <ellipse cx="118" cy="286" rx="46" ry="12" fill="#000" opacity="0.12" />
          <rect x="86" y="196" width="64" height="86" rx="32" fill="#1d1d1f" />
          <rect x="86" y="232" width="64" height="54" rx="22" fill="#0071e3" />
          <circle cx="118" cy="168" r="28" fill="#f3d2b3" />
          <path d="M96 160c8-18 36-18 44 0" stroke="#1d1d1f" strokeWidth="10" strokeLinecap="round" />
          <circle cx="109" cy="166" r="2.2" fill="#1d1d1f" />
          <circle cx="127" cy="166" r="2.2" fill="#1d1d1f" />
          <path d="M112 176c6 6 12 6 18 0" stroke="#c56b4a" strokeWidth="2" strokeLinecap="round" />
          <rect x="64" y="214" width="22" height="10" rx="5" fill="#f3d2b3" />
          <rect x="150" y="214" width="22" height="10" rx="5" fill="#f3d2b3" />
          <circle cx="176" cy="196" r="16" fill="#ffd60a" />
          <path d="M176 188v16M168 196h16" stroke="#1d1d1f" strokeWidth="2" />
        </g>
        <g className="float-b">
          <ellipse cx="394" cy="292" rx="46" ry="12" fill="#000" opacity="0.12" />
          <rect x="362" y="200" width="64" height="88" rx="32" fill="#1d1d1f" />
          <rect x="362" y="236" width="64" height="56" rx="22" fill="#ff375f" />
          <circle cx="394" cy="172" r="28" fill="#e6c2a8" />
          <path d="M372 164c10-20 40-16 44 4" stroke="#3a2418" strokeWidth="10" strokeLinecap="round" />
          <circle cx="385" cy="170" r="2.2" fill="#1d1d1f" />
          <circle cx="403" cy="170" r="2.2" fill="#1d1d1f" />
          <path d="M388 180c6 5 12 5 16 0" stroke="#c56b4a" strokeWidth="2" strokeLinecap="round" />
          <rect x="340" y="218" width="22" height="10" rx="5" fill="#e6c2a8" />
          <rect x="426" y="218" width="22" height="10" rx="5" fill="#e6c2a8" />
          <g transform="translate(428 188)">
            <circle r="15" fill="#34c759" />
            <path d="M-2 6c8-14 16-16 20-8-10 4-14 10-18 18-2-4-4-8-2-10z" fill="#1d1d1f" />
          </g>
        </g>
        <g className="coin coin-1">
          <circle cx="78" cy="84" r="18" fill="#ffd60a" />
          <circle cx="78" cy="84" r="12" stroke="#1d1d1f" strokeWidth="1.5" />
        </g>
        <g className="coin coin-2">
          <circle cx="446" cy="96" r="14" fill="#ffd60a" />
          <circle cx="446" cy="96" r="9" stroke="#1d1d1f" strokeWidth="1.4" />
        </g>
        <g className="coin coin-3">
          <circle cx="248" cy="52" r="11" fill="#ffd60a" />
        </g>
        <defs>
          <radialGradient id="earth" cx="0.35" cy="0.3" r="0.8">
            <stop offset="0" stopColor="#7ad3ff" />
            <stop offset="0.55" stopColor="#0071e3" />
            <stop offset="1" stopColor="#013366" />
          </radialGradient>
        </defs>
      </svg>
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
