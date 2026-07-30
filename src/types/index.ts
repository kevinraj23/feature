export type DiagnosisType =
  | "missing_knowledge"
  | "retrieval_failure"
  | "language_alias_gap"
  | "missing_context"
  | "safety_escalation";

export type ClusterStatus =
  | "active"
  | "pending_reviewer"
  | "verified_closed"
  | "fix_ineffective";

export interface DiagnosisConfig {
  type: DiagnosisType;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface TrendPoint {
  week: string;
  debt_score: number;
}

export interface SampleQuery {
  query: string;
  timestamp: string;
}

export interface GapCluster {
  id: string;
  cluster_name: string;
  crop: string;
  state: string;
  domain: string;
  diagnosis: DiagnosisType;
  diagnosis_reasoning: string;
  coverage_debt_score: number;
  unique_farmers: number;
  total_queries: number;
  yoy_growth_pct: number;
  sample_queries: SampleQuery[];
  recommended_action: string;
  trend_4wk: TrendPoint[];
  created_at: string;
  cluster_status?: ClusterStatus;
  trend_state?: "new" | "growing" | "shrinking" | "resolved";
  pre_fix_cosine_score?: number;
  post_fix_cosine_score?: number;
  verified_at?: string;
  actual_deflection?: number;
}

export interface GapKpis {
  total_disclaimers: number;
  unique_clusters: number;
  yoy_growth_pct: number;
  deflection_impact_pct: number;
  verified_fixes_count: number;
  debt_paid_down_disclaimers: number;
  last_updated: string;
}
