import { Link } from "react-router-dom";
import { asset } from "../asset";
import { SERVICES } from "../data";

export default function CardMarquee({ reverse = false }: { reverse?: boolean }) {
  const loop = [...SERVICES, ...SERVICES];
  return (
    <div className="marquee-wrap" aria-label="Service cards">
      <div className={`marquee-track ${reverse ? "reverse" : ""}`}>
        {loop.map((s, i) => (
          <Link className="service-card" to="/services" key={`${s.id}-${i}-${reverse ? "r" : "f"}`}>
            <img src={asset(s.image)} alt="" />
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
