-- ============================================================================
-- CAMBODIA-CHINA EXPO WEEK 2026: ENTERPRISE DATABASE SCHEMA SPECIFICATION (v2)
-- PostgreSQL / Supabase Normalized Relational Data Model
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. CUSTOM TYPES & ENUMS
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM (
    'super_admin',
    'committee_lead',
    'committee_member',
    'exhibitor_admin',
    'delegate',
    'visitor'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE event_status_type AS ENUM (
    'draft',
    'pending',
    'under_review',
    'approved',
    'rejected',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE registration_status_type AS ENUM (
    'pending',
    'approved',
    'rejected',
    'checked_in'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE registration_classification_type AS ENUM (
    'Visitor',
    'Exhibitor',
    'Business Buyer',
    'University / Education Institution',
    'Media',
    'VIP',
    'Official Guest'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. COMMITTEES TABLE (Bilateral Governance Entities)
CREATE TABLE IF NOT EXISTS public.committees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_km TEXT NOT NULL,
  name_zh TEXT NOT NULL,
  lead_name TEXT,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. USERS TABLE (Bilateral Identity & Credential Management)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role user_role_type NOT NULL DEFAULT 'visitor',
  committee_id UUID REFERENCES public.committees(id) ON DELETE SET NULL,
  avatar_url TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. VENUE & BOOTH ZONES TABLE
CREATE TABLE IF NOT EXISTS public.venue_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  floor_level TEXT DEFAULT 'Ground Floor',
  capacity_booths INTEGER NOT NULL DEFAULT 20,
  description TEXT,
  map_coordinates JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. EXHIBITORS & COMMERCIAL ENTERPRISES TABLE
CREATE TABLE IF NOT EXISTS public.exhibitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  zone_id UUID REFERENCES public.venue_zones(id) ON DELETE SET NULL,
  company_name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  industry_sector TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'Cambodia',
  booth_number TEXT,
  logo_url TEXT,
  website_url TEXT,
  business_description TEXT,
  contact_person TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. EVENTS & PLENARY SESSIONS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_km TEXT,
  title_zh TEXT,
  description TEXT,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  category TEXT NOT NULL CHECK (category IN ('milestone', 'booth', 'activity', 'plenary', 'bilateral_meeting', 'signing_ceremony')),
  location TEXT NOT NULL,
  booth_number TEXT,
  organizer TEXT NOT NULL,
  committee_id UUID REFERENCES public.committees(id) ON DELETE SET NULL,
  created_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status event_status_type NOT NULL DEFAULT 'pending',
  featured BOOLEAN DEFAULT false,
  max_capacity INTEGER,
  tags TEXT[],
  rejected_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. REGISTRATIONS & CREDENTIALS TABLE
CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reg_code TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  gender TEXT DEFAULT 'Prefer not to say',
  nationality TEXT NOT NULL DEFAULT 'Cambodian',
  organization TEXT NOT NULL,
  position TEXT,
  classification registration_classification_type NOT NULL DEFAULT 'Visitor',
  country TEXT NOT NULL DEFAULT 'Cambodia',
  city TEXT NOT NULL DEFAULT 'Phnom Penh',
  qr_token TEXT NOT NULL,
  status registration_status_type NOT NULL DEFAULT 'approved',
  checked_in_at TIMESTAMPTZ,
  turnstile_gate TEXT,
  notes TEXT,
  commercial_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUDIT LOGS TABLE (Compliance, Security & Tracing)
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  payload_diff JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INDEXES FOR HIGH-PERFORMANCE QUERIES
CREATE INDEX IF NOT EXISTS idx_events_date_status ON public.events(date, status);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.events(category);
CREATE INDEX IF NOT EXISTS idx_registrations_reg_code ON public.registrations(reg_code);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_classification ON public.registrations(classification);
CREATE INDEX IF NOT EXISTS idx_exhibitors_slug ON public.exhibitors(slug);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
