"use client";

import { DocsPage } from "@/components/docs/docs-page";
import { ResizableViewport } from "@/components/docs/resizable-viewport";
import { ViewportCompare } from "@/components/docs/viewport-compare";
import { Button } from "@/components/ui/button";
import {
  SCHEME_DEMO_ITEMS,
  SchemeCard,
  SchemeList,
} from "@/components/ui/scheme";
import { Stat, StatGroup, STAT_DEMO_PORTFOLIO } from "@/components/ui/stat";
import {
  TaskQueueHeader,
  WorkItem,
  TASK_QUEUE_DEMO_INBOX,
} from "@/components/ui/task";
import {
  Widget,
  WidgetContent,
  WidgetHeader,
  WidgetList,
  WidgetListItem,
  WidgetTitle,
} from "@/components/ui/widget";
import { CalendarClock, Receipt, ShieldCheck } from "lucide-react";
import { Monitor, Smartphone, Tablet, Check } from "lucide-react";

/* ─── Breakpoints ─────────────────────────────────────── */

const BREAKPOINTS = [
  {
    name: "sm",
    min: "640px",
    role: "Large phone landscape, small tablet. Secondary metadata can appear.",
  },
  {
    name: "md",
    min: "768px",
    role: "Primary mobile/desktop boundary. Sidebar sheet vs fixed rail. Site header desktop nav.",
  },
  {
    name: "lg",
    min: "1024px",
    role: "Dashboard multi-column grids, wide table layouts, bento and feature splits.",
  },
  {
    name: "xl",
    min: "1280px",
    role: "Full portfolio dashboards with side panels and three-column widget grids.",
  },
] as const;

/* ─── Application patterns ────────────────────────────── */

const APP_LAYOUT_RULES = [
  {
    surface: "App shell / Sidebar",
    mobile: "Slide-in sheet. Icon-only collapse optional on tablet.",
    desktop: "Fixed 240px sidebar with full labels and flyout panels.",
    utility: "Sidebar + useIsMobile (768px)",
  },
  {
    surface: "Dashboard grids",
    mobile: "Single column. Stack widgets vertically.",
    desktop: "2–3 columns with lg:col-span-* for main + side panels.",
    utility: "WidgetGrid · gap-4",
  },
  {
    surface: "Identity rows (scheme, lot, owner, task)",
    mobile: "list or compact layout. Title, primary badge, chevron.",
    desktop: "wide layout with column headings and full metadata.",
    utility: "layout=\"list\" | layout=\"wide\"",
  },
  {
    surface: "Table metadata columns",
    mobile: "Hide non-essential columns. Keep identifier + status.",
    desktop: "Show entitlement, dates, assignee, secondary badges.",
    utility: "hidden sm:block · hidden md:inline-flex",
  },
  {
    surface: "Forms",
    mobile: "Single column field stack.",
    desktop: "Two-column grid from md where fields are short pairs.",
    utility: "grid md:grid-cols-2",
  },
] as const;

/* ─── Content prioritisation ──────────────────────────── */

const PRIORITY_COLUMNS = [
  {
    element: "WorkItem (inbox row)",
    always: "Priority bar, title, primary status badge",
    sm: "Trailing badges, due date emphasis",
    md: "Assignee avatar, automation badge, secondary meta",
    never: "Full missing-items block (tap through to detail)",
  },
  {
    element: "SchemeCard (list)",
    always: "Scheme name, health indicator",
    sm: "SP plan badge",
    md: "Status badge, lot count metadata",
    never: "Portfolio stat columns (card/wide layouts only)",
  },
  {
    element: "Document (wide row)",
    always: "Name, type icon",
    sm: "File size column",
    md: "Modified date, owner column",
    never: "Wide column headings on list-only mobile views",
  },
  {
    element: "SchemeContextBar",
    always: "Scheme name, plan, back navigation",
    sm: "Location line",
    md: "Full metadata strip, secondary actions",
    never: "Inline portfolio stats",
  },
] as const;

/* ─── Website patterns ────────────────────────────────── */

const WEBSITE_RULES = [
  {
    surface: "Site header",
    mobile: "Hamburger menu, stacked nav links, full-width CTAs.",
    desktop: "Horizontal nav with dropdown panels.",
    utility: "hidden md:flex · md:hidden",
  },
  {
    surface: "Hero",
    mobile: "Stacked headline, subcopy, actions. Visual below copy.",
    desktop: "12-column grid with text left, visual right.",
    utility: "flex flex-col md:grid",
  },
  {
    surface: "Feature / marketing grids",
    mobile: "Single column, gap-4.",
    desktop: "2–3 columns, gap-8 to gap-16 between columns.",
    utility: "grid md:grid-cols-2 lg:grid-cols-3",
  },
  {
    surface: "Section gutter",
    mobile: "px-6 (24px)",
    desktop: "md:px-12 (48px)",
    utility: "Container",
  },
] as const;

interface BreakpointCardProps {
  icon: typeof Monitor;
  label: string;
  detail: string;
}

/**
 * Renders a viewport breakpoint summary card.
 */
function BreakpointCard({ icon: Icon, label, detail }: BreakpointCardProps) {
  return (
    <div className="rounded-sm border border-border bg-white p-5">
      <Icon className="size-5 text-forest mb-3" strokeWidth={1.5} aria-hidden />
      <p className="font-sans text-sm font-semibold text-foreground mb-1">{label}</p>
      <p className="font-sans text-xs text-ink-muted leading-relaxed">{detail}</p>
    </div>
  );
}

interface PatternRowProps {
  surface: string;
  mobile: string;
  desktop: string;
  utility: string;
}

/**
 * Renders an application or website responsive pattern row.
 */
function PatternRow({ surface, mobile, desktop, utility }: PatternRowProps) {
  return (
    <div className="px-6 py-4 bg-background grid gap-3 md:grid-cols-[10rem_1fr_1fr_8rem] md:gap-6 md:items-start">
      <p className="font-sans text-sm font-semibold text-foreground">{surface}</p>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">
          Mobile / tablet
        </p>
        <p className="font-sans text-sm text-ink-muted leading-relaxed">{mobile}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">
          Desktop
        </p>
        <p className="font-sans text-sm text-ink-muted leading-relaxed">{desktop}</p>
      </div>
      <code className="font-mono text-[11px] text-lime self-start">{utility}</code>
    </div>
  );
}

/**
 * Foundation documentation for responsive design across application and website surfaces.
 */
export default function ResponsiveDesignPage() {
  const schemeDemo = SCHEME_DEMO_ITEMS.slice(0, 2);
  const inboxPreview = TASK_QUEUE_DEMO_INBOX.slice(0, 3);

  return (
    <DocsPage className="space-y-20">

      {/* ── Page header ───────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Responsive design
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl mb-4">
          Instant Strata is desktop-first. Dashboards, portfolio tables, and manager
          workflows are designed for detail on large screens. That does not mean mobile
          is an afterthought: strata managers check inboxes, approve items, and look up
          scheme details on their phones throughout the day.
        </p>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          The goal is not to shrink the desktop UI. It is to make deliberate choices about
          what stays visible, what moves behind a tap, and what waits for a larger viewport.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          PHILOSOPHY
      ══════════════════════════════════════════════ */}
      <section id="philosophy">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Philosophy
        </p>
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <BreakpointCard
            icon={Monitor}
            label="Desktop-first"
            detail="Optimise for managers at a desk: wide tables, multi-column dashboards, full metadata, keyboard and pointer precision."
          />
          <BreakpointCard
            icon={Smartphone}
            label="Mobile-aware"
            detail="Every application flow must work on a phone: check a task, find a scheme, read a notification. No horizontal scroll on primary paths."
          />
          <BreakpointCard
            icon={Tablet}
            label="Progressive detail"
            detail="Add columns, badges, and side panels as viewport width increases. Hide with CSS breakpoints, not separate pages."
          />
        </div>
        <ul className="space-y-3 max-w-2xl">
          {[
            "Do not treat mobile as a separate product. Use the same components with layout variants and responsive visibility.",
            "Prefer list and compact layouts on narrow viewports. Reserve wide and card grid layouts for md and lg breakpoints.",
            "If a row needs more than three visible data points on mobile, move the rest to detail view or hide below sm/md.",
            "Touch targets stay at least 44px on interactive rows and buttons, even when visual density is tight.",
            "Marketing pages may stack earlier (md). Application tables hold structure longer and drop columns progressively.",
          ].map((rule) => (
            <li key={rule} className="flex gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <span className="text-lime shrink-0 mt-0.5" aria-hidden="true">-</span>
              {rule}
            </li>
          ))}
        </ul>
      </section>

      {/* ══════════════════════════════════════════════
          BREAKPOINTS
      ══════════════════════════════════════════════ */}
      <section id="breakpoints">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Breakpoints
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Tailwind defaults. The application treats{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            md (768px)
          </code>{" "}
          as the primary mobile boundary via{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            useIsMobile
          </code>
          .
        </p>
        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">
          {BREAKPOINTS.map((row) => (
            <div
              key={row.name}
              className="px-6 py-4 bg-background flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8"
            >
              <code className="font-mono text-sm text-lime shrink-0 w-12">{row.name}</code>
              <span className="font-mono text-xs text-ink-muted shrink-0 w-16">{row.min}+</span>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">{row.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EXAMPLES · DESKTOP VS MOBILE
      ══════════════════════════════════════════════ */}
      <section id="examples">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Examples
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-2xl">
          Drag the interactive viewport below to watch Tailwind breakpoints apply in real
          time. Static pairs underneath show mobile (375px) and desktop (960px) layouts side
          by side using layout variants.
        </p>

        <div className="mb-10">
          <ResizableViewport
            label="Interactive viewport"
            caption="Content renders inside an iframe so sm:, md:, and lg: utilities follow the panel width, like a browser window. Hooks that read window.innerWidth (useIsMobile) still use your actual browser size."
            height={480}
          >
            <div className="overflow-hidden rounded-sm border border-border bg-white divide-y divide-border">
              {inboxPreview.map((item) => (
                <WorkItem key={item.id} item={item} layout="list" href="#" showChevron />
              ))}
            </div>
          </ResizableViewport>
        </div>

        <div className="space-y-8">
          {/* WorkItem */}
          <ViewportCompare
            label="WorkItem · inbox row"
            caption="Mobile uses layout=&quot;compact&quot;: title, badges, chevron only. Desktop uses layout=&quot;list&quot; with trailing due date, assignee, and automation metadata."
            mobile={
              <div className="divide-y divide-border">
                {inboxPreview.map((item) => (
                  <WorkItem
                    key={item.id}
                    item={item}
                    layout="compact"
                    href="#"
                    showChevron
                  />
                ))}
              </div>
            }
            desktop={
              <div className="overflow-hidden rounded-sm border border-border bg-white divide-y divide-border">
                {inboxPreview.map((item) => (
                  <WorkItem
                    key={item.id}
                    item={item}
                    layout="list"
                    href="#"
                    showChevron
                  />
                ))}
              </div>
            }
          />

          {/* Scheme directory */}
          <ViewportCompare
            label="SchemeCard · scheme directory"
            caption="Mobile: list rows with name, health, and chevron. Plan badge appears from sm in live UI; desktop wide rows add column headings, SP number, lot count, manager, and status."
            mobile={
              <SchemeList>
                {schemeDemo.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    layout="list"
                    showHealth
                    showChevron
                    href="#"
                  />
                ))}
              </SchemeList>
            }
            desktop={
              <SchemeList showWideHeader>
                {schemeDemo.map((scheme) => (
                  <SchemeCard
                    key={scheme.id}
                    scheme={scheme}
                    layout="wide"
                    showStatus
                    showHealth
                    href="#"
                  />
                ))}
              </SchemeList>
            }
          />

          {/* Dashboard stats */}
          <ViewportCompare
            label="StatGroup · portfolio KPIs"
            caption="Mobile stacks KPI tiles in a single column. Desktop shows four across. In production, StatGroup uses sm:grid-cols-2 and lg:grid-cols-4 at the viewport breakpoint."
            mobile={
              <StatGroup columns={4} className="!grid-cols-1">
                {STAT_DEMO_PORTFOLIO.slice(0, 4).map((stat) => (
                  <Stat key={stat.label} {...stat} />
                ))}
              </StatGroup>
            }
            desktop={
              <StatGroup columns={4} className="!grid-cols-4">
                {STAT_DEMO_PORTFOLIO.map((stat) => (
                  <Stat key={stat.label} {...stat} />
                ))}
              </StatGroup>
            }
          />

          {/* Widget + task queue */}
          <ViewportCompare
            label="Task queue + widget · manager dashboard"
            caption="Mobile stacks the inbox and deadlines widget vertically. Desktop places the widget beside a wider inbox panel using a two-column grid."
            mobile={
              <div className="space-y-4 p-3">
                <TaskQueueHeader
                  openCount={12}
                  reviewCount={3}
                  overdueCount={2}
                  escalatedCount={1}
                />
                <div className="overflow-hidden rounded-sm border border-border bg-white divide-y divide-border">
                  {inboxPreview.slice(0, 2).map((item) => (
                    <WorkItem
                      key={item.id}
                      item={item}
                      layout="compact"
                      href="#"
                      showChevron
                    />
                  ))}
                </div>
                <Widget>
                  <WidgetHeader divided>
                    <WidgetTitle icon={CalendarClock}>Upcoming deadlines</WidgetTitle>
                  </WidgetHeader>
                  <WidgetList>
                    <WidgetListItem
                      icon={ShieldCheck}
                      title="AGM notice period"
                      meta="Harbour View · 14 days"
                    />
                  </WidgetList>
                </Widget>
              </div>
            }
            desktop={
              <div className="space-y-4 p-4">
                <TaskQueueHeader
                  openCount={12}
                  reviewCount={3}
                  overdueCount={2}
                  escalatedCount={1}
                />
                <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)] gap-4">
                  <div className="overflow-hidden rounded-sm border border-border bg-white divide-y divide-border">
                    {inboxPreview.map((item) => (
                      <WorkItem
                        key={item.id}
                        item={item}
                        layout="list"
                        href="#"
                        showChevron
                      />
                    ))}
                  </div>
                  <Widget>
                    <WidgetHeader divided>
                      <WidgetTitle icon={CalendarClock} count={3}>
                        Upcoming deadlines
                      </WidgetTitle>
                    </WidgetHeader>
                    <WidgetList>
                      <WidgetListItem
                        icon={ShieldCheck}
                        title="AGM notice period"
                        meta="Harbour View · 14 days"
                      />
                      <WidgetListItem
                        icon={Receipt}
                        title="Levy notice run"
                        meta="Parkside · 3 days"
                      />
                    </WidgetList>
                  </Widget>
                </div>
              </div>
            }
          />

          {/* Marketing hero block */}
          <ViewportCompare
            label="Marketing section · hero pattern"
            caption="Website surfaces stack copy and actions on mobile. Desktop uses a two-column grid with the visual beside the text column."
            mobile={
              <div className="space-y-6 p-5 bg-forest text-white">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-lime">
                  For strata managers
                </p>
                <h2 className="font-display text-2xl leading-tight">
                  Everything in one place
                </h2>
                <p className="text-sm text-white/75 leading-relaxed">
                  Levies, compliance, and correspondence in a single inbox.
                </p>
                <div className="flex flex-col gap-2">
                  <Button variant="accent" className="w-full justify-center">
                    Try for free
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-center border-white/40 text-white hover:bg-white/10"
                  >
                    Request demo
                  </Button>
                </div>
                <div className="aspect-[4/3] rounded-lg bg-forest-mid" />
              </div>
            }
            desktop={
              <div className="grid grid-cols-2 gap-8 items-center p-8 bg-forest text-white">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-lime mb-3">
                    For strata managers
                  </p>
                  <h2 className="font-display text-3xl leading-tight mb-4">
                    Everything in one place
                  </h2>
                  <p className="text-sm text-white/75 leading-relaxed mb-6 max-w-md">
                    Levies, compliance, correspondence, and owner requests. One inbox,
                    one roll, one source of truth for every scheme you manage.
                  </p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Button variant="accent">Try for free</Button>
                    <Button
                      variant="outline"
                      className="border-white/40 text-white hover:bg-white/10"
                    >
                      Request demo
                    </Button>
                  </div>
                </div>
                <div className="aspect-[4/3] rounded-lg bg-forest-mid" />
              </div>
            }
          />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          APPLICATION
      ══════════════════════════════════════════════ */}
      <section id="application">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Application
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Manager and owner product UI. Navigation collapses to a sheet; dashboards stack;
          table rows shed columns before they shed meaning.
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border mb-10">
          {APP_LAYOUT_RULES.map((row) => (
            <PatternRow key={row.surface} {...row} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CONTENT PRIORITY
      ══════════════════════════════════════════════ */}
      <section id="priority">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Content priority
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          When space is tight, cut in this order: secondary metadata, then decorative badges,
          then column headings. Never hide the primary identifier, status, or the action that
          unblocks the user.
        </p>

        <div className="rounded-sm border border-border overflow-hidden">
          <div className="hidden md:grid grid-cols-[9rem_1fr_1fr_1fr_1fr] gap-4 px-6 py-3 bg-secondary border-b border-border text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            <span>Element</span>
            <span>Always show</span>
            <span>From sm</span>
            <span>From md</span>
            <span>Desktop only</span>
          </div>
          <div className="divide-y divide-border">
            {PRIORITY_COLUMNS.map((row) => (
              <div
                key={row.element}
                className="px-6 py-4 bg-background space-y-3 md:space-y-0 md:grid md:grid-cols-[9rem_1fr_1fr_1fr_1fr] md:gap-4"
              >
                <p className="font-sans text-sm font-semibold text-foreground">{row.element}</p>
                <div>
                  <p className="md:hidden text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">Always</p>
                  <p className="font-sans text-xs text-ink-muted leading-relaxed">{row.always}</p>
                </div>
                <div>
                  <p className="md:hidden text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">From sm</p>
                  <p className="font-sans text-xs text-ink-muted leading-relaxed">{row.sm}</p>
                </div>
                <div>
                  <p className="md:hidden text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">From md</p>
                  <p className="font-sans text-xs text-ink-muted leading-relaxed">{row.md}</p>
                </div>
                <div>
                  <p className="md:hidden text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">Desktop only</p>
                  <p className="font-sans text-xs text-ink-muted leading-relaxed">{row.never}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          WEBSITE
      ══════════════════════════════════════════════ */}
      <section id="website">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Website
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Marketing surfaces stack naturally on mobile. Whitespace compresses but section
          rhythm stays intact. See{" "}
          <a href="/components/section" className="text-foreground">
            Section
          </a>{" "}
          and{" "}
          <a href="/components/spacing" className="text-foreground">
            Spacing
          </a>{" "}
          for gutter and vertical padding tokens.
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">
          {WEBSITE_RULES.map((row) => (
            <PatternRow key={row.surface} {...row} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          IMPLEMENTATION
      ══════════════════════════════════════════════ */}
      <section id="implementation">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Implementation
        </p>

        <div className="space-y-6 max-w-2xl">
          <div className="rounded-sm border border-border p-6 bg-background">
            <h3 className="font-sans text-sm font-semibold text-foreground mb-3">
              Responsive visibility
            </h3>
            <div className="rounded-sm bg-off-white p-4 font-mono text-xs text-foreground leading-relaxed space-y-1">
              <p>{/* Show from sm upward */}</p>
              <p className="text-lime">className=&quot;hidden sm:inline-flex&quot;</p>
              <p className="mt-3">{/* Hide on mobile only */}</p>
              <p className="text-lime">className=&quot;max-md:hidden&quot;</p>
              <p className="mt-3">{/* Mobile-only block */}</p>
              <p className="text-lime">className=&quot;md:hidden&quot;</p>
            </div>
          </div>

          <div className="rounded-sm border border-border p-6 bg-background">
            <h3 className="font-sans text-sm font-semibold text-foreground mb-3">
              Layout prop over duplicate components
            </h3>
            <p className="font-sans text-sm text-ink-muted leading-relaxed mb-3">
              Choose the layout variant in the consuming page based on breakpoint, or use a
              single list layout with responsive column visibility inside wide rows.
            </p>
            <div className="rounded-sm bg-off-white p-4 font-mono text-xs text-foreground leading-relaxed">
              <p className="text-ink-muted">{/* App route: narrow panel */}</p>
              <p>&lt;SchemeCard layout=&quot;list&quot; scheme=&#123;scheme&#125; /&gt;</p>
              <p className="mt-3 text-ink-muted">{/* Portfolio table: full width */}</p>
              <p>&lt;SchemeList showHeadings&gt;</p>
              <p className="pl-4">&lt;SchemeCard layout=&quot;wide&quot; ... /&gt;</p>
              <p>&lt;/SchemeList&gt;</p>
            </div>
          </div>

          <div className="rounded-sm border border-border p-6 bg-background">
            <h3 className="font-sans text-sm font-semibold text-foreground mb-3">
              ResizableViewport (docs)
            </h3>
            <p className="font-sans text-sm text-ink-muted leading-relaxed mb-3">
              Use{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                ResizableViewport
              </code>{" "}
              from{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                @/components/docs/resizable-viewport
              </code>{" "}
              in documentation previews. It composes{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                ResizablePanelGroup
              </code>{" "}
              with an iframe so CSS media queries match the dragged width. Preset
              buttons jump to 375, 640, 768, 1024, and 1280 pixels.
            </p>
          </div>

          <div className="rounded-sm border border-border p-6 bg-background">
            <h3 className="font-sans text-sm font-semibold text-foreground mb-3">
              useIsMobile hook
            </h3>
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              For behaviour that CSS cannot handle (sheet vs rail, conditional render),
              use{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                useIsMobile()
              </code>{" "}
              from{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                @/hooks/use-mobile
              </code>
              . Threshold: 768px (md). Default SSR snapshot is desktop (false).
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CHECKLIST
      ══════════════════════════════════════════════ */}
      <section id="checklist">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Review checklist
        </p>
        <ul className="space-y-3 max-w-2xl">
          {[
            "Primary task completable on a 375px-wide viewport without horizontal scroll.",
            "Sidebar navigation reachable on mobile via sheet or equivalent.",
            "Row tap targets at least 44px tall for list and inbox items.",
            "Status and identifier visible without expanding a row on mobile.",
            "Wide table layouts only used where viewport has room for column headings.",
            "Desktop dashboard shows strictly more information than mobile, not different information.",
            "Forms stack to one column; paired short fields may sit side-by-side from md.",
            "Notifications and toasts readable at full width on small screens.",
          ].map((item) => (
            <li key={item} className="flex gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <Check className="size-4 text-lime shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>

    </DocsPage>
  );
}
