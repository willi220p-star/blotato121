"use client";

import { useMemo, useState } from "react";
import { CREATOR } from "../lib/catalog";
import { socialFeed } from "../lib/feed";
import { formatCompact } from "../lib/format";
import { isDirectVideo } from "../lib/links";
import { asset } from "../lib/paths";
import { ProfileEditor } from "./profile-editor";
import { ContentCard, CountLink, downloadMediaKit, Filters, Frame, Insight, matchesFilter, mediaSrc, Rail } from "./pieces";
import { useStudio } from "./studio";

export function DashboardView() {
  const { stats, posts, profile, signedIn, saveProfile, setContactOpen } = useStudio();
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
  const showcase = curated.length ? curated : feed.slice(0, 8).map(present);
  const showcaseIds = new Set(showcase.map((item) => String(item.id)));
  const ribbon = showcase.length
    ? Array.from({ length: Math.max(2, Math.ceil(8 / showcase.length)) }, () => showcase).flat()
    : [];
  const heroImage = asset("/media/avatar-tt.jpg");
  const avatarImage = asset("/media/avatar-ig.jpg");
  const heading = filter === "tiktok" ? "TikTok videos" : filter === "instagram" ? "Instagram photos" : filter === "pinterest" ? "Pinterest photos" : "On the dashboard";

  async function toggleDashboard(item) {
    const id = String(item.id);
    const current = selected.map(String);
    const showing = current.length ? current : showcase.map((entry) => String(entry.id));
    const next = showing.includes(id) ? showing.filter((entry) => entry !== id) : [...showing.filter((entry) => entry !== id), id].slice(0, 24);
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
          <Frame src={heroImage} alt="Isha Dhakal" />
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
            <p className="now-chip"><span />In Australia right now</p>
            <p className="bio">{profile?.bio}</p>
            {signedIn ? (
              <button className="edit-pill" type="button" onClick={() => setEditing(true)}>Edit bio</button>
            ) : null}
          </div>
          <div className="counts">
            <CountLink href={CREATOR.tiktok} platform="tiktok" label="Followers" value={stats?.tiktok?.followers} live={stats?.tiktok?.live} />
            <CountLink href={CREATOR.instagram} platform="instagram" label="Followers" value={stats?.instagram?.followers} live={stats?.instagram?.live} checkedAt={stats?.instagram?.checkedAt} blocked={!stats?.instagram?.live} />
            <CountLink href={CREATOR.pinterest} platform="pinterest" label="Followers" value={stats?.pinterest?.followers} live={stats?.pinterest?.live} />
          </div>
          <div className="profile-actions">
            <button className="contact-button" type="button" onClick={() => setContactOpen(true)}>Contact</button>
            <button className="ghost-button" type="button" onClick={() => downloadMediaKit(stats)}>
              Download media kit
            </button>
          </div>
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

        <section className="panel showcase">
          <header className="section-head">
            <div>
              <h2>Showcase</h2>
              <p>{signedIn ? "This row moves right to left. Add a TikTok video, Instagram post, or Pinterest photo, or remove one from the row." : "A slow row of Isha’s videos and photos, moving right to left."}</p>
            </div>
            {signedIn ? <span className="fine">Signed in</span> : null}
          </header>
          {ribbon.length === 0 ? (
            <div className="empty">
              <p>New uploads and public posts will glide through here.</p>
            </div>
          ) : (
            <div className="drift">
              <div className="drift-track">
                {[...ribbon, ...ribbon].map((item, index) => {
                  const src = mediaSrc(item);
                  return (
                    <figure className="showcase-tile" key={`${item.id}-${index}`}>
                      {item.kind === "video" && isDirectVideo(item.src) ? (
                        <video src={item.src} muted playsInline preload="metadata" />
                      ) : src ? (
                        <Frame src={src} alt="" />
                      ) : (
                        <span className="thumb-fallback">{item.title}</span>
                      )}
                      {signedIn ? (
                        <button type="button" className="showcase-remove" onClick={() => toggleDashboard(item)}>Remove</button>
                      ) : null}
                    </figure>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="panel">
          <header className="section-head">
            <div>
              <h2>{heading}</h2>
              <p>
                {signedIn
                  ? filter === "all"
                    ? "Open TikTok, Instagram, or Pinterest and add the videos and photos you want in the showcase."
                    : "These are the public posts from this account, including new uploads. Add one to the showcase, remove it, or edit the text."
                  : "Look through TikTok, Instagram, and Pinterest. New public posts show up here."}
              </p>
            </div>
          </header>
          <Filters value={filter} onChange={setFilter} />
          {visible.length === 0 ? (
            <div className="empty">
              <p>Nothing on {filter} yet. New uploads appear here after the next refresh.</p>
            </div>
          ) : (
            <div className="card-grid">
              {visible.map((item, index) => (
                <ContentCard
                  key={item.id}
                  item={item}
                  delay={index}
                  onDashboard={showcaseIds.has(String(item.id))}
                  onToggleDashboard={signedIn ? toggleDashboard : undefined}
                  onEditText={signedIn ? openCaption : undefined}
                />
              ))}
            </div>
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

        {signedIn ? (
          <section className="panel ideas">
            <h2>Ideas you can put on this page</h2>
            <ul>
              <li>A weekly “day in Australia” clip, posted the same day each week so people know when to look.</li>
              <li>One pinned intro on TikTok: who you are, that you’re in Australia, and the email for brand work.</li>
              <li>Turn three Pinterest photos into a “save this look” set and add only those to the showcase.</li>
              <li>Reply to collaboration notes within a day. Brands remember the creator who answers.</li>
            </ul>
          </section>
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
                  <Frame src={mediaSrc(item)} alt="" />
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
