import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/label/registry.json`;

const BASIC_USAGE = `import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />`;

const REQUIRED_USAGE = `{/* required bolds the text and adds a destructive asterisk */}
<Label htmlFor="name" required>Full name</Label>
<Input id="name" required />`;

const HINT_USAGE = `{/* hint adds a blue question icon that opens a popover.
    required is passed through so the popover shows a "Required" note. */}
<Label
  htmlFor="abn"
  required
  hint="Your 11-digit Australian Business Number, no spaces."
>
  ABN
</Label>
<Input id="abn" required />`;

const LABEL_PROPS = [
  { name: "required", type: "boolean", default: "false", description: "Bolds the label and appends a destructive asterisk." },
  { name: "hint", type: "ReactNode", description: "When set, renders a blue Hint icon to the right; clicking opens a popover. Inherits the label's required state." },
  { name: "htmlFor", type: "string", description: "Associates the label with a control by id (standard label attribute)." },
];

/**
 * Label documentation — standalone label with required + Hint support.
 */
export default function LabelPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Forms
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Label</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A form label with a <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">required</code>{" "}
          flag (bold + destructive asterisk) and an optional{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">hint</code> popover. Use it standalone;
          inside a <a href="/components/field" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">Field</a> prefer FieldLabel.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <ComponentPreview label="Label">
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="email-basic">Email</Label>
            <Input id="email-basic" type="email" placeholder="you@example.com" />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={BASIC_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Required</h2>
        <ComponentPreview label="Label · required">
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="name-req" required>Full name</Label>
            <Input id="name-req" placeholder="Jane Doe" required />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={REQUIRED_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">With hint</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Click the blue question icon to open the popover. When required, the popover shows a
          &ldquo;Required&rdquo; note.
        </p>
        <ComponentPreview label="Label · required + hint">
          <div className="w-full max-w-sm space-y-1.5">
            <Label htmlFor="abn" required hint="Your 11-digit Australian Business Number, no spaces.">
              ABN
            </Label>
            <Input id="abn" placeholder="12 345 678 901" required />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={HINT_USAGE} language="tsx" />
        </div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Label props</h2>
        <PropTable props={LABEL_PROPS} />
      </section>
    </DocsPage>
  );
}
