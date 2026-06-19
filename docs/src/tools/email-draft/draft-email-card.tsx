"use client"

import { Button } from "@/components/ui/button"
import { Shimmer } from "@/components/ui/shimmer"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import type { EmailAttachment, EmailDraft } from "@/tools/email-draft/types"
import {
  CheckIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  MailIcon,
  SendIcon,
} from "lucide-react"
import { useCallback, useState } from "react"

export interface DraftEmailCardProps {
  draft: EmailDraft & { status?: "ready" | "sent" }
  className?: string
  /** Called when the manager clicks Send in the header. */
  onSend?: () => void
}

export interface DraftEmailCardLoadingProps {
  className?: string
  /** Status line shown beside the title. */
  message?: string
  /** When true, shows the mail icon instead of a spinner (for example on error). */
  error?: boolean
}

/**
 * Returns the icon component for an attachment type.
 */
function AttachmentIcon({ type }: { type: EmailAttachment["type"] }) {
  if (type === "xlsx") {
    return <FileSpreadsheetIcon className="size-4 shrink-0 text-muted-foreground" />
  }
  return <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
}

/**
 * Header-style loading state while the email draft tool runs.
 */
export function DraftEmailCardLoading({
  className,
  message = "Drafting email…",
  error = false,
}: DraftEmailCardLoadingProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {/* Header: spinner and status */}
      <div className="flex items-center gap-2 bg-[#EEF2E3] px-3 py-2">
        {error ? (
          <MailIcon className="size-4 shrink-0 text-[#043F2E]" aria-hidden="true" />
        ) : (
          <Spinner className="size-4 shrink-0 text-[#043F2E]" />
        )}
        <span className="text-sm font-semibold text-[#043F2E]">Draft email</span>
        {error ? (
          <span className="truncate text-sm text-destructive">{message}</span>
        ) : (
          <Shimmer className="min-w-0 truncate text-sm font-normal">{message}</Shimmer>
        )}
      </div>
    </div>
  )
}

/**
 * Interactive email draft preview with Send action in the header.
 */
export function DraftEmailCard({ draft, className, onSend }: DraftEmailCardProps) {
  const [sent, setSent] = useState(draft.status === "sent")

  const handleSend = useCallback(() => {
    setSent(true)
    onSend?.()
  }, [onSend])

  const attachments = draft.attachments ?? []

  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      {/* Header: title, status, send action */}
      <div className="flex items-center justify-between gap-2 bg-[#EEF2E3] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <MailIcon className="size-4 shrink-0 text-[#043F2E]" aria-hidden="true" />
          <span className="text-sm font-semibold text-[#043F2E]">Draft email</span>
          <span
            className={cn(
              "rounded-sm px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide",
              sent
                ? "bg-muted text-muted-foreground"
                : "bg-white/80 text-muted-foreground"
            )}
          >
            {sent ? "Sent" : "Ready to send"}
          </span>
        </div>
        {!sent ? (
          <Button
            type="button"
            variant="accent"
            size="sm"
            onClick={handleSend}
            className="h-7 shrink-0 px-2"
          >
            <SendIcon className="size-3.5" aria-hidden="true" />
            Send
          </Button>
        ) : (
          <span className="inline-flex h-7 shrink-0 items-center gap-1.5 px-2 text-xs font-medium text-[#043F2E]">
            <CheckIcon className="size-3.5" aria-hidden="true" />
            Sent
          </span>
        )}
      </div>

      {/* Metadata, body, and attachments: collapsed after send */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-200 ease-out",
          sent ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
        )}
      >
        <div className="overflow-hidden">
          {/* Metadata: to, from, subject */}
          <div className="divide-y divide-border border-b border-border text-sm">
            <div className="grid grid-cols-[4rem_1fr] gap-2 px-3 py-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                To
              </span>
              <span className="text-foreground">{draft.to}</span>
            </div>
            <div className="grid grid-cols-[4rem_1fr] gap-2 px-3 py-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                From
              </span>
              <span className="text-foreground">{draft.from}</span>
            </div>
            <div className="grid grid-cols-[4rem_1fr] gap-2 px-3 py-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Subject
              </span>
              <span className="font-medium text-foreground">{draft.subject}</span>
            </div>
          </div>

          {/* Body */}
          <div className="whitespace-pre-wrap px-3 py-3 text-sm leading-relaxed text-foreground">
            {draft.body}
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="border-t border-border bg-[#FAFAF8] px-3 py-2">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                {attachments.length} {attachments.length === 1 ? "attachment" : "attachments"}
              </p>
              <div className="flex flex-col gap-1.5">
                {attachments.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-2 rounded-sm border border-border bg-white px-2.5 py-1.5"
                  >
                    <AttachmentIcon type={file.type} />
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {file.name}
                    </span>
                    <span className="shrink-0 text-xs text-muted-foreground">{file.size}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
