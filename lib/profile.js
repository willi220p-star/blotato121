import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "profile.json");

export const DEFAULT_PROFILE = {
  tagline: "Content creator · Lifestyle · Nepal",
  heroNote: "A little bit\nof everything",
  location: "Nepal",
  pronouns: "she/her",
  bio: "Sharing bits of my life — everyday moments, photo stories, and a little bit of everything in between. Let’s make something together.",
  aboutPoints: [
    "Content creator",
    "Lifestyle, photo stories, everyday moments",
    "Nepal · she/her",
    "Open for collaborations",
  ],
  aboutText:
    "A little bit of everything, from a small corner of the internet. TikTok is where the videos live, Instagram keeps the everyday frames, and Pinterest holds the photo inspo.",
};

export async function readProfile() {
  try {
    const parsed = JSON.parse(await readFile(filePath, "utf8"));
    return sanitizeProfile(parsed);
  } catch {
    return DEFAULT_PROFILE;
  }
}

export async function writeProfile(input) {
  const profile = sanitizeProfile(input);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(profile, null, 2));
  return profile;
}

export function sanitizeProfile(input) {
  const source = input && typeof input === "object" ? input : {};
  const points = Array.isArray(source.aboutPoints)
    ? source.aboutPoints
    : String(source.aboutPoints || "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);
  return {
    tagline: clip(source.tagline, DEFAULT_PROFILE.tagline, 80),
    heroNote: clip(source.heroNote, DEFAULT_PROFILE.heroNote, 80),
    location: clip(source.location, DEFAULT_PROFILE.location, 40),
    pronouns: clip(source.pronouns, DEFAULT_PROFILE.pronouns, 24),
    bio: clip(source.bio, DEFAULT_PROFILE.bio, 400),
    aboutText: clip(source.aboutText, DEFAULT_PROFILE.aboutText, 500),
    aboutPoints: (points.length ? points : DEFAULT_PROFILE.aboutPoints).slice(0, 6).map((item) => clip(item, "", 80)),
    selectedIds: Array.isArray(source.selectedIds) ? source.selectedIds.map(String).filter(Boolean).slice(0, 24) : [],
    captions: sanitizeCaptions(source.captions),
  };
}

function sanitizeCaptions(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const captions = {};
  for (const [key, text] of Object.entries(value).slice(0, 40)) {
    const clean = clip(text, "", 180);
    const id = String(key).slice(0, 80);
    if (id && clean) captions[id] = clean;
  }
  return captions;
}

function clip(value, fallback, max) {
  const text = String(value ?? "").trim();
  if (!text) return fallback;
  return text.slice(0, max);
}
