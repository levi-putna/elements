"use client"

import * as React from "react"
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  differenceInDays,
  format,
  isBefore,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns"
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  Building2,
  Calendar,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock,
  ClipboardList,
  Columns3,
  DollarSign,
  FileText,
  Gavel,
  Info,
  List,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Plus,
  Scale,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react"

import {
  AgentAction,
  AgentActionList,
  type AgentActionUrgency,
} from "@/components/ui/agent-action"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DataTable,
  DataTableCell,
  DataTableCompoundToolbar,
  DataTableFilterChips,
  DataTableFooter,
  DataTableRow,
  DataTableSearch,
  DataTableToolbar,
  DataTableToolbarActions,
  type DataTableColumn,
} from "@/components/ui/data-table"
import {
  SchemePlanBadge,
  type SchemeSummary,
} from "@/components/ui/scheme"
import {
  Widget,
  WidgetAction,
  WidgetContent,
  WidgetFooter,
  WidgetGrid,
  WidgetHeader,
  WidgetList,
  WidgetListItem,
  WidgetTitle,
} from "@/components/ui/widget"
import { cn } from "@/lib/utils"
import { PORTFOLIO_PROPERTIES } from "@/components/preview/properties-index"
import {
  AddFilterButton,
  CompoundColumnsButton,
  CompoundSortButton,
  FilterConditionChip,
  type CompoundFilterCondition,
  type CompoundFilterFieldConfig,
} from "@/components/preview/compound-filter-bar"
import { useLaunchCowork } from "@/components/preview/agent-launch-context"
import { getPreviewLotRowsForProperty } from "@/lib/preview-owners"

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export type PropertyTab =
  | "overview"
  | "issues"
  | "owners"
  | "committee"
  | "meetings"
  | "finance"
  | "maintenance"
  | "contractors"
  | "insurance"
  | "documents"
  | "compliance"
  | "communications"

export interface SubNavItem {
  id: PropertyTab
  label: string
  icon: React.ElementType
  badge?: string
  badgeTone?: "warning" | "danger"
}

// ─────────────────────────────────────────────────────────
// Demo data: Harbour View Towers (QLD, Standard Module)
//
// QLD trust model: body corporate holds its own bank account;
// the manager is an authorised signatory only. Admin and
// Sinking funds are tracked as separate ledger lines in the
// same account. No cross-fund transfers are permitted.
// ─────────────────────────────────────────────────────────

/** Extended property detail, built on top of SchemeSummary. */
interface PropertyDetail {
  legalEntity: string
  regulationModule: string
  trustModel: "direct" | "pooled"
  schemeType: "Residential" | "Commercial" | "Mixed Use"
  address: string
  suburb: string
  state: string
  postcode: string
  managementStart: string
  managementEnd: string
  bankBsb: string
  bankAccount: string
  bankName: string
}

const PROPERTY_DETAIL_DATA: Record<string, PropertyDetail> = {
  "harbour-view": {
    legalEntity: "Harbour View Towers Body Corporate",
    regulationModule: "Standard Module",
    trustModel: "direct",
    schemeType: "Residential",
    address: "1-42 Harbour View Drive",
    suburb: "Kangaroo Point",
    state: "QLD",
    postcode: "4169",
    managementStart: "1 Jul 2024",
    managementEnd: "30 Jun 2026",
    bankBsb: "062-000",
    bankAccount: "12345678",
    bankName: "Commonwealth Bank",
  },
  "northbridge": {
    legalEntity: "Northbridge Estate Body Corporate",
    regulationModule: "Standard Module",
    trustModel: "direct",
    schemeType: "Residential",
    address: "100-128 Estate Drive",
    suburb: "Northbridge",
    state: "QLD",
    postcode: "4051",
    managementStart: "1 Jul 2023",
    managementEnd: "30 Jun 2026",
    bankBsb: "034-000",
    bankAccount: "87654321",
    bankName: "Westpac",
  },
  "the-quarter": {
    legalEntity: "The Quarter Body Corporate",
    regulationModule: "Standard Module",
    trustModel: "direct",
    schemeType: "Mixed Use",
    address: "88-112 Quarter Lane",
    suburb: "South Brisbane",
    state: "QLD",
    postcode: "4101",
    managementStart: "1 Jan 2024",
    managementEnd: "31 Dec 2025",
    bankBsb: "012-000",
    bankAccount: "11223344",
    bankName: "ANZ",
  },
  "parkside": {
    legalEntity: "Parkside Residences Body Corporate",
    regulationModule: "Small Schemes Module",
    trustModel: "direct",
    schemeType: "Residential",
    address: "22-38 Parkside Street",
    suburb: "Fortitude Valley",
    state: "QLD",
    postcode: "4006",
    managementStart: "15 Mar 2025",
    managementEnd: "14 Mar 2027",
    bankBsb: "033-000",
    bankAccount: "55667788",
    bankName: "NAB",
  },
  "sunset-gardens": {
    legalEntity: "Sunset Gardens Owners Corporation",
    regulationModule: "N/A",
    trustModel: "pooled",
    schemeType: "Residential",
    address: "5-13 Sunset Avenue",
    suburb: "Surry Hills",
    state: "NSW",
    postcode: "2010",
    managementStart: "1 Jul 2025",
    managementEnd: "30 Jun 2028",
    bankBsb: "032-000",
    bankAccount: "99887766",
    bankName: "ANZ Trust Account",
  },
}

/** Finance snapshot for Harbour View Towers (QLD direct model). */
const HVT_FINANCE = {
  adminFund: {
    balance: 248450,
    annualBudget: 186200,
    quarterlyLevy: 46550,
    leviesRaised: 46550,
    leviesReceived: 39200,
    leviesOutstanding: 7350,
  },
  sinkingFund: {
    balance: 145200,
    annualBudget: 84000,
    quarterlyLevy: 21000,
    leviesRaised: 21000,
    leviesReceived: 18600,
    leviesOutstanding: 2400,
  },
  levyPerLot: {
    adminQuarterly: 1108,
    sinkingQuarterly: 500,
  },
  lastReconciliation: "15 Jun 2026",
  nextLevyDue: "1 Jul 2026",
}

interface ArrearsRow {
  lot: number
  ownerName: string
  amount: number
  daysOverdue: number
  fundSplit: string
}

const HVT_ARREARS: ArrearsRow[] = [
  { lot: 7, ownerName: "Robert Davis", amount: 8250, daysOverdue: 47, fundSplit: "Admin + Sinking" },
  { lot: 23, ownerName: "Emma Thompson", amount: 2875, daysOverdue: 28, fundSplit: "Admin + Sinking" },
  { lot: 38, ownerName: "Michael O'Brien", amount: 1275, daysOverdue: 14, fundSplit: "Admin only" },
]

interface TransactionRow {
  date: string
  description: string
  fund: "admin" | "sinking"
  amount: number
  reference: string
}

const HVT_TRANSACTIONS: TransactionRow[] = [
  { date: "15 Jun 2026", description: "Levy payment — Lot 14", fund: "admin", amount: 1108, reference: "LVY-2026-Q3-014" },
  { date: "14 Jun 2026", description: "Lift maintenance invoice — Harbour Lift Services", fund: "admin", amount: -4200, reference: "INV-0441" },
  { date: "13 Jun 2026", description: "Insurance premium — NRMA building policy", fund: "admin", amount: -18450, reference: "INS-NRMA-2026" },
  { date: "12 Jun 2026", description: "Levy payment — Lot 22", fund: "admin", amount: 1108, reference: "LVY-2026-Q3-022" },
  { date: "11 Jun 2026", description: "Sinking levy payment — Lot 5", fund: "sinking", amount: 500, reference: "LVY-2026-Q3-005S" },
  { date: "10 Jun 2026", description: "Garden maintenance — Green Gardens Co", fund: "admin", amount: -1200, reference: "INV-0438" },
  { date: "9 Jun 2026", description: "Levy payment — Lot 31", fund: "admin", amount: 1108, reference: "LVY-2026-Q3-031" },
  { date: "9 Jun 2026", description: "Sinking levy payment — Lot 12", fund: "sinking", amount: 500, reference: "LVY-2026-Q3-012S" },
]

/** Lot rows for Harbour View owners roll preview data. */
const HVT_LOTS = getPreviewLotRowsForProperty({ propertyId: "harbour-view" })

interface CommitteeMember {
  role: string
  name: string
  lot: number
  email?: string
  phone?: string
  electedDate: string
}

const HVT_COMMITTEE: CommitteeMember[] = [
  { role: "Chairperson", name: "Jennifer Walsh", lot: 31, email: "j.walsh@example.com", phone: "0477 890 123", electedDate: "20 Aug 2025" },
  { role: "Secretary", name: "James Okonkwo", lot: 1, email: "james@example.com", phone: "0411 234 567", electedDate: "20 Aug 2025" },
  { role: "Treasurer", name: "Patricia Kim", lot: 18, email: "pkim@example.com", phone: "0455 678 901", electedDate: "20 Aug 2025" },
  { role: "Member", name: "Margaret Chen", lot: 14, email: "m.chen@example.com", electedDate: "20 Aug 2025" },
  { role: "Member", name: "Thomas Brown", lot: 27, electedDate: "20 Aug 2025" },
]

interface MeetingRow {
  id: string
  type: "agm" | "egm" | "committee"
  date: string
  time?: string
  format: string
  status: "upcoming" | "notice-due" | "past"
  agenda?: string[]
  minutesStatus?: "draft" | "approved" | "pending"
  noticeDueDate?: string
}

const HVT_MEETINGS: MeetingRow[] = [
  {
    id: "mtg-committee-jun-prep",
    type: "committee",
    date: "19 Jun 2026",
    time: "2:00 pm",
    format: "Zoom",
    status: "upcoming",
    agenda: ["Pre-read committee pack", "Lift 2 quote comparison"],
  },
  {
    id: "mtg-committee-jun",
    type: "committee",
    date: "24 Jun 2026",
    time: "10:00 am",
    format: "Zoom",
    status: "upcoming",
    agenda: ["Lift 2 repair quotes", "Insurance renewal decision", "Q3 levy reconciliation"],
  },
  {
    id: "mtg-egm-jul",
    type: "egm",
    date: "3 Jul 2026",
    time: "6:00 pm",
    format: "In person — Common room",
    status: "upcoming",
    agenda: ["Roof replacement special resolution", "Quorum confirmation"],
  },
  {
    id: "mtg-committee-jul-early",
    type: "committee",
    date: "8 Jul 2026",
    time: "11:00 am",
    format: "Zoom",
    status: "upcoming",
    agenda: ["Fire safety cert review", "EGM preparation"],
  },
  {
    id: "mtg-committee-jul",
    type: "committee",
    date: "15 Jul 2026",
    time: "10:00 am",
    format: "Zoom",
    status: "upcoming",
    agenda: ["EGM follow-up", "Contractor performance review"],
  },
  {
    id: "mtg-committee-aug",
    type: "committee",
    date: "7 Aug 2026",
    time: "10:00 am",
    format: "Zoom",
    status: "upcoming",
    agenda: ["AGM preparation", "Draft budget walkthrough"],
  },
  {
    id: "mtg-agm-aug",
    type: "agm",
    date: "20 Aug 2026",
    format: "In person — Unit 31",
    status: "notice-due",
    noticeDueDate: "18 Jul 2026",
    agenda: ["2026-27 budget approval", "Election of committee", "Maintenance plan review", "By-law amendments"],
  },
  {
    id: "mtg-committee-aug-follow",
    type: "committee",
    date: "28 Aug 2026",
    time: "10:00 am",
    format: "Zoom",
    status: "upcoming",
    agenda: ["AGM follow-up", "Budget implementation"],
  },
  {
    id: "mtg-committee-sep",
    type: "committee",
    date: "16 Sep 2026",
    time: "10:00 am",
    format: "Zoom",
    status: "upcoming",
    agenda: ["Q4 levy forecast", "Maintenance plan progress"],
  },
  {
    id: "mtg-committee-may",
    type: "committee",
    date: "15 May 2026",
    time: "10:00 am",
    format: "Zoom",
    status: "past",
    minutesStatus: "approved",
  },
  {
    id: "mtg-agm-aug25",
    type: "agm",
    date: "20 Aug 2025",
    format: "In person — Unit 31",
    status: "past",
    minutesStatus: "approved",
  },
]

type CalendarEntryKind = "committee" | "agm" | "egm" | "notice-due" | "minutes-due" | "compliance"

interface CalendarEntry {
  id: string
  kind: CalendarEntryKind
  title: string
  date: string
  time?: string
  durationMinutes?: number
  subtitle?: string
  status: "upcoming" | "notice-due" | "past" | "action"
  agenda?: string[]
  minutesStatus?: "draft" | "approved" | "pending"
  meetingId?: string
}

/** Statutory milestones and prep reminders alongside formal meetings. */
const HVT_MILESTONES: CalendarEntry[] = [
  {
    id: "ms-committee-pack",
    kind: "compliance",
    title: "Committee pack due",
    date: "21 Jun 2026",
    subtitle: "Circulate to members before Tuesday meeting",
    status: "action",
    meetingId: "mtg-committee-jun",
  },
  {
    id: "ms-notice-agm",
    kind: "notice-due",
    title: "AGM notice deadline",
    date: "18 Jul 2026",
    subtitle: "Issue notice for 20 Aug AGM",
    status: "action",
    meetingId: "mtg-agm-aug",
  },
  {
    id: "ms-fire-cert",
    kind: "compliance",
    title: "Fire safety cert due",
    date: "5 Jul 2026",
    subtitle: "Annual AFSS lodgement",
    status: "upcoming",
  },
  {
    id: "ms-budget-review",
    kind: "compliance",
    title: "Draft budget review",
    date: "23 Jul 2026",
    time: "11:00 am",
    durationMinutes: 45,
    subtitle: "Treasurer and manager sign-off",
    status: "upcoming",
    meetingId: "mtg-agm-aug",
  },
  {
    id: "ms-minutes-may",
    kind: "minutes-due",
    title: "May committee minutes",
    date: "29 May 2026",
    subtitle: "21-day approval window",
    status: "past",
    meetingId: "mtg-committee-may",
  },
  {
    id: "ms-agm-walkthrough",
    kind: "compliance",
    title: "Pre-AGM site walk",
    date: "15 Aug 2026",
    time: "2:00 pm",
    durationMinutes: 60,
    subtitle: "Common property inspection before AGM",
    status: "upcoming",
    meetingId: "mtg-agm-aug",
  },
  {
    id: "ms-post-agm",
    kind: "notice-due",
    title: "Post-AGM minutes due",
    date: "27 Aug 2026",
    subtitle: "Circulate within 21 days of AGM",
    status: "upcoming",
    meetingId: "mtg-agm-aug",
  },
]

interface MaintenanceIssue {
  id: string
  title: string
  location: string
  priority: "emergency" | "urgent" | "routine"
  status: "open" | "in-progress" | "pending-approval"
  reported: string
  assignedTo?: string
  estimatedCost?: number
  requiresResolution?: boolean
}

const HVT_MAINTENANCE: MaintenanceIssue[] = [
  { id: "mnt-001", title: "Lift 2 out of service", location: "Main building, all floors", priority: "emergency", status: "in-progress", reported: "17 Jun 2026", assignedTo: "Harbour Lift Services", estimatedCost: 18000, requiresResolution: true },
  { id: "mnt-002", title: "Water ingress Level 8 corridor", location: "Level 8, north corridor", priority: "emergency", status: "open", reported: "14 Jun 2026", estimatedCost: 5500 },
  { id: "mnt-003", title: "Intercom fault — main entry", location: "Ground floor entry", priority: "urgent", status: "in-progress", reported: "10 Jun 2026", assignedTo: "TechSec Systems", estimatedCost: 650 },
  { id: "mnt-004", title: "Garden irrigation fault", location: "Common area gardens", priority: "urgent", status: "open", reported: "8 Jun 2026" },
  { id: "mnt-005", title: "Handrail loose — car park ramp", location: "Car park Level B1", priority: "urgent", status: "pending-approval", reported: "5 Jun 2026", estimatedCost: 380 },
  { id: "mnt-006", title: "Lightbulb replacement — Level 3 lobby", location: "Level 3 lobby", priority: "routine", status: "open", reported: "2 Jun 2026" },
  { id: "mnt-007", title: "Lightbulb replacement — Level 5 lobby", location: "Level 5 lobby", priority: "routine", status: "open", reported: "2 Jun 2026" },
  { id: "mnt-008", title: "Gutter cleaning required", location: "Rooftop perimeter", priority: "routine", status: "open", reported: "1 Jun 2026", estimatedCost: 850 },
]

interface InsurancePolicy {
  id: string
  type: string
  insurer: string
  policyNumber: string
  coverAmount?: string
  premium?: number
  expiry: string
  status: "current" | "expiring" | "expired" | "renewal-pending"
}

const HVT_INSURANCE: InsurancePolicy[] = [
  { id: "ins-001", type: "Building insurance", insurer: "NRMA", policyNumber: "NRM-2024-4821", coverAmount: "$24,500,000", premium: 18450, expiry: "18 Jun 2026", status: "renewal-pending" },
  { id: "ins-002", type: "Public liability", insurer: "NRMA", policyNumber: "NRM-2024-4822", coverAmount: "$20,000,000", premium: 2200, expiry: "18 Jun 2027", status: "current" },
  { id: "ins-003", type: "Voluntary workers", insurer: "NRMA", policyNumber: "NRM-2024-4823", coverAmount: "$5,000,000", premium: 420, expiry: "18 Jun 2027", status: "current" },
]

interface ComplianceItem {
  id: string
  title: string
  category: "fire" | "lift" | "pool" | "statutory" | "bylaw"
  dueDate: string
  status: "current" | "due-soon" | "overdue" | "pending-inspection"
  notes?: string
}

const HVT_COMPLIANCE: ComplianceItem[] = [
  { id: "comp-001", title: "Annual Fire Safety Statement (AFSS)", category: "fire", dueDate: "30 Jun 2026", status: "overdue", notes: "Contractor engaged. Inspection booked 28 Jun 2026." },
  { id: "comp-002", title: "Lift registration renewal", category: "lift", dueDate: "15 Jul 2026", status: "due-soon", notes: "Annual inspection by SafeWork QLD." },
  { id: "comp-003", title: "Body Corporate strata roll update", category: "statutory", dueDate: "30 Jun 2026", status: "current" },
  { id: "comp-004", title: "Annual general meeting (AGM)", category: "statutory", dueDate: "20 Aug 2026", status: "current", notes: "Notice to be issued by 18 Jul 2026." },
  { id: "comp-005", title: "Financial statement preparation", category: "statutory", dueDate: "31 Jul 2026", status: "current", notes: "Audit exemption likely to apply. Confirm with Alex." },
]

// ─────────────────────────────────────────────────────────
// Sub-navigation
// ─────────────────────────────────────────────────────────

export const SUB_NAV_ITEMS: SubNavItem[] = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "issues", label: "Issues", icon: CircleDot, badge: "5", badgeTone: "warning" },
  { id: "owners", label: "Owners", icon: Users },
  { id: "committee", label: "Committee", icon: User },
  { id: "meetings", label: "Meetings", icon: Calendar },
  { id: "finance", label: "Finance", icon: DollarSign },
  { id: "maintenance", label: "Maintenance", icon: Wrench, badge: "2", badgeTone: "danger" },
  { id: "contractors", label: "Contractors", icon: ClipboardList },
  { id: "insurance", label: "Insurance", icon: Shield, badge: "!", badgeTone: "danger" },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "compliance", label: "Compliance", icon: ShieldCheck, badge: "1", badgeTone: "danger" },
  { id: "communications", label: "Communications", icon: MessageSquare },
]

// ─────────────────────────────────────────────────────────
// PropertySidebarHeader
//
// Rich property card for the sidebar, placed above the
// section nav items in PropertySidebarNav.
//
// Thumbnail: scheme's imageUrl if set, otherwise a Google
// Maps Static image (2× for retina, marker in forest green).
//
// Renders full-bleed — the caller must NOT wrap it in a
// SidebarGroup so the map image reaches the sidebar edges.
// ─────────────────────────────────────────────────────────

/**
 * Builds a Static Maps URL centred on the given address string.
 * @param fullAddress - Full human-readable address passed directly to the API.
 * @param size - Maps API size string, e.g. "480x220". Rendered at half that
 *   in CSS (scale=2 for retina). Defaults to 480×220 (sidebar thumbnail).
 */
function buildStaticMapUrl(fullAddress: string, size = "480x220"): string | null {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (!apiKey) return null
  const enc = encodeURIComponent(fullAddress)
  return (
    "https://maps.googleapis.com/maps/api/staticmap" +
    `?center=${enc}` +
    "&zoom=16" +
    `&size=${size}` +
    "&scale=2" +
    "&maptype=roadmap" +
    // Forest green marker: 0x043F2E
    `&markers=color:0x043F2E|size:small|${enc}` +
    `&key=${apiKey}`
  )
}

/**
 * Rich property card rendered at the top of the contextual sidebar nav.
 * Shows a full-bleed map thumbnail (or profile photo) followed by the
 * property name, street address, and key stats on the sidebar's dark theme.
 *
 * Automatically hidden when the sidebar collapses to icon mode.
 */
export function PropertySidebarHeader({ propertyId }: { propertyId: string }) {
  const scheme = PORTFOLIO_PROPERTIES.find((p) => p.id === propertyId)
  const detail = PROPERTY_DETAIL_DATA[propertyId]
  if (!scheme || !detail) return null

  const fullAddress = `${detail.address}, ${detail.suburb} ${detail.state} ${detail.postcode}`
  const thumbnailSrc = scheme.imageUrl ?? buildStaticMapUrl(fullAddress)

  return (
    <div className="shrink-0 group-data-[collapsible=icon]:hidden">
      {/* Map thumbnail: full sidebar width, no horizontal padding */}
      {thumbnailSrc ? (
        <div className="overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={thumbnailSrc}
            alt={`Map showing location of ${scheme.name}`}
            className="h-[110px] w-full object-cover"
          />
        </div>
      ) : null}

      {/* Identity text on the sidebar's dark background */}
      <div className="px-3 pb-2.5 pt-2">
        <p className="text-sm font-semibold leading-tight text-sidebar-foreground">
          {scheme.name}
        </p>
        <p className="mt-0.5 text-[11px] leading-snug text-sidebar-foreground/60">
          {detail.address}, {detail.suburb}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 gap-y-0">
          {scheme.plan && (
            <span className="font-mono text-[10px] text-sidebar-foreground/50">{scheme.plan}</span>
          )}
          <span className="text-[10px] text-sidebar-foreground/30" aria-hidden>·</span>
          <span className="text-[10px] text-sidebar-foreground/50">{scheme.lotCount} lots</span>
          <span className="text-[10px] text-sidebar-foreground/30" aria-hidden>·</span>
          <span className="text-[10px] text-sidebar-foreground/50">
            {detail.state}{detail.regulationModule !== "N/A" ? ` · ${detail.regulationModule}` : ""}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Helper: format currency
// ─────────────────────────────────────────────────────────

function formatCurrency(amount: number): string {
  if (Math.abs(amount) >= 1000) {
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(amount)
}

// ─────────────────────────────────────────────────────────
// Overview tab
// ─────────────────────────────────────────────────────────

interface OverviewTabProps {
  propertyId: string
  onNavigate: (tab: PropertyTab) => void
}

/** Property overview dashboard: facts, financial snapshot, compliance, maintenance, meetings. */
function OverviewTab({ propertyId, onNavigate }: OverviewTabProps) {
  const scheme = PORTFOLIO_PROPERTIES.find((p) => p.id === propertyId)
  const detail = PROPERTY_DETAIL_DATA[propertyId]

  if (!scheme || !detail) return null

  const openEmergency = HVT_MAINTENANCE.filter((i) => i.priority === "emergency").length
  const openUrgent = HVT_MAINTENANCE.filter((i) => i.priority === "urgent").length
  const openRoutine = HVT_MAINTENANCE.filter((i) => i.priority === "routine").length
  const totalArrears = HVT_ARREARS.reduce((sum, a) => sum + a.amount, 0)
  const overdueLevies = HVT_FINANCE.adminFund.leviesOutstanding + HVT_FINANCE.sinkingFund.leviesOutstanding
  const nextMeeting = HVT_MEETINGS.find((m) => m.status === "upcoming")

  // Map thumbnail for the facts card.
  // Use a landscape-friendly size (360×240 → 180×120 CSS px at 2×).
  const fullAddress = `${detail.address}, ${detail.suburb} ${detail.state} ${detail.postcode}`
  const mapThumbnail = scheme.imageUrl ?? buildStaticMapUrl(fullAddress, "360x240")

  return (
    <div className="space-y-8">
      {/* Property facts card: map thumbnail left, identity fields right */}
      <div className="overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <div className="flex">
          {/* Map / photo: hidden on mobile, full-height image on sm+ */}
          {mapThumbnail ? (
            <div className="hidden shrink-0 sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={mapThumbnail}
                alt={`Map showing location of ${scheme.name}`}
                className="h-full w-[180px] object-cover"
              />
            </div>
          ) : null}

          {/* Detail fields: border-l only when the image is present */}
          <div className={cn(
            "flex-1 grid grid-cols-1 gap-x-8 gap-y-5 p-5 sm:grid-cols-3",
            mapThumbnail ? "sm:border-l sm:border-border" : ""
          )}>
            {/* Legal entity and plan */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Legal entity</p>
              <p className="mt-1.5 text-sm font-medium text-foreground">{detail.legalEntity}</p>
              <div className="mt-1.5 flex items-center gap-1.5">
                <SchemePlanBadge plan={scheme.plan} />
                <Badge variant="outline" size="sm">{detail.state}</Badge>
                <Badge variant="default" size="sm">{detail.regulationModule}</Badge>
              </div>
            </div>

            {/* Address */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Address</p>
              <p className="mt-1.5 flex items-start gap-1.5 text-sm text-foreground">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-ink-muted" aria-hidden />
                {detail.address}, {detail.suburb} {detail.state} {detail.postcode}
              </p>
            </div>

            {/* Management agreement */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Management agreement</p>
              <p className="mt-1.5 text-sm text-foreground">{detail.managementStart} to {detail.managementEnd}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{scheme.managerName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Three-column snapshots */}
      <WidgetGrid columns={3}>
        {/* Financial snapshot */}
        <Widget>
          <WidgetHeader>
            <WidgetTitle icon={DollarSign}>Financial</WidgetTitle>
            <WidgetAction onClick={() => onNavigate("finance")}>Finance</WidgetAction>
          </WidgetHeader>
          <WidgetContent className="px-4 pb-4 pt-2 space-y-3">
            {/* Fund balances: headline numbers only, detail lives in Finance tab */}
            <div className="grid grid-cols-2 gap-px bg-border rounded-xs overflow-hidden">
              <div className="bg-white px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Admin Fund</p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-forest">
                  {formatCurrency(HVT_FINANCE.adminFund.balance)}
                </p>
              </div>
              <div className="bg-white px-3 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Sinking Fund</p>
                <p className="mt-2 text-xl font-semibold tracking-tight text-forest">
                  {formatCurrency(HVT_FINANCE.sinkingFund.balance)}
                </p>
              </div>
            </div>
            {/* Arrears */}
            {totalArrears > 0 ? (
              <div className="flex items-center justify-between rounded-xs border border-warning-soft bg-warning-soft/50 px-3 py-2">
                <div>
                  <p className="text-xs font-semibold text-warning">{formatCurrency(totalArrears)} in arrears</p>
                  <p className="text-[11px] text-ink-muted">{HVT_ARREARS.length} lots overdue</p>
                </div>
                <TrendingDown className="size-4 text-warning" aria-hidden />
              </div>
            ) : null}
            <p className="text-[11px] text-ink-muted">Last reconciled {HVT_FINANCE.lastReconciliation}</p>
          </WidgetContent>
        </Widget>

        {/* Compliance snapshot */}
        <Widget>
          <WidgetHeader>
            <WidgetTitle icon={ShieldCheck}>Compliance</WidgetTitle>
            <WidgetAction onClick={() => onNavigate("compliance")}>View all</WidgetAction>
          </WidgetHeader>
          <WidgetContent flush>
            <WidgetList>
              {HVT_COMPLIANCE.slice(0, 4).map((item) => (
                <WidgetListItem
                  key={item.id}
                  icon={ShieldCheck}
                  iconTone={
                    item.status === "overdue" ? "danger"
                      : item.status === "due-soon" ? "warning"
                        : "default"
                  }
                  title={item.title}
                  meta={`Due ${item.dueDate}`}
                  href="#"
                  trailing={
                    <Badge
                      variant={
                        item.status === "overdue" ? "destructive"
                          : item.status === "due-soon" ? "warning"
                            : "accent"
                      }
                      size="sm"
                    >
                      {item.status === "overdue" ? "Overdue" : item.status === "due-soon" ? "Due soon" : "Current"}
                    </Badge>
                  }
                />
              ))}
            </WidgetList>
          </WidgetContent>
          {/* Insurance alert */}
          <WidgetFooter>
            <span className="flex items-center gap-1.5 text-danger">
              <AlertTriangle className="size-3.5 shrink-0" aria-hidden />
              Building insurance expired 18 Jun 2026
            </span>
            <WidgetAction onClick={() => onNavigate("insurance")}>Insurance</WidgetAction>
          </WidgetFooter>
        </Widget>

        {/* Maintenance snapshot */}
        <Widget>
          <WidgetHeader>
            <WidgetTitle icon={Wrench}>Maintenance</WidgetTitle>
            <WidgetAction onClick={() => onNavigate("maintenance")}>View all</WidgetAction>
          </WidgetHeader>
          <WidgetContent flush>
            <WidgetList>
              {HVT_MAINTENANCE.filter((i) => i.priority !== "routine").slice(0, 3).map((issue) => (
                <WidgetListItem
                  key={issue.id}
                  icon={Wrench}
                  iconTone={issue.priority === "emergency" ? "danger" : "warning"}
                  title={issue.title}
                  meta={issue.assignedTo ? `${issue.assignedTo} · ${issue.reported}` : issue.reported}
                  href="#"
                  trailing={
                    <Badge
                      variant={issue.priority === "emergency" ? "destructive" : "warning"}
                      size="sm"
                    >
                      {issue.priority === "emergency" ? "Emergency" : "Urgent"}
                    </Badge>
                  }
                />
              ))}
            </WidgetList>
          </WidgetContent>
          <WidgetFooter>
            <span>{openEmergency} emergency · {openUrgent} urgent · {openRoutine} routine</span>
            <WidgetAction onClick={() => onNavigate("maintenance")}>All issues</WidgetAction>
          </WidgetFooter>
        </Widget>
      </WidgetGrid>

      {/* Next meeting + quick links */}
      <WidgetGrid columns={2}>
        {/* Next meeting */}
        <Widget>
          <WidgetHeader>
            <WidgetTitle icon={Calendar}>Next meeting</WidgetTitle>
            <WidgetAction onClick={() => onNavigate("meetings")}>Meetings</WidgetAction>
          </WidgetHeader>
          {nextMeeting ? (
            <WidgetContent className="px-4 pb-4 pt-2">
              <div className="rounded-xs bg-lime-soft px-3.5 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-forest capitalize">
                      {nextMeeting.type === "agm" ? "AGM" : nextMeeting.type === "egm" ? "EGM" : "Committee meeting"}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-muted">
                      {nextMeeting.date}{nextMeeting.time ? ` · ${nextMeeting.time}` : ""} · {nextMeeting.format}
                    </p>
                  </div>
                  <Badge variant="accent" size="sm">
                    {nextMeeting.status === "notice-due" ? "Notice due" : "Confirmed"}
                  </Badge>
                </div>
                {nextMeeting.agenda && nextMeeting.agenda.length > 0 && (
                  <ul className="mt-2 space-y-0.5">
                    {nextMeeting.agenda.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-start gap-1.5 text-xs text-ink-muted">
                        <span className="mt-1 size-1 shrink-0 rounded-full bg-forest/40" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </WidgetContent>
          ) : (
            <WidgetContent className="flex h-20 items-center justify-center px-4">
              <p className="text-sm text-ink-muted">No meetings scheduled.</p>
            </WidgetContent>
          )}
        </Widget>

        {/* Quick links grid */}
        <Widget>
          <WidgetHeader>
            <WidgetTitle icon={ArrowRight}>Quick links</WidgetTitle>
          </WidgetHeader>
          <WidgetContent className="px-4 pb-4 pt-2">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {[
                { label: "Owners & Roll", tab: "owners" as PropertyTab, icon: Users, meta: `${HVT_LOTS.length} lots shown` },
                { label: "Finance", tab: "finance" as PropertyTab, icon: DollarSign, meta: `Last recon ${HVT_FINANCE.lastReconciliation}` },
                { label: "Meetings", tab: "meetings" as PropertyTab, icon: Calendar, meta: "AGM 20 Aug 2026" },
                { label: "Insurance", tab: "insurance" as PropertyTab, icon: Shield, meta: "Renewal needed", alert: true },
                { label: "Maintenance", tab: "maintenance" as PropertyTab, icon: Wrench, meta: `${openEmergency + openUrgent} urgent`, alert: openEmergency > 0 },
                { label: "Documents", tab: "documents" as PropertyTab, icon: FileText, meta: "Strata records" },
                { label: "Compliance", tab: "compliance" as PropertyTab, icon: ShieldCheck, meta: "1 overdue", alert: true },
                { label: "Committee", tab: "committee" as PropertyTab, icon: User, meta: `${HVT_COMMITTEE.length} members` },
              ].map((link) => (
                <button
                  key={link.tab}
                  type="button"
                  onClick={() => onNavigate(link.tab)}
                  className={cn(
                    "flex flex-col items-start rounded-xs border px-3 py-2.5 text-left transition-colors duration-150 hover:border-forest/20 hover:bg-off-white",
                    link.alert ? "border-warning-soft bg-warning-soft/30" : "border-border bg-white"
                  )}
                >
                  <link.icon className={cn("size-4 mb-1.5", link.alert ? "text-warning" : "text-ink-muted")} aria-hidden />
                  <p className="text-xs font-semibold text-foreground">{link.label}</p>
                  <p className={cn("text-[11px]", link.alert ? "text-warning" : "text-ink-muted")}>{link.meta}</p>
                </button>
              ))}
            </div>
          </WidgetContent>
        </Widget>
      </WidgetGrid>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Finance tab
//
// QLD direct trust model: body corporate owns the account,
// manager is authorised signatory. Admin and Sinking funds
// are separate ledger lines. No cross-fund transfers ever.
// ─────────────────────────────────────────────────────────

/** Fund balance card with levy collection progress. */
function FundCard({
  label,
  balance,
  annualBudget,
  quarterlyLevy,
  received,
  outstanding,
}: {
  label: string
  balance: number
  annualBudget: number
  quarterlyLevy: number
  received: number
  outstanding: number
}) {
  const collectionRate = quarterlyLevy > 0 ? Math.round((received / quarterlyLevy) * 100) : 100

  return (
    <div className="rounded-sm border border-border bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-forest">
        {formatCurrency(balance)}
      </p>
      <p className="mt-0.5 text-xs text-ink-muted">Current balance · as at 15 Jun 2026</p>

      <div className="mt-4 space-y-3">
        {/* Levy collection progress for current quarter */}
        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">Q3 levy collection</span>
            <span className="tabular-nums text-ink-muted">{collectionRate}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-xs bg-off-white">
            <div
              className={cn(
                "h-full rounded-xs transition-all duration-500",
                collectionRate >= 90 ? "bg-lime" : collectionRate >= 70 ? "bg-warning" : "bg-danger"
              )}
              style={{ width: `${collectionRate}%` }}
              role="img"
              aria-label={`${collectionRate}% of levies collected`}
            />
          </div>
        </div>

        {/* Three-column summary */}
        <div className="grid grid-cols-3 gap-3 rounded-xs bg-off-white px-3 py-2.5">
          <div>
            <p className="text-[10px] text-ink-muted">Raised</p>
            <p className="mt-0.5 text-xs font-semibold tabular-nums text-foreground">{formatCurrency(quarterlyLevy)}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted">Received</p>
            <p className="mt-0.5 text-xs font-semibold tabular-nums text-forest">{formatCurrency(received)}</p>
          </div>
          <div>
            <p className="text-[10px] text-ink-muted">Outstanding</p>
            <p className={cn("mt-0.5 text-xs font-semibold tabular-nums", outstanding > 0 ? "text-warning" : "text-forest")}>
              {formatCurrency(outstanding)}
            </p>
          </div>
        </div>

        <p className="text-[11px] text-ink-muted">
          Annual budget: {formatCurrency(annualBudget)} · {formatCurrency(quarterlyLevy)} per lot per quarter
        </p>
      </div>
    </div>
  )
}

/** Finance sub-page: fund balances, levy schedule, arrears, transactions. */
function FinanceTab() {
  const launchCowork = useLaunchCowork()
  const totalArrears = HVT_ARREARS.reduce((sum, a) => sum + a.amount, 0)
  const levyReminderAction = getLevyReminderAction({ totalArrears })

  return (
    <div className="space-y-5">
      {/* Trust model notice (QLD specific) */}
      <div className="flex items-start gap-3 rounded-sm border border-info-soft bg-info-soft/30 px-4 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
        <div className="min-w-0 text-sm">
          <span className="font-semibold text-foreground">QLD direct trust model. </span>
          <span className="text-ink-muted">
            The body corporate holds this account directly. Harbour Lift Towers Body Corporate is
            the account owner; the manager is an authorised signatory only. Admin and Sinking funds
            are tracked as separate ledger lines. No cross-fund transfers are permitted under the
            BCCM Act.
          </span>
        </div>
      </div>

      {/* Fund balance cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FundCard
          label="Administrative Fund"
          balance={HVT_FINANCE.adminFund.balance}
          annualBudget={HVT_FINANCE.adminFund.annualBudget}
          quarterlyLevy={HVT_FINANCE.adminFund.quarterlyLevy}
          received={HVT_FINANCE.adminFund.leviesReceived}
          outstanding={HVT_FINANCE.adminFund.leviesOutstanding}
        />
        <FundCard
          label="Sinking Fund"
          balance={HVT_FINANCE.sinkingFund.balance}
          annualBudget={HVT_FINANCE.sinkingFund.annualBudget}
          quarterlyLevy={HVT_FINANCE.sinkingFund.quarterlyLevy}
          received={HVT_FINANCE.sinkingFund.leviesReceived}
          outstanding={HVT_FINANCE.sinkingFund.leviesOutstanding}
        />
      </div>

      <WidgetGrid columns={3}>
        {/* Levy schedule per lot */}
        <Widget>
          <WidgetHeader>
            <WidgetTitle icon={DollarSign}>Levy per lot (Q3 2026)</WidgetTitle>
            <WidgetAction href="#">Issue notices</WidgetAction>
          </WidgetHeader>
          <WidgetContent className="px-4 pb-4 pt-3 space-y-3">
            <div className="rounded-xs border border-border">
              <div className="grid grid-cols-3 gap-3 border-b border-border bg-off-white px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Fund</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Quarterly</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Annual</p>
              </div>
              <div className="divide-y divide-border">
                <div className="grid grid-cols-3 gap-3 px-3 py-2.5">
                  <p className="text-sm text-foreground">Admin</p>
                  <p className="tabular-nums text-sm font-medium text-foreground">{formatCurrency(HVT_FINANCE.levyPerLot.adminQuarterly)}</p>
                  <p className="tabular-nums text-sm text-ink-muted">{formatCurrency(HVT_FINANCE.levyPerLot.adminQuarterly * 4)}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 px-3 py-2.5">
                  <p className="text-sm text-foreground">Sinking</p>
                  <p className="tabular-nums text-sm font-medium text-foreground">{formatCurrency(HVT_FINANCE.levyPerLot.sinkingQuarterly)}</p>
                  <p className="tabular-nums text-sm text-ink-muted">{formatCurrency(HVT_FINANCE.levyPerLot.sinkingQuarterly * 4)}</p>
                </div>
                <div className="grid grid-cols-3 gap-3 bg-lime-soft px-3 py-2.5">
                  <p className="text-sm font-semibold text-foreground">Total</p>
                  <p className="tabular-nums text-sm font-semibold text-forest">
                    {formatCurrency(HVT_FINANCE.levyPerLot.adminQuarterly + HVT_FINANCE.levyPerLot.sinkingQuarterly)}
                  </p>
                  <p className="tabular-nums text-sm font-semibold text-forest">
                    {formatCurrency((HVT_FINANCE.levyPerLot.adminQuarterly + HVT_FINANCE.levyPerLot.sinkingQuarterly) * 4)}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-ink-muted">Next levy due: {HVT_FINANCE.nextLevyDue} · 42 lots</p>
          </WidgetContent>
        </Widget>

        {/* Arrears */}
        <Widget className="lg:col-span-2">
          <WidgetHeader>
            <WidgetTitle icon={TrendingDown} count={HVT_ARREARS.length}>
              Levies in arrears
            </WidgetTitle>
            <WidgetAction href="#">
              {formatCurrency(totalArrears)} total
            </WidgetAction>
          </WidgetHeader>
          <WidgetContent flush>
            <div className="divide-y divide-border">
              {HVT_ARREARS.map((row) => (
                <div key={row.lot} className="flex items-center gap-4 px-4 py-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-xs bg-off-white">
                    <p className="text-xs font-semibold text-ink-muted">{row.lot}</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground">{row.ownerName}</p>
                    <p className="text-xs text-ink-muted">Lot {row.lot} · {row.fundSplit}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums text-danger">{formatCurrency(row.amount)}</p>
                    <p className={cn(
                      "text-xs tabular-nums",
                      row.daysOverdue > 30 ? "text-danger" : "text-warning"
                    )}>
                      {row.daysOverdue} days overdue
                    </p>
                  </div>
                  <Button size="sm" variant="outline" className="shrink-0">
                    Chase
                  </Button>
                </div>
              ))}

              {/* Agent action: bulk levy reminder letters */}
              <AgentAction
                variant="row"
                title={levyReminderAction.title}
                description={levyReminderAction.description}
                prompt={levyReminderAction.prompt}
                category={levyReminderAction.category}
                icon={levyReminderAction.icon}
                urgency={levyReminderAction.urgency}
                cta={levyReminderAction.cta}
                onTrigger={(prompt) => launchCowork({ prompt })}
              />
            </div>
          </WidgetContent>
        </Widget>
      </WidgetGrid>

      {/* Recent transactions — 8 rows, no toolbar needed */}
      <Widget>
        <WidgetHeader>
          <WidgetTitle icon={DollarSign}>Recent transactions</WidgetTitle>
          <WidgetAction href="#">View all</WidgetAction>
        </WidgetHeader>
        <WidgetContent flush>
          <DataTable
            columns={[
              { key: "date",        label: "Date",        width: "120px"            },
              { key: "description", label: "Description"                            },
              { key: "fund",        label: "Fund",        width: "90px"             },
              { key: "amount",      label: "Amount",      align: "right", width: "100px" },
              { key: "reference",   label: "Reference"                              },
            ]}
            framed={false}
          >
            {HVT_TRANSACTIONS.map((tx) => (
              <DataTableRow key={tx.reference}>
                <DataTableCell>
                  <span className="text-xs text-ink-muted whitespace-nowrap">{tx.date}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-sm text-foreground">{tx.description}</span>
                </DataTableCell>
                <DataTableCell>
                  <Badge variant={tx.fund === "admin" ? "default" : "info"} size="sm">
                    {tx.fund === "admin" ? "Admin" : "Sinking"}
                  </Badge>
                </DataTableCell>
                <DataTableCell align="right">
                  <span className={cn(
                    "text-sm tabular-nums font-medium",
                    tx.amount >= 0 ? "text-forest" : "text-foreground"
                  )}>
                    {tx.amount >= 0 ? "+" : ""}{formatCurrency(tx.amount)}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <span className="font-mono text-xs text-ink-muted">{tx.reference}</span>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTable>
        </WidgetContent>
        <WidgetFooter>
          <span>Showing last 8 transactions · reconciled {HVT_FINANCE.lastReconciliation}</span>
          <WidgetAction href="#">Full ledger</WidgetAction>
        </WidgetFooter>
      </Widget>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Owners & Roll tab
// ─────────────────────────────────────────────────────────

const OWNER_FILTER_FIELDS: CompoundFilterFieldConfig[] = [
  {
    field: "levyStatus",
    label: "Levy status",
    options: [
      { value: "current",       label: "Current",       tone: "success" },
      { value: "arrears",       label: "Arrears",       tone: "danger"  },
      { value: "claim-pending", label: "Claim pending", tone: "warning" },
    ],
  },
  {
    field: "ownerType",
    label: "Owner type",
    options: [
      { value: "owner-occupier", label: "Owner occ." },
      { value: "investor",       label: "Investor"   },
    ],
  },
]

const OWNER_SORT_FIELDS = [
  { field: "lot",       label: "Lot"        },
  { field: "ownerName", label: "Owner name" },
]

const OWNER_TOGGLE_COLS = [
  { key: "type",        label: "Type"        },
  { key: "contact",     label: "Contact"     },
  { key: "entitlement", label: "Entitlement" },
  { key: "levyStatus",  label: "Levy status" },
]

interface OwnersRollTabProps {
  propertyId: string
  onOwnerSelect?: ({ ownerId }: { ownerId: string }) => void
}

/** Owners roll: lot-by-lot list with levy status, contact, and committee role. */
function OwnersRollTab({ propertyId, onOwnerSelect }: OwnersRollTabProps) {
  const [search,     setSearch]     = React.useState("")
  const [conditions, setConditions] = React.useState<CompoundFilterCondition[]>([])
  const [sortField,  setSortField]  = React.useState("")
  const [sortDir,    setSortDir]    = React.useState<"asc" | "desc">("asc")
  const [hiddenCols, setHiddenCols] = React.useState<string[]>([])

  function addCondition(field: string) {
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
    setHiddenCols((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
  }

  const anyFilters = search.trim() || conditions.some((c) => c.value)

  const lotRows = React.useMemo(
    () => getPreviewLotRowsForProperty({ propertyId }),
    [propertyId]
  )

  const totalLots = lotRows.length
  const arrearsLots = lotRows.filter((l) => l.levyStatus === "arrears").length
  const committeeLots = lotRows.filter((l) => l.committee).length
  const tenantedLots = lotRows.filter((l) => l.tenanted).length

  const filtered = React.useMemo(() => {
    let rows = lotRows
    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter((l) =>
        l.ownerName.toLowerCase().includes(q) ||
        l.lot.toString().includes(q) ||
        (l.committee ?? "").toLowerCase().includes(q)
      )
    }
    for (const cond of conditions) {
      if (!cond.value) continue
      rows = rows.filter((l) => {
        if (cond.field === "levyStatus") return l.levyStatus === cond.value
        if (cond.field === "ownerType")  return l.ownerType  === cond.value
        return true
      })
    }
    return [...rows].sort((a, b) => {
      if (!sortField) return 0
      const aVal = sortField === "lot" ? a.lot : a.ownerName
      const bVal = sortField === "lot" ? b.lot : b.ownerName
      const cmp = typeof aVal === "number"
        ? aVal - (bVal as number)
        : String(aVal).localeCompare(String(bVal))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [lotRows, search, conditions, sortField, sortDir])

  const allCols: DataTableColumn[] = [
    { key: "lot",         label: "Lot",          width: "64px"  },
    { key: "owner",       label: "Owner"                        },
    ...(!hiddenCols.includes("type")        ? [{ key: "type",        label: "Type"                         }] : []),
    ...(!hiddenCols.includes("contact")     ? [{ key: "contact",     label: "Contact"                      }] : []),
    ...(!hiddenCols.includes("entitlement") ? [{ key: "entitlement", label: "Entitlement"                  }] : []),
    ...(!hiddenCols.includes("levyStatus")  ? [{ key: "levyStatus",  label: "Levy status"                  }] : []),
    { key: "action",      label: "",             width: "72px", align: "right" as const },
  ]

  return (
    <div className="space-y-5">
      {/* Roll summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total lots", value: totalLots, caption: "On the roll" },
          { label: "Levies in arrears", value: arrearsLots, caption: `${arrearsLots} lots overdue`, tone: arrearsLots > 0 ? "warning" : "default" },
          { label: "Tenanted", value: tenantedLots, caption: "Investor-owned" },
          { label: "Committee", value: committeeLots, caption: "Active officers" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-sm border border-border bg-white p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">{stat.label}</p>
            <p className={cn(
              "mt-2 text-2xl font-semibold tracking-tight",
              stat.tone === "warning" ? "text-warning" : "text-foreground"
            )}>
              {stat.value}
            </p>
            <p className="mt-0.5 text-xs text-ink-muted">{stat.caption}</p>
          </div>
        ))}
      </div>

      {/* Owners roll table with compound filter toolbar */}
      <DataTable
        columns={allCols}
        minWidth="720px"
        emptyMessage="No lots match your search."
        toolbar={
          <DataTableCompoundToolbar
            controls={
              <>
                <CompoundSortButton
                  sortField={sortField}
                  sortDir={sortDir}
                  fields={OWNER_SORT_FIELDS}
                  onSort={({ field, dir }) => { setSortField(field); setSortDir(dir) }}
                />
                <CompoundColumnsButton
                  columns={OWNER_TOGGLE_COLS}
                  hidden={hiddenCols}
                  onToggle={({ key }) => toggleColumn(key)}
                />
                <DataTableToolbarActions>
                  <Button variant="outline" size="sm">Export roll</Button>
                  <Button size="sm">
                    <Plus className="size-3.5" aria-hidden />
                    Add owner
                  </Button>
                </DataTableToolbarActions>
              </>
            }
          >
            {/* Search */}
            <DataTableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search by name or lot..."
              icon={Users}
              className="w-52"
            />
            {/* Active filter conditions */}
            {conditions.map((cond) => {
              const fieldCfg = OWNER_FILTER_FIELDS.find((f) => f.field === cond.field)!
              return (
                <FilterConditionChip
                  key={cond.id}
                  condition={cond}
                  fieldConfig={fieldCfg}
                  onValueChange={({ value }) => updateCondition(cond.id, value)}
                  onRemove={() => removeCondition(cond.id)}
                />
              )
            })}
            {/* Add filter */}
            <AddFilterButton
              fields={OWNER_FILTER_FIELDS}
              activeFields={conditions.map((c) => c.field)}
              onAdd={({ field }) => addCondition(field)}
            />
          </DataTableCompoundToolbar>
        }
        footer={
          <DataTableFooter
            filtered={filtered.length}
            total={42}
            noun="lots"
            showClear={anyFilters}
            onClearAll={clearAll}
          />
        }
      >
        {filtered.map((lot) => (
          <DataTableRow
            key={lot.lot}
            onClick={
              onOwnerSelect
                ? () => onOwnerSelect({ ownerId: lot.ownerId })
                : undefined
            }
          >
            {/* Lot number */}
            <DataTableCell>
              <div className="flex size-7 items-center justify-center rounded-xs bg-off-white">
                <span className="font-mono text-xs font-semibold text-ink-muted">{lot.lot}</span>
              </div>
            </DataTableCell>

            {/* Owner name + unit type + committee role */}
            <DataTableCell>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{lot.ownerName}</span>
                {lot.committee ? (
                  <Badge variant="accent" size="sm">{lot.committee}</Badge>
                ) : null}
              </div>
              <p className="mt-0.5 text-xs text-ink-muted">{lot.unitType}</p>
            </DataTableCell>

            {/* Owner type + occupancy */}
            {!hiddenCols.includes("type") && (
              <DataTableCell>
                <div className="flex flex-col gap-0.5">
                  <Badge variant={lot.ownerType === "owner-occupier" ? "default" : "info"} size="sm">
                    {lot.ownerType === "owner-occupier" ? "Owner occ." : "Investor"}
                  </Badge>
                  {lot.tenanted ? (
                    <span className="text-[11px] text-ink-muted">Tenanted</span>
                  ) : null}
                </div>
              </DataTableCell>
            )}

            {/* Contact */}
            {!hiddenCols.includes("contact") && (
              <DataTableCell>
                <div className="space-y-0.5">
                  {lot.phone ? (
                    <p className="flex items-center gap-1 text-xs text-ink-muted">
                      <Phone className="size-3 shrink-0" aria-hidden />
                      {lot.phone}
                    </p>
                  ) : null}
                  {lot.email ? (
                    <p className="flex items-center gap-1 text-xs text-ink-muted truncate max-w-[160px]">
                      <Mail className="size-3 shrink-0" aria-hidden />
                      {lot.email}
                    </p>
                  ) : null}
                  {!lot.phone && !lot.email ? (
                    <span className="text-xs text-ink-muted/50">No contact</span>
                  ) : null}
                </div>
              </DataTableCell>
            )}

            {/* Lot entitlement */}
            {!hiddenCols.includes("entitlement") && (
              <DataTableCell>
                {lot.entitlementPercent ? (
                  <span className="text-sm tabular-nums text-ink-muted">{lot.entitlementPercent}%</span>
                ) : (
                  <span className="text-ink-muted/50">-</span>
                )}
              </DataTableCell>
            )}

            {/* Levy status */}
            {!hiddenCols.includes("levyStatus") && (
              <DataTableCell>
                {lot.levyStatus === "arrears" ? (
                  <div>
                    <Badge variant="destructive" size="sm">Arrears</Badge>
                    {lot.arrearsAmount ? (
                      <p className="mt-0.5 text-xs font-semibold tabular-nums text-danger">
                        {formatCurrency(lot.arrearsAmount)}
                      </p>
                    ) : null}
                  </div>
                ) : lot.levyStatus === "claim-pending" ? (
                  <Badge variant="warning" size="sm">Claim pending</Badge>
                ) : (
                  <Badge variant="accent" size="sm">Current</Badge>
                )}
              </DataTableCell>
            )}

            {/* Actions */}
            <DataTableCell align="right">
              {onOwnerSelect ? (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onOwnerSelect({ ownerId: lot.ownerId })
                  }}
                  className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 text-xs text-ink-muted hover:text-foreground transition-all duration-150"
                >
                  View <ChevronRight className="size-3" aria-hidden />
                </button>
              ) : null}
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Committee tab
// ─────────────────────────────────────────────────────────

const COMMITTEE_FILTER_FIELDS: CompoundFilterFieldConfig[] = [
  {
    field: "roleType",
    label: "Role type",
    options: [
      { value: "officer", label: "Officer" },
      { value: "member",  label: "Member"  },
    ],
  },
]

const COMMITTEE_SORT_FIELDS = [
  { field: "name", label: "Name" },
  { field: "lot",  label: "Lot"  },
  { field: "role", label: "Role" },
]

const COMMITTEE_TOGGLE_COLS = [
  { key: "lot",     label: "Lot"     },
  { key: "contact", label: "Contact" },
]

function CommitteeTab() {
  const [conditions, setConditions] = React.useState<CompoundFilterCondition[]>([])
  const [sortField,  setSortField]  = React.useState("")
  const [sortDir,    setSortDir]    = React.useState<"asc" | "desc">("asc")
  const [hiddenCols, setHiddenCols] = React.useState<string[]>([])

  const OFFICER_ROLES = new Set(["Chairperson", "Secretary", "Treasurer"])

  function addCondition(field: string) {
    setConditions((prev) => [...prev, { id: crypto.randomUUID(), field, value: "" }])
  }
  function updateCondition(id: string, value: string) {
    setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)))
  }
  function removeCondition(id: string) {
    setConditions((prev) => prev.filter((c) => c.id !== id))
  }
  function toggleColumn(key: string) {
    setHiddenCols((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
  }

  const filteredMembers = React.useMemo(() => {
    let rows = HVT_COMMITTEE
    for (const cond of conditions) {
      if (!cond.value) continue
      if (cond.field === "roleType") {
        rows = rows.filter((m) =>
          cond.value === "officer" ? OFFICER_ROLES.has(m.role) : m.role === "Member"
        )
      }
    }
    return [...rows].sort((a, b) => {
      if (!sortField) return 0
      const aVal = sortField === "lot" ? a.lot : sortField === "role" ? a.role : a.name
      const bVal = sortField === "lot" ? b.lot : sortField === "role" ? b.role : b.name
      const cmp = typeof aVal === "number"
        ? aVal - (bVal as number)
        : String(aVal).localeCompare(String(bVal))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [conditions, sortField, sortDir])

  const allCols: DataTableColumn[] = [
    { key: "member",  label: "Member"                                            },
    { key: "role",    label: "Role",    width: "140px"                           },
    ...(!hiddenCols.includes("lot")     ? [{ key: "lot",     label: "Lot",     width: "60px"               }] : []),
    ...(!hiddenCols.includes("contact") ? [{ key: "contact", label: "Contact"                              }] : []),
    { key: "action",  label: "",        width: "88px", align: "right" as const   },
  ]

  return (
    <div className="space-y-5">
      <WidgetGrid columns={3}>
        {/* Committee members: DataTable with compound filter toolbar */}
        <div className="lg:col-span-2">
          <DataTable
            columns={allCols}
            minWidth="520px"
            toolbar={
              <DataTableCompoundToolbar
                controls={
                  <>
                    <CompoundSortButton
                      sortField={sortField}
                      sortDir={sortDir}
                      fields={COMMITTEE_SORT_FIELDS}
                      onSort={({ field, dir }) => { setSortField(field); setSortDir(dir) }}
                    />
                    <CompoundColumnsButton
                      columns={COMMITTEE_TOGGLE_COLS}
                      hidden={hiddenCols}
                      onToggle={({ key }) => toggleColumn(key)}
                    />
                    <DataTableToolbarActions>
                      <Button variant="outline" size="sm">Edit committee</Button>
                    </DataTableToolbarActions>
                  </>
                }
              >
                {/* Active filter conditions */}
                {conditions.map((cond) => {
                  const fieldCfg = COMMITTEE_FILTER_FIELDS.find((f) => f.field === cond.field)!
                  return (
                    <FilterConditionChip
                      key={cond.id}
                      condition={cond}
                      fieldConfig={fieldCfg}
                      onValueChange={({ value }) => updateCondition(cond.id, value)}
                      onRemove={() => removeCondition(cond.id)}
                    />
                  )
                })}
                {/* Add filter */}
                <AddFilterButton
                  fields={COMMITTEE_FILTER_FIELDS}
                  activeFields={conditions.map((c) => c.field)}
                  onAdd={({ field }) => addCondition(field)}
                />
              </DataTableCompoundToolbar>
            }
            footer={
              <DataTableFooter
                filtered={filteredMembers.length}
                total={HVT_COMMITTEE.length}
                noun="members"
              />
            }
          >
            {filteredMembers.map((member) => (
              <DataTableRow key={member.name}>
                {/* Member: avatar initials + name + elected date */}
                <DataTableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-lime-soft">
                      <span className="font-display text-sm font-semibold text-forest">
                        {member.name.split(" ").map((w) => w[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{member.name}</p>
                      <p className="mt-0.5 text-xs text-ink-muted">Elected {member.electedDate}</p>
                    </div>
                  </div>
                </DataTableCell>

                {/* Role badge */}
                <DataTableCell>
                  <Badge variant="default" size="sm">{member.role}</Badge>
                </DataTableCell>

                {/* Lot */}
                {!hiddenCols.includes("lot") && (
                  <DataTableCell>
                    <div className="flex size-7 items-center justify-center rounded-xs bg-off-white">
                      <span className="font-mono text-xs font-semibold text-ink-muted">{member.lot}</span>
                    </div>
                  </DataTableCell>
                )}

                {/* Contact */}
                {!hiddenCols.includes("contact") && (
                  <DataTableCell>
                    <div className="space-y-0.5">
                      {member.phone ? (
                        <p className="flex items-center gap-1 text-xs text-ink-muted">
                          <Phone className="size-3 shrink-0" aria-hidden /> {member.phone}
                        </p>
                      ) : null}
                      {member.email ? (
                        <p className="flex items-center gap-1 text-xs text-ink-muted">
                          <Mail className="size-3 shrink-0" aria-hidden /> {member.email}
                        </p>
                      ) : null}
                      {!member.phone && !member.email ? (
                        <span className="text-xs text-ink-muted/50">No contact</span>
                      ) : null}
                    </div>
                  </DataTableCell>
                )}

                {/* Action */}
                <DataTableCell align="right">
                  <button
                    type="button"
                    className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 text-xs text-ink-muted hover:text-foreground transition-all duration-150"
                  >
                    View <ChevronRight className="size-3" aria-hidden />
                  </button>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTable>
        </div>

        <div className="space-y-4">
          <Widget>
            <WidgetHeader>
              <WidgetTitle icon={DollarSign}>Spending limits</WidgetTitle>
            </WidgetHeader>
            <WidgetContent className="px-4 pb-4 pt-2 space-y-2">
              <div className="rounded-xs bg-off-white px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Without resolution</p>
                <p className="mt-1 text-lg font-semibold text-foreground">$3,000</p>
                <p className="mt-0.5 text-xs text-ink-muted">Per item (maintenance, admin)</p>
              </div>
              <div className="rounded-xs bg-off-white px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Emergency repairs</p>
                <p className="mt-1 text-lg font-semibold text-foreground">No limit</p>
                <p className="mt-0.5 text-xs text-ink-muted">Notify committee ASAP</p>
              </div>
              <div className="rounded-xs border border-warning-soft bg-warning-soft/40 px-3 py-2.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-warning">Ordinary resolution</p>
                <p className="mt-1 text-lg font-semibold text-warning">Above $3,000</p>
                <p className="mt-0.5 text-xs text-ink-muted">Requires committee meeting vote</p>
              </div>
            </WidgetContent>
          </Widget>
        </div>
      </WidgetGrid>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Meetings tab
// ─────────────────────────────────────────────────────────

type MeetingCalendarView = "list" | "week" | "month"

const MEETING_REFERENCE = new Date("2026-06-21T12:00:00")

/** Scheme label used in demo agent prompts for Harbour View Towers. */
const DEMO_SCHEME_LABEL = "Harbour View Towers (SP1042)"

// ─────────────────────────────────────────────────────────
// Property agent actions: shared configs for demo prompts
// ─────────────────────────────────────────────────────────

interface PropertyAgentActionConfig {
  title: string
  description: string
  prompt: string
  category: string
  icon: LucideIcon
  urgency: AgentActionUrgency
  cta?: string
}

/** Building insurance renewal: expired policy requiring committee approval. */
function getBuildingInsuranceRenewalAction(): PropertyAgentActionConfig {
  return {
    title: "Renew Building Insurance",
    description:
      "Policy expired 18 Jun 2026. The building is uninsured. Compare quotes and prepare a committee recommendation before paying the premium from the Admin Fund.",
    prompt: `You are helping a strata manager renew the building insurance for ${DEMO_SCHEME_LABEL}. The current NRMA building policy (NRM-2024-4821) expired on 18 June 2026. Cover: $24,500,000. Annual premium: $18,450. The building is currently uninsured. Renewal is in progress with NRMA and committee approval is required before the premium is paid from the Administrative Fund. Please: 1) Review the existing policy terms and the NRMA renewal quote. 2) Compare competitive quotes from at least three insurers. 3) Prepare a comparison summary highlighting coverage differences and premium changes. 4) Draft a committee recommendation memo and resolution for approval.`,
    category: "Insurance",
    icon: ShieldCheck,
    urgency: "danger",
    cta: "Renew building insurance",
  }
}

/** Levy arrears: draft reminder letters for lots overdue on levies. */
function getLevyReminderAction({ totalArrears }: { totalArrears: number }): PropertyAgentActionConfig {
  const lotsSummary = HVT_ARREARS.map(
    (row) =>
      `Lot ${row.lot} (${row.ownerName}): ${formatCurrency(row.amount)}, ${row.daysOverdue} days overdue`
  ).join("; ")

  return {
    title: "Draft levy reminders",
    description: `Draft payment reminder letters for ${HVT_ARREARS.length} lots in arrears (${formatCurrency(totalArrears)} total).`,
    prompt: `You are helping a strata manager chase levy arrears for ${DEMO_SCHEME_LABEL}. Lots in arrears: ${lotsSummary}. Please: 1) Draft a payment reminder letter for each lot with the outstanding amount, fund split, and days overdue. 2) Include payment instructions and reference the body corporate's debt recovery policy. 3) Prepare cover emails for electronic delivery where email addresses are on file.`,
    category: "Finance",
    icon: DollarSign,
    urgency: "warning",
    cta: "Draft reminders",
  }
}

/** Overdue AFSS: prepare fire safety statement submission. */
function getAfssComplianceAction(): PropertyAgentActionConfig {
  return {
    title: "Prepare AFSS submission",
    description:
      "Annual Fire Safety Statement is overdue (due 30 Jun 2026). Contractor inspection is booked 28 Jun.",
    prompt: `You are helping a strata manager complete the Annual Fire Safety Statement (AFSS) for ${DEMO_SCHEME_LABEL}. The AFSS was due 30 June 2026 and is currently overdue. A contractor inspection is booked for 28 June 2026 with Total Fire Protection. Please: 1) Confirm inspection scope with the contractor. 2) Compile required fire safety documentation. 3) Draft the AFSS submission for lodgement with Queensland Fire and Emergency Services. 4) Prepare owner notification of compliance status.`,
    category: "Compliance",
    icon: ShieldCheck,
    urgency: "danger",
    cta: "Prepare AFSS",
  }
}

const GRID_START_HOUR = 7
const GRID_END_HOUR = 19
const SLOT_MINUTES = 30
const SLOT_HEIGHT = 32

const MEETING_KINDS: CalendarEntryKind[] = ["committee", "agm", "egm"]

const MEETING_TYPE_LABELS: Record<MeetingRow["type"], string> = {
  committee: "Committee",
  agm: "AGM",
  egm: "EGM",
}

const MEETING_TYPE_FULL_LABELS: Record<MeetingRow["type"], string> = {
  committee: "Committee meeting",
  agm: "Annual General Meeting (AGM)",
  egm: "Extraordinary General Meeting (EGM)",
}

const CALENDAR_KIND_LABELS: Record<CalendarEntryKind, string> = {
  committee: "Committee",
  agm: "AGM",
  egm: "EGM",
  "notice-due": "Notice due",
  "minutes-due": "Minutes due",
  compliance: "Compliance",
}

type EntryStyle = {
  slot: string
  border: string
  dot: string
  badge: "info" | "accent" | "warning" | "outline"
}

const CALENDAR_ENTRY_STYLES: Record<CalendarEntryKind, EntryStyle> = {
  committee: {
    slot: "bg-info-soft",
    border: "border-l-info",
    dot: "bg-info",
    badge: "info",
  },
  agm: {
    slot: "bg-lime-soft",
    border: "border-l-forest",
    dot: "bg-forest",
    badge: "accent",
  },
  egm: {
    slot: "bg-warning-soft",
    border: "border-l-warning",
    dot: "bg-warning",
    badge: "warning",
  },
  "notice-due": {
    slot: "bg-warning-soft",
    border: "border-l-warning",
    dot: "bg-warning ring-2 ring-warning/30",
    badge: "warning",
  },
  "minutes-due": {
    slot: "bg-off-white",
    border: "border-l-border",
    dot: "bg-ink-muted/40",
    badge: "outline",
  },
  compliance: {
    slot: "bg-off-white",
    border: "border border-dashed border-border",
    dot: "bg-ink-muted/50",
    badge: "outline",
  },
}

const MEETING_FILTER_FIELDS: CompoundFilterFieldConfig[] = [
  {
    field: "kind",
    label: "Kind",
    options: [
      { value: "all", label: "All entries" },
      { value: "meetings", label: "Meetings", tone: "info" },
      { value: "deadlines", label: "Deadlines", tone: "warning" },
    ],
  },
  {
    field: "period",
    label: "Period",
    options: [
      { value: "all", label: "All time" },
      { value: "this-month", label: "This month", tone: "info" },
      { value: "next-3-months", label: "Next 3 months" },
      { value: "past", label: "Past", tone: "neutral" },
    ],
  },
  {
    field: "status",
    label: "Status",
    options: [
      { value: "upcoming", label: "Upcoming", tone: "success" },
      { value: "notice-due", label: "Notice due", tone: "warning" },
      { value: "action", label: "Action required", tone: "warning" },
      { value: "past", label: "Past", tone: "neutral" },
    ],
  },
]

const MEETING_SORT_FIELDS = [
  { field: "date", label: "Date" },
  { field: "title", label: "Title" },
  { field: "kind", label: "Kind" },
]

/**
 * Parses a demo meeting date string (e.g. "17 Jun 2026") into a Date.
 */
function parseMeetingDate({ date }: { date: string }): Date {
  return startOfDay(parse(date, "d MMM yyyy", MEETING_REFERENCE))
}

/**
 * Converts a 12-hour time string (e.g. "10:00 am") to minutes from midnight.
 */
function parseAmPmToMinutes({ time }: { time: string }): number {
  const trimmed = time.trim().toLowerCase()
  const match = trimmed.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/)

  if (!match) {
    return 9 * 60
  }

  let hours = parseInt(match[1], 10)
  const minutes = parseInt(match[2], 10)
  const period = match[3]

  if (period === "pm" && hours !== 12) {
    hours += 12
  }

  if (period === "am" && hours === 12) {
    hours = 0
  }

  return hours * 60 + minutes
}

/**
 * Returns true when an entry kind represents a formal meeting block.
 */
function isMeetingKind({ kind }: { kind: CalendarEntryKind }): boolean {
  return MEETING_KINDS.includes(kind)
}

/**
 * Returns true when a calendar entry should offer an agent launch CTA.
 */
function requiresAgentAction({ entry }: { entry: CalendarEntry }): boolean {
  return entry.status === "notice-due" || entry.status === "action"
}

/**
 * Derives urgency tinting from how close the entry due date is to today.
 */
function getAgentActionUrgency({ entry }: { entry: CalendarEntry }): AgentActionUrgency {
  const daysUntil = differenceInDays(parseMeetingDate({ date: entry.date }), MEETING_REFERENCE)

  if (daysUntil < 0) {
    return "danger"
  }

  if (daysUntil <= 7) {
    return "warning"
  }

  return "default"
}

interface MeetingAgentActionConfig {
  title: string
  description: string
  prompt: string
  category: string
  icon: typeof FileText
  urgency: AgentActionUrgency
  cta?: string
}

/**
 * Maps action-required calendar entries to AgentAction props with production-ready prompts.
 */
function getMeetingAgentAction({ entry }: { entry: CalendarEntry }): MeetingAgentActionConfig {
  const urgency = getAgentActionUrgency({ entry })

  if (entry.id === "ms-committee-pack") {
    return {
      title: "Prepare committee pack",
      description:
        entry.subtitle ??
        "Compile agenda papers and circulate to committee members before the meeting.",
      prompt: `You are helping a strata manager prepare the committee meeting pack for ${DEMO_SCHEME_LABEL}. The committee meeting is on 24 June 2026 via Zoom. Please: 1) Compile the agenda items (lift repair quotes, insurance renewal decision, Q3 levy reconciliation). 2) Attach relevant quotes and financial summaries. 3) Draft a cover email to committee members with the reading list and meeting link. 4) Prepare a draft resolution for the insurance renewal decision.`,
      category: "Admin",
      icon: FileText,
      urgency,
      cta: "Prepare pack",
    }
  }

  if (entry.id === "ms-notice-agm") {
    return {
      title: "Prepare AGM notice pack",
      description:
        entry.subtitle ??
        "Draft and send the AGM notice before the 21-day statutory window closes on 18 July.",
      prompt: `You are preparing the AGM notice pack for ${DEMO_SCHEME_LABEL}. The AGM is scheduled for 20 August 2026 in person at Unit 31. The 21-day notice deadline is 18 July 2026. Please draft the full notice pack now including: 1) Formal AGM notice meeting legislative requirements. 2) Motions list (2026-27 budget approval, committee election, maintenance plan review, by-law amendments). 3) Proxy form. 4) Cover letter with agenda and financial summaries.`,
      category: "AGM",
      icon: CalendarDays,
      urgency,
      cta: "Prepare notice pack",
    }
  }

  if (entry.id === "mtg-agm-aug" && entry.status === "notice-due") {
    return {
      title: "Issue AGM notice",
      description: `Send the AGM notice for 20 August 2026. Statutory deadline: 18 July 2026.`,
      prompt: `You are helping a strata manager issue the AGM notice for ${DEMO_SCHEME_LABEL}. The AGM is on 20 August 2026 (in person, Unit 31). The notice must be issued by 18 July 2026. Please: 1) Finalise the notice pack using approved motions and financials. 2) Generate owner distribution list for all 42 lots. 3) Draft the cover email for email delivery and print instructions for hand delivery. 4) Confirm the notice meets the 21-day statutory requirement.`,
      category: "AGM",
      icon: CalendarDays,
      urgency,
      cta: "Issue notice",
    }
  }

  return {
    title: entry.title,
    description: entry.subtitle ?? `Due ${entry.date}. Launch the agent to prepare this item.`,
    prompt: `You are helping a strata manager with "${entry.title}" for ${DEMO_SCHEME_LABEL}. Due date: ${entry.date}. ${entry.subtitle ?? ""} Please complete the necessary preparation and draft any required documents.`,
    category: "Compliance",
    icon: Sparkles,
    urgency,
  }
}

/**
 * Returns a display label for a meeting type.
 */
function getMeetingTypeLabel({ type, short = false }: { type: MeetingRow["type"]; short?: boolean }): string {
  return short ? MEETING_TYPE_LABELS[type] : MEETING_TYPE_FULL_LABELS[type]
}

/**
 * Merges formal meetings and milestone entries into a unified calendar list.
 */
function buildCalendarEntries({
  meetings,
  milestones,
}: {
  meetings: MeetingRow[]
  milestones: CalendarEntry[]
}): CalendarEntry[] {
  const fromMeetings: CalendarEntry[] = meetings.map((meeting) => ({
    id: meeting.id,
    kind: meeting.type,
    title: getMeetingTypeLabel({ type: meeting.type }),
    date: meeting.date,
    time: meeting.time,
    durationMinutes: 60,
    subtitle: meeting.format,
    status:
      meeting.status === "past"
        ? "past"
        : meeting.status === "notice-due"
          ? "notice-due"
          : "upcoming",
    agenda: meeting.agenda,
    minutesStatus: meeting.minutesStatus,
    meetingId: meeting.id,
  }))

  return sortCalendarEntries({ entries: [...fromMeetings, ...milestones] })
}

/**
 * Sorts calendar entries chronologically, soonest first.
 */
function sortCalendarEntries({ entries }: { entries: CalendarEntry[] }): CalendarEntry[] {
  return [...entries].sort((left, right) => {
    const leftDate = parseMeetingDate({ date: left.date }).getTime()
    const rightDate = parseMeetingDate({ date: right.date }).getTime()

    if (leftDate !== rightDate) {
      return leftDate - rightDate
    }

    const leftMinutes = left.time ? parseAmPmToMinutes({ time: left.time }) : 0
    const rightMinutes = right.time ? parseAmPmToMinutes({ time: right.time }) : 0

    return leftMinutes - rightMinutes
  })
}

/**
 * Sorts calendar entries with an optional compound toolbar sort field.
 */
function sortCalendarEntriesWithField({
  entries,
  sortField = "date",
  sortDir = "asc",
}: {
  entries: CalendarEntry[]
  sortField?: string
  sortDir?: "asc" | "desc"
}): CalendarEntry[] {
  const sorted = [...entries].sort((left, right) => {
    let cmp = 0

    if (sortField === "title") {
      cmp = left.title.localeCompare(right.title)
    } else if (sortField === "kind") {
      cmp = left.kind.localeCompare(right.kind)
    } else {
      const leftDate = parseMeetingDate({ date: left.date }).getTime()
      const rightDate = parseMeetingDate({ date: right.date }).getTime()

      if (leftDate !== rightDate) {
        cmp = leftDate - rightDate
      } else {
        const leftMinutes = left.time ? parseAmPmToMinutes({ time: left.time }) : 0
        const rightMinutes = right.time ? parseAmPmToMinutes({ time: right.time }) : 0
        cmp = leftMinutes - rightMinutes
      }
    }

    return sortDir === "asc" ? cmp : -cmp
  })

  return sorted
}

/**
 * Applies compound toolbar search, filter conditions, and sort to calendar entries.
 */
function applyMeetingFilters({
  entries,
  search,
  conditions,
  sortField,
  sortDir,
  reference = MEETING_REFERENCE,
}: {
  entries: CalendarEntry[]
  search: string
  conditions: CompoundFilterCondition[]
  sortField: string
  sortDir: "asc" | "desc"
  reference?: Date
}): CalendarEntry[] {
  const ref = startOfDay(reference)
  const threeMonthsEnd = endOfMonth(addMonths(ref, 2))

  let filtered = entries

  if (search.trim()) {
    const query = search.toLowerCase()
    filtered = filtered.filter((entry) =>
      entry.title.toLowerCase().includes(query) ||
      (entry.subtitle ?? "").toLowerCase().includes(query) ||
      CALENDAR_KIND_LABELS[entry.kind].toLowerCase().includes(query) ||
      (entry.agenda ?? []).some((item) => item.toLowerCase().includes(query))
    )
  }

  for (const condition of conditions) {
    if (!condition.value) {
      continue
    }

    filtered = filtered.filter((entry) => {
      const entryDate = parseMeetingDate({ date: entry.date })

      if (condition.field === "kind") {
        if (condition.value === "all") {
          return true
        }

        if (condition.value === "meetings") {
          return isMeetingKind({ kind: entry.kind })
        }

        if (condition.value === "deadlines") {
          return !isMeetingKind({ kind: entry.kind })
        }
      }

      if (condition.field === "period") {
        if (condition.value === "all") {
          return true
        }

        if (condition.value === "this-month") {
          return isSameMonth(entryDate, ref)
        }

        if (condition.value === "next-3-months") {
          return entryDate >= ref && entryDate <= threeMonthsEnd
        }

        if (condition.value === "past") {
          return isBefore(entryDate, ref)
        }
      }

      if (condition.field === "status") {
        return entry.status === condition.value
      }

      return true
    })
  }

  return sortCalendarEntriesWithField({
    entries: filtered,
    sortField: sortField || "date",
    sortDir,
  })
}

/**
 * Returns entries on a given calendar day.
 */
function entriesForDay({
  entries,
  day,
}: {
  entries: CalendarEntry[]
  day: Date
}): CalendarEntry[] {
  return entries.filter((entry) => isSameDay(parseMeetingDate({ date: entry.date }), day))
}

/**
 * Snaps the calendar anchor to a week or month that contains demo entries.
 * Keeps week and month previews populated when paging or switching views.
 */
function resolveCalendarAnchor({
  view,
  entries,
  preferredDate = MEETING_REFERENCE,
}: {
  view: "week" | "month"
  entries: CalendarEntry[]
  preferredDate?: Date
}): Date {
  if (entries.length === 0) {
    return preferredDate
  }

  const periodHasEntries =
    view === "week"
      ? entries.some((entry) => {
          const entryDate = parseMeetingDate({ date: entry.date })
          const weekStart = startOfWeek(preferredDate, { weekStartsOn: 1 })
          const weekEnd = endOfWeek(preferredDate, { weekStartsOn: 1 })
          return entryDate >= weekStart && entryDate <= weekEnd
        })
      : entries.some((entry) => isSameMonth(parseMeetingDate({ date: entry.date }), preferredDate))

  if (periodHasEntries) {
    return preferredDate
  }

  let closestEntry = entries[0]
  let closestDistance = Infinity

  for (const entry of entries) {
    const entryDate = parseMeetingDate({ date: entry.date })
    const distance = Math.abs(entryDate.getTime() - preferredDate.getTime())

    if (distance < closestDistance) {
      closestDistance = distance
      closestEntry = entry
    }
  }

  return parseMeetingDate({ date: closestEntry.date })
}

/**
 * Resolves card styling for a calendar entry, elevating notice-due above type colour.
 */
function getEntryStyles({ entry }: { entry: CalendarEntry }): EntryStyle {
  if (entry.status === "past") {
    return {
      slot: "bg-white",
      border: "border-border",
      dot: "bg-ink-muted/30",
      badge: "outline",
    }
  }

  if (entry.status === "notice-due" || entry.status === "action") {
    return CALENDAR_ENTRY_STYLES["notice-due"]
  }

  return CALENDAR_ENTRY_STYLES[entry.kind]
}

type CalendarBlockStyle = {
  block: string
  title: string
  meta: string
}

/**
 * Solid fill styles for calendar grid blocks. Meetings use saturated fills;
 * milestones and deadlines stay lighter so they read as secondary items.
 */
function getCalendarBlockStyles({ entry }: { entry: CalendarEntry }): CalendarBlockStyle {
  const isPast = entry.status === "past"
  const faded = isPast ? "opacity-75" : ""
  const shadow = "shadow-[0_1px_2px_rgba(0,0,0,0.1)]"

  if (isMeetingKind({ kind: entry.kind })) {
    if (entry.status === "notice-due" || entry.status === "action") {
      return {
        block: cn("border border-warning bg-warning", shadow, faded),
        title: "font-semibold text-white",
        meta: "text-white/85",
      }
    }

    if (entry.kind === "committee") {
      return {
        block: cn("border border-info bg-info", shadow, faded),
        title: "font-semibold text-white",
        meta: "text-white/85",
      }
    }

    if (entry.kind === "agm") {
      return {
        block: cn("border border-forest bg-forest", shadow, faded),
        title: "font-semibold text-white",
        meta: "text-white/85",
      }
    }

    if (entry.kind === "egm") {
      return {
        block: cn("border border-warning bg-warning", shadow, faded),
        title: "font-semibold text-white",
        meta: "text-white/85",
      }
    }
  }

  const styles = getEntryStyles({ entry })

  return {
    block: cn("border border-border/70 border-l-[3px]", styles.border, styles.slot, faded),
    title: "font-semibold text-foreground",
    meta: "text-ink-muted",
  }
}

interface WeekCalendarEventBlockProps {
  entry: CalendarEntry
  compact?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Positioned event block for the week time grid and all-day band.
 */
function WeekCalendarEventBlock({
  entry,
  compact = false,
  className,
  style,
}: WeekCalendarEventBlockProps) {
  const blockStyles = getCalendarBlockStyles({ entry })

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xs px-1.5 py-1",
        blockStyles.block,
        className
      )}
      style={style}
    >
      <p className={cn("truncate text-[10px] leading-tight", blockStyles.title)}>{entry.title}</p>
      {!compact && entry.time ? (
        <p className={cn("truncate text-[9px] leading-tight", blockStyles.meta)}>
          {entry.time}
          {entry.subtitle ? ` · ${entry.subtitle}` : ""}
        </p>
      ) : null}
    </div>
  )
}

interface MonthCalendarEventBlockProps {
  entry: CalendarEntry
}

/**
 * Compact solid block for meeting entries in the month grid.
 */
function MonthCalendarEventBlock({ entry }: MonthCalendarEventBlockProps) {
  const blockStyles = getCalendarBlockStyles({ entry })
  const timeLabel = entry.time ? `${entry.time.replace(/ (am|pm)$/i, "")} ` : ""

  return (
    <div
      className={cn("truncate rounded-xs px-1 py-0.5 text-[9px] leading-tight", blockStyles.block, blockStyles.title)}
      title={`${entry.title}${entry.time ? ` · ${entry.time}` : ""}`}
    >
      {timeLabel}
      {entry.title}
    </div>
  )
}

/**
 * Returns up to three unique dot styles for entries on a day (month view).
 */
function dotStylesForDay({
  entries,
  day,
}: {
  entries: CalendarEntry[]
  day: Date
}): string[] {
  const dayEntries = entriesForDay({ entries, day })
  const dots: string[] = []

  for (const entry of dayEntries) {
    const style = getEntryStyles({ entry }).dot

    if (!dots.includes(style)) {
      dots.push(style)
    }

    if (dots.length >= 3) {
      break
    }
  }

  return dots
}

interface MeetingSummaryStripProps {
  entries: CalendarEntry[]
}

/**
 * At-a-glance strip for strata managers: next meeting, action required, and this month.
 */
function MeetingSummaryStrip({ entries }: MeetingSummaryStripProps) {
  const launchCowork = useLaunchCowork()
  const ref = MEETING_REFERENCE
  const upcomingMeetings = sortCalendarEntries({
    entries: entries.filter(
      (entry) => isMeetingKind({ kind: entry.kind }) && entry.status === "upcoming"
    ),
  })
  const nextMeeting = upcomingMeetings[0]
  const actionEntries = entries.filter(
    (entry) => entry.status === "notice-due" || entry.status === "action"
  )
  const thisMonthEntries = entries.filter((entry) =>
    isSameMonth(parseMeetingDate({ date: entry.date }), ref)
  )

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {/* Next meeting */}
      <div className="rounded-sm border border-forest/20 bg-lime-soft/40 px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Next meeting</p>
        {nextMeeting ? (
          <>
            <p className="mt-1 text-sm font-semibold text-foreground">{nextMeeting.title}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {nextMeeting.date}
              {nextMeeting.time ? ` · ${nextMeeting.time}` : ""}
            </p>
            {nextMeeting.subtitle ? (
              <p className="mt-0.5 text-xs text-ink-muted">{nextMeeting.subtitle}</p>
            ) : null}
            {nextMeeting.agenda && nextMeeting.agenda.length > 0 ? (
              <p className="mt-1 text-[10px] text-ink-muted">
                {nextMeeting.agenda.length} agenda {nextMeeting.agenda.length === 1 ? "item" : "items"}
              </p>
            ) : null}
          </>
        ) : (
          <p className="mt-1 text-sm text-ink-muted">None scheduled</p>
        )}
      </div>

      {/* Action required */}
      <div
        className={cn(
          "rounded-sm border px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
          actionEntries.length > 0 ? "border-warning/30 bg-warning-soft/40" : "border-border bg-white"
        )}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Action required</p>
        <p className={cn("mt-1 text-sm font-semibold", actionEntries.length > 0 ? "text-warning" : "text-foreground")}>
          {actionEntries.length} {actionEntries.length === 1 ? "item" : "items"}
        </p>
        {actionEntries.length > 0 ? (
          <>
            <p className="mt-0.5 text-xs text-ink-muted">
              {actionEntries.map((entry) => `${entry.title} (${entry.date})`).join(" · ")}
            </p>
            {/* Primary agent action for the most urgent item */}
            {(() => {
              const primaryEntry = sortCalendarEntries({ entries: actionEntries })[0]
              const agentAction = getMeetingAgentAction({ entry: primaryEntry })

              return (
                <div className="mt-2">
                  <AgentAction
                    variant="inline"
                    title={agentAction.cta ?? agentAction.title}
                    prompt={agentAction.prompt}
                    icon={agentAction.icon}
                    urgency={agentAction.urgency}
                    onTrigger={(prompt) => launchCowork({ prompt })}
                  />
                </div>
              )
            })()}
          </>
        ) : (
          <p className="mt-0.5 text-xs text-ink-muted">All notices and deadlines on track</p>
        )}
      </div>

      {/* This month */}
      <div className="rounded-sm border border-border bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">This month</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{thisMonthEntries.length}</p>
        <p className="mt-0.5 text-xs text-ink-muted">
          {format(ref, "MMMM yyyy")}: meetings and milestones
        </p>
      </div>
    </div>
  )
}

interface MeetingLegendProps {
  className?: string
}

/**
 * Colour key for calendar views: meetings, milestones, and notice due.
 */
function MeetingLegend({ className }: MeetingLegendProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      {MEETING_KINDS.map((kind) => (
        <div key={kind} className="flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", CALENDAR_ENTRY_STYLES[kind].dot)} aria-hidden />
          <span className="text-[11px] text-ink-muted">{CALENDAR_KIND_LABELS[kind]}</span>
        </div>
      ))}
      <div className="flex items-center gap-1.5">
        <span className={cn("size-2 rounded-full", CALENDAR_ENTRY_STYLES["notice-due"].dot)} aria-hidden />
        <span className="text-[11px] text-ink-muted">Notice due</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={cn("size-2 rounded-full", CALENDAR_ENTRY_STYLES["minutes-due"].dot)} aria-hidden />
        <span className="text-[11px] text-ink-muted">Minutes due</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className={cn("size-2 rounded-full", CALENDAR_ENTRY_STYLES.compliance.dot)} aria-hidden />
        <span className="text-[11px] text-ink-muted">Compliance</span>
      </div>
    </div>
  )
}

interface CalendarEntryCardProps {
  entry: CalendarEntry
  compact?: boolean
  showActions?: boolean
}

/**
 * Shared entry card for the list view.
 */
function CalendarEntryCard({ entry, compact = false, showActions = true }: CalendarEntryCardProps) {
  const launchCowork = useLaunchCowork()
  const styles = getEntryStyles({ entry })
  const isPast = entry.status === "past"
  const isAction = entry.status === "notice-due" || entry.status === "action"
  const isMeeting = isMeetingKind({ kind: entry.kind })

  return (
    <div
      className={cn(
        "rounded-sm border border-border border-l-[3px] p-4 shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        styles.border,
        styles.slot,
        isPast && "opacity-80"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className={cn("text-sm font-semibold", isPast ? "text-ink-muted" : "text-foreground")}>
              {entry.title}
            </p>
            <Badge variant={CALENDAR_ENTRY_STYLES[entry.kind].badge} size="sm">
              {CALENDAR_KIND_LABELS[entry.kind]}
            </Badge>
            {entry.status === "notice-due" && (
              <Badge variant="warning" size="sm">Notice due</Badge>
            )}
            {entry.status === "action" && (
              <Badge variant="warning" size="sm">Action required</Badge>
            )}
            {isPast && entry.minutesStatus === "approved" && (
              <Badge variant="accent" size="sm">Minutes approved</Badge>
            )}
          </div>
          <p className="mt-0.5 text-xs text-ink-muted">
            {entry.date}
            {entry.time ? ` · ${entry.time}` : ""}
            {entry.subtitle ? ` · ${entry.subtitle}` : ""}
          </p>
        </div>

        {/* Actions */}
        {showActions ? (
          <div className="flex shrink-0 gap-2">
            {isPast ? (
              <Button variant="ghost" size="sm">View minutes</Button>
            ) : isAction ? (
              (() => {
                const agentAction = getMeetingAgentAction({ entry })

                return (
                  <AgentAction
                    variant="inline"
                    title={agentAction.cta ?? agentAction.title}
                    prompt={agentAction.prompt}
                    icon={agentAction.icon}
                    urgency={agentAction.urgency}
                    onTrigger={(prompt) => launchCowork({ prompt })}
                  />
                )
              })()
            ) : isMeeting ? (
              <>
                <Button variant="outline" size="sm">Agenda</Button>
                {!compact ? <Button variant="outline" size="sm">Details</Button> : null}
              </>
            ) : (
              <Button variant="outline" size="sm">View</Button>
            )}
          </div>
        ) : null}
      </div>

      {/* Agenda preview */}
      {!compact && entry.agenda && entry.agenda.length > 0 && !isPast && (
        <div className="mt-3 border-t border-border/60 pt-3">
          <p className="mb-1.5 text-xs font-semibold text-ink-muted">Agenda items</p>
          <ul className="space-y-1">
            {entry.agenda.map((item, index) => (
              <li key={item} className="flex items-start gap-2 text-sm text-ink-muted">
                <span className="mt-0.5 shrink-0 text-[11px] font-semibold text-ink-muted/50">{index + 1}.</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

interface MilestoneChipProps {
  entry: CalendarEntry
}

/**
 * Compact milestone chip for the list view deadline section.
 */
function MilestoneChip({ entry }: MilestoneChipProps) {
  const styles = getEntryStyles({ entry })

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-sm border border-border border-l-[3px] px-3 py-2",
        styles.border,
        styles.slot
      )}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground">{entry.title}</p>
        <p className="text-xs text-ink-muted">
          {entry.date}{entry.subtitle ? ` · ${entry.subtitle}` : ""}
        </p>
      </div>
      <Badge variant={CALENDAR_ENTRY_STYLES[entry.kind].badge} size="sm">
        {CALENDAR_KIND_LABELS[entry.kind]}
      </Badge>
    </div>
  )
}

interface MeetingsWeekViewProps {
  entries: CalendarEntry[]
  anchorDate: Date
  onAnchorChange: ({ date }: { date: Date }) => void
}

/**
 * Week time grid: all-day band plus pixel-positioned timed meeting blocks.
 */
function MeetingsWeekView({ entries, anchorDate, onAnchorChange }: MeetingsWeekViewProps) {
  const weekStart = startOfWeek(anchorDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(anchorDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
  const gridRef = React.useRef<HTMLDivElement>(null)

  const totalSlots = ((GRID_END_HOUR - GRID_START_HOUR) * 60) / SLOT_MINUTES
  const gridStartMinutes = GRID_START_HOUR * 60
  const gridHeight = totalSlots * SLOT_HEIGHT
  const nowMinutes = MEETING_REFERENCE.getHours() * 60 + MEETING_REFERENCE.getMinutes()
  const showNowLine = nowMinutes >= gridStartMinutes && nowMinutes <= GRID_END_HOUR * 60
  const nowTop = ((nowMinutes - gridStartMinutes) / SLOT_MINUTES) * SLOT_HEIGHT

  React.useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollTop = 0
    }
  }, [anchorDate])

  return (
    <div className="space-y-3">
      {/* Week navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            aria-label="Previous week"
            onClick={() => onAnchorChange({ date: addDays(weekStart, -7) })}
          >
            <ChevronLeft className="size-3.5" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="Next week"
            onClick={() => onAnchorChange({ date: addDays(weekStart, 7) })}
          >
            <ChevronRight className="size-3.5" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAnchorChange({ date: MEETING_REFERENCE })}
          >
            This week
          </Button>
        </div>
        <p className="text-sm font-medium text-foreground">
          {format(weekStart, "d MMM")} – {format(weekEnd, "d MMM yyyy")}
        </p>
      </div>

      {/* Day header row */}
      <div className="flex overflow-hidden rounded-sm border border-border">
        <div className="w-12 shrink-0 border-r border-border bg-off-white" aria-hidden />
        {days.map((day) => {
          const dayIsToday = isToday(day)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex-1 border-r border-border px-1 py-1.5 text-center last:border-r-0",
                dayIsToday ? "bg-lime-soft text-forest" : "bg-white"
              )}
            >
              <p className="text-[10px] font-semibold uppercase">{format(day, "EEE")}</p>
              <p className="text-xs font-semibold tabular-nums">{format(day, "d")}</p>
            </div>
          )
        })}
      </div>

      {/* All-day band */}
      <div className="flex overflow-hidden rounded-sm border border-border">
        <div className="flex w-12 shrink-0 items-start border-r border-border bg-off-white px-1 py-1">
          <span className="text-[9px] leading-tight text-ink-muted">All day</span>
        </div>
        {days.map((day) => {
          const allDayEntries = entriesForDay({ entries, day }).filter((entry) => !entry.time)
          const dayIsToday = isToday(day)

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "min-h-10 flex-1 space-y-0.5 border-r border-border p-0.5 last:border-r-0",
                dayIsToday ? "bg-lime-soft/30" : "bg-white"
              )}
            >
              {allDayEntries.map((entry) => (
                <WeekCalendarEventBlock
                  key={entry.id}
                  entry={entry}
                  compact
                  className="w-full"
                />
              ))}
            </div>
          )
        })}
      </div>

      {/* Time grid */}
      <div
        ref={gridRef}
        className="max-h-[560px] overflow-y-auto rounded-sm border border-border"
      >
        <div className="flex">
          {/* Time gutter */}
          <div className="w-12 shrink-0 border-r border-border bg-off-white">
            {Array.from({ length: GRID_END_HOUR - GRID_START_HOUR }).map((_, index) => (
              <div
                key={index}
                className="px-1 text-[10px] text-ink-muted"
                style={{ height: SLOT_HEIGHT * 2 }}
              >
                {String(GRID_START_HOUR + index).padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => {
            const timedEntries = entriesForDay({ entries, day }).filter((entry) => entry.time)
            const dayIsToday = isToday(day)

            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "relative flex-1 border-r border-border last:border-r-0",
                  dayIsToday ? "bg-lime-soft/20" : "bg-white"
                )}
                style={{ height: gridHeight }}
              >
                {/* Hour lines */}
                {Array.from({ length: totalSlots }).map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "absolute inset-x-0 border-t border-border/40",
                      index % 2 === 0 && "border-border/70"
                    )}
                    style={{ top: index * SLOT_HEIGHT }}
                  />
                ))}

                {/* Now line */}
                {dayIsToday && showNowLine ? (
                  <div
                    className="absolute inset-x-0 z-20 border-t-2 border-warning"
                    style={{ top: nowTop }}
                    aria-hidden
                  />
                ) : null}

                {/* Timed events */}
                {timedEntries.map((entry) => {
                  const startMinutes = parseAmPmToMinutes({ time: entry.time! })
                  const duration = entry.durationMinutes ?? 60
                  const top = ((startMinutes - gridStartMinutes) / SLOT_MINUTES) * SLOT_HEIGHT
                  const height = Math.max((duration / SLOT_MINUTES) * SLOT_HEIGHT, SLOT_HEIGHT)
                  const compact = height <= SLOT_HEIGHT

                  return (
                    <WeekCalendarEventBlock
                      key={entry.id}
                      entry={entry}
                      compact={compact}
                      className="absolute inset-x-1 z-10"
                      style={{ top, height }}
                    />
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      <MeetingLegend />
    </div>
  )
}

interface MeetingsMonthViewProps {
  entries: CalendarEntry[]
  anchorDate: Date
  onAnchorChange: ({ date }: { date: Date }) => void
}

/**
 * Month grid: statutory planning view with multi-kind dot indicators.
 */
function MeetingsMonthView({ entries, anchorDate, onAnchorChange }: MeetingsMonthViewProps) {
  const monthStart = startOfMonth(anchorDate)
  const monthEnd = endOfMonth(anchorDate)
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd })

  return (
    <div className="space-y-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            aria-label="Previous month"
            onClick={() => onAnchorChange({ date: subMonths(anchorDate, 1) })}
          >
            <ChevronLeft className="size-3.5" aria-hidden />
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-label="Next month"
            onClick={() => onAnchorChange({ date: addMonths(anchorDate, 1) })}
          >
            <ChevronRight className="size-3.5" aria-hidden />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAnchorChange({ date: MEETING_REFERENCE })}
          >
            Today
          </Button>
        </div>
        <p className="text-sm font-medium text-foreground">{format(anchorDate, "MMMM yyyy")}</p>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((label) => (
          <span key={label} className="text-[10px] font-semibold uppercase tracking-wide text-ink-muted">
            {label}
          </span>
        ))}
      </div>

      {/* Month cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const inMonth = isSameMonth(day, anchorDate)
          const dayEntries = entriesForDay({ entries, day })
          const dayIsToday = isToday(day)
          const hasActionRequired = dayEntries.some(
            (entry) => entry.status === "notice-due" || entry.status === "action"
          )
          const dots = dotStylesForDay({ entries, day })

          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex min-h-16 flex-col rounded-sm border p-1",
                inMonth ? "bg-white" : "bg-off-white/60",
                dayIsToday && inMonth && "bg-lime-soft/30 ring-1 ring-forest/30",
                hasActionRequired && inMonth && "border-warning/40 bg-warning-soft/20",
                !dayIsToday && !hasActionRequired && "border-border/60"
              )}
            >
              <div className="flex items-center justify-between gap-1">
                <span
                  className={cn(
                    "text-[10px] font-medium tabular-nums",
                    inMonth ? (dayIsToday ? "text-forest" : "text-foreground") : "text-ink-muted/50"
                  )}
                >
                  {format(day, "d")}
                </span>
                {dayEntries.length > 0 ? (
                  <span className="text-[9px] text-ink-muted">{dayEntries.length}</span>
                ) : null}
              </div>

              <div className="mt-0.5 space-y-0.5">
                {dayEntries.slice(0, 3).map((entry) => {
                  if (isMeetingKind({ kind: entry.kind })) {
                    return <MonthCalendarEventBlock key={entry.id} entry={entry} />
                  }

                  const styles = getEntryStyles({ entry })

                  return (
                    <div
                      key={entry.id}
                      className={cn(
                        "truncate rounded-xs border border-border/70 border-l-[3px] px-1 py-0.5 text-[9px] leading-tight",
                        styles.border,
                        styles.slot,
                        "font-medium text-foreground"
                      )}
                      title={entry.title}
                    >
                      {entry.title}
                    </div>
                  )
                })}
                {dayEntries.length > 3 ? (
                  <p className="text-[9px] text-ink-muted">+{dayEntries.length - 3} more</p>
                ) : null}
              </div>

              {dots.length > 0 && dayEntries.every((entry) => !isMeetingKind({ kind: entry.kind })) ? (
                <div className="mt-auto flex items-center gap-0.5 pt-0.5">
                  {dots.map((dot, index) => (
                    <span
                      key={`${day.toISOString()}-dot-${index}`}
                      className={cn("size-1.5 rounded-full", dot)}
                      aria-hidden
                    />
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <MeetingLegend />
    </div>
  )
}

interface MeetingsListViewProps {
  entries: CalendarEntry[]
}

/**
 * Action-oriented list: action required first, then meetings, milestones, and past.
 */
function MeetingsListView({ entries }: MeetingsListViewProps) {
  const launchCowork = useLaunchCowork()
  const actionRequired = entries.filter(
    (entry) => entry.status === "notice-due" || entry.status === "action"
  )
  const upcomingMeetings = entries.filter(
    (entry) => isMeetingKind({ kind: entry.kind }) && entry.status === "upcoming"
  )
  const upcomingMilestones = entries.filter(
    (entry) =>
      !isMeetingKind({ kind: entry.kind }) &&
      entry.status === "upcoming"
  )
  const past = entries.filter((entry) => entry.status === "past")

  if (entries.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-sm border border-dashed border-border bg-off-white">
        <p className="text-sm text-ink-muted">No entries match your current filters.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {actionRequired.length > 0 && (
        <AgentActionList title={`Action required (${actionRequired.length})`}>
          {actionRequired.map((entry) => {
            const agentAction = getMeetingAgentAction({ entry })

            return (
              <AgentAction
                key={entry.id}
                variant="row"
                title={agentAction.title}
                description={`Due ${entry.date}. ${agentAction.description}`}
                prompt={agentAction.prompt}
                category={agentAction.category}
                icon={agentAction.icon}
                urgency={agentAction.urgency}
                cta={agentAction.cta}
                onTrigger={(prompt) => launchCowork({ prompt })}
              />
            )
          })}
        </AgentActionList>
      )}

      {upcomingMeetings.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Upcoming meetings ({upcomingMeetings.length})
          </p>
          {upcomingMeetings.map((entry) => (
            <CalendarEntryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {upcomingMilestones.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Upcoming milestones ({upcomingMilestones.length})
          </p>
          {upcomingMilestones.map((entry) => (
            <MilestoneChip key={entry.id} entry={entry} />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Past ({past.length})
          </p>
          {past.map((entry) => (
            <CalendarEntryCard key={entry.id} entry={entry} compact showActions={isMeetingKind({ kind: entry.kind })} />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Property meetings tab with list, week, and month views.
 * Defaults to list view: strata managers need actionable detail first.
 */
function MeetingsTab() {
  const launchCowork = useLaunchCowork()
  const [view, setView] = React.useState<MeetingCalendarView>("list")
  const [search, setSearch] = React.useState("")
  const [conditions, setConditions] = React.useState<CompoundFilterCondition[]>([])
  const [sortField, setSortField] = React.useState("date")
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")
  const [anchorDate, setAnchorDate] = React.useState(MEETING_REFERENCE)

  function addCondition({ field }: { field: string }) {
    setConditions((prev) => [...prev, { id: crypto.randomUUID(), field, value: "" }])
  }

  function updateCondition({ id, value }: { id: string; value: string }) {
    setConditions((prev) => prev.map((condition) => (condition.id === id ? { ...condition, value } : condition)))
  }

  function removeCondition({ id }: { id: string }) {
    setConditions((prev) => prev.filter((condition) => condition.id !== id))
  }

  function clearAll() {
    setSearch("")
    setConditions([])
    setSortField("date")
    setSortDir("asc")
  }

  const allEntries = React.useMemo(
    () =>
      buildCalendarEntries({
        meetings: HVT_MEETINGS,
        milestones: HVT_MILESTONES,
      }),
    []
  )

  const filteredEntries = React.useMemo(
    () =>
      applyMeetingFilters({
        entries: allEntries,
        search,
        conditions,
        sortField,
        sortDir,
      }),
    [allEntries, search, conditions, sortField, sortDir]
  )

  const anyFilters = search.trim() || conditions.some((condition) => condition.value)

  const actionEntries = React.useMemo(
    () =>
      allEntries.filter((entry) => requiresAgentAction({ entry })),
    [allEntries]
  )

  const primaryActionEntry = React.useMemo(
    () => (actionEntries.length > 0 ? sortCalendarEntries({ entries: actionEntries })[0] : null),
    [actionEntries]
  )

  const primaryAgentAction = primaryActionEntry
    ? getMeetingAgentAction({ entry: primaryActionEntry })
    : null

  function handleViewChange({ nextView }: { nextView: MeetingCalendarView }) {
    setView(nextView)

    if (nextView === "week" || nextView === "month") {
      setAnchorDate(
        resolveCalendarAnchor({
          view: nextView,
          entries: filteredEntries,
          preferredDate: MEETING_REFERENCE,
        })
      )
    }
  }

  function handleAnchorChange({
    date,
    calendarView,
  }: {
    date: Date
    calendarView: "week" | "month"
  }) {
    setAnchorDate(
      resolveCalendarAnchor({
        view: calendarView,
        entries: filteredEntries,
        preferredDate: date,
      })
    )
  }

  return (
    <div className="space-y-5">
      {/* Priority banner for the most urgent agent action */}
      {primaryAgentAction && primaryActionEntry ? (
        <AgentAction
          variant="banner"
          urgency={primaryAgentAction.urgency}
          title={primaryAgentAction.title}
          description={`${primaryActionEntry.date} · ${primaryAgentAction.description}`}
          prompt={primaryAgentAction.prompt}
          category={primaryAgentAction.category}
          icon={primaryAgentAction.icon}
          cta={primaryAgentAction.cta}
          onTrigger={(prompt) => launchCowork({ prompt })}
        />
      ) : null}

      {/* Summary strip */}
      <MeetingSummaryStrip entries={allEntries} />

      {/* Filter bar + calendar views: footer sits below content like Issues tab */}
      <div className="space-y-3">
        <DataTableCompoundToolbar
        controls={
          <>
            {/* View toggle */}
            <div
              className="flex items-center rounded-xs border border-border bg-white p-0.5"
              role="group"
              aria-label="Meeting calendar view"
            >
              <button
                type="button"
                onClick={() => handleViewChange({ nextView: "list" })}
                aria-label="List view"
                aria-pressed={view === "list"}
                className={cn(
                  "flex h-7 items-center gap-1.5 rounded-xs px-2 text-xs font-medium transition-colors duration-150",
                  view === "list" ? "bg-forest text-white" : "text-ink-muted hover:text-foreground"
                )}
              >
                <List className="size-3.5" aria-hidden />
                List
              </button>
              <button
                type="button"
                onClick={() => handleViewChange({ nextView: "week" })}
                aria-label="Week view"
                aria-pressed={view === "week"}
                className={cn(
                  "flex h-7 items-center gap-1.5 rounded-xs px-2 text-xs font-medium transition-colors duration-150",
                  view === "week" ? "bg-forest text-white" : "text-ink-muted hover:text-foreground"
                )}
              >
                <CalendarDays className="size-3.5" aria-hidden />
                Week
              </button>
              <button
                type="button"
                onClick={() => handleViewChange({ nextView: "month" })}
                aria-label="Month view"
                aria-pressed={view === "month"}
                className={cn(
                  "flex h-7 items-center gap-1.5 rounded-xs px-2 text-xs font-medium transition-colors duration-150",
                  view === "month" ? "bg-forest text-white" : "text-ink-muted hover:text-foreground"
                )}
              >
                <Calendar className="size-3.5" aria-hidden />
                Month
              </button>
            </div>

            <CompoundSortButton
              sortField={sortField}
              sortDir={sortDir}
              fields={MEETING_SORT_FIELDS}
              onSort={({ field, dir }) => {
                setSortField(field)
                setSortDir(dir)
              }}
            />

            <Button size="sm">
              <Plus className="size-3.5" aria-hidden /> Schedule meeting
            </Button>
          </>
        }
      >
        {/* Search */}
        <DataTableSearch
          value={search}
          onChange={setSearch}
          placeholder="Search meetings and milestones..."
          className="w-52"
        />

        {/* Active filter conditions */}
        {conditions.map((condition) => {
          const fieldConfig = MEETING_FILTER_FIELDS.find((field) => field.field === condition.field)!

          return (
            <FilterConditionChip
              key={condition.id}
              condition={condition}
              fieldConfig={fieldConfig}
              onValueChange={({ value }) => updateCondition({ id: condition.id, value })}
              onRemove={() => removeCondition({ id: condition.id })}
            />
          )
        })}

        {/* Add filter */}
        <AddFilterButton
          fields={MEETING_FILTER_FIELDS}
          activeFields={conditions.map((condition) => condition.field)}
          onAdd={({ field }) => addCondition({ field })}
        />
      </DataTableCompoundToolbar>

      {/* Active view */}
      {view === "list" && <MeetingsListView entries={filteredEntries} />}
      {view === "week" && (
        <MeetingsWeekView
          entries={filteredEntries}
          anchorDate={anchorDate}
          onAnchorChange={({ date }) => handleAnchorChange({ date, calendarView: "week" })}
        />
      )}
      {view === "month" && (
        <MeetingsMonthView
          entries={filteredEntries}
          anchorDate={anchorDate}
          onAnchorChange={({ date }) => handleAnchorChange({ date, calendarView: "month" })}
        />
      )}

      <DataTableFooter
        filtered={filteredEntries.length}
        total={allEntries.length}
        noun="entries"
        showClear={anyFilters || sortField !== "date" || sortDir !== "asc"}
        onClearAll={clearAll}
      />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Maintenance tab
// ─────────────────────────────────────────────────────────

const PRIORITY_ORDER = { emergency: 0, urgent: 1, routine: 2 }
const PRIORITY_LABELS = { emergency: "Emergency", urgent: "Urgent", routine: "Routine" }
const PRIORITY_BADGE_VARIANT = {
  emergency: "destructive" as const,
  urgent: "warning" as const,
  routine: "default" as const,
}
const STATUS_LABELS = {
  open: "Open",
  "in-progress": "In progress",
  "pending-approval": "Pending approval",
} as const
const STATUS_BADGE_VARIANT = {
  open: "outline" as const,
  "in-progress": "accent" as const,
  "pending-approval": "warning" as const,
}

const MAINTENANCE_FILTER_FIELDS: CompoundFilterFieldConfig[] = [
  {
    field: "priority",
    label: "Priority",
    options: [
      { value: "emergency", label: "Emergency", tone: "danger" },
      { value: "urgent", label: "Urgent", tone: "warning" },
      { value: "routine", label: "Routine" },
    ],
  },
  {
    field: "status",
    label: "Status",
    options: [
      { value: "open", label: "Open" },
      { value: "in-progress", label: "In progress", tone: "success" },
      { value: "pending-approval", label: "Pending approval", tone: "warning" },
    ],
  },
  {
    field: "assignment",
    label: "Assignment",
    options: [
      { value: "assigned", label: "Assigned" },
      { value: "unassigned", label: "Unassigned" },
    ],
  },
]

const MAINTENANCE_SORT_FIELDS = [
  { field: "priority", label: "Priority" },
  { field: "title", label: "Issue" },
  { field: "reported", label: "Reported" },
  { field: "cost", label: "Est. cost" },
]

const MAINTENANCE_TOGGLE_COLS = [
  { key: "priority", label: "Priority" },
  { key: "reported", label: "Reported" },
  { key: "assigned", label: "Assigned to" },
  { key: "cost", label: "Est. cost" },
]

/** Parse demo maintenance reported dates for sorting. */
function parseMaintenanceDate({ reported }: { reported: string }): Date {
  return parse(reported, "d MMM yyyy", new Date())
}

type MaintenanceMetricTone = "default" | "warning" | "danger" | "accent"

interface MaintenanceHudMetricProps {
  icon: React.ElementType
  label: string
  value: React.ReactNode
  caption: string
  tone?: MaintenanceMetricTone
}

const maintenanceMetricValueClass: Record<MaintenanceMetricTone, string> = {
  default: "text-foreground",
  warning: "text-warning",
  danger: "text-danger",
  accent: "text-forest",
}

const maintenanceMetricIconClass: Record<MaintenanceMetricTone, string> = {
  default: "text-ink-muted",
  warning: "text-warning",
  danger: "text-danger",
  accent: "text-forest",
}

/** Compact HUD tile for the maintenance status strip. */
function MaintenanceHudMetric({
  icon: Icon,
  label,
  value,
  caption,
  tone = "default",
}: MaintenanceHudMetricProps) {
  return (
    <div className="min-w-0 border-r border-t border-border px-3 py-3 last:border-r-0 sm:px-4">
      <div className="flex items-center gap-1.5">
        <Icon className={cn("size-3 shrink-0", maintenanceMetricIconClass[tone])} aria-hidden />
        <p className="truncate text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
          {label}
        </p>
      </div>
      <p className={cn("mt-1.5 text-sm font-semibold tracking-tight", maintenanceMetricValueClass[tone])}>
        {value}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-ink-muted">{caption}</p>
    </div>
  )
}

/** Property-level maintenance snapshot: open counts, urgency, and spend. */
function MaintenanceHealthStrip({ issues }: { issues: MaintenanceIssue[] }) {
  const emergency = issues.filter((i) => i.priority === "emergency").length
  const urgent = issues.filter((i) => i.priority === "urgent").length
  const routine = issues.filter((i) => i.priority === "routine").length
  const inProgress = issues.filter((i) => i.status === "in-progress").length
  const pendingApproval = issues.filter((i) => i.status === "pending-approval").length
  const needsResolution = issues.filter((i) => i.requiresResolution).length
  const estSpend = issues.reduce((sum, i) => sum + (i.estimatedCost ?? 0), 0)

  const emergencyTone: MaintenanceMetricTone = emergency > 0 ? "danger" : "default"
  const approvalTone: MaintenanceMetricTone = pendingApproval > 0 ? "warning" : "default"
  const progressTone: MaintenanceMetricTone = inProgress > 0 ? "accent" : "default"

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        <MaintenanceHudMetric
          icon={Wrench}
          label="Open issues"
          value={`${issues.length} open`}
          caption={`${emergency} emergency · ${urgent} urgent · ${routine} routine`}
          tone={emergency > 0 ? "danger" : urgent > 2 ? "warning" : "default"}
        />
        <MaintenanceHudMetric
          icon={AlertTriangle}
          label="Emergency"
          value={emergency > 0 ? `${emergency} active` : "None"}
          caption={
            needsResolution > 0
              ? `${needsResolution} needs resolution vote`
              : "No emergency issues"
          }
          tone={emergencyTone}
        />
        <MaintenanceHudMetric
          icon={Clock}
          label="In progress"
          value={`${inProgress} underway`}
          caption={
            pendingApproval > 0
              ? `${pendingApproval} awaiting approval`
              : "All other issues open or queued"
          }
          tone={progressTone}
        />
        <MaintenanceHudMetric
          icon={DollarSign}
          label="Est. spend"
          value={estSpend > 0 ? formatCurrency(estSpend) : "—"}
          caption={
            estSpend > 0
              ? "Quoted on open issues"
              : "No quotes recorded yet"
          }
          tone={approvalTone}
        />
      </div>
    </div>
  )
}

function MaintenanceTab() {
  const [search, setSearch] = React.useState("")
  const [conditions, setConditions] = React.useState<CompoundFilterCondition[]>([])
  const [sortField, setSortField] = React.useState("priority")
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("asc")
  const [hiddenCols, setHiddenCols] = React.useState<string[]>([])

  function addCondition(field: string) {
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
    setSortField("priority")
    setSortDir("asc")
  }
  function toggleColumn(key: string) {
    setHiddenCols((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const anyFilters = search.trim() || conditions.some((c) => c.value)

  const filtered = React.useMemo(() => {
    let rows = HVT_MAINTENANCE

    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (issue) =>
          issue.title.toLowerCase().includes(q) ||
          issue.location.toLowerCase().includes(q) ||
          (issue.assignedTo ?? "").toLowerCase().includes(q)
      )
    }

    for (const cond of conditions) {
      if (!cond.value) continue
      rows = rows.filter((issue) => {
        if (cond.field === "priority") return issue.priority === cond.value
        if (cond.field === "status") return issue.status === cond.value
        if (cond.field === "assignment") {
          return cond.value === "assigned" ? Boolean(issue.assignedTo) : !issue.assignedTo
        }
        return true
      })
    }

    return [...rows].sort((a, b) => {
      if (!sortField) return 0

      let cmp = 0
      if (sortField === "priority") {
        cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      } else if (sortField === "title") {
        cmp = a.title.localeCompare(b.title)
      } else if (sortField === "reported") {
        cmp =
          parseMaintenanceDate({ reported: a.reported }).getTime() -
          parseMaintenanceDate({ reported: b.reported }).getTime()
      } else if (sortField === "cost") {
        cmp = (a.estimatedCost ?? 0) - (b.estimatedCost ?? 0)
      }

      return sortDir === "asc" ? cmp : -cmp
    })
  }, [search, conditions, sortField, sortDir])

  const allCols: DataTableColumn[] = [
    { key: "issue", label: "Issue" },
    ...(!hiddenCols.includes("priority")
      ? [{ key: "priority", label: "Priority", width: "100px" }]
      : []),
    { key: "status", label: "Status", width: "130px" },
    ...(!hiddenCols.includes("reported")
      ? [{ key: "reported", label: "Reported", width: "110px" }]
      : []),
    ...(!hiddenCols.includes("assigned")
      ? [{ key: "assigned", label: "Assigned to" }]
      : []),
    ...(!hiddenCols.includes("cost")
      ? [{ key: "cost", label: "Est. cost", align: "right" as const, width: "90px" }]
      : []),
    { key: "action", label: "", width: "100px", align: "right" as const },
  ]

  return (
    <div className="space-y-5">
      {/* Status HUD: quick read on maintenance health before the table */}
      <MaintenanceHealthStrip issues={HVT_MAINTENANCE} />

      <DataTable
        columns={allCols}
        minWidth="720px"
        emptyMessage="No issues match your search."
        toolbar={
          <DataTableCompoundToolbar
            controls={
              <>
                <CompoundSortButton
                  sortField={sortField}
                  sortDir={sortDir}
                  fields={MAINTENANCE_SORT_FIELDS}
                  onSort={({ field, dir }) => {
                    setSortField(field)
                    setSortDir(dir)
                  }}
                />
                <CompoundColumnsButton
                  columns={MAINTENANCE_TOGGLE_COLS}
                  hidden={hiddenCols}
                  onToggle={({ key }) => toggleColumn(key)}
                />
                <DataTableToolbarActions>
                  <Button size="sm">
                    <Plus className="size-3.5" aria-hidden /> Log issue
                  </Button>
                </DataTableToolbarActions>
              </>
            }
          >
            {/* Search */}
            <DataTableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search issues..."
              icon={Wrench}
              className="w-52"
            />

            {/* Active filter conditions */}
            {conditions.map((cond) => {
              const fieldCfg = MAINTENANCE_FILTER_FIELDS.find((f) => f.field === cond.field)!
              return (
                <FilterConditionChip
                  key={cond.id}
                  condition={cond}
                  fieldConfig={fieldCfg}
                  onValueChange={({ value }) => updateCondition(cond.id, value)}
                  onRemove={() => removeCondition(cond.id)}
                />
              )
            })}

            {/* Add filter */}
            <AddFilterButton
              fields={MAINTENANCE_FILTER_FIELDS}
              activeFields={conditions.map((c) => c.field)}
              onAdd={({ field }) => addCondition(field)}
            />
          </DataTableCompoundToolbar>
        }
        footer={
          <DataTableFooter
            filtered={filtered.length}
            total={HVT_MAINTENANCE.length}
            noun="issues"
            showClear={anyFilters || sortField !== "priority" || sortDir !== "asc"}
            onClearAll={clearAll}
          />
        }
      >
        {filtered.map((issue) => (
          <DataTableRow
            key={issue.id}
            tone={
              issue.priority === "emergency"
                ? "danger"
                : issue.priority === "urgent"
                  ? "warning"
                  : undefined
            }
          >
            {/* Issue title and location */}
            <DataTableCell>
              <p className="text-sm font-semibold text-foreground">{issue.title}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{issue.location}</p>
            </DataTableCell>

            {/* Priority badge */}
            {!hiddenCols.includes("priority") && (
              <DataTableCell>
                <Badge variant={PRIORITY_BADGE_VARIANT[issue.priority]} size="sm">
                  {PRIORITY_LABELS[issue.priority]}
                </Badge>
              </DataTableCell>
            )}

            {/* Status and resolution flags */}
            <DataTableCell>
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={STATUS_BADGE_VARIANT[issue.status]} size="sm">
                  {STATUS_LABELS[issue.status]}
                </Badge>
                {issue.requiresResolution && (
                  <Badge variant="warning" size="sm">Needs resolution</Badge>
                )}
              </div>
            </DataTableCell>

            {/* Reported date */}
            {!hiddenCols.includes("reported") && (
              <DataTableCell>
                <span className="text-xs text-ink-muted whitespace-nowrap">{issue.reported}</span>
              </DataTableCell>
            )}

            {/* Assigned contractor */}
            {!hiddenCols.includes("assigned") && (
              <DataTableCell>
                <span className="text-sm text-foreground">
                  {issue.assignedTo ?? "—"}
                </span>
              </DataTableCell>
            )}

            {/* Estimated cost */}
            {!hiddenCols.includes("cost") && (
              <DataTableCell align="right">
                <span className="text-sm tabular-nums text-foreground">
                  {issue.estimatedCost ? formatCurrency(issue.estimatedCost) : "—"}
                </span>
              </DataTableCell>
            )}

            {/* Row actions */}
            <DataTableCell align="right">
              <div className="flex items-center justify-end gap-2">
                {issue.status === "pending-approval" && (
                  <button
                    type="button"
                    className="text-xs font-medium text-forest opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                  >
                    Approve
                  </button>
                )}
                <button
                  type="button"
                  className="text-xs text-forest opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                >
                  Details
                </button>
              </div>
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Contractors tab
// ─────────────────────────────────────────────────────────

const HVT_CONTRACTORS = [
  { id: "ctr-001", name: "Harbour Lift Services", service: "Lift maintenance and emergency", licence: "QLD MER-44812", insuranceExpiry: "31 Dec 2026", status: "active" },
  { id: "ctr-002", name: "Total Fire Protection", service: "Annual fire safety certification", licence: "QLD FPS-22341", insuranceExpiry: "30 Jun 2027", status: "active" },
  { id: "ctr-003", name: "Green Gardens Co", service: "Common area gardens and irrigation", licence: "ABN 55 234 876 123", insuranceExpiry: "30 Sep 2026", status: "active" },
  { id: "ctr-004", name: "TechSec Systems", service: "Security, intercom and access control", licence: "QLD SEC-81234", insuranceExpiry: "31 Aug 2026", status: "active" },
]

function ContractorsTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-sm border border-border bg-off-white px-4 py-3">
        <Info className="mt-0.5 size-4 shrink-0 text-ink-muted" aria-hidden />
        <p className="text-sm text-ink-muted">
          These contractors are engaged for this property. The full portfolio contractor register
          including licences, insurance certificates, and performance history is managed
          in <button type="button" className="font-medium text-forest underline underline-offset-2">Portfolio / Contractors</button>.
        </p>
      </div>

      <Widget>
        <WidgetHeader>
          <WidgetTitle icon={ClipboardList}>Engaged contractors</WidgetTitle>
          <WidgetAction href="#">Manage</WidgetAction>
        </WidgetHeader>
        <WidgetContent flush>
          <DataTable
            framed={false}
            columns={[
              { key: "contractor", label: "Contractor" },
              { key: "licence", label: "Licence" },
              { key: "insurance", label: "Insurance expires" },
              { key: "status", label: "Status", width: "80px" },
            ]}
          >
            {HVT_CONTRACTORS.map((c) => (
              <DataTableRow key={c.id}>
                <DataTableCell>
                  <p className="text-sm font-semibold text-foreground">{c.name}</p>
                  <p className="mt-0.5 text-xs text-ink-muted">{c.service}</p>
                </DataTableCell>
                <DataTableCell>
                  <span className="font-mono text-xs text-ink-muted">{c.licence}</span>
                </DataTableCell>
                <DataTableCell>
                  <span className="text-sm text-foreground">{c.insuranceExpiry}</span>
                </DataTableCell>
                <DataTableCell>
                  <Badge variant="accent" size="sm">Active</Badge>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTable>
        </WidgetContent>
      </Widget>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Insurance tab
// ─────────────────────────────────────────────────────────

function InsuranceTab() {
  const launchCowork = useLaunchCowork()
  const renewalAction = getBuildingInsuranceRenewalAction()

  return (
    <div className="space-y-5">
      {/* Priority banner: building insurance renewal */}
      <AgentAction
        variant="banner"
        urgency={renewalAction.urgency}
        title={renewalAction.title}
        description={renewalAction.description}
        prompt={renewalAction.prompt}
        category={renewalAction.category}
        icon={renewalAction.icon}
        cta={renewalAction.cta}
        onTrigger={(prompt) => launchCowork({ prompt })}
      />

      <div className="space-y-4">
        {HVT_INSURANCE.map((policy) => (
          <div key={policy.id} className={cn(
            "rounded-sm border p-4 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
            policy.status === "expired" || policy.status === "renewal-pending" ? "border-danger-soft" : "border-border"
          )}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">{policy.type}</p>
                  <Badge
                    variant={
                      policy.status === "expired" || policy.status === "renewal-pending" ? "destructive"
                        : policy.status === "expiring" ? "warning" : "accent"
                    }
                    size="sm"
                  >
                    {policy.status === "renewal-pending" ? "Renewal pending"
                      : policy.status === "expired" ? "Expired"
                        : policy.status === "expiring" ? "Expiring soon" : "Current"}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-ink-muted">{policy.insurer} · Policy {policy.policyNumber}</p>
              </div>
              <Button variant="outline" size="sm">View policy</Button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Cover amount</p>
                <p className="mt-1 text-sm font-medium text-foreground">{policy.coverAmount ?? "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Annual premium</p>
                <p className="mt-1 text-sm font-medium text-foreground">{policy.premium ? formatCurrency(policy.premium) : "—"}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Expiry date</p>
                <p className={cn("mt-1 text-sm font-medium", policy.status === "renewal-pending" || policy.status === "expired" ? "text-danger" : "text-foreground")}>
                  {policy.expiry}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Fund source</p>
                <p className="mt-1 text-sm text-ink-muted">Administrative Fund</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Compliance tab
// ─────────────────────────────────────────────────────────

function ComplianceTab() {
  const launchCowork = useLaunchCowork()
  const hasOverdue = HVT_COMPLIANCE.some((item) => item.status === "overdue")
  const afssAction = getAfssComplianceAction()

  return (
    <div className="space-y-5">
      {/* Priority banner: overdue AFSS */}
      {hasOverdue ? (
        <AgentAction
          variant="banner"
          urgency={afssAction.urgency}
          title={afssAction.title}
          description={afssAction.description}
          prompt={afssAction.prompt}
          category={afssAction.category}
          icon={afssAction.icon}
          cta={afssAction.cta}
          onTrigger={(prompt) => launchCowork({ prompt })}
        />
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">Statutory obligations, certifications, and by-law management for this property.</p>
        <Button size="sm" variant="outline">
          <Plus className="size-3.5" aria-hidden /> Add item
        </Button>
      </div>

      <Widget>
        <WidgetHeader>
          <WidgetTitle icon={ShieldCheck}>Compliance schedule</WidgetTitle>
        </WidgetHeader>
        <WidgetContent flush>
          <DataTable
            framed={false}
            columns={[
              { key: "item", label: "Item" },
              { key: "due", label: "Due date", width: "130px" },
              { key: "status", label: "Status", width: "120px" },
              { key: "actions", label: "", width: "88px" },
            ]}
          >
            {HVT_COMPLIANCE.map((item) => (
              <DataTableRow
                key={item.id}
                tone={item.status === "overdue" ? "danger" : item.status === "due-soon" ? "warning" : undefined}
              >
                <DataTableCell>
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  {item.notes && <p className="mt-0.5 text-xs text-ink-muted">{item.notes}</p>}
                </DataTableCell>
                <DataTableCell>
                  <span className={cn(
                    "text-sm",
                    item.status === "overdue" ? "font-medium text-danger" : item.status === "due-soon" ? "font-medium text-warning" : "text-foreground"
                  )}>
                    {item.dueDate}
                  </span>
                </DataTableCell>
                <DataTableCell>
                  <Badge
                    variant={item.status === "overdue" ? "destructive" : item.status === "due-soon" ? "warning" : "accent"}
                    size="sm"
                  >
                    {item.status === "overdue" ? "Overdue" : item.status === "due-soon" ? "Due soon" : "Current"}
                  </Badge>
                </DataTableCell>
                <DataTableCell align="right">
                  <Button variant="outline" size="sm">Update</Button>
                </DataTableCell>
              </DataTableRow>
            ))}
          </DataTable>
        </WidgetContent>
      </Widget>

      <Widget tone="muted">
        <WidgetHeader>
          <WidgetTitle icon={Scale}>By-laws</WidgetTitle>
          <WidgetAction href="#">View register</WidgetAction>
        </WidgetHeader>
        <WidgetContent className="px-4 pb-4 pt-2">
          <p className="text-sm text-ink-muted">
            Standard module by-laws apply. No custom by-laws have been registered for this scheme.
            Two by-law applications are pending committee consideration.
          </p>
          <div className="mt-3 space-y-2">
            {[
              { title: "Pet by-law application — Lot 31", status: "pending", date: "Received 2 Jun 2026" },
              { title: "Renovation approval — Lot 14 kitchen", status: "approved", date: "Approved 15 May 2026" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-xs border border-border bg-white px-3 py-2">
                <Gavel className="size-4 shrink-0 text-ink-muted" aria-hidden />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-foreground">{item.title}</p>
                  <p className="text-xs text-ink-muted">{item.date}</p>
                </div>
                <Badge variant={item.status === "approved" ? "accent" : "warning"} size="sm">
                  {item.status === "approved" ? "Approved" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>
        </WidgetContent>
      </Widget>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Documents tab
// ─────────────────────────────────────────────────────────

const HVT_DOCUMENTS = [
  { id: "doc-001", name: "AGM 2025 minutes", category: "Meetings", date: "20 Aug 2025", fileType: "PDF", size: "245 KB" },
  { id: "doc-002", name: "Committee meeting minutes — May 2026", category: "Meetings", date: "15 May 2026", fileType: "PDF", size: "88 KB" },
  { id: "doc-003", name: "2025-26 approved budget", category: "Finance", date: "20 Aug 2025", fileType: "PDF", size: "156 KB" },
  { id: "doc-004", name: "Management agreement", category: "Contracts", date: "1 Jul 2024", fileType: "PDF", size: "312 KB" },
  { id: "doc-005", name: "NRMA building insurance policy", category: "Insurance", date: "18 Jun 2025", fileType: "PDF", size: "1.2 MB" },
  { id: "doc-006", name: "Strata roll — 17 Jun 2026", category: "Records", date: "17 Jun 2026", fileType: "PDF", size: "78 KB" },
  { id: "doc-007", name: "Lift maintenance contract", category: "Contracts", date: "1 Feb 2025", fileType: "PDF", size: "198 KB" },
  { id: "doc-008", name: "Fire safety inspection report 2025", category: "Compliance", date: "28 Jun 2025", fileType: "PDF", size: "420 KB" },
]

const DOCUMENT_FILTER_FIELDS: CompoundFilterFieldConfig[] = [
  {
    field: "category",
    label: "Category",
    options: [
      { value: "Meetings", label: "Meetings" },
      { value: "Finance", label: "Finance" },
      { value: "Contracts", label: "Contracts" },
      { value: "Insurance", label: "Insurance" },
      { value: "Records", label: "Records" },
      { value: "Compliance", label: "Compliance" },
    ],
  },
]

const DOCUMENT_SORT_FIELDS = [
  { field: "name", label: "Name" },
  { field: "date", label: "Date" },
  { field: "category", label: "Category" },
]

const DOCUMENT_TOGGLE_COLS = [
  { key: "category", label: "Category" },
  { key: "date", label: "Date" },
  { key: "size", label: "Size" },
]

/** Parse demo document dates for sorting. */
function parseDocumentDate({ date }: { date: string }): Date {
  return parse(date, "d MMM yyyy", new Date())
}

function DocumentsTab() {
  const [search, setSearch] = React.useState("")
  const [conditions, setConditions] = React.useState<CompoundFilterCondition[]>([])
  const [sortField, setSortField] = React.useState("date")
  const [sortDir, setSortDir] = React.useState<"asc" | "desc">("desc")
  const [hiddenCols, setHiddenCols] = React.useState<string[]>([])

  function addCondition(field: string) {
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
    setSortField("date")
    setSortDir("desc")
  }
  function toggleColumn(key: string) {
    setHiddenCols((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  const anyFilters = search.trim() || conditions.some((c) => c.value)

  const filteredDocs = React.useMemo(() => {
    let rows = HVT_DOCUMENTS

    if (search.trim()) {
      const q = search.toLowerCase()
      rows = rows.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.category.toLowerCase().includes(q)
      )
    }

    for (const cond of conditions) {
      if (!cond.value) continue
      rows = rows.filter((doc) => {
        if (cond.field === "category") return doc.category === cond.value
        return true
      })
    }

    return [...rows].sort((a, b) => {
      if (!sortField) return 0

      let cmp = 0
      if (sortField === "name") {
        cmp = a.name.localeCompare(b.name)
      } else if (sortField === "category") {
        cmp = a.category.localeCompare(b.category)
      } else if (sortField === "date") {
        cmp =
          parseDocumentDate({ date: a.date }).getTime() -
          parseDocumentDate({ date: b.date }).getTime()
      }

      return sortDir === "asc" ? cmp : -cmp
    })
  }, [search, conditions, sortField, sortDir])

  const allCols: DataTableColumn[] = [
    { key: "name", label: "Name" },
    ...(!hiddenCols.includes("category")
      ? [{ key: "category", label: "Category", width: "130px" }]
      : []),
    ...(!hiddenCols.includes("date")
      ? [{ key: "date", label: "Date", width: "120px" }]
      : []),
    ...(!hiddenCols.includes("size")
      ? [{ key: "size", label: "Size", width: "80px" }]
      : []),
    { key: "action", label: "", width: "80px", align: "right" as const },
  ]

  return (
    <div className="space-y-5">
      <DataTable
        columns={allCols}
        minWidth="640px"
        emptyMessage="No documents match your search."
        toolbar={
          <DataTableCompoundToolbar
            controls={
              <>
                <CompoundSortButton
                  sortField={sortField}
                  sortDir={sortDir}
                  fields={DOCUMENT_SORT_FIELDS}
                  onSort={({ field, dir }) => {
                    setSortField(field)
                    setSortDir(dir)
                  }}
                />
                <CompoundColumnsButton
                  columns={DOCUMENT_TOGGLE_COLS}
                  hidden={hiddenCols}
                  onToggle={({ key }) => toggleColumn(key)}
                />
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
            {/* Search */}
            <DataTableSearch
              value={search}
              onChange={setSearch}
              placeholder="Search documents..."
              icon={FileText}
              className="w-52"
            />

            {/* Active filter conditions */}
            {conditions.map((cond) => {
              const fieldCfg = DOCUMENT_FILTER_FIELDS.find((f) => f.field === cond.field)!
              return (
                <FilterConditionChip
                  key={cond.id}
                  condition={cond}
                  fieldConfig={fieldCfg}
                  onValueChange={({ value }) => updateCondition(cond.id, value)}
                  onRemove={() => removeCondition(cond.id)}
                />
              )
            })}

            {/* Add filter */}
            <AddFilterButton
              fields={DOCUMENT_FILTER_FIELDS}
              activeFields={conditions.map((c) => c.field)}
              onAdd={({ field }) => addCondition(field)}
            />
          </DataTableCompoundToolbar>
        }
        footer={
          <DataTableFooter
            filtered={filteredDocs.length}
            total={HVT_DOCUMENTS.length}
            noun="documents"
            showClear={anyFilters || sortField !== "date" || sortDir !== "desc"}
            onClearAll={clearAll}
          />
        }
      >
        {filteredDocs.map((doc) => (
          <DataTableRow key={doc.id}>
            {/* Document name */}
            <DataTableCell>
              <div className="flex items-center gap-2.5">
                <FileText className="size-4 shrink-0 text-ink-muted" aria-hidden />
                <span className="text-sm font-medium text-foreground">{doc.name}</span>
              </div>
            </DataTableCell>

            {/* Category */}
            {!hiddenCols.includes("category") && (
              <DataTableCell>
                <Badge variant="default" size="sm">{doc.category}</Badge>
              </DataTableCell>
            )}

            {/* Date */}
            {!hiddenCols.includes("date") && (
              <DataTableCell>
                <span className="text-xs text-ink-muted whitespace-nowrap">{doc.date}</span>
              </DataTableCell>
            )}

            {/* File size */}
            {!hiddenCols.includes("size") && (
              <DataTableCell>
                <span className="text-xs text-ink-muted">{doc.size}</span>
              </DataTableCell>
            )}

            {/* Row action */}
            <DataTableCell align="right">
              <button
                type="button"
                className="text-xs text-forest opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              >
                Download
              </button>
            </DataTableCell>
          </DataTableRow>
        ))}
      </DataTable>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Communications tab
// ─────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────
// Issues tab demo data
// ─────────────────────────────────────────────────────────

type IssueStatus = "open" | "in-progress" | "pending" | "resolved" | "closed"
type IssuePriority = "emergency" | "urgent" | "normal" | "low"
type IssueCategory = "defect" | "by-law" | "noise" | "safety" | "complaint" | "general"

interface Issue {
  id: string
  title: string
  category: IssueCategory
  lot?: number
  reportedBy: string
  reportedDate: string
  lastUpdate: string
  status: IssueStatus
  priority: IssuePriority
  assignee?: string
  description: string
}

const HVT_ISSUES: Issue[] = [
  {
    id: "ISS-001",
    title: "Lift 2 out of service — motor failure",
    category: "defect",
    reportedBy: "Jennifer Walsh (Lot 3)",
    reportedDate: "16 Jun 2026",
    lastUpdate: "Today",
    status: "in-progress",
    priority: "emergency",
    assignee: "Harbour Lift Services",
    description: "Lift 2 stopped mid-floor at Level 8. Motor fault confirmed by Harbour Lift Services. Parts on order.",
  },
  {
    id: "ISS-002",
    title: "Water ingress through bathroom ceiling",
    category: "defect",
    lot: 38,
    reportedBy: "Marcus Lee (Lot 38)",
    reportedDate: "14 Jun 2026",
    lastUpdate: "15 Jun 2026",
    status: "open",
    priority: "urgent",
    description: "Owner reports water staining and active leak from ceiling in en-suite. Likely source: Lot 39 balcony drain.",
  },
  {
    id: "ISS-003",
    title: "Pool gate latch broken — compliance risk",
    category: "safety",
    reportedBy: "Thomas Green (Lot 12)",
    reportedDate: "13 Jun 2026",
    lastUpdate: "14 Jun 2026",
    status: "in-progress",
    priority: "urgent",
    assignee: "Active Fencing Co.",
    description: "Pool barrier gate will not latch closed. Self-closing mechanism spring broken. Compliance risk under Pool Safety Regulation.",
  },
  {
    id: "ISS-004",
    title: "Short-term rental operating without approval — Lot 12",
    category: "by-law",
    lot: 12,
    reportedBy: "Patricia Moore (Lot 11)",
    reportedDate: "9 Jun 2026",
    lastUpdate: "12 Jun 2026",
    status: "open",
    priority: "normal",
    description: "Multiple unrelated guests observed using Lot 12 over the past 3 weekends. Owner has not notified body corporate. Possible by-law 3.2 breach.",
  },
  {
    id: "ISS-005",
    title: "Repeated noise disturbance after 11pm",
    category: "noise",
    lot: 22,
    reportedBy: "Anna Nguyen (Lot 21)",
    reportedDate: "7 Jun 2026",
    lastUpdate: "8 Jun 2026",
    status: "pending",
    priority: "normal",
    description: "Third complaint this quarter regarding loud music and gatherings in Lot 22 after 11pm. Notice of breach issued, awaiting response.",
  },
  {
    id: "ISS-006",
    title: "Parking dispute — visitor bays blocked by Lot 7",
    category: "complaint",
    lot: 7,
    reportedBy: "Rachel Kim (Lot 8)",
    reportedDate: "5 Jun 2026",
    lastUpdate: "6 Jun 2026",
    status: "pending",
    priority: "normal",
    description: "Lot 7 owner regularly parking second vehicle in visitor bay P3. Notice sent to owner on 6 Jun, awaiting response.",
  },
  {
    id: "ISS-007",
    title: "Graffiti on Level 2 east stairwell",
    category: "general",
    reportedBy: "Building manager",
    reportedDate: "3 Jun 2026",
    lastUpdate: "3 Jun 2026",
    status: "open",
    priority: "low",
    description: "Graffiti tag on Level 2 east stairwell wall. Contractor quote requested for removal and repaint.",
  },
  {
    id: "ISS-008",
    title: "Common area smoke detector — intermittent fault",
    category: "safety",
    reportedBy: "John Murphy (Lot 5)",
    reportedDate: "28 May 2026",
    lastUpdate: "2 Jun 2026",
    status: "resolved",
    priority: "urgent",
    assignee: "Safe Fire Systems",
    description: "Level 4 corridor smoke detector triggering false alarms. Replaced and tested on 2 Jun 2026 by Safe Fire Systems. Resolved.",
  },
]

const ISSUE_STATUS_CONFIG: Record<IssueStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  "open": { label: "Open", variant: "warning" },
  "in-progress": { label: "In progress", variant: "info" },
  "pending": { label: "Pending", variant: "outline" },
  "resolved": { label: "Resolved", variant: "accent" },
  "closed": { label: "Closed", variant: "secondary" },
}

const ISSUE_PRIORITY_CONFIG: Record<IssuePriority, { label: string; dot: string }> = {
  "emergency": { label: "Emergency", dot: "bg-red-500" },
  "urgent": { label: "Urgent", dot: "bg-amber-500" },
  "normal": { label: "Normal", dot: "bg-blue-400" },
  "low": { label: "Low", dot: "bg-slate-300" },
}

const ISSUE_CATEGORY_LABELS: Record<IssueCategory, string> = {
  "defect": "Defect",
  "by-law": "By-law",
  "noise": "Noise",
  "safety": "Safety",
  "complaint": "Complaint",
  "general": "General",
}

const ISSUE_FILTER_FIELDS: CompoundFilterFieldConfig[] = [
  {
    field: "status",
    label: "Status",
    options: [
      { value: "open",        label: "Open",        tone: "warning" },
      { value: "in-progress", label: "In progress", tone: "info"    },
      { value: "pending",     label: "Pending",     tone: "neutral" },
      { value: "resolved",    label: "Resolved",    tone: "success" },
      { value: "closed",      label: "Closed",      tone: "neutral" },
    ],
  },
  {
    field: "priority",
    label: "Priority",
    options: [
      { value: "emergency", label: "Emergency", tone: "danger"  },
      { value: "urgent",    label: "Urgent",    tone: "warning" },
      { value: "normal",    label: "Normal",    tone: "neutral" },
      { value: "low",       label: "Low",       tone: "neutral" },
    ],
  },
  {
    field: "category",
    label: "Category",
    options: [
      { value: "defect",    label: "Defect"    },
      { value: "by-law",    label: "By-law"    },
      { value: "noise",     label: "Noise"     },
      { value: "safety",    label: "Safety"    },
      { value: "complaint", label: "Complaint" },
      { value: "general",   label: "General"   },
    ],
  },
]

const ISSUE_SORT_FIELDS = [
  { field: "reportedDate", label: "Reported date" },
  { field: "priority",     label: "Priority"      },
  { field: "title",        label: "Title"         },
]

const ISSUE_TOGGLE_COLS = [
  { key: "priority", label: "Priority" },
  { key: "reported", label: "Reported" },
  { key: "status",   label: "Status"   },
]

function IssuesTab() {
  const [issueSearch, setIssueSearch] = React.useState("")
  const [conditions,  setConditions]  = React.useState<CompoundFilterCondition[]>([])
  const [sortField,   setSortField]   = React.useState("")
  const [sortDir,     setSortDir]     = React.useState<"asc" | "desc">("asc")
  const [hiddenCols,  setHiddenCols]  = React.useState<string[]>([])
  const [selected,    setSelected]    = React.useState<Issue | null>(null)

  const PRIORITY_ORDER_MAP: Record<IssuePriority, number> = { emergency: 0, urgent: 1, normal: 2, low: 3 }

  function addCondition(field: string) {
    setConditions((prev) => [...prev, { id: crypto.randomUUID(), field, value: "" }])
  }
  function updateCondition(id: string, value: string) {
    setConditions((prev) => prev.map((c) => (c.id === id ? { ...c, value } : c)))
  }
  function removeCondition(id: string) {
    setConditions((prev) => prev.filter((c) => c.id !== id))
  }
  function clearAll() {
    setIssueSearch("")
    setConditions([])
  }
  function toggleColumn(key: string) {
    setHiddenCols((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key])
  }

  const anyFilters = issueSearch.trim() || conditions.some((c) => c.value)

  const filtered = React.useMemo(() => {
    let rows = HVT_ISSUES
    if (issueSearch.trim()) {
      const q = issueSearch.toLowerCase()
      rows = rows.filter((i) =>
        i.title.toLowerCase().includes(q) ||
        i.reportedBy.toLowerCase().includes(q)
      )
    }
    for (const cond of conditions) {
      if (!cond.value) continue
      rows = rows.filter((i) => {
        if (cond.field === "status")   return i.status   === cond.value
        if (cond.field === "priority") return i.priority === cond.value
        if (cond.field === "category") return i.category === cond.value
        return true
      })
    }
    return [...rows].sort((a, b) => {
      if (!sortField) return 0
      let cmp = 0
      if (sortField === "priority")     cmp = PRIORITY_ORDER_MAP[a.priority] - PRIORITY_ORDER_MAP[b.priority]
      else if (sortField === "title")   cmp = a.title.localeCompare(b.title)
      else cmp = a.reportedDate.localeCompare(b.reportedDate)
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [issueSearch, conditions, sortField, sortDir])

  const allCols: DataTableColumn[] = [
    ...(!hiddenCols.includes("priority") ? [{ key: "priority", label: "Priority", width: "110px" }] : []),
    { key: "issue",    label: "Issue"                                                 },
    ...(!hiddenCols.includes("reported") ? [{ key: "reported", label: "Reported"                 }] : []),
    ...(!hiddenCols.includes("status")   ? [{ key: "status",   label: "Status",  width: "120px"  }] : []),
    { key: "action",   label: "",         width: "40px", align: "right" as const      },
  ]

  return (
    <div className="space-y-5">
      {selected ? (
        /* Issue detail panel */
        <div className="space-y-5">
          <button
            type="button"
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink"
          >
            <ChevronRight className="size-3.5 rotate-180" aria-hidden />
            Back to issues
          </button>

          <Widget>
            <WidgetHeader>
              <div className="flex flex-wrap items-center gap-2">
                {/* Priority dot */}
                <span
                  className={cn("size-2 shrink-0 rounded-full", ISSUE_PRIORITY_CONFIG[selected.priority].dot)}
                  title={ISSUE_PRIORITY_CONFIG[selected.priority].label}
                />
                <WidgetTitle icon={CircleDot}>{selected.title}</WidgetTitle>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={ISSUE_STATUS_CONFIG[selected.status].variant}>
                  {ISSUE_STATUS_CONFIG[selected.status].label}
                </Badge>
              </div>
            </WidgetHeader>
            <WidgetContent>
              <div className="space-y-4">
                {/* Description */}
                <p className="text-sm text-ink leading-relaxed">{selected.description}</p>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-3 border-t border-border pt-4 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Issue ID</p>
                    <p className="mt-0.5 font-mono text-xs text-ink">{selected.id}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Category</p>
                    <p className="mt-0.5 text-ink">{ISSUE_CATEGORY_LABELS[selected.category]}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Priority</p>
                    <p className="mt-0.5 text-ink">{ISSUE_PRIORITY_CONFIG[selected.priority].label}</p>
                  </div>
                  {selected.lot !== undefined && (
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Lot</p>
                      <p className="mt-0.5 text-ink">Lot {selected.lot}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Reported by</p>
                    <p className="mt-0.5 text-ink">{selected.reportedBy}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Reported</p>
                    <p className="mt-0.5 text-ink">{selected.reportedDate}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Last update</p>
                    <p className="mt-0.5 text-ink">{selected.lastUpdate}</p>
                  </div>
                  {selected.assignee && (
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-ink-muted">Assignee</p>
                      <p className="mt-0.5 text-ink">{selected.assignee}</p>
                    </div>
                  )}
                </div>
              </div>
            </WidgetContent>
            <WidgetFooter>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Add note</Button>
                <Button variant="outline" size="sm">Reassign</Button>
                <Button size="sm">Update status</Button>
              </div>
            </WidgetFooter>
          </Widget>
        </div>
      ) : (
        /* Issues list — DataTable with compound filter toolbar */
        <DataTable
          columns={allCols}
          emptyMessage="No issues match your current filters."
          minWidth="600px"
          toolbar={
            <DataTableCompoundToolbar
              controls={
                <>
                  <CompoundSortButton
                    sortField={sortField}
                    sortDir={sortDir}
                    fields={ISSUE_SORT_FIELDS}
                    onSort={({ field, dir }) => { setSortField(field); setSortDir(dir) }}
                  />
                  <CompoundColumnsButton
                    columns={ISSUE_TOGGLE_COLS}
                    hidden={hiddenCols}
                    onToggle={({ key }) => toggleColumn(key)}
                  />
                  <DataTableToolbarActions>
                    <Button size="sm">
                      <Plus className="size-3.5" aria-hidden />
                      New issue
                    </Button>
                  </DataTableToolbarActions>
                </>
              }
            >
              {/* Search */}
              <DataTableSearch
                value={issueSearch}
                onChange={setIssueSearch}
                placeholder="Search issues..."
                className="w-52"
              />
              {/* Active filter conditions */}
              {conditions.map((cond) => {
                const fieldCfg = ISSUE_FILTER_FIELDS.find((f) => f.field === cond.field)!
                return (
                  <FilterConditionChip
                    key={cond.id}
                    condition={cond}
                    fieldConfig={fieldCfg}
                    onValueChange={({ value }) => updateCondition(cond.id, value)}
                    onRemove={() => removeCondition(cond.id)}
                  />
                )
              })}
              {/* Add filter */}
              <AddFilterButton
                fields={ISSUE_FILTER_FIELDS}
                activeFields={conditions.map((c) => c.field)}
                onAdd={({ field }) => addCondition(field)}
              />
            </DataTableCompoundToolbar>
          }
          footer={
            <DataTableFooter
              filtered={filtered.length}
              total={HVT_ISSUES.length}
              noun="issues"
              showClear={anyFilters}
              onClearAll={clearAll}
            />
          }
        >
          {filtered.map((issue) => {
            const priority = ISSUE_PRIORITY_CONFIG[issue.priority]
            const status = ISSUE_STATUS_CONFIG[issue.status]
            return (
              <DataTableRow
                key={issue.id}
                onClick={() => setSelected(issue)}
                tone={
                  issue.priority === "emergency" ? "danger"
                    : issue.priority === "urgent" ? "warning"
                      : undefined
                }
              >
                {/* Priority: dot + label */}
                {!hiddenCols.includes("priority") && (
                  <DataTableCell>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn("size-2 shrink-0 rounded-full", priority.dot)}
                        aria-hidden
                      />
                      <span className="text-xs font-medium text-foreground">
                        {priority.label}
                      </span>
                    </div>
                  </DataTableCell>
                )}

                {/* Issue: title + category + lot + meta */}
                <DataTableCell>
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-sm font-medium text-foreground">
                        {issue.title}
                      </span>
                      <Badge variant="secondary" size="sm">
                        {ISSUE_CATEGORY_LABELS[issue.category]}
                      </Badge>
                      {issue.lot !== undefined && (
                        <span className="text-[11px] text-ink-muted">Lot {issue.lot}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-ink-muted">
                      {issue.id}
                      {issue.assignee ? ` · ${issue.assignee}` : ""}
                    </p>
                  </div>
                </DataTableCell>

                {/* Reported by + last update */}
                {!hiddenCols.includes("reported") && (
                  <DataTableCell>
                    <p className="text-xs text-ink-muted">{issue.reportedBy}</p>
                    <p className="mt-0.5 text-[11px] text-ink-muted/70">Updated {issue.lastUpdate}</p>
                  </DataTableCell>
                )}

                {/* Status badge */}
                {!hiddenCols.includes("status") && (
                  <DataTableCell>
                    <Badge variant={status.variant} size="sm">
                      {status.label}
                    </Badge>
                  </DataTableCell>
                )}

                {/* Chevron */}
                <DataTableCell align="right">
                  <ChevronRight className="size-4 text-ink-muted opacity-0 transition-opacity duration-150 group-hover:opacity-100" aria-hidden />
                </DataTableCell>
              </DataTableRow>
            )
          })}
        </DataTable>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Communications tab demo data + component
// ─────────────────────────────────────────────────────────

const HVT_COMMS = [
  { id: "comm-001", from: "Robert Davis (Lot 7)", subject: "Levy payment plan request", date: "10 Jun 2026", type: "owner-inbound", status: "replied" },
  { id: "comm-002", from: "Jennifer Walsh (Committee chair)", subject: "Lift 2 emergency — update request", date: "17 Jun 2026", type: "committee-inbound", status: "open" },
  { id: "comm-003", from: "Sarah Mitchell (Manager)", subject: "Q3 levy notices issued", date: "1 Jun 2026", type: "notice-outbound", status: "sent" },
  { id: "comm-004", from: "NRMA Insurance", subject: "Building policy renewal quote", date: "5 Jun 2026", type: "third-party", status: "action-needed" },
  { id: "comm-005", from: "Harbour Lift Services", subject: "Lift modernisation quote — 3 options", date: "11 Jun 2026", type: "third-party", status: "forwarded" },
]

function CommunicationsTab() {
  const launchCowork = useLaunchCowork()
  const renewalAction = getBuildingInsuranceRenewalAction()
  const actionNeeded = HVT_COMMS.filter((comm) => comm.status === "action-needed")

  return (
    <div className="space-y-5">
      {/* Agent actions for correspondence requiring follow-up */}
      {actionNeeded.length > 0 ? (
        <AgentActionList title="Suggested agent actions">
          {actionNeeded.map((comm) => (
            <AgentAction
              key={comm.id}
              variant="row"
              title="Review NRMA renewal quote"
              description={`${comm.from} · ${comm.date}. Compare the renewal quote and prepare a committee recommendation.`}
              prompt={renewalAction.prompt}
              category="Insurance"
              icon={ShieldCheck}
              urgency="danger"
              cta="Review quote"
              onTrigger={(prompt) => launchCowork({ prompt })}
            />
          ))}
        </AgentActionList>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">Correspondence, notices, and communications for this property.</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Send notice</Button>
          <Button size="sm"><Mail className="size-3.5" aria-hidden />New message</Button>
        </div>
      </div>

      <Widget>
        <WidgetHeader>
          <WidgetTitle icon={MessageSquare}>Recent correspondence</WidgetTitle>
          <WidgetAction href="#">View all</WidgetAction>
        </WidgetHeader>
        <WidgetContent flush>
          <WidgetList>
            {HVT_COMMS.map((comm) => (
              <WidgetListItem
                key={comm.id}
                icon={comm.type === "notice-outbound" ? FileText : Mail}
                iconTone={comm.status === "action-needed" || comm.status === "open" ? "warning" : "default"}
                title={comm.subject}
                meta={`${comm.from} · ${comm.date}`}
                href="#"
                trailing={
                  <Badge
                    variant={
                      comm.status === "action-needed" ? "warning"
                        : comm.status === "open" ? "warning"
                          : comm.status === "sent" ? "accent"
                            : "default"
                    }
                    size="sm"
                  >
                    {comm.status === "action-needed" ? "Action needed"
                      : comm.status === "open" ? "Open"
                        : comm.status === "replied" ? "Replied"
                          : comm.status === "sent" ? "Sent"
                            : "Forwarded"}
                  </Badge>
                }
              />
            ))}
          </WidgetList>
        </WidgetContent>
      </Widget>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// PropertyDetail: main component
// ─────────────────────────────────────────────────────────

export interface PropertyDetailProps {
  propertyId: string
  onBack: () => void
  /** Controlled active tab — driven by the sidebar nav in the parent. */
  activeTab: PropertyTab
  /** Called when internal quick links want to navigate to a section. */
  onNavigate?: (tab: PropertyTab) => void
  /** Drill into a registered proprietor profile from the owners roll. */
  onOwnerSelect?: ({ ownerId }: { ownerId: string }) => void
}

/**
 * Comprehensive property (scheme) detail view. Sticky context bar plus
 * eleven sub-sections covering everything a strata manager needs for
 * one property: overview, owners, committee, meetings, finance (QLD
 * direct trust model), maintenance, contractors, insurance, documents,
 * compliance, and communications.
 */
export function PropertyDetail({
  propertyId,
  onBack,
  activeTab,
  onNavigate,
  onOwnerSelect,
}: PropertyDetailProps) {
  const scheme = PORTFOLIO_PROPERTIES.find((p) => p.id === propertyId)

  if (!scheme) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-ink-muted">Property not found.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-0 flex-col">
      {/* Tab content: activeTab is fully controlled by the sidebar nav in AppPreview */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto w-full max-w-content">
          {activeTab === "overview" && (
            <OverviewTab propertyId={propertyId} onNavigate={(tab) => onNavigate?.(tab)} />
          )}
          {activeTab === "issues" && <IssuesTab />}
          {activeTab === "owners" && (
            <OwnersRollTab propertyId={propertyId} onOwnerSelect={onOwnerSelect} />
          )}
          {activeTab === "committee" && <CommitteeTab />}
          {activeTab === "meetings" && <MeetingsTab />}
          {activeTab === "finance" && <FinanceTab />}
          {activeTab === "maintenance" && <MaintenanceTab />}
          {activeTab === "contractors" && <ContractorsTab />}
          {activeTab === "insurance" && <InsuranceTab />}
          {activeTab === "documents" && <DocumentsTab />}
          {activeTab === "compliance" && <ComplianceTab />}
          {activeTab === "communications" && <CommunicationsTab />}
        </div>
      </div>
    </div>
  )
}
