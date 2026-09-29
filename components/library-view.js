"use client";

import Link from "next/link";
import { PUBLIC_PINS } from "../lib/catalog";
import { mediaSrc } from "./pieces";
import { useStudio } from "./studio";

export function LibraryView() {
  const { posts, stats } = useStudio();
  const instagram = stats?.instagram?.recent || [];
  const photos = [
    ...posts.filter((post) => post.kind === "photo"),
    ...instagram.filter((item) => item.kind === "photo"),
    ...PUBLIC_PINS,
  ];
  const videos = posts.filter((post) => post.kind === "video");

  return (
    <div className="page">
      <header className="page-intro">
        <p className="eyebrow">Files</p>
        <h1>Media library</h1>
        <p>Photos already on the studio, public Pinterest frames, and any videos you upload.</p>
      </header>
      <section>
        <header className="section-head bare">
          <h2>Videos</h2>
          <Link href="/create?kind=video">Upload a video</Link>
        </header>
        {videos.length === 0 ? (
          <div className="empty panel">
            <p>No videos in the studio yet. TikTok keeps the live videos on her profile; add a cut here when you want it on the dashboard.</p>
            <Link href="/create?kind=video">Upload video</Link>
          </div>
        ) : (
          <div className="card-grid">
            {videos.map((item) => (
              <article key={item.id} className="content-card">
                <div className="thumb"><video src={item.src} controls preload="metadata" /></div>
                <div className="card-copy"><h3>{item.title}</h3><p>{item.caption}</p></div>
              </article>
            ))}
          </div>
        )}
      </section>
      <section>
        <header className="section-head bare">
          <h2>Photos</h2>
          <Link href="/create?kind=photo">Upload a photo</Link>
        </header>
        <div className="masonry">
          {photos.map((item) => (
            <a key={item.id} href={item.externalUrl || item.src} className="masonry-item" target={item.externalUrl ? "_blank" : undefined} rel="noreferrer">
              <img src={mediaSrc(item)} alt={item.title} />
              <span>{item.title}</span>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
