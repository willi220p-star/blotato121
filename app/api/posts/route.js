import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";
import { readPosts, writePosts } from "../../../lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
  ["video/mp4", "mp4"],
  ["video/quicktime", "mov"],
  ["video/webm", "webm"],
]);

export async function GET() {
  const posts = await readPosts();
  return Response.json({ posts });
}

export async function POST(request) {
  const form = await request.formData();
  const file = form.get("file");
  const caption = String(form.get("caption") || "").trim();
  const title = String(form.get("title") || "").trim();
  const platforms = String(form.get("platforms") || "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => ["tiktok", "instagram", "pinterest"].includes(item));
  const schedule = String(form.get("schedule") || "").trim();

  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "Add a photo or video first." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "Files need to be 25 MB or smaller." }, { status: 400 });
  }
  const extension = ALLOWED.get(file.type);
  if (!extension) {
    return Response.json(
      { error: "Use a JPG, PNG, WEBP, GIF, MP4, MOV, or WEBM file." },
      { status: 400 }
    );
  }
  if (!caption) {
    return Response.json({ error: "Write a short caption." }, { status: 400 });
  }
  if (platforms.length === 0) {
    return Response.json({ error: "Choose at least one platform tag." }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const filename = `${id}.${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), bytes);

  const scheduledFor = schedule ? new Date(schedule).toISOString() : null;
  const scheduledInFuture = scheduledFor && new Date(scheduledFor).getTime() > Date.now();
  const post = {
    id,
    title: title || caption.slice(0, 48),
    caption,
    platforms,
    kind: file.type.startsWith("video/") ? "video" : "photo",
    src: `/uploads/${filename}`,
    createdAt: new Date().toISOString(),
    scheduledFor: scheduledInFuture ? scheduledFor : null,
    status: scheduledInFuture ? "scheduled" : "published",
    source: "studio",
  };

  const posts = await readPosts();
  posts.unshift(post);
  await writePosts(posts);
  return Response.json({ post });
}

export async function DELETE(request) {
  const { id } = await request.json();
  if (!id) return Response.json({ error: "Missing id" }, { status: 400 });
  const posts = await readPosts();
  const post = posts.find((item) => item.id === id);
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });
  const next = posts.filter((item) => item.id !== id);
  await writePosts(next);
  if (post.src?.startsWith("/uploads/")) {
    const filename = path.basename(post.src);
    await unlink(path.join(process.cwd(), "public", "uploads", filename)).catch(() => {});
  }
  return Response.json({ ok: true });
}
