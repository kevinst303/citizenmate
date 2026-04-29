# Phase 5: Production Infrastructure & Monitoring Plan

## Objectives
1. **Error Tracking**: Integrate Sentry to capture frontend and backend errors, with source map support and Vercel integration.
2. **Product Analytics**: Integrate PostHog to capture user sessions and pageviews to better understand usage patterns.
3. **Security Hardening**: Update Content Security Policy (CSP) to permit communication with monitoring tools without compromising security.
4. **Rate Limiting**: Finalize distributed rate limiting on critical endpoints (e.g., checkout API) using Upstash Redis to prevent abuse.

## Tasks
- [x] Install `@sentry/nextjs` and `posthog-js` dependencies.
- [x] Configure Sentry clients (`sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`).
- [x] Update `next.config.ts` with `withSentryConfig` to auto-upload source maps and configure the monitoring tunnel.
- [x] Update CSP in `next.config.ts` to whitelist `*.sentry.io` and `us.i.posthog.com`.
- [x] Create `PostHogProvider` (`src/components/providers/posthog-provider.tsx`) and wrap it in the root layout (`src/app/layout.tsx`).
- [x] Enable manual pageview tracking using `usePathname` and `useSearchParams` within the `PostHogProvider`.
- [x] Apply `checkoutLimiter` to the `/api/checkout/route.ts` API route.
- [x] Verify the build succeeds (`npm run build`).

## Environment Variables Required
The following environment variables must be configured in Vercel or locally:
- `NEXT_PUBLIC_SENTRY_DSN`: Required for Sentry error tracking.
- `SENTRY_AUTH_TOKEN`: Required to upload source maps to Sentry during build.
- `NEXT_PUBLIC_POSTHOG_KEY`: Required for PostHog analytics.
- `NEXT_PUBLIC_POSTHOG_HOST`: Set to `https://us.i.posthog.com`.
- `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`: Required for distributed rate limiting.
