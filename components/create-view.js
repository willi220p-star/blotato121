"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { publishPost } from "../lib/localStudio";
import { Rail } from "./pieces";
import { useStudio } from "./studio";

const PLATFORMS = [
  ["tiktok", "TikTok"],
  ["instagram", "Instagram"],
  ["pinterest", "Pinterest"],
];

export function CreateView() {
  const params = useSearchParams();
  const router = useRouter();
  const { refreshPosts, setNotice } = useStudio();
  const initialKind = params.get("kind") === "video" ? "video" : "photo";
  const [kind, setKind] = useState(initialKind);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [platforms, setPlatforms] = useState(["tiktok", "instagram"]);
  const [schedule, setSchedule] = useState("");
  const [showSchedule, setShowSchedule] = useState(params.get("schedule") === "1");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const accept = kind === "video" ? "video/mp4,video/quicktime,video/webm" : "image/jpeg,image/png,image/webp,image/gif";

  function takeFile(next) {
    if (!next) return;
    setFile(next);
    setPreview(URL.createObjectURL(next));
    if (!title) setTitle(next.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    setError("");
  }

  function togglePlatform(id) {
    setPlatforms((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    if (!file) {
      setError(kind === "video" ? "Choose a video to add." : "Choose a photo to add.");
      return;
    }
    setBusy(true);
    try {
      const post = await publishPost({
        file,
        title,
        caption,
        platforms,
        schedule: showSchedule ? schedule : "",
      });
      await refreshPosts();
      setNotice(post.status === "scheduled" ? "Scheduled on your content calendar." : "Published to your studio feed.");
      router.push(post.status === "scheduled" ? "/content" : "/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not publish");
    } finally {
      setBusy(false);
    }
  }

  const helper = useMemo(
    () => "This publishes inside your creator studio so you can see the post on the dashboard. It does not upload to TikTok, Instagram, or Pinterest.",
    []
  );

  return (
    <div className="workspace">
      <form className="main-col composer" onSubmit={onSubmit}>
        <header className="page-intro">
          <p className="eyebrow">Create</p>
          <h1>Put a video or photo on the studio</h1>
          <p>{helper}</p>
        </header>
        <div className="kind-switch" role="tablist" aria-label="Post type">
          <button type="button" className={kind === "photo" ? "on" : ""} onClick={() => { setKind("photo"); setFile(null); setPreview(""); }}>Photo</button>
          <button type="button" className={kind === "video" ? "on" : ""} onClick={() => { setKind("video"); setFile(null); setPreview(""); }}>Video</button>
        </div>
        <label className={`dropzone ${preview ? "has-file" : ""}`}>
          <input
            type="file"
            accept={accept}
            onChange={(event) => takeFile(event.target.files?.[0])}
          />
          {preview ? (
            kind === "video" ? <video src={preview} controls /> : <img src={preview} alt="Selected upload preview" />
          ) : (
            <span>
              <strong>Drop a {kind} here</strong>
              or click to browse. Up to 25 MB.
            </span>
          )}
        </label>
        <label className="field">
          <span>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A short title for the card" maxLength={80} />
        </label>
        <label className="field">
          <span>Caption</span>
          <textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="What is this post about?" rows={4} maxLength={500} required />
        </label>
        <fieldset className="field">
          <legend>Show it with</legend>
          <div className="checks">
            {PLATFORMS.map(([id, label]) => (
              <label key={id} className={platforms.includes(id) ? "check on" : "check"}>
                <input type="checkbox" checked={platforms.includes(id)} onChange={() => togglePlatform(id)} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <label className="check solo">
          <input type="checkbox" checked={showSchedule} onChange={(event) => setShowSchedule(event.target.checked)} />
          Schedule it for later
        </label>
        {showSchedule ? (
          <label className="field">
            <span>Publish time</span>
            <input type="datetime-local" value={schedule} onChange={(event) => setSchedule(event.target.value)} required />
          </label>
        ) : null}
        {error ? <p className="form-error" role="alert">{error}</p> : null}
        <div className="form-actions">
          <button className="primary" type="submit" disabled={busy}>{busy ? "Publishing…" : showSchedule ? "Schedule post" : "Publish to studio"}</button>
          <button className="ghost-button" type="button" onClick={() => router.push("/")}>Cancel</button>
        </div>
      </form>
      <Rail />
    </div>
  );
}
