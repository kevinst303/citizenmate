"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";

interface XaiTooltipProps {
  /** i18n key to look up explanation text (e.g. "xai.interval_explanation") */
  i18nKey?: string;
  /** Optional custom explanation text (overrides i18nKey if provided) */
  explanation?: string;
  /** Position of the tooltip relative to the trigger */
  side?: "top" | "bottom" | "left" | "right";
  /** Size variant */
  size?: "sm" | "md";
}

export function XaiTooltip({
  explanation,
  side = "top",
  size = "sm",
}: XaiTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close on click outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const iconSize = size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4";
  const maxWidth = size === "sm" ? "max-w-[260px]" : "max-w-xs";

  // Position offset classes
  const positionClasses: Record<string, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <span className="relative inline-flex items-center">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`inline-flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50 ${
          isOpen
            ? "text-purple-300"
            : "text-purple-400/70 hover:text-purple-300"
        }`}
        aria-label="Learn more about SRS spacing"
        aria-expanded={isOpen}
      >
        <Info className={iconSize} />
      </button>

      <AnimatePresence>
        {isOpen && explanation && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: side === "top" ? 4 : -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={`absolute z-50 ${positionClasses[side]} pointer-events-none`}
          >
            <div
              className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-3 ${maxWidth}`}
            >
              <p className="text-xs text-white/90 leading-relaxed">
                {explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
