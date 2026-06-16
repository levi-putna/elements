import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InfoIcon } from "lucide-react";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/select/registry.json`;

const BUILDINGS = [
  { value: "harbourview", label: "Harbourview" },
  { value: "parkside", label: "Parkside" },
  { value: "the-quay", label: "The Quay" },
];

// For grouped selects, pass the flattened items so the trigger can resolve labels
const ROLES = [
  { value: "chair", label: "Chairperson" },
  { value: "secretary", label: "Secretary" },
  { value: "owner", label: "Lot owner" },
  { value: "tenant", label: "Tenant" },
];

const BASIC_USAGE = `import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

const buildings = [
  { value: "harbourview", label: "Harbourview" },
  { value: "parkside", label: "Parkside" },
  { value: "the-quay", label: "The Quay" },
]

{/* Pass \`items\` so the trigger shows the LABEL, not the value key */}
<Select items={buildings}>
  <SelectTrigger className="w-56">
    <SelectValue placeholder="Select a building" />
  </SelectTrigger>
  <SelectContent>
    {buildings.map((b) => (
      <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
    ))}
  </SelectContent>
</Select>`;

const GROUPED_USAGE = `{/* Pass the flattened roles as items so the label resolves */}
<Select items={roles}>
  <SelectTrigger className="w-56">
    <SelectValue placeholder="Select a role" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Committee</SelectLabel>
      <SelectItem value="chair">Chairperson</SelectItem>
      <SelectItem value="secretary">Secretary</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Owners</SelectLabel>
      <SelectItem value="owner">Lot owner</SelectItem>
      <SelectItem value="tenant">Tenant</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`;

const TRIGGER_PROPS = [
  { name: "size", type: '"sm" | "default"', default: '"default"', description: "Trigger height." },
  { name: "disabled", type: "boolean", description: "Disables the select." },
];

export default function SelectPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Components / Forms</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Select</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A select menu built on Base UI with a positioned popup, groups, labels, and separators.
        </p>
      </div>

      <div className="mb-2 flex gap-3 rounded-sm border border-info/30 bg-info-soft px-4 py-3">
        <InfoIcon className="mt-0.5 size-4 shrink-0 text-info" />
        <p className="text-sm text-foreground leading-relaxed">
          <span className="font-semibold">Always show the label, not the value.</span> Base UI&apos;s{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">SelectValue</code> renders the raw
          value key unless you pass an <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">items</code>{" "}
          array (or record) of <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">{`{ value, label }`}</code>{" "}
          to <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">{`<Select>`}</code>. With{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">items</code> set, the trigger shows
          &ldquo;Harbourview&rdquo; instead of <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">harbourview</code>.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <ComponentPreview label="Select · trigger shows the label">
          <Select items={BUILDINGS}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select a building" />
            </SelectTrigger>
            <SelectContent>
              {BUILDINGS.map((b) => (
                <SelectItem key={b.value} value={b.value}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={BASIC_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Grouped</h2>
        <ComponentPreview label="Select · groups + separator">
          <Select items={ROLES}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Committee</SelectLabel>
                <SelectItem value="chair">Chairperson</SelectItem>
                <SelectItem value="secretary">Secretary</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Owners</SelectLabel>
                <SelectItem value="owner">Lot owner</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={GROUPED_USAGE} language="tsx" /></div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">SelectTrigger props</h2>
        <PropTable props={TRIGGER_PROPS} />
      </section>
    </DocsPage>
  );
}
