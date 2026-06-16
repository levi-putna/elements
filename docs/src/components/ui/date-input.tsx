"use client"

import * as React from "react"
import { format, isValid, parse, set, startOfDay } from "date-fns"
import { CalendarIcon, ClockIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

type CalendarProps = React.ComponentProps<typeof Calendar>
/** Calendar props that callers may forward, minus the ones we control. */
type CalendarPassthroughProps = Omit<
  CalendarProps,
  "mode" | "selected" | "onSelect" | "defaultMonth"
>

/* -------------------------------------------------------------------------- */
/*  Shared shell                                                              */
/* -------------------------------------------------------------------------- */

function FieldShell({
  invalid,
  disabled,
  className,
  children,
}: {
  invalid?: boolean
  disabled?: boolean
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-slot="date-field"
      data-invalid={invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        "flex h-8 w-full min-w-0 items-center gap-1 rounded-sm border border-input bg-transparent py-1 pr-1 pl-2.5 text-base transition-colors md:text-sm",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:bg-input/50 data-disabled:opacity-50",
        "data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20",
        "dark:bg-input/30 dark:data-disabled:bg-input/80 dark:data-invalid:border-destructive/50 dark:data-invalid:ring-destructive/40",
        className
      )}
    >
      {children}
    </div>
  )
}

function FieldText({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="date-field-input"
      className={cn(
        "h-full w-full min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
        className
      )}
      {...props}
    />
  )
}

function FieldTrigger({
  "aria-label": ariaLabel,
  disabled,
  children,
}: {
  "aria-label": string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <PopoverTrigger
      render={
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          disabled={disabled}
          aria-label={ariaLabel}
          className="shrink-0 text-muted-foreground"
        />
      }
    >
      {children}
    </PopoverTrigger>
  )
}

/* -------------------------------------------------------------------------- */
/*  useFormattedField — single Date <-> formatted string contract            */
/* -------------------------------------------------------------------------- */

interface FormattedFieldOptions {
  value?: string
  defaultValue?: string
  displayFormat: string
  valueFormat: string
  onValueChange?: (value: string) => void
  onDateChange?: (date: Date | undefined) => void
}

function useFormattedField({
  value,
  defaultValue,
  displayFormat,
  valueFormat,
  onValueChange,
  onDateChange,
}: FormattedFieldOptions) {
  const isControlled = value !== undefined

  const parseValue = React.useCallback(
    (input?: string) => {
      if (!input) return undefined
      const parsed = parse(input, valueFormat, new Date())
      return isValid(parsed) ? parsed : undefined
    },
    [valueFormat]
  )

  const [internal, setInternal] = React.useState<Date | undefined>(() =>
    parseValue(defaultValue)
  )
  const date = isControlled ? parseValue(value) : internal
  const committed = date ? format(date, valueFormat) : ""

  const [text, setText] = React.useState(() =>
    date ? format(date, displayFormat) : ""
  )
  const [invalid, setInvalid] = React.useState(false)

  // Re-sync the visible text whenever the committed value (or format) changes —
  // e.g. a calendar selection, a controlled update, or a normalised commit.
  React.useEffect(() => {
    React.startTransition(() => {
      setText(committed ? format(parse(committed, valueFormat, new Date()), displayFormat) : "")
      setInvalid(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [committed, displayFormat])

  const commit = React.useCallback(
    (next: Date | undefined) => {
      if (!isControlled) setInternal(next)
      onValueChange?.(next ? format(next, valueFormat) : "")
      onDateChange?.(next)
      setInvalid(false)
    },
    [isControlled, onValueChange, onDateChange, valueFormat]
  )

  const commitText = React.useCallback(() => {
    const trimmed = text.trim()
    if (!trimmed) {
      commit(undefined)
      return
    }
    const parsed = parse(trimmed, displayFormat, date ?? new Date())
    if (isValid(parsed)) {
      commit(parsed)
      setText(format(parsed, displayFormat))
    } else {
      setInvalid(true)
    }
  }, [text, displayFormat, date, commit])

  return { date, committed, text, setText, invalid, commit, commitText }
}

function handleEnter(
  e: React.KeyboardEvent<HTMLInputElement>,
  commitText: () => void
) {
  if (e.key === "Enter") {
    e.preventDefault()
    commitText()
  }
}

/* -------------------------------------------------------------------------- */
/*  DateInput                                                                 */
/* -------------------------------------------------------------------------- */

interface DateInputProps {
  /** Controlled value, a string in `valueFormat`. */
  value?: string
  /** Uncontrolled initial value, a string in `valueFormat`. */
  defaultValue?: string
  /** Fires with the selected value formatted with `valueFormat` (or "" when cleared). */
  onValueChange?: (value: string) => void
  /** Escape hatch: fires with the raw `Date` (or `undefined` when cleared). */
  onDateChange?: (date: Date | undefined) => void
  /** date-fns pattern shown in the field. */
  displayFormat?: string
  /** date-fns pattern emitted by `onValueChange` / the hidden form input. */
  valueFormat?: string
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  className?: string
  /** Forwarded to the underlying `Calendar` (e.g. `disabled`, `captionLayout`). */
  calendarProps?: Partial<CalendarPassthroughProps>
}

function DateInput({
  value,
  defaultValue,
  onValueChange,
  onDateChange,
  displayFormat = "d MMM yyyy",
  valueFormat = "yyyy-MM-dd",
  placeholder = "Select a date",
  disabled,
  id,
  name,
  className,
  calendarProps,
}: DateInputProps) {
  const [open, setOpen] = React.useState(false)
  const f = useFormattedField({
    value,
    defaultValue,
    displayFormat,
    valueFormat,
    onValueChange,
    onDateChange,
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <FieldShell invalid={f.invalid} disabled={disabled} className={className}>
        <FieldText
          id={id}
          value={f.text}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={f.invalid || undefined}
          inputMode="numeric"
          onChange={(e) => f.setText(e.target.value)}
          onBlur={f.commitText}
          onKeyDown={(e) => handleEnter(e, f.commitText)}
        />
        {name && <input type="hidden" name={name} value={f.committed} />}
        <FieldTrigger aria-label="Open calendar" disabled={disabled}>
          <CalendarIcon />
        </FieldTrigger>
      </FieldShell>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          {...calendarProps}
          mode="single"
          selected={f.date}
          defaultMonth={f.date}
          autoFocus
          onSelect={(d) => {
            f.commit(d)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

/* -------------------------------------------------------------------------- */
/*  TimeInput                                                                 */
/* -------------------------------------------------------------------------- */

function buildTimeOptions(step: number) {
  const base = startOfDay(new Date())
  const options: Date[] = []
  for (let minutes = 0; minutes < 24 * 60; minutes += step) {
    options.push(set(base, { hours: Math.floor(minutes / 60), minutes: minutes % 60 }))
  }
  return options
}

function TimeList({
  selected,
  valueFormat,
  displayFormat,
  step,
  onSelect,
}: {
  selected?: Date
  valueFormat: string
  displayFormat: string
  step: number
  onSelect: (date: Date) => void
}) {
  const options = React.useMemo(() => buildTimeOptions(step), [step])
  const selectedKey = selected ? format(selected, "HH:mm") : null

  return (
    <div
      role="listbox"
      className="flex max-h-64 w-36 flex-col gap-0.5 overflow-y-auto p-1.5"
    >
      {options.map((option) => {
        const key = format(option, "HH:mm")
        const isSelected = key === selectedKey
        return (
          <Button
            key={key}
            type="button"
            role="option"
            aria-selected={isSelected}
            variant={isSelected ? "default" : "ghost"}
            size="sm"
            className="w-full justify-start font-normal"
            onClick={() =>
              onSelect(
                set(selected ?? new Date(), {
                  hours: option.getHours(),
                  minutes: option.getMinutes(),
                  seconds: 0,
                  milliseconds: 0,
                })
              )
            }
            data-value={format(option, valueFormat)}
          >
            {format(option, displayFormat)}
          </Button>
        )
      })}
    </div>
  )
}

interface TimeInputProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onDateChange?: (date: Date | undefined) => void
  /** date-fns pattern shown in the field. Defaults to 12-hour `h:mm a`. */
  displayFormat?: string
  /** date-fns pattern emitted. Defaults to 24-hour `HH:mm`. */
  valueFormat?: string
  /** Minutes between suggested options. */
  step?: number
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  className?: string
}

function TimeInput({
  value,
  defaultValue,
  onValueChange,
  onDateChange,
  displayFormat = "h:mm a",
  valueFormat = "HH:mm",
  step = 30,
  placeholder = "Select a time",
  disabled,
  id,
  name,
  className,
}: TimeInputProps) {
  const [open, setOpen] = React.useState(false)
  const f = useFormattedField({
    value,
    defaultValue,
    displayFormat,
    valueFormat,
    onValueChange,
    onDateChange,
  })

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <FieldShell invalid={f.invalid} disabled={disabled} className={className}>
        <FieldText
          id={id}
          value={f.text}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={f.invalid || undefined}
          onChange={(e) => f.setText(e.target.value)}
          onBlur={f.commitText}
          onKeyDown={(e) => handleEnter(e, f.commitText)}
        />
        {name && <input type="hidden" name={name} value={f.committed} />}
        <FieldTrigger aria-label="Open time list" disabled={disabled}>
          <ClockIcon />
        </FieldTrigger>
      </FieldShell>
      <PopoverContent align="end" className="w-auto p-0">
        <TimeList
          selected={f.date}
          valueFormat={valueFormat}
          displayFormat={displayFormat}
          step={step}
          onSelect={(d) => {
            f.commit(d)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

/* -------------------------------------------------------------------------- */
/*  DateTimeInput                                                             */
/* -------------------------------------------------------------------------- */

interface DateTimeInputProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  onDateChange?: (date: Date | undefined) => void
  /** date-fns pattern shown in the field. */
  displayFormat?: string
  /** date-fns pattern emitted. */
  valueFormat?: string
  /** Minutes between suggested time options. */
  step?: number
  /** date-fns pattern for the time list labels. */
  timeFormat?: string
  placeholder?: string
  disabled?: boolean
  id?: string
  name?: string
  className?: string
  calendarProps?: Partial<CalendarPassthroughProps>
}

function DateTimeInput({
  value,
  defaultValue,
  onValueChange,
  onDateChange,
  displayFormat = "d MMM yyyy, h:mm a",
  valueFormat = "yyyy-MM-dd'T'HH:mm",
  step = 30,
  timeFormat = "h:mm a",
  placeholder = "Select date and time",
  disabled,
  id,
  name,
  className,
  calendarProps,
}: DateTimeInputProps) {
  const [open, setOpen] = React.useState(false)
  const f = useFormattedField({
    value,
    defaultValue,
    displayFormat,
    valueFormat,
    onValueChange,
    onDateChange,
  })

  const handleDay = (day: Date | undefined) => {
    if (!day) {
      f.commit(undefined)
      return
    }
    // Preserve the chosen time across day changes; default to midnight.
    const next = set(day, {
      hours: f.date?.getHours() ?? 0,
      minutes: f.date?.getMinutes() ?? 0,
      seconds: 0,
      milliseconds: 0,
    })
    f.commit(next)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <FieldShell invalid={f.invalid} disabled={disabled} className={className}>
        <FieldText
          id={id}
          value={f.text}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={f.invalid || undefined}
          onChange={(e) => f.setText(e.target.value)}
          onBlur={f.commitText}
          onKeyDown={(e) => handleEnter(e, f.commitText)}
        />
        {name && <input type="hidden" name={name} value={f.committed} />}
        <FieldTrigger aria-label="Open date and time picker" disabled={disabled}>
          <CalendarIcon />
        </FieldTrigger>
      </FieldShell>
      <PopoverContent align="end" className="w-auto p-0">
        <div className="flex max-sm:flex-col">
          <Calendar
            {...calendarProps}
            mode="single"
            selected={f.date}
            defaultMonth={f.date}
            autoFocus
            onSelect={handleDay}
          />
          <div className="border-t sm:border-t-0 sm:border-l">
            <TimeList
              selected={f.date}
              valueFormat={valueFormat}
              displayFormat={timeFormat}
              step={step}
              onSelect={(d) => f.commit(d)}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* -------------------------------------------------------------------------- */
/*  DateRangeInput                                                            */
/* -------------------------------------------------------------------------- */

interface DateRangeValue {
  from?: string
  to?: string
}

interface DateRangeInputProps {
  value?: DateRangeValue
  defaultValue?: DateRangeValue
  /** Fires with `{ from, to }` strings formatted with `valueFormat`. */
  onValueChange?: (value: DateRangeValue) => void
  /** Escape hatch: fires with the raw `DateRange`. */
  onRangeChange?: (range: DateRange | undefined) => void
  displayFormat?: string
  valueFormat?: string
  numberOfMonths?: number
  placeholder?: string
  disabled?: boolean
  id?: string
  className?: string
  calendarProps?: Partial<CalendarPassthroughProps>
}

function DateRangeInput({
  value,
  defaultValue,
  onValueChange,
  onRangeChange,
  displayFormat = "d MMM yyyy",
  valueFormat = "yyyy-MM-dd",
  numberOfMonths = 2,
  placeholder = "Select a date range",
  disabled,
  id,
  className,
  calendarProps,
}: DateRangeInputProps) {
  const [open, setOpen] = React.useState(false)
  const isControlled = value !== undefined

  const toRange = React.useCallback(
    (input?: DateRangeValue): DateRange | undefined => {
      if (!input?.from) return undefined
      const from = parse(input.from, valueFormat, new Date())
      if (!isValid(from)) return undefined
      const to = input.to ? parse(input.to, valueFormat, new Date()) : undefined
      return { from, to: to && isValid(to) ? to : undefined }
    },
    [valueFormat]
  )

  const [internal, setInternal] = React.useState<DateRange | undefined>(() =>
    toRange(defaultValue)
  )
  const range = isControlled ? toRange(value) : internal

  const commit = (next: DateRange | undefined) => {
    if (!isControlled) setInternal(next)
    onRangeChange?.(next)
    onValueChange?.({
      from: next?.from ? format(next.from, valueFormat) : undefined,
      to: next?.to ? format(next.to, valueFormat) : undefined,
    })
  }

  const label =
    range?.from && range?.to
      ? `${format(range.from, displayFormat)} – ${format(range.to, displayFormat)}`
      : range?.from
        ? format(range.from, displayFormat)
        : placeholder

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            id={id}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-8 w-full min-w-0 justify-between gap-2 px-2.5 font-normal",
              !range?.from && "text-muted-foreground",
              className
            )}
          />
        }
      >
        <span className="truncate">{label}</span>
        <CalendarIcon className="shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          {...calendarProps}
          mode="range"
          selected={range}
          defaultMonth={range?.from}
          numberOfMonths={numberOfMonths}
          autoFocus
          onSelect={(next) => commit(next)}
        />
      </PopoverContent>
    </Popover>
  )
}

export {
  DateInput,
  TimeInput,
  DateTimeInput,
  DateRangeInput,
}
export type {
  DateInputProps,
  TimeInputProps,
  DateTimeInputProps,
  DateRangeInputProps,
  DateRangeValue,
}
