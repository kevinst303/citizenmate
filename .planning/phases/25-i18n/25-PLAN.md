# Phase 25: i18n Drift Correction — Implementation Plan

**Phase:** 25 — i18n Drift Correction
**Requirements:** QUAL-01
**Plan created:** 2026-05-15
**Status:** Ready for execution

---

## Plan 25-1: Fix Translation Drift (hi, zh, ar)

**Goal:** Eliminate all 9 missing translation keys to achieve 0% drift across all locales.

**Success criteria:**
1. `npx tsx scripts/validate-i18n.ts` reports zero missing keys for hi, zh, ar
2. `npm run build` exits 0

**Implementation:**
1. Locate English source keys in en locale file for `connectivity` and `xai` sections
2. Add translations to hi.json, zh.json, ar.json
3. Run validation script to confirm fix
