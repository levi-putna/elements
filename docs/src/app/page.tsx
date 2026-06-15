import Link from "next/link";

export default function HomePage() {
  return (
    <div className="px-12 py-16 max-w-2xl">
      <h1 className="text-3xl font-semibold tracking-tight mb-3">Elements</h1>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        A personal UI component library extending{" "}
        <a
          href="https://ui.shadcn.com"
          className="underline underline-offset-4 hover:text-foreground"
        >
          shadcn/ui
        </a>
        . Components are distributed as source code — copy them directly into your project.
      </p>

      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Installation
      </h2>
      <div className="rounded-lg border border-border bg-muted/50 p-4 font-mono text-sm mb-8">
        <p className="text-muted-foreground mb-1"># Add a component to your project</p>
        <p>
          npx shadcn add
          https://raw.githubusercontent.com/levi-putna/elements/main/registry/button/registry.json
        </p>
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Components
      </h2>
      <div className="grid grid-cols-2 gap-3">
        <Link
          href="/components/button"
          className="rounded-lg border border-border p-4 hover:bg-muted transition-colors"
        >
          <p className="font-medium text-sm mb-1">Button</p>
          <p className="text-xs text-muted-foreground">
            Extended shadcn button with loading state.
          </p>
        </Link>
      </div>
    </div>
  );
}
