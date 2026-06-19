import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { Notification } from "@/components/ui/notification";
import { Section } from "@/components/ui/section";
import {
  Widget,
  WidgetContent,
  WidgetFooter,
  WidgetHeader,
  WidgetList,
  WidgetListItem,
  WidgetTitle,
} from "@/components/ui/widget";
import { Calendar, Inbox } from "lucide-react";

/* ─── Token data ──────────────────────────────────────── */

const PADDING_TOKENS = [
  {
    name: "padding-xs",
    utility: "p-2",
    value: "8px",
    space: "--space-2",
    use: "Micro gaps, icon insets, compact tag padding, bento cell gaps.",
  },
  {
    name: "padding-sm",
    utility: "p-4",
    value: "16px",
    space: "--space-4",
    use: "Compact data: list rows, dialog body, select items, mobile section gutter (minimum).",
  },
  {
    name: "padding-md",
    utility: "p-6",
    value: "24px",
    space: "--space-6",
    use: "Default card padding, widget body, notifications, app content area, desktop gutter (minimum).",
  },
  {
    name: "padding-lg",
    utility: "p-8",
    value: "32px",
    space: "--space-8",
    use: "Featured marketing cards, testimonial quote blocks, wide blog card text columns.",
  },
  {
    name: "padding-xl",
    utility: "px-12",
    value: "48px",
    space: "--space-12",
    use: "Section horizontal gutter (tablet+), tablet section vertical padding.",
  },
  {
    name: "padding-2xl",
    utility: "py-24",
    value: "96px",
    space: "--space-24",
    use: "Section vertical padding (desktop), hero vertical padding (large breakpoints).",
  },
] as const;

const COMPACT_USAGE = {
  title: "Compact data",
  description:
    "Components in a set that hold distinct information in a small area: table rows, widget list items, sidebar items, badge insets.",
  token: "padding-sm · 16px (p-4)",
  examples: [
    { label: "WidgetListItem", padding: "px-5 py-3 (20px horizontal, 12px vertical)" },
    { label: "Dialog body", padding: "p-4" },
    { label: "Badge md", padding: "px-2 py-0.5" },
    { label: "App shell tab", padding: "px-4" },
  ],
} as const;

const VARIABLE_USAGE = {
  title: "Variable height content",
  description:
    "Components with varying content amounts: alerts, widgets, cards, popovers. Padding gives copy room to breathe.",
  token: "padding-md · 24px (p-6)",
  examples: [
    { label: "Card (base)", padding: "p-6" },
    { label: "Notification", padding: "px-5 py-4" },
    { label: "Widget header / body", padding: "px-5 py-4 / p-5" },
    { label: "App content area", padding: "p-6 (24px)" },
  ],
} as const;

const MARKETING_CARD_USAGE = {
  title: "Card-based content",
  description:
    "Marketing cards and editorial blocks. Padding scales up on larger breakpoints when there is more room.",
  token: "padding-md to padding-lg · 24–32px",
  examples: [
    { label: "Card (marketing base)", padding: "p-6" },
    { label: "BlogCardWide text column", padding: "p-7 md:p-9 lg:p-10" },
    { label: "StoryGrid tile", padding: "p-7 md:p-8" },
    { label: "Testimonial quote card", padding: "px-8 pt-8 md:px-10 md:pt-10" },
  ],
} as const;

const PAGE_LAYOUT = [
  {
    context: "Container gutter",
    mobile: "px-6 · 24px",
    desktop: "md:px-12 · 48px",
    note: "Section and site-header horizontal inset",
  },
  {
    context: "Section vertical (sm)",
    mobile: "py-12 · 48px",
    desktop: "md:py-16 · 64px",
    note: "Compact bands, FAQ, tight sections",
  },
  {
    context: "Section vertical (md)",
    mobile: "py-20 · 80px",
    desktop: "md:py-28 · 112px",
    note: "Default marketing section rhythm",
  },
  {
    context: "Section vertical (lg)",
    mobile: "py-24 · 96px",
    desktop: "md:py-32 · 128px",
    note: "Hero-adjacent, feature showcases",
  },
  {
    context: "Footer",
    mobile: "px-6 py-16",
    desktop: "md:px-8 md:py-20",
    note: "Dark section with link columns",
  },
] as const;

interface TokenRowProps {
  name: string;
  utility: string;
  value: string;
  space: string;
  use: string;
}

/**
 * Renders a single padding token row in the reference table.
 */
function TokenRow({ name, utility, value, space, use }: TokenRowProps) {
  return (
    <div className="px-6 py-4 bg-background flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
      <div className="shrink-0 sm:w-36">
        <code className="font-mono text-xs text-foreground">{name}</code>
        <p className="font-mono text-[11px] text-lime mt-0.5">{utility}</p>
      </div>
      <span className="font-mono text-xs text-ink-muted shrink-0 w-12">{value}</span>
      <code className="font-mono text-[11px] text-ink-muted/80 shrink-0 sm:w-24 hidden sm:block">{space}</code>
      <p className="font-sans text-sm text-ink-muted leading-relaxed">{use}</p>
    </div>
  );
}

interface PaddingGuideProps {
  title: string;
  description: string;
  token: string;
  examples: ReadonlyArray<{ label: string; padding: string }>;
}

/**
 * Renders a usage category with example components and padding values.
 */
function PaddingGuide({ title, description, token, examples }: PaddingGuideProps) {
  return (
    <div className="rounded-sm border border-border overflow-hidden">
      <div className="px-6 py-5 bg-secondary border-b border-border">
        <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
          <h2 className="font-display text-xl text-foreground">{title}</h2>
          <code className="font-mono text-xs text-lime">{token}</code>
        </div>
        <p className="font-sans text-sm text-ink-muted leading-relaxed">{description}</p>
      </div>
      <div className="divide-y divide-border">
        {examples.map((example) => (
          <div key={example.label} className="px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 bg-background">
            <span className="font-sans text-sm font-medium text-foreground sm:w-48 shrink-0">
              {example.label}
            </span>
            <code className="font-mono text-xs text-ink-muted">{example.padding}</code>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Foundation documentation for the Instant Strata padding system.
 */
export default function PaddingPage() {
  return (
    <DocsPage className="space-y-20">

      {/* ── Page header ───────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Padding
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Padding is the internal spacing that separates content from a component&apos;s
          outer boundary. Consistent padding keeps dense product UI readable and gives
          marketing sections room to breathe. All values sit on the 4px grid defined in{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            DESIGN.md
          </code>
          .
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          RULES
      ══════════════════════════════════════════════ */}
      <section id="rules">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Rules
        </p>
        <ul className="space-y-3 max-w-2xl">
          {[
            "Use spacing tokens from the 4px grid. Prefer Tailwind utilities (p-4, p-6, px-6) over hard-coded pixel values.",
            "Cards never touch their edges: 24px internal padding minimum for card shells.",
            "Product UI defaults to padding-md (24px) for panels. Step down to padding-sm (16px) only in dense lists and tables.",
            "Marketing cards may scale padding up at md and lg breakpoints (p-7, p-8, p-10).",
            "Section gutters are managed by Container and Section, not repeated on every child.",
            "Pair larger padding with larger border radii on marketing surfaces.",
          ].map((rule) => (
            <li key={rule} className="flex gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <span className="text-lime shrink-0 mt-0.5" aria-hidden="true">-</span>
              {rule}
            </li>
          ))}
        </ul>
      </section>

      {/* ══════════════════════════════════════════════
          TOKENS
      ══════════════════════════════════════════════ */}
      <section id="tokens">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Tokens
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Semantic padding tokens map to CSS custom properties in{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            globals.css
          </code>{" "}
          and Tailwind spacing utilities. Use semantic names in documentation; use utilities in code.
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">
          {PADDING_TOKENS.map((row) => (
            <TokenRow key={row.name} {...row} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          USAGE CATEGORIES
      ══════════════════════════════════════════════ */}
      <section id="compact-data">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Usage
        </p>

        <div className="space-y-6">
          <PaddingGuide {...COMPACT_USAGE} />
          <PaddingGuide {...VARIABLE_USAGE} />
          <PaddingGuide {...MARKETING_CARD_USAGE} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LIVE EXAMPLES
      ══════════════════════════════════════════════ */}
      <section id="examples">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Examples
        </p>

        <ComponentPreview label="Compact data · 16px row padding">
          <div className="w-full max-w-sm py-2">
            <Widget>
              <WidgetHeader divided>
                <WidgetTitle icon={Inbox} count={2}>Open items</WidgetTitle>
              </WidgetHeader>
              <WidgetList>
                <WidgetListItem
                  icon={Calendar}
                  title="AGM minutes due"
                  meta="Harbour View · 3 days"
                />
                <WidgetListItem
                  icon={Calendar}
                  title="Levy notice batch"
                  meta="Riverside Towers · 5 days"
                />
              </WidgetList>
              <WidgetFooter>View all open items</WidgetFooter>
            </Widget>
            <p className="font-sans text-xs text-ink-muted mt-3">
              List rows use px-5 py-3. Header and footer use px-5 with py-4 / py-3.
            </p>
          </div>
        </ComponentPreview>

        <div className="mt-6">
          <ComponentPreview label="Variable height · 24px card padding">
          <div className="w-full max-w-md space-y-4 py-2">
            <Notification type="warning" title="AGM date not confirmed">
              Soft warning background with 20px horizontal and 16px vertical padding.
            </Notification>
            <Card tone="accent">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
                Featured
              </p>
              <p className="font-sans text-sm font-semibold text-ink mb-1">Scheme onboarding</p>
              <p className="font-sans text-xs text-ink-muted">
                Card shell uses p-6 (24px) on all sides.
              </p>
            </Card>
          </div>
          </ComponentPreview>
        </div>

        <div className="mt-6">
          <ComponentPreview label="Marketing card · responsive padding">
          <div className="w-full max-w-lg py-2">
            <div className="rounded-xl bg-white border border-border shadow-[0_1px_3px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="aspect-[16/10] bg-lime-soft/60" />
              <div className="p-6 md:p-8">
                <Badge variant="mono" size="sm" className="mb-3">Product</Badge>
                <p className="font-display text-xl text-ink mb-2">Everything in one place</p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">
                  Wide marketing cards scale from p-6 (24px) to p-8 (32px) at md breakpoint.
                </p>
              </div>
            </div>
          </div>
        </ComponentPreview>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PAGE & SECTION LAYOUT
      ══════════════════════════════════════════════ */}
      <section id="page-layout">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Page &amp; Section Layout
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Full-bleed sections manage vertical rhythm.{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            Container
          </code>{" "}
          constrains horizontal width and applies the site gutter. Do not add duplicate
          horizontal padding on children inside a contained section.
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border mb-8">
          {PAGE_LAYOUT.map((row) => (
            <div key={row.context} className="px-6 py-4 bg-background">
              <p className="font-sans text-sm font-semibold text-foreground mb-2">{row.context}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs text-ink-muted mb-1">
                <span>Mobile: <span className="text-lime">{row.mobile}</span></span>
                <span>Desktop: <span className="text-lime">{row.desktop}</span></span>
              </div>
              <p className="font-sans text-xs text-ink-muted">{row.note}</p>
            </div>
          ))}
        </div>

        <ComponentPreview label="Section + Container gutter">
          <div className="w-full py-2">
            <Section type="secondary" spacing="sm" contained className="rounded-sm overflow-hidden">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
                Section with contained=true
              </p>
              <p className="font-sans text-sm text-ink-muted">
                Horizontal gutter comes from Container (px-6 md:px-12). Vertical padding
                from Section spacing prop (py-12 md:py-16 for sm).
              </p>
            </Section>
          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          SPACING SCALE REFERENCE
      ══════════════════════════════════════════════ */}
      <section id="spacing-scale">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Full Spacing Scale
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Padding tokens are a subset of the base spacing scale. Gaps between elements
          use the same values.
        </p>

        <div className="rounded-sm border border-border overflow-hidden font-mono text-xs">
          {[
            { space: "--space-1", utility: "1", value: "4px", use: "Micro gaps, icon padding" },
            { space: "--space-2", utility: "2", value: "8px", use: "Tight inline spacing, padding-xs" },
            { space: "--space-3", utility: "3", value: "12px", use: "Small element gaps, list row vertical" },
            { space: "--space-4", utility: "4", value: "16px", use: "Default element spacing, padding-sm" },
            { space: "--space-6", utility: "6", value: "24px", use: "Card padding, padding-md, app content" },
            { space: "--space-8", utility: "8", value: "32px", use: "Section sub-divisions, padding-lg, card grid gap" },
            { space: "--space-12", utility: "12", value: "48px", use: "Component-level spacing, tablet gutter" },
            { space: "--space-16", utility: "16", value: "64px", use: "Between major content blocks" },
            { space: "--space-24", utility: "24", value: "96px", use: "Section vertical padding (desktop)" },
            { space: "--space-32", utility: "32", value: "128px", use: "Hero vertical padding" },
          ].map((row, index) => (
            <div
              key={row.space}
              className={`px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 bg-background text-ink-muted ${
                index > 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="text-foreground sm:w-28 shrink-0">{row.space}</span>
              <span className="text-lime sm:w-8 shrink-0">{row.utility}</span>
              <span className="sm:w-12 shrink-0">{row.value}</span>
              <span className="font-sans">{row.use}</span>
            </div>
          ))}
        </div>
      </section>

    </DocsPage>
  );
}
