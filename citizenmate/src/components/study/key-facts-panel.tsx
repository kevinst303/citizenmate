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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.15 }}
      className="bg-cm-gold-light border-l-4 border-cm-gold rounded-r-xl p-4 mt-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-4 h-4 text-cm-gold" />
        <span className="text-sm font-heading font-bold text-cm-slate-800">
          {language === "zh" ? "关键事实" : "Key Facts"}
        </span>
      </div>
      <ul className="space-y-2">
        {displayFacts.map((fact, idx) => (
          <li key={idx} className="flex gap-2 text-sm text-cm-slate-700">
            <span className="flex-shrink-0 mt-1 w-1.5 h-1.5 rounded-full bg-cm-gold" />
            <div>
              <span>{fact}</span>
              {showBoth && factsZh[idx] && (
                <span className="block text-cm-slate-500 mt-0.5">
                  {factsZh[idx]}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
