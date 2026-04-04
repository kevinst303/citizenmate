"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";
import { WeatherWidget } from "./weather-widget";
import { CurrencyWidget } from "./currency-widget";
import { CountryFactsWidget } from "./country-facts-widget";
import { HolidaysWidget } from "./holidays-widget";
import type { AustraliaInsightsData } from "@/app/api/australia-insights/route";

function WidgetSkeleton() {
  return (
    <div className="bg-white border border-[#E9ECEF] p-6 h-[320px] flex items-center justify-center animate-pulse" style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}>
      <div className="w-8 h-8 rounded-full border-4 border-cm-navy/20 border-t-cm-navy animate-spin" />
    </div>
  );
}

export function LifeInAustraliaSection() {
  const [data, setData] = useState<AustraliaInsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/australia-insights")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from API");
        }
        return res.json();
      })
      .then((json: AustraliaInsightsData) => {
        setData(json);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load Australia insights:", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center gap-2.5 mb-5">
        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-cm-eucalyptus-light text-cm-eucalyptus">
          <Globe className="w-4.5 h-4.5" />
        </div>
        <div>
          <h2 className="font-heading font-bold text-cm-slate-900 text-lg">Life in Australia</h2>
          <p className="text-xs text-cm-slate-500">Live data to help you settle into your new home</p>
        </div>
      </div>

      {/* Widget grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {isLoading ? (
          <>
            <WidgetSkeleton />
            <WidgetSkeleton />
            <WidgetSkeleton />
            <WidgetSkeleton />
          </>
        ) : (
          <>
            {data?.weather && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <WeatherWidget data={data.weather} />
              </motion.div>
            )}
            {data?.holidays && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <HolidaysWidget data={data.holidays} />
              </motion.div>
            )}
            {data?.countryFacts && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <CountryFactsWidget data={data.countryFacts} />
              </motion.div>
            )}
            {data?.currencies && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CurrencyWidget data={data.currencies} />
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
