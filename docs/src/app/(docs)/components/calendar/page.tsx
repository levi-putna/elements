"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";

import { Calendar } from "@/components/ui/calendar";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/calendar/registry.json`;

const SINGLE_CODE = `import { Calendar } from "@/components/ui/calendar"

export function Example() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return <Calendar mode="single" selected={date} onSelect={setDate} />
}`;

const RANGE_CODE = `import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"

export function Example() {
  const [range, setRange] = React.useState<DateRange | undefined>()

  return (
    <Calendar
      mode="range"
      numberOfMonths={2}
      selected={range}
      onSelect={setRange}
    />
  )
}`;

const DROPDOWN_CODE = `{/* Month + year dropdowns let users jump to a distant date fast. */}
<Calendar
  mode="single"
  captionLayout="dropdown"
  startMonth={new Date(1980, 0)}
  endMonth={new Date(2030, 11)}
  selected={date}
  onSelect={setDate}
/>`;

const DISABLED_CODE = `{/* Disable weekends and any past date. */}
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  disabled={[
    { dayOfWeek: [0, 6] },
    { before: new Date() },
  ]}
/>`;

const CALENDAR_PROPS = [
  { name: "mode", type: '"single" | "multiple" | "range"', default: '"single"', description: "Selection behaviour. Use range for start/end selection." },
  { name: "selected", type: "Date | Date[] | DateRange", description: "The currently selected date(s); shape depends on mode." },
  { name: "onSelect", type: "(value) => void", description: "Fires when the selection changes." },
  { name: "numberOfMonths", type: "number", default: "1", description: "How many months to render side by side — use 2 for ranges." },
  { name: "captionLayout", type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"', default: '"label"', description: "Render the caption as plain text or as month/year dropdowns." },
  { name: "startMonth / endMonth", type: "Date", description: "Clamp the navigable range (and the dropdown options)." },
  { name: "disabled", type: "Matcher | Matcher[]", description: "Dates that cannot be selected, e.g. { before: new Date() } or { dayOfWeek: [0, 6] }." },
  { name: "showOutsideDays", type: "boolean", default: "true", description: "Show the leading/trailing days of adjacent months." },
  { name: "showWeekNumber", type: "boolean", default: "false", description: "Add an ISO week-number column." },
  { name: "buttonVariant", type: "ButtonProps[\"variant\"]", default: '"ghost"', description: "Variant used for the prev/next navigation buttons." },
];

export default function CalendarPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });
  const [dob, setDob] = React.useState<Date | undefined>(undefined);
  const [booking, setBooking] = React.useState<Date | undefined>(undefined);

  return (
    <DocsPage width="wide">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Forms
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Calendar
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A date-field calendar for selecting a single date or a range. Based on{" "}
          <a
            href="https://ui.shadcn.com/docs/components/base/calendar"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            shadcn/ui Calendar
          </a>{" "}
          — built on{" "}
          <a
            href="https://daypicker.dev"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            React DayPicker
          </a>{" "}
          (Base UI has no calendar primitive) with Instant Strata styling. To
          attach it to a text field, see{" "}
          <a
            href="/components/date-input"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Date Input
          </a>
          .
        </p>
      </div>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* UX notes */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Designing for date selection
        </h2>
        <ul className="text-sm text-ink-muted leading-relaxed max-w-2xl list-disc pl-5 space-y-1.5">
          <li>
            <strong className="text-foreground font-medium">Don&apos;t force the calendar.</strong>{" "}
            A calendar is great for browsing (&ldquo;the second Tuesday&rdquo;) but slow for known
            dates. Pair it with a typed field — see Date Input — so people can do either.
          </li>
          <li>
            <strong className="text-foreground font-medium">Show today and the selection clearly.</strong>{" "}
            Today is tinted; the selected day uses the primary colour; range ends are filled with the
            middle highlighted.
          </li>
          <li>
            <strong className="text-foreground font-medium">Help users reach distant dates.</strong>{" "}
            For birthdays or expiry dates, switch the caption to dropdowns so they can jump years
            without clicking the arrow dozens of times.
          </li>
          <li>
            <strong className="text-foreground font-medium">Constrain when you can.</strong>{" "}
            Disable impossible dates (past dates for a booking, weekends for a delivery) rather than
            letting users pick them and erroring later.
          </li>
          <li>
            <strong className="text-foreground font-medium">It&apos;s keyboard accessible.</strong>{" "}
            Arrow keys move day to day, Page Up/Down change months, and focus is managed for you.
          </li>
        </ul>
      </section>

      {/* Single */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Single date
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          The default <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">mode=&quot;single&quot;</code>{" "}
          selects one date.
        </p>
        <ComponentPreview label="Single date">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border border-border"
          />
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={SINGLE_CODE} language="tsx" />
        </div>
      </section>

      {/* Range */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Date range
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Set <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">mode=&quot;range&quot;</code>{" "}
          and render two months so the start and end are visible at once. Click a start date, then an
          end date; the span between them is highlighted.
        </p>
        <ComponentPreview label="Date range">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={setRange}
            className="rounded-md border border-border"
          />
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={RANGE_CODE} language="tsx" />
        </div>
      </section>

      {/* Dropdown caption */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Month &amp; year dropdowns
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          For dates far from today — a date of birth, a passport expiry —{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">captionLayout=&quot;dropdown&quot;</code>{" "}
          turns the caption into month and year selectors. Clamp the options with{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">startMonth</code> /{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">endMonth</code>.
        </p>
        <ComponentPreview label="Dropdown caption">
          <Calendar
            mode="single"
            captionLayout="dropdown"
            startMonth={new Date(1980, 0)}
            endMonth={new Date(2030, 11)}
            selected={dob}
            onSelect={setDob}
            className="rounded-md border border-border"
          />
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={DROPDOWN_CODE} language="tsx" />
        </div>
      </section>

      {/* Disabled dates */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Disabled dates
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Pass a matcher (or array of matchers) to{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">disabled</code>. This example
          blocks weekends and any date in the past — useful for a booking flow.
        </p>
        <ComponentPreview label="Disabled dates">
          <Calendar
            mode="single"
            selected={booking}
            onSelect={setBooking}
            disabled={[{ dayOfWeek: [0, 6] }, { before: new Date() }]}
            className="rounded-md border border-border"
          />
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={DISABLED_CODE} language="tsx" />
        </div>
      </section>

      {/* Props */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Props
        </h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed max-w-2xl">
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">Calendar</code> forwards all{" "}
          <a
            href="https://daypicker.dev/api/interfaces/PropsBase"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            React DayPicker props
          </a>
          . The most common ones:
        </p>
        <PropTable props={CALENDAR_PROPS} />
      </section>
    </DocsPage>
  );
}
