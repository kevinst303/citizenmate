-- ===== CitizenMate: Create push_subscriptions table =====
-- Stores web push subscriptions for users to receive notifications

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, endpoint)
);

-- Index for efficient lookup
CREATE INDEX IF NOT EXISTS idx_push_subs_user_id ON public.push_subscriptions(user_id);

-- RLS: user can only read/write their own subscriptions
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own push subscriptions"
    ON public.push_subscriptions FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert own push subscriptions"
    ON public.push_subscriptions FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own push subscriptions"
    ON public.push_subscriptions FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own push subscriptions"
    ON public.push_subscriptions FOR DELETE
    USING (user_id = auth.uid());

-- Auto-update updated_at trigger
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'set_push_subs_updated_at'
    ) THEN
        CREATE TRIGGER set_push_subs_updated_at
            BEFORE UPDATE ON public.push_subscriptions
            FOR EACH ROW
            EXECUTE FUNCTION public.update_updated_at_column();
    END IF;
END $$;
