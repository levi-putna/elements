---
name: agent-action
category: actions
status: stable
extends: null
dependencies: [lucide-react]
registryDependencies: [utils]
install: npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/agent-action/registry.json
import: import { AgentAction, AgentActionList, AgentActionCategoryBadge } from "@/components/ui/agent-action"
keywords: [agent, ai, assistant, prompt, trigger, action, automation, task, launch]
related: [button, task, widget, conversation]
use_when: Trigger an AI agent to handle a workflow task with a pre-written prompt
---

# AgentAction

> A call-to-action element that launches an AI agent with a stored preset prompt; stores the full prompt internally and shows only a friendly title and description to the user.

## When to use

- A task or compliance deadline page where an agent can do the work (e.g. renew insurance, prepare AGM notices, chase a contractor).
- A dashboard widget that surfaces recommended agent actions for the day.
- A detail view for a scheme or lot where contextual agent actions are available (e.g. "Draft levy reminder for Lot 14").
- A toolbar or action bar where compact inline triggers sit alongside manual action buttons.
- Any time you want a consistent, recognisable UI for "start an agent" that carries the full prompt internally without exposing it to the user.

## When NOT to use

- A simple navigation link or page transition — use a plain link or [`button`](../button/button.md) instead.
- A form submission or synchronous action that does not involve an agent — use [`button`](../button/button.md).
- A task that must be reviewed by the manager before dispatch (R-A-S workflow) — use [`task`](../task/task.md) with a review action; `AgentAction` is for launching the agent, not reviewing its output.
- Displaying the agent's conversation or output — use [`conversation`](../conversation/conversation.md) or the [`assistant`](../assistant/assistant.md) panel.

## Anatomy & look

Three display variants share the same core data model:

**Card** (`variant="card"`)
- White surface, `rounded-sm` (8px), `1px` border, subtle shadow — matching the standard card look.
- Header: a lime-soft icon chip (`rounded-sm`, forest icon) beside the title in Inter semibold. Optional category badge beneath.
- Body: `text-xs` description in `ink-muted`, giving the user enough context without showing the raw prompt.
- Footer: a full-width forest-green "Start agent" button with a Sparkles icon, separated by a top border.

**Row** (`variant="row"`)
- Horizontal flex row: lime-soft icon chip on the left, title + optional category badge + description in the centre, a compact "Launch" outline button on the right.
- Designed to sit inside `AgentActionList` (which provides the divided list shell and optional section heading).
- Matches the rhythm of `WidgetListItem` so both can appear in the same panel without visual disruption.

**Inline** (`variant="inline"`)
- A compact bordered button-like trigger: leading icon (forest, transitions to white on hover), title text, trailing chevron.
- Hovers to a full forest-green fill — the same affordance as the `default` Button variant.
- No description shown; the title must be self-explanatory at this size.

**Category badge** (`AgentActionCategoryBadge`)
- `rounded-xs` lime-soft chip in `text-[10px] font-semibold uppercase`. Used to label the domain area (Insurance, Compliance, AGM, Maintenance, etc.).

**States**
- `disabled`: full `opacity-60`, pointer events off.
- `loading`: "Start agent" button shows a small spin ring and "Starting…" text; row button shows the ring only.
- Never white text on lime; the category badge uses forest text on lime-soft.

## API

### AgentAction

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | User-facing label (short — fits on one line in row/inline). |
| `description` | `string` | — | Brief summary of what the agent will do. Shown to the user; not the prompt. |
| `prompt` | `string` | — | Full prompt passed to the agent on trigger. Never rendered. |
| `category` | `string` | — | Context label rendered as a small badge (e.g. "Insurance"). |
| `icon` | `LucideIcon` | `Sparkles` | Leading icon for the card header or row chip. |
| `variant` | `"card" \| "row" \| "inline"` | `"card"` | Visual layout. |
| `onTrigger` | `(prompt: string) => void` | — | Called when triggered; receives the full prompt string. |
| `href` | `string` | — | Navigate to this URL instead of calling `onTrigger`. |
| `disabled` | `boolean` | `false` | Disables the trigger. |
| `loading` | `boolean` | `false` | Shows a spinner and disables interaction. |
| `...props` | `HTMLAttributes<HTMLElement>` | — | Passed to the root element (div for card/row, button for inline). |

### AgentActionList

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | — | Optional section heading with a Sparkles icon above the list. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Native div props. |

### AgentActionCategoryBadge

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Category text rendered in the badge. |
| `...props` | `HTMLAttributes<HTMLSpanElement>` | — | Native span props. |

Exports: `AgentAction`, `AgentActionList`, `AgentActionCategoryBadge`, and the types `AgentActionVariant`, `AgentActionProps`, `AgentActionListProps`, `AgentActionCategoryBadgeProps`.

## Usage

```tsx
import { AgentAction } from "@/components/ui/agent-action"
import { ShieldCheck } from "lucide-react"

<AgentAction
  title="Renew Building Insurance"
  description="The agent will review the current policy expiry, compare market quotes, and prepare a renewal recommendation for committee approval."
  prompt="You are helping a strata manager renew the building insurance for Harbour View Towers (SP 48291). The current policy expires on 30 June 2026. Please: 1) Review the existing policy terms from the attached documents. 2) Search for competitive quotes from at least three insurers. 3) Prepare a comparison summary highlighting coverage differences and premium changes. 4) Draft a committee recommendation memo recommending the preferred option."
  category="Insurance"
  icon={ShieldCheck}
  onTrigger={(prompt) => openAgentView(prompt)}
/>
```

## Variants & states

```tsx
// card: standalone panel — use in detail views, sidebars, or a 2-3 column grid
<AgentAction
  variant="card"
  title="Prepare AGM Notice Pack"
  description="Draft motions, proxy forms, and the cover letter for the upcoming AGM. The agent will pull this year's financials and the committee's approved agenda."
  prompt="[full agent prompt here]"
  category="AGM"
  onTrigger={openAgent}
/>
```

```tsx
// row: compact list item — compose inside AgentActionList or a Widget
<AgentActionList title="Suggested agent actions">
  <AgentAction
    variant="row"
    title="Renew Building Insurance"
    description="Policy expiring in 9 days. Get quotes and prepare a renewal recommendation."
    prompt="[full prompt]"
    category="Insurance"
    icon={ShieldCheck}
    onTrigger={openAgent}
  />
  <AgentAction
    variant="row"
    title="Chase lift maintenance quotes"
    description="Three quotes are outstanding for the lift upgrade. Follow up each contractor."
    prompt="[full prompt]"
    category="Maintenance"
    icon={Wrench}
    onTrigger={openAgent}
  />
</AgentActionList>
```

```tsx
// inline: compact trigger — toolbars, page headers, or inline in prose
<AgentAction
  variant="inline"
  title="Draft levy reminder"
  prompt="[full prompt]"
  onTrigger={openAgent}
/>
```

```tsx
// loading: show progress after the agent is launched
<AgentAction
  title="Renew Building Insurance"
  description="Gathering policy documents..."
  prompt="[full prompt]"
  loading
/>
```

```tsx
// href: navigate to a dedicated agent view instead of a callback
<AgentAction
  variant="inline"
  title="Prepare AGM Notice Pack"
  prompt="[full prompt]"
  href="/assistant?task=agm-notice-pack"
/>
```

## Do / Don't

- Use descriptive `description` text that gives the manager enough context to decide whether to launch the agent. Avoid vague phrases like "The agent will help you."
- Keep `title` short enough to fit on a single line in `row` and `inline` variants (under ~40 characters).
- Pass the complete, production-ready prompt as the `prompt` prop — the component will forward it verbatim to `onTrigger`. Do not construct the prompt at render time using incomplete data.
- Use `category` to let managers scan a list of agent actions by domain area (Insurance, Compliance, Maintenance, AGM, Admin).
- Reserve `loading` for the period after the user triggers the agent and before the agent view has loaded. Clear it once the view is open.
- Do not use `AgentAction` to display agent output or conversation — use [`conversation`](../conversation/conversation.md).
- Do not use `AgentAction` as a general-purpose button for non-agent actions — use [`button`](../button/button.md).
- Do not nest `AgentActionList` inside a padded `WidgetContent` without `flush` — you will get a double border. Use `flush` on the widget content.
