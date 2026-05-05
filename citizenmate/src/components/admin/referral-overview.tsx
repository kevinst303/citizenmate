"use client";

import { Trophy, ArrowUpRight, Clock, CheckCircle2, XCircle } from "lucide-react";
import type {
  ReferralKPIs,
  TopReferrer,
  ReferralActivityItem,
} from "./referral-dashboard";

// ===== Overview Tab =====
// Shows KPI breakdowns, top referrers leaderboard, and recent activity summary.

interface Props {
  kpis: ReferralKPIs;
  topReferrers: TopReferrer[];
  recentActivity: ReferralActivityItem[];
}

export function ReferralOverview({ kpis, topReferrers, recentActivity }: Props) {
  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Left: Funnel + Top Referrers */}
      <div className="lg:col-span-2 space-y-6">
        {/* Conversion Funnel */}
        <div
          className="bg-white rounded-2xl p-6 border border-cm-slate-200 card-conseil"
        >
          <h3 className="text-sm font-bold text-cm-slate-900 uppercase tracking-wider mb-4">
            Referral Funnel
          </h3>
          <div className="space-y-3">
            <FunnelRow
              label="Promo Codes Generated"
              value={kpis.activePromoCodes}
              total={kpis.activePromoCodes}
              color="bg-cm-sky"
            />
            <FunnelRow
              label="Referrals Made"
              value={kpis.totalReferrals}
              total={kpis.activePromoCodes}
              color="bg-cm-ocean"
            />
            <FunnelRow
              label="Qualified"
              value={kpis.qualifiedReferrals}
              total={kpis.totalReferrals || 1}
              color="bg-cm-eucalyptus"
            />
            <FunnelRow
              label="Pending"
              value={kpis.pendingReferrals}
              total={kpis.totalReferrals || 1}
              color="bg-amber-400"
            />
          </div>
        </div>

        {/* Top Referrers Leaderboard */}
        <div
          className="bg-white rounded-2xl p-6 border border-cm-slate-200 card-conseil"
        >
          <h3 className="text-sm font-bold text-cm-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-cm-gold" />
            Top Referrers
          </h3>
          {topReferrers.length === 0 ? (
            <p className="text-sm text-cm-slate-400 py-4 text-center">
              No referrals yet
            </p>
          ) : (
            <div className="space-y-2">
              {topReferrers.map((referrer, i) => (
                <div
                  key={referrer.id}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-cm-slate-50 transition-colors"
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      i === 0
                        ? "bg-cm-gold-light text-cm-gold"
                        : i === 1
                          ? "bg-cm-slate-100 text-cm-slate-600"
                          : i === 2
                            ? "bg-amber-100 text-amber-700"
                            : "bg-cm-slate-50 text-cm-slate-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cm-slate-800 truncate">
                      {referrer.name}
                    </p>
                    <p className="text-xs text-cm-slate-400 truncate">
                      {referrer.email}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-cm-navy">
                      {referrer.count}
                    </span>
                    <span className="text-xs text-cm-slate-400 ml-1">
                      qualified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: Recent Activity Feed */}
      <div className="lg:col-span-3">
        <div
          className="bg-white rounded-2xl p-6 border border-cm-slate-200 card-conseil"
        >
          <h3 className="text-sm font-bold text-cm-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <ArrowUpRight className="w-4 h-4 text-cm-sky" />
            Recent Activity
          </h3>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-cm-slate-400 py-8 text-center">
              No referral activity yet
            </p>
          ) : (
            <div className="space-y-1">
              {recentActivity.slice(0, 10).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 p-3 rounded-xl hover:bg-cm-slate-50 transition-colors"
                >
                  <div className="mt-0.5 shrink-0">
                    {item.qualified ? (
                      <CheckCircle2 className="w-4.5 h-4.5 text-cm-eucalyptus" />
                    ) : (
                      <Clock className="w-4.5 h-4.5 text-amber-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-cm-slate-700">
                      <strong className="font-semibold">
                        {item.referrer_name}
                      </strong>{" "}
                      referred{" "}
                      <strong className="font-semibold">
                        {item.referee_name}
                      </strong>
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                          item.qualified
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {item.qualified ? "Qualified" : "Pending"}
                      </span>
                      <span className="text-xs text-cm-slate-400">
                        {new Date(item.created_at).toLocaleDateString("en-AU", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-medium text-cm-slate-500">
                      +{item.reward_days}d
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== Funnel Row =====
function FunnelRow({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = total > 0 ? Math.min((value / total) * 100, 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-1">
        <span className="text-cm-slate-600">{label}</span>
        <span className="font-bold text-cm-navy">{value}</span>
      </div>
      <div className="h-2 bg-cm-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
