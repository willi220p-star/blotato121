import type { RecentItem } from '../lib/storage'
import type { PageId } from '../lib/types'

interface Props {
  recent: RecentItem[]
  onOpen: (page: PageId) => void
}

export function Dashboard({ recent, onOpen }: Props) {
  return (
    <main className="page dash">
      <section className="hero">
        <h1>Prompt. Piece. Post.</h1>
      </section>
      <div className="card-grid">
        <button className="studio-card" onClick={() => onOpen('infographic')} type="button">
          <div className="studio-art infographic-art" aria-hidden="true">
            <div className="mini-infographic">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <h2>Infographic</h2>
        </button>
        <button className="studio-card" onClick={() => onOpen('carousel')} type="button">
          <div className="studio-art carousel-art" aria-hidden="true">
            <div className="mini-carousel">
              <span />
              <span />
              <span />
            </div>
          </div>
          <h2>Carousel</h2>
        </button>
      </div>
      {recent.length > 0 && (
        <section className="recent">
          <div className="recent-list">
            {recent.map((item) => (
              <button className="chip" key={item.id} onClick={() => onOpen(item.kind)} type="button">
                {item.title}
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
