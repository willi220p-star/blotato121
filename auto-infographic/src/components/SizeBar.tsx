import { PALETTES } from '../lib/themes'
import { SIZE_GROUPS, getPlatform } from '../lib/platforms'
import type { PaletteId, Platform } from '../lib/types'

interface SizeBarProps {
  platformId: string
  customW: number
  customH: number
  onPlatform: (id: string) => void
  onCustom: (w: number, h: number) => void
}

export function SizeBar({ platformId, customW, customH, onPlatform, onCustom }: SizeBarProps) {
  return (
    <div className="size-bar">
      <div className="chips">
        {SIZE_GROUPS.shapes.map((id) => {
          const p = getPlatform(id)
          return (
            <button
              className={`chip ${platformId === id ? 'active' : ''}`}
              key={id}
              onClick={() => onPlatform(id)}
              type="button"
            >
              {p.name}
            </button>
          )
        })}
      </div>
      <div className="chips">
        {SIZE_GROUPS.social.map((id) => {
          const p = getPlatform(id)
          return (
            <button
              className={`chip ${platformId === id ? 'active' : ''}`}
              key={id}
              onClick={() => onPlatform(id)}
              type="button"
            >
              {p.network} {p.hint}
            </button>
          )
        })}
      </div>
      {platformId === 'custom' && (
        <div className="row size-custom">
          <input
            aria-label="Width"
            max={4000}
            min={400}
            type="number"
            value={customW}
            onChange={(e) => onCustom(Number(e.target.value), customH)}
          />
          <span className="times">×</span>
          <input
            aria-label="Height"
            max={4000}
            min={400}
            type="number"
            value={customH}
            onChange={(e) => onCustom(customW, Number(e.target.value))}
          />
        </div>
      )}
    </div>
  )
}

export function PaletteDots({
  value,
  onChange,
}: {
  value: PaletteId
  onChange: (id: PaletteId) => void
}) {
  return (
    <div className="palette-dots">
      {PALETTES.map((p) => (
        <button
          aria-label={p.name}
          className={`swatch ${value === p.id ? 'active' : ''}`}
          key={p.id}
          onClick={() => onChange(p.id)}
          style={{ background: p.accent, boxShadow: `inset 0 0 0 7px ${p.surface}` }}
          title={p.name}
          type="button"
        />
      ))}
    </div>
  )
}

export function platformLabel(platform: Platform): string {
  if (platform.id === 'custom') return `${platform.width} × ${platform.height}`
  return `${platform.network === 'Generic' ? platform.name : platform.network} · ${platform.width}×${platform.height}`
}
