"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Circle, ChevronDown, BookOpen } from "lucide-react";
import type { StudySection } from "@/lib/types";
import type { StudyLanguage } from "@/lib/study-context";
import { KeyFactsPanel } from "./key-facts-panel";

interface StudySectionCardProps {
  section: StudySection;
  language: StudyLanguage;
  isComplete: boolean;
  onToggleComplete: () => void;
  index: number;
}

export function StudySectionCard({
  section,
  language,
  isComplete,
  onToggleComplete,
  index,
}: StudySectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const title = language === "zh" ? section.titleZh : section.title;
  const showBothTitles = language === "both";

  const contentEn = section.content.split("\n\n");
  const contentZh = section.contentZh.split("\n\n");

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`bg-white rounded-2xl border-2 transition-colors duration-200 overflow-hidden ${
        isComplete
          ? "border-cm-eucalyptus/30"
          : "border-cm-slate-200 hover:border-cm-navy/30"
      }`}
    >
      {/* Header — always visible */}
      <div className="flex items-center gap-3 p-5 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        {/* Completion toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className="flex-shrink-0 cursor-pointer transition-transform duration-200 hover:scale-110"
          aria-label={isComplete ? "Mark as incomplete" : "Mark as complete"}
        >
          {isComplete ? (
            <CheckCircle2 className="w-6 h-6 text-cm-eucalyptus" />
          ) : (
            <Circle className="w-6 h-6 text-cm-slate-300 hover:text-cm-navy" />
          )}
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-heading font-semibold text-base transition-colors duration-200 ${
              isComplete ? "text-cm-eucalyptus" : "text-cm-slate-900"
            }`}
          >
            {title}
          </h3>
          {showBothTitles && (
            <p className="text-sm text-cm-slate-500 mt-0.5">{section.titleZh}</p>
          )}
        </div>

        {/* Expand indicator */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-cm-slate-400" />
        </motion.div>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <div className="border-t border-cm-slate-100 pt-4">
                {/* Content based on language mode */}
                {language === "both" ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* English column */}
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cm-navy-50 text-cm-navy text-xs font-semibold mb-3">
                        <BookOpen className="w-3 h-3" />
                        English
                      </span>
                      <div className="space-y-3">
                        {contentEn.map((para, i) => (
                          <p key={i} className="text-sm text-cm-slate-700 leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                    {/* Chinese column */}
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cm-red-light text-cm-red text-xs font-semibold mb-3">
                        <BookOpen className="w-3 h-3" />
                        中文
                      </span>
                      <div className="space-y-3">
                        {contentZh.map((para, i) => (
                          <p key={i} className="text-sm text-cm-slate-700 leading-relaxed">
                            {para}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(language === "zh" ? contentZh : contentEn).map((para, i) => (
                      <p key={i} className="text-sm text-cm-slate-700 leading-relaxed">
                        {para}
                      </p>
                    ))}
                  </div>
                )}

                {/* Key Facts */}
                <KeyFactsPanel
                  facts={section.keyFacts}
                  factsZh={section.keyFactsZh}
                  language={language}
                />

                {/* Related questions link */}
                {section.relatedQuestionIds.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-cm-slate-100">
                    <p className="text-xs text-cm-slate-400">
                      {section.relatedQuestionIds.length} related practice question
                      {section.relatedQuestionIds.length === 1 ? "" : "s"} available
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
