import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { EMAIL, PHONE_DISPLAY } from "../data";
import { asset } from "../asset";
import { trackVisit } from "../notify";

const links = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/rates", label: "Rates" },
  { to: "/reviews", label: "Reviews" },
  { to: "/referral", label: "Referral" },
];

export default function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    trackVisit(location.pathname || "/");
  }, [location.pathname]);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
            <img src={asset("brand/kishuka_mark_white.png")} alt="KISHUKA mark" />
            <div>
              <b>KISHUKA</b>
              <span>Steam and Clean</span>
            </div>
          </NavLink>
          <nav className="nav-desk" aria-label="Primary">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === "/"}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <NavLink className="cta-book" to="/book">
            Book a clean
          </NavLink>
          <button
            className="menu-btn"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "×" : "☰"}
          </button>
        </div>
      </header>
      <nav className={`nav-mobile ${open ? "open" : ""}`} aria-label="Mobile">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.to === "/"} onClick={() => setOpen(false)}>
            {l.label}
          </NavLink>
        ))}
        <NavLink to="/book" onClick={() => setOpen(false)}>
          Book a clean
        </NavLink>
      </nav>
      <main id="main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="shell foot-grid">
          <div className="foot-brand">
            <img src={asset("brand/kishuka_logo_stacked.png")} alt="KISHUKA" />
            <div>
              <strong>KISHUKA Steam and Clean</strong>
              <p style={{ margin: "0.3rem 0 0" }}>Kishan and Binuka. Darwin NT.</p>
            </div>
          </div>
          <div>
            <strong>Call</strong>
            <p>{PHONE_DISPLAY}</p>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </div>
          <div>
            <strong>Pages</strong>
            <p>
              <NavLink to="/services">Services</NavLink> · <NavLink to="/rates">Rates</NavLink>
              <br />
              <NavLink to="/reviews">Reviews</NavLink> · <NavLink to="/referral">Referral</NavLink>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
