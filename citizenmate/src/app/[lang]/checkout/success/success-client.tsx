"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/i18n/i18n-context";
import { useLocalizedPath } from "@/lib/use-localized-path";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { CheckCircle2, Clock, BookOpen, GraduationCap, ArrowRight } from "lucide-react";

// Tier-correct confirmation. While the Stripe webhook may still be in flight,
// poll refreshPremiumStatus a few times so premium unlocks without a reload.
export default function CheckoutSuccessClient({
  verified,
  tier,
  mode,
  interval,
}: {
  verified: boolean;
  tier: string | null;
  mode: "subscription" | "payment" | "setup" | null;
  interval: string | null;
}) {
  const { t } = useT();
  const { getUrl } = useLocalizedPath();
  const { refreshPremiumStatus, profile } = useAuth();
  const [attempts, setAttempts] = useState(0);
  const pollingRef = useRef(false);

  const isSubscription = mode === "subscription";
  const planLabel = !tier
    ? t("checkout.success_sprint_pass", "Exam Sprint Pass")
    : tier === "sprint_pass" || (!isSubscription && tier !== "pro" && tier !== "premium")
      ? t("checkout.success_sprint_pass", "Exam Sprint Pass")
      : tier === "pro"
        ? t("checkout.success_pro_plan", "Pro")
        : t("checkout.success_premium_plan", "Premium");

  const planDetails = isSubscription
    ? interval === "year"
      ? t("checkout.success_sub_year", "Your subscription is active and renews yearly. Cancel anytime from Settings.")
      : t("checkout.success_sub_month", "Your subscription is active and renews monthly. Cancel anytime from Settings.")
    : t("checkout.success_days_suffix", "You have 60 days of full access to everything CitizenMate offers.");

  useEffect(() => {
    if (!verified || profile.isPremium || pollingRef.current) return;
    pollingRef.current = true;

    // Webhook usually lands within seconds; retry a handful of times.
    const timers = [2000, 5000, 10000, 15000].map((delay, i) =>
      setTimeout(() => {
        refreshPremiumStatus();
        setAttempts(i + 1);
      }, delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [verified, profile.isPremium, refreshPremiumStatus]);

  const stillProcessing = verified && !profile.isPremium && attempts >= 4;

  return (
    <div className="min-h-screen bg-cm-ice flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-cm-teal/10 text-cm-teal mb-8">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-cm-slate-900 mb-4">
          {t("checkout.success_title", "You're all set, mate! 🎉")}
        </h1>

        {verified ? (
          <>
            <p className="text-lg text-cm-slate-500 leading-relaxed mb-2">
              {t("checkout.success_pass_active", "Your")}{" "}
              <strong className="text-cm-teal">{planLabel}</strong>{" "}
              {t("checkout.success_is_now_active", "is now active.")}
            </p>
            <p className="text-sm text-cm-slate-500 leading-relaxed mb-4">{planDetails}</p>
          </>
        ) : (
          <p className="text-lg text-cm-slate-500 leading-relaxed mb-4">
            {t(
              "checkout.success_unverified",
              "Your payment is being confirmed. Premium features unlock automatically — usually within a minute. You can safely refresh this page."
            )}
          </p>
        )}

        {stillProcessing && (
          <p className="inline-flex items-center gap-2 text-sm text-cm-slate-400 mb-4">
            <Clock className="w-4 h-4" />
            {t(
              "checkout.success_still_processing",
              "Still confirming? Your access may take another minute. If it doesn't appear, contact"
            )}{" "}
            <a href="mailto:support@citizenmate.com.au" className="text-cm-teal hover:underline">
              support@citizenmate.com.au
            </a>
          </p>
        )}

        <p className="text-sm text-cm-slate-400 mb-10">
          {t("checkout.success_confirmation_email", "A confirmation email will arrive shortly. If you need any help, reach out to")}{" "}
          <a href="mailto:support@citizenmate.com.au" className="text-cm-teal hover:underline">
            support@citizenmate.com.au
          </a>
        </p>

        {/* What to do next */}
        <div className="card-conseil p-6 text-left mb-8">
          <h2 className="font-heading font-bold text-cm-slate-900 mb-4">
            {t("checkout.success_next_title", "What to do next")}
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cm-teal/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-cm-teal" />
              </div>
              <div>
                <p className="font-semibold text-sm text-cm-slate-900">{t("checkout.success_study_topics", "Study the topics")}</p>
                <p className="text-xs text-cm-slate-500">
                  {t("checkout.success_study_desc", "Work through all chapters in bilingual mode with AI explanations.")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cm-purple/10 flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-cm-purple" />
              </div>
              <div>
                <p className="font-semibold text-sm text-cm-slate-900">{t("checkout.success_take_tests", "Take mock tests")}</p>
                <p className="text-xs text-cm-slate-500">
                  {t("checkout.success_tests_desc", "You now have access to all 15 mock tests with unlimited retakes.")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href={getUrl("/dashboard")}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-cm-teal text-white font-heading font-bold rounded-full hover:bg-cm-teal/90 transition-colors duration-200"
          >
            {t("checkout.success_go_dashboard", "Go to Dashboard")}
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href={getUrl("/practice")}            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border border-cm-slate-200 text-cm-slate-700 font-heading font-semibold rounded-full hover:bg-cm-slate-50 transition-colors duration-200"
          >
            {t("checkout.success_start_test", "Start a Mock Test")}
          </Link>
        </div>
      </div>
    </div>
  );
}
