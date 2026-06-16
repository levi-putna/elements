import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  FeatureSplit,
  FEATURE_SPLIT_DEFAULT,
  FEATURE_SPLIT_STRATA,
} from "@/components/ui/feature-split";
import {
  InfographicReports,
  InfographicAi,
} from "@/components/ui/infographic";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/feature-split/registry.json`;

const DEFAULT_USAGE = `import { FeatureSplit, FEATURE_SPLIT_DEFAULT } from "@/components/ui/feature-split"

// Defaults to InfographicChartPair + InfographicEditorPair
export function DataTeamFeature() {
  return <FeatureSplit {...FEATURE_SPLIT_DEFAULT} />
}`;

const STRATA_USAGE = `import { FeatureSplit, FEATURE_SPLIT_STRATA } from "@/components/ui/feature-split"
import { InfographicReports, InfographicAi } from "@/components/ui/infographic"

export function StrataFeature() {
  return (
    <FeatureSplit
      {...FEATURE_SPLIT_STRATA}
      topVisual={<InfographicReports />}
      bottomVisual={<InfographicAi />}
    />
  )
}`;

const CUSTOM_USAGE = `import { FeatureSplit } from "@/components/ui/feature-split"
import {
  InfographicChartPair,
  InfographicEditorPair,
  InfographicAi,
  InfographicWorkflow,
  InfographicRow,
} from "@/components/ui/infographic"

<FeatureSplit
  primary={{ heading: "…", body: "…" }}
  secondary={{ heading: "…", body: "…" }}
  topVisual={<InfographicChartPair />}
  bottomVisual={
    <InfographicRow>
      <InfographicAi />
      <InfographicWorkflow />
    </InfographicRow>
  }
/>`;

const PROPS = [
  { name: "primary", type: "{ heading: string; body: string }", description: "Top-left copy block: heading in Young Serif, body in Inter." },
  { name: "secondary", type: "{ heading: string; body: string }", description: "Bottom-right copy block." },
  { name: "topVisual", type: "ReactNode", description: "Top-right visual slot. Defaults to InfographicChartPair." },
  { name: "bottomVisual", type: "ReactNode", description: "Bottom-left visual slot. Defaults to InfographicEditorPair." },
  { name: "gap", type: '"sm" | "md" | "lg"', default: '"md"', description: "Gap between quadrants: also the visible forest-green seam width." },
];

export default function FeatureSplitPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Feature Split</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A stepped two-column interlock layout. Visual slots accept{" "}
          <a
            href="/components/infographic"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Infographic
          </a>{" "}
          pairs or custom compositions.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
        <p className="text-xs text-ink-muted mt-2">
          Also installs the <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">infographic</code> dependency.
        </p>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Default example</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Defaults to <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">InfographicChartPair</code> and{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">InfographicEditorPair</code>.
        </p>

        <ComponentPreview label="Default layout · sample copy">
          <FeatureSplit {...FEATURE_SPLIT_DEFAULT} />
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={DEFAULT_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Instant Strata</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Strata copy with <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">InfographicReports</code> and{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">InfographicAi</code>.
        </p>

        <ComponentPreview label="Instant Strata · adapted copy + infographics">
          <FeatureSplit
            {...FEATURE_SPLIT_STRATA}
            topVisual={<InfographicReports />}
            bottomVisual={<InfographicAi />}
          />
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={STRATA_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Layout anatomy</h2>
        <div className="rounded-sm border border-border overflow-hidden font-mono text-xs">
          {[
            ["Quadrant", "Tone", "Content"],
            ["Top-left", "cream (#EEF2E3)", "primary.heading + primary.body"],
            ["Top-right", "lime (#C8F169)", "topVisual: Infographic pair, bleeds left"],
            ["Bottom-left", "cream (#EEF2E3)", "bottomVisual: Infographic pair, bleeds right"],
            ["Bottom-right", "lime (#C8F169)", "secondary.heading + secondary.body"],
          ].map(([a, b, c], i) => (
            <div
              key={a}
              className={`flex gap-4 px-4 py-3 border-b border-border last:border-0 ${i === 0 ? "bg-secondary" : ""}`}
            >
              <span className={`w-28 shrink-0 ${i === 0 ? "font-semibold text-foreground" : "text-foreground"}`}>{a}</span>
              <span className={`w-36 shrink-0 ${i === 0 ? "font-semibold text-foreground" : "text-ink-muted"}`}>{b}</span>
              <span className={`${i === 0 ? "font-semibold text-foreground" : "text-ink-muted"}`}>{c}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Custom infographics</h2>
        <CodeBlock code={CUSTOM_USAGE} language="tsx" />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">FeatureSplit Props</h2>
        <PropTable props={PROPS} />
      </section>

    </DocsPage>
  );
}
