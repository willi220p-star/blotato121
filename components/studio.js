"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { githubSessionOn, readGitHubProfile, writeGitHubProfile } from "../lib/githubAuth";
import { loadInquiries, loadPosts } from "../lib/localStudio";
import { asset } from "../lib/paths";

async function readJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  const type = response.headers.get("content-type") || "";
  if (!response.ok || !type.includes("application/json")) return null;
  return response.json();
}

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [statsStatus, setStatsStatus] = useState("loading");
  const [posts, setPosts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [notice, setNotice] = useState(null);
  const [settings, setSettings] = useState({ exactCounts: true, inboxAlerts: true });
  const [profile, setProfile] = useState(null);
  const [signedIn, setSignedIn] = useState(false);
  const profileRef = useRef(null);
  const saveChain = useRef(Promise.resolve());

  const refreshStats = useCallback(async (fresh = false) => {
    setStatsStatus((current) => (current === "ready" ? "refreshing" : "loading"));
    try {
      const live = await fetch(asset(`/api/stats${fresh ? "?fresh=1" : ""}`), { cache: "no-store" });
      if (!live.ok) throw new Error("Live stats request failed");
      setStats(await live.json());
      setStatsStatus("ready");
    } catch (error) {
      try {
        const fallback = await fetch(asset("/stats.json"), { cache: "no-store" });
        if (!fallback.ok) throw error;
        setStats(await fallback.json());
        setStatsStatus("ready");
      } catch {
        setStatsStatus("error");
        setNotice(error instanceof Error ? error.message : "Could not refresh counts");
      }
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const remote = (await readJson(asset("/api/profile"))) || (await readJson(asset("/profile.json")));
    const next = readGitHubProfile() || remote;
    profileRef.current = next;
    setProfile(next);
  }, []);

  const saveProfile = useCallback((next) => {
    const job = saveChain.current.then(async () => {
      const merged = { ...(profileRef.current || {}), ...next };
      profileRef.current = merged;
      setProfile(merged);
      const response = await fetch(asset("/api/profile"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(merged),
      });
      const type = response.headers.get("content-type") || "";
      if (response.ok && type.includes("application/json")) {
        const saved = await response.json();
        profileRef.current = saved;
        setProfile(saved);
        writeGitHubProfile(saved);
        setNotice("Profile saved.");
        return saved;
      }
      const saved = writeGitHubProfile(merged);
      profileRef.current = saved;
      setProfile(saved);
      setNotice("Saved in this browser.");
      return saved;
    });
    saveChain.current = job.catch(() => {});
    return job;
  }, []);

  const refreshPosts = useCallback(async () => {
    setPosts(await loadPosts());
  }, []);

  const refreshInquiries = useCallback(async () => {
    setInquiries(loadInquiries());
  }, []);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("isha-studio-settings") || "{}");
      if (stored && typeof stored === "object") setSettings((current) => ({ ...current, ...stored }));
    } catch {
      /* keep defaults */
    }
    refreshStats(false);
    refreshPosts();
    refreshInquiries();
    refreshProfile();
    const localSession = githubSessionOn();
    if (localSession) setSignedIn(true);
    readJson(asset("/api/session"))
      .then((data) => {
        if (data?.signedIn) setSignedIn(true);
        else if (!localSession) setSignedIn(false);
      })
      .catch(() => {});
    const timer = setInterval(() => refreshStats(false), 60_000);
    return () => clearInterval(timer);
  }, [refreshStats, refreshPosts, refreshInquiries, refreshProfile]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 4200);
    return () => clearTimeout(timer);
  }, [notice]);

  const value = useMemo(
    () => ({
      stats,
      statsStatus,
      posts,
      inquiries,
      notice,
      setNotice,
      settings,
      setSettings,
      profile,
      signedIn,
      setSignedIn,
      saveProfile,
      refreshProfile,
      refreshStats,
      refreshPosts,
      refreshInquiries,
    }),
    [stats, statsStatus, posts, inquiries, notice, settings, profile, signedIn, saveProfile, refreshProfile, refreshStats, refreshPosts, refreshInquiries]
  );

  return (
    <StudioContext.Provider value={value}>
      {children}
      {notice ? <div className="toast" role="status">{notice}</div> : null}
    </StudioContext.Provider>
  );
}

export function useStudio() {
  const context = useContext(StudioContext);
  if (!context) throw new Error("useStudio must be used inside StudioProvider");
  return context;
}
