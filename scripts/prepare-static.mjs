import { copyFile, mkdir, writeFile } from "fs/promises";
import path from "path";
import { loadLiveStats } from "../lib/fetchStats.js";

const root = process.cwd();

async function saveImage(url, folder, filename) {
  const response = await fetch(url, {
    headers: {
      Referer: "https://www.instagram.com/",
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      Accept: "image/avif,image/webp,image/*,*/*",
    },
    signal: AbortSignal.timeout(20000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const dir = path.join(root, "public", "media", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), bytes);
}

async function keepLocal(posts, folder) {
  for (const post of posts || []) {
    if (!post.imageUrl || !post.id) continue;
    const filename = `${String(post.id).replace(/[^a-zA-Z0-9_-]/g, "")}.jpg`;
    try {
      await saveImage(post.imageUrl, folder, filename);
      post.src = `/media/${folder}/${filename}`;
      post.imageUrl = "";
    } catch (error) {
      console.warn("Kept remote image for", post.id, error.message);
    }
  }
}

const stats = await loadLiveStats();
await keepLocal(stats.instagram?.recent, "ig");
await keepLocal(stats.tiktok?.recent, "tiktok");
await keepLocal(stats.pinterest?.recent, "pins");

const statsPath = path.join(root, "public", "stats.json");
await writeFile(statsPath, JSON.stringify(stats));
await copyFile(path.join(root, "data", "profile.json"), path.join(root, "public", "profile.json")).catch(() => {});
console.log(
  "Wrote stats",
  stats.tiktok?.followers,
  stats.instagram?.followers,
  stats.pinterest?.followers,
  "photos",
  stats.tiktok?.recent?.length || 0,
  stats.instagram?.recent?.length || 0,
  stats.pinterest?.recent?.length || 0
);
