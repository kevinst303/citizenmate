-- ===== CitizenMate: Add streak freeze tracking fields =====
-- Extends user_streaks to support the daily streaks freeze mechanic.

ALTER TABLE public.user_streaks
    ADD COLUMN IF NOT EXISTS frozen_days INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS last_freeze_used_date TIMESTAMPTZ;
