import type { ClaudeConfig, ClaudeMessage, ClaudeResponse } from './types';
import { CLAUDE_CONFIG } from './config';
import { MESSAGES } from '@/lib/constants/messages';

export async function callClaudeAPI(
  messages: ClaudeMessage[],
  config: Partial<ClaudeConfig> = {}
): Promise<ClaudeResponse> {
  const mergedConfig = { ...CLAUDE_CONFIG, ...config };

  try {
    const response = await fetch(mergedConfig.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01',
        'x-api-key': mergedConfig.apiKey,
      },
      body: JSON.stringify({
        model: mergedConfig.model,
        max_tokens: mergedConfig.maxTokens,
        temperature: mergedConfig.temperature,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || MESSAGES.ERRORS.API_REQUEST_FAILED);
    }

    return response.json();
  } catch (error) {
    console.error('Claude API呼び出しエラー:', error);
    throw new Error(MESSAGES.ERRORS.API_REQUEST_FAILED);
  }
}

export function extractJSONFromResponse(response: ClaudeResponse): Record<string, unknown> {
  if (!response.content?.[0]?.text) {
    throw new Error(MESSAGES.ERRORS.INVALID_RESPONSE_FORMAT);
  }

  try {
    const jsonMatch = response.content[0].text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(MESSAGES.ERRORS.PARSING_ERROR);
    }

    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('JSONパースエラー:', error);
    throw new Error(MESSAGES.ERRORS.PARSING_ERROR);
  }
}