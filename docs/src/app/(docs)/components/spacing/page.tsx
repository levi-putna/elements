import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/ui/section";
import { WidgetGrid } from "@/components/ui/widget";

/* ─── Foundational scale ──────────────────────────────── */

const FOUNDATIONAL_TOKENS = [
  { name: "size-4", utility: "1", value: "4px", space: "--space-1" },
  { name: "size-8", utility: "2", value: "8px", space: "--space-2" },
  { name: "size-12", utility: "3", value: "12px", space: "--space-3" },
  { name: "size-16", utility: "4", value: "16px", space: "--space-4" },
  { name: "size-24", utility: "6", value: "24px", space: "--space-6" },
  { name: "size-32", utility: "8", value: "32px", space: "--space-8" },
  { name: "size-48", utility: "12", value: "48px", space: "--space-12" },
  { name: "size-64", utility: "16", value: "64px", space: "--space-16" },
  { name: "size-96", utility: "24", value: "96px", space: "--space-24" },
  { name: "size-128", utility: "32", value: "128px", space: "--space-32" },
] as const;

/* ─── Semantic tokens: application ────────────────────── */

const APP_HORIZONTAL = [
  {
    name: "between-inline",
    value: "size-8 · 8px",
    utility: "gap-2",
    use: "Icon to label in buttons, badge icon gaps, compact toolbar items.",
    examples: "Button · Badge · AppShell header actions",
  },
  {
    name: "between-controls",
    value: "size-12 · 12px",
    utility: "gap-3",
    use: "Widget header trailing gap, list row icon to text, sidebar menu items.",
    examples: "WidgetListItem · WidgetHeader · SidebarMenu",
  },
  {
    name: "component-default",
    value: "size-16 · 16px",
    utility: "gap-4",
    use: "Default horizontal gap when no specific token applies. Dashboard widget grid.",
    examples: "WidgetGrid · FieldSet internal · Dialog action row",
  },
  {
    name: "screen-inset",
    value: "size-24 · 24px",
    utility: "px-6",
    use: "App content area horizontal inset, page header padding.",
    examples: "AppShell content · DocumentPage · PageHeader",
  },
] as const;

const APP_VERTICAL = [
  {
    name: "between-text",
    value: "size-8 · 8px",
    utility: "gap-2 · space-y-2",
    use: "Label to hint, title to metadata in compact rows.",
    examples: "Field · WidgetListItem meta · Notification title to body",
  },
  {
    name: "form-fields",
    value: "size-20 · 20px",
    utility: "gap-5",
    use: "Vertical gap between form fields in a set.",
    examples: "FieldGroup · Authentication forms",
  },
  {
    name: "text-to-component",
    value: "size-16 · 16px",
    utility: "gap-4 · mt-4",
    use: "Section label to first control, panel header to content.",
    examples: "FieldSet legend to fields · TaskQueue section header",
  },
  {
    name: "content-to-action",
    value: "size-24 · 24px",
    utility: "gap-6 · mt-6",
    use: "Form body to submit row, widget body to footer link.",
    examples: "Auth form · WidgetContent to WidgetFooter",
  },
  {
    name: "between-panels",
    value: "size-16 · 16px",
    utility: "gap-4",
    use: "Gap between stacked dashboard panels in a grid column.",
    examples: "WidgetGrid rows · Inbox section groups",
  },
] as const;

/* ─── Semantic tokens: website ────────────────────────── */

const WEBSITE_HORIZONTAL = [
  {
    name: "between-chips",
    value: "size-12 · 12px",
    utility: "gap-3",
    use: "Badge groups, CTA button pairs, inline tag rows.",
    examples: "Hero actions · Pricing tier badges",
  },
  {
    name: "between-cards",
    value: "size-16 · 16px",
    utility: "gap-4",
    use: "Compact card grids: pricing columns, icon feature tiles.",
    examples: "MarketingSection icon grid · FAQ columns (mobile stack)",
  },
  {
    name: "between-columns",
    value: "size-32 · 32px",
    utility: "gap-8 md:gap-10",
    use: "Two-column feature layouts, footer link columns at md+.",
    examples: "FeatureSplit · Footer grid · MarketingSection split",
  },
  {
    name: "screen-mobile",
    value: "size-24 · 24px",
    utility: "px-6",
    use: "Site horizontal gutter on mobile. Managed by Container.",
    examples: "Section · SiteHeader · Hero · Footer",
  },
  {
    name: "screen-desktop",
    value: "size-48 · 48px",
    utility: "md:px-12",
    use: "Site horizontal gutter from tablet breakpoint up.",
    examples: "Container · SiteHeader md:px-10",
  },
] as const;

const WEBSITE_VERTICAL = [
  {
    name: "eyebrow-to-heading",
    value: "size-12 · 12px",
    utility: "mb-3",
    use: "Eyebrow label to Young Serif heading. Built into section patterns.",
    examples: "MarketingSection · Card · Bento · Hero",
  },
  {
    name: "heading-to-body",
    value: "size-16 · 16px",
    utility: "mb-4 · mb-5",
    use: "Display or H2 heading to body copy.",
    examples: "MarketingHeading · FeatureSplit · PageHeader",
  },
  {
    name: "between-text",
    value: "size-8 · 8px",
    utility: "space-y-2",
    use: "Paragraph spacing within a text block. Prefer type line-height first.",
    examples: "Body copy · Footer link lists · Testimonial attribution",
  },
  {
    name: "text-to-component",
    value: "size-24 · 24px",
    utility: "mt-6 · gap-6",
    use: "Copy block to visual, heading block to card grid.",
    examples: "MarketingSection header to grid · Bento intro to grid",
  },
  {
    name: "content-to-button",
    value: "size-32 · 32px",
    utility: "mt-8 · gap-8",
    use: "Body copy or form to primary CTA when not in a sticky footer.",
    examples: "Hero subtext to actions · CTA band copy to buttons",
  },
  {
    name: "between-sections",
    value: "size-96 · 96px",
    utility: "py-24 md:py-32",
    use: "Vertical rhythm between full-bleed page sections. Section spacing prop.",
    examples: "Section spacing=lg · Feature row gap (96px)",
  },
  {
    name: "between-feature-rows",
    value: "size-96 · 96px",
    utility: "gap-24 · py-24",
    use: "Alternating feature rows on landing pages.",
    examples: "FeatureSplit stack · MarketingSection blocks",
  },
] as const;

interface SpacingBlockProps {
  /** Tailwind gap utility class. */
  gapClass: string;
  /** Label shown below the preview. */
  label: string;
  /** Number of blocks to render. */
  count?: number;
}

/**
 * Renders a row of blocks with a visible gap for spacing demonstrations.
 */
function SpacingBlockRow({ gapClass, label, count = 4 }: SpacingBlockProps) {
  return (
    <div>
      <div className={`flex ${gapClass}`}>
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className="h-10 flex-1 rounded-sm bg-lime-soft border border-border"
            aria-hidden
          />
        ))}
      </div>
      <p className="font-mono text-[11px] text-ink-muted mt-2">{label}</p>
    </div>
  );
}

interface SpacingBlockStackProps {
  /** Tailwind gap utility class. */
  gapClass: string;
  label: string;
}

/**
 * Renders stacked blocks with a visible vertical gap.
 */
function SpacingBlockStack({ gapClass, label }: SpacingBlockStackProps) {
  return (
    <div>
      <div className={`flex flex-col ${gapClass}`}>
        <div className="h-8 rounded-sm bg-lime-soft border border-border" aria-hidden />
        <div className="h-14 rounded-sm bg-off-white border border-border" aria-hidden />
        <div className="h-8 rounded-sm bg-lime-soft border border-border" aria-hidden />
      </div>
      <p className="font-mono text-[11px] text-ink-muted mt-2">{label}</p>
    </div>
  );
}

interface SemanticRowProps {
  name: string;
  value: string;
  utility: string;
  use: string;
  examples: string;
}

/**
 * Renders one semantic spacing token row.
 */
function SemanticRow({ name, value, utility, use, examples }: SemanticRowProps) {
  return (
    <div className="px-6 py-4 bg-background">
      <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 mb-2">
        <code className="font-mono text-xs text-foreground shrink-0 sm:w-44">{name}</code>
        <span className="font-mono text-xs text-lime shrink-0 sm:w-36">{value}</span>
        <code className="font-mono text-[11px] text-ink-muted shrink-0 sm:w-28">{utility}</code>
      </div>
      <p className="font-sans text-sm text-ink-muted leading-relaxed mb-1">{use}</p>
      <p className="font-sans text-xs text-ink-muted/80">{examples}</p>
    </div>
  );
}

interface SemanticTableProps {
  title: string;
  description: string;
  rows: ReadonlyArray<SemanticRowProps>;
}

/**
 * Renders a semantic token table with header.
 */
function SemanticTable({ title, description, rows }: SemanticTableProps) {
  return (
    <div className="rounded-sm border border-border overflow-hidden">
      <div className="px-6 py-4 bg-secondary border-b border-border">
        <h3 className="font-display text-lg text-foreground mb-1">{title}</h3>
        <p className="font-sans text-sm text-ink-muted leading-relaxed">{description}</p>
      </div>
      <div className="divide-y divide-border">
        {rows.map((row) => (
          <SemanticRow key={row.name} {...row} />
        ))}
      </div>
    </div>
  );
}

/**
 * Foundation documentation for the Instant Strata spacing system.
 */
export default function SpacingPage() {
  return (
    <DocsPage className="space-y-20">

      {/* ── Page header ───────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Spacing
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Spacing tokens separate elements inside components and layout blocks,
          horizontally and vertically. The 4px grid keeps product UI consistent;
          marketing layouts use the same scale at larger steps. For internal inset,
          see{" "}
          <a href="/components/padding" className="text-foreground">
            Padding
          </a>
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
            "Use semantic tokens in components. Map to foundational size-N values, not arbitrary pixels.",
            "Application spacing stays tight: component-default (16px) is the usual fallback.",
            "Website spacing breathes more: scale up between sections, columns, and CTAs.",
            "Horizontal and vertical tokens are named separately. Do not reuse a vertical value for horizontal layout.",
            "Section gutters come from Container. Do not stack duplicate horizontal inset on children.",
            "When in doubt, add vertical space on marketing pages, not less.",
          ].map((rule) => (
            <li key={rule} className="flex gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <span className="text-lime shrink-0 mt-0.5" aria-hidden="true">-</span>
              {rule}
            </li>
          ))}
        </ul>
      </section>

      {/* ══════════════════════════════════════════════
          FOUNDATIONAL TOKENS
      ══════════════════════════════════════════════ */}
      <section id="foundational">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Foundational Tokens
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          All spacing builds on a 4px grid. Foundational tokens (size-N) are the base
          layer. Semantic tokens below reference these values so you do not need to
          remember that component-default is size-16.
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border mb-10">
          {FOUNDATIONAL_TOKENS.map((row) => (
            <div
              key={row.name}
              className="px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 bg-background"
            >
              <code className="font-mono text-xs text-foreground sm:w-24 shrink-0">{row.name}</code>
              <span className="font-mono text-xs text-lime sm:w-16 shrink-0">{row.value}</span>
              <code className="font-mono text-[11px] text-ink-muted sm:w-20 shrink-0">{row.utility}</code>
              <code className="font-mono text-[11px] text-ink-muted/70">{row.space}</code>
            </div>
          ))}
        </div>

        <ComponentPreview label="Foundational scale visualised">
          <div className="w-full grid gap-6 sm:grid-cols-2 py-2">
            <SpacingBlockRow gapClass="gap-1" label="size-4 · gap-1 · 4px" count={5} />
            <SpacingBlockRow gapClass="gap-2" label="size-8 · gap-2 · 8px" count={4} />
            <SpacingBlockRow gapClass="gap-4" label="size-16 · gap-4 · 16px" count={3} />
            <SpacingBlockRow gapClass="gap-6" label="size-24 · gap-6 · 24px" count={3} />
            <SpacingBlockRow gapClass="gap-8" label="size-32 · gap-8 · 32px" count={3} />
            <SpacingBlockRow gapClass="gap-12" label="size-48 · gap-12 · 48px" count={2} />
          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          APPLICATION
      ══════════════════════════════════════════════ */}
      <section id="application">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Application
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-2xl">
          Dashboard and product UI spacing. Dense by default: 16px component gaps,
          24px content insets. Form fields and panel stacks use the vertical tokens below.
        </p>

        <div className="space-y-8 mb-10">
          <SemanticTable
            title="Horizontal"
            description="Elements placed next to each other: toolbars, grid columns, inline controls."
            rows={APP_HORIZONTAL}
          />
          <SemanticTable
            title="Vertical"
            description="Stacked elements within a panel, form, or page region."
            rows={APP_VERTICAL}
          />
        </div>

        <ComponentPreview label="Application · form field stack (gap-5)">
          <div className="w-full max-w-sm py-2">
            <FieldSet>
              <FieldLegend>Scheme details</FieldLegend>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="spacing-scheme-name">Scheme name</FieldLabel>
                  <Input id="spacing-scheme-name" defaultValue="Harbour View" readOnly />
                </Field>
                <Field>
                  <FieldLabel htmlFor="spacing-plan">Strata plan</FieldLabel>
                  <Input id="spacing-plan" defaultValue="SP 1042" readOnly />
                </Field>
              </FieldGroup>
            </FieldSet>
            <p className="font-sans text-xs text-ink-muted mt-3">
              FieldGroup uses gap-5 (20px) between fields. Field label to input uses gap-1.5 (6px).
            </p>
          </div>
        </ComponentPreview>

        <div className="mt-6">
          <ComponentPreview label="Application · widget grid (gap-4)">
            <div className="w-full py-2">
              <WidgetGrid columns={2} className="max-w-2xl">
                <Card tone="bordered" className="rounded-sm p-4">
                  <p className="text-sm font-semibold text-ink mb-1">Open items</p>
                  <p className="text-2xl font-display text-forest">12</p>
                </Card>
                <Card tone="bordered" className="rounded-sm p-4">
                  <p className="text-sm font-semibold text-ink mb-1">Overdue</p>
                  <p className="text-2xl font-display text-danger">3</p>
                </Card>
              </WidgetGrid>
              <p className="font-sans text-xs text-ink-muted mt-3">
                WidgetGrid uses gap-4 (16px) between panels. component-default horizontal token.
              </p>
            </div>
          </ComponentPreview>
        </div>

        <div className="mt-6">
          <ComponentPreview label="Application · vertical stack (gap-2 / gap-6)">
            <div className="w-full max-w-sm py-2">
              <SpacingBlockStack gapClass="gap-2" label="between-text · gap-2 · 8px" />
              <div className="mt-6">
                <SpacingBlockStack gapClass="gap-6" label="content-to-action · gap-6 · 24px" />
              </div>
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WEBSITE
      ══════════════════════════════════════════════ */}
      <section id="website">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Website
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-2xl">
          Marketing and landing page spacing. Larger gaps between columns and sections.
          Eyebrow-to-heading and heading-to-body rhythms are consistent across every section type.
        </p>

        <div className="space-y-8 mb-10">
          <SemanticTable
            title="Horizontal"
            description="Site gutter, card grids, two-column feature layouts, footer columns."
            rows={WEBSITE_HORIZONTAL}
          />
          <SemanticTable
            title="Vertical"
            description="Section rhythm, typography stacks, copy to CTA, feature row separation."
            rows={WEBSITE_VERTICAL}
          />
        </div>

        <ComponentPreview label="Website · eyebrow + heading stack">
          <div className="w-full max-w-lg py-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
              For strata managers
            </p>
            <h2 className="font-display text-3xl text-foreground leading-tight mb-4">
              Everything in one place
            </h2>
            <p className="font-sans text-base text-ink-muted leading-relaxed max-w-prose">
              Body copy follows the heading with mb-4 (16px). Eyebrow uses mb-3 (12px).
            </p>
          </div>
        </ComponentPreview>

        <div className="mt-6">
          <ComponentPreview label="Website · card grid (gap-4 / gap-8)">
            <div className="w-full py-2">
              <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mb-6">
                {["Levies", "Compliance", "Correspondence"].map((title) => (
                  <div key={title} className="rounded-lg border border-border bg-white p-5">
                    <p className="text-sm font-semibold text-ink">{title}</p>
                    <p className="text-xs text-ink-muted mt-1">Feature tile</p>
                  </div>
                ))}
              </div>
              <SpacingBlockRow gapClass="gap-8" label="between-columns · gap-8 · 32px" count={2} />
            </div>
          </ComponentPreview>
        </div>

        <div className="mt-6">
          <ComponentPreview label="Website · section vertical rhythm">
            <div className="w-full py-2 space-y-2">
              <Section type="secondary" spacing="sm" contained className="rounded-sm overflow-hidden">
                <p className="text-sm text-ink-muted">Section spacing=sm · py-12 md:py-16</p>
              </Section>
              <Section type="default" spacing="lg" contained className="rounded-sm overflow-hidden border border-border">
                <p className="text-sm text-ink-muted">Section spacing=lg · py-24 md:py-32 (between-sections)</p>
              </Section>
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          QUICK REFERENCE
      ══════════════════════════════════════════════ */}
      <section id="reference">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Quick Reference
        </p>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-sm border border-border overflow-hidden">
            <div className="px-6 py-3 bg-forest text-white">
              <p className="font-sans text-sm font-semibold">Application defaults</p>
            </div>
            <div className="divide-y divide-border font-mono text-xs">
              {[
                ["Inline icon + label", "gap-2", "8px"],
                ["Widget grid", "gap-4", "16px"],
                ["Form fields", "gap-5", "20px"],
                ["Content to action", "gap-6", "24px"],
                ["Content inset", "px-6", "24px"],
              ].map(([label, util, px]) => (
                <div key={label} className="px-6 py-3 flex justify-between bg-background text-ink-muted">
                  <span className="font-sans">{label}</span>
                  <span>
                    <span className="text-lime">{util}</span>
                    <span className="ml-3 opacity-60">{px}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-sm border border-border overflow-hidden">
            <div className="px-6 py-3 bg-lime-soft">
              <p className="font-sans text-sm font-semibold text-forest">Website defaults</p>
            </div>
            <div className="divide-y divide-border font-mono text-xs">
              {[
                ["Eyebrow to heading", "mb-3", "12px"],
                ["Heading to body", "mb-4", "16px"],
                ["Card grid", "gap-4", "16px"],
                ["Two-column split", "gap-8 md:gap-12", "32–48px"],
                ["Section vertical (lg)", "py-24 md:py-32", "96–128px"],
                ["Feature row gap", "96px", "96px"],
              ].map(([label, util, px]) => (
                <div key={label} className="px-6 py-3 flex justify-between bg-background text-ink-muted">
                  <span className="font-sans">{label}</span>
                  <span>
                    <span className="text-lime">{util}</span>
                    <span className="ml-3 opacity-60">{px}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </DocsPage>
  );
}
