"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, ChevronDown } from "lucide-react";
import type { PublicHoliday } from "@/app/api/australia-insights/route";

interface HolidaysWidgetProps {
  data: PublicHoliday[];
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function getCountdownBadge(daysUntil: number) {
  if (daysUntil === 0) return { label: "Today! 🎉", color: "bg-cm-eucalyptus text-white" };
  if (daysUntil === 1) return { label: "Tomorrow", color: "bg-cm-gold text-white" };
  if (daysUntil <= 7) return { label: `${daysUntil}d`, color: "bg-cm-sky text-white" };
  if (daysUntil <= 30) return { label: `${daysUntil}d`, color: "bg-cm-navy-50 text-cm-navy" };
  return { label: `${daysUntil}d`, color: "bg-cm-slate-100 text-cm-slate-500" };
}

export function HolidaysWidget({ data }: HolidaysWidgetProps) {
  const [showAll, setShowAll] = useState(false);

  const upcomingHolidays = data.filter((h) => !h.isPast);
  const nextThree = upcomingHolidays.slice(0, 3);
  const remaining = upcomingHolidays.slice(3);

  return (
    <div className="glass-card-premium rounded-2xl shadow-card overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="p-5 pb-3 border-b border-cm-slate-100">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cm-gold-light text-cm-gold">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-cm-slate-900 text-base">Public Holidays</h3>
            <p className="text-[10px] text-cm-slate-400">
              {upcomingHolidays.length} upcoming in {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </div>

      {/* Next 3 holidays */}
      <div className="flex-1 px-4 py-3 space-y-1.5">
        {nextThree.map((holiday, i) => {
          const badge = getCountdownBadge(holiday.daysUntil);
          return (
            <motion.div
              key={holiday.date + holiday.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/60 border border-cm-slate-100/60 hover:border-cm-gold/30 hover:shadow-sm transition-all duration-200"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cm-slate-800 truncate">{holiday.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-cm-slate-500">{formatDate(holiday.date)}</span>
                  {!holiday.global && holiday.counties && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cm-slate-100 text-cm-slate-500">
                      {holiday.counties.map((c) => c.replace("AU-", "")).join(", ")}
                    </span>
                  )}
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.color} flex-shrink-0`}>
                {badge.label}
              </span>
            </motion.div>
          );
        })}

        {/* Show more toggle */}
        {remaining.length > 0 && (
          <>
            <button
              onClick={() => setShowAll(!showAll)}
              className="w-full flex items-center justify-center gap-1 py-2 text-xs font-medium text-cm-slate-500 hover:text-cm-navy transition-colors cursor-pointer"
            >
              {showAll ? "Show less" : `Show ${remaining.length} more holidays`}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${showAll ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {showAll && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden space-y-1.5"
                >
                  {remaining.map((holiday) => {
                    const badge = getCountdownBadge(holiday.daysUntil);
                    return (
                      <div
                        key={holiday.date + holiday.name}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/40 border border-cm-slate-100/40"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-cm-slate-700 truncate">{holiday.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] text-cm-slate-400">{formatDate(holiday.date)}</span>
                            {!holiday.global && holiday.counties && (
                              <span className="px-1 py-0.5 rounded text-[9px] font-bold bg-cm-slate-50 text-cm-slate-400">
                                {holiday.counties.map((c) => c.replace("AU-", "")).join(", ")}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.color} flex-shrink-0`}>
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
