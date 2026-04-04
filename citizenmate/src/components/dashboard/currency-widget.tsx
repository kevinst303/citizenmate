"use client";

import { motion } from "framer-motion";
import { ArrowRightLeft } from "lucide-react";
import type { CurrencyRate } from "@/app/api/australia-insights/route";

interface CurrencyWidgetProps {
  data: CurrencyRate[];
}

export function CurrencyWidget({ data }: CurrencyWidgetProps) {
  return (
    <div className="bg-white border border-[#E9ECEF] overflow-hidden h-full flex flex-col" style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}>
      {/* Header */}
      <div className="p-5 pb-3 border-b border-cm-slate-100">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-cm-eucalyptus-light text-cm-eucalyptus">
            <ArrowRightLeft className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-cm-slate-900 text-base">AUD Exchange Rates</h3>
            <p className="text-[10px] text-cm-slate-400">1 AUD equals</p>
          </div>
        </div>
      </div>

      {/* Rates grid */}
      <div className="flex-1 overflow-auto px-3 py-2">
        <div className="space-y-0.5">
          {data.map((rate, i) => (
            <motion.div
              key={rate.code}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-cm-slate-50 transition-colors duration-150 group"
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{rate.flag}</span>
                <div>
                  <span className="text-xs font-bold text-cm-slate-800">{rate.code}</span>
                  <p className="text-[10px] text-cm-slate-400 leading-tight">{rate.name}</p>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-cm-navy tabular-nums group-hover:text-cm-eucalyptus transition-colors">
                {rate.rate < 10 ? rate.rate.toFixed(4) : rate.rate < 1000 ? rate.rate.toFixed(2) : rate.rate.toLocaleString("en-AU", { maximumFractionDigits: 0 })}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
