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

1. **Create an `.env` file at the repository root** (see the sample below).  The file is ignored by Git.
   ```dotenv
   # Server configuration
   PORT=3000

   # Database connection (example)
   DATABASE_URL=postgresql://user:password@localhost:5432/expo

   # Encryption key – 32‑byte base64 string
   ENCRYPTION_KEY=YOUR_32_BYTE_BASE64_KEY

   # Vite client variables (must be prefixed with VITE_)
   VITE_API_URL=http://localhost:3000/api
   VITE_ENCRYPTION_KEY=YOUR_32_BYTE_BASE64_KEY
   ```
2. Install all workspace dependencies:
   ```bash
   pnpm install:all   # runs `pnpm install` in each workspace
   ```
3. **Database** – if you are using PostgreSQL locally, run migrations:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```
   (The backend already reads `DATABASE_URL` from the `.env` file.)

## Development

- **Backend**
  ```bash
  cd backend
  pnpm run dev   # starts NestJS with hot‑reload
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

All front‑ends automatically load any `VITE_` variables from the root `.env`.

## Build & Deploy

```bash
pnpm build:all   # builds backend (Nest) and both Vite front‑ends
pnpm deploy      # runs install → build → `vercel --prod`
```

The `deploy` script expects you to be logged in to Vercel (`vercel login`). It will upload the generated `dist/` (backend) and `frontend/*/dist/` directories.

## Encryption Utility (backend)

`backend/src/utils/crypto.ts` exposes two functions:
```ts
import { encrypt, decrypt } from './utils/crypto';

const secret = encrypt('my‑secret');
await prisma.secret.create({ data: { value: secret } });

const stored = await prisma.secret.findUnique({ where: { id: 1 } });
const plain = decrypt(stored!.value);
```
The helper reads the master key from `process.env.ENCRYPTION_KEY`.

## Internationalisation (public site)

The public UI uses **i18next** (`frontend/public/src/i18n.ts`). Translation JSON files live under `frontend/public/src/locales/{en,km,zh}`. All page components call `useTranslation()` and render `t('key')`.

## Contributing

1. Fork the repo
2. Create a feature branch
3. Run `pnpm install:all` and ensure `pnpm build:all` passes
4. Submit a PR

---

*Enjoy building with Expo!*
