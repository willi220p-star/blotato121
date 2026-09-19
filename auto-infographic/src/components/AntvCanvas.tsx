import { Infographic } from '@antv/infographic'
import { useEffect, useRef, useState } from 'react'
import type { Palette, Platform } from '../lib/types'

interface Props {
  syntax: string
  platform: Platform
  palette: Palette
  scale?: number
}

export default function AntvCanvas({ syntax, platform, palette, scale = 1 }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const engine = useRef<Infographic | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    engine.current?.destroy()
    setError(null)
    try {
      const instance = new Infographic({
        container: el,
        width: platform.width - 96,
        height: platform.height - 160,
        padding: 8,
      })
      engine.current = instance
      instance.on('error', (err: unknown) => {
        setError(err instanceof Error ? err.message : 'Could not render this diagram.')
      })
      instance.render(syntax)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not render this diagram.')
    }
    return () => {
      engine.current?.destroy()
      engine.current = null
    }
  }, [syntax, platform.width, platform.height])

  return (
    <div
      className="artboard"
      style={{
        width: platform.width,
        height: platform.height,
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        background: palette.surface,
        padding: 48,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {error && <div className="empty">{error}</div>}
      <div className="antv-host" ref={host} style={{ display: error ? 'none' : 'block' }} />
    </div>
  )
}
