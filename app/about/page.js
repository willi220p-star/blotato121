"use client";

import { useState } from "react";
import { CREATOR } from "../../lib/catalog";
import { ProfileEditor } from "../../components/profile-editor";
import { useStudio } from "../../components/studio";

export default function AboutPage() {
  const { profile } = useStudio();
  const [open, setOpen] = useState(false);
  const points = profile?.aboutPoints || [];

  return (
    <div className="page narrow">
      <header className="page-intro">
        <p className="eyebrow">About</p>
        <h1>About Isha</h1>
        <p>{profile?.tagline}</p>
        <button className="ghost-button" type="button" onClick={() => setOpen(true)}>Edit about</button>
      </header>
      <section className="panel">
        <h2>Bio</h2>
        <p className="about-copy">{profile?.bio}</p>
      </section>
      <section className="panel">
        <h2>What she does</h2>
        <ul className="about-list">
          {points.map((point) => <li key={point}>{point}</li>)}
        </ul>
        <p className="about-copy">{profile?.aboutText}</p>
      </section>
      <section className="panel">
        <h2>Where to find her</h2>
        <p className="about-copy">{profile?.location} · {profile?.pronouns}</p>
        <p className="about-copy">
          TikTok, Instagram, and Pinterest stay linked to her public accounts. New posts and follower counts refresh on their own.
          Collaborations go to <a href={`mailto:${CREATOR.email}`}>{CREATOR.email}</a>.
        </p>
      </section>
      <ProfileEditor open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
