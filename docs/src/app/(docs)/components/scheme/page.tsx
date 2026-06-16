"use client";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  SCHEME_DEMO_ACTIVE,
  SCHEME_DEMO_ITEMS,
  SchemeCard,
  SchemeContextBar,
  SchemeGrid,
  SchemeHealthIndicator,
  SchemeIdentity,
  SchemeList,
  SchemeMeta,
  SchemePlanBadge,
  SchemeStat,
  SchemeStatusBadge,
  SchemeSwitcher,
} from "@/components/ui/scheme";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/scheme/registry.json`;

const LIST_CODE = `import { SchemeCard, SchemeList } from "@/components/ui/scheme"

<SchemeList>
  {schemes.map((scheme) => (
    <SchemeCard
      key={scheme.id}
      scheme={scheme}
      layout="list"
      showStatus
      showChevron
      href={\`/schemes/\${scheme.id}\`}
    />
  ))}
</SchemeList>`;

const CONTEXT_CODE = `import { SchemeContextBar } from "@/components/ui/scheme"
import { Button } from "@/components/ui/button"

<SchemeContextBar
  scheme={activeScheme}
  schemes={portfolio}
  onSchemeSelect={({ scheme }) => setActive(scheme)}
  actions={<Button size="sm">View roll</Button>}
/>`;

const SCHEME_SUMMARY_FIELDS = [
  { name: "id", type: "string", description: "Stable identifier for routing and API calls." },
  { name: "name", type: "string", description: "Display name, e.g. Harbour View Towers." },
  { name: "plan", type: "string", description: "Strata plan number. Normalised by formatSchemePlan." },
  { name: "suburb", type: "string", description: "Suburb for location metadata." },
  { name: "state", type: "string", description: "State or territory code." },
  { name: "lotCount", type: "number", description: "Total lots on the strata roll." },
  { name: "financialYearEnd", type: "string", description: 'Financial year end, e.g. "30 Jun".' },
  { name: "managerName", type: "string", description: "Assigned strata manager." },
  { name: "status", type: "SchemeStatus", description: "active | onboarding | archived | attention." },
  { name: "health", type: "SchemeHealth", description: "good | warning | critical." },
  { name: "openTasks", type: "number", description: "Open tasks requiring manager action." },
  { name: "arrearsPercent", type: "number", description: "Percentage of lots in arrears." },
];

const CARD_PROPS = [
  { name: "scheme", type: "SchemeSummary", description: "Scheme data object." },
  { name: "layout", type: '"list" | "card" | "compact" | "wide"', default: '"list"', description: "list = directory row. card = portfolio tile. compact = switcher row. wide = table row." },
  { name: "href", type: "string", description: "When set, renders the card as a link." },
  { name: "showChevron", type: "boolean", default: "false", description: "Trailing chevron for navigable rows." },
  { name: "showStatus", type: "boolean", default: "false", description: "Shows the lifecycle status badge." },
  { name: "showHealth", type: "boolean", default: "false", description: "Shows the health indicator." },
  { name: "showPlan", type: "boolean", default: "true", description: "Shows the SP plan badge." },
  { name: "selected", type: "boolean", default: "false", description: "Highlights the row with lime-soft background." },
  { name: "actions", type: "ReactNode", description: "Custom trailing actions." },
];

const CONTEXT_PROPS = [
  { name: "scheme", type: "SchemeSummary", description: "Active scheme shown in the bar." },
  { name: "schemes", type: "SchemeSummary[]", description: "Portfolio list for the switcher. Omit to hide switching." },
  { name: "onSchemeSelect", type: "({ scheme }) => void", description: "Called when the manager picks another scheme." },
  { name: "stats", type: "ReactNode", description: "Replace the default stat strip." },
  { name: "actions", type: "ReactNode", description: "Right-aligned page actions." },
  { name: "sticky", type: "boolean", default: "true", description: "Stick below the app header on scroll." },
];

/**
 * Scheme component documentation for strata building identity.
 */
export default function SchemePage() {
  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Application
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Scheme</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          Strata scheme identity primitives for Instant Strata. A scheme is the owners
          corporation for a building: identified by name, strata plan number, location,
          and roll size. Use these elements everywhere a scheme appears so managers
          always see consistent identity, status, and context.
        </p>
      </div>

      {/* Design rationale */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Design rationale
        </h2>
        <div className="max-w-3xl space-y-4 text-sm text-ink-muted leading-relaxed">
          <p>
            Strata managers work across dozens of schemes. Every screen inside a scheme
            needs a persistent context bar so they never lose track of which building
            they are working on. Portfolio views need list and card layouts that surface
            the same fields in the same order: name, plan, location, lots, and status.
          </p>
          <p>
            The <code className="font-mono text-xs text-ink">SchemeSummary</code> type
            is the shared contract. Extend it in the app with financial balances,
            compliance dates, and fund splits. The UI primitives stay stable.
          </p>
          <p>
            Building2 is the default scheme icon per the Icons guide. Initials on
            lime-soft tiles are used when a scheme needs a distinct avatar in cards
            and switchers.
          </p>
        </div>
      </section>

      {/* Primitives */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Primitives
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Compose these in custom layouts, AI entity tags, breadcrumbs, and table cells.
          Status and plan badges compose the shared{" "}
          <a href="/components/badge" className="text-forest underline underline-offset-2">
            Badge
          </a>{" "}
          primitive. See the Badge docs for all lifecycle states and variant mapping.
        </p>

        <div className="space-y-8">
          <ComponentPreview label="SchemeIdentity, SchemePlanBadge, SchemeMeta">
            <div className="flex flex-col gap-6 w-full max-w-lg py-2">
              <SchemeIdentity scheme={SCHEME_DEMO_ACTIVE} />
              <div className="flex flex-wrap items-center gap-2">
                <SchemePlanBadge plan={SCHEME_DEMO_ACTIVE.plan} />
                <SchemeStatusBadge status="active" />
                <SchemeStatusBadge status="attention" />
                <SchemeHealthIndicator health="warning" />
              </div>
              <SchemeMeta scheme={SCHEME_DEMO_ACTIVE} showLocationIcon showManager />
            </div>
          </ComponentPreview>

          <ComponentPreview label="SchemeStat metrics">
            <div className="flex flex-wrap gap-8 py-2">
              <SchemeStat label="Lots" value={52} />
              <SchemeStat label="Open tasks" value={8} tone="warning" />
              <SchemeStat label="In arrears" value="18%" tone="danger" />
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* List layout */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          List layout
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Default directory row for scheme pickers, sidebars, and mobile lists.
        </p>

        <ComponentPreview label="SchemeList with list rows">
          <SchemeList className="w-full max-w-xl">
            {SCHEME_DEMO_ITEMS.slice(0, 3).map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                layout="list"
                showStatus
                showChevron
                href="#"
              />
            ))}
          </SchemeList>
        </ComponentPreview>

        <div className="mt-6">
          <CodeBlock code={LIST_CODE} />
        </div>
      </section>

      {/* Card layout */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Card layout
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Portfolio tiles with stats for manager dashboards.
        </p>

        <ComponentPreview label="SchemeGrid with card tiles">
          <SchemeGrid columns={2} className="w-full max-w-2xl">
            {SCHEME_DEMO_ITEMS.slice(0, 2).map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                layout="card"
                showStatus
                showHealth
                showChevron
                href="#"
              />
            ))}
          </SchemeGrid>
        </ComponentPreview>
      </section>

      {/* Wide layout */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Wide layout
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Tabular portfolio view with column headings.
        </p>

        <ComponentPreview label="SchemeList with wide rows">
          <SchemeList showWideHeader className="w-full">
            {SCHEME_DEMO_ITEMS.map((scheme) => (
              <SchemeCard
                key={scheme.id}
                scheme={scheme}
                layout="wide"
                showStatus
                showHealth
                showChevron
                href="#"
              />
            ))}
          </SchemeList>
        </ComponentPreview>
      </section>

      {/* Context bar */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          SchemeContextBar
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Sticky strip at the top of scheme-scoped pages. Shows identity, key metrics,
          portfolio switching, and page actions.
        </p>

        <ComponentPreview label="Context bar with switcher and actions">
          <div className="w-full overflow-hidden rounded-sm border border-border">
            <SchemeContextBar
              scheme={SCHEME_DEMO_ACTIVE}
              schemes={SCHEME_DEMO_ITEMS}
              sticky={false}
              actions={
                <Button size="sm" variant="outline">
                  View roll
                </Button>
              }
            />
            <div className="bg-off-white px-4 py-8 text-sm text-ink-muted">
              Page content sits below the context bar.
            </div>
          </div>
        </ComponentPreview>

        <div className="mt-6">
          <CodeBlock code={CONTEXT_CODE} />
        </div>
      </section>

      {/* Switcher */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          SchemeSwitcher
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Standalone portfolio picker. Embedded automatically when{" "}
          <code className="font-mono text-xs text-ink">schemes</code> is passed to
          SchemeContextBar.
        </p>

        <ComponentPreview label="SchemeSwitcher dropdown">
          <SchemeSwitcher
            scheme={SCHEME_DEMO_ACTIVE}
            schemes={SCHEME_DEMO_ITEMS}
          />
        </ComponentPreview>
      </section>

      {/* Related patterns */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Related patterns
        </h2>
        <div className="max-w-3xl space-y-4 text-sm text-ink-muted leading-relaxed">
          <p>
            <strong className="font-semibold text-ink">Badges</strong>:{" "}
            <code className="font-mono text-xs text-ink">SchemePlanBadge</code> and{" "}
            <code className="font-mono text-xs text-ink">SchemeStatusBadge</code> compose{" "}
            <a href="/components/badge" className="text-forest underline underline-offset-2">
              Badge
            </a>
            . Use that page as the canonical reference for status tones and states.
          </p>
          <p>
            <strong className="font-semibold text-ink">Lot</strong>: the child entity
            under a scheme. See the{" "}
            <a href="/components/lot" className="text-forest underline underline-offset-2">
              Lot component
            </a>{" "}
            for roll lists, levy badges, and proxy eligibility.
          </p>
          <p>
            <strong className="font-semibold text-ink">Scheme breadcrumb</strong>: compose
            SchemeIdentity with compact layout in AppHeader for nested routes like
            Schemes / Harbour View / Levies.
          </p>
          <p>
            <strong className="font-semibold text-ink">AI entity tags</strong>: align
            Message <code className="font-mono text-xs text-ink">strata-scheme</code> plugin
            styling with SchemePlanBadge and SchemeIdentity for consistent inline references.
          </p>
        </div>
      </section>

      {/* Install */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Install
        </h2>
        <CodeBlock code={INSTALL} />
        <p className="mt-3 text-sm text-ink-muted">
          Requires the <code className="font-mono text-xs text-ink">badge</code> and{" "}
          <code className="font-mono text-xs text-ink">dropdown-menu</code> components.
        </p>
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Reference
        </h2>

        <h3 className="text-sm font-semibold text-ink mb-3">SchemeSummary</h3>
        <div className="mb-8">
          <PropTable props={SCHEME_SUMMARY_FIELDS} />
        </div>

        <h3 className="text-sm font-semibold text-ink mb-3">SchemeCard</h3>
        <div className="mb-8">
          <PropTable props={CARD_PROPS} />
        </div>

        <h3 className="text-sm font-semibold text-ink mb-3">SchemeContextBar</h3>
        <PropTable props={CONTEXT_PROPS} />
      </section>
    </DocsPage>
  );
}
