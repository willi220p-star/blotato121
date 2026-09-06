import { Link } from "react-router-dom";
import { RATES } from "../data";

export default function Rates() {
  return (
    <section className="shell section">
      <h2>Rates</h2>
      <p className="lede">
        Darwin starting prices. Final quote depends on size, soil, and access.
        First steam is $40 off. Referrals take 25% off the next visit.
      </p>
      <div className="split">
        <div>
          {RATES.map((group) => (
            <article className="panel rate-card" key={group.group}>
              <h3>{group.group}</h3>
              <p className="lede">{group.note}</p>
              <table className="rate-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>From</th>
                  </tr>
                </thead>
                <tbody>
                  {group.rows.map((row) => (
                    <tr key={row.item}>
                      <td>{row.item}</td>
                      <td>{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))}
        </div>
        <aside className="panel">
          <h3>How we charge</h3>
          <p>
            Carpet steam is priced per room. Home cleans are priced by size.
            Stairs, pet treatment, and mould-aware work are quoted on the day.
          </p>
          <p>
            <Link className="cta-book" to="/book">
              Book a clean
            </Link>
          </p>
          <p>
            <Link className="cta-refer" to="/referral">
              Get 25% off
            </Link>
          </p>
        </aside>
      </div>
    </section>
  );
}
