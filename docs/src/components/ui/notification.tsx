import { cn } from "@/lib/utils"
import {
  AlertCircle,
  AlertTriangle,
  Info,
  type LucideIcon,
} from "lucide-react"
import type { HTMLAttributes, ReactNode } from "react"

// ─────────────────────────────────────────────────────────
// Notification
//
// Inline alert banners for toasts, page callouts, and form
// feedback. Four semantic types map to the status palette:
//
//   default · neutral metadata and low-priority notes
//   info    · informational updates (blue theme)
//   warning · caution / pending review
//   danger  · errors / destructive outcomes
// ─────────────────────────────────────────────────────────

export type NotificationType = "default" | "info" | "warning" | "danger"

type NotificationStyle = {
  section: string
  title: string
  icon: LucideIcon
}

const notificationStyles: Record<NotificationType, NotificationStyle> = {
  default: {
    section: "border-border bg-off-white",
    title: "text-ink",
    icon: Info,
  },
  info: {
    section: "border-[#A8CCE0] bg-info-soft",
    title: "text-info",
    icon: Info,
  },
  warning: {
    section: "border-[#E8C9A0] bg-warning-soft",
    title: "text-warning",
    icon: AlertTriangle,
  },
  danger: {
    section: "border-[#EDB8B4] bg-danger-soft",
    title: "text-danger",
    icon: AlertCircle,
  },
}

export interface NotificationProps extends HTMLAttributes<HTMLDivElement> {
  /** Short heading shown above the body copy. */
  title: string
  /** Supporting detail beneath the title. */
  children?: ReactNode
  /** Semantic colour theme. */
  type?: NotificationType
  /** When false, hides the leading icon. Icons should always pair with text. */
  showIcon?: boolean
}

/**
 * Inline notification banner with semantic colour themes.
 */
export function Notification({
  title,
  children,
  type = "default",
  showIcon = true,
  className,
  ...props
}: NotificationProps) {
  const styles = notificationStyles[type]
  const Icon = styles.icon

  return (
    <div
      data-slot="notification"
      role={type === "danger" ? "alert" : "status"}
      className={cn(
        "rounded-sm border px-5 py-4",
        styles.section,
        className
      )}
      {...props}
    >
      {/* Header: optional icon + title */}
      <div className="flex items-start gap-2.5">
        {showIcon ? (
          <Icon
            className={cn("mt-0.5 size-4 shrink-0", styles.title)}
            strokeWidth={1.75}
            aria-hidden
          />
        ) : null}
        <div className="min-w-0 flex-1 space-y-1">
          <p className={cn("font-sans text-sm font-semibold", styles.title)}>
            {title}
          </p>
          {children ? (
            <div className="font-sans text-sm text-ink-muted leading-relaxed">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
