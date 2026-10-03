"use client";

import { CREATOR } from "../lib/catalog";
import { formatCompact, formatExact } from "../lib/format";
import { Insight, mediaSrc, Rail } from "./pieces";
import { useStudio } from "./studio";

export function AnalyticsView() {
  const { stats, statsStatus, refreshStats } = useStudio();
  const rows = [
    { name: "TikTok", followers: stats?.tiktok?.followers || 0, live: stats?.tiktok?.live, href: CREATOR.tiktok },
    { name: "Instagram", followers: stats?.instagram?.followers || 0, live: stats?.instagram?.live, href: CREATOR.instagram },
    { name: "Pinterest", followers: stats?.pinterest?.followers || 0, live: stats?.pinterest?.live, href: CREATOR.pinterest },
  ];
  const max = Math.max(...rows.map((row) => row.followers), 1);

  return (
    <div className="workspace">
      <div className="main-col">
        <header className="page-intro">
          <p className="eyebrow">Analytics</p>
          <h1>What the public profiles show</h1>
          <p>
            Counts are read from Isha’s public TikTok, Instagram, and Pinterest pages, then refreshed while this studio is open.
            {statsStatus === "refreshing" ? " Refreshing now." : ""}
          </p>
          <button className="ghost-button" type="button" onClick={() => refreshStats(true)}>Refresh counts</button>
        </header>
        <section className="panel">
          <h2>Followers, side by side</h2>
          <div className="bars" role="img" aria-label="Follower comparison">
            {rows.map((row) => (
              <div key={row.name} className="bar-row">
                <div className="bar-label">
                  <a href={row.href} target="_blank" rel="noreferrer">{row.name}</a>
                  <span>{row.live ? "Live" : "Last known"}</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: `${Math.max(6, (row.followers / max) * 100)}%` }} />
                </div>
                <strong>{formatExact(row.followers)}</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <header className="section-head">
            <h2>TikTok</h2>
            <a href={CREATOR.tiktok} target="_blank" rel="noreferrer">@_isha_dhakal_</a>
          </header>
          <div className="insight-grid">
            <Insight label="Followers" value={stats?.tiktok?.followers} />
            <Insight label="Likes" value={stats?.tiktok?.likes} />
            <Insight label="Videos" value={stats?.tiktok?.videos} />
            <Insight label="Following" value={stats?.tiktok?.following} />
          </div>
        </section>
        <div className="split">
          <section className="panel">
            <header className="section-head">
              <h2>Instagram</h2>
              <a href={CREATOR.instagram} target="_blank" rel="noreferrer">Profile</a>
            </header>
            <div className="insight-grid two">
              <Insight label="Followers" value={stats?.instagram?.followers} />
              <Insight label="Following" value={stats?.instagram?.following} />
              <Insight label="Posts" value={stats?.instagram?.posts} />
            </div>
            {stats?.instagram?.bio ? <p className="about-copy preserve">{stats.instagram.bio}</p> : null}
            {(stats?.instagram?.recent || []).length > 0 ? (
              <ul className="inbox">
                {stats.instagram.recent.slice(0, 4).map((item) => (
                  <li key={item.id}>
                    <a className="mini-post" href={item.externalUrl} target="_blank" rel="noreferrer">
                      <img src={mediaSrc(item)} alt="" />
                      <span>
                        <strong>{item.title}</strong>
                        <em>
                          {item.views != null ? `${formatCompact(item.views)} views · ` : ""}
                          {formatCompact(item.likes)} likes · {formatExact(item.comments)} comments
                        </em>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
          <section className="panel">
            <header className="section-head">
              <h2>Pinterest</h2>
              <a href={CREATOR.pinterest} target="_blank" rel="noreferrer">ishaapins</a>
            </header>
            <div className="insight-grid two">
              <Insight label="Followers" value={stats?.pinterest?.followers} />
              <Insight label="Pins" value={stats?.pinterest?.pins} />
              <Insight label="Boards" value={stats?.pinterest?.boards} />
              <Insight label="Following" value={stats?.pinterest?.following} />
            </div>
          </section>
        </div>
      </div>
      <Rail />
    </div>
  );
}
