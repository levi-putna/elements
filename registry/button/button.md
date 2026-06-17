---
name: button
category: actions
status: stable
extends: base-ui/button
dependencies: [class-variance-authority, lucide-react]
registryDependencies: [utils]
install: npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/button/registry.json
import: import { Button } from "@/components/ui/button"
keywords: [cta, submit, action, loading, link, icon-button]
related: [input-group, field, prompt-input]
use_when: Trigger an action (submit, confirm, CTA)
---

# Button

> Triggers an action or event — form submission, dialog confirmation, a call-to-action. Built on Base UI's button primitive with an added `loading` state.

## When to use

- The primary action in a form, dialog, card, or page section.
- A call-to-action on marketing pages (`accent` variant for highest visibility).
- An icon-only control in a toolbar or compact UI (`size="icon"`).
- Any action that *does something* in the current view (submit, save, open a dialog, run a task).

## When NOT to use

- **Navigation between pages or to an external URL** — use a link/anchor. The `link` variant styles a real link; it is not for in-place actions.
- **Toggling a single boolean** — use [`switch`](../switch/switch.md) or [`checkbox`](../checkbox/checkbox.md).
- **Selecting one of several options** — use [`radio-group`](../radio-group/radio-group.md) or [`select`](../select/select.md).

## Anatomy & look

- Rectangular, `rounded-sm` (4px) corners — **never pill-shaped**.
- Default height `h-8` (32px); compact `xs`/`sm` and larger `lg` available.
- Icons auto-size to `size-4` and sit inline; use `data-icon="inline-start"` / `"inline-end"` on the icon to get correct edge padding.
- Pressing nudges the label down 1px (`active:translate-y-px`) unless it opens a popup.
- `loading` renders an animated shimmer sweep across the button and sets `aria-busy`; the label stays visible and the button is disabled.

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | `default \| accent \| outline \| secondary \| ghost \| destructive \| link` | `default` | Visual style — see Variants below. |
| `size` | `default \| xs \| sm \| lg \| icon \| icon-xs \| icon-sm \| icon-lg` | `default` | Height/padding. The `icon*` sizes are square for icon-only buttons. |
| `loading` | `boolean` | `false` | Shows a shimmer sweep, sets `aria-busy`, and disables the button. Label remains visible. |
| `disabled` | `boolean` | `false` | Disables the button. Also implied when `loading` is `true`. |
| `...props` | `Base UI Button.Props` | — | All native button props (`onClick`, `type`, `aria-*`, etc.) pass through. |

Exports: `Button`, `buttonVariants` (the CVA function), and the `ButtonProps` type.

## Usage

```tsx
import { Button } from "@/components/ui/button"

<Button onClick={save}>Save changes</Button>
```

## Variants & states

```tsx
// Primary brand action — forest green fill, white text. One per section.
<Button variant="default">Save changes</Button>

// Accent — lime fill, forest text. Highest-visibility CTA. Use sparingly.
<Button variant="accent">Try for free</Button>

// Secondary action shown alongside a primary.
<Button variant="outline">Cancel</Button>

// Low-emphasis action, no border/fill until hover.
<Button variant="ghost">Dismiss</Button>

// Destructive — tinted red. For delete/remove actions.
<Button variant="destructive">Delete scheme</Button>

// Looks like a text link; for in-flow textual actions.
<Button variant="link">Learn more</Button>

// Loading — disabled, shimmer sweep, label stays.
<Button loading>Saving…</Button>

// Icon-only — pair with an aria-label.
<Button size="icon" aria-label="Add lot"><Plus /></Button>
```

## Do / Don't

- ✅ Use exactly one `default` (or `accent`) button per CTA group; pair it with `outline`/`ghost` for secondary actions.
- ✅ Give every icon-only button an `aria-label`.
- ✅ Use `loading` for async actions instead of swapping the label out for a spinner.
- ❌ Don't put more than two buttons in a single CTA group.
- ❌ Don't use a Button for navigation — use a link.
- ❌ Don't override the radius to make pills, and don't put white text on the lime `accent` fill.

> **Note:** DESIGN.md's Button section is out of date relative to this source (it describes lime as the default fill and lists only `default/outline/ghost`). This file reflects the actual component. Reconcile DESIGN.md when convenient.
