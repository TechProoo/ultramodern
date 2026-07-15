# AMC Manager API — Ultramodern Engineering Ltd

NestJS backend for the AMC Manager frontend in `../frontend`.

## Running

```bash
npm install
cp .env.example .env          # fill in the Supabase database password
npx prisma migrate deploy     # apply migrations to the database
npx prisma db seed            # idempotent — inserts demo data if missing
npm run start:dev             # watch mode on http://localhost:3000
npm run build                 # compile to dist/
npm run start:prod            # run the compiled build
```

CORS is enabled for the Vite dev server (`http://localhost:5173`) and preview
(`http://localhost:4173`) in `src/main.ts`.

## Endpoints

| Method | Path          | Description                                                                     |
| ------ | ------------- | ------------------------------------------------------------------------------- |
| POST   | `/auth/login` | `{ email, password }` → session `{ email, name, role }`; 401 on bad credentials |
| GET    | `/equipment`  | All equipment under AMC                                                         |
| POST   | `/equipment`  | Create equipment (`name` required; id generated if absent/taken)                |
| GET    | `/parts`      | Spare-parts inventory                                                           |
| GET    | `/tickets`    | Fault tickets                                                                   |
| POST   | `/tickets`    | Create ticket (`eqId` must reference existing equipment)                        |
| GET    | `/logs`       | Maintenance visit logs (filter with `?eqId=EQ-0117`)                            |
| POST   | `/logs`       | Record a visit log (`eqId` must reference existing equipment)                   |

## Architecture

```text
prisma/
  schema.prisma         models: User, Equipment, Part, Ticket, FieldLog
  seed.ts               idempotent seed (equipment, parts, tickets, demo users)
  migrations/           SQL migration history
src/
  main.ts               bootstrap + CORS
  app.module.ts         wires the feature modules
  prisma/
    prisma.service.ts   PrismaClient wrapper (connects on module init)
  data/
    types.ts            domain types (mirror the frontend's)
    seed.ts             seed records shared with prisma/seed.ts
    data.service.ts     Prisma-backed system of record
    data.module.ts      global module exposing DataService
  auth/                 POST /auth/login
  equipment/            GET+POST /equipment
  parts/                GET /parts
  tickets/              GET+POST /tickets
  logs/                 GET+POST /logs
```

Storage is **Supabase Postgres** via Prisma. App queries go through the
transaction-mode pooler (`DATABASE_URL`, pgbouncer); migrations use the
session-mode pooler (`DIRECT_URL`). Credentials live in `.env` (gitignored) —
see `.env.example`. `DataService` remains the single storage seam; controllers
only talk to it.

Demo accounts (also listed on the frontend sign-in screen):

- `admin@ultramoderneng.ng` / `admin123`
- `tech@ultramoderneng.ng` / `tech123`
- `client@zenithtowers.ng` / `client123`
