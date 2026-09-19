import { lazy, Suspense, useRef, useState } from 'react'
import { InfographicArt } from './InfographicArt'
import { PaletteDots, SizeBar, platformLabel } from './SizeBar'
import { generateInfographic } from '../lib/generateInfographic'
import { DEFAULT_INFOGRAPHIC_PLATFORM, getPlatform, previewScale } from '../lib/platforms'
import { INFOGRAPHIC_SAMPLES } from '../lib/samples'
import { getPalette } from '../lib/themes'
import type { InfographicKind, InfographicModel, PaletteId } from '../lib/types'

const AntvCanvas = lazy(() => import('./AntvCanvas'))

const KINDS: Array<{ id: InfographicKind; label: string }> = [
  { id: 'auto', label: 'Auto' },
  { id: 'process', label: 'Process' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'comparison', label: 'Compare' },
  { id: 'stats', label: 'Stats' },
  { id: 'list', label: 'List' },
  { id: 'swot', label: 'SWOT' },
  { id: 'pyramid', label: 'Pyramid' },
  { id: 'funnel', label: 'Funnel' },
  { id: 'cycle', label: 'Cycle' },
  { id: 'roadmap', label: 'Roadmap' },
  { id: 'hierarchy', label: 'Hierarchy' },
  { id: 'pie', label: 'Breakdown' },
]

interface Props {
  onCreated: (title: string) => void
}

export function InfographicStudio({ onCreated }: Props) {
  const [prompt, setPrompt] = useState('')
  const [kind, setKind] = useState<InfographicKind>('auto')
  const [header, setHeader] = useState('')
  const [footer, setFooter] = useState('')
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [platformId, setPlatformId] = useState(DEFAULT_INFOGRAPHIC_PLATFORM)
  const [customW, setCustomW] = useState(1080)
  const [customH, setCustomH] = useState(1350)
  const [paletteId, setPaletteId] = useState<PaletteId>('atelier')
  const [engine, setEngine] = useState<'studio' | 'antv'>('studio')
  const [model, setModel] = useState<InfographicModel | null>(null)
  const [busy, setBusy] = useState(false)
  const [sampleId, setSampleId] = useState<string | null>(null)
  const board = useRef<HTMLDivElement>(null)
  const exportHost = useRef<HTMLDivElement>(null)

  const platform = getPlatform(platformId, customW, customH)
  const palette = getPalette(paletteId)
  const scale = previewScale(platform, 640, 760)
  const liveModel = model
    ? { ...model, header, footer, title: title || model.title, subtitle: subtitle || model.subtitle }
    : null

  function create(nextPrompt = prompt, nextKind = kind) {
    const text = nextPrompt.trim()
    if (!text) return
    const next = generateInfographic(text, nextKind, header, footer, palette)
    setModel(next)
    setTitle(next.title)
    setSubtitle(next.subtitle)
    onCreated(next.title)
  }

  function applySample(id: string) {
    const sample = INFOGRAPHIC_SAMPLES.find((s) => s.id === id)
    if (!sample) return
    setSampleId(id)
    setPrompt(sample.prompt)
    setKind(sample.kind)
    create(sample.prompt, sample.kind)
  }

  function changeKind(nextKind: InfographicKind) {
    setKind(nextKind)
    if (prompt.trim()) create(prompt, nextKind)
  }

  async function save(kindOut: 'png' | 'svg') {
    const node =
      (exportHost.current?.querySelector('.artboard') as HTMLElement | null) ??
      (board.current?.querySelector('.artboard') as HTMLElement | null)
    if (!node) return
    setBusy(true)
    try {
      const { downloadPng, downloadSvg, slugify } = await import('../lib/download')
      const name = slugify(liveModel?.title || 'infographic')
      if (kindOut === 'png') await downloadPng(node, `${name}.png`)
      else await downloadSvg(node, `${name}.svg`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="studio-page">
      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault()
          create()
        }}
      >
        <textarea
          autoFocus
          id="ig-prompt"
          placeholder="Describe the infographic…"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value)
            setSampleId(null)
          }}
        />
        <div className="composer-row">
          <div className="sample-pills">
            {INFOGRAPHIC_SAMPLES.map((sample) => (
              <button
                className={`chip ${sampleId === sample.id ? 'active' : ''}`}
                key={sample.id}
                onClick={() => applySample(sample.id)}
                type="button"
              >
                {sample.title}
              </button>
            ))}
          </div>
          <button className="primary" disabled={!prompt.trim()} type="submit">
            Generate
          </button>
        </div>
      </form>

      <div className="studio-body">
        <aside className="edit-rail">
          <label>Layout</label>
          <div className="chips">
            {KINDS.map((item) => (
              <button
                className={`chip ${kind === item.id ? 'active' : ''}`}
                key={item.id}
                onClick={() => changeKind(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
          <label>Size</label>
          <SizeBar
            customH={customH}
            customW={customW}
            platformId={platformId}
            onCustom={(w, h) => {
              setCustomW(w)
              setCustomH(h)
              setPlatformId('custom')
            }}
            onPlatform={setPlatformId}
          />
          <label>Palette</label>
          <PaletteDots value={paletteId} onChange={setPaletteId} />
          {liveModel && (
            <>
              <label htmlFor="ig-title">Title</label>
              <input id="ig-title" value={title} onChange={(e) => setTitle(e.target.value)} />
              <div className="row">
                <div>
                  <label htmlFor="ig-header">Header</label>
                  <input id="ig-header" value={header} onChange={(e) => setHeader(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="ig-footer">Footer</label>
                  <input id="ig-footer" value={footer} onChange={(e) => setFooter(e.target.value)} />
                </div>
              </div>
              <div className="chips engine-row">
                <button className={`chip ${engine === 'studio' ? 'active' : ''}`} onClick={() => setEngine('studio')} type="button">
                  Studio
                </button>
                <button className={`chip ${engine === 'antv' ? 'active' : ''}`} onClick={() => setEngine('antv')} type="button">
                  Diagram
                </button>
              </div>
              <div className="actions">
                <button className="primary" disabled={busy} onClick={() => void save('png')} type="button">
                  PNG
                </button>
                <button className="ghost" disabled={busy} onClick={() => void save('svg')} type="button">
                  SVG
                </button>
              </div>
            </>
          )}
        </aside>
        <section className="preview-wrap">
          <div className="stage-meta">{platformLabel(platform)}</div>
          <div className="stage">
            {liveModel ? (
              <div
                ref={board}
                style={{
                  width: platform.width * scale,
                  height: platform.height * scale,
                  overflow: 'hidden',
                }}
              >
                {engine === 'antv' ? (
                  <Suspense fallback={<div className="empty">…</div>}>
                    <AntvCanvas syntax={liveModel.syntax} platform={platform} palette={palette} scale={scale} />
                  </Suspense>
                ) : (
                  <InfographicArt model={liveModel} palette={palette} platform={platform} scale={scale} />
                )}
              </div>
            ) : (
              <div className="empty-stage" />
            )}
          </div>
          <div
            ref={exportHost}
            aria-hidden="true"
            style={{ position: 'fixed', left: 0, top: 0, zIndex: -1, opacity: 0, pointerEvents: 'none' }}
          >
            {liveModel && engine === 'studio' && (
              <InfographicArt model={liveModel} palette={palette} platform={platform} scale={1} />
            )}
            {liveModel && engine === 'antv' && (
              <Suspense fallback={null}>
                <AntvCanvas syntax={liveModel.syntax} platform={platform} palette={palette} scale={1} />
              </Suspense>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}
