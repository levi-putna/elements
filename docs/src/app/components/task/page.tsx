"use client";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  TASK_QUEUE_DEMO_INBOX,
  TaskQueue,
  TaskQueueEmptyState,
  TaskQueueHeader,
  TaskQueueSection,
  WORK_ITEM_DEMO_BY_STATUS,
  WORK_ITEM_DEMO_REVIEW,
  WorkItem,
  WorkItemAutomationBadge,
  WorkItemDueBadge,
  WorkItemMissingItems,
  WorkItemStatusBadge,
} from "@/components/ui/task";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/task/registry.json`;

const INBOX_CODE = `import {
  TaskQueue,
  TaskQueueHeader,
  TaskQueueSection,
  WorkItem,
} from "@/components/ui/task"

<TaskQueue
  variant="sectioned"
  header={
    <TaskQueueHeader
      openCount={12}
      reviewCount={3}
      overdueCount={2}
      escalatedCount={1}
    />
  }
>
  <TaskQueueSection title="Escalated" count={1} tone="danger">
    <WorkItem item={escalatedTask} showChevron href="#" />
  </TaskQueueSection>
  <TaskQueueSection title="Awaiting review" count={3} tone="warning">
    {reviewTasks.map((item) => (
      <WorkItem key={item.id} item={item} showChevron href={\`/tasks/\${item.id}\`} />
    ))}
  </TaskQueueSection>
</TaskQueue>`;

const DETAIL_CODE = `import { WorkItem } from "@/components/ui/task"

<WorkItem
  item={task}
  layout="detail"
  actions={
    <>
      <Button size="sm">Review draft</Button>
      <Button size="sm" variant="outline">Snooze</Button>
    </>
  }
/>`;

const WORK_ITEM_FIELDS = [
  { name: "id", type: "string", description: "Stable task identifier." },
  { name: "title", type: "string", description: "Primary action label for inbox scanning." },
  { name: "description", type: "string", description: "Longer context shown on card and detail layouts." },
  { name: "status", type: "WorkItemStatus", description: "pending | in_progress | awaiting_review | approved | sent | completed | failed | manual_required | escalated | snoozed." },
  { name: "domain", type: "WorkItemDomain", description: "meetings | accounting | maintenance | insurance | admin | disputes | communication | contractors." },
  { name: "automation", type: "WorkItemAutomation", description: "automatable | semi_automated (R-A-S) | manual." },
  { name: "priority", type: "WorkItemPriority", description: "urgent | high | medium | low. Drives the left priority bar." },
  { name: "dueAt", type: "string | Date", description: "Due, statutory, or follow-up date." },
  { name: "dueKind", type: "WorkItemDueKind", description: "due | statutory | follow_up." },
  { name: "missingItems", type: "string[]", description: "Unmet prerequisites (detail layout and list hint)." },
  { name: "advisory", type: "string", description: "Non-blocking AI advisory note." },
  { name: "requirementId", type: "string", description: "Linked FR ID for traceability." },
];

const WORK_ITEM_PROPS = [
  { name: "item", type: "WorkItemSummary", description: "Work item data object." },
  { name: "layout", type: '"list" | "compact" | "card" | "detail"', default: '"list"', description: "list = inbox row. compact = sidebar. card = tile. detail = expanded panel." },
  { name: "showStatus", type: "boolean", default: "true", description: "Shows workflow status badge." },
  { name: "showAutomation", type: "boolean", default: "true", description: "Shows automatable / R-A-S / manual badge." },
  { name: "showDue", type: "boolean", default: "true", description: "Shows due or statutory date badge." },
  { name: "showAssignee", type: "boolean", default: "true", description: "Shows assignee avatar on list layout." },
  { name: "showChevron", type: "boolean", default: "false", description: "Trailing chevron for navigable rows." },
];

/**
 * Task queue and work item documentation for manager workflows.
 */
export default function TaskPage() {
  const reviewCount = WORK_ITEM_DEMO_BY_STATUS.filter(
    (t) => t.status === "awaiting_review"
  ).length;
  const overdueCount = TASK_QUEUE_DEMO_INBOX.filter(
    (t) => t.dueAt && new Date(t.dueAt) < new Date("2026-06-15")
  ).length;
  const escalatedCount = TASK_QUEUE_DEMO_INBOX.filter(
    (t) => t.status === "escalated"
  ).length;

  const escalated = TASK_QUEUE_DEMO_INBOX.filter((t) => t.status === "escalated");
  const review = TASK_QUEUE_DEMO_INBOX.filter(
    (t) => t.status === "awaiting_review" || t.status === "failed"
  );
  const active = TASK_QUEUE_DEMO_INBOX.filter(
    (t) =>
      t.status === "in_progress" ||
      t.status === "pending" ||
      t.status === "manual_required"
  );
  const snoozed = TASK_QUEUE_DEMO_INBOX.filter((t) => t.status === "snoozed");

  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Application
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Task</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          Manager task queue and work item primitives for Instant Strata. Work items
          represent operational tasks across automatable, semi-automated (R-A-S), and
          manual workflows. Layout prioritises scanability: title first, scheme context
          second, status and due badges third.
        </p>
      </div>

      {/* Layout rationale */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Layout rationale
        </h2>
        <div className="max-w-3xl space-y-4 text-sm text-ink-muted leading-relaxed">
          <p>
            Manager inboxes are scanned in under two seconds. The{" "}
            <strong className="font-semibold text-ink">list layout</strong> uses a
            priority colour bar on the left, a single-line title, a metadata row
            (scheme · domain · assignee), and right-aligned status badges. Overdue
            statutory dates use danger-soft badges so they pop without shouting.
          </p>
          <p>
            <strong className="font-semibold text-ink">Sectioned queues</strong> group
            by urgency: Escalated, Awaiting review, then Active. Review items with
            missing prerequisites show a warning hint on the list row and expand into
            a full missing-items block on the detail layout.
          </p>
          <p>
            <strong className="font-semibold text-ink">R-A-S items</strong> use the
            amber &quot;R-A-S&quot; automation badge (Review, amend, send). Failed AI
            steps surface as <code className="font-mono text-xs text-ink">failed</code> or{" "}
            <code className="font-mono text-xs text-ink">manual_required</code>, never as
            silent blanks.
          </p>
        </div>
      </section>

      {/* Status badges */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Workflow states
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Every distinct work item status with automation and due variants.
        </p>

        <ComponentPreview label="All WorkItemStatusBadge states">
          <div className="flex flex-wrap gap-2 py-2">
            {WORK_ITEM_DEMO_BY_STATUS.map((item) => (
              <WorkItemStatusBadge key={item.id} status={item.status} />
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="Automation and due badges">
          <div className="flex flex-wrap gap-2 py-2">
            <WorkItemAutomationBadge automation="automatable" />
            <WorkItemAutomationBadge automation="semi_automated" />
            <WorkItemAutomationBadge automation="manual" />
            <WorkItemDueBadge
              dueAt="2026-06-10"
              dueKind="statutory"
              status="awaiting_review"
            />
            <WorkItemDueBadge
              dueAt="2026-05-30"
              dueKind="statutory"
              status="escalated"
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Sectioned inbox */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          TaskQueue (sectioned inbox)
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Primary manager inbox pattern: header counts, urgency sections, list rows.
        </p>

        <ComponentPreview label="Grouped task queue">
          <TaskQueue
            className="w-full"
            variant="sectioned"
            header={
              <TaskQueueHeader
                openCount={TASK_QUEUE_DEMO_INBOX.length}
                reviewCount={reviewCount}
                overdueCount={overdueCount}
                escalatedCount={escalatedCount}
              />
            }
          >
            <TaskQueueSection
              title="Escalated"
              count={escalated.length}
              tone="danger"
              description="Statutory or compliance deadlines missed"
            >
              {escalated.map((item) => (
                <WorkItem key={item.id} item={item} showChevron href="#" />
              ))}
            </TaskQueueSection>

            <TaskQueueSection
              title="Awaiting review"
              count={review.length}
              tone="warning"
              description="R-A-S: review, amend, and send"
            >
              {review.map((item) => (
                <WorkItem key={item.id} item={item} showChevron href="#" />
              ))}
            </TaskQueueSection>

            <TaskQueueSection title="Active" count={active.length}>
              {active.map((item) => (
                <WorkItem key={item.id} item={item} showChevron href="#" />
              ))}
            </TaskQueueSection>

            {snoozed.length > 0 ? (
              <TaskQueueSection title="Snoozed" count={snoozed.length}>
                {snoozed.map((item) => (
                  <WorkItem key={item.id} item={item} showChevron href="#" />
                ))}
              </TaskQueueSection>
            ) : null}
          </TaskQueue>
        </ComponentPreview>

        <div className="mt-6">
          <CodeBlock code={INBOX_CODE} />
        </div>
      </section>

      {/* Flat list */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          TaskQueue (flat list)
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Single-scheme task list without section grouping.
        </p>

        <ComponentPreview label="Flat queue">
          <TaskQueue className="w-full max-w-2xl">
            {TASK_QUEUE_DEMO_INBOX.slice(0, 5).map((item) => (
              <WorkItem key={item.id} item={item} showChevron href="#" />
            ))}
          </TaskQueue>
        </ComponentPreview>
      </section>

      {/* Detail layout */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          WorkItem (detail)
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Expanded panel for R-A-S review with missing items and AI advisory.
        </p>

        <ComponentPreview label="AGM notice pack review">
          <div className="w-full max-w-xl">
            <WorkItem
              item={WORK_ITEM_DEMO_REVIEW}
              layout="detail"
              actions={
                <>
                  <Button size="sm">Review draft</Button>
                  <Button size="sm" variant="outline">
                    Snooze
                  </Button>
                </>
              }
            />
          </div>
        </ComponentPreview>

        <div className="mt-6">
          <CodeBlock code={DETAIL_CODE} />
        </div>
      </section>

      {/* Card + compact */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Card and compact layouts
        </h2>

        <div className="space-y-8">
          <ComponentPreview label="Dashboard cards">
            <div className="grid gap-4 sm:grid-cols-2 w-full max-w-2xl">
              {WORK_ITEM_DEMO_BY_STATUS.slice(0, 4).map((item) => (
                <WorkItem key={item.id} item={item} layout="card" showChevron href="#" />
              ))}
            </div>
          </ComponentPreview>

          <ComponentPreview label="Sidebar compact rows">
            <div className="w-full max-w-sm rounded-sm border border-border bg-white divide-y divide-border">
              {TASK_QUEUE_DEMO_INBOX.slice(0, 4).map((item) => (
                <WorkItem key={item.id} item={item} layout="compact" href="#" />
              ))}
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* Missing items standalone */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Prerequisites block
        </h2>
        <ComponentPreview label="WorkItemMissingItems">
          <div className="w-full max-w-md">
            <WorkItemMissingItems
              items={[
                "Audited financial statements for FY25",
                "Committee-approved budget motion",
              ]}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Empty state */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Empty state
        </h2>
        <ComponentPreview label="TaskQueueEmptyState">
          <div className="w-full max-w-md">
            <TaskQueue isEmpty />
          </div>
        </ComponentPreview>
      </section>

      {/* Install */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Install
        </h2>
        <CodeBlock code={INSTALL} />
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Reference
        </h2>

        <h3 className="text-sm font-semibold text-ink mb-3">WorkItemSummary</h3>
        <div className="mb-8">
          <PropTable props={WORK_ITEM_FIELDS} />
        </div>

        <h3 className="text-sm font-semibold text-ink mb-3">WorkItem</h3>
        <PropTable props={WORK_ITEM_PROPS} />
      </section>
    </DocsPage>
  );
}
