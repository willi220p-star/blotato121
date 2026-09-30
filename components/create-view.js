"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CREATOR } from "../lib/catalog";
import { enrichLink, parseMediaLink } from "../lib/links";
import { publishLinkPost, publishPost } from "../lib/localStudio";
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
  const { refreshPosts, setNotice, profile, saveProfile, signedIn } = useStudio();
  const initialKind = params.get("kind") === "video" ? "video" : "photo";
  const [kind, setKind] = useState(initialKind);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [platforms, setPlatforms] = useState(["tiktok", "instagram"]);
  const [schedule, setSchedule] = useState("");
  const [showSchedule, setShowSchedule] = useState(params.get("schedule") === "1");
  const [link, setLink] = useState("");
  const [linked, setLinked] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const parsed = parseMediaLink(link);
    if (!parsed || parsed.error) {
      setLinked(parsed);
      return undefined;
    }
    let cancel = false;
    setLinked(parsed);
    enrichLink(parsed).then((next) => {
      if (!cancel) setLinked(next);
    });
    return () => {
      cancel = true;
    };
  }, [link]);

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
    if (!file && !linked?.url) {
      setError(kind === "video" ? "Choose a video, or paste a video link." : "Choose a photo, or paste a photo link.");
      return;
    }
    if (!file && linked?.error) {
      setError(linked.error);
      return;
    }
    setBusy(true);
    try {
      const post = file
        ? await publishPost({
            file,
            title,
            caption,
            platforms,
            schedule: showSchedule ? schedule : "",
          })
        : await publishLinkPost({
            url: linked.url,
            title: title || caption || linked.title,
            caption: caption || title || linked.title,
            platforms,
            kind: linked.kind || kind,
            imageUrl: linked.imageUrl || "",
            embedUrl: linked.embedUrl || "",
            schedule: showSchedule ? schedule : "",
          });
      if (post.status !== "scheduled") {
        const ids = (profile?.selectedIds || []).map(String).filter((id) => id !== post.id);
        await saveProfile({ selectedIds: [...ids, post.id].slice(0, 24) });
      }
      await refreshPosts();
      setNotice(post.status === "scheduled" ? "Scheduled on your content calendar." : "It’s in the showcase.");
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

  if (!signedIn) {
    return (
      <div className="page narrow">
        <header className="page-intro">
          <p className="eyebrow">Studio</p>
          <h1>Isha updates this page</h1>
          <p>Visitors can look through the videos and photos and write to her. Adding, removing, and uploading stay with the studio password.</p>
        </header>
        <a className="primary" href={`mailto:${CREATOR.email}`}>Contact Isha</a>
      </div>
    );
  }

  return (
    <div className="workspace">
      <form className="main-col composer" onSubmit={onSubmit}>
        <header className="page-intro">
          <p className="eyebrow">Create</p>
          <h1>Put a video or photo on the studio</h1>
          <p>{helper} Paste a link and the preview appears here before you publish.</p>
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
          ) : linked?.embedUrl ? (
            <iframe src={linked.embedUrl} title="Link preview" />
          ) : linked?.src || linked?.imageUrl ? (
            linked.kind === "video" && linked.src ? <video src={linked.src} controls /> : <img src={linked.imageUrl || linked.src} alt="Link preview" />
          ) : (
            <span>
              <strong>Drop a {kind} here</strong>
              or click to browse. Up to 25 MB.
            </span>
          )}
        </label>
        <label className="field">
          <span>{kind === "video" ? "Or paste a video link" : "Or paste a photo link"}</span>
          <input
            value={link}
            onChange={(event) => {
              setLink(event.target.value);
              setFile(null);
              setPreview("");
            }}
            placeholder={kind === "video" ? "https://www.tiktok.com/… or a .mp4 link" : "https://… a photo or Pinterest link"}
            inputMode="url"
          />
        </label>
        {linked?.error ? <p className="form-error" role="alert">{linked.error}</p> : null}
        {(linked?.src || linked?.imageUrl || linked?.embedUrl) && !preview ? <p className="fine">Preview ready. Publish to put it in the showcase.</p> : null}
        <label className="field">
          <span>Title</span>
          <input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="A short title for the card" maxLength={80} />
        </label>
        <label className="field">
          <span>Caption</span>
          <textarea value={caption} onChange={(event) => setCaption(event.target.value)} placeholder="What is this post about?" rows={4} maxLength={500} />
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
