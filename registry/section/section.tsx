import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

export type SectionType =
  | "default"    // white — the base, most sections
  | "white"      // explicit white (same as default, useful for clarity)
  | "secondary"  // off-white #EEF2E3 — subtle differentiation
  | "primary"    // forest #043F2E — dark, high contrast (hero, footer, testimonial)
  | "alternative" // lime-soft #EBF8C2 — accent, CTA bands

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div" | "article" | "header" | "footer" | "main"
  type?: SectionType
  /** Constrain inner content to the standard max-width and apply horizontal padding */
  contained?: boolean
}

const sectionStyles: Record<SectionType, string> = {
  default:     "bg-white text-[#043F2E]",
  white:       "bg-white text-[#043F2E]",
  secondary:   "bg-[#EEF2E3] text-[#043F2E]",
  primary:     "bg-[#043F2E] text-white",
  alternative: "bg-[#EBF8C2] text-[#043F2E]",
}

export function Section({
  as: Tag = "section",
  type = "default",
  contained = false,
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Tag
      className={cn(sectionStyles[type], "w-full", className)}
      {...props}
    >
      {contained ? (
        <div className="mx-auto w-full max-w-[1200px] px-6 py-24 md:px-12 md:py-32">
          {children}
        </div>
      ) : (
        children
      )}
    </Tag>
  )
}
