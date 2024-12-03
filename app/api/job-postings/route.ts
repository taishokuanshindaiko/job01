import { NextResponse } from 'next/server';
import { createJobPosting, getAllJobPostings } from '@/lib/db/repositories/job-posting';
import { jobPostingSchema } from '@/lib/validations/job-posting';
import { MESSAGES } from '@/lib/constants/messages';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = jobPostingSchema.parse(body);
    
    const result = await createJobPosting(validatedData);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      message: MESSAGES.SUCCESS.SAVED_TO_DATABASE,
    });
  } catch (error) {
    console.error('求人情報の作成APIエラー:', error);
    return NextResponse.json(
      { error: MESSAGES.ERRORS.DATABASE_ERROR },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const result = await getAllJobPostings();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    console.error('求人情報の取得APIエラー:', error);
    return NextResponse.json(
      { error: MESSAGES.ERRORS.DATABASE_ERROR },
      { status: 500 }
    );
  }
}