"use client"

import { ArrowRight, Bot, CheckCircle2, Sparkles } from "lucide-react"
import type { HTMLAttributes, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────
// Portfolio HUD: compact day-planning strip for managers
//
// Three signals at a glance:
//   1. Attention zero progress (human queue for today)
//   2. Portfolio health (scheme distribution)
//   3. AI queue (overnight work + items awaiting review)
// ─────────────────────────────────────────────────────────

export interface AttentionZeroStats {
  /** Items that need the manager today (excludes waiting-on-others). */
  remaining: number
  /** Items cleared by the manager today. */
  clearedToday: number
  /** Target for end of day, usually remaining + cleared at start. */
  dayTotal: number
}

export interface PortfolioHealthStats {
  good: number
  warning: number
  critical: number
}

export interface AiQueueStats {
  /** Items AI finished overnight, no manager action needed yet. */
  completedOvernight: number
  /** Drafts and decisions ready for manager review. */
  readyForReview: number
  /** Items AI is handling autonomously right now. */
  running: number
  /** Rough time to clear the review queue. */
  estimatedReviewMinutes?: number
}

export interface AiBriefingProps extends HTMLAttributes<HTMLDivElement> {
  /** One-line summary of what AI handled overnight. */
  summary: string
  /** Optional bullet highlights. */
  highlights?: string[]
  readyForReview: number
  estimatedReviewMinutes?: number
  onReview?: () => void
  reviewHref?: string
}

export interface PortfolioHudProps extends HTMLAttributes<HTMLDivElement> {
  attention: AttentionZeroStats
  portfolio: PortfolioHealthStats
  ai: AiQueueStats
}

/**
 * Segmented progress bar for proportional counts.
 */
function SegmentedBar({
  segments,
  className,
}: {
  segments: { value: number; className: string }[]
  className?: string
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  if (total === 0) return null

  return (
    <div
      className={cn(
        "flex h-2 w-full overflow-hidden rounded-xs bg-off-white",
        className
      )}
      role="img"
      aria-hidden
    >
      {segments.map((segment, index) =>
        segment.value > 0 ? (
          <div
            key={index}
            className={cn("h-full transition-all duration-300", segment.className)}
            style={{ width: `${(segment.value / total) * 100}%` }}
          />
        ) : null
      )}
    </div>
  )
}

/**
 * Single HUD cell: label, value, optional progress, caption.
 */
function HudCell({
  label,
  value,
  caption,
  children,
  className,
}: {
  label: string
  value: ReactNode
  caption?: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={cn("min-w-0 flex-1 px-4 py-3.5 first:pl-5 last:pr-5", className)}>
      <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
        {value}
      </p>
      {children}
      {caption && (
        <p className="mt-1.5 text-xs text-ink-muted">{caption}</p>
      )}
    </div>
  )
}

/**
 * Morning AI briefing band: what the assistant handled overnight and
 * what still needs a human gate.
 */
export function AiBriefing({
  summary,
  highlights = [],
  readyForReview,
  estimatedReviewMinutes,
  onReview,
  reviewHref = "#",
  className,
  ...props
}: AiBriefingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-sm border border-lime/40 bg-lime-soft px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
        className
      )}
      {...props}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-forest" aria-hidden />
          <p className="text-[10px] font-semibold uppercase tracking-widest text-forest/70">
            AI morning brief
          </p>
        </div>
        <p className="mt-1.5 text-sm font-medium text-foreground">{summary}</p>
        {highlights.length > 0 && (
          <ul className="mt-2 space-y-0.5 text-xs text-ink-muted">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-1.5">
                <CheckCircle2
                  className="mt-0.5 size-3 shrink-0 text-forest/60"
                  aria-hidden
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
        <p className="text-xs text-ink-muted">
          <span className="font-semibold text-foreground">{readyForReview}</span>{" "}
          ready for your review
          {estimatedReviewMinutes !== undefined && (
            <> · ~{estimatedReviewMinutes} min</>
          )}
        </p>
        <Button
          size="sm"
          className="gap-1.5"
          nativeButton={false}
          render={<a href={reviewHref} />}
          onClick={onReview}
        >
          Review AI work
          <ArrowRight className="size-3.5" aria-hidden />
        </Button>
      </div>
    </div>
  )
}

/**
 * Compact three-panel HUD: attention zero, portfolio health, AI queue.
 */
export function PortfolioHud({
  attention,
  portfolio,
  ai,
  className,
  ...props
}: PortfolioHudProps) {
  const portfolioTotal =
    portfolio.good + portfolio.warning + portfolio.critical
  const attentionDone = attention.dayTotal - attention.remaining
  const attentionProgress =
    attention.dayTotal > 0
      ? Math.round((attentionDone / attention.dayTotal) * 100)
      : 100

  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
      {...props}
    >
      <div className="flex flex-col divide-y divide-border lg:flex-row lg:divide-x lg:divide-y-0">
        {/* Attention zero: human queue for today */}
        <HudCell
          label="Your day"
          value={
            attention.remaining === 0 ? (
              <span className="text-forest">Inbox clear</span>
            ) : (
              <>
                {attention.remaining}{" "}
                <span className="text-base font-medium text-ink-muted">
                  to clear
                </span>
              </>
            )
          }
          caption={
            attention.remaining === 0
              ? `${attention.clearedToday} cleared today · waiting on others excluded`
              : `${attention.clearedToday} cleared · ${attention.remaining} left · goal: zero by end of day`
          }
        >
          <div className="mt-2.5 space-y-1">
            <SegmentedBar
              segments={[
                { value: attentionDone, className: "bg-forest" },
                { value: attention.remaining, className: "bg-off-white" },
              ]}
            />
            <p className="text-[10px] text-ink-muted">{attentionProgress}% of today&apos;s queue</p>
          </div>
        </HudCell>

        {/* Portfolio health: scheme distribution */}
        <HudCell
          label="Portfolio health"
          value={
            portfolio.critical > 0 ? (
              <>
                {portfolio.critical}{" "}
                <span className="text-base font-medium text-danger">at risk</span>
              </>
            ) : portfolio.warning > 0 ? (
              <>
                {portfolio.warning}{" "}
                <span className="text-base font-medium text-warning">to watch</span>
              </>
            ) : (
              <span className="text-forest">All healthy</span>
            )
          }
          caption={`${portfolioTotal} schemes · ${portfolio.good} healthy`}
        >
          <div className="mt-2.5 space-y-1">
            <SegmentedBar
              segments={[
                { value: portfolio.good, className: "bg-lime" },
                { value: portfolio.warning, className: "bg-warning" },
                { value: portfolio.critical, className: "bg-danger" },
              ]}
            />
            <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-ink-muted">
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-lime" aria-hidden />
                {portfolio.good} healthy
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-warning" aria-hidden />
                {portfolio.warning} watch
              </span>
              <span className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-danger" aria-hidden />
                {portfolio.critical} at risk
              </span>
            </div>
          </div>
        </HudCell>

        {/* AI queue: autonomous work + human gates */}
        <HudCell
          label="AI queue"
          value={
            <>
              {ai.readyForReview}{" "}
              <span className="text-base font-medium text-ink-muted">
                need you
              </span>
            </>
          }
          caption={`${ai.completedOvernight} done overnight · ${ai.running} running now`}
        >
          <div className="mt-2.5 flex items-center gap-2 text-xs text-ink-muted">
            <Bot className="size-3.5 shrink-0 text-forest/70" aria-hidden />
            <span>
              AI handles routine work; you review drafts and exceptions
            </span>
          </div>
        </HudCell>
      </div>
    </div>
  )
}
