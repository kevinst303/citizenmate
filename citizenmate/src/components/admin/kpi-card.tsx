import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface Trend {
  direction: "up" | "down" | "flat";
  value: string;
}

interface KPICardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  trend?: Trend;
  color: "sky" | "eucalyptus" | "gold" | "purple" | "teal";
}

const colorMap: Record<string, { bg: string; text: string }> = {
  sky: { bg: "bg-cm-sky-light", text: "text-cm-sky" },
  eucalyptus: { bg: "bg-cm-eucalyptus-light", text: "text-cm-eucalyptus" },
  gold: { bg: "bg-cm-gold-light", text: "text-cm-gold" },
  purple: { bg: "bg-purple-100", text: "text-purple-600" },
  teal: { bg: "bg-cm-teal-light", text: "text-cm-teal" },
};

export function KPICard({ icon: Icon, label, value, trend, color }: KPICardProps) {
  const c = colorMap[color] || colorMap.teal;

  return (
    <div className="card-conseil">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${c.bg} ${c.text} flex shrink-0 items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-cm-slate-500 uppercase tracking-wider">{label}</p>
            <h3 className="text-2xl font-heading font-bold text-cm-navy mt-0.5">{value}</h3>
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-semibold whitespace-nowrap ${
            trend.direction === "up" ? "text-cm-eucalyptus" :
            trend.direction === "down" ? "text-cm-red" :
            "text-cm-slate-400"
          }`}>
            {trend.direction === "up" ? <TrendingUp className="w-3.5 h-3.5" /> :
             trend.direction === "down" ? <TrendingDown className="w-3.5 h-3.5" /> :
             <Minus className="w-3.5 h-3.5" />}
            {trend.value}
          </div>
        )}
      </div>
    </div>
  );
}
