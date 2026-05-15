# Phase 21: Build Warnings Resolution - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

Resolve the two production build warnings reported during the 2026-05-15 audit:
1. `metadataBase` — Next.js warns when metadataBase is not set in layouts
2. `outputFileTracingRoot` — Next.js warns about output file tracing configuration

These are configuration-only changes — no user-facing impact, no UX changes.
</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Read the current `next.config.ts` and the 6 page layouts to determine where to add `metadataBase`.
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `next.config.ts` — already has `outputFileTracingRoot` might just need configuration adjustment
- 6 page layouts in `src/app/[lang]/` — each exports metadata, needs `metadataBase` added

### Integration Points
- `next.config.ts` line 35: `outputFileTracingRoot` setting area
- Page layouts: `layout.tsx` files in route groups
</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.
</specifics>

<deferred>
## Deferred Ideas

None.
</deferred>
