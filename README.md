# EXPO Week 2026 — Interactive Timeline, Admin Data Manager, Auth & Supabase

A complete, self-contained Next.js application for showcasing and managing an Expo / Innovation Fair. Features Supabase Direct PostgreSQL database connection, `.env` configuration, role-based authentication, dark/light theme switching, public event timeline, and complete administrator data management (Create, Edit, Approve, Reject, Delete, Reset).

Everything is located in this single folder (`c:\code\expo-week`).

---

## ⚡ Supabase Direct Connection & `.env` Setup

The database layer connects directly to your **Supabase PostgreSQL** database using the direct connection string specified in `.env`.

### 1. Open the `.env` file in the project root:
```env
# Supabase Direct PostgreSQL Connection String
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### 2. How to get your direct string from Supabase:
1. Log into your **[Supabase Dashboard](https://supabase.com/dashboard)**.
2. Select your project → Click on the ⚙️ **Project Settings** icon (bottom left).
3. Under **Configuration**, click **Database**.
4. Scroll down to the **Connection string** section.
5. Select **Direct connection (URI)** and copy the connection string.
6. Paste it into `.env` as `DATABASE_URL` (replace `[YOUR-PASSWORD]` with your database password).

### 3. Automatic Table Initialization:
- Upon connecting, the application automatically verifies or creates the `events` and `users` tables in Supabase with initial seed data.
- You can also view or run [`supabase-schema.sql`](file:///c:/code/expo-week/supabase-schema.sql) directly inside the **Supabase SQL Editor** if preferred.
- **Fail-safe fallback**: If `.env` contains placeholders or credentials are not yet configured, the application seamlessly uses persistent local storage (`data/events.json` and `data/users.json`). Once a valid string is added, it connects directly to Supabase.

---

## 🌟 Key Features

### 1. 🔐 Authentication & Roles
- **Role-Based Access**:
  - **👑 Admin**: Full access to `/admin` to approve, reject, edit, add, or delete any expo event.
  - **🎪 Exhibitor / User**: Can sign in, submit proposals, and monitor status.
- **Demo Accounts (1-Click or Manual)**:
  - **Admin**: Username: `admin` | Password: `admin123`
  - **Exhibitor**: Username: `exhibitor` | Password: `user123`
- **Session Persistence**: Stored via secure session token and synced via client-side `AuthProvider`.
- **Navbar Profile**: Displays user badge (`ADMIN` or `USER`), avatar, and 1-click Logout.
- **Route Guard**: `/admin` is locked for non-admins with an on-page Admin Login prompt.

### 2. 🌓 Dark / Light Theme Mode
- **Instant Toggle**: Sun / Moon button in the navbar.
- **Full Theme Adaptation**: Responsive glassmorphism cards, badges, inputs, buttons, and modals designed for both Dark and Light modes.
- **Persistent Preference**: Saved in `localStorage` and applied via `data-theme` attribute.

### 3. 🛡️ Complete Data Management by Admin (`/admin`)
- **Add New Event**: Admin can create brand-new booths, activities, or milestones with custom schedule, booth codes, tags, and status.
- **Edit Any Event**: Update title, description, category, date, start/end time, location, booth number, organizer, username, tags, or featured status.
- **One-Click Approve**: Instantly publish proposals to the live visitor timeline.
- **Reject with Custom Feedback**: Select common rejection reasons (*safety hazard, schedule conflict, duplicate booth*) or enter custom reviewer notes.
- **Re-evaluate / Revert**: Move decided proposals back into Pending Review.
- **Permanent Delete**: Clean up invalid or obsolete submissions.
- **Table & Grid Views**: Toggle between compact tabular layout and visual cards.
- **Supabase Status Pill**: Live indicator in the admin header showing connection state.
- **Restore Demo Data**: Reset to initial sample dataset with one click.

### 4. 📅 Public Chronological Timeline (`/timeline`)
- Filterable by **Day 1**, **Day 2**, and **Day 3**, or **Category** (*Booths*, *Activities*, *Milestones*).
- Real-time search across titles, organizers, descriptions, booth codes, and tags.
- Detailed modal popup for full event overview and host info.
- Only approved events appear on the public timeline.

### 5. ✍️ Exhibitor Proposal Submission (`/submit`)
- Public registration form for booths, workshops, and milestones.
- Auto-populates contact details when logged in.
- Automatically queued with `pending` status for admin review.

---

## 🛠️ How to Run

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Start Development Server**:
   ```bash
   pnpm dev
   ```
   Or start the production server:
   ```bash
   pnpm build
   pnpm start -p 3000
   ```

3. **Open in your browser**:
   - **Homepage**: [http://localhost:3000](http://localhost:3000)
   - **Timeline**: [http://localhost:3000/timeline](http://localhost:3000/timeline)
   - **Admin Dashboard**: [http://localhost:3000/admin](http://localhost:3000/admin) *(Sign in with `admin` / `admin123`)*
   - **Sign In / Register**: [http://localhost:3000/login](http://localhost:3000/login)
   - **Submit Proposal**: [http://localhost:3000/submit](http://localhost:3000/submit)

---

## 📂 File Architecture

```
expo-week/
├── .env                       # Supabase direct PostgreSQL connection string
├── .env.example               # Environment variables example template
├── supabase-schema.sql        # Supabase SQL DDL schema & initial seed data
├── app/
│   ├── admin/page.jsx         # Admin Dashboard & Data Manager (Auth-guarded)
│   ├── login/page.jsx         # Sign In & Register page with 1-click demo logins
│   ├── timeline/page.jsx      # Public chronological timeline
│   ├── submit/page.jsx        # Exhibitor proposal submission form
│   ├── page.jsx               # Home showcase
│   ├── layout.jsx             # Root layout with ThemeProvider & AuthProvider
│   ├── globals.css            # CSS variables for Dark/Light mode & design system
│   └── api/
│       ├── auth/              # Auth API (login, register, me, logout)
│       ├── db/status/route.js # Supabase direct connection status checker
│       ├── events/            # Events API (CRUD, status, reset)
│       └── stats/route.js     # Live metrics
├── components/
│   ├── AuthProvider.jsx       # Auth context & session tracking
│   ├── ThemeProvider.jsx      # Dark/Light mode theme context
│   ├── Navbar.jsx             # Nav with theme toggle and user badge
│   └── Footer.jsx             # Footer
├── data/
│   ├── events.json            # Persistent JSON backup store
│   └── users.json             # Persistent JSON user store
├── lib/
│   ├── db.js                  # Supabase direct PostgreSQL connection pool (pg)
│   ├── auth.js                # Auth logic (works with Supabase & local)
│   └── data.js                # Event CRUD logic (works with Supabase & local)
├── jsconfig.json              # Path aliases (@/*)
├── package.json
└── README.md
```
