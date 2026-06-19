"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { minutesToTime, timeToMinutes } from "@/tools/_lib/demo-calendar-data"
import { buildMeetingInviteDraft } from "@/tools/create-meeting/invite"
import type {
  BusySlot,
  CreateMeetingResult,
  MeetingInviteDraft,
  SuggestedMeeting,
} from "@/tools/create-meeting/types"
import {
  CalendarIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FileTextIcon,
  GripVerticalIcon,
  MailIcon,
  SendIcon,
} from "lucide-react"
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns"
import { useCallback, useMemo, useRef, useState } from "react"

const START_HOUR = 7
const END_HOUR = 19
const SLOT_MINUTES = 30
const SLOT_HEIGHT = 28

type SchedulerView = "day" | "week" | "month"
type SchedulerPhase = "scheduling" | "created" | "invite" | "sent" | "done"

export interface MeetingSchedulerCardProps {
  data: CreateMeetingResult
  className?: string
}

/**
 * Returns true when a proposed slot overlaps any busy range.
 */
function overlapsBusy({
  startMinutes,
  durationMinutes,
  busySlots,
}: {
  startMinutes: number
  durationMinutes: number
  busySlots: BusySlot[]
}): boolean {
  const endMinutes = startMinutes + durationMinutes

  return busySlots.some(({ start, end }) => {
    const busyStart = timeToMinutes({ time: start })
    const busyEnd = timeToMinutes({ time: end })
    return startMinutes < busyEnd && endMinutes > busyStart
  })
}

/**
 * Day grid with draggable suggested event and grey busy slots.
 */
function DayScheduler({
  date,
  suggested,
  busySlots,
  startMinutes,
  onStartMinutesChange,
}: {
  date: Date
  suggested: SuggestedMeeting
  busySlots: BusySlot[]
  startMinutes: number
  onStartMinutesChange: ({ minutes }: { minutes: number }) => void
}) {
  const gridRef = useRef<HTMLDivElement>(null)
  const dragOffsetRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  const totalSlots = ((END_HOUR - START_HOUR) * 60) / SLOT_MINUTES
  const gridStartMinutes = START_HOUR * 60
  const eventHeight = (suggested.durationMinutes / SLOT_MINUTES) * SLOT_HEIGHT
  const eventTop =
    ((startMinutes - gridStartMinutes) / SLOT_MINUTES) * SLOT_HEIGHT

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId)
      dragOffsetRef.current =
        event.clientY - event.currentTarget.getBoundingClientRect().top
      setIsDragging(true)
    },
    []
  )

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !gridRef.current) {
        return
      }

      const rect = gridRef.current.getBoundingClientRect()
      const y = event.clientY - rect.top - dragOffsetRef.current
      const slotIndex = Math.round(y / SLOT_HEIGHT)
      const clampedIndex = Math.max(
        0,
        Math.min(slotIndex, totalSlots - suggested.durationMinutes / SLOT_MINUTES)
      )
      const nextMinutes = gridStartMinutes + clampedIndex * SLOT_MINUTES

      if (
        !overlapsBusy({
          startMinutes: nextMinutes,
          durationMinutes: suggested.durationMinutes,
          busySlots,
        })
      ) {
        onStartMinutesChange({ minutes: nextMinutes })
      }
    },
    [
      busySlots,
      isDragging,
      onStartMinutesChange,
      suggested.durationMinutes,
      totalSlots,
      gridStartMinutes,
    ]
  )

  const handlePointerUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-foreground">
        {format(date, "EEEE d MMMM yyyy")}
      </p>
      <div className="flex gap-2">
        {/* Time labels */}
        <div className="w-10 shrink-0 pt-1">
          {Array.from({ length: END_HOUR - START_HOUR }).map((_, index) => (
            <div
              key={index}
              className="text-[10px] text-muted-foreground"
              style={{ height: SLOT_HEIGHT * 2 }}
            >
              {String(START_HOUR + index).padStart(2, "0")}:00
            </div>
          ))}
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="relative min-h-0 flex-1 rounded-sm border border-border bg-white"
          style={{ height: totalSlots * SLOT_HEIGHT }}
        >
          {/* Hour lines */}
          {Array.from({ length: totalSlots }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-x-0 border-t border-border/40",
                index % 2 === 0 && "border-border/70"
              )}
              style={{ top: index * SLOT_HEIGHT }}
            />
          ))}

          {/* Busy slots */}
          {busySlots.map((slot) => {
            const top =
              ((timeToMinutes({ time: slot.start }) - gridStartMinutes) /
                SLOT_MINUTES) *
              SLOT_HEIGHT
            const height =
              ((timeToMinutes({ time: slot.end }) -
                timeToMinutes({ time: slot.start })) /
                SLOT_MINUTES) *
              SLOT_HEIGHT

            return (
              <div
                key={slot.id}
                className="absolute inset-x-1 rounded-sm bg-muted/80 px-2 py-1"
                style={{ top, height }}
              >
                <p className="truncate text-[10px] font-medium text-muted-foreground">
                  {slot.title}
                </p>
                <p className="truncate text-[10px] text-muted-foreground/70">
                  {slot.start} – {slot.end}
                </p>
              </div>
            )
          })}

          {/* Suggested event (draft until Create meeting is clicked) */}
          <div
            role="button"
            tabIndex={0}
            aria-label={`Suggested meeting: ${suggested.title}. Drag to reschedule before creating.`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className={cn(
              "absolute inset-x-1 z-10 cursor-grab rounded-sm border-2 border-dashed border-[#043F2E] bg-[#C8F169]/70 px-2 py-1 shadow-sm active:cursor-grabbing",
              isDragging && "ring-2 ring-[#043F2E]/30"
            )}
            style={{ top: eventTop, height: eventHeight }}
          >
            <div className="flex items-start gap-1">
              <GripVerticalIcon
                className="mt-0.5 size-3 shrink-0 text-[#043F2E]/70"
                aria-hidden="true"
              />
              <div className="min-w-0">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-[#043F2E]/70">
                  Suggested
                </p>
                <p className="truncate text-[11px] font-semibold text-[#043F2E]">
                  {suggested.title}
                </p>
                <p className="truncate text-[10px] text-[#043F2E]/80">
                  {minutesToTime({ minutes: startMinutes })} ·{" "}
                  {suggested.durationMinutes} min
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Compact week overview for the scheduler card.
 */
function WeekScheduler({
  anchorDate,
  suggested,
  busySlots,
  startMinutes,
}: {
  anchorDate: Date
  suggested: SuggestedMeeting
  busySlots: BusySlot[]
  startMinutes: number
}) {
  const weekStart = startOfWeek(anchorDate, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }).map((_, index) => addDays(weekStart, index))
  const suggestedDate = parseISO(suggested.date)

  return (
    <div className="grid grid-cols-7 gap-1">
      {days.map((day) => {
        const isSuggestedDay = isSameDay(day, suggestedDate)
        const label = format(day, "EEE d")

        return (
          <div
            key={day.toISOString()}
            className={cn(
              "min-h-24 rounded-sm border border-border p-1.5",
              isSuggestedDay ? "bg-[#EEF2E3]" : "bg-white"
            )}
          >
            <p className="text-[10px] font-medium text-foreground">{label}</p>
            {isSuggestedDay ? (
              <div className="mt-1 space-y-1">
                {busySlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="rounded-sm bg-muted/80 px-1 py-0.5 text-[9px] text-muted-foreground"
                  >
                    {slot.start} {slot.title}
                  </div>
                ))}
                <div className="rounded-sm border border-dashed border-[#043F2E] bg-[#C8F169]/70 px-1 py-0.5 text-[9px] font-medium text-[#043F2E]">
                  {minutesToTime({ minutes: startMinutes })} {suggested.title}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-[9px] text-muted-foreground/60">Clear</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

/**
 * Month overview for the scheduler card.
 */
function MonthScheduler({
  anchorDate,
  suggested,
}: {
  anchorDate: Date
  suggested: SuggestedMeeting
}) {
  const monthStart = startOfMonth(anchorDate)
  const monthEnd = endOfMonth(anchorDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })
  const suggestedDate = parseISO(suggested.date)

  return (
    <div>
      <p className="mb-2 text-xs font-medium text-foreground">
        {format(anchorDate, "MMMM yyyy")}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, anchorDate)
          const hasSuggested = isSameDay(day, suggestedDate)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex min-h-10 flex-col items-center justify-center rounded-sm border border-border/50 text-[10px]",
                inMonth ? "bg-white text-foreground" : "bg-muted/20 text-muted-foreground/50",
                hasSuggested && "border-[#043F2E] bg-[#EEF2E3] font-semibold text-[#043F2E]"
              )}
            >
              {format(day, "d")}
              {hasSuggested ? (
                <span className="mt-0.5 size-1.5 rounded-full bg-[#043F2E]" />
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Invite email preview after the meeting is created.
 */
function MeetingInviteEmail({
  draft,
  onSend,
  sent,
}: {
  draft: MeetingInviteDraft
  onSend: () => void
  sent: boolean
}) {
  return (
    <div className="w-full overflow-hidden rounded-sm border border-border bg-white">
      <div className="flex items-center justify-between gap-2 bg-[#EEF2E3] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <MailIcon className="size-4 shrink-0 text-[#043F2E]" aria-hidden="true" />
          <span className="text-sm font-semibold text-[#043F2E]">Meeting invite</span>
        </div>
        {sent ? (
          <span className="inline-flex items-center gap-1 text-xs font-medium text-[#043F2E]">
            <CheckIcon className="size-3.5" aria-hidden="true" />
            Sent
          </span>
        ) : (
          <Button type="button" variant="accent" size="sm" onClick={onSend}>
            <SendIcon className="size-3.5" aria-hidden="true" />
            Send
          </Button>
        )}
      </div>
      <div className="space-y-2 px-3 py-3 text-xs">
        <p>
          <span className="font-medium text-muted-foreground">To:</span> {draft.to}
        </p>
        <p>
          <span className="font-medium text-muted-foreground">Subject:</span>{" "}
          {draft.subject}
        </p>
        <pre className="whitespace-pre-wrap rounded-sm bg-muted/40 p-2 text-[11px] leading-relaxed text-foreground">
          {draft.body}
        </pre>
        {draft.attachments.map((attachment) => (
          <div
            key={attachment.name}
            className="flex items-center gap-2 rounded-sm border border-border px-2 py-1.5"
          >
            <FileTextIcon className="size-4 text-muted-foreground" aria-hidden="true" />
            <span>{attachment.name}</span>
            <span className="text-muted-foreground">{attachment.size}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Interactive meeting scheduler with day/week/month views and invite flow.
 */
export function MeetingSchedulerCard({ data, className }: MeetingSchedulerCardProps) {
  const { suggested, busySlots } = data
  const [view, setView] = useState<SchedulerView>("day")
  const [phase, setPhase] = useState<SchedulerPhase>("scheduling")
  const [anchorDate, setAnchorDate] = useState(() => parseISO(suggested.date))
  const [startMinutes, setStartMinutes] = useState(() =>
    timeToMinutes({ time: suggested.startTime })
  )
  const [inviteSent, setInviteSent] = useState(false)

  const scheduledTime = minutesToTime({ minutes: startMinutes })
  const scheduledDate = format(anchorDate, "yyyy-MM-dd")
  const scheduledDateLabel = format(anchorDate, "EEEE d MMMM yyyy")
  const scheduledEndMinutes = startMinutes + suggested.durationMinutes
  const scheduledEndTime = minutesToTime({ minutes: scheduledEndMinutes })
  const slotOverlapsBusy = overlapsBusy({
    startMinutes,
    durationMinutes: suggested.durationMinutes,
    busySlots,
  })
  const inviteDraft = useMemo(
    () =>
      buildMeetingInviteDraft({
        title: suggested.title,
        schemeLabel: suggested.schemeLabel,
        date: scheduledDate,
        startTime: scheduledTime,
        durationMinutes: suggested.durationMinutes,
        location: suggested.location,
        attendees: suggested.attendees,
      }),
    [scheduledDate, scheduledTime, suggested]
  )

  const shiftDate = useCallback(({ days }: { days: number }) => {
    setAnchorDate((current) => addDays(current, days))
  }, [])

  const shiftMonth = useCallback(({ months }: { months: number }) => {
    setAnchorDate((current) => addMonths(current, months))
  }, [])

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-[#EEF2E3] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <CalendarIcon className="size-4 shrink-0 text-[#043F2E]" aria-hidden="true" />
          <span className="text-sm font-semibold text-[#043F2E]">
            {phase === "scheduling" ? "Review suggested time" : "Schedule meeting"}
          </span>
        </div>
        {phase === "scheduling" && (
          <div className="flex items-center gap-1 rounded-sm bg-white/60 p-0.5">
            {(["day", "week", "month"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setView(mode)}
                className={cn(
                  "rounded-sm px-2 py-1 text-[10px] font-medium capitalize transition-colors",
                  view === mode
                    ? "bg-off-white text-forest shadow-sm"
                    : "text-[#043F2E]/70 hover:text-[#043F2E]"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3 px-3 py-3">
        {/* Meeting summary */}
        <div className="rounded-sm border border-border bg-[#FAFAF8] px-3 py-2">
          <p className="text-sm font-medium text-foreground">{suggested.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {suggested.schemeLabel} · {suggested.location}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {suggested.attendees.map(({ name }) => name).join(", ")}
          </p>
        </div>

        {phase === "scheduling" && (
          <>
            {/* Date navigation */}
            <div className="flex items-center justify-between gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  view === "month" ? shiftMonth({ months: -1 }) : shiftDate({ days: -1 })
                }
              >
                <ChevronLeftIcon className="size-4" aria-hidden="true" />
              </Button>
              <span className="text-xs font-medium text-foreground">
                {view === "month"
                  ? format(anchorDate, "MMMM yyyy")
                  : format(anchorDate, "d MMM yyyy")}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  view === "month" ? shiftMonth({ months: 1 }) : shiftDate({ days: 1 })
                }
              >
                <ChevronRightIcon className="size-4" aria-hidden="true" />
              </Button>
            </div>

            {/* Calendar views */}
            {view === "day" && (
              <DayScheduler
                date={anchorDate}
                suggested={suggested}
                busySlots={busySlots}
                startMinutes={startMinutes}
                onStartMinutesChange={({ minutes }) => setStartMinutes(minutes)}
              />
            )}
            {view === "week" && (
              <WeekScheduler
                anchorDate={anchorDate}
                suggested={suggested}
                busySlots={busySlots}
                startMinutes={startMinutes}
              />
            )}
            {view === "month" && (
              <MonthScheduler anchorDate={anchorDate} suggested={suggested} />
            )}

            <p className="text-[11px] text-muted-foreground">
              Drag the suggested block to a free slot. Grey blocks are existing bookings.
              Nothing is saved until you click Create meeting.
            </p>

            {/* Selected slot summary + confirm */}
            <div className="space-y-2 rounded-sm border border-border bg-[#FAFAF8] p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Selected slot
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-foreground">
                    {scheduledDateLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {scheduledTime} – {scheduledEndTime} · {suggested.durationMinutes} min
                  </p>
                </div>
                <span className="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Draft
                </span>
              </div>
              {slotOverlapsBusy ? (
                <p className="text-xs text-destructive">
                  This slot overlaps an existing booking. Drag to a free time before creating.
                </p>
              ) : null}
              <Button
                type="button"
                variant="accent"
                size="sm"
                className="w-full"
                disabled={slotOverlapsBusy}
                onClick={() => setPhase("created")}
              >
                Create meeting
              </Button>
            </div>
          </>
        )}

        {phase === "created" && (
          <div className="space-y-3 rounded-sm border border-border bg-[#FAFAF8] px-3 py-4 text-center">
            <CheckIcon className="mx-auto size-8 text-[#043F2E]" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-foreground">Event created</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {suggested.title} · {scheduledDateLabel} at {scheduledTime}
              </p>
            </div>
            <p className="text-sm text-foreground">
              Would you like to send invites to the other parties?
            </p>
            <div className="flex justify-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setPhase("done")}
              >
                Not now
              </Button>
              <Button type="button" variant="accent" size="sm" onClick={() => setPhase("invite")}>
                Create invites
              </Button>
            </div>
          </div>
        )}

        {phase === "invite" && (
          <MeetingInviteEmail
            draft={inviteDraft}
            sent={inviteSent}
            onSend={() => {
              setInviteSent(true)
              setPhase("sent")
            }}
          />
        )}

        {phase === "sent" && (
          <div className="rounded-sm border border-border bg-[#EEF2E3]/40 px-3 py-3 text-center">
            <p className="text-sm font-medium text-[#043F2E]">
              Invites sent with calendar attachment
            </p>
          </div>
        )}

        {phase === "done" && (
          <div className="rounded-sm border border-border bg-muted/30 px-3 py-3 text-center">
            <p className="text-sm text-muted-foreground">
              Event saved without sending invites.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export interface MeetingSchedulerCardLoadingProps {
  className?: string
}

/**
 * Loading state for the create meeting tool.
 */
export function MeetingSchedulerCardLoading({ className }: MeetingSchedulerCardLoadingProps) {
  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-sm border border-border bg-white px-3 py-8 text-center shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      <CalendarIcon className="mx-auto size-6 text-muted-foreground/50" aria-hidden="true" />
      <p className="mt-2 text-sm text-muted-foreground">Preparing scheduler…</p>
    </div>
  )
}
