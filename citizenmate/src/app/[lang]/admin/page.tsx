"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, TrendingUp, Activity, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { KPICard } from "@/components/admin/kpi-card";

interface AnalyticsData {
  kpis: {
    totalUsers: number;
    activeSubs: number;
    totalQuizzes: number;
    totalPosts: number;
    trends: {
      users: number;
      subs: number;
      quizzes: number;
      posts: number;
    };
  };
  charts: {
    userGrowth: { date: string; count: number }[];
    quizCompletions: { date: string; count: number }[];
    revenue: { date: string; value: number }[];
  };
}

const PERIODS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
] as const;

function formatTrend(value: number): { direction: "up" | "down" | "flat"; value: string } {
  if (value > 0) return { direction: "up", value: `+${value}%` };
  if (value < 0) return { direction: "down", value: `${value}%` };
  return { direction: "flat", value: "0%" };
}

export default function AdminInsightsPage() {
  const params = useParams<{ lang: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?days=${period}`);
      if (!res.ok) throw new Error("Failed to fetch analytics");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-cm-slate-900">Platform Insights</h1>
          <p className="text-cm-slate-500 mt-1">Overview of your application&apos;s performance and user base.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          icon={Users}
          label="Total Users"
          value={data?.kpis.totalUsers ?? "-"}
          color="sky"
          trend={data ? formatTrend(data.kpis.trends.users) : undefined}
        />
        <KPICard
          icon={TrendingUp}
          label="Active Subs"
          value={data?.kpis.activeSubs ?? "-"}
          color="eucalyptus"
          trend={data ? formatTrend(data.kpis.trends.subs) : undefined}
        />
        <KPICard
          icon={Activity}
          label="Tests Taken"
          value={data?.kpis.totalQuizzes ?? "-"}
          color="purple"
          trend={data ? formatTrend(data.kpis.trends.quizzes) : undefined}
        />
        <KPICard
          icon={FileText}
          label="Blog Posts"
          value={data?.kpis.totalPosts ?? "-"}
          color="gold"
          trend={data ? formatTrend(data.kpis.trends.posts) : undefined}
        />
      </div>

      {/* Time Period Selector */}
      <div className="flex gap-1.5 bg-cm-slate-50 rounded-xl p-1 w-fit">
        {PERIODS.map((p) => (
          <button
            key={p.days}
            onClick={() => setPeriod(p.days)}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${
              period === p.days
                ? "bg-white text-cm-teal shadow-sm"
                : "text-cm-slate-500 hover:text-cm-slate-700"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Charts */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="card-conseil h-72 animate-pulse">
              <div className="h-4 w-32 bg-cm-slate-100 rounded mb-4" />
              <div className="h-56 bg-cm-slate-50 rounded" />
            </div>
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* User Growth */}
            <div className="card-conseil">
              <h3 className="text-sm font-bold text-cm-slate-900 uppercase tracking-wider mb-4">User Growth</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.charts.userGrowth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#006769" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quiz Engagement */}
            <div className="card-conseil">
              <h3 className="text-sm font-bold text-cm-slate-900 uppercase tracking-wider mb-4">Quiz Engagement</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.charts.quizCompletions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#3d348b" fill="#3d348b" fillOpacity={0.1} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="card-conseil">
            <h3 className="text-sm font-bold text-cm-slate-900 uppercase tracking-wider mb-4">Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.charts.revenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9ECEF" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      ) : null}

      {/* Quick Actions */}
      <div className="card-conseil">
        <h3 className="text-sm font-bold text-cm-slate-900 uppercase tracking-wider mb-4">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href={`/${params.lang}/admin/users`}
            className="flex items-center justify-between p-4 rounded-xl hover:bg-cm-slate-50 border border-cm-slate-100 hover:border-cm-teal/20 transition-all group"
          >
            <span className="font-medium text-cm-slate-700 group-hover:text-cm-teal transition-colors">Manage Users</span>
            <ArrowRight className="w-4 h-4 text-cm-slate-400 group-hover:text-cm-teal transition-colors" />
          </Link>
          <Link
            href={`/${params.lang}/admin/blog`}
            className="flex items-center justify-between p-4 rounded-xl hover:bg-cm-slate-50 border border-cm-slate-100 hover:border-cm-teal/20 transition-all group"
          >
            <span className="font-medium text-cm-slate-700 group-hover:text-cm-teal transition-colors">Write Blog Post</span>
            <ArrowRight className="w-4 h-4 text-cm-slate-400 group-hover:text-cm-teal transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
