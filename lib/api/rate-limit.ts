import { Redis } from '@upstash/redis';

const RATE_LIMIT = {
  WINDOW_SIZE: 60 * 1000, // 1分
  MAX_REQUESTS: 10, // 1分あたりの最大リクエスト数
};

class RateLimit {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });
  }

  async check(request: Request): Promise<{ success: boolean; remaining?: number }> {
    try {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const key = `rate-limit:${ip}`;
      const now = Date.now();
      const windowStart = now - RATE_LIMIT.WINDOW_SIZE;

      // 古いリクエストを削除し、新しいリクエストを追加
      await this.redis.zremrangebyscore(key, 0, windowStart);
      await this.redis.zadd(key, { score: now, member: now.toString() });
      await this.redis.expire(key, 60); // TTLを60秒に設定

      // 現在のウィンドウ内のリクエスト数を取得
      const requestCount = await this.redis.zcount(key, windowStart, now);

      if (requestCount > RATE_LIMIT.MAX_REQUESTS) {
        return { success: false };
      }

      return {
        success: true,
        remaining: RATE_LIMIT.MAX_REQUESTS - requestCount,
      };
    } catch (error) {
      console.error('Rate limit check error:', error);
      return { success: true }; // エラー時はレート制限をスキップ
    }
  }
}

export const rateLimit = new RateLimit();