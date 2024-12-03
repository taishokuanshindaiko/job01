import { callClaudeAPI, extractJSONFromResponse } from '../api';
import { SYSTEM_PROMPTS, USER_PROMPTS } from '../prompts';
import { jobPostingSchema } from '@/lib/validations/job-posting';
import { MESSAGES } from '@/lib/constants/messages';
import type { JobPostingInput } from '@/types/job-posting';

export async function generateJobPostingWithClaude(url: string): Promise<JobPostingInput> {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPTS.JOB_POSTING },
      { role: 'user', content: USER_PROMPTS.GENERATE_JOB_POSTING(url) },
    ];

    const response = await callClaudeAPI(messages);
    const jsonData = extractJSONFromResponse(response);
    const validatedData = jobPostingSchema.parse(jsonData);

    return validatedData;
  } catch (error) {
    console.error('Claude APIによる求人情報生成エラー:', error);
    throw new Error(MESSAGES.ERRORS.GENERATION_FAILED);
  }
}