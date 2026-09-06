import { Link } from "react-router-dom";
import { asset } from "../asset";
import { OFFERS } from "../data";

const hrefs: Record<string, string> = {
  first: "/book",
  refer: "/referral",
  midweek: "/rates",
  sameday: "/book",
};

export default function OfferGrid() {
  return (
    <div className="offer-grid">
      {OFFERS.map((o) => (
        <Link className={`blow ${o.tone}`} to={hrefs[o.id]} key={o.id}>
          <img src={asset(o.image)} alt="" />
          <div className="blow-copy">
            <small>{o.kicker}</small>
            <h3>{o.title}</h3>
            <p>{o.detail}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
