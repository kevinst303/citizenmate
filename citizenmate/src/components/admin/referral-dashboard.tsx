"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  Gift,
  TrendingUp,
  Timer,
  BarChart3,
  Settings,
  Ticket,
  Activity,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { ReferralOverview } from "./referral-overview";
import { ReferralActivity } from "./referral-activity";
import { ReferralCodes } from "./referral-codes";
import { ReferralSettings } from "./referral-settings";

// ===== Types =====
export interface ReferralKPIs {
  totalReferrals: number;
  qualifiedReferrals: number;
  pendingReferrals: number;
  conversionRate: number;
  activePromoCodes: number;
  totalDaysAwarded: number;
}

export interface TopReferrer {
  id: string;
  count: number;
  name: string;
  email: string | null;
}

export interface ReferralActivityItem {
  id: string;
  referrer_id: string;
  referee_id: string;
  reward_days: number;
  reward_type: string;
  qualified: boolean;
  qualified_at: string | null;
  stripe_promo_code_id: string | null;
  created_at: string;
  referrer_name: string;
  referrer_email: string | null;
  referee_name: string;
  referee_email: string | null;
}

export interface ReferralConfig {
  discount_percent: number;
  reward_days: number;
  max_referrals_per_user: number;
  require_quiz_completion: boolean;
  require_purchase: boolean;
  program_active: boolean;
}

export interface PromoCode {
  userId: string;
  name: string;
  email: string | null;
  code: string;
  createdAt: string;
  totalReferred: number;
  qualifiedReferred: number;
}

interface DashboardData {
  kpis: ReferralKPIs;
  topReferrers: TopReferrer[];
  recentActivity: ReferralActivityItem[];
  config: ReferralConfig;
}

// ===== Tab Config =====
const TABS = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "codes", label: "Promo Codes", icon: Ticket },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ===== Main Dashboard =====
export function ReferralAdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/referrals");
      if (!res.ok) throw new Error("Failed to fetch referral data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-cm-slate-900">
            Referral Program
          </h1>
          <p className="text-cm-slate-500 mt-1">
            Monitor, manage, and optimize the &quot;Help a Mate&quot; referral system.
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-cm-slate-600 bg-white border border-[#E9ECEF] rounded-xl hover:bg-cm-slate-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Program Status Banner */}
      {data && !data.config.program_active && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <Timer className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800 font-medium">
            The referral program is currently <strong>paused</strong>. Users
            won&apos;t be able to generate new promo codes.
          </p>
        </div>
      )}

      {/* Quick KPI Row */}
      {data && !loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            icon={Users}
            label="Total Referrals"
            value={data.kpis.totalReferrals}
            color="sky"
          />
          <KPICard
            icon={TrendingUp}
            label="Conversion Rate"
            value={`${data.kpis.conversionRate}%`}
            color="eucalyptus"
          />
          <KPICard
            icon={Gift}
            label="Days Awarded"
            value={data.kpis.totalDaysAwarded}
            color="gold"
          />
          <KPICard
            icon={Ticket}
            label="Active Codes"
            value={data.kpis.activePromoCodes}
            color="purple"
          />
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-[#E9ECEF]">
        <nav className="flex gap-1 -mb-px">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  isActive
                    ? "border-cm-sky text-cm-sky"
                    : "border-transparent text-cm-slate-500 hover:text-cm-slate-700 hover:border-cm-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {loading && !data ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-cm-slate-400" />
          <span className="ml-3 text-cm-slate-500">Loading referral data…</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700 font-medium">{error}</p>
          <button
            onClick={fetchData}
            className="mt-3 text-sm text-red-600 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      ) : data ? (
        <div className="min-h-[400px]">
          {activeTab === "overview" && (
            <ReferralOverview
              kpis={data.kpis}
              topReferrers={data.topReferrers}
              recentActivity={data.recentActivity}
            />
          )}
          {activeTab === "activity" && (
            <ReferralActivity activity={data.recentActivity} />
          )}
          {activeTab === "codes" && <ReferralCodes />}
          {activeTab === "settings" && (
            <ReferralSettings
              config={data.config}
              onSave={() => fetchData()}
            />
          )}
        </div>
      ) : null}
    </div>
  );
}

// ===== KPI Card =====
function KPICard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: "sky" | "eucalyptus" | "gold" | "purple";
}) {
  const colorMap = {
    sky: { bg: "bg-cm-sky-light", text: "text-cm-sky" },
    eucalyptus: { bg: "bg-cm-eucalyptus-light", text: "text-cm-eucalyptus" },
    gold: { bg: "bg-cm-gold-light", text: "text-cm-gold" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
  };

  const c = colorMap[color];

  return (
    <div
      className="bg-white rounded-2xl p-5 border border-[#E9ECEF]"
      style={{ boxShadow: "rgba(0,0,0,0.02) 0px 4px 12px" }}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-11 h-11 rounded-xl ${c.bg} ${c.text} flex shrink-0 items-center justify-center`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs font-medium text-cm-slate-500 uppercase tracking-wider">
            {label}
          </p>
          <h3 className="text-2xl font-heading font-bold text-cm-navy mt-0.5">
            {value}
          </h3>
        </div>
      </div>
    </div>
  );
}
