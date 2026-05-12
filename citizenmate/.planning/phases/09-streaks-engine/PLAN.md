# Phase 9: Daily Streaks Engine — Plan

**Phase:** 09 — streaks-engine
**Requirements:** GAM-03
**Created:** 2026-05-12

## Overview

Implement the daily streaks engine on top of Phase 8's gamification DB layer. Add streak freeze recovery mechanics, daily check-in triggers, streak progress UI, and streak milestone XP rewards. Build quality-of-life improvements: streak calendar visualization, freeze management, and accessibility support.

## Waves & Plans

### Wave 1: Core Mechanics (sequential — migration depends on nothing)

| # | Plan | Description | Type | Depends On |
|---|------|-------------|------|------------|
| 1 | Migration: Add freeze tracking fields | SQL migration adding `frozen_days`, `last_freeze_used_date` to `user_streaks` | database | — |
| 2 | Apply freeze migration | Run the SQL migration against Supabase | infra | Plan 1 |
| 3 | Update streak engine with freeze logic | Add `consumeStreakFreeze()` to gamification-engine.ts, update `calculateStreak()` to support freeze-aware streaks | code | — |

### Wave 2: API Layer (parallel — depends on Wave 1)

| # | Plan | Description | Type | Depends On |
|---|------|-------------|------|------------|
| 4 | Create check-in API route | `POST /api/gamification/check-in` — daily check-in endpoint calling `updateStreak()` with freeze-aware logic | code | Plan 1, Plan 3 |
| 5 | Create freeze API route | `POST /api/gamification/freeze` — manage freeze acquisition (grant from streak milestones) and freeze query | code | Plan 1, Plan 3 |

### Wave 3: UI Layer (depends on Wave 2)

| # | Plan | Description | Type | Depends On |
|---|------|-------------|------|------------|
| 6 | Create `useDailyStreak` hook | Client-side hook with localStorage guard, daily check-in lifecycle, returns streak + freeze state | code | Plan 4 |
| 7 | Create StreakCard UI component | Dashboard widget: current streak, longest streak, freeze count, 14-day mini-calendar, freeze indicator | code | Plan 6 |
| 8 | Add StreakCard to dashboard | Integrate StreakCard into dashboard layout alongside existing widgets | code | Plan 7 |

### Wave 4: Polish & Verify (depends on all above)

| # | Plan | Description | Type | Depends On |
|---|------|-------------|------|------------|
| 9 | Build verification + streak milestone XP | Award XP on streak milestones (3, 7, 14, 30, 60 days) + award 1 freeze per 7-day streak. Verify: `npx tsc --noEmit`, `npm run build`, reduced-motion compliance | verify | All above |

## Verification Criteria

- [ ] `npx tsc --noEmit` passes with zero errors
- [ ] `npm run build` passes
- [ ] Freeze migration applied to Supabase (`frozen_days`, `last_freeze_used_date` columns exist)
- [ ] `GET /api/gamification/check-in` returns streak state on daily check-in
- [ ] Streak freeze consumed automatically when day is missed
- [ ] 1 freeze awarded per 7 consecutive days
- [ ] StreakCard renders on dashboard with correct data
- [ ] Streak calendar shows last 14 days correctly (active/frozen/missed)
- [ ] Reduced-motion respected (no animations when `prefers-reduced-motion: reduce`)
- [ ] XP awarded on streak milestone thresholds
