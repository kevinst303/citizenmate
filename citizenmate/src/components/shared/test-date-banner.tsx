"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ChevronRight } from "lucide-react";
import { useTestDate, type UrgencyLevel } from "@/lib/test-date-context";

const URGENCY_STYLES: Record<
  Exclude<UrgencyLevel, "none">,
  { bg: string; text: string; icon: string; border: string }
> = {
  relaxed: {
    bg: "bg-cm-eucalyptus-light",
    text: "text-cm-eucalyptus-dark",
    icon: "text-cm-eucalyptus",
    border: "border-cm-eucalyptus/20",
  },
  focused: {
    bg: "bg-cm-gold-light",
    text: "text-cm-gold-dark",
    icon: "text-cm-gold",
    border: "border-cm-gold/20",
  },
  crunch: {
    bg: "bg-orange-50",
    text: "text-orange-800",
    icon: "text-orange-500",
    border: "border-orange-200",
  },
  imminent: {
    bg: "bg-cm-red-light",
    text: "text-cm-red-dark",
    icon: "text-cm-red",
    border: "border-cm-red/20",
  },
};

function formatTestDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDaysLabel(days: number): string {
  if (days === 0) return "Today!";
  if (days === 1) return "Tomorrow!";
  return `${days} days`;
}

export function TestDateBanner() {
  const { testDate, daysUntilTest, urgencyLevel, openModal } = useTestDate();

  // No date set — show prompt
  if (!testDate || daysUntilTest === null || urgencyLevel === "none") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-cm-navy-50 border-b border-cm-navy/10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <button
            onClick={openModal}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-sm text-cm-navy font-medium hover:text-cm-navy-light transition-colors cursor-pointer group"
          >
            <Calendar className="w-4 h-4" />
            <span>Set your test date to get a personalised countdown</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>
    );
  }

  // Past test date
  if (daysUntilTest < 0) {
    return null;
  }

  const styles = URGENCY_STYLES[urgencyLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className={`${styles.bg} border-b ${styles.border}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <button
          onClick={openModal}
          className={`w-full flex items-center justify-center gap-3 py-2.5 cursor-pointer group`}
        >
          <Clock className={`w-4 h-4 ${styles.icon}`} />
          <span className={`text-sm font-medium ${styles.text}`}>
            <span className="font-bold">{getDaysLabel(daysUntilTest)}</span>
            {daysUntilTest > 1 && " until your test"}
            <span className="hidden sm:inline text-opacity-70" suppressHydrationWarning>
              {" "}
              · {formatTestDate(testDate)}
            </span>
          </span>
          <ChevronRight
            className={`w-3.5 h-3.5 ${styles.icon} opacity-50 group-hover:translate-x-0.5 transition-transform`}
          />
        </button>
      </div>
    </motion.div>
  );
}
