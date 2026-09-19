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

function BrandMark() {
  return (
    <span className="piece-mark" aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  )
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
  const photo = sampleSrc || slide.image
  const series = header || brand || 'Studio'
  const signoff = footer || 'Save this series'
  const visual = slide.role === 'quote' ? 'content' : slide.role
  const dark = visual === 'intro' || visual === 'outro' || visual === 'stat'
  const style = {
    width: platform.width,
    height: platform.height,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    background: visual === 'stat' ? palette.accent : visual === 'outro' ? palette.ink : palette.surface,
    color: dark ? (visual === 'stat' ? palette.onAccent : '#fff') : palette.ink,
    ['--accent' as string]: palette.accent,
    ['--accent-2' as string]: palette.accent2,
    ['--accent-3' as string]: palette.accent3,
    ['--muted' as string]: dark ? palette.onAccent : palette.muted,
    ['--line' as string]: palette.line,
    ['--on-accent' as string]: palette.onAccent,
    ['--bg' as string]: palette.bg,
    ['--ink' as string]: palette.ink,
    ['--surface' as string]: palette.surface,
  } as CSSProperties

  const titleSize = slide.role === 'intro' ? 72 : slide.role === 'outro' ? 54 : 44

  return (
    <article className={`artboard piece slide-${visual}`} style={style}>
      {photo ? <img alt="" className="slide-photo" crossOrigin="anonymous" src={photo} /> : null}
      <div className="slide-shade" />
      <header className="piece-top">
        <span className="piece-top-left">
          <BrandMark />
          <span>{series}</span>
        </span>
        <span className="piece-count">
          {index + 1}/{total}
        </span>
      </header>
      <div className="slide-copy">
        <div className="kicker">{slide.kicker}</div>
        {slide.role === 'stat' && slide.stat ? (
          <>
            <div className="art-title slide-stat" style={{ fontSize: 108 }}>
              {slide.stat}
            </div>
            <p className="art-sub" style={{ fontSize: 24 }}>
              {slide.statLabel}
            </p>
            <p className="art-sub">{slide.body}</p>
          </>
        ) : (
          <>
            <h3 className="art-title" style={{ fontSize: titleSize, maxWidth: '16ch' }}>
              {slide.title}
            </h3>
            <p
              className="art-sub"
              style={{
                fontSize: slide.role === 'quote' ? 24 : 20,
                fontStyle: slide.role === 'quote' ? 'italic' : 'normal',
                maxWidth: '28ch',
              }}
            >
              {slide.body}
            </p>
          </>
        )}
      </div>
      <footer className="piece-bottom">
        <span>
          {brand} {handle}
        </span>
        <span>{signoff}</span>
      </footer>
    </article>
  )
}
