import { Badge, type BadgeVariant } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  Check,
  ChevronRight,
  Clock,
  Home,
  User,
  X,
} from "lucide-react"
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────
// Lot: strata lot identity primitives
//
// A lot is a unit on the strata roll within a scheme. Lots
// carry entitlements, owners, levy status, and proxy eligibility.
//
//   list     · dense row for owner rolls and pickers
//   card     · tile for lot grids and portal dashboards
//   compact  · minimal row for mentions and dropdowns
//   wide     · tabular row for full strata roll tables
// ─────────────────────────────────────────────────────────

export type LotLayout = "list" | "card" | "compact" | "wide"

/** Levy collection status for a lot. */
export type LotLevyStatus = "paid" | "due" | "overdue" | "not_assessed"

/** How the lot is currently occupied. */
export type LotOccupancy = "owner_occupied" | "tenanted" | "vacant"

/**
 * Core lot fields shared across cards, rolls, and inline references.
 * Extend in the app with contact details, correspondence prefs, and history.
 */
export interface LotSummary {
  /** Stable identifier for routing and API calls. */
  id: string
  /** Lot number on the strata roll, e.g. 12 or "Lot 12". */
  number: string | number
  /** Unit label when different from lot number, e.g. Unit 4B. */
  unit?: string
  /** Unit address within the building. */
  address?: string
  /** Unit entitlement for levy calculations. */
  entitlement?: number
  /** Registered owner display name. */
  ownerName?: string
  /** Current tenant when tenanted. */
  tenantName?: string
  /** Mortgagee on title when recorded. */
  mortgageeName?: string
  /** Managing agent for the lot when appointed. */
  managingAgentName?: string
  levyStatus?: LotLevyStatus
  occupancy?: LotOccupancy
  /** Whether the lot may lodge an AGM proxy. False when in arrears. */
  proxyEligible?: boolean
  /** Parent scheme plan for cross-scheme lists, e.g. SP 1042. */
  schemePlan?: string
  /** Open complaints linked to this lot. */
  openComplaints?: number
}

// ─────────────────────────────────────────────────────────
// Formatting helpers
// ─────────────────────────────────────────────────────────

/**
 * Normalise a lot number for display (Lot 12).
 */
export function formatLotNumber({ number }: { number: string | number }): string {
  const raw = String(number).trim()
  if (!raw) return "Lot —"

  const digits = raw.replace(/^lot\s*/i, "")
  return digits ? `Lot ${digits}` : raw
}

/**
 * Format unit entitlement for display.
 */
export function formatLotEntitlement({
  entitlement,
}: {
  entitlement?: number
}): string | undefined {
  if (entitlement === undefined || Number.isNaN(entitlement)) return undefined
  return entitlement % 1 === 0
    ? String(entitlement)
    : entitlement.toFixed(2)
}

/**
 * Primary occupant label: owner, or tenant when tenanted.
 */
export function formatLotOccupant({
  ownerName,
  tenantName,
  occupancy,
}: Pick<LotSummary, "ownerName" | "tenantName" | "occupancy">): string | undefined {
  if (occupancy === "tenanted" && tenantName) return tenantName
  if (occupancy === "vacant") return "Vacant"
  return ownerName
}

/**
 * Secondary metadata: unit, address, entitlement, scheme plan.
 */
export function formatLotMeta({
  unit,
  address,
  entitlement,
  schemePlan,
  ownerName,
  showOwner = false,
}: Pick<LotSummary, "unit" | "address" | "entitlement" | "schemePlan" | "ownerName"> & {
  showOwner?: boolean
}): string | undefined {
  const entitlementLabel = formatLotEntitlement({ entitlement })
    ? `UE ${formatLotEntitlement({ entitlement })}`
    : undefined

  const parts = [
    unit,
    address,
    entitlementLabel,
    schemePlan,
    showOwner ? ownerName : undefined,
  ].filter(Boolean)

  return parts.length > 0 ? parts.join(" · ") : undefined
}

// ─────────────────────────────────────────────────────────
// LotBadge: mono lot number label
// ─────────────────────────────────────────────────────────

export type LotBadgeSize = "sm" | "md" | "lg"

const lotBadgeSizeMap: Record<LotBadgeSize, "sm" | "md" | "lg"> = {
  sm: "sm",
  md: "md",
  lg: "lg",
}

export interface LotBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  number: string | number
  size?: LotBadgeSize
}

/**
 * Uppercase lot number in mono type. The primary compact lot identifier.
 */
export function LotBadge({
  number,
  size = "md",
  className,
  ...props
}: LotBadgeProps) {
  return (
    <Badge
      variant="mono"
      size={lotBadgeSizeMap[size]}
      data-slot="lot-badge"
      className={className}
      {...props}
    >
      {formatLotNumber({ number })}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// LotLevyBadge: levy collection status
// ─────────────────────────────────────────────────────────

const levyStatusConfig: Record<
  LotLevyStatus,
  { label: string; variant: BadgeVariant; icon: typeof Check }
> = {
  paid: {
    label: "Paid",
    variant: "accent",
    icon: Check,
  },
  due: {
    label: "Due",
    variant: "default",
    icon: Clock,
  },
  overdue: {
    label: "Overdue",
    variant: "destructive",
    icon: AlertCircle,
  },
  not_assessed: {
    label: "Not assessed",
    variant: "default",
    icon: Clock,
  },
}

export interface LotLevyBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: LotLevyStatus
  hideIcon?: boolean
}

/**
 * Levy status badge for owner roll and notice workflows.
 */
export function LotLevyBadge({
  status,
  hideIcon = false,
  className,
  ...props
}: LotLevyBadgeProps) {
  const config = levyStatusConfig[status]

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      hideIcon={hideIcon}
      data-slot="lot-levy-badge"
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// LotProxyBadge: AGM proxy eligibility
// ─────────────────────────────────────────────────────────

export interface LotProxyBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  eligible: boolean
}

/**
 * Proxy eligibility indicator for AGM workflows.
 */
export function LotProxyBadge({
  eligible,
  className,
  ...props
}: LotProxyBadgeProps) {
  return (
    <Badge
      variant={eligible ? "accent" : "default"}
      icon={eligible ? Check : X}
      data-slot="lot-proxy-badge"
      className={className}
      {...props}
    >
      {eligible ? "Proxy eligible" : "Ineligible"}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// LotIcon: lot number tile
// ─────────────────────────────────────────────────────────

export interface LotIconProps extends HTMLAttributes<HTMLDivElement> {
  number: string | number
  size?: "sm" | "md" | "lg"
}

const lotIconSizeClass = {
  sm: "size-8 text-[10px]",
  md: "size-10 text-[11px]",
  lg: "size-12 text-xs",
}

/**
 * Lot number tile for list rows and cards.
 */
export function LotIcon({
  number,
  size = "md",
  className,
  ...props
}: LotIconProps) {
  const digits = String(number).replace(/^lot\s*/i, "").trim()

  return (
    <div
      data-slot="lot-icon"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-sm bg-off-white font-mono font-medium text-forest",
        lotIconSizeClass[size],
        className
      )}
      aria-hidden
      {...props}
    >
      {digits || "—"}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// LotMeta: secondary metadata line
// ─────────────────────────────────────────────────────────

export interface LotMetaProps extends HTMLAttributes<HTMLParagraphElement> {
  lot: Pick<
    LotSummary,
    | "unit"
    | "address"
    | "entitlement"
    | "schemePlan"
    | "ownerName"
    | "tenantName"
    | "occupancy"
    | "managingAgentName"
  >
  /** Show owner or tenant as the lead segment. */
  showOccupant?: boolean
  /** Show a Home icon before the unit or address segment. */
  showUnitIcon?: boolean
}

/**
 * Formatted secondary line: occupant, unit, address, entitlement.
 */
export function LotMeta({
  lot,
  showOccupant = false,
  showUnitIcon = false,
  className,
  ...props
}: LotMetaProps) {
  const occupant = showOccupant
    ? formatLotOccupant({
        ownerName: lot.ownerName,
        tenantName: lot.tenantName,
        occupancy: lot.occupancy,
      })
    : undefined

  const meta = formatLotMeta({
    unit: lot.unit,
    address: lot.address,
    entitlement: showOccupant ? undefined : lot.entitlement,
    schemePlan: lot.schemePlan,
    ownerName: lot.ownerName,
    showOwner: false,
  })

  const agent =
    lot.managingAgentName && showOccupant
      ? `Agent: ${lot.managingAgentName}`
      : undefined

  const entitlementOnly =
    showOccupant && lot.entitlement !== undefined
      ? `UE ${formatLotEntitlement({ entitlement: lot.entitlement })}`
      : undefined

  const parts = [occupant, meta, entitlementOnly, agent].filter(Boolean)
  if (parts.length === 0) return null

  return (
    <p
      data-slot="lot-meta"
      className={cn(
        "font-sans text-xs text-ink-muted truncate flex items-center gap-1 min-w-0",
        className
      )}
      {...props}
    >
      {showUnitIcon && (lot.unit || lot.address) ? (
        <Home
          className="size-3.5 shrink-0 text-forest"
          strokeWidth={1.5}
          aria-hidden
        />
      ) : null}
      <span className="truncate">{parts.join(" · ")}</span>
    </p>
  )
}

// ─────────────────────────────────────────────────────────
// LotIdentity: compact inline reference
// ─────────────────────────────────────────────────────────

export interface LotIdentityProps extends HTMLAttributes<HTMLDivElement> {
  lot: Pick<LotSummary, "number" | "unit" | "ownerName" | "tenantName" | "occupancy">
  size?: "sm" | "md"
  showUnit?: boolean
}

/**
 * Compact lot reference for breadcrumbs, tags, and table cells.
 */
export function LotIdentity({
  lot,
  size = "md",
  showUnit = true,
  className,
  ...props
}: LotIdentityProps) {
  const occupant = formatLotOccupant({
    ownerName: lot.ownerName,
    tenantName: lot.tenantName,
    occupancy: lot.occupancy,
  })

  return (
    <div
      data-slot="lot-identity"
      className={cn("flex min-w-0 items-center gap-2.5", className)}
      {...props}
    >
      <LotIcon number={lot.number} size={size === "sm" ? "sm" : "md"} />

      <div className="min-w-0">
        <p
          className={cn(
            "font-sans font-semibold text-ink truncate",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {formatLotNumber({ number: lot.number })}
          {showUnit && lot.unit ? (
            <span className="font-normal text-ink-muted"> · {lot.unit}</span>
          ) : null}
        </p>
        {occupant ? (
          <p className="text-xs text-ink-muted truncate">{occupant}</p>
        ) : null}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// LotCard: list, card, compact, and wide layouts
// ─────────────────────────────────────────────────────────

export interface LotCardProps extends HTMLAttributes<HTMLElement> {
  lot: LotSummary
  layout?: LotLayout
  href?: string
  showChevron?: boolean
  showLevyStatus?: boolean
  showProxyStatus?: boolean
  showScheme?: boolean
  selected?: boolean
  actions?: ReactNode
}

function LotCardShell({
  layout,
  selected,
  href,
  className,
  children,
  lot: _lot,
  showChevron: _showChevron,
  showLevyStatus: _showLevyStatus,
  showProxyStatus: _showProxyStatus,
  showScheme: _showScheme,
  actions: _actions,
  ...props
}: LotCardProps & { children: ReactNode }) {
  const shellClass = cn(
    "group/lot transition-colors duration-150",
    layout === "list" &&
      "flex items-center gap-3 px-4 py-3 hover:bg-off-white/70",
    layout === "card" &&
      "flex h-full flex-col rounded-md border border-border bg-white p-4 hover:border-ink-muted/40 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
    layout === "compact" &&
      "flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-off-white/70",
    layout === "wide" &&
      "grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,0.6fr)_72px_88px_96px_auto] items-center gap-4 px-4 py-3 hover:bg-off-white/70",
    selected && "bg-lime-soft/60",
    href && "cursor-pointer no-underline text-inherit",
    className
  )

  if (href) {
    return (
      <a
        data-slot="lot-card"
        href={href}
        className={shellClass}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <div data-slot="lot-card" className={shellClass} {...props}>
      {children}
    </div>
  )
}

/**
 * Lot row, card, or table row for strata rolls and pickers.
 */
export function LotCard({
  lot,
  layout = "list",
  href,
  showChevron = false,
  showLevyStatus = false,
  showProxyStatus = false,
  showScheme = false,
  selected = false,
  actions,
  className,
  ...props
}: LotCardProps) {
  const occupant = formatLotOccupant({
    ownerName: lot.ownerName,
    tenantName: lot.tenantName,
    occupancy: lot.occupancy,
  })

  if (layout === "compact") {
    return (
      <LotCardShell
        lot={lot}
        layout={layout}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        <LotBadge number={lot.number} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-ink truncate">
            {occupant ?? formatLotNumber({ number: lot.number })}
          </p>
          {lot.unit ? (
            <p className="text-[10px] text-ink-muted truncate">{lot.unit}</p>
          ) : null}
        </div>
        {showLevyStatus && lot.levyStatus ? (
          <LotLevyBadge status={lot.levyStatus} hideIcon />
        ) : null}
        {showChevron ? (
          <ChevronRight
            className="size-3.5 shrink-0 text-ink-muted"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
      </LotCardShell>
    )
  }

  if (layout === "card") {
    return (
      <LotCardShell
        lot={lot}
        layout={layout}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <LotIcon number={lot.number} size="lg" />
          <div className="flex flex-col items-end gap-1.5">
            {showLevyStatus && lot.levyStatus ? (
              <LotLevyBadge status={lot.levyStatus} hideIcon />
            ) : null}
            {showProxyStatus && lot.proxyEligible !== undefined ? (
              <LotProxyBadge eligible={lot.proxyEligible} />
            ) : null}
          </div>
        </div>

        {/* Occupant + meta */}
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-semibold text-ink line-clamp-2">
            {occupant ?? "No owner recorded"}
          </p>
          <LotMeta lot={lot} showUnitIcon className="mt-1" />
          {showScheme && lot.schemePlan ? (
            <p className="mt-2 font-mono text-[10px] text-ink-muted">
              {lot.schemePlan}
            </p>
          ) : null}
        </div>

        {/* Footer */}
        {(actions || showChevron) && (
          <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
            {actions}
            {showChevron ? (
              <ChevronRight
                className="size-4 shrink-0 text-ink-muted"
                strokeWidth={1.5}
                aria-hidden
              />
            ) : null}
          </div>
        )}
      </LotCardShell>
    )
  }

  if (layout === "wide") {
    return (
      <LotCardShell
        lot={lot}
        layout={layout}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        {/* Lot + unit */}
        <div className="flex min-w-0 items-center gap-3">
          <LotIcon number={lot.number} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">
              {formatLotNumber({ number: lot.number })}
            </p>
            <p className="text-xs text-ink-muted truncate">
              {lot.unit ?? lot.address ?? "—"}
            </p>
          </div>
        </div>

        {/* Owner / occupant */}
        <div className="min-w-0 flex items-center gap-2">
          {occupant ? (
            <>
              <User
                className="size-3.5 shrink-0 text-ink-muted"
                strokeWidth={1.5}
                aria-hidden
              />
              <p className="text-sm text-ink truncate">{occupant}</p>
            </>
          ) : (
            <p className="text-sm text-ink-muted">—</p>
          )}
        </div>

        {/* Entitlement */}
        <p className="text-sm font-mono text-ink-muted tabular-nums">
          {formatLotEntitlement({ entitlement: lot.entitlement }) ?? "—"}
        </p>

        {/* Levy */}
        <div>
          {showLevyStatus && lot.levyStatus ? (
            <LotLevyBadge status={lot.levyStatus} hideIcon />
          ) : (
            <p className="text-sm text-ink-muted">—</p>
          )}
        </div>

        {/* Proxy */}
        <div>
          {showProxyStatus && lot.proxyEligible !== undefined ? (
            <LotProxyBadge eligible={lot.proxyEligible} />
          ) : (
            <p className="text-sm text-ink-muted">—</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-1">
          {actions}
          {showChevron ? (
            <ChevronRight
              className="size-4 shrink-0 text-ink-muted"
              strokeWidth={1.5}
              aria-hidden
            />
          ) : null}
        </div>
      </LotCardShell>
    )
  }

  // Default: list layout
  return (
    <LotCardShell
      lot={lot}
      layout={layout}
      href={href}
      selected={selected}
      className={className}
      {...props}
    >
      <LotIcon number={lot.number} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <p className="font-sans text-sm font-semibold text-ink truncate">
            {occupant ?? formatLotNumber({ number: lot.number })}
          </p>
          {showLevyStatus && lot.levyStatus ? (
            <LotLevyBadge status={lot.levyStatus} hideIcon className="shrink-0" />
          ) : null}
        </div>
        <LotMeta lot={lot} showUnitIcon className="mt-0.5" />
      </div>

      {showScheme && lot.schemePlan ? (
        <span className="hidden md:inline font-mono text-[10px] text-ink-muted shrink-0">
          {lot.schemePlan}
        </span>
      ) : null}

      <div className="flex shrink-0 items-center gap-1">
        {actions}
        {showChevron ? (
          <ChevronRight
            className="size-4 shrink-0 text-ink-muted"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
      </div>
    </LotCardShell>
  )
}

// ─────────────────────────────────────────────────────────
// LotList / LotGrid: layout containers
// ─────────────────────────────────────────────────────────

export interface LotListProps extends HTMLAttributes<HTMLDivElement> {
  /** Render column headings above wide-layout rows. */
  showWideHeader?: boolean
  /** Optional roll summary above the list. */
  header?: ReactNode
}

/**
 * Bordered list container for lot rows (strata roll).
 */
export function LotList({
  showWideHeader = false,
  header,
  className,
  children,
  ...props
}: LotListProps) {
  return (
    <div data-slot="lot-list" className={cn("space-y-3", className)} {...props}>
      {header}

      <div className="overflow-hidden rounded-sm border border-border bg-white">
        {showWideHeader ? (
          <div className="grid grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)_minmax(0,0.6fr)_72px_88px_96px_auto] gap-4 border-b border-border bg-off-white px-4 py-2">
            {["Lot", "Owner", "Entitlement", "Levy", "Proxy", ""].map((heading) => (
              <p
                key={heading || "actions"}
                className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted"
              >
                {heading}
              </p>
            ))}
          </div>
        ) : null}
        <div className="divide-y divide-border">{children}</div>
      </div>
    </div>
  )
}

export interface LotGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4
  gap?: "sm" | "md" | "lg"
}

const lotGridGapClass = {
  sm: "gap-4",
  md: "gap-5 md:gap-6",
  lg: "gap-6 md:gap-8",
}

/**
 * Responsive grid for card-layout lot tiles.
 */
export function LotGrid({
  columns = 3,
  gap = "md",
  className,
  children,
  ...props
}: LotGridProps) {
  return (
    <div
      data-slot="lot-grid"
      className={cn(
        "grid grid-cols-1",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
        lotGridGapClass[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// LotRollHeader: strata roll summary strip
// ─────────────────────────────────────────────────────────

export interface LotRollHeaderProps extends HTMLAttributes<HTMLDivElement> {
  totalLots: number
  paidCount?: number
  dueCount?: number
  overdueCount?: number
  title?: string
}

/**
 * Summary counts above a strata roll list.
 */
export function LotRollHeader({
  totalLots,
  paidCount,
  dueCount,
  overdueCount,
  title = "Strata roll",
  className,
  ...props
}: LotRollHeaderProps) {
  return (
    <div
      data-slot="lot-roll-header"
      className={cn(
        "flex flex-wrap items-end justify-between gap-4 px-1",
        className
      )}
      {...props}
    >
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">
          {title}
        </p>
        <p className="text-sm font-semibold text-ink">
          {totalLots} lot{totalLots === 1 ? "" : "s"}
        </p>
      </div>

      {(paidCount !== undefined ||
        dueCount !== undefined ||
        overdueCount !== undefined) && (
        <div className="flex flex-wrap gap-2">
          {paidCount !== undefined ? (
            <Badge variant="accent" icon={Check}>
              {paidCount} paid
            </Badge>
          ) : null}
          {dueCount !== undefined && dueCount > 0 ? (
            <Badge variant="default" icon={Clock}>
              {dueCount} due
            </Badge>
          ) : null}
          {overdueCount !== undefined && overdueCount > 0 ? (
            <Badge variant="destructive" icon={AlertCircle}>
              {overdueCount} overdue
            </Badge>
          ) : null}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Demo data for documentation
// ─────────────────────────────────────────────────────────

export const LOT_DEMO_ITEMS: LotSummary[] = [
  {
    id: "lot_12",
    number: 12,
    unit: "Unit 12",
    address: "12/100 Harbour St",
    entitlement: 85,
    ownerName: "James & Sarah Chen",
    occupancy: "owner_occupied",
    levyStatus: "paid",
    proxyEligible: true,
    schemePlan: "SP 1042",
  },
  {
    id: "lot_14",
    number: 14,
    unit: "Unit 14",
    address: "14/100 Harbour St",
    entitlement: 85,
    ownerName: "North Shore Investments Pty Ltd",
    tenantName: "Alex Rivera",
    occupancy: "tenanted",
    managingAgentName: "Coastal Realty",
    levyStatus: "due",
    proxyEligible: true,
    schemePlan: "SP 1042",
  },
  {
    id: "lot_18",
    number: 18,
    unit: "Unit 18",
    address: "18/100 Harbour St",
    entitlement: 92,
    ownerName: "Margaret O'Brien",
    occupancy: "owner_occupied",
    levyStatus: "paid",
    proxyEligible: true,
    openComplaints: 1,
    schemePlan: "SP 1042",
  },
  {
    id: "lot_22",
    number: 22,
    unit: "Penthouse",
    address: "PH/100 Harbour St",
    entitlement: 120,
    ownerName: "Harbour Holdings Ltd",
    occupancy: "vacant",
    levyStatus: "overdue",
    proxyEligible: false,
    schemePlan: "SP 1042",
  },
  {
    id: "lot_3",
    number: 3,
    unit: "Unit 3",
    entitlement: 72,
    ownerName: "Priya Sharma",
    mortgageeName: "ANZ Banking Group",
    occupancy: "owner_occupied",
    levyStatus: "paid",
    proxyEligible: true,
    schemePlan: "SP 8871",
  },
  {
    id: "lot_7",
    number: 7,
    unit: "Unit 7",
    entitlement: 72,
    ownerName: "Daniel Wu",
    tenantName: "Kim & Pat Foster",
    occupancy: "tenanted",
    levyStatus: "overdue",
    proxyEligible: false,
    schemePlan: "SP 8871",
  },
] as const

export const LOT_DEMO_ROLL = LOT_DEMO_ITEMS.filter(
  (lot) => lot.schemePlan === "SP 1042"
)
