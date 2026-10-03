"use client";

import { useState } from "react";
import { CREATOR } from "../lib/catalog";
import { useStudio } from "./studio";

const KEY = "isha-studio-settings";

export function SettingsView() {
  const { refreshStats, stats, settings, setSettings } = useStudio();
  const [saved, setSaved] = useState(false);

  function save(event) {
    event.preventDefault();
    localStorage.setItem(KEY, JSON.stringify(settings));
    setSaved(true);
  }

  return (
    <div className="page narrow">
      <header className="page-intro">
        <p className="eyebrow">Studio</p>
        <h1>Settings</h1>
        <p>The public profile details stay tied to Isha’s accounts. These switches only change this browser.</p>
      </header>
      <form className="panel composer" onSubmit={save}>
        <label className="check solo">
          <input type="checkbox" checked={settings.exactCounts} onChange={(event) => setSettings({ ...settings, exactCounts: event.target.checked })} />
          Keep exact follower counts visible under the short numbers
        </label>
        <label className="check solo">
          <input type="checkbox" checked={settings.inboxAlerts} onChange={(event) => setSettings({ ...settings, inboxAlerts: event.target.checked })} />
          Show collaboration notes in the bell menu
        </label>
        <button className="primary" type="submit">Save preferences</button>
        {saved ? <p className="fine">Saved on this browser.</p> : null}
      </form>
      <section className="panel">
        <h2>Connected profiles</h2>
        <dl className="defs">
          <div><dt>Creator</dt><dd>{CREATOR.name}</dd></div>
          <div><dt>Email</dt><dd><a href={`mailto:${CREATOR.email}`}>{CREATOR.email}</a></dd></div>
          <div><dt>TikTok</dt><dd><a href={CREATOR.tiktok}>@_isha_dhakal_</a></dd></div>
          <div><dt>Instagram</dt><dd><a href={CREATOR.instagram}>@_isha_dhakal_</a></dd></div>
          <div><dt>Pinterest</dt><dd><a href={CREATOR.pinterest}>ishaapins</a></dd></div>
          <div><dt>Last count refresh</dt><dd>{stats?.fetchedAt ? new Date(stats.fetchedAt).toLocaleString() : "Not yet"}</dd></div>
        </dl>
        <button className="ghost-button" type="button" onClick={() => refreshStats(true)}>Refresh live counts</button>
      </section>
    </div>
  );
}
