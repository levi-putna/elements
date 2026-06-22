"use client"

import * as React from "react"
import {
  ArrowLeft,
  Building2,
  FileText,
  Info,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DataTable,
  DataTableCell,
  DataTableRow,
  type DataTableColumn,
} from "@/components/ui/data-table"
import { LotBadge, LotLevyBadge } from "@/components/ui/lot"
import {
  OwnerAvatar,
  OwnerCommitteeBadge,
  OwnerContactMeta,
  OwnerCorrespondenceBadge,
  OwnerPortalBadge,
  OwnerTypeBadge,
} from "@/components/ui/owner"
import {
  Widget,
  WidgetContent,
  WidgetGrid,
  WidgetHeader,
  WidgetList,
  WidgetListItem,
  WidgetTitle,
} from "@/components/ui/widget"
import { PORTFOLIO_PROPERTIES } from "@/components/preview/properties-index"
import {
  getPreviewOwner,
  mapPreviewLevyStatus,
  rollupOwnerLevyStatus,
  toOwnerSummary,
  type PreviewOwner,
  type PreviewOwnerLot,
} from "@/lib/preview-owners"

/** Recent correspondence item on an owner profile. */
interface CorrespondenceItem {
  id: string
  date: string
  subject: string
  channel: "email" | "post" | "portal"
  lot?: number
}

const DEMO_CORRESPONDENCE: Record<string, CorrespondenceItem[]> = {
  "own-robert-davis": [
    {
      id: "corr-1",
      date: "12 Jun 2026",
      subject: "Arrears reminder: Q2 levy notice",
      channel: "email",
      lot: 7,
    },
    {
      id: "corr-2",
      date: "28 May 2026",
      subject: "Payment plan proposal sent",
      channel: "email",
      lot: 7,
    },
    {
      id: "corr-3",
      date: "1 Apr 2026",
      subject: "Q2 levy notice issued",
      channel: "email",
      lot: 7,
    },
  ],
  "own-jennifer-michael-walsh": [
    {
      id: "corr-4",
      date: "1 Apr 2026",
      subject: "Q2 levy notice issued",
      channel: "email",
      lot: 31,
    },
    {
      id: "corr-5",
      date: "20 Aug 2025",
      subject: "Committee appointment confirmation",
      channel: "email",
      lot: 31,
    },
  ],
  "own-patricia-david-kim": [
    {
      id: "corr-6",
      date: "1 Apr 2026",
      subject: "Q2 levy notice issued (joint proprietors)",
      channel: "email",
      lot: 18,
    },
    {
      id: "corr-7",
      date: "15 Mar 2026",
      subject: "Treasurer handover pack",
      channel: "portal",
      lot: 18,
    },
  ],
}

const LOT_COLUMNS: DataTableColumn[] = [
  { key: "lot", label: "Lot", width: "72px" },
  { key: "unit", label: "Unit" },
  { key: "occupancy", label: "Occupancy" },
  { key: "entitlement", label: "Entitlement", align: "right" },
  { key: "levy", label: "Levy status" },
]

/**
 * Format currency for levy amounts on the owner profile.
 */
function formatCurrency({ amount }: { amount: number }): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

interface OwnerLotsTableProps {
  lots: PreviewOwnerLot[]
}

/**
 * Lot-centric levy table. Levies always attach to the lot, even when
 * proprietors are joint or hold multiple lots.
 */
function OwnerLotsTable({ lots }: OwnerLotsTableProps) {
  return (
    <DataTable columns={LOT_COLUMNS} minWidth="560px" emptyMessage="No lots on title.">
      {lots.map((lot) => (
        <DataTableRow key={lot.lot}>
          {/* Lot number */}
          <DataTableCell>
            <LotBadge number={lot.lot} size="md" />
          </DataTableCell>

          {/* Unit type and address */}
          <DataTableCell>
            <p className="text-sm font-medium text-foreground">{lot.unitType}</p>
            {lot.unitAddress ? (
              <p className="mt-0.5 text-xs text-ink-muted">{lot.unitAddress}</p>
            ) : null}
          </DataTableCell>

          {/* Occupancy */}
          <DataTableCell>
            <div className="flex flex-col gap-0.5">
              <Badge
                variant={lot.ownerType === "owner-occupier" ? "default" : "info"}
                size="sm"
              >
                {lot.ownerType === "owner-occupier" ? "Owner occ." : "Investor"}
              </Badge>
              {lot.tenanted ? (
                <span className="text-[11px] text-ink-muted">Tenanted</span>
              ) : null}
            </div>
          </DataTableCell>

          {/* Entitlement */}
          <DataTableCell align="right">
            {lot.entitlementPercent ? (
              <span className="text-sm tabular-nums text-ink-muted">
                {lot.entitlementPercent}%
              </span>
            ) : (
              <span className="text-ink-muted/50">-</span>
            )}
          </DataTableCell>

          {/* Levy status per lot */}
          <DataTableCell>
            <div>
              <LotLevyBadge status={mapPreviewLevyStatus({ status: lot.levyStatus })} />
              {lot.arrearsAmount ? (
                <p className="mt-0.5 text-xs font-semibold tabular-nums text-danger">
                  {formatCurrency({ amount: lot.arrearsAmount })}
                </p>
              ) : null}
            </div>
          </DataTableCell>
        </DataTableRow>
      ))}
    </DataTable>
  )
}

interface JointProprietorsPanelProps {
  owner: PreviewOwner
}

/**
 * Joint proprietors on one title entry. One primary contact receives
 * levy notices; others may receive copies or portal access separately.
 */
function JointProprietorsPanel({ owner }: JointProprietorsPanelProps) {
  if (owner.type !== "joint" || !owner.persons?.length) {
    return null
  }

  return (
    <Widget>
      <WidgetHeader>
        <WidgetTitle icon={Users}>Joint proprietors</WidgetTitle>
      </WidgetHeader>
      <WidgetContent className="px-4 pb-4 pt-1">
        <p className="mb-4 text-sm text-ink-muted leading-relaxed">
          Registered as one proprietor on title. Levy notices go to the primary
          contact; both owners share liability for the lot.
        </p>

        <div className="divide-y divide-border rounded-sm border border-border">
          {owner.persons.map((person) => (
            <div key={person.id} className="flex flex-wrap items-start gap-4 px-4 py-3">
              {/* Person identity */}
              <div className="flex min-w-0 flex-1 items-start gap-3">
                <OwnerAvatar name={person.name} size="md" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{person.name}</p>
                    {person.isPrimaryContact ? (
                      <Badge variant="accent" size="sm">Primary contact</Badge>
                    ) : (
                      <Badge variant="outline" size="sm">Co-proprietor</Badge>
                    )}
                    {person.committeeRole ? (
                      <OwnerCommitteeBadge />
                    ) : null}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {person.email ? (
                      <p className="flex items-center gap-1 text-xs text-ink-muted">
                        <Mail className="size-3 shrink-0" aria-hidden />
                        {person.email}
                      </p>
                    ) : null}
                    {person.phone ? (
                      <p className="flex items-center gap-1 text-xs text-ink-muted">
                        <Phone className="size-3 shrink-0" aria-hidden />
                        {person.phone}
                      </p>
                    ) : null}
                    {!person.isPrimaryContact && !person.email ? (
                      <p className="text-xs text-ink-muted">
                        Receives copies via primary contact
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Committee role label */}
              {person.committeeRole ? (
                <div className="text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                    Committee
                  </p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    {person.committeeRole}
                  </p>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </WidgetContent>
    </Widget>
  )
}

export interface OwnerDetailProps {
  propertyId: string
  ownerId: string
  onBack: () => void
}

/**
 * Proprietor profile for the app preview. Lot roll views reconcile by lot;
 * this page is owner-centric for correspondence, portal access, and contact
 * management, including joint proprietors on a single title.
 */
export function OwnerDetail({ propertyId, ownerId, onBack }: OwnerDetailProps) {
  const scheme = PORTFOLIO_PROPERTIES.find((property) => property.id === propertyId)
  const owner = getPreviewOwner({ propertyId, ownerId })

  if (!scheme || !owner) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-ink-muted">Owner not found.</p>
      </div>
    )
  }

  const summary = toOwnerSummary({ owner })
  const correspondence = DEMO_CORRESPONDENCE[owner.id] ?? []
  const levyStatus = rollupOwnerLevyStatus({ lots: owner.lots })
  const committeeRole = owner.persons?.find((person) => person.committeeRole)?.committeeRole

  return (
    <div className="mx-auto w-full max-w-content space-y-6">
      {/* Back navigation */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="size-3.5" aria-hidden />
          Owners roll
        </Button>
      </div>

      {/* Profile header */}
      <div className="overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start">
          {/* Avatar and identity */}
          <div className="flex items-start gap-4">
            <OwnerAvatar name={owner.name} size="lg" />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                Registered proprietor
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
                {owner.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <OwnerTypeBadge type={owner.type} />
                {committeeRole ? <OwnerCommitteeBadge /> : null}
                <LotLevyBadge status={levyStatus} />
              </div>
              <p className="mt-2 text-sm text-ink-muted">
                {scheme.name} · {scheme.plan}
                {owner.registeredOnRoll ? ` · On roll since ${owner.registeredOnRoll}` : ""}
              </p>
            </div>
          </div>

          {/* Header actions */}
          <div className="flex shrink-0 flex-wrap gap-2 sm:ml-auto">
            <Button variant="outline" size="sm">Edit contact</Button>
            <Button variant="outline" size="sm">Send notice</Button>
            <Button size="sm">Log correspondence</Button>
          </div>
        </div>
      </div>

      {/* Lot vs owner context */}
      <div className="flex gap-3 rounded-sm border border-border bg-off-white px-4 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-forest" aria-hidden />
        <div className="min-w-0 text-sm text-ink-muted leading-relaxed">
          <p className="font-medium text-foreground">Lot-based levies, owner-based contact</p>
          <p className="mt-1">
            The strata roll is organised by lot. Levy notices, entitlements, and arrears
            attach to each lot. Use this proprietor profile to manage contact details,
            correspondence preferences, and portal access
            {owner.type === "joint"
              ? ", including which joint owner is the primary contact."
              : "."}
          </p>
        </div>
      </div>

      <WidgetGrid columns={2}>
        {/* Contact and preferences */}
        <Widget className={owner.type === "joint" ? "lg:col-span-2" : undefined}>
          <WidgetHeader>
            <WidgetTitle icon={User}>Contact</WidgetTitle>
          </WidgetHeader>
          <WidgetContent className="space-y-4 px-4 pb-4 pt-1">
            <OwnerContactMeta owner={summary} showIcons showAddress />

            <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                  Correspondence
                </p>
                <div className="mt-2">
                  {owner.correspondence ? (
                    <OwnerCorrespondenceBadge method={owner.correspondence} />
                  ) : (
                    <span className="text-sm text-ink-muted">Not set</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                  Portal
                </p>
                <div className="mt-2">
                  {owner.portalStatus ? (
                    <OwnerPortalBadge status={owner.portalStatus} />
                  ) : (
                    <span className="text-sm text-ink-muted">Not invited</span>
                  )}
                </div>
              </div>
            </div>

            {owner.mailingAddress ? (
              <div className="border-t border-border pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                  Mailing address
                </p>
                <p className="mt-2 flex items-start gap-1.5 text-sm text-foreground">
                  <MapPin className="mt-0.5 size-3.5 shrink-0 text-ink-muted" aria-hidden />
                  {owner.mailingAddress}
                </p>
              </div>
            ) : null}

            {owner.notes ? (
              <div className="rounded-xs border border-warning/30 bg-warning/5 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-warning">
                  Manager note
                </p>
                <p className="mt-1 text-sm text-foreground">{owner.notes}</p>
              </div>
            ) : null}
          </WidgetContent>
        </Widget>

        {/* Individual proprietor committee card (non-joint) */}
        {owner.type !== "joint" && committeeRole ? (
          <Widget>
            <WidgetHeader>
              <WidgetTitle icon={Shield}>Committee</WidgetTitle>
            </WidgetHeader>
            <WidgetContent className="px-4 pb-4 pt-1">
              <p className="text-sm text-ink-muted">
                Serves on the owners corporation committee in their own right.
              </p>
              <p className="mt-3 text-lg font-semibold text-foreground">{committeeRole}</p>
              <p className="mt-1 text-xs text-ink-muted">
                Elected 20 Aug 2025 · Term expires at next AGM
              </p>
            </WidgetContent>
          </Widget>
        ) : null}
      </WidgetGrid>

      {/* Joint proprietors */}
      <JointProprietorsPanel owner={owner} />

      {/* Lots on title */}
      <Widget>
        <WidgetHeader>
          <WidgetTitle icon={Building2}>Lots on title</WidgetTitle>
        </WidgetHeader>
        <WidgetContent className="px-4 pb-4 pt-1">
          <p className="mb-4 text-sm text-ink-muted">
            {owner.lots.length === 1
              ? "Holds one lot. Levy status and entitlements are tracked per lot."
              : `Holds ${owner.lots.length} lots. Each lot has its own levy account.`}
          </p>
          <OwnerLotsTable lots={owner.lots} />
        </WidgetContent>
      </Widget>

      {/* Recent correspondence */}
      <Widget>
        <WidgetHeader>
          <WidgetTitle icon={FileText}>Recent correspondence</WidgetTitle>
        </WidgetHeader>
        <WidgetContent className="px-2 pb-2 pt-0">
          {correspondence.length > 0 ? (
            <WidgetList>
              {correspondence.map((item) => (
                <WidgetListItem
                  key={item.id}
                  icon={Mail}
                  title={item.subject}
                  meta={`${item.date}${item.lot ? ` · Lot ${item.lot}` : ""} · ${item.channel}`}
                  showChevron
                />
              ))}
            </WidgetList>
          ) : (
            <p className="px-4 py-6 text-sm text-ink-muted">No correspondence logged yet.</p>
          )}
        </WidgetContent>
      </Widget>
    </div>
  )
}
