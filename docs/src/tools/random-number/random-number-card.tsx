"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { RandomNumberResult } from "@/tools/random-number/types"
import { DicesIcon, XIcon } from "lucide-react"

export interface RandomNumberCardProps {
  min: number
  max: number
  state:
    | "input-streaming"
    | "input-available"
    | "approval-requested"
    | "approval-responded"
    | "output-available"
    | "output-error"
    | "output-denied"
  output?: RandomNumberResult
  errorText?: string
  className?: string
  onApprove?: () => void
  onDeny?: () => void
}

/**
 * Approval card and result display for the random number tool.
 */
export function RandomNumberCard({
  min,
  max,
  state,
  output,
  errorText,
  className,
  onApprove,
  onDeny,
}: RandomNumberCardProps) {
  const resolvedMin = output?.min ?? min
  const resolvedMax = output?.max ?? max

  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-[#EEF2E3] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <DicesIcon className="size-4 shrink-0 text-[#043F2E]" aria-hidden="true" />
          <span className="text-sm font-semibold text-[#043F2E]">Random number</span>
          <span className="rounded-sm bg-white/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            {state === "output-available"
              ? "Complete"
              : state === "output-denied"
                ? "Denied"
                : state === "approval-requested"
                  ? "Approval required"
                  : "Pending"}
          </span>
        </div>
        {state === "approval-requested" && (
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onDeny}>
              <XIcon className="size-3.5" aria-hidden="true" />
              Deny
            </Button>
            <Button type="button" variant="accent" size="sm" onClick={onApprove}>
              Approve
            </Button>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="space-y-3 px-4 py-4 text-sm">
        <p className="text-muted-foreground">
          Generate a random integer between{" "}
          <span className="font-medium text-foreground">{resolvedMin}</span> and{" "}
          <span className="font-medium text-foreground">{resolvedMax}</span>.
        </p>

        {state === "approval-requested" && (
          <p className="text-foreground">
            Approve to run this tool, or deny to cancel.
          </p>
        )}

        {(state === "input-streaming" || state === "input-available") && (
          <p className="text-muted-foreground">Waiting for approval…</p>
        )}

        {state === "output-denied" && (
          <p className="text-muted-foreground">Tool execution was denied.</p>
        )}

        {state === "output-error" && (
          <p className="text-destructive">{errorText ?? "The tool failed to run."}</p>
        )}

        {state === "output-available" && output && (
          <div className="rounded-sm border border-border bg-[#FAFAF8] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Result
            </p>
            <p className="mt-1 font-serif text-3xl text-[#043F2E]">{output.value}</p>
          </div>
        )}
      </div>
    </div>
  )
}
