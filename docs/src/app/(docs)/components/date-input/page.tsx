"use client";

import * as React from "react";

import {
  DateInput,
  TimeInput,
  DateTimeInput,
  DateRangeInput,
  type DateRangeValue,
} from "@/components/ui/date-input";
import { DateBadge, DateTag } from "@/components/ui/date-display";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/date-input/registry.json`;

const DATE_CODE = `import { DateInput } from "@/components/ui/date-input"

export function Example() {
  const [value, setValue] = React.useState("")

  return (
    <DateInput
      value={value}
      onValueChange={setValue}
      displayFormat="d MMM yyyy"   // shown in the field → "16 Jun 2026"
      valueFormat="yyyy-MM-dd"     // emitted to onValueChange → "2026-06-16"
    />
  )
}`;

const TIME_CODE = `import { TimeInput } from "@/components/ui/date-input"

<TimeInput
  defaultValue="09:00"
  displayFormat="h:mm a"   // "9:00 AM"
  valueFormat="HH:mm"      // "09:00"
  step={30}                // minutes between suggestions
/>`;

const DATETIME_CODE = `import { DateTimeInput } from "@/components/ui/date-input"

<DateTimeInput
  displayFormat="d MMM yyyy, h:mm a"      // "16 Jun 2026, 9:00 AM"
  valueFormat="yyyy-MM-dd'T'HH:mm"        // "2026-06-16T09:00"
/>`;

const RANGE_CODE = `import { DateRangeInput, type DateRangeValue } from "@/components/ui/date-input"

export function Example() {
  const [range, setRange] = React.useState<DateRangeValue>({})

  return (
    <DateRangeInput
      value={range}
      onValueChange={setRange}
      displayFormat="d MMM yyyy"
      valueFormat="yyyy-MM-dd"
    />
  )
  // range → { from: "2026-06-16", to: "2026-06-20" }
}`;

const FORMAT_CODE = `{/* The field shows displayFormat; onValueChange emits valueFormat. */}
<DateInput
  displayFormat="EEEE, do MMMM yyyy"   // "Tuesday, 16th June 2026"
  valueFormat="dd/MM/yyyy"             // "16/06/2026"
/>`;

const TOKENS = [
  { name: "d MMM yyyy", type: "16 Jun 2026", description: "Compact, unambiguous — the default display format." },
  { name: "PPP", type: "June 16th, 2026", description: "Localized long date (date-fns shorthand)." },
  { name: "EEEE, do MMMM yyyy", type: "Tuesday, 16th June 2026", description: "Full weekday and month." },
  { name: "dd/MM/yyyy", type: "16/06/2026", description: "Day-first numeric (most of the world)." },
  { name: "MM/dd/yyyy", type: "06/16/2026", description: "Month-first numeric (US)." },
  { name: "yyyy-MM-dd", type: "2026-06-16", description: "ISO 8601 — the recommended value format for storage/APIs." },
  { name: "h:mm a", type: "9:00 AM", description: "12-hour time with meridiem." },
  { name: "HH:mm", type: "09:00", description: "24-hour time." },
  { name: "yyyy-MM-dd'T'HH:mm", type: "2026-06-16T09:00", description: "ISO date-time (literals wrapped in single quotes)." },
];

const COMMON_PROPS = [
  { name: "value", type: "string", description: "Controlled value, a string in valueFormat." },
  { name: "defaultValue", type: "string", description: "Uncontrolled initial value, a string in valueFormat." },
  { name: "onValueChange", type: "(value: string) => void", description: "Fires with the value formatted by valueFormat (\"\" when cleared)." },
  { name: "onDateChange", type: "(date: Date | undefined) => void", description: "Escape hatch — fires with the raw Date." },
  { name: "displayFormat", type: "string", description: "date-fns pattern shown in the field." },
  { name: "valueFormat", type: "string", description: "date-fns pattern emitted by onValueChange and the hidden form input." },
  { name: "name", type: "string", description: "Renders a hidden input with the valueFormat string for native form submission." },
  { name: "disabled", type: "boolean", description: "Disables the field and trigger." },
];

const TIME_PROPS = [
  { name: "step", type: "number", default: "30", description: "Minutes between suggested options in the dropdown list." },
];

const DATETIME_PROPS = [
  { name: "step", type: "number", default: "30", description: "Minutes between suggested time options." },
  { name: "timeFormat", type: "string", default: '"h:mm a"', description: "date-fns pattern for the time-list labels." },
  { name: "calendarProps", type: "Partial<CalendarProps>", description: "Forwarded to the underlying Calendar (e.g. disabled dates, captionLayout)." },
];

const RANGE_PROPS = [
  { name: "value", type: "{ from?: string; to?: string }", description: "Controlled range, strings in valueFormat." },
  { name: "onValueChange", type: "(value: { from?, to? }) => void", description: "Fires with the formatted range." },
  { name: "onRangeChange", type: "(range: DateRange) => void", description: "Escape hatch — fires with the raw DateRange." },
  { name: "numberOfMonths", type: "number", default: "2", description: "Months rendered side by side." },
];

const BADGE_CODE = `import { DateBadge } from "@/components/ui/date-display"

<DateBadge date="2026-06-16T09:47:29Z" displayFormat="d MMM yyyy" />

{/* Pin to a zone and show its label */}
<DateBadge
  date="2026-06-16T09:47:29Z"
  displayFormat="MMMM d, yyyy h:mm:ss a"
  timeZone="Australia/Sydney"
  showZone
/>`;

const TAG_CODE = `import { DateTag } from "@/components/ui/date-display"

{/* Displayed in UTC; hovering reveals the viewer's local zone + "x ago". */}
<DateTag
  date="2026-06-16T09:47:29Z"
  displayFormat="d MMM yyyy, h:mm a"
  detailFormat="d MMM yyyy, h:mm:ss a"
  timeZone="UTC"
/>`;

const BADGE_PROPS = [
  { name: "date", type: "Date | string | number", description: "The value to display (Date, ISO string, or epoch ms)." },
  { name: "displayFormat", type: "string", default: '"d MMM yyyy"', description: "date-fns pattern used to render the date." },
  { name: "timeZone", type: "string", description: "IANA zone to render in (e.g. \"Australia/Sydney\"). Defaults to local." },
  { name: "showZone", type: "boolean", default: "false", description: "Show a leading zone-label chip (e.g. \"GMT+10\")." },
  { name: "variant", type: "BadgeVariant", default: '"outline"', description: "Forwarded to the underlying Badge." },
];

const TAG_PROPS = [
  { name: "date", type: "Date | string | number", description: "The value to display." },
  { name: "displayFormat", type: "string", default: '"d MMM yyyy"', description: "Pattern for the inline trigger text." },
  { name: "detailFormat", type: "string", default: '"d MMM yyyy, h:mm:ss a"', description: "Pattern for the rows inside the hover card." },
  { name: "timeZone", type: "string", description: "Zone the value is shown in; the hover compares it to the viewer's local zone." },
  { name: "timeZoneLabel", type: "string", description: "Override the displayed zone's label." },
  { name: "relative", type: "boolean", default: "true", description: "Show the \"x ago\" header." },
];

function ValueReadout({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 text-xs">
      <span className="text-ink-muted">{label}</span>
      <code className="font-mono text-foreground">{value || "—"}</code>
    </div>
  );
}

export default function DateInputPage() {
  const SAMPLE = "2026-06-16T09:47:29Z";
  const [date, setDate] = React.useState("2026-06-16");
  const [time, setTime] = React.useState("09:00");
  const [dateTime, setDateTime] = React.useState("");
  const [range, setRange] = React.useState<DateRangeValue>({});

  // Live "display vs value" demo
  const [demo, setDemo] = React.useState("");
  const demoDisplay = "EEEE, do MMMM yyyy";
  const demoValue = "dd/MM/yyyy";

  return (
    <DocsPage width="wide">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Forms
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Date Input
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Text fields for dates and times that open the{" "}
          <a
            href="/components/calendar"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Calendar
          </a>{" "}
          in a dropdown. Users can <strong className="text-foreground font-medium">type</strong> the
          value or <strong className="text-foreground font-medium">pick</strong> it. Every variant
          separates the human-readable <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">displayFormat</code>{" "}
          from the machine-readable <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">valueFormat</code>{" "}
          it emits.
        </p>
      </div>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* Display vs value — the headline concept */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Display format vs value format
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Show people a friendly, unambiguous date while storing a machine-friendly one. The field
          renders <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">displayFormat</code>;{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">onValueChange</code> emits{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">valueFormat</code>. Pick a
          date below and watch both update.
        </p>
        <ComponentPreview label="Display vs value">
          <div className="flex w-full max-w-sm flex-col gap-4">
            <DateInput
              value={demo}
              onValueChange={setDemo}
              displayFormat={demoDisplay}
              valueFormat={demoValue}
            />
            <div className="flex flex-col gap-1.5 rounded-md border border-border bg-secondary/40 p-3">
              <ValueReadout label={`display "${demoDisplay}"`} value={demo ? "shown in the field above" : ""} />
              <ValueReadout label={`value "${demoValue}"`} value={demo} />
            </div>
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={FORMAT_CODE} language="tsx" />
        </div>

        <p className="text-sm font-semibold text-foreground mt-8 mb-2">
          Common format tokens
        </p>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed max-w-2xl">
          Any{" "}
          <a
            href="https://date-fns.org/docs/format"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            date-fns format pattern
          </a>{" "}
          works. The left column is the token; the right is what it renders for 16 June 2026.
        </p>
        <PropTable props={TOKENS} />
      </section>

      {/* DateInput */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          DateInput
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A single date. Type it (parsed against{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">displayFormat</code> on blur
          or Enter) or open the calendar. Unparseable text flags the field invalid instead of being
          silently dropped.
        </p>
        <ComponentPreview label="DateInput">
          <div className="flex w-full max-w-xs flex-col gap-3">
            <DateInput value={date} onValueChange={setDate} />
            <ValueReadout label="value" value={date} />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={DATE_CODE} language="tsx" />
        </div>
      </section>

      {/* TimeInput */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          TimeInput
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A time of day. The dropdown lists options every{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">step</code> minutes, and the
          field still accepts free typing like &ldquo;2:15 PM&rdquo;.
        </p>
        <ComponentPreview label="TimeInput">
          <div className="flex w-full max-w-xs flex-col gap-3">
            <TimeInput value={time} onValueChange={setTime} />
            <ValueReadout label="value" value={time} />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={TIME_CODE} language="tsx" />
        </div>
      </section>

      {/* DateTimeInput */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          DateTimeInput
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Date and time together. The calendar and a time list share one dropdown; picking a day keeps
          the chosen time.
        </p>
        <ComponentPreview label="DateTimeInput">
          <div className="flex w-full max-w-xs flex-col gap-3">
            <DateTimeInput value={dateTime} onValueChange={setDateTime} />
            <ValueReadout label="value" value={dateTime} />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={DATETIME_CODE} language="tsx" />
        </div>
      </section>

      {/* DateRangeInput */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          DateRangeInput
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A start and end date. The trigger reads{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">start – end</code> and opens a
          two-month calendar in{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">range</code> mode.{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">onValueChange</code> emits{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">{`{ from, to }`}</code>.
        </p>
        <ComponentPreview label="DateRangeInput">
          <div className="flex w-full max-w-sm flex-col gap-3">
            <DateRangeInput value={range} onValueChange={setRange} />
            <div className="flex flex-col gap-1.5">
              <ValueReadout label="from" value={range.from ?? ""} />
              <ValueReadout label="to" value={range.to ?? ""} />
            </div>
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={RANGE_CODE} language="tsx" />
        </div>
      </section>

      {/* Displaying dates */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Displaying dates
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          For read-only output — tables, activity feeds, audit logs — use{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">DateBadge</code> and{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">DateTag</code>. Both take the
          same <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">displayFormat</code> and an
          optional <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">timeZone</code>.
        </p>

        <p className="text-sm font-semibold text-foreground mb-1">DateBadge</p>
        <p className="text-sm text-ink-muted mb-3 leading-relaxed max-w-2xl">
          A compact, non-interactive badge. Optionally pin it to a time zone and show the zone label.
        </p>
        <ComponentPreview label="DateBadge">
          <div className="flex flex-wrap items-center gap-3">
            <DateBadge date={SAMPLE} displayFormat="d MMM yyyy" />
            <DateBadge date={SAMPLE} displayFormat="MMM d, yyyy h:mm a" />
            <DateBadge
              date={SAMPLE}
              displayFormat="MMMM d, yyyy h:mm:ss a"
              timeZone="UTC"
              showZone
            />
            <DateBadge
              date={SAMPLE}
              displayFormat="MMMM d, yyyy h:mm:ss a"
              timeZone="Australia/Sydney"
              showZone
            />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={BADGE_CODE} language="tsx" />
        </div>

        <p className="text-sm font-semibold text-foreground mb-1 mt-8">DateTag</p>
        <p className="text-sm text-ink-muted mb-3 leading-relaxed max-w-2xl">
          An inline date with a dashed underline. Hover (or focus) it to reveal how long ago it was and
          the time in both the displayed zone and{" "}
          <strong className="text-foreground font-medium">your</strong> local zone — so a reader in
          another country always knows what the timestamp means for them.
        </p>
        <ComponentPreview label="DateTag">
          <p className="text-sm text-foreground">
            Report generated{" "}
            <DateTag date={SAMPLE} displayFormat="d MMM yyyy, h:mm a" timeZone="UTC" />{" "}
            — hover to see it in your local time.
          </p>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={TAG_CODE} language="tsx" />
        </div>
      </section>

      {/* Props */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Props
        </h2>
        <p className="text-sm font-semibold text-foreground mb-2">
          Shared (DateInput, TimeInput, DateTimeInput)
        </p>
        <PropTable props={COMMON_PROPS} />
        <p className="text-sm font-semibold text-foreground mb-2 mt-8">TimeInput</p>
        <PropTable props={TIME_PROPS} />
        <p className="text-sm font-semibold text-foreground mb-2 mt-8">DateTimeInput</p>
        <PropTable props={DATETIME_PROPS} />
        <p className="text-sm font-semibold text-foreground mb-2 mt-8">DateRangeInput</p>
        <PropTable props={RANGE_PROPS} />
        <p className="text-sm font-semibold text-foreground mb-2 mt-8">DateBadge</p>
        <PropTable props={BADGE_PROPS} />
        <p className="text-sm font-semibold text-foreground mb-2 mt-8">DateTag</p>
        <PropTable props={TAG_PROPS} />
      </section>
    </DocsPage>
  );
}
