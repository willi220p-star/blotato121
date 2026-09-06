import { Link } from "react-router-dom";
import { asset } from "../asset";
import { SERVICES } from "../data";

export default function Services() {
  return (
    <section className="shell section">
      <h2>Services</h2>
      <p className="lede">
        Steam, vacuum, and house work for Darwin weather. Every job card has a
        photo. Hover or tap to grow it, then book.
      </p>
      <div className="service-grid">
        {SERVICES.map((s) => (
          <article className="service-card static-card" key={s.id}>
            <img src={asset(s.image)} alt="" />
            <div>
              <h3>{s.title}</h3>
              <p>{s.blurb}</p>
              <p className="card-cta">
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
