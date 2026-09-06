import { FormEvent, useState } from "react";
import { EMAIL, PHONE_DISPLAY, SUBURBS } from "../data";
import { asset } from "../asset";
import { trackAction } from "../notify";
import { saveBooking } from "../storage";

export default function Book() {
  const [error, setError] = useState("");
  const [id, setId] = useState("");
  const [sending, setSending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const form = new FormData(formEl);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const email = String(form.get("email") || "").trim();
    const suburb = String(form.get("suburb") || "").trim();
    const service = String(form.get("service") || "").trim();
    const date = String(form.get("date") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    if (!name || !phone || !email || !suburb || !service || !date) {
      setError("Please complete name, phone, email, suburb, service, and date.");
      setId("");
      return;
    }
    const booking = {
      id: `BK-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
      name,
      phone,
      email,
      suburb,
      service,
      date,
      notes,
    };
    setSending(true);
    setError("");
    try {
      await trackAction("booking", {
        reference: booking.id,
        name,
        phone,
        email,
        suburb,
        service,
        date,
        notes: notes || "(none)",
        _replyto: email,
      });
    } catch {
      setError(
        "Saved here, but the mailbox ping failed. The first send needs a FormSubmit confirm click in Gmail.",
      );
    }
    saveBooking(booking);
    setId(booking.id);
    setSending(false);
    formEl.reset();
  }

  return (
    <section className="shell section">
      <h2>Book a clean</h2>
      <p className="lede">
        Tell us the job and the suburb. This form lands in the KISHUKA mailbox
        at {EMAIL}. Call {PHONE_DISPLAY} if you need today.
      </p>
      <div className="split">
        <form className="form panel" onSubmit={onSubmit}>
          <label>
            Full name
            <input name="name" autoComplete="name" />
          </label>
          <label>
            Mobile
            <input name="phone" autoComplete="tel" />
          </label>
          <label>
            Email
            <input name="email" type="email" autoComplete="email" />
          </label>
          <label>
            Suburb
            <select name="suburb" defaultValue="">
              <option value="" disabled>
                Choose suburb
              </option>
              {SUBURBS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            Service
            <select name="service" defaultValue="">
              <option value="" disabled>
                Choose service
              </option>
              <option>Carpet steam</option>
              <option>Upholstery</option>
              <option>Home clean</option>
              <option>Tiles and grout</option>
              <option>End of lease</option>
            </select>
          </label>
          <label>
            Preferred date
            <input name="date" type="date" />
          </label>
          <label>
            Notes
            <textarea name="notes" rows={3} placeholder="Pets, stairs, stains" />
          </label>
          {error ? <div className="error">{error}</div> : null}
          {id ? (
            <div className="ok-box">
              Booking received. Your reference is <code>{id}</code>. A copy went
              to the KISHUKA mailbox. We will text you to lock the time.
            </div>
          ) : null}
          <button className="submit-green" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send booking"}
          </button>
        </form>
        <aside className="panel">
          <h3>Contact</h3>
          <p>
            Phone: {PHONE_DISPLAY}
            <br />
            Email: {EMAIL}
            <br />
            Area: Darwin, Palmerston and rural NT
          </p>
          <p>Hours: Monday to Saturday, 8am to 6pm.</p>
          <img
            src={asset("images/steam_upholstery_sofa.png")}
            alt="Upholstery steam in a Darwin home"
            style={{ borderRadius: 16, marginTop: "0.8rem" }}
          />
        </aside>
      </div>
    </section>
  );
}
