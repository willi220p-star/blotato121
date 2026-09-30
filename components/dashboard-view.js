"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { CREATOR } from "../lib/catalog";
import { socialFeed } from "../lib/feed";
import { formatCompact } from "../lib/format";
import { asset } from "../lib/paths";
import { ProfileEditor } from "./profile-editor";
import { ContentCard, CountLink, downloadMediaKit, Filters, Insight, matchesFilter, mediaSrc, Rail } from "./pieces";
import { useStudio } from "./studio";

export function DashboardView() {
  const { stats, posts, profile, signedIn, saveProfile } = useStudio();
  const [filter, setFilter] = useState("all");
  const [monthCursor, setMonthCursor] = useState(() => new Date());
  const [editing, setEditing] = useState(false);
  const [captionItem, setCaptionItem] = useState(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const feed = useMemo(() => {
    const social = socialFeed(stats);
    const studio = posts
      .filter((post) => post.status !== "scheduled")
      .map((post) => ({ ...post, platform: post.platforms[0] }));
    return [...studio, ...social.tiktok, ...social.instagram, ...social.pinterest];
  }, [posts, stats]);

  const selected = profile?.selectedIds || [];
  const captions = profile?.captions || {};
  const present = (item) => {
    const custom = captions[String(item.id)];
    return custom ? { ...item, title: custom, originalTitle: item.title } : item;
  };
  const curated = selected
    .map((id) => feed.find((item) => String(item.id) === String(id)))
    .filter(Boolean)
    .map(present);
  const platformFeed = feed.filter((item) => matchesFilter(item, filter)).map(present);
  const visible = filter === "all" ? (curated.length ? curated : feed.slice(0, 8).map(present)) : platformFeed;
  const heroImage = asset("/media/avatar-tt.jpg");
  const avatarImage = asset("/media/avatar-ig.jpg");
  const heading = filter === "tiktok" ? "TikTok videos" : filter === "instagram" ? "Instagram photos" : filter === "pinterest" ? "Pinterest photos" : "On the dashboard";

  async function toggleDashboard(item) {
    const id = String(item.id);
    const has = selected.map(String).includes(id);
    const next = has ? selected.filter((entry) => String(entry) !== id) : [...selected, id].slice(0, 24);
    await saveProfile({ selectedIds: next });
  }

  function openCaption(item) {
    const raw = feed.find((entry) => String(entry.id) === String(item.id)) || item;
    setCaptionItem(raw);
    setDraft(captions[String(raw.id)] || raw.title || "");
  }

  async function saveCaption(event) {
    event.preventDefault();
    if (!captionItem) return;
    setSaving(true);
    try {
      const id = String(captionItem.id);
      const next = { ...captions };
      const text = draft.trim();
      if (!text || text === (captionItem.title || "")) delete next[id];
      else next[id] = text;
      await saveProfile({ captions: next });
      setCaptionItem(null);
    } finally {
      setSaving(false);
    }
  }
  const social = socialFeed(stats);
  const ranked = [...social.instagram, ...social.tiktok].sort(
    (a, b) => (b.views || b.likes || 0) - (a.views || a.likes || 0)
  );
  const spotlight = (ranked.length ? ranked : social.pinterest).slice(0, 3);

  return (
    <div className="workspace">
      <div className="main-col">
        <section className="hero">
          <img src={heroImage} alt="Isha Dhakal" />
          <div className="hero-copy">
            <p className="script-name">Isha Dhakal</p>
            <p className="hero-sub">{profile?.tagline || `Content creator · ${CREATOR.location}`}</p>
          </div>
          <p className="hero-note">{profile?.heroNote || "A little bit of everything"}</p>
        </section>

        <section className="profile-card">
          <img className="avatar" src={avatarImage} alt="" />
          <div className="profile-copy">
            <h1>Isha Dhakal <span aria-hidden="true">♡</span></h1>
            <p className="meta-line">Content creator · {profile?.pronouns || CREATOR.pronouns} · {profile?.location || CREATOR.location}</p>
            <p className="bio">{profile?.bio}</p>
            {signedIn ? (
              <button className="edit-pill" type="button" onClick={() => setEditing(true)}>Edit bio</button>
            ) : (
              <Link className="edit-pill" href="/admin">Edit bio</Link>
            )}
          </div>
          <div className="counts">
            <CountLink href={CREATOR.tiktok} platform="tiktok" label="Followers" value={stats?.tiktok?.followers} live={stats?.tiktok?.live} />
            <CountLink href={CREATOR.instagram} platform="instagram" label="Followers" value={stats?.instagram?.followers} live={stats?.instagram?.live} checkedAt={stats?.instagram?.checkedAt} blocked={!stats?.instagram?.live} />
            <CountLink href={CREATOR.pinterest} platform="pinterest" label="Followers" value={stats?.pinterest?.followers} live={stats?.pinterest?.live} />
          </div>
          <button className="ghost-button" type="button" onClick={() => downloadMediaKit(stats)}>
            Download media kit
          </button>
          <ProfileEditor open={editing} onClose={() => setEditing(false)} />
        </section>

        <section className="panel">
          <header className="section-head">
            <div>
              <h2>TikTok snapshot</h2>
              <p>Public totals for @_isha_dhakal_. These refresh from TikTok, not a made-up 28-day report.</p>
            </div>
            <a href={CREATOR.tiktok} target="_blank" rel="noreferrer">Open profile →</a>
          </header>
          <div className="insight-grid">
            <Insight label="Followers" value={stats?.tiktok?.followers} />
            <Insight label="Likes" value={stats?.tiktok?.likes} />
            <Insight label="Videos" value={stats?.tiktok?.videos} hint="Public videos" />
            <Insight label="Following" value={stats?.tiktok?.following} />
          </div>
          {stats?.tiktok?.error ? <p className="fine warn">TikTok didn’t refresh this time ({stats.tiktok.error}). Showing the last known totals.</p> : null}
        </section>

        <section className="panel">
          <header className="section-head">
            <div>
              <h2>{heading}</h2>
              <p>
                {filter === "all"
                  ? "New TikTok videos, Instagram posts, and Pinterest photos show up under each name. Add the ones that should stay here."
                  : "Everything public from this account is here, including new uploads. Add one to the dashboard, remove it, or edit the text."}
              </p>
            </div>
            {signedIn ? <span className="fine">Signed in</span> : <Link className="edit-pill" href="/admin">Sign in to choose</Link>}
          </header>
          <Filters value={filter} onChange={setFilter} />
          {visible.length === 0 ? (
            <div className="empty">
              <p>Nothing on {filter} yet. New uploads appear here after the next refresh.</p>
            </div>
          ) : (
            <>
              {filter === "all" && visible.length > 3 ? (
                <div className="drift" aria-hidden="true">
                  <div className="drift-track">
                    {[...visible, ...visible].map((item, index) => (
                      <img key={`${item.id}-${index}`} src={mediaSrc(item)} alt="" />
                    ))}
                  </div>
                </div>
              ) : null}
              <div className="card-grid">
                {visible.map((item, index) => (
                  <ContentCard
                    key={item.id}
                    item={item}
                    delay={index}
                    onDashboard={selected.includes(String(item.id))}
                    onToggleDashboard={signedIn ? toggleDashboard : undefined}
                    onEditText={signedIn ? openCaption : undefined}
                  />
                ))}
              </div>
            </>
          )}
        </section>
        {captionItem ? (
          <div className="modal-scrim" role="presentation" onClick={() => setCaptionItem(null)}>
            <form className="caption-editor" role="dialog" aria-modal="true" aria-labelledby="caption-title" onClick={(event) => event.stopPropagation()} onSubmit={saveCaption}>
              <p className="eyebrow">On the card</p>
              <h2 id="caption-title">Edit the text</h2>
              <label className="field">
                <span>What people read <em>{draft.length}/180</em></span>
                <textarea rows={4} maxLength={180} value={draft} autoFocus onChange={(event) => setDraft(event.target.value)} />
              </label>
              <div className="form-actions">
                <button className="ghost-button" type="button" onClick={() => setCaptionItem(null)}>Cancel</button>
                <button className="primary" type="submit" disabled={saving}>{saving ? "Saving…" : "Save text"}</button>
              </div>
            </form>
          </div>
        ) : null}

        <div className="split">
          <Calendar posts={posts} cursor={monthCursor} onCursor={setMonthCursor} />
          <section className="panel">
            <header className="section-head">
              <h2>{ranked.length ? "Top on Instagram" : "From Pinterest"}</h2>
              <a href={CREATOR.instagram} target="_blank" rel="noreferrer">Profile →</a>
            </header>
            <div className="spotlight">
              {spotlight.map((item) => (
                <a key={item.id} href={item.externalUrl || mediaSrc(item)} className="spot" target={item.externalUrl ? "_blank" : undefined} rel="noreferrer">
                  <img src={mediaSrc(item)} alt="" />
                  <span>
                    {item.views != null
                      ? `${formatCompact(item.views)} views`
                      : item.likes != null
                        ? `${formatCompact(item.likes)} likes`
                        : item.title}
                  </span>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
      <Rail />
    </div>
  );
}

function Calendar({ posts, cursor, onCursor }) {
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startPad = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(startPad).fill(null), ...Array.from({ length: days }, (_, index) => index + 1)];
  const today = new Date();
  const marks = new Set(
    posts.map((post) => {
      const source = post.scheduledFor || post.createdAt;
      const date = new Date(source);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    })
  );
  const label = cursor.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <section className="panel">
      <header className="section-head">
        <h2>Content calendar</h2>
        <div className="month-nav">
          <button type="button" aria-label="Previous month" onClick={() => onCursor(new Date(year, month - 1, 1))}>‹</button>
          <span>{label}</span>
          <button type="button" aria-label="Next month" onClick={() => onCursor(new Date(year, month + 1, 1))}>›</button>
        </div>
      </header>
      <div className="calendar">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => <span key={day} className="dow">{day}</span>)}
        {cells.map((day, index) => {
          if (!day) return <span key={`e-${index}`} />;
          const key = `${year}-${month}-${day}`;
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          return (
            <span key={key} className={`day ${isToday ? "today" : ""} ${marks.has(key) ? "marked" : ""}`}>
              {day}
            </span>
          );
        })}
      </div>
    </section>
  );
}
