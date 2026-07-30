import { useState, useMemo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, CheckCircle2, AlertCircle, Clock, ShieldAlert, Play } from "lucide-react";
import type { GapCluster, ClusterStatus } from "../types";
import { DIAGNOSIS_CONFIG } from "../hooks/useGapData";

interface PriorityQueueProps {
  clusters: GapCluster[];
  isLoading: boolean;
  onSelectCluster: (id: string) => void;
  selectedClusterId: string | null;
}

type SortField = "cluster_name" | "diagnosis" | "unique_farmers" | "coverage_debt_score" | "yoy_growth_pct";
type SortDir = "asc" | "desc";

function SortIcon({ field, sortField, sortDir }: { field: SortField; sortField: SortField; sortDir: SortDir }) {
  if (field !== sortField) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return sortDir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
}

function StatusBadge({ status }: { status?: ClusterStatus }) {
  if (status === "verified_closed") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3" />
        Verified Closed
      </span>
    );
  }
  if (status === "fix_ineffective") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
        <AlertCircle className="w-3 h-3" />
        Fix Ineffective
      </span>
    );
  }
  if (status === "pending_reviewer") {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <Clock className="w-3 h-3 animate-pulse" />
        Pending Reviewer
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
      <ShieldAlert className="w-3 h-3 text-amber-500/80" />
      Active Gap
    </span>
  );
}

function TrendBadge({ trend }: { trend?: "new" | "growing" | "shrinking" | "resolved" }) {
  if (!trend) return null;
  const config = {
    new: { label: "NEW", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    growing: { label: "GROWING", bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    shrinking: { label: "SHRINKING", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    resolved: { label: "RESOLVED", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  }[trend];

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold border ${config.bg} uppercase tracking-wider`}>
      {trend === "growing" ? "↑ " : trend === "shrinking" ? "↓ " : trend === "resolved" ? "✓ " : "🆕 "}
      {config.label}
    </span>
  );
}


export default function PriorityQueue({ clusters, isLoading, onSelectCluster, selectedClusterId }: PriorityQueueProps) {
  const [sortField, setSortField] = useState<SortField>("coverage_debt_score");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sorted = useMemo(() => {
    const arr = [...clusters];
    arr.sort((a, b) => {
      let va: number | string = a[sortField];
      let vb: number | string = b[sortField];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [clusters, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const columns: { key: SortField; label: string; align: "left" | "right" }[] = [
    { key: "cluster_name", label: "Cluster", align: "left" },
    { key: "diagnosis", label: "Diagnosis", align: "left" },
    { key: "unique_farmers", label: "Farmers", align: "right" },
    { key: "coverage_debt_score", label: "Debt Score", align: "right" },
    { key: "yoy_growth_pct", label: "YoY Δ", align: "right" },
  ];

  const handleExportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const rowsHtml = sorted
      .map((c, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>
            <strong>${c.cluster_name}</strong><br/>
            <span style="font-size: 10px; color: #666;">${c.crop} · ${c.state} · ${c.domain}</span>
          </td>
          <td><span class="badge badge-${c.diagnosis}">${c.diagnosis.replace("_", " ")}</span></td>
          <td style="text-align: right;">${c.unique_farmers.toLocaleString()}</td>
          <td style="text-align: right; font-weight: bold;">${c.coverage_debt_score.toFixed(1)}</td>
          <td><span class="trend-badge trend-${c.trend_state || 'new'}">${(c.trend_state || 'new').toUpperCase()}</span></td>
          <td>${c.recommended_action}</td>
        </tr>
      `)
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>GDB Coverage Debt Executive Report</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #333;
              padding: 40px;
              margin: 0;
            }
            .header {
              border-bottom: 2px solid #3AAA5A;
              padding-bottom: 20px;
              margin-bottom: 30px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #1e293b;
            }
            .logo span {
              color: #3AAA5A;
            }
            .meta {
              text-align: right;
              font-size: 12px;
              color: #666;
            }
            h1 {
              font-size: 20px;
              margin: 0 0 10px 0;
              color: #0f172a;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
              font-size: 11px;
            }
            th, td {
              border-bottom: 1px solid #e2e8f0;
              padding: 10px 8px;
              text-align: left;
            }
            th {
              background-color: #f8fafc;
              font-weight: 600;
              color: #475569;
              text-transform: uppercase;
              font-size: 9px;
              letter-spacing: 0.5px;
            }
            .badge {
              display: inline-block;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 9px;
              font-weight: bold;
              text-transform: uppercase;
            }
            .badge-missing_knowledge { background-color: #fef2f2; color: #ef4444; }
            .badge-retrieval_failure { background-color: #eff6ff; color: #3b82f6; }
            .badge-language_alias_gap { background-color: #f5f3ff; color: #8b5cf6; }
            .badge-missing_context { background-color: #f0fdf4; color: #10b981; }
            .badge-safety_escalation { background-color: #faf5ff; color: #a855f7; }
            
            .trend-badge {
              display: inline-block;
              padding: 2px 4px;
              border-radius: 3px;
              font-size: 9px;
              font-weight: bold;
            }
            .trend-new { background-color: #eff6ff; color: #1d4ed8; }
            .trend-growing { background-color: #fef2f2; color: #b91c1c; }
            .trend-shrinking { background-color: #fffbeb; color: #b45309; }
            .trend-resolved { background-color: #ecfdf5; color: #047857; }

            .footer {
              margin-top: 40px;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
              font-size: 10px;
              color: #94a3b8;
              text-align: center;
            }
            @media print {
              .no-print { display: none; }
              body { padding: 0; }
            }
            .btn-print {
              background-color: #3AAA5A;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: bold;
              cursor: pointer;
              transition: background-color 0.2s;
            }
            .btn-print:hover {
              background-color: #2e8544;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">Vicharanshala <span>GDB Coverage Radar</span></div>
              <h1 style="margin-top: 15px;">Executive Coverage Debt Report</h1>
            </div>
            <div class="meta">
              Report Generated: ${new Date().toLocaleDateString("en-IN")}<br/>
              Status: Active Verification Loop
            </div>
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 20px;" class="no-print">
            <span style="font-size: 12px; color: #475569;">Click print to save this document as a PDF.</span>
            <button class="btn-print" onclick="window.print()">Print / Save PDF</button>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 30px;">#</th>
                <th style="width: 150px;">Cluster / Gaps</th>
                <th style="width: 100px;">Diagnosis</th>
                <th style="width: 70px; text-align: right;">Farmers Affected</th>
                <th style="width: 70px; text-align: right;">Debt Score</th>
                <th style="width: 70px;">Trend</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer">
            Confidential - For Internal Agricultural Reviewer Verification Only. &copy; ${new Date().getFullYear()} Vicharanshala.
          </div>
          <script>
            // Auto trigger print dialog
            window.onload = function() {
              setTimeout(function() { window.print(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="rounded-xl p-5" style={{ background: "var(--color-muted)", border: "1px solid var(--color-border)" }}>
        <div className="skeleton h-5 w-32 mb-4" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-12 w-full mb-2" />
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "var(--color-muted)", border: "1px solid var(--color-border)" }}>
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold font-[family-name:var(--font-heading)] uppercase tracking-wide" style={{ color: "oklch(0.62 0.02 260)" }}>
            Priority Queue · {clusters.length} clusters
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Closed-Loop Proof of Impact Active
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] hidden sm:inline" style={{ color: "oklch(0.5 0.01 260)" }}>
            Showing {Math.min(clusters.length, 25)} of {clusters.length} results
          </span>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 border bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500 hover:scale-[1.03] active:scale-95 shadow-sm"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px]" role="table" aria-label="Coverage debt priority queue">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
              <th scope="col" className="w-10 py-3 px-2 text-center text-[10px] uppercase tracking-wider font-medium" style={{ color: "oklch(0.5 0.01 260)" }}>
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`py-3 px-3 text-[10px] uppercase tracking-wider font-medium cursor-pointer select-none transition-colors duration-150 hover:text-white ${col.align === "right" ? "text-right" : "text-left"}`}
                  style={{ color: "oklch(0.5 0.01 260)" }}
                  onClick={() => handleSort(col.key)}
                  tabIndex={0}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    <SortIcon field={col.key} sortField={sortField} sortDir={sortDir} />
                  </span>
                </th>
              ))}
              <th scope="col" className="py-3 px-3 text-left text-[10px] uppercase tracking-wider font-medium" style={{ color: "oklch(0.5 0.01 260)" }}>
                Verifier Status
              </th>
              <th scope="col" className="w-8 py-3 px-2" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((cluster, idx) => {
              const dx = DIAGNOSIS_CONFIG[cluster.diagnosis];
              const isSelected = cluster.id === selectedClusterId;
              return (
                <tr
                  key={cluster.id}
                  role="row"
                  tabIndex={0}
                  className="table-row-hover cursor-pointer transition-colors duration-150"
                  style={{
                    background: isSelected ? "oklch(0.25 0.018 260)" : "transparent",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                  onClick={() => onSelectCluster(cluster.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onSelectCluster(cluster.id);
                    }
                  }}
                  aria-selected={isSelected}
                >
                  <td className="py-3 px-2 text-center text-xs font-medium" style={{ color: "oklch(0.5 0.01 260)" }}>
                    {idx + 1}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium truncate max-w-52" style={{ color: "var(--color-foreground)" }}>
                        {cluster.cluster_name}
                      </div>
                      <TrendBadge trend={cluster.trend_state} />
                    </div>
                    <div className="text-[11px] mt-0.5" style={{ color: "oklch(0.48 0.02 260)" }}>
                      {cluster.crop} · {cluster.state} · {cluster.domain}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={{ background: dx.bg, color: dx.color, border: `1px solid ${dx.border}` }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: dx.color }} />
                      {dx.label}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-sm font-mono font-medium" style={{ color: "var(--color-foreground)" }}>
                    {cluster.unique_farmers.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-sm font-bold font-[family-name:var(--font-heading)]" style={{ color: "var(--color-foreground)" }}>
                      {cluster.coverage_debt_score.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span
                      className="text-sm font-medium"
                      style={{
                        color: cluster.yoy_growth_pct >= 0 ? "var(--color-destructive)" : "var(--color-dx-language-alias)",
                      }}
                    >
                      {cluster.yoy_growth_pct >= 0 ? "+" : ""}{cluster.yoy_growth_pct}%
                    </span>
                  </td>
                  <td className="py-3 px-3 text-left">
                    <StatusBadge status={cluster.cluster_status} />
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCluster(cluster.id);
                      }}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-all cursor-pointer hover:scale-105 active:scale-95"
                      title="Inspect & Replay"
                    >
                      <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
