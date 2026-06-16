import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Shimmer } from "@/components/ui/shimmer";
import { Spinner } from "@/components/ui/spinner";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/shimmer/registry.json`;

const USAGE = `import { Shimmer } from "@/components/ui/shimmer"

export function Loading() {
  return (
    <p className="text-2xl font-bold">
      <Shimmer>Generating your report…</Shimmer>
    </p>
  )
}`;

const LOADING_STATUS = `import { Shimmer } from "@/components/ui/shimmer"
import { Spinner } from "@/components/ui/spinner"

export function LoadingStatus() {
  return (
    <p className="flex items-center gap-2 text-base text-foreground">
      <Spinner className="size-3.5 text-forest" />
      <Shimmer className="text-base font-normal">Generating your report</Shimmer>
      <span aria-hidden="true">...</span>
    </p>
  )
}`;

const TUNING = `{/* duration controls the sweep speed (seconds) */}
<Shimmer duration={3}>Slower sweep</Shimmer>

{/* spread widens or narrows the bright band */}
<Shimmer spread={4}>Wider highlight</Shimmer>

{/* as renders a different element: defaults to span */}
<Shimmer as="h2" className="text-3xl font-bold">Heading shimmer</Shimmer>`;

const KEYFRAMES = `/* globals.css: required for the sweep */
@keyframes text-shimmer {
  0%   { background-position: 200% center; }
  100% { background-position: 0% center; }
}`;

const PROPS = [
  { name: "as", type: "ElementType", default: '"span"', description: "HTML element (or component) to render. Defaults to span so it can sit inline within text." },
  { name: "duration", type: "number", default: "2", description: "Animation duration in seconds. Higher is slower." },
  { name: "spread", type: "number", default: "2", description: "Spread multiplier: higher values widen the bright band that sweeps across the letterforms." },
  { name: "className", type: "string", description: "Additional classes. inline-block is always applied so background-clip works." },
  { name: "children", type: "ReactNode", description: "Text content the shimmer is painted on." },
];

export default function ShimmerPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Base
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Shimmer</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          Animated gradient shimmer that sweeps across text using the brand gradient
          (forest → lime → forest). Painted directly on the letterforms via
          <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">background-clip: text</code> -
          ideal for in-progress or streaming states.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <CodeBlock code={USAGE} language="tsx" />
        <p className="text-sm text-ink-muted mt-3 leading-relaxed">
          The sweep depends on a <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">text-shimmer</code> keyframe.
          Add it to your <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">globals.css</code>:
        </p>
        <div className="mt-3">
          <CodeBlock code={KEYFRAMES} language="css" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">Examples</h2>

        <div className="space-y-10">

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Live preview</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              A streaming-style status line.
            </p>
            <ComponentPreview label="Preview">
              <Shimmer className="text-2xl font-bold">Generating your report…</Shimmer>
            </ComponentPreview>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Loading status</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Paragraph-sized text with a leading spinner and trailing ellipsis: useful for inline
              loading or streaming states.
            </p>
            <ComponentPreview label="Preview">
              <p className="flex items-center gap-2 text-base text-foreground">
                <Spinner className="size-3.5 text-forest" />
                <Shimmer className="text-base font-normal">Generating your report</Shimmer>
                <span aria-hidden="true">...</span>
              </p>
            </ComponentPreview>
            <div className="mt-3">
              <CodeBlock code={LOADING_STATUS} language="tsx" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Tuning the sweep</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Adjust <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">duration</code> and
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">spread</code>, or render a different element with
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">as</code>.
            </p>
            <CodeBlock code={TUNING} language="tsx" />
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
