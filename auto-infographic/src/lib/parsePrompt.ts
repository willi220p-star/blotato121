import { topicSeed } from './brief'
import type { ContentItem, InfographicKind, ParsedIdea } from './types'

const KIND_WORDS: Array<{ kind: InfographicKind; words: string[] }> = [
  { kind: 'swot', words: ['swot', 'strengths', 'weaknesses', 'opportunities', 'threats'] },
  { kind: 'comparison', words: [' vs ', 'versus', 'before', 'after', 'compare'] },
  { kind: 'funnel', words: ['sales funnel', 'launch funnel', 'conversion funnel'] },
  { kind: 'pyramid', words: ['pyramid', 'hierarchy of', 'levels of'] },
  { kind: 'cycle', words: ['cycle', 'loop', 'flywheel', 'repeat'] },
  { kind: 'roadmap', words: ['roadmap', '90-day', 'quarter', 'phase'] },
  { kind: 'timeline', words: ['timeline', 'history', 'milestone', 'year'] },
  { kind: 'stats', words: ['%', 'percent', 'metric', 'csat', 'retention', 'pipeline'] },
  { kind: 'pie', words: ['share', 'breakdown', 'allocation', 'budget split'] },
  { kind: 'hierarchy', words: ['org', 'team structure', 'reporting'] },
  { kind: 'process', words: ['step', 'process', 'how to', 'onboarding', 'playbook'] },
  { kind: 'list', words: ['tips', 'ideas', 'checklist', 'principles'] },
]

export function detectKind(text: string): InfographicKind {
  const lower = ` ${text.toLowerCase()} `
  for (const row of KIND_WORDS) {
    if (row.words.some((w) => lower.includes(w))) return row.kind
  }
  return 'process'
}

function cleanLine(line: string): string {
  return line
    .replace(/^[\s>*-]+/, '')
    .replace(/^\d+[.)]\s*/, '')
    .replace(/^[A-Da-d][.)]\s*/, '')
    .trim()
}

function splitLabelDesc(raw: string): ContentItem {
  const colon = raw.split(/:\s+/)
  if (colon.length >= 2 && colon[0].length <= 52) {
    return { label: colon[0].trim(), desc: colon.slice(1).join(': ').trim() }
  }
  if (raw.length <= 72) return { label: raw, desc: '' }
  const words = raw.split(/\s+/)
  return { label: words.slice(0, 8).join(' '), desc: words.slice(8).join(' ') }
}

function extractList(prompt: string): ContentItem[] {
  const lines = prompt
    .split(/\n+/)
    .map((l) => l.trim())
    .filter(Boolean)

  const bullets = lines.filter((l) => /^(\d+[.)]\s+|[-*•]\s+|[A-D][.)]\s+)/.test(l))
  if (bullets.length >= 2) {
    return bullets.map((l) => splitLabelDesc(cleanLine(l)))
  }

  const labeled = lines.filter((l) => /^(strengths|weaknesses|opportunities|threats|before|after)\b/i.test(l))
  if (labeled.length >= 2) {
    return labeled.map((l) => splitLabelDesc(cleanLine(l)))
  }

  const sentences = prompt
    .replace(/\n+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12)

  if (sentences.length >= 3) {
    return sentences.slice(0, 6).map((s) => splitLabelDesc(s.replace(/[.!?]$/, '')))
  }

  const comma = prompt
    .split(/,|\band\b/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 2 && s.length < 48)
  if (comma.length >= 3) {
    return comma.slice(0, 6).map((s) => ({ label: s, desc: '' }))
  }

  return []
}

export function clausesFromPrompt(prompt: string): ContentItem[] {
  return prompt
    .split(/\n+|(?<=[.!?])\s+|;\s+/)
    .map((s) => s.trim().replace(/[.!?]$/, ''))
    .filter((s) => s.length > 18)
    .slice(0, 8)
    .map((s) => splitLabelDesc(s))
}

function inventItems(prompt: string, kind: InfographicKind): ContentItem[] {
  const idea = titleFromPrompt(prompt)
  if (kind === 'swot') {
    return [
      { label: 'Strengths', desc: `What already works for ${idea}`, group: 'S' },
      { label: 'Weaknesses', desc: 'Where the offer still leaks', group: 'W' },
      { label: 'Opportunities', desc: 'The adjacent market to take', group: 'O' },
      { label: 'Threats', desc: 'What could stall the next quarter', group: 'T' },
    ]
  }
  if (kind === 'comparison') {
    return [
      { label: 'Before', desc: 'Scattered effort, no rhythm, hard to measure' },
      { label: 'After', desc: `${idea} with a clear weekly system` },
    ]
  }
  if (kind === 'stats') {
    return [
      { label: 'Reach', value: '12k', desc: 'People who saw the work' },
      { label: 'Replies', value: '480', desc: 'Conversations started' },
      { label: 'Close', value: '36', desc: 'Paid outcomes' },
      { label: 'Retention', value: '91%', desc: 'Came back next cycle' },
    ]
  }
  if (kind === 'funnel') {
    return [
      { label: 'Awareness', desc: 'Show up where they already look', value: '12k' },
      { label: 'Interest', desc: 'A single clear promise', value: '2.4k' },
      { label: 'Consider', desc: 'Proof and a low-friction next step', value: '640' },
      { label: 'Buy', desc: 'A calm close', value: '180' },
    ]
  }
  return [
    { label: 'Frame the problem', desc: `Name what ${idea} is actually for` },
    { label: 'Choose the audience', desc: 'One person, not everyone' },
    { label: 'Shape the offer', desc: 'Promise, proof, price, path' },
    { label: 'Make the artifact', desc: 'One piece they can save' },
    { label: 'Close the loop', desc: 'Invite a next conversation' },
  ]
}

export function titleFromPrompt(prompt: string): string {
  const first = prompt
    .split(/\n+/)
    .map((l) => l.trim())
    .find((l) => l && !/^(\d+[.)]|[-*•])/.test(l))
  if (!first) return 'Untitled piece'
  const clipped = first.replace(/[.!?]$/, '')
  if (clipped.length <= 64) return clipped
  return clipped.slice(0, 56).replace(/\s+\S*$/, '')
}

export function parsePrompt(prompt: string, forced?: InfographicKind): ParsedIdea {
  const seed = topicSeed(prompt)
  const kindHint = !forced || forced === 'auto' ? detectKind(seed) : forced
  const title = titleFromPrompt(seed)
  let items = extractList(seed).slice(0, 8)
  if (items.length < 2) {
    const clauses = clausesFromPrompt(seed)
    items = clauses.length >= 2 ? clauses : inventItems(seed, kindHint)
  }

  const rest = seed
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l && l !== title && !/^(\d+[.)]|[-*•])/.test(l))
    .join(' ')

  const subtitle =
    rest.length > 8
      ? rest.slice(0, 110).replace(/\s+\S*$/, '')
      : 'A clear story, designed to ship.'

  return {
    title,
    subtitle,
    caption: rest.slice(0, 180),
    items,
    kindHint,
  }
}
