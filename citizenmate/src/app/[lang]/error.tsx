"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import * as Sentry from "@sentry/nextjs";
import { useT } from "@/i18n/i18n-context";
import { useLocalizedPath } from "@/lib/use-localized-path";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useT();
  const { getUrl } = useLocalizedPath();

  useEffect(() => {
    console.error("[CitizenMate] Unhandled error:", error);
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-cm-ice flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cm-red-light text-cm-red mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-cm-slate-900 mb-3">
          {t("errors.something_wrong", "Something went wrong")}
        </h1>

        <p className="text-cm-slate-500 text-sm leading-relaxed mb-8">
          {t("errors.temp_hiccup", "No worries, mate — this is a temporary hiccup. Your study progress is safe. Try refreshing the page, or head back to the dashboard.")}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-cm-navy text-white font-heading font-semibold rounded-xl hover:bg-cm-navy-light transition-colors duration-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            {t("errors.try_again", "Try Again")}
          </button>
          <Link
            href={getUrl("/dashboard")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white border border-cm-slate-200 text-cm-slate-700 font-heading font-semibold rounded-xl hover:bg-cm-slate-50 transition-colors duration-200"
          >
            <Home className="w-4 h-4" />
            {t("errors.dashboard", "Dashboard")}
          </Link>
        </div>

        {/* Error ID for support */}
        {error.digest && (
          <p className="mt-8 text-xs text-cm-slate-400">
            {t("errors.error_id", "Error ID:")} {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
