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
    <div className="px-12 py-10 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Components
          </p>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Button</h1>
        <p className="text-muted-foreground leading-relaxed">
          Extends the{" "}
          <a
            href="https://ui.shadcn.com/docs/components/button"
            className="underline underline-offset-4 hover:text-foreground"
          >
            shadcn/ui Button
          </a>{" "}
          with a <code className="font-mono text-sm">loading</code> prop that shows a spinner and
          disables interaction.
        </p>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Installation</h2>
        <CodeBlock code={INSTALL_CODE} language="bash" />
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-3">Usage</h2>
        <CodeBlock code={USAGE_CODE} language="tsx" />
      </section>

      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">Examples</h2>

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Variants</h3>
          <ComponentPreview>
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

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Loading state</h3>
          <ComponentPreview>
            <div className="flex items-center gap-3">
              <Button loading>Saving...</Button>
              <Button loading variant="outline">
                Loading
              </Button>
              <Button onClick={simulateLoad} loading={loading} variant="secondary">
                {loading ? "Saving..." : "Click to simulate"}
              </Button>
            </div>
          </ComponentPreview>
          <div className="mt-3">
            <CodeBlock code={LOADING_CODE} language="tsx" />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium mb-3">Sizes</h3>
          <ComponentPreview>
            <div className="flex flex-wrap items-end gap-3">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </ComponentPreview>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Disabled</h3>
          <ComponentPreview>
            <div className="flex items-center gap-3">
              <Button disabled>Disabled</Button>
              <Button disabled variant="outline">
                Disabled
              </Button>
            </div>
          </ComponentPreview>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">Props</h2>
        <p className="text-sm text-muted-foreground mb-4">
          All standard HTML button attributes are also accepted.
        </p>
        <PropTable props={PROPS} />
      </section>
    </div>
  );
}
