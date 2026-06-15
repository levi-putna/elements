import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Hint } from "@/components/ui/hint";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/hint/registry.json`;

const BASIC_USAGE = `import { Hint } from "@/components/ui/hint"

<div className="flex items-center gap-1.5">
  <span className="text-sm font-medium">Tax file number</span>
  <Hint>Optional. We use it only for end-of-year statements.</Hint>
</div>`;

const TITLE_USAGE = `<Hint title="Owners corporation" required>
  Use the legal entity name exactly as it appears on your strata roll.
</Hint>`;

const HINT_PROPS = [
  { name: "title", type: "ReactNode", description: "Optional heading shown at the top of the popover." },
  { name: "required", type: "boolean", default: "false", description: 'Surfaces a "Required" note in the popover header, keeping it in sync with a required label.' },
  { name: "label", type: "string", default: '"More info"', description: "Accessible label for the trigger button." },
  { name: "children", type: "ReactNode", description: "Popover body content." },
];

/**
 * Hint documentation — the blue question-icon popover used beside labels.
 */
export default function HintPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Forms
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Hint</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A small blue question icon that reveals supporting detail in a popover. Optional everywhere it
          appears — drop it beside a{" "}
          <a href="/components/label" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">Label</a>{" "}
          or a Field/Fieldset legend. The{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">required</code> flag adds a
          &ldquo;Required&rdquo; note so the hint stays in sync with a required label.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
        <p className="text-xs text-ink-muted mt-2">
          Also installs the <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">popover</code> dependency.
        </p>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Click the blue icon to open the popover.
        </p>
        <ComponentPreview label="Hint">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-foreground">Tax file number</span>
            <Hint>Optional. We use it only for end-of-year statements.</Hint>
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={BASIC_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Title and required</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Add a title and the required note for fields that must be filled in.
        </p>
        <ComponentPreview label="Hint · title + required">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-foreground">
              Owners corporation <span className="text-destructive">*</span>
            </span>
            <Hint title="Owners corporation" required>
              Use the legal entity name exactly as it appears on your strata roll.
            </Hint>
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={TITLE_USAGE} language="tsx" />
        </div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Hint props</h2>
        <PropTable props={HINT_PROPS} />
      </section>
    </DocsPage>
  );
}
