"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  X,
  Share,
  Plus,
  WifiOff,
  Bell,
  Zap,
  Smartphone,
} from "lucide-react";
import { toast } from "@/lib/toast";
import { useT } from "@/i18n/i18n-context";
import { useAuth } from "@/lib/auth-context";
import { usePwaStore } from "@/lib/store/usePwaStore";

// Extend the global window with the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const ENGAGEMENT_DELAY_MS = 30 * 1000; // 30 seconds

function isIOSSafari(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isWebkit = /WebKit/.test(ua);
  const isChrome = /CriOS/.test(ua);
  return isIOS && isWebkit && !isChrome;
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      (window.navigator as unknown as { standalone: boolean }).standalone)
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  const { t } = useT();
  const { isAuthModalOpen } = useAuth();
  const {
    isInstallable,
    dismissedAt,
    setInstallable,
    setInstalled,
    dismissModal,
    shouldShowModal,
  } = usePwaStore();

  // Listen for the native install prompt event — syncs with Zustand store
  useEffect(() => {
    if (isStandalone()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);
      setInstallable(true, promptEvent);
    };

    const handleInstalled = () => {
      setInstalled(true);
      toast.success(
        t("install.installed_toast"),
        t("install.installed_desc")
      );
    };

    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", handleInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", handleInstalled);
    };
  }, []);

  // Show prompt after engagement delay
  useEffect(() => {
    if (isStandalone() || !shouldShowModal()) return;

    let timer: NodeJS.Timeout;
    let waitingForConsent = false;

    const showAppropriatePrompt = () => {
      if (deferredPrompt) {
        setShowPrompt(true);
      } else if (isIOSSafari()) {
        setShowIOSInstructions(true);
      }
    };

    const handleConsent = () => {
      waitingForConsent = false;
      setTimeout(showAppropriatePrompt, 500);
    };

    const attemptShow = () => {
      // Don't overlap with cookie consent
      if (!localStorage.getItem("cm-cookie-consent")) {
        waitingForConsent = true;
        window.addEventListener("cm-consent-update", handleConsent, {
          once: true,
        });
        return;
      }
      showAppropriatePrompt();
    };

    timer = setTimeout(attemptShow, ENGAGEMENT_DELAY_MS);

    return () => {
      clearTimeout(timer);
      if (waitingForConsent) {
        window.removeEventListener("cm-consent-update", handleConsent);
      }
    };
  }, [deferredPrompt, shouldShowModal]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
      setInstalled(true);
      toast.success(
        t("install.installed_toast"),
        t("install.installed_desc")
      );
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    dismissModal();
  }, [dismissModal]);

  const visible = (showPrompt || showIOSInstructions) && !isAuthModalOpen;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          {/* Backdrop with glassmorphism overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleDismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/20 bg-white/95 shadow-2xl shadow-cm-teal/10 backdrop-blur-xl"
          >
            {/* Gradient decoration */}
            <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gradient-to-br from-cm-teal/20 to-cm-eucalyptus/10 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-gradient-to-tr from-cm-sky/15 to-cm-navy/10 blur-3xl" />

            {/* Header */}
            <div className="relative px-5 pt-5 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* App icon with glassmorphism */}
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cm-teal to-cm-eucalyptus shadow-lg shadow-cm-teal/25">
                    <div className="absolute inset-0 rounded-2xl bg-white/20" />
                    <Smartphone className="relative h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg font-bold text-cm-navy">
                      {t("install.title")}
                    </h3>
                    <p className="text-xs font-medium text-cm-slate-500">
                      {t("install.subtitle")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-cm-slate-100 text-cm-slate-400 transition-colors hover:bg-cm-slate-200 hover:text-cm-slate-600"
                  aria-label={t("install.dismiss")}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="relative px-5 pb-5">
              {showIOSInstructions ? (
                /* iOS-specific instructions */
                <div>
                  <p className="mb-4 text-sm leading-relaxed text-cm-slate-600">
                    {t("install.desc_1")}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 rounded-xl bg-cm-sky-light/50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cm-sky/10">
                        <Share className="h-4 w-4 text-cm-sky" />
                      </div>
                      <p className="text-sm font-medium text-cm-slate-700">
                        {t("install.step_1")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-cm-eucalyptus-light/50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cm-eucalyptus/10">
                        <Plus className="h-4 w-4 text-cm-eucalyptus" />
                      </div>
                      <p className="text-sm font-medium text-cm-slate-700">
                        {t("install.step_2")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="mt-4 w-full cursor-pointer rounded-xl bg-gradient-to-r from-cm-teal to-cm-eucalyptus py-3 text-sm font-heading font-semibold text-white shadow-md shadow-cm-teal/20 transition-all hover:shadow-lg hover:shadow-cm-teal/30 active:scale-[0.98]"
                  >
                    {t("install.got_it")}
                  </button>
                </div>
              ) : (
                /* Standard install prompt with value props */
                <div>
                  <p className="mb-4 text-sm leading-relaxed text-cm-slate-600">
                    {t("install.desc_2")}
                  </p>

                  {/* Value propositions */}
                  <div className="mb-5 space-y-2">
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-cm-teal/[0.06] to-transparent p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cm-teal/10">
                        <WifiOff className="h-4 w-4 text-cm-teal" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-cm-navy">
                          {t("install.value_offline_title")}
                        </p>
                        <p className="text-xs text-cm-slate-500">
                          {t("install.value_offline_desc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-cm-sky/[0.06] to-transparent p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cm-sky/10">
                        <Bell className="h-4 w-4 text-cm-sky" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-cm-navy">
                          {t("install.value_notif_title")}
                        </p>
                        <p className="text-xs text-cm-slate-500">
                          {t("install.value_notif_desc")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-cm-eucalyptus/[0.06] to-transparent p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cm-eucalyptus/10">
                        <Zap className="h-4 w-4 text-cm-eucalyptus" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-cm-navy">
                          {t("install.value_launch_title")}
                        </p>
                        <p className="text-xs text-cm-slate-500">
                          {t("install.value_launch_desc")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleInstall}
                      className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cm-teal to-cm-eucalyptus py-3 text-sm font-heading font-semibold text-white shadow-md shadow-cm-teal/20 transition-all hover:shadow-lg hover:shadow-cm-teal/30 active:scale-[0.98]"
                    >
                      <Download className="h-4 w-4" />
                      {t("install.install_button")}
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="cursor-pointer rounded-xl border border-cm-slate-200 bg-white px-5 py-3 text-sm font-heading font-semibold text-cm-slate-600 shadow-sm transition-all hover:bg-cm-slate-50 hover:text-cm-navy active:scale-[0.98]"
                    >
                      {t("install.not_now")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
