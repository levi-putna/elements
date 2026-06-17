import { CalendarClock, FileCheck2, Scale, ShieldCheck, Wrench } from "lucide-react";

import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Badge } from "@/components/ui/badge";
import { Stat, StatGroup, STAT_DEMO_PORTFOLIO } from "@/components/ui/stat";
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
} from "@/components/ui/widget";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/widget/registry.json
npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/stat/registry.json`;

const STAT_USAGE = `import { Stat, StatGroup } from "@/components/ui/stat"
import { Receipt } from "lucide-react"

<StatGroup columns={4}>
  <Stat
    label="Levy arrears"
    value="$84.2k"
    icon={Receipt}
    tone="warning"
    delta={{ value: "4%", direction: "down", sentiment: "positive" }}
    caption="across 37 lots"
    href="/levies"
  />
</StatGroup>`;

const WIDGET_USAGE = `import {
  Widget, WidgetHeader, WidgetTitle, WidgetAction,
  WidgetContent, WidgetList, WidgetListItem,
} from "@/components/ui/widget"
import { CalendarClock, ShieldCheck } from "lucide-react"

<Widget>
  <WidgetHeader>
    <WidgetTitle icon={CalendarClock}>Upcoming deadlines</WidgetTitle>
    <WidgetAction href="/calendar">Calendar</WidgetAction>
  </WidgetHeader>
  <WidgetContent flush>
    <WidgetList>
      <WidgetListItem
        icon={ShieldCheck}
        iconTone="warning"
        title="Fire safety statement (AFSS)"
        meta="Harbour View Towers · SP 1042"
        href="/compliance"
        trailing={<span className="text-xs text-ink-muted">Due in 9 days</span>}
      />
    </WidgetList>
  </WidgetContent>
</Widget>`;

const GRID_USAGE = `import { WidgetGrid, Widget } from "@/components/ui/widget"

<WidgetGrid columns={3}>
  <div className="space-y-4 lg:col-span-2">
    <Widget>{/* main panel */}</Widget>
  </div>
  <div className="space-y-4">
    <Widget>{/* side panel */}</Widget>
  </div>
</WidgetGrid>`;

const STAT_PROPS = [
  { name: "label", type: "string", description: "Short metric name, e.g. \"Levy arrears\"." },
  { name: "value", type: "ReactNode", description: "The headline value. String, or a node for split/currency values." },
  { name: "icon", type: "LucideIcon", description: "Optional leading icon shown in a tinted chip." },
  { name: "tone", type: '"default" | "accent" | "warning" | "danger" | "info"', default: '"default"', description: "Colour signal for the icon chip. The card surface stays white." },
  { name: "delta", type: "{ value: string; direction: \"up\" | \"down\" | \"flat\"; sentiment?: \"positive\" | \"negative\" | \"neutral\" }", description: "Trend pill under the value. Sentiment defaults to up=positive / down=negative — override when a falling number is good." },
  { name: "caption", type: "string", description: "Supporting text after the delta, e.g. \"vs last month\"." },
  { name: "href", type: "string", description: "When set, the whole tile becomes a link." },
];

const STATGROUP_PROPS = [
  { name: "columns", type: "2 | 3 | 4", default: "4", description: "Columns at the largest breakpoint. Collapses to one column on mobile." },
];

const WIDGET_PROPS = [
  { name: "tone", type: '"default" | "muted"', default: '"default"', description: "Surface colour. default = white, muted = off-white for alternation." },
];

const WIDGETTITLE_PROPS = [
  { name: "icon", type: "LucideIcon", description: "Optional leading icon." },
  { name: "count", type: "number", description: "Optional count chip after the title (e.g. open item count)." },
  { name: "as", type: '"h2" | "h3"', default: '"h3"', description: "Heading level." },
];

const WIDGETCONTENT_PROPS = [
  { name: "flush", type: "boolean", default: "false", description: "Remove padding so an edge-to-edge list sits flush with the border." },
];

const LISTITEM_PROPS = [
  { name: "icon", type: "LucideIcon", description: "Leading icon shown in a tinted chip." },
  { name: "iconTone", type: '"default" | "accent" | "warning" | "danger" | "info"', default: '"default"', description: "Colour of the leading icon chip." },
  { name: "title", type: "ReactNode", description: "Primary line (truncates)." },
  { name: "meta", type: "ReactNode", description: "Secondary metadata line — scheme, plan, dates (truncates)." },
  { name: "trailing", type: "ReactNode", description: "Trailing content: a badge, value, status indicator, or stack. Right-aligned." },
  { name: "href", type: "string", description: "Makes the whole row a link with a hover state and chevron." },
  { name: "showChevron", type: "boolean", description: "Force the trailing chevron. Implied when href is set." },
];

const DEADLINE_DEMO = [
  { icon: FileCheck2, iconTone: "danger" as const, title: "Strata Hub annual return", meta: "Northbridge Estate · SP 4821", when: "Overdue 3 days", badge: "destructive" as const, badgeLabel: "Statutory" },
  { icon: ShieldCheck, iconTone: "warning" as const, title: "Fire safety statement (AFSS)", meta: "Harbour View Towers · SP 1042", when: "Due in 9 days", badge: "warning" as const, badgeLabel: "Statutory" },
  { icon: CalendarClock, iconTone: "warning" as const, title: "Annual General Meeting", meta: "Parkside Residences · SP 2287", when: "Notice due in 14 days", badge: "warning" as const, badgeLabel: "Statutory" },
  { icon: Wrench, iconTone: "info" as const, title: "Building insurance renewal", meta: "The Quarter · SP 3390", when: "Due in 26 days", badge: "info" as const, badgeLabel: "Renewal" },
];

/**
 * Widget kit documentation: the dashboard panel shell, reusable list
 * row, responsive grid, and the Stat KPI tile.
 */
export default function WidgetsPage() {
  return (
    <DocsPage width="wide">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Application
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Widgets</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          The dashboard kit. <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">Stat</code> is the
          headline KPI tile; <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">Widget</code> is the
          panel shell, with a reusable <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">WidgetListItem</code> row
          and a <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">WidgetGrid</code> layout. The same
          row powers deadlines, approvals, arrears, and portfolio health — change the data, not the markup.
          See it all composed on the{" "}
          <a href="/preview/app" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">manager dashboard preview</a>.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* STAT */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Stat — KPI strip</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A headline number with a label, tinted icon chip, trend delta, and caption. Tone colours the icon
          chip only — the surface stays white, per the brand. Set <code className="font-mono">sentiment</code> when a
          falling number is good (arrears down is positive).
        </p>
        <ComponentPreview label="StatGroup · four portfolio KPIs">
          <StatGroup columns={4}>
            {STAT_DEMO_PORTFOLIO.map((kpi) => (
              <Stat key={kpi.label} {...kpi} />
            ))}
          </StatGroup>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={STAT_USAGE} language="tsx" />
        </div>
      </section>

      {/* WIDGET SHELL + LIST */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Widget — panel + list</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A bordered panel with a header (title, count, trailing action), a flush list body, and an optional
          footer. <code className="font-mono">WidgetListItem</code> renders leading icon · title + meta · trailing.
        </p>
        <ComponentPreview label="Widget · upcoming deadlines">
          <div className="mx-auto max-w-md">
            <Widget>
              <WidgetHeader>
                <WidgetTitle icon={CalendarClock} count={DEADLINE_DEMO.length}>
                  Upcoming deadlines
                </WidgetTitle>
                <WidgetAction href="#">Calendar</WidgetAction>
              </WidgetHeader>
              <WidgetContent flush>
                <WidgetList>
                  {DEADLINE_DEMO.map((row) => (
                    <WidgetListItem
                      key={row.title}
                      icon={row.icon}
                      iconTone={row.iconTone}
                      title={row.title}
                      meta={row.meta}
                      href="#"
                      trailing={
                        <>
                          <Badge variant={row.badge} size="sm">{row.badgeLabel}</Badge>
                          <span className="text-xs text-ink-muted">{row.when}</span>
                        </>
                      }
                    />
                  ))}
                </WidgetList>
              </WidgetContent>
              <WidgetFooter>
                <span>Statutory dates carry legal deadlines — never let one slip.</span>
              </WidgetFooter>
            </Widget>
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={WIDGET_USAGE} language="tsx" />
        </div>
      </section>

      {/* GRID */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">WidgetGrid — dashboard layout</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A responsive grid. With <code className="font-mono">columns=&#123;3&#125;</code>, wrap the main panels in a
          <code className="font-mono"> lg:col-span-2</code> column and the side panels in the third.
        </p>
        <CodeBlock code={GRID_USAGE} language="tsx" />
      </section>

      {/* PROPS */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Stat props</h2>
        <PropTable props={STAT_PROPS} />
      </section>
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">StatGroup props</h2>
        <PropTable props={STATGROUP_PROPS} />
      </section>
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Widget props</h2>
        <PropTable props={WIDGET_PROPS} />
      </section>
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">WidgetTitle props</h2>
        <PropTable props={WIDGETTITLE_PROPS} />
      </section>
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">WidgetContent props</h2>
        <PropTable props={WIDGETCONTENT_PROPS} />
      </section>
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">WidgetListItem props</h2>
        <PropTable props={LISTITEM_PROPS} />
      </section>
    </DocsPage>
  );
}
