import { validateEnv } from '@/lib/config/env';
import type { ClaudeConfig } from './types';

const { CLAUDE_API_KEY, CLAUDE_API_URL } = validateEnv();

export const CLAUDE_CONFIG: ClaudeConfig = {
  apiKey: CLAUDE_API_KEY,
  apiUrl: CLAUDE_API_URL,
  model: 'claude-3-sonnet-20240229',
  maxTokens: 4096,
  temperature: 0.7,
};