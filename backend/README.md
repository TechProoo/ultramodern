# AMC Manager API — Ultramodern Engineering Ltd

NestJS backend for the AMC Manager frontend in `../frontend`.

## Running

```bash
npm install
npm run start:dev   # watch mode on http://localhost:3000
npm run build       # compile to dist/
npm run start:prod  # run the compiled build
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
src/
  main.ts               bootstrap + CORS
  app.module.ts         wires the feature modules
  data/
    types.ts            domain types (mirror the frontend's)
    seed.ts             seed records (equipment, parts, tickets, demo users)
    data.service.ts     in-memory system of record — the seam to replace with a DB
    data.module.ts      global module exposing DataService
  auth/                 POST /auth/login
  equipment/            GET+POST /equipment
  parts/                GET /parts
  tickets/              GET+POST /tickets
  logs/                 GET+POST /logs
```

Storage is **in-memory**: data resets on every restart (including watch-mode
reloads). `DataService` is the single seam to swap for a real database
(Prisma/TypeORM) — controllers only talk to it.

Demo accounts (also listed on the frontend sign-in screen):

- `admin@ultramoderneng.ng` / `admin123`
- `tech@ultramoderneng.ng` / `tech123`
- `client@zenithtowers.ng` / `client123`
