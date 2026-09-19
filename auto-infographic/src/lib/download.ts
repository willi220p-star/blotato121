import { toPng, toSvg } from 'html-to-image'
import { jsPDF } from 'jspdf'
import JSZip from 'jszip'

export async function nodeToPng(node: HTMLElement): Promise<string> {
  return toPng(node, {
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: undefined,
  })
}

export async function nodeToSvg(node: HTMLElement): Promise<string> {
  return toSvg(node, { cacheBust: true })
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a')
  a.href = dataUrl
  a.download = filename
  a.click()
}

export async function downloadPng(node: HTMLElement, filename: string) {
  downloadDataUrl(await nodeToPng(node), filename)
}

export async function downloadSvg(node: HTMLElement, filename: string) {
  downloadDataUrl(await nodeToSvg(node), filename)
}

export async function downloadCarouselZip(
  nodes: HTMLElement[],
  basename: string,
): Promise<void> {
  const zip = new JSZip()
  const folder = zip.folder(basename) ?? zip
  for (let i = 0; i < nodes.length; i += 1) {
    const png = await nodeToPng(nodes[i])
    const base64 = png.split(',')[1] ?? ''
    folder.file(`slide-${String(i + 1).padStart(2, '0')}.png`, base64, { base64: true })
  }
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  downloadDataUrl(url, `${basename}.zip`)
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}

export async function downloadCarouselPdf(
  nodes: HTMLElement[],
  basename: string,
  width: number,
  height: number,
): Promise<void> {
  const orientation = width >= height ? 'landscape' : 'portrait'
  const pdf = new jsPDF({
    orientation,
    unit: 'px',
    format: [width, height],
    hotfixes: ['px_scaling'],
  })
  for (let i = 0; i < nodes.length; i += 1) {
    const png = await nodeToPng(nodes[i])
    if (i > 0) pdf.addPage([width, height], orientation)
    pdf.addImage(png, 'PNG', 0, 0, width, height)
  }
  pdf.save(`${basename}.pdf`)
}

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 48) || 'piece'
  )
}
