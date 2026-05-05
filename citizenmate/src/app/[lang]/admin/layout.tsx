import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
    <div className="flex h-screen bg-cm-slate-50 dark:bg-cm-slate-950 text-cm-slate-900 dark:text-cm-slate-100">
      <AdminSidebar lang={lang} />
      <main className="flex-1 h-full overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
