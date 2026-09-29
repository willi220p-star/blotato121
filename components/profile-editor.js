"use client";

import { useEffect, useId, useState } from "react";
import { asset } from "../lib/paths";
import { useStudio } from "./studio";

const EMPTY = {
  tagline: "",
  heroNote: "",
  location: "",
  pronouns: "",
  bio: "",
  aboutText: "",
  aboutPoints: "",
};

export function ProfileEditor({ open, onClose }) {
  const { profile, saveProfile } = useStudio();
  const titleId = useId();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open || !profile) return;
    setForm({
      tagline: profile.tagline || "",
      heroNote: profile.heroNote || "",
      location: profile.location || "",
      pronouns: profile.pronouns || "",
      bio: profile.bio || "",
      aboutText: profile.aboutText || "",
      aboutPoints: (profile.aboutPoints || []).join("\n"),
    });
    setError("");
  }, [open, profile]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const points = form.aboutPoints.split("\n").map((line) => line.trim()).filter(Boolean);

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await saveProfile({ ...form, aboutPoints: points });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-scrim" role="presentation" onClick={onClose}>
      <form
        className="editor"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
      >
        <header className="editor-head">
          <div>
            <p className="eyebrow">Studio profile</p>
            <h2 id={titleId}>Edit bio and about</h2>
            <p>Changes show on the dashboard and the About page as soon as you save.</p>
          </div>
          <button className="icon-button" type="button" aria-label="Close editor" onClick={onClose}>×</button>
        </header>
        <div className="editor-body">
          <div className="editor-form">
            <section>
              <h3>Bio</h3>
              <label className="field">
                <span>The line under your name <em>{form.bio.length}/400</em></span>
                <textarea rows={4} maxLength={400} value={form.bio} autoFocus onChange={(event) => update("bio", event.target.value)} required />
              </label>
            </section>
            <section>
              <h3>Identity</h3>
              <label className="field">
                <span>Tagline</span>
                <input maxLength={80} value={form.tagline} onChange={(event) => update("tagline", event.target.value)} />
              </label>
              <div className="split">
                <label className="field">
                  <span>Location</span>
                  <input maxLength={40} value={form.location} onChange={(event) => update("location", event.target.value)} />
                </label>
                <label className="field">
                  <span>Pronouns</span>
                  <input maxLength={24} value={form.pronouns} onChange={(event) => update("pronouns", event.target.value)} />
                </label>
              </div>
              <label className="field">
                <span>Banner note</span>
                <textarea rows={2} maxLength={80} value={form.heroNote} onChange={(event) => update("heroNote", event.target.value)} />
              </label>
            </section>
            <section>
              <h3>About</h3>
              <label className="field">
                <span>Points, one per line</span>
                <textarea rows={4} value={form.aboutPoints} onChange={(event) => update("aboutPoints", event.target.value)} />
              </label>
              <label className="field">
                <span>Paragraph <em>{form.aboutText.length}/500</em></span>
                <textarea rows={4} maxLength={500} value={form.aboutText} onChange={(event) => update("aboutText", event.target.value)} />
              </label>
            </section>
          </div>
          <aside className="editor-preview" aria-label="Live preview">
            <p className="eyebrow">Preview</p>
            <article className="preview-card">
              <img src={asset("/media/avatar-ig.jpg")} alt="" />
              <div>
                <strong>Isha Dhakal</strong>
                <span>Content creator · {form.pronouns || "she/her"} · {form.location || "Nepal"}</span>
                <p>{form.bio || "Your bio appears here."}</p>
              </div>
            </article>
            <article className="preview-about">
              <h3>About me</h3>
              <ul>
                {points.length ? points.map((point) => <li key={point}>{point}</li>) : <li>Add a point to preview it.</li>}
              </ul>
              <p>{form.aboutText || "Your about paragraph appears here."}</p>
            </article>
          </aside>
        </div>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <footer className="editor-foot">
          <span>Esc closes without saving</span>
          <div className="form-actions">
            <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
            <button className="primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</button>
          </div>
        </footer>
      </form>
    </div>
  );
}
