import { db } from '../client';
import { jobPostings } from '../schema';
import { eq } from 'drizzle-orm';
import type { JobPosting, JobPostingInput } from '@/types/job-posting';
import { MESSAGES } from '@/lib/constants/messages';

export async function createJobPosting(data: JobPostingInput) {
  try {
    const timestamp = Date.now();
    const [result] = await db.insert(jobPostings).values({
      ...data,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).returning();

    return { 
      success: true, 
      data: result as JobPosting 
    };
  } catch (error) {
    console.error('求人情報の作成に失敗:', error);
    return { 
      success: false, 
      error: MESSAGES.ERRORS.DATABASE_ERROR 
    };
  }
}

export async function getJobPosting(id: number) {
  try {
    const [result] = await db
      .select()
      .from(jobPostings)
      .where(eq(jobPostings.id, id));
    
    return { 
      success: true, 
      data: result as JobPosting | undefined 
    };
  } catch (error) {
    console.error('求人情報の取得に失敗:', error);
    return { 
      success: false, 
      error: MESSAGES.ERRORS.DATABASE_ERROR 
    };
  }
}

export async function getAllJobPostings() {
  try {
    const results = await db
      .select()
      .from(jobPostings)
      .orderBy(jobPostings.createdAt);
    
    return { 
      success: true, 
      data: results as JobPosting[] 
    };
  } catch (error) {
    console.error('求人情報の一覧取得に失敗:', error);
    return { 
      success: false, 
      error: MESSAGES.ERRORS.DATABASE_ERROR 
    };
  }
}