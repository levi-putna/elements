---
name: stat
category: data-display
status: stable
extends: null
dependencies: [lucide-react]
registryDependencies: [utils]
install: npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/stat/registry.json
import: import { Stat, StatGroup, StatDelta } from "@/components/ui/stat"
keywords: [kpi, metric, stat, number, trend, delta, dashboard, summary]
related: [widget, card, scheme]
use_when: Show a headline KPI number with a trend
---

# Stat

> A dashboard KPI tile: a single headline value with a label, tinted icon chip, directional trend delta, and supporting caption.

## When to use

- The KPI strip at the top of a dashboard — "Levy arrears", "Open maintenance", "Needs attention".
- Any single, scannable metric where the *number* is the point and a trend gives it context.
- A summary number that should signal status by colour (overdue = danger, on-track = accent).

## When NOT to use

- A panel containing a *list* of rows or mixed content — use [`widget`](../widget/widget.md).
- A marketing stat band with oversized display figures and editorial copy — use a [`section`](../section/section.md) / [`statement`](../statement/statement.md) composition.
- Per-scheme operational figures inside a scheme card — use the `SchemeStat` part of [`scheme`](../scheme/scheme.md).
- A row inside a widget list (icon · title · trailing) — that's a `WidgetListItem` in [`widget`](../widget/widget.md).

## Anatomy & look

- Bordered white card, `rounded-sm` (4px), `1px` border, subtle `0 1px 3px` shadow — matching the flat bordered panels used across the docs/app surfaces.
- Label (Inter `text-xs` ink-muted) top-left; optional tinted icon chip (`size-8`, `rounded-sm`) top-right.
- The value is **Young Serif** (`font-display text-3xl`) — a deliberate single hero figure per tile, the established app-preview pattern for KPI numbers. Everything else stays Inter.
- **Tone colours the icon chip only** — the card surface stays white, keeping the dashboard calm and on-brand (white is dominant). Tones: `default` off-white, `accent` lime-soft/forest, `warning` warning-soft, `danger` danger-soft, `info` info-soft.
- **Delta** (`StatDelta`): a small arrow + value. Sentiment colours it — `positive` forest, `negative` danger, `neutral` ink-muted. Direction defaults sentiment (`up`→positive, `down`→negative); **override when a falling number is good** (arrears down is positive).
- Optional `caption` follows the delta in ink-muted (e.g. "across 37 lots").
- With `href`, the whole tile is a link that hovers its border to ink-muted.
- `StatGroup` lays tiles in a responsive grid: one column on mobile, up to `columns` (2–4) on larger screens.

## API

### Stat

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Short metric name. |
| `value` | `ReactNode` | — | Headline value (string, or node for split/currency values). |
| `icon` | `LucideIcon` | — | Optional leading icon shown in a tinted chip. |
| `tone` | `"default" \| "accent" \| "warning" \| "danger" \| "info"` | `"default"` | Colours the icon chip. The surface stays white. |
| `delta` | `{ value: string; direction: "up" \| "down" \| "flat"; sentiment?: "positive" \| "negative" \| "neutral" }` | — | Trend pill under the value. |
| `caption` | `string` | — | Supporting text after the delta. |
| `href` | `string` | — | When set, the whole tile becomes a link. |

### StatDelta

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | — | Change shown next to the arrow, e.g. `"4%"` or `"3 today"`. |
| `direction` | `"up" \| "down" \| "flat"` | — | Arrow direction (`flat` → horizontal arrow). |
| `sentiment` | `"positive" \| "negative" \| "neutral"` | derived from `direction` | Colour: good (forest), bad (danger), or neutral. |

### StatGroup

| Prop | Type | Default | Description |
|---|---|---|---|
| `columns` | `2 \| 3 \| 4` | `4` | Columns at the largest breakpoint. Collapses to one column on mobile. |

Exports: `Stat`, `StatGroup`, `StatDelta`, the demo array `STAT_DEMO_PORTFOLIO`, and the types `StatTone`, `StatProps`, `StatGroupProps`, `StatDeltaProps`, `StatDeltaConfig`, `StatDeltaDirection`, `StatDeltaSentiment`.

## Usage

```tsx
import { Stat, StatGroup } from "@/components/ui/stat"
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
</StatGroup>
```

## Variants & states

```tsx
// Attention metric — danger tone, a rise is bad.
<Stat label="Needs attention" value="12" tone="danger"
  delta={{ value: "3 today", direction: "up", sentiment: "negative" }} />
```

```tsx
// Falling number that is good — override sentiment so down reads green.
<Stat label="Overdue levies" value="$84.2k" tone="warning"
  delta={{ value: "4%", direction: "down", sentiment: "positive" }} />
```

```tsx
// Plain volume metric — info tone, caption instead of a delta.
<Stat label="Open maintenance" value="16" tone="info" caption="2 emergency" />
```

## Do / Don't

- ✅ Set `sentiment` explicitly whenever a falling number is good (arrears, overdue, churn) — the default would mis-colour it red.
- ✅ Use tone to signal status; reserve `danger`/`warning` for metrics that actually need attention.
- ✅ Group the strip with `StatGroup` so tiles align and collapse responsively.
- ❌ Don't tint the whole card — tone is for the icon chip; white surfaces keep the dashboard calm.
- ❌ Don't put multi-line or list content in a `Stat`; it's one number. Use [`widget`](../widget/widget.md).
- ❌ Don't pair the Young Serif value with `font-bold`/`font-medium` — Young Serif is weight 400 only.
