# Phase 20: Sentry Instrumentation - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Create Sentry instrumentation files (`instrumentation.ts` and `global-error.tsx`) so that runtime errors in server components and React render trees are captured in the Sentry dashboard. Currently, Sentry SDK is configured (client/server/edge configs exist, `withSentryConfig` wraps `next.config.ts`) but no `instrumentation.ts` registers the SDK on server startup, and no `global-error.tsx` captures uncaught rendering errors.
</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Key files to create:
1. `src/instrumentation.ts` — register Sentry SDK for Node.js runtime
2. `src/app/global-error.tsx` — React error boundary with Conseil-styled fallback UI
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sentry.client.config.ts` — Client-side Sentry init with DSN, replay integration, 10% tracesSampleRate
- `sentry.server.config.ts` — Server-side Sentry init with DSN, 10% tracesSampleRate
- `sentry.edge.config.ts` — Edge runtime Sentry init with DSN, 10% tracesSampleRate
- `next.config.ts` — `withSentryConfig()` wrapper with org/project, tunnelRoute: "/monitoring"

### Established Patterns
- All Sentry configs use `process.env.NEXT_PUBLIC_SENTRY_DSN` (same DSN for client + server)
- `debug: false` in all environments
- `tracesSampleRate: 0.1` in production, `1.0` in development
- `withSentryConfig` configured with `silent: !process.env.CI`, `widenClientFileUpload: true`, `tunnelRoute: "/monitoring"`, `reactComponentAnnotation: { enabled: true }`

### Integration Points
- `next.config.ts` wraps the entire config in `withSentryConfig` — no changes needed there
- CSP in `middleware.ts` already allows Sentry domains
- `@sentry/nextjs` is already a dependency in `package.json`
</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase. The `instrumentation.ts` pattern is standardized by Next.js: export a `register()` function that calls `Sentry.init()`.
</specifics>

<deferred>
## Deferred Ideas

None.
</deferred>
