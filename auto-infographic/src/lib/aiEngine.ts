import { coverPrompt, planRoles, pointsFromText } from './slideLayout'
import { detectKind, parsePrompt, titleFromPrompt } from './parsePrompt'
import { briefFooter, fieldFromBrief, staysOnTopic, topicSeed } from './brief'
import type {
  AiProgress,
  CarouselKind,
  CarouselSlideModel,
  ContentItem,
  InfographicKind,
  ResearchNote,
  SlideRole,
} from './types'

const KINDS: Exclude<InfographicKind, 'auto'>[] = [
  'process',
  'timeline',
  'comparison',
  'stats',
  'list',
  'swot',
  'pyramid',
  'funnel',
  'cycle',
  'roadmap',
  'hierarchy',
  'pie',
]

const CAROUSEL_KINDS: Exclude<CarouselKind, 'auto'>[] = [
  'thought-leadership',
  'product-launch',
  'how-to',
  'story',
  'metrics',
  'offer',
]

const SLIDE_ROLES: SlideRole[] = ['intro', 'content', 'stat', 'quote', 'outro']

export interface InfographicDraft {
  title: string
  subtitle: string
  caption: string
  header: string
  footer: string
  kind: Exclude<InfographicKind, 'auto'>
  items: ContentItem[]
  heroImage?: string
  research: ResearchNote[]
  source: 'ai' | 'fallback'
}

export interface CarouselDraft {
  title: string
  subtitle: string
  header: string
  footer: string
  brand: string
  handle: string
  kind: Exclude<CarouselKind, 'auto'>
  slides: CarouselSlideModel[]
  research: ResearchNote[]
  source: 'ai' | 'fallback'
}

export function researchQuery(prompt: string): string {
  return topicSeed(prompt)
    .replace(/\n+/g, ' ')
    .replace(
      /\b(infographic|carousel|linkedin|instagram|facebook|slides?|timeline|swot|funnel|roadmap|make|create|design|generate)\b/gi,
      ' ',
    )
    .replace(/\s+/g, ' ')
    .replace(/^\s*(a|an|the)?\s*(of|for|about)?\s*/i, '')
    .trim()
    .slice(0, 140)
}

export function seedFrom(text: string): number {
  let hash = 2166136261
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return Math.abs(hash) % 1_000_000
}

export function pollinationsImage(
  prompt: string,
  width: number,
  height: number,
  seed: number,
  fill: 'frame' | 'subject' = 'subject',
): string {
  const look =
    fill === 'frame'
      ? 'full-bleed edge-to-edge photograph filling the entire frame, subject large, no border, no collage, no mockup, no poster, no UI'
      : 'Vivid saturated color photography, bold complementary colors, cinematic lighting, photorealistic'
  const styled = `${prompt.slice(0, 200)}. ${look}, no text, no letters, no watermark, no logo`
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(styled)}?width=${width}&height=${height}&nologo=true&seed=${seed}&enhance=true`
}

export function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)
  const raw = (fenced?.[1] ?? text).trim()
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start < 0 || end <= start) throw new Error('No JSON object in model output')
  return JSON.parse(raw.slice(start, end + 1)) as unknown
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {}
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value.trim() : fallback
}

function asKind(value: unknown, fallback: Exclude<InfographicKind, 'auto'>): Exclude<InfographicKind, 'auto'> {
  const next = asString(value).toLowerCase()
  return (KINDS as string[]).includes(next) ? (next as Exclude<InfographicKind, 'auto'>) : fallback
}

function asCarouselKind(value: unknown, fallback: Exclude<CarouselKind, 'auto'>): Exclude<CarouselKind, 'auto'> {
  const next = asString(value).toLowerCase()
  return (CAROUSEL_KINDS as string[]).includes(next) ? (next as Exclude<CarouselKind, 'auto'>) : fallback
}

function asRole(value: unknown, fallback: SlideRole): SlideRole {
  const next = asString(value).toLowerCase()
  return (SLIDE_ROLES as string[]).includes(next) ? (next as SlideRole) : fallback
}

export function itemTarget(kind: Exclude<InfographicKind, 'auto'>): { min: number; max: number } {
  if (kind === 'comparison') return { min: 2, max: 2 }
  if (kind === 'swot') return { min: 4, max: 4 }
  if (kind === 'stats' || kind === 'cycle') return { min: 4, max: 4 }
  if (kind === 'funnel' || kind === 'pyramid' || kind === 'hierarchy') return { min: 4, max: 5 }
  if (kind === 'pie') return { min: 4, max: 6 }
  if (kind === 'list') return { min: 5, max: 7 }
  return { min: 4, max: 6 }
}

function mergeSignal(external: AbortSignal | undefined, timeoutMs: number): { signal: AbortSignal; stop: () => void } {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), timeoutMs)
  const onAbort = () => ctrl.abort()
  external?.addEventListener('abort', onAbort, { once: true })
  return {
    signal: ctrl.signal,
    stop: () => {
      clearTimeout(timer)
      external?.removeEventListener('abort', onAbort)
    },
  }
}

async function fetchJson(url: string, init: RequestInit = {}, timeoutMs = 22000): Promise<unknown> {
  const wait = mergeSignal(init.signal ?? undefined, timeoutMs)
  try {
    const res = await fetch(url, { ...init, signal: wait.signal })
    if (!res.ok) throw new Error(`${res.status} ${url}`)
    return (await res.json()) as unknown
  } finally {
    wait.stop()
  }
}

async function wikiSearch(query: string, signal?: AbortSignal): Promise<string[]> {
  try {
    const search = asRecord(
      await fetchJson(
        `https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=5&format=json&origin=*&srsearch=${encodeURIComponent(query)}`,
        { signal, headers: { Accept: 'application/json' } },
        14000,
      ),
    )
    const hits = Array.isArray(asRecord(search.query).search) ? (asRecord(search.query).search as unknown[]) : []
    const titles = hits.map((hit) => asString(asRecord(hit).title)).filter(Boolean)
    if (titles.length) return titles.slice(0, 3)
  } catch {
    /* try REST next */
  }
  try {
    const search = asRecord(
      await fetchJson(
        `https://en.wikipedia.org/w/rest.php/v1/search/page?q=${encodeURIComponent(query)}&limit=5`,
        { signal, headers: { Accept: 'application/json' } },
        14000,
      ),
    )
    const pages = Array.isArray(search.pages) ? search.pages : []
    return pages
      .map((page) => asString(asRecord(page).key) || asString(asRecord(page).title))
      .filter(Boolean)
      .slice(0, 3)
  } catch {
    return []
  }
}

async function wikiSummary(title: string, signal?: AbortSignal): Promise<ResearchNote | null> {
  try {
    const summary = asRecord(
      await fetchJson(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        { signal, headers: { Accept: 'application/json' } },
        14000,
      ),
    )
    const extract = asString(summary.extract)
    if (extract.length < 40) return null
    const note: ResearchNote = {
      title: asString(summary.title, title),
      extract: extract.slice(0, 700),
    }
    const thumb = asString(asRecord(summary.thumbnail).source)
    if (thumb) note.thumbnail = thumb
    return note
  } catch {
    try {
      const payload = asRecord(
        await fetchJson(
          `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=400&redirects=1&format=json&origin=*&titles=${encodeURIComponent(title)}`,
          { signal, headers: { Accept: 'application/json' } },
          14000,
        ),
      )
      const pages = asRecord(asRecord(payload.query).pages)
      const first = Object.values(pages)[0]
      const rec = asRecord(first)
      const extract = asString(rec.extract)
      if (extract.length < 40) return null
      const note: ResearchNote = {
        title: asString(rec.title, title),
        extract: extract.slice(0, 700),
      }
      const thumb = asString(asRecord(rec.thumbnail).source)
      if (thumb) note.thumbnail = thumb
      return note
    } catch {
      return null
    }
  }
}

export async function researchTopic(
  prompt: string,
  signal?: AbortSignal,
  onProgress?: (progress: AiProgress) => void,
): Promise<ResearchNote[]> {
  const query = researchQuery(prompt) || prompt.slice(0, 80)
  onProgress?.({ phase: 'research', note: `Looking up ${query}` })
  try {
    const keys = await wikiSearch(query, signal)
    const notes = (await Promise.all(keys.map((key) => wikiSummary(key, signal)))).filter(
      (note): note is ResearchNote => note !== null,
    )

    onProgress?.({
      phase: 'research',
      note: notes.length
        ? `Found ${notes.map((n) => n.title).join(', ')}`
        : 'No encyclopedia match — writing from the brief',
      sources: notes.map((n) => n.title),
    })
    return notes
  } catch {
    onProgress?.({ phase: 'research', note: 'Research skipped — writing from the brief' })
    return []
  }
}

function researchBlock(notes: ResearchNote[]): string {
  if (!notes.length) return 'No encyclopedia notes. Invent accurate, concrete content from general knowledge.'
  return notes
    .map((note) => `### ${note.title}\n${note.extract}`)
    .join('\n\n')
    .slice(0, 2400)
}

async function completeJson(system: string, user: string, signal?: AbortSignal): Promise<unknown> {
  const payload = asRecord(
    await fetchJson(
      'https://text.pollinations.ai/openai',
      {
        method: 'POST',
        signal,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'openai',
          messages: [
            { role: 'system', content: system },
            { role: 'user', content: user },
          ],
          temperature: 0.7,
          response_format: { type: 'json_object' },
        }),
      },
      42000,
    ),
  )
  const choice = Array.isArray(payload.choices) ? asRecord(payload.choices[0]) : {}
  const message = asRecord(choice.message)
  const content = asString(message.content)
  if (!content) throw new Error('Empty model content')
  return extractJson(content)
}

function parseItems(raw: unknown, kind: Exclude<InfographicKind, 'auto'>, seedKey: string): ContentItem[] {
  const rows = Array.isArray(raw) ? raw : []
  const { min, max } = itemTarget(kind)
  const items = rows.slice(0, max).map((row, index) => {
    const rec = asRecord(row)
    const label = asString(rec.label) || asString(rec.title) || `Point ${index + 1}`
    const desc = asString(rec.desc) || asString(rec.description) || asString(rec.body)
    const imagePrompt = asString(rec.imagePrompt) || `${label}, ${desc}`.slice(0, 180)
    return {
      label: label.slice(0, 72),
      desc: desc.slice(0, 220),
      value: asString(rec.value) || undefined,
      group: asString(rec.group) || undefined,
      image: pollinationsImage(imagePrompt, 720, 540, seedFrom(`${seedKey}:${label}:${index}`)),
    } satisfies ContentItem
  })
  return items.length >= Math.min(min, 2) ? items : []
}

function parseSlides(
  raw: unknown,
  count: number,
  seedKey: string,
  size: { width: number; height: number },
): CarouselSlideModel[] {
  const rows = Array.isArray(raw) ? raw : []
  const roles = planRoles(count)
  return rows.slice(0, count).map((row, index) => {
    const rec = asRecord(row)
    const title = asString(rec.title) || `Slide ${index + 1}`
    const body = asString(rec.body) || asString(rec.desc)
    const role = index === 0 || index === count - 1 ? roles[index] : asRole(rec.role, roles[index])
    const points = pointsFromText(
      body,
      (Array.isArray(rec.points) ? rec.points : []).map((p) => asString(p)),
    )
    const imagePrompt = coverPrompt(asString(rec.imagePrompt) || `${title}. ${body}`.slice(0, 160), role)
    return {
      role,
      kicker: asString(rec.kicker) || (index === 0 ? 'Cover' : String(index).padStart(2, '0')),
      title: title.slice(0, 90),
      body: body.slice(0, 240),
      points: points.length ? points : undefined,
      stat: asString(rec.stat) || undefined,
      statLabel: asString(rec.statLabel) || undefined,
      image: pollinationsImage(imagePrompt, size.width, size.height, seedFrom(`${seedKey}:slide:${index}:${title}`), 'frame'),
    } satisfies CarouselSlideModel
  })
}

function carouselItems(prompt: string, notes: ResearchNote[]): ContentItem[] {
  const seed = topicSeed(prompt)
  const title = titleFromPrompt(seed)
  const must = fieldFromBrief(prompt, 'Must include')
    .split(/,| and /i)
    .map((s) => s.trim())
    .filter((s) => s.length > 1)
  if (must.length >= 2) {
    return must.slice(0, 6).map((label) => ({
      label,
      desc: `${label} belongs in ${title}.`,
    }))
  }
  const fromNotes = notes.flatMap((note) =>
    note.extract
      .split(/(?<=\.)\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 40 && staysOnTopic(prompt, sentence))
      .slice(0, 2)
      .map((sentence) => ({
        label: note.title,
        desc: sentence.replace(/\.$/, ''),
        image: note.thumbnail,
      })),
  )
  if (fromNotes.length >= 2) return fromNotes.slice(0, 6)
  return [
    { label: title, desc: notes[0]?.extract.split(/(?<=\.)\s+/)[0] || `A clear look at ${title}.` },
    { label: `Why ${title} matters`, desc: 'The cost of ignoring it shows up in people, time, and trust.' },
    { label: 'What to change first', desc: 'Pick one change this week and put a name on it.' },
    { label: 'How to keep it', desc: 'Write it into the habit, not a one-off poster.' },
  ]
}

function fallbackItems(prompt: string, kind: Exclude<InfographicKind, 'auto'>, notes: ResearchNote[]): ContentItem[] {
  const parsed = parsePrompt(topicSeed(prompt), kind)
  const extras: ContentItem[] = notes.flatMap((note) =>
    note.extract
      .split(/(?<=\.)\s+/)
      .map((sentence) => sentence.trim())
      .filter((sentence) => sentence.length > 40)
      .slice(0, 2)
      .map((sentence) => ({
        label: note.title,
        desc: sentence.replace(/\.$/, ''),
        image: note.thumbnail,
      })),
  )
  const { max } = itemTarget(kind)
  const base = parsed.items.length >= 2 ? parsed.items : extras.length >= 2 ? extras : parsed.items
  return base.slice(0, max).map((item, index) => ({
    ...item,
    image:
      item.image ||
      extras[index]?.image ||
      pollinationsImage(`${item.label}. ${item.desc || prompt}`, 720, 540, seedFrom(`${prompt}:${item.label}:${index}`)),
  }))
}

export async function draftInfographic(
  prompt: string,
  kind: InfographicKind,
  onProgress?: (progress: AiProgress) => void,
  signal?: AbortSignal,
): Promise<InfographicDraft> {
  const research = (await researchTopic(prompt, signal, onProgress)).filter((note) =>
    staysOnTopic(prompt, `${note.title} ${note.extract}`),
  )
  const hinted = kind === 'auto' ? detectKind(prompt) : kind
  const resolved: Exclude<InfographicKind, 'auto'> = hinted === 'auto' ? 'process' : hinted
  const { min, max } = itemTarget(resolved)

  onProgress?.({
    phase: 'write',
    note: 'Writing original copy',
    sources: research.map((n) => n.title),
  })

  try {
    const json = asRecord(
      await completeJson(
        'You make the exact piece the user specified. Do not change the topic. Do not invent a different subject, brand, era, or story. If they asked about disability, every line stays about disability. Use their required points, names, and contact details. Research may add supporting facts only if they stay on this topic. Title must name their topic. Header is a short series name on that topic. Footer can hold their contact or next step. Image prompts must match this topic, colorful, no text. Return JSON only.',
        `User brief:\n${prompt}\n\nRequested layout: ${kind === 'auto' ? `choose the best of ${KINDS.join(', ')}` : resolved}\nNeed ${min}-${max} items.\n\nResearch notes (use only if on-topic):\n${researchBlock(research)}\n\nJSON shape:\n{"title":"on-topic title","subtitle":"one sentence on this topic","header":"SHORT SERIES NAME","footer":"contact or next step","kind":"${resolved}","caption":"source line","heroImagePrompt":"photographic scene of THIS topic, no text","items":[{"label":"short","desc":"1-2 sentences on this topic","value":"optional stat","group":"optional","imagePrompt":"photographic scene of THIS topic, no text"}]}`,
        signal,
      ),
    )
    const usedKind = kind === 'auto' ? asKind(json.kind, resolved) : resolved
    const items = parseItems(json.items, usedKind, prompt)
    if (items.length < 2) throw new Error('Model returned too few items')
    const parsed = parsePrompt(topicSeed(prompt), kind)
    const title = asString(json.title) || parsed.title
    const blob = `${title} ${items.map((item) => `${item.label} ${item.desc}`).join(' ')}`
    if (!staysOnTopic(prompt, blob)) throw new Error('Model left the topic')
    const heroPrompt = asString(json.heroImagePrompt) || `${title}, ${asString(json.subtitle)}`
    const header = asString(json.header) || usedKind.toUpperCase()
    const footer = asString(json.footer) || asString(json.caption) || 'Save this graphic'
    onProgress?.({ phase: 'images', note: 'Composing illustrations', sources: research.map((n) => n.title) })
    return {
      title: title.slice(0, 80),
      subtitle: (asString(json.subtitle) || items[0]?.desc || '').slice(0, 160),
      caption: asString(json.caption) || research[0]?.title || '',
      header: header.slice(0, 28).toUpperCase(),
      footer: briefFooter(prompt, footer),
      kind: usedKind,
      items,
      heroImage: pollinationsImage(heroPrompt, 1280, 720, seedFrom(`hero:${prompt}:${title}`)),
      research,
      source: 'ai',
    }
  } catch {
    onProgress?.({ phase: 'images', note: 'Illustrating from research', sources: research.map((n) => n.title) })
    const parsed = parsePrompt(topicSeed(prompt), kind)
    const items = fallbackItems(prompt, resolved, research)
    return {
      title: parsed.title,
      subtitle: (research[0]?.extract.split(/(?<=\.)\s+/)[0] || parsed.subtitle).slice(0, 160),
      caption: research.map((n) => n.title).join(' · ') || parsed.caption,
      header: resolved.toUpperCase(),
      footer: briefFooter(prompt, research[0]?.title ? `Source · ${research[0].title}` : 'Save this graphic'),
      kind: resolved,
      items,
      heroImage:
        research[0]?.thumbnail ||
        pollinationsImage(`${parsed.title}, editorial infographic photograph`, 1280, 720, seedFrom(`hero:${prompt}`)),
      research,
      source: 'fallback',
    }
  }
}

function detectCarouselKind(prompt: string): Exclude<CarouselKind, 'auto'> {
  const t = prompt.toLowerCase()
  if (/\b(launch|drop|new product|announce)\b/.test(t)) return 'product-launch'
  if (/\b(how to|steps|playbook)\b/.test(t)) return 'how-to'
  if (/\b(metric|proof|csat|retention|clients)\b/.test(t)) return 'metrics'
  if (/\b(offer|price|buy now)\b/.test(t)) return 'offer'
  if (/\b(story|journey|narrative)\b/.test(t)) return 'story'
  return 'thought-leadership'
}

export async function draftCarousel(
  prompt: string,
  kind: CarouselKind,
  slideCount: number,
  onProgress?: (progress: AiProgress) => void,
  signal?: AbortSignal,
  size: { width: number; height: number } = { width: 1080, height: 1080 },
): Promise<CarouselDraft> {
  const research = (await researchTopic(prompt, signal, onProgress)).filter((note) =>
    staysOnTopic(prompt, `${note.title} ${note.extract}`),
  )
  const resolved = kind === 'auto' ? detectCarouselKind(prompt) : kind
  const n = Math.min(10, Math.max(3, slideCount))
  const roles = planRoles(n)

  onProgress?.({
    phase: 'write',
    note: 'Writing original slides',
    sources: research.map((note) => note.title),
  })

  try {
    const json = asRecord(
      await completeJson(
        'You plan a LinkedIn-style carousel the way a professional carousel maker does. Slide 1 is a cover hook on the EXACT user topic. Middle slides are one idea each with a short title and 2-4 punchy points. Last slide is the next step / contact. Do not change the topic. Image prompts describe a full-bleed photograph of THIS topic that fills the frame, no text. Return JSON only.',
        `User brief:\n${prompt}\n\nKind: ${resolved}\nExactly ${n} slides. Planned roles: ${roles.join(', ')}.\n\nResearch notes (use only if on-topic):\n${researchBlock(research)}\n\nJSON shape:\n{"title":"on-topic series title","subtitle":"one insight on this topic","header":"SERIES NAME","footer":"contact or next step","brand":"short brand","handle":"@handle","kind":"${resolved}","slides":[{"role":"intro|content|stat|quote|outro","kicker":"tiny label","title":"4-10 word title on this topic","body":"1-2 sentences on this topic","points":["short point","short point"],"stat":"optional","statLabel":"optional","imagePrompt":"full-bleed photographic scene of THIS topic filling the frame, no text"}]}`,
        signal,
      ),
    )
    let slides = parseSlides(json.slides, n, prompt, size)
    if (slides.length < 3) throw new Error('Model returned too few slides')
    if (slides.length < n) {
      const extra = carouselItems(prompt, research)
      while (slides.length < n) {
        const item = extra[slides.length % Math.max(extra.length, 1)] ?? {
          label: parsePrompt(topicSeed(prompt)).title,
          desc: parsePrompt(topicSeed(prompt)).subtitle,
        }
        const index = slides.length
        const role = roles[index]
        slides.push({
          role,
          kicker: String(index).padStart(2, '0'),
          title: item.label,
          body: item.desc,
          points: pointsFromText(item.desc),
          image: pollinationsImage(
            coverPrompt(`${item.label}. ${item.desc}`, role),
            size.width,
            size.height,
            seedFrom(`${prompt}:pad:${index}`),
            'frame',
          ),
        })
      }
      slides = slides.slice(0, n)
      slides[0] = { ...slides[0], role: 'intro' }
      slides[n - 1] = { ...slides[n - 1], role: 'outro' }
    }
    onProgress?.({ phase: 'images', note: 'Composing full-bleed slide photography', sources: research.map((note) => note.title) })
    const parsed = parsePrompt(topicSeed(prompt))
    const series = (asString(json.title) || parsed.title).slice(0, 80)
    const blob = `${series} ${slides.map((slide) => `${slide.title} ${slide.body}`).join(' ')}`
    if (!staysOnTopic(prompt, blob)) throw new Error('Model left the topic')
    return {
      title: series,
      subtitle: (asString(json.subtitle) || slides[0]?.body || '').slice(0, 160),
      header: (asString(json.header) || series).slice(0, 28).toUpperCase(),
      footer: briefFooter(prompt, asString(json.footer) || 'Save this series'),
      brand: (asString(json.brand) || 'Studio').slice(0, 28),
      handle: (asString(json.handle) || '@studio').slice(0, 24),
      kind: kind === 'auto' ? asCarouselKind(json.kind, resolved) : resolved,
      slides,
      research,
      source: 'ai',
    }
  } catch {
    onProgress?.({
      phase: 'images',
      note: 'Illustrating slides from research',
      sources: research.map((note) => note.title),
    })
    const parsed = parsePrompt(topicSeed(prompt))
    const items = carouselItems(prompt, research)
    const slides: CarouselSlideModel[] = roles.map((role, index) => {
      if (role === 'intro') {
        return {
          role,
          kicker: 'Cover',
          title: parsed.title,
          body: research[0]?.extract.split(/(?<=\.)\s+/)[0] || parsed.subtitle,
          image: pollinationsImage(
            coverPrompt(parsed.title, 'intro'),
            size.width,
            size.height,
            seedFrom(`c:${prompt}:0`),
            'frame',
          ),
        }
      }
      if (role === 'outro') {
        return {
          role,
          kicker: 'Next',
          title: parsed.title,
          body: briefFooter(prompt, 'Save this. Then use it once.'),
          image: pollinationsImage(
            coverPrompt(parsed.title, 'outro'),
            size.width,
            size.height,
            seedFrom(`c:${prompt}:end`),
            'frame',
          ),
        }
      }
      const item = items[(index - 1) % Math.max(items.length, 1)] ?? { label: parsed.title, desc: parsed.subtitle }
      return {
        role,
        kicker: String(index).padStart(2, '0'),
        title: item.label,
        body: item.desc,
        points: pointsFromText(item.desc),
        stat: role === 'stat' ? item.value : undefined,
        statLabel: role === 'stat' ? item.label : undefined,
        image: pollinationsImage(
          coverPrompt(`${item.label}. ${item.desc}`, role),
          size.width,
          size.height,
          seedFrom(`c:${prompt}:${index}`),
          'frame',
        ),
      }
    })
    return {
      title: parsed.title,
      subtitle: (research[0]?.extract.split(/(?<=\.)\s+/)[0] || parsed.subtitle).slice(0, 160),
      header: resolved.replace(/-/g, ' ').toUpperCase(),
      footer: briefFooter(prompt, 'Save this series'),
      brand: 'Studio',
      handle: '@studio',
      kind: resolved,
      slides,
      research,
      source: 'fallback',
    }
  }
}

