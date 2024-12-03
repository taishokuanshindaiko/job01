import type { Config } from 'drizzle-kit';

export const dbConfig: Config = {
  schema: './lib/db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: 'local.db'
  },
};