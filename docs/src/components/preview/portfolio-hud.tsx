"use client"

import * as React from "react"
import {
  addDays,
  format,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns"
import {
  ArrowRight,
  Bot,
  CalendarClock,
  CheckCircle2,
  Sparkles,
} from "lucide-react"
import type { HTMLAttributes, ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Widget,
  WidgetAction,
  WidgetContent,
  WidgetHeader,
  WidgetTitle,
} from "@/components/ui/widget"
import type { UpcomingEventKind } from "@/components/ui/sidebar-upcoming"
import { formatUpcomingDayLabel } from "@/components/ui/sidebar-upcoming"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────
// Portfolio HUD: compact day-planning strip for managers
//
// Three signals at a glance:
//   1. Attention zero progress (human queue for today)
//   2. Portfolio health (scheme distribution)
//   3. AI queue (overnight work + items awaiting review)
// ─────────────────────────────────────────────────────────

export interface AttentionZeroStats {
  /** Items that need the manager today (excludes waiting-on-others). */
  remaining: number
  /** Items cleared by the manager today. */
  clearedToday: number
  /** Target for end of day, usually remaining + cleared at start. */
  dayTotal: number
}

export interface PortfolioHealthStats {
  good: number
  warning: number
  critical: number
}

export interface AiQueueStats {
  /** Items AI finished overnight, no manager action needed yet. */
  completedOvernight: number
  /** Drafts and decisions ready for manager review. */
  readyForReview: number
  /** Items AI is handling autonomously right now. */
  running: number
  /** Rough time to clear the review queue. */
  estimatedReviewMinutes?: number
}

export interface AiBriefingProps extends HTMLAttributes<HTMLDivElement> {
  /** One-line summary of what AI handled overnight. */
  summary: string
  /** Optional bullet highlights. */
  highlights?: string[]
  readyForReview: number
  estimatedReviewMinutes?: number
  onReview?: () => void
  reviewHref?: string
  /** Strip outer chrome when nested inside DashboardCommandHeader. */
  embedded?: boolean
}

export interface PortfolioHudProps extends HTMLAttributes<HTMLDivElement> {
  attention: AttentionZeroStats
  portfolio: PortfolioHealthStats
  ai: AiQueueStats
  /** Strip outer chrome when nested inside DashboardCommandHeader. */
  embedded?: boolean
}

/** Visual tone for a schedule slot or horizon dot. */
export type ScheduleTone = "accent" | "warning" | "danger" | "info"

/** A calendar item shown in the HUD schedule strip or Horizon picker. */
export interface ScheduleEvent {
  id: string
  title: string
  subtitle?: string
  /** Calendar day in ISO form (YYYY-MM-DD). */
  date: string
  /** Display time, e.g. "10:00" or "Now". */
  time?: string
  kind?: UpcomingEventKind
  tone?: ScheduleTone
  href?: string
}

export interface ScheduleHudProps extends HTMLAttributes<HTMLDivElement> {
  events: ScheduleEvent[]
  /** Reference date for "today" labelling. Defaults to now. */
  reference?: Date
  calendarHref?: string
  /** Strip outer chrome when nested inside DashboardCommandHeader. */
  embedded?: boolean
}

export interface DashboardCommandHeaderProps
  extends HTMLAttributes<HTMLDivElement> {
  attention: AttentionZeroStats
  portfolio: PortfolioHealthStats
  ai: AiQueueStats
  briefing: Omit<AiBriefingProps, "embedded" | "className">
  events: ScheduleEvent[]
  reference?: Date
  calendarHref?: string
}

const COMMAND_SHELL_CLASS =
  "overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"

export interface HorizonProps extends HTMLAttributes<HTMLDivElement> {
  events: ScheduleEvent[]
  /** Reference date for the week anchor. Defaults to now. */
  reference?: Date
  calendarHref?: string
  /** How many days to show in the picker. Default 7 (one week). */
  horizonDays?: number
}

const SCHEDULE_TONE_STYLES: Record<
  ScheduleTone,
  { slot: string; border: string; dot: string }
> = {
  accent: {
    slot: "bg-lime-soft",
    border: "border-l-lime",
    dot: "bg-lime",
  },
  warning: {
    slot: "bg-warning-soft",
    border: "border-l-warning",
    dot: "bg-warning",
  },
  danger: {
    slot: "bg-danger-soft",
    border: "border-l-danger",
    dot: "bg-danger",
  },
  info: {
    slot: "bg-info-soft",
    border: "border-l-info",
    dot: "bg-info",
  },
}

const EVENT_KIND_TONES: Record<UpcomingEventKind, ScheduleTone> = {
  meeting: "warning",
  deadline: "danger",
  inspection: "info",
  levy: "accent",
  agm: "warning",
}

const EVENT_KIND_LABELS: Record<UpcomingEventKind, string> = {
  meeting: "Meeting",
  deadline: "Deadline",
  inspection: "Inspection",
  levy: "Levy",
  agm: "AGM",
}

const EVENT_KIND_BADGE_VARIANT: Record<
  UpcomingEventKind,
  "warning" | "destructive" | "info" | "accent"
> = {
  meeting: "warning",
  deadline: "destructive",
  inspection: "info",
  levy: "accent",
  agm: "warning",
}

/**
 * Resolves slot/dot styling for a schedule event.
 */
function getScheduleTone({ event }: { event: ScheduleEvent }): ScheduleTone {
  return event.tone ?? EVENT_KIND_TONES[event.kind ?? "meeting"]
}

/**
 * Events on a given calendar day, sorted by time with "Now" first.
 */
function eventsForDay({
  events,
  date,
}: {
  events: ScheduleEvent[]
  date: string
}): ScheduleEvent[] {
  return events
    .filter((event) => event.date === date)
    .sort((left, right) => {
      if (left.time === "Now") return -1
      if (right.time === "Now") return 1
      return (left.time ?? "").localeCompare(right.time ?? "")
    })
}

/**
 * Unique dot tones for events on a day (up to three visible).
 */
function dotTonesForDay({
  events,
  date,
}: {
  events: ScheduleEvent[]
  date: string
}): ScheduleTone[] {
  const tones = new Set<ScheduleTone>()

  for (const event of eventsForDay({ events, date })) {
    tones.add(getScheduleTone({ event }))
  }

  return Array.from(tones).slice(0, 3)
}

/**
 * Segmented progress bar for proportional counts.
 */
function SegmentedBar({
  segments,
  className,
}: {
  segments: { value: number; className: string }[]
  className?: string
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  if (total === 0) return null

  return (
    <div
      className={cn(
        "flex h-2 w-full overflow-hidden rounded-xs bg-off-white",
        className
      )}
      role="img"
      aria-hidden
    >
      {segments.map((segment, index) =>
        segment.value > 0 ? (
          <div
            key={index}
            className={cn("h-full transition-all duration-300", segment.className)}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ) : null
      )}
    </div>
  )
}

/**
 * Single HUD cell: label, value, optional progress, caption.
 */
function HudCell({
  label,
  value,
  caption,
  children,
  className,
}: {
  label: string
  value: ReactNode
  caption?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("min-w-0 flex-1 px-4 py-3 first:pl-5 last:pr-5", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {children}
      {caption && (
        <p className="mt-1.5 text-xs text-ink-muted">{caption}</p>
      )}
    </div>
  )
}

/**
 * Morning AI briefing band: what the assistant handled overnight and
 * what still needs a human gate.
 */
export function AiBriefing({
  summary,
  highlights = [],
  readyForReview,
  estimatedReviewMinutes,
  onReview,
  reviewHref = "#",
  embedded = false,
  className,
  ...props
}: AiBriefingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        embedded
          ? "min-h-0 flex-1 border-t border-border bg-lime-soft px-5 py-3"
          : "rounded-sm border border-lime/40 bg-lime-soft px-4 py-3.5",
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-forest" aria-hidden />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-forest/70">
            AI morning brief
          </p>
        </div>
        <p className="mt-1.5 text-sm font-medium text-foreground">{summary}</p>
        {highlights.length > 0 && (
          <ul className="mt-2 space-y-0.5 text-xs text-ink-muted">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-1.5">
                <CheckCircle2
                  className="mt-0.5 size-3 shrink-0 text-forest/60"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
        <p className="text-xs text-ink-muted">
          <span className="font-semibold text-foreground">{readyForReview}</span>{" "}
          ready for your review
          {estimatedReviewMinutes !== undefined && (
            <> · ~{estimatedReviewMinutes} min</>
          )}
        </p>
        <Button
          size="sm"
          className="gap-1.5"
          nativeButton={false}
          render={<a href={reviewHref} />}
          onClick={onReview}
        >
          Review AI work
          <ArrowRight className="size-3.5" aria-hidden />
        </Button>
      </div>
    </div>
  )
}

/**
 * Compact three-panel HUD: attention zero, portfolio health, AI queue.
 */
export function PortfolioHud({
  attention,
  portfolio,
  ai,
  embedded = false,
  className,
  ...props
}: PortfolioHudProps) {
  const portfolioTotal =
    portfolio.good + portfolio.warning + portfolio.critical
  const attentionDone = attention.dayTotal - attention.remaining
  const attentionProgress =
    attention.dayTotal > 0
      ? Math.round((attentionDone / attention.dayTotal) * 100)
      : 100

  return (
    <div
      className={cn(
        embedded ? "bg-white" : COMMAND_SHELL_CLASS,
        className
      )}
      {...props}
    >
      <div className="flex flex-col divide-y divide-border lg:flex-row lg:items-start lg:divide-x lg:divide-y-0">
        {/* Attention zero: human queue for today */}
        <HudCell
          label="Your day"
          value={
            attention.remaining === 0 ? (
              <span className="text-forest">Inbox clear</span>
            ) : (
              <>
                {attention.remaining}{" "}
                <span className="text-base font-medium text-ink-muted">
                  to clear
                </span>
              </>
            )
          }
          caption={
            attention.remaining === 0
              ? `${attention.clearedToday} cleared today · waiting on others excluded`
              : `${attention.clearedToday} cleared · ${attention.remaining} left · goal: zero by end of day`
          }
        >
          <div className="mt-2.5 space-y-1">
            <SegmentedBar
              segments={[
                { value: attentionDone, className: "bg-forest" },
                { value: attention.remaining, className: "bg-off-white" },
              ]}
            />
            <p className="text-[10px] text-ink-muted">{attentionProgress}% of today&apos;s queue</p>
          </div>
        </HudCell>

        {/* Portfolio health: scheme distribution */}
        <HudCell
          label="Portfolio health"
          value={
            portfolio.critical > 0 ? (
              <>
                {portfolio.critical}{" "}
                <span className="text-base font-medium text-danger">at risk</span>
              </>
            ) : portfolio.warning > 0 ? (
              <>
                {portfolio.warning}{" "}
                <span className="text-base font-medium text-warning">to watch</span>
              </>
            ) : (
              <span className="text-forest">All healthy</span>
            )
          }
          caption={`${portfolioTotal} schemes · ${portfolio.good} healthy`}
        >
          <div className="mt-2.5 space-y-1">
            <SegmentedBar
              segments={[
                { value: portfolio.good, className: "bg-lime" },
                { value: portfolio.warning, className: "bg-warning" },
                { value: portfolio.critical, className: "bg-danger" },
              ]}
            />
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-ink-muted">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-lime" aria-hidden />
                {portfolio.good} healthy
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-warning" aria-hidden />
                {portfolio.warning} watch
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-danger" aria-hidden />
                {portfolio.critical} at risk
              </span>
            </div>
          </div>
        </HudCell>

        {/* AI queue: autonomous work + human gates */}
        <HudCell
          label="AI queue"
          value={
            <>
              {ai.readyForReview}{" "}
              <span className="text-base font-medium text-ink-muted">
                need you
              </span>
            </>
          }
          caption={`${ai.completedOvernight} done overnight · ${ai.running} running now`}
        >
          <div className="mt-2.5 flex items-center gap-2 text-xs text-ink-muted">
            <Bot className="size-3.5 shrink-0 text-forest/70" aria-hidden />
            <span>
              AI handles routine work; you review drafts and exceptions
            </span>
          </div>
        </HudCell>
      </div>
    </div>
  )
}

/**
 * Unified dashboard header: HUD, AI brief, and today schedule in one panel.
 */
export function DashboardCommandHeader({
  attention,
  portfolio,
  ai,
  briefing,
  events,
  reference = new Date(),
  calendarHref = "#",
  className,
  ...props
}: DashboardCommandHeaderProps) {
  return (
    <div
      className={cn(
        COMMAND_SHELL_CLASS,
        "flex flex-col lg:grid lg:grid-cols-[minmax(0,1fr)_18rem] lg:grid-rows-[auto_minmax(0,1fr)]",
        className
      )}
      {...props}
    >
      {/* HUD strip */}
      <PortfolioHud
        embedded
        attention={attention}
        portfolio={portfolio}
        ai={ai}
        className="lg:col-start-1 lg:row-start-1"
      />

      {/* AI morning brief */}
      <AiBriefing
        embedded
        {...briefing}
        className="lg:col-start-1 lg:row-start-2"
      />

      {/* Today schedule: spans both rows on the right */}
      <ScheduleHud
        embedded
        events={events}
        reference={reference}
        calendarHref={calendarHref}
        className="border-t border-border lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:border-t-0"
      />
    </div>
  )
}

/**
 * Compact today schedule for the dashboard header: date plus timed slots.
 */
export function ScheduleHud({
  events,
  reference = new Date(),
  calendarHref = "#",
  embedded = false,
  className,
  ...props
}: ScheduleHudProps) {
  const todayIso = format(startOfDay(reference), "yyyy-MM-dd")
  const todayEvents = eventsForDay({ events, date: todayIso })
  const dateLabel = format(reference, "EEEE d MMM")

  return (
    <div
      className={cn(
        "flex min-h-0 min-w-0 flex-col overflow-hidden",
        embedded
          ? "h-full border-border lg:w-72 lg:shrink-0 lg:border-l"
          : cn(COMMAND_SHELL_CLASS, "lg:w-72 lg:shrink-0"),
        className
      )}
      {...props}
    >
      {/* Header: label and date */}
      <div
        className={cn(
          "shrink-0 border-b border-border py-3",
          embedded ? "px-5" : "px-4"
        )}
      >
        <div className="flex items-center gap-2">
          <CalendarClock
            className="size-3.5 shrink-0 text-forest/70"
            aria-hidden
          />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Your schedule
          </p>
        </div>
        <p className="mt-1 text-sm font-semibold tracking-tight text-foreground">
          {dateLabel}
        </p>
      </div>

      {/* Today's slots: scroll when taller than the left column */}
      <div
        className={cn(
          "min-h-0 flex-1 overflow-y-auto py-3",
          embedded ? "px-5" : "px-4"
        )}
      >
        {todayEvents.length === 0 ? (
          <p className="text-xs text-ink-muted">Nothing scheduled today.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {todayEvents.map((event) => {
              const tone = getScheduleTone({ event })
              const styles = SCHEDULE_TONE_STYLES[tone]

              return (
                <div key={event.id} className="flex items-stretch gap-2.5">
                  <span className="w-9 shrink-0 pt-1.5 text-[10px] font-medium tabular-nums text-ink-muted">
                    {event.time ?? "—"}
                  </span>
                  <a
                    href={event.href ?? "#"}
                    className={cn(
                      "min-w-0 flex-1 rounded-xs border-l-[3px] px-2.5 py-1.5 transition-colors duration-150 hover:opacity-90",
                      styles.slot,
                      styles.border
                    )}
                  >
                    <p className="text-xs font-medium leading-snug text-foreground">
                      {event.title}
                    </p>
                    {event.subtitle ? (
                      <p className="mt-0.5 text-[10px] leading-snug text-ink-muted">
                        {event.subtitle}
                      </p>
                    ) : null}
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Calendar link */}
      <div
        className={cn(
          "shrink-0 border-t border-border py-2.5",
          embedded ? "px-5" : "px-4"
        )}
      >
        <a
          href={calendarHref}
          className="inline-flex items-center gap-1 text-[11px] text-ink-muted transition-colors duration-150 hover:text-foreground"
        >
          Calendar
          <ArrowRight className="size-3" aria-hidden />
        </a>
      </div>
    </div>
  )
}

/**
 * Horizon picker: scan the next few days and preview what is coming up.
 */
export function Horizon({
  events,
  reference = new Date(),
  calendarHref = "#",
  horizonDays = 7,
  className,
  ...props
}: HorizonProps) {
  const todayIso = format(startOfDay(reference), "yyyy-MM-dd")
  const [selectedDate, setSelectedDate] = React.useState(todayIso)

  const weekStart = startOfWeek(reference, { weekStartsOn: 1 })
  const days = React.useMemo(
    () =>
      Array.from({ length: horizonDays }, (_, index) => {
        const date = addDays(weekStart, index)
        return {
          iso: format(date, "yyyy-MM-dd"),
          label: format(date, "EEEEE"),
        }
      }),
    [horizonDays, weekStart]
  )

  const selectedEvents = eventsForDay({ events, date: selectedDate })
  const featured = selectedEvents[0]

  return (
    <Widget className={className} {...props}>
      <WidgetHeader>
        <WidgetTitle icon={CalendarClock}>Horizon</WidgetTitle>
        <WidgetAction href={calendarHref}>Calendar</WidgetAction>
      </WidgetHeader>

      <WidgetContent className="space-y-4 px-4 py-4">
        {/* Day picker row */}
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${horizonDays}, minmax(0, 1fr))` }}
          role="tablist"
          aria-label="Upcoming days"
        >
          {days.map((day) => {
            const isSelected = day.iso === selectedDate
            const dots = dotTonesForDay({ events, date: day.iso })
            const dayIsToday = day.iso === todayIso

            return (
              <button
                key={day.iso}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setSelectedDate(day.iso)}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xs px-1 py-1.5 transition-colors duration-150",
                  isSelected
                    ? "bg-lime-soft text-forest"
                    : "text-ink-muted hover:bg-off-white hover:text-foreground"
                )}
              >
                <span
                  className={cn(
                    "text-[11px] font-semibold tabular-nums",
                    dayIsToday && !isSelected && "text-forest"
                  )}
                >
                  {day.label}
                </span>
                <span className="flex h-1.5 items-center justify-center gap-0.5">
                  {dots.length > 0 ? (
                    dots.map((tone, index) => (
                      <span
                        key={`${day.iso}-${tone}-${index}`}
                        className={cn(
                          "size-1.5 rounded-full",
                          SCHEDULE_TONE_STYLES[tone].dot
                        )}
                        aria-hidden
                      />
                    ))
                  ) : (
                    <span className="size-1.5 rounded-full bg-transparent" aria-hidden />
                  )}
                </span>
              </button>
            )
          })}
        </div>

        {/* Featured event for selected day */}
        {featured ? (
          <a
            href={featured.href ?? "#"}
            className={cn(
              "block rounded-sm border border-border px-3.5 py-3 transition-colors duration-150 hover:border-forest/20",
              SCHEDULE_TONE_STYLES[getScheduleTone({ event: featured })].slot
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">
                {featured.title}
              </p>
              {featured.kind ? (
                <Badge
                  variant={EVENT_KIND_BADGE_VARIANT[featured.kind]}
                  size="sm"
                >
                  {EVENT_KIND_LABELS[featured.kind]}
                </Badge>
              ) : null}
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              {[
                formatUpcomingDayLabel({ date: featured.date, reference }),
                featured.time,
                featured.subtitle,
              ]
                .filter(Boolean)
                .join(" · ")}
            </p>
            {selectedEvents.length > 1 ? (
              <p className="mt-2 text-[10px] text-ink-muted">
                +{selectedEvents.length - 1} more on this day
              </p>
            ) : null}
          </a>
        ) : (
          <div className="rounded-sm border border-dashed border-border bg-off-white px-3.5 py-6 text-center">
            <p className="text-xs text-ink-muted">Nothing scheduled this day.</p>
          </div>
        )}
      </WidgetContent>
    </Widget>
  )
}
