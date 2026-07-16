# AMC Manager — Ultramodern Engineering Ltd

A responsive frontend for **AMC Manager**, an Annual Maintenance Contract platform for
HVAC, plumbing, fire-safety and electrical equipment across corporate and real-estate
portfolios in Lagos. Built with React 19 + TypeScript + Vite, implementing the Claude
Design prototype `AMC Manager.dc.html`.

## Running

```bash
npm install      # dependencies are already vendored in node_modules
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # typecheck + production build to dist/
npm run preview  # preview the production build
```

## What's inside

The app is a complete frontend — every control is wired with client-side logic, and it's
ready for a backend to replace the mock layers. It ships **three separate platforms**, one
per role, each with its own chrome and identity. They do **not** share navigation and you
cannot hop between them in-session — the only way to change platform is to sign out and
sign back in under a different account. Which platform you land on is decided at sign-in by
your role:

- **Landing** — public marketing site: services, how AMC works, contact.
- **Admin Desktop** (navy top bar + blue console sidebar) — equipment register
  (search/filter), equipment detail with service history, an in-place **Log Maintenance
  Visit** modal, preventive-maintenance calendar & list views, fault tickets (with a create
  modal), spare-parts inventory, and an A4 service-report preview.
- **Technician Mobile** (dark field-app chrome, phone mockup) — QR scan, equipment record,
  a full visit-log form with an on-canvas signature, and a compiled service report.
- **Client Portal** (light portal with the client's own branding) — read-only equipment
  cards, upcoming maintenance, downloadable reports, and a "report a fault" modal.

Each platform is self-contained: its own header/chrome and its own Sign out. There is no
cross-platform navigation — e.g. the admin's "Log Maintenance Visit" is handled inside the
admin console rather than jumping into the technician app.

### Routing (React Router)

Each platform has a real URL: `/` (landing), `/login`, `/admin`, `/tech`, `/client`.
Routes are **role-guarded** in `src/App.tsx` from the persisted session:

- signed-out visitors to a platform route are sent to `/login`;
- signed-in users who hit a route for a different role are bounced to their own
  platform (`/${session.role}`) — so typing `/admin` as a client never crosses over;
- `/login` redirects already-authenticated users to their platform;
- unknown paths fall back to `/`.

Because the session is restored from `localStorage`, deep-linking or reloading a
platform URL lands you back on the right screen. In production the SPA fallback
(`public/_redirects` + `netlify.toml`) serves `index.html` for these paths so a hard
refresh doesn't 404.

The underlying data model still reflects one shared business (a single context store,
`src/store.tsx`, persisted to `localStorage`) — this is the shape a real backend database
would take, so tickets and visit logs created by one role would surface to the others once
a backend is in place. What's been removed is any **UI** path that connects the three.

## Backend integration

The frontend talks to the NestJS API in `../backend` (run it with `npm run start:dev`
there; it listens on `http://localhost:3000`). Override the base URL with
`VITE_API_URL` in a `.env` file if needed.

- **API client**: `src/api.ts` — typed fetch wrappers for every endpoint.
- **Auth** (`src/auth.ts`): the sign-in form POSTs to `/auth/login`; 401 shows an
  invalid-credentials error. The session is stored in `localStorage` and restored on
  reload; Sign out clears it. Demo accounts:
  - `admin@ultramoderneng.ng` / `admin123`
  - `tech@ultramoderneng.ng` / `tech123`
  - `client@zenithtowers.ng` / `client123`
- **Data** (`src/store.tsx`): equipment, parts, tickets and visit logs are fetched from
  the API on load; creates POST back to it. The store renders bundled seed data
  instantly and swaps in server data when the fetch lands.
- **Offline fallback**: if the API is unreachable, sign-in falls back to a local check
  of the same demo accounts and the app runs on seed data (a console warning notes that
  changes are local-only).
- **Fully wired interactions**: Add Equipment modal (generates the next `EQ-xxxx` id),
  sequential ticket ids (`TKT-1043`, `TKT-1044`, …), manual asset-code entry in the
  technician scanner (by id or serial), "Download PDF" prints just the report sheet via
  a print stylesheet, and "Email to Client" gives sent feedback.

## Layout

```text
src/
  App.tsx              role routing shell
  auth.ts              demo-account auth + session persistence
  store.tsx            shared cross-role state (context) + localStorage persistence
  data.ts              equipment, parts, tickets, reports (seed data)
  theme.ts             brand + status/priority color tokens
  reportValues.ts      service-report field builder
  useWindowWidth.ts    viewport hook for responsive layouts
  components/
    ui.tsx             shared primitives (logo, badge, placeholders)
    Landing.tsx  Login.tsx  AppChrome.tsx
    admin/AdminApp.tsx
    tech/TechApp.tsx
    client/ClientPortal.tsx
```

Responsiveness comes from `clamp()` typography, `auto-fit` grids, horizontally
scrollable tables, and a viewport breakpoint (`< 880px`) that collapses the admin sidebar
into a top bar. Hover states live in `src/index.css` as `.hv-*` utility classes since
inline styles can't express `:hover`.
