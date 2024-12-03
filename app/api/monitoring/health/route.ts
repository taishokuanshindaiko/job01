import { NextResponse } from 'next/server';
import { monitoringService } from '@/lib/monitoring/services/monitoring';
import { rateLimit } from '@/lib/api/rate-limit';

export async function GET(request: Request) {
  try {
    const rateLimitResult = await rateLimit.check(request);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    const metrics = monitoringService.getSystemMetrics();

    return NextResponse.json({
      success: true,
      data: {
        status: 'healthy',
        ...metrics,
      },
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Health check failed',
        status: 'unhealthy',
      },
      { status: 500 }
    );
  }
}