import { Avatar, type AvatarProps } from "@/components/ui/avatar"
import {
  formatLotNumber,
  LotBadge,
  LotLevyBadge,
  type LotLevyStatus,
} from "@/components/ui/lot"
import { Badge, type BadgeVariant } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Building2,
  ChevronRight,
  Mail,
  Phone,
  Shield,
  Users,
} from "lucide-react"
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────
// Owner: registered proprietor identity primitives
//
// An owner is a person or entity on the strata roll. Owners
// may hold one or more lots and receive levy notices,
// correspondence, and portal access.
//
//   OwnerRollRow  · list and wide rows for owner directories
//   OwnerCard     · card and compact tiles for profiles and pickers
// ─────────────────────────────────────────────────────────

export type OwnerRollLayout = "list" | "wide"
export type OwnerCardLayout = "card" | "compact"

/** Legal form of the registered proprietor. */
export type OwnerType = "individual" | "company" | "joint"

/** Owner portal registration state. */
export type OwnerPortalStatus = "active" | "invited" | "not_registered"

/** Preferred channel for official notices. */
export type OwnerCorrespondenceMethod = "email" | "post" | "portal"

/** Lot reference when an owner holds multiple lots. */
export interface OwnerLotRef {
  number: string | number
  unit?: string
}

/**
 * Core owner fields shared across roll rows, cards, and profiles.
 * Extend in the app with settlement history, mortgagee details, and tenants.
 */
export interface OwnerSummary {
  /** Stable identifier for routing and API calls. */
  id: string
  /** Display name of the registered proprietor. */
  name: string
  type?: OwnerType
  email?: string
  phone?: string
  /** Lots owned by this proprietor. */
  lots?: OwnerLotRef[]
  mailingAddress?: string
  /** Worst-case or primary lot levy status for roll summaries. */
  levyStatus?: LotLevyStatus
  portalStatus?: OwnerPortalStatus
  correspondence?: OwnerCorrespondenceMethod
  /** Parent scheme plan for cross-scheme directories. */
  schemePlan?: string
  avatarUrl?: string
  /** Serves on the owners corporation committee. */
  isCommitteeMember?: boolean
  openComplaints?: number
}

// ─────────────────────────────────────────────────────────
// Formatting helpers
// ─────────────────────────────────────────────────────────

/**
 * Format owned lots as a readable string (Lot 12, Lot 14).
 */
export function formatOwnerLots({
  lots,
}: {
  lots?: OwnerLotRef[]
}): string | undefined {
  if (!lots?.length) return undefined
  return lots.map((lot) => formatLotNumber({ number: lot.number })).join(", ")
}

/**
 * Format email and phone for metadata lines.
 */
export function formatOwnerContact({
  email,
  phone,
}: Pick<OwnerSummary, "email" | "phone">): string | undefined {
  const parts = [email, phone].filter(Boolean)
  return parts.length > 0 ? parts.join(" · ") : undefined
}

// ─────────────────────────────────────────────────────────
// OwnerAvatar: round avatar for strata roll proprietors
//
// System users (managers, staff) use the square Avatar.
// Owners use a circle to distinguish external proprietors
// from internal team members in mixed lists.
// ─────────────────────────────────────────────────────────

export type OwnerAvatarProps = Omit<AvatarProps, "shape">

/**
 * Round avatar for registered proprietors on the strata roll.
 */
export function OwnerAvatar({ className, ...props }: OwnerAvatarProps) {
  return <Avatar shape="round" className={className} {...props} />
}

// ─────────────────────────────────────────────────────────
// OwnerTypeBadge: individual, company, or joint
// ─────────────────────────────────────────────────────────

const ownerTypeConfig: Record<
  OwnerType,
  { label: string; variant: BadgeVariant; icon: typeof Users }
> = {
  individual: {
    label: "Individual",
    variant: "default",
    icon: Users,
  },
  company: {
    label: "Company",
    variant: "accent",
    icon: Building2,
  },
  joint: {
    label: "Joint",
    variant: "default",
    icon: Users,
  },
}

export interface OwnerTypeBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  type: OwnerType
  hideIcon?: boolean
}

/**
 * Legal form badge for owner roll rows.
 */
export function OwnerTypeBadge({
  type,
  hideIcon = false,
  className,
  ...props
}: OwnerTypeBadgeProps) {
  const config = ownerTypeConfig[type]

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      hideIcon={hideIcon}
      data-slot="owner-type-badge"
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// OwnerPortalBadge: portal registration state
// ─────────────────────────────────────────────────────────

const portalStatusConfig: Record<
  OwnerPortalStatus,
  { label: string; variant: BadgeVariant }
> = {
  active: {
    label: "Portal active",
    variant: "accent",
  },
  invited: {
    label: "Invited",
    variant: "warning",
  },
  not_registered: {
    label: "Not registered",
    variant: "default",
  },
}

export interface OwnerPortalBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: OwnerPortalStatus
}

/**
 * Owner portal registration badge.
 */
export function OwnerPortalBadge({
  status,
  className,
  ...props
}: OwnerPortalBadgeProps) {
  const config = portalStatusConfig[status]

  return (
    <Badge
      variant={config.variant}
      data-slot="owner-portal-badge"
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// OwnerCorrespondenceBadge: notice delivery preference
// ─────────────────────────────────────────────────────────

const correspondenceConfig: Record<
  OwnerCorrespondenceMethod,
  { label: string; icon: typeof Mail }
> = {
  email: { label: "Email", icon: Mail },
  post: { label: "Post", icon: Mail },
  portal: { label: "Portal", icon: Mail },
}

export interface OwnerCorrespondenceBadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  method: OwnerCorrespondenceMethod
}

/**
 * Preferred notice delivery channel.
 */
export function OwnerCorrespondenceBadge({
  method,
  className,
  ...props
}: OwnerCorrespondenceBadgeProps) {
  const config = correspondenceConfig[method]

  return (
    <Badge
      variant="outline"
      icon={config.icon}
      data-slot="owner-correspondence-badge"
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// OwnerCommitteeBadge: committee member indicator
// ─────────────────────────────────────────────────────────

export interface OwnerCommitteeBadgeProps extends HTMLAttributes<HTMLSpanElement> {}

/**
 * Badge for owners who serve on the committee.
 */
export function OwnerCommitteeBadge({
  className,
  ...props
}: OwnerCommitteeBadgeProps) {
  return (
    <Badge
      variant="accent"
      icon={Shield}
      data-slot="owner-committee-badge"
      className={className}
      {...props}
    >
      Committee
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// OwnerLotChips: owned lots as LotBadge chips
// ─────────────────────────────────────────────────────────

export interface OwnerLotChipsProps extends HTMLAttributes<HTMLDivElement> {
  lots?: OwnerLotRef[]
  /** Maximum badges before showing an overflow count. */
  max?: number
  badgeSize?: "sm" | "md" | "lg"
}

/**
 * Row of lot badges for an owner's holdings.
 */
export function OwnerLotChips({
  lots = [],
  max = 3,
  badgeSize = "sm",
  className,
  ...props
}: OwnerLotChipsProps) {
  if (lots.length === 0) return null

  const visible = lots.slice(0, max)
  const overflow = lots.length - visible.length

  return (
    <div
      data-slot="owner-lot-chips"
      className={cn("flex flex-wrap items-center gap-1", className)}
      {...props}
    >
      {visible.map((lot) => (
        <LotBadge
          key={`${lot.number}-${lot.unit ?? ""}`}
          number={lot.number}
          size={badgeSize}
        />
      ))}
      {overflow > 0 ? (
        <span className="text-xs text-ink-muted">+{overflow}</span>
      ) : null}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// OwnerContactMeta: email and phone line
// ─────────────────────────────────────────────────────────

export interface OwnerContactMetaProps extends HTMLAttributes<HTMLParagraphElement> {
  owner: Pick<OwnerSummary, "email" | "phone" | "mailingAddress">
  showIcons?: boolean
  /** Include mailing address after contact details. */
  showAddress?: boolean
}

/**
 * Secondary contact line for owner rows and cards.
 */
export function OwnerContactMeta({
  owner,
  showIcons = false,
  showAddress = false,
  className,
  ...props
}: OwnerContactMetaProps) {
  const contact = formatOwnerContact({ email: owner.email, phone: owner.phone })
  const parts = [contact, showAddress ? owner.mailingAddress : undefined].filter(
    Boolean
  )

  if (parts.length === 0) return null

  return (
    <p
      data-slot="owner-contact-meta"
      className={cn(
        "font-sans text-xs text-ink-muted truncate flex items-center gap-1 min-w-0",
        className
      )}
      {...props}
    >
      {showIcons && owner.email ? (
        <Mail className="size-3.5 shrink-0 text-forest" strokeWidth={1.5} aria-hidden />
      ) : null}
      <span className="truncate">{parts.join(" · ")}</span>
      {showIcons && owner.phone ? (
        <Phone className="size-3.5 shrink-0 text-ink-muted ml-1" strokeWidth={1.5} aria-hidden />
      ) : null}
    </p>
  )
}

// ─────────────────────────────────────────────────────────
// OwnerIdentity: compact inline reference
// ─────────────────────────────────────────────────────────

export interface OwnerIdentityProps extends HTMLAttributes<HTMLDivElement> {
  owner: Pick<OwnerSummary, "name" | "avatarUrl" | "type" | "lots">
  size?: "sm" | "md"
  showLots?: boolean
}

/**
 * Compact owner reference for breadcrumbs, tags, and table cells.
 */
export function OwnerIdentity({
  owner,
  size = "md",
  showLots = false,
  className,
  ...props
}: OwnerIdentityProps) {
  const lotsLabel = showLots ? formatOwnerLots({ lots: owner.lots }) : undefined

  return (
    <div
      data-slot="owner-identity"
      className={cn("flex min-w-0 items-center gap-2.5", className)}
      {...props}
    >
      <OwnerAvatar
        src={owner.avatarUrl}
        name={owner.name}
        size={size === "sm" ? "sm" : "md"}
      />

      <div className="min-w-0">
        <p
          className={cn(
            "font-sans font-semibold text-ink truncate",
            size === "sm" ? "text-xs" : "text-sm"
          )}
        >
          {owner.name}
        </p>
        {lotsLabel ? (
          <p className="font-mono text-[10px] text-ink-muted truncate">{lotsLabel}</p>
        ) : owner.type ? (
          <p className="text-xs text-ink-muted truncate capitalize">{owner.type}</p>
        ) : null}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Shared row props
// ─────────────────────────────────────────────────────────

export interface OwnerRowBaseProps extends HTMLAttributes<HTMLElement> {
  owner: OwnerSummary
  href?: string
  showChevron?: boolean
  showLevyStatus?: boolean
  showPortalStatus?: boolean
  showCorrespondence?: boolean
  showScheme?: boolean
  selected?: boolean
  actions?: ReactNode
}

interface OwnerRollRowProps extends OwnerRowBaseProps {
  layout?: OwnerRollLayout
}

interface OwnerCardProps extends OwnerRowBaseProps {
  layout?: OwnerCardLayout
}

function OwnerRowShell({
  layout,
  selected,
  href,
  className,
  children,
  owner: _owner,
  showChevron: _showChevron,
  showLevyStatus: _showLevyStatus,
  showPortalStatus: _showPortalStatus,
  showCorrespondence: _showCorrespondence,
  showScheme: _showScheme,
  actions: _actions,
  ...props
}: (OwnerRollRowProps | OwnerCardProps) & {
  layout: OwnerRollLayout | OwnerCardLayout
  children: ReactNode
}) {
  const shellClass = cn(
    "group/owner transition-colors duration-150",
    layout === "list" &&
      "flex items-center gap-3 px-4 py-3 hover:bg-off-white/70",
    layout === "wide" &&
      "grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1fr)_88px_100px_auto] items-center gap-4 px-4 py-3 hover:bg-off-white/70",
    layout === "card" &&
      "flex h-full flex-col rounded-md border border-border bg-white p-4 hover:border-ink-muted/40 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
    layout === "compact" &&
      "flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-off-white/70",
    selected && "bg-lime-soft/60",
    href && "cursor-pointer no-underline text-inherit",
    className
  )

  if (href) {
    return (
      <a
        data-slot="owner-row"
        href={href}
        className={shellClass}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <div data-slot="owner-row" className={shellClass} {...props}>
      {children}
    </div>
  )
}

function OwnerNameBlock({
  owner,
  showType = true,
}: {
  owner: OwnerSummary
  showType?: boolean
}) {
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        <p className="font-sans text-sm font-semibold text-ink truncate">
          {owner.name}
        </p>
        {owner.isCommitteeMember ? (
          <OwnerCommitteeBadge className="shrink-0" />
        ) : null}
        {showType && owner.type ? (
          <OwnerTypeBadge type={owner.type} hideIcon className="shrink-0" />
        ) : null}
      </div>
      <OwnerContactMeta owner={owner} className="mt-0.5" />
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// OwnerRollRow: list and wide owner directory rows
// ─────────────────────────────────────────────────────────

/**
 * Owner directory row for strata roll views. Defaults to list layout;
 * use wide for tabular owner directories with contact and portal columns.
 */
export function OwnerRollRow({
  owner,
  layout = "list",
  href,
  showChevron = false,
  showLevyStatus = false,
  showPortalStatus = false,
  showCorrespondence = false,
  showScheme = false,
  selected = false,
  actions,
  className,
  ...props
}: OwnerRollRowProps) {
  if (layout === "wide") {
    return (
      <OwnerRowShell
        owner={owner}
        layout={layout}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        {/* Owner identity */}
        <div className="flex min-w-0 items-center gap-3">
          <OwnerAvatar src={owner.avatarUrl} name={owner.name} size="md" />
          <OwnerNameBlock owner={owner} showType={false} />
        </div>

        {/* Lots */}
        <OwnerLotChips lots={owner.lots} max={2} />

        {/* Contact */}
        <OwnerContactMeta owner={owner} showIcons />

        {/* Levy */}
        <div>
          {showLevyStatus && owner.levyStatus ? (
            <LotLevyBadge status={owner.levyStatus} hideIcon />
          ) : (
            <p className="text-sm text-ink-muted">—</p>
          )}
        </div>

        {/* Portal */}
        <div className="flex flex-col gap-1">
          {showPortalStatus && owner.portalStatus ? (
            <OwnerPortalBadge status={owner.portalStatus} />
          ) : null}
          {showCorrespondence && owner.correspondence ? (
            <OwnerCorrespondenceBadge method={owner.correspondence} />
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
      </OwnerRowShell>
    )
  }

  // Default: list layout
  return (
    <OwnerRowShell
      owner={owner}
      layout={layout}
      href={href}
      selected={selected}
      className={className}
      {...props}
    >
      <OwnerAvatar src={owner.avatarUrl} name={owner.name} size="md" />

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <p className="font-sans text-sm font-semibold text-ink truncate">
            {owner.name}
          </p>
          {owner.isCommitteeMember ? (
            <OwnerCommitteeBadge className="shrink-0" />
          ) : null}
          {showLevyStatus && owner.levyStatus ? (
            <LotLevyBadge status={owner.levyStatus} hideIcon className="shrink-0" />
          ) : null}
        </div>
        <OwnerContactMeta owner={owner} className="mt-0.5" />
        {owner.lots?.length ? (
          <OwnerLotChips lots={owner.lots} className="mt-2" />
        ) : null}
      </div>

      {showScheme && owner.schemePlan ? (
        <span className="hidden md:inline font-mono text-[10px] text-ink-muted shrink-0">
          {owner.schemePlan}
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
    </OwnerRowShell>
  )
}

// ─────────────────────────────────────────────────────────
// OwnerCard: card and compact profile tiles
// ─────────────────────────────────────────────────────────

/**
 * Owner profile card for directories, pickers, and portal admin views.
 */
export function OwnerCard({
  owner,
  layout = "card",
  href,
  showChevron = false,
  showLevyStatus = false,
  showPortalStatus = false,
  showCorrespondence = false,
  showScheme = false,
  selected = false,
  actions,
  className,
  ...props
}: OwnerCardProps) {
  if (layout === "compact") {
    return (
      <OwnerRowShell
        owner={owner}
        layout={layout}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        <OwnerAvatar src={owner.avatarUrl} name={owner.name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-ink truncate">{owner.name}</p>
          {owner.lots?.length ? (
            <p className="font-mono text-[10px] text-ink-muted truncate">
              {formatOwnerLots({ lots: owner.lots })}
            </p>
          ) : null}
        </div>
        {showLevyStatus && owner.levyStatus ? (
          <LotLevyBadge status={owner.levyStatus} hideIcon />
        ) : null}
        {showChevron ? (
          <ChevronRight
            className="size-3.5 shrink-0 text-ink-muted"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
      </OwnerRowShell>
    )
  }

  return (
    <OwnerRowShell
      owner={owner}
      layout={layout}
      href={href}
      selected={selected}
      className={className}
      {...props}
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-3">
        <OwnerAvatar src={owner.avatarUrl} name={owner.name} size="lg" />
        <div className="flex flex-col items-end gap-1.5">
          {owner.type ? <OwnerTypeBadge type={owner.type} hideIcon /> : null}
          {showLevyStatus && owner.levyStatus ? (
            <LotLevyBadge status={owner.levyStatus} hideIcon />
          ) : null}
        </div>
      </div>

      {/* Name + contact */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <p className="font-sans text-sm font-semibold text-ink line-clamp-2">
            {owner.name}
          </p>
          {owner.isCommitteeMember ? <OwnerCommitteeBadge /> : null}
        </div>
        <OwnerContactMeta owner={owner} showIcons showAddress className="mt-1" />
        {owner.lots?.length ? (
          <OwnerLotChips lots={owner.lots} className="mt-3" badgeSize="md" />
        ) : null}
        {showScheme && owner.schemePlan ? (
          <p className="mt-2 font-mono text-[10px] text-ink-muted">{owner.schemePlan}</p>
        ) : null}
      </div>

      {/* Portal + correspondence */}
      {(showPortalStatus || showCorrespondence) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {showPortalStatus && owner.portalStatus ? (
            <OwnerPortalBadge status={owner.portalStatus} />
          ) : null}
          {showCorrespondence && owner.correspondence ? (
            <OwnerCorrespondenceBadge method={owner.correspondence} />
          ) : null}
        </div>
      )}

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
    </OwnerRowShell>
  )
}

// ─────────────────────────────────────────────────────────
// OwnerList / OwnerGrid: layout containers
// ─────────────────────────────────────────────────────────

export interface OwnerListProps extends HTMLAttributes<HTMLDivElement> {
  showWideHeader?: boolean
  header?: ReactNode
}

/**
 * Bordered list container for owner roll rows.
 */
export function OwnerList({
  showWideHeader = false,
  header,
  className,
  children,
  ...props
}: OwnerListProps) {
  return (
    <div data-slot="owner-list" className={cn("space-y-3", className)} {...props}>
      {header}

      <div className="overflow-hidden rounded-sm border border-border bg-white">
        {showWideHeader ? (
          <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,1fr)_88px_100px_auto] gap-4 border-b border-border bg-off-white px-4 py-2">
            {["Owner", "Lots", "Contact", "Levy", "Portal", ""].map((heading) => (
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

export interface OwnerGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3
  gap?: "sm" | "md" | "lg"
}

const ownerGridGapClass = {
  sm: "gap-4",
  md: "gap-5 md:gap-6",
  lg: "gap-6 md:gap-8",
}

/**
 * Responsive grid for owner profile cards.
 */
export function OwnerGrid({
  columns = 3,
  gap = "md",
  className,
  children,
  ...props
}: OwnerGridProps) {
  return (
    <div
      data-slot="owner-grid"
      className={cn(
        "grid grid-cols-1",
        columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3",
        ownerGridGapClass[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// OwnerRollHeader: owner directory summary strip
// ─────────────────────────────────────────────────────────

export interface OwnerRollHeaderProps extends HTMLAttributes<HTMLDivElement> {
  totalOwners: number
  portalActiveCount?: number
  invitedCount?: number
  committeeCount?: number
  title?: string
}

/**
 * Summary counts above an owner directory list.
 */
export function OwnerRollHeader({
  totalOwners,
  portalActiveCount,
  invitedCount,
  committeeCount,
  title = "Owner directory",
  className,
  ...props
}: OwnerRollHeaderProps) {
  return (
    <div
      data-slot="owner-roll-header"
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
          {totalOwners} owner{totalOwners === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {portalActiveCount !== undefined && portalActiveCount > 0 ? (
          <span className="inline-flex items-center rounded-xs bg-lime-soft px-2 py-0.5 text-xs font-medium text-ink">
            {portalActiveCount} portal active
          </span>
        ) : null}
        {invitedCount !== undefined && invitedCount > 0 ? (
          <span className="inline-flex items-center rounded-xs bg-warning-soft px-2 py-0.5 text-xs font-medium text-ink">
            {invitedCount} invited
          </span>
        ) : null}
        {committeeCount !== undefined && committeeCount > 0 ? (
          <OwnerCommitteeBadge />
        ) : null}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Demo data for documentation
// ─────────────────────────────────────────────────────────

export const OWNER_DEMO_ITEMS: OwnerSummary[] = [
  {
    id: "own_1",
    name: "James & Sarah Chen",
    type: "joint",
    email: "chen.family@email.com",
    phone: "0412 345 678",
    lots: [{ number: 12, unit: "Unit 12" }],
    mailingAddress: "12/100 Harbour St, Sydney NSW 2000",
    levyStatus: "paid",
    portalStatus: "active",
    correspondence: "email",
    isCommitteeMember: true,
    schemePlan: "SP 1042",
  },
  {
    id: "own_2",
    name: "North Shore Investments Pty Ltd",
    type: "company",
    email: "accounts@northshoreinv.com.au",
    phone: "02 9123 4567",
    lots: [{ number: 14, unit: "Unit 14" }],
    levyStatus: "due",
    portalStatus: "invited",
    correspondence: "email",
    schemePlan: "SP 1042",
  },
  {
    id: "own_3",
    name: "Margaret O'Brien",
    type: "individual",
    email: "mobrien@email.com",
    lots: [{ number: 18, unit: "Unit 18" }],
    levyStatus: "paid",
    portalStatus: "active",
    correspondence: "portal",
    openComplaints: 1,
    schemePlan: "SP 1042",
  },
  {
    id: "own_4",
    name: "Harbour Holdings Ltd",
    type: "company",
    email: "levies@harbourholdings.com",
    phone: "02 9988 7766",
    lots: [{ number: 22, unit: "Penthouse" }],
    levyStatus: "overdue",
    portalStatus: "not_registered",
    correspondence: "post",
    schemePlan: "SP 1042",
  },
  {
    id: "own_5",
    name: "Priya Sharma",
    type: "individual",
    email: "priya.sharma@email.com",
    phone: "0433 221 098",
    lots: [{ number: 3, unit: "Unit 3" }],
    levyStatus: "paid",
    portalStatus: "active",
    correspondence: "email",
    schemePlan: "SP 8871",
  },
  {
    id: "own_6",
    name: "Daniel & Kim Wu",
    type: "joint",
    email: "daniel.wu@email.com",
    lots: [
      { number: 7, unit: "Unit 7" },
      { number: 8, unit: "Unit 8" },
    ],
    levyStatus: "overdue",
    portalStatus: "not_registered",
    correspondence: "post",
    schemePlan: "SP 8871",
  },
] as const

export const OWNER_DEMO_DIRECTORY = OWNER_DEMO_ITEMS.filter(
  (owner) => owner.schemePlan === "SP 1042"
)
