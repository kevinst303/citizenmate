ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tier text DEFAULT 'free';
