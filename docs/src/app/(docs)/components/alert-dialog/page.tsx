"use client";

import { Trash2Icon, TriangleAlertIcon, LogOutIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/alert-dialog/registry.json`;

const USAGE = `import { Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function Example() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Archive scheme
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Archive this scheme?</AlertDialogTitle>
          <AlertDialogDescription>
            Owners and managers lose access until it is restored. You can
            unarchive it at any time from settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Archive</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}`;

const DESTRUCTIVE_CODE = `<AlertDialog>
  <AlertDialogTrigger render={<Button variant="destructive" />}>
    Delete lot
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogMedia variant="destructive">
        <Trash2Icon />
      </AlertDialogMedia>
      <AlertDialogTitle>Delete this lot?</AlertDialogTitle>
      <AlertDialogDescription>
        This permanently removes the lot, its owners, and levy history. This
        action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`;

const SMALL_CODE = `<AlertDialogContent size="sm">
  <AlertDialogHeader>
    <AlertDialogMedia>
      <LogOutIcon />
    </AlertDialogMedia>
    <AlertDialogTitle>Sign out?</AlertDialogTitle>
    <AlertDialogDescription>
      You will need to sign in again to manage your schemes.
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction>Sign out</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`;

const PLAIN_CODE = `<AlertDialogContent>
  <AlertDialogHeader>
    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    <AlertDialogDescription>
      This action cannot be undone. This will permanently delete your account
      and remove your data from our servers.
    </AlertDialogDescription>
  </AlertDialogHeader>
  <AlertDialogFooter>
    <AlertDialogCancel>Cancel</AlertDialogCancel>
    <AlertDialogAction>Continue</AlertDialogAction>
  </AlertDialogFooter>
</AlertDialogContent>`;

const CONTENT_PROPS = [
  {
    name: "size",
    type: '"default" | "sm"',
    default: '"default"',
    description:
      "Controls the panel width. Use sm for short, single-decision confirmations.",
  },
  {
    name: "className",
    type: "string",
    description: "Additional classes on the popup panel.",
  },
];

const MEDIA_PROPS = [
  {
    name: "variant",
    type: '"default" | "destructive"',
    default: '"default"',
    description:
      "Tints the icon block. Use destructive for irreversible actions.",
  },
];

const ACTION_PROPS = [
  {
    name: "variant",
    type: "ButtonProps[\"variant\"]",
    default: '"default"',
    description:
      "Forwarded to the underlying Button. Use destructive on AlertDialogAction to confirm dangerous actions.",
  },
];

export default function AlertDialogPage() {
  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Base
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Alert Dialog
        </h1>
        <p className="text-base text-ink-muted leading-relaxed">
          A modal dialog that interrupts the user with important content and
          expects a deliberate response. Unlike{" "}
          <a
            href="/components/dialog"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Dialog
          </a>
          , it cannot be dismissed by clicking the backdrop or pressing Escape.
          Based on{" "}
          <a
            href="https://ui.shadcn.com/docs/components/base/alert-dialog"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            shadcn/ui Alert Dialog
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
          code={`AlertDialog
├── AlertDialogTrigger
└── AlertDialogContent
    ├── AlertDialogHeader
    │   ├── AlertDialogMedia      (optional)
    │   ├── AlertDialogTitle
    │   └── AlertDialogDescription
    └── AlertDialogFooter
        ├── AlertDialogCancel
        └── AlertDialogAction`}
          language="text"
        />
      </section>

      {/* Examples */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Examples
        </h2>

        <div className="space-y-10">

          {/* Default (Media) */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Default (Media)
            </p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              The default style leads with a media block — an icon that frames
              the decision before the title and description.
            </p>
            <ComponentPreview label="Archive scheme">
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="outline" />}>
                  Archive scheme
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia>
                      <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Archive this scheme?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Owners and managers lose access until it is restored. You
                      can unarchive it at any time from settings.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Archive</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ComponentPreview>
          </div>

          {/* Destructive */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Destructive
            </p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Pair a destructive media block with a destructive action button
              for irreversible operations.
            </p>
            <ComponentPreview label="Delete lot">
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="destructive" />}>
                  Delete lot
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogMedia variant="destructive">
                      <Trash2Icon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Delete this lot?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This permanently removes the lot, its owners, and levy
                      history. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction variant="destructive">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={DESTRUCTIVE_CODE} language="tsx" />
            </div>
          </div>

          {/* Small */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Small</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              A compact panel with <code>size=&quot;sm&quot;</code> for short,
              single-decision confirmations.
            </p>
            <ComponentPreview label="Sign out">
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="outline" />}>
                  Sign out
                </AlertDialogTrigger>
                <AlertDialogContent size="sm">
                  <AlertDialogHeader>
                    <AlertDialogMedia>
                      <LogOutIcon />
                    </AlertDialogMedia>
                    <AlertDialogTitle>Sign out?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will need to sign in again to manage your schemes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Sign out</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={SMALL_CODE} language="tsx" />
            </div>
          </div>

          {/* Without media */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">
              Without media
            </p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Omit <code>AlertDialogMedia</code> for a plain, text-only
              confirmation.
            </p>
            <ComponentPreview label="Continue">
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="outline" />}>
                  Continue
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={PLAIN_CODE} language="tsx" />
            </div>
          </div>

        </div>
      </section>

      {/* Props */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Props
        </h2>
        <p className="text-sm font-semibold text-foreground mb-2">
          AlertDialogContent
        </p>
        <PropTable props={CONTENT_PROPS} />
        <p className="text-sm font-semibold text-foreground mb-2 mt-8">
          AlertDialogMedia
        </p>
        <PropTable props={MEDIA_PROPS} />
        <p className="text-sm font-semibold text-foreground mb-2 mt-8">
          AlertDialogAction
        </p>
        <PropTable props={ACTION_PROPS} />
      </section>

    </DocsPage>
  );
}
