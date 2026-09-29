"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { loadInquiries, loadPosts } from "../lib/localStudio";
import { asset } from "../lib/paths";

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [statsStatus, setStatsStatus] = useState("loading");
  const [posts, setPosts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [notice, setNotice] = useState(null);
  const [settings, setSettings] = useState({ exactCounts: true, inboxAlerts: true });
  const [profile, setProfile] = useState(null);

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
    const response = await fetch(asset("/api/profile"), { cache: "no-store" });
    if (!response.ok) return;
    setProfile(await response.json());
  }, []);

  const saveProfile = useCallback(async (next) => {
    const response = await fetch(asset("/api/profile"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    });
    if (!response.ok) throw new Error("Could not save the profile");
    const saved = await response.json();
    setProfile(saved);
    setNotice("Profile saved.");
    return saved;
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
    refreshStats(true);
    refreshPosts();
    refreshInquiries();
    refreshProfile();
    const timer = setInterval(() => refreshStats(true), 20_000);
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
      saveProfile,
      refreshStats,
      refreshPosts,
      refreshInquiries,
    }),
    [stats, statsStatus, posts, inquiries, notice, settings, profile, saveProfile, refreshStats, refreshPosts, refreshInquiries]
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
