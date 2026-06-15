"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { PropTable } from "@/components/docs/prop-table";

const INSTALL_CODE = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/button/registry.json`;

const USAGE_CODE = `import { Button } from "@/components/ui/button"

export function Example() {
  return <Button>Click me</Button>
}`;

const LOADING_CODE = `import { Button } from "@/components/ui/button"

export function Example() {
  return <Button loading>Saving...</Button>
}`;

const VARIANTS_CODE = `<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>`;

const PROPS = [
  {
    name: "variant",
    type: '"default" | "outline" | "secondary" | "ghost" | "destructive" | "link"',
    default: '"default"',
    description: "Controls the visual style of the button.",
  },
  {
    name: "size",
    type: '"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg"',
    default: '"default"',
    description: "Controls the size of the button.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description:
      "When true, shows a spinner and disables the button. The button label remains visible alongside the spinner.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the button. Also set automatically when loading is true.",
  },
];

export default function ButtonPage() {
  const [loading, setLoading] = useState(false);

  function simulateLoad() {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  }

  return (
    <div className="max-w-prose mx-auto px-8 py-14">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Base
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Button</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          Extends the{" "}
          <a
            href="https://ui.shadcn.com/docs/components/button"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            shadcn/ui Button
          </a>{" "}
          with a <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">loading</code> prop that shows a spinner and disables interaction while preserving the button label.
        </p>
      </div>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL_CODE} language="bash" />
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Usage
        </h2>
        <CodeBlock code={USAGE_CODE} language="tsx" />
      </section>

      {/* Examples */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Examples
        </h2>

        <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Variants</p>
            <ComponentPreview label="Preview">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="default">Default</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
              </div>
            </ComponentPreview>
            <div className="mt-3">
              <CodeBlock code={VARIANTS_CODE} language="tsx" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Loading state</p>
            <ComponentPreview label="Preview">
              <div className="flex items-center gap-3">
                <Button loading>Saving...</Button>
                <Button loading variant="outline">Loading</Button>
                <Button onClick={simulateLoad} loading={loading} variant="secondary">
                  {loading ? "Saving..." : "Click to simulate"}
                </Button>
              </div>
            </ComponentPreview>
            <div className="mt-3">
              <CodeBlock code={LOADING_CODE} language="tsx" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Sizes</p>
            <ComponentPreview label="Preview">
              <div className="flex flex-wrap items-end gap-3">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
              </div>
            </ComponentPreview>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Disabled</p>
            <ComponentPreview label="Preview">
              <div className="flex items-center gap-3">
                <Button disabled>Disabled</Button>
                <Button disabled variant="outline">Disabled</Button>
              </div>
            </ComponentPreview>
          </div>
        </div>
      </section>

      {/* Props */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Props
        </h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">
          All standard HTML button attributes are also accepted via <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">...props</code>.
        </p>
        <PropTable props={PROPS} />
      </section>

    </div>
  );
}
