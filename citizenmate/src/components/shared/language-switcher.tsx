"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";

const LANGUAGES: Record<string, { label: string; native: string }> = {
  en: { label: "English", native: "English" },
  es: { label: "Spanish", native: "Español" },
  hi: { label: "Hindi", native: "हिन्दी" },
  zh: { label: "Chinese", native: "中文" },
  ar: { label: "Arabic", native: "العربية" },
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLocale = pathname?.match(/^\/([a-z]{2})(?:-|$|\/)/)?.[1] || "en";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchTo = (locale: string) => {
    const parts = pathname?.replace(/^\/[a-z]{2}(-[A-Z]{2})?/, `/${locale}`) || `/${locale}`;
    router.push(parts);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-2 text-[0.85rem] font-medium text-cm-slate-500 hover:text-cm-teal transition-colors"
      >
        <Globe className="size-4" />
        <span className="hidden sm:inline">{LANGUAGES[currentLocale]?.native || "EN"}</span>
        <span className="text-[0.65rem] mt-0.5">▼</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-44 bg-white border border-cm-slate-100 rounded-xl shadow-lg overflow-hidden z-50"
          >
            {Object.entries(LANGUAGES).map(([code, info]) => (
              <button
                key={code}
                onClick={() => switchTo(code)}
                className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${
                  code === currentLocale
                    ? "bg-cm-teal-50 text-cm-teal font-semibold"
                    : "text-cm-slate-600 hover:bg-cm-slate-50"
                }`}
              >
                <span>{info.native}</span>
                <span className={`text-xs ${code === currentLocale ? "text-cm-teal" : "text-cm-slate-400"}`}>
                  {info.label}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
