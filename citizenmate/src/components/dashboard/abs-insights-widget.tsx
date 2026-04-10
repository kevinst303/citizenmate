"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Users, TrendingUp, Map } from "lucide-react";
import type { PopulationData } from "@/lib/abs-api";

// Fetch action using Server Actions or standard API route.
// For client components, we'll fetch via a next.js API route or server action.
// Since we have the fetch logic in a server utility, we'll accept it as a prop.

interface AbsInsightsWidgetProps {
  data: PopulationData[];
}

const COLORS = [
  "#006d77", // cm-teal (Conseil primary)
  "#3d348b", // cm-secondary (Conseil purple)
  "#00a3ad", // lighter teal
  "#6b61c4", // lighter purple
  "#005a61", // dark teal
  "#2a2366", // dark purple
  "#00c4d0", // accent teal
  "#8f86d4", // soft purple
];

export function AbsInsightsWidget() {
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState<PopulationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
    fetch("/api/abs-population")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Received non-JSON response from API");
        }
        return res.json();
      })
      .then((fetchedData) => {
        setData(fetchedData);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load ABS data:", error);
        setIsLoading(false);
      });
  }, []);

  const totalPopulation = data.reduce((sum, item) => sum + item.population, 0);

  // Format number to millions with 1 decimal place (e.g., 8.4M)
  const formatMillions = (num: number) => {
    return (num / 1000000).toFixed(1) + "M";
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-AU").format(num);
  };

  if (!isClient || isLoading) {
    return (
      <div className="bg-white border border-[#E9ECEF] p-6 h-[400px] flex items-center justify-center animate-pulse" style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}>
        <div className="w-8 h-8 rounded-full border-4 border-cm-navy/20 border-t-cm-navy animate-spin" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white border border-[#E9ECEF] flex flex-col items-center justify-center p-12 text-center h-[400px]" style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}>
        <Map className="w-12 h-12 text-cm-slate-200 mb-4" />
        <h3 className="font-heading font-bold text-lg text-cm-slate-900 mb-1">No data available</h3>
        <p className="text-sm text-cm-slate-500 max-w-sm">We couldn't load the population insights at this time. Please check your connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E9ECEF] overflow-hidden" style={{ borderRadius: '15px', boxShadow: 'rgba(0,0,0,0.05) 0px 2px 6px 0px, rgba(0,0,0,0.1) 0px 8px 19.2px 0px' }}>
      {/* Header */}
      <div className="p-6 pb-4 border-b border-cm-slate-100 flex items-center justify-between bg-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading font-bold text-lg text-cm-slate-900">
              Discover Australia
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cm-navy-50 text-cm-navy">
              ABS Data
            </span>
          </div>
          <p className="text-sm text-cm-slate-500">
            Estimated Resident Population by State
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg shadow-sm border border-cm-slate-100">
          <Users className="w-4 h-4 text-cm-eucalyptus" />
          <span className="text-sm font-bold text-cm-slate-800">
            {formatMillions(totalPopulation)}
          </span>
          <span className="text-xs text-cm-slate-500">Total</span>
        </div>
      </div>

      <div className="p-6 grid gap-8 lg:grid-cols-3">
        {/* Left Side: Summary Stats */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-cm-sky-light to-white p-4 rounded-xl border border-cm-sky/20">
            <div className="flex items-center gap-2 text-cm-sky-dark mb-2">
              <Map className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wide">Largest State</h3>
            </div>
            <p className="text-2xl font-heading font-extrabold text-cm-slate-900">
              {data[0]?.shortName || "NSW"}
            </p>
            <p className="text-sm text-cm-slate-600 font-medium mt-1">
              {formatMillions(data[0]?.population || 0)} residents
            </p>
          </div>

          <div className="bg-gradient-to-br from-cm-gold-light/50 to-white p-4 rounded-xl border border-cm-gold/20">
            <div className="flex items-center gap-2 text-cm-gold-dark mb-2">
              <TrendingUp className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wide">Growing Fast</h3>
            </div>
            <p className="text-sm text-cm-slate-700 leading-relaxed">
              Australia's population is highly urbanized, with the majority of growth concentrated in the capital cities of the eastern states.
            </p>
          </div>
        </div>

        {/* Right Side: Chart */}
        <div className="lg:col-span-2 h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="shortName" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748B", fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#64748B" }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                cursor={{ fill: "#F1F5F9", opacity: 0.5 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-cm-slate-100 flex flex-col gap-1">
                        <span className="text-xs font-bold text-cm-slate-500 uppercase">
                          {payload[0].payload.state}
                        </span>
                        <span className="text-sm font-bold text-cm-navy">
                          {formatNumber(payload[0].value as number)}
                        </span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar 
                dataKey="population" 
                radius={[4, 4, 0, 0]}
                animationDuration={1500}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
