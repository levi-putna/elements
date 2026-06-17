import { cn } from "@/lib/utils"
import { ChevronRight, Inbox, type LucideIcon } from "lucide-react"
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────
// Widget: the dashboard panel kit
//
// A consistent bordered card frame for dashboard panels, plus a
// responsive grid and a reusable list row. Compose:
//
//   <WidgetGrid>
//     <Widget className="lg:col-span-2">
//       <WidgetHeader>
//         <WidgetTitle icon={Inbox} count={12}>Needs your attention</WidgetTitle>
//         <WidgetAction href="#">View inbox</WidgetAction>
//       </WidgetHeader>
//       <WidgetContent flush className="divide-y divide-border">…</WidgetContent>
//     </Widget>
//   </WidgetGrid>
//
// WidgetList / WidgetListItem render the same row everywhere — change
// the data, not the markup — so one element powers deadlines, pending
// approvals, arrears, portfolio health, and activity feeds.
// ─────────────────────────────────────────────────────────

export type WidgetTone = "default" | "muted"

const widgetToneClass: Record<WidgetTone, string> = {
  default: "bg-white",
  muted: "bg-off-white",
}

export interface WidgetProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface colour. default = white, muted = off-white for alternation. */
  tone?: WidgetTone
}

/**
 * Dashboard panel shell. Bordered 8px card; compose with WidgetHeader,
 * WidgetContent, WidgetFooter.
 */
export function Widget({
  tone = "default",
  className,
  children,
  ...props
}: WidgetProps) {
  return (
    <div
      data-slot="widget"
      className={cn(
        "flex flex-col overflow-hidden rounded-sm border border-border shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        widgetToneClass[tone],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// WidgetHeader: title row with an optional trailing action
// ─────────────────────────────────────────────────────────

export interface WidgetHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Draw a divider below the header. */
  divided?: boolean
}

/**
 * Header row. Put a {@link WidgetTitle} on the left and an optional
 * {@link WidgetAction} on the right.
 */
export function WidgetHeader({
  divided = true,
  className,
  children,
  ...props
}: WidgetHeaderProps) {
  return (
    <div
      data-slot="widget-header"
      className={cn(
        "flex items-center justify-between gap-3 px-5 py-4",
        divided && "border-b border-border",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// WidgetTitle: icon + label + optional count
// ─────────────────────────────────────────────────────────

export interface WidgetTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  icon?: LucideIcon
  /** Optional count chip after the title (e.g. open item count). */
  count?: number
  as?: "h2" | "h3"
}

/**
 * Widget heading. Inter, not Young Serif — dense app UI per DESIGN.md.
 */
export function WidgetTitle({
  icon: Icon,
  count,
  as: Tag = "h3",
  className,
  children,
  ...props
}: WidgetTitleProps) {
  return (
    <Tag
      data-slot="widget-title"
      className={cn(
        "flex items-center gap-2 text-sm font-semibold text-foreground",
        className
      )}
      {...props}
    >
      {Icon && (
        <Icon className="size-4 text-ink-muted" strokeWidth={1.5} aria-hidden />
      )}
      <span>{children}</span>
      {count !== undefined && (
        <span className="inline-flex min-w-5 items-center justify-center rounded-xs bg-off-white px-1.5 py-0.5 text-[10px] font-semibold text-ink-muted">
          {count}
        </span>
      )}
    </Tag>
  )
}

// ─────────────────────────────────────────────────────────
// WidgetAction: trailing link ("View all →")
// ─────────────────────────────────────────────────────────

export interface WidgetActionProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string
}

/**
 * Low-emphasis trailing link for a widget header.
 */
export function WidgetAction({
  className,
  children = "View all",
  href = "#",
  ...props
}: WidgetActionProps) {
  return (
    <a
      data-slot="widget-action"
      href={href}
      className={cn(
        "inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-ink-muted no-underline transition-colors duration-150 hover:text-forest",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="size-3.5" aria-hidden />
    </a>
  )
}

// ─────────────────────────────────────────────────────────
// WidgetContent: body
// ─────────────────────────────────────────────────────────

export interface WidgetContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Remove padding so edge-to-edge lists sit flush with the border. */
  flush?: boolean
}

/**
 * Widget body. Use `flush` when the content is a divided list.
 */
export function WidgetContent({
  flush = false,
  className,
  children,
  ...props
}: WidgetContentProps) {
  return (
    <div
      data-slot="widget-content"
      className={cn("flex-1", flush ? "" : "p-5", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// WidgetFooter: bottom row, usually a link or summary
// ─────────────────────────────────────────────────────────

/**
 * Bottom row with a top divider. For summary text or a footer link.
 */
export function WidgetFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="widget-footer"
      className={cn(
        "flex items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-ink-muted",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// WidgetEmptyState
// ─────────────────────────────────────────────────────────

export interface WidgetEmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon
  title?: string
  description?: string
}

/**
 * Centred empty state for a widget with no rows.
 */
export function WidgetEmptyState({
  icon: Icon = Inbox,
  title = "Nothing here yet",
  description,
  className,
  ...props
}: WidgetEmptyStateProps) {
  return (
    <div
      data-slot="widget-empty"
      className={cn("px-5 py-10 text-center", className)}
      {...props}
    >
      <Icon
        className="mx-auto mb-3 size-7 text-ink-muted"
        strokeWidth={1.5}
        aria-hidden
      />
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-xs text-xs text-ink-muted">
          {description}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// WidgetList / WidgetListItem: the reusable row
// ─────────────────────────────────────────────────────────

export type WidgetIconTone =
  | "default"
  | "accent"
  | "warning"
  | "danger"
  | "info"

const widgetIconTone: Record<WidgetIconTone, string> = {
  default: "bg-off-white text-ink-muted",
  accent: "bg-lime-soft text-forest",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
}

/**
 * Edge-to-edge container for {@link WidgetListItem} rows. Put inside a
 * `flush` {@link WidgetContent}.
 */
export function WidgetList({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="widget-list"
      className={cn("divide-y divide-border", className)}
      {...props}
    >
      {children}
    </div>
  )
}

export interface WidgetListItemProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Leading icon in a tinted chip. */
  icon?: LucideIcon
  iconTone?: WidgetIconTone
  /** Primary line. */
  title: ReactNode
  /** Secondary metadata line (scheme, plan, dates). */
  meta?: ReactNode
  /** Trailing content: a badge, value, status indicator, or stack. */
  trailing?: ReactNode
  /** Makes the whole row a link with a hover state and chevron. */
  href?: string
  /** Show a chevron at the end (implied when href is set). */
  showChevron?: boolean
}

/**
 * One dashboard list row: leading icon · title + meta · trailing.
 * The workhorse for deadlines, approvals, arrears, health, and feeds.
 */
export function WidgetListItem({
  icon: Icon,
  iconTone = "default",
  title,
  meta,
  trailing,
  href,
  showChevron,
  className,
  ...props
}: WidgetListItemProps) {
  const chevron = showChevron ?? Boolean(href)
  const body = (
    <>
      {Icon && (
        <span
          className={cn(
            "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-sm",
            widgetIconTone[iconTone]
          )}
        >
          <Icon className="size-4" strokeWidth={1.5} aria-hidden />
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{title}</p>
        {meta && (
          <p className="mt-0.5 truncate text-xs text-ink-muted">{meta}</p>
        )}
      </div>

      {trailing && (
        <div className="flex shrink-0 flex-col items-end gap-1 text-right">
          {trailing}
        </div>
      )}

      {chevron && (
        <ChevronRight
          className="size-4 shrink-0 self-center text-ink-muted/60"
          aria-hidden
        />
      )}
    </>
  )

  const rowClass = cn(
    "flex items-start gap-3 px-5 py-3",
    href &&
      "no-underline text-inherit transition-colors duration-150 hover:bg-off-white/70",
    className
  )

  if (href) {
    return (
      <a
        data-slot="widget-list-item"
        href={href}
        className={rowClass}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {body}
      </a>
    )
  }

  return (
    <div data-slot="widget-list-item" className={rowClass} {...props}>
      {body}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// WidgetGrid: dashboard layout grid
// ─────────────────────────────────────────────────────────

export interface WidgetGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns at the large breakpoint. Children use lg:col-span-* to span. */
  columns?: 2 | 3
}

const widgetGridColumns: Record<NonNullable<WidgetGridProps["columns"]>, string> =
  {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
  }

/**
 * Responsive dashboard grid. With `columns={3}`, a main panel spans two
 * columns (`lg:col-span-2`) and a side column takes the third.
 */
export function WidgetGrid({
  columns = 3,
  className,
  children,
  ...props
}: WidgetGridProps) {
  return (
    <div
      data-slot="widget-grid"
      className={cn(
        "grid grid-cols-1 gap-4",
        widgetGridColumns[columns],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
