import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const TIKTOK_URL = "https://www.tiktok.com/@_isha_dhakal_";
const INSTAGRAM_URL = "https://www.instagram.com/_isha_dhakal_/";
const PINTEREST_URL = "https://www.pinterest.com/ishaapins/";

const BROWSER_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
const MOBILE_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";

export const FALLBACK_STATS = {
  fetchedAt: null,
  tiktok: {
    live: false,
    followers: 1809,
    following: 156,
    likes: 180420,
    videos: 597,
    nickname: "Isha",
    signature:
      "On your FYP sometimes ☺️👉👈\n🎥 A little bit of everything.\n\n📧  ishadhakal13@icloud.com",
    error: null,
  },
  instagram: {
    live: false,
    followers: 1642,
    following: 497,
    posts: 88,
    name: "Isha Dhakal",
    bio: "🇳🇵\nmy little corner of internet.\n📧: ishadhakal13@icloud.com\nHelp Nepal recover:",
    avatar: "",
    recent: [],
    error: null,
  },
  pinterest: {
    live: false,
    followers: 3,
    following: 22,
    pins: 37,
    boards: 10,
    name: "isapins",
    about:
      "Hii lovelies, I am isha a 20 y/o. I am new here to spend my free time doing some productive things, to learn new things and ofc to create new hobbies.",
    error: null,
  },
};

async function fetchText(url, headers) {
  const response = await fetch(url, {
    headers,
    redirect: "follow",
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.text();
}

export async function fetchTikTok() {
  const html = await fetchText(TIKTOK_URL, {
    "User-Agent": BROWSER_UA,
    "Accept-Language": "en-US,en;q=0.9",
  });
  const match = html.match(
    /<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__" type="application\/json">(.*?)<\/script>/
  );
  if (!match) throw new Error("TikTok profile data was not on the page");
  const data = JSON.parse(match[1]);
  const info = data?.__DEFAULT_SCOPE__?.["webapp.user-detail"]?.userInfo;
  const stats = info?.stats;
  if (!stats || typeof stats.followerCount !== "number") {
    throw new Error("TikTok follower count was missing");
  }
  const recent = await fetchTikTokVideos().catch(() => []);
  return {
    live: true,
    followers: stats.followerCount,
    following: stats.followingCount,
    likes: stats.heartCount,
    videos: stats.videoCount,
    nickname: info.user?.nickname || "Isha",
    signature: info.user?.signature || "",
    recent,
    error: null,
  };
}

async function fetchTikTokVideos() {
  const html = await fetchText("https://www.tiktok.com/embed/@_isha_dhakal_", {
    "User-Agent": BROWSER_UA,
    Accept: "text/html",
  });
  const ids = [];
  for (const match of html.matchAll(/\/video\/(\d+)/g)) {
    if (!ids.includes(match[1])) ids.push(match[1]);
    if (ids.length >= 8) break;
  }
  const videos = await Promise.all(
    ids.map(async (id) => {
      const response = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(`https://www.tiktok.com/@_isha_dhakal_/video/${id}`)}`,
        {
          headers: { "User-Agent": BROWSER_UA, Accept: "application/json" },
          signal: AbortSignal.timeout(12000),
          cache: "no-store",
        }
      );
      if (!response.ok) return null;
      const data = await response.json();
      const title = String(data.title || "TikTok video").replace(/\s+/g, " ").trim();
      return {
        id,
        title: title.slice(0, 80),
        caption: title,
        kind: "video",
        imageUrl: data.thumbnail_url || "",
        externalUrl: `https://www.tiktok.com/@_isha_dhakal_/video/${id}`,
        platform: "tiktok",
        source: "tiktok",
        takenAt: null,
      };
    })
  );
  return videos.filter(Boolean);
}

export async function fetchInstagram() {
  const response = await fetch(
    "https://i.instagram.com/api/v1/users/web_profile_info/?username=_isha_dhakal_",
    {
      headers: {
        "User-Agent": MOBILE_UA,
        "X-IG-App-ID": "936619743392459",
        Accept: "*/*",
        Referer: INSTAGRAM_URL,
      },
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    }
  );
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const payload = await response.json();
  const user = payload?.data?.user;
  const followers = user?.edge_followed_by?.count;
  if (typeof followers !== "number") throw new Error("Instagram follower count was missing");
  const edges = user.edge_owner_to_timeline_media?.edges || [];
  const recent = edges.slice(0, 8).map((edge) => {
    const node = edge?.node || {};
    const caption = node.edge_media_to_caption?.edges?.[0]?.node?.text || "";
    const firstLine = caption.split("\n").map((line) => line.trim()).find(Boolean) || "Instagram post";
    return {
      id: node.shortcode,
      title: firstLine.slice(0, 72),
      caption,
      kind: node.is_video ? "video" : "photo",
      likes: node.edge_liked_by?.count ?? null,
      comments: node.edge_media_to_comment?.count ?? null,
      views: node.is_video ? node.video_view_count ?? null : null,
      imageUrl: node.thumbnail_src || node.display_url || "",
      externalUrl: `https://www.instagram.com/p/${node.shortcode}/`,
      takenAt: node.taken_at_timestamp ? new Date(node.taken_at_timestamp * 1000).toISOString() : null,
      platform: "instagram",
      source: "instagram",
    };
  });
  return {
    live: true,
    followers,
    following: user.edge_follow?.count ?? 0,
    posts: user.edge_owner_to_timeline_media?.count ?? recent.length,
    name: user.full_name || "Isha Dhakal",
    bio: user.biography || "",
    avatar: user.profile_pic_url_hd || user.profile_pic_url || "",
    recent,
    error: null,
  };
}

export async function fetchPinterest() {
  const html = await fetchText(PINTEREST_URL, {
    "User-Agent": BROWSER_UA,
    "Accept-Language": "en-US,en;q=0.9",
  });
  const aboutIndex = html.indexOf('"about":"Hii lovelies');
  if (aboutIndex < 0) throw new Error("Pinterest profile was missing");
  const followers = closestCount(html, "follower_count", aboutIndex);
  const following = closestCount(html, "following_count", aboutIndex);
  const boards = closestCount(html, "board_count", aboutIndex);
  const pins = closestCount(html, "pin_count", aboutIndex);
  if (followers == null) throw new Error("Pinterest follower count was missing");
  const window = html.slice(aboutIndex, aboutIndex + 500);
  const about = window.match(/"about":"((?:\\.|[^"\\])*)"/)?.[1];
  const name = html.slice(Math.max(0, aboutIndex - 800), aboutIndex + 1200).match(/"full_name":"((?:\\.|[^"\\])*)"/)?.[1];
  return {
    live: true,
    followers,
    following: following ?? 0,
    pins: pins ?? 0,
    boards: boards ?? 0,
    name: name ? JSON.parse(`"${name}"`) : "isapins",
    about: about ? JSON.parse(`"${about}"`) : "",
    recent: extractPinterestPins(html),
    error: null,
  };
}

function extractPinterestPins(html) {
  const seen = new Set();
  const pins = [];
  const expression =
    /"736x":\{"width":\d+,"height":\d+,"url":"(https:\/\/i\.pinimg\.com\/736x\/[^"]+)"\}.*?"id":"(\d+)"/g;
  for (const match of html.matchAll(expression)) {
    const imageUrl = match[1];
    const id = match[2];
    if (seen.has(imageUrl)) continue;
    seen.add(imageUrl);
    pins.push({
      id,
      title: "Pinterest pin",
      caption: "From Isha’s public Pinterest",
      kind: "photo",
      imageUrl,
      externalUrl: `https://www.pinterest.com/pin/${id}/`,
      platform: "pinterest",
      source: "pinterest",
      takenAt: null,
    });
    if (pins.length >= 8) break;
  }
  return pins;
}

function closestCount(source, key, anchor) {
  const expression = new RegExp(`(?<![A-Za-z0-9_])"${key}":(\\d+)`, "g");
  let best = null;
  for (const match of source.matchAll(expression)) {
    const distance = Math.abs(match.index - anchor);
    if (!best || distance < best.distance) {
      best = { distance, value: Number(match[1]) };
    }
  }
  return best ? best.value : null;
}

const cachePath = path.join(process.cwd(), "data", "live-cache.json");

export async function loadLiveStats() {
  const cached = await readCache();
  const [tiktok, instagram, pinterest] = await Promise.all([
    settle(fetchTikTok, cached?.tiktok || FALLBACK_STATS.tiktok),
    settle(() => withRetry(fetchInstagram), cached?.instagram || FALLBACK_STATS.instagram),
    settle(fetchPinterest, cached?.pinterest || FALLBACK_STATS.pinterest),
  ]);
  const data = {
    fetchedAt: new Date().toISOString(),
    tiktok: prefer(tiktok, cached?.tiktok, FALLBACK_STATS.tiktok),
    instagram: prefer(instagram, cached?.instagram, FALLBACK_STATS.instagram),
    pinterest: prefer(pinterest, cached?.pinterest, FALLBACK_STATS.pinterest),
  };
  await writeCache({
    tiktok: data.tiktok.live ? data.tiktok : cached?.tiktok || data.tiktok,
    instagram: data.instagram.recent?.length ? (data.instagram.live ? data.instagram : cached?.instagram || data.instagram) : cached?.instagram || null,
    pinterest: data.pinterest.live ? data.pinterest : cached?.pinterest || data.pinterest,
  }).catch(() => {});
  return data;
}

function prefer(fresh, cached, fallback) {
  if (fresh?.live) return fresh;
  if (cached && (cached.recent?.length || typeof cached.followers === "number")) {
    return {
      ...cached,
      live: false,
      error: fresh?.error || "Showing the last successful refresh",
    };
  }
  return fresh || fallback;
}

async function withRetry(fn) {
  try {
    return await fn();
  } catch {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return fn();
  }
}

async function readCache() {
  try {
    return JSON.parse(await readFile(cachePath, "utf8"));
  } catch {
    return null;
  }
}

async function writeCache(data) {
  await mkdir(path.dirname(cachePath), { recursive: true });
  await writeFile(cachePath, JSON.stringify(data));
}

async function settle(fn, fallback) {
  try {
    return await fn();
  } catch (error) {
    return {
      ...fallback,
      live: false,
      error: error instanceof Error ? error.message : "Could not refresh",
    };
  }
}
