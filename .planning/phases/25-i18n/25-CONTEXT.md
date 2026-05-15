# Phase 25: i18n Drift Correction — Context

**Gathered:** 2026-05-15
**Status:** Ready for planning
**Mode:** Auto-generated (i18n validation failure)

<domain>
## Phase Boundary

`npx tsx scripts/validate-i18n.ts` reports 9 missing translation keys in hi, zh, and ar:
- **connectivity** section: `offline`, `offline_desc`, `online`, `online_desc`
- **xai** section: ~5 keys including `interval_explanation`

Each language is at 0.8% drift.

## Fix Strategy
1. Extract the English source keys from the en locale file
2. Generate culturally-appropriate machine translations for hi, zh, ar
3. Run validation to confirm zero drift
</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices — direct locale file edits.
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `scripts/validate-i18n.ts` — existing validation script
- English locale file — source of truth for translations
</code_context>

<specifics>
## Specific Ideas

No specific requirements.
</specifics>

<deferred>
## Deferred Ideas

None.
</deferred>
