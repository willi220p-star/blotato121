"use client";

import { useEffect, useState } from "react";
import { githubSessionOn, signInOnGitHub, signOutOnGitHub } from "../../lib/githubAuth";
import { asset } from "../../lib/paths";
import { timeAgo } from "../../lib/format";
import Link from "next/link";
import { ProfileEditor } from "../../components/profile-editor";
import { CREATOR } from "../../lib/catalog";
import { useStudio } from "../../components/studio";

export default function AdminPage() {
  const { stats, profile, refreshStats, refreshProfile, setSignedIn: setStudioSignedIn } = useStudio();
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const local = githubSessionOn();
    if (local) setSignedIn(true);
    fetch(asset("/api/session"), { cache: "no-store" })
      .then(async (response) => {
        const type = response.headers.get("content-type") || "";
        if (!type.includes("application/json")) return null;
        return response.json();
      })
      .then((data) => {
        if (data?.signedIn) setSignedIn(true);
        else if (!local) setSignedIn(false);
        setReady(true);
      })
      .catch(() => setReady(true));
  }, []);

  async function signIn(event) {
    event.preventDefault();
    const typed = password.trim();
    setBusy(true);
    setError("");
    try {
      const [response, localOk] = await Promise.all([
        fetch(asset("/api/session"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: typed }),
        }).catch(() => null),
        signInOnGitHub(typed),
      ]);
      const type = response?.headers.get("content-type") || "";
      const serverOk = Boolean(response && type.includes("application/json") && response.ok);
      if (!serverOk && localOk === false) {
        signOutOnGitHub();
      }
      if (!serverOk && !localOk) throw new Error("That password doesn’t match.");
      if (serverOk && !localOk) signOutOnGitHub();
      setSignedIn(true);
      setStudioSignedIn(true);
      setPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch(asset("/api/session"), { method: "DELETE" }).catch(() => {});
    signOutOnGitHub();
    setSignedIn(false);
    setStudioSignedIn(false);
  }

  async function updateNow() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(asset("/api/sync"), { method: "POST" });
      const type = response.headers.get("content-type") || "";
      if (!type.includes("application/json")) {
        setError("This GitHub page already has the latest published counts. A new publish refreshes them.");
        return;
      }
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
          <p className="about-copy">Sign in to edit the bio and to choose which TikTok videos and Pinterest photos stay on the dashboard.</p>
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
        <p>Edit the words here. On the dashboard, open TikTok, Instagram, or Pinterest and choose what stays on the page.</p>
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
          <h2>Collaboration mail</h2>
          <p className="about-copy">Visitor notes are emailed to {CREATOR.email}. Each person also gets “Thank you for sending collaboration to Isha.” at the address they type, then the site shows a thank-you page with a link back here.</p>
        </article>
        <article>
          <h2>Page copy</h2>
          <p className="about-copy">{profile?.bio}</p>
          <button className="edit-pill" type="button" onClick={() => setEditing(true)}>Edit bio and about</button>
        </article>
      </section>
      <Link className="primary" href="/">Choose posts on the dashboard</Link>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      <button className="text-button" type="button" onClick={signOut}>Sign out</button>
      <ProfileEditor open={editing} onClose={() => { setEditing(false); refreshProfile(); }} />
    </div>
  );
}
