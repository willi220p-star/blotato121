"use client";

import { useEffect, useState } from "react";
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

  if (!open) return null;

  function update(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await saveProfile({
        ...form,
        aboutPoints: form.aboutPoints.split("\n").map((line) => line.trim()).filter(Boolean),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-scrim" role="presentation" onClick={onClose}>
      <form className="modal" role="dialog" aria-labelledby="edit-profile-title" onClick={(event) => event.stopPropagation()} onSubmit={onSubmit}>
        <header className="section-head">
          <h2 id="edit-profile-title">Edit bio and about</h2>
          <button className="icon-button" type="button" aria-label="Close editor" onClick={onClose}>×</button>
        </header>
        <label className="field">
          <span>Bio</span>
          <textarea rows={4} value={form.bio} onChange={(event) => update("bio", event.target.value)} required />
        </label>
        <label className="field">
          <span>Tagline</span>
          <input value={form.tagline} onChange={(event) => update("tagline", event.target.value)} />
        </label>
        <div className="split">
          <label className="field">
            <span>Location</span>
            <input value={form.location} onChange={(event) => update("location", event.target.value)} />
          </label>
          <label className="field">
            <span>Pronouns</span>
            <input value={form.pronouns} onChange={(event) => update("pronouns", event.target.value)} />
          </label>
        </div>
        <label className="field">
          <span>Banner note</span>
          <textarea rows={2} value={form.heroNote} onChange={(event) => update("heroNote", event.target.value)} />
        </label>
        <label className="field">
          <span>About points, one per line</span>
          <textarea rows={4} value={form.aboutPoints} onChange={(event) => update("aboutPoints", event.target.value)} />
        </label>
        <label className="field">
          <span>About paragraph</span>
          <textarea rows={4} value={form.aboutText} onChange={(event) => update("aboutText", event.target.value)} />
        </label>
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <div className="form-actions">
          <button className="primary" type="submit" disabled={busy}>{busy ? "Saving…" : "Save profile"}</button>
          <button className="ghost-button" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
