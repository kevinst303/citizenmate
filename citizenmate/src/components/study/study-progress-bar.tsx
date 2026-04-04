"use client";

import { motion } from "framer-motion";

interface StudyProgressBarProps {
  completed: number;
  total: number;
  label?: string;
  colorClass?: string;
  size?: "sm" | "md";
}

export function StudyProgressBar({
  completed,
  total,
  label,
  colorClass = "bg-cm-teal",
  size = "md",
}: StudyProgressBarProps) {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const height = size === "sm" ? "h-1.5" : "h-2.5";

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-cm-slate-500">{label}</span>
          <span className="text-xs font-semibold text-cm-slate-700">
            {completed}/{total}
          </span>
        </div>
      )}
      <div className={`w-full ${height} bg-cm-slate-100 rounded-full overflow-hidden`}>
        <motion.div
          className={`${height} ${colorClass} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
