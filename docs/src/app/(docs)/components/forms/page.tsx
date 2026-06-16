import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BuildingIcon, InfoIcon, ShieldCheckIcon } from "lucide-react";

const STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];

const TWO_COL_CODE = `{/* Two equal columns; full-width fields span both */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
  <Field>
    <FieldLabel required>First name</FieldLabel>
    <Input required />
  </Field>
  <Field>
    <FieldLabel required>Last name</FieldLabel>
    <Input required />
  </Field>
  <Field className="sm:col-span-2">
    <FieldLabel required>Email</FieldLabel>
    <Input type="email" required />
  </Field>
</div>`;

const COMBO_CODE = `{/* Combination: full-width, then 3-up, then 2-up rows */}
<div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
  <Field className="sm:col-span-6">
    <FieldLabel required hint="The legal entity name on your strata roll.">
      Owners corporation
    </FieldLabel>
    <Input required />
  </Field>
  <Field className="sm:col-span-3">
    <FieldLabel>Street address</FieldLabel>
    <Input />
  </Field>
  <Field className="sm:col-span-2">
    <FieldLabel>Suburb</FieldLabel>
    <Input />
  </Field>
  <Field className="sm:col-span-1">
    <FieldLabel>State</FieldLabel>
    {/* Select … */}
  </Field>
</div>`;

const DIALOG_WIDE_CODE = `{/* Wider dialog: form column + info/meta column */}
<DialogContent className="sm:max-w-3xl">
  <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_17rem]">
    <div className="flex flex-col gap-4">
      {/* …form fields… */}
    </div>
    <aside className="rounded-sm bg-muted/40 p-4 ring-1 ring-border">
      {/* …info & meta… */}
    </aside>
  </div>
</DialogContent>`;

const STATE_ITEMS = STATES.map((s) => ({ value: s.toLowerCase(), label: s }));

const ROLE_ITEMS = [
  { value: "owner", label: "Lot owner" },
  { value: "committee", label: "Committee member" },
  { value: "manager", label: "Strata manager" },
];

function StateSelect() {
  return (
    // items lets the trigger render the label (e.g. "NSW"), not the value key
    <Select items={STATE_ITEMS}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="State" />
      </SelectTrigger>
      <SelectContent>
        {STATE_ITEMS.map((s) => (
          <SelectItem key={s.value} value={s.value}>
            {s.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default function FormsPage() {
  return (
    <DocsPage>
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Forms
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Form Layouts</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Composition patterns for real forms: two-column grids, mixed column rows, and forms inside
          dialogs (including a wider dialog that pairs the form with an info &amp; meta column). Built from{" "}
          <a href="/components/field" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">Field</a>,{" "}
          the form controls, and{" "}
          <a href="/components/dialog" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors">Dialog</a>.
        </p>
      </div>

      {/* Two column */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Two-column layout</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A responsive two-column grid. Fields stack on mobile and split into two columns from{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">sm</code> up. Full-width fields use{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">sm:col-span-2</code>.
        </p>
        <ComponentPreview label="Contact details · 2 columns">
          <form className="w-full max-w-xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel required>First name</FieldLabel>
                <Input placeholder="Jane" required />
              </Field>
              <Field>
                <FieldLabel required>Last name</FieldLabel>
                <Input placeholder="Doe" required />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel required>Email</FieldLabel>
                <Input type="email" placeholder="jane@example.com" required />
              </Field>
              <Field>
                <FieldLabel>Phone</FieldLabel>
                <Input type="tel" placeholder="0400 000 000" />
              </Field>
              <Field>
                <FieldLabel hint="Used to route levy notices.">Role</FieldLabel>
                <Select items={ROLE_ITEMS}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_ITEMS.map((r) => (
                      <SelectItem key={r.value} value={r.value}>
                        {r.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </form>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={TWO_COL_CODE} language="tsx" /></div>
      </section>

      {/* Combination columns */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Combination columns</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A six-column track lets rows mix widths: a full-width field, a wide + narrow pair, and an
          address row split three ways.
        </p>
        <ComponentPreview label="Property details · mixed columns">
          <form className="w-full max-w-2xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-6">
              <Field className="sm:col-span-6">
                <FieldLabel required hint="The legal entity name exactly as it appears on your strata roll.">
                  Owners corporation
                </FieldLabel>
                <Input placeholder="SP 12345, Harbourview" required />
              </Field>
              <Field className="sm:col-span-4">
                <FieldLabel>Street address</FieldLabel>
                <Input placeholder="12 Marine Parade" />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel>Lots</FieldLabel>
                <Input type="number" placeholder="48" />
              </Field>
              <Field className="sm:col-span-3">
                <FieldLabel>Suburb</FieldLabel>
                <Input placeholder="Manly" />
              </Field>
              <Field className="sm:col-span-2">
                <FieldLabel>State</FieldLabel>
                <StateSelect />
              </Field>
              <Field className="sm:col-span-1">
                <FieldLabel>Postcode</FieldLabel>
                <Input inputMode="numeric" placeholder="2095" />
              </Field>
              <Field className="sm:col-span-6">
                <FieldLabel>Notes</FieldLabel>
                <Textarea placeholder="Anything the committee should know…" />
                <FieldDescription>Visible to committee members only.</FieldDescription>
              </Field>
            </div>
          </form>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={COMBO_CODE} language="tsx" /></div>
      </section>

      {/* Form in a dialog */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Form in a dialog</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A compact single-column form inside a standard dialog, with the actions in the footer.
        </p>
        <ComponentPreview label="Dialog · invite owner">
          <Dialog>
            <DialogTrigger render={<Button>Invite owner</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite an owner</DialogTitle>
                <DialogDescription>
                  They&apos;ll receive an email to join the portal for this building.
                </DialogDescription>
              </DialogHeader>
              <FieldGroup>
                <Field>
                  <FieldLabel required>Full name</FieldLabel>
                  <Input placeholder="Jane Doe" required />
                </Field>
                <Field>
                  <FieldLabel required hint="We'll send the invite here.">Email</FieldLabel>
                  <Input type="email" placeholder="jane@example.com" required />
                </Field>
                <Field>
                  <FieldLabel>Lot number</FieldLabel>
                  <Input inputMode="numeric" placeholder="12" />
                </Field>
              </FieldGroup>
              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                <Button>Send invite</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ComponentPreview>
      </section>

      {/* Wide dialog: form + info/meta column */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Wide dialog · form + info column</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          A wider dialog (<code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">sm:max-w-3xl</code>) split into two
          columns: the form on the left and a supporting info &amp; meta panel on the right.
        </p>
        <ComponentPreview label="Dialog · register a building">
          <Dialog>
            <DialogTrigger render={<Button>Register a building</Button>} />
            <DialogContent className="sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Register a building</DialogTitle>
                <DialogDescription>
                  Add a new owners corporation to your portfolio.
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_17rem]">
                {/* Form column */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field className="sm:col-span-2">
                    <FieldLabel required hint="The legal entity name on your strata roll.">
                      Owners corporation
                    </FieldLabel>
                    <Input placeholder="SP 12345, Harbourview" required />
                  </Field>
                  <Field>
                    <FieldLabel required>State</FieldLabel>
                    <StateSelect />
                  </Field>
                  <Field>
                    <FieldLabel>Lots</FieldLabel>
                    <Input type="number" placeholder="48" />
                  </Field>
                  <Field className="sm:col-span-2">
                    <FieldLabel>Street address</FieldLabel>
                    <Input placeholder="12 Marine Parade, Manly" />
                  </Field>
                  <div className="sm:col-span-2 flex items-start gap-2">
                    <Checkbox id="compliance" defaultChecked className="mt-0.5" />
                    <FieldLabel htmlFor="compliance" className="font-normal leading-snug">
                      This building is subject to annual fire-safety compliance.
                    </FieldLabel>
                  </div>
                  <div className="sm:col-span-2 flex items-center justify-between rounded-sm border border-border px-3 py-2">
                    <FieldLabel htmlFor="portal" className="font-normal">Enable owner portal</FieldLabel>
                    <Switch id="portal" defaultChecked />
                  </div>
                </div>

                {/* Info / meta column */}
                <aside className="flex flex-col gap-4 rounded-sm bg-muted/40 p-4 ring-1 ring-border">
                  <div className="flex items-center gap-2 text-foreground">
                    <BuildingIcon className="size-4" />
                    <span className="text-sm font-semibold">About this record</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Registered buildings appear in reporting, levy runs, and the owner portal. You can edit
                    these details any time from Settings.
                  </p>
                  <div className="h-px bg-border" />
                  <ul className="flex flex-col gap-2.5 text-sm">
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <ShieldCheckIcon className="mt-0.5 size-4 shrink-0 text-info" />
                      <span>SP number is verified against the state registry.</span>
                    </li>
                    <li className="flex items-start gap-2 text-muted-foreground">
                      <InfoIcon className="mt-0.5 size-4 shrink-0 text-info" />
                      <span>Lots can be imported later from a CSV.</span>
                    </li>
                  </ul>
                  <div className="mt-auto grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Plan</p>
                      <p className="font-medium text-foreground">Portfolio</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Buildings used</p>
                      <p className="font-medium text-foreground">11 / 25</p>
                    </div>
                  </div>
                </aside>
              </div>

              <DialogFooter>
                <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
                <Button>Register building</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </ComponentPreview>
        <div className="mt-4"><CodeBlock code={DIALOG_WIDE_CODE} language="tsx" /></div>
      </section>
    </DocsPage>
  );
}
