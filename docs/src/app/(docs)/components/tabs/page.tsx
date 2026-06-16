import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Building2, FileText, Users } from "lucide-react";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/tabs/registry.json`;

const BASIC_USAGE = `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

<Tabs defaultValue="overview" className="w-full max-w-md">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="levies">Levies</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Building overview and key details.</TabsContent>
  <TabsContent value="levies">Levy notices and payment status.</TabsContent>
  <TabsContent value="documents">By-laws, minutes and reports.</TabsContent>
</Tabs>`;

const VERTICAL_USAGE = `{/* orientation="vertical" stacks the list down the side */}
<Tabs defaultValue="overview" orientation="vertical">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="levies">Levies</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Building overview and key details.</TabsContent>
  <TabsContent value="levies">Levy notices and payment status.</TabsContent>
  <TabsContent value="documents">By-laws, minutes and reports.</TabsContent>
</Tabs>`;

const DISABLED_USAGE = `{/* disabled tabs are dimmed and skipped by keyboard navigation */}
<Tabs defaultValue="overview" className="w-full max-w-md">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="levies">Levies</TabsTrigger>
    <TabsTrigger value="documents" disabled>Documents</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Building overview and key details.</TabsContent>
  <TabsContent value="levies">Levy notices and payment status.</TabsContent>
</Tabs>`;

const ICON_USAGE = `import { Building2, FileText, Users } from "lucide-react"

{/* drop an icon inside the trigger — it's sized automatically */}
<Tabs defaultValue="overview" className="w-full max-w-md">
  <TabsList>
    <TabsTrigger value="overview">
      <Building2 /> Overview
    </TabsTrigger>
    <TabsTrigger value="owners">
      <Users /> Owners
    </TabsTrigger>
    <TabsTrigger value="documents">
      <FileText /> Documents
    </TabsTrigger>
  </TabsList>
  <TabsContent value="overview">Building overview and key details.</TabsContent>
  <TabsContent value="owners">The owners corporation roll.</TabsContent>
  <TabsContent value="documents">By-laws, minutes and reports.</TabsContent>
</Tabs>`;

const TABS_PROPS = [
  { name: "defaultValue", type: "string | number", description: "Uncontrolled value of the tab that is initially active." },
  { name: "value", type: "string | number", description: "Controlled value of the active tab." },
  { name: "onValueChange", type: "(value, event) => void", description: "Fires when the active tab changes." },
  { name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Lays the tab list out as a row or a column." },
];

const TRIGGER_PROPS = [
  { name: "value", type: "string | number", description: "Identifies the tab; must match its TabsContent value." },
  { name: "disabled", type: "boolean", description: "Dims the tab and removes it from keyboard navigation." },
];

const PANEL_CONTENT = "text-sm text-ink-muted leading-relaxed";

export default function TabsPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Components / Base</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Tabs</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A set of layered sections of content — built on Base UI — where only one panel is
          visible at a time. Use them to group related views without leaving the page.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <ComponentPreview label="Horizontal tabs">
          <Tabs defaultValue="overview" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="levies">Levies</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className={PANEL_CONTENT}>Building overview and key details.</TabsContent>
            <TabsContent value="levies" className={PANEL_CONTENT}>Levy notices and payment status.</TabsContent>
            <TabsContent value="documents" className={PANEL_CONTENT}>By-laws, minutes and reports.</TabsContent>
          </Tabs>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={BASIC_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Vertical</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Set <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">orientation=&quot;vertical&quot;</code> to
          run the tab list down the side — handy for settings panes and wider layouts.
        </p>
        <ComponentPreview label="Vertical tabs">
          <Tabs defaultValue="overview" orientation="vertical">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="levies">Levies</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className={PANEL_CONTENT}>Building overview and key details.</TabsContent>
            <TabsContent value="levies" className={PANEL_CONTENT}>Levy notices and payment status.</TabsContent>
            <TabsContent value="documents" className={PANEL_CONTENT}>By-laws, minutes and reports.</TabsContent>
          </Tabs>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={VERTICAL_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Disabled</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Add <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">disabled</code> to a trigger to
          dim it and skip it during keyboard navigation.
        </p>
        <ComponentPreview label="Disabled tab">
          <Tabs defaultValue="overview" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="levies">Levies</TabsTrigger>
              <TabsTrigger value="documents" disabled>Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className={PANEL_CONTENT}>Building overview and key details.</TabsContent>
            <TabsContent value="levies" className={PANEL_CONTENT}>Levy notices and payment status.</TabsContent>
          </Tabs>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={DISABLED_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Icons</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Place a <a href="/components/icons" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">Lucide</a> icon
          inside a trigger; it inherits the label colour and is sized to match the text.
        </p>
        <ComponentPreview label="Tabs with icons">
          <Tabs defaultValue="overview" className="w-full max-w-md">
            <TabsList>
              <TabsTrigger value="overview"><Building2 /> Overview</TabsTrigger>
              <TabsTrigger value="owners"><Users /> Owners</TabsTrigger>
              <TabsTrigger value="documents"><FileText /> Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className={PANEL_CONTENT}>Building overview and key details.</TabsContent>
            <TabsContent value="owners" className={PANEL_CONTENT}>The owners corporation roll.</TabsContent>
            <TabsContent value="documents" className={PANEL_CONTENT}>By-laws, minutes and reports.</TabsContent>
          </Tabs>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={ICON_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Tabs props</h2>
        <PropTable props={TABS_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">TabsTrigger props</h2>
        <PropTable props={TRIGGER_PROPS} />
      </section>
    </DocsPage>
  );
}
