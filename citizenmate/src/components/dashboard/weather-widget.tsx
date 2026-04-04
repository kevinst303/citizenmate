"use client";

import { motion } from "framer-motion";
import {
  Thermometer,
  Droplets,
  Wind,
  Sun,
  ShieldAlert,
} from "lucide-react";
import type { WeatherData } from "@/app/api/australia-insights/route";

interface WeatherWidgetProps {
  data: WeatherData;
}

function getUVLevel(uv: number): { label: string; color: string; bg: string; tip: string } {
  if (uv <= 2) return { label: "Low", color: "text-green-600", bg: "bg-green-100", tip: "Enjoy the outdoors safely." };
  if (uv <= 5) return { label: "Moderate", color: "text-yellow-600", bg: "bg-yellow-100", tip: "Wear sunscreen & a hat." };
  if (uv <= 7) return { label: "High", color: "text-orange-600", bg: "bg-orange-100", tip: "Slip, Slop, Slap, Seek & Slide!" };
  if (uv <= 10) return { label: "Very High", color: "text-red-600", bg: "bg-red-100", tip: "Avoid sun 10am–2pm. Cover up!" };
  return { label: "Extreme", color: "text-purple-700", bg: "bg-purple-100", tip: "Stay indoors if possible!" };
}

export function WeatherWidget({ data }: WeatherWidgetProps) {
  const uv = getUVLevel(data.current.uvIndex);

  return (
    <div className="bg-white border border-[#E9ECEF] overflow-hidden h-full flex flex-col" style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}>
      {/* Header */}
      <div className="p-5 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold text-cm-slate-900 text-base">Weather</h3>
            <p className="text-xs text-cm-slate-500">{data.location}</p>
          </div>
          <span className="text-3xl">{data.current.icon}</span>
        </div>

        {/* Current conditions */}
        <div className="flex items-end gap-3 mb-4">
          <span className="text-5xl font-heading font-extrabold text-cm-slate-900 leading-none">
            {data.current.temperature}°
          </span>
          <div className="pb-1">
            <p className="text-sm font-medium text-cm-slate-700">{data.current.condition}</p>
            <div className="flex gap-3 mt-1 text-xs text-cm-slate-500">
              <span className="inline-flex items-center gap-1">
                <Droplets className="w-3 h-3" /> {data.current.humidity}%
              </span>
              <span className="inline-flex items-center gap-1">
                <Wind className="w-3 h-3" /> {data.current.windSpeed} km/h
              </span>
            </div>
          </div>
        </div>

        {/* UV Index */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`flex items-center gap-3 px-3 py-2 rounded-xl ${uv.bg} mb-4`}
        >
          <Sun className={`w-4 h-4 ${uv.color} flex-shrink-0`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold ${uv.color}`}>UV {data.current.uvIndex.toFixed(1)}</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${uv.color} ${uv.bg}`}>
                {uv.label}
              </span>
            </div>
            <p className="text-[11px] text-cm-slate-600 mt-0.5 truncate">{uv.tip}</p>
          </div>
          {data.current.uvIndex >= 3 && (
            <ShieldAlert className={`w-4 h-4 ${uv.color} flex-shrink-0 animate-pulse`} />
          )}
        </motion.div>
      </div>

      {/* 7-day forecast */}
      <div className="px-5 pb-5 pt-2 border-t border-cm-slate-100 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-cm-slate-400 mb-2">7-Day Forecast</p>
        <div className="grid grid-cols-7 gap-1 text-center">
          {data.daily.map((day) => (
            <div key={day.date} className="flex flex-col items-center gap-0.5">
              <span className="text-[10px] font-medium text-cm-slate-500">{day.dayName}</span>
              <span className="text-sm">{day.icon}</span>
              <span className="text-[11px] font-bold text-cm-slate-800">{day.tempMax}°</span>
              <span className="text-[10px] text-cm-slate-400">{day.tempMin}°</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
