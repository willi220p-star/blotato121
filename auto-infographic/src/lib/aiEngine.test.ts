import { describe, expect, it, vi, afterEach } from 'vitest'
import {
  draftInfographic,
  extractJson,
  itemTarget,
  pollinationsImage,
  researchQuery,
  seedFrom,
} from './aiEngine'
import { assembleInfographic, restyleInfographic } from './generateInfographic'
import { paletteForPrompt, PALETTES } from './themes'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('ai helpers', () => {
  it('extracts json from fenced model output', () => {
    const json = extractJson('Sure.\n```json\n{"title":"Mars water","items":[]}\n```')
    expect(json).toEqual({ title: 'Mars water', items: [] })
  })

  it('strips layout words from the research query', () => {
    expect(researchQuery('Make a timeline infographic about the history of the internet')).toMatch(/history of the internet/i)
    expect(researchQuery('Make a timeline infographic about the history of the internet')).not.toMatch(/infographic/i)
  })

  it('builds a pollinations image url', () => {
    const url = pollinationsImage('roasting drum', 720, 540, seedFrom('coffee'))
    expect(url).toContain('https://image.pollinations.ai/prompt/')
    expect(url).toContain('width=720')
    expect(url).toContain('nologo=true')
  })

  it('keeps comparison at two items', () => {
    expect(itemTarget('comparison')).toEqual({ min: 2, max: 2 })
  })

  it('picks a vivid palette from the brief', () => {
    expect(paletteForPrompt('why roasting makes coffee bitter')).toBe('flare')
    expect(paletteForPrompt('explain photosynthesis and green leaves')).toBe('citrus')
  })
})

describe('draftInfographic', () => {
  it('researches, writes original copy, and attaches image urls', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('search/page') || url.includes('list=search')) {
          return jsonResponse({
            pages: [{ key: 'Coffee', title: 'Coffee' }],
            query: { search: [{ title: 'Coffee' }] },
          })
        }
        if (url.includes('page/summary') || url.includes('prop=extracts')) {
          return jsonResponse({
            title: 'Coffee',
            extract:
              'Coffee is a beverage brewed from roasted coffee beans. The bitterness comes from chlorogenic acid breakdown during roasting.',
            thumbnail: { source: 'https://example.com/coffee.jpg' },
            query: {
              pages: {
                '1': {
                  title: 'Coffee',
                  extract:
                    'Coffee is a beverage brewed from roasted coffee beans. The bitterness comes from chlorogenic acid breakdown during roasting.',
                  thumbnail: { source: 'https://example.com/coffee.jpg' },
                },
              },
            },
          })
        }
        if (url.includes('text.pollinations.ai')) {
          return jsonResponse({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    title: 'Why roasting makes coffee bitter',
                    subtitle: 'Chlorogenic acids crack into phenylindanes as the drum darkens.',
                    kind: 'process',
                    caption: 'Coffee',
                    heroImagePrompt: 'dark roast beans in a drum',
                    items: [
                      {
                        label: 'Green bean chemistry',
                        desc: 'Raw beans carry chlorogenic acids that taste sharp once heat hits them.',
                        imagePrompt: 'green coffee beans on a tray',
                      },
                      {
                        label: 'Maillard browning',
                        desc: 'Sugars and amino acids collapse into melanoidins around 150°C.',
                        imagePrompt: 'roasting drum with heat waves',
                      },
                      {
                        label: 'Phenylindanes',
                        desc: 'Darker roasts form the compounds that read as lingering bitterness.',
                        imagePrompt: 'espresso crema close-up',
                      },
                      {
                        label: 'Brew extraction',
                        desc: 'Over-extraction pulls those compounds into the cup.',
                        imagePrompt: 'pour-over coffee dripping',
                      },
                    ],
                  }),
                },
              },
            ],
          })
        }
        return jsonResponse({}, 404)
      }),
    )

    const draft = await draftInfographic('why is coffee bitter', 'auto')
    expect(draft.source).toBe('ai')
    expect(draft.title).toBe('Why roasting makes coffee bitter')
    expect(draft.title).not.toBe('why is coffee bitter')
    expect(draft.research[0]?.title).toBe('Coffee')
    expect(draft.items).toHaveLength(4)
    expect(draft.items[0].desc).toMatch(/chlorogenic/i)
    expect(draft.heroImage).toContain('image.pollinations.ai')
    expect(draft.items.every((item) => item.image?.includes('image.pollinations.ai'))).toBe(true)
  })

  it('falls back to researched copy when the model fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('search/page') || url.includes('list=search')) {
          return jsonResponse({
            pages: [{ key: 'Internet', title: 'Internet' }],
            query: { search: [{ title: 'Internet' }] },
          })
        }
        if (url.includes('page/summary') || url.includes('prop=extracts')) {
          return jsonResponse({
            title: 'Internet',
            extract:
              'The Internet is a global system of interconnected computer networks. Packet switching and TCP/IP made worldwide communication possible.',
            query: {
              pages: {
                '1': {
                  title: 'Internet',
                  extract:
                    'The Internet is a global system of interconnected computer networks. Packet switching and TCP/IP made worldwide communication possible.',
                },
              },
            },
          })
        }
        return jsonResponse({ error: 'down' }, 503)
      }),
    )

    const draft = await draftInfographic('Workplace disability access for new hires', 'list')
    expect(draft.source).toBe('fallback')
    expect(draft.title).toMatch(/disability|access|workplace/i)
    expect(draft.title).not.toMatch(/coffee/i)
  })

  it('throws away model copy that leaves the user topic', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('search/page') || url.includes('list=search')) {
          return jsonResponse({ query: { search: [] }, pages: [] })
        }
        if (url.includes('text.pollinations.ai')) {
          return jsonResponse({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    title: 'Why roasting makes coffee bitter',
                    subtitle: 'A chemistry lesson',
                    kind: 'list',
                    items: [
                      { label: 'Maillard', desc: 'Sugars brown in the drum' },
                      { label: 'Phenylindanes', desc: 'Dark roasts taste sharp' },
                    ],
                  }),
                },
              },
            ],
          })
        }
        return jsonResponse({}, 404)
      }),
    )

    const draft = await draftInfographic('Workplace disability access for new hires', 'list')
    expect(draft.source).toBe('fallback')
    expect(draft.title).toMatch(/disability|access|workplace/i)
    expect(draft.title).not.toMatch(/coffee/i)
  })
})

describe('draftCarousel', () => {
  it('returns researched slides with images and a close', async () => {
    const { draftCarousel } = await import('./aiEngine')
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('search/page') || url.includes('list=search')) {
          return jsonResponse({
            pages: [{ key: 'Pipeline_(software)', title: 'Pipeline' }],
            query: { search: [{ title: 'Sales pipeline' }] },
          })
        }
        if (url.includes('page/summary') || url.includes('prop=extracts')) {
          return jsonResponse({
            title: 'Sales pipeline',
            extract:
              'A sales pipeline is a visual sequence of stages that a prospect moves through before becoming a customer. Context switching between deals slows close rates.',
            query: {
              pages: {
                '1': {
                  title: 'Sales pipeline',
                  extract:
                    'A sales pipeline is a visual sequence of stages that a prospect moves through before becoming a customer. Context switching between deals slows close rates.',
                },
              },
            },
          })
        }
        if (url.includes('text.pollinations.ai')) {
          return jsonResponse({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    title: 'Messy pipelines leak deals',
                    subtitle: 'Every extra tab is a delayed close.',
                    kind: 'thought-leadership',
                    slides: [
                      { role: 'intro', kicker: 'Ops', title: 'Your pipeline is a leaky hose', body: 'Deals die in the gaps between tools.', imagePrompt: 'messy desk of tabs' },
                      { role: 'content', kicker: '01', title: 'Name the stall', body: 'Most teams cannot say where a deal waits.', imagePrompt: 'kanban board close-up' },
                      { role: 'content', kicker: '02', title: 'One weekly review', body: 'Thirty minutes, one list, no extra software.', imagePrompt: 'calendar and notebook' },
                      { role: 'stat', kicker: '03', title: 'Close speed', body: 'Shorter cycles come from fewer handoffs.', stat: '12d', statLabel: 'cycle', imagePrompt: 'stopwatch' },
                      { role: 'outro', kicker: 'Next', title: 'Audit one funnel this week', body: 'Pick ten open deals and map the stall.', imagePrompt: 'quiet office at dusk' },
                    ],
                  }),
                },
              },
            ],
          })
        }
        return jsonResponse({}, 404)
      }),
    )

    const draft = await draftCarousel('why messy pipelines kill close rates', 'thought-leadership', 5)
    expect(draft.source).toBe('ai')
    expect(draft.slides).toHaveLength(5)
    expect(draft.slides[0].role).toBe('intro')
    expect(draft.slides.at(-1)?.role).toBe('outro')
    expect(draft.slides[0].title).not.toMatch(/why messy pipelines kill close rates/i)
    expect(draft.slides.every((slide) => slide.image?.includes('image.pollinations.ai'))).toBe(true)
  })
})

describe('assembleInfographic', () => {
  it('builds antv syntax and can restyle into a timeline', () => {
    const model = assembleInfographic(
      {
        kind: 'process',
        title: 'Client onboarding',
        subtitle: 'Five calm steps',
        header: 'Studio',
        footer: 'Confidential',
        caption: '',
        items: [
          { label: 'Call', desc: 'Listen first' },
          { label: 'Quote', desc: 'Scope on paper' },
          { label: 'Kickoff', desc: 'Make it real' },
        ],
        source: 'ai',
      },
      PALETTES[0],
    )
    expect(model.template).toContain('list-row')
    expect(model.syntax).toContain('infographic')
    expect(model.syntax).toContain('Call')
    expect(model.header).toBe('Studio')
    expect(restyleInfographic(model, 'timeline', PALETTES[0]).kind).toBe('timeline')
  })
})

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
