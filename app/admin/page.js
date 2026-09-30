"use client";

import { useEffect, useState } from "react";
import { asset } from "../../lib/paths";
import { timeAgo } from "../../lib/format";
import { ProfileEditor } from "../../components/profile-editor";
import { useStudio } from "../../components/studio";

export default function AdminPage() {
  const { stats, profile, refreshStats, refreshProfile } = useStudio();
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetch(asset("/api/session"), { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        setSignedIn(Boolean(data.signedIn));
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(asset("/api/session"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not sign in");
      setSignedIn(true);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch(asset("/api/session"), { method: "DELETE" });
    setSignedIn(false);
  }

  async function updateNow() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(asset("/api/sync"), { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not update");
      await refreshStats(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <div className="page narrow"><p>Opening the studio desk…</p></div>;

  if (!signedIn) {
    return (
      <div className="page narrow">
        <form className="panel login-card" onSubmit={signIn}>
          <p className="eyebrow">Private</p>
          <h1>Manage the studio</h1>
          <p className="about-copy">Sign in to edit the bio, the About page, and to pull the latest public counts.</p>
          <label className="field">
            <span>Studio password</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoFocus required />
          </label>
          {error ? <p className="form-error" role="alert">{error}</p> : null}
          <button className="primary" type="submit" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <header className="page-intro">
        <p className="eyebrow">Signed in</p>
        <h1>Studio desk</h1>
        <p>Edit the public page here. Counts and new posts refresh on a timer, and you can pull them now.</p>
      </header>
      <section className="panel desk-grid">
        <article>
          <h2>Accounts</h2>
          <p className="about-copy">Last saved update {stats?.fetchedAt ? timeAgo(stats.fetchedAt) : "is still waiting"}.</p>
          <ul className="about-list">
            <li>TikTok {stats?.tiktok?.followers ?? "—"} {stats?.tiktok?.live ? "live" : "held"}</li>
            <li>Instagram {stats?.instagram?.followers ?? "—"} {stats?.instagram?.live ? "live" : "held"}</li>
            <li>Pinterest {stats?.pinterest?.followers ?? "—"} {stats?.pinterest?.live ? "live" : "held"}</li>
          </ul>
          {stats?.instagram?.error ? <p className="fine warn">{stats.instagram.error}</p> : null}
          <button className="primary" type="button" onClick={updateNow} disabled={busy}>{busy ? "Updating…" : "Update accounts now"}</button>
        </article>
        <article>
          <h2>Page copy</h2>
          <p className="about-copy">{profile?.bio}</p>
          <button className="edit-pill" type="button" onClick={() => setEditing(true)}>Edit bio and about</button>
        </article>
      </section>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="text-button" type="button" onClick={signOut}>Sign out</button>
      <ProfileEditor open={editing} onClose={() => { setEditing(false); refreshProfile(); }} />
    </div>
  );
}
