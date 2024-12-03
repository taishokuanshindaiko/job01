import { NextResponse } from 'next/server';
import { getJobPosting } from '@/lib/db/repositories/job-posting';
import { MESSAGES } from '@/lib/constants/messages';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const result = await getJobPosting(id);
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    if (!result.data) {
      return NextResponse.json(
        { error: '求人情報が見つかりません' },
        { status: 404 }
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