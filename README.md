# Elements

A personal UI component library extending [shadcn/ui](https://ui.shadcn.com). Components are distributed as source code using the shadcn CLI — you copy them into your project and own them outright.

**Live docs:** https://levi-putna.github.io/elements

---

## Using components in your project

Components are added one at a time using the shadcn CLI. No package to install.

```bash
# Add the Button component
npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/button/registry.json
```

The CLI will copy the component source into `components/ui/` and install any required dependencies automatically.

### Prerequisites

Your target project must have shadcn initialised:

```bash
npx shadcn init
```

---

## Available components

| Component | Description | Install |
|---|---|---|
| `button` | shadcn Button extended with `loading` prop | `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/button/registry.json` |

---

## Development

### Setup

```bash
git clone https://github.com/levi-putna/elements
cd elements/docs
npm install
npm run dev
```

The docs site runs at `http://localhost:3000`. This is where you develop and preview components.

### Repository structure

```
elements/
├── registry/               # Source of truth for all components
│   ├── button/
│   │   ├── button.tsx      # Component source
│   │   └── registry.json   # shadcn registry manifest
│   └── utils/
│       ├── utils.ts
│       └── registry.json
├── docs/                   # Next.js documentation site
│   └── src/
│       ├── app/
│       │   ├── page.tsx                     # Homepage
│       │   └── components/
│       │       └── button/page.tsx           # Button docs page
│       └── components/
│           ├── ui/button.tsx                # Local copy (synced from registry)
│           └── docs/                        # Shared docs UI components
└── .github/workflows/deploy.yml            # Auto-deploy to GitHub Pages
```

---

## Adding a new component

### 1. Create the component source

```
registry/
└── my-component/
    ├── my-component.tsx    # The component
    └── registry.json       # Registry manifest
```

**`registry/my-component/registry.json`:**

```json
{
  "$schema": "https://ui.shadcn.com/schema/registry-item.json",
  "name": "my-component",
  "type": "registry:ui",
  "description": "What this component does.",
  "dependencies": ["some-npm-package"],
  "registryDependencies": ["utils"],
  "files": [
    {
      "path": "registry/my-component/my-component.tsx",
      "target": "components/ui/my-component.tsx",
      "type": "registry:ui"
    }
  ]
}
```

The `"files"` array maps source paths (in this repo) to target paths (in the user's project). The `"target"` field is where the file lands after `npx shadcn add`.

### 2. Copy the component into the docs site

```bash
cp registry/my-component/my-component.tsx docs/src/components/ui/my-component.tsx
```

The docs site uses its own local copy so you can develop and preview without publishing.

### 3. Create the docs page

Create `docs/src/app/components/my-component/page.tsx`. Use the Button page as a template — it shows the standard structure:

- Installation command
- Usage example with code block
- Live demos (variants, states, sizes)
- Props table

### 4. Add to the sidebar

Edit `docs/src/app/layout.tsx` and add a `<Link>` to the sidebar nav:

```tsx
<Link href="/components/my-component" className="rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors">
  My Component
</Link>
```

### 5. Add to the homepage grid

Edit `docs/src/app/page.tsx` and add a card to the components grid.

---

## Cloning a shadcn component to extend it

The recommended pattern for extending a shadcn component:

1. **Find the source** at [ui.shadcn.com](https://ui.shadcn.com) — the "View source" link on each component page shows the exact code.
2. **Copy it** into `registry/component-name/component-name.tsx`.
3. **Add your changes** (new props, variants, behaviour).
4. **Create `registry.json`** following the template above — make sure `"dependencies"` matches what the component imports.
5. **Follow steps 2–5** from "Adding a new component" above.

Your component completely replaces the shadcn version in any project that installs it, so name it identically (e.g. `button.tsx` targeting `components/ui/button.tsx`).

---

## Component documentation template

Each component doc page lives at `docs/src/app/components/[name]/page.tsx`.

Standard sections to include:

```
1. Header — name, brief description, link to shadcn source if it extends one
2. Installation — the npx shadcn add command
3. Usage — minimal import + usage code block
4. Examples — live previews with matching code blocks
   - All variants
   - All sizes
   - Any custom props (e.g. loading state)
   - Disabled state
5. Props table — name, type, default, description
```

Use the shared doc components from `@/components/docs/`:

- `<ComponentPreview>` — bordered preview box
- `<CodeBlock code="..." language="tsx">` — syntax-highlighted code with copy button
- `<PropTable props={[...]} />` — prop reference table

---

## Deploying docs

Docs deploy automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`.

To enable GitHub Pages on the repo:
1. Go to **Settings → Pages**
2. Set **Source** to **GitHub Actions**

The site will be available at `https://levi-putna.github.io/elements`.

---

## Keeping the docs site in sync

The `docs/src/components/ui/` folder is a local working copy. When you finalise a component, keep the registry and docs copies in sync:

```bash
# Registry → docs (after editing registry source)
cp registry/button/button.tsx docs/src/components/ui/button.tsx

# Docs → registry (after iterating in the docs dev server)
cp docs/src/components/ui/button.tsx registry/button/button.tsx
```
