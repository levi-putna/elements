"use client"

import * as React from "react"
import { format, formatDistanceToNow } from "date-fns"
import { TZDate } from "@date-fns/tz"

import { cn } from "@/lib/utils"
import { Badge, type BadgeProps } from "@/components/ui/badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

type DateValue = Date | string | number

function toDate(value: DateValue): Date {
  return value instanceof Date ? value : new Date(value)
}

/** Format a date with a date-fns pattern, optionally in a specific IANA zone. */
function formatInZone(date: Date, pattern: string, timeZone?: string): string {
  return timeZone
    ? format(new TZDate(date, timeZone), pattern)
    : format(date, pattern)
}

/** Short zone label for a date, e.g. "UTC", "GMT+10", "PST". */
function zoneLabel(date: Date, timeZone?: string): string {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "short",
    }).formatToParts(date)
    return parts.find((part) => part.type === "timeZoneName")?.value ?? ""
  } catch {
    return ""
  }
}

function localZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone
  } catch {
    return ""
  }
}

/* -------------------------------------------------------------------------- */
/*  DateBadge — non-interactive formatted date                               */
/* -------------------------------------------------------------------------- */

interface DateBadgeProps extends Omit<BadgeProps, "children"> {
  /** The date to display: a Date, ISO string, or epoch ms. */
  date: DateValue
  /** date-fns pattern used to render the date. */
  displayFormat?: string
  /** Render in this IANA time zone (e.g. "Australia/Sydney"). Defaults to local. */
  timeZone?: string
  /** Show a leading zone label chip (e.g. "GMT+10"). */
  showZone?: boolean
}

function DateBadge({
  date,
  displayFormat = "d MMM yyyy",
  timeZone,
  showZone = false,
  variant = "outline",
  className,
  ...props
}: DateBadgeProps) {
  const d = toDate(date)
  return (
    <Badge
      variant={variant}
      className={cn("gap-1.5 tabular-nums", className)}
      {...props}
    >
      {showZone && (
        <span className="rounded-xs bg-secondary px-1 py-px font-mono text-[10px] font-medium uppercase tracking-wide text-ink-muted">
          {zoneLabel(d, timeZone)}
        </span>
      )}
      {formatInZone(d, displayFormat, timeZone)}
    </Badge>
  )
}

/* -------------------------------------------------------------------------- */
/*  DateTag — formatted date that reveals zones + relative time on hover     */
/* -------------------------------------------------------------------------- */

function ZoneRow({
  label,
  value,
  muted,
}: {
  label: string
  value: string
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span
        className={cn(
          "rounded-xs px-1 py-px font-mono text-[10px] font-medium uppercase tracking-wide",
          muted ? "bg-secondary text-ink-muted" : "bg-lime-soft text-ink"
        )}
      >
        {label}
      </span>
      <span className="text-xs tabular-nums text-foreground">{value}</span>
    </div>
  )
}

interface DateTagProps {
  /** The date to display: a Date, ISO string, or epoch ms. */
  date: DateValue
  /** date-fns pattern for the inline trigger text. */
  displayFormat?: string
  /** date-fns pattern for the rows inside the hover card. */
  detailFormat?: string
  /** Render the displayed value in this IANA time zone. Defaults to local. */
  timeZone?: string
  /** Override the displayed zone's label (otherwise derived, e.g. "GMT+10"). */
  timeZoneLabel?: string
  /** Show the "x ago" header. */
  relative?: boolean
  className?: string
}

function DateTag({
  date,
  displayFormat = "d MMM yyyy",
  detailFormat = "d MMM yyyy, h:mm:ss a",
  timeZone,
  timeZoneLabel,
  relative = true,
  className,
}: DateTagProps) {
  const d = toDate(date)
  const local = localZone()
  const displayedDetail = formatInZone(d, detailFormat, timeZone)
  const localDetail = formatInZone(d, detailFormat, local)
  // Only show the viewer's local row when it actually reads differently —
  // same wall-clock time (e.g. two GMT+10 zones) needs no second row.
  const showLocal = Boolean(timeZone) && displayedDetail !== localDetail

  return (
    <HoverCard>
      <HoverCardTrigger
        render={
          <span
            tabIndex={0}
            className={cn(
              "cursor-help border-b border-dashed border-ink-muted/40 tabular-nums underline-offset-2 outline-none hover:border-ink-muted focus-visible:border-ring",
              className
            )}
          />
        }
      >
        {formatInZone(d, displayFormat, timeZone)}
      </HoverCardTrigger>
      <HoverCardContent className="w-auto min-w-60 p-0">
        {relative && (
          <div className="px-3 py-2 text-xs font-medium text-foreground">
            {formatDistanceToNow(d, { addSuffix: true, includeSeconds: true })}
          </div>
        )}
        <div
          className={cn(
            "flex flex-col gap-1.5 px-3 py-2",
            relative && "border-t border-border"
          )}
        >
          <ZoneRow
            label={timeZoneLabel ?? zoneLabel(d, timeZone)}
            value={displayedDetail}
          />
          {showLocal && (
            <ZoneRow muted label={zoneLabel(d, local)} value={localDetail} />
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export { DateBadge, DateTag }
export type { DateBadgeProps, DateTagProps, DateValue }
