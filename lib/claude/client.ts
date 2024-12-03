import { MESSAGES } from '@/lib/constants/messages';
import { jobPostingSchema } from '@/lib/validations/job-posting';
import type { JobPostingInput } from '@/lib/validations/job-posting';
import { SYSTEM_PROMPTS, USER_PROMPTS } from './prompts';
import { callClaudeAPI, extractJSONFromResponse } from './api';

export async function generateJobPostingWithClaude(url: string): Promise<JobPostingInput> {
  try {
    const messages = [
      { role: 'system', content: SYSTEM_PROMPTS.JOB_POSTING },
      { role: 'user', content: USER_PROMPTS.GENERATE_JOB_POSTING(url) },
    ];

    const response = await callClaudeAPI(messages);
    const jsonData = extractJSONFromResponse(response);
    
    return jobPostingSchema.parse(jsonData);
  } catch (error) {
    console.error('Error in generateJobPostingWithClaude:', error);
    throw error instanceof Error ? error : new Error(MESSAGES.ERRORS.GENERATION_FAILED);
  }
}