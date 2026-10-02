# Expo Management System

## Overview

This repository is a **monorepo** (pnpm workspace) that contains a full‑stack application for managing an event/expo:

| Workspace | Technology |
|-----------|------------|
| `backend` | NestJS (TypeScript), Prisma, JWT auth |
| `frontend/public` | Vite + React, **i18next** (English, Khmer, Chinese) |
| `frontend/admin`  | Vite + React, Tailwind CSS |

The project uses **dotenv** for environment configuration and provides a tiny **AES‑256 encryption helper** (`backend/src/utils/crypto.ts`) for protecting sensitive data.

## Prerequisites

- **Node.js** >= 18
- **pnpm** (recommended) – install with `npm i -g pnpm`
- **Docker** (optional, for running PostgreSQL locally)
- **Vercel CLI** (`npm i -g vercel`) – for deployment

## Setup

1. **Copy the single `.env` file** at the repo root (git-ignored; `.env.example` is the template):
   ```bash
   cp .env.example .env
   ```
   All packages — backend, public frontend, admin frontend — read from this one file. The backend (`@nestjs/config`) is pointed at it via `envFilePath: '../../.env'` in `app.module.ts`; each Vite app uses `envDir: '../..'` in `vite.config.ts` so its `import.meta.env.VITE_*` lookups resolve here too. The backend refuses to boot if `PORT`, `DATABASE_URL`, `JWT_SECRET`, or `ENCRYPTION_KEY` is missing — see `backend/nest/src/config/env.config.ts`.

   Only variables prefixed with `VITE_` are exposed to client code; everything else stays server-side.
2. Install all workspace dependencies:
   ```bash
   pnpm install:all
   ```
3. **Database** – if you are using PostgreSQL locally, run migrations:
   ```bash
   cd backend/nest
   npx prisma migrate dev --name init
   ```
   `DATABASE_URL` is read by Prisma from the root `.env`.

## Development

- **Backend**
  ```bash
  cd backend/nest
  pnpm run start:dev   # NestJS with hot-reload on http://localhost:3000
  ```
- **Public site**
  ```bash
  cd frontend/public
  pnpm run dev   # Vite dev server at http://localhost:5173
  ```
- **Admin dashboard**
  ```bash
  cd frontend/admin
  pnpm run dev   # Vite dev server at http://localhost:5174
  ```

Each Vite app reads only the **repo-root** `.env` (configured via
`envDir: '../..'`). Use `import.meta.env.VITE_*` to read env values in
client code; non-`VITE_*` keys are invisible to the bundle.

## Build & Deploy

```bash
pnpm build:all   # builds backend (Nest) and both Vite front‑ends
pnpm deploy      # runs install → build → `vercel --prod`
```

The `deploy` script expects you to be logged in to Vercel (`vercel login`). It will upload the generated `dist/` (backend) and `frontend/*/dist/` directories.

## Encryption Utility (backend)

`backend/nest/src/utils/crypto.ts` exposes two functions:
```ts
import { encrypt, decrypt } from './utils/crypto';

const secret = encrypt('my-secret');
await prisma.secret.create({ data: { value: secret } });

const stored = await prisma.secret.findUnique({ where: { id: 1 } });
const plain = decrypt(stored!.value);
```
The helper reads the master key from `process.env.ENCRYPTION_KEY`
(populated by `backend/nest/.env`).

## Seeding the first admin user

```bash
node scripts/seedAdmin.js
```
The script reads `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, and
`BCRYPT_ROUNDS` from the repo-root `.env` (or the shell). It refuses to
run if either seed credential is missing.

## Internationalisation (public site)

The public UI uses **i18next** (`frontend/public/src/i18n.ts`). Translation JSON files live under `frontend/public/src/locales/{en,km,zh}`. All page components call `useTranslation()` and render `t('key')`.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Run `pnpm install:all` and ensure `pnpm build:all` passes
4. Submit a PR

---

*Enjoy building with Expo!*
