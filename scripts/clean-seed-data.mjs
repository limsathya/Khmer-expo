import dotenv from 'dotenv';
import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;
console.log('Connecting to database...');

const pool = new pg.Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  const client = await pool.connect();
  try {
    console.log('Connected successfully!');

    // Clean seed events
    const delEvents = await client.query('DELETE FROM events;');
    console.log(`Deleted events: ${delEvents.rowCount}`);

    // Clean seed invites
    const delInvites = await client.query('DELETE FROM committee_invites;');
    console.log(`Deleted invites: ${delInvites.rowCount}`);

    // Clean mock seed user usr-admin if exists
    const delAdmin = await client.query("DELETE FROM users WHERE id = 'usr-admin' OR username = 'admin';");
    console.log(`Deleted usr-admin mock users: ${delAdmin.rowCount}`);

    // Reset committee members to empty array and member_count to 0
    const updateCommittees = await client.query(`
      UPDATE committees 
      SET members = '[]'::jsonb, member_count = 0;
    `);
    console.log(`Reset committees members: ${updateCommittees.rowCount}`);

    // Check counts
    const eventsCount = await client.query('SELECT COUNT(*) FROM events;');
    const usersCount = await client.query('SELECT COUNT(*) FROM users;');
    const invitesCount = await client.query('SELECT COUNT(*) FROM committee_invites;');
    const committeesCount = await client.query('SELECT COUNT(*) FROM committees;');
    const users = await client.query('SELECT id, username, name, role, committee FROM users;');
    const committees = await client.query('SELECT id, name, member_count, jsonb_array_length(members) as m_len FROM committees ORDER BY id;');

    console.log('\n--- FINAL DATABASE STATE ---');
    console.log(`Events count: ${eventsCount.rows[0].count}`);
    console.log(`Users count: ${usersCount.rows[0].count}`);
    console.log(`Invites count: ${invitesCount.rows[0].count}`);
    console.log(`Committees count: ${committeesCount.rows[0].count}`);
    console.log('\nUsers in DB:', users.rows);
    console.log('\nCommittees in DB:');
    for (const c of committees.rows) {
      console.log(` - [${c.id}] ${c.name}: member_count=${c.member_count}, members_len=${c.m_len}`);
    }
    console.log('\nSeed data cleanup completed successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(err => {
  console.error('Error during cleanup:', err);
  process.exit(1);
});
