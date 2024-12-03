import { NextResponse } from 'next/server';
import { log } from '@/lib/monitoring/logger';
import { rateLimit } from '@/lib/api/rate-limit';

export async function GET(request: Request) {
  try {
    // レート制限のチェック
    const rateLimitResult = await rateLimit.check(request);
    if (!rateLimitResult.success) {
      log.warn('Rate limit exceeded', {
        ip: request.headers.get('x-forwarded-for'),
      });
      
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // システムの状態を取得
    const status = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    };

    log.info('System status check', status);

    return NextResponse.json({
      success: true,
      data: status,
    });
  } catch (error) {
    log.error('Error in monitoring endpoint', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}