import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { LayoutDashboard, Users, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const supabase = await createSupabaseServerClient();
  
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${lang}?auth=required`);
  }

  // Check if admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect(`/${lang}`);
  }

  return (
    <div className="flex h-screen bg-cm-ice overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-cm-navy text-white flex flex-col hidden md:flex">
        <div className="p-6">
          <h1 className="text-2xl font-heading font-bold text-cm-gold drop-shadow-sm">
            CitizenMate
          </h1>
          <p className="text-[11px] text-white/60 mt-1 uppercase tracking-wider font-bold">
            Super Admin
          </p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          <Link href={`/${lang}/admin`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <LayoutDashboard className="w-4.5 h-4.5" />
            <span className="font-semibold text-sm">Insights</span>
          </Link>
          <Link href={`/${lang}/admin/users`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <Users className="w-4.5 h-4.5" />
            <span className="font-semibold text-sm">Users & Plans</span>
          </Link>
          <Link href={`/${lang}/admin/blog`} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-white/80 hover:text-white">
            <FileText className="w-4.5 h-4.5" />
            <span className="font-semibold text-sm">Blog Posts</span>
          </Link>
        </nav>
        
        <div className="p-5 border-t border-white/10">
          <Link href={`/${lang}/dashboard`} className="flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Topbar */}
        <header className="h-[66px] bg-white border-b border-[#E9ECEF] flex items-center justify-between px-6 shrink-0 z-10" style={{ boxShadow: 'rgba(0,0,0,0.02) 0px 4px 12px' }}>
          <div className="flex items-center gap-3">
             <h2 className="font-heading font-bold text-cm-navy md:hidden text-lg">Admin</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cm-navy-50 text-cm-navy font-bold text-xs uppercase">
               {user.email?.charAt(0) || 'A'}
             </div>
             <span className="text-sm font-medium text-cm-slate-600 hidden sm:block">{user.email}</span>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
