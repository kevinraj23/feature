import { Database, GitBranch, Microscope, BarChart3, MapPin } from "lucide-react";

const steps = [
  {
    icon: Database,
    label: "Disclaimer Logs",
    desc: "Pull all queries that triggered the 2-hour disclaimer across web & WhatsApp",
    color: "var(--color-primary)",
  },
  {
    icon: GitBranch,
    label: "Semantic Clustering",
    desc: "Group queries by crop, domain, state & intent using sentence-transformers",
    color: "var(--color-dx-missing-context)",
  },
  {
    icon: Microscope,
    label: "Gap Diagnosis",
    desc: "Classify each cluster: missing knowledge, retrieval failure, language gap, etc.",
    color: "var(--color-accent)",
  },
  {
    icon: BarChart3,
    label: "Priority Ranking",
    desc: "Score clusters by farmer volume, growth rate & deflection impact",
    color: "var(--color-dx-retrieval-failure)",
  },
  {
    icon: MapPin,
    label: "Outreach Planning",
    desc: "Feed top-20 gap report into agri & outreach team weekly planning",
    color: "var(--color-dx-language-alias)",
  },
];

export default function PipelineFlow() {
  return (
    <div className="rounded-xl p-5" style={{ background: "var(--color-muted)", border: "1px solid var(--color-border)" }}>
      <div className="flex items-center gap-2 mb-4">
        <GitBranch className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
        <h2 className="text-sm font-semibold font-[family-name:var(--font-heading)] uppercase tracking-wide" style={{ color: "oklch(0.62 0.02 260)" }}>
          Pipeline Architecture
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex lg:flex-col items-center flex-1 group">
            {/* Step card */}
            <div className="flex lg:flex-col items-center lg:items-center text-center p-3 flex-1">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-transform duration-200 group-hover:scale-110"
                style={{ background: `color-mix(in oklab, ${step.color} 15%, transparent)` }}
              >
                <step.icon className="w-5 h-5" style={{ color: step.color }} />
              </div>
              <div className="lg:mt-1">
                <p className="text-xs font-semibold font-[family-name:var(--font-heading)]" style={{ color: "var(--color-foreground)" }}>
                  {step.label}
                </p>
                <p className="text-[10px] leading-relaxed mt-0.5 hidden lg:block" style={{ color: "oklch(0.48 0.02 260)" }}>
                  {step.desc}
                </p>
              </div>
            </div>

            {/* Connector arrow */}
            {i < steps.length - 1 && (
              <div className="flex items-center justify-center lg:absolute lg:relative shrink-0">
                <div className="w-5 h-5 lg:w-full lg:h-5 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 lg:w-5 lg:h-5 rotate-90 lg:rotate-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="oklch(0.38 0.02 260)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Weekly cadence badge */}
      <div className="flex items-center justify-center mt-4 pt-3" style={{ borderTop: "1px solid var(--color-border)" }}>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium"
          style={{ background: "oklch(0.6658 0.1574 58.32 / 0.08)", color: "var(--color-accent)", border: "1px solid oklch(0.6658 0.1574 58.32 / 0.2)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-accent)" }} />
          Runs Weekly · Every Monday 06:00 IST
        </span>
      </div>
    </div>
  );
}
