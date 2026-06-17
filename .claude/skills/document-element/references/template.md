# Element doc template

Copy this structure into `registry/<name>/<name>.md`. Keep section order identical
for every element. Replace every placeholder; delete optional sections only if truly
not applicable (note why if unsure).

```markdown
---
name: <name>
category: <actions | inputs | data-display | feedback | layout | marketing | strata-domain>
status: <stable | beta | experimental>
extends: <base-ui/<x> | shadcn/<x> | null>
dependencies: [<npm-deps-from-registry.json>]
registryDependencies: [<other-elements-it-needs, e.g. utils>]
install: npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/<name>/registry.json
import: import { <Exports> } from "@/components/ui/<name>"
keywords: [<search-terms-an-agent-might-use>]
related: [<sibling-element-names>]
use_when: <one tight line — becomes this element's row in the index>
---

# <ComponentName>

> <One sentence: what this element is for. Stands alone — becomes the registry.json description.>

## When to use

- <Concrete scenario.>
- <Concrete scenario.>

## When NOT to use

- <Scenario.> — use [<alternative>](../<alternative>/<alternative>.md) instead.

## Anatomy & look

<Plain-language description of appearance + the visual rules from DESIGN.md:
radius, colour roles, sizing, iconography, motion, key states.>

## API

| Prop | Type | Default | Description |
|---|---|---|---|
| `<prop>` | `<type union>` | `<default>` | <what it does> |

Exports: `<list every export and the public types>`.

## Usage

\`\`\`tsx
<minimal import + simplest real usage>
\`\`\`

## Variants & states

\`\`\`tsx
// <variant/state>: <when to reach for it>
<snippet>
\`\`\`

## Do / Don't

- ✅ <good practice + why>
- ❌ <anti-pattern + why>
```

## Section guidance

- **Frontmatter** is machine-read — every field matters. `use_when` and the `>`
  purpose line feed the generated index and `registry.json`, so make them strong.
- **When to use / When NOT to use** is the highest-value section for agent *selection*.
  Always offer the correct alternative in the "not" cases and link it.
- **Anatomy & look** is where DESIGN.md's visual rules live. If the source contradicts
  DESIGN.md, document the source and add a `> **Note:**` flagging the drift.
- **API** must be exhaustive and exact to the `.tsx` — wrong types are worse than no docs.
- **Variants & states** snippets should be copy-pasteable and each say *when* to use it.
- For **strata-domain** elements, add a short paragraph explaining the domain concept
  (lot, levy, scheme, R-A-S gate) before the API — an agent needs the business meaning.
