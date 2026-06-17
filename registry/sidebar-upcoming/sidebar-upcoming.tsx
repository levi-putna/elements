"use client"

import * as React from "react"
import {
  addDays,
  format,
  isToday,
  isTomorrow,
  parseISO,
  startOfDay,
} from "date-fns"
import { ArrowRight, AlertCircle, Banknote, Calendar, ChevronDown, ClipboardCheck, Users, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { SidebarGroupLabel, useSidebar } from "@/components/ui/sidebar"

// ─────────────────────────────────────────────────────────
// SidebarUpcoming: a low-key upcoming events strip for the sidebar
//
// Sits below the main navigation inside SidebarContent. Shows events
// from today through the next few days (for agent awareness), capped
// at a small number with a view-all link. Collapsed by default it shows
// the upcoming count; expand to read the list. Hidden when the sidebar
// collapses to icons.
// ─────────────────────────────────────────────────────────

export type UpcomingEventKind =
  | "meeting"
  | "deadline"
  | "inspection"
  | "levy"
  | "agm"

export interface UpcomingEvent {
  id: string
  title: string
  href: string
  /** Calendar day in ISO form (YYYY-MM-DD). */
  date: string
  time?: string
  scheme?: string
  kind?: UpcomingEventKind
}

export interface SidebarUpcomingProps {
  events: UpcomingEvent[]
  /** Maximum rows shown. Default 5. */
  maxItems?: number
  /** How many days ahead to include (including today). Default 5. */
  horizonDays?: number
  /** Section heading. */
  title?: string
  viewAllHref?: string
  viewAllLabel?: string
  /** Whether the event list starts expanded. Default collapsed (count only). */
  defaultOpen?: boolean
  className?: string
}

const EVENT_KIND_ICONS: Record<UpcomingEventKind, LucideIcon> = {
  meeting: Calendar,
  deadline: AlertCircle,
  inspection: ClipboardCheck,
  levy: Banknote,
  agm: Users,
}

/**
 * Formats an event day as Today, Tomorrow, or a short weekday label.
 */
export function formatUpcomingDayLabel({
  date,
  reference = new Date(),
}: {
  date: string
  reference?: Date
}): string {
  const eventDate = startOfDay(parseISO(date))
  const ref = startOfDay(reference)

  if (isToday(eventDate)) {
    return "Today"
  }

  if (isTomorrow(eventDate)) {
    return "Tomorrow"
  }

  if (eventDate.getFullYear() === ref.getFullYear()) {
    return format(eventDate, "EEE d MMM")
  }

  return format(eventDate, "d MMM yyyy")
}

/**
 * Returns events from today through the horizon, sorted soonest first.
 */
export function selectUpcomingEvents({
  events,
  maxItems,
  horizonDays = 5,
  reference = new Date(),
}: {
  events: UpcomingEvent[]
  maxItems?: number
  horizonDays?: number
  reference?: Date
}): UpcomingEvent[] {
  const start = startOfDay(reference)
  const end = addDays(start, Math.max(horizonDays - 1, 0))

  const sorted = [...events]
    .filter((event) => {
      const eventDate = startOfDay(parseISO(event.date))
      return eventDate >= start && eventDate <= end
    })
    .sort((left, right) => {
      const leftTime = startOfDay(parseISO(left.date)).getTime()
      const rightTime = startOfDay(parseISO(right.date)).getTime()
      if (leftTime !== rightTime) {
        return leftTime - rightTime
      }
      return left.title.localeCompare(right.title)
    })

  if (maxItems === undefined) {
    return sorted
  }

  return sorted.slice(0, maxItems)
}

/**
 * Groups a sorted event list by calendar day, preserving chronological order.
 */
export function groupUpcomingEventsByDay({
  events,
  reference = new Date(),
}: {
  events: UpcomingEvent[]
  reference?: Date
}): Array<{ date: string; label: string; items: UpcomingEvent[] }> {
  const itemsByDate = new Map<string, UpcomingEvent[]>()

  for (const event of events) {
    const bucket = itemsByDate.get(event.date) ?? []
    bucket.push(event)
    itemsByDate.set(event.date, bucket)
  }

  const groups: Array<{ date: string; label: string; items: UpcomingEvent[] }> = []
  const seenDates = new Set<string>()

  for (const event of events) {
    if (seenDates.has(event.date)) {
      continue
    }

    seenDates.add(event.date)
    groups.push({
      date: event.date,
      label: formatUpcomingDayLabel({ date: event.date, reference }),
      items: itemsByDate.get(event.date) ?? [],
    })
  }

  return groups
}

/**
 * Upcoming events for the sidebar: today plus the next few days.
 */
export function SidebarUpcoming({
  events,
  maxItems = 5,
  horizonDays = 5,
  title = "Upcoming",
  viewAllHref,
  viewAllLabel = "View all",
  defaultOpen = false,
  className,
}: SidebarUpcomingProps) {
  const { state } = useSidebar()
  const [open, setOpen] = React.useState(defaultOpen)
  const reference = React.useMemo(() => new Date(), [])

  const eventsInHorizon = React.useMemo(
    () =>
      selectUpcomingEvents({
        events,
        horizonDays,
        reference,
      }),
    [events, horizonDays, reference]
  )

  const visibleEvents = React.useMemo(
    () => eventsInHorizon.slice(0, maxItems),
    [eventsInHorizon, maxItems]
  )

  const visibleGroups = React.useMemo(
    () =>
      groupUpcomingEventsByDay({
        events: visibleEvents,
        reference,
      }),
    [reference, visibleEvents]
  )

  const totalCount = eventsInHorizon.length

  if (state === "collapsed" || totalCount === 0) {
    return null
  }

  return (
    <section
      className={cn(
        "shrink-0 border-t border-sidebar-border/50 group-data-[collapsible=icon]:hidden",
        className
      )}
      aria-label={title}
    >
      {/* Summary row: expand/collapse trigger */}
      <div className="px-2 pt-2">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors duration-150 hover:bg-sidebar-accent/40"
        >
          <Calendar
            className="size-3.5 shrink-0 text-sidebar-foreground/40"
            aria-hidden
          />
          <span className="min-w-0 flex-1 truncate text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            {title}
          </span>
          <span className="shrink-0 text-[11px] tabular-nums text-sidebar-foreground/55">
            {totalCount}
          </span>
          <ChevronDown
            className={cn(
              "size-3.5 shrink-0 text-sidebar-foreground/40 transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </button>
      </div>

      {/* Event rows */}
      {open ? (
        <>
          <div className="flex flex-col gap-2 px-2 pb-1">
            {visibleGroups.map((group) => (
              <div key={group.date}>
                {/* Day grouping label */}
                <SidebarGroupLabel className="h-6 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
                  {group.label}
                </SidebarGroupLabel>

                <ul className="flex flex-col gap-px">
                  {group.items.map((event) => {
                    const Icon = EVENT_KIND_ICONS[event.kind ?? "meeting"]
                    const meta = [event.time, event.scheme]
                      .filter(Boolean)
                      .join(" · ")

                    return (
                      <li key={event.id}>
                        <a
                          href={event.href}
                          className="flex items-start gap-2 rounded-md px-2 py-1.5 text-sidebar-foreground/75 transition-colors duration-150 hover:bg-sidebar-accent/40 hover:text-sidebar-accent-foreground"
                        >
                          <Icon
                            className="mt-0.5 size-3.5 shrink-0 text-sidebar-foreground/35"
                            aria-hidden
                          />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-xs leading-snug text-sidebar-foreground/85">
                              {event.title}
                            </span>
                            {meta ? (
                              <span className="block truncate text-[10px] leading-snug text-sidebar-foreground/45">
                                {meta}
                              </span>
                            ) : null}
                          </span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* View all */}
          {viewAllHref ? (
            <div className="px-4 pb-3 pt-1">
              <a
                href={viewAllHref}
                className="inline-flex items-center gap-1 text-[11px] text-sidebar-foreground/45 transition-colors duration-150 hover:text-sidebar-foreground/75"
              >
                {viewAllLabel}
                <ArrowRight className="size-3" aria-hidden />
              </a>
            </div>
          ) : null}
        </>
      ) : null}
    </section>
  )
}
