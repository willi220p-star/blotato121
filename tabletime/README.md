# TableTime

College timetable scheduler for IT service management. You enter professor availability, campus rooms, and class length. TableTime places the slots, flags overlaps, and offers the next free block you can confirm.

## How it works

1. **Slot setup** — set hours per class (for example 3 hours), campus open/close, and teaching days.
2. **Rooms** — add 10–15 rooms across blocks.
3. **Professors** — name, subject, how many classes they need, preferred rooms, and free windows (two days a week, three days, mornings only, and so on).
4. **Create timetable** — the scheduler walks each professor’s windows in order, prefers their rooms, and never double-books a person or a room.
5. **Overlaps and suggestions** — leftover classes get ranked alternative 3-hour (or whatever you set) slots. Confirm one and it is written onto the week grid.

Data stays in the browser (`localStorage`). Use Export / Import on the timetable page to move a file between machines.

## Run locally

```bash
cd tabletime
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

```bash
npm test
npm run build
```

## Deploy as a real working app

This is a static site. Any of these hosts work.

### Vercel (simplest)

1. Push this folder to GitHub (already in `tabletime/` on the repo).
2. Go to [vercel.com](https://vercel.com), import the GitHub repo.
3. Set **Root Directory** to `tabletime`.
4. Build command: `npm run build`. Output: `dist`.
5. Deploy. You get a public HTTPS URL.

Or from this folder after `npm i -g vercel`:

```bash
cd tabletime
npx vercel
```

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Base directory: `tabletime`

### GitHub Pages

```bash
cd tabletime
npm run build
```

Upload the `dist` folder, or use the GitHub Pages action with `tabletime` as the app root. If the site is not at the domain root, set Vite `base` in `vite.config.ts`.

No server or database is required. For a later shared campus install, keep this UI and put the same JSON behind a small API (Supabase, Firebase, or your college server).
