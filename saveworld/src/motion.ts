import { useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react'

export function greetingFor(date = new Date()): string {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

export function useScrolled(threshold = 72): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

export function usePointerField(): { mx: number; my: number } {
  const [point, setPoint] = useState({ mx: 0.5, my: 0.25 })
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      const mx = event.clientX / window.innerWidth
      const my = event.clientY / window.innerHeight
      document.documentElement.style.setProperty('--mx', `${event.clientX}px`)
      document.documentElement.style.setProperty('--my', `${event.clientY}px`)
      document.documentElement.style.setProperty('--mxn', mx.toFixed(3))
      document.documentElement.style.setProperty('--myn', my.toFixed(3))
      setPoint({ mx, my })
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
  return point
}

export function tiltFromPointer(event: ReactPointerEvent<HTMLElement>): string {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width - 0.5
  const y = (event.clientY - rect.top) / rect.height - 0.5
  return `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`
}
