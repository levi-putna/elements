import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

// ─────────────────────────────────────────────────────────
// Statement — oversized editorial statement section
//
// The closing-manifesto pattern (Mode-style): an eyebrow, a large
// display headline that makes a single bold claim, an optional
// "cycle" loop diagram reinforcing a back-and-forth idea, and a
// dual call-to-action.
//
// Wrap a word in <em>…</em> inside the headline to highlight it in
// the accent colour (it is not italicised).
// ─────────────────────────────────────────────────────────

export type StatementType =
  | "primary"     // forest background, white text (default)
  | "alternative" // lime-soft background, forest text
  | "default"     // white background, forest text

interface StatementColors {
  section: string
  eyebrow: string
  /** Accent applied to <em> inside the headline. */
  headingEm: string
  body: string
  /** Cycle pill fill + text. */
  pillFill: string
  pillText: string
  /** Cycle arrow stroke. */
  arrow: string
}

const colors: Record<StatementType, StatementColors> = {
  primary: {
    section: "bg-[#043F2E] text-white",
    eyebrow: "text-[#C8F169]",
    headingEm: "[&_em]:text-[#C8F169] [&_em]:not-italic",
    body: "text-white/70",
    pillFill: "#C8F169",
    pillText: "#043F2E",
    arrow: "#C8F169",
  },
  alternative: {
    section: "bg-[#EBF8C2] text-[#043F2E]",
    eyebrow: "text-[#0A5C3D]",
    headingEm: "[&_em]:text-[#0A5C3D] [&_em]:not-italic",
    body: "text-[#043F2E]/70",
    pillFill: "#043F2E",
    pillText: "#FFFFFF",
    arrow: "#043F2E",
  },
  default: {
    section: "bg-white text-[#043F2E]",
    eyebrow: "text-[#4A7A62]",
    headingEm: "[&_em]:text-[#0A5C3D] [&_em]:not-italic",
    body: "text-[#4A7A62]",
    pillFill: "#043F2E",
    pillText: "#FFFFFF",
    arrow: "#043F2E",
  },
}

export interface StatementProps extends HTMLAttributes<HTMLElement> {
  /** Small all-caps label above the headline. */
  eyebrow?: string
  /** The statement headline. Wrap words in <em> to accent them. */
  children: ReactNode
  /** Supporting paragraph beneath the headline. */
  body?: string
  /**
   * Optional cycle diagram — two labelled nodes joined by looping
   * arrows that return to the start ("…and back again").
   */
  cycle?: { from: string; to: string }
  /** Call-to-action buttons (use StatementAction). */
  actions?: ReactNode
  /** Background / colour scheme. */
  type?: StatementType
}

export function Statement({
  eyebrow,
  children,
  body,
  cycle,
  actions,
  type = "primary",
  className,
  ...props
}: StatementProps) {
  const c = colors[type]

  return (
    <section className={cn("w-full", c.section, className)} {...props}>
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center md:py-32">
        {eyebrow && (
          <p className={cn("mb-6 text-xs font-semibold uppercase tracking-widest", c.eyebrow)}>
            {eyebrow}
          </p>
        )}

        <h2
          className={cn(
            "font-display text-4xl leading-[1.1] md:text-5xl lg:text-6xl",
            c.headingEm
          )}
        >
          {children}
        </h2>

        {cycle && (
          <div className="mt-12 w-full max-w-xl">
            <CycleLoop from={cycle.from} to={cycle.to} colors={c} />
          </div>
        )}

        {body && (
          <p className={cn("mt-8 max-w-xl text-base leading-relaxed md:text-lg", c.body)}>
            {body}
          </p>
        )}

        {actions && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// CycleLoop — two nodes joined by looping arrows
// ─────────────────────────────────────────────────────────

function CycleLoop({
  from,
  to,
  colors: c,
}: {
  from: string
  to: string
  colors: StatementColors
}) {
  return (
    <svg
      viewBox="0 0 640 200"
      className="w-full"
      role="img"
      aria-label={`The cycle from ${from} to ${to} and back again`}
    >
      <defs>
        <marker
          id="cycle-arrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0,0 L10,5 L0,10 z" fill={c.arrow} />
        </marker>
      </defs>

      {/* Top arc: from → to */}
      <path
        d="M250,88 C300,36 340,36 390,88"
        fill="none"
        stroke={c.arrow}
        strokeWidth="2.5"
        markerEnd="url(#cycle-arrow)"
      />
      {/* Bottom arc: to → from ("back again") */}
      <path
        d="M390,112 C340,164 300,164 250,112"
        fill="none"
        stroke={c.arrow}
        strokeWidth="2.5"
        markerEnd="url(#cycle-arrow)"
      />

      {/* Left node */}
      <rect x="30" y="75" width="220" height="50" rx="25" fill={c.pillFill} />
      <text
        x="140"
        y="100"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        fontWeight="600"
        fill={c.pillText}
      >
        {from}
      </text>

      {/* Right node */}
      <rect x="390" y="75" width="220" height="50" rx="25" fill={c.pillFill} />
      <text
        x="500"
        y="100"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="15"
        fontWeight="600"
        fill={c.pillText}
      >
        {to}
      </text>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────
// StatementAction — brand-styled CTA button
// ─────────────────────────────────────────────────────────

interface StatementActionProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: "primary" | "outline"
  /** The Statement type this sits on, so the outline contrasts correctly. */
  on?: StatementType
}

export function StatementAction({
  href,
  variant = "primary",
  on = "primary",
  className,
  children,
  ...props
}: StatementActionProps) {
  const onDark = on === "primary"
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-5 py-2.5 text-sm transition-colors duration-150 no-underline",
        variant === "primary"
          ? "bg-[#C8F169] text-[#043F2E] hover:bg-[#B5E050]"
          : onDark
            ? "border border-white/30 text-white hover:bg-white/10"
            : "border border-[#043F2E]/30 text-[#043F2E] hover:bg-[#043F2E]/5",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
