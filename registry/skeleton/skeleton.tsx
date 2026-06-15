import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

/**
 * Block-level loading placeholder.
 * Uses the same shimmer sweep animation as the Button loading state
 * so all loading indicators feel visually consistent.
 *
 * Requires @keyframes shimmer to be defined in globals.css.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn("relative overflow-hidden rounded-sm bg-secondary", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent"
      />
    </div>
  )
}
