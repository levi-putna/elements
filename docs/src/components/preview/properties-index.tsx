"use client"

import * as React from "react"
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  List,
  Plus,
  Shield,
  TrendingDown,
  Wrench,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DataTable,
  DataTableCell,
  DataTableCompoundToolbar,
  DataTableFooter,
  DataTableRow,
  DataTableSearch,
  type DataTableColumn,
} from "@/components/ui/data-table"
import {
  AddFilterButton,
  CompoundSortButton,
  FilterConditionChip,
  type CompoundFilterCondition,
  type CompoundFilterFieldConfig,
} from "@/components/preview/compound-filter-bar"
import {
  SchemeHealthIndicator,
  SchemeIcon,
  SchemePlanBadge,
  type SchemeSummary,
} from "@/components/ui/scheme"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────
// Extended portfolio data model
// SchemeSummary covers identity + health; PortfolioRow adds
// fund balances and next meeting for the table columns.
// ─────────────────────────────────────────────────────────

type MeetingType = "agm" | "egm" | "committee"

interface NextMeeting {
  type: MeetingType
  daysUntil: number
}

/** Extended row shown in the portfolio table. Extends SchemeSummary so it
 *  can be passed to SchemeCard and other scheme primitives unchanged. */
export interface PortfolioRow extends SchemeSummary {
  regulationModule?: string
  adminFundBalance: number
  sinkingFundBalance: number
  arrearsAmount: number
  nextMeeting?: NextMeeting
}

// ─────────────────────────────────────────────────────────
// Portfolio demo data
// ─────────────────────────────────────────────────────────

/** Aggregate portfolio-level health signals for the strip. */
const PORTFOLIO_STATS = {
  propertiesCount: 5,
  totalLots: 118,
  leviesInArrears: { amount: 24800, percent: 3.2, lots: 7 },
  openMaintenance: { emergency: 2, urgent: 5, routine: 14 },
  upcomingAgms: { next30: 2, next60: 4 },
  insuranceExpiring: { overdue: 0, next60Days: 1 },
  complianceDue: { overdue: 1, thisMonth: 3 },
  fundPosition: { adminTotal: 682450, sinkingTotal: 389200, propertiesInDeficit: 1 },
} as const

/** Five sample properties across QLD and NSW. */
export const PORTFOLIO_PROPERTIES: PortfolioRow[] = [
  {
    id: "harbour-view",
    name: "Harbour View Towers",
    plan: "SP1042",
    suburb: "Kangaroo Point",
    state: "QLD",
    address: "1-42 Harbour View Drive",
    lotCount: 42,
    financialYearEnd: "30 Jun",
    managerName: "Sarah Mitchell",
    regulationModule: "Standard",
    status: "attention",
    health: "warning",
    openTasks: 6,
    arrearsPercent: 7,
    adminFundBalance: 248450,
    sinkingFundBalance: 145200,
    arrearsAmount: 12400,
    nextMeeting: { type: "committee", daysUntil: 0 },
  },
  {
    id: "the-quarter",
    name: "The Quarter",
    plan: "SP3390",
    suburb: "South Brisbane",
    state: "QLD",
    address: "88-112 Quarter Lane",
    lotCount: 24,
    financialYearEnd: "30 Jun",
    managerName: "Sarah Mitchell",
    regulationModule: "Standard",
    status: "attention",
    health: "critical",
    openTasks: 8,
    arrearsPercent: 12,
    adminFundBalance: 98400,
    sinkingFundBalance: -19000,
    arrearsAmount: 22100,
    nextMeeting: { type: "egm", daysUntil: 5 },
  },
  {
    id: "northbridge",
    name: "Northbridge Estate",
    plan: "SP4821",
    suburb: "Northbridge",
    state: "QLD",
    address: "100-128 Estate Drive",
    lotCount: 28,
    financialYearEnd: "30 Jun",
    managerName: "Sarah Mitchell",
    regulationModule: "Standard",
    status: "attention",
    health: "warning",
    openTasks: 4,
    arrearsPercent: 4,
    adminFundBalance: 186200,
    sinkingFundBalance: 112400,
    arrearsAmount: 9300,
    nextMeeting: { type: "agm", daysUntil: 42 },
  },
  {
    id: "parkside",
    name: "Parkside Residences",
    plan: "SP2287",
    suburb: "Fortitude Valley",
    state: "QLD",
    address: "22-38 Parkside Street",
    lotCount: 16,
    financialYearEnd: "30 Jun",
    managerName: "Sarah Mitchell",
    regulationModule: "Small Schemes",
    status: "active",
    health: "good",
    openTasks: 2,
    arrearsPercent: 0,
    adminFundBalance: 65800,
    sinkingFundBalance: 28400,
    arrearsAmount: 0,
    nextMeeting: { type: "agm", daysUntil: 55 },
  },
  {
    id: "sunset-gardens",
    name: "Sunset Gardens",
    plan: "SP12045",
    suburb: "Surry Hills",
    state: "NSW",
    address: "5-13 Sunset Avenue",
    lotCount: 8,
    financialYearEnd: "31 Dec",
    managerName: "Sarah Mitchell",
    regulationModule: undefined,
    status: "active",
    health: "good",
    openTasks: 1,
    arrearsPercent: 0,
    adminFundBalance: 41200,
    sinkingFundBalance: 18800,
    arrearsAmount: 0,
    nextMeeting: { type: "agm", daysUntil: 18 },
  },
]

// ─────────────────────────────────────────────────────────
// Formatting helpers
// ─────────────────────────────────────────────────────────

/** Abbreviate a dollar amount: $248,450 → $248k, $1,280,000 → $1.28M */
function formatFund(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? "-" : ""
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(2).replace(/\.?0+$/, "")}M`
  if (abs >= 1_000) return `${sign}$${Math.round(abs / 1_000)}k`
  return `${sign}$${abs}`
}

const MEETING_LABELS: Record<MeetingType, string> = {
  agm: "AGM",
  egm: "EGM",
  committee: "Committee",
}

/** Urgency tone for a meeting: red if in 14 days or less, warning 15-30, neutral beyond. */
function meetingTone(daysUntil: number): "danger" | "warning" | "default" {
  if (daysUntil <= 14) return "danger"
  if (daysUntil <= 30) return "warning"
  return "default"
}

// ─────────────────────────────────────────────────────────
// Portfolio health strip: 7-signal overview
// ─────────────────────────────────────────────────────────

type MetricTone = "default" | "warning" | "danger" | "accent"

interface HudMetricProps {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  caption: string
  tone?: MetricTone
}

const metricValueClass: Record<MetricTone, string> = {
  default: "text-foreground",
  warning: "text-warning",
  danger: "text-danger",
  accent: "text-forest",
}

const metricIconClass: Record<MetricTone, string> = {
  default: "text-ink-muted",
  warning: "text-warning",
  danger: "text-danger",
  accent: "text-forest",
}

function HudMetric({ icon: Icon, label, value, caption, tone = "default" }: HudMetricProps) {
  return (
    <div className="min-w-0 border-r border-t border-border px-3 py-3 last:border-r-0 xl:px-4">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-3 shrink-0", metricIconClass[tone])} aria-hidden />
        <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
          {label}
        </p>
      </div>
      <p className={cn("mt-1.5 text-sm font-semibold tracking-tight", metricValueClass[tone])}>
        {value}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-ink-muted">{caption}</p>
    </div>
  )
}

function PortfolioHealthStrip() {
  const { openMaintenance, leviesInArrears, upcomingAgms, insuranceExpiring, complianceDue, fundPosition } = PORTFOLIO_STATS

  const maintenanceTone: MetricTone =
    openMaintenance.emergency > 0 ? "danger" : openMaintenance.urgent > 3 ? "warning" : "default"
  const arrearsTone: MetricTone =
    leviesInArrears.percent > 10 ? "danger" : leviesInArrears.percent > 3 ? "warning" : "accent"
  const agmTone: MetricTone = upcomingAgms.next30 > 2 ? "warning" : "default"
  const insuranceTone: MetricTone =
    insuranceExpiring.overdue > 0 ? "danger" : insuranceExpiring.next60Days > 0 ? "warning" : "default"
  const complianceTone: MetricTone =
    complianceDue.overdue > 0 ? "danger" : complianceDue.thisMonth > 2 ? "warning" : "default"
  const fundTone: MetricTone = fundPosition.propertiesInDeficit > 0 ? "warning" : "accent"
  const fundTotal = (fundPosition.adminTotal + fundPosition.sinkingTotal) / 1000

  return (
    <div className="overflow-hidden rounded-sm border-b border-l border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7">
        <HudMetric
          icon={CheckCircle2}
          label="Properties"
          value={`${PORTFOLIO_STATS.propertiesCount} active`}
          caption={`${PORTFOLIO_STATS.totalLots} lots total`}
        />
        <HudMetric
          icon={TrendingDown}
          label="Arrears"
          value={`$${(leviesInArrears.amount / 1000).toFixed(0)}k`}
          caption={`${leviesInArrears.percent}% of portfolio · ${leviesInArrears.lots} lots`}
          tone={arrearsTone}
        />
        <HudMetric
          icon={Wrench}
          label="Maintenance"
          value={
            openMaintenance.emergency > 0
              ? <span className="text-danger">{openMaintenance.emergency} emergency</span>
              : `${openMaintenance.urgent + openMaintenance.routine} open`
          }
          caption={`${openMaintenance.emergency} emergency · ${openMaintenance.urgent} urgent · ${openMaintenance.routine} routine`}
          tone={maintenanceTone}
        />
        <HudMetric
          icon={Calendar}
          label="Upcoming AGMs"
          value={`${upcomingAgms.next30} in 30 days`}
          caption={`${upcomingAgms.next60} due within 60 days`}
          tone={agmTone}
        />
        <HudMetric
          icon={Shield}
          label="Insurance"
          value={
            insuranceExpiring.overdue > 0
              ? `${insuranceExpiring.overdue} overdue`
              : insuranceExpiring.next60Days > 0
                ? `${insuranceExpiring.next60Days} expiring`
                : "All current"
          }
          caption="Renewals in next 60 days"
          tone={insuranceTone}
        />
        <HudMetric
          icon={AlertTriangle}
          label="Compliance"
          value={
            complianceDue.overdue > 0
              ? `${complianceDue.overdue} overdue`
              : `${complianceDue.thisMonth} due this month`
          }
          caption="Fire, lift, pool certifications"
          tone={complianceTone}
        />
        <HudMetric
          icon={CheckCircle2}
          label="Fund position"
          value={`$${fundTotal.toFixed(0)}k`}
          caption={
            fundPosition.propertiesInDeficit > 0
              ? `${fundPosition.propertiesInDeficit} property in deficit`
              : "All funds solvent"
          }
          tone={fundTone}
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// PropertyTable: portfolio table
//
// Columns: Property, State/Module, Lots, Funds, Arrears,
// Health, Next Meeting. Built with DataTable so all preview
// tables share the same chrome conventions.
// ─────────────────────────────────────────────────────────

interface PropertyTableProps {
  rows: PortfolioRow[]
  onSelect: ({ id }: { id: string }) => void
}

const PROPERTY_TABLE_COLUMNS: DataTableColumn[] = [
  { key: "property",     label: "Property"      },
  { key: "state",        label: "State · Module" },
  { key: "lots",         label: "Lots",   align: "right" },
  { key: "funds",        label: "Funds"         },
  { key: "arrears",      label: "Arrears", align: "right" },
  { key: "health",       label: "Health"        },
  { key: "nextMeeting",  label: "Next meeting"  },
  { key: "action",       label: "",       width: "40px"  },
]

function PropertyTableRows({ rows, onSelect }: PropertyTableProps) {
  return (
    <>
      {rows.map((row) => {
        const tone = meetingTone(row.nextMeeting?.daysUntil ?? 999)
        return (
          <DataTableRow key={row.id} onClick={() => onSelect({ id: row.id })}>
            {/* Property: icon + name + plan + suburb */}
            <DataTableCell>
              <div className="flex items-center gap-3">
                <SchemeIcon name={row.name} imageUrl={row.imageUrl} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground leading-snug">{row.name}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <SchemePlanBadge plan={row.plan} />
                    {row.suburb ? (
                      <span className="text-xs text-ink-muted">{row.suburb}</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </DataTableCell>

            {/* State · Module */}
            <DataTableCell>
              <p className="text-sm font-medium text-foreground">{row.state}</p>
              {row.regulationModule ? (
                <p className="mt-0.5 text-xs text-ink-muted">{row.regulationModule}</p>
              ) : null}
            </DataTableCell>

            {/* Lots */}
            <DataTableCell align="right">
              <span className="text-sm tabular-nums text-foreground">{row.lotCount ?? "—"}</span>
            </DataTableCell>

            {/* Funds: admin + sinking stacked */}
            <DataTableCell>
              <div className="space-y-0.5">
                <p className="text-xs text-ink-muted">
                  Admin{" "}
                  <span className="font-semibold tabular-nums text-foreground">
                    {formatFund(row.adminFundBalance)}
                  </span>
                </p>
                <p className="text-xs text-ink-muted">
                  Sinking{" "}
                  <span
                    className={cn(
                      "font-semibold tabular-nums",
                      row.sinkingFundBalance < 0 ? "text-danger" : "text-foreground"
                    )}
                  >
                    {formatFund(row.sinkingFundBalance)}
                  </span>
                </p>
              </div>
            </DataTableCell>

            {/* Arrears */}
            <DataTableCell align="right">
              {row.arrearsAmount > 0 ? (
                <span className="text-sm font-semibold tabular-nums text-danger">
                  {formatFund(row.arrearsAmount)}
                </span>
              ) : (
                <span className="text-sm tabular-nums text-ink-muted/50">—</span>
              )}
            </DataTableCell>

            {/* Health */}
            <DataTableCell>
              {row.health ? <SchemeHealthIndicator health={row.health} /> : null}
            </DataTableCell>

            {/* Next meeting */}
            <DataTableCell>
              {row.nextMeeting ? (
                <div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "text-foreground"
                    )}
                  >
                    {MEETING_LABELS[row.nextMeeting.type]}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      tone === "danger" ? "text-danger" : tone === "warning" ? "text-warning" : "text-ink-muted"
                    )}
                  >
                    {row.nextMeeting.daysUntil === 0 ? "today" : `in ${row.nextMeeting.daysUntil}d`}
                  </p>
                </div>
              ) : (
                <span className="text-xs text-ink-muted/50">—</span>
              )}
            </DataTableCell>

            {/* Chevron */}
            <DataTableCell align="right">
              <ChevronRight className="size-4 text-ink-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100" aria-hidden />
            </DataTableCell>
          </DataTableRow>
        )
      })}
    </>
  )
}

// ─────────────────────────────────────────────────────────
// PropertyCard: compact portfolio card for the grid view
//
// Three zones:
//   1. Identity  — icon, name, health indicator (one row)
//   2. Funds     — Admin / Sinking side-by-side, number-forward
//   3. Footer    — lots + arrears (left)  next meeting (right)
//
// Health tones the left accent border so you can scan the
// whole grid for at-risk schemes at a glance.
// ─────────────────────────────────────────────────────────

const HEALTH_BORDER: Record<string, string> = {
  good: "border-l-[3px] border-l-lime",
  warning: "border-l-[3px] border-l-warning",
  critical: "border-l-[3px] border-l-danger",
}

interface PropertyCardProps {
  row: PortfolioRow
  onClick: () => void
}

function PropertyCard({ row, onClick }: PropertyCardProps) {
  const tone = meetingTone(row.nextMeeting?.daysUntil ?? 999)
  const leftBorder = HEALTH_BORDER[row.health ?? "good"] ?? ""

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col overflow-hidden rounded-sm border border-border bg-white text-left",
        "shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-all duration-150 hover:shadow-md hover:border-forest/20",
        leftBorder
      )}
    >
      {/* Zone 1: identity */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-3">
        <SchemeIcon name={row.name} imageUrl={row.imageUrl} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-snug text-foreground line-clamp-1">
              {row.name}
            </p>
            {row.health ? <SchemeHealthIndicator health={row.health} /> : null}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
            <SchemePlanBadge plan={row.plan} />
            {row.suburb ? (
              <span className="text-[11px] text-ink-muted">{row.suburb}</span>
            ) : null}
            {row.state ? (
              <span className="text-[11px] text-ink-muted">
                {row.suburb ? "·" : ""} {row.state}
                {row.regulationModule ? ` · ${row.regulationModule}` : ""}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {/* Zone 2: fund balances — side by side with a hairline column divider */}
      <div className="grid grid-cols-2 gap-px bg-border border-y border-border">
        <div className="bg-white px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Admin Fund
          </p>
          <p className="mt-1.5 text-xl font-semibold tracking-tight text-forest">
            {formatFund(row.adminFundBalance)}
          </p>
        </div>
        <div className="bg-white px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Sinking Fund
          </p>
          <p
            className={cn(
              "mt-1.5 text-xl font-semibold tracking-tight",
              row.sinkingFundBalance < 0 ? "text-danger" : "text-forest"
            )}
          >
            {formatFund(row.sinkingFundBalance)}
          </p>
        </div>
      </div>

      {/* Zone 3: footer — lots + arrears on left, next meeting on right */}
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-ink-muted">{row.lotCount} lots</span>
          {row.arrearsAmount > 0 ? (
            <>
              <span className="text-ink-muted/30" aria-hidden>·</span>
              <span className="font-semibold tabular-nums text-danger">
                {formatFund(row.arrearsAmount)} arrears
              </span>
            </>
          ) : (
            <>
              <span className="text-ink-muted/30" aria-hidden>·</span>
              <span className="text-forest">No arrears</span>
            </>
          )}
        </div>

        {row.nextMeeting ? (
          <div className="shrink-0 text-right">
            <p
              className={cn(
                "text-xs font-semibold",
                tone === "danger"
                  ? "text-danger"
                  : tone === "warning"
                    ? "text-warning"
                    : "text-foreground"
              )}
            >
              {MEETING_LABELS[row.nextMeeting.type]}
            </p>
            <p
              className={cn(
                "text-[11px] tabular-nums",
                tone === "danger"
                  ? "text-danger"
                  : tone === "warning"
                    ? "text-warning"
                    : "text-ink-muted"
              )}
            >
              {row.nextMeeting.daysUntil === 0 ? "today" : `in ${row.nextMeeting.daysUntil}d`}
            </p>
          </div>
        ) : null}
      </div>
    </button>
  )
}

// ─────────────────────────────────────────────────────────
// Filter config
// ─────────────────────────────────────────────────────────

type ViewMode = "list" | "grid"

const PROPERTY_FILTER_FIELDS: CompoundFilterFieldConfig[] = [
  {
    field: "health",
    label: "Health",
    options: [
      { value: "good", label: "Healthy", tone: "success" },
      { value: "warning", label: "Watch", tone: "warning" },
      { value: "critical", label: "Critical", tone: "danger" },
    ],
  },
  {
    field: "state",
    label: "State",
    options: [
      { value: "QLD", label: "QLD", tone: "info" },
      { value: "NSW", label: "NSW", tone: "info" },
    ],
  },
]

const PROPERTY_SORT_FIELDS = [
  { field: "name", label: "Name" },
  { field: "lotCount", label: "Lots" },
  { field: "arrearsAmount", label: "Arrears" },
]

// ─────────────────────────────────────────────────────────
// PropertiesIndex
// ─────────────────────────────────────────────────────────

export interface PropertiesIndexProps {
  onPropertySelect: ({ id }: { id: string }) => void
}

/**
 * Portfolio index: compact health strip at the top, then a searchable
 * filterable property table with Fund, Arrears, Health, and Next Meeting
 * columns, plus a card grid alternative.
 */
export function PropertiesIndex({ onPropertySelect }: PropertiesIndexProps) {
  const [search, setSearch] = React.useState("")
  const [conditions, setConditions] = React.useState<CompoundFilterCondition[]>([])
  const [sortField, setSortField] = React.useState("name")
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")
  const [viewMode, setViewMode] = React.useState<ViewMode>("list")

  function addCondition({ field }: { field: string }) {
    setConditions((prev) => [...prev, { id: crypto.randomUUID(), field, value: "" }])
  }

  function updateCondition({ id, value }: { id: string; value: string }) {
    setConditions((prev) => prev.map((condition) => (condition.id === id ? { ...condition, value } : condition)))
  }

  function removeCondition({ id }: { id: string }) {
    setConditions((prev) => prev.filter((condition) => condition.id !== id))
  }

  function clearAll() {
    setSearch("")
    setConditions([])
    setSortField("name")
    setSortDir("asc")
  }

  const anyFilters = Boolean(search.trim()) || conditions.some((condition) => condition.value)

  const filtered = React.useMemo(() => {
    let rows = PORTFOLIO_PROPERTIES

    if (search.trim()) {
      const query = search.toLowerCase()
      rows = rows.filter(
        (property) =>
          property.name.toLowerCase().includes(query) ||
          (property.plan ?? "").toLowerCase().includes(query) ||
          (property.suburb ?? "").toLowerCase().includes(query)
      )
    }

    for (const condition of conditions) {
      if (!condition.value) {
        continue
      }

      rows = rows.filter((property) => {
        if (condition.field === "health") {
          return property.health === condition.value
        }

        if (condition.field === "state") {
          return property.state === condition.value
        }

        return true
      })
    }

    return [...rows].sort((left, right) => {
      let comparison = 0

      if (sortField === "lotCount") {
        comparison = (left.lotCount ?? 0) - (right.lotCount ?? 0)
      } else if (sortField === "arrearsAmount") {
        comparison = left.arrearsAmount - right.arrearsAmount
      } else {
        comparison = left.name.localeCompare(right.name)
      }

      return sortDir === "asc" ? comparison : -comparison
    })
  }, [search, conditions, sortField, sortDir])

  return (
    <div className="mx-auto w-full max-w-content space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Properties
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Portfolio
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            {PORTFOLIO_PROPERTIES.length} properties under management · {PORTFOLIO_STATS.totalLots} lots total
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm">Bulk import</Button>
          <Button size="sm">
            <Plus className="size-3.5" aria-hidden />
            Add property
          </Button>
        </div>
      </div>

      {/* Portfolio health strip */}
      <PortfolioHealthStrip />

      {/* Property list with compound filter bar */}
      <DataTable
        columns={PROPERTY_TABLE_COLUMNS}
        minWidth="780px"
        emptyMessage="No properties match your current filters."
        framed={viewMode === "list"}
        toolbar={
          <DataTableCompoundToolbar
            controls={
              <>
                <div className="flex items-center rounded-xs border border-border bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="Table view"
                    className={cn(
                      "flex h-7 items-center gap-1.5 rounded-xs px-2 text-xs font-medium transition-colors duration-150",
                      viewMode === "list"
                        ? "bg-forest text-white"
                        : "text-ink-muted hover:text-foreground"
                    )}
                  >
                    <List className="size-3.5" aria-hidden />
                    Table
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    aria-label="Card view"
                    className={cn(
                      "flex h-7 items-center gap-1.5 rounded-xs px-2 text-xs font-medium transition-colors duration-150",
                      viewMode === "grid"
                        ? "bg-forest text-white"
                        : "text-ink-muted hover:text-foreground"
                    )}
                  >
                    <LayoutGrid className="size-3.5" aria-hidden />
                    Cards
                  </button>
                </div>

                <CompoundSortButton
                  sortField={sortField}
                  sortDir={sortDir}
                  fields={PROPERTY_SORT_FIELDS}
                  onSort={({ field, dir }) => {
                    setSortField(field)
                    setSortDir(dir)
                  }}
                />
              </>
            }
          >
            <DataTableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search by name, plan or suburb..."
              className="w-56"
            />

            {conditions.map((condition) => {
              const fieldConfig = PROPERTY_FILTER_FIELDS.find((field) => field.field === condition.field)!

              return (
                <FilterConditionChip
                  key={condition.id}
                  condition={condition}
                  fieldConfig={fieldConfig}
                  onValueChange={({ value }) => updateCondition({ id: condition.id, value })}
                  onRemove={() => removeCondition({ id: condition.id })}
                />
              )
            })}

            <AddFilterButton
              fields={PROPERTY_FILTER_FIELDS}
              activeFields={conditions.map((condition) => condition.field)}
              onAdd={({ field }) => addCondition({ field })}
            />
          </DataTableCompoundToolbar>
        }
        footer={
          <DataTableFooter
            filtered={filtered.length}
            total={PORTFOLIO_PROPERTIES.length}
            noun="properties"
            showClear={anyFilters || sortField !== "name" || sortDir !== "asc"}
            onClearAll={clearAll}
          />
        }
      >
        {viewMode === "list" ? (
          <PropertyTableRows rows={filtered} onSelect={onPropertySelect} />
        ) : (
          <DataTableRow>
            <DataTableCell colSpan={PROPERTY_TABLE_COLUMNS.length}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((row) => (
                  <PropertyCard
                    key={row.id}
                    row={row}
                    onClick={() => onPropertySelect({ id: row.id })}
                  />
                ))}
              </div>
            </DataTableCell>
          </DataTableRow>
        )}
      </DataTable>
    </div>
  )
}
