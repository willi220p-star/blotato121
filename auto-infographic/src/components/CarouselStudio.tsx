import { useRef, useState } from 'react'
import { CarouselSlide } from './CarouselSlide'
import { PaletteDots, SizeBar, platformLabel } from './SizeBar'
import { generateCarousel, patchCarouselSlide, restyleCarousel } from '../lib/generateCarousel'
import { DEFAULT_CAROUSEL_PLATFORM, getPlatform, previewScale } from '../lib/platforms'
import { CAROUSEL_SAMPLES } from '../lib/samples'
import { getPalette } from '../lib/themes'
import type { AiPhase, AiProgress, CarouselKind, CarouselModel, CarouselSlideModel, PaletteId, SampleImage } from '../lib/types'

const KINDS: Array<{ id: CarouselKind; label: string }> = [
  { id: 'auto', label: 'Auto' },
  { id: 'thought-leadership', label: 'Thought' },
  { id: 'product-launch', label: 'Launch' },
  { id: 'how-to', label: 'How-to' },
  { id: 'story', label: 'Story' },
  { id: 'metrics', label: 'Proof' },
  { id: 'offer', label: 'Offer' },
]

interface Props {
  onCreated: (title: string) => void
}

export function CarouselStudio({ onCreated }: Props) {
  const [prompt, setPrompt] = useState('')
  const [kind, setKind] = useState<CarouselKind>('auto')
  const [slides, setSlides] = useState(5)
  const [header, setHeader] = useState('')
  const [footer, setFooter] = useState('')
  const [brand, setBrand] = useState('')
  const [handle, setHandle] = useState('')
  const [platformId, setPlatformId] = useState(DEFAULT_CAROUSEL_PLATFORM)
  const [customW, setCustomW] = useState(1080)
  const [customH, setCustomH] = useState(1080)
  const [paletteId, setPaletteId] = useState<PaletteId>('editorial')
  const [model, setModel] = useState<CarouselModel | null>(null)
  const [active, setActive] = useState(0)
  const [images, setImages] = useState<SampleImage[]>([])
  const [busy, setBusy] = useState(false)
  const [phase, setPhase] = useState<AiPhase>('idle')
  const [thinkNote, setThinkNote] = useState('')
  const [sources, setSources] = useState<string[]>([])
  const [sampleId, setSampleId] = useState<string | null>(null)
  const exportHost = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const platform = getPlatform(platformId, customW, customH)
  const palette = getPalette(paletteId)
  const thumbScale = previewScale(platform, 148, 180)
  const stageScale = previewScale(platform, 540, 620)
  const current = model?.slides[active]
  const thinking = phase !== 'idle'

  function onProgress(progress: AiProgress) {
    setPhase(progress.phase)
    if (progress.note) setThinkNote(progress.note)
    if (progress.sources) setSources(progress.sources)
  }

  async function create(nextPrompt = prompt, nextKind = kind, nextSlides = slides) {
    const text = nextPrompt.trim()
    if (!text || thinking) return
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl
    setPhase('research')
    setThinkNote('Reading the brief')
    setSources([])
    try {
      const next = await generateCarousel(
        text,
        nextSlides,
        nextKind,
        header,
        footer,
        brand,
        handle,
        onProgress,
        ctrl.signal,
      )
      if (ctrl.signal.aborted) return
      setModel(next)
      setActive(0)
      if (nextKind === 'auto') setKind(next.kind)
      setThinkNote('')
      onCreated(next.title)
    } catch {
      if (!ctrl.signal.aborted) setThinkNote('Could not finish that pass — try again')
    } finally {
      if (abortRef.current === ctrl) {
        setPhase('idle')
        abortRef.current = null
      }
    }
  }

  function applySample(id: string) {
    const sample = CAROUSEL_SAMPLES.find((s) => s.id === id)
    if (!sample) return
    setSampleId(id)
    setPrompt(sample.prompt)
    setKind(sample.kind)
    setSlides(sample.slides)
    void create(sample.prompt, sample.kind, sample.slides)
  }

  function patchSlide(partial: Partial<CarouselSlideModel>) {
    if (!model) return
    setModel(patchCarouselSlide(model, active, partial))
  }

  async function onFiles(files: FileList | null) {
    if (!files) return
    const loaded: SampleImage[] = []
    for (const file of Array.from(files).slice(0, 6)) {
      loaded.push({ name: file.name, dataUrl: await readFile(file) })
    }
    setImages(loaded)
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

  return (
    <main className="studio-page">
      <form
        className="composer"
        onSubmit={(e) => {
          e.preventDefault()
          void create()
        }}
      >
        <textarea
          autoFocus
          id="ca-prompt"
          placeholder="Any topic. AI researches, writes original slides, and illustrates them."
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value)
            setSampleId(null)
          }}
        />
        <div className="composer-row">
          <label className="slide-stepper">
            Slides
            <input
              max={10}
              min={3}
              type="number"
              value={slides}
              onChange={(e) => setSlides(Number(e.target.value) || 3)}
            />
          </label>
          <div className="sample-pills">
            {CAROUSEL_SAMPLES.map((sample) => (
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
          <button className="primary" disabled={!prompt.trim() || thinking} type="submit">
            {thinking ? 'Thinking…' : 'Generate'}
          </button>
        </div>
        {thinking || thinkNote ? (
          <p className="think-line" role="status">
            {thinking ? thinkNote || 'Working…' : thinkNote}
          </p>
        ) : null}
        {sources.length > 0 ? (
          <div className="think-sources">
            {sources.map((source) => (
              <span className="chip" key={source}>
                {source}
              </span>
            ))}
          </div>
        ) : null}
      </form>

      <div className="studio-body">
        <aside className="edit-rail">
          <label>Kind</label>
          <div className="chips">
            {KINDS.map((item) => (
              <button
                className={`chip ${kind === item.id ? 'active' : ''}`}
                key={item.id}
                onClick={() => {
                  setKind(item.id)
                  if (model && item.id !== 'auto') setModel(restyleCarousel(model, item.id))
                }}
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
          {model && current && (
            <>
              <label htmlFor="slide-title">This slide</label>
              <input
                id="slide-title"
                value={current.title}
                onChange={(e) => patchSlide({ title: e.target.value })}
              />
              <textarea
                className="small-area"
                value={current.body}
                onChange={(e) => patchSlide({ body: e.target.value })}
              />
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
              <label className="file-btn">
                Samples
                <input accept="image/*" multiple onChange={(e) => void onFiles(e.target.files)} type="file" />
              </label>
              <div className="actions">
                <button className="primary" disabled={busy} onClick={() => void save('zip')} type="button">
                  PNG zip
                </button>
                <button className="ghost" disabled={busy} onClick={() => void save('pdf')} type="button">
                  PDF
                </button>
              </div>
            </>
          )}
        </aside>
        <section className="preview-wrap">
          <div className="stage-meta">
            {platformLabel(platform)}
            {model ? ` · ${model.slides.length}` : ''}
            {model?.source === 'ai' ? ' · researched' : ''}
          </div>
          <div className="stage">
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
                  sampleSrc={images[active % Math.max(images.length, 1)]?.dataUrl}
                  scale={stageScale}
                  slide={current}
                  total={model.slides.length}
                />
              </div>
            ) : (
              <div className={`empty-stage ${thinking ? 'thinking' : ''}`} />
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
                      sampleSrc={images[index % Math.max(images.length, 1)]?.dataUrl}
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
                sampleSrc={images[index % Math.max(images.length, 1)]?.dataUrl}
                scale={1}
                slide={slide}
                total={model.slides.length}
              />
            ))}
          </div>
        </section>
      </div>
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
