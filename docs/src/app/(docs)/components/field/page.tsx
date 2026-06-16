import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/field/registry.json`;

const BASIC_USAGE = `import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field>
  <FieldLabel>Email</FieldLabel>
  <Input type="email" placeholder="you@example.com" />
  <FieldDescription>We'll never share your email.</FieldDescription>
</Field>`;

const REQUIRED_USAGE = `<Field>
  {/* required bolds the label and adds a destructive asterisk */}
  <FieldLabel required>Full name</FieldLabel>
  <Input placeholder="Jane Doe" required />
</Field>`;

const HINT_USAGE = `<Field>
  {/* hint renders a blue question icon to the right of the label.
      Clicking it opens a popover. When required, the popover shows
      a "Required" note so the label and hint stay in sync. */}
  <FieldLabel
    required
    hint={
      <>
        Use the legal entity name exactly as it appears on your strata roll.
      </>
    }
  >
    Owners corporation
  </FieldLabel>
  <Input placeholder="SP 12345, Harbourview" required />
</Field>`;

const FIELDSET_USAGE = `import { FieldSet, FieldLegend, FieldGroup, Field, FieldLabel } from "@/components/ui/field"

<FieldSet>
  {/* Hints are optional on a fieldset legend too */}
  <FieldLegend hint="Used for levy notices and owner correspondence.">
    Billing contact
  </FieldLegend>
  <FieldGroup>
    <Field>
      <FieldLabel required>Contact name</FieldLabel>
      <Input placeholder="Jane Doe" required />
    </Field>
    <Field>
      <FieldLabel>Reference</FieldLabel>
      <Input placeholder="Optional" />
    </Field>
  </FieldGroup>
</FieldSet>`;

const FIELD_PROPS = [
  { name: "name", type: "string", description: "Field name, wired to Base UI's Field/Form context for validation." },
  { name: "disabled", type: "boolean", description: "Disables the field and its control." },
];

const LABEL_PROPS = [
  { name: "required", type: "boolean", default: "false", description: "Bolds the label and appends a destructive asterisk." },
  { name: "hint", type: "ReactNode", description: "When set, renders a blue Hint icon to the right; clicking opens a popover. Inherits the label's required state." },
];

const LEGEND_PROPS = [
  { name: "hint", type: "ReactNode", description: "Optional Hint popover beside the legend. Hints are optional on a fieldset." },
];

/**
 * Field documentation: the foundation that proves the Field / Label / Hint /
 * required pattern used across the Forms section.
 */
export default function FieldPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Forms
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Field</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          The wrapper that ties a label, control, description, and error together. Built on Base UI&apos;s
          Field primitive. Labels support a <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">required</code>{" "}
          flag (bold + asterisk) and an optional <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">hint</code>: a blue question icon that opens a popover for extra detail.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
        <p className="text-xs text-ink-muted mt-2">
          Also installs <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">label</code>,{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">hint</code>, and{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">popover</code> dependencies.
        </p>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Basic field</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A label, an input, and a description stacked together.
        </p>
        <ComponentPreview label="Field · label + input + description">
          <Field className="w-full max-w-sm">
            <FieldLabel>Email</FieldLabel>
            <Input type="email" placeholder="you@example.com" />
            <FieldDescription>We&apos;ll never share your email.</FieldDescription>
          </Field>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={BASIC_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Required</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          The <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">required</code> prop bolds the
          label and appends a destructive asterisk.
        </p>
        <ComponentPreview label="FieldLabel · required">
          <Field className="w-full max-w-sm">
            <FieldLabel required>Full name</FieldLabel>
            <Input placeholder="Jane Doe" required />
          </Field>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={REQUIRED_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Label hint</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Pass a <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">hint</code> to add a blue
          question icon to the right of the label. Click it to open a popover. When the field is required,
          the popover shows a &ldquo;Required&rdquo; note.
        </p>
        <ComponentPreview label="FieldLabel · hint (click the blue icon)">
          <Field className="w-full max-w-sm">
            <FieldLabel
              required
              hint="Use the legal entity name exactly as it appears on your strata roll."
            >
              Owners corporation
            </FieldLabel>
            <Input placeholder="SP 12345, Harbourview" required />
          </Field>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={HINT_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Fieldset</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Group related fields with a legend. The legend takes an optional hint too; hints are optional
          everywhere they appear.
        </p>
        <ComponentPreview label="FieldSet · legend with hint + grouped fields">
          <FieldSet className="w-full max-w-sm">
            <FieldLegend hint="Used for levy notices and owner correspondence.">
              Billing contact
            </FieldLegend>
            <FieldGroup>
              <Field>
                <FieldLabel required>Contact name</FieldLabel>
                <Input placeholder="Jane Doe" required />
              </Field>
              <Field>
                <FieldLabel>Reference</FieldLabel>
                <Input placeholder="Optional" />
              </Field>
            </FieldGroup>
          </FieldSet>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={FIELDSET_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Field props</h2>
        <PropTable props={FIELD_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">FieldLabel props</h2>
        <PropTable props={LABEL_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">FieldLegend props</h2>
        <PropTable props={LEGEND_PROPS} />
      </section>
    </DocsPage>
  );
}
