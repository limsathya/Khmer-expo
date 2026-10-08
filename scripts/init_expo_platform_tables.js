const { Pool } = require('pg');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
if (!connectionString) {
  console.error('No DATABASE_URL found in .env');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  console.log('Connecting to Supabase PostgreSQL...');
  const client = await pool.connect();
  try {
    console.log('Creating normalized Expo Week tables...');

    await client.query(`
      -- 1. REGISTRATIONS TABLE
      CREATE TABLE IF NOT EXISTS public.registrations (
        id TEXT PRIMARY KEY,
        reg_number TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        gender TEXT,
        nationality TEXT,
        organization TEXT NOT NULL,
        position TEXT,
        email TEXT NOT NULL,
        phone TEXT,
        country TEXT NOT NULL,
        city TEXT,
        reg_type TEXT NOT NULL DEFAULT 'visitor',
        status TEXT NOT NULL DEFAULT 'approved',
        qr_token TEXT UNIQUE NOT NULL,
        checked_in BOOLEAN DEFAULT false,
        checked_in_at TIMESTAMPTZ,
        notes TEXT,
        exhibitor_details JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_registrations_reg_number ON public.registrations(reg_number);
      CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
      CREATE INDEX IF NOT EXISTS idx_registrations_qr_token ON public.registrations(qr_token);
      CREATE INDEX IF NOT EXISTS idx_registrations_reg_type ON public.registrations(reg_type);
      CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);

      -- 2. COMPANIES TABLE
      CREATE TABLE IF NOT EXISTS public.companies (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        logo_url TEXT,
        country TEXT NOT NULL,
        industry TEXT NOT NULL,
        description TEXT,
        website TEXT,
        email TEXT,
        phone TEXT,
        address TEXT,
        contact_person TEXT,
        products TEXT[],
        booth_id TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_companies_slug ON public.companies(slug);
      CREATE INDEX IF NOT EXISTS idx_companies_industry ON public.companies(industry);

      -- 3. BOOTHS TABLE
      CREATE TABLE IF NOT EXISTS public.booths (
        id TEXT PRIMARY KEY,
        booth_number TEXT UNIQUE NOT NULL,
        zone TEXT NOT NULL DEFAULT 'Hall A',
        category TEXT NOT NULL DEFAULT 'Standard',
        size TEXT NOT NULL DEFAULT '2m x 2m',
        status TEXT NOT NULL DEFAULT 'available',
        company_id TEXT,
        company_name TEXT,
        location_desc TEXT,
        price NUMERIC DEFAULT 500,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_booths_number ON public.booths(booth_number);
      CREATE INDEX IF NOT EXISTS idx_booths_status ON public.booths(status);
      CREATE INDEX IF NOT EXISTS idx_booths_zone ON public.booths(zone);

      -- 4. EXHIBITORS TABLE
      CREATE TABLE IF NOT EXISTS public.exhibitors (
        id TEXT PRIMARY KEY,
        company_id TEXT REFERENCES public.companies(id) ON DELETE SET NULL,
        company_name TEXT NOT NULL,
        registration_id TEXT,
        booth_id TEXT REFERENCES public.booths(id) ON DELETE SET NULL,
        booth_number TEXT,
        contact_name TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        status TEXT NOT NULL DEFAULT 'approved',
        representatives JSONB DEFAULT '[]'::jsonb,
        featured BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_exhibitors_status ON public.exhibitors(status);

      -- 5. SPEAKERS TABLE
      CREATE TABLE IF NOT EXISTS public.speakers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        position TEXT NOT NULL,
        organization TEXT NOT NULL,
        country TEXT NOT NULL,
        bio TEXT,
        photo_url TEXT,
        featured BOOLEAN DEFAULT false,
        display_order INTEGER DEFAULT 0,
        email TEXT,
        social_links JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_speakers_slug ON public.speakers(slug);

      -- 6. PROGRAMS / SCHEDULE TABLE
      CREATE TABLE IF NOT EXISTS public.programs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        venue TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        speaker_ids TEXT[],
        speaker_names TEXT[],
        organizer TEXT,
        featured BOOLEAN DEFAULT false,
        status TEXT NOT NULL DEFAULT 'published',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_programs_date ON public.programs(date);
      CREATE INDEX IF NOT EXISTS idx_programs_category ON public.programs(category);

      -- 7. VIP & OFFICIAL GUESTS TABLE
      CREATE TABLE IF NOT EXISTS public.vip_guests (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        organization TEXT NOT NULL,
        country TEXT NOT NULL,
        protocol_level TEXT NOT NULL DEFAULT 'Level 2',
        invitation_status TEXT NOT NULL DEFAULT 'Invited',
        attendance_status TEXT NOT NULL DEFAULT 'Confirmed',
        seating TEXT,
        notes TEXT,
        contact_email TEXT,
        contact_phone TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_vip_protocol ON public.vip_guests(protocol_level);

      -- 8. SUBCOMMITTEES TABLE
      CREATE TABLE IF NOT EXISTS public.subcommittees (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        head_name TEXT,
        deputy_head_name TEXT,
        member_count INTEGER DEFAULT 0,
        status TEXT NOT NULL DEFAULT 'active',
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 9. TASKS TABLE (KANBAN)
      CREATE TABLE IF NOT EXISTS public.tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        committee_id TEXT NOT NULL,
        subcommittee_id TEXT,
        assignee TEXT,
        priority TEXT NOT NULL DEFAULT 'medium',
        status TEXT NOT NULL DEFAULT 'todo',
        due_date TEXT,
        comments JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_priority ON public.tasks(priority);
      CREATE INDEX IF NOT EXISTS idx_tasks_subcommittee ON public.tasks(subcommittee_id);

      -- 10. MEETINGS TABLE
      CREATE TABLE IF NOT EXISTS public.meetings (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        committee_id TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        location TEXT NOT NULL,
        agenda TEXT,
        minutes TEXT,
        attendees TEXT[],
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 11. CHECKINS TABLE
      CREATE TABLE IF NOT EXISTS public.checkins (
        id TEXT PRIMARY KEY,
        registration_id TEXT NOT NULL,
        reg_number TEXT NOT NULL,
        attendee_name TEXT NOT NULL,
        organization TEXT,
        reg_type TEXT,
        checked_in_at TIMESTAMPTZ DEFAULT NOW(),
        staff_username TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_checkins_reg_number ON public.checkins(reg_number);

      -- 12. SPONSORS TABLE
      CREATE TABLE IF NOT EXISTS public.sponsors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        logo_url TEXT,
        level TEXT NOT NULL DEFAULT 'Gold',
        website TEXT,
        description TEXT,
        display_order INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_sponsors_level ON public.sponsors(level);

      -- 13. NEWS TABLE
      CREATE TABLE IF NOT EXISTS public.news (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        summary TEXT,
        cover_image_url TEXT,
        author TEXT NOT NULL DEFAULT 'Organizing Secretariat',
        category TEXT NOT NULL DEFAULT 'Announcement',
        published_at TIMESTAMPTZ DEFAULT NOW(),
        status TEXT NOT NULL DEFAULT 'published',
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_news_slug ON public.news(slug);
      CREATE INDEX IF NOT EXISTS idx_news_status ON public.news(status);

      -- 14. GALLERY ALBUMS & ITEMS
      CREATE TABLE IF NOT EXISTS public.gallery_albums (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        event_date TEXT,
        cover_image_url TEXT,
        is_published BOOLEAN DEFAULT true,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS public.gallery_items (
        id TEXT PRIMARY KEY,
        album_id TEXT REFERENCES public.gallery_albums(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        caption TEXT,
        event_date TEXT,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );

      -- 15. AUDIT LOGS
      CREATE TABLE IF NOT EXISTS public.audit_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        username TEXT,
        action TEXT NOT NULL,
        entity TEXT NOT NULL,
        details TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
    `);

    console.log('✓ All platform tables created successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
