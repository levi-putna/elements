---
name: document-element
description: >-
  Write or refresh the AI-agent documentation for a UI element in this Instant Strata
  Elements repo, and propagate the changes everywhere they need to live. Use this
  whenever someone wants to document, re-document, or update the docs for an element
  in registry/ (e.g. "document the badge element", "update the docs for card",
  "the button props changed, refresh its docs", "write agent docs for tabs"). It
  authors registry/<name>/<name>.md from the actual component source, syncs the
  registry.json description, and regenerates the root AGENTS.md index + llms.txt.
  Reach for this even when the user just says "document this component" while looking
  at a file under registry/.
---

# Document an Element

This repo (`Instant Strata Elements`) is a UI library where every element lives in
`registry/<name>/` as owned source. Agents consuming this library read three things:

- `registry/<name>/<name>.tsx` — the component source (truth for **behaviour/API**)
- `registry/<name>/<name>.md` — agent docs (truth for **when/why/how + look**)
- `AGENTS.md` + `llms.txt` — the index agents scan to **find** the right element

Your job: produce or refresh a single element's `<name>.md` so it is accurate to the
*actual source*, then propagate the derived artifacts. The `.md` is the source of
truth — the `registry.json` description and the index are generated from it, never
hand-maintained in parallel.

## Workflow

### 1. Gather the truth from source
Read, for the target element `<name>`:
- `registry/<name>/<name>.tsx` — extract the real props, variants, sizes, exports,
  states, dependencies, and any sub-components. **Trust the code, not assumptions.**
- `registry/<name>/registry.json` — current description, `dependencies`,
  `registryDependencies`.
- `DESIGN.md` — find the element's section for brand/visual rules (colour, radius,
  spacing, do/don't). **If DESIGN.md disagrees with the source, the source wins** —
  document the code and add a short `> Note:` flagging the drift so it can be reconciled.

For strata-domain elements (`scheme`, `lot`, `owner`, `task`, `statement`, etc.),
also explain the *domain meaning* (what a lot/levy/R-A-S gate is), not just props —
an agent needs the business concept to use these correctly.

### 2. Write `registry/<name>/<name>.md`
Follow the template exactly: read [references/template.md](references/template.md).
Keep every section in the same order for every element — consistency is what makes
the docs machine-parseable. The frontmatter fields drive the index, so fill them all.

Key authoring rules:
- `use_when` (frontmatter): one tight line — this becomes the element's row in the index.
- The `> blockquote` under the H1 is the element's one-sentence purpose; it becomes
  the `registry.json` description, so write it to stand alone.
- **When to use / When NOT to use** is the most valuable part — it lets an agent
  *select* the element. Be concrete and point to the right alternative for the "not"
  cases (e.g. "for navigation use a link, not a Button"), linking via `[name](../name/name.md)`.
- The API table must match the source exactly (every prop, its type union, default).
- Prefer explaining *why* a rule exists over bare "ALWAYS/NEVER".

### 3. Sync the derived artifacts
Run the bundled script from the repo root:

```bash
python3 .claude/skills/document-element/scripts/sync_index.py
```

This scans every `registry/*/*.md`, then:
- updates each `registry/<name>/registry.json` `description` to match the `.md` purpose line,
- regenerates the index table in `AGENTS.md` (between the index markers),
- regenerates the root `llms.txt`.

It only rewrites files whose content actually changes, and prints what it touched.
Run it after editing any element's frontmatter or purpose line.

### 4. Verify
- Confirm the script reported the expected files.
- Re-read the new `<name>.md` for accuracy against the source.
- If the element has a docs-site page (`docs/src/app/(docs)/components/<name>/page.tsx`),
  mention to the user that the prose there can now be sourced from this `.md` (optional).

## Documenting several elements
If asked to document many (or "all") elements, do them one at a time through steps 1–2,
then run the sync script **once** at the end. Flag any DESIGN.md drift you find per element.

## Notes
- Categories are: `actions · inputs · data-display · feedback · layout · marketing · strata-domain`.
- Install URL base: `https://raw.githubusercontent.com/levi-putna/elements/main/registry/<name>/registry.json`.
- If `<name>.md` already exists, treat this as an update: preserve good hand-written
  prose, but reconcile the API table and frontmatter against the current source.
