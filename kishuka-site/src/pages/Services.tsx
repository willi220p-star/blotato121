import { Link } from "react-router-dom";
import { asset } from "../asset";
import { SERVICES } from "../data";

export default function Services() {
  return (
    <section className="shell section">
      <h2>Services</h2>
      <p className="lede">
        Steam, vacuum, and house work for Darwin weather. Hover a card and it
        grows. Then book the job.
      </p>
      <div className="offer-grid">
        {SERVICES.map((s) => (
          <article className="service-card" key={s.id} style={{ width: "auto" }}>
            {s.image ? <img src={asset(s.image)} alt="" /> : <div className="card-fallback" />}
            <div>
              <h3>{s.title}</h3>
              <p>{s.blurb}</p>
              <p style={{ marginTop: "0.8rem" }}>
                <Link className="cta-book" to="/book">
                  Book a clean
                </Link>
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
