import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { MAIN_COMMITTEE, SUB_COMMITTEES } from './committees';

let pool = null;
let isInitialized = false;

function isRealDatabaseUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (url.includes('YOUR_PASSWORD') || url.includes('YOUR_PROJECT_REF') || url.includes('placeholder')) {
    return false;
  }
  return url.startsWith('postgres://') || url.startsWith('postgresql://');
}

export function getPool() {
  const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

  if (!isRealDatabaseUrl(connectionString)) {
    return null;
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false // Required for Supabase Direct PostgreSQL connection
      },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected Supabase PostgreSQL client error:', err.message);
    });
  }

  return pool;
}

export async function testConnection() {
  const db = getPool();
  if (!db) {
    return {
      connected: false,
      mode: 'local_fallback',
      message: 'DATABASE_URL in .env is not configured. Falling back to local storage.'
    };
  }

  try {
    await initDatabase();
    const res = await db.query('SELECT NOW() as current_time, current_database() as db_name');
    
    // Get table row counts from Supabase DB
    const eCnt = await db.query('SELECT COUNT(*) FROM events');
    const uCnt = await db.query('SELECT COUNT(*) FROM users');
    const cCnt = await db.query('SELECT COUNT(*) FROM committees');

    return {
      connected: true,
      mode: 'supabase_direct',
      currentTime: res.rows[0].current_time,
      database: res.rows[0].db_name,
      eventsCount: parseInt(eCnt.rows[0].count, 10),
      usersCount: parseInt(uCnt.rows[0].count, 10),
      committeesCount: parseInt(cCnt.rows[0].count, 10),
      message: 'All data (Events, Users, Committees) loaded directly from Supabase DB.'
    };
  } catch (err) {
    return {
      connected: false,
      mode: 'local_fallback',
      error: err.message,
      message: 'Failed to connect to Supabase with provided direct string. Falling back to local storage.'
    };
  }
}



export { DEFAULT_EXPO_CONFIG, DEFAULT_CATEGORIES } from './expo-config';
import { DEFAULT_EXPO_CONFIG, DEFAULT_CATEGORIES } from './expo-config';

const SEED_COMMITTEES = [
  { ...MAIN_COMMITTEE, type: 'main' },
  ...SUB_COMMITTEES.map(s => ({ ...s, type: 'sub' }))
];

export async function initDatabase() {
  if (isInitialized) return;
  const db = getPool();
  if (!db) return;

  try {
    // 1. Create events table
    await db.query(`
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        end_time TEXT,
        category TEXT NOT NULL,
        location TEXT,
        booth_number TEXT,
        organizer TEXT NOT NULL,
        contact_username TEXT,
        contact_email TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        featured BOOLEAN DEFAULT false,
        tags TEXT[],
        sub_committee TEXT,
        rejected_reason TEXT,
        submitted_at TIMESTAMPTZ DEFAULT NOW(),
        reviewed_at TIMESTAMPTZ
      );
    `);

    try {
      await db.query(`ALTER TABLE events ADD COLUMN IF NOT EXISTS contact_username TEXT;`);
    } catch (_) {}

    try {
      await db.query(`
        UPDATE events 
        SET contact_username = CASE 
          WHEN contact_username LIKE '%@%' THEN split_part(contact_username, '@', 1)
          WHEN contact_username IS NULL THEN ''
          ELSE contact_username
        END;
      `);
    } catch (_) {}

    // 2. Create users table (username only, no email required)
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT,
        password_hash TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        committee TEXT,
        avatar TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    try {
      await db.query(`ALTER TABLE users ALTER COLUMN email DROP NOT NULL;`);
    } catch (_) {}
    try {
      await db.query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;`);
    } catch (_) {}

    // 3. Create committees table
    await db.query(`
      CREATE TABLE IF NOT EXISTS committees (
        id TEXT PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        type TEXT NOT NULL DEFAULT 'sub',
        description TEXT,
        lead JSONB NOT NULL,
        members JSONB,
        color TEXT,
        badge_class TEXT,
        categories TEXT[],
        member_count INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Always ensure main and sub committees exist in DB (do not overwrite existing customizations)
    for (const c of SEED_COMMITTEES) {
      await db.query(`
        INSERT INTO committees (id, key, name, type, description, lead, members, color, badge_class, categories, member_count)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO NOTHING
      `, [
        c.id, c.key, c.name, c.type, c.description,
        JSON.stringify(c.lead), JSON.stringify(c.members),
        c.color, c.badge_class, c.categories, c.member_count
      ]);
    }

    // 4. Create site_settings table for dynamic expo name, logo, dates, timeline days, and translations
    await db.query(`
      CREATE TABLE IF NOT EXISTS site_settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Ensure default expo configuration and custom translations exist
    await db.query(`
      INSERT INTO site_settings (key, value)
      VALUES ('expo_config', $1)
      ON CONFLICT (key) DO NOTHING;
    `, [JSON.stringify(DEFAULT_EXPO_CONFIG)]);

    await db.query(`
      INSERT INTO site_settings (key, value)
      VALUES ('translations_custom', '{"en":{},"km":{},"zh":{}}'::jsonb)
      ON CONFLICT (key) DO NOTHING;
    `);

    await db.query(`
      INSERT INTO site_settings (key, value)
      VALUES ('categories', $1)
      ON CONFLICT (key) DO NOTHING;
    `, [JSON.stringify(DEFAULT_CATEGORIES)]);

    // 5. Create committee_invites table for member invitation & verification codes
    await db.query(`
      CREATE TABLE IF NOT EXISTS committee_invites (
        id TEXT PRIMARY KEY,
        code TEXT UNIQUE NOT NULL,
        target_committee TEXT NOT NULL,
        target_role TEXT NOT NULL,
        generated_by TEXT NOT NULL,
        note TEXT,
        status TEXT NOT NULL DEFAULT 'active',
        applicant_username TEXT,
        applicant_name TEXT,
        applicant_password_hash TEXT,
        approved_by TEXT,
        rejection_reason TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        reviewed_at TIMESTAMPTZ
      );
    `);

    // 6. Clean up all seed data from database tables (events, invites, mock officers, dummy members)
    try {
      // Remove mock/seed officer accounts (keep root admin and genuine registered accounts)
      await db.query(`
        DELETE FROM users 
        WHERE username IN ('arts_lead', 'sarah_lin', 'media_lead', 'user_8685', 'testuser5141', 'finance_lead', 'activity_lead', 'booth_lead', 'trans_lead', 'food_lead', 'safety_lead', 'usr-exhibitor');
      `);

      // Remove seed verification codes
      await db.query(`
        DELETE FROM committee_invites 
        WHERE id IN ('inv-1', 'inv-2', 'inv-3', 'inv-4', 'inv-5') 
           OR code IN ('EXP-PROTO-2026', 'EXP-FIN-2026', 'EXP-BOOTH-2026', 'EXP-CENTRAL-2026', 'EXP-MEDIA-2026');
      `);

      // Remove seed events
      await db.query(`
        DELETE FROM events 
        WHERE id IN ('exp-1791373794008', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10') 
           OR title = 'Grand Welcoming & VIP Gala';
      `);

      // Remove seed members from committees so only real members added through invites/dashboard exist
      await db.query(`
        UPDATE committees 
        SET members = '[]'::jsonb, member_count = 0
        WHERE members::text LIKE '%Sarah Lin%' OR members::text LIKE '%Dr. Marcus Vance%';
      `);

      // Reset any placeholder seed leads in sub-committees to clean unassigned
      await db.query(`
        UPDATE committees
        SET lead = jsonb_build_object(
          'name', 'To Be Appointed',
          'role', 'Sub-Committee Lead',
          'username', '',
          'avatar', '🏛️',
          'committee', key
        )
        WHERE lead->>'name' IN (
          'Sarah Lin', 'David Chen', 'Elena Rostova', 'Chanthou Sok', 
          'Maya Lin', 'Alex Rivera', 'Kevin Patel', 'Li Wei', 'Thomas Wright'
        );
      `);



      await db.query(`DELETE FROM committees WHERE id NOT IN ('main-committee', 'sub_protocol', 'sub_finance', 'sub_design_booth', 'sub_food', 'sub_arts', 'sub_media', 'sub_sports', 'sub_translation', 'sub_logistics');`);
    } catch (cleanupErr) {
      console.warn('Seed cleanup query note:', cleanupErr.message);
    }

    isInitialized = true;
    console.log('✓ Supabase PostgreSQL: all tables and site settings synchronized.');
  } catch (err) {
    console.warn('Could not initialize Supabase tables automatically:', err.message);
  }
}

export async function getCommitteesFromDB() {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const res = await db.query('SELECT * FROM committees ORDER BY type ASC, key ASC');
      if (res.rows.length > 0) {
        const rows = res.rows.map(r => ({
          id: r.id,
          key: r.key,
          name: r.name,
          type: r.type,
          description: r.description,
          lead: typeof r.lead === 'string' ? JSON.parse(r.lead) : r.lead,
          members: typeof r.members === 'string' ? JSON.parse(r.members) : (r.members || []),
          color: r.color,
          badgeClass: r.badge_class,
          categories: r.categories || [],
          memberCount: r.member_count
        }));
        const main = rows.find(c => c.type === 'main');
        const subs = rows.filter(c => c.type === 'sub');
        return { mainCommittee: main, subCommittees: subs, all: rows };
      }
    } catch (err) {
      console.warn('Supabase committees query failed, using static fallback:', err.message);
    }
  }

  const main = SEED_COMMITTEES.find(c => c.type === 'main');
  const subs = SEED_COMMITTEES.filter(c => c.type === 'sub');
  return { mainCommittee: main, subCommittees: subs, all: SEED_COMMITTEES };
}

export async function updateCommitteeInDB(id, updates) {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const fields = [];
      const values = [];
      let idx = 1;

      if (updates.name !== undefined) {
        fields.push(`name = $${idx++}`);
        values.push(updates.name);
      }
      if (updates.description !== undefined) {
        fields.push(`description = $${idx++}`);
        values.push(updates.description);
      }
      if (updates.lead !== undefined) {
        fields.push(`lead = $${idx++}`);
        values.push(JSON.stringify(updates.lead));
      }
      if (updates.members !== undefined) {
        fields.push(`members = $${idx++}`);
        values.push(JSON.stringify(updates.members));
      }
      if (updates.memberCount !== undefined) {
        fields.push(`member_count = $${idx++}`);
        values.push(updates.memberCount);
      }

      if (fields.length > 0) {
        values.push(id);
        const query = `UPDATE committees SET ${fields.join(', ')} WHERE id = $${idx} OR key = $${idx} RETURNING *`;
        const res = await db.query(query, values);
        if (res.rows.length > 0) {
          const r = res.rows[0];
          return {
            id: r.id,
            key: r.key,
            name: r.name,
            type: r.type,
            description: r.description,
            lead: typeof r.lead === 'string' ? JSON.parse(r.lead) : r.lead,
            members: typeof r.members === 'string' ? JSON.parse(r.members) : (r.members || []),
            color: r.color,
            badgeClass: r.badge_class,
            categories: r.categories || [],
            memberCount: r.member_count
          };
        }
      }
    } catch (err) {
      console.warn('Supabase updateCommittee failed:', err.message);
    }
  }
  return null;
}

// --- SITE SETTINGS HELPERS ---
export async function getSiteSettingsFromDB(key = 'expo_config') {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const res = await db.query('SELECT value FROM site_settings WHERE key = $1', [key]);
      if (res.rows.length > 0) {
        return res.rows[0].value;
      }
    } catch (e) {
      console.warn('Failed to query site_settings:', e.message);
    }
  }
  if (key === 'expo_config') return DEFAULT_EXPO_CONFIG;
  if (key === 'translations_custom') return { en: {}, km: {}, zh: {} };
  return null;
}

export async function updateSiteSettingsInDB(key, value) {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const res = await db.query(`
        INSERT INTO site_settings (key, value, updated_at)
        VALUES ($1, $2, NOW())
        ON CONFLICT (key) DO UPDATE SET
          value = EXCLUDED.value,
          updated_at = NOW()
        RETURNING *
      `, [key, JSON.stringify(value)]);
      if (res.rows.length > 0) {
        return res.rows[0].value;
      }
    } catch (e) {
      console.warn('Failed to update site_settings:', e.message);
    }
  }
  return value;
}

export async function getCustomTranslationsFromDB() {
  return await getSiteSettingsFromDB('translations_custom');
}

export async function updateCustomTranslationsInDB(lang, updates) {
  const current = await getCustomTranslationsFromDB() || { en: {}, km: {}, zh: {} };
  if (!current[lang]) current[lang] = {};
  current[lang] = {
    ...current[lang],
    ...updates
  };
  return await updateSiteSettingsInDB('translations_custom', current);
}

// --- CATEGORIES MANAGEMENT HELPERS ---
const DATA_DIR = path.join(process.cwd(), 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

function ensureCategoriesFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(DEFAULT_CATEGORIES, null, 2), 'utf-8');
  }
}

function readCategoriesFromFile() {
  try {
    ensureCategoriesFile();
    const data = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading categories from file:', err);
    return DEFAULT_CATEGORIES;
  }
}

function writeCategoriesToFile(cats) {
  try {
    ensureCategoriesFile();
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(cats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing categories to file:', err);
  }
}

export async function getCategoriesFromDB() {
  const db = getPool();
  let categories = null;

  if (db) {
    try {
      await initDatabase();
      const res = await db.query('SELECT value FROM site_settings WHERE key = $1', ['categories']);
      if (res.rows.length > 0 && Array.isArray(res.rows[0].value) && res.rows[0].value.length > 0) {
        categories = res.rows[0].value;
      }
    } catch (e) {
      console.warn('Failed to query categories from DB:', e.message);
    }
  }

  if (!categories) {
    categories = readCategoriesFromFile();
  }

  // Count events for each category
  const eventCounts = {};
  if (db) {
    try {
      const cntRes = await db.query('SELECT category, COUNT(*) as count FROM events GROUP BY category');
      for (const row of cntRes.rows) {
        eventCounts[row.category] = parseInt(row.count, 10);
      }
    } catch (_) {}
  } else {
    try {
      const eventsFile = path.join(DATA_DIR, 'events.json');
      if (fs.existsSync(eventsFile)) {
        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf-8'));
        for (const ev of events) {
          eventCounts[ev.category] = (eventCounts[ev.category] || 0) + 1;
        }
      }
    } catch (_) {}
  }

  return categories.map(cat => ({
    ...cat,
    eventCount: eventCounts[cat.key] || 0
  }));
}

export async function saveCategoriesToDB(categories) {
  const cleanList = categories.map(({ eventCount, ...rest }) => rest);
  await updateSiteSettingsInDB('categories', cleanList);
  writeCategoriesToFile(cleanList);
  return cleanList;
}

export async function addCategoryInDB(data) {
  const current = await getCategoriesFromDB();
  const rawKey = (data.key || data.name?.en || `cat_${Date.now()}`)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  let uniqueKey = rawKey || `cat_${Date.now()}`;
  let counter = 1;
  while (current.some(c => c.key === uniqueKey)) {
    uniqueKey = `${rawKey}_${counter++}`;
  }

  const newCat = {
    id: data.id || `cat-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    key: uniqueKey,
    name: {
      en: data.name?.en?.trim() || uniqueKey,
      km: data.name?.km?.trim() || data.name?.en?.trim() || uniqueKey,
      zh: data.name?.zh?.trim() || data.name?.en?.trim() || uniqueKey
    },
    description: {
      en: data.description?.en?.trim() || '',
      km: data.description?.km?.trim() || '',
      zh: data.description?.zh?.trim() || ''
    },
    emoji: data.emoji?.trim() || '📌',
    icon: data.icon?.trim() || 'Layers',
    color: data.color?.trim() || '#6366f1',
    defaultSubCommittee: data.defaultSubCommittee || 'Subcommittee on Design, Stage/Booth Arrangement, and Booth Management'
  };

  const updatedList = [...current, newCat];
  await saveCategoriesToDB(updatedList);
  return newCat;
}

export async function updateCategoryInDB(idOrKey, updates) {
  const current = await getCategoriesFromDB();
  const idx = current.findIndex(c => c.id === idOrKey || c.key === idOrKey);
  if (idx === -1) {
    throw new Error(`Category not found: ${idOrKey}`);
  }

  const existing = current[idx];
  const oldKey = existing.key;
  let newKey = oldKey;

  if (updates.key && updates.key.trim() && updates.key !== oldKey) {
    const sanitizedKey = updates.key
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    // Check if newKey is taken by another category
    if (current.some((c, i) => i !== idx && c.key === sanitizedKey)) {
      throw new Error(`Category key "${sanitizedKey}" is already in use.`);
    }
    newKey = sanitizedKey;
  }

  const updatedCat = {
    ...existing,
    key: newKey,
    name: {
      en: updates.name?.en !== undefined ? updates.name.en : (existing.name?.en || ''),
      km: updates.name?.km !== undefined ? updates.name.km : (existing.name?.km || ''),
      zh: updates.name?.zh !== undefined ? updates.name.zh : (existing.name?.zh || '')
    },
    description: {
      en: updates.description?.en !== undefined ? updates.description.en : (existing.description?.en || ''),
      km: updates.description?.km !== undefined ? updates.description.km : (existing.description?.km || ''),
      zh: updates.description?.zh !== undefined ? updates.description.zh : (existing.description?.zh || '')
    },
    emoji: updates.emoji !== undefined ? updates.emoji : existing.emoji,
    icon: updates.icon !== undefined ? updates.icon : existing.icon,
    color: updates.color !== undefined ? updates.color : existing.color,
    defaultSubCommittee: updates.defaultSubCommittee !== undefined ? updates.defaultSubCommittee : existing.defaultSubCommittee
  };

  current[idx] = updatedCat;
  await saveCategoriesToDB(current);

  // If key was renamed, cascade update events in database and local file
  if (newKey !== oldKey) {
    const db = getPool();
    if (db) {
      try {
        await db.query('UPDATE events SET category = $1 WHERE category = $2', [newKey, oldKey]);
      } catch (err) {
        console.warn('Failed to cascade update events category in DB:', err.message);
      }
    }
    try {
      const eventsFile = path.join(DATA_DIR, 'events.json');
      if (fs.existsSync(eventsFile)) {
        const events = JSON.parse(fs.readFileSync(eventsFile, 'utf-8'));
        let modified = false;
        for (const ev of events) {
          if (ev.category === oldKey) {
            ev.category = newKey;
            modified = true;
          }
        }
        if (modified) {
          fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2), 'utf-8');
        }
      }
    } catch (_) {}
  }

  return updatedCat;
}

export async function deleteCategoryInDB(idOrKey, fallbackCategoryKey = null) {
  const current = await getCategoriesFromDB();
  const idx = current.findIndex(c => c.id === idOrKey || c.key === idOrKey);
  if (idx === -1) {
    throw new Error(`Category not found: ${idOrKey}`);
  }

  if (current.length <= 1) {
    throw new Error('Cannot delete the last remaining category. At least one category must exist.');
  }

  const targetCat = current[idx];
  const targetKey = targetCat.key;

  // Determine fallback key for events
  const remaining = current.filter((_, i) => i !== idx);
  const reassignToKey = fallbackCategoryKey || remaining[0].key;

  // Reassign existing events in DB and local file
  const db = getPool();
  if (db) {
    try {
      await db.query('UPDATE events SET category = $1 WHERE category = $2', [reassignToKey, targetKey]);
    } catch (err) {
      console.warn('Failed to cascade reassign events category in DB:', err.message);
    }
  }

  try {
    const eventsFile = path.join(DATA_DIR, 'events.json');
    if (fs.existsSync(eventsFile)) {
      const events = JSON.parse(fs.readFileSync(eventsFile, 'utf-8'));
      let modified = false;
      for (const ev of events) {
        if (ev.category === targetKey) {
          ev.category = reassignToKey;
          modified = true;
        }
      }
      if (modified) {
        fs.writeFileSync(eventsFile, JSON.stringify(events, null, 2), 'utf-8');
      }
    }
  } catch (_) {}

  // Remove category from array
  await saveCategoriesToDB(remaining);
  return { deletedKey: targetKey, reassignedTo: reassignToKey };
}

// --- COMMITTEE MEMBERS MANAGEMENT HELPERS ---
export async function getMembersFromDB() {
  const data = await getCommitteesFromDB();
  const allCommittees = data.all || [];
  const members = [];
  for (const c of allCommittees) {
    if (Array.isArray(c.members)) {
      c.members.forEach((m, idx) => {
        members.push({
          ...m,
          committeeId: c.id,
          committeeKey: c.key,
          committeeName: c.name,
          memberIndex: idx
        });
      });
    }
  }
  return members;
}

export async function addMemberToCommitteeInDB(committeeId, member) {
  const db = getPool();
  if (!db) return null;
  await initDatabase();

  const cleanCommId = String(committeeId || '').trim();
  const res = await db.query(`
    SELECT id, key, members, member_count 
    FROM committees 
    WHERE id = $1 OR key = $1 OR name = $1 
       OR LOWER(id) = LOWER($1) OR LOWER(key) = LOWER($1) OR LOWER(name) = LOWER($1)
    LIMIT 1
  `, [cleanCommId]);

  if (res.rows.length === 0) return null;

  const row = res.rows[0];
  const actualId = row.id;
  let currentMembers = row.members;
  if (typeof currentMembers === 'string') currentMembers = JSON.parse(currentMembers);
  if (!Array.isArray(currentMembers)) currentMembers = [];

  const newMember = {
    id: member.id || `mem-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: member.name,
    role: member.role || 'Member',
    avatar: member.avatar || '👤',
    committee: row.key,
    committeeId: actualId,
    workingGroup: member.workingGroup || member.team || '',
    centralCommittee: member.centralCommittee || (member.alsoInCentralCommittee ? 'Central Committee' : undefined),
    subCommittee: member.subCommittee || (actualId !== 'main-committee' ? row.key : undefined)
  };

  currentMembers.push(newMember);
  const newCount = currentMembers.length;

  await db.query(
    'UPDATE committees SET members = $1, member_count = $2 WHERE id = $3',
    [JSON.stringify(currentMembers), newCount, actualId]
  );

  // If member is also in Central Committee and not already in Central Committee:
  if (member.alsoInCentralCommittee && actualId !== 'main-committee') {
    const mainRes = await db.query("SELECT id, members, member_count FROM committees WHERE id = 'main-committee' OR key = 'Central Committee' LIMIT 1");
    if (mainRes.rows.length > 0) {
      const mainRow = mainRes.rows[0];
      let mainMembers = mainRow.members;
      if (typeof mainMembers === 'string') mainMembers = JSON.parse(mainMembers);
      if (!Array.isArray(mainMembers)) mainMembers = [];
      const alreadyInMain = mainMembers.some(m => m.name === member.name);
      if (!alreadyInMain) {
        mainMembers.push({
          ...newMember,
          committee: 'Central Committee',
          committeeId: mainRow.id,
          subCommittee: row.key
        });
        await db.query(
          'UPDATE committees SET members = $1, member_count = $2 WHERE id = $3',
          [JSON.stringify(mainMembers), mainMembers.length, mainRow.id]
        );
      }
    }
  }

  return newMember;
}

export async function bulkAddMembersToCommitteeInDB(committeeId, membersList = []) {
  const db = getPool();
  if (!db) return [];
  await initDatabase();

  const cleanCommId = String(committeeId || '').trim();
  const res = await db.query(`
    SELECT id, key, members, member_count 
    FROM committees 
    WHERE id = $1 OR key = $1 OR name = $1 
       OR LOWER(id) = LOWER($1) OR LOWER(key) = LOWER($1) OR LOWER(name) = LOWER($1)
    LIMIT 1
  `, [cleanCommId]);

  if (res.rows.length === 0) return [];

  const row = res.rows[0];
  const actualId = row.id;
  let currentMembers = row.members;
  if (typeof currentMembers === 'string') currentMembers = JSON.parse(currentMembers);
  if (!Array.isArray(currentMembers)) currentMembers = [];

  const added = [];
  const now = Date.now();
  let counter = 0;

  for (const m of membersList) {
    if (!m || !m.name || !m.name.trim()) continue;
    const newMember = {
      id: m.id || `mem-${now}-${counter++}`,
      name: m.name.trim(),
      role: m.role?.trim() || 'Member',
      avatar: m.avatar?.trim() || '👤',
      committee: row.key,
      committeeId: actualId,
      workingGroup: m.workingGroup || m.team || '',
      centralCommittee: m.centralCommittee || (m.alsoInCentralCommittee ? 'Central Committee' : undefined),
      subCommittee: m.subCommittee || (actualId !== 'main-committee' ? row.key : undefined)
    };
    currentMembers.push(newMember);
    added.push(newMember);
  }

  const newCount = currentMembers.length;

  await db.query(
    'UPDATE committees SET members = $1, member_count = $2 WHERE id = $3',
    [JSON.stringify(currentMembers), newCount, actualId]
  );

  return added;
}

export async function updateMemberInCommitteeInDB(committeeId, memberIdOrIndex, updates) {
  const db = getPool();
  if (!db) return null;
  await initDatabase();

  const cleanCommId = String(committeeId || '').trim();
  const res = await db.query(`
    SELECT id, members 
    FROM committees 
    WHERE id = $1 OR key = $1 OR name = $1 
       OR LOWER(id) = LOWER($1) OR LOWER(key) = LOWER($1) OR LOWER(name) = LOWER($1)
    LIMIT 1
  `, [cleanCommId]);

  if (res.rows.length === 0) return null;

  const actualId = res.rows[0].id;
  let currentMembers = res.rows[0].members;
  if (typeof currentMembers === 'string') currentMembers = JSON.parse(currentMembers);
  if (!Array.isArray(currentMembers)) currentMembers = [];

  let targetIdx = -1;
  if (typeof memberIdOrIndex === 'number') {
    targetIdx = memberIdOrIndex;
  } else {
    targetIdx = currentMembers.findIndex(m => m.id === memberIdOrIndex || m.name === memberIdOrIndex);
  }

  if (targetIdx === -1 || !currentMembers[targetIdx]) return null;

  currentMembers[targetIdx] = {
    ...currentMembers[targetIdx],
    ...updates
  };

  await db.query(
    'UPDATE committees SET members = $1 WHERE id = $2',
    [JSON.stringify(currentMembers), actualId]
  );

  return currentMembers[targetIdx];
}

export async function deleteMemberFromCommitteeInDB(committeeId, memberIdOrIndex) {
  const db = getPool();
  if (!db) return false;
  await initDatabase();

  const cleanCommId = String(committeeId || '').trim();
  const res = await db.query(`
    SELECT id, members, member_count 
    FROM committees 
    WHERE id = $1 OR key = $1 OR name = $1 
       OR LOWER(id) = LOWER($1) OR LOWER(key) = LOWER($1) OR LOWER(name) = LOWER($1)
    LIMIT 1
  `, [cleanCommId]);

  if (res.rows.length === 0) return false;

  const actualId = res.rows[0].id;
  let currentMembers = res.rows[0].members;
  if (typeof currentMembers === 'string') currentMembers = JSON.parse(currentMembers);
  if (!Array.isArray(currentMembers)) currentMembers = [];

  let targetIdx = -1;
  if (typeof memberIdOrIndex === 'number') {
    targetIdx = memberIdOrIndex;
  } else {
    targetIdx = currentMembers.findIndex(m => m.id === memberIdOrIndex || m.name === memberIdOrIndex);
  }

  if (targetIdx === -1) return false;

  currentMembers.splice(targetIdx, 1);
  const newCount = currentMembers.length;

  await db.query(
    'UPDATE committees SET members = $1, member_count = $2 WHERE id = $3',
    [JSON.stringify(currentMembers), newCount, actualId]
  );

  return true;
}

export async function getCommitteeInvitesFromDB(committeeFilter = null) {
  const db = getPool();
  if (!db) return [];
  await initDatabase();

  let query = 'SELECT * FROM committee_invites ORDER BY created_at DESC';
  let params = [];
  if (committeeFilter && committeeFilter !== 'all') {
    query = 'SELECT * FROM committee_invites WHERE target_committee = $1 ORDER BY created_at DESC';
    params = [committeeFilter];
  }

  const res = await db.query(query, params);
  return res.rows.map(r => ({
    id: r.id,
    code: r.code,
    targetCommittee: r.target_committee,
    targetRole: r.target_role,
    generatedBy: r.generated_by,
    note: r.note,
    status: r.status,
    applicantUsername: r.applicant_username,
    applicantName: r.applicant_name,
    approvedBy: r.approved_by,
    rejectionReason: r.rejection_reason,
    createdAt: r.created_at,
    reviewedAt: r.reviewed_at
  }));
}

export async function createCommitteeInviteInDB({ code, targetCommittee, targetRole, generatedBy, note }) {
  const db = getPool();
  if (!db) return null;
  await initDatabase();

  const cleanCode = (code || `EXP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`).trim().toUpperCase();
  const id = `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const res = await db.query(`
    INSERT INTO committee_invites (id, code, target_committee, target_role, generated_by, note, status, created_at)
    VALUES ($1, $2, $3, $4, $5, $6, 'active', NOW())
    RETURNING *;
  `, [id, cleanCode, targetCommittee, targetRole || 'Committee Member', generatedBy || 'admin', note || '']);

  const r = res.rows[0];
  return {
    id: r.id,
    code: r.code,
    targetCommittee: r.target_committee,
    targetRole: r.target_role,
    generatedBy: r.generated_by,
    note: r.note,
    status: r.status,
    createdAt: r.created_at
  };
}

export async function submitRegistrationWithCodeInDB({ code, username, name, password }) {
  const db = getPool();
  if (!db) throw new Error('Database not connected');
  await initDatabase();

  const cleanCode = code.trim().toUpperCase();
  const cleanUser = username.trim().toLowerCase();

  // 1. Check if user already exists
  const userCheck = await db.query('SELECT id FROM users WHERE LOWER(username) = $1', [cleanUser]);
  if (userCheck.rows.length > 0) {
    throw new Error('Username already exists. Please choose a different username.');
  }

  // 2. Check if code exists and is active
  const codeRes = await db.query('SELECT * FROM committee_invites WHERE code = $1', [cleanCode]);
  if (codeRes.rows.length === 0) {
    throw new Error('Invalid verification code. Please check with your committee lead.');
  }

  const invite = codeRes.rows[0];
  if (invite.status !== 'active') {
    throw new Error(`This verification code is already ${invite.status}. Please request a new code.`);
  }

  const crypto = await import('crypto');
  const passwordHash = crypto.createHash('sha256').update(password + 'expo_salt_2026').digest('hex');

  // 3. Mark invite as pending_approval with applicant info
  const updateRes = await db.query(`
    UPDATE committee_invites
    SET status = 'pending_approval',
        applicant_username = $1,
        applicant_name = $2,
        applicant_password_hash = $3,
        created_at = NOW()
    WHERE id = $4
    RETURNING *;
  `, [cleanUser, name, passwordHash, invite.id]);

  const r = updateRes.rows[0];
  return {
    id: r.id,
    code: r.code,
    targetCommittee: r.target_committee,
    targetRole: r.target_role,
    applicantUsername: r.applicant_username,
    applicantName: r.applicant_name,
    status: r.status
  };
}

export async function approveCommitteeInviteInDB(inviteId, approvedBy) {
  const db = getPool();
  if (!db) throw new Error('Database not connected');
  await initDatabase();

  const res = await db.query('SELECT * FROM committee_invites WHERE id = $1', [inviteId]);
  if (res.rows.length === 0) throw new Error('Verification invite not found');

  const invite = res.rows[0];
  if (!invite.applicant_username || !invite.applicant_password_hash) {
    throw new Error('No applicant details found on this invite');
  }

  // 1. Create or activate user in users table
  const userId = `usr-${invite.applicant_username}`;
  await db.query(`
    INSERT INTO users (id, username, password_hash, name, role, committee, avatar, created_at)
    VALUES ($1, $2, $3, $4, 'sub_committee', $5, '👤', NOW())
    ON CONFLICT (username) DO UPDATE SET
      password_hash = EXCLUDED.password_hash,
      name = EXCLUDED.name,
      role = 'sub_committee',
      committee = EXCLUDED.committee;
  `, [userId, invite.applicant_username, invite.applicant_password_hash, invite.applicant_name, invite.target_committee]);

  // 2. Add member to committee in committees table
  await addMemberToCommitteeInDB(invite.target_committee, {
    name: invite.applicant_name,
    role: invite.target_role,
    avatar: '👤'
  });

  // 3. Update invite status to approved
  const updatedRes = await db.query(`
    UPDATE committee_invites
    SET status = 'approved',
        approved_by = $1,
        reviewed_at = NOW()
    WHERE id = $2
    RETURNING *;
  `, [approvedBy, inviteId]);

  return updatedRes.rows[0];
}

export async function rejectCommitteeInviteInDB(inviteId, rejectedBy, reason) {
  const db = getPool();
  if (!db) throw new Error('Database not connected');
  await initDatabase();

  const res = await db.query(`
    UPDATE committee_invites
    SET status = 'rejected',
        approved_by = $1,
        rejection_reason = $2,
        reviewed_at = NOW()
    WHERE id = $3
    RETURNING *;
  `, [rejectedBy, reason || 'Registration rejected by committee president', inviteId]);

  if (res.rows.length === 0) throw new Error('Invite not found');
  return res.rows[0];
}

export async function deleteCommitteeInviteInDB(inviteId) {
  const db = getPool();
  if (!db) return false;
  await initDatabase();

  await db.query('DELETE FROM committee_invites WHERE id = $1', [inviteId]);
  return true;
}


