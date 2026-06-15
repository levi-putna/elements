import { Avatar } from "@/components/ui/avatar"
import { Badge, BadgeIcon, type BadgeVariant } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  AlertTriangle,
  Bot,
  Calendar,
  Check,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Gavel,
  Mail,
  Pause,
  Play,
  Receipt,
  Send,
  Shield,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────
// Task: work items and manager task queues
//
// Work items represent operational tasks across strata
// workflows: automatable, semi-automated (R-A-S), and manual.
//
//   list    · default manager inbox row
//   compact · sidebar and notification rows
//   card    · dashboard and kanban tiles
//   detail  · expanded item with prerequisites and notes
// ─────────────────────────────────────────────────────────

export type WorkItemLayout = "list" | "compact" | "card" | "detail"

/** Lifecycle state of a work item. */
export type WorkItemStatus =
  | "pending"
  | "in_progress"
  | "awaiting_review"
  | "approved"
  | "sent"
  | "completed"
  | "failed"
  | "manual_required"
  | "escalated"
  | "snoozed"

/** AI automation suitability from operational requirements. */
export type WorkItemAutomation = "automatable" | "semi_automated" | "manual"

/** Business domain the task belongs to. */
export type WorkItemDomain =
  | "meetings"
  | "accounting"
  | "maintenance"
  | "insurance"
  | "admin"
  | "disputes"
  | "communication"
  | "contractors"

export type WorkItemPriority = "urgent" | "high" | "medium" | "low"

/** How the due date should be interpreted in the UI. */
export type WorkItemDueKind = "due" | "statutory" | "follow_up"

/**
 * Core work item fields for queues, inboxes, and workflow screens.
 * Extend in the app with workflow IDs, audit trails, and linked records.
 */
export interface WorkItemSummary {
  id: string
  title: string
  description?: string
  status: WorkItemStatus
  domain: WorkItemDomain
  automation: WorkItemAutomation
  priority?: WorkItemPriority
  /** ISO date or Date for due, statutory, or follow-up deadlines. */
  dueAt?: string | Date
  dueKind?: WorkItemDueKind
  /** Scheme display name when task is scheme-scoped. */
  schemeName?: string
  schemePlan?: string
  assigneeName?: string
  assigneeAvatar?: string
  /** Prerequisites not yet satisfied (e.g. missing AGM financials). */
  missingItems?: string[]
  /** Non-blocking AI advisory text. */
  advisory?: string
  /** Linked requirement ID for traceability, e.g. FR-AIS-002. */
  requirementId?: string
  /** When the item was created or entered the queue. */
  createdAt?: string | Date
  /** Snooze resume date when status is snoozed. */
  snoozedUntil?: string | Date
}

// ─────────────────────────────────────────────────────────
// Formatting helpers
// ─────────────────────────────────────────────────────────

/**
 * Format a due date for Australian locale display.
 */
export function formatWorkItemDue({
  value,
}: {
  value?: string | Date
}): string | undefined {
  if (!value) return undefined

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  }).format(date)
}

/**
 * Whether a due date is before today (calendar day).
 */
export function isWorkItemOverdue({
  dueAt,
  status,
}: Pick<WorkItemSummary, "dueAt" | "status">): boolean {
  if (!dueAt || status === "completed" || status === "sent") return false

  const due = dueAt instanceof Date ? dueAt : new Date(dueAt)
  if (Number.isNaN(due.getTime())) return false

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return due < today
}

/**
 * Compose scheme context for metadata lines.
 */
export function formatWorkItemScheme({
  schemeName,
  schemePlan,
}: Pick<WorkItemSummary, "schemeName" | "schemePlan">): string | undefined {
  if (schemeName && schemePlan) return `${schemeName} · ${schemePlan}`
  return schemeName ?? schemePlan
}

// ─────────────────────────────────────────────────────────
// Domain config
// ─────────────────────────────────────────────────────────

const domainConfig: Record<
  WorkItemDomain,
  { label: string; icon: LucideIcon }
> = {
  meetings: { label: "Meetings", icon: Calendar },
  accounting: { label: "Accounting", icon: Receipt },
  maintenance: { label: "Maintenance", icon: Wrench },
  insurance: { label: "Insurance", icon: Shield },
  admin: { label: "Admin", icon: FileText },
  disputes: { label: "Disputes", icon: Gavel },
  communication: { label: "Communication", icon: Mail },
  contractors: { label: "Contractors", icon: Wrench },
}

// ─────────────────────────────────────────────────────────
// WorkItemStatusBadge
// ─────────────────────────────────────────────────────────

const statusConfig: Record<
  WorkItemStatus,
  { label: string; variant: BadgeVariant; icon: LucideIcon }
> = {
  pending: {
    label: "Pending",
    variant: "default",
    icon: Clock,
  },
  in_progress: {
    label: "In progress",
    variant: "accent",
    icon: Play,
  },
  awaiting_review: {
    label: "Awaiting review",
    variant: "warning",
    icon: Eye,
  },
  approved: {
    label: "Approved",
    variant: "accent",
    icon: Check,
  },
  sent: {
    label: "Sent",
    variant: "default",
    icon: Send,
  },
  completed: {
    label: "Completed",
    variant: "default",
    icon: Check,
  },
  failed: {
    label: "Failed",
    variant: "destructive",
    icon: AlertCircle,
  },
  manual_required: {
    label: "Manual required",
    variant: "destructive",
    icon: User,
  },
  escalated: {
    label: "Escalated",
    variant: "destructive",
    icon: AlertTriangle,
  },
  snoozed: {
    label: "Snoozed",
    variant: "default",
    icon: Pause,
  },
}

export interface WorkItemStatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: WorkItemStatus
  hideIcon?: boolean
}

/**
 * Workflow state badge for work items.
 */
export function WorkItemStatusBadge({
  status,
  hideIcon = false,
  className,
  ...props
}: WorkItemStatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <Badge
      variant={config.variant}
      icon={config.icon}
      hideIcon={hideIcon}
      data-slot="work-item-status-badge"
      className={className}
      {...props}
    >
      {config.label}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// WorkItemAutomationBadge
// ─────────────────────────────────────────────────────────

const automationConfig: Record<
  WorkItemAutomation,
  { label: string; variant: BadgeVariant }
> = {
  automatable: {
    label: "Automatable",
    variant: "accent",
  },
  semi_automated: {
    label: "R-A-S",
    variant: "warning",
  },
  manual: {
    label: "Manual",
    variant: "default",
  },
}

export interface WorkItemAutomationBadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  automation: WorkItemAutomation
  showIcon?: boolean
}

/**
 * AI automation classification badge.
 */
export function WorkItemAutomationBadge({
  automation,
  showIcon = true,
  className,
  ...props
}: WorkItemAutomationBadgeProps) {
  const config = automationConfig[automation]

  return (
    <Badge
      variant={config.variant}
      icon={showIcon && automation !== "manual" ? Bot : undefined}
      data-slot="work-item-automation-badge"
      className={className}
      title={
        automation === "semi_automated"
          ? "Review, amend, and send"
          : undefined
      }
      {...props}
    >
      {config.label}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// WorkItemDomainBadge
// ─────────────────────────────────────────────────────────

export interface WorkItemDomainBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  domain: WorkItemDomain
  hideIcon?: boolean
}

/**
 * Business domain label for a work item.
 */
export function WorkItemDomainBadge({
  domain,
  hideIcon = false,
  className,
  ...props
}: WorkItemDomainBadgeProps) {
  const config = domainConfig[domain]

  return (
    <Badge
      variant="outline"
      data-slot="work-item-domain-badge"
      className={className}
      {...props}
    >
      {!hideIcon ? (
        <BadgeIcon icon={config.icon} className="text-forest" />
      ) : null}
      {config.label}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// WorkItemDueBadge
// ─────────────────────────────────────────────────────────

export interface WorkItemDueBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  dueAt?: string | Date
  dueKind?: WorkItemDueKind
  status: WorkItemStatus
}

/**
 * Due, statutory, or follow-up date with overdue emphasis.
 */
export function WorkItemDueBadge({
  dueAt,
  dueKind = "due",
  status,
  className,
  ...props
}: WorkItemDueBadgeProps) {
  const formatted = formatWorkItemDue({ value: dueAt })
  if (!formatted) return null

  const overdue = isWorkItemOverdue({ dueAt, status })
  const prefix =
    dueKind === "statutory"
      ? "Statutory"
      : dueKind === "follow_up"
        ? "Follow up"
        : "Due"

  return (
    <Badge
      variant={overdue ? "destructive" : "default"}
      icon={Clock}
      data-slot="work-item-due-badge"
      className={className}
      {...props}
    >
      {prefix} {formatted}
    </Badge>
  )
}

// ─────────────────────────────────────────────────────────
// WorkItemPriorityBar
// ─────────────────────────────────────────────────────────

const priorityBarClass: Record<WorkItemPriority, string> = {
  urgent: "bg-danger",
  high: "bg-warning",
  medium: "bg-lime",
  low: "bg-border",
}

export interface WorkItemPriorityBarProps extends HTMLAttributes<HTMLDivElement> {
  priority?: WorkItemPriority
}

/**
 * Left-edge priority indicator for inbox scanning.
 */
export function WorkItemPriorityBar({
  priority = "medium",
  className,
  ...props
}: WorkItemPriorityBarProps) {
  return (
    <div
      data-slot="work-item-priority-bar"
      className={cn(
        "w-1 shrink-0 self-stretch rounded-full",
        priorityBarClass[priority],
        className
      )}
      aria-hidden
      {...props}
    />
  )
}

// ─────────────────────────────────────────────────────────
// WorkItemMeta
// ─────────────────────────────────────────────────────────

export interface WorkItemMetaProps extends HTMLAttributes<HTMLParagraphElement> {
  item: Pick<
    WorkItemSummary,
    "schemeName" | "schemePlan" | "domain" | "assigneeName" | "requirementId"
  >
  showDomain?: boolean
  showAssignee?: boolean
  showRequirement?: boolean
}

/**
 * Secondary metadata line: scheme, domain, assignee, requirement ID.
 */
export function WorkItemMeta({
  item,
  showDomain = true,
  showAssignee = true,
  showRequirement = false,
  className,
  ...props
}: WorkItemMetaProps) {
  const scheme = formatWorkItemScheme({
    schemeName: item.schemeName,
    schemePlan: item.schemePlan,
  })
  const domain = showDomain ? domainConfig[item.domain].label : undefined
  const assignee =
    showAssignee && item.assigneeName ? item.assigneeName : undefined
  const requirement =
    showRequirement && item.requirementId ? item.requirementId : undefined

  const parts = [scheme, domain, assignee, requirement].filter(Boolean)
  if (parts.length === 0) return null

  return (
    <p
      data-slot="work-item-meta"
      className={cn("font-sans text-xs text-ink-muted truncate", className)}
      {...props}
    >
      {parts.join(" · ")}
    </p>
  )
}

// ─────────────────────────────────────────────────────────
// WorkItemMissingItems
// ─────────────────────────────────────────────────────────

export interface WorkItemMissingItemsProps extends HTMLAttributes<HTMLDivElement> {
  items: string[]
}

/**
 * Prerequisites block for incomplete workflow steps.
 */
export function WorkItemMissingItems({
  items,
  className,
  ...props
}: WorkItemMissingItemsProps) {
  if (items.length === 0) return null

  return (
    <div
      data-slot="work-item-missing"
      className={cn(
        "rounded-sm border border-warning/30 bg-warning-soft px-3 py-2.5",
        className
      )}
      {...props}
    >
      <p className="text-xs font-semibold text-ink mb-1.5">Missing items</p>
      <ul className="space-y-1">
        {items.map((entry) => (
          <li
            key={entry}
            className="flex items-start gap-2 text-xs text-ink-muted"
          >
            <AlertCircle
              className="size-3.5 shrink-0 text-warning mt-0.5"
              strokeWidth={1.5}
              aria-hidden
            />
            {entry}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// WorkItemAdvisory
// ─────────────────────────────────────────────────────────

export interface WorkItemAdvisoryProps extends HTMLAttributes<HTMLDivElement> {
  message: string
}

/**
 * Non-blocking AI advisory note on a work item.
 */
export function WorkItemAdvisory({
  message,
  className,
  ...props
}: WorkItemAdvisoryProps) {
  return (
    <div
      data-slot="work-item-advisory"
      className={cn(
        "rounded-sm border border-border bg-off-white px-3 py-2.5 text-xs text-ink-muted leading-relaxed",
        className
      )}
      {...props}
    >
      <p className="font-semibold text-ink mb-1">Advisory</p>
      {message}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// WorkItem
// ─────────────────────────────────────────────────────────

export interface WorkItemProps extends HTMLAttributes<HTMLElement> {
  item: WorkItemSummary
  layout?: WorkItemLayout
  href?: string
  showChevron?: boolean
  showStatus?: boolean
  showAutomation?: boolean
  showDue?: boolean
  showAssignee?: boolean
  selected?: boolean
  actions?: ReactNode
}

function WorkItemShell({
  layout,
  selected,
  href,
  className,
  children,
  item: _item,
  showChevron: _showChevron,
  showStatus: _showStatus,
  showAutomation: _showAutomation,
  showDue: _showDue,
  showAssignee: _showAssignee,
  actions: _actions,
  ...props
}: WorkItemProps & { children: ReactNode }) {
  const shellClass = cn(
    "group/work-item transition-colors duration-150",
    layout === "list" &&
      "flex items-stretch gap-0 hover:bg-off-white/70",
    layout === "compact" &&
      "flex items-center gap-2 px-3 py-2 hover:bg-off-white/70",
    layout === "card" &&
      "flex h-full flex-col rounded-md border border-border bg-white p-4 hover:border-ink-muted/40 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
    layout === "detail" &&
      "flex flex-col gap-4 rounded-md border border-border bg-white p-5",
    selected && "bg-lime-soft/40",
    href && "cursor-pointer no-underline text-inherit",
    className
  )

  if (href) {
    return (
      <a
        data-slot="work-item"
        href={href}
        className={shellClass}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <div data-slot="work-item" className={shellClass} {...props}>
      {children}
    </div>
  )
}

/**
 * Single work item for manager inboxes and workflow screens.
 */
export function WorkItem({
  item,
  layout = "list",
  href,
  showChevron = false,
  showStatus = true,
  showAutomation = true,
  showDue = true,
  showAssignee = true,
  selected = false,
  actions,
  className,
  ...props
}: WorkItemProps) {
  const badgeRow = (
    <div className="flex flex-wrap items-center gap-1.5">
      {showStatus ? (
        <WorkItemStatusBadge status={item.status} hideIcon />
      ) : null}
      {showAutomation ? (
        <WorkItemAutomationBadge automation={item.automation} />
      ) : null}
      {showDue ? (
        <WorkItemDueBadge
          dueAt={item.dueAt}
          dueKind={item.dueKind}
          status={item.status}
        />
      ) : null}
    </div>
  )

  if (layout === "compact") {
    return (
      <WorkItemShell
        item={item}
        layout={layout}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        <WorkItemPriorityBar priority={item.priority} className="rounded-full w-1.5 self-center h-8" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-ink truncate">{item.title}</p>
          <WorkItemMeta item={item} showAssignee={false} className="mt-0.5" />
        </div>
        {showStatus ? (
          <WorkItemStatusBadge status={item.status} hideIcon className="shrink-0" />
        ) : null}
        {showChevron ? (
          <ChevronRight className="size-3.5 shrink-0 text-ink-muted" strokeWidth={1.5} aria-hidden />
        ) : null}
      </WorkItemShell>
    )
  }

  if (layout === "card") {
    return (
      <WorkItemShell
        item={item}
        layout={layout}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        {/* Header badges */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <WorkItemDomainBadge domain={item.domain} />
          {badgeRow}
        </div>

        {/* Title + meta */}
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-semibold text-ink line-clamp-2">
            {item.title}
          </p>
          <WorkItemMeta item={item} className="mt-1.5" />
          {item.description ? (
            <p className="mt-2 text-xs text-ink-muted line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          ) : null}
        </div>

        {/* Assignee */}
        {showAssignee && item.assigneeName ? (
          <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
            <Avatar
              src={item.assigneeAvatar}
              name={item.assigneeName}
              size="sm"
            />
            <p className="text-xs text-ink-muted">{item.assigneeName}</p>
          </div>
        ) : null}

        {(actions || showChevron) && (
          <div className="mt-3 flex justify-end gap-2">
            {actions}
            {showChevron ? (
              <ChevronRight className="size-4 text-ink-muted" strokeWidth={1.5} aria-hidden />
            ) : null}
          </div>
        )}
      </WorkItemShell>
    )
  }

  if (layout === "detail") {
    return (
      <WorkItemShell
        item={item}
        layout={layout}
        selected={selected}
        className={className}
        {...props}
      >
        {/* Title block */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="font-sans text-base font-semibold text-ink leading-snug">
                {item.title}
              </p>
              <WorkItemMeta
                item={item}
                showRequirement
                className="mt-1.5"
              />
            </div>
            {showAssignee && item.assigneeName ? (
              <div className="flex items-center gap-2 shrink-0">
                <Avatar
                  src={item.assigneeAvatar}
                  name={item.assigneeName}
                  size="sm"
                />
                <span className="text-xs text-ink-muted">{item.assigneeName}</span>
              </div>
            ) : null}
          </div>

          {badgeRow}
        </div>

        {item.description ? (
          <p className="text-sm text-ink-muted leading-relaxed">{item.description}</p>
        ) : null}

        {item.missingItems?.length ? (
          <WorkItemMissingItems items={item.missingItems} />
        ) : null}

        {item.advisory ? <WorkItemAdvisory message={item.advisory} /> : null}

        {item.status === "snoozed" && item.snoozedUntil ? (
          <p className="text-xs text-ink-muted">
            Snoozed until {formatWorkItemDue({ value: item.snoozedUntil })}
          </p>
        ) : null}

        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </WorkItemShell>
    )
  }

  // Default: list layout
  return (
    <WorkItemShell
      item={item}
      layout={layout}
      href={href}
      selected={selected}
      className={className}
      {...props}
    >
      <WorkItemPriorityBar priority={item.priority} className="rounded-none" />

      <div className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-semibold text-ink truncate">
            {item.title}
          </p>
          <WorkItemMeta item={item} className="mt-0.5" />
          {(item.missingItems?.length || item.status === "failed") && layout === "list" ? (
            <p className="mt-1 text-xs text-warning truncate">
              {item.status === "failed"
                ? "Action required: workflow step failed"
                : `${item.missingItems?.length} missing item${item.missingItems?.length === 1 ? "" : "s"}`}
            </p>
          ) : null}
        </div>

        <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
          {badgeRow}
        </div>

        {showAssignee && item.assigneeName ? (
          <Avatar
            src={item.assigneeAvatar}
            name={item.assigneeName}
            size="sm"
            className="hidden md:inline-flex shrink-0"
          />
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
      </div>
    </WorkItemShell>
  )
}

// ─────────────────────────────────────────────────────────
// TaskQueue containers
// ─────────────────────────────────────────────────────────

export interface TaskQueueProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode
  emptyState?: ReactNode
  isEmpty?: boolean
  /** list = single bordered container. sectioned = stacked TaskQueueSection groups. */
  variant?: "list" | "sectioned"
}

/**
 * Manager task inbox container with optional header and empty state.
 */
export function TaskQueue({
  header,
  emptyState,
  isEmpty = false,
  variant = "list",
  className,
  children,
  ...props
}: TaskQueueProps) {
  return (
    <div data-slot="task-queue" className={cn("space-y-4", className)} {...props}>
      {header}

      {isEmpty ? (
        emptyState ?? <TaskQueueEmptyState />
      ) : variant === "sectioned" ? (
        <div className="space-y-4">{children}</div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-border bg-white divide-y divide-border">
          {children}
        </div>
      )}
    </div>
  )
}

export interface TaskQueueEmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
}

/**
 * Default empty state when the task queue has no items.
 */
export function TaskQueueEmptyState({
  title = "All caught up",
  description = "No open tasks need your attention right now.",
  className,
  ...props
}: TaskQueueEmptyStateProps) {
  return (
    <div
      data-slot="task-queue-empty"
      className={cn(
        "rounded-sm border border-border bg-off-white px-6 py-12 text-center",
        className
      )}
      {...props}
    >
      <Check
        className="size-8 mx-auto mb-3 text-forest"
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-xs text-ink-muted max-w-sm mx-auto">{description}</p>
    </div>
  )
}

export type TaskQueueSectionTone = "default" | "warning" | "danger"

export interface TaskQueueSectionProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  count?: number
  tone?: TaskQueueSectionTone
  description?: string
}

const sectionToneClass: Record<TaskQueueSectionTone, string> = {
  default: "text-ink-muted",
  warning: "text-warning",
  danger: "text-danger",
}

/**
 * Labelled group within a task queue (e.g. Overdue, Awaiting review).
 */
export function TaskQueueSection({
  title,
  count,
  tone = "default",
  description,
  className,
  children,
  ...props
}: TaskQueueSectionProps) {
  return (
    <section data-slot="task-queue-section" className={cn("space-y-0", className)} {...props}>
      <div className="flex items-baseline justify-between gap-3 px-1 pb-2">
        <div>
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-widest",
              sectionToneClass[tone]
            )}
          >
            {title}
            {count !== undefined ? ` · ${count}` : ""}
          </p>
          {description ? (
            <p className="mt-0.5 text-xs text-ink-muted">{description}</p>
          ) : null}
        </div>
      </div>
      <div className="overflow-hidden rounded-sm border border-border bg-white divide-y divide-border">
        {children}
      </div>
    </section>
  )
}

export interface TaskQueueHeaderProps extends HTMLAttributes<HTMLDivElement> {
  openCount: number
  reviewCount?: number
  overdueCount?: number
  escalatedCount?: number
  title?: string
}

/**
 * Summary strip above a task queue with key inbox counts.
 */
export function TaskQueueHeader({
  openCount,
  reviewCount,
  overdueCount,
  escalatedCount,
  title = "Task inbox",
  className,
  ...props
}: TaskQueueHeaderProps) {
  return (
    <div
      data-slot="task-queue-header"
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
          {openCount} open task{openCount === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {reviewCount !== undefined && reviewCount > 0 ? (
          <Badge variant="warning" icon={Eye}>
            {reviewCount} to review
          </Badge>
        ) : null}
        {overdueCount !== undefined && overdueCount > 0 ? (
          <Badge variant="destructive" icon={Clock}>
            {overdueCount} overdue
          </Badge>
        ) : null}
        {escalatedCount !== undefined && escalatedCount > 0 ? (
          <Badge variant="destructive" icon={AlertTriangle}>
            {escalatedCount} escalated
          </Badge>
        ) : null}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Demo data: one item per notable state
// ─────────────────────────────────────────────────────────

export const WORK_ITEM_DEMO_BY_STATUS: WorkItemSummary[] = [
  {
    id: "task_pending",
    title: "Schedule AGM date for new financial year",
    status: "pending",
    domain: "meetings",
    automation: "automatable",
    priority: "high",
    dueAt: "2026-07-15",
    dueKind: "statutory",
    schemeName: "Harbour View Towers",
    schemePlan: "SP 1042",
    assigneeName: "Jane Smith",
    requirementId: "FR-AIS-001",
    description: "Prompt manager to confirm AGM date within statutory window.",
  },
  {
    id: "task_progress",
    title: "Draft quarterly committee financial report",
    status: "in_progress",
    domain: "accounting",
    automation: "semi_automated",
    priority: "medium",
    dueAt: "2026-06-20",
    schemeName: "Parkside Residences",
    schemePlan: "SP 8871",
    assigneeName: "Jane Smith",
    requirementId: "FR-AIS-013",
  },
  {
    id: "task_review",
    title: "Generate AGM notice pack",
    status: "awaiting_review",
    domain: "meetings",
    automation: "semi_automated",
    priority: "urgent",
    dueAt: "2026-06-10",
    dueKind: "statutory",
    schemeName: "Harbour View Towers",
    schemePlan: "SP 1042",
    assigneeName: "Jane Smith",
    requirementId: "FR-AIS-002",
    description: "AI draft ready for review, amend, and send to owners.",
    missingItems: ["Audited financial statements for FY25"],
    advisory:
      "Motion 4 may require special resolution wording. Advisory only: confirm with legal counsel before issuing.",
  },
  {
    id: "task_approved",
    title: "Approve breach notice for Lot 22",
    status: "approved",
    domain: "disputes",
    automation: "semi_automated",
    priority: "high",
    schemeName: "Harbour View Towers",
    schemePlan: "SP 1042",
    assigneeName: "Jane Smith",
    requirementId: "FR-AIS-040",
  },
  {
    id: "task_sent",
    title: "Issue building-wide hot water shutdown notice",
    status: "sent",
    domain: "communication",
    automation: "semi_automated",
    priority: "urgent",
    schemeName: "Harbour View Towers",
    schemePlan: "SP 1042",
    assigneeName: "Jane Smith",
    requirementId: "FR-AIS-046",
  },
  {
    id: "task_completed",
    title: "Reconcile trust account for May",
    status: "completed",
    domain: "accounting",
    automation: "manual",
    priority: "medium",
    schemeName: "Harbour View Towers",
    schemePlan: "SP 1042",
    assigneeName: "Alex Chen",
    requirementId: "FR-AIS-013",
  },
  {
    id: "task_failed",
    title: "Sync levy schedule to trust accounting",
    status: "failed",
    domain: "accounting",
    automation: "automatable",
    priority: "high",
    dueAt: "2026-06-12",
    schemeName: "Parkside Residences",
    schemePlan: "SP 8871",
    assigneeName: "Jane Smith",
    requirementId: "FR-AIS-010",
    description: "External API timeout after 3 retries. Manual entry required.",
  },
  {
    id: "task_manual",
    title: "Attend NCAT hearing for by-law dispute",
    status: "manual_required",
    domain: "disputes",
    automation: "manual",
    priority: "urgent",
    dueAt: "2026-06-25",
    dueKind: "statutory",
    schemeName: "Harbour View Towers",
    schemePlan: "SP 1042",
    assigneeName: "Jane Smith",
    requirementId: "FR-AIS-041",
  },
  {
    id: "task_escalated",
    title: "AGM statutory deadline passed without notice issued",
    status: "escalated",
    domain: "meetings",
    automation: "automatable",
    priority: "urgent",
    dueAt: "2026-05-30",
    dueKind: "statutory",
    schemeName: "Northbridge Estate",
    schemePlan: "SP 2204",
    assigneeName: "Jane Smith",
    requirementId: "FR-AIS-001",
    description: "Escalated to committee. Statutory AGM window has been missed.",
  },
  {
    id: "task_snoozed",
    title: "Follow up contractor quote for lift service",
    status: "snoozed",
    domain: "contractors",
    automation: "semi_automated",
    priority: "low",
    dueAt: "2026-06-18",
    dueKind: "follow_up",
    snoozedUntil: "2026-06-17",
    schemeName: "Harbour View Towers",
    schemePlan: "SP 1042",
    assigneeName: "Jane Smith",
    requirementId: "FR-AIS-052",
  },
] as const

/** Realistic mixed inbox ordering for queue demos. */
export const TASK_QUEUE_DEMO_INBOX: WorkItemSummary[] = [
  WORK_ITEM_DEMO_BY_STATUS[8], // escalated
  WORK_ITEM_DEMO_BY_STATUS[2], // awaiting review + missing
  WORK_ITEM_DEMO_BY_STATUS[6], // failed
  WORK_ITEM_DEMO_BY_STATUS[7], // manual required
  WORK_ITEM_DEMO_BY_STATUS[1], // in progress
  WORK_ITEM_DEMO_BY_STATUS[0], // pending statutory
  WORK_ITEM_DEMO_BY_STATUS[9], // snoozed
] as const

export const WORK_ITEM_DEMO_REVIEW = WORK_ITEM_DEMO_BY_STATUS[2]
