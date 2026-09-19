import type { ReactNode } from 'react'
import type { PageId } from '../lib/types'

interface Props {
  page: PageId
  onNavigate: (page: PageId) => void
  children: ReactNode
}

export function Shell({ page, onNavigate, children }: Props) {
  return (
    <div className="app-shell">
      <header className="app-header">
        <button className="brand" onClick={() => onNavigate('dashboard')} type="button">
          <span className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand-copy">Auto Infographic</span>
        </button>
        <nav className="nav">
          <button className={page === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')} type="button">
            Home
          </button>
          <button
            className={page === 'infographic' ? 'active' : ''}
            onClick={() => onNavigate('infographic')}
            type="button"
          >
            Infographic
          </button>
          <button className={page === 'carousel' ? 'active' : ''} onClick={() => onNavigate('carousel')} type="button">
            Carousel
          </button>
        </nav>
      </header>
      {children}
    </div>
  )
}
