import type { CSSProperties } from "react"
import { addDays, format } from "date-fns"
import {
  LayoutDashboard,
  MessageSquare,
  AlertCircle,
  Calendar,
  ClipboardList,
  Building2,
  Users,
  Settings,
  SlidersHorizontal,
  CreditCard,
  Bell,
  ShieldCheck,
  Plug,
  UserCog,
  FileText,
  Home,
  User,
} from "lucide-react"

import type { NavGroup, NavPanel, NavSearchResult, AgentSession } from "@/components/ui/app-shell"
import type { OnboardingStep } from "@/components/ui/onboarding"
import type { UpcomingEvent } from "@/components/ui/sidebar-upcoming"

/** Second-tier navigation that Settings drills into. */
export const APP_SETTINGS_PANEL: NavPanel = {
  title: "Settings",
  groups: [
    {
      label: "Workspace",
      items: [
        { title: "General", href: "#", icon: SlidersHorizontal, isActive: true },
        { title: "Members", href: "#", icon: Users },
        { title: "Billing", href: "#", icon: CreditCard },
        { title: "Integrations", href: "#", icon: Plug },
      ],
    },
    {
      label: "Account",
      items: [
        { title: "Profile", href: "#", icon: UserCog },
        { title: "Notifications", href: "#", icon: Bell },
        { title: "Security", href: "#", icon: ShieldCheck },
      ],
    },
  ],
}

/** Demo navigation shared by the docs layout demo and full-screen preview. */
export const APP_SHELL_NAV: NavGroup[] = [
  {
    items: [
      { title: "Dashboard", href: "#", icon: LayoutDashboard, isActive: true },
      { title: "Inbox", href: "#", icon: MessageSquare },
      { title: "Issues", href: "#", icon: AlertCircle },
      { title: "Meetings", href: "#", icon: Calendar },
      { title: "Tasks", href: "#", icon: ClipboardList },
      { title: "Schemes", href: "#", icon: Building2 },
      { title: "Contacts", href: "#", icon: Users },
      {
        title: "Settings",
        href: "#",
        icon: Settings,
        panel: APP_SETTINGS_PANEL,
      },
    ],
  },
]

/**
 * Sample entity rows for sidebar search in the app layout demo and preview.
 * These are not shown in the main nav; they appear when searching.
 */
export const APP_SHELL_SEARCH_EXTRAS: NavSearchResult[] = [
  {
    title: "Harbour View Towers",
    subtitle: "SP 48291 · 42 lots · Active",
    href: "#",
    icon: Building2,
    kind: "scheme",
  },
  {
    title: "Sunset Gardens",
    subtitle: "SP 12045 · Onboarding",
    href: "#",
    icon: Building2,
    kind: "scheme",
  },
  {
    title: "Lot 14",
    subtitle: "Harbour View Towers · Levy due",
    href: "#",
    icon: Home,
    kind: "lot",
  },
  {
    title: "Lot 8",
    subtitle: "Sunset Gardens · Owner occupied",
    href: "#",
    icon: Home,
    kind: "lot",
  },
  {
    title: "Margaret Chen",
    subtitle: "Lot 14 · Owner",
    href: "#",
    icon: User,
    kind: "owner",
  },
  {
    title: "James Okonkwo",
    subtitle: "Lot 22 · Committee secretary",
    href: "#",
    icon: User,
    kind: "owner",
  },
  {
    title: "AGM 2025 minutes",
    subtitle: "Harbour View Towers · PDF",
    href: "#",
    icon: FileText,
    kind: "document",
  },
  {
    title: "Levy notice · Lot 14",
    subtitle: "Issued 12 Mar 2025",
    href: "#",
    icon: FileText,
    kind: "document",
  },
]

/**
 * Demo agent sessions for the assistant sidebar in agentic mode.
 */
export const APP_AGENT_SESSIONS: AgentSession[] = [
  {
    id: "agent_agm",
    title: "AGM notice pack review",
    preview: "Draft motions for Northbridge Estate",
    when: "Today",
  },
  {
    id: "agent_lift",
    title: "Lift contractor follow-up",
    preview: "Chase quotes before committee meeting",
    when: "Today",
  },
  {
    id: "agent_levy",
    title: "Levy payment plan",
    preview: "Lot 7 hardship request terms",
    when: "Yesterday",
  },
  {
    id: "agent_hub",
    title: "Strata Hub lodgement",
    preview: "Overdue return checklist",
    when: "Monday",
  },
]

/**
 * Today's schedule for the sidebar, aligned with the dashboard preview data.
 */
export function getAppShellScheduleEvents({
  reference = new Date("2026-06-17"),
}: { reference?: Date } = {}): UpcomingEvent[] {
  const day = format(reference, "yyyy-MM-dd")

  return [
    {
      id: "sched_review",
      title: "Clear review queue",
      date: day,
      time: "Now",
      kind: "meeting",
      tone: "accent",
      href: "#ai-review",
    },
    {
      id: "sched_committee",
      title: "Committee meeting",
      subtitle: "Harbour View · lift quotes",
      date: day,
      time: "10:00",
      kind: "meeting",
      href: "#",
    },
    {
      id: "sched_hub",
      title: "Strata Hub lodgement",
      subtitle: "Northbridge Estate",
      date: day,
      time: "14:00",
      kind: "deadline",
      href: "#",
    },
  ]
}

/**
 * Demo upcoming events for the app layout preview (today + next 5 days).
 */
export function getAppShellUpcomingEvents({
  reference = new Date(),
}: { reference?: Date } = {}): UpcomingEvent[] {
  const day = (offset: number) =>
    format(addDays(reference, offset), "yyyy-MM-dd")

  return [
    {
      id: "agm-harbour",
      title: "AGM · Harbour View Towers",
      href: "#",
      date: day(0),
      time: "6:00 pm",
      scheme: "Committee",
      kind: "agm",
    },
    {
      id: "levy-reminder",
      title: "Levy reminders send",
      href: "#",
      date: day(0),
      time: "9:00 am",
      scheme: "All schemes",
      kind: "levy",
    },
    {
      id: "insurance-sunset",
      title: "Insurance renewal due",
      href: "#",
      date: day(1),
      scheme: "Sunset Gardens",
      kind: "deadline",
    },
    {
      id: "inspection-lot14",
      title: "Maintenance inspection",
      href: "#",
      date: day(2),
      time: "2:30 pm",
      scheme: "Lot 14",
      kind: "inspection",
    },
    {
      id: "committee-meeting",
      title: "Committee meeting",
      href: "#",
      date: day(4),
      time: "5:30 pm",
      scheme: "Harbour View Towers",
      kind: "meeting",
    },
    {
      id: "budget-review",
      title: "Budget review deadline",
      href: "#",
      date: day(6),
      scheme: "Sunset Gardens",
      kind: "deadline",
    },
  ]
}

/** Setup checklist surfaced in the sidebar footer until onboarding is done. */
export const APP_SHELL_ONBOARDING: OnboardingStep[] = [
  { title: "Create your workspace", href: "#", status: "complete" },
  { title: "Add your first scheme", href: "#", status: "complete" },
  { title: "Invite a committee member", href: "#", status: "current" },
  { title: "Connect your bank feed", href: "#", status: "todo" },
  { title: "Import owner contacts", href: "#", status: "todo" },
]

/** Forest sidebar tokens used by the app layout demo and preview. */
export const APP_SHELL_SIDEBAR_THEME = {
  "--sidebar": "#043F2E",
  "--sidebar-foreground": "#EEF2E3",
  "--sidebar-primary": "#C8F169",
  "--sidebar-primary-foreground": "#043F2E",
  "--sidebar-accent": "#0A5C3D",
  "--sidebar-accent-foreground": "#FFFFFF",
  "--sidebar-border": "#032B1F",
  "--sidebar-ring": "#C8F169",
} as CSSProperties
