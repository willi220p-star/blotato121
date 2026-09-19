import type { SlideRole } from './types'

export type SlideMode = 'cover' | 'split' | 'fill'

export function planRoles(count: number): SlideRole[] {
  const n = Math.min(10, Math.max(3, count))
  return Array.from({ length: n }, (_, index) => {
    if (index === 0) return 'intro'
    if (index === n - 1) return 'outro'
    if (index === 1 && n >= 5) return 'stat'
    if (index === n - 2 && n >= 6) return 'quote'
    return 'content'
  })
}

export function slideMode(role: SlideRole, index: number): SlideMode {
  if (role === 'intro' || role === 'outro') return 'cover'
  if (role === 'stat' || role === 'quote') return 'fill'
  return index % 2 === 1 ? 'split' : 'fill'
}

export function fitType(
  text: string,
  boxW: number,
  boxH: number,
  min = 28,
  max = 112,
): number {
  const clean = text.trim() || 'Slide'
  const lines = Math.max(2, Math.min(6, Math.ceil(clean.length / 16)))
  const chars = Math.max(8, Math.min(18, clean.length / lines))
  const byWidth = (boxW / chars) * 1.12
  const byHeight = boxH / (lines * 1.08)
  return Math.round(Math.min(max, Math.max(min, Math.min(byWidth, byHeight))))
}

export function pointsFromText(text: string, extra: string[] = []): string[] {
  const listed = extra.map((p) => p.trim()).filter(Boolean)
  if (listed.length >= 2) return listed.slice(0, 5)
  const bits = text
    .split(/\n+|(?<=[.!?])\s+|;\s+|,\s+(?=[A-Z])/)
    .map((s) => s.trim().replace(/^[•\-]\s*/, '').replace(/[.!?]$/, ''))
    .filter((s) => s.length > 12 && s.length < 140)
  return (bits.length >= 2 ? bits : listed.length ? listed : bits).slice(0, 4)
}

export function coverPrompt(scene: string, role: SlideRole): string {
  const mood =
    role === 'intro'
      ? 'hero cover photograph, subject fills the frame edge to edge'
      : role === 'outro'
        ? 'closing scene, wide cinematic still, subject fills the frame'
        : 'editorial still, subject large in frame, edge to edge'
  return `${scene.slice(0, 160)}, ${mood}, full-bleed wallpaper crop, no border, no collage, no mockup, no poster, no UI, no text`
}
