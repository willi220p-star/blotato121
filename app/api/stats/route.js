import { loadLiveStats } from "../../../lib/fetchStats";

export const dynamic = "force-dynamic";

let cache = { at: 0, data: null };
const TTL_MS = 45_000;

export async function GET(request) {
  const fresh = new URL(request.url).searchParams.get("fresh") === "1";
  const now = Date.now();
  if (!fresh && cache.data && now - cache.at < TTL_MS) {
    return Response.json({ ...cache.data, cached: true });
  }
  const data = await loadLiveStats();
  cache = { at: now, data };
  return Response.json({ ...data, cached: false });
}
