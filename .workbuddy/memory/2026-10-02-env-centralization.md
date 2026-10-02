# 2026-10-02 — Single root .env

## Summary
User said "only 1 .env required". Removed the per-workspace `.env` / `.env.example` files in `backend/nest/`, `frontend/public/`, and `frontend/admin/`. Everything now reads from the single repo-root `.env`.

## Wiring
- **Backend NestJS** — `app.module.ts`: `ConfigModule.forRoot({ envFilePath: '../../.env', validate: validateEnv })`.
- **Public Vite** — `frontend/public/vite.config.ts`: added `envDir: path.resolve(__dirname, '../..')`.
- **Admin Vite** — `frontend/admin/vite.config.ts`: same.
- **seedAdmin.js** — `dotenv.config({ path: path.resolve(__dirname, '..', '.env') })`.

## Files
- `.env` (committed? no, gitignored) + `.env.example` (committed) at repo root.
- Deleted: `backend/nest/.env`, `backend/nest/.env.example`, `frontend/public/.env`, `frontend/public/.env.example`, `frontend/admin/.env`, `frontend/admin/.env.example`.

## Verified
- Backend `PORT=3333 node dist/main.js` boots and reads from root `.env` ✓
- Backend fail-fast still works (`PORT=3333 JWT_SECRET=""` → "Environment validation failed") ✓
- Both frontends `vite build` succeed; public bundle contains `info@expo.com` and `+855 23 000 000` baked in from root `.env` ✓
- Both frontends `vite dev` boot on :5173 / :5174 ✓