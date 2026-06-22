"use client"

import * as React from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Columns3,
  FileText,
  LayoutGrid,
  List,
  Mail,
  Phone,
  Plus,
  Shield,
  User,
  X,
} from "lucide-react"

import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { DocsPage } from "@/components/docs/docs-page"
import { PropTable } from "@/components/docs/prop-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DataTable,
  DataTableCell,
  DataTableCompoundToolbar,
  DataTableCount,
  DataTableFilterChips,
  DataTableFooter,
  DataTableRow,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
  type DataTableColumn,
} from "@/components/ui/data-table"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────
// Sample data
// ─────────────────────────────────────────────────────────

const INSURANCE_ROWS = [
  { id: "ins-1", type: "Building insurance",    insurer: "NRMA",   cover: "$24.5M", expiry: "18 Jun 2026", status: "renewal-pending" },
  { id: "ins-2", type: "Public liability",       insurer: "NRMA",   cover: "$20.0M", expiry: "18 Jun 2027", status: "current"          },
  { id: "ins-3", type: "Office bearers",         insurer: "QBE",    cover: "$1.0M",  expiry: "30 Sep 2026", status: "current"          },
  { id: "ins-4", type: "Workers compensation",   insurer: "Allianz",cover: "—",      expiry: "31 Dec 2026", status: "current"          },
  { id: "ins-5", type: "Voluntary workers",      insurer: "Allianz",cover: "$500k",  expiry: "31 Dec 2026", status: "current"          },
]

const OWNERS_ROLL = [
  { lot: 1,  name: "James Okonkwo",    unitType: "2 bed",          ownerType: "owner-occupier", levyStatus: "current",       phone: "0411 234 567",  email: "james@example.com"        },
  { lot: 2,  name: "Sarah Patel",      unitType: "1 bed",          ownerType: "investor",       levyStatus: "current",       phone: null,            email: "sarah.patel@example.com"  },
  { lot: 5,  name: "Chen Wei",         unitType: "2 bed",          ownerType: "owner-occupier", levyStatus: "current",       phone: "0422 345 678",  email: null                       },
  { lot: 7,  name: "Robert Davis",     unitType: "3 bed",          ownerType: "owner-occupier", levyStatus: "arrears",       phone: "0433 456 789",  email: "r.davis@example.com"      },
  { lot: 8,  name: "Lisa Wong",        unitType: "2 bed",          ownerType: "investor",       levyStatus: "claim-pending", phone: null,            email: null                       },
  { lot: 12, name: "Priya Singh",      unitType: "1 bed",          ownerType: "investor",       levyStatus: "current",       phone: null,            email: null                       },
  { lot: 14, name: "Margaret Chen",    unitType: "2 bed",          ownerType: "owner-occupier", levyStatus: "current",       phone: "0444 567 890",  email: "m.chen@example.com"       },
  { lot: 18, name: "Patricia Kim",     unitType: "2 bed",          ownerType: "owner-occupier", levyStatus: "current",       phone: "0455 678 901",  email: "pkim@example.com"         },
  { lot: 22, name: "David Park",       unitType: "2 bed",          ownerType: "owner-occupier", levyStatus: "current",       phone: "0466 789 012",  email: null                       },
  { lot: 23, name: "Emma Thompson",    unitType: "1 bed",          ownerType: "investor",       levyStatus: "arrears",       phone: null,            email: "e.thompson@example.com"   },
  { lot: 27, name: "Thomas Brown",     unitType: "2 bed",          ownerType: "owner-occupier", levyStatus: "current",       phone: null,            email: null                       },
  { lot: 31, name: "Jennifer Walsh",   unitType: "2 bed",          ownerType: "owner-occupier", levyStatus: "current",       phone: "0477 890 123",  email: "j.walsh@example.com"      },
  { lot: 38, name: "Michael O'Brien",  unitType: "3 bed",          ownerType: "owner-occupier", levyStatus: "arrears",       phone: "0488 901 234",  email: null                       },
  { lot: 42, name: "Alicia Nguyen",    unitType: "3 bed penthouse", ownerType: "investor",      levyStatus: "current",       phone: null,            email: null                       },
]

type SchemeStatus = "Active" | "Pending" | "Inactive"
type HealthLevel  = "Good" | "Warning" | "Critical"
type LevyStatus   = "Current" | "Due" | "Overdue"

interface SchemeRow {
  id: string; name: string; state: string; lots: number
  manager: string; status: SchemeStatus; health: HealthLevel; levy: LevyStatus
}

const SCHEMES: SchemeRow[] = [
  { id: "s01", name: "Harbour View Towers",  state: "QLD", lots: 42, manager: "Sarah Mitchell", status: "Active",   health: "Warning",  levy: "Due"      },
  { id: "s02", name: "The Quarter",           state: "QLD", lots: 24, manager: "Sarah Mitchell", status: "Active",   health: "Critical", levy: "Overdue"  },
  { id: "s03", name: "Northbridge Estate",    state: "QLD", lots: 28, manager: "Sarah Mitchell", status: "Active",   health: "Warning",  levy: "Due"      },
  { id: "s04", name: "Parkside Residences",   state: "QLD", lots: 16, manager: "Sarah Mitchell", status: "Active",   health: "Good",     levy: "Current"  },
  { id: "s05", name: "Sunset Gardens",        state: "NSW", lots: 8,  manager: "Tom Walsh",       status: "Active",   health: "Good",     levy: "Current"  },
  { id: "s06", name: "Marina Bay Complex",    state: "NSW", lots: 72, manager: "Tom Walsh",       status: "Inactive", health: "Critical", levy: "Overdue"  },
  { id: "s07", name: "Bondi Junction Centre", state: "NSW", lots: 92, manager: "Tom Walsh",       status: "Active",   health: "Warning",  levy: "Current"  },
  { id: "s08", name: "Rosebay Heights",       state: "NSW", lots: 28, manager: "Tom Walsh",       status: "Active",   health: "Good",     levy: "Due"      },
  { id: "s09", name: "Skyline Residences",    state: "VIC", lots: 88, manager: "Priya Nair",      status: "Active",   health: "Good",     levy: "Current"  },
  { id: "s10", name: "Fitzroy Lane Terraces", state: "VIC", lots: 16, manager: "Priya Nair",      status: "Active",   health: "Good",     levy: "Current"  },
  { id: "s11", name: "The Green Residences",  state: "VIC", lots: 32, manager: "Priya Nair",      status: "Active",   health: "Warning",  levy: "Overdue"  },
  { id: "s12", name: "Westfield Village",     state: "WA",  lots: 56, manager: "Aisha Khan",      status: "Pending",  health: "Warning",  levy: "Due"      },
  { id: "s13", name: "Mountain View Estate",  state: "TAS", lots: 18, manager: "Aisha Khan",      status: "Active",   health: "Warning",  levy: "Current"  },
  { id: "s14", name: "City Central Tower",    state: "ACT", lots: 64, manager: "Aisha Khan",      status: "Active",   health: "Good",     levy: "Current"  },
]

// ─────────────────────────────────────────────────────────
// Compound filter types and field config
// ─────────────────────────────────────────────────────────

type FilterField = "status" | "state" | "health" | "levy"

interface FilterOption {
  value: string
  label: string
  tone?: "success" | "warning" | "danger" | "info" | "neutral"
}

interface FilterFieldConfig {
  field: FilterField
  label: string
  options: FilterOption[]
}

const FILTER_FIELDS: FilterFieldConfig[] = [
  {
    field: "status",
    label: "Status",
    options: [
      { value: "Active",   label: "Active",   tone: "success"  },
      { value: "Pending",  label: "Pending",  tone: "warning"  },
      { value: "Inactive", label: "Inactive", tone: "neutral"  },
    ],
  },
  {
    field: "state",
    label: "Location",
    options: [
      { value: "NSW", label: "NSW" },
      { value: "VIC", label: "VIC" },
      { value: "QLD", label: "QLD" },
      { value: "WA",  label: "WA"  },
      { value: "TAS", label: "TAS" },
      { value: "ACT", label: "ACT" },
    ],
  },
  {
    field: "health",
    label: "Health",
    options: [
      { value: "Good",     label: "Good",     tone: "success" },
      { value: "Warning",  label: "Warning",  tone: "warning" },
      { value: "Critical", label: "Critical", tone: "danger"  },
    ],
  },
  {
    field: "levy",
    label: "Levy",
    options: [
      { value: "Current", label: "Current", tone: "success" },
      { value: "Due",     label: "Due",     tone: "warning" },
      { value: "Overdue", label: "Overdue", tone: "danger"  },
    ],
  },
]

const SORTABLE_FIELDS = [
  { field: "name",    label: "Name"   },
  { field: "lots",    label: "Lots"   },
  { field: "state",   label: "State"  },
  { field: "status",  label: "Status" },
]

/** Returns the value used for sorting a scheme row by the given field key. */
function schemeSortValue({ row, field }: { row: SchemeRow; field: string }): string | number {
  switch (field) {
    case "name":   return row.name
    case "lots":   return row.lots
    case "state":  return row.state
    case "status": return row.status
    default:       return ""
  }
}

interface FilterCondition {
  id: string
  field: FilterField
  value: string
}

// ─────────────────────────────────────────────────────────
// Shared badge helpers
// ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: SchemeStatus }) {
  const v = status === "Active" ? "accent" : status === "Pending" ? "warning" : "secondary"
  return <Badge variant={v} size="sm">{status}</Badge>
}
function HealthBadge({ health }: { health: HealthLevel }) {
  const v = health === "Good" ? "accent" : health === "Warning" ? "warning" : "destructive"
  return <Badge variant={v} size="sm">{health}</Badge>
}
function LevyBadge({ levy }: { levy: LevyStatus }) {
  const v = levy === "Current" ? "accent" : levy === "Due" ? "warning" : "destructive"
  return <Badge variant={v} size="sm">{levy}</Badge>
}

// ─────────────────────────────────────────────────────────
// Compound filter sub-components
// ─────────────────────────────────────────────────────────

/** The "+ Filter" button with a dropdown to pick a filter field. */
function AddFilterButton({
  fields,
  activeFields,
  onAdd,
}: {
  fields: FilterFieldConfig[]
  activeFields: FilterField[]
  onAdd: (field: FilterField) => void
}) {
  const [open, setOpen] = React.useState(false)
  const available = fields.filter((f) => !activeFields.includes(f.field))

  return (
    <div className="relative">
      <button
        type="button"
        disabled={available.length === 0}
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-white px-2.5 text-xs font-medium text-ink-muted hover:bg-off-white hover:text-foreground disabled:opacity-40 transition-colors"
      >
        <Plus className="size-3.5" aria-hidden />
        Filter
      </button>
      {open && available.length > 0 && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 min-w-[140px] overflow-hidden rounded-sm border border-border bg-white py-1 shadow-md">
            {available.map((f) => (
              <button
                key={f.field}
                type="button"
                onClick={() => { onAdd(f.field); setOpen(false) }}
                className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-off-white transition-colors"
              >
                {f.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/** A single active filter condition chip: "Status is [Active ▼] ×" */
function FilterConditionChip({
  condition,
  fieldConfig,
  onValueChange,
  onRemove,
}: {
  condition: FilterCondition
  fieldConfig: FilterFieldConfig
  onValueChange: (value: string) => void
  onRemove: () => void
}) {
  const [valueOpen, setValueOpen] = React.useState(!condition.value)
  const selectedOpt = fieldConfig.options.find((o) => o.value === condition.value)

  const optionBadgeVariant = (tone?: FilterOption["tone"]) => {
    if (tone === "success") return "accent"
    if (tone === "warning") return "warning"
    if (tone === "danger")  return "destructive"
    return "secondary"
  }

  return (
    <div className="relative flex items-center gap-1.5 rounded-sm border border-border bg-white py-1 pl-2.5 pr-1">
      {/* Indicator dot */}
      <div className="size-2.5 shrink-0 rounded-full border border-ink-muted/40" />
      {/* Field label + operator */}
      <span className="shrink-0 text-xs text-ink-muted">
        {fieldConfig.label} <span className="text-foreground/50">is</span>
      </span>
      {/* Value picker button */}
      <button
        type="button"
        onClick={() => setValueOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1 rounded-xs px-2 py-0.5 text-xs font-medium transition-colors",
          selectedOpt
            ? "bg-off-white text-foreground hover:bg-border"
            : "bg-off-white text-ink-muted hover:bg-border"
        )}
      >
        {selectedOpt ? (
          <Badge variant={optionBadgeVariant(selectedOpt.tone)} size="sm">
            {selectedOpt.label}
          </Badge>
        ) : (
          <span className="text-ink-muted/70">Select...</span>
        )}
        <ChevronDown className="size-3 shrink-0 text-ink-muted" aria-hidden />
      </button>
      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${fieldConfig.label} filter`}
        className="ml-0.5 flex size-5 items-center justify-center rounded-xs text-ink-muted hover:bg-off-white hover:text-foreground transition-colors"
      >
        <X className="size-3" aria-hidden />
      </button>

      {/* Value dropdown */}
      {valueOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setValueOpen(false)} />
          <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-sm border border-border bg-white py-1 shadow-md">
            {fieldConfig.options.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => { onValueChange(opt.value); setValueOpen(false) }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-off-white transition-colors",
                  condition.value === opt.value && "bg-off-white"
                )}
              >
                <Badge variant={optionBadgeVariant(opt.tone)} size="sm">{opt.label}</Badge>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/** Sort button with a dropdown listing sortable fields + current direction. */
function SortButton({
  sortField,
  sortDir,
  fields,
  onSort,
}: {
  sortField: string
  sortDir: "asc" | "desc"
  fields: { field: string; label: string }[]
  onSort: (field: string, dir: "asc" | "desc") => void
}) {
  const [open, setOpen] = React.useState(false)
  const activeLabel = fields.find((f) => f.field === sortField)?.label

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-white px-2.5 text-xs font-medium text-foreground hover:bg-off-white transition-colors"
      >
        {sortField ? (
          <>
            {sortDir === "asc"
              ? <ArrowUp className="size-3.5 shrink-0" aria-hidden />
              : <ArrowDown className="size-3.5 shrink-0" aria-hidden />
            }
            {activeLabel}
          </>
        ) : (
          <>
            <ArrowUpDown className="size-3.5 shrink-0 text-ink-muted" aria-hidden />
            Sort
          </>
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-sm border border-border bg-white py-1 shadow-md">
            {fields.map((f) => (
              <button
                key={f.field}
                type="button"
                onClick={() => {
                  onSort(
                    f.field,
                    sortField === f.field && sortDir === "asc" ? "desc" : "asc"
                  )
                  setOpen(false)
                }}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-off-white transition-colors"
              >
                <span className={sortField === f.field ? "font-medium text-foreground" : "text-ink-muted"}>
                  {f.label}
                </span>
                {sortField === f.field && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-muted">
                    {sortDir}
                  </span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/** Column visibility button with checkbox list. */
function ColumnsButton({
  columns,
  hidden,
  onToggle,
}: {
  columns: { key: string; label: string }[]
  hidden: string[]
  onToggle: (key: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 items-center gap-1.5 rounded-sm border border-border bg-white px-2.5 text-xs font-medium text-foreground hover:bg-off-white transition-colors"
      >
        <Columns3 className="size-3.5 shrink-0 text-ink-muted" aria-hidden />
        Columns
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-sm border border-border bg-white p-1.5 shadow-md">
            {columns.map((col) => {
              const visible = !hidden.includes(col.key)
              return (
                <button
                  key={col.key}
                  type="button"
                  onClick={() => onToggle(col.key)}
                  className="flex w-full items-center gap-2.5 rounded-xs px-2 py-2 text-sm text-foreground hover:bg-off-white transition-colors"
                >
                  <div className={cn(
                    "size-3.5 rounded-xs border transition-colors",
                    visible ? "border-forest bg-forest" : "border-ink-muted/40"
                  )}>
                    {visible && (
                      <svg viewBox="0 0 10 10" className="size-3.5 text-white" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                  {col.label}
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Interactive examples
// ─────────────────────────────────────────────────────────

/** Example 1: Plain table with no toolbar (< 8 rows). */
function InsuranceTable() {
  const INS_COLS: DataTableColumn[] = [
    { key: "type",    label: "Type"    },
    { key: "insurer", label: "Insurer" },
    { key: "cover",   label: "Cover",  align: "right" },
    { key: "expiry",  label: "Expiry", width: "130px" },
    { key: "status",  label: "Status", width: "150px" },
  ]

  return (
    <DataTable columns={INS_COLS}>
      {INSURANCE_ROWS.map((row) => (
        <DataTableRow key={row.id}>
          <DataTableCell>
            <div className="flex items-center gap-2">
              <Shield className="size-4 shrink-0 text-ink-muted" aria-hidden />
              <span className="text-sm font-medium text-foreground">{row.type}</span>
            </div>
          </DataTableCell>
          <DataTableCell>
            <span className="text-sm text-foreground">{row.insurer}</span>
          </DataTableCell>
          <DataTableCell align="right">
            <span className="text-sm tabular-nums text-foreground">{row.cover}</span>
          </DataTableCell>
          <DataTableCell>
            <span className="text-xs text-ink-muted whitespace-nowrap">{row.expiry}</span>
          </DataTableCell>
          <DataTableCell>
            {row.status === "renewal-pending" ? (
              <Badge variant="warning" size="sm">Renewal pending</Badge>
            ) : (
              <Badge variant="accent" size="sm">Current</Badge>
            )}
          </DataTableCell>
        </DataTableRow>
      ))}
    </DataTable>
  )
}

/** Example 2: Searchable table — search + count toolbar (8-20 rows). */
function SearchableOwnersRoll() {
  const [search, setSearch] = React.useState("")

  const filtered = React.useMemo(() => {
    if (!search.trim()) return OWNERS_ROLL
    const q = search.toLowerCase()
    return OWNERS_ROLL.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.lot.toString().includes(q) ||
        r.ownerType.includes(q)
    )
  }, [search])

  const COLS: DataTableColumn[] = [
    { key: "lot",       label: "Lot",         width: "64px"  },
    { key: "owner",     label: "Owner"                       },
    { key: "type",      label: "Type",         width: "130px" },
    { key: "contact",   label: "Contact"                     },
    { key: "levy",      label: "Levy status",  width: "130px" },
  ]

  return (
    <DataTable
      columns={COLS}
      minWidth="620px"
      emptyMessage="No lots match your search."
      toolbar={
        <DataTableToolbar>
          <DataTableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search by owner or lot..."
            icon={User}
            className="flex-1 max-w-64"
          />
        </DataTableToolbar>
      }
      footer={
        <DataTableFooter
          filtered={filtered.length}
          total={OWNERS_ROLL.length}
          noun="lots"
          showClear={Boolean(search.trim())}
          onClearAll={() => setSearch("")}
        />
      }
    >
      {filtered.map((row) => (
        <DataTableRow key={row.lot}>
          <DataTableCell>
            <div className="flex size-7 items-center justify-center rounded-xs bg-off-white">
              <span className="font-mono text-xs font-semibold text-ink-muted">{row.lot}</span>
            </div>
          </DataTableCell>
          <DataTableCell>
            <span className="text-sm font-medium text-foreground">{row.name}</span>
            <p className="mt-0.5 text-xs text-ink-muted">{row.unitType}</p>
          </DataTableCell>
          <DataTableCell>
            <Badge variant={row.ownerType === "owner-occupier" ? "default" : "info"} size="sm">
              {row.ownerType === "owner-occupier" ? "Owner occ." : "Investor"}
            </Badge>
          </DataTableCell>
          <DataTableCell>
            <div className="space-y-0.5">
              {row.phone && (
                <p className="flex items-center gap-1 text-xs text-ink-muted">
                  <Phone className="size-3 shrink-0" aria-hidden /> {row.phone}
                </p>
              )}
              {row.email && (
                <p className="flex items-center gap-1 text-xs text-ink-muted truncate max-w-[180px]">
                  <Mail className="size-3 shrink-0" aria-hidden /> {row.email}
                </p>
              )}
              {!row.phone && !row.email && (
                <span className="text-xs text-ink-muted/50">No contact on file</span>
              )}
            </div>
          </DataTableCell>
          <DataTableCell>
            {row.levyStatus === "arrears" ? (
              <Badge variant="destructive" size="sm">Arrears</Badge>
            ) : row.levyStatus === "claim-pending" ? (
              <Badge variant="warning" size="sm">Claim pending</Badge>
            ) : (
              <Badge variant="accent" size="sm">Current</Badge>
            )}
          </DataTableCell>
        </DataTableRow>
      ))}
    </DataTable>
  )
}

/** Example 3: Full compound filter toolbar — search, filter conditions, sort, columns. */
function FilteredSchemesTable() {
  const [search,     setSearch]     = React.useState("")
  const [conditions, setConditions] = React.useState<FilterCondition[]>([])
  const [sortField,  setSortField]  = React.useState("")
  const [sortDir,    setSortDir]    = React.useState<"asc" | "desc">("asc")
  const [hiddenCols, setHiddenCols] = React.useState<string[]>([])

  const TOGGLE_COLS = [
    { key: "location", label: "Location" },
    { key: "lots",     label: "Lots"     },
    { key: "manager",  label: "Manager"  },
    { key: "status",   label: "Status"   },
    { key: "health",   label: "Health"   },
    { key: "levy",     label: "Levy"     },
  ]

  const ALL_COLS: DataTableColumn[] = [
    { key: "scheme",   label: "Scheme"             },
    { key: "location", label: "Location", width: "110px" },
    { key: "lots",     label: "Lots",     align: "right", width: "70px" },
    { key: "manager",  label: "Manager"            },
    { key: "status",   label: "Status",   width: "120px" },
    { key: "health",   label: "Health",   width: "110px" },
    { key: "levy",     label: "Levy",     width: "100px" },
  ]

  const visibleCols = ALL_COLS.filter((c) => !hiddenCols.includes(c.key))

  function addCondition(field: FilterField) {
    setConditions((prev) => [...prev, { id: crypto.randomUUID(), field, value: "" }])
  }
  function updateCondition(id: string, value: string) {
    setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)))
  }
  function removeCondition(id: string) {
    setConditions((prev) => prev.filter((c) => c.id !== id))
  }
  function clearAll() {
    setSearch("")
    setConditions([])
  }
  function toggleColumn(key: string) {
    setHiddenCols((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const anyFilters = Boolean(search.trim()) || conditions.some((c) => c.value)

  const filtered = React.useMemo(() => {
    let rows = SCHEMES
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.state.toLowerCase().includes(q) ||
          r.manager.toLowerCase().includes(q)
      )
    }
    for (const cond of conditions) {
      if (!cond.value) continue
      rows = rows.filter((r) => {
        if (cond.field === "status")  return r.status === cond.value
        if (cond.field === "state")   return r.state  === cond.value
        if (cond.field === "health")  return r.health === cond.value
        if (cond.field === "levy")    return r.levy   === cond.value
        return true
      })
    }
    return [...rows].sort((a, b) => {
      if (!sortField) return 0
      const aVal = schemeSortValue({ row: a, field: sortField })
      const bVal = schemeSortValue({ row: b, field: sortField })
      const cmp = typeof aVal === "number"
        ? aVal - (bVal as number)
        : String(aVal).localeCompare(String(bVal))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [search, conditions, sortField, sortDir])

  return (
    <DataTable
      columns={visibleCols}
      minWidth="720px"
      emptyMessage="No schemes match your current filters."
      toolbar={
        <DataTableCompoundToolbar
          controls={
            <>
              <SortButton
                sortField={sortField}
                sortDir={sortDir}
                fields={SORTABLE_FIELDS}
                onSort={(f, d) => { setSortField(f); setSortDir(d) }}
              />
              <ColumnsButton
                columns={TOGGLE_COLS}
                hidden={hiddenCols}
                onToggle={toggleColumn}
              />
              <DataTableToolbarActions>
                <Button size="sm">
                  <Plus className="size-3.5" aria-hidden />
                  Add scheme
                </Button>
              </DataTableToolbarActions>
            </>
          }
        >
          {/* Search */}
          <DataTableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search schemes, SP, manager..."
            className="w-56"
          />
          {/* Active filter conditions */}
          {conditions.map((cond) => {
            const fieldCfg = FILTER_FIELDS.find((f) => f.field === cond.field)!
            return (
              <FilterConditionChip
                key={cond.id}
                condition={cond}
                fieldConfig={fieldCfg}
                onValueChange={(v) => updateCondition(cond.id, v)}
                onRemove={() => removeCondition(cond.id)}
              />
            )
          })}
          {/* Add filter */}
          <AddFilterButton
            fields={FILTER_FIELDS}
            activeFields={conditions.map((c) => c.field)}
            onAdd={addCondition}
          />
        </DataTableCompoundToolbar>
      }
      footer={
        <DataTableFooter
          filtered={filtered.length}
          total={SCHEMES.length}
          noun="schemes"
          showClear={anyFilters}
          onClearAll={clearAll}
        />
      }
    >
      {filtered.map((scheme) => (
        <DataTableRow key={scheme.id}>
          {/* Scheme name — always visible */}
          <DataTableCell>
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xs bg-lime-soft">
                <span className="text-[11px] font-bold text-forest">
                  {scheme.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{scheme.name}</p>
              </div>
            </div>
          </DataTableCell>
          {/* Conditionally visible columns */}
          {!hiddenCols.includes("location") && (
            <DataTableCell>
              <span className="text-sm text-foreground">{scheme.state}</span>
            </DataTableCell>
          )}
          {!hiddenCols.includes("lots") && (
            <DataTableCell align="right">
              <span className="text-sm tabular-nums text-foreground">{scheme.lots}</span>
            </DataTableCell>
          )}
          {!hiddenCols.includes("manager") && (
            <DataTableCell>
              <span className="text-sm text-ink-muted">{scheme.manager}</span>
            </DataTableCell>
          )}
          {!hiddenCols.includes("status") && (
            <DataTableCell><StatusBadge status={scheme.status} /></DataTableCell>
          )}
          {!hiddenCols.includes("health") && (
            <DataTableCell><HealthBadge health={scheme.health} /></DataTableCell>
          )}
          {!hiddenCols.includes("levy") && (
            <DataTableCell><LevyBadge levy={scheme.levy} /></DataTableCell>
          )}
        </DataTableRow>
      ))}
    </DataTable>
  )
}

/** Example 4: Table with card view toggle. */
function TableWithCardToggle() {
  const [viewMode, setViewMode] = React.useState<"table" | "grid">("table")
  const [search,   setSearch]   = React.useState("")

  const filtered = React.useMemo(() => {
    if (!search.trim()) return SCHEMES
    const q = search.toLowerCase()
    return SCHEMES.filter(
      (s) => s.name.toLowerCase().includes(q) || s.state.toLowerCase().includes(q)
    )
  }, [search])

  const COLS: DataTableColumn[] = [
    { key: "scheme",  label: "Scheme"                          },
    { key: "location",label: "Location",   width: "100px"     },
    { key: "lots",    label: "Lots",       align: "right", width: "70px" },
    { key: "status",  label: "Status",     width: "120px"     },
    { key: "health",  label: "Health",     width: "110px"     },
    { key: "levy",    label: "Levy",       width: "100px"     },
  ]

  return (
    <DataTable
      columns={COLS}
      minWidth="600px"
      emptyMessage="No schemes match your search."
      framed={viewMode === "table"}
      toolbar={
        <DataTableToolbar>
          <DataTableSearch
            value={search}
            onChange={setSearch}
            placeholder="Search schemes..."
            className="flex-1 max-w-56"
          />
          <div className="ml-auto flex items-center gap-2">
            {/* View toggle */}
            <div className="flex items-center rounded-xs border border-border bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("table")}
                aria-label="Table view"
                className={cn(
                  "flex h-6 items-center gap-1 rounded-xs px-2 text-xs font-medium transition-colors",
                  viewMode === "table" ? "bg-forest text-white" : "text-ink-muted hover:text-foreground"
                )}
              >
                <List className="size-3.5" aria-hidden />
                Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Card view"
                className={cn(
                  "flex h-6 items-center gap-1 rounded-xs px-2 text-xs font-medium transition-colors",
                  viewMode === "grid" ? "bg-forest text-white" : "text-ink-muted hover:text-foreground"
                )}
              >
                <LayoutGrid className="size-3.5" aria-hidden />
                Cards
              </button>
            </div>
          </div>
        </DataTableToolbar>
      }
      footer={
        <DataTableFooter
          filtered={filtered.length}
          total={SCHEMES.length}
          noun="schemes"
          showClear={Boolean(search.trim())}
          onClearAll={() => setSearch("")}
        />
      }
    >
      {viewMode === "table" ? (
        filtered.map((s) => (
          <DataTableRow key={s.id}>
            <DataTableCell>
              <div className="flex items-center gap-2.5">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-xs bg-lime-soft">
                  <span className="text-[11px] font-bold text-forest">
                    {s.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground truncate">{s.name}</span>
              </div>
            </DataTableCell>
            <DataTableCell><span className="text-sm text-foreground">{s.state}</span></DataTableCell>
            <DataTableCell align="right"><span className="text-sm tabular-nums">{s.lots}</span></DataTableCell>
            <DataTableCell><StatusBadge status={s.status} /></DataTableCell>
            <DataTableCell><HealthBadge health={s.health} /></DataTableCell>
            <DataTableCell><LevyBadge levy={s.levy} /></DataTableCell>
          </DataTableRow>
        ))
      ) : (
        // Grid view — rendered as a single cell spanning all columns
        <tr>
          <td colSpan={COLS.length} className="p-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex flex-col rounded-sm border border-border bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)]",
                    s.health === "Critical" ? "border-l-[3px] border-l-danger" :
                    s.health === "Warning"  ? "border-l-[3px] border-l-warning" :
                    "border-l-[3px] border-l-lime"
                  )}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-xs bg-lime-soft">
                      <span className="text-[10px] font-bold text-forest">
                        {s.name.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 flex-1">{s.name}</p>
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-1">
                    <span className="text-[10px] text-ink-muted">{s.state} · {s.lots} lots</span>
                    <StatusBadge status={s.status} />
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </DataTable>
  )
}

// ─────────────────────────────────────────────────────────
// Code snippets
// ─────────────────────────────────────────────────────────

const USAGE_PLAIN = `import {
  DataTable, DataTableRow, DataTableCell,
  type DataTableColumn,
} from "@/components/ui/data-table"

const COLS: DataTableColumn[] = [
  { key: "type",   label: "Type"    },
  { key: "status", label: "Status"  },
]

<DataTable columns={COLS}>
  {rows.map(row => (
    <DataTableRow key={row.id} onClick={() => open(row)}>
      <DataTableCell>{row.type}</DataTableCell>
      <DataTableCell><Badge>{row.status}</Badge></DataTableCell>
    </DataTableRow>
  ))}
</DataTable>`

const USAGE_SEARCH = `import {
  DataTable, DataTableRow, DataTableCell,
  DataTableToolbar, DataTableSearch, DataTableFooter,
} from "@/components/ui/data-table"

const [search, setSearch] = useState("")
const filtered = rows.filter(r => r.name.includes(search))

<DataTable
  columns={COLS}
  toolbar={
    <DataTableToolbar>
      <DataTableSearch value={search} onChange={setSearch} placeholder="Search..." />
    </DataTableToolbar>
  }
  footer={
    <DataTableFooter
      filtered={filtered.length}
      total={rows.length}
      noun="lots"
      showClear={Boolean(search.trim())}
      onClearAll={() => setSearch("")}
    />
  }
>
  {filtered.map(row => <DataTableRow key={row.id}>…</DataTableRow>)}
</DataTable>`

const USAGE_FRAMED_FALSE = `{/* Inside a Widget — pass framed={false} to suppress the duplicate border */}
<Widget>
  <WidgetHeader>…</WidgetHeader>
  <WidgetContent flush>
    <DataTable columns={COLS} framed={false}>
      {rows.map(row => <DataTableRow key={row.id}>…</DataTableRow>)}
    </DataTable>
  </WidgetContent>
</Widget>`

const USAGE_COMPOUND = `import {
  DataTable, DataTableRow, DataTableCell,
  DataTableCompoundToolbar, DataTableFooter, DataTableSearch,
  DataTableToolbarActions,
} from "@/components/ui/data-table"

const anyFilters = Boolean(search.trim()) || conditions.some(c => c.value)

<DataTable
  columns={COLS}
  toolbar={
    <DataTableCompoundToolbar
      controls={
        <>
          <SortButton ... />
          <ColumnsButton ... />
          <DataTableToolbarActions>
            <Button variant="outline" size="sm">Upload</Button>
            <Button size="sm">New document</Button>
          </DataTableToolbarActions>
        </>
      }
    >
      <DataTableSearch value={search} onChange={setSearch} />
      {/* FilterConditionChip, AddFilterButton, etc. */}
    </DataTableCompoundToolbar>
  }
  footer={
    <DataTableFooter
      filtered={filtered.length}
      total={rows.length}
      noun="documents"
      showClear={anyFilters}
      onClearAll={clearAll}
    />
  }
>
  {filtered.map(row => <DataTableRow key={row.id}>…</DataTableRow>)}
</DataTable>`

const USAGE_TOOLBAR_ACTIONS = `{/* Page CTAs belong in controls, wrapped in DataTableToolbarActions.
    Keep sort/columns outside the wrapper; use outline for secondary, default for primary. */}

<DataTableCompoundToolbar
  controls={
    <>
      <CompoundSortButton sortField={sortField} sortDir={sortDir} ... />
      <CompoundColumnsButton columns={TOGGLE_COLS} hidden={hiddenCols} ... />
      <DataTableToolbarActions>
        <Button variant="outline" size="sm">Upload</Button>
        <Button size="sm">
          <Plus className="size-3.5" aria-hidden />
          New document
        </Button>
      </DataTableToolbarActions>
    </>
  }
>
  <DataTableSearch ... />
  {/* filter chips */}
</DataTableCompoundToolbar>

{/* Do not put create/upload buttons in the filter row (children).
    Do not mix them with DataTableFilterChips — chips filter data; actions change it. */}`

// ─────────────────────────────────────────────────────────
// Props definitions
// ─────────────────────────────────────────────────────────

const TABLE_PROPS = [
  { name: "columns",      type: "DataTableColumn[]",  default: "—",      description: "Column definitions that drive the <thead> row. Each entry has key, label, align, width, and className." },
  { name: "children",     type: "ReactNode",           default: "—",      description: "One or more <DataTableRow> elements rendered as <tbody> content." },
  { name: "toolbar",      type: "ReactNode",           default: "undefined", description: "Controls rendered above the table — wrap with <DataTableToolbar> or <DataTableCompoundToolbar>. Omit for small datasets that don't need filtering." },
  { name: "footer",       type: "ReactNode",           default: "undefined", description: "Rendered below the table, outside the framed border. Use <DataTableFooter> for result count and Clear all." },
  { name: "framed",       type: "boolean",             default: "true",   description: "When true (default) wraps the table in a bordered container. Pass false when the table lives inside an existing border such as a Widget." },
  { name: "minWidth",     type: "string",              default: '"640px"', description: "CSS min-width for the inner <table> element. Increase for wide column sets that need horizontal scroll." },
  { name: "emptyMessage", type: "ReactNode",           default: '"No records found."', description: "Shown as a spanning cell when children is empty." },
]

const ROW_PROPS = [
  { name: "onClick",   type: "() => void",                   default: "undefined",  description: "When provided, adds a pointer cursor and hover highlight." },
  { name: "tone",      type: '"warning" | "danger"',          default: "undefined",  description: "Applies a translucent tinted background — use for at-risk rows." },
  { name: "className", type: "string",                        default: "undefined",  description: "Extra Tailwind classes." },
]

const CELL_PROPS = [
  { name: "align",     type: '"left" | "right" | "center"',  default: '"left"',     description: "Text alignment. Use right for numeric columns." },
  { name: "colSpan",   type: "number",                        default: "undefined",  description: "HTML colSpan for spanning cells." },
  { name: "className", type: "string",                        default: "undefined",  description: "Extra Tailwind classes." },
]

const SEARCH_PROPS = [
  { name: "value",       type: "string",          default: "—",         description: "Controlled search query." },
  { name: "onChange",    type: "(value: string) => void", default: "—", description: "Called on every keystroke with the new value." },
  { name: "placeholder", type: "string",          default: '"Search..."', description: "Input placeholder text." },
  { name: "icon",        type: "React.ElementType", default: "Search",   description: "Leading icon component. Pass a domain-specific icon from lucide-react to add context (e.g. User for an owners roll)." },
]

const CHIPS_PROPS = [
  { name: "options",   type: "DataTableFilterOption[]", default: "—",     description: "Array of { value, label } options." },
  { name: "value",     type: "string (generic T)",      default: "—",     description: "Currently active filter value." },
  { name: "onChange",  type: "(value: T) => void",      default: "—",     description: "Called when the user clicks a chip." },
  { name: "label",     type: "string",                  default: "undefined", description: 'Optional prefix label shown before the chips, e.g. "Health:".' },
]

// ─────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────

export default function DataTablePage() {
  return (
    <DocsPage>

      {/* Header */}
      <div className="mb-10">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
          Components / Application
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-foreground">Data Table</h1>
        <p className="text-base leading-relaxed text-ink-muted">
          Compound components for all tabular data in the app. Provides consistent
          chrome across list views, with optional toolbar controls whose complexity
          scales with the size and complexity of the dataset.
        </p>
      </div>

      {/* When to use guidance */}
      <section className="mb-10 border-t border-border pt-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-ink-muted">
          When to use what
        </h2>

        <div className="overflow-hidden rounded-sm border border-border bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-off-white">
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Pattern</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-muted">When</th>
                <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                {
                  pattern: "Table, no toolbar",
                  when: "Fewer than ~8 rows, not searchable by name, scanned at a glance.",
                  examples: "Insurance policies per property, committee members, meeting agenda items.",
                },
                {
                  pattern: "Table + search",
                  when: "8 to ~30 rows of named entities where the user may know who/what they want.",
                  examples: "Owners roll (lots 1–42), contractor list, document list.",
                },
                {
                  pattern: "Table + compound filters",
                  when: "More than ~30 rows, or multi-axis filtering needed (status AND location AND health).",
                  examples: "Portfolio scheme index, arrears across all properties, compliance register.",
                },
                {
                  pattern: "Toolbar page actions",
                  when: "The view needs create, upload, or export alongside sort and column controls.",
                  examples: "New document + Upload on a document register; Log issue on a maintenance list. Wrap in DataTableToolbarActions, not in the filter row.",
                },
                {
                  pattern: "Add card view toggle",
                  when: "Entities have strong visual identity or the list is browsed rather than compared. Cards degrade better on mobile for content-rich entities.",
                  examples: "Scheme portfolio (schemes have icons, health colours). NOT owners roll (reference data — always compare columns).",
                },
              ].map((row) => (
                <tr key={row.pattern} className="hover:bg-off-white/40 transition-colors">
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-foreground">{row.pattern}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-ink-muted">{row.when}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-ink-muted">{row.examples}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-sm border border-info-soft bg-info-soft/30 px-4 py-3 text-sm text-ink-muted">
          <span className="font-semibold text-foreground">Card view is not a substitute for filters.</span>{" "}
          Add a card toggle when the layout benefit is real — entities have visual identity or users browse
          on mobile. Never add it purely for variety. When in doubt, default to the table view.
        </div>
      </section>

      {/* Examples */}
      <section className="mb-10 border-t border-border pt-10">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-ink-muted">
          Examples
        </h2>

        <div className="space-y-12">

          {/* Example 1: Plain table */}
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">Plain table — no toolbar</p>
            <p className="mb-3 text-sm text-ink-muted">
              5 insurance policies. No searching needed at this scale.
            </p>
            <ComponentPreview label="Preview">
              <InsuranceTable />
            </ComponentPreview>
            <div className="mt-3">
              <CodeBlock code={USAGE_PLAIN} language="tsx" />
            </div>
          </div>

          {/* Example 2: Searchable */}
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">Searchable table: search only</p>
            <p className="mb-3 text-sm text-ink-muted">
              14 owners from a 42-lot roll. Search helps locate a specific owner by name or lot number.
              The result count and Clear all link sit below the table via{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">DataTableFooter</code>,
              not in the toolbar.
            </p>
            <ComponentPreview label="Preview">
              <SearchableOwnersRoll />
            </ComponentPreview>
            <div className="mt-3">
              <CodeBlock code={USAGE_SEARCH} language="tsx" />
            </div>
          </div>

          {/* Example 3: Compound filter */}
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">Compound filter bar — search, filter conditions, sort, columns</p>
            <p className="mb-3 text-sm text-ink-muted">
              14 schemes across multiple states. The{" "}
              <span className="font-medium text-foreground">+ Filter</span>{" "}
              button adds a condition chip for each field. Each chip shows{" "}
              <span className="font-medium text-foreground">Field is [Value]</span>{" "}
              with a coloured dropdown and a clear control. Sort and column visibility sit
              at the right of the filter bar, separated from page actions by{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">DataTableToolbarActions</code>.
              The result count and{" "}
              <span className="font-medium text-foreground">Clear all</span> link always sit
              below the filtered content as plain metadata, outside the table border.
              Use the same placement for non-table views (calendars, card grids): toolbar
              at the top, content in the middle, footer at the bottom.
            </p>
            <ComponentPreview label="Preview">
              <FilteredSchemesTable />
            </ComponentPreview>
            <div className="mt-3 space-y-3">
              <CodeBlock code={USAGE_COMPOUND} language="tsx" />
              <CodeBlock code={USAGE_TOOLBAR_ACTIONS} language="tsx" />
            </div>
          </div>

          {/* Toolbar actions guidance */}
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">Toolbar page actions</p>
            <p className="mb-3 text-sm text-ink-muted">
              Create, upload, and export buttons live in the{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">controls</code>{" "}
              slot of{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">DataTableCompoundToolbar</code>,
              wrapped in{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">DataTableToolbarActions</code>.
              The left border separates page actions from sort and column toggles. Use{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">variant=&quot;outline&quot;</code>{" "}
              for secondary actions (Upload, Export) and one default{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">Button</code>{" "}
              for the primary action (New document). Max two buttons in the group.
              Never place these in the filter row beside search or condition chips.
            </p>
            <div className="rounded-sm border border-border bg-off-white px-4 py-3 text-sm text-ink-muted">
              <p className="font-semibold text-foreground">Filter row (children)</p>
              <p className="mt-1">Search, filter condition chips, + Filter. These refine what is shown.</p>
              <p className="mt-3 font-semibold text-foreground">Controls row (controls)</p>
              <p className="mt-1">Sort, Columns, then DataTableToolbarActions for page CTAs. These change or add data.</p>
              <p className="mt-3 font-semibold text-foreground">Footer (footer prop)</p>
              <p className="mt-1">Result count and Clear all only. Never put action buttons here.</p>
            </div>
          </div>

          {/* Example 4: Card view toggle */}
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">Table with card view toggle</p>
            <p className="mb-3 text-sm text-ink-muted">
              The same scheme data with a Table / Cards toggle. Use this pattern when entities have a visual
              identity (initials, health colour, icon) and users browse on mobile. Always keep the table
              view as the default — it is better for comparison and data-dense reading.
            </p>
            <ComponentPreview label="Preview">
              <TableWithCardToggle />
            </ComponentPreview>
          </div>

          {/* Framed false */}
          <div>
            <p className="mb-1 text-sm font-semibold text-foreground">
              Inside a Widget — <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">framed={"{false}"}</code>
            </p>
            <p className="mb-3 text-sm text-ink-muted">
              When the table lives inside an existing bordered container (a Widget, a card) pass{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">framed={"{false}"}</code>{" "}
              so the outer rounded border and shadow are omitted. The header stripe and dividers still render.
            </p>
            <CodeBlock code={USAGE_FRAMED_FALSE} language="tsx" />
          </div>

        </div>
      </section>

      {/* Props */}
      <section className="border-t border-border pt-10">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-widest text-ink-muted">Props</h2>

        <div className="space-y-8">
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTable</p>
            <PropTable props={TABLE_PROPS} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTableRow</p>
            <PropTable props={ROW_PROPS} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTableCell</p>
            <PropTable props={CELL_PROPS} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTableSearch</p>
            <PropTable props={SEARCH_PROPS} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTableFilterChips</p>
            <p className="mb-3 text-sm text-ink-muted">
              Simple inline pill chips — best for 3–5 mutually exclusive options shown permanently in the toolbar.
              For multi-field, additive filtering use the compound filter pattern shown in Example 3 above.
            </p>
            <PropTable props={CHIPS_PROPS} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTableToolbar</p>
            <p className="mb-3 text-sm text-ink-muted">
              Wrapper component — renders a{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">flex-wrap items-center gap-3</code>{" "}
              row. Pass as the <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">toolbar</code>{" "}
              prop of <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">DataTable</code>.
              Accepts any children.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTableCount</p>
            <p className="mb-3 text-sm text-ink-muted">
              Renders <span className="text-foreground font-medium">N rows</span> when unfiltered,{" "}
              <span className="text-foreground font-medium">N of M rows</span> when filtered.
              Props: <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">filtered</code>,{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">total</code>,{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">noun</code> (defaults to <span className="text-foreground">&ldquo;rows&rdquo;</span>).
              Do not place this in the toolbar. Pass these props to{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">DataTableFooter</code>{" "}
              so the count sits below the table or filtered view.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTableCompoundToolbar</p>
            <p className="mb-3 text-sm text-ink-muted">
              Layout wrapper for the compound filter bar. Pass search and filter condition chips as{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">children</code>.
              Pass sort, column visibility, and page action buttons via{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">controls</code>.
              Wrap create/upload/export buttons in{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">DataTableToolbarActions</code>{" "}
              so they stay visually distinct from table controls.
            </p>
            <PropTable props={[
              { name: "children", type: "ReactNode", default: "—", description: "Search input, active filter condition chips, and the + Filter button." },
              { name: "controls", type: "ReactNode", default: "undefined", description: "Sort, Columns, and DataTableToolbarActions for page CTAs." },
            ]} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTableToolbarActions</p>
            <p className="mb-3 text-sm text-ink-muted">
              Groups page-level CTAs in the compound toolbar controls slot. Renders a left border
              divider so Upload, New document, Export, and similar buttons are clearly separate
              from sort and column toggles. Place after table controls; max two buttons with one
              primary (default variant) only.
            </p>
            <PropTable props={[
              { name: "children", type: "ReactNode", default: "—", description: "One or two Button elements: outline for secondary, default for primary." },
            ]} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTableFooter</p>
            <p className="mb-3 text-sm text-ink-muted">
              Table footer with result count and optional Clear all link. Renders below
              the table frame (or below any alternate content such as a card grid or calendar),
              outside the border. Pass as the{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">footer</code>{" "}
              prop of <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">DataTable</code>,
              or place it manually at the bottom of a{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">space-y-3</code>{" "}
              wrapper when the content is not a table.
            </p>
            <PropTable props={[
              { name: "filtered", type: "number", default: "—", description: "Number of rows after filtering." },
              { name: "total", type: "number", default: "—", description: "Total rows before filtering." },
              { name: "noun", type: "string", default: '"rows"', description: "Noun for the count label, e.g. issues, lots, schemes." },
              { name: "showClear", type: "boolean", default: "false", description: "When true, renders Clear all beside the count." },
              { name: "onClearAll", type: "() => void", default: "undefined", description: "Called when the user clicks Clear all." },
            ]} />
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold text-foreground">DataTableClearAll</p>
            <p className="mb-3 text-sm text-ink-muted">
              Forest-coloured reset link. Usually rendered by{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">DataTableFooter</code>{" "}
              when <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">showClear</code> is true.
              Props: <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">onClick</code>.
            </p>
          </div>
        </div>
      </section>

    </DocsPage>
  )
}
