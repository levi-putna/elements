"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import type { AuthEmailTemplate } from "@/lib/auth-email-templates"

type TemplateFormat = "html" | "plain" | "subject"

const KIND_LABELS = {
  action: "Action required",
  notification: "Notification",
} as const

interface EmailTemplateCardProps {
  template: AuthEmailTemplate
}

/**
 * Documentation card for a single Supabase auth email template: subject, body, and variables.
 */
export function EmailTemplateCard({ template }: EmailTemplateCardProps) {
  const [format, setFormat] = useState<TemplateFormat>("html")
  const [copied, setCopied] = useState(false)

  const content =
    format === "subject"
      ? template.subject
      : format === "plain"
        ? template.plainText
        : template.html

  /** Copy the active template content to the clipboard. */
  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article
      id={template.id}
      className="rounded-sm border border-border overflow-hidden scroll-mt-24"
    >
      {/* Header */}
      <div className="border-b border-border bg-off-white px-5 py-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-display text-xl text-foreground">{template.name}</h3>
              <span
                className={cn(
                  "rounded-sm px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide leading-none",
                  template.kind === "action"
                    ? "bg-forest text-white"
                    : "bg-lime-soft text-forest ring-1 ring-border"
                )}
              >
                {KIND_LABELS[template.kind]}
              </span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed max-w-2xl">
              {template.trigger}
            </p>
            <p className="mt-2 text-xs text-ink-muted">
              Paste in{" "}
              <span className="font-medium text-foreground">{template.dashboardPath}</span>
            </p>
          </div>
          <code className="shrink-0 rounded-sm bg-secondary px-2 py-1 text-[11px] font-mono text-ink-muted">
            {template.supabaseKey}
          </code>
        </div>
      </div>

      {/* Format tabs */}
      <div className="flex items-center gap-1 border-b border-border px-5 py-2 bg-background">
        {(
          [
            ["subject", "Subject"],
            ["html", "HTML body"],
            ["plain", "Plain text"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            onClick={() => setFormat(value)}
            className={cn(
              "rounded-sm px-2.5 py-1 text-xs font-medium transition-colors",
              format === value
                ? "bg-forest text-white"
                : "text-ink-muted hover:text-foreground hover:bg-secondary"
            )}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleCopy}
          className="ml-auto text-xs text-ink-muted hover:text-foreground transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Content preview */}
      <div className="px-5 py-5 bg-background">
        {format === "html" ? (
          <div className="rounded-sm overflow-hidden border border-border bg-off-white p-4">
            <div
              className="mx-auto max-w-[560px] overflow-hidden rounded-sm"
              dangerouslySetInnerHTML={{ __html: template.html }}
            />
          </div>
        ) : (
          <pre className="overflow-x-auto whitespace-pre-wrap rounded-sm border border-border bg-forest p-4 text-sm font-mono leading-relaxed text-white/85">
            {content}
          </pre>
        )}
      </div>

      {/* Variables */}
      <div className="border-t border-border px-5 py-3 bg-secondary/40">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Variables
        </p>
        <div className="flex flex-wrap gap-1.5">
          {template.variables.map((variable) => (
            <code
              key={variable}
              className="rounded-sm bg-background px-1.5 py-0.5 text-[11px] font-mono text-foreground ring-1 ring-border"
            >
              {"{{ ."}
              {variable}
              {" }}"}
            </code>
          ))}
        </div>
      </div>
    </article>
  )
}
