export function StageBackdrop() {
  return (
    <svg className="stage-svg" viewBox="0 0 1440 420" fill="none" aria-hidden="true">
      <rect width="1440" height="420" fill="#f6efe3" />
      <path d="M-40 320c180-90 280 40 460 10 170-28 220-140 400-130 190 10 250 150 430 120 140-24 220-90 320-40v140H-40z" fill="#eadfcd" />
      <g opacity="0.9">
        <rect x="70" y="70" width="220" height="150" rx="28" fill="#1f4bff" />
        <rect x="170" y="130" width="210" height="140" rx="28" fill="#ff5a36" opacity="0.92" />
        <rect x="300" y="90" width="160" height="120" rx="24" fill="#ffd23f" />
      </g>
      <g transform="translate(980 48)">
        <circle cx="110" cy="110" r="96" fill="#14213d" />
        <circle cx="110" cy="110" r="78" fill="#f6efe3" />
        <circle cx="110" cy="110" r="8" fill="#14213d" />
        <path d="M110 48v62l38 22" stroke="#14213d" strokeWidth="10" strokeLinecap="round" />
        <circle cx="110" cy="110" r="96" fill="none" stroke="#ff5a36" strokeWidth="10" strokeDasharray="28 18" />
      </g>
      <g fill="#14213d" opacity="0.18">
        {Array.from({ length: 18 }, (_, i) => (
          <rect key={i} x={40 + i * 78} y="20" width="1.5" height="380" />
        ))}
      </g>
    </svg>
  )
}

export function Monogram({ name, color }: { name: string; color: string }) {
  const letters = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || '?'
  return (
    <span className="mono" style={{ background: color }}>
      <svg viewBox="0 0 72 72" aria-hidden="true">
        <circle cx="18" cy="16" r="8" fill="rgba(255,255,255,.28)" />
        <path d="M8 58c8-16 48-16 56 0" fill="none" stroke="rgba(255,255,255,.35)" strokeWidth="6" />
      </svg>
      <b>{letters}</b>
    </span>
  )
}

export function EmptyPoster() {
  return (
    <div className="empty-poster" aria-hidden="true">
      <svg viewBox="0 0 320 180">
        <rect width="320" height="180" rx="24" fill="#fff8ee" />
        <rect x="24" y="24" width="70" height="52" rx="12" fill="#1f4bff" />
        <rect x="108" y="36" width="90" height="52" rx="12" fill="#ff5a36" />
        <rect x="214" y="24" width="80" height="72" rx="12" fill="#ffd23f" />
        <rect x="24" y="96" width="272" height="12" rx="6" fill="#eadfcd" />
        <rect x="24" y="122" width="180" height="12" rx="6" fill="#eadfcd" />
      </svg>
      <p>Add a professor, then drop a class onto the week.</p>
    </div>
  )
}
