import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { sendEmail } from '@/lib/email';


// ===== Referral Reward Processing =====
// Two-sided referral system:
//   - Referrer gets 7 days of premium when their friend *qualifies*
//   - Friend (referee) gets 20% off Sprint Pass via Stripe promo code
// Qualification gate: friend must complete diagnostic quiz OR purchase Sprint Pass.
// Rewards are processed atomically via Supabase RPC function.

const REWARD_DAYS = 7;

/**
 * Process a referral reward when a referee qualifies.
 * Qualification means: the referee has completed a diagnostic quiz OR purchased a Sprint Pass.
 *
 * This uses a Supabase RPC function for atomic transaction safety.
 */
export async function processReferralReward(refereeId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  const adminSupabase = createSupabaseAdminClient();

  // 1. Get the referee's profile to find their referrer
  const { data: referee, error: refError } = await adminSupabase
    .from('profiles')
    .select('referred_by, email, display_name')
    .eq('id', refereeId)
    .single();

  if (refError || !referee || !referee.referred_by) {
    return { success: false, error: 'No referrer found' };
  }

  const referrerId = referee.referred_by;

  // 2. Check qualification gate: has the referee done anything meaningful?
  const isQualified = await checkQualification(refereeId);
  if (!isQualified) {
    // Record the referral relationship but don't grant reward yet
    await adminSupabase.from('referral_rewards').upsert({
      referrer_id: referrerId,
      referee_id: refereeId,
      reward_days: REWARD_DAYS,
      qualified: false,
    }, {
      onConflict: 'referrer_id,referee_id',
    });
    return { success: false, error: 'Referee has not yet qualified' };
  }

  // 3. Process reward atomically via RPC
  const { data: result, error: rpcError } = await adminSupabase.rpc(
    'process_referral_reward',
    {
      p_referrer_id: referrerId,
      p_referee_id: refereeId,
      p_reward_days: REWARD_DAYS,
      p_reward_type: 'premium_days',
    }
  );

  if (rpcError) {
    console.error('[Referral] RPC error:', rpcError.message);
    return { success: false, error: 'Failed to process reward' };
  }

  if (!result?.success) {
    return { success: false, error: result?.error || 'Unknown error' };
  }

  // 4. Send notification emails (non-blocking)
  await Promise.allSettled([
    sendReferrerNotification(referrerId, referee.display_name || 'a mate'),
    sendRefereeNotification(refereeId, referee.email, referee.display_name),
  ]);

  return { success: true };
}

/**
 * Check if a referee has qualified for the referral reward.
 * Qualification: completed at least 1 quiz (diagnostic) OR is premium (purchased Sprint Pass).
 */
async function checkQualification(refereeId: string): Promise<boolean> {
  const adminSupabase = createSupabaseAdminClient();

  // Check if user has completed any quiz
  const { count: quizCount } = await adminSupabase
    .from('quiz_history')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', refereeId);

  if (quizCount && quizCount > 0) return true;

  // Check if user has purchased Sprint Pass (is premium)
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('is_premium')
    .eq('id', refereeId)
    .single();

  if (profile?.is_premium) return true;

  return false;
}

/**
 * Re-check and process unqualified referrals for a user.
 * Called after a user completes a quiz or purchases Sprint Pass.
 */
export async function checkAndProcessPendingReward(refereeId: string): Promise<void> {
  const adminSupabase = createSupabaseAdminClient();

  // Check if there's a pending (unqualified) reward for this user
  const { data: pendingReward } = await adminSupabase
    .from('referral_rewards')
    .select('id, referrer_id')
    .eq('referee_id', refereeId)
    .eq('qualified', false)
    .single();

  if (!pendingReward) return;

  // Now try to process the reward (qualification will be re-checked)
  await processReferralReward(refereeId);
}

// ── Email Notifications ──

async function sendReferrerNotification(
  referrerId: string,
  refereeName: string
): Promise<void> {
  const adminSupabase = createSupabaseAdminClient();
  const { data: referrer } = await adminSupabase
    .from('profiles')
    .select('email, display_name, unsubscribed_from_emails')
    .eq('id', referrerId)
    .single();

  if (!referrer?.email || referrer.unsubscribed_from_emails) return;

  const name = referrer.display_name || 'Mate';

  await sendEmail({
    to: referrer.email,
    subject: 'Your mate just qualified — 7 bonus premium days added!',
    text: `Hi ${name},\n\nYour mate ${refereeName} just qualified. You've received 7 bonus premium days!\n\nEnjoy the extra prep time.\n\n– CitizenMate`,
  });
}

async function sendRefereeNotification(
  refereeId: string,
  email: string | null,
  displayName?: string | null
): Promise<void> {
  if (!email) return;

  const adminSupabase = createSupabaseAdminClient();
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('unsubscribed_from_emails')
    .eq('id', refereeId)
    .single();

  if (profile?.unsubscribed_from_emails) return;

  const name = displayName || 'there';

  await sendEmail({
    to: email,
    subject: 'You unlocked 7 bonus premium days — CitizenMate',
    text: `Hi ${name},\n\nYou've unlocked 7 bonus premium days thanks to a referral!\n\nTime to keep practising.\n\n– CitizenMate`,
  });
}
