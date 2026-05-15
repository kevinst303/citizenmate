# Phase 17 Plan: Admin Blog Cleanup

## Goal
Replace all hardcoded hex color values in the Admin/Blog section with canonical Conseil CSS variables for design consistency.

## Requirements
- **BLOG-01:** Audit all admin/blog components for hardcoded hex values
- **BLOG-02:** Replace any found hex values with CSS variable equivalents

## Success Criteria
1. Zero hardcoded hex values remain in Admin/Blog components (only CSS variable references)
2. All blog admin pages render visually identical to pre-migration state
3. `npm run build` passes with zero errors

## Execution Plan

### Wave 1: Audit
- [x] grep all admin components for `#[0-9a-fA-F]` patterns
- [x] grep all blog components for `#[0-9a-fA-F]` patterns
- [x] grep admin pages for `#[0-9a-fA-F]` patterns
- [x] grep blog pages for `#[0-9a-fA-F]` patterns
- **Finding:** Zero hardcoded hex values found — all components already use Conseil CSS variables

### Wave 2: Verification
- [x] `npm run build` passes with zero errors
- [x] Visual inspection confirms all components use `cm-` design tokens

### Result
Phase 17 is a **no-op** — the hex-to-CSS-variable migration was completed proactively in a prior session (likely during Phase 10: Calm UX or the Phase 8 Super Admin work). All admin/blog components already reference the Conseil design system exclusively.
