"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, ArrowLeft, Gift } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/referrals", label: "Referrals", icon: Gift },
  { href: "/admin/blog", label: "Blog", icon: FileText },
];

export function AdminSidebar({ lang }: { lang: string }) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === `/${lang}/admin`;
    return pathname.startsWith(`/${lang}${href}`);
  };

  return (
    <aside className="w-64 bg-white dark:bg-cm-slate-900 border-r border-cm-slate-200 dark:border-cm-slate-800 p-6 flex flex-col gap-6 h-full shadow-sm z-10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-cm-teal flex items-center justify-center text-white font-bold">
          CM
        </div>
        <div className="font-heading font-semibold text-lg text-cm-slate-900 dark:text-white">
          Admin Control
        </div>
      </div>
      <nav className="flex flex-col gap-2 mt-4 flex-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={`/${lang}${item.href}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? "bg-cm-teal/10 text-cm-teal font-semibold"
                  : "text-cm-slate-500 hover:bg-cm-slate-50 dark:hover:bg-cm-slate-800 hover:text-cm-slate-700 dark:hover:text-cm-slate-300"
              }`}
            >
              <Icon size={18} className={active ? "text-cm-teal" : "text-cm-slate-400"} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-cm-slate-200 dark:border-cm-slate-800 pt-4">
        <Link
          href={`/${lang}/dashboard`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-cm-slate-500 hover:bg-cm-slate-50 dark:hover:bg-cm-slate-800 hover:text-cm-slate-700 dark:hover:text-cm-slate-300 transition-all"
        >
          <ArrowLeft size={18} />
          <span>Back to App</span>
        </Link>
      </div>
    </aside>
  );
}
