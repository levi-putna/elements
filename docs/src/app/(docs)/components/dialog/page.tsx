"use client";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
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

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/dialog/registry.json`;

const USAGE = `import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function Example() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}`;

const NO_CLOSE_CODE = `<DialogContent showCloseButton={false}>
  <DialogHeader>
    <DialogTitle>No close button</DialogTitle>
    <DialogDescription>
      Use the footer actions or press Escape to dismiss.
    </DialogDescription>
  </DialogHeader>
  <DialogFooter showCloseButton>
    <Button variant="default">Confirm</Button>
  </DialogFooter>
</DialogContent>`;

const STICKY_FOOTER_CODE = `<DialogContent className="flex max-h-[min(520px,85vh)] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
  <DialogHeader className="shrink-0 px-4 pt-4">
    <DialogTitle>Sticky footer</DialogTitle>
    <DialogDescription>
      Actions stay visible while the body scrolls.
    </DialogDescription>
  </DialogHeader>
  <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
    {/* long form fields */}
  </div>
  <DialogFooter bleed={false}>
    <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
    <Button>Save changes</Button>
  </DialogFooter>
</DialogContent>`;

const SCROLLABLE_CODE = `<DialogContent className="flex max-h-[min(520px,85vh)] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
  <DialogHeader className="shrink-0 px-4 pt-4">
    <DialogTitle>Scrollable content</DialogTitle>
    <DialogDescription>
      The header stays in view while the body scrolls.
    </DialogDescription>
  </DialogHeader>
  <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
    {/* long content */}
  </div>
</DialogContent>`;

const CONTENT_PROPS = [
  {
    name: "showCloseButton",
    type: "boolean",
    default: "true",
    description:
      "When true, renders a ghost icon button in the top-right corner of the panel.",
  },
  {
    name: "className",
    type: "string",
    description:
      "Additional classes on the popup. Use flex column layouts with max-height for scrollable bodies.",
  },
];

const FOOTER_PROPS = [
  {
    name: "bleed",
    type: "boolean",
    default: "true",
    description:
      "When true, extends the footer to the dialog edges inside padded content. Set false for sticky p-0 layouts.",
  },
  {
    name: "showCloseButton",
    type: "boolean",
    default: "false",
    description:
      "When true, appends an outline Close button after footer children.",
  },
];

const LONG_COPY = Array.from({ length: 8 }, (_, index) => (
  <p key={index} className="text-sm leading-relaxed text-ink-muted">
    Paragraph {index + 1}. Levy notices, maintenance requests, and owner
    communications stay in one place so strata managers can review history
    before approving a change.
  </p>
));

export default function DialogPage() {
  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Base
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Dialog
        </h1>
        <p className="text-base text-ink-muted leading-relaxed">
          A window overlaid on the primary view, rendering content underneath
          inert. Based on{" "}
          <a
            href="https://ui.shadcn.com/docs/components/radix/dialog"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            shadcn/ui Dialog
          </a>
          , built on Base UI with Instant Strata styling.
        </p>
      </div>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Usage
        </h2>
        <CodeBlock code={USAGE} language="tsx" />
      </section>

      {/* Composition */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Composition
        </h2>
        <CodeBlock
          code={`Dialog
├── DialogTrigger
└── DialogContent
    ├── DialogHeader
    │   ├── DialogTitle
    │   └── DialogDescription
    └── DialogFooter`}
          language="text"
        />
      </section>

      {/* Examples */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Examples
        </h2>

        <div className="space-y-10">

          {/* Default */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Default</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Title, description, and a top-right close control.
            </p>
            <ComponentPreview label="Open dialog">
              <Dialog>
                <DialogTrigger render={<Button variant="outline" />}>
                  Open dialog
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </ComponentPreview>
          </div>

          {/* No close button */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              No close button
            </p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Hide the icon close control and rely on footer actions instead.
            </p>
            <ComponentPreview label="No close button">
              <Dialog>
                <DialogTrigger render={<Button variant="outline" />}>
                  Open dialog
                </DialogTrigger>
                <DialogContent showCloseButton={false}>
                  <DialogHeader>
                    <DialogTitle>No close button</DialogTitle>
                    <DialogDescription>
                      Use the footer actions or press Escape to dismiss.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter showCloseButton>
                    <Button variant="default">Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={NO_CLOSE_CODE} language="tsx" />
            </div>
          </div>

          {/* Sticky footer */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Sticky footer
            </p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Keep actions visible while form fields scroll in the body.
            </p>
            <ComponentPreview label="Sticky footer">
              <Dialog>
                <DialogTrigger render={<Button variant="outline" />}>
                  Edit scheme
                </DialogTrigger>
                <DialogContent className="flex max-h-[min(420px,80vh)] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
                  <DialogHeader className="shrink-0 px-4 pt-4">
                    <DialogTitle>Sticky footer</DialogTitle>
                    <DialogDescription>
                      Actions stay visible while the body scrolls.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-2">
                    {["Scheme name", "Building address", "Levy frequency", "Financial year end", "Manager notes"].map(
                      (label) => (
                        <label key={label} className="block space-y-1.5">
                          <span className="text-xs font-medium text-foreground">
                            {label}
                          </span>
                          <div className="h-9 rounded-sm border border-border bg-background px-3 text-sm text-ink-muted flex items-center">
                            Sample value
                          </div>
                        </label>
                      )
                    )}
                  </div>
                  <DialogFooter bleed={false}>
                    <DialogClose render={<Button variant="outline" />}>
                      Cancel
                    </DialogClose>
                    <Button>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={STICKY_FOOTER_CODE} language="tsx" />
            </div>
          </div>

          {/* Scrollable content */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Scrollable content
            </p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Long copy scrolls inside the panel while the header remains fixed.
            </p>
            <ComponentPreview label="Scrollable content">
              <Dialog>
                <DialogTrigger render={<Button variant="outline" />}>
                  View terms
                </DialogTrigger>
                <DialogContent className="flex max-h-[min(420px,80vh)] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-md">
                  <DialogHeader className="shrink-0 px-4 pt-4">
                    <DialogTitle>Scrollable content</DialogTitle>
                    <DialogDescription>
                      The header stays in view while the body scrolls.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 pb-4">
                    {LONG_COPY}
                  </div>
                </DialogContent>
              </Dialog>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={SCROLLABLE_CODE} language="tsx" />
            </div>
          </div>

        </div>
      </section>

      {/* Props */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Props
        </h2>
        <p className="text-sm font-semibold text-foreground mb-2">DialogContent</p>
        <PropTable props={CONTENT_PROPS} />
        <p className="text-sm font-semibold text-foreground mb-2 mt-8">DialogFooter</p>
        <PropTable props={FOOTER_PROPS} />
      </section>

    </DocsPage>
  );
}
