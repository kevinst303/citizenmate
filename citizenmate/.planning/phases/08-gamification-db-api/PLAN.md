# Phase 8: Gamification Database & API — Plan

**Phase:** 08 — gamification-db-api
**Requirements:** GAM-01, GAM-02
**Created:** 2026-05-12

## Overview

Build the gamification persistence layer: Supabase tables, SQL migrations, a `gamification-db.ts` service layer, and integration with the existing `sync.ts` flow. The existing pure-logic `gamification-engine.ts` functions are imported and wrapped by the service layer — no logic duplication.

## Waves & Plans

### Wave 1: Foundation (sequential — migration depends on nothing)

| # | Plan | Description | Type | Depends On |
|---|------|-------------|------|------------|
| 1 | Create SQL migrations | 3 migration files for `user_streaks`, `user_badges`, `xp_log` with RLS + indexes | database | — |
| 2 | Apply migrations via Supabase | Run the SQL migrations against the Supabase project | infra | Plan 1 |
| 3 | Add XpEntry type to gamification-types.ts | Extend types for XP log entries | types | — |

### Wave 2: Service Layer (parallel — no cross-dependency)

| # | Plan | Description | Type | Depends On |
|---|------|-------------|------|------------|
| 4 | Create gamification-db.ts — worker functions | `getUserStreak`, `updateStreak` (calls calculateStreak), `getEarnedBadges`, `evaluateAndEarnBadges` (calls evaluateBadges) | code | Plan 1, Plan 3 |
| 5 | Create gamification-db.ts — XP functions | `addXp`, `getTotalXp`, `getXpHistory` | code | Plan 1, Plan 3 |

### Wave 3: Integration (depends on Wave 2)

| # | Plan | Description | Type | Depends On |
|---|------|-------------|------|------------|
| 6 | Add gamification sync to sync.ts | `syncGamificationToSupabase()` — call updateStreak + evaluateAndEarnBadges after quiz sync | code | Plan 4 |
| 7 | Build verification | `npx tsc --noEmit`, verify migrations applied, verify DB round-trip | verify | All above |

## Verification Criteria

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` passes
- [ ] All 3 migration SQL files exist in `supabase/migrations/`
- [ ] Migrations applied to Supabase project (checked via Supabase dashboard)
- [ ] `gamification-db.ts` exports all required functions
- [ ] `sync.ts` calls gamification sync after quiz completion sync
- [ ] RLS policies in place: each user can only access their own data
