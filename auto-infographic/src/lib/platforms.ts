import type { Platform } from './types'

export const PLATFORMS: Platform[] = [
  {
    id: 'ig-post',
    name: 'Instagram post',
    network: 'Instagram',
    width: 1080,
    height: 1080,
    hint: 'Square feed',
  },
  {
    id: 'ig-portrait',
    name: 'Instagram portrait',
    network: 'Instagram',
    width: 1080,
    height: 1350,
    hint: '4:5 feed',
  },
  {
    id: 'ig-story',
    name: 'Instagram story',
    network: 'Instagram',
    width: 1080,
    height: 1920,
    hint: '9:16 story / reel',
  },
  {
    id: 'fb-post',
    name: 'Facebook post',
    network: 'Facebook',
    width: 1200,
    height: 630,
    hint: 'Link preview',
  },
  {
    id: 'fb-feed',
    name: 'Facebook feed',
    network: 'Facebook',
    width: 1080,
    height: 1080,
    hint: 'Square feed',
  },
  {
    id: 'li-post',
    name: 'LinkedIn post',
    network: 'LinkedIn',
    width: 1200,
    height: 627,
    hint: 'Landscape share',
  },
  {
    id: 'li-carousel',
    name: 'LinkedIn carousel',
    network: 'LinkedIn',
    width: 1080,
    height: 1080,
    hint: 'Document slides',
  },
  {
    id: 'pin',
    name: 'Pinterest pin',
    network: 'Pinterest',
    width: 1000,
    height: 1500,
    hint: '2:3 pin',
  },
  {
    id: 'x-post',
    name: 'X post',
    network: 'X',
    width: 1200,
    height: 675,
    hint: '16:9 card',
  },
  {
    id: 'wide',
    name: 'Presentation',
    network: 'Generic',
    width: 1920,
    height: 1080,
    hint: '16:9 deck',
  },
]

export const DEFAULT_INFOGRAPHIC_PLATFORM = 'ig-portrait'
export const DEFAULT_CAROUSEL_PLATFORM = 'li-carousel'

export function getPlatform(id: string): Platform {
  return PLATFORMS.find((p) => p.id === id) ?? PLATFORMS[0]
}

export function previewScale(platform: Platform, maxW = 520, maxH = 680): number {
  return Math.min(maxW / platform.width, maxH / platform.height, 1)
}
