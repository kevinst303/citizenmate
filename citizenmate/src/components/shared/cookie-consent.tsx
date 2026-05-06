"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLocalizedPath } from "@/lib/use-localized-path";
import { useT } from "@/i18n/i18n-context";

const CONSENT_KEY = "cm-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const { getUrl } = useLocalizedPath();
  const { t } = useT();

  useEffect(() => {
    // Small delay so it doesn't block the paint
    const timer = setTimeout(() => {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) setVisible(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
    // Dispatch event so analytics component can pick it up
    window.dispatchEvent(new Event("cm-consent-update"));
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
    window.dispatchEvent(new Event("cm-consent-update"));
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="fixed bottom-0 inset-x-0 z-[100] p-4 sm:p-6"
        >
          <div className="mx-auto max-w-3xl glass-card rounded-2xl shadow-xl border border-white/30 p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-cm-navy/10 text-cm-navy">
                <Shield className="size-5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-sm text-cm-navy">
                  {t("cookie_consent.title")}
                </p>
                <p className="mt-1 text-sm text-cm-slate-500 leading-relaxed">
                  {t("cookie_consent.description")}{" "}
                  <Link
                    href={getUrl("/cookies")}
                    className="text-cm-sky hover:underline font-medium"
                  >
                    {t("cookie_consent.learn_more")}
                  </Link>
                </p>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Button
                    onClick={accept}
                    className="bg-cm-navy hover:bg-cm-navy-light text-white rounded-xl px-5 h-9 text-sm font-heading font-semibold cursor-pointer"
                  >
                    {t("cookie_consent.accept_all")}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={decline}
                    className="rounded-xl px-5 h-9 text-sm font-heading font-semibold cursor-pointer"
                  >
                    {t("cookie_consent.essential_only")}
                  </Button>
                </div>
              </div>

              <button
                onClick={decline}
                className="shrink-0 text-cm-slate-400 hover:text-cm-slate-600 transition-colors cursor-pointer"
                aria-label={t("cookie_consent.close_banner")}
              >
                <X className="size-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Utility: check if the user has accepted analytics cookies.
 * Safe to call on the server — returns false.
 */
export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}
