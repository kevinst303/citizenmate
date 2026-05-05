import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Users, FileText, Activity, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminInsightsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const supabase = await createSupabaseServerClient();

  // Fetch some basic stats
  // Total users
  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Total blog posts
  const { count: totalPosts } = await supabase
    .from("blog_posts")
    .select("*", { count: "exact", head: true });

  // Active subscriptions: users with is_premium=true OR paid tier
  const { count: activeSubscriptions } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .or("is_premium.eq.true,tier.in.(pro,premium,sprint_pass)");
  
  // Total quiz history entries (to show engagement)
  const { count: totalQuizzes } = await supabase
    .from("quiz_history")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-cm-slate-900">
            Platform Insights
          </h1>
          <p className="text-cm-slate-500 mt-1">
            Overview of your application's performance and user base.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF]" style={{ boxShadow: 'rgba(0,0,0,0.02) 0px 4px 12px' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cm-sky-light text-cm-sky flex flex-shrink-0 items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-cm-slate-500">Total Users</p>
              <h3 className="text-2xl font-heading font-bold text-cm-navy">{totalUsers || 0}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF]" style={{ boxShadow: 'rgba(0,0,0,0.02) 0px 4px 12px' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cm-eucalyptus-light text-cm-eucalyptus flex flex-shrink-0 items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-cm-slate-500">Active Subs</p>
              <h3 className="text-2xl font-heading font-bold text-cm-navy">{activeSubscriptions}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF]" style={{ boxShadow: 'rgba(0,0,0,0.02) 0px 4px 12px' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex flex-shrink-0 items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-cm-slate-500">Tests Taken</p>
              <h3 className="text-2xl font-heading font-bold text-cm-navy">{totalQuizzes || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF]" style={{ boxShadow: 'rgba(0,0,0,0.02) 0px 4px 12px' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cm-gold-light text-cm-gold flex flex-shrink-0 items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-cm-slate-500">Blog Posts</p>
              <h3 className="text-2xl font-heading font-bold text-cm-navy">{totalPosts || 0}</h3>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mt-8">
         <div className="bg-white rounded-2xl p-6 border border-[#E9ECEF]" style={{ boxShadow: 'rgba(0,0,0,0.02) 0px 4px 12px' }}>
            <h3 className="text-lg font-heading font-bold text-cm-slate-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
               <Link href={`/${lang}/admin/users`} className="flex items-center justify-between p-3 rounded-xl hover:bg-cm-slate-50 border border-transparent hover:border-cm-slate-100 transition-colors">
                  <span className="font-medium text-cm-slate-700">Manage Users</span>
                  <span className="text-cm-sky text-sm font-semibold">Go &rarr;</span>
               </Link>
               <Link href={`/${lang}/admin/blog`} className="flex items-center justify-between p-3 rounded-xl hover:bg-cm-slate-50 border border-transparent hover:border-cm-slate-100 transition-colors">
                  <span className="font-medium text-cm-slate-700">Write Blog Post</span>
                  <span className="text-cm-sky text-sm font-semibold">Go &rarr;</span>
               </Link>
            </div>
         </div>
      </div>
    </div>
  );
}
