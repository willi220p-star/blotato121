import type { Platform } from './types'

export const PLATFORMS: Platform[] = [
  { id: 'square', name: 'Square', network: 'Generic', width: 1080, height: 1080, hint: '1:1' },
  { id: 'portrait', name: 'Portrait', network: 'Generic', width: 1080, height: 1350, hint: '4:5' },
  { id: 'story', name: 'Story', network: 'Generic', width: 1080, height: 1920, hint: '9:16' },
  { id: 'landscape', name: 'Landscape', network: 'Generic', width: 1920, height: 1080, hint: '16:9' },
  { id: 'ig-post', name: 'Instagram', network: 'Instagram', width: 1080, height: 1080, hint: 'Feed' },
  { id: 'ig-portrait', name: 'Instagram', network: 'Instagram', width: 1080, height: 1350, hint: '4:5' },
  { id: 'ig-story', name: 'Instagram', network: 'Instagram', width: 1080, height: 1920, hint: 'Story' },
  { id: 'fb-post', name: 'Facebook', network: 'Facebook', width: 1200, height: 630, hint: 'Link' },
  { id: 'fb-feed', name: 'Facebook', network: 'Facebook', width: 1080, height: 1080, hint: 'Feed' },
  { id: 'li-post', name: 'LinkedIn', network: 'LinkedIn', width: 1200, height: 627, hint: 'Post' },
  { id: 'li-carousel', name: 'LinkedIn', network: 'LinkedIn', width: 1080, height: 1080, hint: 'Carousel' },
  { id: 'pin', name: 'Pinterest', network: 'Pinterest', width: 1000, height: 1500, hint: 'Pin' },
  { id: 'x-post', name: 'X', network: 'X', width: 1200, height: 675, hint: 'Card' },
  { id: 'custom', name: 'Custom', network: 'Generic', width: 1080, height: 1350, hint: 'Any size' },
]

export const DEFAULT_INFOGRAPHIC_PLATFORM = 'ig-portrait'
export const DEFAULT_CAROUSEL_PLATFORM = 'li-carousel'

export function getPlatform(id: string, width?: number, height?: number): Platform {
  const base = PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]
  if (id === 'custom' && width && height) {
    return { ...base, width: clampSize(width), height: clampSize(height) }
  }
  return base
}

export function clampSize(n: number): number {
  return Math.min(4000, Math.max(400, Math.round(n) || 1080))
}

export function previewScale(platform: Platform, maxW = 560, maxH = 720): number {
  return Math.min(maxW / platform.width, maxH / platform.height, 1)
}

export const SIZE_GROUPS = {
  shapes: ['square', 'portrait', 'story', 'landscape', 'custom'] as const,
  social: ['ig-post', 'ig-portrait', 'ig-story', 'fb-feed', 'fb-post', 'li-carousel', 'li-post', 'pin', 'x-post'] as const,
}
