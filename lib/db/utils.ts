import { db } from './client';
import { jobPostings } from './schema';
import { eq } from 'drizzle-orm';
import type { JobPosting } from '@/types/job-posting';

export async function createJobPosting(data: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const timestamp = Date.now();
    const result = await db.insert(jobPostings).values({
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).returning();

    return { success: true, data: result[0] };
  } catch (error) {
    console.error('Error creating job posting:', error);
    return { success: false, error: 'Failed to create job posting' };
  }
}

export async function getJobPosting(id: number) {
  try {
    const result = await db.select().from(jobPostings).where(eq(jobPostings.id, id));
    return result[0] ?? null;
  } catch (error) {
    console.error('Error fetching job posting:', error);
    return null;
  }
}

export async function getAllJobPostings() {
  try {
    return await db.select().from(jobPostings).orderBy(jobPostings.createdAt);
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return [];
  }
}