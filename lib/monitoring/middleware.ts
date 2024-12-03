import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { log } from './logger';

export function monitoringMiddleware(request: NextRequest) {
  const startTime = Date.now();
  const requestId = crypto.randomUUID();

  // リクエストのログ
  log.info('API Request', {
    requestId,
    method: request.method,
    url: request.url,
    headers: Object.fromEntries(request.headers),
  });

  const response = NextResponse.next();

  // レスポンスのログ
  response.headers.set('X-Request-ID', requestId);
  
  const endTime = Date.now();
  const duration = endTime - startTime;

  log.info('API Response', {
    requestId,
    duration,
    status: response.status,
  });

  return response;
}