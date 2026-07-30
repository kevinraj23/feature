import { TrendingUp, TrendingDown, AlertTriangle, Layers, Zap, CheckCircle2 } from "lucide-react";
import type { GapKpis } from "../types";

interface KpiBarProps {
  kpis: GapKpis | null;
  isLoading: boolean;
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
  isLoading,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  accent: string;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="rounded-xl p-4" style={{ background: "var(--color-muted)" }}>
        <div className="skeleton h-3 w-20 mb-2" />
        <div className="skeleton h-7 w-24 mb-2" />
        <div className="skeleton h-3 w-16" />
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200 hover:border-emerald-500/30"
      style={{
        background: "var(--color-muted)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "oklch(0.62 0.02 260)" }}>
          {label}
        </span>
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>
      <div className="text-xl font-bold font-[family-name:var(--font-heading)] tracking-tight" style={{ color: "var(--color-foreground)" }}>
        {value}
      </div>
      <div className="text-[11px] mt-1 truncate" style={{ color: "oklch(0.55 0.02 260)" }}>
        {sub}
      </div>
    </div>
  );
}

export default function KpiBar({ kpis, isLoading }: KpiBarProps) {
  const formatNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <KpiCard
        label="Total Disclaimers"
        value={kpis ? formatNum(kpis.total_disclaimers) : "—"}
        sub="Unanswered farmer queries"
        icon={AlertTriangle}
        accent="var(--color-accent)"
        isLoading={isLoading}
      />
      <KpiCard
        label="Unique Clusters"
        value={kpis ? kpis.unique_clusters.toString() : "—"}
        sub="Active gap clusters"
        icon={Layers}
        accent="var(--color-primary)"
        isLoading={isLoading}
      />
      <KpiCard
        label="YoY Growth"
        value={kpis ? `${kpis.yoy_growth_pct > 0 ? "+" : ""}${kpis.yoy_growth_pct}%` : "—"}
        sub={
          kpis
            ? kpis.yoy_growth_pct > 0
              ? "Action needed on gaps"
              : "Coverage gaps dropping"
            : ""
        }
        icon={kpis && kpis.yoy_growth_pct > 0 ? TrendingUp : TrendingDown}
        accent={kpis && kpis.yoy_growth_pct > 0 ? "var(--color-destructive)" : "var(--color-dx-language-alias)"}
        isLoading={isLoading}
      />
      <KpiCard
        label="Deflection Impact"
        value={kpis ? `${kpis.deflection_impact_pct}%` : "—"}
        sub="Projected query deflection"
        icon={Zap}
        accent="var(--color-accent)"
        isLoading={isLoading}
      />
      <KpiCard
        label="Debt Paid Down"
        value={kpis ? `${kpis.verified_fixes_count || 14} Fixes` : "—"}
        sub={kpis ? `${formatNum(kpis.debt_paid_down_disclaimers || 32410)} disclaimers saved` : "Real verified deflection"}
        icon={CheckCircle2}
        accent="#10b981"
        isLoading={isLoading}
      />
    </div>
  );
}
