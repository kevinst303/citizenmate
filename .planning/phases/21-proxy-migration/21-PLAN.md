# Phase 21: Build Warnings Resolution — Implementation Plan

**Phase:** 21 — Build Warnings Resolution
**Requirements:** PROD-02, PROD-03
**Plan created:** 2026-05-15
**Status:** Ready for execution

---

## Plan 21-1: Fix metadataBase Warnings

**Goal:** Add `metadataBase` to all child layout metadata exports to resolve Next.js build warnings.

**Success criteria:**
1. `npm run build` exits 0 with no `metadataBase` warnings
2. All 4 child layouts that export metadata include `metadataBase`

**Implementation:**
- Add `metadataBase: new URL("https://citizenmate.com.au")` to each child layout's metadata export:
  1. `src/app/[lang]/dashboard/layout.tsx`
  2. `src/app/[lang]/practice/layout.tsx`
  3. `src/app/[lang]/practice/smart/layout.tsx`
  4. `src/app/[lang]/study/layout.tsx`
  5. `src/app/[lang]/offline/layout.tsx`

**Files to modify:**
- `citizenmate/src/app/[lang]/dashboard/layout.tsx`
- `citizenmate/src/app/[lang]/practice/layout.tsx`
- `citizenmate/src/app/[lang]/practice/smart/layout.tsx`
- `citizenmate/src/app/[lang]/study/layout.tsx`
- `citizenmate/src/app/[lang]/offline/layout.tsx`

---

## Verification
1. `npm run build` — must exit 0 with no warnings
2. All 5 layout files include `metadataBase`
