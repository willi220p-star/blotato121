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
        <div className="blob blob-a" aria-hidden="true" />
        <div className="blob blob-b" aria-hidden="true" />
        <div className="blob blob-c" aria-hidden="true" />
        <div className="shell hero">
          <div>
            <p className="eyebrow">Darwin · Palmerston · rural NT</p>
            <h1>
              Fresh Darwin homes. <em>Hot steam.</em>
            </h1>
            <p>
              KISHUKA is Kishan and Binuka. Carpet steam, vacuum extraction, and home
              cleaning built for Top End humidity. Bright work. Bright rooms.
            </p>
            <div className="hero-actions">
              <Link className="cta-book" to="/book">
                Book a clean
              </Link>
              <Link className="cta-refer" to="/rates">
                See rates
              </Link>
              <Link className="cta-google" to="/referral">
                25% referral
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
        <h2>Offers that pop</h2>
        <p className="lede">
          Hover or tap a card. It blows up so you can read the deal, then jump
          straight into booking or a referral.
        </p>
        <OfferGrid />
      </section>

      <section className="section marquee-section">
        <div className="shell">
          <h2>Cards keep sliding</h2>
          <p className="lede">
            One row rolls left. The next rolls right. Hover to pause. Each card
            grows so you can pick a job.
          </p>
        </div>
        <CardMarquee />
        <div className="marquee-gap" />
        <CardMarquee reverse />
      </section>

      <section className="shell section">
        <h2>Steam in the room</h2>
        <p className="lede">
          Real kit, real pile, real steam. Hover the photos and they open up.
        </p>
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
                src={asset("images/steam_wand_closeup.png")}
                alt="Close up of a steam wand extracting carpet soil"
              />
              <figcaption>Wand extraction</figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
