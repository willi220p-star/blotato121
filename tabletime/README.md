# TableTime

College timetable builder. Add professors, give each a class length, drop those slots on the week, and keep overlaps visible.

## How it works

1. **People** — professor name, department, subjects. No availability windows.
2. **Class slots** — pick the person, then a length (15 minutes through 10 hours, in 15-minute steps). Set day or date and from–to. The slot is saved under that name.
3. **Week** — drag a slot onto a day and hour. Two classes on the same hour sit side by side. The same professor twice, or two professors at once, both show as overlaps.
4. **Import** — CSV from Excel, Markdown tables, or JSON. Excel workbooks should be saved as CSV UTF-8 first.

Data stays in the browser (`localStorage`). Export JSON from the week page to move a file between machines.

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

## Deploy

This is a static Vite app. On Vercel, build from the repo root (`vercel.json` already points at `tabletime/`) or set Root Directory to `tabletime`.
