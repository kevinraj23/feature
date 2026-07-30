# GDB Coverage Gap Detector

A pipeline and dashboard for systematically surfacing knowledge gaps in the GreenDoc Bot (GDB) — an AI-powered farmer advisory system. Accelerates the GDB growth roadmap from reactive to data-driven.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple) ![Tailwind](https://img.shields.io/badge/Tailwind-v4-06b6d4)

---

## Problem Statement

When a farmer asks a question that GDB cannot answer, the web app and WhatsApp bot send a 2-hour disclaimer and route the query to the reviewer pipeline. This is the right behaviour — but currently, **nobody has a systematic view of which questions are triggering disclaimers most frequently**.

Understanding these gaps would allow the agri team and outreach team to prioritise what the reviewer pipeline works on next, making GDB growth **intelligent and targeted** rather than reactive as the platform reaches real users and real questions keep flowing in.

---

## What I Built

A pipeline that continuously analyses disclaimer-triggered queries and surfaces coverage gaps:

- **Pull** all disclaimer-triggered queries from the system (already logged)
- **Cluster** them by crop, domain, state, and question intent using semantic similarity
- **Identify** which clusters are large (many farmers asking the same type of unanswered question) and which are growing (increasing frequency over time)
- **Surface** a weekly GDB Gap Report: a prioritised list of the top 20 question types that need GDB coverage, ranked by farmer demand
- **Dashboard** showing a coverage heatmap: which crop-state-domain combinations have strong GDB coverage and which have gaps
- **Feed** this directly into the outreach team's planning — they know which regions to target for field engagement based on where GDB gaps are largest

---

## Dashboard Views

| View | Description |
|---|---|
| **KPI Bar** | 4 stat cards: Total Disclaimers, Unique Clusters, YoY Growth, and Deflection Impact |
| **Diagnosis Legend** | Color-coded legend for the 5 gap diagnosis types |
| **Coverage Heatmap** | Crop × State matrix with color intensity mapped to Coverage Debt Score |
| **Priority Queue** | Ranked, sortable table of gap clusters with diagnosis badges, farmer counts, and growth trends |
| **Cluster Detail Drawer** | Slide-out panel with diagnosis reasoning, 4-week trend sparkline, sample farmer queries, and recommended action |

### 5 Diagnosis Types

| Diagnosis | Meaning |
|---|---|
| 🔴 **Missing Knowledge** | KB has no relevant content at all |
| 🟡 **Retrieval Failure** | KB has content but RAG fails to surface it |
| 🟢 **Language / Alias Gap** | Regional language or colloquial terms not indexed |
| 🔵 **Missing Context** | System doesn't ask clarifying follow-up questions |
| 🟣 **Safety Escalation** | Query involves risk (over-dosage, harvest safety interval) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 18 + TypeScript |
| Styling | Tailwind CSS v4 |
| Data Fetching | TanStack Query (wired for Supabase, currently on mock data) |
| Charts | Recharts (sparklines in detail drawer) |
| Icons | Lucide React |
| Backend (planned) | Python, FastAPI, MongoDB |
| Clustering (planned) | scikit-learn / sentence-transformers |
| Database | Supabase (schema ready, seeded with realistic mock data) |

---

## Project Structure

```
src/
├── main.tsx                  # Entry point
├── App.tsx                   # Root layout — header, sections, drawer
├── index.css                 # Tailwind v4 @theme with design tokens
├── types/index.ts            # GapCluster, GapKpis, DiagnosisType
├── data/mockData.ts          # 12 realistic clusters across Paddy/Wheat/Cotton
├── hooks/useGapData.ts       # Data fetching hook (mock → Supabase-ready)
├── lib/supabase.ts           # Supabase client placeholder
└── components/
    ├── KpiBar.tsx            # 4 KPI stat cards with loading skeletons
    ├── DiagnosisLegend.tsx   # 5 color-coded diagnosis badge legend
    ├── CoverageHeatmap.tsx   # Crop × State heatmap grid
    ├── PriorityQueue.tsx     # Sortable table with keyboard navigation
    └── ClusterDrawer.tsx     # Slide-out detail panel with Recharts trend
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Data Model

### `gap_clusters`
| Column | Type | Description |
|---|---|---|
| `id` | UUID | Primary key |
| `cluster_name` | TEXT | Human-readable cluster label |
| `crop` | TEXT | Crop name (Paddy, Wheat, Cotton) |
| `state` | TEXT | Indian state (Punjab, Maharashtra, Tamil Nadu) |
| `domain` | TEXT | Advisory domain (Pest Mgmt, Soil Health, etc.) |
| `diagnosis` | TEXT | One of 5 diagnosis types |
| `diagnosis_reasoning` | TEXT | LLM-generated root cause explanation |
| `coverage_debt_score` | NUMERIC | 0–100 urgency score |
| `unique_farmers` | INT | Number of distinct farmers affected |
| `total_queries` | INT | Total query volume in cluster |
| `yoy_growth_pct` | NUMERIC | Year-over-year query growth % |
| `sample_queries` | JSONB | Array of `{query, timestamp}` objects |
| `recommended_action` | TEXT | Team action recommendation |
| `trend_4wk` | JSONB | Array of `{week, debt_score}` for sparkline |

### `gap_kpis`
| Column | Type | Description |
|---|---|---|
| `total_disclaimers` | INT | Total disclaimer count |
| `unique_clusters` | INT | Number of distinct gap clusters |
| `yoy_growth_pct` | NUMERIC | Aggregate year-over-year growth |
| `deflection_impact_pct` | NUMERIC | Projected query reduction if top-5 resolved |

---

## Mock Data Coverage

12 clusters across 3 crops × 3 states covering all 5 diagnosis types with realistic:
- Multi-lingual farmer queries (Hindi, Marathi, Tamil, Punjabi)
- Region-specific agronomic reasoning
- Actionable team recommendations

---

## Supabase Migration

When ready to connect to Supabase:
1. Run the schema DDL from `prd/overview.md`
2. Seed `gap_kpis` and `gap_clusters` with data from `src/data/mockData.ts`
3. Uncomment the TanStack Query + Supabase code in `src/hooks/useGapData.ts`

---

## Why This Matters

The ACE document targets **200,000 GDB entries**. Getting there randomly will take much longer than getting there strategically. This project directly accelerates the GDB growth roadmap by telling the team exactly where to focus next.
