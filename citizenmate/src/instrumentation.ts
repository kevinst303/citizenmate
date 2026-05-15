/**
 * Next.js Instrumentation Hook — Sentry Server-Side Initialization
 *
 * This file registers the Sentry SDK when the Next.js server starts,
 * enabling error capture for API routes, server components, and
 * server-side rendering.
 *
 * Required by: Next.js instrumentation convention
 * Docs: https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */

export async function register() {
  // Only initialize in Node.js runtime (not edge)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const Sentry = await import("@sentry/nextjs");

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

      // Match existing sentry.server.config.ts sampling rates
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

      // Match existing sentry.server.config.ts debug setting
      debug: false,
    });
  }
}
