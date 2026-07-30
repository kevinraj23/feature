import { useState } from "react";
import { X, Users, MessageSquare, Lightbulb, Calendar, TrendingUp, CheckCircle2, RefreshCw, ShieldCheck, AlertCircle, ArrowRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { GapCluster, ClusterStatus } from "../types";
import { DIAGNOSIS_CONFIG } from "../hooks/useGapData";

function TrendBadge({ trend }: { trend?: "new" | "growing" | "shrinking" | "resolved" }) {
  if (!trend) return null;
  const config = {
    new: { label: "NEW", bg: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    growing: { label: "GROWING", bg: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
    shrinking: { label: "SHRINKING", bg: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    resolved: { label: "RESOLVED", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  }[trend];

  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${config.bg} uppercase tracking-wider`}>
      {trend === "growing" ? "↑ " : trend === "shrinking" ? "↓ " : trend === "resolved" ? "✓ " : "🆕 "}
      {config.label}
    </span>
  );
}

interface ClusterDrawerProps {
  cluster: GapCluster | null;
  onClose: () => void;
}

export default function ClusterDrawer({ cluster, onClose }: ClusterDrawerProps) {
  if (!cluster) return null;

  const dx = DIAGNOSIS_CONFIG[cluster.diagnosis];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-200"
        style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
        }}
        role="presentation"
      />

      {/* Drawer */}
      <div
        className="fixed right-0 top-0 h-full z-50 overflow-y-auto drawer-enter"
        style={{
          width: "min(540px, 100vw)",
          background: "var(--color-background)",
          borderLeft: "1px solid var(--color-border)",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.4)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label={`Detail view for ${cluster.cluster_name}`}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-10 px-6 py-4 flex items-start justify-between"
          style={{
            background: "var(--color-background)",
            borderBottom: "1px solid var(--color-border)",
          }}
        >
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium"
                style={{ background: dx.bg, color: dx.color, border: `1px solid ${dx.border}` }}
              >
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: dx.color }} />
                {dx.label}
              </span>
              {cluster.cluster_status === "verified_closed" && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  ✅ Verified Closed
                </span>
              )}
              <TrendBadge trend={cluster.trend_state} />
            </div>
            <h3 className="text-base font-semibold font-[family-name:var(--font-heading)]" style={{ color: "var(--color-foreground)" }}>
              {cluster.cluster_name}
            </h3>
            <p className="text-xs mt-1" style={{ color: "oklch(0.55 0.02 260)" }}>
              {cluster.crop} · {cluster.state} · {cluster.domain}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors duration-150 cursor-pointer hover:bg-[var(--color-muted)]"
            aria-label="Close drawer"
            style={{ color: "oklch(0.5 0.02 260)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg p-3" style={{ background: "var(--color-muted)" }}>
              <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "oklch(0.55 0.02 260)" }}>
                <Users className="w-3.5 h-3.5" />
                Unique Farmers
              </div>
              <div className="text-xl font-bold font-[family-name:var(--font-heading)]" style={{ color: "var(--color-foreground)" }}>
                {cluster.unique_farmers.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg p-3" style={{ background: "var(--color-muted)" }}>
              <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "oklch(0.55 0.02 260)" }}>
                <MessageSquare className="w-3.5 h-3.5" />
                Total Queries
              </div>
              <div className="text-xl font-bold font-[family-name:var(--font-heading)]" style={{ color: "var(--color-foreground)" }}>
                {cluster.total_queries.toLocaleString()}
              </div>
            </div>
            <div className="rounded-lg p-3" style={{ background: "var(--color-muted)" }}>
              <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "oklch(0.55 0.02 260)" }}>
                <TrendingUp className="w-3.5 h-3.5" />
                Coverage Debt Score
              </div>
              <div className="text-xl font-bold font-[family-name:var(--font-heading)]" style={{ color: "var(--color-foreground)" }}>
                {cluster.coverage_debt_score.toFixed(1)}
              </div>
            </div>
            <div className="rounded-lg p-3" style={{ background: "var(--color-muted)" }}>
              <div className="flex items-center gap-2 text-xs mb-1" style={{ color: "oklch(0.55 0.02 260)" }}>
                <Calendar className="w-3.5 h-3.5" />
                YoY Growth
              </div>
              <div
                className="text-xl font-bold font-[family-name:var(--font-heading)]"
                style={{
                  color: cluster.yoy_growth_pct >= 0 ? "var(--color-destructive)" : "var(--color-dx-language-alias)",
                }}
              >
                {cluster.yoy_growth_pct >= 0 ? "+" : ""}{cluster.yoy_growth_pct}%
              </div>
            </div>
          </div>

          {/* 4-Week Trend sparkline */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "oklch(0.55 0.02 260)" }}>
              4-Week Trend
            </h4>
            <div className="rounded-lg p-3" style={{ background: "var(--color-muted)", height: 160 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cluster.trend_4wk}>
                  <XAxis
                    dataKey="week"
                    tick={{ fontSize: 10, fill: "oklch(0.5 0.01 260)" }}
                    axisLine={{ stroke: "var(--color-border)" }}
                    tickLine={false}
                  />
                  <YAxis
                    domain={["dataMin - 5", "dataMax + 5"]}
                    tick={{ fontSize: 10, fill: "oklch(0.5 0.01 260)" }}
                    axisLine={false}
                    tickLine={false}
                    width={35}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.18 0.01 260)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 11,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="debt_score"
                    stroke={dx.color}
                    strokeWidth={2}
                    dot={{ fill: dx.color, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sample queries */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "oklch(0.55 0.02 260)" }}>
              Sample Farmer Queries
            </h4>
            <div className="space-y-2">
              {cluster.sample_queries.map((sq, i) => (
                <div
                  key={i}
                  className="rounded-lg p-3 text-sm leading-relaxed italic"
                  style={{
                    background: "var(--color-muted)",
                    color: "oklch(0.7 0.01 260)",
                    borderLeft: `3px solid ${dx.color}`,
                  }}
                >
                  "{sq.query}"
                  <div className="text-[10px] mt-1 not-italic" style={{ color: "oklch(0.48 0.02 260)" }}>
                    {new Date(sq.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Closed-Loop Gap Closure Verifier Component */}
          <GapClosureVerifier cluster={cluster} />

          {/* Recommended action */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5" style={{ color: "oklch(0.55 0.02 260)" }}>
              <Lightbulb className="w-3.5 h-3.5" style={{ color: "var(--color-accent)" }} />
              Recommended Action
            </h4>
            <div
              className="rounded-lg p-4 text-sm leading-relaxed mb-4"
              style={{
                background: "oklch(0.6658 0.1574 58.32 / 0.08)",
                border: "1px solid oklch(0.6658 0.1574 58.32 / 0.2)",
                color: "var(--color-foreground)",
              }}
            >
              {cluster.recommended_action}
            </div>

            {/* Push to Reviewer Queue Action Button */}
            <PushToReviewerQueueButton cluster={cluster} />
          </div>

          {/* Footer */}
          <div className="text-[10px] pt-2 flex items-center justify-between" style={{ color: "oklch(0.42 0.02 260)" }}>
            <span>Cluster ID: {cluster.id}</span>
            <span>Created {new Date(cluster.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}</span>
          </div>
        </div>
      </div>
    </>
  );
}

function GapClosureVerifier({ cluster }: { cluster: GapCluster }) {
  const [isReplaying, setIsReplaying] = useState(false);
  const [verState, setVerState] = useState<ClusterStatus>(cluster.cluster_status || "active");
  const [postScore, setPostScore] = useState<number>(
    cluster.post_fix_cosine_score || (cluster.pre_fix_cosine_score ? cluster.pre_fix_cosine_score : 0.28)
  );

  const preScore = cluster.pre_fix_cosine_score || 0.28;

  const handleReplayTest = () => {
    setIsReplaying(true);
    setTimeout(() => {
      setIsReplaying(false);
      // Simulate vector search replay over cluster's representative queries
      if (cluster.id === "c005") {
        // Fix ineffective scenario
        setPostScore(0.49);
        setVerState("fix_ineffective");
      } else {
        // Verification success scenario
        const newScore = Number((0.78 + Math.random() * 0.12).toFixed(2));
        setPostScore(newScore);
        setVerState("verified_closed");
      }
    }, 900);
  };

  return (
    <div className="rounded-xl p-4 border border-emerald-500/30 bg-emerald-500/5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-semibold uppercase tracking-wide text-emerald-300">
            Closed-Loop Gap Closure Verifier
          </h4>
        </div>
        <span className="text-[10px] text-emerald-400/80 font-mono">Proof-of-Impact Engine</span>
      </div>

      <p className="text-xs text-gray-300 leading-relaxed">
        Replays representative farmer queries against the live GDB index to prove fix effectiveness via vector cosine score delta.
      </p>

      {/* Vector Score Delta */}
      <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-black/30 border border-gray-800 text-center">
        <div>
          <div className="text-[10px] text-gray-400">Pre-Fix Score</div>
          <div className="text-sm font-mono font-bold text-rose-400">{preScore.toFixed(2)}</div>
        </div>
        <div className="flex flex-col items-center justify-center">
          <ArrowRight className="w-4 h-4 text-emerald-400" />
          <span className="text-[9px] font-mono text-emerald-400">
            +{(postScore - preScore).toFixed(2)}
          </span>
        </div>
        <div>
          <div className="text-[10px] text-gray-400">Post-Fix Score</div>
          <div className={`text-sm font-mono font-bold ${postScore >= 0.55 ? "text-emerald-400" : "text-amber-400"}`}>
            {postScore.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Verifier Result Banner */}
      {verState === "verified_closed" && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Fix Verified & Closed! (Actual Deflection: {cluster.total_queries} queries)
          </span>
        </div>
      )}

      {verState === "fix_ineffective" && (
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
          <span className="flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            Fix Ineffective — Reopen (Score {postScore.toFixed(2)} &lt; 0.55 threshold)
          </span>
        </div>
      )}

      {/* Replay Trigger Button */}
      <button
        onClick={handleReplayTest}
        disabled={isReplaying}
        className="w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isReplaying ? "animate-spin" : ""}`} />
        {isReplaying ? "Replaying Vector Search Queries..." : "Run Gap Closure Replay Test"}
      </button>
    </div>
  );
}

function PushToReviewerQueueButton({ cluster }: { cluster: GapCluster }) {
  const [status, setStatus] = useState<"idle" | "pushing" | "pushed" | "duplicate">("idle");

  const handlePush = () => {
    setStatus("pushing");
    setTimeout(() => {
      // Simulate API call check for duplicate
      if (cluster.id === "c005") {
        setStatus("duplicate");
      } else {
        setStatus("pushed");
      }
    }, 600);
  };

  if (status === "pushed") {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Task Pushed to Agri Reviewer Queue
        </span>
        <span className="text-[10px] opacity-75">Task #{cluster.id.toUpperCase()}</span>
      </div>
    );
  }

  if (status === "duplicate") {
    return (
      <div className="flex items-center justify-between p-3 rounded-lg text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-400">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          Task Already Exists in Queue (Pending)
        </span>
        <span className="text-[10px] opacity-75">Duplicate Guard</span>
      </div>
    );
  }

  return (
    <button
      onClick={handlePush}
      disabled={status === "pushing"}
      className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:opacity-90 active:scale-[0.99]"
      style={{
        background: "var(--color-primary)",
        color: "var(--color-primary-foreground)",
      }}
    >
      {status === "pushing" ? (
        <>
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          Pushing to Reviewer Queue...
        </>
      ) : (
        <>
          <span>Push to Agri Reviewer Queue</span>
          <span className="text-[10px] opacity-80 px-1.5 py-0.5 rounded bg-black/20">1-Click</span>
        </>
      )}
    </button>
  );
}
