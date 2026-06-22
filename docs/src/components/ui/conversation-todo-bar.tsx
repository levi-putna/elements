"use client"

import { cn } from "@/lib/utils"
import { countTodoProgress } from "@/lib/conversation-todos"
import type { ConversationTodoList, TodoItemStatus } from "@/tools/todo-list/types"
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleIcon,
  LoaderCircleIcon,
} from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"

export interface ConversationTodoBarProps {
  /** All todo lists in the session, oldest first. */
  lists: ConversationTodoList[]
  /** Compact layout for thin sidebar panels. */
  thin?: boolean
  className?: string
}

/**
 * Status indicator for a single todo item row.
 */
function TodoStatusIndicator({
  status,
  thin = false,
}: {
  status: TodoItemStatus
  thin?: boolean
}) {
  const size = thin ? "size-3.5" : "size-4"

  if (status === "complete") {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-sm bg-[#043F2E] text-[#C8F169]",
          thin ? "size-4" : "size-[18px]"
        )}
        aria-hidden="true"
      >
        <CheckIcon className={size} strokeWidth={2.5} />
      </span>
    )
  }

  if (status === "in_progress") {
    return (
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-sm border-2 border-[#043F2E] bg-white text-[#043F2E]",
          thin ? "size-4" : "size-[18px]"
        )}
        aria-hidden="true"
      >
        <LoaderCircleIcon className={cn(size, "animate-spin")} strokeWidth={2.5} />
      </span>
    )
  }

  return (
    <CircleIcon
      className={cn("shrink-0 text-muted-foreground/50", thin ? "size-4" : "size-[18px]")}
      strokeWidth={1.75}
      aria-hidden="true"
    />
  )
}

const STATUS_LABELS: Record<TodoItemStatus, string> = {
  complete: "Complete",
  in_progress: "In progress",
  pending: "Pending",
}

/**
 * Collapsible plan bar shown above the conversation when todo lists exist.
 * Shows the latest plan by default; older plans are reachable via history controls.
 */
export function ConversationTodoBar({
  lists,
  thin = false,
  className,
}: ConversationTodoBarProps) {
  const [expanded, setExpanded] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const latestIndex = lists.length - 1

  /** Jump to the newest plan when one is added. */
  useEffect(() => {
    setSelectedIndex(latestIndex)
    setExpanded(true)
  }, [latestIndex, lists.at(-1)?.id])

  const activeList = lists[selectedIndex]

  const progress = useMemo(
    () => (activeList ? countTodoProgress({ items: activeList.items }) : { complete: 0, total: 0 }),
    [activeList]
  )

  const toggleExpanded = useCallback(() => {
    setExpanded((value) => !value)
  }, [])

  const showPrevious = useCallback(() => {
    setSelectedIndex((index) => Math.max(0, index - 1))
  }, [])

  const showNext = useCallback(() => {
    setSelectedIndex((index) => Math.min(latestIndex, index + 1))
  }, [latestIndex])

  if (!activeList) {
    return null
  }

  const hasHistory = lists.length > 1
  const progressLabel = `${progress.complete} of ${progress.total}`

  return (
    <div
      className={cn(
        "shrink-0 border-b border-border bg-white",
        className
      )}
    >
      {/* Header: always visible, acts as collapse trigger */}
      <button
        type="button"
        onClick={toggleExpanded}
        aria-expanded={expanded}
        className={cn(
          "flex w-full items-center gap-2 text-left transition-colors hover:bg-muted/40",
          thin ? "px-3 py-2" : "px-4 py-2.5"
        )}
      >
        <ChevronDownIcon
          className={cn(
            "size-4 shrink-0 text-muted-foreground transition-transform",
            !expanded && "-rotate-90"
          )}
          aria-hidden="true"
        />

        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span
            className={cn(
              "truncate font-medium text-foreground",
              thin ? "text-xs" : "text-sm"
            )}
          >
            {activeList.title}
          </span>
          {hasHistory && !expanded ? (
            <span className="shrink-0 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Plan {selectedIndex + 1}/{lists.length}
            </span>
          ) : null}
        </div>

        {/* Collapsed progress summary */}
        <span
          className={cn(
            "shrink-0 tabular-nums text-muted-foreground",
            thin ? "text-[11px]" : "text-xs"
          )}
        >
          {progressLabel}
        </span>
      </button>

      {/* Expanded body */}
      {expanded ? (
        <div className={cn("border-t border-border/60", thin ? "px-3 pb-2.5 pt-2" : "px-4 pb-3 pt-2.5")}>
          {/* Progress bar */}
          <div className="mb-2.5 flex items-center gap-2">
            <div
              className="h-1 min-w-0 flex-1 overflow-hidden rounded-sm bg-muted"
              role="progressbar"
              aria-valuenow={progress.complete}
              aria-valuemin={0}
              aria-valuemax={progress.total}
              aria-label={`${progress.complete} of ${progress.total} steps complete`}
            >
              <div
                className="h-full rounded-sm bg-[#043F2E] transition-[width] duration-300"
                style={{
                  width: progress.total > 0 ? `${(progress.complete / progress.total) * 100}%` : "0%",
                }}
              />
            </div>
            <span className={cn("shrink-0 tabular-nums text-muted-foreground", thin ? "text-[10px]" : "text-xs")}>
              {progressLabel} complete
            </span>
          </div>

          {/* Item list */}
          <ul className={cn("space-y-1", thin && "space-y-0.5")} aria-label={`Steps for ${activeList.title}`}>
            {activeList.items.map((item) => (
              <li
                key={item.id}
                className={cn(
                  "flex items-start gap-2 rounded-sm px-1 py-0.5",
                  item.status === "in_progress" && "bg-[#EEF2E3]/70"
                )}
              >
                <TodoStatusIndicator status={item.status} thin={thin} />
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block leading-snug",
                      thin ? "text-xs" : "text-sm",
                      item.status === "complete" && "text-muted-foreground line-through",
                      item.status === "in_progress" && "font-medium text-foreground",
                      item.status === "pending" && "text-foreground"
                    )}
                  >
                    {item.label}
                  </span>
                  <span className="sr-only">{STATUS_LABELS[item.status]}</span>
                </span>
              </li>
            ))}
          </ul>

          {/* Historical plan navigation */}
          {hasHistory ? (
            <div
              className={cn(
                "mt-2.5 flex items-center justify-between gap-2 border-t border-border/60 pt-2",
                thin && "mt-2 pt-1.5"
              )}
            >
              <p className={cn("text-muted-foreground", thin ? "text-[10px]" : "text-xs")}>
                Plan {selectedIndex + 1} of {lists.length}
                {selectedIndex < latestIndex ? " · earlier plan" : " · current plan"}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={showPrevious}
                  disabled={selectedIndex === 0}
                  aria-label="Previous plan"
                  className="inline-flex size-6 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronLeftIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  disabled={selectedIndex === latestIndex}
                  aria-label="Next plan"
                  className="inline-flex size-6 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                >
                  <ChevronRightIcon className="size-3.5" />
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
