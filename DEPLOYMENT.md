# Deployment

- **Frontend** (`frontend/`, React + Vite) → **Netlify**
- **Backend** (`backend/`, NestJS + Prisma) → **Railway**
- **Database** → Supabase Postgres (already provisioned)

Both connect to GitHub (`TechProoo/ultramodern`) and redeploy automatically on
push to `main`. Config lives in the repo (`frontend/netlify.toml`,
`backend/railway.json`), so the dashboards need almost no manual settings.

Deploy the **backend first** — you need its public URL for the frontend, and
the frontend URL for the backend's CORS. Order:

1. Backend → Railway (get its URL)
2. Frontend → Netlify (point `VITE_API_URL` at the Railway URL)
3. Back to Railway → set `CORS_ORIGIN` to the Netlify URL

---

## 1. Backend → Railway

1. [railway.com](https://railway.com) → **New Project** → **Deploy from GitHub
   repo** → pick `TechProoo/ultramodern`.
2. Open the service → **Settings** → **Source / Build**:
   - **⚠️ Root Directory**: `backend` — **this is required.** This is a monorepo;
     without it Railway builds from the repo root, finds no `package.json`, and
     fails with *"Railpack could not determine how to build the app."* Set it,
     then redeploy.
   - Once Root Directory is `backend`, Railway reads `backend/railway.json`
     (build `npm run build`, start `npm run start:migrate` → `prisma migrate
     deploy` then `node dist/main`). `prisma generate` runs automatically via
     the `postinstall` script.
3. **Variables** — add:
   | Key            | Value                                                                 |
   | -------------- | --------------------------------------------------------------------- |
   | `DATABASE_URL` | Supabase transaction pooler URL (`...pooler...:6543/postgres?pgbouncer=true`) |
   | `DIRECT_URL`   | Supabase session pooler URL (`...pooler...:5432/postgres`)             |
   | `CORS_ORIGIN`  | *(fill in after step 2 — the Netlify URL)*                            |

   Copy the two Supabase URLs from `backend/.env` (the real password, not the
   `.env.example` placeholder). `PORT` is injected by Railway automatically.
4. Under **Settings → Networking**, click **Generate Domain**. Note the URL,
   e.g. `https://ultramodern-production.up.railway.app`.
5. Confirm it's live: open `https://<your-railway-url>/equipment` — you should
   get the equipment JSON.

## 2. Frontend → Netlify

1. [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an
   existing project** → **GitHub** → pick `TechProoo/ultramodern`.
2. Build settings (mostly auto-filled from `frontend/netlify.toml`):
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist` (shown as `dist` relative to base)
3. **Environment variables** → add:
   | Key            | Value                                        |
   | -------------- | -------------------------------------------- |
   | `VITE_API_URL` | your Railway URL from step 1 (no trailing `/`) |
4. **Deploy site**. Note the URL, e.g. `https://amc-manager.netlify.app`.
   (Optionally rename it under **Site configuration → Change site name**.)

## 3. Wire CORS back up

1. In Railway → **Variables**, set `CORS_ORIGIN` to the Netlify URL from step 2
   (e.g. `https://amc-manager.netlify.app`, no trailing `/`). Railway redeploys.
2. Open the Netlify site, sign in with a demo account, and confirm data loads
   (equipment, tickets, etc.). If requests fail with a CORS error, re-check that
   `CORS_ORIGIN` exactly matches the site origin.

---

## Notes

- **Auto-deploy**: every push to `main` redeploys both. Netlify also builds
  deploy previews for PRs.
- **Migrations**: `start:migrate` runs `prisma migrate deploy` on every boot —
  idempotent, applies any new migrations committed under
  `backend/prisma/migrations`. It does **not** re-seed.
- **Seeding a fresh DB**: run `npx prisma db seed` from `backend/` against the
  target database (already done for the current Supabase instance).
- **Secrets**: `backend/.env` is git-ignored. Real credentials live only in the
  Railway dashboard. Consider rotating the Supabase DB password before going
  fully public (Supabase → Project Settings → Database), then update
  `DATABASE_URL`/`DIRECT_URL` in Railway and your local `.env`.

---

## Troubleshooting

**Railway: "Railpack could not determine how to build the app"** (and the log
lists `backend/` and `frontend/` at `./`) — the service is building from the
repo root. Set **Settings → Root Directory = `backend`** and redeploy. Railway
only reads `backend/railway.json` once the root directory points at `backend`.

**Railway: app boots then crashes, or `/equipment` errors** — the `DATABASE_URL`
and `DIRECT_URL` variables aren't set (or are wrong). Add them in **Variables**
from your local `backend/.env`, then redeploy. `start:migrate` needs
`DIRECT_URL` to reach the database.

**Frontend loads but no data / CORS errors in the browser console** — either
`VITE_API_URL` (Netlify) doesn't point at the Railway URL, or `CORS_ORIGIN`
(Railway) doesn't match the Netlify origin. Both must be set with **no trailing
slash**, and changing `VITE_API_URL` requires a fresh Netlify build to take
effect (env vars are baked in at build time for Vite).
