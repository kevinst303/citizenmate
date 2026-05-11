-- CitizenMate: Streaks & Badges Schema
-- Phase 12: Adaptive Gamification

-- 1. User Streaks
create table if not exists public.user_streaks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_activity_date date,
  total_active_days int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.user_streaks enable row level security;

create policy "Users can read own streak"
  on public.user_streaks for select
  using (auth.uid() = user_id);

create policy "Users can upsert own streak"
  on public.user_streaks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own streak"
  on public.user_streaks for update
  using (auth.uid() = user_id);

-- 2. Badge Definitions
create table if not exists public.badge_definitions (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  category text not null check (category in ('streak', 'mastery', 'effort', 'milestone')),
  tier int not null default 1 check (tier between 1 and 5),
  requirement_description text not null,
  created_at timestamptz not null default now()
);

alter table public.badge_definitions enable row level security;

create policy "Anyone can read badge definitions"
  on public.badge_definitions for select
  using (true);

-- 3. User Badges (earned badges)
create table if not exists public.user_badges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null references public.badge_definitions(id) on delete cascade,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

alter table public.user_badges enable row level security;

create policy "Users can read own badges"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "Users can insert own badges"
  on public.user_badges for insert
  with check (auth.uid() = user_id);

-- 4. Seed Badge Definitions
insert into public.badge_definitions (id, name, description, icon, category, tier, requirement_description) values
  -- Streak badges
  ('streak-3', 'Getting Started', 'You studied 3 days in a row!', 'flame', 'streak', 1, '3-day study streak'),
  ('streak-7', 'Week Warrior', 'A full week of daily study — now that''s dedication!', 'flame', 'streak', 2, '7-day study streak'),
  ('streak-14', 'Fortnight Focus', 'Two weeks of consistent effort. You''re building a habit!', 'flame', 'streak', 3, '14-day study streak'),
  ('streak-30', 'Monthly Master', '30 days straight! This is who you are now.', 'flame', 'streak', 4, '30-day study streak'),
  ('streak-60', 'Unstoppable', '60 days without missing a beat. Legendary discipline.', 'flame', 'streak', 5, '60-day study streak'),

  -- Mastery badges
  ('mastery-25', 'Quarter Master', 'You''ve mastered 25% of all questions!', 'star', 'mastery', 1, 'Master 25% of question bank'),
  ('mastery-50', 'Halfway Hero', '50% of the question bank is under your belt.', 'star', 'mastery', 2, 'Master 50% of question bank'),
  ('mastery-75', 'Knowledge Champion', '75% mastery — you''re getting close to test-ready!', 'star', 'mastery', 3, 'Master 75% of question bank'),
  ('mastery-90', 'Almost There', '90% mastered. Just a few more to go!', 'star', 'mastery', 4, 'Master 90% of question bank'),
  ('mastery-100', 'Perfect Score', 'Every question mastered. You are ready!', 'star', 'mastery', 5, 'Master 100% of question bank'),

  -- Effort badges
  ('effort-10', 'First Steps', 'Completed 10 total questions across all sessions.', 'dumbbell', 'effort', 1, 'Answer 10 questions total'),
  ('effort-50', 'Practice Makes Perfect', '50 questions answered. Keep that momentum!', 'dumbbell', 'effort', 2, 'Answer 50 questions total'),
  ('effort-100', 'Century Club', '100 questions crushed. Serious effort!', 'dumbbell', 'effort', 3, 'Answer 100 questions total'),
  ('effort-250', 'Dedicated Scholar', '250 questions — your commitment is showing.', 'dumbbell', 'effort', 4, 'Answer 250 questions total'),
  ('effort-500', 'Iron Will', '500 questions. Nothing can stop you now.', 'dumbbell', 'effort', 5, 'Answer 500 questions total'),

  -- Milestone badges
  ('milestone-first-test', 'First Test Taker', 'You completed your very first practice test!', 'trophy', 'milestone', 1, 'Complete 1 practice test'),
  ('milestone-5-tests', 'Practice Pro', 'Five practice tests in the books.', 'trophy', 'milestone', 2, 'Complete 5 practice tests'),
  ('milestone-10-tests', 'Test Machine', '10 practice tests — you know the format inside out.', 'trophy', 'milestone', 3, 'Complete 10 practice tests'),
  ('milestone-perfect', 'Flawless Run', 'Scored 100% on a practice test!', 'trophy', 'milestone', 4, 'Score 100% on any practice test'),
  ('milestone-values', 'Values Guardian', 'Mastered all Australian Values questions.', 'heart', 'milestone', 3, 'Achieve 100% on Australian Values topic')
on conflict (id) do nothing;

-- 5. Indexes for performance
create index if not exists idx_user_streaks_user_id on public.user_streaks(user_id);
create index if not exists idx_user_badges_user_id on public.user_badges(user_id);
create index if not exists idx_user_badges_badge_id on public.user_badges(badge_id);
