import Link from "next/link";

const components = [
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
];

export default function HomePage() {
  return (
    <div className="max-w-prose mx-auto px-8 py-14">

      {/* Page header */}
      <div className="mb-12">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Instant Strata
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
          Elements
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-lg">
          A personal UI component library built on top of{" "}
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
          . Components are distributed as source code — copy them into your project and own them.
        </p>
      </div>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <div className="rounded-sm border border-border bg-off-white p-4">
          <p className="text-xs text-ink-muted font-mono mb-2"># Requires shadcn/ui to be initialised in your project</p>
          <p className="text-xs font-mono text-foreground leading-relaxed">
            npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/button/registry.json
          </p>
        </div>
        <p className="text-xs text-ink-muted mt-3 leading-relaxed">
          Each component is installed independently. Replace <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground">button</code> with the component name you need.
        </p>
      </section>

      {/* Components */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Components
        </h2>
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
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="rounded-sm border border-border bg-off-white p-6">
        <h2 className="text-sm font-semibold text-foreground mb-2">About this library</h2>
        <p className="text-sm text-ink-muted leading-relaxed mb-4">
          Components are copied into your project — not imported from a package. This means you own
          the code, can modify it freely, and there are no version lock-in issues.
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

    </div>
  );
}
