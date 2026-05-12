-- ===== CitizenMate: Create xp_log table =====
-- Immutable audit log of all XP-earning events per user.

CREATE TABLE IF NOT EXISTS public.xp_log (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount     INTEGER NOT NULL CHECK (amount > 0),
    source     VARCHAR(64) NOT NULL,
    metadata   JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_xp_log_user_id ON public.xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_log_source ON public.xp_log(source);
CREATE INDEX IF NOT EXISTS idx_xp_log_created_at ON public.xp_log(created_at DESC);

-- RLS
ALTER TABLE public.xp_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own XP log"
    ON public.xp_log FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own XP"
    ON public.xp_log FOR INSERT
    WITH CHECK (user_id = auth.uid());
