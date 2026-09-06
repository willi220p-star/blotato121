import { Link } from "react-router-dom";
import CardMarquee from "../components/CardMarquee";
import OfferGrid from "../components/OfferGrid";

export default function Home() {
  return (
    <>
      <section className="shell hero">
        <div>
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
        </div>
        <figure className="photo-frame">
          <img src="/images/steam_carpet_living_room.png" alt="Technician steam cleaning a Darwin living room carpet" />
          <figcaption className="photo-chip">Heat steam on the job</figcaption>
        </figure>
      </section>

      <section className="shell section">
        <h2>Offers that pop</h2>
        <p className="lede">
          Hover or tap a card. It blows up so you can read the deal, then jump
          straight into booking or a referral.
        </p>
        <OfferGrid />
      </section>

      <section className="section">
        <div className="shell">
          <h2>Cards keep moving</h2>
          <p className="lede">
            Service cards roll across the page. Hover to pause. Each card grows
            so you can pick a job.
          </p>
        </div>
        <CardMarquee />
      </section>

      <section className="shell section">
        <h2>Steam in the room</h2>
        <p className="lede">
          Real kit, real pile, real steam. Hover the photos and they open up.
        </p>
        <div className="photo-grid">
          <figure className="zoom-card tall">
            <img src="/images/steam_crew_hallway.png" alt="Two KISHUKA technicians steam cleaning a hallway runner" />
            <figcaption>Crew on a Darwin hallway</figcaption>
          </figure>
          <div className="stack">
            <figure className="zoom-card short">
              <img src="/images/steam_upholstery_sofa.png" alt="Upholstery steam cleaning a sofa" />
              <figcaption>Sofa steam</figcaption>
            </figure>
            <figure className="zoom-card short">
              <img src="/images/steam_wand_closeup.png" alt="Close up of a steam wand extracting carpet soil" />
              <figcaption>Wand extraction</figcaption>
            </figure>
          </div>
        </div>
      </section>
    </>
  );
}
