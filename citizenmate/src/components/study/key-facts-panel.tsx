"use client";

import { Lightbulb } from "lucide-react";
import { motion } from "framer-motion";
import type { StudyLanguage } from "@/lib/study-context";

interface KeyFactsPanelProps {
  facts: string[];
  factsZh: string[];
  language: StudyLanguage;
}

export function KeyFactsPanel({ facts, factsZh, language }: KeyFactsPanelProps) {
  const displayFacts = language === "zh" ? factsZh : facts;
  const showBoth = language === "both";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.15, type: "spring" as const, stiffness: 120, damping: 16 }}
      className="bg-cm-gold-light border-l-4 border-cm-gold rounded-r-xl p-4 mt-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          initial={{ rotate: -20, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 0.25, type: "spring", stiffness: 300, damping: 12 }}
        >
          <Lightbulb className="w-4 h-4 text-cm-gold" />
        </motion.div>
        <span className="text-sm font-heading font-bold text-cm-slate-800">
          {language === "zh" ? "关键事实" : "Key Facts"}
        </span>
      </div>
      <ul className="space-y-2">
        {displayFacts.map((fact, idx) => (
          <motion.li
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.3 + idx * 0.06,
              type: "spring" as const,
              stiffness: 150,
              damping: 18,
            }}
            className="flex gap-2 text-sm text-cm-slate-700"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.35 + idx * 0.06, type: "spring", stiffness: 400, damping: 12 }}
              className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-cm-gold"
            />
            <div>
              <span>{fact}</span>
              {showBoth && factsZh[idx] && (
                <span className="block text-cm-slate-500 mt-0.5">
                  {factsZh[idx]}
                </span>
              )}
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}
