"use client"

import { cn } from "@/lib/utils"
import { ChevronRight, Sparkles, type LucideIcon } from "lucide-react"
import type { ButtonHTMLAttributes, HTMLAttributes } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// AgentAction: a call-to-action element that launches an AI agent with a
// preset prompt. The full `prompt` is stored in the component but never
// rendered to the user; only `title` and `description` are shown.
//
// Four display variants:
//   card   — bordered card with header icon, description, and a launch footer
//   row    — compact list row with leading icon chip, content, trailing action
//   inline — minimal inline trigger that fits in toolbars and prose
//   banner — wide, low-height strip for page-toppers and priority alerts
//
// Four urgency levels (applies tinting to all variants):
//   default — white/standard (no urgency)
//   info    — info-soft background, steel blue tones
//   warning — warning-soft background, amber tones
//   danger  — danger-soft background, terracotta tones
// ─────────────────────────────────────────────────────────────────────────────

export type AgentActionVariant = "card" | "row" | "inline" | "banner"
export type AgentActionUrgency = "default" | "info" | "warning" | "danger"

// ─────────────────────────────────────────────────────────────────────────────
// Shared urgency style maps
// ─────────────────────────────────────────────────────────────────────────────

/** Icon chip class for card / row / banner header (on a white or tinted surface). */
const iconUrgencyClass: Record<AgentActionUrgency, string> = {
  default: "bg-lime-soft text-forest",
  info: "bg-info-soft text-info",
  warning: "bg-warning-soft text-warning",
  danger: "bg-danger-soft text-danger",
}

/** Icon chip class for banner — slightly more contrast on an already-tinted bg. */
const bannerIconUrgencyClass: Record<AgentActionUrgency, string> = {
  default: "bg-lime-soft text-forest",
  info: "bg-info/15 text-info",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
}

/** Card surface tinting. */
const cardUrgencyClass: Record<AgentActionUrgency, string> = {
  default: "bg-white border-border",
  info: "bg-info-soft/40 border-info/20",
  warning: "bg-warning-soft/50 border-warning/20",
  danger: "bg-danger-soft/60 border-danger/20",
}

/** Banner surface tinting. */
const bannerBgClass: Record<AgentActionUrgency, string> = {
  default: "bg-white border-border",
  info: "bg-info-soft border-info/20",
  warning: "bg-warning-soft border-warning/20",
  danger: "bg-danger-soft border-danger/20",
}

/** CSS variable value for the banner's left accent border. */
const urgencyAccentColor: Record<AgentActionUrgency, string> = {
  default: "var(--color-forest)",
  info: "var(--color-info)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
}

// ─────────────────────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentActionProps
  extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  /** User-facing title shown in the component. */
  title: string
  /** Brief summary of what the agent will do. Shown to the user, not the full prompt. */
  description?: string
  /** Full prompt passed to the agent on trigger. Never rendered to the user. */
  prompt: string
  /**
   * Label for the launch button. Defaults to `title` so the CTA reads as the
   * action itself (e.g. "Renew Building Insurance") rather than a generic phrase.
   * Override with a shorter string when `title` is too long for the button.
   */
  cta?: string
  /** Optional context/category label (e.g. "Insurance", "Compliance", "AGM"). */
  category?: string
  /** Leading icon; defaults to Sparkles. */
  icon?: LucideIcon
  /** Visual display variant. */
  variant?: AgentActionVariant
  /**
   * Urgency level. Tints the surface to draw the manager's eye.
   * Use `danger` for overdue or expired items, `warning` for approaching
   * deadlines, `info` for guidance updates, `default` otherwise.
   */
  urgency?: AgentActionUrgency
  /** Called when the action is triggered; receives the full prompt string. */
  onTrigger?: (prompt: string) => void
  /** Navigate to this URL instead of calling onTrigger (e.g. /assistant?task=abc). */
  href?: string
  disabled?: boolean
  loading?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// AgentActionCategoryBadge: small context pill
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentActionCategoryBadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  label: string
}

/**
 * Compact category pill used inside AgentAction cards, rows, and banners.
 */
export function AgentActionCategoryBadge({
  label,
  className,
  ...props
}: AgentActionCategoryBadgeProps) {
  return (
    <span
      data-slot="agent-action-category"
      className={cn(
        "inline-flex shrink-0 items-center rounded-xs bg-lime-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-forest",
        className
      )}
      {...props}
    >
      {label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared trigger helper
// ─────────────────────────────────────────────────────────────────────────────

function makeTrigger({
  prompt,
  href,
  disabled,
  loading,
  onTrigger,
}: Pick<AgentActionProps, "prompt" | "href" | "disabled" | "loading" | "onTrigger">) {
  return function handleTrigger() {
    if (disabled || loading) return
    if (href) {
      window.location.href = href
      return
    }
    onTrigger?.(prompt)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Card variant
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Card layout: bordered panel with header icon area, description body,
 * optional category badge, and a forest-green "Start agent" footer button.
 * Urgency tints the card surface and icon chip.
 */
function AgentActionCard({
  title,
  description,
  prompt,
  cta,
  category,
  icon: Icon = Sparkles,
  urgency = "default",
  onTrigger,
  href,
  disabled,
  loading,
  className,
  ...props
}: AgentActionProps) {
  const handleTrigger = makeTrigger({ prompt, href, disabled, loading, onTrigger })
  const ctaLabel = cta ?? title

  return (
    <div
      data-slot="agent-action"
      data-variant="card"
      data-urgency={urgency}
      className={cn(
        "flex flex-col overflow-hidden rounded-sm border shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        cardUrgencyClass[urgency],
        disabled && "opacity-60",
        className
      )}
      {...(props as HTMLAttributes<HTMLDivElement>)}
    >
      {/* Icon header area */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <span
          className={cn(
            "mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-sm",
            iconUrgencyClass[urgency]
          )}
        >
          <Icon className="size-4" strokeWidth={1.5} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug text-foreground">{title}</p>
          {category && (
            <AgentActionCategoryBadge label={category} className="mt-1.5" />
          )}
        </div>
      </div>

      {/* Description body */}
      {description && (
        <div className="flex-1 px-4 pb-4">
          <p className="text-xs leading-relaxed text-ink-muted">{description}</p>
        </div>
      )}

      {/* Launch footer */}
      <div className="border-t border-border/60 px-4 py-2.5">
        <button
          type="button"
          onClick={handleTrigger}
          disabled={disabled || loading}
          aria-busy={loading}
          className={cn(
            "inline-flex w-full items-center justify-center gap-1.5 rounded-xs bg-[#043F2E] px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150",
            "hover:bg-[#0A5C3D] disabled:pointer-events-none disabled:opacity-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#043F2E]/40"
          )}
        >
          {loading ? (
            <>
              <span
                className="size-3 animate-spin rounded-full border border-white/30 border-t-white"
                aria-hidden
              />
              Starting...
            </>
          ) : (
            <>
              <Sparkles className="size-3" aria-hidden />
              {ctaLabel}
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Row variant
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Row layout: compact horizontal list row with leading icon chip, title and
 * description, optional category badge, and a trailing launch button.
 * Wrap multiples in AgentActionList for a divided list.
 * Urgency tints the icon chip.
 */
function AgentActionRow({
  title,
  description,
  prompt,
  cta,
  category,
  icon: Icon = Sparkles,
  urgency = "default",
  onTrigger,
  href,
  disabled,
  loading,
  className,
  ...props
}: AgentActionProps) {
  const handleTrigger = makeTrigger({ prompt, href, disabled, loading, onTrigger })
  const ctaLabel = cta ?? title

  return (
    <div
      data-slot="agent-action"
      data-variant="row"
      data-urgency={urgency}
      className={cn(
        "flex items-center gap-3 px-4 py-3",
        disabled && "opacity-60",
        className
      )}
      {...(props as HTMLAttributes<HTMLDivElement>)}
    >
      {/* Leading icon chip */}
      <span
        className={cn(
          "inline-flex size-8 shrink-0 self-start items-center justify-center rounded-sm mt-0.5",
          iconUrgencyClass[urgency]
        )}
      >
        <Icon className="size-4" strokeWidth={1.5} aria-hidden />
      </span>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium text-foreground leading-snug">{title}</p>
          {category && <AgentActionCategoryBadge label={category} />}
        </div>
        {description && (
          <p className="mt-0.5 text-xs leading-relaxed text-ink-muted line-clamp-2">
            {description}
          </p>
        )}
      </div>

      {/* Trailing launch button */}
      <button
        type="button"
        onClick={handleTrigger}
        disabled={disabled || loading}
        aria-busy={loading}
        className={cn(
          "shrink-0 inline-flex items-center gap-1 rounded-xs border border-border bg-white px-2 py-1 text-xs font-medium text-foreground transition-colors duration-150",
          "hover:border-[#043F2E] hover:bg-[#043F2E] hover:text-white disabled:pointer-events-none disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#043F2E]/40"
        )}
      >
        {loading ? (
          <span
            className="size-3 animate-spin rounded-full border border-foreground/30 border-t-foreground"
            aria-hidden
          />
        ) : (
          <>
            <Sparkles className="size-3" aria-hidden />
            {ctaLabel}
          </>
        )}
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Banner variant
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Banner layout: wide, low-height strip designed to sit at the top of a page
 * or section as a priority prompt. Uses a left accent border and urgency
 * tinting to draw the manager's eye without filling too much vertical space.
 * Description is truncated to a single line.
 */
function AgentActionBanner({
  title,
  description,
  prompt,
  cta,
  category,
  icon: Icon = Sparkles,
  urgency = "default",
  onTrigger,
  href,
  disabled,
  loading,
  className,
  ...props
}: AgentActionProps) {
  const handleTrigger = makeTrigger({ prompt, href, disabled, loading, onTrigger })
  const ctaLabel = cta ?? title

  return (
    <div
      data-slot="agent-action"
      data-variant="banner"
      data-urgency={urgency}
      style={{ borderLeftColor: urgencyAccentColor[urgency] }}
      className={cn(
        "flex items-center gap-3 rounded-sm border border-l-[3px] px-4 py-3",
        bannerBgClass[urgency],
        disabled && "opacity-60",
        className
      )}
      {...(props as HTMLAttributes<HTMLDivElement>)}
    >
      {/* Icon chip */}
      <span
        className={cn(
          "shrink-0 inline-flex size-7 items-center justify-center rounded-sm",
          bannerIconUrgencyClass[urgency]
        )}
      >
        <Icon className="size-3.5" strokeWidth={1.5} aria-hidden />
      </span>

      {/* Content: title + description side by side on wide screens */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="text-sm font-semibold text-foreground">{title}</span>
          {description && (
            <span className="truncate text-xs text-ink-muted">{description}</span>
          )}
        </div>
      </div>

      {/* Trailing: category badge + launch button */}
      <div className="flex shrink-0 items-center gap-2">
        {category && <AgentActionCategoryBadge label={category} className="hidden sm:inline-flex" />}
        <button
          type="button"
          onClick={handleTrigger}
          disabled={disabled || loading}
          aria-busy={loading}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-xs bg-[#043F2E] px-3 py-1.5 text-xs font-medium text-white whitespace-nowrap transition-colors duration-150",
            "hover:bg-[#0A5C3D] disabled:pointer-events-none disabled:opacity-50",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#043F2E]/40"
          )}
        >
          {loading ? (
            <span
              className="size-3 animate-spin rounded-full border border-white/30 border-t-white"
              aria-hidden
            />
          ) : (
            <Sparkles className="size-3" aria-hidden />
          )}
          {loading ? "Starting..." : ctaLabel}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline variant
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Inline layout: compact button-like trigger. Sits in toolbars, sidebars,
 * or inline within prose. Carries the full prompt internally.
 * Urgency is reflected in the icon colour.
 */
function AgentActionInline({
  title,
  description: _description,
  prompt,
  cta: _cta,
  category: _category,
  icon: Icon = Sparkles,
  urgency = "default",
  onTrigger,
  href,
  disabled,
  loading,
  className,
  ...props
}: AgentActionProps) {
  const handleTrigger = makeTrigger({ prompt, href, disabled, loading, onTrigger })

  return (
    <button
      type="button"
      data-slot="agent-action"
      data-variant="inline"
      data-urgency={urgency}
      onClick={handleTrigger}
      disabled={disabled || loading}
      aria-busy={loading}
      className={cn(
        "group/inline inline-flex items-center gap-1.5 rounded-sm border border-border bg-white px-2.5 py-1.5 text-sm font-medium text-foreground transition-all duration-150",
        "hover:border-[#043F2E] hover:bg-[#043F2E] hover:text-white",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#043F2E]/40",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {loading ? (
        <span
          className="size-3.5 animate-spin rounded-full border border-current/30 border-t-current"
          aria-hidden
        />
      ) : (
        <Icon
          className={cn(
            "size-3.5 shrink-0 transition-colors duration-150 group-hover/inline:text-white",
            urgency === "danger" && "text-danger",
            urgency === "warning" && "text-warning",
            urgency === "info" && "text-info",
            urgency === "default" && "text-forest"
          )}
          strokeWidth={1.5}
          aria-hidden
        />
      )}
      <span>{title}</span>
      <ChevronRight
        className="size-3.5 shrink-0 text-ink-muted/60 transition-colors duration-150 group-hover/inline:text-white/70"
        aria-hidden
      />
    </button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AgentAction: unified entry point that delegates to the correct variant
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A call-to-action element that launches an AI agent with a stored preset
 * prompt. The `prompt` prop holds the full instruction for the agent and is
 * never rendered to the user; only `title` and `description` are displayed.
 *
 * Use `onTrigger` to open the agent view programmatically, or `href` to
 * navigate to the agent URL. Set `urgency` to `danger` or `warning` to tint
 * the surface and draw the manager's attention to time-sensitive actions.
 */
export function AgentAction({
  variant = "card",
  ...props
}: AgentActionProps) {
  if (variant === "row") return <AgentActionRow {...props} />
  if (variant === "inline") return <AgentActionInline {...props} />
  if (variant === "banner") return <AgentActionBanner {...props} />
  return <AgentActionCard {...props} />
}

// ─────────────────────────────────────────────────────────────────────────────
// AgentActionList: container for multiple row variants
// ─────────────────────────────────────────────────────────────────────────────

export interface AgentActionListProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional section heading above the list. */
  title?: string
}

/**
 * Divided list container for multiple AgentAction row variants. Renders a
 * labelled section heading when `title` is provided.
 */
export function AgentActionList({
  title,
  className,
  children,
  ...props
}: AgentActionListProps) {
  return (
    <div
      data-slot="agent-action-list"
      className={cn(
        "overflow-hidden rounded-sm border border-border bg-white",
        className
      )}
      {...props}
    >
      {title && (
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Sparkles className="size-3.5 text-forest" strokeWidth={1.5} aria-hidden />
          <p className="text-xs font-semibold text-foreground">{title}</p>
        </div>
      )}
      <div className="divide-y divide-border">{children}</div>
    </div>
  )
}
