import { draftCarousel } from './aiEngine'
import type { AiProgress, CarouselKind, CarouselModel, CarouselSlideModel } from './types'

export function restyleCarousel(model: CarouselModel, kind: CarouselKind): CarouselModel {
  if (kind === 'auto' || kind === model.kind) return model
  return { ...model, kind }
}

export async function generateCarousel(
  prompt: string,
  slideCount: number,
  kind: CarouselKind,
  header: string,
  footer: string,
  brand: string,
  handle: string,
  onProgress?: (progress: AiProgress) => void,
  signal?: AbortSignal,
  size?: { width: number; height: number },
): Promise<CarouselModel> {
  const draft = await draftCarousel(prompt, kind, slideCount, onProgress, signal, size)
  return {
    kind: draft.kind,
    title: draft.title,
    subtitle: draft.subtitle,
    header: header || draft.header,
    footer: footer || draft.footer,
    brand: brand || draft.brand || 'Studio',
    handle: handle || draft.handle || '@studio',
    slides: draft.slides,
    research: draft.research,
    source: draft.source,
  }
}

export function patchCarouselSlide(
  model: CarouselModel,
  index: number,
  partial: Partial<CarouselSlideModel>,
): CarouselModel {
  return {
    ...model,
    slides: model.slides.map((slide, i) => (i === index ? { ...slide, ...partial } : slide)),
  }
}
