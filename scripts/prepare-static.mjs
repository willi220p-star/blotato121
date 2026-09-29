import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { loadLiveStats } from "../lib/fetchStats.js";

const root = process.cwd();
const mediaDir = path.join(root, "public", "media", "ig");

async function saveImage(url, filename) {
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
  await writeFile(path.join(mediaDir, filename), bytes);
}

const stats = await loadLiveStats();
await mkdir(mediaDir, { recursive: true });

for (const post of stats.instagram?.recent || []) {
  if (!post.imageUrl || !post.id) continue;
  const filename = `${post.id}.jpg`;
  try {
    await saveImage(post.imageUrl, filename);
    post.src = `/media/ig/${filename}`;
    post.imageUrl = "";
  } catch (error) {
    console.warn("Kept remote image for", post.id, error.message);
  }
}

const statsPath = path.join(root, "public", "stats.json");
await writeFile(statsPath, JSON.stringify(stats));
console.log(
  "Wrote stats",
  stats.tiktok?.followers,
  stats.instagram?.followers,
  stats.pinterest?.followers,
  "posts",
  stats.instagram?.recent?.length || 0
);
