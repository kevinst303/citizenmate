"use client";

import { WifiOff, RefreshCw, BookOpen, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function OfflinePage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" as const }}
        className="text-center max-w-md mx-auto"
      >
        {/* Offline Icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto mb-8 w-24 h-24 rounded-full bg-cm-navy-50 flex items-center justify-center"
        >
          <WifiOff className="w-12 h-12 text-cm-navy" strokeWidth={1.5} />
        </motion.div>

        {/* Heading */}
        <h1 className="text-3xl font-heading font-bold mb-3 text-cm-navy">
          You&apos;re offline, mate
        </h1>

        {/* Description */}
        <p className="text-lg mb-8 leading-relaxed text-cm-slate-600">
          No worries — it happens! Check your internet connection and try again.
          Any study progress you&apos;ve already made is safely saved on your device.
        </p>

        {/* Try Again Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cm-navy text-white font-heading font-semibold text-lg shadow-lg cursor-pointer transition-all hover:shadow-xl hover:bg-cm-navy-light"
        >
          <RefreshCw className="w-5 h-5" />
          Try Again
        </motion.button>

        {/* Helpful tips */}
        <div className="mt-12 text-left space-y-4">
          <p className="text-sm font-heading font-semibold uppercase tracking-wide text-cm-navy">
            While you&apos;re offline, you can still:
          </p>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cm-eucalyptus-light flex items-center justify-center shrink-0 mt-0.5">
                <BookOpen className="w-4 h-4 text-cm-eucalyptus" />
              </div>
              <p className="text-sm text-cm-slate-600">
                Review study sections you&apos;ve already loaded
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-cm-red-light flex items-center justify-center shrink-0 mt-0.5">
                <ClipboardCheck className="w-4 h-4 text-cm-red" />
              </div>
              <p className="text-sm text-cm-slate-600">
                Check your readiness dashboard and study progress
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
