import { z } from 'zod';
import { MESSAGES } from '@/lib/constants/messages';

export function validateUrl(url: string): boolean {
  try {
    const urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
    if (!urlRegex.test(url)) {
      throw new Error(MESSAGES.ERRORS.INVALID_URL);
    }
    return true;
  } catch {
    throw new Error(MESSAGES.ERRORS.INVALID_URL);
  }
}

export function validateApiResponse<T>(
  data: unknown, 
  schema: z.ZodSchema<T>
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      throw new Error(firstError.message || MESSAGES.ERRORS.INVALID_RESPONSE_FORMAT);
    }
    throw new Error(MESSAGES.ERRORS.INVALID_RESPONSE_FORMAT);
  }
}

export function validateJobPostingData(data: unknown): boolean {
  try {
    const schema = z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      requirements: z.string().min(1),
      benefits: z.string().min(1),
      location: z.string().min(1),
      employmentType: z.string().min(1),
      experience: z.string().min(1),
      skills: z.string().min(1),
      responsibilities: z.string().min(1),
    });

    schema.parse(data);
    return true;
  } catch (error) {
    return false;
  }
}

export function validateSkills(skills: string): string[] {
  return skills
    .split(/[、,]/)
    .map(skill => skill.trim())
    .filter(skill => skill.length >= 2);
}

export function validateSalary(salary: string): string {
  const numbers = salary.match(/\d+/g);
  if (!numbers) return '応相談';
  
  return salary.replace(
    /\d+/g, 
    num => Number(num).toLocaleString('ja-JP')
  );
}