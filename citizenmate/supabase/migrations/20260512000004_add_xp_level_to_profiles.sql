-- ===== CitizenMate: Add XP & Level Tracking to Profiles =====
-- Adds progression tracking columns directly to the profiles table.
-- This avoids a separate table for a simple 1:1 relationship.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS xp INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level INTEGER NOT NULL DEFAULT 1;

-- Update existing profiles: set level = 1 and xp = 0 for any that are null
UPDATE public.profiles
SET xp = COALESCE(xp, 0), level = COALESCE(level, 1)
WHERE xp IS NULL OR level IS NULL;
