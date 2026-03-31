"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Share, Plus } from "lucide-react";
import { toast } from "@/lib/toast";

// Extend the global window with the beforeinstallprompt event
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "citizenmate-install-dismissed";
const DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
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

function isDismissed(): boolean {
  if (typeof window === "undefined") return false;
  const dismissed = localStorage.getItem(DISMISS_KEY);
  if (!dismissed) return false;
  const dismissedAt = parseInt(dismissed, 10);
  if (Date.now() - dismissedAt > DISMISS_DURATION_MS) {
    localStorage.removeItem(DISMISS_KEY);
    return false;
  }
  return true;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  // Listen for the native install prompt event
  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Show prompt after engagement delay
  useEffect(() => {
    if (isStandalone() || isDismissed()) return;

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
      // Add a small delay after dismissing cookie banner before showing install prompt
      setTimeout(showAppropriatePrompt, 500);
    };

    const attemptShow = () => {
      // Don't overlap with cookie consent
      if (!localStorage.getItem("cm-cookie-consent")) {
        waitingForConsent = true;
        window.addEventListener("cm-consent-update", handleConsent, { once: true });
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
  }, [deferredPrompt]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowPrompt(false);
      toast.success(
        "CitizenMate installed! 🇦🇺",
        "Launch from your home screen to study anytime."
      );
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    setShowIOSInstructions(false);
    localStorage.setItem(DISMISS_KEY, Date.now().toString());
  }, []);

  const visible = showPrompt || showIOSInstructions;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 z-50 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
        >
          <div className="mx-auto max-w-lg bg-white rounded-2xl shadow-2xl border border-cm-slate-200 overflow-hidden">
            {/* Header gradient */}
            <div className="bg-gradient-to-r from-cm-navy via-cm-navy-light to-cm-navy-lighter px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* App icon */}
                  <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                    <span className="text-2xl">🇦🇺</span>
                  </div>
                  <div>
                    <h3 className="text-white font-heading font-bold text-base">
                      Install CitizenMate
                    </h3>
                    <p className="text-white/70 text-xs">
                      Add to your home screen
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Dismiss install prompt"
                >
                  <X className="w-4 h-4 text-white/80" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              {showIOSInstructions ? (
                /* iOS-specific instructions */
                <div>
                  <p className="text-sm text-cm-slate-600 mb-4">
                    Get the full app experience — study offline, quick launch
                    from your home screen!
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cm-sky-light flex items-center justify-center shrink-0">
                        <Share className="w-4 h-4 text-cm-sky" />
                      </div>
                      <p className="text-sm text-cm-slate-700">
                        Tap the{" "}
                        <span className="font-semibold">Share</span> button
                        in Safari
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cm-eucalyptus-light flex items-center justify-center shrink-0">
                        <Plus className="w-4 h-4 text-cm-eucalyptus" />
                      </div>
                      <p className="text-sm text-cm-slate-700">
                        Scroll down and tap{" "}
                        <span className="font-semibold">
                          Add to Home Screen
                        </span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDismiss}
                    className="mt-4 w-full py-2.5 text-sm font-heading font-semibold text-cm-slate-500 hover:text-cm-navy transition-colors cursor-pointer"
                  >
                    Got it
                  </button>
                </div>
              ) : (
                /* Standard install prompt */
                <div>
                  <p className="text-sm text-cm-slate-600 mb-4">
                    Get the full app experience — study offline, quick launch
                    from your home screen, and stay on track for your test!
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleInstall}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-cm-navy text-white font-heading font-semibold text-sm hover:bg-cm-navy-light transition-colors shadow-md cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      Install
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="px-5 py-3 rounded-xl bg-cm-slate-50 text-cm-slate-600 font-heading font-semibold text-sm hover:bg-cm-slate-100 transition-colors cursor-pointer"
                    >
                      Not now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
