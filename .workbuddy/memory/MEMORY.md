# Project long-term notes — Expo Management System

> pnpm monorepo: `backend/nest/` + `frontend/public/` + `frontend/admin/`. Stack: NestJS 10 (Prisma, JWT) + Vite/React 18 + Tailwind v3 + Radix UI + i18next.

## Architecture
- **Public site** (`frontend/public`, port 5173): navbar-only layout (left Sidebar removed). Pages: Home, About, Program, Contact, FAQ, Login, Account, Register with EN/KM/ZH i18n.
  - `/register` is **event-registration with mode toggle**: pill toggle "Individual / Company" at top of dialog. Individual mode collects 6 fields (First/Last name, Gender, Contact, Email, Quantity); Company mode collects all 10 (adds Company, Logo, Position, Product type). Validation skips company-specific fields in individual mode. Deep-link `?event=<id>` auto-opens the modal. Storage: `expo.eventRegistrations` with shape `{ id: "EVT-{base36}", eventId, eventName, mode, firstName, lastName, gender, email, contact, company, position, product, quantity, submittedAt, status: "Pending" }`.
  - Member login is **client-side mock** via React Context + `localStorage["expo.member"]` (see `src/auth/AuthContext.tsx`). Logged-in members see an "Admin dashboard" entry in the navbar dropdown AND a prominent gradient button on `/account`, both open `VITE_ADMIN_URL` (default `http://localhost:5174`) in a new tab.
- **Admin** (`frontend/admin`, port 5174): keeps its own left Sidebar (Dashboard / Registrations). Pages use mock data persisted to `expo.admin.registrations` + `expo.sentEmails` localStorage keys.
  - `/registrations` has rich table with `Mode` badge (individual/company), Attendee, Email, Event, Status, Submitted, Actions. Approve → auto-sends an approval email; Reject → auto-sends a rejection email. Both emails are stored in `expo.sentEmails` and shown in a collapsible "Sent Emails" panel with expand-to-read + "Re-send" action.
- **Backend** (`backend/nest`, port 3000): skeleton NestJS app. Only `User` model in Prisma; `Registration`, `CMS`, `Users` controllers return string placeholders. `JwtStrategy` defined but no `@UseGuards` applied.
- Real backend wiring is **TODO** — see `prisma/schema.prisma` TODO block.
- Public and admin have separate `localStorage` namespaces (different dev origins). Data does NOT sync between them.

## Per-language fonts
- Public (`frontend/public/src/index.css`) has `html[lang="en|km|zh"] body { font-family: ... }` rules:
  - `en` → `"Times New Roman"`
  - `km` → `"KhmerOS Siemreap"`
  - `zh` → `fangsong`
- Admin (`frontend/admin/src/index.css`) sets `body { font-family: "Times New Roman" }` since admin is English-only.
- Public `frontend/public/src/i18n.ts` syncs `document.documentElement.lang` on every language change via `syncHtmlLang` + `i18n.on('languageChanged')`. Unknown languages coerce to `en`.
- `index.html` defaults to `lang="en"`.
- Caveat: KhmerOS Siemreap has no Latin glyphs; Latin strings embedded in Khmer-mode UI (emails, IDs) fall back to the browser default.

## Theme system (dark/light)
- Both frontends have `darkMode: ["class"]` enabled in `tailwind.config.js` and a full set of semantic Tailwind tokens (`background`, `foreground`, `card`, `border`, `input`, `ring`, `primary`, `secondary`, `destructive`, `muted`, `accent`) wired to `hsl(var(--…))` CSS variables.
- The `.dark` CSS variable block is defined in both `frontend/public/src/index.css` and `frontend/admin/src/index.css` with inverted HSL values. Add new tokens here in BOTH files when extending.
- `src/theme/ThemeContext.tsx` exists in both frontends. Public stores to `expo.theme`, admin stores to `expo.admin.theme`. Respects `prefers-color-scheme` on first visit. Toggle button lives in **public Navbar** (sun/moon icon between language switcher and login) and **admin Sidebar** (bottom-left strip).
- App root containers (`App.tsx`) use `bg-background text-foreground` semantic tokens; components mostly use raw `bg-white dark:bg-slate-900` / `text-slate-900 dark:text-slate-100` / etc. Add `dark:` variants when introducing new surfaces.
- Pattern when bulk-applying: do NOT re-run the same sed transformation on the same file — second pass creates stacked duplicates. Run once, then a cleanup pass with explicit patterns.

## i18n
- Locales: `frontend/public/src/locales/{en,km,zh}/translation.json` (no top-level `translation.json`).
- `i18n.ts` initializes with `interpolation: { escapeValue: false }` — use `{{name}}` interpolation, not `${name}`.
- Validation errors should be returned by passing `t` into the validator: `validate(t, form)`. Then per-field error strings live under `register.err.*` in the locale files.
- Modal/card text patterns: prefer `t(key, { eventName })` for interpolated success messages.
- Mode toggles: prefer `register.modeIndividual` / `register.modeCompany` for the public Register pill toggle.

## Build / dev conventions
- Always `postcss.config.js` must exist with `tailwindcss` + `autoprefixer` plugins — otherwise Vite emits ~780 byte CSS and the UI is unstyled. (Was missing in both frontends, fixed 2026-10-02.)
- `lucide-react` pinned at `^1.49.0` (works but unusual).
- Both frontends share identical Tailwind theme tokens in `index.css :root`.
- Path alias `@/*` → `./src/*` in both frontends.

## Environment variables — single root `.env`
ONE `.env` at the repo root is read by all three packages:
- Backend: `ConfigModule.forRoot({ envFilePath: '../../.env' })` in `app.module.ts`.
- Frontends: `envDir: path.resolve(__dirname, '../..')` in each `vite.config.ts`.
- `scripts/seedAdmin.js` auto-loads `path.resolve(__dirname, '..', '.env')` via optional dotenv.
- Validated at boot by `backend/nest/src/config/env.config.ts`. Required: `PORT`, `DATABASE_URL`, `JWT_SECRET`, `ENCRYPTION_KEY`. Optional: `NODE_ENV`, `JWT_EXPIRES_IN`, `CORS_ORIGIN`, `REDIS_URL`, `AUTH_ALLOW_DEV_LOGIN`, `DEV_ADMIN_USERNAME`, `DEV_ADMIN_PASSWORD`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `BCRYPT_ROUNDS`.
- Frontend `VITE_*` keys: `VITE_API_URL` (default `http://localhost:3000/api`), `VITE_ENCRYPTION_KEY`, `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE`, `VITE_CONTACT_ADDRESS`, `VITE_SESSION_TIMEOUT_SECONDS=3600`, `VITE_ADMIN_URL=http://localhost:5174` (target for the "Admin dashboard" button on `/account` and the navbar dropdown).

## Hardcoded secrets / risky defaults (do not ship as-is)
- `JWT_SECRET` in `.env` is a placeholder; replace before production.
- `CORS_ORIGIN=*` in dev — replace with concrete origin(s) for production.
- `AuthService.validateUser` accepts plaintext credentials from `DEV_ADMIN_USERNAME` / `DEV_ADMIN_PASSWORD`, but ONLY when `AUTH_ALLOW_DEV_LOGIN=true` AND `NODE_ENV !== "production"`. Otherwise throws UnauthorizedException.
- `scripts/seedAdmin.js` reads `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `BCRYPT_ROUNDS` from env (or root `.env` if dotenv is installed). Uses bcryptjs.

## Critical files to revisit
- `backend/nest/src/{auth,cms,registration,users}/` — all placeholder.
- `prisma/schema.prisma` — only `User`; needs Registration/Content/Media/AuditLog.
- `scripts/seedAdmin.js` — needs DATABASE_URL connectivity.
- `backend/nest/src/main.ts` — uses CORS_ORIGIN from env (no `*` fallback any more).
- `frontend/public/src/pages/Contact.tsx` — reads VITE_CONTACT_EMAIL / VITE_CONTACT_PHONE / VITE_CONTACT_ADDRESS from env.
- `frontend/admin/src/pages/Registrations.tsx` — admin's mock data lives in `expo.admin.registrations` + `expo.sentEmails`. When the backend goes live, swap these `useState` initializers for API calls.
- `frontend/public/src/pages/Register.tsx` — public submissions land in `expo.eventRegistrations`. Public (5173) and admin (5174) have separate localStorage; until backend wiring, no cross-app sync.