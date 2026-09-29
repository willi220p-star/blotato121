import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

async function readList(name) {
  try {
    const raw = await readFile(path.join(dataDir, name), "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeList(name, list) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(path.join(dataDir, name), JSON.stringify(list, null, 2));
}

export function readPosts() {
  return readList("posts.json");
}

export function writePosts(posts) {
  return writeList("posts.json", posts);
}

export function readInquiries() {
  return readList("inquiries.json");
}

export function writeInquiries(inquiries) {
  return writeList("inquiries.json", inquiries);
}
