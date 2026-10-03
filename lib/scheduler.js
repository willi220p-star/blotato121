import { loadLiveStats } from "./fetchStats";

let timer = null;
let running = false;
let last = { at: 0, data: null };

export function cachedSnapshot() {
  return last.data;
}

export function snapshotAge() {
  return last.at ? Date.now() - last.at : Infinity;
}

export async function refreshSnapshot() {
  if (running && last.data) return last.data;
  running = true;
  try {
    const data = await loadLiveStats();
    last = { at: Date.now(), data };
    return data;
  } finally {
    running = false;
  }
}

export function ensureScheduler() {
  if (timer) return;
  timer = setInterval(() => {
    refreshSnapshot().catch(() => {});
  }, 5 * 60 * 1000);
  if (typeof timer.unref === "function") timer.unref();
}
