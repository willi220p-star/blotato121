import type { RecentItem } from '../lib/storage'
import type { PageId } from '../lib/types'

interface Props {
  recent: RecentItem[]
  onOpen: (page: PageId) => void
}

export function Dashboard({ recent, onOpen }: Props) {
  return (
    <main className="page">
      <section className="hero">
        <div className="kicker">Client-ready graphics</div>
        <h1>Write the idea. Ship the piece.</h1>
        <p className="lede">
          Two studios, one desk. Prompt an infographic or a multi-slide carousel, pick the
          platform, then download a clean file you can send to a client.
        </p>
      </section>
      <div className="card-grid">
        <button className="studio-card" onClick={() => onOpen('infographic')} type="button">
          <div className="studio-art" aria-hidden="true">
            <div className="mini-infographic">
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <h2>Infographic generator</h2>
          <p>
            Process, SWOT, funnel, timeline, stats, and more. Header, footer, and platform crop
            included.
          </p>
        </button>
        <button className="studio-card" onClick={() => onOpen('carousel')} type="button">
          <div className="studio-art" aria-hidden="true">
            <div className="mini-carousel">
              <span />
              <span />
              <span />
            </div>
          </div>
          <h2>Carousel generator</h2>
          <p>
            Tell it the story and how many slides. It writes intro, middle, and a quiet close —
            sized for LinkedIn, Instagram, or Facebook.
          </p>
        </button>
      </div>
      {recent.length > 0 && (
        <section className="recent">
          <h3>Recent</h3>
          <div className="recent-list">
            {recent.map((item) => (
              <button
                className="chip"
                key={item.id}
                onClick={() => onOpen(item.kind)}
                type="button"
              >
                {item.kind === 'infographic' ? 'Infographic' : 'Carousel'} · {item.title}
              </button>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
