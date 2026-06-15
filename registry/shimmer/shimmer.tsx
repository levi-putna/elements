import { cn } from "@/lib/utils"
import type { CSSProperties, ElementType, HTMLAttributes } from "react"

interface ShimmerProps extends HTMLAttributes<HTMLElement> {
  /** HTML element to render. Defaults to span so it can sit inline within text. */
  as?: ElementType
  /** Animation duration in seconds. */
  duration?: number
  /** Spread multiplier — higher values widen the bright band. */
  spread?: number
}

/**
 * Animated gradient shimmer that sweeps across text.
 * Uses background-clip: text so the shimmer is painted on the letterforms.
 *
 * Uses the brand gradient: forest → lime → forest.
 * Add the @keyframes text-shimmer definition to your globals.css (see README).
 */
export function Shimmer({
  as: Tag = "span",
  duration = 2,
  spread = 2,
  className,
  children,
  style,
  ...props
}: ShimmerProps) {
  const stop = Math.round(100 / (spread * 2))

  const shimmerStyle: CSSProperties = {
    backgroundImage: [
      "linear-gradient(to right,",
      `#043F2E ${stop}%,`,
      `#C8F169 50%,`,
      `#043F2E ${100 - stop}%)`,
    ].join(" "),
    backgroundSize: "200% auto",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    animation: `text-shimmer ${duration}s linear infinite`,
    ...style,
  }

  return (
    <Tag
      className={cn("inline-block", className)}
      style={shimmerStyle}
      {...props}
    >
      {children}
    </Tag>
  )
}
