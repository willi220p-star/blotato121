# blotato121

A modern full-stack TypeScript starter used to bootstrap the Cloud Agent development environment.

- **Client** — [Vite](https://vite.dev) + [React](https://react.dev) + TypeScript (`client/`)
- **Server** — [Express](https://expressjs.com) + TypeScript API (`server/`)
- Managed as npm workspaces from the repository root.

## Prerequisites

- Node.js >= 20 (repo is validated on Node 22)
- npm >= 10

## Getting started

```bash
npm install      # install all workspace dependencies
npm run dev      # start API (:3001) and client (:5173) together
```

Then open http://localhost:5173. The client proxies `/api/*` to the API server.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Run the API and client dev servers concurrently |
| `npm run dev:server` | Run only the API server (`http://localhost:3001`) |
| `npm run dev:client` | Run only the client dev server (`http://localhost:5173`) |
| `npm run typecheck` | Type-check both workspaces |
| `npm run build` | Build both workspaces for production |
| `npm start` | Run the built API server |

## API

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/posts` | List posts |
| `POST` | `/api/posts` | Create a post (`{ "text": string, "author"?: string }`) |
| `DELETE` | `/api/posts/:id` | Delete a post |

Data is stored in memory and reseeded on server start; this is a starter, not a production datastore.

## Project layout

```
.
├── client/           # Vite + React + TS frontend
├── server/           # Express + TS API
├── package.json      # npm workspaces + root scripts
└── .cursor/          # Cloud Agent environment configuration
```
