import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, ArrowLeft } from "lucide-react";

export default async function AdminLayout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string }> }) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    redirect("/");
  }

  const { lang } = await params;

  return (
    <div className="flex h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 p-6 flex flex-col gap-6 h-full shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold">
            CM
          </div>
          <div className="font-heading font-semibold text-lg">Admin Control</div>
        </div>
        <nav className="flex flex-col gap-2 mt-4 flex-1">
          <Link href={`/${lang}/admin`} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium">
            <LayoutDashboard size={18} className="text-zinc-500" />
            <span>Dashboard</span>
          </Link>
          <Link href={`/${lang}/admin/users`} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium">
            <Users size={18} className="text-zinc-500" />
            <span>Users</span>
          </Link>
          <Link href={`/${lang}/admin/blog`} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium">
            <FileText size={18} className="text-zinc-500" />
            <span>Blog</span>
          </Link>
        </nav>
        <div className="mt-auto border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <Link href={`/${lang}/dashboard`} className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-sm font-medium text-zinc-500">
            <ArrowLeft size={18} />
            <span>Back to App</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
