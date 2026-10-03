export function formatExact(value) {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return new Intl.NumberFormat("en-US").format(Number(value));
}

export function formatCompact(value) {
  const n = Number(value);
  if (value == null || Number.isNaN(n)) return "—";
  if (n >= 1_000_000) {
    const scaled = n / 1_000_000;
    return `${trim(scaled)}M`;
  }
  if (n >= 10_000) {
    const scaled = n / 1_000;
    return `${trim(scaled)}K`;
  }
  return formatExact(n);
}

function trim(n) {
  return n.toFixed(1).replace(/\.0$/, "");
}

export function timeAgo(iso) {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const seconds = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (seconds < 10) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function formatWhen(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
