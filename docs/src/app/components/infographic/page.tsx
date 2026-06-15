import type { ComponentType } from "react";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  Infographic,
  InfographicRow,
  InfographicStack,
  InfographicGrid,
  InfographicScheme,
  InfographicPortfolio,
  InfographicOwners,
  InfographicReports,
  InfographicFinance,
  InfographicLevyCalc,
  InfographicAi,
  InfographicWorkflow,
  InfographicMaintenance,
  InfographicAgm,
  InfographicCompliance,
  InfographicBudget,
  InfographicCashflow,
  InfographicCommunications,
  InfographicContractor,
  InfographicInsurance,
  InfographicCommittee,
  InfographicSearch,
  InfographicNotifications,
  InfographicBuilding,
  InfographicArrears,
  InfographicDocuments,
  InfographicOnboarding,
  InfographicSchemePair,
  InfographicLevyPair,
  InfographicChartPair,
  InfographicEditorPair,
} from "@/components/ui/infographic";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/infographic/registry.json`;

const USAGE = `import {
  InfographicScheme,
  InfographicMaintenance,
  InfographicRow,
  InfographicStack,
  InfographicGrid,
} from "@/components/ui/infographic"

// Single element — drop into a bento cell or feature section
<InfographicMaintenance />

// Side-by-side pair
<InfographicRow pill="Export">
  <InfographicCashflow />
  <InfographicBudget />
</InfographicRow>

// Vertical stack — hero sidebar or narrow column
<InfographicStack>
  <InfographicNotifications />
  <InfographicSearch />
</InfographicStack>

// Showcase grid — feature section or landing page
<InfographicGrid cols={3}>
  <InfographicBuilding />
  <InfographicCompliance />
  <InfographicOnboarding />
</InfographicGrid>`;

const FEATURE_SPLIT = `import { FeatureSplit, FEATURE_SPLIT_STRATA } from "@/components/ui/feature-split"
import { InfographicReports, InfographicAi } from "@/components/ui/infographic"

<FeatureSplit
  {...FEATURE_SPLIT_STRATA}
  topVisual={<InfographicReports />}
  bottomVisual={<InfographicAi />}
/>`;

const CORE = [
  { name: "Scheme", component: InfographicScheme, description: "Building health bar chart." },
  { name: "Portfolio", component: InfographicPortfolio, description: "Multi-scheme occupancy bars." },
  { name: "Owners", component: InfographicOwners, description: "Owner directory with levy status." },
  { name: "Reports", component: InfographicReports, description: "Report queue with trend strip." },
  { name: "Finance", component: InfographicFinance, description: "Quarterly levy breakdown." },
  { name: "Levy Calculator", component: InfographicLevyCalc, description: "Levy input workflow." },
  { name: "AI Assist", component: InfographicAi, description: "AI prompt with suggested actions." },
  { name: "Workflow", component: InfographicWorkflow, description: "Automation pipeline steps." },
] as const;

const FEED_LAYOUT = [
  { name: "Maintenance", component: InfographicMaintenance, description: "Work order feed with priority badges." },
  { name: "Communications", component: InfographicCommunications, description: "Notice thread with sender avatars." },
  { name: "Notifications", component: InfographicNotifications, description: "Inbox categories with unread counts." },
] as const;

const METRIC_LAYOUT = [
  { name: "Budget", component: InfographicBudget, description: "2×2 revenue, expense and variance grid." },
  { name: "Cashflow", component: InfographicCashflow, description: "Balance headline with sparkline trend." },
  { name: "Building", component: InfographicBuilding, description: "Scheme profile card with unit stats." },
  { name: "Arrears", component: InfographicArrears, description: "Aging buckets as stacked horizontal bar." },
] as const;

const OPERATIONS_LAYOUT = [
  { name: "Contractor", component: InfographicContractor, description: "Mini kanban — quoted, active, done." },
  { name: "Compliance", component: InfographicCompliance, description: "Checklist with progress bar." },
  { name: "Onboarding", component: InfographicOnboarding, description: "Horizontal scheme setup stepper." },
  { name: "Insurance", component: InfographicInsurance, description: "Policy renewal timeline." },
] as const;

const GOVERNANCE_LAYOUT = [
  { name: "AGM", component: InfographicAgm, description: "Calendar grid with meeting date highlighted." },
  { name: "Committee", component: InfographicCommittee, description: "Motion voting table." },
  { name: "Documents", component: InfographicDocuments, description: "Folder tree with file counts." },
  { name: "Search", component: InfographicSearch, description: "Global search with result snippets." },
] as const;

const PAIRS = [
  { name: "Scheme Pair", component: InfographicSchemePair, description: "Scheme health chart + metric sidebar." },
  { name: "Levy Pair", component: InfographicLevyPair, description: "Levy calculator + quarter selector." },
  { name: "Chart Pair", component: InfographicChartPair, description: "Faceted combo chart + config sidebar." },
  { name: "Editor Pair", component: InfographicEditorPair, description: "SQL editor + language picker." },
] as const;

const INFOGRAPHIC_PROPS = [
  { name: "title", type: "string", description: "Window title shown in the title bar." },
  { name: "hideTitle", type: "boolean", default: "false", description: "Hide the title bar entirely." },
  { name: "className", type: "string", description: "Additional classes on the shell." },
];

const LAYOUT_PROPS = [
  { name: "pill", type: "string", description: "Optional floating pill on InfographicRow (Share, Export, etc.)." },
  { name: "cols", type: "2 | 3", default: "2", description: "Column count for InfographicGrid." },
];

function InfographicGallery({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: readonly { name: string; component: ComponentType<{ className?: string }>; description: string }[];
}) {
  return (
    <section className="mb-10 pt-10 border-t border-border">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">{title}</h2>
      <p className="text-sm text-ink-muted mb-6 leading-relaxed">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ name, component: Component, description: desc }) => (
          <div key={name}>
            <ComponentPreview label={name}>
              <div className="w-full p-4 bg-[#EEF2E3] rounded-sm">
                <Component />
              </div>
            </ComponentPreview>
            <p className="text-xs text-ink-muted mt-2 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function InfographicPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Infographic</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Flat UI mock elements for Instant Strata marketing sections. Twenty-three themed
          illustrations across feed, metric, kanban, calendar, timeline, and stepper layouts.
          Compose with <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">InfographicRow</code>,{" "}
          <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">InfographicStack</code>, or{" "}
          <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">InfographicGrid</code>.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <CodeBlock code={USAGE} language="tsx" />
      </section>

      <InfographicGallery
        title="Core"
        description="Original eight illustrations — schemes, portfolio, owners, reports, finance, AI, and workflow."
        items={CORE}
      />

      <InfographicGallery
        title="Feed &amp; inbox layout"
        description="Vertical lists with badges, avatars, and status pills — maintenance queues, communications, and notifications."
        items={FEED_LAYOUT}
      />

      <InfographicGallery
        title="Metric &amp; chart layout"
        description="Stat grids, sparklines, profile cards, and stacked bars — budget, cashflow, building profiles, and arrears."
        items={METRIC_LAYOUT}
      />

      <InfographicGallery
        title="Operations layout"
        description="Kanban boards, checklists, steppers, and timelines — contractors, compliance, onboarding, and insurance."
        items={OPERATIONS_LAYOUT}
      />

      <InfographicGallery
        title="Governance layout"
        description="Calendars, tables, folder trees, and search — AGMs, committee votes, documents, and global search."
        items={GOVERNANCE_LAYOUT}
      />

      {/* ── Layout composition ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Layout composition</h2>
        <p className="text-sm text-ink-muted mb-6 leading-relaxed">
          Three wrappers for arranging infographics on landing pages and feature sections.
        </p>

        <div className="space-y-8">
          <div>
            <ComponentPreview label="InfographicStack">
              <div className="w-full max-w-xs p-4 bg-[#EEF2E3] rounded-sm">
                <InfographicStack>
                  <InfographicNotifications />
                  <InfographicSearch />
                </InfographicStack>
              </div>
            </ComponentPreview>
          </div>

          <div>
            <ComponentPreview label="InfographicGrid · cols={3}">
              <div className="w-full p-4 bg-[#EBF8C2] rounded-sm">
                <InfographicGrid cols={3}>
                  <InfographicBuilding />
                  <InfographicCompliance />
                  <InfographicOnboarding />
                </InfographicGrid>
              </div>
            </ComponentPreview>
          </div>

          <div>
            <ComponentPreview label="InfographicRow">
              <div className="w-full p-4 bg-[#C8F169] rounded-sm">
                <InfographicRow pill="Live">
                  <InfographicCashflow />
                  <InfographicArrears />
                </InfographicRow>
              </div>
            </ComponentPreview>
          </div>
        </div>
      </section>

      {/* ── Pairs ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Pairs</h2>
        <p className="text-sm text-ink-muted mb-6 leading-relaxed">
          Pre-composed side-by-side layouts for FeatureSplit visual slots.
        </p>
        <div className="space-y-8">
          {PAIRS.map(({ name, component: Component, description }) => (
            <div key={name}>
              <ComponentPreview label={name}>
                <div className="w-full p-4 bg-[#C8F169] rounded-sm">
                  <Component />
                </div>
              </ComponentPreview>
              <p className="text-xs text-ink-muted mt-2 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Custom shell</h2>
        <ComponentPreview label="Infographic shell">
          <div className="w-full max-w-xs p-4 bg-[#EEF2E3] rounded-sm">
            <Infographic title="Custom View" className="p-3">
              <div className="space-y-1.5">
                <div className="h-2 w-full rounded-full bg-white/15" />
                <div className="h-2 w-2/3 rounded-full bg-[#C8F169]/50" />
              </div>
            </Infographic>
          </div>
        </ComponentPreview>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">With FeatureSplit</h2>
        <CodeBlock code={FEATURE_SPLIT} language="tsx" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Infographic Props</h2>
        <PropTable props={INFOGRAPHIC_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Layout Props</h2>
        <PropTable props={LAYOUT_PROPS} />
      </section>

    </DocsPage>
  );
}
