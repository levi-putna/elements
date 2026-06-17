"use client"

import {
  AlertTriangle,
  CalendarClock,
  FileCheck2,
  FileText,
  Flame,
  Inbox,
  Receipt,
  Scale,
  ShieldCheck,
  Wrench,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SchemeHealthIndicator } from "@/components/ui/scheme"
import {
  TASK_QUEUE_DEMO_INBOX,
  WorkItem,
} from "@/components/ui/task"
import { Stat, StatGroup, type StatProps } from "@/components/ui/stat"
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

// ─────────────────────────────────────────────────────────
// Hardcoded preview data — a strata manager's portfolio at 8am
// ─────────────────────────────────────────────────────────

const KPIS: StatProps[] = [
  {
    label: "Needs attention",
    value: "12",
    icon: AlertTriangle,
    tone: "danger",
    delta: { value: "3 today", direction: "up", sentiment: "negative" },
    href: "#",
  },
  {
    label: "Levy arrears",
    value: "$84.2k",
    icon: Receipt,
    tone: "warning",
    delta: { value: "4%", direction: "down", sentiment: "positive" },
    caption: "across 37 lots",
    href: "#",
  },
  {
    label: "Statutory deadlines",
    value: "5",
    icon: CalendarClock,
    tone: "warning",
    caption: "1 overdue · next 30 days",
    href: "#",
  },
  {
    label: "Open maintenance",
    value: "16",
    icon: Wrench,
    tone: "info",
    caption: "2 emergency",
    href: "#",
  },
]

interface DeadlineRow {
  icon: typeof CalendarClock
  iconTone: "warning" | "danger" | "info" | "accent"
  title: string
  scheme: string
  when: string
  overdue?: boolean
  badge: { label: string; variant: "destructive" | "warning" | "info" }
}

const DEADLINES: DeadlineRow[] = [
  {
    icon: FileCheck2,
    iconTone: "danger",
    title: "Strata Hub return",
    scheme: "Northbridge Estate",
    when: "Overdue 3d",
    overdue: true,
    badge: { label: "Statutory", variant: "destructive" },
  },
  {
    icon: ShieldCheck,
    iconTone: "warning",
    title: "Fire safety (AFSS)",
    scheme: "Harbour View Towers",
    when: "9 days",
    badge: { label: "Statutory", variant: "warning" },
  },
  {
    icon: CalendarClock,
    iconTone: "warning",
    title: "AGM notice",
    scheme: "Parkside Residences",
    when: "14 days",
    badge: { label: "Statutory", variant: "warning" },
  },
  {
    icon: ShieldCheck,
    iconTone: "info",
    title: "Insurance renewal",
    scheme: "The Quarter",
    when: "26 days",
    badge: { label: "Renewal", variant: "info" },
  },
]

interface ApprovalRow {
  icon: typeof Scale
  iconTone: "info" | "accent" | "warning"
  title: string
  scheme: string
  value: string
  waiting: string
}

const APPROVALS: ApprovalRow[] = [
  {
    icon: Wrench,
    iconTone: "info",
    title: "Lift modernisation — 3 quotes",
    scheme: "Harbour View Towers · SP 1042",
    value: "$142,500",
    waiting: "Waiting 6 days",
  },
  {
    icon: FileText,
    iconTone: "accent",
    title: "Proposed 2026–27 budget",
    scheme: "Parkside Residences · SP 2287",
    value: "$418,000",
    waiting: "Waiting 2 days",
  },
  {
    icon: Scale,
    iconTone: "warning",
    title: "Renovation by-law — Lot 14",
    scheme: "The Quarter · SP 3390",
    value: "By-law",
    waiting: "Waiting 11 days",
  },
]

interface HealthRow {
  name: string
  meta: string
  health: "good" | "warning" | "critical"
}

const PORTFOLIO_HEALTH: HealthRow[] = [
  {
    name: "Northbridge Estate",
    meta: "SP 4821 · 64 lots · overdue return",
    health: "critical",
  },
  {
    name: "Harbour View Towers",
    meta: "SP 1042 · 120 lots · arrears 11%",
    health: "warning",
  },
  {
    name: "The Quarter",
    meta: "SP 3390 · 88 lots · renewal due",
    health: "warning",
  },
  {
    name: "Parkside Residences",
    meta: "SP 2287 · 42 lots · on track",
    health: "good",
  },
]

// ─────────────────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────────────────

export function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-content space-y-6">
      {/* Greeting / page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Wednesday, 17 June · 48 schemes
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Good morning, Levi
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            12 items need your attention across the portfolio today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Reports
          </Button>
          <Button size="sm">New task</Button>
        </div>
      </div>

      {/* KPI strip */}
      <StatGroup columns={4}>
        {KPIS.map((kpi) => (
          <Stat key={kpi.label} {...kpi} />
        ))}
      </StatGroup>

      {/* Main + side columns */}
      <WidgetGrid columns={3}>
        {/* Main column */}
        <div className="space-y-4 lg:col-span-2">
          {/* Needs your attention — the triage queue */}
          <Widget>
            <WidgetHeader>
              <WidgetTitle icon={Inbox} count={12}>
                Needs your attention
              </WidgetTitle>
              <WidgetAction href="#">View inbox</WidgetAction>
            </WidgetHeader>
            <WidgetContent flush className="divide-y divide-border">
              {TASK_QUEUE_DEMO_INBOX.slice(0, 5).map((item) => (
                <WorkItem
                  key={item.id}
                  item={item}
                  layout="list"
                  href="#"
                  showChevron
                  showAssignee={false}
                />
              ))}
            </WidgetContent>
          </Widget>

          {/* Awaiting committee decision */}
          <Widget>
            <WidgetHeader>
              <WidgetTitle icon={Scale} count={APPROVALS.length}>
                Awaiting committee decision
              </WidgetTitle>
              <WidgetAction href="#">View all</WidgetAction>
            </WidgetHeader>
            <WidgetContent flush>
              <WidgetList>
                {APPROVALS.map((row) => (
                  <WidgetListItem
                    key={row.title}
                    icon={row.icon}
                    iconTone={row.iconTone}
                    title={row.title}
                    meta={row.scheme}
                    href="#"
                    trailing={
                      <>
                        <span className="text-sm font-semibold text-foreground">
                          {row.value}
                        </span>
                        <span className="text-xs text-ink-muted">
                          {row.waiting}
                        </span>
                      </>
                    }
                  />
                ))}
              </WidgetList>
            </WidgetContent>
            <WidgetFooter>
              <span>Decisions block downstream work — chase the oldest first.</span>
            </WidgetFooter>
          </Widget>
        </div>

        {/* Side column */}
        <div className="space-y-4">
          {/* Upcoming deadlines */}
          <Widget>
            <WidgetHeader>
              <WidgetTitle icon={CalendarClock}>Upcoming deadlines</WidgetTitle>
              <WidgetAction href="#">Calendar</WidgetAction>
            </WidgetHeader>
            <WidgetContent flush>
              <WidgetList>
                {DEADLINES.map((row) => (
                  <WidgetListItem
                    key={row.title}
                    icon={row.icon}
                    iconTone={row.iconTone}
                    title={row.title}
                    meta={row.scheme}
                    href="#"
                    trailing={
                      <>
                        <Badge variant={row.badge.variant} size="sm">
                          {row.badge.label}
                        </Badge>
                        <span
                          className={
                            row.overdue
                              ? "text-xs font-medium text-danger"
                              : "text-xs text-ink-muted"
                          }
                        >
                          {row.when}
                        </span>
                      </>
                    }
                  />
                ))}
              </WidgetList>
            </WidgetContent>
          </Widget>

          {/* Portfolio health */}
          <Widget>
            <WidgetHeader>
              <WidgetTitle icon={Flame}>Portfolio health</WidgetTitle>
              <WidgetAction href="#">All schemes</WidgetAction>
            </WidgetHeader>
            <WidgetContent flush>
              <WidgetList>
                {PORTFOLIO_HEALTH.map((row) => (
                  <WidgetListItem
                    key={row.name}
                    title={row.name}
                    meta={row.meta}
                    href="#"
                    trailing={<SchemeHealthIndicator health={row.health} />}
                  />
                ))}
              </WidgetList>
            </WidgetContent>
          </Widget>
        </div>
      </WidgetGrid>
    </div>
  )
}
