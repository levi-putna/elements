"use client"

import { cn } from "@/lib/utils"
import {
  type HTMLAttributes,
  type ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────
// Tones
//
// Cards (cells) sit on top of a "seam": the grid's background,
// which also shows through every gap and the outer padding.
// ─────────────────────────────────────────────────────────

export type BentoTone =
  | "default" // white
  | "secondary" // off-white  #EEF2E3
  | "primary" // forest     #043F2E
  | "alternative" // lime-soft  #EBF8C2
  | "dark" // forest-mid #0A5C3D

export type BentoSeam = "default" | "secondary" | "primary" | "alternative"

const cellTone: Record<BentoTone, string> = {
  default: "bg-white text-[#043F2E]",
  secondary: "bg-[#EEF2E3] text-[#043F2E]",
  primary: "bg-[#043F2E] text-white",
  alternative: "bg-[#EBF8C2] text-[#043F2E]",
  dark: "bg-[#0A5C3D] text-white",
}

const seamBg: Record<BentoSeam, string> = {
  default: "bg-white",
  secondary: "bg-[#EEF2E3]",
  primary: "bg-[#043F2E]",
  alternative: "bg-[#EBF8C2]",
}

// ─────────────────────────────────────────────────────────
// BentoGrid
// ─────────────────────────────────────────────────────────

interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Background of the container, also the seam/gap colour. */
  seam?: BentoSeam
  /** Number of base columns. Cells span a portion of these. */
  cols?: number
  /** Height of one grid row (cells with rowSpan get multiples of this). */
  rowHeight?: number
  /** Gap between cells (px). Doubles as the outer padding so the frame is even. */
  gap?: number
  /** Outer radius of the container (px). */
  rounded?: number
}

export function BentoGrid({
  seam = "default",
  cols = 12,
  rowHeight = 168,
  gap = 12,
  rounded = 28,
  className,
  children,
  style,
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn(seamBg[seam], className)}
      style={{ padding: gap, borderRadius: rounded, ...style }}
      {...props}
    >
      <div
        className="grid"
        style={{
          gap,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridAutoRows: `${rowHeight}px`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// BentoCell
//
// A single card, rounded on every corner by default.
// ─────────────────────────────────────────────────────────

interface BentoCellProps extends HTMLAttributes<HTMLDivElement> {
  tone?: BentoTone
  /** Columns this cell spans (of the grid's `cols`). */
  colSpan?: number
  /** Rows this cell spans. */
  rowSpan?: number
  /** Corner radius of the card (px). */
  radius?: number
  /** Clip overflowing content (images). */
  clip?: boolean
}

export function BentoCell({
  tone = "secondary",
  colSpan = 1,
  rowSpan = 1,
  radius = 18,
  clip = false,
  className,
  style,
  children,
  ...props
}: BentoCellProps) {
  return (
    <div
      className={cn(
        cellTone[tone],
        "relative",
        clip ? "overflow-hidden" : "overflow-visible",
        className
      )}
      style={{
        gridColumn: `span ${colSpan} / span ${colSpan}`,
        gridRow: `span ${rowSpan} / span ${rowSpan}`,
        borderRadius: radius,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// BentoFeatureCell
//
// The canonical mode.com card: a 24px icon at the top, a label
// pinned to the bottom-left, optional body and visual in between.
// ─────────────────────────────────────────────────────────

interface BentoFeatureCellProps extends BentoCellProps {
  icon?: ReactNode
  label: string
  body?: string
  /** Optional visual (chart, screenshot, illustration) above the label. */
  visual?: ReactNode
}

export function BentoFeatureCell({
  icon,
  label,
  body,
  visual,
  tone = "secondary",
  className,
  children,
  ...props
}: BentoFeatureCellProps) {
  return (
    <BentoCell tone={tone} className={cn("flex flex-col p-6", className)} {...props}>
      {icon && (
        <div className="mb-2 flex size-6 items-center justify-center [&_svg]:size-6 [&_svg]:shrink-0">
          {icon}
        </div>
      )}
      {visual && <div className="min-h-0 flex-1">{visual}</div>}
      <div className="mt-auto pt-6">
        <p className="text-base font-medium leading-snug">{label}</p>
        {body && <p className="mt-1.5 text-sm leading-relaxed opacity-60">{body}</p>}
      </div>
      {children}
    </BentoCell>
  )
}

// ─────────────────────────────────────────────────────────
// BentoContentCell
//
// Text-forward card: eyebrow + display heading + body, for the
// editorial side of a bento. Pair with BentoVisualCell.
// ─────────────────────────────────────────────────────────

interface BentoContentCellProps extends Omit<BentoCellProps, "children"> {
  eyebrow?: string
  heading: string
  body?: string
  footer?: ReactNode
}

export function BentoContentCell({
  eyebrow,
  heading,
  body,
  footer,
  tone = "default",
  className,
  ...props
}: BentoContentCellProps) {
  const onDark = tone === "primary" || tone === "dark"
  return (
    <BentoCell tone={tone} className={cn("flex flex-col justify-between p-8", className)} {...props}>
      <div>
        {eyebrow && (
          <p
            className={cn(
              "mb-3 text-[10px] font-semibold uppercase tracking-widest",
              onDark ? "text-[#C8F169]" : "text-[#4A7A62]"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h3 className="mb-3 font-display text-2xl leading-snug">{heading}</h3>
        {body && (
          <p className={cn("text-sm leading-relaxed", onDark ? "text-white/60" : "text-[#4A7A62]")}>
            {body}
          </p>
        )}
      </div>
      {footer && <div className="mt-6">{footer}</div>}
    </BentoCell>
  )
}

// ─────────────────────────────────────────────────────────
// BentoVisualCell
//
// Fill container for an image, screenshot or UI preview.
// ─────────────────────────────────────────────────────────

export function BentoVisualCell({
  tone = "dark",
  className,
  children,
  ...props
}: BentoCellProps) {
  return (
    <BentoCell
      tone={tone}
      clip
      className={cn("flex items-center justify-center", className)}
      {...props}
    >
      {children}
    </BentoCell>
  )
}
