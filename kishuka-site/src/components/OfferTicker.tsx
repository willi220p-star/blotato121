import { Link } from "react-router-dom";
import { OFFERS } from "../data";

export default function OfferTicker() {
  const loop = [...OFFERS, ...OFFERS, ...OFFERS];
  return (
    <div className="offer-ticker" aria-label="Current offers">
      <div className="offer-ticker-track">
        {loop.map((o, i) => (
          <Link className={`ticker-chip ${o.tone}`} to={o.id === "refer" ? "/referral" : "/book"} key={`${o.id}-${i}`}>
            <b>{o.title}</b>
            <span>{o.kicker}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
