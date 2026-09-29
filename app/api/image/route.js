const ALLOWED_SUFFIXES = ["cdninstagram.com", "fbcdn.net", "pinimg.com", "tiktokcdn.com", "tiktokcdn-us.com"];

export const dynamic = "force-dynamic";

export async function GET(request) {
  const raw = new URL(request.url).searchParams.get("url") || "";
  let target;
  try {
    target = new URL(raw);
  } catch {
    return new Response("Bad image url", { status: 400 });
  }
  const host = target.hostname.toLowerCase();
  const allowed = ALLOWED_SUFFIXES.some((suffix) => host === suffix || host.endsWith(`.${suffix}`));
  if (target.protocol !== "https:" || !allowed) {
    return new Response("Image host is not allowed", { status: 400 });
  }

  const upstream = await fetch(target, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1",
      Referer: "https://www.instagram.com/",
      Accept: "image/avif,image/webp,image/*,*/*",
    },
    signal: AbortSignal.timeout(15000),
  });
  if (!upstream.ok) return new Response("Image unavailable", { status: 502 });
  const bytes = await upstream.arrayBuffer();
  return new Response(bytes, {
    headers: {
      "Content-Type": upstream.headers.get("content-type") || "image/jpeg",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
