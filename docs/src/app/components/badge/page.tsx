"use client";

import { Badge } from "@/components/ui/badge";
import { DocumentTypeBadge } from "@/components/ui/document";
import {
  LotBadge,
  LotLevyBadge,
  LotProxyBadge,
  type LotLevyStatus,
} from "@/components/ui/lot";
import {
  OwnerCommitteeBadge,
  OwnerCorrespondenceBadge,
  OwnerPortalBadge,
  OwnerTypeBadge,
  type OwnerCorrespondenceMethod,
  type OwnerPortalStatus,
  type OwnerType,
} from "@/components/ui/owner";
import {
  SchemePlanBadge,
  SchemeStatusBadge,
  type SchemeStatus,
} from "@/components/ui/scheme";
import {
  WORK_ITEM_DEMO_BY_STATUS,
  WorkItemAutomationBadge,
  WorkItemDomainBadge,
  WorkItemDueBadge,
  WorkItemStatusBadge,
  type WorkItemAutomation,
  type WorkItemDomain,
} from "@/components/ui/task";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { BadgeCheck, Bookmark } from "lucide-react";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/badge/registry.json`;

const USAGE = `import { Badge } from "@/components/ui/badge"
import { SchemeStatusBadge } from "@/components/ui/scheme"

// Prefer domain badges in product UI
<SchemeStatusBadge status="active" />

// Raw Badge for one-off labels
<Badge variant="accent">Paid</Badge>`;

const BADGE_PROPS = [
  {
    name: "variant",
    type: '"default" | "secondary" | "accent" | "warning" | "destructive" | "outline" | "mono" | "ghost"',
    default: '"default"',
    description:
      "Semantic tone. Domain badges map their states onto these variants consistently.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Padding and type size. Identifier badges (SP, Lot) typically use sm.",
  },
  {
    name: "icon",
    type: "LucideIcon",
    description: "Optional leading icon at 14px (size-3.5).",
  },
  {
    name: "hideIcon",
    type: "boolean",
    default: "false",
    description: "Suppress the icon in dense table cells.",
  },
];

const FOUNDATION_VARIANTS = [
  { variant: "default" as const, label: "Default" },
  { variant: "secondary" as const, label: "Secondary" },
  { variant: "accent" as const, label: "Accent" },
  { variant: "warning" as const, label: "Warning" },
  { variant: "destructive" as const, label: "Destructive" },
  { variant: "outline" as const, label: "Outline" },
  { variant: "mono" as const, label: "Mono" },
  { variant: "ghost" as const, label: "Ghost" },
];

const SCHEME_STATUSES: SchemeStatus[] = [
  "active",
  "onboarding",
  "archived",
  "attention",
];

const LOT_LEVY_STATUSES: LotLevyStatus[] = [
  "paid",
  "due",
  "overdue",
  "not_assessed",
];

const OWNER_TYPES: OwnerType[] = ["individual", "company", "joint"];

const PORTAL_STATUSES: OwnerPortalStatus[] = [
  "active",
  "invited",
  "not_registered",
];

const CORRESPONDENCE_METHODS: OwnerCorrespondenceMethod[] = [
  "email",
  "post",
  "portal",
];

const WORK_ITEM_DOMAINS: WorkItemDomain[] = [
  "meetings",
  "accounting",
  "maintenance",
  "insurance",
  "admin",
  "disputes",
  "communication",
  "contractors",
];

const AUTOMATION_STATES: WorkItemAutomation[] = [
  "automatable",
  "semi_automated",
  "manual",
];

const DOCUMENT_TYPES = [
  "pdf",
  "doc",
  "spreadsheet",
  "presentation",
  "image",
  "archive",
  "text",
  "folder",
  "other",
] as const;

/**
 * Badge primitive and domain badge catalogue for Instant Strata.
 */
export default function BadgePage() {
  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Base
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Badge
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          Shared label primitive for status pills, identifiers, and domain
          metadata. Extends the{" "}
          <a
            href="https://ui.shadcn.com/docs/components/radix/badge"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            shadcn/ui Badge
          </a>{" "}
          with Instant Strata semantic variants. Application components compose
          this shell so tone, sizing, and icons stay consistent across scheme,
          lot, owner, task, and document surfaces.
        </p>
      </div>

      {/* Install */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL} />
      </section>

      {/* Organisation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Organisation
        </h2>
        <p className="text-sm text-ink-muted mb-4 max-w-3xl">
          Use domain badges in product UI. Each maps a fixed set of states onto
          the same variant palette:
        </p>
        <ul className="text-sm text-ink-muted space-y-2 mb-6 max-w-3xl list-disc pl-5">
          <li>
            <strong className="text-foreground font-medium">accent</strong>:
            active, paid, automatable, portal active, in progress
          </li>
          <li>
            <strong className="text-foreground font-medium">warning</strong>:
            onboarding, due review, R-A-S, invited
          </li>
          <li>
            <strong className="text-foreground font-medium">destructive</strong>:
            attention, overdue, failed, escalated, manual required
          </li>
          <li>
            <strong className="text-foreground font-medium">default</strong>:
            archived, manual, not registered, snoozed, neutral metadata
          </li>
          <li>
            <strong className="text-foreground font-medium">mono</strong>: SP
            plan numbers, lot numbers, file extensions
          </li>
          <li>
            <strong className="text-foreground font-medium">outline</strong>:
            correspondence preference, work item domain
          </li>
        </ul>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Soft status backgrounds pair with saturated text:{" "}
          <code className="font-mono text-xs">warning</code> uses{" "}
          <code className="font-mono text-xs">text-warning</code>;{" "}
          <code className="font-mono text-xs">destructive</code> uses{" "}
          <code className="font-mono text-xs">text-danger</code>.
        </p>
        <CodeBlock code={USAGE} />
      </section>

      {/* Foundation variants */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation variants
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Base tones for one-off labels or custom compositions.
        </p>

        <ComponentPreview label="All variants">
          <div className="flex flex-wrap gap-2 py-2">
            {FOUNDATION_VARIANTS.map(({ variant, label }) => (
              <Badge key={variant} variant={variant}>
                {label}
              </Badge>
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="Sizes">
          <div className="flex flex-wrap items-center gap-2 py-2">
            <Badge variant="accent" size="sm">
              Small
            </Badge>
            <Badge variant="accent" size="md">
              Medium
            </Badge>
            <Badge variant="accent" size="lg">
              Large
            </Badge>
          </div>
        </ComponentPreview>

        <ComponentPreview label="With icon">
          <div className="flex flex-wrap gap-2 py-2">
            <Badge variant="accent" icon={BadgeCheck}>
              Verified
            </Badge>
            <Badge variant="outline" icon={Bookmark}>
              Bookmark
            </Badge>
          </div>
        </ComponentPreview>
      </section>

      {/* Scheme */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Scheme badges
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Portfolio lifecycle and strata plan identifiers.
        </p>

        <ComponentPreview label="SchemePlanBadge">
          <div className="flex flex-wrap gap-2 py-2">
            <SchemePlanBadge plan="SP 1042" />
            <SchemePlanBadge plan="SP 8821" />
          </div>
        </ComponentPreview>

        <ComponentPreview label="SchemeStatusBadge (all states)">
          <div className="flex flex-wrap gap-2 py-2">
            {SCHEME_STATUSES.map((status) => (
              <SchemeStatusBadge key={status} status={status} />
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="Dense table (hideIcon)">
          <div className="flex flex-wrap gap-2 py-2">
            {SCHEME_STATUSES.map((status) => (
              <SchemeStatusBadge key={status} status={status} hideIcon />
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Lot */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Lot badges
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Lot references, levy status, and AGM proxy eligibility.
        </p>

        <ComponentPreview label="LotBadge sizes">
          <div className="flex flex-wrap items-center gap-2 py-2">
            <LotBadge number={12} size="sm" />
            <LotBadge number={12} size="md" />
            <LotBadge number={12} size="lg" />
          </div>
        </ComponentPreview>

        <ComponentPreview label="LotLevyBadge (all states)">
          <div className="flex flex-wrap gap-2 py-2">
            {LOT_LEVY_STATUSES.map((status) => (
              <LotLevyBadge key={status} status={status} />
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="LotProxyBadge">
          <div className="flex flex-wrap gap-2 py-2">
            <LotProxyBadge eligible />
            <LotProxyBadge eligible={false} />
          </div>
        </ComponentPreview>
      </section>

      {/* Owner */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Owner badges
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Legal form, portal registration, correspondence, and committee role.
        </p>

        <ComponentPreview label="OwnerTypeBadge">
          <div className="flex flex-wrap gap-2 py-2">
            {OWNER_TYPES.map((type) => (
              <OwnerTypeBadge key={type} type={type} />
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="OwnerPortalBadge">
          <div className="flex flex-wrap gap-2 py-2">
            {PORTAL_STATUSES.map((status) => (
              <OwnerPortalBadge key={status} status={status} />
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="OwnerCorrespondenceBadge">
          <div className="flex flex-wrap gap-2 py-2">
            {CORRESPONDENCE_METHODS.map((method) => (
              <OwnerCorrespondenceBadge key={method} method={method} />
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="OwnerCommitteeBadge">
          <OwnerCommitteeBadge />
        </ComponentPreview>
      </section>

      {/* Task */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Task badges
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Workflow states, automation class, business domain, and due dates.
        </p>

        <ComponentPreview label="WorkItemStatusBadge (all states)">
          <div className="flex flex-wrap gap-2 py-2">
            {WORK_ITEM_DEMO_BY_STATUS.map((item) => (
              <WorkItemStatusBadge key={item.id} status={item.status} />
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="WorkItemAutomationBadge">
          <div className="flex flex-wrap gap-2 py-2">
            {AUTOMATION_STATES.map((automation) => (
              <WorkItemAutomationBadge key={automation} automation={automation} />
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="WorkItemDomainBadge">
          <div className="flex flex-wrap gap-2 py-2">
            {WORK_ITEM_DOMAINS.map((domain) => (
              <WorkItemDomainBadge key={domain} domain={domain} />
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="WorkItemDueBadge">
          <div className="flex flex-wrap gap-2 py-2">
            <WorkItemDueBadge
              dueAt="2026-07-01"
              dueKind="due"
              status="in_progress"
            />
            <WorkItemDueBadge
              dueAt="2026-06-10"
              dueKind="statutory"
              status="awaiting_review"
            />
            <WorkItemDueBadge
              dueAt="2026-05-30"
              dueKind="statutory"
              status="escalated"
            />
            <WorkItemDueBadge
              dueAt="2026-06-20"
              dueKind="follow_up"
              status="pending"
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Document */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Document badges
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          File extension labels using brand colours from the document thumb art.
        </p>

        <ComponentPreview label="DocumentTypeBadge (all types)">
          <div className="flex flex-wrap gap-2 py-2">
            {DOCUMENT_TYPES.map((type) => (
              <DocumentTypeBadge key={type} type={type} />
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* API */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          API
        </h2>
        <PropTable props={BADGE_PROPS} />
      </section>
    </DocsPage>
  );
}
