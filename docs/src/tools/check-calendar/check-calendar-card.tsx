"use client"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import type { CheckCalendarResult } from "@/tools/check-calendar/types"
import {
  CalendarIcon,
  AlertCircleIcon,
} from "lucide-react"

const KIND_LABELS = {
  meeting: "Meeting",
  inspection: "Inspection",
  deadline: "Deadline",
  agm: "AGM",
} as const

export interface CheckCalendarCardProps {
  result: CheckCalendarResult
  className?: string
}

/**
 * Calendar search results with applied filter summary.
 */
export function CheckCalendarCard({ result, className }: CheckCalendarCardProps) {
  const { filters, events, availableSchemes } = result
  const isEmpty = events.length === 0

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border bg-[#EEF2E3] px-3 py-2">
        <CalendarIcon className="size-4 shrink-0 text-[#043F2E]" aria-hidden="true" />
        <span className="text-sm font-semibold text-[#043F2E]">Calendar</span>
        <span className="truncate text-xs text-muted-foreground">
          {isEmpty ? "No matching events" : `${events.length} upcoming`}
        </span>
      </div>

      {/* Filters */}
      <div className="grid gap-3 border-b border-border bg-[#FAFAF8] px-3 py-3 sm:grid-cols-2">
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Scheme
          </p>
          <Select value={filters.schemeId ?? "all"} disabled>
            <SelectTrigger size="sm" className="w-full">
              <SelectValue>
                {filters.schemeLabel ?? "All schemes"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All schemes</SelectItem>
              {availableSchemes.map(({ id, label }) => (
                <SelectItem key={id} value={id}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Event type
          </p>
          <Select value={filters.eventKind} disabled>
            <SelectTrigger size="sm" className="w-full">
              <SelectValue>
                {filters.eventKind === "all"
                  ? "All types"
                  : KIND_LABELS[filters.eventKind as keyof typeof KIND_LABELS] ??
                    filters.eventKind}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="meeting">Meetings</SelectItem>
              <SelectItem value="inspection">Inspections</SelectItem>
              <SelectItem value="deadline">Deadlines</SelectItem>
              <SelectItem value="agm">AGM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results */}
      <div className="px-3 py-3">
        {isEmpty ? (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <AlertCircleIcon className="size-8 text-muted-foreground/40" aria-hidden="true" />
            <p className="text-sm font-medium text-foreground">No events found</p>
            <p className="max-w-xs text-xs text-muted-foreground">
              {filters.schemeLabel
                ? `Nothing scheduled for ${filters.schemeLabel} in this range. Try another scheme or widen the date filter.`
                : "Nothing scheduled for the selected filters."}
            </p>
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {events.map((event) => (
              <li
                key={event.id}
                className="rounded-sm border border-border bg-white px-3 py-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {event.title}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {event.schemeLabel}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-foreground">
                    {KIND_LABELS[event.kind]}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {event.date} · {event.time} – {event.endTime}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export interface CheckCalendarCardLoadingProps {
  className?: string
}

/**
 * Loading state for the calendar check tool.
 */
export function CheckCalendarCardLoading({ className }: CheckCalendarCardLoadingProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-sm border border-border bg-white px-3 py-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      <CalendarIcon className="mx-auto size-6 text-muted-foreground/50" aria-hidden="true" />
      <p className="mt-2 text-sm text-muted-foreground">Checking calendar…</p>
    </div>
  )
}
