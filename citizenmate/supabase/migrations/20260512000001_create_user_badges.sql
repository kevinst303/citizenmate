-- ===== CitizenMate: Create user_badges table =====
-- Records each badge earned by a user. Badge definitions remain in gamification-engine.ts.

CREATE TABLE IF NOT EXISTS public.user_badges (
    id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    badge_id  VARCHAR(64) NOT NULL,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    displayed BOOLEAN NOT NULL DEFAULT false,

    -- Prevent duplicate badge awards
    CONSTRAINT uq_user_badge UNIQUE (user_id, badge_id)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON public.user_badges(badge_id);

-- RLS
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
    ON public.user_badges FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own badges"
    ON public.user_badges FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own badges"
    ON public.user_badges FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own badges"
    ON public.user_badges FOR DELETE
    USING (user_id = auth.uid());
