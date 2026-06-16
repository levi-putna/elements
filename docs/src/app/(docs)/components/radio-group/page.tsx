import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/radio-group/registry.json`;

const BASIC_USAGE = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

<RadioGroup defaultValue="monthly">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="monthly" id="monthly" />
    <Label htmlFor="monthly">Monthly</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="quarterly" id="quarterly" />
    <Label htmlFor="quarterly">Quarterly</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="annual" id="annual" />
    <Label htmlFor="annual">Annual</Label>
  </div>
</RadioGroup>`;

const GROUP_PROPS = [
  { name: "value", type: "string", description: "Controlled selected value." },
  { name: "defaultValue", type: "string", description: "Uncontrolled initial value." },
  { name: "onValueChange", type: "(value: string) => void", description: "Fires when the selection changes." },
  { name: "disabled", type: "boolean", description: "Disables the whole group." },
];

const ITEM_PROPS = [
  { name: "value", type: "string", description: "The value this item represents (required)." },
  { name: "disabled", type: "boolean", description: "Disables this single item." },
];

export default function RadioGroupPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Components / Forms</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Radio Group</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A set of mutually exclusive options built on Base UI. Pair each item with a{" "}
          <a href="/components/label" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">Label</a>.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <ComponentPreview label="RadioGroup">
          <RadioGroup defaultValue="monthly">
            {[
              ["monthly", "Monthly"],
              ["quarterly", "Quarterly"],
              ["annual", "Annual"],
            ].map(([value, label]) => (
              <div key={value} className="flex items-center gap-2">
                <RadioGroupItem value={value} id={`rg-${value}`} />
                <Label htmlFor={`rg-${value}`}>{label}</Label>
              </div>
            ))}
          </RadioGroup>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={BASIC_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">RadioGroup props</h2>
        <PropTable props={GROUP_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">RadioGroupItem props</h2>
        <PropTable props={ITEM_PROPS} />
      </section>
    </DocsPage>
  );
}
