import { cachedSnapshot, ensureScheduler, refreshSnapshot, snapshotAge } from "../../../lib/scheduler";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TTL_MS = 5 * 60 * 1000;

export async function GET(request) {
  ensureScheduler();
  const fresh = new URL(request.url).searchParams.get("fresh") === "1";
  if (!fresh && cachedSnapshot() && snapshotAge() < TTL_MS) {
    return Response.json({ ...cachedSnapshot(), cached: true });
  }
  const data = await refreshSnapshot();
  return Response.json({ ...data, cached: false });
}
