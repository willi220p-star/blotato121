import type { CSSProperties } from 'react'
import { tone } from '../lib/themes'
import type { InfographicModel, Palette, Platform } from '../lib/types'

interface Props {
  model: InfographicModel
  palette: Palette
  platform: Platform
  scale?: number
}

function Shot({ src, alt, className }: { src?: string; alt: string; className: string }) {
  if (!src) return null
  return <img alt={alt} className={className} crossOrigin="anonymous" src={src} />
}

function BrandMark() {
  return (
    <span className="piece-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
}

export function InfographicArt({ model, palette, platform, scale = 1 }: Props) {
  const wide = platform.width / platform.height > 1.15
  const titleSize = wide ? Math.round(platform.width * 0.042) : Math.round(platform.width * 0.058)
  const heroH = Math.round(platform.height * (wide ? 0.36 : 0.3))
  const header = model.header || model.kind.replace('-', ' ')
  const footer = model.footer || model.caption || 'Save this graphic'
  const style = {
    width: platform.width,
    height: platform.height,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    background: `linear-gradient(165deg, ${palette.surface} 0%, ${palette.bg} 55%, ${palette.accent}22 100%)`,
    color: palette.ink,
    ['--accent' as string]: palette.accent,
    ['--accent-2' as string]: palette.accent2,
    ['--accent-3' as string]: palette.accent3,
    ['--muted' as string]: palette.muted,
    ['--line' as string]: palette.line,
    ['--on-accent' as string]: palette.onAccent,
    ['--bg' as string]: palette.bg,
    ['--surface' as string]: palette.surface,
    ['--ink' as string]: palette.ink,
  } as CSSProperties

  return (
    <article className="artboard piece" style={style}>
      <header className="piece-top">
        <span className="piece-top-left">
          <BrandMark />
          <span>{header}</span>
        </span>
        <span className="piece-pill">{model.kind}</span>
      </header>
      <div className="piece-hero" style={{ height: heroH }}>
        <Shot alt="" className="piece-hero-img" src={model.heroImage} />
        <div className="piece-hero-shade" />
        <div className="piece-hero-copy">
          <h3 className="art-title" style={{ fontSize: titleSize }}>
            {model.title}
          </h3>
          {model.subtitle ? <p className="art-sub">{model.subtitle}</p> : null}
        </div>
      </div>
      <div className={`piece-main ${wide ? 'wide' : ''}`}>
        <Layout isWide={wide} model={model} palette={palette} />
      </div>
      <footer className="piece-bottom">
        <span>{footer}</span>
        <span className="piece-count">{String(model.items.length).padStart(2, '0')}</span>
      </footer>
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
          <div className="stat-tile" key={`${item.label}-${i}`} style={{ background: tone(palette, i) }}>
            <Shot alt="" className="stat-shot" src={item.image} />
            <div className="stat-copy">
              <b>{item.value || item.label}</b>
              {item.value ? <h4>{item.label}</h4> : null}
              {item.desc ? <p>{item.desc}</p> : null}
            </div>
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
        <div className="compare-card" style={{ ['--card' as string]: palette.accent }}>
          <Shot alt="" className="card-shot" src={left?.image} />
          <h4>{left?.label}</h4>
          {left?.desc ? <p>{left.desc}</p> : null}
        </div>
        <div className="vs">VS</div>
        <div className="compare-card" style={{ ['--card' as string]: palette.accent2 }}>
          <Shot alt="" className="card-shot" src={right?.image} />
          <h4>{right?.label}</h4>
          {right?.desc ? <p>{right.desc}</p> : null}
        </div>
      </div>
    )
  }
  if (model.kind === 'swot') {
    const colors = ['#12B76A', '#F04438', '#2E90FA', '#F79009']
    return (
      <div className="swot-grid">
        {items.slice(0, 4).map((item, i) => (
          <div className="swot" key={`${item.label}-${i}`} style={{ background: colors[i] }}>
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
              width: `${92 - i * (40 / Math.max(items.length - 1, 1))}%`,
              background: tone(palette, i),
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
            style={{
              width: `${94 - i * (50 / Math.max(items.length - 1, 1))}%`,
              background: tone(palette, i),
            }}
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
          <div className="rich-card" key={`${item.label}-${i}`} style={{ ['--card' as string]: tone(palette, i) }}>
            <Shot alt="" className="card-shot" src={item.image} />
            <div className="rich-copy">
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <h4>{item.label}</h4>
              {item.desc ? <p>{item.desc}</p> : null}
            </div>
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
              <div className="dot" style={{ background: tone(palette, i) }} />
            </div>
            <div className="tl-card" style={{ ['--card' as string]: tone(palette, i) }}>
              <Shot alt="" className="tl-shot" src={item.image} />
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
    const colors = items.map((_, i) => tone(palette, i))
    const stops = colors
      .map((color, i) => {
        const start = (i / n) * 360
        const end = ((i + 1) / n) * 360
        return `${color} ${start}deg ${end}deg`
      })
      .join(', ')
    return (
      <div className="pie-wrap">
        <div className="pie" style={{ background: `conic-gradient(${stops})` }} />
        <div className="legend">
          {items.map((item, i) => (
            <div key={`${item.label}-${i}`}>
              <i style={{ background: colors[i] }} />
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
        <div className="rich-card" key={`${item.label}-${i}`} style={{ ['--card' as string]: tone(palette, i) }}>
          <Shot alt="" className="card-shot" src={item.image} />
          <div className="rich-copy">
            <span className="idx">{String(i + 1).padStart(2, '0')}</span>
            <h4>{item.label}</h4>
            {item.desc ? <p>{item.desc}</p> : null}
          </div>
        </div>
      ))}
    </div>
  )
}
