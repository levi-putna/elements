import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import { SearchIcon, DollarSignIcon } from "lucide-react";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/input-group/registry.json`;

const SEARCH_USAGE = `import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { SearchIcon } from "lucide-react"

<InputGroup>
  <InputGroupAddon>
    <SearchIcon />
  </InputGroupAddon>
  <InputGroupInput placeholder="Search lots…" />
</InputGroup>`;

const PREFIX_USAGE = `<InputGroup>
  <InputGroupAddon>
    <InputGroupText>$</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput placeholder="0.00" inputMode="decimal" />
  <InputGroupAddon align="inline-end">
    <InputGroupText>AUD</InputGroupText>
  </InputGroupAddon>
</InputGroup>`;

const BUTTON_USAGE = `<InputGroup>
  <InputGroupInput placeholder="Invite by email…" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton>Send</InputGroupButton>
  </InputGroupAddon>
</InputGroup>`;

const ADDON_PROPS = [
  { name: "align", type: '"inline-start" | "inline-end" | "block-start" | "block-end"', default: '"inline-start"', description: "Where the addon sits relative to the control." },
];

export default function InputGroupPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Components / Forms</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Input Group</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Compose an input with leading/trailing icons, text, or buttons inside a single bordered control.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Icon addon</h2>
        <ComponentPreview label="InputGroup · leading icon">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search lots…" />
          </InputGroup>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={SEARCH_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Prefix and suffix</h2>
        <ComponentPreview label="InputGroup · text addons">
          <InputGroup className="max-w-sm">
            <InputGroupAddon>
              <InputGroupText><DollarSignIcon className="size-4" /></InputGroupText>
            </InputGroupAddon>
            <InputGroupInput placeholder="0.00" inputMode="decimal" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>AUD</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={PREFIX_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">With a button</h2>
        <ComponentPreview label="InputGroup · trailing button">
          <InputGroup className="max-w-sm">
            <InputGroupInput placeholder="Invite by email…" />
            <InputGroupAddon align="inline-end">
              <InputGroupButton>Send</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={BUTTON_USAGE} language="tsx" /></div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">InputGroupAddon props</h2>
        <PropTable props={ADDON_PROPS} />
      </section>
    </DocsPage>
  );
}
