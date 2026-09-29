"use client";

import { useState } from "react";
import { CREATOR } from "../lib/catalog";
import { formatWhen } from "../lib/format";
import { useStudio } from "./studio";

const TYPES = ["Paid collaboration", "UGC video", "Product review", "Event or feature", "Something else"];

export function CollabView() {
  const { inquiries, refreshInquiries, setNotice, stats } = useStudio();
  const [form, setForm] = useState({ name: "", email: "", brand: "", type: TYPES[0], message: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState("");

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save the note");
      await refreshInquiries();
      const subject = encodeURIComponent(`${form.type} — ${form.brand || form.name}`);
      const body = encodeURIComponent(
        `Hi Isha,\n\n${form.message}\n\n— ${form.name}${form.brand ? `, ${form.brand}` : ""}${form.email ? `\n${form.email}` : ""}`
      );
      setDraft(`mailto:${CREATOR.email}?subject=${subject}&body=${body}`);
      setNotice("Saved in the collaboration inbox.");
      setForm({ name: "", email: "", brand: "", type: TYPES[0], message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save the note");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page collab-page">
      <header className="page-intro">
        <p className="eyebrow">Work together</p>
        <h1>Collaborations</h1>
        <p>
          Isha makes creator videos and everyday photo stories. Brands, friends, and fellow creators can reach her at{" "}
          <a href={`mailto:${CREATOR.email}`}>{CREATOR.email}</a>.
        </p>
      </header>
      <div className="split align-start">
        <form className="panel composer" onSubmit={onSubmit}>
          <h2>Send a note</h2>
          <label className="field">
            <span>Your name</span>
            <input value={form.name} onChange={(event) => update("name", event.target.value)} required />
          </label>
          <label className="field">
            <span>Email for a reply</span>
            <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@brand.com" />
          </label>
          <label className="field">
            <span>Brand or project</span>
            <input value={form.brand} onChange={(event) => update("brand", event.target.value)} />
          </label>
          <label className="field">
            <span>What kind of collaboration</span>
            <select value={form.type} onChange={(event) => update("type", event.target.value)}>
              {TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label className="field">
            <span>The brief</span>
            <textarea rows={5} value={form.message} onChange={(event) => update("message", event.target.value)} required placeholder="Timing, platforms, and what you have in mind." />
          </label>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Contact Isha"}</button>
          {draft ? <a className="ghost-button" href={draft}>Open email draft</a> : null}
          <p className="fine">The note stays in this inbox. Open the draft when you want it sent to {CREATOR.email}.</p>
        </form>
        <section className="panel">
          <h2>Inbox</h2>
          {inquiries.length === 0 ? <p className="about-copy">No collaboration notes yet. New ones land here and in Isha’s email.</p> : null}
          <ul className="inbox">
            {inquiries.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.type}{item.brand ? ` · ${item.brand}` : ""}</span>
                </div>
                <p>{item.message}</p>
                <em>{formatWhen(item.createdAt)}{item.email ? ` · ${item.email}` : ""}</em>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="panel ways">
        <h2>What she makes</h2>
        <div className="ways-grid">
          <article>
            <h3>TikTok videos</h3>
            <p>
              {stats?.tiktok?.videos ? `${stats.tiktok.videos.toLocaleString()} public videos` : "Short videos"} and a little bit of everything, posted as @_isha_dhakal_.
            </p>
          </article>
          <article>
            <h3>Instagram</h3>
            <p>Everyday frames from her little corner of the internet, plus the same collaboration email in the bio.</p>
          </article>
          <article>
            <h3>Pinterest</h3>
            <p>Photo inspo, quotes, and saved ideas on ishaapins — useful when a collab needs a visual mood.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
