"use client"

import type { JobPosting } from '@/types/job-posting';

const STORAGE_KEY = 'job-postings';

interface StorageResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export function saveJobPosting(
  jobPosting: Omit<JobPosting, 'id' | 'createdAt' | 'updatedAt'>
): StorageResult<JobPosting> {
  try {
    const timestamp = Date.now();
    const newJobPosting: JobPosting = {
      ...jobPosting,
      id: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    
    localStorage.setItem(
      `${STORAGE_KEY}-${newJobPosting.id}`, 
      JSON.stringify(newJobPosting)
    );
    
    return { success: true, data: newJobPosting };
  } catch (error) {
    console.error('Error saving job posting:', error);
    return { 
      success: false, 
      error: 'データの保存に失敗しました。ブラウザの設定を確認してください。' 
    };
  }
}

export function getJobPosting(id: number): StorageResult<JobPosting | null> {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}-${id}`);
    if (!data) return { success: true, data: null };
    
    return { success: true, data: JSON.parse(data) };
  } catch (error) {
    console.error('Error fetching job posting:', error);
    return { 
      success: false, 
      error: 'データの取得に失敗しました。' 
    };
  }
}

export function getAllJobPostings(): StorageResult<JobPosting[]> {
  try {
    const jobPostings: JobPosting[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY)) {
        const data = localStorage.getItem(key);
        if (data) {
          jobPostings.push(JSON.parse(data));
        }
      }
    }
    
    return { 
      success: true, 
      data: jobPostings.sort((a, b) => b.createdAt - a.createdAt) 
    };
  } catch (error) {
    console.error('Error fetching job postings:', error);
    return { 
      success: false, 
      error: 'データの取得に失敗しました。' 
    };
  }
}