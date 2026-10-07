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

-- 3. Initial Seed Data
INSERT INTO public.users (id, username, password_hash, name, role, committee, avatar)
VALUES 
  ('usr-admin', 'admin', '42917319bd1d0ae35efce52055805529f85614de699384397d68453b09d32f6c', 'Dr. Marcus Vance', 'admin', 'Executive Steering Committee', '👨‍💼'),
  ('usr-booth-lead', 'booth_lead', '92ee97dcb95664a43beeb0fbad994715ae470e39d81a10c2465f5a2531d913cd', 'Elena Rostova', 'sub_committee', 'Booths & Exhibition', '🎪'),
  ('usr-act-lead', 'activity_lead', 'be6795349ea0a0cd058a1507f4eee3fde061b4219fc794365b4c40b15c158755', 'Kevin Patel', 'sub_committee', 'Programs & Activities', '🎯'),
  ('usr-safety-lead', 'safety_lead', 'f888240a9b00a4936b38c2ce5e3b19e7484616fd8671bb816091ed772f6125db', 'Thomas Wright', 'sub_committee', 'Safety & Compliance', '🦺'),
  ('usr-exhibitor', 'exhibitor', '9f59db5d3e7ba9b16d04791fb73eb845e9d7ba3f4f4521ded841943c5e1cafc2', 'Alex Tech (Exhibitor)', 'user', 'None', '👤')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.events (id, title, description, date, time, end_time, category, location, booth_number, organizer, contact_username, status, featured, tags)
VALUES
  ('exp-1', 'Grand Opening Keynote & Innovation Unveiling', 'Welcome speech by global leaders, ribbon cutting ceremony, and the unveiling of flagship innovations.', '2026-10-12', '09:00', '10:30', 'milestone', 'Main Grand Stage', 'Stage-1', 'EXPO 2026 Organizing Committee', 'admin', 'approved', true, ARRAY['Ceremony', 'Keynote', 'VIP']),
  ('exp-2', 'Next-Gen Quantum Computing Demo', 'Live interactive demonstrations of 128-qubit quantum algorithmic simulations solving real-world logistics.', '2026-10-12', '11:00', '17:00', 'booth', 'Quantum Pavilion (Hall A)', 'A-04', 'Horizon Quantum Dynamics', 'horizon_quantum', 'approved', true, ARRAY['Quantum', 'Hardware', 'Computing']),
  ('exp-3', 'Autonomous Drone Obstacle Course', 'High-speed autonomous drone navigation through dynamic laser-scanned indoor obstacles.', '2026-10-12', '13:30', '16:00', 'activity', 'Outdoor Aerial Arena', 'Arena-01', 'AeroAcrobatics Lab', 'aero_pilot', 'approved', true, ARRAY['Robotics', 'Aviation', 'Live Demo']),
  ('exp-4', 'AI & Humanoid Robotics Interactive Booth', 'Interact with bipedal humanoid robots demonstrating delicate motor skills and conversational AI.', '2026-10-13', '09:30', '17:30', 'booth', 'Robotics Center (Hall B)', 'B-12', 'CyberMotion Automations', 'cyber_motion', 'approved', true, ARRAY['Robotics', 'AI', 'Interactive']),
  ('exp-5', 'Clean Energy Microgrid Simulation', 'Hands-on workshop detailing how community micro-grids integrate solar, wind, and sodium-ion batteries.', '2026-10-13', '11:00', '13:00', 'activity', 'Green Tech Workshop Room 3', 'WS-03', 'EcoVolt Sustainable Networks', 'ecovolt', 'pending', false, ARRAY['CleanTech', 'Sustainability', 'Workshop']),
  ('exp-6', 'VR Metaverse Spatial Design Lab', 'Step into wireless VR headsets to sculpt 3D architectural spaces collaboratively.', '2026-10-13', '14:00', '18:00', 'activity', 'Virtual Worlds Arena (Hall C)', 'C-08', 'HoloRealm Studios', 'holorealm', 'pending', false, ARRAY['VR/AR', 'Metaverse', 'Design']),
  ('exp-7', 'Commercial Space Flight Habitation Mockup', 'Full-scale walk-through habitat capsule designed for orbital research and commercial astronaut habitation.', '2026-10-13', '10:00', '17:00', 'booth', 'AeroSphere Dome', 'SP-01', 'OrbitX Aerospace Systems', 'orbitx', 'approved', true, ARRAY['Space', 'Engineering', 'Exhibition']),
  ('exp-8', 'Synthetic Biology & Bio-Material Tasting', 'A sensory booth presenting lab-grown natural flavors, vegan dairy substitutes, and fermented botanical proteins.', '2026-10-14', '10:30', '15:30', 'booth', 'BioInnovation Wing (Hall D)', 'BIO-06', 'FutureFlora Organics', 'futureflora', 'pending', false, ARRAY['BioTech', 'FoodTech', 'Tasting']),
  ('exp-9', 'Indoor Pyrotechnic Laser & Fireworks Blast', 'Late night indoor pyrotechnic show featuring chemical flashes, fireworks, and flame throwers.', '2026-10-12', '21:00', '22:30', 'activity', 'Hall A Exhibition Floor', 'A-99', 'PyroTech FX Sound', 'pyrotech', 'rejected', false, ARRAY['Music', 'Pyrotechnics']),
  ('exp-10', 'Smart City Autonomous Shuttle Rides', 'Ride along the outdoor perimeter track in level-4 autonomous electric shuttles communicating with smart traffic nodes.', '2026-10-14', '11:00', '16:30', 'activity', 'Perimeter Transit Loop', 'TR-02', 'CityFlow Mobility Solutions', 'cityflow', 'pending', false, ARRAY['Autonomous', 'SmartCity', 'Transport']),
  ('exp-11', 'EXPO 2026 Awards Gala & Closing Ceremony', 'Recognizing outstanding exhibitors, Best Innovation Award 2026 announcement, and ceremonial handover.', '2026-10-14', '18:00', '20:30', 'milestone', 'Main Grand Stage', 'Stage-1', 'EXPO 2026 Organizing Committee', 'admin', 'approved', true, ARRAY['Ceremony', 'Awards', 'Closing'])
ON CONFLICT (id) DO NOTHING;
