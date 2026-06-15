import { cn } from "@/lib/utils"
import type { ElementType, HTMLAttributes } from "react"

// ─────────────────────────────────────────────────────────
// Shared types
// ─────────────────────────────────────────────────────────

export type BentoCellType =
  | "default"     // white — for cells on off-white / secondary containers
  | "secondary"   // off-white #EEF2E3 — subtle on white containers
  | "primary"     // forest #043F2E — high contrast on light containers
  | "alternative" // lime-soft #EBF8C2 — accent on dark containers
  | "dark-card"   // forest-mid #0A5C3D — secondary card inside dark sections

export type BentoContainerType =
  | "default"     // white outer — cells default to secondary
  | "secondary"   // off-white outer — cells default to white
  | "primary"     // forest outer — cells default to dark-card or alternative
  | "alternative" // lime-soft outer — cells default to primary

// ─────────────────────────────────────────────────────────
// Style maps
// ─────────────────────────────────────────────────────────

const containerBg: Record<BentoContainerType, string> = {
  default:     "bg-white",
  secondary:   "bg-[#EEF2E3]",
  primary:     "bg-[#043F2E]",
  alternative: "bg-[#EBF8C2]",
}

const cellBg: Record<BentoCellType, string> = {
  default:     "bg-white text-[#043F2E]",
  secondary:   "bg-[#EEF2E3] text-[#043F2E]",
  primary:     "bg-[#043F2E] text-white",
  alternative: "bg-[#EBF8C2] text-[#043F2E]",
  "dark-card": "bg-[#0A5C3D] text-white",
}

const colSpanClass: Record<1 | 2 | 3 | 4, string> = {
  1: "col-span-1",
  2: "col-span-2",
  3: "col-span-3",
  4: "col-span-4",
}

const rowSpanClass: Record<1 | 2 | 3, string> = {
  1: "row-span-1",
  2: "row-span-2",
  3: "row-span-3",
}

const gridColsClass: Record<2 | 3 | 4, string> = {
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
}

// ─────────────────────────────────────────────────────────
// BentoGrid
// ─────────────────────────────────────────────────────────

interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Background colour of the outer container (also the gap/padding colour). */
  type?: BentoContainerType
  /** Number of equal-width columns. */
  cols?: 2 | 3 | 4
  /**
   * Gap between cells — also used as the outer padding, so the gap and
   * border visually match and create the notch effect at inner corners.
   */
  gap?: "sm" | "md" | "lg"
  /** Outer border-radius of the container. */
  rounded?: "md" | "lg" | "xl"
}

const gapClass = { sm: "gap-1.5 p-1.5", md: "gap-2 p-2", lg: "gap-3 p-3" }
const roundedClass = { md: "rounded-md", lg: "rounded-lg", xl: "rounded-xl" }

export function BentoGrid({
  type = "secondary",
  cols = 3,
  gap = "md",
  rounded = "xl",
  className,
  children,
  ...props
}: BentoGridProps) {
  return (
    <div
      className={cn(containerBg[type], roundedClass[rounded], className)}
      {...props}
    >
      <div className={cn("grid", gridColsClass[cols], gapClass[gap])}>
        {children}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// BentoCell
// ─────────────────────────────────────────────────────────

interface BentoCellProps extends HTMLAttributes<HTMLDivElement> {
  /** Background style of this cell. */
  type?: BentoCellType
  /** How many columns this cell spans. */
  colSpan?: 1 | 2 | 3 | 4
  /** How many rows this cell spans. */
  rowSpan?: 1 | 2 | 3
  /** Minimum height class — useful for short cells to stay proportional. */
  minH?: string
}

export function BentoCell({
  type = "primary",
  colSpan = 1,
  rowSpan = 1,
  minH,
  className,
  children,
  ...props
}: BentoCellProps) {
  return (
    <div
      className={cn(
        cellBg[type],
        colSpanClass[colSpan],
        rowSpanClass[rowSpan],
        "rounded-lg overflow-hidden",
        minH,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// BentoCellIcon  —  icon displayed at the top of a feature cell
// ─────────────────────────────────────────────────────────

interface BentoCellIconProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the icon slot. */
  size?: "sm" | "md" | "lg"
}

const iconSizeClass = { sm: "size-4", md: "size-5", lg: "size-6" }

export function BentoCellIcon({
  size = "md",
  className,
  children,
  ...props
}: BentoCellIconProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
        `[&_svg]:${iconSizeClass[size]}`,
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// BentoCellBody  —  flexible content region
// ─────────────────────────────────────────────────────────

export function BentoCellBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex-1 min-h-0", className)} {...props}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// BentoCellFooter  —  label pinned to the bottom of a cell
// ─────────────────────────────────────────────────────────

export function BentoCellFooter({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("mt-auto", className)} {...props}>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// BentoFeatureCell  —  opinionated icon-top / label-bottom cell
//
// The canonical Mode-style feature cell:
//   icon (top-left)  ──  empty visual fill area  ──  label (bottom-left)
// ─────────────────────────────────────────────────────────

interface BentoFeatureCellProps extends Omit<BentoCellProps, "children"> {
  icon?: React.ReactNode
  label: string
  description?: string
  visual?: React.ReactNode
}

export function BentoFeatureCell({
  icon,
  label,
  description,
  visual,
  type = "primary",
  colSpan = 1,
  rowSpan = 1,
  minH = "min-h-36",
  className,
  ...props
}: BentoFeatureCellProps) {
  return (
    <BentoCell
      type={type}
      colSpan={colSpan}
      rowSpan={rowSpan}
      minH={minH}
      className={cn("flex flex-col justify-between p-5", className)}
      {...props}
    >
      <div className="flex flex-col gap-3">
        {icon && (
          <BentoCellIcon size="md">
            {icon}
          </BentoCellIcon>
        )}
        {visual && (
          <div className="flex-1 flex items-center justify-center">
            {visual}
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm font-semibold leading-snug">{label}</p>
        {description && (
          <p className="mt-1 text-xs opacity-60 leading-relaxed">{description}</p>
        )}
      </div>
    </BentoCell>
  )
}

// ─────────────────────────────────────────────────────────
// BentoContentCell  —  text-heavy cell for the content bento variant
//
// Eyebrow + heading + body paragraph, used in the 2-column
// alternating text-and-visual layout.
// ─────────────────────────────────────────────────────────

interface BentoContentCellProps extends Omit<BentoCellProps, "children"> {
  eyebrow?: string
  heading: string
  body?: string
  footer?: React.ReactNode
  padding?: "sm" | "md" | "lg"
}

const contentPaddingClass = { sm: "p-6", md: "p-8", lg: "p-10" }

export function BentoContentCell({
  eyebrow,
  heading,
  body,
  footer,
  type = "secondary",
  colSpan = 1,
  rowSpan = 1,
  padding = "md",
  className,
  ...props
}: BentoContentCellProps) {
  return (
    <BentoCell
      type={type}
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={cn(
        "flex flex-col justify-between",
        contentPaddingClass[padding],
        className
      )}
      {...props}
    >
      <div>
        {eyebrow && (
          <p
            className={cn(
              "text-[10px] font-semibold uppercase tracking-widest mb-3",
              type === "primary" || type === "dark-card"
                ? "text-[#C8F169]"
                : "text-[#4A7A62]"
            )}
          >
            {eyebrow}
          </p>
        )}
        <h3
          className={cn(
            "font-display font-bold text-2xl leading-snug mb-3",
            type === "primary" || type === "dark-card" ? "text-white" : "text-[#043F2E]"
          )}
        >
          {heading}
        </h3>
        {body && (
          <p
            className={cn(
              "text-sm leading-relaxed",
              type === "primary" || type === "dark-card"
                ? "text-white/60"
                : "text-[#4A7A62]"
            )}
          >
            {body}
          </p>
        )}
      </div>
      {footer && <div className="mt-6">{footer}</div>}
    </BentoCell>
  )
}

// ─────────────────────────────────────────────────────────
// BentoVisualCell  —  cell filled with an image or screenshot
// ─────────────────────────────────────────────────────────

interface BentoVisualCellProps extends Omit<BentoCellProps, "children"> {
  children?: React.ReactNode
  objectFit?: "cover" | "contain" | "none"
}

export function BentoVisualCell({
  type = "dark-card",
  colSpan = 1,
  rowSpan = 1,
  children,
  className,
  ...props
}: BentoVisualCellProps) {
  return (
    <BentoCell
      type={type}
      colSpan={colSpan}
      rowSpan={rowSpan}
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      {...props}
    >
      {children}
    </BentoCell>
  )
}
