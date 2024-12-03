import { NextResponse } from 'next/server';
import { log } from '@/lib/monitoring/logger';
import { rateLimit } from '@/lib/api/rate-limit';
import { LogEntry } from '@/lib/monitoring/types';
import { z } from 'zod';

const logEntrySchema = z.object({
  logs: z.array(z.object({
    level: z.enum(['debug', 'info', 'warn', 'error']),
    message: z.string(),
    timestamp: z.string(),
    context: z.record(z.unknown()).optional(),
    error: z.object({
      name: z.string(),
      message: z.string(),
      stack: z.string().optional(),
    }).optional(),
    tags: z.array(z.string()).optional(),
  })),
});

export async function POST(request: Request) {
  try {
    const rateLimitResult = await rateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { logs } = logEntrySchema.parse(body);

    // ログの処理
    logs.forEach((logEntry: LogEntry) => {
      log[logEntry.level](logEntry.message, {
        ...logEntry.context,
        timestamp: logEntry.timestamp,
        tags: logEntry.tags,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing logs:', error);
    return NextResponse.json(
      { error: 'Failed to process logs' },
      { status: 500 }
    );
  }
}