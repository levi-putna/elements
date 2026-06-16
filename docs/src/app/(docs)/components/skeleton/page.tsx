import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Skeleton } from "@/components/ui/skeleton";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/skeleton/registry.json`;

const USAGE = `import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-40 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  )
}`;

const SHAPES = `{/* Size and shape are controlled entirely with classNames */}
<Skeleton className="h-10 w-10 rounded-full" />  {/* avatar */}
<Skeleton className="h-4 w-full" />              {/* line of text */}
<Skeleton className="h-48 w-full rounded-md" />  {/* image / card */}`;

const LIST = `import { Skeleton } from "@/components/ui/skeleton"

export function ListSkeleton() {
  return (
    <div className="w-full space-y-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-3 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  )
}`;

const TABLE = `import { Skeleton } from "@/components/ui/skeleton"

export function TableSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-sm border border-border">
      {/* Column headers */}
      <div className="flex gap-4 border-b border-border bg-off-white px-4 py-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-28" />
      </div>
      {/* Data rows */}
      {[1, 2, 3, 4, 5].map((row) => (
        <div
          key={row}
          className="flex gap-4 border-b border-border px-4 py-3 last:border-b-0"
        >
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>
  )
}`;

const CHAT = `import { Skeleton } from "@/components/ui/skeleton"

export function ChatSkeleton() {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* User message */}
      <div className="ml-auto w-fit rounded-sm bg-secondary px-4 py-3">
        <Skeleton className="h-4 w-48" />
      </div>
      {/* Assistant reply loading */}
      <div className="max-w-[85%] space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
      </div>
    </div>
  )
}`;

const PROPS = [
  { name: "className", type: "string", description: "Sizing and shape classes (height, width, border radius). The shimmer sweep, base background, and overflow clipping are always applied." },
  { name: "...props", type: "HTMLAttributes<HTMLDivElement>", description: "Any other div attributes are spread onto the root element." },
];

export default function SkeletonPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Base
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Skeleton</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          Block-level loading placeholder. Uses the same shimmer sweep animation as the Button
          loading state so every loading indicator feels visually consistent. Size and shape are
          set entirely through <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">className</code>.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <CodeBlock code={USAGE} language="tsx" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">Examples</h2>

        <div className="space-y-10">

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Card</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              A card placeholder built from a few sized skeletons.
            </p>
            <ComponentPreview label="Card">
              <div className="w-full max-w-sm space-y-3">
                <Skeleton className="h-40 w-full" />
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              </div>
            </ComponentPreview>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">List</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Avatar and two-line text rows: useful for contacts, notifications, or search results.
            </p>
            <ComponentPreview label="List">
              <div className="w-full max-w-md space-y-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/5" />
                      <Skeleton className="h-3 w-2/5" />
                    </div>
                  </div>
                ))}
              </div>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={LIST} language="tsx" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Table</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Header row plus repeating data rows: drop in while table data is fetching.
            </p>
            <ComponentPreview label="Table">
              <div className="w-full overflow-hidden rounded-sm border border-border">
                {/* Column headers */}
                <div className="flex gap-4 border-b border-border bg-off-white px-4 py-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-28" />
                </div>
                {/* Data rows */}
                {[1, 2, 3, 4, 5].map((row) => (
                  <div
                    key={row}
                    className="flex gap-4 border-b border-border px-4 py-3 last:border-b-0"
                  >
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))}
              </div>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={TABLE} language="tsx" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Chat messages</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              User bubble and assistant reply lines: matches the Message component layout while a response loads.
            </p>
            <ComponentPreview label="Chat">
              <div className="flex w-full max-w-lg flex-col gap-6">
                {/* User message */}
                <div className="ml-auto w-fit rounded-sm bg-secondary px-4 py-3">
                  <Skeleton className="h-4 w-48" />
                </div>
                {/* Assistant reply loading */}
                <div className="max-w-[85%] space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={CHAT} language="tsx" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Shapes</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Avatars, text lines, and image blocks are all the same component with different
              sizing classes.
            </p>
            <CodeBlock code={SHAPES} language="tsx" />
          </div>

        </div>
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Props</h2>
        <PropTable props={PROPS} />
      </section>

    </DocsPage>
  );
}
