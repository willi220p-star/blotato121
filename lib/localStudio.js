const POSTS_KEY = "isha-studio-posts";
const INQUIRIES_KEY = "isha-studio-inquiries";
const DB_NAME = "isha-studio";
const STORE = "files";

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) {
        request.result.createObjectStore(STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function txDone(tx) {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function putFile(id, blob) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(blob, id);
  await txDone(tx);
  db.close();
}

async function getFile(id) {
  const db = await openDb();
  const blob = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(id);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return blob;
}

async function deleteFile(id) {
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).delete(id);
  await txDone(tx);
  db.close();
}

function readPostsMeta() {
  try {
    const parsed = JSON.parse(localStorage.getItem(POSTS_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function loadPosts() {
  const posts = readPostsMeta();
  return Promise.all(
    posts.map(async (post) => {
      if (!post.fileId) return post;
      const blob = await getFile(post.fileId);
      if (!blob) return post;
      return { ...post, src: URL.createObjectURL(blob) };
    })
  );
}

export async function publishPost({ file, title, caption, platforms, schedule }) {
  const id = crypto.randomUUID();
  await putFile(id, file);
  const scheduledFor = schedule ? new Date(schedule).toISOString() : null;
  const scheduledInFuture = scheduledFor && new Date(scheduledFor).getTime() > Date.now();
  const post = {
    id,
    fileId: id,
    title: (title || caption).slice(0, 80),
    caption,
    platforms,
    kind: file.type.startsWith("video/") ? "video" : "photo",
    createdAt: new Date().toISOString(),
    scheduledFor: scheduledInFuture ? scheduledFor : null,
    status: scheduledInFuture ? "scheduled" : "published",
    source: "studio",
  };
  const posts = readPostsMeta();
  posts.unshift(post);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return { ...post, src: URL.createObjectURL(file) };
}

export async function publishLinkPost({ url, title, caption, platforms, kind, imageUrl, embedUrl, schedule }) {
  const id = crypto.randomUUID();
  const scheduledFor = schedule ? new Date(schedule).toISOString() : null;
  const scheduledInFuture = scheduledFor && new Date(scheduledFor).getTime() > Date.now();
  const post = {
    id,
    title: (title || caption || "Linked post").slice(0, 80),
    caption: caption || title || "",
    platforms,
    kind: kind === "video" ? "video" : "photo",
    externalUrl: url,
    imageUrl: imageUrl || "",
    embedUrl: embedUrl || "",
    src: imageUrl && kind !== "video" ? imageUrl : "",
    createdAt: new Date().toISOString(),
    scheduledFor: scheduledInFuture ? scheduledFor : null,
    status: scheduledInFuture ? "scheduled" : "published",
    source: "studio",
  };
  if (kind === "video" && /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url)) post.src = url;
  const posts = readPostsMeta();
  posts.unshift(post);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  return post;
}

export async function removePost(id) {
  const posts = readPostsMeta().filter((post) => post.id !== id);
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  await deleteFile(id);
}

export function loadInquiries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(INQUIRIES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveInquiry(inquiry) {
  const inquiries = loadInquiries();
  inquiries.unshift(inquiry);
  localStorage.setItem(INQUIRIES_KEY, JSON.stringify(inquiries));
  return inquiries;
}
