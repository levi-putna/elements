"use client";

import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { LotLevyBadge } from "@/components/ui/lot";
import {
  OWNER_DEMO_DIRECTORY,
  OWNER_DEMO_ITEMS,
  OwnerAvatar,
  OwnerCard,
  OwnerCommitteeBadge,
  OwnerContactMeta,
  OwnerCorrespondenceBadge,
  OwnerGrid,
  OwnerIdentity,
  OwnerList,
  OwnerLotChips,
  OwnerPortalBadge,
  OwnerRollHeader,
  OwnerRollRow,
  OwnerTypeBadge,
} from "@/components/ui/owner";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/owner/registry.json`;

const ROLL_CODE = `import { OwnerList, OwnerRollHeader, OwnerRollRow } from "@/components/ui/owner"

<OwnerList
  header={
    <OwnerRollHeader
      totalOwners={owners.length}
      portalActiveCount={portalActive}
      invitedCount={invited}
      committeeCount={committee}
    />
  }
>
  {owners.map((owner) => (
    <OwnerRollRow
      key={owner.id}
      owner={owner}
      showLevyStatus
      showChevron
      href={\`/schemes/\${schemeId}/owners/\${owner.id}\`}
    />
  ))}
</OwnerList>`;

const WIDE_CODE = `import { OwnerList, OwnerRollRow } from "@/components/ui/owner"

<OwnerList showWideHeader>
  {owners.map((owner) => (
    <OwnerRollRow
      key={owner.id}
      owner={owner}
      layout="wide"
      showLevyStatus
      showPortalStatus
      showCorrespondence
      showChevron
      href="#"
    />
  ))}
</OwnerList>`;

const OWNER_SUMMARY_FIELDS = [
  { name: "id", type: "string", description: "Stable identifier for routing and API calls." },
  { name: "name", type: "string", description: "Display name of the registered proprietor." },
  { name: "type", type: "OwnerType", description: "individual | company | joint." },
  { name: "email", type: "string", description: "Primary email for notices and portal." },
  { name: "phone", type: "string", description: "Contact phone number." },
  { name: "lots", type: "OwnerLotRef[]", description: "Lots owned by this proprietor." },
  { name: "levyStatus", type: "LotLevyStatus", description: "Worst-case or primary lot levy status." },
  { name: "portalStatus", type: "OwnerPortalStatus", description: "active | invited | not_registered." },
  { name: "correspondence", type: "OwnerCorrespondenceMethod", description: "email | post | portal." },
  { name: "isCommitteeMember", type: "boolean", description: "Whether the owner serves on committee." },
  { name: "schemePlan", type: "string", description: "Parent scheme plan for cross-scheme directories." },
];

const ROLL_ROW_PROPS = [
  { name: "owner", type: "OwnerSummary", description: "Owner data object." },
  { name: "layout", type: '"list" | "wide"', default: '"list"', description: "list = directory row. wide = table row with contact and portal columns." },
  { name: "href", type: "string", description: "When set, renders the row as a link." },
  { name: "showChevron", type: "boolean", default: "false", description: "Trailing chevron for navigable rows." },
  { name: "showLevyStatus", type: "boolean", default: "false", description: "Shows the levy status badge." },
  { name: "showPortalStatus", type: "boolean", default: "false", description: "Shows portal registration badge (wide layout)." },
  { name: "showCorrespondence", type: "boolean", default: "false", description: "Shows correspondence preference (wide layout)." },
  { name: "showScheme", type: "boolean", default: "false", description: "Shows parent scheme plan in list layout." },
  { name: "selected", type: "boolean", default: "false", description: "Highlights the row with lime-soft background." },
  { name: "actions", type: "ReactNode", description: "Custom trailing actions." },
];

const CARD_PROPS = [
  { name: "owner", type: "OwnerSummary", description: "Owner data object." },
  { name: "layout", type: '"card" | "compact"', default: '"card"', description: "card = profile tile. compact = picker row." },
  { name: "showPortalStatus", type: "boolean", default: "false", description: "Shows portal badge on card layout." },
  { name: "showCorrespondence", type: "boolean", default: "false", description: "Shows correspondence badge on card layout." },
];

/**
 * Owner component documentation for registered proprietors on the strata roll.
 */
export default function OwnerPage() {
  const portalActive = OWNER_DEMO_DIRECTORY.filter(
    (o) => o.portalStatus === "active"
  ).length;
  const invited = OWNER_DEMO_DIRECTORY.filter((o) => o.portalStatus === "invited").length;
  const committee = OWNER_DEMO_DIRECTORY.filter((o) => o.isCommitteeMember).length;

  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Application
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Owner</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          Registered proprietor identity primitives for Instant Strata. An owner is a
          person or entity on the strata roll who holds one or more lots, receives levy
          notices, and may access the owner portal. Use these elements for owner
          directories, correspondence, portal admin, and committee views.
        </p>
      </div>

      {/* Design rationale */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Design rationale
        </h2>
        <div className="max-w-3xl space-y-4 text-sm text-ink-muted leading-relaxed">
          <p>
            <code className="font-mono text-xs text-ink">OwnerAvatar</code> renders a{" "}
            <strong className="font-semibold text-ink">round</strong> avatar to distinguish
            proprietors from square system-user avatars (managers, staff). Joint names
            like &quot;James &amp; Sarah Chen&quot; initialise as{" "}
            <code className="font-mono text-xs text-ink">JC</code>, never{" "}
            <code className="font-mono text-xs text-ink">J&amp;</code>.
          </p>
          <p>
            Lots and owners are related but distinct views.{" "}
            <code className="font-mono text-xs text-ink">LotCard</code> is lot-centric
            (entitlement, proxy, unit address).{" "}
            <code className="font-mono text-xs text-ink">OwnerRollRow</code> is
            owner-centric (contact details, portal status, multiple lot holdings).
            Use the view that matches the task: roll reconciliation by lot, or
            correspondence by owner.
          </p>
          <p>
            Owned lots are always shown via{" "}
            <code className="font-mono text-xs text-ink">OwnerLotChips</code>, which
            composes <code className="font-mono text-xs text-ink">LotBadge</code> for
            consistent lot references across the system.
          </p>
        </div>
      </section>

      {/* Primitives */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Primitives
        </h2>

        <ComponentPreview label="Badges, chips, OwnerAvatar, and OwnerIdentity">
          <div className="flex flex-col gap-6 w-full max-w-lg py-2">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-col items-center gap-1.5">
                <OwnerAvatar name="James & Sarah Chen" size="lg" />
                <span className="text-[10px] font-mono text-ink-muted">JC · joint</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <OwnerAvatar name="Margaret O'Brien" size="lg" />
                <span className="text-[10px] font-mono text-ink-muted">MO · individual</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <OwnerAvatar name="North Shore Investments Pty Ltd" size="lg" />
                <span className="text-[10px] font-mono text-ink-muted">NS · company</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <OwnerTypeBadge type="individual" />
              <OwnerTypeBadge type="company" />
              <OwnerTypeBadge type="joint" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <OwnerPortalBadge status="active" />
              <OwnerPortalBadge status="invited" />
              <OwnerPortalBadge status="not_registered" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <OwnerCorrespondenceBadge method="email" />
              <OwnerCommitteeBadge />
              <LotLevyBadge status="overdue" />
            </div>
            <OwnerLotChips lots={OWNER_DEMO_ITEMS[5].lots} badgeSize="md" />
            <OwnerIdentity owner={OWNER_DEMO_ITEMS[0]} showLots />
            <OwnerContactMeta owner={OWNER_DEMO_ITEMS[1]} showIcons />
          </div>
        </ComponentPreview>
      </section>

      {/* OwnerRollRow list */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          OwnerRollRow (list)
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Default owner directory row. Shows avatar, name, contact, owned lots, and
          optional levy status.
        </p>

        <ComponentPreview label="OwnerList with roll header">
          <OwnerList
            className="w-full max-w-xl"
            header={
              <OwnerRollHeader
                totalOwners={OWNER_DEMO_DIRECTORY.length}
                portalActiveCount={portalActive}
                invitedCount={invited}
                committeeCount={committee}
              />
            }
          >
            {OWNER_DEMO_DIRECTORY.map((owner) => (
              <OwnerRollRow
                key={owner.id}
                owner={owner}
                showLevyStatus
                showChevron
                href="#"
              />
            ))}
          </OwnerList>
        </ComponentPreview>

        <div className="mt-6">
          <CodeBlock code={ROLL_CODE} />
        </div>
      </section>

      {/* OwnerRollRow wide */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          OwnerRollRow (wide)
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Tabular owner directory with contact, levy, and portal columns. Used for
          portal admin and correspondence audits.
        </p>

        <ComponentPreview label="OwnerList with wide rows">
          <OwnerList showWideHeader className="w-full">
            {OWNER_DEMO_DIRECTORY.map((owner) => (
              <OwnerRollRow
                key={owner.id}
                owner={owner}
                layout="wide"
                showLevyStatus
                showPortalStatus
                showCorrespondence
                showChevron
                href="#"
              />
            ))}
          </OwnerList>
        </ComponentPreview>

        <div className="mt-6">
          <CodeBlock code={WIDE_CODE} />
        </div>
      </section>

      {/* OwnerCard */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          OwnerCard
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Profile tiles for owner admin and portal onboarding. Compact layout suits
          search pickers.
        </p>

        <div className="space-y-8">
          <ComponentPreview label="OwnerGrid with profile cards">
            <OwnerGrid columns={2} className="w-full max-w-2xl">
              {OWNER_DEMO_DIRECTORY.slice(0, 2).map((owner) => (
                <OwnerCard
                  key={owner.id}
                  owner={owner}
                  showLevyStatus
                  showPortalStatus
                  showCorrespondence
                  showChevron
                  href="#"
                />
              ))}
            </OwnerGrid>
          </ComponentPreview>

          <ComponentPreview label="Compact picker rows">
            <div className="w-full max-w-sm rounded-sm border border-border bg-white divide-y divide-border">
              {OWNER_DEMO_DIRECTORY.map((owner) => (
                <OwnerCard
                  key={owner.id}
                  owner={owner}
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

      {/* Lot vs owner */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Lot view vs owner view
        </h2>
        <div className="max-w-3xl space-y-4 text-sm text-ink-muted leading-relaxed">
          <p>
            <strong className="font-semibold text-ink">Lot roll</strong>: use{" "}
            <a href="/components/lot" className="text-forest underline underline-offset-2">
              Lot
            </a>{" "}
            when the primary key is the lot number (levy calculation, proxy validation,
            maintenance by unit).
          </p>
          <p>
            <strong className="font-semibold text-ink">Owner directory</strong>: use Owner
            when the primary key is the proprietor (sending notices, portal invites,
            committee communication). Multi-lot owners appear once with{" "}
            <code className="font-mono text-xs text-ink">OwnerLotChips</code>.
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
          Requires the <code className="font-mono text-xs text-ink">avatar</code> and{" "}
          <code className="font-mono text-xs text-ink">lot</code> components.
        </p>
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Reference
        </h2>

        <h3 className="text-sm font-semibold text-ink mb-3">OwnerSummary</h3>
        <div className="mb-8">
          <PropTable props={OWNER_SUMMARY_FIELDS} />
        </div>

        <h3 className="text-sm font-semibold text-ink mb-3">OwnerRollRow</h3>
        <div className="mb-8">
          <PropTable props={ROLL_ROW_PROPS} />
        </div>

        <h3 className="text-sm font-semibold text-ink mb-3">OwnerCard</h3>
        <PropTable props={CARD_PROPS} />
      </section>
    </DocsPage>
  );
}
