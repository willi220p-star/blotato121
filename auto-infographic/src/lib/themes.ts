import type { Palette, PaletteId } from './types'
import { seedFrom } from './aiEngine'

export const PALETTES: Palette[] = [
  {
    id: 'flare',
    name: 'Flare',
    note: 'Coral and gold',
    bg: '#FFE8D6',
    surface: '#FFF7F0',
    ink: '#1A0B12',
    muted: '#8A4458',
    accent: '#FF2D55',
    accent2: '#FF8A00',
    accent3: '#7C3AED',
    line: '#FFD0BA',
    onAccent: '#FFFFFF',
  },
  {
    id: 'citrus',
    name: 'Citrus',
    note: 'Lime and teal',
    bg: '#E8FFC8',
    surface: '#F7FFE8',
    ink: '#102016',
    muted: '#3F6B4A',
    accent: '#64D81A',
    accent2: '#00B3A4',
    accent3: '#FFB703',
    line: '#C6E89A',
    onAccent: '#102016',
  },
  {
    id: 'ocean',
    name: 'Ocean',
    note: 'Cyan and cobalt',
    bg: '#D7F0FF',
    surface: '#F3FBFF',
    ink: '#041830',
    muted: '#3D6A8A',
    accent: '#00B4FF',
    accent2: '#2563FF',
    accent3: '#00D4A8',
    line: '#B7E0F7',
    onAccent: '#FFFFFF',
  },
  {
    id: 'volt',
    name: 'Volt',
    note: 'Violet and neon',
    bg: '#16082A',
    surface: '#22113C',
    ink: '#F7F2FF',
    muted: '#B7A4D6',
    accent: '#C77DFF',
    accent2: '#00F0FF',
    accent3: '#FF4D9A',
    line: '#3A215C',
    onAccent: '#16082A',
  },
  {
    id: 'candy',
    name: 'Candy',
    note: 'Magenta and lemon',
    bg: '#FFE3F2',
    surface: '#FFF5FB',
    ink: '#2B0620',
    muted: '#8A3A6A',
    accent: '#FF3EA5',
    accent2: '#FFD60A',
    accent3: '#7B61FF',
    line: '#FFC2E3',
    onAccent: '#FFFFFF',
  },
  {
    id: 'ember',
    name: 'Ember',
    note: 'Flame and plum',
    bg: '#FFE4CC',
    surface: '#FFF6EC',
    ink: '#2A1208',
    muted: '#8A4E32',
    accent: '#FF5A1F',
    accent2: '#6D28D9',
    accent3: '#FBBF24',
    line: '#FFCBA6',
    onAccent: '#FFFFFF',
  },
]

export function getPalette(id: PaletteId): Palette {
  return PALETTES.find((p) => p.id === id) ?? PALETTES[0]
}

export function paletteForPrompt(prompt: string): PaletteId {
  const t = prompt.toLowerCase()
  if (/\b(ocean|water|sky|tech|blue|ice|cold|sea)\b/.test(t)) return 'ocean'
  if (/\b(plant|green|leaf|leaves|garden|health|forest|photosynthesis)\b/.test(t)) return 'citrus'
  if (/\b(coffee|fire|food|roast|warm|spice|bitter)\b/.test(t)) return 'flare'
  if (/\b(night|space|dark|music|neon|cyber)\b/.test(t)) return 'volt'
  if (/\b(love|beauty|fashion|pink|candy|flower)\b/.test(t)) return 'candy'
  return PALETTES[seedFrom(prompt) % PALETTES.length].id
}

export function tone(palette: Palette, index: number): string {
  const colors = [palette.accent, palette.accent2, palette.accent3]
  return colors[index % colors.length]
}
