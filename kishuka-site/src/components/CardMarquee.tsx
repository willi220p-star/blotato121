import { Link } from "react-router-dom";
import { SERVICES } from "../data";

export default function CardMarquee() {
  const loop = [...SERVICES, ...SERVICES];
  return (
    <div className="marquee-wrap" aria-label="Service cards">
      <div className="marquee-track">
        {loop.map((s, i) => (
          <Link className="service-card" to="/services" key={`${s.id}-${i}`}>
            {s.image ? <img src={s.image} alt="" /> : null}
            <div>
              <h3>{s.title}</h3>
              <p>{s.blurb}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
