# Phase 8: Gamification Database & API — Context

**Gathered:** 2026-05-12
**Status:** Ready for planning
**Mode:** Auto-generated (gsd-autonomous — discuss skipped)

<domain>
## Phase Boundary

Build the gamification persistence layer: Supabase tables for streaks, badges, and XP logs, plus a service-layer API that wraps the existing pure-logic `gamification-engine.ts` functions with database read/write operations.

**Requirements:** GAM-01, GAM-02
**Success Criteria:**
- Supabase tables exist for `user_streaks`, `user_badges`, and `xp_log` with proper RLS policies
- A `gamification-db.ts` service layer provides CRUD operations (getStreak, upsertStreak, getBadges, earnBadge, addXp, getXpHistory)
- The existing `gamification-engine.ts` functions are invoked by the service layer for streak calculation and badge evaluation
- Build passes cleanly (`npx tsc --noEmit`)
</domain>

<decisions>
## Implementation Decisions

### Table Schema Design
- **user_streaks**: one row per user — `user_id` PK, `current_streak` int, `longest_streak` int, `last_activity_date` timestamptz, `total_active_days` int, `streak_freeze_available` int default 0, `updated_at` timestamptz
- **user_badges**: one row per earned badge — `id` PK, `user_id` FK, `badge_id` varchar, `earned_at` timestamptz, `displayed` boolean default false (for badge showcase)
- **xp_log**: one row per XP event — `id` PK, `user_id` FK, `amount` int, `source` varchar (e.g. 'quiz_complete', 'streak_milestone', 'badge_earned', 'daily_login'), `metadata` jsonb, `created_at` timestamptz
- Badge definitions stay in `gamification-engine.ts` as code (static reference data)

### API Access Pattern
- Follow the existing `sync.ts` pattern using `getSupabaseBrowserClient()` (browser client with cookies)
- Create a dedicated `src/lib/gamification-db.ts` that imports gamification-engine functions and wraps them with persistence
- No API routes needed for Phase 8 — the service layer is called directly from contexts/components
- Next.js Server Actions only if the user is signed in (check via `auth-context`)

### RLS Policy Strategy
- All tables: `user_id = auth.uid()` for SELECT/INSERT/UPDATE
- User can only read/write their own data
- `FOR ALL` with `user_id = auth.uid()`

### XP Table Forward Compatibility
- Include `xp_log` table now even though XP features are Phase 11
- This avoids a schema migration later and the service layer can be stubbed
- Add `getTotalXp()` and `addXp()` functions

### Streak Freeze
- Keep it simple: add `streak_freeze_available` int field to user_streaks
- Full freeze mechanics implemented in Phase 9; Phase 8 just stores the counter

### Migration Tooling
- Use Supabase Dashboard SQL editor OR `apply_migration` MCP tool
- Write raw SQL migrations stored in a `supabase/migrations/` directory
- Apply via MCP after migration files are created
</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/gamification-engine.ts` — Pure functions: calculateStreak(), evaluateBadges(), generateXAIExplanation(), getAllBadgeDefinitions(), getBadgeById()
- `src/lib/gamification-types.ts` — TypeScript types: BadgeDefinition, UserBadge, UserStreak, GamificationState, BadgeEvaluationInput, XAIExplanation
- `src/lib/sync.ts` — Established Supabase CRUD pattern (upsert, select, insert, merge logic, isSupabaseConfigured guard)
- `src/lib/supabase.ts` — Browser client creation via `getSupabaseBrowserClient()`
- `src/lib/supabase-server.ts` — Cached server client via `createSupabaseServerClient()`

### Established Patterns
- localStorage-first with Supabase background sync (sync.ts)
- `isSupabaseConfigured()` guard before any DB calls
- Browser client for client components, server client for API routes/server components
- RLS on all tables: `user_id = auth.uid()`

### Integration Points
- Gamification engine functions currently stateless — results are computed but not persisted
- `auth-context.tsx` provides `user` object (can get user.id for DB ops)
- Sync.ts is triggered on auth state change and quiz completion — gamification sync should follow same trigger points
</code_context>

<specifics>
## Specific Ideas

### 1. Migration SQL Files
- `supabase/migrations/20260512000000_create_user_streaks.sql`
- `supabase/migrations/20260512000001_create_user_badges.sql`
- `supabase/migrations/20260512000002_create_xp_log.sql`
- Include CREATE TABLE + RLS + INDEX on user_id for each

### 2. Service Layer (gamification-db.ts)
- `getUserStreak(userId) → UserStreak | null`
- `updateStreak(userId) → { newStreak, isIncremented, badges }` — calls calculateStreak(), saves to DB
- `getEarnedBadges(userId) → UserBadge[]`
- `evaluateAndEarnBadges(userId, input) → BadgeDefinition[]` — calls evaluateBadges(), inserts new ones
- `getUnclaimedBadges(userId, input) → BadgeDefinition[]` — computed without persisting
- `addXp(userId, amount, source, metadata?) → void`
- `getTotalXp(userId) → number`
- `getXpHistory(userId, limit?) → XpEntry[]`

### 3. Integration with sync.ts
- Add `syncGamificationToSupabase()` exported from sync.ts
- Call `updateStreak()` and `evaluateAndEarnBadges()` after quiz completion sync

### 4. Types Refinement
- Add XpEntry interface to gamification-types.ts
- Ensure UserStreak fields match exactly between types and DB schema
</specifics>

<deferred>
## Deferred Ideas

- Full streak freeze mechanics (Phase 9)
- Badge showcase UI (Phase 10)
- XP progression UI and level indicators (Phase 11)
- XAI tooltip components (Phase 12)
- Gamification admin dashboard (future)
- Leaderboards or social features (future)
</deferred>
