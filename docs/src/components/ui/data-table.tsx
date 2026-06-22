"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────
// DataTable
//
// Compound component for all tabular data in the preview.
//
// Usage — without toolbar (< ~10 rows, not searchable):
//
//   <DataTable columns={COLS}>
//     {rows.map(r => (
//       <DataTableRow key={r.id}>
//         <DataTableCell>{r.name}</DataTableCell>
//       </DataTableRow>
//     ))}
//   </DataTable>
//
// Usage — with toolbar (>= ~10 rows, or named searchable data):
//
//   <DataTable
//     columns={COLS}
//     toolbar={
//       <DataTableToolbar>
//         <DataTableSearch value={q} onChange={setQ} />
//         <div className="ml-auto"><DataTableCount filtered={n} total={N} /></div>
//       </DataTableToolbar>
//     }
//   >
//     ...
//   </DataTable>
//
// Usage — compound filter bar (search, conditions, sort, columns):
//
//   <DataTable
//     columns={COLS}
//     toolbar={
//       <DataTableCompoundToolbar
//         controls={
//           <>
//             <CompoundSortButton ... />
//             <CompoundColumnsButton ... />
//             <DataTableToolbarActions>
//               <Button variant="outline" size="sm">Upload</Button>
//               <Button size="sm">New document</Button>
//             </DataTableToolbarActions>
//           </>
//         }
//       >
//         <DataTableSearch ... />
//         {/* FilterConditionChip, AddFilterButton, etc. */}
//       </DataTableCompoundToolbar>
//     }
//     footer={
//       <DataTableFooter
//         filtered={filtered.length}
//         total={rows.length}
//         noun="issues"
//         showClear={anyFilters}
//         onClearAll={clearAll}
//       />
//     }
//   >
//
// ─────────────────────────────────────────────────────────

// ---- Column definition ----

export interface DataTableColumn {
  key: string
  /** Header label. Pass an empty string for action/icon columns. */
  label: React.ReactNode
  align?: "left" | "right" | "center"
  /** CSS width e.g. "64px" or "10%". */
  width?: string
  className?: string
}

// ---- DataTable ----

const TH_BASE = "px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted"
const ALIGN: Record<"left" | "right" | "center", string> = {
  left: "text-left",
  right: "text-right",
  center: "text-center",
}

export interface DataTableProps {
  /** Column definitions — drives the <thead> row. */
  columns: DataTableColumn[]
  /** <DataTableRow> elements — rendered as <tbody> children. */
  children?: React.ReactNode
  /**
   * Optional toolbar (search, filters) rendered above the table.
   * Use <DataTableToolbar> as the wrapper.
   * Only include when row count justifies it (guideline: >= 10 rows).
   */
  toolbar?: React.ReactNode
  /** Inner table min-width. Defaults to "640px". */
  minWidth?: string
  /** Shown as a spanning cell when children is empty. */
  emptyMessage?: string
  /**
   * When false the outer border/shadow shell is omitted — use when the
   * table is already inside a bordered container (e.g. Widget).
   * Defaults to true.
   */
  framed?: boolean
  /**
   * Optional footer rendered below the table, outside the framed shell.
   * Use <DataTableFooter> for result count and "Clear all".
   */
  footer?: React.ReactNode
  className?: string
}

/**
 * Standardised table container. Provides consistent chrome, header row
 * rendering and an optional toolbar slot. Uses compound sub-components
 * for rows and cells so individual tables don't repeat structural classes.
 */
export function DataTable({
  columns,
  children,
  toolbar,
  footer,
  minWidth = "640px",
  emptyMessage = "No records found.",
  framed = true,
  className,
}: DataTableProps) {
  const isEmpty = React.Children.count(children) === 0

  const table = (
    <div className="overflow-x-auto">
      <table className="w-full" style={{ minWidth }}>
        <thead>
          <tr className="border-b border-border bg-off-white">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(TH_BASE, ALIGN[col.align ?? "left"], col.className)}
                style={col.width ? { width: col.width } : undefined}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {isEmpty ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-sm text-ink-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div className={cn("space-y-3", className)}>
      {toolbar}
      {framed ? (
        <div className="overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          {table}
        </div>
      ) : (
        table
      )}
      {footer}
    </div>
  )
}

// ---- DataTableRow ----

export interface DataTableRowProps {
  children: React.ReactNode
  onClick?: () => void
  /** Extra visual emphasis tone. */
  tone?: "warning" | "danger"
  className?: string
}

/**
 * Standard table row. Pass onClick to enable hover highlight and pointer cursor.
 */
export function DataTableRow({ children, onClick, tone, className }: DataTableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "group transition-colors duration-150",
        onClick && "cursor-pointer",
        tone === "danger" && "bg-danger-soft/20",
        tone === "warning" && "bg-warning-soft/20",
        onClick
          ? "hover:bg-off-white/60"
          : "hover:bg-off-white/30",
        className
      )}
    >
      {children}
    </tr>
  )
}

// ---- DataTableCell ----

export interface DataTableCellProps {
  children?: React.ReactNode
  align?: "left" | "right" | "center"
  className?: string
  colSpan?: number
  /** width CSS value — use sparingly; prefer column-level width instead. */
  width?: string
}

/**
 * Standard table cell with consistent padding.
 */
export function DataTableCell({
  children,
  align = "left",
  className,
  colSpan,
  width,
}: DataTableCellProps) {
  return (
    <td
      colSpan={colSpan}
      className={cn("px-4 py-3", ALIGN[align], className)}
      style={width ? { width } : undefined}
    >
      {children}
    </td>
  )
}

// ---- DataTableToolbar ----

export interface DataTableToolbarProps {
  children: React.ReactNode
  className?: string
}

/**
 * Flex row wrapper for search, filter chips, counts, and actions above the table.
 * Only render a toolbar when row count justifies it (guideline: >= 10 rows).
 */
export function DataTableToolbar({ children, className }: DataTableToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {children}
    </div>
  )
}

// ---- DataTableSearch ----

export interface DataTableSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Leading icon component. Defaults to Search from lucide-react. */
  icon?: React.ElementType
  className?: string
}

/**
 * Inline search input for use inside DataTableToolbar.
 * Styled to match the table chrome — 32px height, border radius consistent
 * with other table surfaces.
 */
export function DataTableSearch({
  value,
  onChange,
  placeholder = "Search...",
  icon: Icon = Search,
  className,
}: DataTableSearchProps) {
  return (
    <div className={cn("relative min-w-0", className)}>
      <Icon
        className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-sm border border-border bg-white pl-8 pr-3 text-sm outline-none focus:border-forest/40 focus:ring-2 focus:ring-forest/20"
      />
    </div>
  )
}

// ---- DataTableFilterChips ----

export interface DataTableFilterOption<T extends string = string> {
  value: T
  label: string
}

export interface DataTableFilterChipsProps<T extends string = string> {
  /** Optional label prefix e.g. "Health:" */
  label?: string
  options: DataTableFilterOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/**
 * Row of pill-shaped filter toggle buttons. Active option gets forest background.
 * Use inside DataTableToolbar. Recommended for <= 5 options.
 */
export function DataTableFilterChips<T extends string = string>({
  label,
  options,
  value,
  onChange,
  className,
}: DataTableFilterChipsProps<T>) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {label ? (
        <span className="shrink-0 text-xs text-ink-muted">{label}</span>
      ) : null}
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "h-7 rounded-xs px-2.5 text-xs font-medium transition-colors duration-150",
            value === opt.value
              ? "bg-forest text-white"
              : "bg-off-white text-ink-muted hover:bg-off-white/80 hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ---- DataTableCount ----

export interface DataTableCountProps {
  filtered: number
  total: number
  /** Noun for the items. Defaults to "rows". */
  noun?: string
  className?: string
}

/**
 * Result count label. Shows "N rows" when unfiltered, "N of M rows" when filtered.
 */
export function DataTableCount({
  filtered,
  total,
  noun = "rows",
  className,
}: DataTableCountProps) {
  return (
    <span className={cn("text-xs text-ink-muted", className)}>
      {filtered === total ? `${total} ${noun}` : `${filtered} of ${total} ${noun}`}
    </span>
  )
}

// ---- DataTableClearAll ----

export interface DataTableClearAllProps {
  onClick: () => void
  className?: string
}

/**
 * Resets all compound toolbar filters. Pair with DataTableFooter when
 * search or filter conditions are active.
 */
export function DataTableClearAll({ onClick, className }: DataTableClearAllProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 text-xs text-forest hover:underline underline-offset-2 transition-colors",
        className
      )}
    >
      Clear all
    </button>
  )
}

// ---- DataTableCompoundToolbar ----

export interface DataTableCompoundToolbarProps {
  /** Search, filter condition chips, and "+ Filter" controls. */
  children: React.ReactNode
  /** Sort, column visibility, and page action buttons. */
  controls?: React.ReactNode
  className?: string
}

/**
 * Compound filter bar layout for large datasets. Keeps search and filter
 * conditions on the left, sort/columns/actions on the right.
 */
export function DataTableCompoundToolbar({
  children,
  controls,
  className,
}: DataTableCompoundToolbarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {/* Filters: search, condition chips, + Filter */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
        {children}
      </div>

      {/* Controls: sort, columns, and page actions */}
      {controls ? (
        <div className="flex w-full flex-wrap items-center gap-2 sm:ml-auto sm:w-auto">
          {controls}
        </div>
      ) : null}
    </div>
  )
}

// ---- DataTableToolbarActions ----

export interface DataTableToolbarActionsProps {
  /** Page-level CTAs such as Upload, New document, or Export. */
  children: React.ReactNode
  className?: string
}

/**
 * Groups primary and secondary page actions in the compound toolbar controls
 * slot. Renders a left border so create/upload/export buttons stay visually
 * separate from sort and column toggles. Place after table controls, not
 * beside filter chips.
 *
 * Pattern: outline buttons for secondary actions, one default Button for
 * the primary action. Max two buttons per group; one primary only.
 */
export function DataTableToolbarActions({
  children,
  className,
}: DataTableToolbarActionsProps) {
  return (
    <div
      role="group"
      aria-label="Table actions"
      className={cn(
        "flex shrink-0 items-center gap-2 border-l border-border pl-2 sm:ml-1",
        className
      )}
    >
      {children}
    </div>
  )
}

// ---- DataTableFooter ----

export interface DataTableFooterProps {
  filtered: number
  total: number
  /** Noun for the count label. Defaults to "rows". */
  noun?: string
  /** When true, renders a "Clear all" link beside the count. */
  showClear?: boolean
  onClearAll?: () => void
  className?: string
}

/**
 * Table footer with result count and optional "Clear all" link.
 * Renders below the table frame as plain metadata, not inside the border.
 */
export function DataTableFooter({
  filtered,
  total,
  noun = "rows",
  showClear = false,
  onClearAll,
  className,
}: DataTableFooterProps) {
  return (
    <div className={cn("flex items-center gap-2 px-0.5 pt-1", className)}>
      <DataTableCount filtered={filtered} total={total} noun={noun} />
      {showClear && onClearAll ? (
        <DataTableClearAll onClick={onClearAll} />
      ) : null}
    </div>
  )
}
