"use client";

import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/combobox/registry.json`;

const USAGE = `import {
  Combobox, ComboboxInput, ComboboxContent, ComboboxList, ComboboxItem, ComboboxEmpty,
} from "@/components/ui/combobox"

const buildings = [
  { value: "harbourview", label: "Harbourview" },
  { value: "parkside", label: "Parkside" },
  { value: "the-quay", label: "The Quay" },
]

<Combobox items={buildings}>
  <ComboboxInput placeholder="Search buildings…" className="w-64" />
  <ComboboxContent>
    <ComboboxEmpty>No building found.</ComboboxEmpty>
    <ComboboxList>
      {(item) => (
        <ComboboxItem key={item.value} value={item}>
          {item.label}
        </ComboboxItem>
      )}
    </ComboboxList>
  </ComboboxContent>
</Combobox>`;

const BUILDINGS = [
  { value: "harbourview", label: "Harbourview" },
  { value: "parkside", label: "Parkside" },
  { value: "the-quay", label: "The Quay" },
  { value: "marina-heights", label: "Marina Heights" },
  { value: "garden-court", label: "Garden Court" },
];

const ROOT_PROPS = [
  { name: "items", type: "T[]", description: "The full list of selectable items; Base UI filters them against the input value." },
  { name: "value", type: "T | null", description: "Controlled selected value." },
  { name: "onValueChange", type: "(value: T | null) => void", description: "Fires when the selection changes." },
  { name: "multiple", type: "boolean", default: "false", description: "Allow selecting more than one item." },
];

export default function ComboboxPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Components / Forms</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Combobox</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          An autocomplete input built on Base UI: type to filter a list, then pick a value. Built-in
          filtering, keyboard navigation, and an empty state.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Start typing to filter the buildings.
        </p>
        <ComponentPreview label="Combobox · autocomplete">
          <Combobox items={BUILDINGS}>
            <ComboboxInput placeholder="Search buildings…" className="w-64" />
            <ComboboxContent>
              <ComboboxEmpty>No building found.</ComboboxEmpty>
              <ComboboxList>
                {(item: { value: string; label: string }) => (
                  <ComboboxItem key={item.value} value={item}>
                    {item.label}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={USAGE} language="tsx" /></div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Combobox props</h2>
        <PropTable props={ROOT_PROPS} />
      </section>
    </DocsPage>
  );
}
