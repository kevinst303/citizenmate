# Phase 9: Daily Streaks Engine — Context

**Gathered:** 2026-05-12
**Status:** Ready for planning
**Mode:** Autonomous (gsd-autonomous)

<domain>
## Phase Boundary

Implement streak tracking with daily check-in logic, streak freeze recovery mechanics, and streak progress UI components.

**Requirements:** GAM-03
**Success Criteria:**
- Daily check-in fires `updateStreak()` automatically on app load (once per day per user)
- Streak freeze mechanics: user can earn/use freeze tokens, frozen streaks don't break
- Streak progress UI component shows current streak, longest streak, streak calendar/pill
- Streak freeze purchase/use UI integrated into streak card
- Build passes cleanly (`npx tsc --noEmit`)
- Reduced-motion support for all streak animations
</domain>

<decisions>
## Implementation Decisions

### Streak Freeze Mechanics
- `streak_freeze_available` field already exists in `user_streaks` table (Phase 8)
- Freeze tokens are consumed automatically when a day is missed (streak would break)
- When streak would reset to 1, instead: consume 1 freeze token, set streak to same value, mark day as frozen
- Add `frozen_days` field to `user_streaks` table (new migration) to track freeze usage
- Add `last_freeze_used_date` timestamp to prevent double-freeze on same gap
- Award 1 freeze token per 7 consecutive days of activity (streak milestone reward)

### Daily Check-in Mechanism
- Use a simple localStorage timestamp approach to avoid redundant API calls
- On app load (or auth state change), check if `lastDailyCheckin` date is older than today
- If so, call `updateStreak()` which recalculates and persists
- Wrap in a React component or hook: `useDailyStreak()`
- Must respect reduced-motion preferences for any animations

### API Routes vs Direct Calls
- Streak operations go through the existing `gamification-db.ts` service layer
- Create `POST /api/gamification/check-in` for daily check-in trigger
- Create `POST /api/gamification/freeze` for streak freeze operations
- Protect with middleware: require auth, rate-limit to once per day

### Streak Freeze Acquisition
- Automatic: 1 freeze per 7 consecutive days
- Manual: Future monetization path (not in scope for v1.2)
- Maximum freezes stored: 3 (configurable, stored client-side constant)

### UI Component Strategy
- Create `StreakCard` — dashboard widget showing streak stats
- Create `StreakFreezeBadge` — small indicator for freeze availability/usage
- Place in dashboard sidebar or main content area
- Use same glassmorphism pattern as existing dashboard cards
- Support light/dark mode via CSS variables

### Streak Calendar Visualization
- Show last 7-14 days as a mini-calendar row
- Each day shows: active (green), frozen (blue/teal), missed (grey/red), future (transparent)
- Use CSS grid for layout, not a heavy charting library
</decisions>

<code_context>
## Existing Code Assets

### Phase 8 Deliverables (Already Complete)
- `src/lib/gamification-db.ts` — `getUserStreak()`, `updateStreak()`, `addXp()` functions
- `src/lib/gamification-engine.ts` — `calculateStreak()` pure function
- `src/lib/gamification-types.ts` — `UserStreak`, `UserBadge`, `XpEntry`, `XpSource` types
- `supabase/migrations/20260512000000_create_user_streaks.sql` — streak table with `streak_freeze_available` int
- `src/lib/sync.ts` — already calls `syncGamificationToSupabase()` on quiz completion

### Integration Points
- Dashboard layout: `src/app/[lang]/dashboard/` — add StreakCard here
- Auth context: use existing `user` from `auth-context.tsx`
- UI patterns: dashboard uses glass-card-premium CSS classes

### Streak Table Schema (from migration)
- user_id UUID PK
- current_streak int
- longest_streak int
- last_activity_date timestamptz
- total_active_days int
- streak_freeze_available int default 0
- updated_at timestamptz
</code_context>

<specifics>
## Specific Implementation Plan Ideas

### 1. Migration: Add frozen_days field
- `supabase/migrations/20260512000003_add_streak_freeze_fields.sql`
- Add `frozen_days int default 0` and `last_freeze_used_date timestamptz`

### 2. Update gamification-engine.ts — freeze logic
- `calculateStreak()` currently resets to 1 on missed day
- Add `calculateStreakWithFreeze()` that accepts freeze count and returns consumption result
- Update `updateStreak()` in gamification-db.ts to handle freeze consumption

### 3. API Routes
- `POST /api/gamification/check-in` — daily check-in
- `POST /api/gamification/freeze` — purchase/use freeze (award freezes from streak milestones)

### 4. StreakCard UI Component
- Dashboard widget: current streak, longest streak, freeze count, streak calendar
- Animated streak counter (with prefers-reduced-motion respect)
- Freeze indicator with tooltip explaining how freezes work

### 5. useDailyStreak Hook
- Client-side hook that manages daily check-in lifecycle
- localStorage guard to prevent redundant API calls
- Returns: streak data, loading state, isTodayActive, freeze count

### 6. Streak Milestone XP Rewards
- Award XP when streak milestones are reached (3, 7, 14, 30, 60 days)
- Use existing `addXp()` from gamification-db.ts
- Award 1 freeze per 7 consecutive days
</specifics>

<deferred>
## Deferred Ideas

- Push notifications for streak reminders (future)
- Streak recovery via payment (future monetization)
- Social sharing of streak milestones (future)
- Leaderboard integration (future)
- Streak streaks shop (future)
</deferred>
