"use client";

import Link from "next/link";
import { CREATOR } from "../lib/catalog";
import { formatCompact, formatExact, timeAgo } from "../lib/format";
import { isDirectVideo } from "../lib/links";
import { asset } from "../lib/paths";
import { Icon, InstagramMark, PinterestMark, TikTokMark } from "./icons";
import { useEffect, useRef, useState } from "react";
import { ProfileEditor } from "./profile-editor";
import { useStudio } from "./studio";

function postedWhen(iso) {
  if (!iso) return "";
  const days = (Date.now() - new Date(iso).getTime()) / 86_400_000;
  if (days > 21) {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
  }
  return timeAgo(iso);
}

export function PlatformGlyph({ platform }) {
  if (platform === "tiktok") return <TikTokMark />;
  if (platform === "instagram") return <InstagramMark />;
  return <PinterestMark />;
}

export function CountLink({ href, platform, label, value, live, checkedAt, blocked }) {
  const { settings } = useStudio();
  const badge = live ? "Live" : blocked ? "Blocked" : "Checking";
  return (
    <a className="count-link" href={href} target="_blank" rel="noreferrer">
      <span className={`mark ${platform}`}>
        <PlatformGlyph platform={platform} />
      </span>
      <span>
        <strong>{formatCompact(value)}</strong>
        <em>
          {label}
          <i className={`mini-live ${live ? "" : "stale"}`}>{badge}</i>
        </em>
        {settings.exactCounts ? <small>{formatExact(value)} exact</small> : null}
        {platform === "instagram" ? (
          <small>{blocked ? "Instagram refused this refresh" : checkedAt ? `Checked ${timeAgo(checkedAt)}` : "Checks every minute"}</small>
        ) : null}
      </span>
    </a>
  );
}

const PROXIED_HOSTS = ["cdninstagram.com", "fbcdn.net", "pinimg.com", "tiktokcdn.com", "tiktokcdn-us.com"];

function canProxy(url) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return PROXIED_HOSTS.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
  } catch {
    return false;
  }
}

export function mediaSrc(item) {
  if (item?.imageUrl && process.env.NEXT_PUBLIC_STATIC !== "1" && canProxy(item.imageUrl)) {
    return asset(`/api/image?url=${encodeURIComponent(item.imageUrl)}`);
  }
  if (item?.imageUrl) return item.imageUrl;
  if (!item?.src) return "";
  if (item.src.startsWith("blob:") || item.src.startsWith("data:") || item.src.startsWith("http")) return item.src;
  return asset(item.src);
}

export function Frame({ src, alt }) {
  const imgRef = useRef(null);
  const [state, setState] = useState(src ? "loading" : "empty");

  useEffect(() => {
    if (!src) {
      setState("empty");
      return undefined;
    }
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setState("ready");
    else if (img?.complete && img.naturalWidth === 0) setState("error");
    else setState("loading");
    return undefined;
  }, [src]);

  return (
    <span className={`frame ${state}`}>
      {src ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt || ""}
          loading="eager"
          decoding="async"
          onLoad={() => setState("ready")}
          onError={() => setState("error")}
        />
      ) : null}
      {state === "error" || state === "empty" ? <span className="thumb-fallback">{alt || "Photo"}</span> : null}
    </span>
  );
}

export function ContentCard({ item, onRemove, onToggleDashboard, onEditText, onDashboard, delay = 0 }) {
  const scheduled = item.status === "scheduled";
  const src = mediaSrc(item);
  const platform = item.platform || item.platforms?.[0] || "pinterest";
  const sourceLabel = item.source === "studio" ? "Studio" : item.source === "tiktok" ? "TikTok" : item.source === "instagram" ? "Instagram" : "Pinterest";
  return (
    <article className="content-card" style={{ animationDelay: `${delay * 0.35}s` }}>
      <a className="thumb" href={item.externalUrl || src || undefined} target={item.externalUrl ? "_blank" : undefined} rel="noreferrer">
        {item.kind === "video" && isDirectVideo(item.src) ? (
          <video src={item.src} muted playsInline preload="metadata" />
        ) : src ? (
          <Frame src={src} alt={item.title} />
        ) : item.embedUrl ? (
          <iframe src={item.embedUrl} title={item.title || "Video"} />
        ) : (
          <span className="thumb-fallback">{item.title || "Video"}</span>
        )}
        <span className={`badge ${platform}`}>
          <PlatformGlyph platform={platform} />
          {sourceLabel}
        </span>
        {item.views != null ? <span className="stat-pip">{formatCompact(item.views)} views</span> : item.likes != null ? <span className="stat-pip">{formatCompact(item.likes)} likes</span> : null}
        {item.kind === "video" ? <span className="play-pip"><Icon name="play" size={14} /></span> : null}
      </a>
      <div className="card-copy">
        <h3>{item.title}</h3>
        <p>
        {scheduled
          ? `Scheduled ${timeAgo(item.scheduledFor)}`
          : item.source === "studio"
            ? timeAgo(item.createdAt)
            : item.takenAt
              ? postedWhen(item.takenAt)
              : item.source === "tiktok"
                ? "TikTok"
                : item.source === "instagram"
                  ? "Instagram"
                  : "Pinterest"}
      </p>
      </div>
      {onToggleDashboard || onEditText ? (
        <div className="card-actions">
          {onToggleDashboard ? (
            <button type="button" className={onDashboard ? "text-button danger" : "edit-pill"} onClick={() => onToggleDashboard(item)}>
              {onDashboard ? "Remove" : "Add to showcase"}
            </button>
          ) : null}
          {onEditText ? (
            <button type="button" className="edit-pill" onClick={() => onEditText(item)}>Edit text</button>
          ) : null}
        </div>
      ) : null}
      {onRemove && item.source === "studio" ? (
        <button className="text-button danger" type="button" onClick={() => onRemove(item.id)}>
          Remove
        </button>
      ) : null}
    </article>
  );
}

export function Filters({ value, onChange }) {
  const options = [
    ["all", "All"],
    ["tiktok", "TikTok"],
    ["instagram", "Instagram"],
    ["pinterest", "Pinterest"],
  ];
  return (
    <div className="filters" role="tablist" aria-label="Filter content">
      {options.map(([id, label]) => (
        <button key={id} type="button" role="tab" aria-selected={value === id} className={value === id ? "on" : ""} onClick={() => onChange(id)}>
          {label}
        </button>
      ))}
    </div>
  );
}

export function matchesFilter(item, filter) {
  if (filter === "all") return true;
  if (item.platform) return item.platform === filter;
  return item.platforms?.includes(filter);
}

export function Rail() {
  const { stats, profile, signedIn, setContactOpen } = useStudio();
  const [editing, setEditing] = useState(false);
  const points = profile?.aboutPoints || [];
  return (
    <aside className="rail">
      <section className="panel">
        <h2>Quick actions</h2>
        <div className="action-grid">
          {signedIn ? (
            <>
              <Link href="/create?kind=video"><Icon name="video" /><span>Upload video</span></Link>
              <Link href="/create?kind=photo"><Icon name="image" /><span>Upload photo</span></Link>
              <Link href="/create?schedule=1"><Icon name="calendar" /><span>Schedule post</span></Link>
            </>
          ) : (
            <button className="contact-launch" type="button" onClick={() => setContactOpen(true)}>
              <Icon name="mail" />
              <span>Contact</span>
            </button>
          )}
          <Link href="/analytics"><Icon name="chart" /><span>View analytics</span></Link>
        </div>
      </section>
      <section className="panel soft">
        <h2>Collaboration</h2>
        <p>Open for brand videos, product stories, and UGC. Send the brief straight to Isha.</p>
        <button className="contact-button wide" type="button" onClick={() => setContactOpen(true)}>Contact</button>
        <p className="fine">Notes go to {CREATOR.email}.</p>
      </section>
      <section className="panel">
        <header className="section-head">
          <h2>About me</h2>
          {signedIn ? (
            <button className="edit-pill" type="button" onClick={() => setEditing(true)}>Edit about</button>
          ) : null}
        </header>
        <ul className="about-list">
          {points.map((point) => <li key={point}>{point}</li>)}
        </ul>
        <p className="about-copy">{profile?.aboutText}</p>
        <ProfileEditor open={editing} onClose={() => setEditing(false)} />
      </section>
      <section className="panel">
        <h2>My platforms</h2>
        <div className="platform-row">
          <a href={CREATOR.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok"><TikTokMark /></a>
          <a href={CREATOR.instagram} target="_blank" rel="noreferrer" aria-label="Instagram"><InstagramMark /></a>
          <a href={CREATOR.pinterest} target="_blank" rel="noreferrer" aria-label="Pinterest"><PinterestMark /></a>
        </div>
        <p className="fine">
          TikTok {formatExact(stats?.tiktok?.followers)} · Instagram {formatExact(stats?.instagram?.followers)} · Pinterest {formatExact(stats?.pinterest?.followers)}
        </p>
      </section>
    </aside>
  );
}

export function downloadMediaKit(stats) {
  const lines = [
    "ISHA DHAKAL — CREATOR MEDIA KIT",
    "",
    "Content creator in Australia.",
    "Lifestyle, photo stories, and everyday moments.",
    "Open for collaborations, UGC, and product videos.",
    "",
    `Email: ${CREATOR.email}`,
    `Linktree: ${CREATOR.linktree}`,
    "",
    "LIVE PUBLIC COUNTS",
    `Fetched: ${stats?.fetchedAt || "unavailable"}`,
    `TikTok @_isha_dhakal_: ${formatExact(stats?.tiktok?.followers)} followers, ${formatExact(stats?.tiktok?.likes)} likes, ${formatExact(stats?.tiktok?.videos)} videos`,
    `Instagram @_isha_dhakal_: ${formatExact(stats?.instagram?.followers)} followers, ${formatExact(stats?.instagram?.posts)} posts`,
    `Pinterest ishaapins: ${formatExact(stats?.pinterest?.followers)} followers, ${formatExact(stats?.pinterest?.pins)} pins, ${formatExact(stats?.pinterest?.boards)} boards`,
    "",
    CREATOR.tiktok,
    CREATOR.instagram,
    CREATOR.pinterest,
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "isha-dhakal-media-kit.txt";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function Insight({ label, value, hint }) {
  return (
    <article className="insight">
      <span>{label}</span>
      <strong>{formatCompact(value)}</strong>
      <em>{hint || `${formatExact(value)} exact`}</em>
    </article>
  );
}
