import Link from "next/link";
import { DocsPage } from "@/components/docs/docs-page";

const foundationLinks = [
  {
    href: "/components/colours",
    label: "Colours & Accent",
    description: "Palette tokens, section backgrounds, and foreground rules.",
  },
  {
    href: "/components/typography",
    label: "Typography",
    description: "Young Serif, Inter, and the type scale for marketing and UI.",
  },
  {
    href: "/components/logo",
    label: "Logo",
    description: "The IS mark, lockups, and surface colour rules.",
  },
  {
    href: "/components/icons",
    label: "Icons",
    description: "Lucide stroke icons at consistent sizes and weights.",
  },
];

const components = [
  {
    href: "/components/badge",
    label: "Badge",
    description:
      "Shared badge primitive with semantic variants and domain badge catalogue.",
    badge: "Base",
  },
  {
    href: "/components/button",
    label: "Button",
    description: "Extends the shadcn/ui button with a loading state and spinner.",
    badge: "Base",
  },
  {
    href: "/components/prompt-input",
    label: "Prompt Input",
    description:
      "AI chat input with model selector, attachments, drag-and-drop, screenshot capture, and voice input.",
    badge: "AI",
  },
  {
    href: "/components/conversation",
    label: "Conversation",
    description:
      "Auto-scrolling message container with scroll-to-bottom button and markdown export.",
    badge: "AI",
  },
  {
    href: "/components/message",
    label: "Message",
    description:
      "Streaming markdown messages with code highlighting, math, mermaid, and custom entity tags.",
    badge: "AI",
  },
  {
    href: "/components/document",
    label: "Document",
    description:
      "File and folder element with list, thing, and wide layouts for document libraries.",
    badge: "Application",
  },
  {
    href: "/components/scheme",
    label: "Scheme",
    description:
      "Strata scheme identity: cards, context bar, badges, and portfolio layouts.",
    badge: "Application",
  },
  {
    href: "/components/lot",
    label: "Lot",
    description:
      "Strata lot identity: badges, roll lists, levy status, and proxy eligibility.",
    badge: "Application",
  },
  {
    href: "/components/owner",
    label: "Owner",
    description:
      "Registered proprietor identity: roll rows, profile cards, portal and lot holdings.",
    badge: "Application",
  },
  {
    href: "/components/task",
    label: "Task",
    description:
      "Manager task queue and work items with workflow states, R-A-S gates, and due dates.",
    badge: "Application",
  },
];

const paletteNarrative = [
  {
    name: "Forest",
    hex: "#043F2E",
    className: "bg-forest",
    textClass: "text-white",
    narrative:
      "Deep facade green: the colour of mature planting against heritage brick, powder-coated entry gates, and the steady presence of a well-run building.",
  },
  {
    name: "Forest mid",
    hex: "#0A5C3D",
    className: "bg-forest-mid",
    textClass: "text-white",
    narrative:
      "Mid-tone masonry and landscaped courtyards. Used inside dark sections where structure needs depth without losing clarity.",
  },
  {
    name: "Off-white",
    hex: "#EEF2E3",
    className: "bg-off-white",
    textClass: "text-ink",
    narrative:
      "Limestone render and sun-warmed plaster. A quiet shift between sections, like moving from a bright foyer into a softer corridor.",
  },
  {
    name: "Lime soft",
    hex: "#EBF8C2",
    className: "bg-lime-soft",
    textClass: "text-ink",
    narrative:
      "Morning light across interior walls. Accent bands and highlight cards that draw the eye without shouting.",
  },
  {
    name: "Lime",
    hex: "#C8F169",
    className: "bg-lime",
    textClass: "text-ink",
    narrative:
      "Fresh growth and wayfinding: the accent on a lift call panel or a well-placed sign. Energy and direction, never decoration for its own sake.",
  },
  {
    name: "White",
    hex: "#FFFFFF",
    className: "bg-white border border-border",
    textClass: "text-ink",
    narrative:
      "Clean architectural surfaces. Spacious lobbies and uncluttered dashboards where owners and managers can focus on the work.",
  },
];

const repositoryPillars = [
  {
    title: "Brand guidelines",
    body: "Colour, typography, logo usage, voice, and spacing rules that define how Instant Strata looks and reads across marketing and product.",
  },
  {
    title: "Patterns",
    body: "Composed layouts for marketing and application UI: heroes, feature rows, testimonials, sidebars, and section rhythm you can reuse page by page.",
  },
  {
    title: "Components",
    body: "Copy-paste React components built on shadcn/ui and ai-elements. Install what you need into your project and own the source.",
  },
];

const designDecisions = [
  {
    title: "White first, colour with purpose",
    body: "Most sections stay white or off-white. Forest and lime appear at deliberate moments: a hero opening, a testimonial, a CTA band. Colour signals transition, not wallpaper.",
  },
  {
    title: "Serif authority, sans-serif clarity",
    body: "Young Serif gives marketing headlines warmth and expertise. Inter handles UI, body copy, and dense application screens at scale. The split keeps marketing confident and product work efficient.",
  },
  {
    title: "Rectangular, precise forms",
    body: "Small border radii (4px on controls, 8px on cards) echo architectural lines: measured, professional, never playful pills. Whitespace does the heavy lifting.",
  },
  {
    title: "Plain language, trustworthy tone",
    body: "Copy is direct and free of legal jargon. The visual system supports that voice: calm layouts, readable type, and accents that guide rather than distract.",
  },
];

/**
 * Design system homepage: brand overview, palette narrative, and component index.
 */
export default function HomePage() {
  return (
    <DocsPage className="space-y-16">

      {/* Hero: what this repository is */}
      <header className="max-w-prose">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Instant Strata
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Components, patterns, and brand guidelines
        </h1>
        <p className="text-base text-ink-muted leading-relaxed mb-4">
          Elements is the design system repository for{" "}
          <strong className="font-semibold text-foreground">Instant Strata</strong>, a strata
          property management platform. This site documents the brand, the layout patterns
          used across marketing and product, and the UI components you can install into your
          own projects.
        </p>
        <p className="text-base text-ink-muted leading-relaxed">
          Use it as a single reference when designing screens, reviewing work, or prompting
          AI tools to build on-brand Instant Strata UI. Components extend{" "}
          <a
            href="https://ui.shadcn.com"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            shadcn/ui
          </a>{" "}
          and{" "}
          <a
            href="https://elements.ai-sdk.dev"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            ai-elements
          </a>
          , and ship as source code you copy and own.
        </p>
      </header>

      {/* Three pillars: guidelines, patterns, components */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          What you will find here
        </p>
        <h2 className="font-display text-2xl text-foreground mb-6 leading-tight">
          One repository, three layers
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {repositoryPillars.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-sm border border-border bg-white p-6"
            >
              <h3 className="font-sans text-sm font-semibold text-foreground mb-2">
                {pillar.title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">{pillar.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand overview */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Brand overview
        </p>
        <h2 className="font-display text-2xl text-foreground mb-4 leading-tight">
          Professional, trustworthy, efficient
        </h2>
        <div className="max-w-prose space-y-4 text-base text-ink-muted leading-relaxed">
          <p>
            Instant Strata sits in a regulated, relationship-driven industry. Owners entrust
            managers with their homes; committees need clarity on levies, maintenance, and
            compliance. The brand must feel capable and calm: confident without being cold,
            modern without chasing trends.
          </p>
          <p>
            This design system encodes those qualities in reusable tokens and components.
            Marketing pages use generous whitespace and serif headlines to signal expertise.
            Application screens stay legible and fast. AI-assisted workflows inherit the same
            visual language so the product feels like one coherent place.
          </p>
          <p>
            Both light and dark modes are supported. Light mode keeps white and off-white as
            the default canvas; dark mode maps the same forest and lime palette to a deep
            green shell for low-light reading and extended sessions. Semantic tokens carry
            across both themes, so components adapt without one-off overrides. Use the theme
            toggle in the site header to preview either version.
          </p>
        </div>
      </section>

      {/* Colour palette: building-inspired narrative */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Colour palette
        </p>
        <h2 className="font-display text-2xl text-foreground mb-4 leading-tight">
          Built from the materials strata managers know
        </h2>
        <p className="max-w-prose text-base text-ink-muted leading-relaxed mb-8">
          The palette is not arbitrary green. It is drawn from the surfaces and landscapes
          around apartment and commercial buildings: render and plaster, planted courtyards,
          powder-coated entry hardware, and the deep shadow under a mature tree line. Those
          references ground the product in the physical world strata teams work in every day,
          and they read as established rather than startup-bright. Forest anchors trust;
          off-white and white keep interfaces open and readable; lime marks the path forward
          without undermining professionalism.
        </p>

        {/* Palette swatches with narrative */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {paletteNarrative.map((colour) => (
            <div
              key={colour.name}
              className="rounded-sm border border-border overflow-hidden"
            >
              <div className={`px-5 py-6 ${colour.className}`}>
                <p className={`font-display text-xl ${colour.textClass}`}>{colour.name}</p>
                <p className={`font-mono text-xs mt-1 ${colour.textClass} opacity-80`}>
                  {colour.hex}
                </p>
              </div>
              <div className="px-5 py-4 bg-secondary border-t border-border">
                <p className="text-sm text-ink-muted leading-relaxed">{colour.narrative}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-ink-muted leading-relaxed">
          Full token reference, section backgrounds, and foreground rules are documented in{" "}
          <Link
            href="/components/colours"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Colours &amp; Accent
          </Link>
          .
        </p>
      </section>

      {/* Key design decisions */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Key decisions
        </p>
        <h2 className="font-display text-2xl text-foreground mb-6 leading-tight">
          How the system stays coherent
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {designDecisions.map((decision) => (
            <div
              key={decision.title}
              className="rounded-sm border border-border bg-off-white p-6"
            >
              <h3 className="font-sans text-sm font-semibold text-foreground mb-2">
                {decision.title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">{decision.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Foundation links */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Foundation
        </p>
        <div className="flex flex-col divide-y divide-border rounded-sm border border-border">
          {foundationLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start justify-between gap-6 px-4 py-4 hover:bg-secondary transition-colors duration-150"
            >
              <div className="min-w-0">
                <span className="text-sm font-semibold text-foreground group-hover:text-forest-mid transition-colors">
                  {item.label}
                </span>
                <p className="text-sm text-ink-muted leading-snug mt-0.5">{item.description}</p>
              </div>
              <svg
                className="size-4 text-ink-muted shrink-0 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* Installation */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </p>
        <h2 className="font-display text-2xl text-foreground mb-4 leading-tight">
          Add components to your project
        </h2>
        <div className="rounded-sm border border-border bg-off-white p-4">
          <p className="text-xs text-ink-muted font-mono mb-2">
            # Requires shadcn/ui to be initialised in your project
          </p>
          <p className="text-xs font-mono text-foreground leading-relaxed">
            npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/button/registry.json
          </p>
        </div>
        <p className="text-xs text-ink-muted mt-3 leading-relaxed max-w-prose">
          Each component installs independently. Replace{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground">
            button
          </code>{" "}
          with the component name you need.
        </p>
      </section>

      {/* Components index */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Components
        </p>
        <div className="flex flex-col divide-y divide-border">
          {components.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex items-start justify-between gap-6 py-4 hover:bg-secondary -mx-3 px-3 rounded-sm transition-colors duration-150"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground group-hover:text-forest-mid transition-colors">
                    {c.label}
                  </span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded-sm bg-lime text-ink leading-none">
                    {c.badge}
                  </span>
                </div>
                <p className="text-sm text-ink-muted leading-snug">{c.description}</p>
              </div>
              <svg
                className="size-4 text-ink-muted shrink-0 mt-0.5 transition-transform duration-150 group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
        <p className="text-sm text-ink-muted mt-4 leading-relaxed">
          Browse the sidebar for website blocks, application layout, and additional base
          components.
        </p>
      </section>

      {/* About */}
      <section className="rounded-sm border border-border bg-off-white p-6">
        <h2 className="font-sans text-sm font-semibold text-foreground mb-2">
          About this repository
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed mb-4 max-w-prose">
          The GitHub repository holds brand guidelines, documented patterns, and a shadcn
          registry of components. Components are copied into your project, not imported from
          a package, so you own the code and avoid version lock-in. This docs site is where
          everything is developed, previewed, and kept in sync with the registry.
        </p>
        <div className="flex items-center gap-4 text-xs">
          <a
            href="https://github.com/levi-putna/elements"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            View on GitHub →
          </a>
          <a
            href="https://ui.shadcn.com/docs"
            className="text-ink-muted underline underline-offset-4 hover:text-foreground transition-colors"
          >
            shadcn/ui docs →
          </a>
        </div>
      </section>

    </DocsPage>
  );
}
