# Phase 15: Dashboard Refactor - Context

**Gathered:** 2026-05-13
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped per smart-discuss rules)

<domain>
## Phase Boundary

Extract the monolithic `src/app/[lang]/dashboard/page.tsx` (~712 LOC) into modular, typed components that each own a single responsibility, while preserving identical rendering. The refactored page.tsx should be ≤150 LOC acting purely as a layout orchestrator.

**Extraction targets:**
- `ReadinessPanel` — Readiness score calculation, ring visualization, stat pills
- `TopicMasteryGrid` — Mastery list with progress bars
- `QuickActions` — Recommended action links
- `StatsSummary` — Gauge and stat cards
- `TestDateCard` — Calendar integration and countdown

All component files will live in `src/components/dashboard/`.
</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Key constraints:
- Zero regression in functionality or rendering
- All extracted components use explicit TypeScript interfaces for props (imported from `@/lib/readiness` or locally defined)
- Retain existing Conseil design system tokens and responsive layout classes (`grid`, `gap-6`, `max-w-6xl`)
- `use client` directive must be respected per component boundary
- Page must remain a server component; extracted sub-components will be client components where needed
</decisions>

<code_context>
## Existing Code Insights

### Key Source Files
- `src/app/[lang]/dashboard/page.tsx` — Monolithic dashboard (~712 LOC) using hooks: `useStudy`, `useTestDate`, `useAuth`, `useT`
- `src/components/dashboard/streak-card.tsx` — Established component pattern with framer-motion animations
- `src/lib/dashboard-config.ts` — Icons, colors, accents configuration
- `src/lib/readiness.ts` — ReadinessData, QuizResult, TopicMastery interfaces
- `src/lib/insights.ts` — AI insight generation logic

### Established Patterns
- Components use framer-motion for entrance animations
- Tailwind with Conseil design tokens for styling
- TypeScript interfaces defined in `@/lib/` or locally
- `use client` boundary at component level for interactive elements

### Integration Points
- Dashboard route: `/[lang]/dashboard`
- Hooks: `useStudy`, `useTestDate`, `useAuth`, `useT` (next-intl)
- Utility libs: `@/lib/readiness`, `@/lib/insights`, `@/lib/dashboard-config`
</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond ROADMAP success criteria — infrastructure refactor phase.
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.
</deferred>
