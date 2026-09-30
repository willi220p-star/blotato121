"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CREATOR, NAV } from "../lib/catalog";
import { asset } from "../lib/paths";
import { timeAgo } from "../lib/format";
import { Icon } from "./icons";
import { useStudio } from "./studio";

export function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { stats, inquiries, posts, statsStatus, refreshStats, settings, signedIn } = useStudio();
  const avatar = asset("/media/avatar-ig.jpg");
  const [bellOpen, setBellOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [meOpen, setMeOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
    setBellOpen(false);
    setMeOpen(false);
  }, [pathname]);

  const updated = stats?.fetchedAt ? timeAgo(stats.fetchedAt) : "waiting";
  const activity = [
    ...(settings.inboxAlerts ? inquiries.slice(0, 3).map((item) => ({
      id: item.id,
      text: `${item.name} sent a ${item.type.toLowerCase()} note`,
      when: timeAgo(item.createdAt),
    })) : []),
    ...posts.slice(0, 3).map((item) => ({
      id: item.id,
      text: item.status === "scheduled" ? `Scheduled “${item.title}”` : `Published “${item.title}”`,
      when: timeAgo(item.createdAt),
    })),
  ].slice(0, 5);

  return (
    <div className="app">
      <aside className={`sidebar ${navOpen ? "open" : ""}`}>
        <Link href="/" className="brand">
          <span className="brand-mark">Isha Dhakal</span>
          <span className="brand-kicker">Creator · Lifestyle · Everyday</span>
        </Link>
        <nav className="nav" aria-label="Studio">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={active ? "nav-link active" : "nav-link"} aria-current={active ? "page" : undefined}>
                <Icon name={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <svg className="mountains" viewBox="0 0 180 54" aria-hidden="true">
            <path d="M4 46 28 22l14 12 18-24 16 18 12-10 18 16 14-20 16 18 18-8 18 22" fill="none" stroke="#c9b7c6" strokeWidth="1.4" />
            <path d="M8 48c28-8 52-6 78-14 22-6 48-4 86 6" fill="none" stroke="#d9c6d4" strokeWidth="1.2" />
          </svg>
          <p className="hand-note">Good things<br />take time</p>
          <div className="me-chip">
            <img src={avatar} alt="" />
            <div>
              <strong>{CREATOR.name}</strong>
              <span>Creator</span>
            </div>
          </div>
        </div>
      </aside>
      {navOpen ? <button className="scrim" aria-label="Close menu" onClick={() => setNavOpen(false)} /> : null}
      <div className="stage">
        <header className="topbar">
          <button className="icon-button menu-button" type="button" aria-label="Open menu" onClick={() => setNavOpen(true)}>
            <Icon name="menu" />
          </button>
          <p className="live-line">
            <span className={`pulse ${statsStatus === "ready" ? "on" : ""}`} />
            {statsStatus === "refreshing" ? "Checking follower counts" : "Instagram checks every minute"} · {updated}
          </p>
          <div className="top-actions">
            <button className="icon-button" type="button" aria-label="Refresh live counts" onClick={() => refreshStats(true)}>
              <Icon name="refresh" />
            </button>
            <div className="bell-wrap">
              <button className="icon-button" type="button" aria-expanded={bellOpen} aria-label="Studio activity" onClick={() => setBellOpen((open) => !open)}>
                <Icon name="bell" />
                {activity.length > 0 ? <span className="dot" /> : null}
              </button>
              {bellOpen ? (
                <div className="popover" role="dialog" aria-label="Recent studio activity">
                  <strong>Studio activity</strong>
                  {activity.length === 0 ? <p>New posts and collaboration notes will show up here.</p> : null}
                  <ul>
                    {activity.map((item) => (
                      <li key={item.id}>
                        <span>{item.text}</span>
                        <em>{item.when}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            {signedIn ? (
              <button className="upload-button" type="button" onClick={() => router.push("/create")}>
                <Icon name="upload" size={16} />
                Upload
              </button>
            ) : null}
            <div className="me-wrap">
              <button className="avatar-button" type="button" aria-expanded={meOpen} aria-label="About Isha Dhakal" onClick={() => setMeOpen((open) => !open)}>
                <img className="top-avatar" src={avatar} alt="" />
              </button>
              {meOpen ? (
                <div className="popover me-card" role="dialog" aria-label="Isha Dhakal">
                  <img src={avatar} alt="Isha Dhakal" />
                  <strong>Isha Dhakal</strong>
                  <span>Content creator · in Australia right now</span>
                  <a href={`mailto:${CREATOR.email}`}>Contact {CREATOR.email}</a>
                  <Link href="/about">Read about her</Link>
                </div>
              ) : null}
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
