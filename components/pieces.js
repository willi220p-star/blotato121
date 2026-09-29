"use client";

import Link from "next/link";
import { CREATOR } from "../lib/catalog";
import { formatCompact, formatExact, timeAgo } from "../lib/format";

function postedWhen(iso) {
  if (!iso) return "";
  const days = (Date.now() - new Date(iso).getTime()) / 86_400_000;
  if (days > 21) {
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(iso));
  }
  return timeAgo(iso);
}
import { Icon, InstagramMark, PinterestMark, TikTokMark } from "./icons";
import { useStudio } from "./studio";

export function PlatformGlyph({ platform }) {
  if (platform === "tiktok") return <TikTokMark />;
  if (platform === "instagram") return <InstagramMark />;
  return <PinterestMark />;
}

export function CountLink({ href, platform, label, value, live }) {
  const { settings } = useStudio();
  return (
    <a className="count-link" href={href} target="_blank" rel="noreferrer">
      <span className={`mark ${platform}`}>
        <PlatformGlyph platform={platform} />
      </span>
      <span>
        <strong>{formatCompact(value)}</strong>
        <em>
          {label}
          {live ? <i className="mini-live">Live</i> : <i className="mini-live stale">Recent</i>}
        </em>
        {settings.exactCounts ? <small>{formatExact(value)} exact</small> : null}
      </span>
    </a>
  );
}

export function mediaSrc(item) {
  if (item?.src) return item.src;
  if (item?.imageUrl) return `/api/image?url=${encodeURIComponent(item.imageUrl)}`;
  return "";
}

export function ContentCard({ item, onRemove }) {
  const scheduled = item.status === "scheduled";
  const src = mediaSrc(item);
  const platform = item.platform || item.platforms?.[0] || "pinterest";
  const sourceLabel = item.source === "studio" ? "Studio" : item.source === "instagram" ? "Instagram" : "Pinterest";
  return (
    <article className="content-card">
      <a className="thumb" href={item.externalUrl || src} target={item.externalUrl ? "_blank" : undefined} rel="noreferrer">
        {item.kind === "video" && item.src ? (
          <video src={item.src} muted playsInline preload="metadata" />
        ) : (
          <img src={src} alt={item.title} />
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
              : item.source === "instagram"
                ? "Instagram"
                : "Public pin"}
      </p>
      </div>
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
  const { stats } = useStudio();
  return (
    <aside className="rail">
      <section className="panel">
        <h2>Quick actions</h2>
        <div className="action-grid">
          <Link href="/create?kind=video"><Icon name="video" /><span>Upload video</span></Link>
          <Link href="/create?kind=photo"><Icon name="image" /><span>Upload photo</span></Link>
          <Link href="/create?schedule=1"><Icon name="calendar" /><span>Schedule post</span></Link>
          <Link href="/analytics"><Icon name="chart" /><span>View analytics</span></Link>
        </div>
      </section>
      <section className="panel soft">
        <h2>Collaboration</h2>
        <p>Open for brand videos, product stories, and UGC. Send the brief straight to Isha.</p>
        <a className="mail-card" href={`mailto:${CREATOR.email}?subject=Collaboration%20with%20Isha%20Dhakal`}>
          <Icon name="mail" />
          <span>
            <strong>Contact me</strong>
            {CREATOR.email}
          </span>
        </a>
      </section>
      <section className="panel">
        <h2>About me</h2>
        <ul className="about-list">
          <li><Icon name="play" /> Content creator</li>
          <li><Icon name="heart" /> Lifestyle, photo stories, everyday moments</li>
          <li><Icon name="pin" /> {CREATOR.location} · {CREATOR.pronouns}</li>
          <li><Icon name="mail" /> Open for collaborations</li>
        </ul>
        <p className="about-copy">
          A little bit of everything, from a small corner of the internet. TikTok is where the videos live, Instagram keeps the everyday frames, and Pinterest holds the photo inspo.
        </p>
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
    "Content creator based in Nepal.",
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
