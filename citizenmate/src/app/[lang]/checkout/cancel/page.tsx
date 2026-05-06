"use client";

import { useT } from "@/i18n/i18n-context";
import { useLocalizedPath } from "@/lib/use-localized-path";
import Link from "next/link";
import { XCircle, ArrowLeft, HelpCircle, Shield } from "lucide-react";

export default function CheckoutCancelPage() {
  const { t } = useT();
  const { getUrl } = useLocalizedPath();

  return (
    <div className="min-h-screen bg-cm-ice flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cm-slate-100 text-cm-slate-400 mb-8">
          <XCircle className="w-10 h-10" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-cm-slate-900 mb-4">
          {t("checkout.cancel_title", "No worries!")}
        </h1>

        <p className="text-lg text-cm-slate-500 leading-relaxed mb-4">
          {t("checkout.cancel_desc", "Your checkout was cancelled and you haven't been charged. You can continue studying with the free tier — no pressure.")}
        </p>

        <p className="text-sm text-cm-slate-400 mb-10">
          {t("checkout.cancel_ready_hint", "When you're ready to unlock all mock tests and unlimited AI tutoring, the Sprint Pass will be waiting for you.")}
        </p>

        {/* Why upgrade card */}
        <div className="card-conseil p-6 text-left mb-8">
          <h2 className="font-heading font-bold text-cm-slate-900 mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-cm-teal" />
            {t("checkout.cancel_not_sure", "Not sure yet?")}
          </h2>
          <ul className="space-y-2 text-sm text-cm-slate-600">
            <li className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-cm-teal flex-shrink-0 mt-0.5" />
              <span>{t("checkout.cancel_no_recurring", "One-time payment — no recurring charges or hidden fees")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-cm-teal flex-shrink-0 mt-0.5" />
              <span>{t("checkout.cancel_refund_policy", "7-day refund policy if you change your mind")}</span>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-cm-teal flex-shrink-0 mt-0.5" />
              <span>{t("checkout.cancel_most_pass", "Most users pass the test within 60 days")}</span>
            </li>
          </ul>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={getUrl("/dashboard")}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-cm-teal text-white font-heading font-bold rounded-full hover:bg-cm-teal/90 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("checkout.cancel_back_dashboard", "Back to Dashboard")}
          </Link>
          <Link
            href="/#pricing"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-cm-slate-200 text-cm-slate-700 font-heading font-semibold rounded-full hover:bg-cm-slate-50 transition-colors duration-200"
          >
            {t("checkout.cancel_view_pricing", "View Pricing")}
          </Link>
        </div>
      </div>
    </div>
  );
}
