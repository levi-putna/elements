"use client"

import * as React from "react"
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Circle,
  CircleDot,
  PartyPopper,
  Rocket,
  X,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

// ─────────────────────────────────────────────────────────
// SidebarOnboarding: a low-key setup checklist for the sidebar
//
// Sits in the SidebarFooter slot, above the user menu. Collapsed it
// shows a single progress summary row (ring + "N of M"); expanded it
// reveals the task list with per-step status and a link to action each
// step. When the whole sidebar collapses to icons it shrinks to a
// single progress ring with a tooltip, so it never crowds the nav.
//
// Theme-aware: it leans entirely on the --sidebar-* tokens, so it reads
// correctly on both the light docs sidebar and the forest app sidebar.
// ─────────────────────────────────────────────────────────

export type OnboardingStepStatus = "complete" | "current" | "todo"

export interface OnboardingStep {
  /** Short, action-oriented label, e.g. "Add your first scheme". */
  title: string
  /** Where the step is actioned. */
  href: string
  /** Progress state. `current` highlights the next actionable step. */
  status: OnboardingStepStatus
}

export interface SidebarOnboardingProps {
  /** The setup steps, in the order they should be completed. */
  steps: OnboardingStep[]
  /** Heading shown on the summary row. */
  title?: string
  /** Whether the task list starts expanded. Defaults to collapsed. */
  defaultOpen?: boolean
  /** Called when the user dismisses the widget (hide the dismiss X if omitted). */
  onDismiss?: () => void
  className?: string
}

// ─────────────────────────────────────────────────────────
// ProgressRing: a tiny circular progress indicator
//
// Uses the sidebar primary token for the filled arc and the current
// text colour (dimmed) for the track, so it tints with the theme.
// ─────────────────────────────────────────────────────────

function ProgressRing({
  value,
  size = 26,
  className,
}: {
  value: number
  size?: number
  className?: string
}) {
  const stroke = 2.5
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - Math.min(Math.max(value, 0), 1))

  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden
      >
        {/* Track: dimmed current colour */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-current opacity-20"
        />
        {/* Fill: sidebar primary accent */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ stroke: "var(--sidebar-primary)" }}
          className="transition-[stroke-dashoffset] duration-500 ease-out"
        />
      </svg>
    </span>
  )
}

// ─────────────────────────────────────────────────────────
// Per-status leading icon for a step row.
// ─────────────────────────────────────────────────────────

function StepIcon({ status }: { status: OnboardingStepStatus }) {
  if (status === "complete") {
    return (
      <CheckCircle2
        className="size-4 shrink-0"
        style={{ color: "var(--sidebar-primary)" }}
        aria-hidden
      />
    )
  }

  if (status === "current") {
    return (
      <CircleDot
        className="size-4 shrink-0"
        style={{ color: "var(--sidebar-primary)" }}
        aria-hidden
      />
    )
  }

  return (
    <Circle className="size-4 shrink-0 text-sidebar-foreground/30" aria-hidden />
  )
}

/**
 * A collapsible onboarding checklist designed to live in the
 * {@link SidebarFooter}, above the account menu.
 */
export function SidebarOnboarding({
  steps,
  title = "Finish setup",
  defaultOpen = false,
  onDismiss,
  className,
}: SidebarOnboardingProps) {
  const { state, isMobile, toggleSidebar } = useSidebar()
  const collapsed = state === "collapsed" && !isMobile
  const [open, setOpen] = React.useState(defaultOpen)

  // Derive progress from the supplied steps.
  const total = steps.length
  const completed = steps.filter((step) => step.status === "complete").length
  const ratio = total > 0 ? completed / total : 0
  const allDone = total > 0 && completed === total

  // Once everything is done, fall back to a quiet "all set" state.
  if (allDone) {
    if (collapsed) {
      return null
    }
    return (
      <div className={cn("px-2 pb-1", className)}>
        <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar-accent/40 px-2.5 py-2">
          <PartyPopper
            className="size-4 shrink-0"
            style={{ color: "var(--sidebar-primary)" }}
            aria-hidden
          />
          <p className="min-w-0 flex-1 truncate text-xs font-medium text-sidebar-foreground">
            You&rsquo;re all set up
          </p>
          {onDismiss && (
            <button
              type="button"
              onClick={onDismiss}
              className="rounded-sm p-0.5 text-sidebar-foreground/50 transition-colors hover:text-sidebar-foreground"
              aria-label="Dismiss setup"
            >
              <X className="size-3.5" aria-hidden />
            </button>
          )}
        </div>
      </div>
    )
  }

  // Icon-only sidebar: shrink to a single ring that re-expands the sidebar.
  if (collapsed) {
    return (
      <div className={cn("px-2 pb-1", className)}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip={`${title}: ${completed} of ${total}`}
              className="justify-center"
              onClick={() => {
                setOpen(true)
                toggleSidebar()
              }}
            >
              <ProgressRing value={ratio} size={20} />
              <span className="sr-only">{`${title}: ${completed} of ${total} complete`}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    )
  }

  // Expanded sidebar: full summary row with an optional task list.
  return (
    <div className={cn("px-2 pb-1", className)}>
      <div className="overflow-hidden rounded-md border border-sidebar-border bg-sidebar-accent/40">
        {/* Summary row: doubles as the expand/collapse trigger */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center gap-2.5 p-2.5 text-left transition-colors hover:bg-sidebar-accent/60"
        >
          {/* Progress ring with the setup icon nested in the middle */}
          <span className="relative inline-flex items-center justify-center">
            <ProgressRing value={ratio} />
            <Rocket
              className="absolute size-3"
              style={{ color: "var(--sidebar-primary)" }}
              aria-hidden
            />
          </span>

          {/* Title + progress count */}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-xs font-semibold text-sidebar-foreground">
              {title}
            </span>
            <span className="block text-[11px] text-sidebar-foreground/60">
              {completed} of {total} complete
            </span>
          </span>

          {/* Expand affordance */}
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-sidebar-foreground/50 transition-transform duration-200",
              open && "rotate-180"
            )}
            aria-hidden
          />
        </button>

        {/* Task list: revealed when expanded */}
        {open && (
          <div className="border-t border-sidebar-border/60 p-1">
            {steps.map((step) => {
              const isComplete = step.status === "complete"
              return (
                <a
                  key={step.title}
                  href={step.href}
                  className={cn(
                    "group flex items-center gap-2 rounded-sm px-1.5 py-1.5 no-underline transition-colors hover:bg-sidebar-accent"
                  )}
                >
                  <StepIcon status={step.status} />
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-xs",
                      isComplete && "text-sidebar-foreground/45 line-through",
                      step.status === "current" &&
                        "font-medium text-sidebar-foreground",
                      step.status === "todo" && "text-sidebar-foreground/80"
                    )}
                  >
                    {step.title}
                  </span>
                  {!isComplete && (
                    <ArrowRight
                      className="size-3.5 shrink-0 text-sidebar-foreground/40 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  )}
                </a>
              )
            })}

            {/* Optional dismiss action for users who want it gone */}
            {onDismiss && (
              <button
                type="button"
                onClick={onDismiss}
                className="mt-0.5 w-full rounded-sm px-1.5 py-1.5 text-left text-[11px] text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                Dismiss
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
