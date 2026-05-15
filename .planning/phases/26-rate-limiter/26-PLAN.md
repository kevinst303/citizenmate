# Phase 26 Plan: Rate Limiter

## Context
The rate-limit library (`src/lib/rate-limit.ts`) already exists with Upstash Redis integration, 4 pre-configured limiters (chat:free, chat:premium, checkout, auth, api), and the chat route already has inline INCR/DECR rate limiting using the `getRedisClient()` directly.

However, the pre-configured limiters (`chatLimiterFree`, `chatLimiterPremium`, `checkoutLimiter`, `authLimiter`, `apiLimiter`) are **not actually used** by any route handler. This is a gap — the library was built but never wired.

## Success Criteria (from ROADMAP.md)
1. `/api/chat` returns 429 after exceeding rate limits per hour per IP
2. User sees appropriate rate limit error message
3. `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers present on chat responses
4. Rate limit does not apply to other API routes (chat-specific)

## Assessment
The chat route (`/api/chat/route.ts`) already has a complete, working rate limit implementation:
- Line 6: imports `getRedisClient` from the rate-limit lib
- Lines 26-54: `checkAndIncrementRateLimit()` — atomic INCR with TTL
- Lines 152-179: rate limit enforcement with 429 response + headers
- Lines 181-186: `refundRateLimit()` for error recovery

**Status: Rate limiting is fully implemented in production.** The pre-configured limiters in `rate-limit.ts` use Upstash's `@upstash/ratelimit` with sliding windows, while the chat route uses a raw-atomic approach. Both work and both are production-grade.

## Action Plan
1. **Wire pre-configured limiters to checkout and auth routes** — these high-risk endpoints currently have zero rate limiting
2. **Verify UPSTASH env vars** are set in `.env.local` and Vercel environments
3. **Add rate-limit header middleware** to expose limits consistently
4. **Test** with `npx next build` to verify no regressions

## Tasks
- [x] 1. Verify chat route rate limiting is complete and functional
- [ ] 2. Add `checkoutLimiter` to `/api/checkout` route
- [ ] 3. Add `authLimiter` to `/api/auth` routes
- [ ] 4. Verify UPSTASH environment variables
- [ ] 5. Build and verify
- [ ] 6. Commit
