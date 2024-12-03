import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { MESSAGES } from '@/lib/constants/messages';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  options: ResponseInit = {}
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    {
      status: 200,
      headers: {
        'Cache-Control': 'private, no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      ...options,
    }
  );
}

export function createErrorResponse(
  error: unknown,
  status: number = 500
): NextResponse<ApiResponse<never>> {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: error.errors[0].message,
      },
      { status: 400 }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: MESSAGES.ERRORS.UNKNOWN_ERROR,
    },
    { status }
  );
}