import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// ===== Distributed Rate Limiter =====
// Uses Upstash Redis for rate limiting across serverless instances.
// Falls back to a permissive no-op limiter if Upstash is not configured
// (allows local development without Redis).

// ── Redis client (shared singleton) ──

function getRedisClient(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return null;
  }

  return new Redis({ url, token });
}

// ── Rate Limiter Factory ──

export type RateLimitConfig = {
  /** Max requests allowed in the window */
  maxRequests: number;
  /** Window duration string (e.g. '1 h', '15 m', '1 d') */
  window: `${number} ${'ms' | 's' | 'm' | 'h' | 'd'}`;
  /** Prefix for the Redis key (e.g. 'chat', 'checkout', 'auth') */
  prefix: string;
};

/**
 * Creates a distributed rate limiter using Upstash Redis sliding window.
 * Returns a `limit` function that takes an identifier and returns
 * { success, limit, remaining, reset }.
 *
 * If Upstash is not configured (dev mode), returns a permissive no-op.
 */
export function createRateLimiter(config: RateLimitConfig) {
  const redis = getRedisClient();

  if (!redis) {
    // Dev/fallback: always allow
    console.warn(
      `[rate-limit] Upstash not configured — "${config.prefix}" limiter is permissive (dev mode)`
    );
    return {
      limit: async (_identifier: string) => ({
        success: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: Date.now() + 60_000,
      }),
    };
  }

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.maxRequests, config.window),
    prefix: `citizenmate:ratelimit:${config.prefix}`,
    analytics: true, // enables Upstash dashboard analytics
  });

  return {
    limit: async (identifier: string) => limiter.limit(identifier),
  };
}

// ── Pre-configured Limiters ──

/** AI Tutor chat: 20 req/hr for free, 100 req/hr for premium */
export const chatLimiterFree = createRateLimiter({
  maxRequests: 20,
  window: '1 h',
  prefix: 'chat:free',
});

export const chatLimiterPremium = createRateLimiter({
  maxRequests: 100,
  window: '1 h',
  prefix: 'chat:premium',
});

/** Checkout API: 5 req/hr to prevent abuse */
export const checkoutLimiter = createRateLimiter({
  maxRequests: 5,
  window: '1 h',
  prefix: 'checkout',
});

/** Auth attempts: 10 req/15min to prevent brute force */
export const authLimiter = createRateLimiter({
  maxRequests: 10,
  window: '15 m',
  prefix: 'auth',
});

/** General API: 60 req/min */
export const apiLimiter = createRateLimiter({
  maxRequests: 60,
  window: '1 m',
  prefix: 'api',
});
