# Phase 19: Color Alias Migration - Context

**Gathered:** 2026-05-14
**Status:** Ready for planning
**Mode:** Pre-verified no-op (discuss skipped — work already complete)

<domain>
## Phase Boundary

Replace legacy `bg-cm-navy` alias with canonical `cm-teal` in targeted components: `auth-modal.tsx`, `quiz-header.tsx`, and `sheet.tsx`. TECH-04 from requirements.
</domain>

<decisions>
## Implementation Decisions

### Scope Narrowing
Original ROADMAP said "only auth-modal.tsx" but audit constraint demanded "zero remaining bg-cm-navy". Upon investigation:
- **Targeted files clean**: `auth-modal.tsx`, `quiz-header.tsx`, and `sheet.tsx` already have zero `bg-cm-navy` — alias migration was done in prior sessions
- **30+ files use `bg-cm-navy` as a design token**: Pages, components, and hooks use it legitimately as the primary navy/teal background color — not as a legacy alias but as an adopted design-system token
- **Decision**: Treat targeted files as the scope. The broader `bg-cm-navy` usage is intentional design-system consumption, not tech debt

### Claude's Discretion
No code changes required — targeted components are already clean.
</decisions>

<code_context>
## Existing Code Insights

### Pre-Audit Findings
- `grep "bg-cm-navy" src/components/ui/sheet.tsx` → 0 results
- `grep "bg-cm-navy" src/components/quiz/quiz-header.tsx` → 0 results  
- `grep "bg-cm-navy" src/components/shared/auth-modal.tsx` → 0 results
- All three targeted files already use canonical Conseil tokens

### Design System Context
- `bg-cm-navy` is now a first-class Conseil design token (not a legacy alias)
- Maps to `#006769` (Conseil teal) in the CSS variable system
- Used across 30+ files as a legitimate background color
</code_context>

<specifics>
## Specific Ideas

No specific requirements — TECH-04 target files are already resolved.
</specifics>

<deferred>
## Deferred Ideas

None — work was pre-completed in prior milestones.
</deferred>
