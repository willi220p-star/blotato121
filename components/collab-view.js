"use client";

import { useEffect, useState } from "react";
import { CREATOR } from "../lib/catalog";
import { formatWhen } from "../lib/format";
import { ContactForm } from "./contact-form";
import { ThankYouNote } from "./thank-you-note";
import { useStudio } from "./studio";

export function CollabView() {
  const { inquiries, stats } = useStudio();
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setSent(new URLSearchParams(window.location.search).get("sent") === "1");
  }, []);

  return (
    <div className="page collab-page">
      <header className="page-intro">
        <p className="eyebrow">Work together</p>
        <h1>Collaborations</h1>
        <p>
          Isha makes creator videos and everyday photo stories. Your note goes to{" "}
          <a href={`mailto:${CREATOR.email}`}>{CREATOR.email}</a>.
        </p>
      </header>
      {sent ? <ThankYouNote /> : null}
      <div className="split align-start">
        <section className="panel composer">
          <ContactForm heading />
        </section>
        <section className="panel">
          <h2>Inbox</h2>
          {inquiries.length === 0 ? <p className="about-copy">No collaboration notes yet. New ones land here and in Isha’s email.</p> : null}
          <ul className="inbox">
            {inquiries.map((item) => (
              <li key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.type}{item.brand ? ` · ${item.brand}` : ""}</span>
                </div>
                <p>{item.message}</p>
                <em>{formatWhen(item.createdAt)}{item.email ? ` · ${item.email}` : ""}</em>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="panel ways">
        <h2>What she makes</h2>
        <div className="ways-grid">
          <article>
            <h3>TikTok videos</h3>
            <p>
              {stats?.tiktok?.videos ? `${stats.tiktok.videos.toLocaleString()} public videos` : "Short videos"} and a little bit of everything, posted as @_isha_dhakal_.
            </p>
          </article>
          <article>
            <h3>Instagram</h3>
            <p>Everyday frames from her little corner of the internet, plus the same collaboration email in the bio.</p>
          </article>
          <article>
            <h3>Pinterest</h3>
            <p>Photo inspo, quotes, and saved ideas on ishaapins — useful when a collab needs a visual mood.</p>
          </article>
        </div>
      </section>
    </div>
  );
}
