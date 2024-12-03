import { NextResponse } from 'next/server';
import { monitoringService } from '@/lib/monitoring/services/monitoring';
import { customMetricSchema } from '@/lib/monitoring/types';
import { rateLimit } from '@/lib/api/rate-limit';
import { z } from 'zod';

const updateSchema = z.object({
  value: z.number(),
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
    const metric = customMetricSchema.parse(body);

    monitoringService.addCustomMetric(metric);

    return NextResponse.json({
      success: true,
      data: metric,
    });
  } catch (error) {
    console.error('Error adding custom metric:', error);
    return NextResponse.json(
      { error: 'Failed to add custom metric' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const metrics = monitoringService.getCustomMetrics();
    return NextResponse.json({
      success: true,
      data: metrics,
    });
  } catch (error) {
    console.error('Error fetching custom metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom metrics' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const rateLimitResult = await rateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Metric ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { value } = updateSchema.parse(body);

    monitoringService.updateCustomMetric(id, value);

    return NextResponse.json({
      success: true,
      message: 'Metric updated successfully',
    });
  } catch (error) {
    console.error('Error updating custom metric:', error);
    return NextResponse.json(
      { error: 'Failed to update custom metric' },
      { status: 500 }
    );
  }
}