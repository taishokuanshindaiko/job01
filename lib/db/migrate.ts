import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';
import { sql } from 'drizzle-orm';

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL環境変数が設定されていません');
  }

  console.log('データベース接続を作成中...');
  
  const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  const db = drizzle(client, { schema });

  console.log('マイグレーションを実行中...');

  try {
    await db.run(sql`
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

    console.log('マイグレーションが正常に完了しました');
  } catch (error) {
    console.error('マイグレーションに失敗しました:', error);
    process.exit(1);
  }

  await client.close();
  process.exit(0);
}

main().catch((error) => {
  console.error('マイグレーションスクリプトが失敗しました:', error);
  process.exit(1);
});