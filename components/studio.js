"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const StudioContext = createContext(null);

export function StudioProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [statsStatus, setStatsStatus] = useState("loading");
  const [posts, setPosts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [notice, setNotice] = useState(null);
  const [settings, setSettings] = useState({ exactCounts: true, inboxAlerts: true });

  const refreshStats = useCallback(async (fresh = false) => {
    setStatsStatus((current) => (current === "ready" ? "refreshing" : "loading"));
    try {
      const response = await fetch(fresh ? "/api/stats?fresh=1" : "/api/stats", { cache: "no-store" });
      if (!response.ok) throw new Error("Stats request failed");
      const data = await response.json();
      setStats(data);
      setStatsStatus("ready");
    } catch (error) {
      setStatsStatus("error");
      setNotice(error instanceof Error ? error.message : "Could not refresh counts");
    }
  }, []);

  const refreshPosts = useCallback(async () => {
    const response = await fetch("/api/posts", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setPosts(data.posts || []);
  }, []);

  const refreshInquiries = useCallback(async () => {
    const response = await fetch("/api/inquiries", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    setInquiries(data.inquiries || []);
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
    const timer = setInterval(() => refreshStats(false), 60_000);
    return () => clearInterval(timer);
  }, [refreshStats, refreshPosts, refreshInquiries]);

  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(null), 4200);
    return () => clearInterval(timer);
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
      refreshStats,
      refreshPosts,
      refreshInquiries,
    }),
    [stats, statsStatus, posts, inquiries, notice, settings, refreshStats, refreshPosts, refreshInquiries]
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
