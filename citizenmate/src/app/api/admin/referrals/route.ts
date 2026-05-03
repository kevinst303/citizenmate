import { NextResponse } from 'next/server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { verifyAdmin } from '@/lib/admin-auth';

// ===== Admin Referral Stats API =====
// Returns aggregated referral program KPIs for the admin dashboard.

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const adminSupabase = createSupabaseAdminClient();

    // Run all queries in parallel
    const [
      totalReferrals,
      qualifiedReferrals,
      pendingReferrals,
      totalPromoUsers,
      recentReferrals,
      topReferrers,
      referralConfig,
    ] = await Promise.all([
      // Total referral relationships
      adminSupabase
        .from('referral_rewards')
        .select('*', { count: 'exact', head: true }),

      // Qualified (converted) referrals
      adminSupabase
        .from('referral_rewards')
        .select('*', { count: 'exact', head: true })
        .eq('qualified', true),

      // Pending (not yet qualified) referrals
      adminSupabase
        .from('referral_rewards')
        .select('*', { count: 'exact', head: true })
        .eq('qualified', false),

      // Users with promo codes generated
      adminSupabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .not('referral_promo_code', 'is', null),

      // Recent 20 referral activity
      adminSupabase
        .from('referral_rewards')
        .select(`
          id,
          referrer_id,
          referee_id,
          reward_days,
          reward_type,
          qualified,
          qualified_at,
          stripe_promo_code_id,
          created_at
        `)
        .order('created_at', { ascending: false })
        .limit(20),

      // Top referrers (by qualified count)
      adminSupabase
        .from('referral_rewards')
        .select('referrer_id')
        .eq('qualified', true),

      // Referral config
      adminSupabase
        .from('referral_config')
        .select('*')
        .eq('id', 1)
        .single(),
    ]);

    // Aggregate top referrers
    const referrerCounts: Record<string, number> = {};
    topReferrers.data?.forEach((r) => {
      referrerCounts[r.referrer_id] = (referrerCounts[r.referrer_id] || 0) + 1;
    });

    const topReferrerIds = Object.entries(referrerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([id, count]) => ({ id, count }));

    // Fetch display names for top referrers
    let topReferrersWithNames: Array<{ id: string; count: number; name: string; email: string | null }> = [];
    if (topReferrerIds.length > 0) {
      const { data: profiles } = await adminSupabase
        .from('profiles')
        .select('id, display_name, email')
        .in('id', topReferrerIds.map((r) => r.id));

      topReferrersWithNames = topReferrerIds.map((r) => {
        const profile = profiles?.find((p) => p.id === r.id);
        return {
          id: r.id,
          count: r.count,
          name: profile?.display_name || 'Unknown',
          email: profile?.email || null,
        };
      });
    }

    // Enrich recent referrals with user names
    let enrichedRecent: Array<Record<string, unknown>> = [];
    if (recentReferrals.data && recentReferrals.data.length > 0) {
      const allUserIds = [
        ...new Set([
          ...recentReferrals.data.map((r) => r.referrer_id),
          ...recentReferrals.data.map((r) => r.referee_id),
        ]),
      ];

      const { data: profiles } = await adminSupabase
        .from('profiles')
        .select('id, display_name, email, referral_promo_code')
        .in('id', allUserIds);

      const profileMap = new Map(profiles?.map((p) => [p.id, p]) || []);

      enrichedRecent = recentReferrals.data.map((r) => {
        const referrer = profileMap.get(r.referrer_id);
        const referee = profileMap.get(r.referee_id);
        return {
          ...r,
          referrer_name: referrer?.display_name || 'Unknown',
          referrer_email: referrer?.email || null,
          referee_name: referee?.display_name || 'Unknown',
          referee_email: referee?.email || null,
        };
      });
    }

    // Calculate conversion rate
    const total = totalReferrals.count ?? 0;
    const qualified = qualifiedReferrals.count ?? 0;
    const conversionRate = total > 0 ? Math.round((qualified / total) * 100) : 0;

    // Total premium days awarded
    const totalDaysAwarded = qualified * (referralConfig.data?.reward_days ?? 7);

    return NextResponse.json({
      kpis: {
        totalReferrals: total,
        qualifiedReferrals: qualified,
        pendingReferrals: pendingReferrals.count ?? 0,
        conversionRate,
        activePromoCodes: totalPromoUsers.count ?? 0,
        totalDaysAwarded,
      },
      topReferrers: topReferrersWithNames,
      recentActivity: enrichedRecent,
      config: referralConfig.data || {
        discount_percent: 20,
        reward_days: 7,
        max_referrals_per_user: 5,
        require_quiz_completion: true,
        require_purchase: false,
        program_active: true,
      },
    });
  } catch (error) {
    console.error('[AdminReferral] Stats error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
