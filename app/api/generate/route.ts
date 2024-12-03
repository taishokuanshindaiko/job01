import { generateJobPostingWithClaude } from '@/lib/claude/services/job-posting';
import { createJobPosting } from '@/lib/db/repositories/job-posting';
import { createSuccessResponse, createErrorResponse } from '@/lib/api/response';
import { MESSAGES } from '@/lib/constants/messages';
import { jobPostingSchema } from '@/lib/validations/job-posting';
import { rateLimit } from '@/lib/api/rate-limit';
import { z } from 'zod';

const requestSchema = z.object({
  url: z.string().url(MESSAGES.ERRORS.INVALID_URL),
});

export async function POST(request: Request) {
  try {
    // レート制限のチェック
    const rateLimitResult = await rateLimit.check(request);
    if (!rateLimitResult.success) {
      return createErrorResponse(
        new Error(MESSAGES.ERRORS.RATE_LIMIT_EXCEEDED),
        429
      );
    }

    // リクエストのバリデーション
    const body = await request.json();
    const { url } = requestSchema.parse(body);

    console.log('URLから求人情報を生成中:', url);
    const jobPostingData = await generateJobPostingWithClaude(url);
    console.log('生成された求人情報:', jobPostingData);

    // 生成されたデータのバリデーション
    const validatedData = jobPostingSchema.parse(jobPostingData);

    // データベースへの保存
    const result = await createJobPosting(validatedData);
    if (!result.success) {
      throw new Error(result.error);
    }

    return createSuccessResponse(
      result.data,
      MESSAGES.SUCCESS.GENERATION_COMPLETE
    );
  } catch (error) {
    console.error('求人情報生成APIエラー:', error);
    return createErrorResponse(error);
  }
}