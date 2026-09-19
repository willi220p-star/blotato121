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
  return Math.round(short * 0.08)
}

function Shot({ src, alt, className }: { src?: string; alt: string; className: string }) {
  if (!src) return null
  return <img alt={alt} className={className} crossOrigin="anonymous" src={src} />
}

export function InfographicArt({ model, palette, platform, scale = 1 }: Props) {
  const p = pad(platform)
  const wide = platform.width / platform.height > 1.15
  const titleSize = wide ? Math.round(platform.width * 0.032) : Math.round(platform.width * 0.048)
  const style = {
    width: platform.width,
    height: platform.height,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    background: `linear-gradient(180deg, ${palette.surface} 0%, ${palette.bg} 100%)`,
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

  return (
    <article className="artboard" style={style}>
      <div className="art-header">
        <span>{model.header || palette.name}</span>
        <span>{platform.network === 'Generic' ? `${platform.width}×${platform.height}` : platform.network}</span>
      </div>
      <div className="art-body">
        <h3 className="art-title" style={{ fontSize: titleSize }}>
          {model.title}
        </h3>
        {model.subtitle ? <p className="art-sub">{model.subtitle}</p> : null}
        <Shot alt="" className="hero-shot" src={model.heroImage} />
        <Layout isWide={wide} model={model} palette={palette} />
      </div>
      {model.footer || model.source ? (
        <div className="art-footer">
          <span>{model.footer || (model.source === 'ai' ? 'Researched & illustrated' : '')}</span>
          <span>{String(model.items.length).padStart(2, '0')}</span>
        </div>
      ) : null}
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
        {items.map((item, i) => (
          <div className="stat" key={`${item.label}-${i}`}>
            <Shot alt="" className="item-shot wide" src={item.image} />
            <b>{item.value || item.label}</b>
            {item.value ? <h4>{item.label}</h4> : null}
            {item.desc ? <p>{item.desc}</p> : null}
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
          <Shot alt="" className="card-shot" src={left?.image} />
          <h4>{left?.label}</h4>
          {left?.desc ? <p>{left.desc}</p> : null}
        </div>
        <div className="vs">vs</div>
        <div className="card-item">
          <Shot alt="" className="card-shot" src={right?.image} />
          <h4>{right?.label}</h4>
          {right?.desc ? <p>{right.desc}</p> : null}
        </div>
      </div>
    )
  }
  if (model.kind === 'swot') {
    return (
      <div className="swot-grid">
        {items.slice(0, 4).map((item, i) => (
          <div className="swot" key={`${item.label}-${i}`}>
            <Shot alt="" className="item-shot" src={item.image} />
            <h4>{item.label}</h4>
            {item.desc ? <p>{item.desc}</p> : null}
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
            key={`${item.label}-${i}`}
            style={{
              width: `${90 - i * (42 / Math.max(items.length - 1, 1))}%`,
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
            key={`${item.label}-${i}`}
            style={{ width: `${94 - i * (52 / Math.max(items.length - 1, 1))}%` }}
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
          <div className="card-item" key={`${item.label}-${i}`}>
            <Shot alt="" className="card-shot" src={item.image} />
            <h4>
              {String(i + 1).padStart(2, '0')} {item.label}
            </h4>
            {item.desc ? <p>{item.desc}</p> : null}
          </div>
        ))}
      </div>
    )
  }
  if (model.kind === 'timeline' || model.kind === 'roadmap') {
    return (
      <div className="timeline">
        {items.map((item, i) => (
          <div className="tl" key={`${item.label}-${i}`}>
            <div className="rail">
              <div className="dot" />
            </div>
            <div className="tl-copy" style={{ paddingBottom: i === items.length - 1 ? 0 : 22 }}>
              <Shot alt="" className="item-shot" src={item.image} />
              <div>
                <h4>{item.label}</h4>
                {item.desc ? <p>{item.desc}</p> : null}
              </div>
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
        return `hsl(${hue} 38% 44%) ${start}deg ${end}deg`
      })
      .join(', ')
    return (
      <div className="pie-wrap">
        <div className="pie" style={{ background: `conic-gradient(${stops})` }} />
        <div className="legend">
          {items.map((item, i) => (
            <div key={`${item.label}-${i}`}>
              <i style={{ background: `hsl(${i * (360 / n)} 38% 44%)` }} />
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
          <Shot alt="" className="item-shot" src={item.image} />
          <div className="idx">{String(i + 1).padStart(2, '0')}</div>
          <div>
            <h4>{item.label}</h4>
            {item.desc ? <p>{item.desc}</p> : null}
          </div>
        </div>
      ))}
    </div>
  )
}
