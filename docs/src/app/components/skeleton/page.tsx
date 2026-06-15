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
            <p className="text-sm font-semibold text-foreground mb-1">Live preview</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              A card placeholder built from a few sized skeletons.
            </p>
            <ComponentPreview label="Preview">
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
