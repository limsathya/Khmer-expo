import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { getPool, initDatabase } from './db';

const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const INITIAL_USERS = [];

export function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'expo_salt_2026').digest('hex');
}

function ensureUsersFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readUsersFromFile() {
  try {
    ensureUsersFile();
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users:', err);
    return [];
  }
}

function writeUsersToFile(users) {
  try {
    ensureUsersFile();
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing users:', err);
  }
}

function mapRowToUser(row) {
  return {
    id: row.id,
    username: row.username,
    passwordHash: row.password_hash || row.passwordHash,
    name: row.name,
    role: row.role,
    committee: row.committee || (row.role === 'admin' ? 'Executive Steering Committee' : 'None'),
    avatar: row.avatar,
    createdAt: row.created_at
  };
}

export async function readUsers() {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const res = await db.query('SELECT * FROM users');
      return res.rows.map(mapRowToUser);
    } catch (err) {
      console.warn('Supabase users query failed, falling back to local file:', err.message);
    }
  }

  return readUsersFromFile();
}

export async function authenticateUser(username, password) {
  if (!username || !password) return null;
  const lower = username.toLowerCase().trim();
  const hash = hashPassword(password);

  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const res = await db.query(
        'SELECT * FROM users WHERE LOWER(username) = $1',
        [lower]
      );
      if (res.rows.length > 0) {
        const user = mapRowToUser(res.rows[0]);
        if (user.passwordHash === hash) {
          const { passwordHash, ...safeUser } = user;
          return safeUser;
        }
        return null;
      }
    } catch (err) {
      console.warn('Supabase auth query failed, trying local file:', err.message);
    }
  }

  const users = readUsersFromFile();
  const user = users.find(u => u.username.toLowerCase() === lower);

  if (!user) return null;
  if (user.passwordHash !== hash) return null;

  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export async function registerUser({ username, password, name }) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }
  const lowerUser = username.toLowerCase().trim();
  const hash = hashPassword(password);

  const newUser = {
    id: `usr-${Date.now()}`,
    username: lowerUser,
    passwordHash: hash,
    name: name || username,
    role: 'user',
    committee: 'None (External Exhibitor)',
    avatar: '👤',
    createdAt: new Date().toISOString()
  };

  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      const existing = await db.query(
        'SELECT id FROM users WHERE LOWER(username) = $1',
        [lowerUser]
      );
      if (existing.rows.length > 0) {
        throw new Error('Username already exists');
      }

      await db.query(`
        INSERT INTO users (id, username, password_hash, name, role, committee, avatar, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [newUser.id, newUser.username, newUser.passwordHash, newUser.name, newUser.role, newUser.committee, newUser.avatar, newUser.createdAt]);

      const { passwordHash, ...safeUser } = newUser;
      return safeUser;
    } catch (err) {
      if (err.message === 'Username already exists') throw err;
      console.warn('Supabase register failed, trying local file:', err.message);
    }
  }

  const users = readUsersFromFile();
  if (users.some(u => u.username.toLowerCase() === lowerUser)) {
    throw new Error('Username already exists');
  }

  users.push(newUser);
  writeUsersToFile(users);

  const { passwordHash, ...safeUser } = newUser;
  return safeUser;
}

export function createAuthToken(user) {
  // Use cryptographically signed HMAC token
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role,
    committee: user.committee,
    name: user.name,
    timestamp: Date.now()
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', process.env.AUTH_SECRET || 'expo_salt_2026').update(payloadStr).digest('base64url');
  return `${payloadStr}.${sig}`;
}

export async function verifyAuthToken(token) {
  try {
    if (!token || typeof token !== 'string') return null;

    let payload = null;

    // 1. Verify modern signed token format (payload.sig)
    if (token.includes('.')) {
      const [payloadStr, sig] = token.split('.');
      const expected = crypto.createHmac('sha256', process.env.AUTH_SECRET || 'expo_salt_2026').update(payloadStr).digest('base64url');
      if (crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
        payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
      }
    } else {
      // 2. Backward compatibility for legacy unsigned base64 token
      const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
      payload = JSON.parse(jsonStr);
    }

    if (!payload) return null;

    // Token valid for 7 days
    if (Date.now() - (payload.timestamp || (payload.iat ? payload.iat * 1000 : 0)) > 7 * 24 * 60 * 60 * 1000) {
      return null;
    }

    const db = getPool();
    if (db) {
      try {
        const res = await db.query('SELECT * FROM users WHERE id = $1', [payload.id]);
        if (res.rows.length > 0) {
          const user = mapRowToUser(res.rows[0]);
          const { passwordHash, ...safeUser } = user;
          return safeUser;
        }
      } catch (err) {
        console.warn('Supabase verifyToken failed, trying local:', err.message);
      }
    }

    const users = readUsersFromFile();
    const user = users.find(u => u.id === payload.id);
    if (!user) return null;

    const { passwordHash, ...safeUser } = user;
    return safeUser;
  } catch {
    return null;
  }
}

export async function getAllSafeUsers() {
  const users = await readUsers();
  return users.map(({ passwordHash, ...safeUser }) => safeUser);
}

export async function updateUserInDB(id, updates) {
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
      if (updates.role !== undefined) {
        fields.push(`role = $${idx++}`);
        values.push(updates.role);
      }
      if (updates.committee !== undefined) {
        fields.push(`committee = $${idx++}`);
        values.push(updates.committee);
      }
      if (updates.avatar !== undefined) {
        fields.push(`avatar = $${idx++}`);
        values.push(updates.avatar);
      }
      if (updates.password) {
        fields.push(`password_hash = $${idx++}`);
        values.push(hashPassword(updates.password));
      }

      if (fields.length > 0) {
        values.push(id);
        const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`;
        const res = await db.query(query, values);
        if (res.rows.length > 0) {
          const user = mapRowToUser(res.rows[0]);
          const { passwordHash, ...safeUser } = user;
          return safeUser;
        }
      }
    } catch (err) {
      console.warn('Supabase updateUser failed, falling back:', err.message);
    }
  }

  const users = readUsersFromFile();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    if (updates.name !== undefined) users[index].name = updates.name;
    if (updates.role !== undefined) users[index].role = updates.role;
    if (updates.committee !== undefined) users[index].committee = updates.committee;
    if (updates.avatar !== undefined) users[index].avatar = updates.avatar;
    if (updates.password) users[index].passwordHash = hashPassword(updates.password);
    writeUsersToFile(users);
    const { passwordHash, ...safeUser } = users[index];
    return safeUser;
  }
  return null;
}

export async function deleteUserInDB(id) {
  const db = getPool();
  if (db) {
    try {
      await initDatabase();
      await db.query('DELETE FROM users WHERE id = $1', [id]);
      return true;
    } catch (err) {
      console.warn('Supabase deleteUser failed, falling back:', err.message);
    }
  }

  const users = readUsersFromFile();
  const index = users.findIndex(u => u.id === id);
  if (index !== -1) {
    users.splice(index, 1);
    writeUsersToFile(users);
    return true;
  }
  return false;
}
