import { Link } from "react-router-dom";
import { asset } from "../asset";
import CardMarquee from "../components/CardMarquee";
import OfferGrid from "../components/OfferGrid";
import OfferTicker from "../components/OfferTicker";

export default function Home() {
  return (
    <>
      <OfferTicker />

      <section className="hero-band">
        <div className="shell hero">
          <div>
            <p className="eyebrow">Darwin · Palmerston · rural NT</p>
            <h1>
              Fresh Darwin homes. <em>Hot steam.</em>
            </h1>
            <p>
              KISHUKA is Kishan and Binuka. Carpet steam, vacuum extraction, and home
              cleaning built for Top End humidity.
            </p>
            <div className="hero-actions">
              <Link className="cta-book" to="/book">
                Book a clean
              </Link>
              <Link className="cta-refer" to="/rates">
                See rates
              </Link>
            </div>
            <ul className="hero-pills">
              <li>Same-day window</li>
              <li>$40 first steam</li>
              <li>Fabric protect midweek</li>
            </ul>
          </div>
          <figure className="photo-frame">
            <img
              src={asset("images/steam_carpet_living_room.png")}
              alt="Technician steam cleaning a Darwin living room carpet"
            />
            <figcaption className="photo-chip">Heat steam on the job</figcaption>
          </figure>
        </div>
      </section>

      <section className="shell section">
        <h2>Current offers</h2>
        <p className="lede">
          Hover or tap a card. It opens up so you can read the deal, then jump
          straight into booking or a referral.
        </p>
        <OfferGrid />
      </section>

      <section className="section marquee-section">
        <div className="shell">
          <h2>Services on the move</h2>
          <p className="lede">
            One row rolls left. The next rolls right. Every card has a photo.
            Hover to pause.
          </p>
        </div>
        <CardMarquee />
        <div className="marquee-gap" />
        <CardMarquee reverse />
      </section>

      <section className="shell section">
        <h2>Steam in the room</h2>
        <p className="lede">Hover the photos and they open up.</p>
        <div className="photo-grid">
          <figure className="zoom-card tall">
            <img
              src={asset("images/steam_crew_hallway.png")}
              alt="Two KISHUKA technicians steam cleaning a hallway runner"
            />
            <figcaption>Crew on a Darwin hallway</figcaption>
          </figure>
          <div className="stack">
            <figure className="zoom-card short">
              <img src={asset("images/steam_upholstery_sofa.png")} alt="Upholstery steam cleaning a sofa" />
              <figcaption>Sofa steam</figcaption>
            </figure>
            <figure className="zoom-card short">
              <img
                src={asset("images/tiles_grout.png")}
                alt="Steam cleaning tiles and grout"
              />
              <figcaption>Tiles and grout</figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
