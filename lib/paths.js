export function asset(path) {
  if (!path) return "";
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function placedSrc(url) {
  if (!url) return "";
  if (/^(blob:|data:)/.test(url)) return url;
  if (/^https?:/i.test(url)) {
    if (process.env.NEXT_PUBLIC_STATIC === "1") return url;
    return asset(`/api/image?url=${encodeURIComponent(url)}`);
  }
  return asset(url);
}
