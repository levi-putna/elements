import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

// ─────────────────────────────────────────────────────────
// Section: full-bleed coloured band
//
// The colour runs edge-to-edge. Width is NOT managed here -
// wrap children in <Container> (or set `contained`) to constrain
// content to the site grid. This separation lets a section hold
// full-bleed visuals and a constrained text column at once.
// ─────────────────────────────────────────────────────────

export type SectionType =
  | "default"     // white: the base, most sections
  | "white"       // explicit white (same as default, useful for clarity)
  | "secondary"   // off-white #EEF2E3: subtle differentiation
  | "primary"     // forest #043F2E: dark, high contrast (hero, footer, testimonial)
  | "alternative" // lime-soft #EBF8C2: accent, CTA bands

export type ContainerWidth =
  | "prose"   // 740px: dense, text-heavy reading column
  | "default" // 1200px: standard marketing content
  | "wide"    // 1360px: wide visual / bento sections
  | "full"    // no max-width, gutter only

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article" | "header" | "footer" | "main"
  type?: SectionType
  /** Vertical rhythm of the band. */
  spacing?: "none" | "sm" | "md" | "lg"
  /**
   * Convenience: wrap children in a <Container> of this width.
   * Pass `false` (default) to manage the container yourself.
   */
  contained?: boolean | ContainerWidth
}

const sectionStyles: Record<SectionType, string> = {
  default:     "bg-white text-[#043F2E]",
  white:       "bg-white text-[#043F2E]",
  secondary:   "bg-[#EEF2E3] text-[#043F2E]",
  primary:     "bg-[#043F2E] text-white",
  alternative: "bg-[#EBF8C2] text-[#043F2E]",
}

const spacingStyles: Record<NonNullable<SectionProps["spacing"]>, string> = {
  none: "",
  sm:   "py-12 md:py-16",
  md:   "py-20 md:py-28",
  lg:   "py-24 md:py-32",
}

export function Section({
  as: Tag = "section",
  type = "default",
  spacing = "lg",
  contained = false,
  className,
  children,
  ...props
}: SectionProps) {
  const body =
    contained === false ? (
      children
    ) : (
      <Container width={contained === true ? "default" : contained}>
        {children}
      </Container>
    )

  return (
    <Tag
      className={cn(sectionStyles[type], "w-full", spacingStyles[spacing], className)}
      {...props}
    >
      {body}
    </Tag>
  )
}

// ─────────────────────────────────────────────────────────
// Container: width + horizontal gutter
//
// The single source of truth for content width across the site.
// Use inside a Section, or standalone anywhere a constrained
// column is needed.
// ─────────────────────────────────────────────────────────

const widthStyles: Record<ContainerWidth, string> = {
  prose:   "max-w-[740px]",
  default: "max-w-[1200px]",
  wide:    "max-w-[1360px]",
  full:    "max-w-none",
}

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth
  /** Horizontal gutter. Defaults to the responsive site gutter. */
  gutter?: boolean
}

export function Container({
  width = "default",
  gutter = true,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        widthStyles[width],
        gutter && "px-6 md:px-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
