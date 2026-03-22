"use client";

import type { StudyLanguage } from "@/lib/study-context";

interface LanguageToggleProps {
  value: StudyLanguage;
  onChange: (language: StudyLanguage) => void;
}

const options: { value: StudyLanguage; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "zh", label: "中文" },
  { value: "both", label: "Both" },
];

export function LanguageToggle({ value, onChange }: LanguageToggleProps) {
  return (
    <div className="inline-flex items-center rounded-xl bg-cm-slate-100 p-1 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            value === opt.value
              ? "bg-cm-navy text-white shadow-sm"
              : "text-cm-slate-500 hover:text-cm-navy hover:bg-white/60"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
