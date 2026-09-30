"use client";

import Link from "next/link";
import { socialFeed } from "../lib/feed";
import { ContentCard, Frame, mediaSrc } from "./pieces";
import { useStudio } from "./studio";

export function LibraryView() {
  const { posts, stats, signedIn } = useStudio();
  const social = socialFeed(stats);
  const photos = [
    ...posts.filter((post) => post.kind === "photo"),
    ...social.instagram.filter((item) => item.kind === "photo"),
    ...social.pinterest,
  ];
  const videos = [...social.tiktok, ...posts.filter((post) => post.kind === "video")];

  return (
    <div className="page">
      <header className="page-intro">
        <p className="eyebrow">Files</p>
        <h1>Media library</h1>
        <p>TikTok videos, Instagram photos, and Pinterest pins refresh from her public accounts.</p>
      </header>
      <section>
        <header className="section-head bare">
          <h2>Videos</h2>
          {signedIn ? <Link href="/create?kind=video">Upload a video</Link> : null}
        </header>
        {videos.length === 0 ? (
          <div className="empty panel">
            <p>TikTok videos will appear here as soon as the profile feed refreshes.</p>
            {signedIn ? <Link href="/create?kind=video">Upload video</Link> : null}
          </div>
        ) : (
          <div className="card-grid">
            {videos.map((item) => <ContentCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
      <section>
        <header className="section-head bare">
          <h2>Photos</h2>
          {signedIn ? <Link href="/create?kind=photo">Upload a photo</Link> : null}
        </header>
        <div className="masonry">
          {photos.map((item) => (
            <a key={item.id} href={item.externalUrl || item.src} className="masonry-item" target={item.externalUrl ? "_blank" : undefined} rel="noreferrer">
              <Frame src={mediaSrc(item)} alt={item.title} />
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
