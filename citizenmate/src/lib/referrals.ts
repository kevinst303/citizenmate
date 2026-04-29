import { createClient } from "@supabase/supabase-js";

/**
 * Grants a 7-day premium reward to both the referrer and referee.
 * Limits the referrer to a maximum of 5 rewards.
 */
export async function processReferralReward(refereeId: string) {
  // Initialize Supabase Admin Client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  );

  // 1. Get the referee's profile
  const { data: referee, error: refError } = await supabaseAdmin
    .from("profiles")
    .select("referred_by, premium_expires_at")
    .eq("id", refereeId)
    .single();

  if (refError || !referee || !referee.referred_by) {
    return { success: false, error: "No referrer found" };
  }

  const referrerId = referee.referred_by;

  // 2. Check if a reward already exists for this pair
  const { data: existingReward } = await supabaseAdmin
    .from("referral_rewards")
    .select("id")
    .eq("referrer_id", referrerId)
    .eq("referee_id", refereeId)
    .single();

  if (existingReward) {
    return { success: false, error: "Reward already processed" };
  }

  // 3. Check if referrer has reached the limit (5)
  const { count: rewardCount } = await supabaseAdmin
    .from("referral_rewards")
    .select("*", { count: "exact", head: true })
    .eq("referrer_id", referrerId);

  if (rewardCount !== null && rewardCount >= 5) {
    return { success: false, error: "Referrer has reached the reward limit" };
  }

  // 4. Calculate new premium expiry dates (add 7 days)
  const add7Days = (currentExpiry: string | null) => {
    const date = currentExpiry && new Date(currentExpiry) > new Date()
      ? new Date(currentExpiry)
      : new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString();
  };

  const refereeNewExpiry = add7Days(referee.premium_expires_at);
  
  const { data: referrer } = await supabaseAdmin
    .from("profiles")
    .select("premium_expires_at")
    .eq("id", referrerId)
    .single();
    
  const referrerNewExpiry = referrer 
    ? add7Days(referrer.premium_expires_at) 
    : add7Days(null);

  // 5. Transaction: Insert reward and update both profiles
  // (Using individual admin calls for simplicity; in a real app, an RPC function is better)
  await supabaseAdmin.from("referral_rewards").insert({
    referrer_id: referrerId,
    referee_id: refereeId,
    reward_days: 7,
  });

  await supabaseAdmin
    .from("profiles")
    .update({ is_premium: true, premium_expires_at: refereeNewExpiry })
    .eq("id", refereeId);

  await supabaseAdmin
    .from("profiles")
    .update({ is_premium: true, premium_expires_at: referrerNewExpiry })
    .eq("id", referrerId);

  return { success: true };
}
