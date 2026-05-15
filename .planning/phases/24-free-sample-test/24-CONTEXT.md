# Phase 24: Free Sample Test (Conversion Funnel) - Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Mode:** Auto-generated (conversion funnel gap)

<domain>
## Phase Boundary

Currently, `[lang]/practice/page.tsx` immediately redirects unauthenticated users to `/?auth=required`. There is NO way for a prospective user to try the product before signing up — a critical conversion gap.

## Current Behavior
- Line 59-64: `useEffect` redirects guests to `/?auth=required`
- Line 45: `const FREE_TEST_COUNT = 1` exists but only helps authenticated users
- No page for anonymous test-taking exists

## Fix Strategy
Create `[lang]/free-test/` route that:
1. Allows ANY visitor (no auth required) to take ONE practice test
2. After completion, shows a signup prompt ("Sign up to save your score and unlock 10 more tests!")
3. Uses localStorage (`guestAttemptV1`) to prevent abuse (one attempt per browser)
4. Displays the same premium-gated CTA pattern that exists on the practice page
</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — conversion funnel feature.
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `mockTests[0]` — use first test as the free sample
- Quiz context (`QuizContext`) — reusable test engine
- `auth-context.tsx` `openAuthModal()` — signup CTA after completion
- Conseil design tokens from `globals.css`

### Integration Points
- `src/app/[lang]/free-test/page.tsx` — new landing page for free test
- `src/app/[lang]/free-test/page.tsx` — test-taking UI
- LocalStorage key: `guestAttemptV1` — prevents re-takes
</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase.
</specifics>

<deferred>
## Deferred Ideas

None.
</deferred>
