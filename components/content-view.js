"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { socialFeed } from "../lib/feed";
import { removePost } from "../lib/localStudio";
import { ContentCard, matchesFilter } from "./pieces";
import { useStudio } from "./studio";

export function ContentView() {
  const { posts, stats, refreshPosts, setNotice, signedIn } = useStudio();
  const [tab, setTab] = useState("all");

  const items = useMemo(() => {
    const social = socialFeed(stats);
    const studio = posts
      .filter((post) => post.status !== "scheduled")
      .map((post) => ({ ...post, platform: post.platforms[0] }));
    if (tab === "scheduled") return posts.filter((post) => post.status === "scheduled");
    if (tab === "instagram") return social.instagram;
    if (tab === "pins") return social.pinterest;
    if (tab === "tiktok") return [...social.tiktok, ...studio.filter((item) => matchesFilter(item, "tiktok"))];
    return [...studio, ...social.tiktok, ...social.instagram, ...social.pinterest];
  }, [posts, stats, tab]);

  const visible = items;

  async function remove(id) {
    await removePost(id);
    await refreshPosts();
    setNotice("Removed from the studio.");
  }

  return (
    <div className="page">
      <header className="page-intro">
        <p className="eyebrow">Library</p>
        <h1>My content</h1>
        <p>New TikTok videos, Instagram posts, and Pinterest pins show up here as they go live, next to anything you add in the studio.</p>
      </header>
      <div className="toolbar">
        <div className="filters" role="tablist" aria-label="Content views">
          {[
            ["all", "All"],
            ["tiktok", "TikTok"],
            ["instagram", "Instagram"],
            ["pins", "Pinterest"],
            ["scheduled", "Scheduled"],
          ].map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? "on" : ""} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>
        <Link className="primary slim" href="/create">New post</Link>
      </div>
      {visible.length === 0 ? (
        <div className="empty panel">
          <p>{tab === "scheduled" ? "Nothing is scheduled." : "No posts in this view."}</p>
          <Link href="/create">Create one</Link>
        </div>
      ) : (
        <div className="card-grid roomy">
          {visible.map((item) => <ContentCard key={item.id} item={item} onRemove={signedIn ? remove : undefined} />)}
        </div>
      )}
    </div>
  );
}
