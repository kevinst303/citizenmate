-- ===== CitizenMate: Create user_streaks table =====
-- Tracks daily study streaks and cumulative active days per user.

CREATE TABLE IF NOT EXISTS public.user_streaks (
    user_id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    current_streak     INTEGER NOT NULL DEFAULT 0,
    longest_streak     INTEGER NOT NULL DEFAULT 0,
    last_activity_date TIMESTAMPTZ,
    total_active_days  INTEGER NOT NULL DEFAULT 0,
    streak_freeze_available INTEGER NOT NULL DEFAULT 0,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for efficient lookup
CREATE INDEX IF NOT EXISTS idx_user_streaks_user_id ON public.user_streaks(user_id);

-- RLS: user can only read/write their own streak
ALTER TABLE public.user_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streak"
    ON public.user_streaks FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own streak"
    ON public.user_streaks FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own streak"
    ON public.user_streaks FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'set_user_streaks_updated_at'
    ) THEN
        CREATE TRIGGER set_user_streaks_updated_at
            BEFORE UPDATE ON public.user_streaks
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;
