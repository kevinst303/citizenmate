"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wifi, WifiOff, X } from "lucide-react";
import { usePwaStore } from "@/lib/store/usePwaStore";

/**
 * ConnectivityStatus — A subtle indicator bar at the top of the page
 * that shows when the user goes offline/online. Auto-dismisses after
 * a few seconds for "back online" messages.
 */
export function ConnectivityStatus() {
  const isOffline = usePwaStore((s) => s.isOffline);
  const [showOnline, setShowOnline] = useState(false);
  const [prevOffline, setPrevOffline] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isOffline) {
      // Went offline — show immediately
      setDismissed(false);
    } else if (prevOffline) {
      // Just came back online — show "back online" briefly
      setShowOnline(true);
      const timer = setTimeout(() => setShowOnline(false), 4000);
      return () => clearTimeout(timer);
    }
    setPrevOffline(isOffline);
  }, [isOffline, prevOffline]);

  const visible = (isOffline && !dismissed) || showOnline;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -48, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -48, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className={`fixed top-0 left-0 right-0 z-[9999] ${
            isOffline
              ? "bg-amber-50 border-b border-amber-200"
              : "bg-emerald-50 border-b border-emerald-200"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm">
              {isOffline ? (
                <>
                  <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="font-medium text-amber-800">
                    You&apos;re offline — your progress will sync when you reconnect
                  </span>
                </>
              ) : (
                <>
                  <Wifi className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium text-emerald-800">
                    Back online — syncing your data
                  </span>
                </>
              )}
            </div>
            {isOffline && (
              <button
                onClick={() => setDismissed(true)}
                className="shrink-0 p-1 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4 text-amber-500" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
