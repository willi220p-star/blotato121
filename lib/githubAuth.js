const SESSION_KEY = "isha-studio-github-session";
const PROFILE_KEY = "isha-studio-github-profile";
const PASSWORD_SHA256 = "e687b5bc9ba7d7653618903020e0aea3420bc4b6d2689ece3a47beab78d1d81a";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function githubSessionOn() {
  try {
    return localStorage.getItem(SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

export async function signInOnGitHub(password) {
  const hash = await sha256(String(password || "").trim());
  if (hash !== PASSWORD_SHA256) return false;
  localStorage.setItem(SESSION_KEY, "1");
  return true;
}

export function signOutOnGitHub() {
  localStorage.removeItem(SESSION_KEY);
}

export function readGitHubProfile() {
  try {
    const parsed = JSON.parse(localStorage.getItem(PROFILE_KEY) || "null");
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function writeGitHubProfile(profile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  return profile;
}
