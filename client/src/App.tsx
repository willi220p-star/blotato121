import { useEffect, useState, type FormEvent } from "react";
import { createPost, deletePost, fetchPosts, type Post } from "./api";
import "./App.css";

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function refresh() {
    try {
      setError(null);
      setPosts(await fetchPosts());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      setError(null);
      await createPost({ text, author: author.trim() || "anonymous" });
      setText("");
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      setError(null);
      await deletePost(id);
      await refresh();
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>blotato121</h1>
        <p>A full-stack TypeScript starter — Express API + Vite/React client.</p>
      </header>

      <form className="composer" onSubmit={handleSubmit}>
        <input
          className="composer__author"
          type="text"
          placeholder="Your name"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          aria-label="Author"
        />
        <textarea
          className="composer__text"
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          aria-label="Post text"
          rows={3}
        />
        <button className="composer__submit" type="submit" disabled={submitting || !text.trim()}>
          {submitting ? "Posting…" : "Post"}
        </button>
      </form>

      {error && <div className="banner banner--error">{error}</div>}

      <section className="feed">
        {loading ? (
          <p className="feed__empty">Loading…</p>
        ) : posts.length === 0 ? (
          <p className="feed__empty">No posts yet. Be the first!</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="post">
              <div className="post__body">
                <p className="post__text">{post.text}</p>
                <p className="post__meta">
                  <span className="post__author">@{post.author}</span>
                  <span className="post__time">{new Date(post.createdAt).toLocaleString()}</span>
                </p>
              </div>
              <button
                className="post__delete"
                onClick={() => handleDelete(post.id)}
                aria-label="Delete post"
                title="Delete"
              >
                ×
              </button>
            </article>
          ))
        )}
      </section>
    </div>
  );
}
