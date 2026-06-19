import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { Input } from "@/components/ui/input";
import { Notification } from "@/components/ui/notification";
import { Widget, WidgetContent, WidgetHeader, WidgetTitle } from "@/components/ui/widget";
import { Inbox } from "lucide-react";

/* ─── Token data ──────────────────────────────────────── */

const PRODUCT_RADIUS = [
  {
    name: "radius-xs",
    utility: "rounded-xs",
    value: "2px",
    use: "Badges, tags, status pills, mention chips, identifier labels.",
  },
  {
    name: "radius-sm",
    utility: "rounded-sm",
    value: "4px",
    use: "Buttons, inputs, notifications, widgets, dialogs, popovers, logo mark. Default for product UI.",
  },
  {
    name: "radius-md",
    utility: "rounded-md",
    value: "8px",
    use: "Dropdown items, sidebar menu buttons, inner marketing visuals, photo containers.",
  },
] as const;

const MARKETING_RADIUS = [
  {
    name: "radius-lg",
    utility: "rounded-lg",
    value: "12px",
    use: "Marketing cards, infographic shells, bento inner cells, accent panels.",
  },
  {
    name: "radius-xl",
    utility: "rounded-xl",
    value: "16px",
    use: "Story grid tiles, wide blog cards, marketing visual frames, testimonial photo blocks.",
  },
  {
    name: "radius-2xl",
    utility: "rounded-2xl",
    value: "24px",
    use: "Hero headline blocks, page header visuals, large expressive typography bands.",
  },
  {
    name: "radius-expressive",
    utility: "rounded-[28px]",
    value: "28px",
    use: "Bento outer wrapper, feature-split seam, hero corner fillers. Marketing only.",
  },
] as const;

const PRODUCT_USAGE = [
  {
    label: "Tags & badges",
    token: "rounded-xs · 2px",
    examples: ["Badge", "MentionTag", "LotBadge", "SchemePlanBadge"],
  },
  {
    label: "Interactive & surfaces",
    token: "rounded-sm · 4px",
    examples: ["Button", "Input", "Textarea", "Notification", "Widget", "Dialog", "Popover", "Stat"],
  },
  {
    label: "Nested UI chrome",
    token: "rounded-md · 8px",
    examples: ["Dropdown menu items", "Sidebar nav buttons", "System Avatar", "Select items"],
  },
] as const;

const MARKETING_USAGE = [
  {
    label: "Standard cards",
    token: "rounded-lg · 12px",
    examples: ["Card (base)", "BlogCard", "FeatureCard", "Infographic shell"],
  },
  {
    label: "Wide & editorial",
    token: "rounded-xl · 16px",
    examples: ["StoryGrid tile", "BlogCardWide", "MarketingSection visual", "Testimonial photo"],
  },
  {
    label: "Hero & headers",
    token: "rounded-2xl · 24px",
    examples: ["Hero headline band", "HeroVisual", "PageHeader visual"],
  },
  {
    label: "Layout seams",
    token: "28px",
    examples: ["BentoGrid outer", "FeatureSplit wrapper", "Hero corner curves"],
  },
] as const;

interface RadiusChipProps {
  label: string;
  utility: string;
  value: string;
}

/**
 * Renders a small swatch showing a radius token on a card corner.
 */
function RadiusChip({ label, utility, value }: RadiusChipProps) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`size-14 shrink-0 border-2 border-forest bg-lime-soft ${utility}`}
        aria-hidden
      />
      <div>
        <p className="font-sans text-sm font-semibold text-foreground">{label}</p>
        <p className="font-mono text-xs text-ink-muted">
          {utility} · {value}
        </p>
      </div>
    </div>
  );
}

interface TokenRowProps {
  name: string;
  utility: string;
  value: string;
  use: string;
}

/**
 * Renders a single radius token row in the reference table.
 */
function TokenRow({ name, utility, value, use }: TokenRowProps) {
  return (
    <div className="px-6 py-4 bg-background flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
      <div className="shrink-0 sm:w-44">
        <code className="font-mono text-xs text-foreground">{name}</code>
        <p className="font-mono text-[11px] text-lime mt-0.5">{utility}</p>
      </div>
      <span className="font-mono text-xs text-ink-muted shrink-0 w-12">{value}</span>
      <p className="font-sans text-sm text-ink-muted leading-relaxed">{use}</p>
    </div>
  );
}

/**
 * Foundation documentation for the Instant Strata border radius system.
 */
export default function RadiusPage() {
  return (
    <DocsPage className="space-y-20">

      {/* ── Page header ───────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Radius
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Radius values control the rounded corners on components and content blocks.
          Product UI stays rectangular: small radii keep dense tools precise and professional.
          Marketing surfaces use larger tokens so hero and editorial layouts feel expressive
          without breaking the brand&apos;s sharp geometry.
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
            "Use semantic tokens from the scale. Do not hard-code arbitrary pixel values in product UI.",
            "Product UI defaults to rounded-sm (4px). Use rounded-xs (2px) only for tags, badges, and compact labels.",
            "Marketing-only components may use rounded-lg and above. Do not carry those values into the app shell.",
            "border-radius: 9999px (pill) is reserved for OwnerAvatar and decorative play buttons. System avatars use rounded-md (8px).",
            "The logo mark always uses 4px (rounded-sm), regardless of context.",
            "Pair larger radii with generous padding so content inside has room to breathe.",
          ].map((rule) => (
            <li key={rule} className="flex gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <span className="text-lime shrink-0 mt-0.5" aria-hidden="true">-</span>
              {rule}
            </li>
          ))}
        </ul>
      </section>

      {/* ══════════════════════════════════════════════
          PRODUCT SCALE
      ══════════════════════════════════════════════ */}
      <section id="product-scale">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Product Scale
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          App and dashboard surfaces. Most elements use{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            rounded-sm
          </code>
          . Tags and badges step down to{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            rounded-xs
          </code>
          .
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border mb-10">
          {PRODUCT_RADIUS.map((row) => (
            <TokenRow key={row.name} {...row} />
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mb-10">
          {PRODUCT_RADIUS.map((row) => (
            <div key={row.name} className="rounded-sm border border-border p-5 bg-background">
              <RadiusChip label={row.name} utility={row.utility} value={row.value} />
            </div>
          ))}
        </div>

        <ComponentPreview label="Product UI examples">
          <div className="w-full max-w-[640px] space-y-6 py-2">
            {/* Tags: xs */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="accent">Active</Badge>
              <Badge variant="mono" size="sm">SP 1042</Badge>
              <Badge variant="warning">Awaiting review</Badge>
              <p className="font-sans text-xs text-ink-muted">Badges · rounded-xs (2px)</p>
            </div>

            {/* Interactive: sm */}
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="accent">Try for free</Button>
              <Input className="max-w-[180px]" placeholder="Search schemes" readOnly />
              <p className="font-sans text-xs text-ink-muted w-full">Buttons &amp; inputs · rounded-sm (4px)</p>
            </div>

            {/* Surfaces: sm */}
            <Notification type="info" title="Portal update available">
              Notifications and widgets share the same 4px corner radius.
            </Notification>

            <Widget className="max-w-sm">
              <WidgetHeader divided>
                <WidgetTitle icon={Inbox} count={3}>Needs attention</WidgetTitle>
              </WidgetHeader>
              <WidgetContent>
                <p className="text-sm text-ink-muted">Widget shell · rounded-sm (4px)</p>
              </WidgetContent>
            </Widget>
          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          MARKETING SCALE
      ══════════════════════════════════════════════ */}
      <section id="marketing-scale">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Marketing Scale
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Website and landing page components step up through four larger tokens.
          Inner cells (bento tiles, nested screenshots) stay at{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            rounded-lg
          </code>{" "}
          or below; outer wrappers and hero typography use{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            rounded-xl
          </code>{" "}
          and above.
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border mb-10">
          {MARKETING_RADIUS.map((row) => (
            <TokenRow key={row.name} {...row} />
          ))}
        </div>

        <ComponentPreview label="Marketing radius progression">
          <div className="w-full grid gap-4 sm:grid-cols-2 py-2">
            {/* lg: standard card */}
            <Card tone="bordered" className="rounded-lg">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
                rounded-lg · 12px
              </p>
              <p className="font-sans text-sm text-ink-muted">Standard marketing card, infographic shell.</p>
            </Card>

            {/* xl: wide tile */}
            <div className="rounded-xl bg-lime-soft p-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
                rounded-xl · 16px
              </p>
              <p className="font-sans text-sm text-ink-muted">Story grid tiles, wide blog cards, visual frames.</p>
            </div>

            {/* 2xl: hero band */}
            <div className="rounded-2xl bg-lime px-6 py-5 sm:col-span-2">
              <p className="font-display text-2xl text-forest leading-tight">
                Strata management, simplified.
              </p>
              <p className="font-sans text-xs text-forest/70 mt-2">Hero headline band · rounded-2xl (24px)</p>
            </div>

            {/* expressive: bento outer */}
            <div
              className="bg-off-white p-3 sm:col-span-2"
              style={{ borderRadius: "var(--radius-expressive)" }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white p-4 min-h-[80px]">
                  <p className="text-xs text-ink-muted">Inner cell · rounded-lg</p>
                </div>
                <div className="rounded-lg bg-lime-soft p-4 min-h-[80px]">
                  <p className="text-xs text-ink-muted">Inner cell · rounded-lg</p>
                </div>
              </div>
              <p className="font-sans text-xs text-ink-muted mt-3 text-center">
                Bento outer wrapper · 28px (radius-expressive). Gap doubles as outer padding.
              </p>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          BY CONTEXT
      ══════════════════════════════════════════════ */}
      <section id="by-context">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          By Context
        </p>

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Product */}
          <div>
            <h2 className="font-display text-xl text-foreground mb-4">Application</h2>
            <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">
              {PRODUCT_USAGE.map((row) => (
                <div key={row.label} className="px-5 py-4 bg-background">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <p className="font-sans text-sm font-semibold text-foreground">{row.label}</p>
                    <code className="font-mono text-[11px] text-lime shrink-0">{row.token}</code>
                  </div>
                  <p className="font-sans text-xs text-ink-muted">
                    {row.examples.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing */}
          <div>
            <h2 className="font-display text-xl text-foreground mb-4">Website</h2>
            <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">
              {MARKETING_USAGE.map((row) => (
                <div key={row.label} className="px-5 py-4 bg-background">
                  <div className="flex items-baseline justify-between gap-4 mb-2">
                    <p className="font-sans text-sm font-semibold text-foreground">{row.label}</p>
                    <code className="font-mono text-[11px] text-lime shrink-0">{row.token}</code>
                  </div>
                  <p className="font-sans text-xs text-ink-muted">
                    {row.examples.join(" · ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PAIRING WITH PADDING
      ══════════════════════════════════════════════ */}
      <section id="pairing">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Pairing with Padding
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Larger radii need more internal padding so content does not feel cramped against
          curved corners. See{" "}
          <a href="/components/padding" className="text-foreground">
            Padding
          </a>{" "}
          for the full token scale.
        </p>

        <div className="rounded-sm border border-border overflow-hidden font-mono text-xs">
          {[
            { radius: "rounded-xs · 2px", padding: "px-1.5 py-0.5 (badges)", context: "Compact labels" },
            { radius: "rounded-sm · 4px", padding: "p-4 to p-6", context: "Product panels, notifications" },
            { radius: "rounded-lg · 12px", padding: "p-6 (24px)", context: "Marketing cards" },
            { radius: "rounded-xl · 16px", padding: "p-6 to p-8", context: "Story grid, wide cards" },
            { radius: "28px outer", padding: "gap as padding (12px default)", context: "Bento grid seam" },
          ].map((row, index) => (
            <div
              key={row.radius}
              className={`px-6 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 bg-background text-ink-muted ${
                index > 0 ? "border-t border-border" : ""
              }`}
            >
              <span className="text-foreground sm:w-40 shrink-0">{row.radius}</span>
              <span className="text-lime sm:w-36 shrink-0">{row.padding}</span>
              <span>{row.context}</span>
            </div>
          ))}
        </div>
      </section>

    </DocsPage>
  );
}
