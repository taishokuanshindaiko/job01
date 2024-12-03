import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!process.env.DATABASE_AUTH_TOKEN) {
    throw new Error('DATABASE_AUTH_TOKEN is not set');
  }

  console.log('Creating database connection...');
  
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client, { schema });

  console.log('Running migrations...');

  try {
    await db.run(`
      CREATE TABLE IF NOT EXISTS job_postings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_url TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        requirements TEXT NOT NULL,
        benefits TEXT NOT NULL,
        location TEXT NOT NULL,
        salary TEXT,
        employment_type TEXT NOT NULL,
        experience TEXT NOT NULL,
        education TEXT,
        skills TEXT NOT NULL,
        responsibilities TEXT NOT NULL,
        department TEXT,
        contact_info TEXT,
        application_deadline TEXT,
        created_at INTEGER NOT NULL DEFAULT (unixepoch()),
        updated_at INTEGER NOT NULL DEFAULT (unixepoch())
      );
    `);

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }

  await client.close();
  process.exit(0);
}

main().catch((error) => {
  console.error('Migration script failed:', error);
  process.exit(1);
});