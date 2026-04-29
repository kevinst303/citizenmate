import Link from "next/link";
import { MapPin, Home, BookOpen, ClipboardCheck } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cm-ice flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cm-navy-50 text-cm-navy mb-6">
          <MapPin className="w-8 h-8" />
        </div>

        {/* 404 Display */}
        <p className="text-6xl font-heading font-extrabold text-cm-navy/20 mb-2">
          404
        </p>

        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-cm-slate-900 mb-3">
          Page not found, mate
        </h1>

        <p className="text-cm-slate-500 text-sm leading-relaxed mb-8">
          Looks like this page has gone walkabout! Don&apos;t worry — your study
          progress is safe. Let&apos;s get you back on track.
        </p>

        {/* Quick links */}
        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          {[
            {
              icon: Home,
              label: "Dashboard",
              href: "/dashboard",
              bg: "bg-cm-navy",
            },
            {
              icon: BookOpen,
              label: "Study Guide",
              href: "/study",
              bg: "bg-cm-eucalyptus",
            },
            {
              icon: ClipboardCheck,
              label: "Practice",
              href: "/practice",
              bg: "bg-cm-gold",
            },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-2 p-4 ${link.bg} text-white rounded-xl hover:opacity-90 transition-opacity duration-200`}
            >
              <link.icon className="w-5 h-5" />
              <span className="text-sm font-heading font-semibold">
                {link.label}
              </span>
            </Link>
          ))}
        </div>

        {/* Home link */}
        <Link
          href="/"
          className="text-sm text-cm-sky hover:underline font-medium"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
