import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

// ─────────────────────────────────────────────────────────
// Infographic — flat UI mock elements for marketing sections
//
// Small, self-contained dark-window illustrations used inside
// FeatureSplit, Bento cells, and landing page visuals. Each themed
// variant is a single element — compose with InfographicRow when
// you need a side-by-side pair.
// ─────────────────────────────────────────────────────────

const SHELL = "rounded-lg bg-[#2A3530] shadow-lg"

export interface InfographicProps extends HTMLAttributes<HTMLDivElement> {
  /** Window title shown in the title bar. */
  title?: string
  /** Hide the title bar entirely. */
  hideTitle?: boolean
  children?: ReactNode
}

/**
 * Base dark UI window — the shared shell for all infographic variants.
 */
export function Infographic({
  title,
  hideTitle = false,
  className,
  children,
  ...props
}: InfographicProps) {
  return (
    <div className={cn(SHELL, "overflow-hidden w-full max-w-full min-w-0", className)} {...props}>
      {/* Title bar */}
      {!hideTitle && title && (
        <div className="flex items-center gap-2 border-b border-white/8 px-3 py-2">
          <div className="size-2 rounded-full bg-white/20" />
          <p className="text-[10px] font-mono text-white/50">{title}</p>
        </div>
      )}
      {children}
    </div>
  )
}

export interface InfographicRowProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional floating pill label (Share, Export, Run, etc.). */
  pill?: string
  /**
   * Keep the row inside its parent — no negative margins, tighter gap,
   * and children shrink to fit. Use inside FeatureSplit visual slots.
   */
  contained?: boolean
  children?: ReactNode
}

/**
 * Side-by-side row for pairing two infographic elements.
 */
export function InfographicRow({
  pill,
  contained = false,
  className,
  children,
  ...props
}: InfographicRowProps) {
  return (
    <div
      className={cn(
        "relative flex items-stretch min-w-0 max-w-full",
        contained
          ? "w-full gap-1.5 md:gap-2 overflow-hidden [&>*]:min-w-0 [&>*]:flex-1 [&>*]:basis-0 [&>*]:max-w-full"
          : "gap-2 md:gap-3",
        className
      )}
      {...props}
    >
      {/* Floating pill — kept inside bounds when contained */}
      {pill && (
        <span
          className={cn(
            "absolute z-30 rounded-sm bg-[#C8F169] px-2 py-0.5 text-[9px] font-semibold text-[#043F2E] shadow-sm",
            contained ? "top-1 right-1" : "-top-1 right-[38%] px-2.5 py-1 text-[10px]"
          )}
        >
          {pill}
        </span>
      )}
      {children}
    </div>
  )
}

export interface InfographicStackProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/**
 * Vertical stack — useful for hero sidebars and narrow bento cells.
 */
export function InfographicStack({ className, children, ...props }: InfographicStackProps) {
  return (
    <div className={cn("flex flex-col gap-2 md:gap-3", className)} {...props}>
      {children}
    </div>
  )
}

export interface InfographicGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns in the showcase grid. */
  cols?: 2 | 3
  children?: ReactNode
}

const gridColsClass = { 2: "grid-cols-2", 3: "grid-cols-3" }

/**
 * Responsive grid for showcasing multiple infographic elements on a page.
 */
export function InfographicGrid({
  cols = 2,
  className,
  children,
  ...props
}: InfographicGridProps) {
  return (
    <div
      className={cn("grid gap-2 md:gap-3", gridColsClass[cols], className)}
      {...props}
    >
      {children}
    </div>
  )
}

interface InfographicStatGridProps {
  stats: { label: string; value: string; accent?: boolean }[]
  className?: string
}

/** 2×2 metric grid used inside infographic shells. */
function InfographicStatGrid({ stats, className }: InfographicStatGridProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      {stats.map(({ label, value, accent }) => (
        <div
          key={label}
          className={cn(
            "rounded-md px-2 py-2",
            accent ? "bg-[#C8F169]/15" : "bg-white/6"
          )}
        >
          <p className="text-[8px] font-mono text-white/35 mb-0.5">{label}</p>
          <p className={cn("text-sm font-semibold", accent ? "text-[#C8F169]" : "text-white/70")}>
            {value}
          </p>
        </div>
      ))}
    </div>
  )
}

interface InfographicSparklineProps {
  points: string
  className?: string
  colour?: string
}

/** Minimal line spark for cashflow and trend infographics. */
function InfographicSparkline({
  points,
  className,
  colour = "#C8F169",
}: InfographicSparklineProps) {
  return (
    <svg
      className={cn("w-full h-12", className)}
      viewBox="0 0 100 32"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <polyline points={points} fill="none" stroke={colour} strokeWidth="1.5" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// Shared atoms
// ─────────────────────────────────────────────────────────

interface InfographicBarsProps {
  values: number[]
  className?: string
  barClassName?: string
  height?: string
}

/** Simple vertical bar chart strip. */
export function InfographicBars({
  values,
  className,
  barClassName = "bg-[#C8F169]/80",
  height = "h-16 md:h-20",
}: InfographicBarsProps) {
  return (
    <div className={cn("flex items-end gap-1", height, className)}>
      {values.map((h, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end h-full">
          <div className={cn("w-full rounded-[2px]", barClassName)} style={{ height: `${h}%` }} />
        </div>
      ))}
    </div>
  )
}

interface InfographicSidebarProps {
  items: { label: string; colour: string }[]
  className?: string
}

/** Narrow config sidebar with labelled placeholder bars. */
export function InfographicSidebar({ items, className }: InfographicSidebarProps) {
  return (
    <div
      className={cn(
        "shrink min-w-0 w-[34%] max-w-[7.5rem] rounded-lg bg-[#2A3530] p-2 md:p-2.5 shadow-lg space-y-1.5",
        className
      )}
    >
      {items.map(({ label, colour }) => (
        <div key={label}>
          <p className="text-[9px] font-mono text-white/40 mb-1">{label}</p>
          <div className={cn("h-4 rounded-[2px] opacity-80", colour)} />
        </div>
      ))}
    </div>
  )
}

interface InfographicLinesProps {
  widths?: string[]
  highlight?: number
  className?: string
}

/** Placeholder text/code lines. */
export function InfographicLines({
  widths = ["w-[88%]", "w-[62%]", "w-[74%]", "w-[55%]", "w-[70%]"],
  highlight = 2,
  className,
}: InfographicLinesProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {widths.map((w, i) => (
        <div
          key={i}
          className={cn(
            "h-2 rounded-full",
            w,
            i === highlight ? "bg-[#C8F169]/60" : "bg-white/15"
          )}
        />
      ))}
    </div>
  )
}

interface InfographicSelectProps {
  label: string
  options: string[]
  active?: string
  className?: string
}

/** Compact vertical select menu. */
export function InfographicSelect({
  label,
  options,
  active,
  className,
}: InfographicSelectProps) {
  return (
    <div
      className={cn(
        "shrink min-w-0 w-[30%] max-w-[6.5rem] flex flex-col rounded-lg overflow-hidden shadow-lg",
        className
      )}
    >
      <div className="bg-[#C8F169] px-2.5 py-1.5 flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#043F2E]">{label}</span>
        <span className="text-[8px] text-[#043F2E]/60">▼</span>
      </div>
      <div className="flex-1 bg-[#2A3530] p-2 space-y-1">
        {options.map((opt) => (
          <p
            key={opt}
            className={cn(
              "text-[9px] font-mono px-1 py-0.5",
              opt === active
                ? "text-[#043F2E] bg-[#C8F169] rounded-[2px] font-semibold"
                : "text-white/40"
            )}
          >
            {opt}
          </p>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Schemes — building health / scheme overview
// ─────────────────────────────────────────────────────────

/**
 * Scheme health bar chart — levies, maintenance and compliance at a glance.
 */
export function InfographicScheme({ className }: { className?: string }) {
  return (
    <Infographic title="Scheme Health" className={cn("flex-1 min-w-0 p-3 md:p-4", className)}>
      <InfographicBars
        values={[72, 48, 88, 55, 78, 62, 90, 58]}
        barClassName="bg-[#C8F169]/80 even:bg-[#0A5C3D]"
      />
    </Infographic>
  )
}

// ─────────────────────────────────────────────────────────
// Portfolio — multi-scheme portfolio overview
// ─────────────────────────────────────────────────────────

/**
 * Portfolio snapshot — stacked scheme cards with occupancy bars.
 */
export function InfographicPortfolio({ className }: { className?: string }) {
  const schemes = [
    { id: "SP-1042", fill: 82 },
    { id: "SP-0871", fill: 64 },
    { id: "SP-1205", fill: 91 },
  ]

  return (
    <Infographic title="Portfolio" className={cn("p-3 md:p-4 space-y-2.5", className)}>
      {schemes.map(({ id, fill }) => (
        <div key={id} className="flex items-center gap-2">
          <span className="text-[9px] font-mono text-white/35 w-12 shrink-0">{id}</span>
          <div className="flex-1 h-3 rounded-[2px] bg-white/8 overflow-hidden">
            <div className="h-full rounded-[2px] bg-[#C8F169]/70" style={{ width: `${fill}%` }} />
          </div>
        </div>
      ))}
    </Infographic>
  )
}

// ─────────────────────────────────────────────────────────
// Owners — owner directory / portal
// ─────────────────────────────────────────────────────────

/**
 * Owner directory — lot numbers with status indicators.
 */
export function InfographicOwners({ className }: { className?: string }) {
  const owners = [
    { lot: "Lot 12", status: "Paid" },
    { lot: "Lot 14", status: "Due" },
    { lot: "Lot 18", status: "Paid" },
    { lot: "Lot 22", status: "Overdue" },
  ]

  return (
    <Infographic title="Owner Portal" className={cn("p-3 md:p-4 space-y-2", className)}>
      {owners.map(({ lot, status }) => (
        <div key={lot} className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="size-5 shrink-0 rounded-full bg-white/10" />
            <span className="text-[10px] font-mono text-white/55 truncate">{lot}</span>
          </div>
          <span
            className={cn(
              "text-[8px] font-semibold px-1.5 py-0.5 rounded-[2px] shrink-0",
              status === "Paid" && "bg-[#C8F169]/25 text-[#C8F169]",
              status === "Due" && "bg-[#8ECAE6]/20 text-[#8ECAE6]",
              status === "Overdue" && "bg-[#E8A0BF]/20 text-[#E8A0BF]"
            )}
          >
            {status}
          </span>
        </div>
      ))}
    </Infographic>
  )
}

// ─────────────────────────────────────────────────────────
// Reports — financial / compliance reports
// ─────────────────────────────────────────────────────────

/**
 * Reports queue — document rows with a mini trend strip.
 */
export function InfographicReports({ className }: { className?: string }) {
  return (
    <Infographic title="Reports" className={cn("p-3 md:p-4", className)}>
      <div className="space-y-2 mb-3">
        {["AGM Pack", "Levy Notice", "Audit Summary"].map((name) => (
          <div key={name} className="flex items-center gap-2">
            <div className="size-3 shrink-0 rounded-[2px] bg-white/12" />
            <span className="text-[9px] font-mono text-white/45">{name}</span>
            <div className="flex-1 h-1.5 rounded-full bg-white/8" />
          </div>
        ))}
      </div>
      <InfographicBars
        values={[40, 55, 48, 72, 65, 80]}
        barClassName="bg-[#8ECAE6]/70"
        height="h-10"
      />
    </Infographic>
  )
}

// ─────────────────────────────────────────────────────────
// Finance — levy breakdown / payments
// ─────────────────────────────────────────────────────────

/**
 * Levy breakdown — quarterly payment bars.
 */
export function InfographicFinance({ className }: { className?: string }) {
  return (
    <Infographic title="Levy Breakdown" className={cn("p-3 md:p-4", className)}>
      <InfographicBars
        values={[55, 70, 45, 88]}
        barClassName="bg-[#C8F169]/80"
        height="h-14 md:h-16"
      />
      <div className="flex justify-between mt-2">
        {["Q1", "Q2", "Q3", "Q4"].map((q) => (
          <span key={q} className="text-[8px] font-mono text-white/30">{q}</span>
        ))}
      </div>
    </Infographic>
  )
}

// ─────────────────────────────────────────────────────────
// Finance editor — levy calculator workflow
// ─────────────────────────────────────────────────────────

/**
 * Levy calculator — input lines with a run action.
 */
export function InfographicLevyCalc({ className }: { className?: string }) {
  return (
    <Infographic title="Levy Calculator" className={cn("flex-1 min-w-0", className)}>
      <div className="p-3 md:p-4">
        <InfographicLines
          widths={["w-[80%]", "w-[65%]", "w-[90%]", "w-[50%]", "w-[72%]"]}
          highlight={1}
        />
      </div>
      <div className="px-3 pb-3 md:px-4 md:pb-4">
        <div className="h-7 w-20 rounded-sm bg-[#C8F169]" />
      </div>
    </Infographic>
  )
}

// ─────────────────────────────────────────────────────────
// AI — assistant / smart suggestions
// ─────────────────────────────────────────────────────────

/**
 * AI assist — prompt bubble with suggested actions.
 */
export function InfographicAi({ className }: { className?: string }) {
  return (
    <Infographic title="AI Assist" className={cn("p-3 md:p-4 space-y-2.5", className)}>
      {/* User prompt bubble */}
      <div className="rounded-md bg-white/8 px-2.5 py-2">
        <p className="text-[9px] text-white/50 leading-relaxed">
          Draft AGM minutes from last meeting notes…
        </p>
      </div>
      {/* AI response lines */}
      <div className="space-y-1.5 pl-1">
        <div className="h-1.5 w-full rounded-full bg-[#C8F169]/50" />
        <div className="h-1.5 w-[85%] rounded-full bg-white/12" />
        <div className="h-1.5 w-[70%] rounded-full bg-white/12" />
      </div>
      {/* Suggested actions */}
      <div className="flex flex-wrap gap-1 pt-1">
        {["Send notice", "Schedule AGM"].map((action) => (
          <span
            key={action}
            className="text-[8px] font-mono text-[#043F2E] bg-[#C8F169] rounded-[2px] px-1.5 py-0.5"
          >
            {action}
          </span>
        ))}
      </div>
    </Infographic>
  )
}

// ─────────────────────────────────────────────────────────
// Workflow — automation pipeline
// ─────────────────────────────────────────────────────────

/**
 * Workflow automation — stepped tasks with completion states.
 */
export function InfographicWorkflow({ className }: { className?: string }) {
  const steps = [
    { label: "Levy issued",  done: true },
    { label: "Reminder sent", done: true },
    { label: "Payment received", done: false },
  ]

  return (
    <Infographic title="Automation" className={cn("p-3 md:p-4 space-y-2", className)}>
      {steps.map(({ label, done }, i) => (
        <div key={label} className="flex items-center gap-2">
          <div
            className={cn(
              "size-3.5 shrink-0 rounded-[2px] flex items-center justify-center text-[8px]",
              done ? "bg-[#C8F169] text-[#043F2E]" : "bg-white/10 text-white/30"
            )}
          >
            {done ? "✓" : i + 1}
          </div>
          <span className={cn("text-[9px] font-mono", done ? "text-white/50" : "text-white/30")}>
            {label}
          </span>
          {!done && i < steps.length - 1 && (
            <div className="flex-1 h-px bg-white/8 ml-1" />
          )}
        </div>
      ))}
    </Infographic>
  )
}

// ─────────────────────────────────────────────────────────
// Extended strata infographics — 15 additional layouts
// ─────────────────────────────────────────────────────────

/**
 * Maintenance queue — priority feed with open work orders.
 * Layout: vertical feed.
 */
export function InfographicMaintenance({ className }: { className?: string }) {
  const jobs = [
    { ref: "WO-2841", label: "Lift inspection", priority: "High" },
    { ref: "WO-2839", label: "Pool pump repair", priority: "Med" },
    { ref: "WO-2835", label: "Fire door check", priority: "Low" },
  ]

  return (
    <Infographic title="Maintenance" className={cn("p-3 md:p-4 space-y-2", className)}>
      {jobs.map(({ ref, label, priority }) => (
        <div key={ref} className="flex items-center gap-2 rounded-md bg-white/5 px-2 py-1.5">
          <div className="size-1.5 shrink-0 rounded-full bg-[#C8F169]" />
          <div className="flex-1 min-w-0">
            <p className="text-[9px] font-mono text-white/45">{ref}</p>
            <p className="text-[10px] text-white/60 truncate">{label}</p>
          </div>
          <span
            className={cn(
              "text-[7px] font-semibold px-1 py-0.5 rounded-[2px] shrink-0",
              priority === "High" && "bg-[#E8A0BF]/25 text-[#E8A0BF]",
              priority === "Med" && "bg-[#8ECAE6]/20 text-[#8ECAE6]",
              priority === "Low" && "bg-white/10 text-white/35"
            )}
          >
            {priority}
          </span>
        </div>
      ))}
    </Infographic>
  )
}

/**
 * AGM calendar — month grid with meeting date highlighted.
 * Layout: calendar grid.
 */
export function InfographicAgm({ className }: { className?: string }) {
  const days = Array.from({ length: 28 }, (_, i) => i + 1)
  const meetingDay = 18

  return (
    <Infographic title="AGM Schedule" className={cn("p-3 md:p-4", className)}>
      <p className="text-[9px] font-mono text-white/35 mb-2">March 2026</p>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day) => (
          <div
            key={day}
            className={cn(
              "aspect-square rounded-[2px] flex items-center justify-center text-[7px] font-mono",
              day === meetingDay
                ? "bg-[#C8F169] text-[#043F2E] font-semibold"
                : "bg-white/5 text-white/30"
            )}
          >
            {day}
          </div>
        ))}
      </div>
      <p className="text-[8px] text-[#C8F169]/80 mt-2">AGM · 18 Mar · 6:00 pm</p>
    </Infographic>
  )
}

/**
 * Compliance tracker — checklist with overall progress.
 * Layout: checklist + progress bar.
 */
export function InfographicCompliance({ className }: { className?: string }) {
  const items = [
    { label: "Fire safety cert", done: true },
    { label: "Insurance renewal", done: true },
    { label: "Financial audit", done: false },
  ]
  const progress = 67

  return (
    <Infographic title="Compliance" className={cn("p-3 md:p-4", className)}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-mono text-white/40">Scheme compliance</span>
        <span className="text-[10px] font-semibold text-[#C8F169]">{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/8 mb-3 overflow-hidden">
        <div className="h-full rounded-full bg-[#C8F169]" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-1.5">
        {items.map(({ label, done }) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={cn(
                "size-3 shrink-0 rounded-[2px] text-[7px] flex items-center justify-center",
                done ? "bg-[#C8F169] text-[#043F2E]" : "border border-white/15 text-white/25"
              )}
            >
              {done ? "✓" : ""}
            </div>
            <span className={cn("text-[9px] font-mono", done ? "text-white/50" : "text-white/30")}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </Infographic>
  )
}

/**
 * Budget overview — four-up metric grid.
 * Layout: stat grid.
 */
export function InfographicBudget({ className }: { className?: string }) {
  return (
    <Infographic title="Budget" className={cn("p-3 md:p-4", className)}>
      <InfographicStatGrid
        stats={[
          { label: "Revenue",   value: "$842k", accent: true },
          { label: "Expenses",  value: "$691k" },
          { label: "Reserve",   value: "$151k" },
          { label: "Variance",  value: "+4.2%", accent: true },
        ]}
      />
    </Infographic>
  )
}

/**
 * Cashflow trend — balance headline with sparkline.
 * Layout: metric + sparkline chart.
 */
export function InfographicCashflow({ className }: { className?: string }) {
  return (
    <Infographic title="Cashflow" className={cn("p-3 md:p-4", className)}>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-lg font-semibold text-white/80">$124,580</span>
        <span className="text-[9px] font-mono text-[#C8F169]">+12.4%</span>
      </div>
      <InfographicSparkline points="0,24 12,20 24,22 36,14 48,16 60,10 72,12 84,6 100,8" />
      <div className="flex justify-between mt-1">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((m) => (
          <span key={m} className="text-[7px] font-mono text-white/25">{m}</span>
        ))}
      </div>
    </Infographic>
  )
}

/**
 * Owner communications — notice thread feed.
 * Layout: message thread.
 */
export function InfographicCommunications({ className }: { className?: string }) {
  const messages = [
    { from: "Manager", subject: "AGM notice sent", time: "2h" },
    { from: "System",  subject: "Levy reminder batch", time: "1d" },
    { from: "Manager", subject: "Lift outage update", time: "3d" },
  ]

  return (
    <Infographic title="Communications" className={cn("p-3 md:p-4 space-y-2", className)}>
      {messages.map(({ from, subject, time }) => (
        <div key={subject} className="flex items-start gap-2">
          <div className="size-5 shrink-0 rounded-full bg-[#0A5C3D] flex items-center justify-center text-[7px] text-[#C8F169]">
            {from[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[9px] font-mono text-white/45">{from}</span>
              <span className="text-[7px] font-mono text-white/25">{time}</span>
            </div>
            <p className="text-[10px] text-white/55 truncate">{subject}</p>
          </div>
        </div>
      ))}
    </Infographic>
  )
}

/**
 * Contractor board — mini kanban with job columns.
 * Layout: three-column kanban.
 */
export function InfographicContractor({ className }: { className?: string }) {
  const columns = [
    { label: "Quoted",  count: 2, colour: "bg-[#8ECAE6]/40" },
    { label: "Active",  count: 3, colour: "bg-[#C8F169]/50" },
    { label: "Done",    count: 5, colour: "bg-white/15" },
  ]

  return (
    <Infographic title="Contractors" className={cn("p-3 md:p-4", className)}>
      <div className="grid grid-cols-3 gap-1.5">
        {columns.map(({ label, count, colour }) => (
          <div key={label} className="rounded-md bg-white/5 p-1.5">
            <p className="text-[7px] font-mono text-white/35 mb-1.5">{label}</p>
            <div className="space-y-1">
              {Array.from({ length: count }).map((_, i) => (
                <div key={i} className={cn("h-2 rounded-[2px]", colour)} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Infographic>
  )
}

/**
 * Insurance renewals — timeline with upcoming dates.
 * Layout: vertical timeline.
 */
export function InfographicInsurance({ className }: { className?: string }) {
  const policies = [
    { name: "Building",  date: "Apr 12", status: "Due soon" },
    { name: "Public liability", date: "Jun 30", status: "Current" },
    { name: "Workers comp", date: "Sep 15", status: "Current" },
  ]

  return (
    <Infographic title="Insurance" className={cn("p-3 md:p-4", className)}>
      <div className="relative pl-3 space-y-3">
        <div className="absolute left-1 top-1 bottom-1 w-px bg-white/10" />
        {policies.map(({ name, date, status }) => (
          <div key={name} className="relative flex items-center gap-2">
            <div
              className={cn(
                "absolute -left-2.5 size-2 rounded-full",
                status === "Due soon" ? "bg-[#C8F169]" : "bg-white/20"
              )}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-white/55 truncate">{name}</p>
              <p className="text-[8px] font-mono text-white/30">{date}</p>
            </div>
            {status === "Due soon" && (
              <span className="text-[7px] text-[#C8F169] font-semibold shrink-0">{status}</span>
            )}
          </div>
        ))}
      </div>
    </Infographic>
  )
}

/**
 * Committee motions — compact voting table.
 * Layout: data table.
 */
export function InfographicCommittee({ className }: { className?: string }) {
  const motions = [
    { motion: "Approve budget", votes: "5–1" },
    { motion: "Lift upgrade",   votes: "4–2" },
    { motion: "Pool hours",     votes: "6–0" },
  ]

  return (
    <Infographic title="Committee" className={cn("p-3 md:p-4", className)}>
      <div className="space-y-0.5">
        <div className="grid grid-cols-[1fr_auto] gap-2 pb-1 border-b border-white/8">
          <span className="text-[7px] font-mono text-white/30 uppercase">Motion</span>
          <span className="text-[7px] font-mono text-white/30 uppercase">Vote</span>
        </div>
        {motions.map(({ motion, votes }) => (
          <div key={motion} className="grid grid-cols-[1fr_auto] gap-2 py-1">
            <span className="text-[9px] text-white/50 truncate">{motion}</span>
            <span className="text-[9px] font-mono text-[#C8F169]">{votes}</span>
          </div>
        ))}
      </div>
    </Infographic>
  )
}

/**
 * Global search — query bar with result snippets.
 * Layout: search + results list.
 */
export function InfographicSearch({ className }: { className?: string }) {
  return (
    <Infographic title="Search" className={cn("p-3 md:p-4", className)}>
      {/* Search input mock */}
      <div className="flex items-center gap-2 rounded-md bg-white/8 px-2 py-1.5 mb-2.5">
        <div className="size-3 rounded-full border border-white/20" />
        <span className="text-[9px] font-mono text-white/40">levy notice lot 14…</span>
      </div>
      {["Lot 14 · Levy history", "SP-1042 · Owner records", "AGM 2025 · Minutes"].map((result) => (
        <div key={result} className="flex items-center gap-2 py-1 border-t border-white/5 first:border-0">
          <div className="size-2 rounded-[2px] bg-[#C8F169]/40 shrink-0" />
          <span className="text-[9px] text-white/45">{result}</span>
        </div>
      ))}
    </Infographic>
  )
}

/**
 * Notification inbox — unread counts per category.
 * Layout: inbox with badges.
 */
export function InfographicNotifications({ className }: { className?: string }) {
  const items = [
    { label: "Levy payments",  count: 3 },
    { label: "Maintenance",    count: 7 },
    { label: "Owner messages", count: 2 },
    { label: "Compliance",     count: 0 },
  ]

  return (
    <Infographic title="Inbox" className={cn("p-3 md:p-4 space-y-1.5", className)}>
      {items.map(({ label, count }) => (
        <div key={label} className="flex items-center justify-between gap-2 py-0.5">
          <span className="text-[10px] text-white/50">{label}</span>
          {count > 0 ? (
            <span className="text-[8px] font-semibold min-w-[16px] text-center px-1 py-0.5 rounded-full bg-[#C8F169] text-[#043F2E]">
              {count}
            </span>
          ) : (
            <span className="text-[8px] font-mono text-white/20">—</span>
          )}
        </div>
      ))}
    </Infographic>
  )
}

/**
 * Building profile — scheme identity with key stats.
 * Layout: hero card + stat row.
 */
export function InfographicBuilding({ className }: { className?: string }) {
  return (
    <Infographic title="Harbour View" className={cn("p-3 md:p-4", className)} hideTitle>
      <div className="flex items-center gap-2 mb-3">
        <div className="size-8 rounded-md bg-[#0A5C3D] flex items-center justify-center text-[10px] font-display text-[#C8F169]">
          HV
        </div>
        <div>
          <p className="text-[11px] font-semibold text-white/70">Harbour View</p>
          <p className="text-[8px] font-mono text-white/35">SP-1042 · Sydney</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: "Units", value: "48" },
          { label: "Lots",  value: "52" },
          { label: "Floors", value: "12" },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-md bg-white/6 px-2 py-1.5 text-center">
            <p className="text-sm font-semibold text-[#C8F169]">{value}</p>
            <p className="text-[7px] font-mono text-white/30">{label}</p>
          </div>
        ))}
      </div>
    </Infographic>
  )
}

/**
 * Arrears aging — horizontal stacked buckets.
 * Layout: stacked horizontal bar.
 */
export function InfographicArrears({ className }: { className?: string }) {
  const buckets = [
    { label: "0–30d",  width: "45%", colour: "bg-[#C8F169]/60" },
    { label: "31–60d", width: "28%", colour: "bg-[#8ECAE6]/50" },
    { label: "61–90d", width: "17%", colour: "bg-[#C4B5E8]/50" },
    { label: "90d+",   width: "10%", colour: "bg-[#E8A0BF]/50" },
  ]

  return (
    <Infographic title="Arrears" className={cn("p-3 md:p-4", className)}>
      <div className="flex h-4 rounded-[2px] overflow-hidden mb-2.5">
        {buckets.map(({ width, colour }) => (
          <div key={width} className={cn("h-full", colour)} style={{ width }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {buckets.map(({ label, colour }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={cn("size-2 rounded-[1px] shrink-0", colour)} />
            <span className="text-[8px] font-mono text-white/35">{label}</span>
          </div>
        ))}
      </div>
    </Infographic>
  )
}

/**
 * Document vault — folder tree with file counts.
 * Layout: folder tree.
 */
export function InfographicDocuments({ className }: { className?: string }) {
  const folders = [
    { name: "AGM & Meetings", files: 24, expanded: true },
    { name: "Financials",     files: 18, expanded: false },
    { name: "By-laws",        files: 6,  expanded: false },
  ]

  return (
    <Infographic title="Documents" className={cn("p-3 md:p-4 space-y-1", className)}>
      {folders.map(({ name, files, expanded }) => (
        <div key={name} className="flex items-center gap-2 py-0.5">
          <span className="text-[8px] text-white/30">{expanded ? "▼" : "▶"}</span>
          <div className="size-3 rounded-[2px] bg-[#C8F169]/30 shrink-0" />
          <span className={cn("text-[9px] flex-1 truncate", expanded ? "text-white/60" : "text-white/40")}>
            {name}
          </span>
          <span className="text-[8px] font-mono text-white/25">{files}</span>
        </div>
      ))}
      {folders.some((f) => f.expanded) && (
        <div className="ml-5 space-y-0.5 pt-1">
          {["Minutes Mar 2026", "Notice of AGM"].map((file) => (
            <div key={file} className="flex items-center gap-2">
              <div className="size-2 rounded-[1px] bg-white/15 shrink-0" />
              <span className="text-[8px] text-white/35">{file}</span>
            </div>
          ))}
        </div>
      )}
    </Infographic>
  )
}

/**
 * Scheme onboarding — horizontal setup stepper.
 * Layout: horizontal progress stepper.
 */
export function InfographicOnboarding({ className }: { className?: string }) {
  const steps = ["Details", "Lots", "Levies", "Go live"]
  const current = 2

  return (
    <Infographic title="New Scheme" className={cn("p-3 md:p-4", className)}>
      <div className="flex items-center gap-1 mb-3">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div
              className={cn(
                "size-4 shrink-0 rounded-full flex items-center justify-center text-[7px] font-semibold",
                i < current && "bg-[#C8F169] text-[#043F2E]",
                i === current && "bg-[#C8F169]/30 text-[#C8F169] ring-1 ring-[#C8F169]",
                i > current && "bg-white/10 text-white/25"
              )}
            >
              {i < current ? "✓" : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-px mx-0.5",
                  i < current ? "bg-[#C8F169]/60" : "bg-white/10"
                )}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <span
            key={step}
            className={cn(
              "text-[7px] font-mono",
              i <= current ? "text-white/50" : "text-white/25"
            )}
          >
            {step}
          </span>
        ))}
      </div>
    </Infographic>
  )
}

// ─────────────────────────────────────────────────────────
// Composites — pairs used by FeatureSplit (built from singles)
// ─────────────────────────────────────────────────────────

interface InfographicPairProps {
  className?: string
  /** Shrink to fit inside FeatureSplit visual slots without crossing the seam. */
  contained?: boolean
}

/**
 * Scheme overview pair — health chart + metric sidebar.
 */
export function InfographicSchemePair({ className, contained }: InfographicPairProps) {
  return (
    <InfographicRow pill="Export" contained={contained} className={className}>
      <InfographicScheme />
      <InfographicSidebar
        className={contained ? "w-[30%] max-w-[6rem]" : undefined}
        items={[
          { label: "Levies",      colour: "bg-[#C8F169]" },
          { label: "Maintenance", colour: "bg-[#8ECAE6]" },
          { label: "Compliance",  colour: "bg-[#C4B5E8]" },
        ]}
      />
    </InfographicRow>
  )
}

/**
 * Levy workflow pair — calculator + quarter selector.
 */
export function InfographicLevyPair({ className, contained }: InfographicPairProps) {
  return (
    <InfographicRow contained={contained} className={className}>
      <InfographicLevyCalc />
      <InfographicSelect
        className={contained ? "w-[28%] max-w-[5.5rem]" : undefined}
        label="Q1"
        options={["Oct–Dec", "Jul–Sep", "Apr–Jun", "Jan–Mar"]}
        active="Jan–Mar"
      />
    </InfographicRow>
  )
}

/**
 * Data chart + config sidebar pair.
 */
export function InfographicDataChart({ className }: { className?: string }) {
  return (
    <Infographic title="Faceted Combo" className={cn("min-w-0 flex-1 p-2.5 md:p-3", className)} hideTitle>
      <p className="text-[10px] font-mono text-white/45 mb-3">Faceted Combo</p>
      <div className="relative">
        <InfographicBars
          values={[42, 68, 38, 82, 55, 72, 48, 90]}
          barClassName="bg-[#5B8DEF] even:bg-[#7EB0F5]"
        />
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <polyline
            points="0,28 14,22 28,30 42,14 56,20 70,10 84,16 100,8"
            fill="none"
            stroke="#F5D547"
            strokeWidth="1.5"
          />
        </svg>
      </div>
    </Infographic>
  )
}

/**
 * SQL editor + language picker pair.
 */
export function InfographicCodeEditor({ className }: { className?: string }) {
  return (
    <Infographic title="SQL Editor" className={cn("min-w-0 flex-1", className)}>
      <div className="flex gap-2 p-2.5 md:p-3">
        <div className="flex flex-col gap-1.5 text-[9px] font-mono text-white/25 leading-none pt-0.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <InfographicLines highlight={2} />
      </div>
      <div className="px-3 pb-3 md:px-4 md:pb-4">
        <div className="h-7 w-16 rounded-sm bg-[#C8F169]" />
      </div>
    </Infographic>
  )
}

/**
 * Top-right visual — chart + config sidebar.
 */
export function InfographicChartPair({ className, contained }: InfographicPairProps) {
  return (
    <InfographicRow pill="Share" contained={contained} className={className}>
      <InfographicDataChart />
      <InfographicSidebar
        className={contained ? "w-[30%] max-w-[6rem]" : undefined}
        items={[
          { label: "Rows",    colour: "bg-[#C4B5E8]" },
          { label: "Columns", colour: "bg-[#C8F169]" },
          { label: "Layers",  colour: "bg-[#8ECAE6]" },
        ]}
      />
    </InfographicRow>
  )
}

/**
 * Bottom-left visual — SQL editor + language menu.
 */
export function InfographicEditorPair({ className, contained }: InfographicPairProps) {
  return (
    <InfographicRow contained={contained} className={className}>
      <InfographicCodeEditor />
      <InfographicSelect
        className={contained ? "w-[28%] max-w-[5.5rem]" : undefined}
        label="SQL"
        options={["Python 3.7", "Python 2.7", "R", "SQL"]}
        active="SQL"
      />
    </InfographicRow>
  )
}
