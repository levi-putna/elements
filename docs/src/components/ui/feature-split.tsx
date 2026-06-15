import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"
import {
  InfographicLevyPair,
  InfographicChartPair,
  InfographicEditorPair,
  InfographicSchemePair,
} from "@/components/ui/infographic"

// ─────────────────────────────────────────────────────────
// FeatureSplit: stepped two-column interlock
//
// A 2×2 grid where the column ratio flips between rows so
// the cream ↔ lime seam steps horizontally.
//
//   TL  cream  · heading + body
//   TR  lime   · infographic visual (contained in cell)
//   BL  cream  · infographic visual (contained in cell)
//   BR  lime   · heading + body
//
// The dark forest frame shows through the uniform gap, forming
// the outer border and the stepped divider between quadrants.
// ─────────────────────────────────────────────────────────

export type FeatureSplitTone = "cream" | "lime"

export interface FeatureSplitTextBlock {
  heading: string
  body: string
}

export interface FeatureSplitProps extends HTMLAttributes<HTMLDivElement> {
  /** Top-left copy block. */
  primary: FeatureSplitTextBlock
  /** Bottom-right copy block. */
  secondary: FeatureSplitTextBlock
  /** Top-right visual slot. Defaults to {@link InfographicChartPair}. */
  topVisual?: ReactNode
  /** Bottom-left visual slot. Defaults to {@link InfographicEditorPair}. */
  bottomVisual?: ReactNode
  /** Gap between quadrants: also the visible seam width. */
  gap?: "sm" | "md" | "lg"
}

const gapClass = {
  sm: { frame: "p-2", grid: "gap-2", row: "gap-2 mt-2" },
  md: { frame: "p-3 md:p-4", grid: "gap-3 md:gap-4", row: "gap-3 mt-3 md:gap-4 md:mt-4" },
  lg: { frame: "p-4 md:p-5", grid: "gap-4 md:gap-5", row: "gap-4 mt-4 md:gap-5 md:mt-5" },
}

const toneClass: Record<FeatureSplitTone, string> = {
  cream: "bg-[#EEF2E3] text-[#043F2E]",
  lime:  "bg-[#C8F169] text-[#043F2E]",
}

/** Default sample copy for a data-team feature section. */
export const FEATURE_SPLIT_DEFAULT: Pick<FeatureSplitProps, "primary" | "secondary"> = {
  primary: {
    heading: "Made for your data team",
    body:
      "SQL, R, Python and data viz connected in one place: so insights reach stakeholders faster than ever. No rigid data model should stand in the way of the analysis needed to support business decisions, big and small.",
  },
  secondary: {
    heading: "And the teams you work with",
    body:
      "Deliver tools for easy, trusted self-service, in record time. When every analytical tool lives in one place, your platform becomes a central hub full of easy-to-understand data, curated by the data team, without long implementation times or tedious maintenance.",
  },
}

/** Instant Strata adaptation of the same layout. */
export const FEATURE_SPLIT_STRATA: Pick<FeatureSplitProps, "primary" | "secondary"> = {
  primary: {
    heading: "Made for your strata team",
    body:
      "In Instant Strata, levies, maintenance, compliance and owner communications are all connected to help you manage every scheme faster than ever. No rigid legacy system should stand in the way of the work needed to keep buildings running smoothly, day in and day out.",
  },
  secondary: {
    heading: "And the owners you support",
    body:
      "Deliver a portal for easy, trusted self-service, in record time. Because every owner's questions, notices and payments can live in one place, Instant Strata becomes a central hub full of easy-to-understand building information, curated by your team, without long onboarding or tedious admin.",
  },
}

/**
 * Stepped two-column feature section: the interlock layout.
 */
export function FeatureSplit({
  primary,
  secondary,
  topVisual,
  bottomVisual,
  gap = "md",
  className,
  ...props
}: FeatureSplitProps) {
  const { frame, grid, row } = gapClass[gap]

  return (
    <div
      className={cn(
        "w-full rounded-[28px] bg-[#043F2E]",
        frame,
        className
      )}
      {...props}
    >
      {/* Top row: cream column wider */}
      <div
        className={cn("grid items-stretch", grid)}
        style={{ gridTemplateColumns: "minmax(0, 1.14fr) minmax(0, 0.86fr)" }}
      >
        {/* Top-left: primary copy */}
        <FeatureSplitCell tone="cream" className="rounded-tl-[20px] h-full">
          <FeatureSplitText heading={primary.heading} body={primary.body} />
        </FeatureSplitCell>

        {/* Top-right: infographic visual */}
        <FeatureSplitCell
          tone="lime"
          padding="sm"
          className="rounded-tr-[20px] overflow-hidden grid h-full place-items-center"
        >
          <FeatureSplitVisual>
            {topVisual ?? <InfographicChartPair contained />}
          </FeatureSplitVisual>
        </FeatureSplitCell>
      </div>

      {/* Bottom row: lime column wider (stepped seam) */}
      <div
        className={cn("grid items-stretch", row)}
        style={{ gridTemplateColumns: "minmax(0, 0.86fr) minmax(0, 1.14fr)" }}
      >
        {/* Bottom-left: infographic visual */}
        <FeatureSplitCell
          tone="cream"
          padding="sm"
          className="rounded-bl-[20px] overflow-hidden grid h-full place-items-center"
        >
          <FeatureSplitVisual>
            {bottomVisual ?? <InfographicEditorPair contained />}
          </FeatureSplitVisual>
        </FeatureSplitCell>

        {/* Bottom-right: secondary copy */}
        <FeatureSplitCell tone="lime" className="rounded-br-[20px] h-full">
          <FeatureSplitText heading={secondary.heading} body={secondary.body} />
        </FeatureSplitCell>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FeatureSplitCell: one quadrant panel
// ─────────────────────────────────────────────────────────

export interface FeatureSplitCellProps extends HTMLAttributes<HTMLDivElement> {
  tone?: FeatureSplitTone
  padding?: "none" | "sm" | "md" | "lg"
}

const cellPad = {
  none: "",
  sm:   "p-5 md:p-6",
  md:   "p-6 md:p-8 lg:p-10",
  lg:   "p-8 md:p-10 lg:p-12",
}

export function FeatureSplitCell({
  tone = "cream",
  padding = "md",
  className,
  children,
  ...props
}: FeatureSplitCellProps) {
  return (
    <div
      className={cn(
        "relative min-h-[220px] md:min-h-[260px]",
        toneClass[tone],
        cellPad[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FeatureSplitText: heading + body for a copy quadrant
// ─────────────────────────────────────────────────────────

export interface FeatureSplitTextProps {
  heading: string
  body: string
  className?: string
}

/**
 * Young Serif heading and supporting body copy for a text quadrant.
 */
export function FeatureSplitText({ heading, body, className }: FeatureSplitTextProps) {
  return (
    <div className={cn("max-w-md", className)}>
      {/* Heading */}
      <h3 className="font-display text-[1.65rem] leading-[1.15] md:text-[2rem] lg:text-[2.25rem] text-[#043F2E] mb-4 md:mb-5">
        {heading}
      </h3>
      {/* Body */}
      <p className="text-sm md:text-[0.9375rem] leading-relaxed text-[#043F2E]/75">
        {body}
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FeatureSplitVisual: constrains infographics inside a quadrant
// ─────────────────────────────────────────────────────────

export interface FeatureSplitVisualProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/**
 * Centres infographic content inside the cell with even space on all sides.
 */
export function FeatureSplitVisual({
  className,
  children,
  ...props
}: FeatureSplitVisualProps) {
  return (
    <div
      className={cn(
        "w-full max-w-full min-w-0 overflow-hidden",
        "[&>*]:min-w-0 [&>*]:max-w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// FeatureSplitBleed: optional media overhang (off by default)
//
// Only use when you deliberately want an infographic to spill
// across the seam. FeatureSplit visual slots no longer use this.
// ─────────────────────────────────────────────────────────

export interface FeatureSplitBleedProps extends HTMLAttributes<HTMLDivElement> {
  bleed?: { top?: number; right?: number; bottom?: number; left?: number }
}

export function FeatureSplitBleed({
  bleed = {},
  className,
  style,
  children,
  ...props
}: FeatureSplitBleedProps) {
  const { top, right, bottom, left } = bleed

  return (
    <div
      className={cn("relative z-20 h-full", className)}
      style={{
        marginTop: top != null ? -top : undefined,
        marginRight: right != null ? -right : undefined,
        marginBottom: bottom != null ? -bottom : undefined,
        marginLeft: left != null ? -left : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// Re-export strata infographic pairs for convenience
export { InfographicSchemePair, InfographicLevyPair }
