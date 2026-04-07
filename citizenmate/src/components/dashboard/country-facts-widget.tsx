"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import type { CountryFact } from "@/app/api/australia-insights/route";

interface CountryFactsWidgetProps {
  data: CountryFact[];
}

export function CountryFactsWidget({ data }: CountryFactsWidgetProps) {
  return (
    <div 
      className="bg-white border border-[#E9ECEF] rounded-[15px] overflow-hidden h-full flex flex-col"
      style={{ boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}
    >
      {/* Header */}
      <div className="p-5 pb-3 border-b border-cm-slate-100">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cm-sky-light text-cm-sky">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-cm-slate-900 text-base">Country Quick Facts</h3>
            <p className="text-[10px] text-cm-slate-400">Handy for your citizenship test!</p>
          </div>
        </div>
      </div>

      {/* Facts grid */}
      <div className="flex-1 p-4 grid grid-cols-2 gap-2">
        {data.map((fact, i) => (
          <motion.div
            key={fact.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white/60 rounded-xl px-3 py-2.5 border border-cm-slate-100/60 hover:border-cm-sky/30 hover:shadow-sm transition-all duration-200"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-sm">{fact.icon}</span>
              <span className="text-[10px] font-bold text-cm-slate-400 uppercase tracking-wide">{fact.label}</span>
            </div>
            <p className="text-xs font-semibold text-cm-slate-800 leading-snug">{fact.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
