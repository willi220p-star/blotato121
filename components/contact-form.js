"use client";

import { useId, useState } from "react";
import { CREATOR } from "../lib/catalog";
import { saveInquiry } from "../lib/localStudio";
import { ThankYouNote } from "./thank-you-note";
import { useStudio } from "./studio";

const TYPES = ["Paid collaboration", "UGC video", "Product review", "Event or feature", "Something else"];
// Activated FormSubmit alias for https://willi220p-star.github.io/. The note is copied to Isha with _cc.
const FORM_ACTION = "https://formsubmit.co/ba0f3695036ef362c35aa624dc8540bd";

export function ContactForm({ heading = false, onSent }) {
  const { refreshInquiries } = useStudio();
  const frameName = `contact-mail-${useId().replace(/:/g, "")}`;
  const [form, setForm] = useState({ name: "", email: "", brand: "", type: TYPES[0], message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  function update(key, value) {
    setError("");
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
      setError("Add the email where your thank-you should arrive.");
      return;
    }
    if (!form.message.trim()) {
      event.preventDefault();
      setError("Tell Isha what kind of collaboration you want.");
      return;
    }
    event.preventDefault();
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
      /* The note can still be emailed if this browser blocks saved notes. */
    }
    deliver(event.currentTarget, frameName);
    setSent(true);
    onSent?.();
  }

  const named = form.name.trim();
  const visitor = form.email.trim();
  const thankYou = named
    ? `Thank you, ${named}, for sending collaboration to Isha. She has your note and will reply to this email.`
    : "Thank you for sending collaboration to Isha. She has your note and will reply to this email.";
  const copies = [CREATOR.email, visitor].filter((address, index, list) => address && list.indexOf(address) === index);

  if (sent) {
    return (
      <>
        <iframe name={frameName} title="" className="mail-frame" />
        <ThankYouNote />
      </>
    );
  }

  return (
    <>
      {heading ? <h2>Send a note</h2> : null}
      <iframe name={frameName} title="" className="mail-frame" />
      <form className="contact-form" action={FORM_ACTION} method="POST" target={frameName} onSubmit={onSubmit}>
      <input type="hidden" name="_subject" value="Thank you for sending collaboration to Isha" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_cc" value={copies.join(",")} />
      <input type="hidden" name="Thank you" value={thankYou} />
      <input type="hidden" name="_replyto" value={visitor} />
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
      <p className="fine">Your note goes to {CREATOR.email}.</p>
    </form>
    </>
  );
}

function deliver(form, frameName) {
  const ghost = document.createElement("form");
  ghost.method = "POST";
  ghost.action = FORM_ACTION;
  ghost.target = frameName;
  ghost.acceptCharset = "UTF-8";
  for (const [name, value] of new FormData(form).entries()) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = String(value);
    ghost.appendChild(input);
  }
  document.body.appendChild(ghost);
  ghost.submit();
  ghost.remove();
}

export function ContactDialog() {
  const { contactOpen, setContactOpen } = useStudio();
  const [sent, setSent] = useState(false);
  if (!contactOpen) return null;

  function close() {
    setSent(false);
    setContactOpen(false);
  }

  return (
    <div className="modal-scrim" role="presentation" onClick={close}>
      <div className="contact-dialog" role="dialog" aria-modal="true" aria-labelledby={sent ? undefined : "contact-title"} aria-label={sent ? "Thank you for submitting the form" : undefined} onClick={(event) => event.stopPropagation()}>
        {sent ? null : (
          <header className="editor-head">
            <div>
              <p className="eyebrow">Collaboration</p>
              <h2 id="contact-title">Contact Isha</h2>
              <p>The note goes to {CREATOR.email}.</p>
            </div>
            <button className="icon-button" type="button" aria-label="Close contact form" onClick={close}>×</button>
          </header>
        )}
        {sent ? <button className="icon-button thanks-close" type="button" aria-label="Close contact form" onClick={close}>×</button> : null}
        <ContactForm onSent={() => setSent(true)} />
      </div>
    </div>
  );
}
