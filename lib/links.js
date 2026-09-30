const VIDEO_HOSTS = ["tiktok.com", "youtube.com", "youtu.be", "instagram.com"];

export function isDirectVideo(url) {
  return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url || "");
}

export function isDirectImage(url) {
  return /\.(jpe?g|png|webp|gif|avif)(\?|#|$)/i.test(url || "");
}

function hostEnds(url, suffix) {
  return url.hostname === suffix || url.hostname.endsWith(`.${suffix}`);
}

function youtubeId(url) {
  if (hostEnds(url, "youtu.be")) return url.pathname.split("/").filter(Boolean)[0] || "";
  if (!hostEnds(url, "youtube.com")) return "";
  if (url.pathname.startsWith("/shorts/")) return url.pathname.split("/")[2] || "";
  if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] || "";
  return url.searchParams.get("v") || "";
}

function tiktokId(url) {
  const match = url.pathname.match(/\/video\/(\d+)/);
  return match ? match[1] : "";
}

function instagramCode(url) {
  const match = url.pathname.match(/\/(?:p|reel|tv)\/([^/]+)/);
  return match ? match[1] : "";
}

export function parseMediaLink(raw) {
  const text = String(raw || "").trim();
  if (!text) return null;
  let url;
  try {
    url = new URL(text);
  } catch {
    return { error: "Paste a full link, starting with https://." };
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") {
    return { error: "Use an http or https link." };
  }
  const href = url.toString();
  if (isDirectImage(href)) {
    return { url: href, kind: "photo", src: href, imageUrl: href, externalUrl: href, title: "Photo" };
  }
  if (isDirectVideo(href)) {
    return { url: href, kind: "video", src: href, externalUrl: href, title: "Video" };
  }
  const videoId = youtubeId(url);
  if (videoId) {
    return {
      url: href,
      kind: "video",
      externalUrl: href,
      imageUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      title: "YouTube video",
    };
  }
  const clipId = tiktokId(url);
  if (hostEnds(url, "tiktok.com")) {
    return {
      url: href,
      kind: "video",
      externalUrl: href,
      embedUrl: clipId ? `https://www.tiktok.com/embed/v2/${clipId}` : "",
      title: "TikTok video",
    };
  }
  const code = instagramCode(url);
  if (hostEnds(url, "instagram.com")) {
    return {
      url: href,
      kind: code && url.pathname.includes("/reel/") ? "video" : "photo",
      externalUrl: href,
      embedUrl: code ? `https://www.instagram.com/p/${code}/embed` : "",
      title: "Instagram post",
    };
  }
  if (hostEnds(url, "pinterest.com") || hostEnds(url, "pin.it")) {
    return { url: href, kind: "photo", externalUrl: href, title: "Pinterest photo" };
  }
  if (VIDEO_HOSTS.some((suffix) => hostEnds(url, suffix))) {
    return { url: href, kind: "video", externalUrl: href, title: "Video" };
  }
  return { url: href, kind: "photo", externalUrl: href, title: "Linked photo" };
}

export async function enrichLink(info) {
  if (!info || info.error || info.imageUrl || info.src || !info.url?.includes("tiktok.com")) return info;
  try {
    const response = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(info.url)}`);
    if (!response.ok) return info;
    const data = await response.json();
    return {
      ...info,
      imageUrl: data.thumbnail_url || "",
      title: data.title || info.title,
    };
  } catch {
    return info;
  }
}
