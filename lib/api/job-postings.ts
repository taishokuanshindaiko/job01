import type { JobPosting } from '@/types/job-posting';

export async function generateJobPosting(url: string) {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '求人情報の生成に失敗しました');
  }

  return response.json();
}

export async function getJobPosting(id: number) {
  const response = await fetch(`/api/job-postings/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '求人情報の取得に失敗しました');
  }

  return response.json();
}

export async function getAllJobPostings() {
  const response = await fetch('/api/job-postings');

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || '求人情報の一覧取得に失敗しました');
  }

  return response.json();
}