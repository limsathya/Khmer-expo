-- =========================================================
-- EXPO Week 2026: Supabase Direct Database Schema
-- Run this in your Supabase SQL Editor if needed
-- =========================================================

-- 1. Events Table (booths, activities, milestones)
CREATE TABLE IF NOT EXISTS public.events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  end_time TEXT,
  category TEXT NOT NULL CHECK (category IN ('booth', 'activity', 'milestone')),
  location TEXT,
  booth_number TEXT,
  organizer TEXT NOT NULL,
  contact_username TEXT,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected')),
  featured BOOLEAN DEFAULT false,
  tags TEXT[],
  sub_committee TEXT,
  rejected_reason TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- 2. Users Table (admins, sub-committees, exhibitors - Username only, no email)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'sub_committee', 'user')),
  committee TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

