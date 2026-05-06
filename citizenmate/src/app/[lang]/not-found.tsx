"use client";

import Link from "next/link";
import { MapPin, Home, BookOpen, ClipboardCheck } from "lucide-react";
import { useT } from "@/i18n/i18n-context";

export default function NotFound() {
  const { t } = useT();

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
          {t("errors.not_found_title", "Page not found, mate")}
        </h1>

        <p className="text-cm-slate-500 text-sm leading-relaxed mb-8">
          {t("errors.not_found_desc", "Looks like this page has gone walkabout! Don't worry — your study progress is safe. Let's get you back on track.")}
        </p>

        {/* Quick links */}
        <div className="grid gap-3 sm:grid-cols-3 mb-6">
          {[
            {
              icon: Home,
              label: t("errors.dashboard", "Dashboard"),
              href: "/dashboard",
              bg: "bg-cm-navy",
            },
            {
              icon: BookOpen,
              label: t("errors.study_guide", "Study Guide"),
              href: "/study",
              bg: "bg-cm-eucalyptus",
            },
            {
              icon: ClipboardCheck,
              label: t("errors.practice", "Practice"),
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
          {t("errors.back_home", "← Back to home")}
        </Link>
      </div>
    </div>
  );
}
