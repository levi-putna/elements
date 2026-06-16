import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/switch/registry.json`;

const BASIC_USAGE = `import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

<div className="flex items-center gap-2">
  <Switch id="notifications" defaultChecked />
  <Label htmlFor="notifications">Email notifications</Label>
</div>`;

const STATES_USAGE = `<Switch />
<Switch defaultChecked />
{/* disabled switches are dimmed and the thumb is greyed */}
<Switch disabled />
<Switch disabled defaultChecked />`;

const VARIANT_USAGE = `{/* destructive turns the active track red for dangerous toggles */}
<Switch variant="destructive" defaultChecked />`;

const SWITCH_PROPS = [
  { name: "variant", type: '"default" | "destructive"', default: '"default"', description: "Active-track colour. default = lime; destructive = red, for dangerous toggles." },
  { name: "checked", type: "boolean", description: "Controlled checked state." },
  { name: "defaultChecked", type: "boolean", description: "Uncontrolled initial checked state." },
  { name: "onCheckedChange", type: "(checked: boolean) => void", description: "Fires when the checked state changes." },
  { name: "disabled", type: "boolean", description: "Disables the switch; it dims and the thumb greys out." },
];

export default function SwitchPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Components / Forms</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Switch</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A toggle switch built on Base UI for on/off settings. Pair it with a{" "}
          <a href="/components/label" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">Label</a>.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <ComponentPreview label="Switch + Label">
          <div className="flex items-center gap-2">
            <Switch id="notifications" defaultChecked />
            <Label htmlFor="notifications">Email notifications</Label>
          </div>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={BASIC_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">States</h2>
        <ComponentPreview label="off · on · disabled">
          <div className="flex items-center gap-6">
            <Switch />
            <Switch defaultChecked />
            <Switch disabled />
            <Switch disabled defaultChecked />
          </div>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={STATES_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Variants</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Use <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">variant=&quot;destructive&quot;</code> for a
          dangerous toggle — the active track turns red instead of lime.
        </p>
        <ComponentPreview label="default · destructive">
          <div className="flex items-center gap-6">
            <Switch defaultChecked />
            <Switch variant="destructive" defaultChecked />
          </div>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={VARIANT_USAGE} language="tsx" /></div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Switch props</h2>
        <PropTable props={SWITCH_PROPS} />
      </section>
    </DocsPage>
  );
}
