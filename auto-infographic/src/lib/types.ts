export type PageId = 'dashboard' | 'infographic' | 'carousel'

export type InfographicKind =
  | 'auto'
  | 'process'
  | 'timeline'
  | 'comparison'
  | 'stats'
  | 'list'
  | 'swot'
  | 'pyramid'
  | 'funnel'
  | 'cycle'
  | 'roadmap'
  | 'hierarchy'
  | 'pie'

export type CarouselKind =
  | 'auto'
  | 'thought-leadership'
  | 'product-launch'
  | 'how-to'
  | 'story'
  | 'metrics'
  | 'offer'

export type EngineMode = 'studio' | 'antv'

export type PaletteId = 'atelier' | 'editorial' | 'sage' | 'midnight' | 'paper' | 'noir'

export interface Palette {
  id: PaletteId
  name: string
  note: string
  bg: string
  surface: string
  ink: string
  muted: string
  accent: string
  accent2: string
  line: string
  onAccent: string
}

export interface Platform {
  id: string
  name: string
  network: 'Instagram' | 'Facebook' | 'LinkedIn' | 'Pinterest' | 'X' | 'Generic'
  width: number
  height: number
  hint: string
}

export interface ContentItem {
  label: string
  desc: string
  value?: string
  group?: string
}

export interface ParsedIdea {
  title: string
  subtitle: string
  caption: string
  items: ContentItem[]
  kindHint: InfographicKind
}

export interface InfographicModel {
  kind: Exclude<InfographicKind, 'auto'>
  title: string
  subtitle: string
  header: string
  footer: string
  caption: string
  items: ContentItem[]
  syntax: string
  template: string
}

export type SlideRole = 'intro' | 'content' | 'stat' | 'quote' | 'outro'

export interface CarouselSlideModel {
  role: SlideRole
  kicker: string
  title: string
  body: string
  stat?: string
  statLabel?: string
}

export interface CarouselModel {
  kind: Exclude<CarouselKind, 'auto'>
  title: string
  subtitle: string
  header: string
  footer: string
  brand: string
  handle: string
  slides: CarouselSlideModel[]
}

export interface SampleImage {
  name: string
  dataUrl: string
}
