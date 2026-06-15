import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/checkbox/registry.json`;

const BASIC_USAGE = `import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

<div className="flex items-center gap-2">
  <Checkbox id="terms" defaultChecked />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>`;

const STATES_USAGE = `<Checkbox defaultChecked />
<Checkbox indeterminate />
<Checkbox disabled />
<Checkbox disabled defaultChecked />`;

const CHECKBOX_PROPS = [
  { name: "checked", type: "boolean", description: "Controlled checked state." },
  { name: "defaultChecked", type: "boolean", description: "Uncontrolled initial checked state." },
  { name: "indeterminate", type: "boolean", description: "Renders the mixed (dash) state." },
  { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Fires when the checked state changes." },
  { name: "disabled", type: "boolean", description: "Disables the checkbox." },
];

export default function CheckboxPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Components / Forms</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Checkbox</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A checkbox built on Base UI with checked, indeterminate, disabled, and invalid states.
          Pair it with a <a href="/components/label" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">Label</a>.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <ComponentPreview label="Checkbox + Label">
          <div className="flex items-center gap-2">
            <Checkbox id="terms" defaultChecked />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={BASIC_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">States</h2>
        <ComponentPreview label="checked · indeterminate · disabled">
          <div className="flex items-center gap-6">
            <Checkbox defaultChecked />
            <Checkbox indeterminate />
            <Checkbox disabled />
            <Checkbox disabled defaultChecked />
          </div>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={STATES_USAGE} language="tsx" /></div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Checkbox props</h2>
        <PropTable props={CHECKBOX_PROPS} />
      </section>
    </DocsPage>
  );
}
