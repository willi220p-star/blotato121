import type { CSSProperties } from 'react'
import type { InfographicModel, Palette, Platform } from '../lib/types'

interface Props {
  model: InfographicModel
  palette: Palette
  platform: Platform
  scale?: number
}

function pad(platform: Platform): number {
  const short = Math.min(platform.width, platform.height)
  return Math.round(short * 0.07)
}

export function InfographicArt({ model, palette, platform, scale = 1 }: Props) {
  const p = pad(platform)
  const style = {
    width: platform.width,
    height: platform.height,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    background: palette.surface,
    color: palette.ink,
    padding: p,
    ['--accent' as string]: palette.accent,
    ['--accent-2' as string]: palette.accent2,
    ['--muted' as string]: palette.muted,
    ['--line' as string]: palette.line,
    ['--on-accent' as string]: palette.onAccent,
    ['--bg' as string]: palette.bg,
    ['--surface' as string]: palette.surface,
    ['--ink' as string]: palette.ink,
  } as CSSProperties

  const titleSize = platform.height > platform.width ? 52 : 40
  const isWide = platform.width / platform.height > 1.2

  return (
    <article className="artboard" style={style}>
      <div className="art-header">
        <span>{model.header || palette.name}</span>
        <span>{platform.network}</span>
      </div>
      <div className="art-body" style={{ marginTop: 22 }}>
        <h3 className="art-title" style={{ fontSize: titleSize }}>
          {model.title}
        </h3>
        <p className="art-sub">{model.subtitle}</p>
        <Layout model={model} isWide={isWide} palette={palette} />
      </div>
      <div className="art-footer" style={{ marginTop: 18 }}>
        <span>{model.footer || 'Auto Infographic Generator'}</span>
        <span>{String(model.items.length).padStart(2, '0')} marks</span>
      </div>
    </article>
  )
}

function Layout({
  model,
  isWide,
  palette,
}: {
  model: InfographicModel
  isWide: boolean
  palette: Palette
}) {
  const items = model.items
  if (model.kind === 'stats') {
    return (
      <div className="layout-stats">
        {items.map((item) => (
          <div className="stat" key={item.label}>
            <b>{item.value || item.label}</b>
            <h4>{item.value ? item.label : ''}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    )
  }
  if (model.kind === 'comparison') {
    const left = items[0]
    const right = items[1] ?? items[0]
    return (
      <div className="layout-compare">
        <div className="card-item">
          <h4>{left?.label}</h4>
          <p>{left?.desc}</p>
        </div>
        <div className="vs">vs</div>
        <div className="card-item">
          <h4>{right?.label}</h4>
          <p>{right?.desc}</p>
        </div>
      </div>
    )
  }
  if (model.kind === 'swot') {
    return (
      <div className="swot-grid">
        {items.slice(0, 4).map((item) => (
          <div className="swot" key={item.label}>
            <h4>{item.label}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    )
  }
  if (model.kind === 'pyramid' || model.kind === 'hierarchy') {
    return (
      <div className="pyramid">
        {items.map((item, i) => (
          <div
            className="band"
            key={item.label}
            style={{
              width: `${88 - i * (40 / Math.max(items.length - 1, 1))}%`,
              background: i % 2 ? palette.accent2 : palette.accent,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  if (model.kind === 'funnel') {
    return (
      <div className="funnel">
        {items.map((item, i) => (
          <div
            className="band"
            key={item.label}
            style={{ width: `${92 - i * (50 / Math.max(items.length - 1, 1))}%` }}
          >
            {item.label}
            {item.value ? ` · ${item.value}` : ''}
          </div>
        ))}
      </div>
    )
  }
  if (model.kind === 'cycle') {
    return (
      <div className="cycle">
        {items.map((item, i) => (
          <div className="card-item" key={item.label}>
            <h4>
              {String(i + 1).padStart(2, '0')}  {item.label}
            </h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    )
  }
  if (model.kind === 'timeline' || model.kind === 'roadmap') {
    return (
      <div className="timeline">
        {items.map((item, i) => (
          <div className="tl" key={item.label}>
            <div className="rail">
              <div className="dot" />
            </div>
            <div style={{ paddingBottom: i === items.length - 1 ? 0 : 18 }}>
              <h4>{item.label}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    )
  }
  if (model.kind === 'pie') {
    const n = Math.max(items.length, 1)
    const stops = items
      .map((_, i) => {
        const hue = i * (360 / n)
        const start = (i / n) * 360
        const end = ((i + 1) / n) * 360
        return `hsl(${hue} 45% 42%) ${start}deg ${end}deg`
      })
      .join(', ')
    return (
      <div className="pie-wrap">
        <div className="pie" style={{ background: `conic-gradient(${stops})` }} />
        <div className="legend">
          {items.map((item, i) => (
            <div key={item.label}>
              <i style={{ background: `hsl(${i * (360 / n)} 45% 42%)` }} />
              {item.label}
              {item.value ? ` · ${item.value}` : ''}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`layout-process ${isWide ? 'horizontal' : ''}`}>
      {items.map((item, i) => (
        <div className="step" key={`${item.label}-${i}`}>
          <div className="idx">{String(i + 1).padStart(2, '0')}</div>
          <div>
            <h4>{item.label}</h4>
            <p>{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
