import { z } from 'zod';

const envSchema = z.object({
  CLAUDE_API_KEY: z.string().min(1, 'Claude API Key is required'),
  CLAUDE_API_URL: z.string().url('Valid Claude API URL is required'),
  DATABASE_URL: z.string().min(1, 'Database URL is required'),
});

export function validateEnv() {
  try {
    return envSchema.parse({
      CLAUDE_API_KEY: process.env.CLAUDE_API_KEY,
      CLAUDE_API_URL: process.env.CLAUDE_API_URL,
      DATABASE_URL: process.env.DATABASE_URL,
    });
  } catch (error) {
    console.error('Invalid environment variables:', error);
    throw new Error('環境変数の設定が無効です。.env.localファイルを確認してください。');
  }
}