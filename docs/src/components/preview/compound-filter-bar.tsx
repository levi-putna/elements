"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Columns3,
  Plus,
  X,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface CompoundFilterOption {
  value: string
  label: string
  tone?: "success" | "warning" | "danger" | "info" | "neutral"
}

export interface CompoundFilterFieldConfig {
  field: string
  label: string
  options: CompoundFilterOption[]
}

export interface CompoundFilterCondition {
  id: string
  field: string
  value: string
}

/**
 * Maps filter option tone to Badge variant for condition chips.
 */
export function compoundOptionVariant(
  tone?: CompoundFilterOption["tone"]
): React.ComponentProps<typeof Badge>["variant"] {
  if (tone === "success") {
    return "accent"
  }

  if (tone === "warning") {
    return "warning"
  }

  if (tone === "danger") {
    return "destructive"
  }

  if (tone === "info") {
    return "info"
  }

  return "secondary"
}

/** "+ Filter" button: opens a dropdown to pick a filterable field. */
export function AddFilterButton({
  fields,
  activeFields,
  onAdd,
}: {
  fields: CompoundFilterFieldConfig[]
  activeFields: string[]
  onAdd: ({ field }: { field: string }) => void
}) {
  const [open, setOpen] = React.useState(false)
  const available = fields.filter((field) => !activeFields.includes(field.field))

  return (
    <div className="relative">
      <button
        type="button"
        disabled={available.length === 0}
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-white px-2.5 text-xs font-medium text-ink-muted transition-colors hover:bg-off-white hover:text-foreground disabled:opacity-40"
      >
        <Plus className="size-3.5" aria-hidden />
        Filter
      </button>
      {open && available.length > 0 ? (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 min-w-[140px] overflow-hidden rounded-sm border border-border bg-white py-1 shadow-md">
            {available.map((field) => (
              <button
                key={field.field}
                type="button"
                onClick={() => {
                  onAdd({ field: field.field })
                  setOpen(false)
                }}
                className="w-full px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-off-white"
              >
                {field.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

/** Active filter condition chip: "Field is [Value] x". */
export function FilterConditionChip({
  condition,
  fieldConfig,
  onValueChange,
  onRemove,
}: {
  condition: CompoundFilterCondition
  fieldConfig: CompoundFilterFieldConfig
  onValueChange: ({ value }: { value: string }) => void
  onRemove: () => void
}) {
  const [valueOpen, setValueOpen] = React.useState(!condition.value)
  const selectedOption = fieldConfig.options.find((option) => option.value === condition.value)

  return (
    <div className="relative flex items-center gap-1.5 rounded-sm border border-border bg-white py-1 pl-2.5 pr-1">
      <div className="size-2.5 shrink-0 rounded-full border border-ink-muted/40" />
      <span className="shrink-0 text-xs text-ink-muted">
        {fieldConfig.label} <span className="text-foreground/50">is</span>
      </span>
      <button
        type="button"
        onClick={() => setValueOpen((isOpen) => !isOpen)}
        className="flex items-center gap-1 rounded-xs bg-off-white px-2 py-0.5 text-xs font-medium transition-colors hover:bg-border"
      >
        {selectedOption ? (
          <Badge variant={compoundOptionVariant(selectedOption.tone)} size="sm">
            {selectedOption.label}
          </Badge>
        ) : (
          <span className="text-ink-muted/70">Select...</span>
        )}
        <ChevronDown className="size-3 shrink-0 text-ink-muted" aria-hidden />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${fieldConfig.label} filter`}
        className="ml-0.5 flex size-5 items-center justify-center rounded-xs text-ink-muted transition-colors hover:bg-off-white hover:text-foreground"
      >
        <X className="size-3" aria-hidden />
      </button>
      {valueOpen ? (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setValueOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-sm border border-border bg-white py-1 shadow-md">
            {fieldConfig.options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onValueChange({ value: option.value })
                  setValueOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-off-white",
                  condition.value === option.value && "bg-off-white"
                )}
              >
                <Badge variant={compoundOptionVariant(option.tone)} size="sm">
                  {option.label}
                </Badge>
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

/** Sort button: shows current field and direction, opens a dropdown. */
export function CompoundSortButton({
  sortField,
  sortDir,
  fields,
  onSort,
}: {
  sortField: string
  sortDir: "asc" | "desc"
  fields: { field: string; label: string }[]
  onSort: ({ field, dir }: { field: string; dir: "asc" | "desc" }) => void
}) {
  const [open, setOpen] = React.useState(false)
  const activeLabel = fields.find((field) => field.field === sortField)?.label

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-white px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-off-white"
      >
        {sortField ? (
          <>
            {sortDir === "asc" ? (
              <ArrowUp className="size-3.5 shrink-0" aria-hidden />
            ) : (
              <ArrowDown className="size-3.5 shrink-0" aria-hidden />
            )}
            {activeLabel}
          </>
        ) : (
          <>
            <ArrowUpDown className="size-3.5 shrink-0 text-ink-muted" aria-hidden />
            Sort
          </>
        )}
      </button>
      {open ? (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-sm border border-border bg-white py-1 shadow-md">
            {fields.map((field) => (
              <button
                key={field.field}
                type="button"
                onClick={() => {
                  onSort({
                    field: field.field,
                    dir: sortField === field.field && sortDir === "asc" ? "desc" : "asc",
                  })
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-sm transition-colors hover:bg-off-white"
              >
                <span className={sortField === field.field ? "font-medium text-foreground" : "text-ink-muted"}>
                  {field.label}
                </span>
                {sortField === field.field ? (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    {sortDir}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}

/** Column visibility button: checkbox list to show or hide columns. */
export function CompoundColumnsButton({
  columns,
  hidden,
  onToggle,
}: {
  columns: { key: string; label: string }[]
  hidden: string[]
  onToggle: ({ key }: { key: string }) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((isOpen) => !isOpen)}
        className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-white px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-off-white"
      >
        <Columns3 className="size-3.5 shrink-0 text-ink-muted" aria-hidden />
        Columns
      </button>
      {open ? (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-sm border border-border bg-white p-1.5 shadow-md">
            {columns.map((column) => {
              const visible = !hidden.includes(column.key)

              return (
                <button
                  key={column.key}
                  type="button"
                  onClick={() => onToggle({ key: column.key })}
                  className="flex w-full items-center gap-2.5 rounded-xs px-2 py-2 text-sm text-foreground transition-colors hover:bg-off-white"
                >
                  <div
                    className={cn(
                      "size-3.5 rounded-xs border transition-colors",
                      visible ? "border-forest bg-forest" : "border-ink-muted/40"
                    )}
                  >
                    {visible ? (
                      <svg viewBox="0 0 10 10" className="size-3.5 text-white" fill="none">
                        <path
                          d="M2 5l2.5 2.5L8 3"
                          stroke="currentColor"
                          strokeWidth={1.5}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </div>
                  {column.label}
                </button>
              )
            })}
          </div>
        </>
      ) : null}
    </div>
  )
}
