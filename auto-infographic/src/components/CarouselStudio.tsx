import { useRef, useState } from 'react'
import { CarouselSlide } from './CarouselSlide'
import { generateCarousel } from '../lib/generateCarousel'
import { DEFAULT_CAROUSEL_PLATFORM, PLATFORMS, getPlatform, previewScale } from '../lib/platforms'
import { CAROUSEL_SAMPLES } from '../lib/samples'
import { PALETTES, getPalette } from '../lib/themes'
import type { CarouselKind, CarouselModel, PaletteId, SampleImage } from '../lib/types'

const KINDS: Array<{ id: CarouselKind; label: string }> = [
  { id: 'auto', label: 'Auto' },
  { id: 'thought-leadership', label: 'Thought leadership' },
  { id: 'product-launch', label: 'Product launch' },
  { id: 'how-to', label: 'How-to' },
  { id: 'story', label: 'Story' },
  { id: 'metrics', label: 'Proof' },
  { id: 'offer', label: 'Offer' },
]

interface Props {
  onCreated: (title: string) => void
}

export function CarouselStudio({ onCreated }: Props) {
  const [prompt, setPrompt] = useState(CAROUSEL_SAMPLES[0].prompt)
  const [kind, setKind] = useState<CarouselKind>('auto')
  const [slides, setSlides] = useState(6)
  const [header, setHeader] = useState('Operator notes')
  const [footer, setFooter] = useState('Not financial advice. Just taste.')
  const [brand, setBrand] = useState('Atelier')
  const [handle, setHandle] = useState('@atelier')
  const [platformId, setPlatformId] = useState(DEFAULT_CAROUSEL_PLATFORM)
  const [paletteId, setPaletteId] = useState<PaletteId>('editorial')
  const [model, setModel] = useState<CarouselModel | null>(null)
  const [active, setActive] = useState(0)
  const [samples, setSamples] = useState<SampleImage[]>([])
  const [busy, setBusy] = useState(false)
  const exportHost = useRef<HTMLDivElement>(null)

  const platform = getPlatform(platformId)
  const palette = getPalette(paletteId)
  const thumbScale = previewScale(platform, 180, 220)
  const stageScale = previewScale(platform, 520, 640)

  function create() {
    const next = generateCarousel(prompt, slides, kind, header, footer, brand, handle)
    setModel(next)
    setActive(0)
    onCreated(next.title)
  }

  async function onFiles(files: FileList | null) {
    if (!files) return
    const loaded: SampleImage[] = []
    for (const file of Array.from(files).slice(0, 6)) {
      const dataUrl = await readFile(file)
      loaded.push({ name: file.name, dataUrl })
    }
    setSamples(loaded)
  }

  async function save(kindOut: 'zip' | 'pdf') {
    const nodes = Array.from(exportHost.current?.querySelectorAll('.artboard') ?? []) as HTMLElement[]
    if (!nodes.length) return
    setBusy(true)
    try {
      const { downloadCarouselPdf, downloadCarouselZip, slugify } = await import('../lib/download')
      const name = slugify(model?.title || 'carousel')
      if (kindOut === 'zip') await downloadCarouselZip(nodes, name)
      else await downloadCarouselPdf(nodes, name, platform.width, platform.height)
    } finally {
      setBusy(false)
    }
  }

  const current = model?.slides[active]

  return (
    <main className="page studio">
      <aside className="panel">
        <div className="kicker">Carousel</div>
        <h2>How many slides?</h2>
        <p className="hint">
          A carousel is a short deck. Set the count, describe the story, optionally drop sample
          images, then generate intro through close.
        </p>
        <label htmlFor="slide-count">Slide count</label>
        <input
          id="slide-count"
          max={10}
          min={3}
          type="number"
          value={slides}
          onChange={(e) => setSlides(Number(e.target.value) || 3)}
        />
        <label htmlFor="ca-prompt">Idea / caption</label>
        <textarea
          id="ca-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What should this carousel teach, sell, or prove?"
        />
        <label>Kind</label>
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
          {PLATFORMS.filter((p) =>
            ['ig-post', 'ig-portrait', 'ig-story', 'fb-feed', 'li-carousel', 'li-post'].includes(p.id),
          ).map((p) => (
            <button
              className={`chip ${platformId === p.id ? 'active' : ''}`}
              key={p.id}
              onClick={() => setPlatformId(p.id)}
              type="button"
            >
              {p.network} · {p.hint}
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
            <label htmlFor="brand">Brand</label>
            <input id="brand" value={brand} onChange={(e) => setBrand(e.target.value)} />
          </div>
          <div>
            <label htmlFor="handle">Handle</label>
            <input id="handle" value={handle} onChange={(e) => setHandle(e.target.value)} />
          </div>
        </div>
        <div className="row">
          <div>
            <label htmlFor="ca-header">Header</label>
            <input id="ca-header" value={header} onChange={(e) => setHeader(e.target.value)} />
          </div>
          <div>
            <label htmlFor="ca-footer">Footer</label>
            <input id="ca-footer" value={footer} onChange={(e) => setFooter(e.target.value)} />
          </div>
        </div>
        <label>Sample images (optional)</label>
        <label className="file-btn">
          Upload references
          <input accept="image/*" multiple onChange={(e) => void onFiles(e.target.files)} type="file" />
        </label>
        {samples.length > 0 && (
          <p className="hint">{samples.length} sample{samples.length === 1 ? '' : 's'} attached to slides.</p>
        )}
        <div className="actions">
          <button className="primary" onClick={create} type="button">
            Create carousel
          </button>
          <button className="ghost" disabled={!model || busy} onClick={() => void save('zip')} type="button">
            Download PNG zip
          </button>
          <button className="ghost" disabled={!model || busy} onClick={() => void save('pdf')} type="button">
            Download PDF
          </button>
        </div>
        <label>Samples</label>
        <div className="samples">
          {CAROUSEL_SAMPLES.map((sample) => (
            <button
              className="sample-card"
              key={sample.id}
              onClick={() => {
                setPrompt(sample.prompt)
                setKind(sample.kind)
                setSlides(sample.slides)
              }}
              type="button"
            >
              {sample.title}
              <small>
                {sample.kind} · {sample.slides} slides
              </small>
            </button>
          ))}
        </div>
      </aside>
      <section className="preview-wrap">
        <div className="hint">
          {platform.name} · {slides} slides · {platform.width}×{platform.height}
        </div>
        <div className="stage" style={{ minHeight: platform.height * stageScale + 24 }}>
          {current && model ? (
            <div
              style={{
                width: platform.width * stageScale,
                height: platform.height * stageScale,
                overflow: 'hidden',
              }}
            >
              <CarouselSlide
                brand={brand}
                footer={footer}
                handle={handle}
                header={header}
                index={active}
                palette={palette}
                platform={platform}
                sampleSrc={samples[active % Math.max(samples.length, 1)]?.dataUrl}
                scale={stageScale}
                slide={current}
                total={model.slides.length}
              />
            </div>
          ) : (
            <div className="empty">Choose a slide count, then create the deck.</div>
          )}
        </div>
        {model && (
          <div className="carousel-rail">
            {model.slides.map((slide, index) => (
              <button
                className={`slide-thumb ${index === active ? 'active' : ''}`}
                key={`${slide.title}-${index}`}
                onClick={() => setActive(index)}
                type="button"
              >
                <div
                  style={{
                    width: platform.width * thumbScale,
                    height: platform.height * thumbScale,
                    overflow: 'hidden',
                  }}
                >
                  <CarouselSlide
                    brand={brand}
                    footer={footer}
                    handle={handle}
                    header={header}
                    index={index}
                    palette={palette}
                    platform={platform}
                    sampleSrc={samples[index % Math.max(samples.length, 1)]?.dataUrl}
                    scale={thumbScale}
                    slide={slide}
                    total={model.slides.length}
                  />
                </div>
              </button>
            ))}
          </div>
        )}
        <div
          ref={exportHost}
          aria-hidden="true"
          style={{ position: 'fixed', left: 0, top: 0, zIndex: -1, opacity: 0, pointerEvents: 'none' }}
        >
          {model?.slides.map((slide, index) => (
            <CarouselSlide
              brand={brand}
              footer={footer}
              handle={handle}
              header={header}
              index={index}
              key={`export-${index}`}
              palette={palette}
              platform={platform}
              sampleSrc={samples[index % Math.max(samples.length, 1)]?.dataUrl}
              scale={1}
              slide={slide}
              total={model.slides.length}
            />
          ))}
        </div>
      </section>
    </main>
  )
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
