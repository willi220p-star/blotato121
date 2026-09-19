import { useState } from 'react'
import { CarouselStudio } from './components/CarouselStudio'
import { Dashboard } from './components/Dashboard'
import { InfographicStudio } from './components/InfographicStudio'
import { Shell } from './components/Shell'
import { loadRecent, pushRecent, type RecentItem } from './lib/storage'
import type { PageId } from './lib/types'

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard')
  const [recent, setRecent] = useState<RecentItem[]>(() => loadRecent())

  function remember(kind: 'infographic' | 'carousel', title: string) {
    setRecent(pushRecent({ kind, title }))
  }

  return (
    <Shell onNavigate={setPage} page={page}>
      {page === 'dashboard' && <Dashboard onOpen={setPage} recent={recent} />}
      {page === 'infographic' && (
        <InfographicStudio onCreated={(title) => remember('infographic', title)} />
      )}
      {page === 'carousel' && (
        <CarouselStudio onCreated={(title) => remember('carousel', title)} />
      )}
    </Shell>
  )
}
