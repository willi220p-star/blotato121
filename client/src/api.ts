export interface Post {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed with ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body?.error) message = body.error;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export async function fetchPosts(): Promise<Post[]> {
  const data = await handle<{ posts: Post[] }>(await fetch("/api/posts"));
  return data.posts;
}

export async function createPost(input: { text: string; author: string }): Promise<Post> {
  const data = await handle<{ post: Post }>(
    await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }),
  );
  return data.post;
}

export async function deletePost(id: string): Promise<void> {
  const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`Failed to delete post (${res.status})`);
  }
}
