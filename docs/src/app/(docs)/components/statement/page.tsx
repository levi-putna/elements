import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Statement, StatementAction } from "@/components/ui/statement";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/statement/registry.json`;

const USAGE = `import { Statement, StatementAction } from "@/components/ui/statement"

<Statement
  eyebrow="The platform"
  cycle={{ from: "Ad hoc analysis", to: "Self-serve reporting" }}
  actions={
    <>
      <StatementAction href="/signup">Try for free</StatementAction>
      <StatementAction href="/demo" variant="outline">Request demo</StatementAction>
    </>
  }
>
  The cycle of ad hoc analysis to self-serve reporting and back again?
  It all happens in <em>Instant Strata</em>.
</Statement>`;

const EM_CODE = `{/* Wrap a word in <em> to accent it (not italicised) */}
<Statement>
  It all happens in <em>Instant Strata</em>.
</Statement>`;

const PROPS = [
  { name: "children", type: "ReactNode", description: "The statement headline. Wrap words in <em> to render them in the accent colour (not italicised)." },
  { name: "eyebrow", type: "string", description: "Small all-caps label above the headline." },
  { name: "body", type: "string", description: "Supporting paragraph beneath the headline (and cycle, if present)." },
  { name: "cycle", type: "{ from: string; to: string }", description: "Renders a cycle diagram: two labelled nodes joined by looping arrows that return to the start." },
  { name: "actions", type: "ReactNode", description: "Call-to-action buttons. Use StatementAction for brand-styled primary/outline links." },
  { name: "type", type: '"primary" | "alternative" | "default"', default: '"primary"', description: "Background scheme: primary (forest + white), alternative (lime-soft + forest), default (white + forest)." },
];

export default function StatementPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Statement</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          An oversized editorial statement: the closing-manifesto pattern. A bold display
          headline making a single claim, with an optional cycle-loop diagram and dual CTAs.
        </p>
      </div>

      {/* Example: primary with cycle */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          With cycle diagram
        </h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <Statement
            eyebrow="The platform"
            cycle={{ from: "Ad hoc analysis", to: "Self-serve reporting" }}
            actions={
              <>
                <StatementAction href="#">Try for free</StatementAction>
                <StatementAction href="#" variant="outline">Request demo</StatementAction>
              </>
            }
          >
            The cycle of ad hoc analysis to self-serve reporting and back again?
            It all happens in <em>Instant Strata</em>.
          </Statement>
        </div>
      </section>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <CodeBlock code={USAGE} language="tsx" />
        <p className="text-sm text-ink-muted mt-4 mb-2 leading-relaxed">Accent a word with <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">&lt;em&gt;</code>:</p>
        <CodeBlock code={EM_CODE} language="tsx" />
      </section>

      {/* Variants */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Background types</h2>
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-border">
            <Statement type="alternative">
              Reporting that <em>writes itself</em>, so your team can get back to the analysis.
            </Statement>
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <Statement type="default" eyebrow="Why Instant Strata">
              Every building, every levy, every owner, in <em>one workspace</em>.
            </Statement>
          </div>
        </div>
      </section>

      {/* Props */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Statement Props</h2>
        <PropTable props={PROPS} />
      </section>

    </DocsPage>
  );
}
