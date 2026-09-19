import { parsePrompt } from './parsePrompt'
import type { InfographicKind, InfographicModel, Palette } from './types'

const TEMPLATE_FOR: Record<Exclude<InfographicKind, 'auto'>, string> = {
  process: 'list-row-simple-horizontal-arrow',
  timeline: 'sequence-timeline-simple',
  comparison: 'compare-binary-horizontal-simple-vs',
  stats: 'list-grid-compact-card',
  list: 'list-column-simple-vertical-arrow',
  swot: 'compare-swot',
  pyramid: 'list-pyramid-compact-card',
  funnel: 'sequence-funnel-simple',
  cycle: 'sequence-circular-simple',
  roadmap: 'sequence-roadmap-vertical-simple',
  hierarchy: 'hierarchy-structure',
  pie: 'chart-pie-plain-text',
}

function yamlEscape(value: string): string {
  return value.replace(/\n/g, ' ').trim()
}

function itemBlock(indent: string, label: string, desc?: string, value?: string): string {
  const lines = [`${indent}- label ${yamlEscape(label)}`]
  if (desc) lines.push(`${indent}  desc ${yamlEscape(desc)}`)
  if (value) lines.push(`${indent}  value ${yamlEscape(value)}`)
  return lines.join('\n')
}

function dataKey(kind: Exclude<InfographicKind, 'auto'>): 'lists' | 'sequences' | 'compares' | 'items' | 'values' {
  if (kind === 'timeline' || kind === 'funnel' || kind === 'cycle' || kind === 'roadmap' || kind === 'process') {
    return kind === 'process' ? 'lists' : 'sequences'
  }
  if (kind === 'comparison' || kind === 'swot') return 'compares'
  if (kind === 'pie' || kind === 'stats') return 'values'
  return 'lists'
}

export function buildSyntax(
  model: Pick<InfographicModel, 'kind' | 'title' | 'subtitle' | 'items' | 'template'>,
  palette: Palette,
): string {
  const key = dataKey(model.kind)
  const body =
    model.kind === 'swot'
      ? model.items
          .map((item) => {
            const children = item.desc
              ? item.desc
                  .split(/,|;/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .slice(0, 4)
              : []
            const childBlock =
              children.length > 0
                ? `\n      children\n${children.map((c) => `        - label ${yamlEscape(c)}`).join('\n')}`
                : ''
            return `    - label ${yamlEscape(item.label)}${childBlock}`
          })
          .join('\n')
      : model.items.map((item) => itemBlock('    ', item.label, item.desc, item.value)).join('\n')

  return `infographic ${model.template}
theme
  colorPrimary ${palette.accent}
  colorBg ${palette.surface}
data
  title ${yamlEscape(model.title)}
  desc ${yamlEscape(model.subtitle)}
  ${key}
${body}`
}

export function generateInfographic(
  prompt: string,
  kind: InfographicKind,
  header: string,
  footer: string,
  palette: Palette,
): InfographicModel {
  const parsed = parsePrompt(prompt, kind)
  const resolved: Exclude<InfographicKind, 'auto'> =
    kind === 'auto' ? (parsed.kindHint === 'auto' ? 'process' : parsed.kindHint) : kind
  const template = TEMPLATE_FOR[resolved]
  const model: InfographicModel = {
    kind: resolved,
    title: parsed.title,
    subtitle: parsed.subtitle,
    header,
    footer,
    caption: parsed.caption,
    items: parsed.items,
    template,
    syntax: '',
  }
  model.syntax = buildSyntax(model, palette)
  return model
}
