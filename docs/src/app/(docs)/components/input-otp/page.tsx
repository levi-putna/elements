import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { InputOTP } from "@/components/ui/input-otp";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/input-otp/registry.json`;

const BASIC_USAGE = `import { InputOTP } from "@/components/ui/input-otp"

<InputOTP length={6} />`;

const GROUPED_USAGE = `{/* split into two groups of 3 with a separator between */}
<InputOTP length={6} groupSizes={[3, 3]} />`;

const OTP_PROPS = [
  { name: "length", type: "number", default: "6", description: "Number of character slots." },
  { name: "groupSizes", type: "number[]", description: "Splits slots into groups separated by a dash, e.g. [3, 3]." },
  { name: "value", type: "string", description: "Controlled value." },
  { name: "onValueChange", type: "(value: string) => void", description: "Fires as the code is entered." },
];

export default function InputOTPPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">Components / Forms</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Input OTP</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A one-time-password input built on Base UI&apos;s OTP Field. Renders a row of single-character
          slots, optionally split into groups.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic</h2>
        <ComponentPreview label="InputOTP · 6 slots">
          <InputOTP length={6} />
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={BASIC_USAGE} language="tsx" /></div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Grouped</h2>
        <ComponentPreview label="InputOTP · 3 + 3 with separator">
          <InputOTP length={6} groupSizes={[3, 3]} />
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={GROUPED_USAGE} language="tsx" /></div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">InputOTP props</h2>
        <PropTable props={OTP_PROPS} />
      </section>
    </DocsPage>
  );
}
