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
| GET    | `/users`      | List accounts (never returns passwords)                                         |
| POST   | `/users`      | Create a `tech` or `client` account (unique email, password ≥ 6 chars)          |

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

## Accounts

There is no self-service signup. The admin signs in with the seeded bootstrap
account and creates Field Technician / Client users from the console's
*Users & Access* screen (`POST /users`). Seeded accounts:

- `admin@ultramoderneng.ng` / `admin123` — **bootstrap admin** (rotate this)
- `tech@ultramoderneng.ng` / `tech123` — sample technician
- `client@zenithtowers.ng` / `client123` — sample client

> **Prototype limitation:** passwords are stored in plaintext to keep the demo
> simple. Hash them (bcrypt/argon2) before any real production use.
