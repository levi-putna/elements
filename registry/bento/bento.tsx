"use client"

import { cn } from "@/lib/utils"
import {
  createContext,
  useContext,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────
// Tones
//
// Cards (cells) sit on top of a "seam" — the grid's background,
// which also shows through every gap and the outer padding. The
// concave notch corners are painted in the seam colour so cells
// appear routed into one another, the way mode.com builds its
// "Beyond BI as you know it" grid.
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

const seamHex: Record<BentoSeam, string> = {
  default: "#FFFFFF",
  secondary: "#EEF2E3",
  primary: "#043F2E",
  alternative: "#EBF8C2",
}

// The seam colour is shared down the tree so notches can paint
// themselves without every call site repeating the hex value.
const SeamContext = createContext<string>(seamHex.default)

// ─────────────────────────────────────────────────────────
// BentoGrid
// ─────────────────────────────────────────────────────────

interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Background of the container — also the seam/gap and notch colour. */
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
    <SeamContext.Provider value={seamHex[seam]}>
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
    </SeamContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────
// BentoCell
//
// A single card. Rounded on every corner by default; list corners
// in `flush` to flatten them where a card butts up against a
// neighbour, then drop a <BentoNotch> at that corner to carve the
// concave interlock.
// ─────────────────────────────────────────────────────────

type Corner = "tl" | "tr" | "bl" | "br"

interface BentoCellProps extends HTMLAttributes<HTMLDivElement> {
  tone?: BentoTone
  /** Columns this cell spans (of the grid's `cols`). */
  colSpan?: number
  /** Rows this cell spans. */
  rowSpan?: number
  /** Corner radius of the card (px). */
  radius?: number
  /** Corners to flatten (radius 0) where the card meets another. */
  flush?: Corner[]
  /** Clip overflowing content (images). Off by default so notches show. */
  clip?: boolean
}

const flushKey: Record<Corner, keyof CSSProperties> = {
  tl: "borderTopLeftRadius",
  tr: "borderTopRightRadius",
  bl: "borderBottomLeftRadius",
  br: "borderBottomRightRadius",
}

export function BentoCell({
  tone = "secondary",
  colSpan = 1,
  rowSpan = 1,
  radius = 18,
  flush = [],
  clip = false,
  className,
  style,
  children,
  ...props
}: BentoCellProps) {
  const radii: Record<string, number> = { borderRadius: radius }
  for (const corner of flush) radii[flushKey[corner] as string] = 0

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
        ...radii,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// BentoNotch
//
// A seam-coloured square laid over one corner of its parent cell.
// The *inner* corner is rounded, so the seam colour carves a
// concave quarter-circle out of the card — the interlock detail.
// The parent must be position:relative (BentoCell is). Pair with
// a `flush` corner on the cell so the carve sits on a square edge.
// ─────────────────────────────────────────────────────────

interface BentoNotchProps {
  corner: Corner
  /** Radius of the concave carve (px). */
  size?: number
  /** Override the seam colour (defaults to the grid's seam). */
  seam?: string
  className?: string
}

const notchPos: Record<Corner, CSSProperties> = {
  tl: { top: 0, left: 0 },
  tr: { top: 0, right: 0 },
  bl: { bottom: 0, left: 0 },
  br: { bottom: 0, right: 0 },
}

// Round the corner facing *into* the card body.
const notchInner: Record<Corner, keyof CSSProperties> = {
  tl: "borderBottomRightRadius",
  tr: "borderBottomLeftRadius",
  bl: "borderTopRightRadius",
  br: "borderTopLeftRadius",
}

export function BentoNotch({ corner, size = 22, seam, className }: BentoNotchProps) {
  const ctxSeam = useContext(SeamContext)
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute z-10", className)}
      style={{
        width: size,
        height: size,
        background: seam ?? ctxSeam,
        [notchInner[corner]]: size,
        ...notchPos[corner],
      }}
    />
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
  /** Notches to render — one per interlocking corner. */
  notches?: Corner[]
  notchSize?: number
}

export function BentoFeatureCell({
  icon,
  label,
  body,
  visual,
  notches = [],
  notchSize,
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
      {notches.map((corner) => (
        <BentoNotch key={corner} corner={corner} size={notchSize} />
      ))}
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
