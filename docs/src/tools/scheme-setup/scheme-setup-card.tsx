"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { SchemeSetupPreview } from "@/tools/scheme-setup/types"
import { Building2Icon, CheckIcon, FileTextIcon, XIcon } from "lucide-react"
import { useCallback, useState } from "react"

export interface SchemeSetupCardProps {
  preview: SchemeSetupPreview & {
    reviewStatus?: "pending" | "approved" | "rejected"
  }
  className?: string
  onApprove?: () => void
  onReject?: () => void
}

/**
 * Scheme registration preview card with approve and reject actions.
 */
export function SchemeSetupCard({
  preview,
  className,
  onApprove,
  onReject,
}: SchemeSetupCardProps) {
  const [decision, setDecision] = useState<"pending" | "approved" | "rejected">(
    preview.reviewStatus ?? "pending"
  )

  const handleApprove = useCallback(() => {
    setDecision("approved")
    onApprove?.()
  }, [onApprove])

  const handleReject = useCallback(() => {
    setDecision("rejected")
    onReject?.()
  }, [onReject])

  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm border border-border bg-[#FAFAF8] shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-[#EEF2E3] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <FileTextIcon className="size-4 shrink-0 text-[#043F2E]" aria-hidden="true" />
          <span className="text-sm font-semibold text-[#043F2E]">Create scheme</span>
        </div>
        {decision === "pending" && (
          <div className="flex shrink-0 items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleReject}>
              <XIcon className="size-3.5" aria-hidden="true" />
              Reject
            </Button>
            <Button type="button" variant="accent" size="sm" onClick={handleApprove}>
              <CheckIcon className="size-3.5" aria-hidden="true" />
              Approve
            </Button>
          </div>
        )}
        {decision === "approved" && (
          <span className="text-xs font-medium text-[#043F2E]">Approved</span>
        )}
        {decision === "rejected" && (
          <span className="text-xs font-medium text-muted-foreground">Rejected</span>
        )}
      </div>

      {/* Identity */}
      <div className="flex gap-4 border-b border-border bg-white px-4 py-4">
        <div className="flex size-14 shrink-0 items-center justify-center rounded-sm bg-[#EEF2E3]">
          <Building2Icon className="size-7 text-[#043F2E]" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h4 className="font-serif text-xl text-[#043F2E]">{preview.name}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="rounded-sm bg-muted px-1.5 py-0.5 text-xs font-medium text-foreground">
              {preview.planNumber}
            </span>
            <span>{preview.location}</span>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 bg-white px-4 py-4 text-sm">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Lots
          </p>
          <p className="mt-0.5 font-medium text-foreground">{preview.lots}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Financial year end
          </p>
          <p className="mt-0.5 font-medium text-foreground">{preview.financialYearEnd}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Manager
          </p>
          <p className="mt-0.5 font-medium text-foreground">{preview.manager}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Registered
          </p>
          <p className="mt-0.5 font-medium text-foreground">{preview.registered}</p>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Status
          </p>
          <span className="mt-0.5 inline-flex rounded-sm bg-[#FFF4E5] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#B45309]">
            {preview.status}
          </span>
        </div>
        {preview.source && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Source
            </p>
            <p className="mt-0.5 font-medium text-foreground">{preview.source}</p>
          </div>
        )}
      </div>
    </div>
  )
}
