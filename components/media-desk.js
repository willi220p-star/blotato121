"use client";

import { useMemo, useState } from "react";
import { socialFeed } from "../lib/feed";
import { asset, placedSrc } from "../lib/paths";
import { mediaSrc } from "./pieces";
import { useStudio } from "./studio";

const GROUPS = [
  { key: "tiktok", label: "TikTok" },
  { key: "instagram", label: "Instagram" },
  { key: "pinterest", label: "Pinterest" },
];

function canonical(item) {
  return item?.imageUrl || item?.src || "";
}

export function MediaDesk() {
  const { stats, profile, saveProfile } = useStudio();
  const [filter, setFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const social = useMemo(() => socialFeed(stats), [stats]);
  const groups = GROUPS.map((group) => ({ ...group, items: social[group.key] || [] }));
  const catalog = groups.flatMap((group) => group.items);
  const byId = useMemo(() => new Map(catalog.map((item) => [String(item.id), item])), [catalog]);
  const selected = profile?.selectedIds || [];
  const visibleGroups = filter === "all" ? groups : groups.filter((group) => group.key === filter);

  async function commit(patch) {
    if (!profile) return;
    setBusy(true);
    setError("");
    try {
      await saveProfile(patch);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save that photo");
    } finally {
      setBusy(false);
    }
  }

  function toggle(item) {
    const id = String(item.id);
    const next = selected.includes(id)
      ? selected.filter((entry) => entry !== id)
      : [...selected, id].slice(0, 24);
    commit({ selectedIds: next });
  }

  function move(id, delta) {
    const ids = [...selected];
    const index = ids.indexOf(String(id));
    const target = index + delta;
    if (index < 0 || target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    commit({ selectedIds: ids });
  }

  const hero = placedSrc(profile?.heroImage) || asset("/media/avatar-tt.jpg");
  const avatar = placedSrc(profile?.avatarImage) || asset("/media/avatar-ig.jpg");

  return (
    <section className="panel media-desk">
      <header className="section-head">
        <div>
          <h2>Photos on the page</h2>
          <p>These are the latest public images from TikTok, Instagram, and Pinterest. Choose the banner, the profile photo, and which ones appear on the dashboard.</p>
        </div>
        {busy ? <span className="fine">Saving…</span> : null}
      </header>

      <div className="placement">
        <figure>
          <img src={hero} alt="Current banner" />
          <figcaption>Banner</figcaption>
          {profile?.heroImage ? (
            <button className="text-button" type="button" onClick={() => commit({ heroImage: "" })}>Use the default banner</button>
          ) : (
            <span className="fine">Default banner</span>
          )}
        </figure>
        <figure>
          <img className="placement-avatar" src={avatar} alt="Current profile photo" />
          <figcaption>Profile photo</figcaption>
          {profile?.avatarImage ? (
            <button className="text-button" type="button" onClick={() => commit({ avatarImage: "" })}>Use the default photo</button>
          ) : (
            <span className="fine">Default photo</span>
          )}
        </figure>
        <div className="chosen-strip">
          <p>{selected.length ? `${selected.length} on the dashboard` : "Dashboard shows the newest posts"}</p>
          {selected.length ? (
            <ol>
              {selected.map((id, index) => {
                const item = byId.get(String(id));
                return (
                  <li key={id}>
                    {item ? <img src={mediaSrc(item)} alt="" /> : <span className="missing-photo">Saved</span>}
                    <span className="chosen-tools">
                      <button type="button" disabled={index === 0} onClick={() => move(id, -1)}>Earlier</button>
                      <button type="button" disabled={index === selected.length - 1} onClick={() => move(id, 1)}>Later</button>
                      <button type="button" onClick={() => toggle({ id })}>Remove</button>
                    </span>
                  </li>
                );
              })}
            </ol>
          ) : (
            <p className="fine">Pick Dashboard on a photo to choose exactly what shows, and use the arrows to set the order.</p>
          )}
          {selected.length ? (
            <button className="text-button" type="button" onClick={() => commit({ selectedIds: [] })}>Show the newest posts instead</button>
          ) : null}
        </div>
      </div>

      <div className="media-filters" role="tablist" aria-label="Photo source">
        {[{ key: "all", label: "All" }, ...GROUPS].map((group) => (
          <button
            key={group.key}
            type="button"
            role="tab"
            aria-selected={filter === group.key}
            className={filter === group.key ? "on" : ""}
            onClick={() => setFilter(group.key)}
          >
            {group.label}
          </button>
        ))}
      </div>

      {visibleGroups.map((group) => (
        <div key={group.key} className="pick-group">
          <h3>{group.label}</h3>
          {group.items.length === 0 ? (
            <p className="fine">No {group.label} images in this refresh yet.</p>
          ) : (
            <div className="pick-grid">
              {group.items.map((item) => {
                const url = canonical(item);
                const onDash = selected.includes(String(item.id));
                const isHero = Boolean(url) && profile?.heroImage === url;
                const isAvatar = Boolean(url) && profile?.avatarImage === url;
                return (
                  <article key={item.id} className={onDash || isHero || isAvatar ? "picked" : ""}>
                    <img src={mediaSrc(item)} alt={item.title || group.label} />
                    <p>{item.title || group.label}</p>
                    <div className="pick-actions">
                      <button type="button" aria-pressed={isHero} disabled={!url} onClick={() => commit({ heroImage: url })}>Banner</button>
                      <button type="button" aria-pressed={isAvatar} disabled={!url} onClick={() => commit({ avatarImage: url })}>Profile</button>
                      <button type="button" aria-pressed={onDash} onClick={() => toggle(item)}>{onDash ? "On dashboard" : "Dashboard"}</button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      ))}
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </section>
  );
}
