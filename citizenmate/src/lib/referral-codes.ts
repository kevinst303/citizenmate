import Stripe from 'stripe';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';

// ===== Referral Promo Code Management =====
// Generates and manages unique Stripe Promotion Codes per user.
// Each user gets a personal promo code (format: MATE-{slug}) that gives
// their friends 20% off their first Sprint Pass purchase.

const REFERRAL_COUPON_ID = process.env.STRIPE_REFERRAL_COUPON_ID || 'osa7HMgY';

function createStripeClient(): Stripe {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) throw new Error('STRIPE_SECRET_KEY not configured');

  return new Stripe(stripeKey, {
    apiVersion: '2025-02-24.acacia' as Stripe.LatestApiVersion,
    appInfo: { name: 'CitizenMate', version: '1.1.0' },
  });
}

/**
 * Generate a URL-safe slug from a user's display name or email.
 * Falls back to a random short code if no name is available.
 */
function generateSlug(displayName?: string | null, email?: string | null): string {
  if (displayName) {
    return displayName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 8);
  }
  if (email) {
    return email
      .split('@')[0]
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 8);
  }
  // Random fallback
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

/**
 * Get or create a unique Stripe Promotion Code for a user.
 * Stores the code in the user's profile for quick retrieval.
 */
export async function getOrCreateReferralCode(userId: string): Promise<{
  code: string;
  stripePromoCodeId: string;
} | null> {
  const adminSupabase = createSupabaseAdminClient();

  // 1. Check if user already has a promo code
  const { data: profile } = await adminSupabase
    .from('profiles')
    .select('referral_promo_code, display_name, email')
    .eq('id', userId)
    .single();

  if (!profile) return null;

  // If already has a code, return it
  if (profile.referral_promo_code) {
    return {
      code: profile.referral_promo_code,
      stripePromoCodeId: '', // Already stored; Stripe ID looked up separately if needed
    };
  }

  // 2. Generate a unique promo code
  const slug = generateSlug(profile.display_name, profile.email);
  let code = `MATE-${slug}`;

  // Ensure uniqueness by appending random chars if needed
  const { data: existing } = await adminSupabase
    .from('profiles')
    .select('id')
    .eq('referral_promo_code', code)
    .single();

  if (existing) {
    const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
    code = `MATE-${slug}${suffix}`;
  }

  // 3. Create Stripe Promotion Code
  try {
    const stripe = createStripeClient();

    const promoCode = await stripe.promotionCodes.create({
      promotion: {
        type: 'coupon',
        coupon: REFERRAL_COUPON_ID,
      },
      code,
      max_redemptions: 1, // Each promo code can only be used once
      metadata: {
        referrer_user_id: userId,
        type: 'referral',
      },
    } as Stripe.PromotionCodeCreateParams);

    // 4. Store in user profile
    await adminSupabase
      .from('profiles')
      .update({ referral_promo_code: code })
      .eq('id', userId);

    return {
      code,
      stripePromoCodeId: promoCode.id,
    };
  } catch (error) {
    console.error('[ReferralCodes] Failed to create promo code:', error);
    return null;
  }
}

/**
 * Look up who referred a checkout by promo code.
 * Used in the webhook to credit the referrer.
 */
export async function findReferrerByPromoCode(promoCodeId: string): Promise<string | null> {
  try {
    const stripe = createStripeClient();
    const promoCode = await stripe.promotionCodes.retrieve(promoCodeId);

    return promoCode.metadata?.referrer_user_id || null;
  } catch (error) {
    console.error('[ReferralCodes] Failed to look up promo code:', error);
    return null;
  }
}

/**
 * Get referral stats for a user (for progress tracker display).
 */
export async function getReferralStats(userId: string): Promise<{
  totalReferred: number;
  qualifiedReferred: number;
  rewardsClaimed: number;
  maxRewards: number;
  promoCode: string | null;
}> {
  const adminSupabase = createSupabaseAdminClient();

  const [{ count: totalReferred }, { count: qualifiedReferred }, { data: profile }] = await Promise.all([
    adminSupabase
      .from('referral_rewards')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId),
    adminSupabase
      .from('referral_rewards')
      .select('*', { count: 'exact', head: true })
      .eq('referrer_id', userId)
      .eq('qualified', true),
    adminSupabase
      .from('profiles')
      .select('referral_promo_code')
      .eq('id', userId)
      .single(),
  ]);

  return {
    totalReferred: totalReferred ?? 0,
    qualifiedReferred: qualifiedReferred ?? 0,
    rewardsClaimed: qualifiedReferred ?? 0,
    maxRewards: 5,
    promoCode: profile?.referral_promo_code ?? null,
  };
}
