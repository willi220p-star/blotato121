import { randomBytes, timingSafeEqual } from "crypto";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const passwordPath = path.join(dataDir, "studio-password.txt");
const sessionPath = path.join(dataDir, "sessions.json");
const COOKIE = "isha_studio";

export function cookieName() {
  return COOKIE;
}

async function passwordText() {
  if (process.env.STUDIO_PASSWORD) return process.env.STUDIO_PASSWORD;
  try {
    return (await readFile(passwordPath, "utf8")).trim();
  } catch {
    const generated = `isha-${randomBytes(4).toString("hex")}`;
    await mkdir(dataDir, { recursive: true });
    await writeFile(passwordPath, `${generated}\n`);
    return generated;
  }
}

export async function passwordMatches(input) {
  const expected = await passwordText();
  const left = Buffer.from(input || "");
  const right = Buffer.from(expected);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

export async function createSession() {
  const token = randomBytes(24).toString("hex");
  const sessions = await readSessions();
  sessions[token] = Date.now() + 1000 * 60 * 60 * 24 * 14;
  await writeSessions(sessions);
  return token;
}

export async function sessionIsValid(token) {
  if (!token) return false;
  const sessions = await readSessions();
  const expiry = sessions[token];
  if (!expiry || expiry < Date.now()) return false;
  return true;
}

export async function destroySession(token) {
  if (!token) return;
  const sessions = await readSessions();
  delete sessions[token];
  await writeSessions(sessions);
}

async function readSessions() {
  try {
    const parsed = JSON.parse(await readFile(sessionPath, "utf8"));
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeSessions(sessions) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(sessionPath, JSON.stringify(sessions));
}

export function sessionCookie(token) {
  return `${COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=1209600`;
}

export function clearCookie() {
  return `${COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}
