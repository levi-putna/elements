"use client"

import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  FileText,
  Hourglass,
  Mail,
  MessageSquareWarning,
  Scale,
  Sparkles,
  Wrench,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { WorkItem, type WorkItemSummary } from "@/components/ui/task"
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
import { DashboardCommandHeader, Horizon, type ScheduleEvent } from "@/components/preview/portfolio-hud"

// ─────────────────────────────────────────────────────────
// Preview data: a strata manager's portfolio at 8am
//
// AI-first inbox zero model:
//   - Human queue = items only YOU can unblock today
//   - Waiting on others is tracked but excluded from "zero"
//   - AI review queue = quick approve/amend wins (clear these first)
//   - Decision queue = escalations and exceptions AI could not close
// ─────────────────────────────────────────────────────────

/** HUD stats driving the day-plan strip. */
const DAY_PLAN = {
  attention: { remaining: 6, clearedToday: 2, dayTotal: 8 },
  portfolio: { good: 42, warning: 4, critical: 2 },
  ai: {
    completedOvernight: 14,
    readyForReview: 4,
    running: 8,
    estimatedReviewMinutes: 12,
  },
} as const

/** Reference date for the preview dashboard. */
const PREVIEW_DATE = new Date("2026-06-17")

/** Calendar events for the HUD schedule strip and Horizon picker. */
const SCHEDULE_EVENTS: ScheduleEvent[] = [
  {
    id: "sched_review",
    title: "Clear review queue",
    date: "2026-06-17",
    time: "Now",
    kind: "meeting",
    tone: "accent",
    href: "#ai-review",
  },
  {
    id: "sched_committee",
    title: "Committee meeting",
    subtitle: "Harbour View · lift quotes",
    date: "2026-06-17",
    time: "10:00",
    kind: "meeting",
    href: "#",
  },
  {
    id: "sched_hub",
    title: "Strata Hub lodgement",
    subtitle: "Northbridge Estate",
    date: "2026-06-17",
    time: "14:00",
    kind: "deadline",
    href: "#",
  },
  {
    id: "sched_levy",
    title: "Levy reminders send",
    subtitle: "All schemes",
    date: "2026-06-16",
    time: "9:00 am",
    kind: "levy",
    href: "#",
  },
  {
    id: "sched_contractor",
    title: "Contractor site visit",
    subtitle: "Harbour View · lift motor",
    date: "2026-06-15",
    time: "11:00 am",
    kind: "inspection",
    href: "#",
  },
  {
    id: "sched_insurance",
    title: "Insurance renewal due",
    subtitle: "Sunset Gardens",
    date: "2026-06-18",
    kind: "deadline",
    href: "#",
  },
  {
    id: "sched_inspection",
    title: "Maintenance inspection",
    subtitle: "Lot 14",
    date: "2026-06-19",
    time: "2:30 pm",
    kind: "inspection",
    href: "#",
  },
  {
    id: "sched_agm",
    title: "AGM",
    subtitle: "Parkside Residences · notice due in 14 days",
    date: "2026-06-20",
    kind: "agm",
    href: "#",
  },
  {
    id: "sched_budget",
    title: "Budget review deadline",
    subtitle: "Sunset Gardens",
    date: "2026-06-21",
    kind: "deadline",
    href: "#",
  },
]

/** AI morning brief content. */
const AI_BRIEF = {
  summary:
    "While you were away, AI chased 2 contractors, reconciled May levies, and drafted 3 owner notices.",
  highlights: [
    "AGM notice pack drafted for Northbridge Estate (missing financials flagged)",
    "Breach notice prepared for Lot 14 noise complaint",
    "Lift contractor follow-up sent, committee meeting brief attached",
    "Strata Hub overdue alert escalated with lodgement checklist",
  ],
} as const

/** AI-prepared items: review, approve, or amend. The inbox-zero fast lane. */
const AI_REVIEW_QUEUE: WorkItemSummary[] = [
  {
    id: "ai_agm",
    title: "AGM notice pack drafted and ready for review",
    status: "awaiting_review",
    domain: "meetings",
    automation: "semi_automated",
    priority: "urgent",
    dueAt: "2026-06-10",
    dueKind: "statutory",
    schemeName: "Northbridge Estate",
    schemePlan: "SP 4821",
    assigneeName: "Jane Smith",
    description: "AI draft complete. Amend motions or approve to issue.",
    missingItems: ["Audited financial statements for FY25"],
    advisory:
      "Motion 4 may need special resolution wording. Confirm with legal before sending.",
  },
  {
    id: "ai_breach",
    title: "Breach notice drafted for Lot 14 noise complaint",
    status: "awaiting_review",
    domain: "disputes",
    automation: "semi_automated",
    priority: "urgent",
    dueAt: "2026-06-17",
    schemeName: "Parkside Residences",
    schemePlan: "SP 2287",
    assigneeName: "Jane Smith",
    description: "Third breach documented. Review wording before issue to owner.",
    advisory: "Owner has threatened NCAT. Advisory only: confirm approach with committee.",
  },
  {
    id: "ai_afss",
    title: "AFSS renewal plan drafted, contractor shortlist attached",
    status: "awaiting_review",
    domain: "admin",
    automation: "semi_automated",
    priority: "high",
    dueAt: "2026-06-26",
    dueKind: "statutory",
    schemeName: "Harbour View Towers",
    schemePlan: "SP 1042",
    assigneeName: "Jane Smith",
    description: "Certificate expires in 9 days. Approve contractor approach or edit scope.",
    missingItems: ["Committee approval for spend"],
  },
  {
    id: "ai_levy",
    title: "Levy payment plan response drafted for Lot 7",
    status: "awaiting_review",
    domain: "accounting",
    automation: "semi_automated",
    priority: "medium",
    schemeName: "Northbridge Estate",
    schemePlan: "SP 4821",
    assigneeName: "Jane Smith",
    description: "Owner requested 3-month plan. AI drafted terms within policy limits.",
  },
]

/** Escalations and exceptions that need manager judgment, not just approval. */
const NEEDS_DECISION_QUEUE: WorkItemSummary[] = [
  {
    id: "dec_lift",
    title: "Lift 2 out of service: residents stranded on upper floors",
    status: "escalated",
    domain: "maintenance",
    automation: "manual",
    priority: "urgent",
    dueAt: "2026-06-17",
    schemeName: "Harbour View Towers",
    schemePlan: "SP 1042",
    assigneeName: "Jane Smith",
    description: "Emergency contractor engaged. Awaiting your sign-off on after-hours call-out.",
  },
  {
    id: "dec_hub",
    title: "Strata Hub annual return overdue",
    status: "escalated",
    domain: "admin",
    automation: "automatable",
    priority: "urgent",
    dueAt: "2026-06-14",
    dueKind: "statutory",
    schemeName: "Northbridge Estate",
    schemePlan: "SP 4821",
    assigneeName: "Jane Smith",
    description: "3 days overdue. AI prepared lodgement checklist. Confirm figures and lodge.",
  },
  {
    id: "dec_roof",
    title: "Roof leak: Lot 8 ceiling damage, insurance claim pending",
    status: "in_progress",
    domain: "maintenance",
    automation: "manual",
    priority: "high",
    dueAt: "2026-06-16",
    schemeName: "The Quarter",
    schemePlan: "SP 3390",
    assigneeName: "Jane Smith",
    description: "AI escalated to insurer 5 days ago with no response. Decide next step.",
  },
]

interface WaitingRow {
  icon: typeof Hourglass
  iconTone: "default" | "accent" | "warning" | "danger" | "info"
  title: string
  meta: string
  waiting: string
  category: string
  stale?: boolean
}

/** Items blocked on contractors, committee, or owners. Excluded from inbox zero. */
const WAITING_ON_OTHERS: WaitingRow[] = [
  {
    icon: Wrench,
    iconTone: "info",
    title: "Lift modernisation: 3 quotes received",
    meta: "Harbour View Towers · SP 1042",
    waiting: "6 days",
    category: "Contractor",
    stale: true,
  },
  {
    icon: Scale,
    iconTone: "warning",
    title: "Proposed 2026–27 budget",
    meta: "Parkside Residences · SP 2287",
    waiting: "2 days",
    category: "Committee",
  },
  {
    icon: FileText,
    iconTone: "accent",
    title: "Renovation by-law: Lot 14",
    meta: "The Quarter · SP 3390",
    waiting: "11 days",
    category: "Committee",
    stale: true,
  },
  {
    icon: Mail,
    iconTone: "default",
    title: "Pet by-law application: Lot 31",
    meta: "Northbridge Estate · SP 4821",
    waiting: "4 days",
    category: "Owner",
  },
]

interface ActivityRow {
  icon: typeof Mail
  iconTone: "default" | "accent" | "warning" | "danger" | "info"
  title: string
  meta: string
  when: string
}

const RECENT_ACTIVITY: ActivityRow[] = [
  {
    icon: Wrench,
    iconTone: "info",
    title: "New maintenance request: intercom fault, main entry",
    meta: "Harbour View Towers · logged 6:42am",
    when: "Today",
  },
  {
    icon: Mail,
    iconTone: "default",
    title: "Owner correspondence: levy payment plan request",
    meta: "Lot 7, Northbridge Estate",
    when: "Yesterday",
  },
  {
    icon: MessageSquareWarning,
    iconTone: "warning",
    title: "New issue: parking dispute in visitor bay 3",
    meta: "The Quarter · reported by committee member",
    when: "Yesterday",
  },
  {
    icon: CheckCircle2,
    iconTone: "accent",
    title: "Gutter cleaning completed, invoice received",
    meta: "Parkside Residences · Apex Roofing",
    when: "Yesterday",
  },
]

interface AiActionRow {
  title: string
  reason: string
  scheme: string
  priority: "high" | "medium"
}

/** Proactive next steps after the review queue is cleared. */
const AI_SUGGESTED_ACTIONS: AiActionRow[] = [
  {
    title: "Follow up lift contractor",
    reason: "Quote stale 6 days, committee meeting tomorrow",
    scheme: "Harbour View Towers",
    priority: "high",
  },
  {
    title: "Escalate roof leak insurance claim",
    reason: "No insurer response in 5 days, owner follow-up overdue",
    scheme: "The Quarter",
    priority: "medium",
  },
]

/**
 * Operational command centre for a strata manager's portfolio.
 * AI-first layout: HUD, brief, review queue, decisions, blockers, horizon.
 */
export function Dashboard() {
  const reviewCount = AI_REVIEW_QUEUE.length
  const decisionCount = NEEDS_DECISION_QUEUE.length
  const waitingCount = WAITING_ON_OTHERS.length
  const humanQueueTotal = reviewCount + decisionCount

  return (
    <div className="mx-auto w-full max-w-content space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Wednesday, 17 June · 48 schemes
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
            Good morning, Levi
          </h1>
          <p className="mt-1.5 text-sm text-ink-muted">
            Clear your review queue first, then work through decisions. Waiting on others does not count toward zero.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm">
            Work inbox
          </Button>
          <Button size="sm">New task</Button>
        </div>
      </div>

      {/* Command header: HUD, AI brief, and today schedule */}
      <DashboardCommandHeader
        attention={DAY_PLAN.attention}
        portfolio={DAY_PLAN.portfolio}
        ai={DAY_PLAN.ai}
        briefing={{
          summary: AI_BRIEF.summary,
          highlights: [...AI_BRIEF.highlights],
          readyForReview: DAY_PLAN.ai.readyForReview,
          estimatedReviewMinutes: DAY_PLAN.ai.estimatedReviewMinutes,
          reviewHref: "#ai-review",
        }}
        events={SCHEDULE_EVENTS}
        reference={PREVIEW_DATE}
      />

      {/* Tier 1a: AI review queue, the inbox-zero fast lane */}
      <Widget id="ai-review">
        <WidgetHeader>
          <WidgetTitle icon={Eye} count={reviewCount}>
            Ready for your review
          </WidgetTitle>
          <WidgetAction href="#">Review all</WidgetAction>
        </WidgetHeader>
        <WidgetContent flush className="divide-y divide-border">
          {AI_REVIEW_QUEUE.map((item) => (
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
        <WidgetFooter>
          <span className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-forest/70" aria-hidden />
            AI did the groundwork · you approve, amend, or send
          </span>
          <WidgetAction href="#">
            ~{DAY_PLAN.ai.estimatedReviewMinutes} min to clear
          </WidgetAction>
        </WidgetFooter>
      </Widget>

      {/* Tier 1b: decisions and escalations AI could not close */}
      <Widget>
        <WidgetHeader>
          <WidgetTitle icon={AlertTriangle} count={decisionCount}>
            Needs your decision
          </WidgetTitle>
          <WidgetAction href="#">Open inbox</WidgetAction>
        </WidgetHeader>
        <WidgetContent flush className="divide-y divide-border">
          {NEEDS_DECISION_QUEUE.map((item) => (
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
        <WidgetFooter>
          <span>
            {humanQueueTotal} items in your queue · {DAY_PLAN.attention.clearedToday} cleared today
          </span>
        </WidgetFooter>
      </Widget>

      {/* Tier 2: blockers, horizon, next steps */}
      <WidgetGrid columns={3}>
        <div className="space-y-4 lg:col-span-1">
          <Widget>
            <WidgetHeader>
              <WidgetTitle icon={Hourglass} count={waitingCount}>
                Waiting on others
              </WidgetTitle>
              <WidgetAction href="#">View all</WidgetAction>
            </WidgetHeader>
            <WidgetContent flush>
              <WidgetList>
                {WAITING_ON_OTHERS.map((row) => (
                  <WidgetListItem
                    key={row.title}
                    icon={row.icon}
                    iconTone={row.iconTone}
                    title={row.title}
                    meta={row.meta}
                    href="#"
                    trailing={
                      <>
                        <Badge variant="outline" size="sm">
                          {row.category}
                        </Badge>
                        <span
                          className={
                            row.stale
                              ? "text-xs font-medium text-warning"
                              : "text-xs text-ink-muted"
                          }
                        >
                          {row.waiting}
                          {row.stale ? " · chase" : ""}
                        </span>
                      </>
                    }
                  />
                ))}
              </WidgetList>
            </WidgetContent>
            <WidgetFooter>
              <span>Excluded from your inbox zero goal</span>
            </WidgetFooter>
          </Widget>
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Horizon events={SCHEDULE_EVENTS} reference={PREVIEW_DATE} />
        </div>

        <div className="space-y-4 lg:col-span-1">
          <Widget tone="muted">
            <WidgetHeader>
              <WidgetTitle icon={Sparkles} count={AI_SUGGESTED_ACTIONS.length}>
                After you clear the queue
              </WidgetTitle>
            </WidgetHeader>
            <WidgetContent flush>
              <WidgetList>
                {AI_SUGGESTED_ACTIONS.map((action) => (
                  <WidgetListItem
                    key={action.title}
                    title={action.title}
                    meta={`${action.scheme} · ${action.reason}`}
                    href="#"
                    trailing={
                      <Badge
                        variant={
                          action.priority === "high" ? "warning" : "outline"
                        }
                        size="sm"
                      >
                        {action.priority === "high" ? "Do today" : "This week"}
                      </Badge>
                    }
                  />
                ))}
              </WidgetList>
            </WidgetContent>
            <WidgetFooter>
              <span>Suggested once your review queue is clear</span>
            </WidgetFooter>
          </Widget>
        </div>
      </WidgetGrid>

      {/* Tier 3: situational awareness */}
      <Widget tone="muted">
        <WidgetHeader>
          <WidgetTitle icon={Mail}>Recent activity</WidgetTitle>
          <WidgetAction href="#">View all</WidgetAction>
        </WidgetHeader>
        <WidgetContent flush>
          <WidgetList>
            {RECENT_ACTIVITY.map((row) => (
              <WidgetListItem
                key={row.title}
                icon={row.icon}
                iconTone={row.iconTone}
                title={row.title}
                meta={row.meta}
                href="#"
                trailing={
                  <span className="text-xs text-ink-muted">{row.when}</span>
                }
              />
            ))}
          </WidgetList>
        </WidgetContent>
      </Widget>
    </div>
  )
}
