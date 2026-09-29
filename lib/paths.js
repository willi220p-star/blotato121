export function asset(path) {
  if (!path) return "";
  if (/^(https?:|blob:|data:)/.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
