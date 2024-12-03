import { monitoringMiddleware } from '@/lib/monitoring/middleware';

export function middleware(request: Request) {
  return monitoringMiddleware(request);
}

export const config = {
  matcher: '/api/:path*',
};