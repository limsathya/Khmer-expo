# Khmer EXPO 2026 — Official Management Platform

A high-performance, trilingual (Khmer, English, Chinese) Next.js application for showcasing and managing EXPO Week 2026. Built with direct **Supabase PostgreSQL** integration, responsive design for all screen sizes, a modern administrator control sidebar, invitation/verification code approval workflows, and interactive chronological event timelines.

---

## 🚀 Key Capabilities

### 1. 🏛️ Central Committee & 9 Specialized Subcommittees
* **Role-Based Governance**: Central Committee and Reception & Protocol hold universal authority, while domain officers manage scoped proposals.
* **Code-Based Member Registration**: Subcommittees invite and register members via generated verification codes verified and approved directly by the President in the dashboard (no external mail dependency).
* **Live Roster**: Transparent member counts and official leadership designations.

### 2. 🛡️ Modern Administrator Sidebar Dashboard (`/admin`)
* **Responsive Sidebar Rail**: Replaces horizontal tabs with an organized vertical sidebar (Operations, Personnel & Roster, System Settings). Collapsible to compact icon view on desktop, and available as an off-canvas drawer on mobile.
* **Operations**: Events & Proposals approval, Category classifications (add, edit, delete with fallback), and Timeline Day management.
* **Personnel & Roster**: Verification Codes & Approvals, Committee Members Roster, Committees Setup, and User Accounts.
* **System Settings**: Identity & Brand Logo customizer, Supabase PostgreSQL database live connection monitor.

### 3. 🌐 Trilingual Dynamic Content
* **Supported Languages**: Khmer (ភាសាខ្មែរ), English, and Chinese (中文).
* **Content Localization**: Expo title, categories, committee descriptions, and timeline days load directly from the database and translate seamlessly with clean single-language presentation.

### 4. 📅 Interactive Public Timeline (`/timeline`)
* Filterable by Expo days (Day 1, Day 2, Day 3) and dynamic category tags.
* Instant search and detailed popups with event information.

### 5. ⚡ Database-Driven (Supabase Direct Connection)
* Fully connected directly to Supabase PostgreSQL without seed data dependencies.
* All events, categories, users, invites, and settings persist securely in the cloud database.

---

## 🛠️ Environment Configuration

Copy `.env.example` to `.env` and set your direct Supabase connection string:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres
PORT=3000
```

> **Security Note:** `.env` is shielded by `.gitignore` and is never committed to GitHub.

---

## 💻 Local Development

```bash
# 1. Install dependencies
pnpm install

# 2. Run in development mode
pnpm dev

# 3. Build and run in production mode
pnpm build
pnpm start -p 3000
```

---

## 🚢 Official Hosting

### Option A: Vercel (Recommended)
1. Import `https://github.com/limsathya/Khmer-expo.git` in [Vercel](https://vercel.com/new).
2. Add your `DATABASE_URL` and `DIRECT_URL` environment variables in Vercel Project Settings.
3. Deploy! Next.js and [`vercel.json`](./vercel.json) handle the rest automatically.

### Option B: Docker Container
```bash
docker build -t khmer-expo .
docker run -p 3000:3000 -e DATABASE_URL="postgresql://..." khmer-expo
```

---

## 📜 Repository Information
* **GitHub Repository**: [https://github.com/limsathya/Khmer-expo.git](https://github.com/limsathya/Khmer-expo.git)
* **Branch**: `main`
* **Maintainer**: `limsathya`
