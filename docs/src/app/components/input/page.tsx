import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Input } from "@/components/ui/input";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/input/registry.json`;

const BASIC_USAGE = `import { Input } from "@/components/ui/input"

<Input type="email" placeholder="you@example.com" />`;

const STATES_USAGE = `<Input placeholder="Default" />
<Input placeholder="Disabled" disabled />
<Input placeholder="Invalid" aria-invalid />`;

const INPUT_PROPS = [
  { name: "type", type: "string", default: '"text"', description: "Native input type (text, email, password, number, …)." },
  { name: "disabled", type: "boolean", description: "Dims the input and blocks interaction." },
  { name: "aria-invalid", type: "boolean", description: "Applies the destructive border and ring for error states." },
];

/**
 * Input documentation.
 */
export default function InputPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Forms
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Input</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A text input built on Base UI with focus, disabled, and invalid states. Pair it with a{" "}
          <a href="/components/field" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">Field</a>{" "}
          for labels, descriptions, and errors.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <ComponentPreview label="Input">
          <Input type="email" placeholder="you@example.com" className="max-w-sm" />
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={BASIC_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">States</h2>
        <ComponentPreview label="Input · default · disabled · invalid">
          <div className="w-full max-w-sm space-y-3">
            <Input placeholder="Default" />
            <Input placeholder="Disabled" disabled />
            <Input placeholder="Invalid" aria-invalid />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={STATES_USAGE} language="tsx" />
        </div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Input props</h2>
        <PropTable props={INPUT_PROPS} />
      </section>
    </DocsPage>
  );
}
