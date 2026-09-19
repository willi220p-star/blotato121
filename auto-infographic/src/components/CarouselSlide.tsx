import type { CSSProperties } from 'react'
import { fitType, pointsFromText, slideMode } from '../lib/slideLayout'
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
  const signoff = footer || (slide.role === 'intro' ? 'Swipe →' : 'Save this series')
  const mode = slideMode(slide.role, index)
  const invert = mode === 'fill' && index % 2 === 0
  const ink = invert ? palette.onAccent : palette.ink
  const paper = invert ? palette.accent : palette.surface
  const pad = Math.round(Math.min(platform.width, platform.height) * 0.072)
  const copyW = platform.width - pad * 2
  const copyH =
    mode === 'cover'
      ? platform.height * 0.58
      : mode === 'split'
        ? platform.height * 0.42
        : platform.height * 0.62
  const titleSize = fitType(
    slide.title,
    copyW,
    slide.role === 'intro' ? copyH * 0.72 : copyH * 0.42,
    slide.role === 'intro' ? 52 : 34,
    slide.role === 'intro' ? 124 : 78,
  )
  const points = pointsFromText(slide.body, slide.points ?? [])
  const style = {
    width: platform.width,
    height: platform.height,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    background:
      mode === 'cover'
        ? `linear-gradient(160deg, ${palette.ink} 0%, ${palette.accent} 58%, ${palette.accent2} 100%)`
        : paper,
    color: ink,
    ['--accent' as string]: palette.accent,
    ['--accent-2' as string]: palette.accent2,
    ['--accent-3' as string]: palette.accent3,
    ['--muted' as string]: invert ? palette.onAccent : palette.muted,
    ['--line' as string]: palette.line,
    ['--on-accent' as string]: palette.onAccent,
    ['--bg' as string]: palette.bg,
    ['--ink' as string]: palette.ink,
    ['--surface' as string]: palette.surface,
    ['--pad' as string]: `${pad}px`,
  } as CSSProperties

  return (
    <article className={`artboard piece slide mode-${mode} role-${slide.role}`} style={style}>
      {photo ? (
        <div className="slide-media">
          <img
            alt=""
            crossOrigin="anonymous"
            src={photo}
            onError={(e) => {
              e.currentTarget.style.opacity = '0'
            }}
          />
          <div className="slide-shade" />
        </div>
      ) : (
        <div className="slide-media slide-media-empty">
          <div className="slide-shade" />
        </div>
      )}

      <header className="slide-bar slide-bar-top">
        <span className="piece-top-left">
          <BrandMark />
          <span>{series}</span>
        </span>
        <span className="piece-count">
          {index + 1}/{total}
        </span>
      </header>

      <div className="slide-stage">
        {slide.role === 'stat' && slide.stat ? (
          <div className="slide-stat-block">
            <div className="kicker">{slide.kicker || 'Proof'}</div>
            <div className="slide-stat-num">{slide.stat}</div>
            <p className="slide-lede">{slide.statLabel || slide.title}</p>
            <p className="slide-body">{slide.body}</p>
          </div>
        ) : slide.role === 'quote' ? (
          <div className="slide-quote-block">
            <div className="kicker">{slide.kicker || 'Note'}</div>
            <h3 className="slide-title" style={{ fontSize: titleSize }}>
              {slide.title}
            </h3>
            <p className="slide-body slide-quote">{slide.body}</p>
          </div>
        ) : (
          <>
            <div className="kicker">{slide.kicker || (slide.role === 'intro' ? 'Cover' : String(index).padStart(2, '0'))}</div>
            <h3 className="slide-title" style={{ fontSize: titleSize }}>
              {slide.title}
            </h3>
            {slide.role === 'intro' || slide.role === 'outro' || points.length < 2 ? (
              <p className="slide-body">{slide.body}</p>
            ) : (
              <ul className="slide-points">
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      <footer className="slide-bar slide-bar-bottom">
        <span>
          {brand} {handle}
        </span>
        <span>{slide.role === 'intro' ? 'Swipe →' : signoff}</span>
      </footer>
    </article>
  )
}
