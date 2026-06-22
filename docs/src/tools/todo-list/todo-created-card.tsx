"use client"

import { cn } from "@/lib/utils"
import type { CreateTodoListResult } from "@/tools/todo-list/types"
import { countTodoProgress } from "@/lib/conversation-todos"
import { ListChecksIcon } from "lucide-react"

export interface TodoCreatedCardProps {
  plan: CreateTodoListResult
  className?: string
}

/**
 * In-chat notice when Cowork creates a conversation todo list.
 */
export function TodoCreatedCard({ plan, className }: TodoCreatedCardProps) {
  const { complete, total } = countTodoProgress({ items: plan.items })
  const inProgress = plan.items.filter((item) => item.status === "in_progress").length

  return (
    <div
      className={cn(
        "flex w-full items-start gap-3 rounded-sm border border-border bg-[#EEF2E3]/60 px-3 py-2.5",
        className
      )}
      role="status"
      aria-live="polite"
    >
      {/* Icon */}
      <div
        className="flex size-7 shrink-0 items-center justify-center rounded-sm bg-[#043F2E] text-[#C8F169]"
        aria-hidden="true"
      >
        <ListChecksIcon className="size-3.5" />
      </div>

      {/* Copy */}
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium text-[#043F2E]">Plan created</p>
        <p className="text-sm text-foreground">{plan.title}</p>
        <p className="text-xs text-muted-foreground">
          {total} {total === 1 ? "step" : "steps"}
          {complete > 0 ? ` · ${complete} complete` : ""}
          {inProgress > 0 ? ` · ${inProgress} in progress` : ""}
          {" · "}
          Track progress in the plan bar above
        </p>
      </div>
    </div>
  )
}
