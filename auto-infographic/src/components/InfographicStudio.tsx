import { lazy, Suspense, useRef, useState } from 'react'
import { InfographicArt } from './InfographicArt'
import { generateInfographic } from '../lib/generateInfographic'
import { DEFAULT_INFOGRAPHIC_PLATFORM, PLATFORMS, getPlatform, previewScale } from '../lib/platforms'
import { INFOGRAPHIC_SAMPLES } from '../lib/samples'
import { PALETTES, getPalette } from '../lib/themes'
import type { EngineMode, InfographicKind, InfographicModel, PaletteId } from '../lib/types'

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
  const [prompt, setPrompt] = useState(INFOGRAPHIC_SAMPLES[0].prompt)
  const [kind, setKind] = useState<InfographicKind>('auto')
  const [header, setHeader] = useState('Studio')
  const [footer, setFooter] = useState('Prepared for client review')
  const [platformId, setPlatformId] = useState(DEFAULT_INFOGRAPHIC_PLATFORM)
  const [paletteId, setPaletteId] = useState<PaletteId>('atelier')
  const [engine, setEngine] = useState<EngineMode>('studio')
  const [model, setModel] = useState<InfographicModel | null>(null)
  const [busy, setBusy] = useState(false)
  const board = useRef<HTMLDivElement>(null)
  const exportHost = useRef<HTMLDivElement>(null)

  const platform = getPlatform(platformId)
  const palette = getPalette(paletteId)
  const scale = previewScale(platform)
  const liveModel = model ? { ...model, header, footer } : null

  function create() {
    const next = generateInfographic(prompt, kind, header, footer, palette)
    setModel(next)
    onCreated(next.title)
  }

  async function save(kindOut: 'png' | 'svg') {
    const node =
      (exportHost.current?.querySelector('.artboard') as HTMLElement | null) ??
      (board.current?.querySelector('.artboard') as HTMLElement | null)
    if (!node) return
    setBusy(true)
    try {
      const { downloadPng, downloadSvg, slugify } = await import('../lib/download')
      const name = slugify(model?.title || 'infographic')
      if (kindOut === 'png') await downloadPng(node, `${name}.png`)
      else await downloadSvg(node, `${name}.svg`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="page studio">
      <aside className="panel">
        <div className="kicker">Infographic</div>
        <h2>Describe the piece</h2>
        <p className="hint">
          A caption, a list of steps, or a messy brief is enough. Pick a type or leave Auto to
          read the idea.
        </p>
        <label htmlFor="ig-prompt">Idea / caption</label>
        <textarea
          id="ig-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What should this infographic say?"
        />
        <label>Type</label>
        <div className="chips">
          {KINDS.map((item) => (
            <button
              className={`chip ${kind === item.id ? 'active' : ''}`}
              key={item.id}
              onClick={() => setKind(item.id)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>
        <label>Platform size</label>
        <div className="chips">
          {PLATFORMS.map((p) => (
            <button
              className={`chip ${platformId === p.id ? 'active' : ''}`}
              key={p.id}
              onClick={() => setPlatformId(p.id)}
              type="button"
            >
              {p.network} · {p.name.replace(p.network + ' ', '')}
            </button>
          ))}
        </div>
        <label>Palette</label>
        <div className="chips">
          {PALETTES.map((p) => (
            <button
              className={`chip ${paletteId === p.id ? 'active' : ''}`}
              key={p.id}
              onClick={() => setPaletteId(p.id)}
              type="button"
            >
              {p.name}
            </button>
          ))}
        </div>
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
        <label>Engine</label>
        <div className="chips">
          <button className={`chip ${engine === 'studio' ? 'active' : ''}`} onClick={() => setEngine('studio')} type="button">
            Studio layout
          </button>
          <button className={`chip ${engine === 'antv' ? 'active' : ''}`} onClick={() => setEngine('antv')} type="button">
            AntV diagram
          </button>
        </div>
        <div className="actions">
          <button className="primary" onClick={create} type="button">
            Create infographic
          </button>
          <button className="ghost" disabled={!liveModel || busy} onClick={() => void save('png')} type="button">
            Download PNG
          </button>
          <button className="ghost" disabled={!liveModel || busy} onClick={() => void save('svg')} type="button">
            Download SVG
          </button>
        </div>
        <label>Samples</label>
        <div className="samples">
          {INFOGRAPHIC_SAMPLES.map((sample) => (
            <button
              className="sample-card"
              key={sample.id}
              onClick={() => {
                setPrompt(sample.prompt)
                setKind(sample.kind)
              }}
              type="button"
            >
              {sample.title}
              <small>{sample.kind}</small>
            </button>
          ))}
        </div>
      </aside>
      <section className="preview-wrap">
        <div className="hint">
          {platform.name} · {platform.width}×{platform.height} · {platform.hint}
        </div>
        <div className="stage" style={{ minHeight: platform.height * scale + 24 }}>
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
                <Suspense fallback={<div className="empty">Loading diagram engine…</div>}>
                  <AntvCanvas syntax={liveModel.syntax} platform={platform} palette={palette} scale={scale} />
                </Suspense>
              ) : (
                <InfographicArt model={liveModel} palette={palette} platform={platform} scale={scale} />
              )}
            </div>
          ) : (
            <div className="empty">Create a piece to preview it at the chosen crop.</div>
          )}
        </div>
        <div ref={exportHost} aria-hidden="true" style={{ position: 'fixed', left: 0, top: 0, zIndex: -1, opacity: 0, pointerEvents: 'none' }}>
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
    </main>
  )
}
