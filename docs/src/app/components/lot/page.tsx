"use client";

import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  LOT_DEMO_ITEMS,
  LOT_DEMO_ROLL,
  LotBadge,
  LotCard,
  LotGrid,
  LotIdentity,
  LotLevyBadge,
  LotList,
  LotMeta,
  LotProxyBadge,
  LotRollHeader,
} from "@/components/ui/lot";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/lot/registry.json`;

const LIST_CODE = `import { LotCard, LotList, LotRollHeader } from "@/components/ui/lot"

<LotList
  header={
    <LotRollHeader
      totalLots={lots.length}
      paidCount={paid}
      dueCount={due}
      overdueCount={overdue}
    />
  }
>
  {lots.map((lot) => (
    <LotCard
      key={lot.id}
      lot={lot}
      layout="list"
      showLevyStatus
      showChevron
      href={\`/schemes/\${schemeId}/lots/\${lot.id}\`}
    />
  ))}
</LotList>`;

const WIDE_CODE = `import { LotCard, LotList } from "@/components/ui/lot"

<LotList showWideHeader>
  {lots.map((lot) => (
    <LotCard
      key={lot.id}
      lot={lot}
      layout="wide"
      showLevyStatus
      showProxyStatus
      showChevron
      href="#"
    />
  ))}
</LotList>`;

const LOT_SUMMARY_FIELDS = [
  { name: "id", type: "string", description: "Stable identifier for routing and API calls." },
  { name: "number", type: "string | number", description: 'Lot number, e.g. 12 or "Lot 12". Normalised by formatLotNumber.' },
  { name: "unit", type: "string", description: "Unit label when different from lot number, e.g. Unit 4B." },
  { name: "address", type: "string", description: "Unit address within the building." },
  { name: "entitlement", type: "number", description: "Unit entitlement for levy calculations." },
  { name: "ownerName", type: "string", description: "Registered owner display name." },
  { name: "tenantName", type: "string", description: "Current tenant when tenanted." },
  { name: "levyStatus", type: "LotLevyStatus", description: "paid | due | overdue | not_assessed." },
  { name: "occupancy", type: "LotOccupancy", description: "owner_occupied | tenanted | vacant." },
  { name: "proxyEligible", type: "boolean", description: "Whether the lot may lodge an AGM proxy." },
  { name: "schemePlan", type: "string", description: "Parent scheme plan for cross-scheme lists." },
];

const CARD_PROPS = [
  { name: "lot", type: "LotSummary", description: "Lot data object." },
  { name: "layout", type: '"list" | "card" | "compact" | "wide"', default: '"list"', description: "list = roll row. card = tile. compact = picker row. wide = table row." },
  { name: "href", type: "string", description: "When set, renders the card as a link." },
  { name: "showChevron", type: "boolean", default: "false", description: "Trailing chevron for navigable rows." },
  { name: "showLevyStatus", type: "boolean", default: "false", description: "Shows the levy status badge." },
  { name: "showProxyStatus", type: "boolean", default: "false", description: "Shows proxy eligibility (wide and card layouts)." },
  { name: "showScheme", type: "boolean", default: "false", description: "Shows parent scheme plan in list layout." },
  { name: "selected", type: "boolean", default: "false", description: "Highlights the row with lime-soft background." },
  { name: "actions", type: "ReactNode", description: "Custom trailing actions." },
];

/**
 * Lot component documentation for strata roll entries.
 */
export default function LotPage() {
  const paidCount = LOT_DEMO_ROLL.filter((l) => l.levyStatus === "paid").length;
  const dueCount = LOT_DEMO_ROLL.filter((l) => l.levyStatus === "due").length;
  const overdueCount = LOT_DEMO_ROLL.filter((l) => l.levyStatus === "overdue").length;

  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Application
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Lot</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          Strata lot identity primitives for Instant Strata. A lot is an entry on the
          strata roll within a scheme: it has a number, unit entitlement, registered
          owner, levy status, and proxy eligibility. Use these elements on owner rolls,
          levy notices, AGM proxy validation, and complaint registers.
        </p>
      </div>

      {/* Design rationale */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Design rationale
        </h2>
        <div className="max-w-3xl space-y-4 text-sm text-ink-muted leading-relaxed">
          <p>
            Lots are the atomic unit of strata operations. Levy calculations, proxy
            validation, breach notices, and maintenance requests all resolve to a lot
            number. The <code className="font-mono text-xs text-ink">LotSummary</code> type
            is the shared contract, nested under a scheme via{" "}
            <code className="font-mono text-xs text-ink">schemePlan</code> when shown in
            cross-scheme views.
          </p>
          <p>
            <code className="font-mono text-xs text-ink">LotBadge</code> is the canonical
            compact identifier. Use it inline in correspondence, AI entity tags, and table
            cells. Full rows use <code className="font-mono text-xs text-ink">LotCard</code> with
            the layout that matches the container width, matching the Document and Scheme
            patterns.
          </p>
        </div>
      </section>

      {/* Primitives */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Primitives
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Compose these in custom layouts, levy notices, and inline references.
        </p>

        <ComponentPreview label="LotBadge, LotLevyBadge, LotProxyBadge, LotIdentity">
          <div className="flex flex-col gap-6 w-full max-w-lg py-2">
            <div className="flex flex-wrap items-center gap-2">
              <LotBadge number={12} size="sm" />
              <LotBadge number={14} />
              <LotBadge number={22} size="lg" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <LotLevyBadge status="paid" />
              <LotLevyBadge status="due" />
              <LotLevyBadge status="overdue" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <LotProxyBadge eligible />
              <LotProxyBadge eligible={false} />
            </div>
            <LotIdentity lot={LOT_DEMO_ITEMS[0]} />
            <LotMeta lot={LOT_DEMO_ITEMS[1]} showOccupant showUnitIcon />
          </div>
        </ComponentPreview>
      </section>

      {/* List layout */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          List layout
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Default strata roll row. Pair with{" "}
          <code className="font-mono text-xs text-ink">LotRollHeader</code> for summary counts.
        </p>

        <ComponentPreview label="LotList with roll header">
          <LotList
            className="w-full max-w-xl"
            header={
              <LotRollHeader
                totalLots={LOT_DEMO_ROLL.length}
                paidCount={paidCount}
                dueCount={dueCount}
                overdueCount={overdueCount}
              />
            }
          >
            {LOT_DEMO_ROLL.map((lot) => (
              <LotCard
                key={lot.id}
                lot={lot}
                layout="list"
                showLevyStatus
                showChevron
                href="#"
              />
            ))}
          </LotList>
        </ComponentPreview>

        <div className="mt-6">
          <CodeBlock code={LIST_CODE} />
        </div>
      </section>

      {/* Wide layout */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Wide layout
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Full strata roll table with entitlement, levy, and proxy columns. Used for AGM
          proxy validation and committee review.
        </p>

        <ComponentPreview label="LotList with wide rows">
          <LotList showWideHeader className="w-full">
            {LOT_DEMO_ROLL.map((lot) => (
              <LotCard
                key={lot.id}
                lot={lot}
                layout="wide"
                showLevyStatus
                showProxyStatus
                showChevron
                href="#"
              />
            ))}
          </LotList>
        </ComponentPreview>

        <div className="mt-6">
          <CodeBlock code={WIDE_CODE} />
        </div>
      </section>

      {/* Card + compact */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Card and compact layouts
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Card tiles for lot pickers (e.g. maintenance requests). Compact rows for
          dropdowns and search results.
        </p>

        <div className="space-y-8">
          <ComponentPreview label="LotGrid with card tiles">
            <LotGrid columns={2} className="w-full max-w-2xl">
              {LOT_DEMO_ROLL.slice(0, 2).map((lot) => (
                <LotCard
                  key={lot.id}
                  lot={lot}
                  layout="card"
                  showLevyStatus
                  showProxyStatus
                  showChevron
                  href="#"
                />
              ))}
            </LotGrid>
          </ComponentPreview>

          <ComponentPreview label="Compact rows for pickers">
            <div className="w-full max-w-sm rounded-sm border border-border bg-white divide-y divide-border">
              {LOT_DEMO_ROLL.slice(0, 4).map((lot) => (
                <LotCard
                  key={lot.id}
                  lot={lot}
                  layout="compact"
                  showLevyStatus
                  showChevron
                  href="#"
                />
              ))}
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* Cross-scheme list */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Cross-scheme lists
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          When listing lots across a portfolio, pass{" "}
          <code className="font-mono text-xs text-ink">showScheme</code> to surface the
          parent plan number.
        </p>

        <ComponentPreview label="Lots from multiple schemes">
          <LotList className="w-full max-w-xl">
            {LOT_DEMO_ITEMS.map((lot) => (
              <LotCard
                key={lot.id}
                lot={lot}
                layout="list"
                showLevyStatus
                showScheme
                showChevron
                href="#"
              />
            ))}
          </LotList>
        </ComponentPreview>
      </section>

      {/* Related */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Related patterns
        </h2>
        <div className="max-w-3xl space-y-4 text-sm text-ink-muted leading-relaxed">
          <p>
            <strong className="font-semibold text-ink">Scheme context</strong>: show{" "}
            <code className="font-mono text-xs text-ink">SchemeContextBar</code> above
            lot roll pages. Use <code className="font-mono text-xs text-ink">LotRollHeader</code> for
            roll-specific counts beneath it.
          </p>
          <p>
            <strong className="font-semibold text-ink">Owner directory</strong>: use the{" "}
            <a href="/components/owner" className="text-forest underline underline-offset-2">
              Owner component
            </a>{" "}
            for proprietor-centric views with contact details and portal status.
          </p>
          <p>
            <strong className="font-semibold text-ink">Inline references</strong>: use{" "}
            <code className="font-mono text-xs text-ink">LotBadge</code> in correspondence
            and AI drafts where a full card is too heavy.
          </p>
        </div>
      </section>

      {/* Install */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Install
        </h2>
        <CodeBlock code={INSTALL} />
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Reference
        </h2>

        <h3 className="text-sm font-semibold text-ink mb-3">LotSummary</h3>
        <div className="mb-8">
          <PropTable props={LOT_SUMMARY_FIELDS} />
        </div>

        <h3 className="text-sm font-semibold text-ink mb-3">LotCard</h3>
        <PropTable props={CARD_PROPS} />
      </section>
    </DocsPage>
  );
}
