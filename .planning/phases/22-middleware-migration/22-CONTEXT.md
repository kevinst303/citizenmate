# Phase 22: Middleware Migration - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure refactor — discuss skipped)

<domain>
## Phase Boundary

Migrate `src/middleware.ts` → `src/proxy.ts` per Next.js 16 convention. The existing middleware handles locale detection, auth protection, CSP headers, and referral tracking. All logic is preserved — this is a file rename with adjusted export structure.

The existing `config.matcher` pattern is preserved exactly.
</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure refactor.
- Create `src/proxy.ts` as a drop-in replacement for `src/middleware.ts`
- Preserve all existing logic: locale detection, auth gating, CSP nonce generation, referral cookie
- Keep `src/middleware.ts` as a re-export for backward compatibility during transition
</decisions>

<code_context>
## Existing Code Insights

### Files to modify/create
- `citizenmate/src/proxy.ts` (new — primary proxy file)
- `citizenmate/src/middleware.ts` (modify — re-export from proxy.ts)

### Existing middleware capabilities (all preserved)
- CSP nonce generation + header injection
- Locale auto-detection (negotiator + cookie)
- Supabase server-side auth check
- Protected route gating (/dashboard, /practice, /study, /admin)
- Protected API route gating (/api/admin, /api/checkout)
- Referral cookie ingestion (?ref= parameter)
- Malformed URL sanitization (null byte/CRLF detection)
</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.
</specifics>

<deferred>
## Deferred Ideas

None.
</deferred>
