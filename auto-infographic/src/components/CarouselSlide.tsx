import type { CSSProperties } from 'react'
import type { CarouselSlideModel, Palette, Platform } from '../lib/types'

interface Props {
  slide: CarouselSlideModel
  index: number
  total: number
  palette: Palette
  platform: Platform
  header: string
  footer: string
  brand: string
  handle: string
  scale?: number
  sampleSrc?: string
}

export function CarouselSlide({
  slide,
  index,
  total,
  palette,
  platform,
  header,
  footer,
  brand,
  handle,
  scale = 1,
  sampleSrc,
}: Props) {
  const p = Math.round(Math.min(platform.width, platform.height) * 0.08)
  const style = {
    width: platform.width,
    height: platform.height,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    background: palette.surface,
    color: palette.ink,
    padding: p,
    ['--accent' as string]: palette.accent,
    ['--muted' as string]: palette.muted,
    ['--line' as string]: palette.line,
    ['--on-accent' as string]: palette.onAccent,
    ['--bg' as string]: palette.bg,
    ['--ink' as string]: palette.ink,
    backgroundImage: sampleSrc
      ? `linear-gradient(180deg, color-mix(in srgb, ${palette.surface} 88%, transparent), ${palette.surface}), url(${sampleSrc})`
      : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } as CSSProperties

  const titleSize = slide.role === 'intro' ? 64 : slide.role === 'outro' ? 48 : 42

  return (
    <article className="artboard" style={style}>
      <div className="art-header">
        <span>{header || brand}</span>
        <span>
          {index + 1} / {total}
        </span>
      </div>
      <div className="art-body" style={{ marginTop: 28, justifyContent: 'center' }}>
        <div className="kicker" style={{ color: palette.accent }}>
          {slide.kicker}
        </div>
        {slide.role === 'stat' && slide.stat ? (
          <>
            <div className="art-title" style={{ fontSize: 96, marginBottom: 8 }}>
              {slide.stat}
            </div>
            <p className="art-sub" style={{ fontSize: 22 }}>
              {slide.statLabel}
            </p>
            <p className="art-sub">{slide.body}</p>
          </>
        ) : (
          <>
            <h3 className="art-title" style={{ fontSize: titleSize, maxWidth: '18ch' }}>
              {slide.title}
            </h3>
            <p
              className="art-sub"
              style={{
                fontSize: slide.role === 'quote' ? 22 : 18,
                fontStyle: slide.role === 'quote' ? 'italic' : 'normal',
                maxWidth: '34ch',
              }}
            >
              {slide.body}
            </p>
          </>
        )}
      </div>
      <div className="art-footer">
        <span>
          {brand} {handle}
        </span>
        <span>{footer || 'Auto Infographic Generator'}</span>
      </div>
    </article>
  )
}
