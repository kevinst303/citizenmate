# Phase 22: Middleware Migration — Implementation Plan

**Phase:** 22 — Middleware Migration (proxy.ts)
**Requirements:** PROD-04
**Plan created:** 2026-05-15
**Status:** Ready for execution

---

## Plan 22-1: Create proxy.ts + Re-export Bridge

**Goal:** Migrate middleware logic to `proxy.ts` per Next.js 16 conventions while preserving backward compatibility.

**Success criteria:**
1. `npm run build` exits 0
2. `src/proxy.ts` contains all middleware logic (locale, auth, CSP, referral)
3. `src/middleware.ts` re-exports from proxy.ts
4. All protected routes still gate correctly

**Implementation:**
1. Rename `src/middleware.ts` → `src/proxy.ts` (move all logic)
2. Replace `src/middleware.ts` with a re-export from proxy.ts

**Files to create/modify:**
- `citizenmate/src/proxy.ts` — full middleware logic (copied from middleware.ts)
- `citizenmate/src/middleware.ts` — re-export bridge

---

## Verification
1. `npm run build` — must exit 0
2. All middleware logic preserved (diff check)
3. Protected routes unchanged
