import fs from 'fs';
import path from 'path';
import { getPool, initDatabase } from './db';
import { getDefaultSubCommitteeForCategory } from './committees';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'events.json');

const INITIAL_EVENTS = [];

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readEventsFromFile() {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    return parsed.map(e => ({
      ...e,
      subCommittee: e.subCommittee || getDefaultSubCommitteeForCategory(e.category)
    }));
  } catch (err) {
    console.error('Error reading events from file:', err);
    return [];
  }
}

function writeEventsToFile(events) {
  try {
    ensureDataFile();
    fs.writeFileSync(DATA_FILE, JSON.stringify(events, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing events to file:', err);
  }
}

function mapRowToEvent(row) {
  const rawUser = row.contact_username || row.contactUsername || row.contact_email || row.contactEmail || 'admin';
  const username = String(rawUser).split('@')[0];
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    time: row.time,
    endTime: row.end_time || row.endTime,
    category: row.category,
    location: row.location,
    boothNumber: row.booth_number || row.boothNumber,
    organizer: row.organizer,
    contactUsername: username,
    contactEmail: username,
    status: row.status,
    featured: Boolean(row.featured),
    tags: Array.isArray(row.tags) ? row.tags : [],
    subCommittee: row.sub_committee || row.subCommittee || getDefaultSubCommitteeForCategory(row.category),
    rejectedReason: row.rejected_reason || row.rejectedReason,
    submittedAt: row.submitted_at,
    reviewedAt: row.reviewed_at
  };
}

export async function getAllEvents() {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const res = await db.query('SELECT * FROM events ORDER BY date ASC, time ASC');
      return res.rows.map(mapRowToEvent);
    } catch (err) {
      console.warn('Supabase query failed, falling back to local file:', err.message);
    }
  }

  return readEventsFromFile();
}

export async function getApprovedEvents() {
  const all = await getAllEvents();
  return all.filter(e => e.status === 'approved');
}

export async function getPendingEvents() {
  const all = await getAllEvents();
  return all.filter(e => e.status === 'pending');
}

export async function getRejectedEvents() {
  const all = await getAllEvents();
  return all.filter(e => e.status === 'rejected');
}

export async function getEventById(id) {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const res = await db.query('SELECT * FROM events WHERE id = $1', [id]);
      if (res.rows.length > 0) {
        return mapRowToEvent(res.rows[0]);
      }
      return null;
    } catch (err) {
      console.warn('Supabase query failed, falling back to local file:', err.message);
    }
  }

  const events = readEventsFromFile();
  return events.find(e => e.id === id) || null;
}

export async function createEvent(data) {
  const username = data.contactUsername || data.username || data.contactEmail || 'admin';
  const newEvent = {
    id: `exp-${Date.now()}`,
    title: data.title || 'Untitled Expo Event',
    description: data.description || '',
    date: data.date || '2026-10-12',
    time: data.time || '10:00',
    endTime: data.endTime || '12:00',
    category: data.category || 'booth',
    location: data.location || 'General Exhibition Hall',
    boothNumber: data.boothNumber || 'TBD',
    organizer: data.organizer || 'Independent Exhibitor',
    contactUsername: username,
    contactEmail: username,
    status: data.status || 'pending',
    featured: Boolean(data.featured),
    subCommittee: data.subCommittee || getDefaultSubCommitteeForCategory(data.category || 'booth'),
    tags: Array.isArray(data.tags) ? data.tags : (data.tags ? data.tags.split(',').map(s => s.trim()).filter(Boolean) : ['Exhibition']),
    submittedAt: new Date().toISOString()
  };

  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      await db.query(`
        INSERT INTO events (id, title, description, date, time, end_time, category, location, booth_number, organizer, contact_username, contact_email, status, featured, tags, sub_committee, submitted_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      `, [
        newEvent.id,
        newEvent.title,
        newEvent.description,
        newEvent.date,
        newEvent.time,
        newEvent.endTime,
        newEvent.category,
        newEvent.location,
        newEvent.boothNumber,
        newEvent.organizer,
        newEvent.contactUsername,
        newEvent.contactUsername,
        newEvent.status,
        newEvent.featured,
        newEvent.tags,
        newEvent.subCommittee,
        newEvent.submittedAt
      ]);
      return newEvent;
    } catch (err) {
      console.warn('Supabase insert failed, falling back to local file:', err.message);
    }
  }

  const events = readEventsFromFile();
  events.push(newEvent);
  writeEventsToFile(events);
  return newEvent;
}

export async function updateEvent(id, data) {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const existing = await getEventById(id);
      if (!existing) return null;

      const targetUser = data.contactUsername !== undefined ? data.contactUsername : data.contactEmail;
      const updated = { 
        ...existing, 
        ...data,
        contactUsername: targetUser !== undefined ? targetUser : (existing.contactUsername || 'admin'),
        contactEmail: targetUser !== undefined ? targetUser : (existing.contactEmail || 'admin')
      };
      if (data.tags) {
        updated.tags = Array.isArray(data.tags) ? data.tags : data.tags.split(',').map(s => s.trim()).filter(Boolean);
      }
      if (data.status) {
        updated.reviewedAt = new Date().toISOString();
        if (data.status === 'rejected') {
          updated.rejectedReason = data.reason || data.rejectedReason || 'Does not meet expo requirements.';
        } else {
          updated.rejectedReason = null;
        }
      }

      await db.query(`
        UPDATE events SET
          title = $1,
          description = $2,
          date = $3,
          time = $4,
          end_time = $5,
          category = $6,
          location = $7,
          booth_number = $8,
          organizer = $9,
          contact_username = $10,
          contact_email = $11,
          status = $12,
          featured = $13,
          tags = $14,
          sub_committee = $15,
          rejected_reason = $16,
          reviewed_at = $17
        WHERE id = $18
      `, [
        updated.title,
        updated.description,
        updated.date,
        updated.time,
        updated.endTime,
        updated.category,
        updated.location,
        updated.boothNumber,
        updated.organizer,
        updated.contactUsername,
        updated.contactUsername,
        updated.status,
        updated.featured,
        updated.tags,
        updated.subCommittee,
        updated.rejectedReason,
        updated.reviewedAt || null,
        id
      ]);

      return updated;
    } catch (err) {
      console.warn('Supabase update failed, falling back to local file:', err.message);
    }
  }

  // Local fallback
  const events = readEventsFromFile();
  const event = events.find(e => e.id === id);
  if (!event) return null;

  if (data.title !== undefined) event.title = data.title;
  if (data.description !== undefined) event.description = data.description;
  if (data.date !== undefined) event.date = data.date;
  if (data.time !== undefined) event.time = data.time;
  if (data.endTime !== undefined) event.endTime = data.endTime;
  if (data.category !== undefined) event.category = data.category;
  if (data.location !== undefined) event.location = data.location;
  if (data.boothNumber !== undefined) event.boothNumber = data.boothNumber;
  if (data.organizer !== undefined) event.organizer = data.organizer;
  if (data.contactUsername !== undefined) {
    event.contactUsername = data.contactUsername;
    event.contactEmail = data.contactUsername;
  } else if (data.contactEmail !== undefined) {
    event.contactUsername = data.contactEmail;
    event.contactEmail = data.contactEmail;
  }
  if (data.featured !== undefined) event.featured = Boolean(data.featured);
  if (data.subCommittee !== undefined) event.subCommittee = data.subCommittee;
  if (data.tags !== undefined) {
    event.tags = Array.isArray(data.tags) ? data.tags : data.tags.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (data.status !== undefined) {
    event.status = data.status;
    event.reviewedAt = new Date().toISOString();
    if (data.status === 'rejected') {
      event.rejectedReason = data.reason || data.rejectedReason || 'Does not meet current expo requirements.';
    } else {
      delete event.rejectedReason;
    }
  }

  writeEventsToFile(events);
  return event;
}

export async function updateEventStatus(id, status, reason = '') {
  return updateEvent(id, { status, reason });
}

export async function deleteEvent(id) {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const res = await db.query('DELETE FROM events WHERE id = $1', [id]);
      return res.rowCount > 0;
    } catch (err) {
      console.warn('Supabase delete failed, falling back to local file:', err.message);
    }
  }

  const events = readEventsFromFile();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) return false;

  events.splice(index, 1);
  writeEventsToFile(events);
  return true;
}

export async function resetToSeedData() {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      await db.query('DELETE FROM events');
    } catch (err) {
      console.warn('Supabase clear failed:', err.message);
    }
  }

  writeEventsToFile([]);
  return [];
}

export async function getStats() {
  const events = await getAllEvents();
  return {
    total: events.length,
    approved: events.filter(e => e.status === 'approved').length,
    pending: events.filter(e => e.status === 'pending').length,
    rejected: events.filter(e => e.status === 'rejected').length,
    booths: events.filter(e => e.category === 'booth').length,
    activities: events.filter(e => e.category === 'activity').length,
    milestones: events.filter(e => e.category === 'milestone').length,
  };
}
