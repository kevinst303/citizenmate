"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { useT } from "@/i18n/i18n-context";

// ===== Props =====

export interface TestDateCardProps {
  testDate: string | null;
  daysUntilTest: number | null;
  urgencyLevel: string;
  openModal: () => void;
}

// ===== Helpers =====

function getCountdownColor(urgencyLevel: string): string {
  switch (urgencyLevel) {
    case "imminent":
      return "text-cm-red";
    case "crunch":
      return "text-orange-500";
    case "focused":
      return "text-cm-gold";
    default:
      return "text-cm-eucalyptus";
  }
}

function getCountdownGlow(urgencyLevel: string): string {
  switch (urgencyLevel) {
    case "imminent":
      return "rgba(220, 38, 38, 0.15)";
    case "crunch":
      return "rgba(249, 115, 22, 0.15)";
    case "focused":
      return "rgba(217, 119, 6, 0.12)";
    default:
      return "rgba(5, 150, 105, 0.12)";
  }
}

// ===== Component =====

export function TestDateCard({
  testDate,
  daysUntilTest,
  urgencyLevel,
  openModal,
}: TestDateCardProps) {
  const { t } = useT();

  const textColor = getCountdownColor(urgencyLevel);
  const glowColor = getCountdownGlow(urgencyLevel);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative bg-white border border-cm-slate-200/60 p-6 flex flex-col overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Subtle visual goal setting background */}
      <div className="absolute inset-0 z-0 opacity-[0.08] pointer-events-none mix-blend-luminosity">
        <Image
          src="/generated/dash-goal.webp"
          alt="Calendar goal setting"
          fill
          className="object-cover object-bottom"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      <div className="relative z-10 flex items-center gap-2.5 mb-4">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-navy-50 text-cm-navy">
          <Calendar className="w-4.5 h-4.5" />
        </div>
        <h2 className="font-heading font-bold text-cm-slate-900 drop-shadow-sm">
          {t("dashboard.test_date", "Test Date")}
        </h2>
      </div>

      <div className="relative z-10 flex-1 flex flex-col h-full w-full">
        {testDate && daysUntilTest !== null && daysUntilTest >= 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div
              className="countdown-glow"
              style={
                {
                  "--countdown-glow-color": glowColor,
                } as React.CSSProperties
              }
            >
              <motion.p
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  delay: 0.3,
                }}
                className={`text-5xl font-heading font-extrabold ${textColor}`}
              >
                {daysUntilTest}
              </motion.p>
            </div>
            <p className="text-sm text-cm-slate-600 mt-2 font-medium">
              {daysUntilTest === 0
                ? t("dashboard.test_today", "Your test is today! Good luck!")
                : daysUntilTest === 1
                  ? `1 ${t("dashboard.day_until", "day until your test")}`
                  : `${daysUntilTest} ${t("dashboard.days_until", "days until your test")}`}
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-cm-slate-50 rounded-lg text-xs text-cm-slate-500">
              {new Date(testDate).toLocaleDateString("en-AU", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              onClick={openModal}
              className="mt-4 text-xs text-cm-slate-500 hover:text-cm-navy transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-navy focus-visible:ring-offset-2 rounded-md px-2 py-1"
            >
              {t("dashboard.change_date", "Change date")}
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-cm-navy-50 flex items-center justify-center mb-4">
              <Calendar className="w-8 h-8 text-cm-navy/40" />
            </div>
            <p className="text-sm text-cm-slate-600 mb-4">
              {t(
                "dashboard.set_date_prompt",
                "Set your test date to get a personalised countdown"
              )}
            </p>
            <button
              onClick={openModal}
              className="px-5 py-2.5 bg-cm-navy text-white font-heading font-semibold text-sm rounded-xl hover:bg-cm-navy-light transition-colors duration-200 cursor-pointer hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cm-navy focus-visible:ring-offset-2"
            >
              {t("dashboard.set_test_date", "Set Test Date")}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
