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
      initial={{ opacity: 0, y: 15, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.08, type: "spring" as const, stiffness: 120, damping: 16 }}
      whileHover={{ y: -2, transition: { type: "spring" as const, stiffness: 400, damping: 25 } }}
      className={`bg-white rounded-[15px] border transition-colors duration-200 overflow-hidden ${
        isComplete
          ? "border-[#E9ECEF]"
          : "border-[#E9ECEF] hover:border-cm-teal/30"
      }`}
      style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
    >
      {/* Header — always visible */}
      <div className="flex items-center gap-3 p-5 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        {/* Completion toggle with spring */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="flex-shrink-0 cursor-pointer"
          aria-label={isComplete ? "Mark as incomplete" : "Mark as complete"}
        >
          <AnimatePresence mode="wait">
            {isComplete ? (
              <motion.div
                key="complete"
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
              >
                <CheckCircle2 className="w-6 h-6 text-cm-teal" />
              </motion.div>
            ) : (
              <motion.div
                key="incomplete"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
              >
                <Circle className="w-6 h-6 text-cm-slate-300 hover:text-cm-teal" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-heading font-semibold text-base transition-colors duration-200 ${
              isComplete ? "text-cm-teal" : "text-cm-slate-900"
            }`}
          >
            {title}
          </h3>
          {showBothTitles && (
            <p className="text-sm text-cm-slate-500 mt-0.5">{section.titleZh}</p>
          )}
        </div>

        {/* Expand indicator with spring rotation */}
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-cm-slate-400" />
        </motion.div>
      </div>

      {/* Expanded content with spring animation */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <div className="border-t border-cm-slate-100 pt-4">
                {/* Content based on language mode */}
                {language === "both" ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* English column */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1, type: "spring" as const, stiffness: 150, damping: 18 }}
                    >
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cm-teal/10 text-cm-teal text-xs font-semibold mb-3">
                        <BookOpen className="w-3 h-3" />
                        English
                      </span>
                      <div className="space-y-3">
                        {contentEn.map((para, i) => (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.04 }}
                            className="text-sm text-cm-slate-700 leading-relaxed"
                          >
                            {para}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                    {/* Chinese column */}
                    <motion.div
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15, type: "spring" as const, stiffness: 150, damping: 18 }}
                    >
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cm-red-light text-cm-red text-xs font-semibold mb-3">
                        <BookOpen className="w-3 h-3" />
                        中文
                      </span>
                      <div className="space-y-3">
                        {contentZh.map((para, i) => (
                          <motion.p
                            key={i}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.04 }}
                            className="text-sm text-cm-slate-700 leading-relaxed"
                          >
                            {para}
                          </motion.p>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(language === "zh" ? contentZh : contentEn).map((para, i) => (
                      <motion.p
                        key={i}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.04 }}
                        className="text-sm text-cm-slate-700 leading-relaxed"
                      >
                        {para}
                      </motion.p>
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
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 pt-3 border-t border-cm-slate-100"
                  >
                    <p className="text-xs text-cm-slate-400">
                      {section.relatedQuestionIds.length} related practice question
                      {section.relatedQuestionIds.length === 1 ? "" : "s"} available
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
