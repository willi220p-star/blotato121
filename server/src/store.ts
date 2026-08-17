import { randomUUID } from "node:crypto";

export interface Post {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export interface CreatePostInput {
  text: string;
  author?: string;
}

const posts: Post[] = [];

export function listPosts(): Post[] {
  return [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createPost(input: CreatePostInput): Post {
  const text = input.text.trim();
  if (!text) {
    throw new Error("Post text must not be empty");
  }

  const post: Post = {
    id: randomUUID(),
    text,
    author: (input.author ?? "anonymous").trim() || "anonymous",
    createdAt: new Date().toISOString(),
  };
  posts.push(post);
  return post;
}

export function deletePost(id: string): boolean {
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) {
    return false;
  }
  posts.splice(index, 1);
  return true;
}

export function seedPosts(): void {
  if (posts.length > 0) {
    return;
  }
  createPost({ text: "Welcome to blotato121 🎉", author: "system" });
  createPost({ text: "This full-stack starter is running end to end.", author: "system" });
}
