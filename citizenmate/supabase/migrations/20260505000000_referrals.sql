-- Migration: Referral System
-- Adds referred_by, referral_count to profiles
-- Creates referral_rewards table for tracking
-- Creates RPC for atomic reward processing

-- Add referral columns to profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id),
  ADD COLUMN IF NOT EXISTS referral_count INTEGER DEFAULT 0;

-- Create referral_rewards table for reward tracking
CREATE TABLE IF NOT EXISTS referral_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID REFERENCES profiles(id) NOT NULL,
  referee_id UUID REFERENCES profiles(id) NOT NULL,
  reward_days INTEGER NOT NULL DEFAULT 7,
  qualified BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (referrer_id, referee_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referrer ON referral_rewards(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_rewards_referee ON referral_rewards(referee_id);
CREATE INDEX IF NOT EXISTS idx_profiles_referred_by ON profiles(referred_by);

-- RPC: Atomically process referral reward (extend premium for both parties)
CREATE OR REPLACE FUNCTION process_referral_reward(
  p_referrer_id UUID,
  p_referee_id UUID,
  p_reward_days INTEGER,
  p_reward_type TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referrer_current_expiry TIMESTAMPTZ;
  v_referrer_new_expiry TIMESTAMPTZ;
  v_referee_current_expiry TIMESTAMPTZ;
  v_referee_new_expiry TIMESTAMPTZ;
  v_now TIMESTAMPTZ := now();
  v_referrer_count INTEGER;
BEGIN
  -- Check abuse limit (max 5 successful referrals per referrer)
  SELECT referral_count INTO v_referrer_count
  FROM profiles WHERE id = p_referrer_id;
  
  IF v_referrer_count >= 5 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Referral limit reached');
  END IF;

  -- Get current expiry for referrer
  SELECT premium_expires_at INTO v_referrer_current_expiry
  FROM profiles WHERE id = p_referrer_id;

  -- Calculate new expiry (extend from now or from current expiry, whichever is later)
  IF v_referrer_current_expiry IS NOT NULL AND v_referrer_current_expiry > v_now THEN
    v_referrer_new_expiry := v_referrer_current_expiry + (p_reward_days || ' days')::INTERVAL;
  ELSE
    v_referrer_new_expiry := v_now + (p_reward_days || ' days')::INTERVAL;
  END IF;

  -- Get current expiry for referee
  SELECT premium_expires_at INTO v_referee_current_expiry
  FROM profiles WHERE id = p_referee_id;

  -- Calculate new expiry for referee
  IF v_referee_current_expiry IS NOT NULL AND v_referee_current_expiry > v_now THEN
    v_referee_new_expiry := v_referee_current_expiry + (p_reward_days || ' days')::INTERVAL;
  ELSE
    v_referee_new_expiry := v_now + (p_reward_days || ' days')::INTERVAL;
  END IF;

  -- Update referrer: set is_premium, extend expiry, increment count, set tier
  UPDATE profiles
  SET is_premium = TRUE,
      premium_expires_at = v_referrer_new_expiry,
      referral_count = COALESCE(referral_count, 0) + 1,
      tier = 'premium'
  WHERE id = p_referrer_id;

  -- Update referee: set is_premium, extend expiry, set tier
  UPDATE profiles
  SET is_premium = TRUE,
      premium_expires_at = v_referee_new_expiry,
      tier = 'premium'
  WHERE id = p_referee_id;

  -- Record the reward
  INSERT INTO referral_rewards (referrer_id, referee_id, reward_days, qualified, processed_at)
  VALUES (p_referrer_id, p_referee_id, p_reward_days, TRUE, v_now)
  ON CONFLICT (referrer_id, referee_id)
  DO UPDATE SET qualified = TRUE, processed_at = v_now;

  RETURN jsonb_build_object(
    'success', true,
    'referrer_expiry', v_referrer_new_expiry,
    'referee_expiry', v_referee_new_expiry
  );
END;
$$;
