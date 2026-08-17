import express, { type Request, type Response } from "express";
import cors from "cors";
import { createPost, deletePost, listPosts, seedPosts } from "./store.js";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/posts", (_req: Request, res: Response) => {
  res.json({ posts: listPosts() });
});

app.post("/api/posts", (req: Request, res: Response) => {
  const { text, author } = req.body ?? {};
  if (typeof text !== "string") {
    res.status(400).json({ error: "`text` is required and must be a string" });
    return;
  }
  try {
    const post = createPost({ text, author });
    res.status(201).json({ post });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

app.delete("/api/posts/:id", (req: Request, res: Response) => {
  const removed = deletePost(req.params.id);
  if (!removed) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.status(204).end();
});

seedPosts();

app.listen(PORT, () => {
  console.log(`[server] API listening on http://localhost:${PORT}`);
});
