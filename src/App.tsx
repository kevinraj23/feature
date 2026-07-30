import { useState } from "react";
import { Sprout } from "lucide-react";
import KpiBar from "./components/KpiBar";
import PipelineFlow from "./components/PipelineFlow";
import DiagnosisLegend from "./components/DiagnosisLegend";
import CoverageHeatmap from "./components/CoverageHeatmap";
import PriorityQueue from "./components/PriorityQueue";
import ClusterDrawer from "./components/ClusterDrawer";
import { useGapData, useClusterDetail } from "./hooks/useGapData";

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-3">
      <h2
        className="text-sm font-semibold font-[family-name:var(--font-heading)] uppercase tracking-wide"
        style={{ color: "oklch(0.62 0.02 260)" }}
      >
        {title}
      </h2>
      <p className="text-xs mt-1" style={{ color: "oklch(0.48 0.02 260)" }}>
        {subtitle}
      </p>
    </div>
  );
}

export default function App() {
  const { kpis, clusters, isLoading } = useGapData();
  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const selectedCluster = useClusterDetail(selectedClusterId);

  return (
    <div className="min-h-screen" style={{ background: "var(--color-background)" }}>
      {/* Top nav */}
      <header
        className="sticky top-0 z-30 px-6 lg:px-10 py-4 flex items-center justify-between"
        style={{
          background: "oklch(0.145 0.008 260 / 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="flex items-center gap-3">
          <Sprout className="w-6 h-6" style={{ color: "var(--color-accent)" }} />
          <div>
            <h1 className="text-sm font-bold font-[family-name:var(--font-heading)] tracking-tight" style={{ color: "var(--color-foreground)" }}>
              GDB Coverage Gap Detector
            </h1>
            <p className="text-[10px]" style={{ color: "oklch(0.5 0.01 260)" }}>
              Gap Discovery Bot · Weekly Pipeline Analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium"
            style={{
              background: "oklch(0.55 0.18 148 / 0.1)",
              color: "var(--color-dx-language-alias)",
              border: "1px solid oklch(0.55 0.18 148 / 0.25)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-dx-language-alias)" }} />
            Live Pipeline Sync
          </span>
          {kpis && (
            <span className="text-[10px]" style={{ color: "oklch(0.45 0.02 260)" }}>
              Last updated: {new Date(kpis.last_updated).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="px-6 lg:px-10 py-6 max-w-[1440px] mx-auto space-y-8">
        {/* Pipeline Flow */}
        <section>
          <PipelineFlow />
        </section>

        {/* KPI Bar */}
        <section>
          <SectionHeader
            title="Coverage at a Glance"
            subtitle="High-level metrics from the disclaimer pipeline — updated weekly"
          />
          <KpiBar kpis={kpis} isLoading={isLoading} />
        </section>

        {/* Diagnosis Legend */}
        <section>
          <SectionHeader
            title="How We Diagnose Gaps"
            subtitle="Each unanswered query cluster is classified into one of five root causes"
          />
          <DiagnosisLegend />
        </section>

        {/* Heatmap */}
        <section>
          <SectionHeader
            title="Coverage Debt Heatmap"
            subtitle="Which crop–state combinations have the largest knowledge gaps? Darker cells = higher urgency"
          />
          <CoverageHeatmap clusters={clusters} isLoading={isLoading} />
        </section>

        {/* Priority Queue */}
        <section>
          <SectionHeader
            title="Priority Queue"
            subtitle="Ranked list of gap clusters — click any row to see diagnosis, farmer queries, and recommended action"
          />
          <PriorityQueue
            clusters={clusters}
            isLoading={isLoading}
            onSelectCluster={setSelectedClusterId}
            selectedClusterId={selectedClusterId}
          />
        </section>

        {/* Footer */}
        <footer className="text-center py-6">
          <p className="text-[10px]" style={{ color: "oklch(0.38 0.02 260)" }}>
            GDB Coverage Gap Detector · GreenDoc Bot Strategic Knowledge Management Platform
          </p>
        </footer>
      </main>

      {/* Cluster Detail Drawer */}
      <ClusterDrawer
        cluster={selectedCluster}
        onClose={() => setSelectedClusterId(null)}
      />
    </div>
  );
}
