import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import type { LucideIcon } from "lucide-react"
import type { HTMLAttributes } from "react"

// ─────────────────────────────────────────────────────────
// Badge: shared label primitive
//
// Foundation for all status, identifier, and domain badges
// across Instant Strata. Domain components (SchemeStatusBadge,
// LotLevyBadge, WorkItemStatusBadge, etc.) compose this shell
// with fixed variant + icon mappings.
//
// Variant guide:
//   default / secondary  · neutral metadata
//   accent               · positive / active / success
//   warning              · caution / pending review
//   destructive          · error / overdue / attention
//   outline              · low-emphasis bordered
//   mono                 · identifiers (SP, Lot numbers)
// ─────────────────────────────────────────────────────────

export const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-xs font-medium whitespace-nowrap transition-colors duration-150",
  {
    variants: {
      variant: {
        default: "bg-off-white text-ink-muted",
        secondary: "bg-off-white text-ink-muted",
        accent: "bg-lime-soft text-ink",
        warning: "bg-warning-soft text-ink",
        destructive: "bg-danger-soft text-danger",
        outline: "border border-border bg-white text-ink-muted",
        mono: "bg-off-white font-mono uppercase tracking-wide text-ink-muted",
        ghost: "bg-transparent text-ink-muted",
      },
      size: {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-0.5 text-xs",
        lg: "px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)

export type BadgeVariant = NonNullable<
  VariantProps<typeof badgeVariants>["variant"]
>

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Optional leading Lucide icon. */
  icon?: LucideIcon
  /** Suppress the leading icon in dense table cells. */
  hideIcon?: boolean
}

/**
 * Base badge primitive. Prefer domain badges (SchemeStatusBadge, LotLevyBadge)
 * in product UI so states stay consistent.
 */
export function Badge({
  className,
  variant,
  size,
  icon: Icon,
  hideIcon = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {Icon && !hideIcon ? (
        <Icon className="size-3.5 shrink-0" strokeWidth={1.5} aria-hidden />
      ) : null}
      {children}
    </span>
  )
}

export interface BadgeIconProps {
  icon: LucideIcon
  className?: string
}

/**
 * Leading icon for custom badge compositions.
 */
export function BadgeIcon({ icon: Icon, className }: BadgeIconProps) {
  return (
    <Icon
      className={cn("size-3.5 shrink-0", className)}
      strokeWidth={1.5}
      aria-hidden
    />
  )
}

/** Semantic tone aliases used in domain badge config maps. */
export const badgeTone = {
  neutral: "default",
  accent: "accent",
  warning: "warning",
  danger: "destructive",
  outline: "outline",
  mono: "mono",
} as const satisfies Record<string, BadgeVariant>

export type BadgeTone = keyof typeof badgeTone
