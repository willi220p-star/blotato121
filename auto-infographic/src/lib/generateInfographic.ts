import { draftInfographic } from './aiEngine'
import type { AiProgress, InfographicKind, InfographicModel, Palette } from './types'

export const TEMPLATE_FOR: Record<Exclude<InfographicKind, 'auto'>, string> = {
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

export function assembleInfographic(
  draft: Omit<InfographicModel, 'syntax' | 'template'> & { kind: Exclude<InfographicKind, 'auto'> },
  palette: Palette,
): InfographicModel {
  const model: InfographicModel = {
    ...draft,
    template: TEMPLATE_FOR[draft.kind],
    syntax: '',
  }
  model.syntax = buildSyntax(model, palette)
  return model
}

export function restyleInfographic(
  model: InfographicModel,
  kind: InfographicKind,
  palette: Palette,
): InfographicModel {
  const resolved = kind === 'auto' ? model.kind : kind
  return assembleInfographic({ ...model, kind: resolved }, palette)
}

export async function generateInfographic(
  prompt: string,
  kind: InfographicKind,
  header: string,
  footer: string,
  palette: Palette,
  onProgress?: (progress: AiProgress) => void,
  signal?: AbortSignal,
): Promise<InfographicModel> {
  const draft = await draftInfographic(prompt, kind, onProgress, signal)
  return assembleInfographic(
    {
      kind: draft.kind,
      title: draft.title,
      subtitle: draft.subtitle,
      header,
      footer,
      caption: draft.caption,
      items: draft.items,
      heroImage: draft.heroImage,
      research: draft.research,
      source: draft.source,
    },
    palette,
  )
}
