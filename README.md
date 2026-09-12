# TableTime

College timetable scheduler. The working app is in [`tabletime/`](tabletime/).

## Deploy on Vercel

The GitHub repo is https://github.com/willi220p-star/blotato121

Vercel fails if it builds the `main` branch. That branch only has this README. TableTime lives on:

`cursor/tabletime-scheduler-005c`

### Fix in the Vercel dashboard

1. Open [vercel.com](https://vercel.com) and import this GitHub repo (or open the failed project).
2. **Settings → Git → Production Branch** → set to `cursor/tabletime-scheduler-005c` → Save.
3. Leave **Root Directory** as `.` (this repo now builds `tabletime/` automatically).  
   Or set Root Directory to `tabletime` if you prefer.
4. Framework: Vite. Build: `npm run build`. Output: `dist` (when Root Directory is `tabletime`) or `tabletime/dist` (when Root Directory is `.`).
5. **Deployments → Redeploy** the latest commit on that branch.

Do not use `main` until TableTime is merged there.
