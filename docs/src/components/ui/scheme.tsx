"use client"

import { cn } from "@/lib/utils"
import { Badge, type BadgeVariant } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertCircle,
  Building2,
  Check,
  ChevronRight,
  ChevronsUpDown,
  Clock,
  MapPin,
} from "lucide-react"
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────
// Scheme: strata scheme identity primitives
//
// Consistent representation of a strata scheme (building /
// owners corporation) across lists, context bars, pickers,
// and inline references.
//
//   list     · dense row for scheme directories
//   card     · tile with key stats for portfolio grids
//   compact  · minimal row for switchers and mentions
//   wide     · tabular row for portfolio tables
// ─────────────────────────────────────────────────────────

export type SchemeLayout = "list" | "card" | "compact" | "wide"

/** Lifecycle state for a scheme in the portfolio. */
export type SchemeStatus = "active" | "onboarding" | "archived" | "attention"

/** Operational health signal derived from compliance and arrears. */
export type SchemeHealth = "good" | "warning" | "critical"

/**
 * Core scheme fields shared across cards, context bars, and pickers.
 * Extend in the app layer with financials, compliance dates, and so on.
 */
export interface SchemeSummary {
  /** Stable identifier for routing and API calls. */
  id: string
  /** Display name, e.g. Harbour View Towers. */
  name: string
  /** Strata plan number, e.g. SP1042 or SP-1042. */
  plan: string
  /** Street address when known. */
  address?: string
  suburb?: string
  state?: string
  /** Total lots on the strata roll. */
  lotCount?: number
  /** Physical units when different from lot count. */
  unitCount?: number
  /** Financial year end, e.g. 30 Jun. */
  financialYearEnd?: string
  /** Assigned strata manager display name. */
  managerName?: string
  status?: SchemeStatus
  health?: SchemeHealth
  /** Open tasks requiring manager action. */
  openTasks?: number
  /** Percentage of lots in arrears, 0–100. */
  arrearsPercent?: number
  /** Optional building photo URL. */
  imageUrl?: string
}

// ─────────────────────────────────────────────────────────
// Formatting helpers
// ─────────────────────────────────────────────────────────

/**
 * Normalise a strata plan number for display (SP 1042).
 */
export function formatSchemePlan({ plan }: { plan: string }): string {
  const trimmed = plan.trim()
  if (!trimmed) return plan

  const digits = trimmed.toUpperCase().replace(/^SP[\s-]*/i, "")
  return digits ? `SP ${digits}` : trimmed.toUpperCase()
}

/**
 * Derive two-letter initials from a scheme name.
 */
export function getSchemeInitials({ name }: { name: string }): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return "??"
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()
  return `${words[0][0] ?? ""}${words[1][0] ?? ""}`.toUpperCase()
}

/**
 * Format suburb, state, and lot count into a single metadata line.
 */
export function formatSchemeLocation({
  suburb,
  state,
  lotCount,
  financialYearEnd,
}: Pick<SchemeSummary, "suburb" | "state" | "lotCount" | "financialYearEnd">): string | undefined {
  const location = [suburb, state].filter(Boolean).join(", ")
  const lots =
    lotCount !== undefined
      ? `${lotCount} lot${lotCount === 1 ? "" : "s"}`
      : undefined
  const fy = financialYearEnd ? `FY end ${financialYearEnd}` : undefined

  const parts = [location, lots, fy].filter(Boolean)
  return parts.length > 0 ? parts.join(" · ") : undefined
}

// ─────────────────────────────────────────────────────────
// SchemeIcon: building tile or initials fallback
// ─────────────────────────────────────────────────────────

export interface SchemeIconProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  imageUrl?: string
  size?: "sm" | "md" | "lg"
}

const iconTileSizeClass = {
  sm: "size-8 text-[10px]",
  md: "size-10 text-[11px]",
  lg: "size-12 text-xs",
}

const iconGlyphSizeClass = {
  sm: "size-4",
  md: "size-5",
  lg: "size-6",
}

/**
 * Scheme avatar tile. Shows a photo when provided, otherwise
 * initials on lime-soft or a Building2 icon for compact layouts.
 */
export function SchemeIcon({
  name,
  imageUrl,
  size = "md",
  className,
  children,
  ...props
}: SchemeIconProps) {
  const initials = getSchemeInitials({ name })

  if (imageUrl) {
    return (
      <div
        data-slot="scheme-icon"
        className={cn(
          "flex shrink-0 items-center justify-center overflow-hidden rounded-sm bg-off-white",
          iconTileSizeClass[size],
          className
        )}
        {...props}
      >
        <img
          src={imageUrl}
          alt=""
          className="size-full object-cover"
        />
        {children}
      </div>
    )
  }

  return (
    <div
      data-slot="scheme-icon"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-sm bg-lime-soft font-display text-forest",
        iconTileSizeClass[size],
        className
      )}
      aria-hidden={!children}
      {...props}
    >
      {children ?? (
        <span className="font-display leading-none">{initials}</span>
      )}
    </div>
  )
}

/** Building2 icon variant for extra-compact references. */
export function SchemeIconGlyph({
  size = "md",
  className,
}: {
  size?: "sm" | "md" | "lg"
  className?: string
}) {
  return (
    <div
      data-slot="scheme-icon-glyph"
      className={cn(
        "flex shrink-0 items-center justify-center rounded-sm bg-lime-soft text-forest",
        iconTileSizeClass[size],
        className
      )}
    >
      <Building2
        className={iconGlyphSizeClass[size]}
        strokeWidth={1.5}
        aria-hidden
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SchemePlanBadge: mono SP number label
// ─────────────────────────────────────────────────────────

export interface SchemePlanBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  plan: string
}

/**
 * Uppercase strata plan number in mono type.
 */
export function SchemePlanBadge({
  plan,
  className,
  ...props
}: SchemePlanBadgeProps) {
  return (
    <Badge
      variant="mono"
      size="sm"
      data-slot="scheme-plan-badge"
      className={className}
      {...props}
    >
      {formatSchemePlan({ plan })}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// SchemeStatusBadge: portfolio lifecycle state
// ─────────────────────────────────────────────────────────

const statusConfig: Record<
  SchemeStatus,
  { label: string; variant: BadgeVariant; icon: typeof Check }
> = {
  active: {
    label: "Active",
    variant: "accent",
    icon: Check,
  },
  onboarding: {
    label: "Onboarding",
    variant: "warning",
    icon: Clock,
  },
  archived: {
    label: "Archived",
    variant: "default",
    icon: Building2,
  },
  attention: {
    label: "Needs attention",
    variant: "destructive",
    icon: AlertCircle,
  },
}

export interface SchemeStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: SchemeStatus
  /** Hide the leading icon for dense table cells. */
  hideIcon?: boolean
}

/**
 * Lifecycle badge for scheme portfolio lists.
 */
export function SchemeStatusBadge({
  status,
  hideIcon = false,
  className,
  ...props
}: SchemeStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      hideIcon={hideIcon}
      data-slot="scheme-status-badge"
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// SchemeHealthIndicator: compliance / arrears signal
// ─────────────────────────────────────────────────────────

const healthConfig: Record<SchemeHealth, { label: string; dotClass: string }> = {
  good: { label: "Healthy", dotClass: "bg-lime" },
  warning: { label: "Watch", dotClass: "bg-warning" },
  critical: { label: "At risk", dotClass: "bg-danger" },
}

export interface SchemeHealthIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  health: SchemeHealth
  showLabel?: boolean
}

/**
 * Dot indicator for scheme operational health.
 */
export function SchemeHealthIndicator({
  health,
  showLabel = true,
  className,
  ...props
}: SchemeHealthIndicatorProps) {
  const config = healthConfig[health]

  return (
    <span
      data-slot="scheme-health"
      className={cn("inline-flex items-center gap-1.5 text-xs text-ink-muted", className)}
      {...props}
    >
      <span
        className={cn("size-2 shrink-0 rounded-full", config.dotClass)}
        aria-hidden
      />
      {showLabel ? <span>{config.label}</span> : null}
    </span>
  )
}

// ─────────────────────────────────────────────────────────
// SchemeMeta: secondary metadata line
// ─────────────────────────────────────────────────────────

export interface SchemeMetaProps extends HTMLAttributes<HTMLParagraphElement> {
  scheme: Pick<
    SchemeSummary,
    "suburb" | "state" | "lotCount" | "financialYearEnd" | "managerName"
  >
  /** Include the manager name at the end of the line. */
  showManager?: boolean
  /** Show a MapPin icon before the location segment. */
  showLocationIcon?: boolean
}

/**
 * Formatted secondary line: location, lots, FY end, and optional manager.
 */
export function SchemeMeta({
  scheme,
  showManager = false,
  showLocationIcon = false,
  className,
  ...props
}: SchemeMetaProps) {
  const location = formatSchemeLocation({
    suburb: scheme.suburb,
    state: scheme.state,
    lotCount: scheme.lotCount,
    financialYearEnd: showManager ? undefined : scheme.financialYearEnd,
  })
  const manager = showManager && scheme.managerName ? scheme.managerName : undefined
  const fyOnly =
    showManager && scheme.financialYearEnd
      ? `FY end ${scheme.financialYearEnd}`
      : undefined

  const parts = [location, fyOnly, manager].filter(Boolean)
  if (parts.length === 0) return null

  return (
    <p
      data-slot="scheme-meta"
      className={cn(
        "font-sans text-xs text-ink-muted truncate flex items-center gap-1 min-w-0",
        className
      )}
      {...props}
    >
      {showLocationIcon && scheme.suburb ? (
        <MapPin
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
// SchemeStat: metric chip for context bars and cards
// ─────────────────────────────────────────────────────────

export interface SchemeStatProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  value: ReactNode
  /** Emphasise the value when attention is required. */
  tone?: "default" | "warning" | "danger"
}

const statToneClass = {
  default: "text-ink",
  warning: "text-warning",
  danger: "text-danger",
}

/**
 * Label + value pair for scheme summary metrics.
 */
export function SchemeStat({
  label,
  value,
  tone = "default",
  className,
  ...props
}: SchemeStatProps) {
  return (
    <div
      data-slot="scheme-stat"
      className={cn("min-w-0", className)}
      {...props}
    >
      <p className="text-[10px] font-medium uppercase tracking-wide text-ink-muted truncate">
        {label}
      </p>
      <p
        className={cn(
          "text-sm font-semibold text-ink truncate",
          statToneClass[tone]
        )}
      >
        {value}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SchemeIdentity: compact inline reference
// ─────────────────────────────────────────────────────────

export interface SchemeIdentityProps extends HTMLAttributes<HTMLDivElement> {
  scheme: Pick<SchemeSummary, "name" | "plan" | "imageUrl">
  /** Use initials tile (default) or Building2 glyph. */
  variant?: "initials" | "glyph"
  size?: "sm" | "md"
  showPlan?: boolean
}

/**
 * Compact scheme reference for breadcrumbs, table cells, and tags.
 */
export function SchemeIdentity({
  scheme,
  variant = "initials",
  size = "md",
  showPlan = true,
  className,
  ...props
}: SchemeIdentityProps) {
  const iconSize = size === "sm" ? "sm" : "md"

  return (
    <div
      data-slot="scheme-identity"
      className={cn("flex min-w-0 items-center gap-2.5", className)}
      {...props}
    >
      {variant === "glyph" ? (
        <SchemeIconGlyph size={iconSize} />
      ) : (
        <SchemeIcon
          name={scheme.name}
          imageUrl={scheme.imageUrl}
          size={iconSize}
        />
      )}

      <div className="min-w-0">
        <p
          className={cn(
            "font-sans font-semibold text-ink truncate",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {scheme.name}
        </p>
        {showPlan ? (
          <p className="font-mono text-[10px] text-ink-muted truncate">
            {formatSchemePlan({ plan: scheme.plan })}
          </p>
        ) : null}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SchemeCard: list, card, compact, and wide layouts
// ─────────────────────────────────────────────────────────

export interface SchemeCardProps extends HTMLAttributes<HTMLElement> {
  scheme: SchemeSummary
  layout?: SchemeLayout
  href?: string
  showChevron?: boolean
  showStatus?: boolean
  showHealth?: boolean
  showPlan?: boolean
  selected?: boolean
  actions?: ReactNode
}

function SchemeCardShell({
  layout,
  selected,
  href,
  className,
  children,
  scheme: _scheme,
  showChevron: _showChevron,
  showStatus: _showStatus,
  showHealth: _showHealth,
  showPlan: _showPlan,
  actions: _actions,
  ...props
}: SchemeCardProps & { children: ReactNode }) {
  const shellClass = cn(
    "group/scheme transition-colors duration-150",
    layout === "list" &&
      "flex items-center gap-3 px-4 py-3 hover:bg-off-white/70",
    layout === "card" &&
      "flex h-full flex-col rounded-md border border-border bg-white p-4 hover:border-ink-muted/40 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
    layout === "compact" &&
      "flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-off-white/70",
    layout === "wide" &&
      "grid grid-cols-[minmax(0,1.4fr)_100px_72px_88px_100px_auto] items-center gap-4 px-4 py-3 hover:bg-off-white/70",
    selected && "bg-lime-soft/60",
    href && "cursor-pointer no-underline text-inherit",
    className
  )

  if (href) {
    return (
      <a
        data-slot="scheme-card"
        href={href}
        className={shellClass}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <div data-slot="scheme-card" className={shellClass} {...props}>
      {children}
    </div>
  )
}

/**
 * Scheme row, card, or table row for portfolio views.
 */
export function SchemeCard({
  scheme,
  layout = "list",
  href,
  showChevron = false,
  showStatus = false,
  showHealth = false,
  showPlan = true,
  selected = false,
  actions,
  className,
  ...props
}: SchemeCardProps) {
  const metaLine = formatSchemeLocation({
    suburb: scheme.suburb,
    state: scheme.state,
    lotCount: scheme.lotCount,
    financialYearEnd: scheme.financialYearEnd,
  })

  if (layout === "compact") {
    return (
      <SchemeCardShell
        scheme={scheme}
        layout={layout}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        <SchemeIcon name={scheme.name} imageUrl={scheme.imageUrl} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-ink truncate">{scheme.name}</p>
          {showPlan ? (
            <p className="font-mono text-[10px] text-ink-muted truncate">
              {formatSchemePlan({ plan: scheme.plan })}
            </p>
          ) : null}
        </div>
        {showChevron ? (
          <ChevronRight
            className="size-3.5 shrink-0 text-ink-muted"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
      </SchemeCardShell>
    )
  }

  if (layout === "card") {
    return (
      <SchemeCardShell
        scheme={scheme}
        layout={layout}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        {/* Header: icon + status */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <SchemeIcon name={scheme.name} imageUrl={scheme.imageUrl} size="lg" />
          <div className="flex flex-col items-end gap-1.5">
            {showPlan ? <SchemePlanBadge plan={scheme.plan} /> : null}
            {showStatus && scheme.status ? (
              <SchemeStatusBadge status={scheme.status} hideIcon />
            ) : null}
          </div>
        </div>

        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-semibold text-ink line-clamp-2">
            {scheme.name}
          </p>
          {metaLine ? (
            <SchemeMeta
              scheme={scheme}
              showLocationIcon
              className="mt-1"
            />
          ) : null}
          {showHealth && scheme.health ? (
            <div className="mt-2">
              <SchemeHealthIndicator health={scheme.health} />
            </div>
          ) : null}
        </div>

        {/* Stats row */}
        {(scheme.openTasks !== undefined || scheme.arrearsPercent !== undefined) && (
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3">
            {scheme.openTasks !== undefined ? (
              <SchemeStat label="Open tasks" value={scheme.openTasks} />
            ) : null}
            {scheme.arrearsPercent !== undefined ? (
              <SchemeStat
                label="In arrears"
                value={`${scheme.arrearsPercent}%`}
                tone={
                  scheme.arrearsPercent > 15
                    ? "danger"
                    : scheme.arrearsPercent > 5
                      ? "warning"
                      : "default"
                }
              />
            ) : null}
          </div>
        )}

        {/* Footer */}
        {(actions || showChevron) && (
          <div className="mt-4 flex items-center justify-end gap-2">
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
      </SchemeCardShell>
    )
  }

  if (layout === "wide") {
    return (
      <SchemeCardShell
        scheme={scheme}
        layout={layout}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        {/* Name column */}
        <div className="flex min-w-0 items-center gap-3">
          <SchemeIcon name={scheme.name} imageUrl={scheme.imageUrl} size="md" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink truncate">{scheme.name}</p>
            <SchemeMeta scheme={scheme} className="mt-0.5" />
          </div>
        </div>

        {/* Plan */}
        <SchemePlanBadge plan={scheme.plan} className="w-fit" />

        {/* Lots */}
        <p className="text-sm text-ink-muted tabular-nums">
          {scheme.lotCount ?? "—"}
        </p>

        {/* Tasks */}
        <p
          className={cn(
            "text-sm tabular-nums",
            scheme.openTasks && scheme.openTasks > 0
              ? "font-semibold text-ink"
              : "text-ink-muted"
          )}
        >
          {scheme.openTasks ?? "—"}
        </p>

        {/* Status / health */}
        <div className="flex flex-col gap-1">
          {showStatus && scheme.status ? (
            <SchemeStatusBadge status={scheme.status} hideIcon />
          ) : null}
          {showHealth && scheme.health ? (
            <SchemeHealthIndicator health={scheme.health} />
          ) : null}
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
      </SchemeCardShell>
    )
  }

  // Default: list layout
  return (
    <SchemeCardShell
      scheme={scheme}
      layout={layout}
      href={href}
      selected={selected}
      className={className}
      {...props}
    >
      <SchemeIconGlyph size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 min-w-0">
          <p className="font-sans text-sm font-semibold text-ink truncate">
            {scheme.name}
          </p>
          {showStatus && scheme.status ? (
            <SchemeStatusBadge status={scheme.status} hideIcon className="shrink-0" />
          ) : null}
        </div>
        <SchemeMeta scheme={scheme} showLocationIcon className="mt-0.5" />
      </div>

      {showPlan ? (
        <SchemePlanBadge plan={scheme.plan} className="hidden sm:inline-flex shrink-0" />
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
    </SchemeCardShell>
  )
}

// ─────────────────────────────────────────────────────────
// SchemeList / SchemeGrid: layout containers
// ─────────────────────────────────────────────────────────

export interface SchemeListProps extends HTMLAttributes<HTMLDivElement> {
  /** Render column headings above wide-layout rows. */
  showWideHeader?: boolean
}

/**
 * Bordered list container for scheme rows.
 */
export function SchemeList({
  showWideHeader = false,
  className,
  children,
  ...props
}: SchemeListProps) {
  return (
    <div
      data-slot="scheme-list"
      className={cn(
        "overflow-hidden rounded-sm border border-border bg-white",
        className
      )}
      {...props}
    >
      {showWideHeader ? (
        <div className="grid grid-cols-[minmax(0,1.4fr)_100px_72px_88px_100px_auto] gap-4 border-b border-border bg-off-white px-4 py-2">
          {["Scheme", "Plan", "Lots", "Tasks", "Status", ""].map((heading) => (
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
  )
}

export interface SchemeGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3
  gap?: "sm" | "md" | "lg"
}

const gridGapClass = {
  sm: "gap-4",
  md: "gap-5 md:gap-6",
  lg: "gap-6 md:gap-8",
}

/**
 * Responsive grid for card-layout scheme tiles.
 */
export function SchemeGrid({
  columns = 3,
  gap = "md",
  className,
  children,
  ...props
}: SchemeGridProps) {
  return (
    <div
      data-slot="scheme-grid"
      className={cn(
        "grid grid-cols-1",
        columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3",
        gridGapClass[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SchemeSwitcher: portfolio scheme picker
// ─────────────────────────────────────────────────────────

export interface SchemeSwitcherProps {
  scheme: SchemeSummary
  schemes?: SchemeSummary[]
  onSelect?: ({ scheme }: { scheme: SchemeSummary }) => void
  className?: string
}

/**
 * Dropdown for switching the active scheme in a context bar or header.
 */
export function SchemeSwitcher({
  scheme,
  schemes = [],
  onSelect,
  className,
}: SchemeSwitcherProps) {
  const options = schemes.length > 0 ? schemes : [scheme]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-sm border border-border bg-white px-2.5 py-1.5 text-left transition-colors duration-150 hover:bg-off-white/70",
          className
        )}
      >
        <SchemeIdentity scheme={scheme} size="sm" showPlan={false} />
        <ChevronsUpDown className="size-4 shrink-0 text-ink-muted" aria-hidden />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-64" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-ink-muted">
            Switch scheme
          </DropdownMenuLabel>
          {options.map((item) => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => onSelect?.({ scheme: item })}
              className="gap-2"
            >
              <SchemeIcon name={item.name} imageUrl={item.imageUrl} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="truncate font-mono text-[10px] text-ink-muted">
                  {formatSchemePlan({ plan: item.plan })}
                </p>
              </div>
              {item.id === scheme.id ? (
                <Check className="size-4 shrink-0 text-forest" aria-hidden />
              ) : null}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─────────────────────────────────────────────────────────
// SchemeContextBar: active scheme summary strip
// ─────────────────────────────────────────────────────────

export interface SchemeContextBarProps extends HTMLAttributes<HTMLDivElement> {
  scheme: SchemeSummary
  /** Other schemes for the portfolio switcher. Omit to hide the switcher. */
  schemes?: SchemeSummary[]
  onSchemeSelect?: ({ scheme }: { scheme: SchemeSummary }) => void
  /** Replace the default stat strip. */
  stats?: ReactNode
  /** Right-aligned actions (e.g. New task, View roll). */
  actions?: ReactNode
  /** Sticky below the app header. */
  sticky?: boolean
}

/**
 * Persistent scheme context shown at the top of scheme-scoped pages.
 * Surfaces identity, key metrics, switching, and page-level actions.
 */
export function SchemeContextBar({
  scheme,
  schemes,
  onSchemeSelect,
  stats,
  actions,
  sticky = true,
  className,
  ...props
}: SchemeContextBarProps) {
  const defaultStats = (
    <>
      {scheme.lotCount !== undefined ? (
        <SchemeStat label="Lots" value={scheme.lotCount} />
      ) : null}
      {scheme.financialYearEnd ? (
        <SchemeStat label="FY end" value={scheme.financialYearEnd} />
      ) : null}
      {scheme.managerName ? (
        <SchemeStat label="Manager" value={scheme.managerName} />
      ) : null}
      {scheme.openTasks !== undefined ? (
        <SchemeStat
          label="Open tasks"
          value={scheme.openTasks}
          tone={scheme.openTasks > 5 ? "warning" : "default"}
        />
      ) : null}
      {scheme.health ? (
        <div className="flex flex-col justify-center">
          <p className="text-[10px] font-medium uppercase tracking-wide text-ink-muted mb-0.5">
            Health
          </p>
          <SchemeHealthIndicator health={scheme.health} />
        </div>
      ) : null}
    </>
  )

  return (
    <div
      data-slot="scheme-context-bar"
      className={cn(
        "border-b border-border bg-white",
        sticky && "sticky top-0 z-20",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:gap-6">
        {/* Identity + switcher */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {schemes && schemes.length > 0 ? (
            <SchemeSwitcher
              scheme={scheme}
              schemes={schemes}
              onSelect={onSchemeSelect}
            />
          ) : (
            <SchemeIdentity scheme={scheme} size="md" />
          )}
          <SchemePlanBadge plan={scheme.plan} className="hidden sm:inline-flex shrink-0" />
          {scheme.status ? (
            <SchemeStatusBadge
              status={scheme.status}
              className="hidden md:inline-flex shrink-0"
            />
          ) : null}
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:flex-1 lg:justify-center">
          {stats ?? defaultStats}
        </div>

        {/* Actions */}
        {actions ? (
          <div className="flex shrink-0 items-center gap-2 lg:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Demo data for documentation
// ─────────────────────────────────────────────────────────

export const SCHEME_DEMO_ITEMS: SchemeSummary[] = [
  {
    id: "sch_1",
    name: "Harbour View Towers",
    plan: "SP1042",
    suburb: "Darling Harbour",
    state: "NSW",
    lotCount: 52,
    unitCount: 48,
    financialYearEnd: "30 Jun",
    managerName: "Jane Smith",
    status: "active",
    health: "good",
    openTasks: 3,
    arrearsPercent: 4,
  },
  {
    id: "sch_2",
    name: "Parkside Residences",
    plan: "SP8871",
    suburb: "Surry Hills",
    state: "NSW",
    lotCount: 12,
    financialYearEnd: "31 Dec",
    managerName: "Jane Smith",
    status: "attention",
    health: "warning",
    openTasks: 8,
    arrearsPercent: 12,
  },
  {
    id: "sch_3",
    name: "Northbridge Estate",
    plan: "SP2204",
    suburb: "Northbridge",
    state: "NSW",
    lotCount: 24,
    financialYearEnd: "30 Jun",
    managerName: "Alex Chen",
    status: "onboarding",
    health: "good",
    openTasks: 14,
    arrearsPercent: 0,
  },
  {
    id: "sch_4",
    name: "Coastal Gardens",
    plan: "SP5510",
    suburb: "Bondi",
    state: "NSW",
    lotCount: 8,
    financialYearEnd: "30 Jun",
    managerName: "Jane Smith",
    status: "archived",
    health: "good",
    openTasks: 0,
    arrearsPercent: 0,
  },
] as const

export const SCHEME_DEMO_ACTIVE = SCHEME_DEMO_ITEMS[0]
