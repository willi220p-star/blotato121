const KEY = 'aig-recent-v1'

export interface RecentItem {
  id: string
  kind: 'infographic' | 'carousel'
  title: string
  at: number
}

export function loadRecent(): RecentItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as RecentItem[]
    return Array.isArray(parsed) ? parsed.slice(0, 8) : []
  } catch {
    return []
  }
}

export function pushRecent(item: Omit<RecentItem, 'id' | 'at'>): RecentItem[] {
  const next: RecentItem[] = [
    { ...item, id: `${Date.now()}`, at: Date.now() },
    ...loadRecent().filter((r) => r.title !== item.title),
  ].slice(0, 8)
  localStorage.setItem(KEY, JSON.stringify(next))
  return next
}
