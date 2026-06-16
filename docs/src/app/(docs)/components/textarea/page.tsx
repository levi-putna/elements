import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/textarea/registry.json`;

const BASIC_USAGE = `import { Textarea } from "@/components/ui/textarea"

<Textarea placeholder="Add a note for the committee…" />`;

const FIELD_USAGE = `import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"

<Field>
  <FieldLabel hint="Visible to all committee members.">Meeting notes</FieldLabel>
  <Textarea placeholder="Add a note…" />
  <FieldDescription>Markdown is supported.</FieldDescription>
</Field>`;

const TEXTAREA_PROPS = [
  { name: "disabled", type: "boolean", description: "Dims the textarea and blocks interaction." },
  { name: "aria-invalid", type: "boolean", description: "Applies the destructive border and ring for error states." },
  { name: "rows", type: "number", description: "Initial visible rows (auto-grows with field-sizing)." },
];

export default function TextareaPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Components / Forms</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Textarea</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A multi-line text input that auto-grows with its content. Pair it with a{" "}
          <a href="/components/field" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">Field</a> for labels and errors.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <ComponentPreview label="Textarea">
          <Textarea placeholder="Add a note for the committee…" className="max-w-sm" />
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={BASIC_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">In a field</h2>
        <ComponentPreview label="Field + Textarea">
          <Field className="w-full max-w-sm">
            <FieldLabel hint="Visible to all committee members.">Meeting notes</FieldLabel>
            <Textarea placeholder="Add a note…" />
            <FieldDescription>Markdown is supported.</FieldDescription>
          </Field>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={FIELD_USAGE} language="tsx" /></div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Textarea props</h2>
        <PropTable props={TEXTAREA_PROPS} />
      </section>
    </DocsPage>
  );
}
