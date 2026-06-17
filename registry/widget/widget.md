---
name: widget
category: layout
status: stable
extends: null
dependencies: [lucide-react]
registryDependencies: [utils]
install: npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/widget/registry.json
import: import { Widget, WidgetHeader, WidgetTitle, WidgetAction, WidgetContent, WidgetFooter, WidgetEmptyState, WidgetList, WidgetListItem, WidgetGrid } from "@/components/ui/widget"
keywords: [dashboard, panel, widget, kpi, list, grid, home, overview, card]
related: [stat, card, task, scheme]
use_when: Frame a dashboard panel or list of summary rows
---

# Widget

> The dashboard panel kit: a bordered card shell, a reusable summary list row, and a responsive grid for laying out an app home / overview screen.

## When to use

- A panel on a dashboard or overview screen — "Upcoming deadlines", "Awaiting approval", "Recent activity", "Portfolio health".
- Any list of summary rows where each row is *leading icon · title + meta · trailing value/badge*. One `WidgetListItem` renders them all — change the data, not the markup.
- The overall dashboard layout, via `WidgetGrid` (main panel spans two columns, side panels take the third).
- Wrapping another element (e.g. a [`task`](../task/task.md) queue) in a consistent titled frame with a "View all" action.

## When NOT to use

- A marketing feature tile or blog card — use [`card`](../card/card.md) (`FeatureCard`, `BlogCard`).
- A single headline metric/number — use [`stat`](../stat/stat.md); `Stat` is the KPI tile that sits *above* the widgets.
- An operational work item with workflow state, priority, and R-A-S gating — use [`task`](../task/task.md) (`WorkItem`), optionally inside a `Widget` shell.
- The asymmetric marketing showcase grid — use [`bento`](../bento/bento.md).

## Anatomy & look

- **Shell** (`Widget`): white (or off-white `muted`) surface, `rounded-sm` (4px), `1px` border, subtle `0 1px 3px` shadow — matching the flat bordered panels used across the docs/app surfaces.
- **Header** (`WidgetHeader`): a title row with an optional bottom divider. Put a `WidgetTitle` on the left and a `WidgetAction` link on the right.
- **Title** (`WidgetTitle`): Inter `text-sm font-semibold` — dense app UI uses Inter, *not* Young Serif (DESIGN.md: "Young Serif is for marketing, not dense UI"). Optional leading icon (16px, ink-muted) and a count chip (`rounded-xs` off-white pill).
- **Action** (`WidgetAction`): low-emphasis `text-xs` ink-muted link with a trailing chevron; hovers to forest. Defaults to "View all".
- **Content** (`WidgetContent`): padded by default; pass `flush` so an edge-to-edge `WidgetList` sits flush with the border.
- **List row** (`WidgetListItem`): leading icon in a tinted `rounded-sm` chip, a truncating title + meta, and a right-aligned trailing stack (badge, value, status). Becomes a hover-highlighted link when `href` is set, with a trailing chevron.
- **Icon chip tones** mirror the brand semantic set: `default` off-white, `accent` lime-soft/forest, `warning` warning-soft, `danger` danger-soft, `info` info-soft.
- **Grid** (`WidgetGrid`): single column on mobile, `columns` (2 or 3) at `lg`. Children use `lg:col-span-2` to make a main panel span two columns.

## API

### Widget

| Prop | Type | Default | Description |
|---|---|---|---|
| `tone` | `"default" \| "muted"` | `"default"` | Surface colour. `default` = white, `muted` = off-white for alternation. |
| `...props` | `HTMLDivElement` | — | Native div props (`className`, etc.). |

### WidgetHeader

| Prop | Type | Default | Description |
|---|---|---|---|
| `divided` | `boolean` | `true` | Draw a divider below the header. |

### WidgetTitle

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `LucideIcon` | — | Optional leading icon. |
| `count` | `number` | — | Optional count chip after the title. |
| `as` | `"h2" \| "h3"` | `"h3"` | Heading level. |

### WidgetAction

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | `"#"` | Link destination. |
| `children` | `ReactNode` | `"View all"` | Link label (chevron is appended). |

### WidgetContent

| Prop | Type | Default | Description |
|---|---|---|---|
| `flush` | `boolean` | `false` | Remove padding so an edge-to-edge list sits flush with the border. |

### WidgetEmptyState

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `LucideIcon` | `Inbox` | Centred icon. |
| `title` | `string` | `"Nothing here yet"` | Headline. |
| `description` | `string` | — | Supporting line. |

### WidgetListItem

| Prop | Type | Default | Description |
|---|---|---|---|
| `icon` | `LucideIcon` | — | Leading icon shown in a tinted chip. |
| `iconTone` | `"default" \| "accent" \| "warning" \| "danger" \| "info"` | `"default"` | Colour of the leading icon chip. |
| `title` | `ReactNode` | — | Primary line (truncates). |
| `meta` | `ReactNode` | — | Secondary metadata line (truncates). |
| `trailing` | `ReactNode` | — | Right-aligned trailing content: badge, value, indicator, or stack. |
| `href` | `string` | — | Makes the whole row a link with hover + chevron. |
| `showChevron` | `boolean` | `Boolean(href)` | Force the trailing chevron. |

### WidgetGrid

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `2 \| 3` | `3` | Columns at the `lg` breakpoint. Children use `lg:col-span-*` to span. |

Exports: `Widget`, `WidgetHeader`, `WidgetTitle`, `WidgetAction`, `WidgetContent`, `WidgetFooter`, `WidgetEmptyState`, `WidgetList`, `WidgetListItem`, `WidgetGrid`, and the types `WidgetTone`, `WidgetIconTone`, plus each component's `*Props`.

## Usage

```tsx
import {
  Widget, WidgetHeader, WidgetTitle, WidgetAction,
  WidgetContent, WidgetList, WidgetListItem,
} from "@/components/ui/widget"
import { CalendarClock, ShieldCheck } from "lucide-react"

<Widget>
  <WidgetHeader>
    <WidgetTitle icon={CalendarClock} count={4}>Upcoming deadlines</WidgetTitle>
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
        trailing={<span className="text-xs text-ink-muted">9 days</span>}
      />
    </WidgetList>
  </WidgetContent>
</Widget>
```

## Variants & states

```tsx
// Dashboard layout: main panel spans two columns, side column takes the third.
<WidgetGrid columns={3}>
  <div className="space-y-4 lg:col-span-2">{/* main panels */}</div>
  <div className="space-y-4">{/* side panels */}</div>
</WidgetGrid>
```

```tsx
// Wrap another element in a titled frame (flush content, divided list).
<Widget>
  <WidgetHeader>
    <WidgetTitle icon={Inbox} count={12}>Needs your attention</WidgetTitle>
    <WidgetAction href="/inbox">View inbox</WidgetAction>
  </WidgetHeader>
  <WidgetContent flush className="divide-y divide-border">
    {items.map((it) => <WorkItem key={it.id} item={it} href={`/tasks/${it.id}`} showChevron />)}
  </WidgetContent>
</Widget>
```

```tsx
// Empty state and footer.
<Widget>
  <WidgetHeader><WidgetTitle>Recent activity</WidgetTitle></WidgetHeader>
  <WidgetContent flush><WidgetEmptyState description="Nothing has happened yet today." /></WidgetContent>
  <WidgetFooter><span>Updated just now</span></WidgetFooter>
</Widget>
```

## Do / Don't

- ✅ Use `flush` content for any list so rows align with the border and divide cleanly.
- ✅ Keep titles in Inter (the default) — Young Serif is for marketing, not dense dashboards.
- ✅ Reuse `WidgetListItem` across every summary panel; only the data changes.
- ✅ Reserve the `danger`/`warning` icon tones for rows that genuinely need attention, so colour stays meaningful.
- ❌ Don't nest a bordered list *inside* a padded `WidgetContent` — you get a double border. Use `flush`.
- ❌ Don't put a headline number in a `WidgetListItem`; that's a [`stat`](../stat/stat.md) tile.
- ❌ Don't add drop shadows beyond the built-in card lift, and don't round corners into pills.
