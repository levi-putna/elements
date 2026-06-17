import { cn } from "@/lib/utils"
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  Receipt,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────
// Stat: the dashboard KPI / metric tile
//
// A single headline number with a label, an optional tinted icon
// chip, a trend delta, and supporting caption. One element renders
// every metric on a dashboard — change the data, not the markup.
//
//   default · neutral metric
//   accent  · positive / on-track signal
//   warning · caution / pending
//   danger  · attention / overdue
//   info    · informational / volume
// ─────────────────────────────────────────────────────────

export type StatTone = "default" | "accent" | "warning" | "danger" | "info"

/** Tinted icon-chip colour per tone. The card surface stays white. */
const statIconTone: Record<StatTone, string> = {
  default: "bg-off-white text-ink-muted",
  accent: "bg-lime-soft text-forest",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
  info: "bg-info-soft text-info",
}

// ─────────────────────────────────────────────────────────
// StatDelta: trend pill (▲ 4% / ▼ 2%)
// ─────────────────────────────────────────────────────────

export type StatDeltaDirection = "up" | "down" | "flat"
export type StatDeltaSentiment = "positive" | "negative" | "neutral"

export interface StatDeltaProps extends HTMLAttributes<HTMLSpanElement> {
  /** The change shown next to the arrow, e.g. "4%" or "3 today". */
  value: string
  direction: StatDeltaDirection
  /**
   * Whether the movement is good or bad. Defaults to up=positive,
   * down=negative — override when a falling number is good (e.g. arrears
   * down is positive).
   */
  sentiment?: StatDeltaSentiment
}

const deltaSentimentClass: Record<StatDeltaSentiment, string> = {
  positive: "text-forest",
  negative: "text-danger",
  neutral: "text-ink-muted",
}

/**
 * Directional trend indicator. Compose inside {@link Stat} via the
 * `delta` prop, or use standalone in custom metric layouts.
 */
export function StatDelta({
  value,
  direction,
  sentiment,
  className,
  ...props
}: StatDeltaProps) {
  const resolved =
    sentiment ??
    (direction === "flat"
      ? "neutral"
      : direction === "up"
        ? "positive"
        : "negative")
  const Arrow =
    direction === "up"
      ? ArrowUpRight
      : direction === "down"
        ? ArrowDownRight
        : ArrowRight
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        deltaSentimentClass[resolved],
        className
      )}
      {...props}
    >
      <Arrow className="size-3.5" strokeWidth={2} aria-hidden />
      {value}
    </span>
  )
}

// ─────────────────────────────────────────────────────────
// Stat: the metric tile
// ─────────────────────────────────────────────────────────

export interface StatDeltaConfig {
  value: string
  direction: StatDeltaDirection
  sentiment?: StatDeltaSentiment
}

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** Short metric name, e.g. "Levy arrears". */
  label: string
  /** The headline value. String or node for currency / split values. */
  value: ReactNode
  /** Optional tinted leading icon. */
  icon?: LucideIcon
  /** Colour signal for the icon chip and accent. */
  tone?: StatTone
  /** Trend pill rendered under the value. */
  delta?: StatDeltaConfig
  /** Supporting text after the delta, e.g. "vs last month". */
  caption?: string
  /** When set, the whole tile becomes a link. */
  href?: string
}

/**
 * Headline KPI tile for dashboards. Bordered white card with a tinted
 * icon chip, a large value, and an optional trend delta + caption.
 */
export function Stat({
  label,
  value,
  icon: Icon,
  tone = "default",
  delta,
  caption,
  href,
  className,
  ...props
}: StatProps) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-ink-muted">{label}</p>
        {Icon && (
          <span
            className={cn(
              "inline-flex size-8 shrink-0 items-center justify-center rounded-sm",
              statIconTone[tone]
            )}
          >
            <Icon className="size-4" strokeWidth={1.5} aria-hidden />
          </span>
        )}
      </div>

      <p className="mt-3 font-display text-3xl leading-none tracking-[-0.01em] text-foreground">
        {value}
      </p>

      {(delta || caption) && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
          {delta && <StatDelta {...delta} />}
          {caption && <span>{caption}</span>}
        </p>
      )}
    </>
  )

  const surface =
    "block rounded-sm border border-border bg-white p-5 text-left shadow-[0_1px_3px_rgba(0,0,0,0.08)]"

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          surface,
          "no-underline text-inherit transition-colors duration-150 hover:border-ink-muted/40",
          className
        )}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {body}
      </a>
    )
  }

  return (
    <div className={cn(surface, className)} {...props}>
      {body}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// StatGroup: responsive row of stats
// ─────────────────────────────────────────────────────────

export interface StatGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Columns at the largest breakpoint. */
  columns?: 2 | 3 | 4
}

const statGroupColumns: Record<NonNullable<StatGroupProps["columns"]>, string> =
  {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }

/**
 * Responsive grid for a strip of {@link Stat} tiles.
 */
export function StatGroup({
  columns = 4,
  className,
  children,
  ...props
}: StatGroupProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4",
        statGroupColumns[columns],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Demo data for documentation
// ─────────────────────────────────────────────────────────

export const STAT_DEMO_PORTFOLIO: StatProps[] = [
  {
    label: "Needs attention",
    value: "12",
    icon: AlertTriangle,
    tone: "danger",
    delta: { value: "3 today", direction: "up", sentiment: "negative" },
  },
  {
    label: "Levy arrears",
    value: "$84.2k",
    icon: Receipt,
    tone: "warning",
    delta: { value: "4%", direction: "down", sentiment: "positive" },
    caption: "across 37 lots",
  },
  {
    label: "Statutory deadlines",
    value: "5",
    icon: CalendarClock,
    tone: "warning",
    caption: "1 overdue · 30 days",
  },
  {
    label: "Open maintenance",
    value: "16",
    icon: Wrench,
    tone: "info",
    caption: "2 emergency",
  },
]
