import { NextResponse } from 'next/server';
import { log } from '@/lib/monitoring/logger';
import { rateLimit } from '@/lib/api/rate-limit';
import { z } from 'zod';

const metricSchema = z.object({
  metrics: z.array(z.object({
    name: z.string(),
    value: z.number(),
    timestamp: z.string(),
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
    const { metrics } = metricSchema.parse(body);

    // メトリクスの処理
    metrics.forEach((metric) => {
      log.info(`Metric: ${metric.name}`, {
        value: metric.value,
        timestamp: metric.timestamp,
        tags: metric.tags,
      });
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing metrics:', error);
    return NextResponse.json(
      { error: 'Failed to process metrics' },
      { status: 500 }
    );
  }
}