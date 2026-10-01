"use client";

import { useEffect, useId, useState } from "react";
import { CREATOR } from "../lib/catalog";
import { saveInquiry } from "../lib/localStudio";
import { asset } from "../lib/paths";
import { useStudio } from "./studio";

const TYPES = ["Paid collaboration", "UGC video", "Product review", "Event or feature", "Something else"];
const THANK_YOU = "Thank you for writing to Isha Dhakal. She has your collaboration note and will reply to this email.";

export function ContactForm() {
  const { refreshInquiries } = useStudio();
  const [form, setForm] = useState({ name: "", email: "", brand: "", type: TYPES[0], message: "" });
  const [error, setError] = useState("");
  const frameName = `isha-mail-${useId().replace(/:/g, "")}`;
  const [sent, setSent] = useState(false);
  const [nextUrl, setNextUrl] = useState("");

  useEffect(() => {
    const origin = window.location.origin;
    if (origin.startsWith("https://")) {
      setNextUrl(`${origin}${asset("/collaboration/")}?sent=1`);
    }
  }, []);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function onSubmit(event) {
    setError("");
    if (form.name.trim().length < 2) {
      event.preventDefault();
      setError("Add your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      event.preventDefault();
      setError("Add the email where Isha should reply, and where your thank-you should arrive.");
      return;
    }
    if (!form.message.trim()) {
      event.preventDefault();
      setError("Tell Isha what kind of collaboration you want.");
      return;
    }
    try {
      saveInquiry({
        id: crypto.randomUUID(),
        name: form.name.trim(),
        email: form.email.trim(),
        brand: form.brand.trim(),
        type: form.type,
        message: form.message.trim(),
        createdAt: new Date().toISOString(),
      });
      refreshInquiries();
    } catch {
      /* The form can still send if this browser blocks saved notes. */
    }
    window.setTimeout(() => setSent(true), 0);
  }

  return (
    <>
    <form className={sent ? "contact-form is-sent" : "contact-form"} action={`https://formsubmit.co/${CREATOR.email}`} method="POST" target={frameName} onSubmit={onSubmit}>
      <input type="hidden" name="_subject" value={`${form.type} for Isha Dhakal${form.brand.trim() ? ` — ${form.brand.trim()}` : ""}`} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_autoresponse" value={THANK_YOU} />
      {nextUrl ? <input type="hidden" name="_next" value={nextUrl} /> : null}
      <input type="text" name="_honey" className="honey" tabIndex={-1} autoComplete="off" />
      <label className="field">
        <span>Your name</span>
        <input name="name" value={form.name} onChange={(event) => update("name", event.target.value)} autoComplete="name" required />
      </label>
      <label className="field">
        <span>Your email</span>
        <input name="email" type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@email.com" autoComplete="email" required />
      </label>
      <label className="field">
        <span>Brand or project</span>
        <input name="brand" value={form.brand} onChange={(event) => update("brand", event.target.value)} />
      </label>
      <label className="field">
        <span>What kind of collaboration</span>
        <select name="collaboration" value={form.type} onChange={(event) => update("type", event.target.value)}>
          {TYPES.map((type) => <option key={type}>{type}</option>)}
        </select>
      </label>
      <label className="field">
        <span>Details</span>
        <textarea name="message" rows={5} value={form.message} onChange={(event) => update("message", event.target.value)} required placeholder="Timing, platforms, and what you have in mind." />
      </label>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="contact-button" type="submit">Send to Isha</button>
      <p className="fine">Send gives your note to {CREATOR.email} and emails a thank-you to you.</p>
    </form>
    <iframe className="mail-frame" name={frameName} title="Sending your note" />
    {sent ? (
      <div className="contact-form sent-note" role="status">
        <h3>Thank you</h3>
        <p>Your note is on its way to Isha. A thank-you email is on its way to {form.email.trim()}.</p>
      </div>
    ) : null}
    </>
  );
}

export function ContactDialog() {
  const { contactOpen, setContactOpen } = useStudio();
  if (!contactOpen) return null;
  return (
    <div className="modal-scrim" role="presentation" onClick={() => setContactOpen(false)}>
      <div className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contact-title" onClick={(event) => event.stopPropagation()}>
        <header className="editor-head">
          <div>
            <p className="eyebrow">Collaboration</p>
            <h2 id="contact-title">Contact Isha</h2>
            <p>Write your details and the kind of work you want. Isha gets the note, and a thank-you email comes back to you.</p>
          </div>
          <button className="icon-button" type="button" aria-label="Close contact form" onClick={() => setContactOpen(false)}>×</button>
        </header>
        <ContactForm />
      </div>
    </div>
  );
}
