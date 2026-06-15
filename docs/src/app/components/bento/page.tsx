import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  BentoGrid,
  BentoCell,
  BentoNotch,
  BentoFeatureCell,
  BentoContentCell,
  BentoVisualCell,
} from "@/components/ui/bento";
import {
  BarChart3,
  Boxes,
  Code2,
  Database,
  LayoutDashboard,
  LineChart,
} from "lucide-react";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/bento/registry.json`;

const SHOWCASE_CODE = `import {
  BentoGrid,
  BentoFeatureCell,
} from "@/components/ui/bento"
import { Code2, LineChart, BarChart3, Boxes, LayoutDashboard, Database } from "lucide-react"

// 12-column base grid. Cells span a slice of it; flush + notches
// carve the concave interlock where cards meet.
<BentoGrid seam="default" cols={12} rowHeight={168} gap={12}>
  <BentoFeatureCell icon={<Code2 />}        label="Ad hoc analysis"      tone="secondary" colSpan={7} flush={["br"]}      notches={["br"]} />
  <BentoFeatureCell icon={<LineChart />}    label="Advanced analytics"   tone="primary"   colSpan={5} rowSpan={2} flush={["bl"]} notches={["bl"]} />
  <BentoFeatureCell icon={<BarChart3 />}    label="Self-serve reporting" tone="secondary" colSpan={4} />
  <BentoFeatureCell icon={<Boxes />}        label="Custom data apps"     tone="secondary" colSpan={3} flush={["tr", "br"]} notches={["tr", "br"]} />
  <BentoFeatureCell icon={<LayoutDashboard />} label="Interactive dashboards" tone="secondary" colSpan={7} flush={["tr"]} notches={["tr"]} />
  <BentoFeatureCell icon={<Database />}     label="Explorable datasets"  tone="secondary" colSpan={5} flush={["tl"]} notches={["tl"]} />
</BentoGrid>`;

const NOTCH_CODE = `// A concave corner: flatten the card corner, then drop a
// seam-coloured BentoNotch over it. The notch's inner corner is
// rounded, so the seam colour bites a quarter-circle out of the card.
<BentoCell tone="primary" colSpan={4} flush={["br"]}>
  {/* …content… */}
  <BentoNotch corner="br" size={22} />
</BentoCell>`;

const CONTENT_CODE = `import {
  BentoGrid,
  BentoContentCell,
  BentoVisualCell,
} from "@/components/ui/bento"

<BentoGrid seam="secondary" cols={2} rowHeight={220} gap={12}>
  <BentoContentCell
    eyebrow="Built for managers"
    heading="Made for your strata team"
    body="Levy notices, maintenance requests and owner queries in one workspace."
    tone="default"
  />
  <BentoVisualCell tone="primary">{/* screenshot */}</BentoVisualCell>
</BentoGrid>`;

const GRID_PROPS = [
  { name: "seam", type: '"default" | "secondary" | "primary" | "alternative"', default: '"default"', description: "Background of the container. Shows through every gap and the outer padding, and is the colour the notches paint, so it reads as the seam between cards." },
  { name: "cols", type: "number", default: "12", description: "Base columns. Cells span a slice of these via colSpan." },
  { name: "rowHeight", type: "number", default: "168", description: "Height (px) of one grid row. Cells with rowSpan get multiples of this." },
  { name: "gap", type: "number", default: "12", description: "Gap between cells (px). Reused as the outer padding so the frame is even on every side." },
  { name: "rounded", type: "number", default: "28", description: "Outer container radius (px). Keep it larger than the cell radius so the frame never clips a card corner." },
];

const CELL_PROPS = [
  { name: "tone", type: '"default" | "secondary" | "primary" | "alternative" | "dark"', default: '"secondary"', description: "Card background and text colour." },
  { name: "colSpan", type: "number", default: "1", description: "Columns this cell spans, of the grid's cols." },
  { name: "rowSpan", type: "number", default: "1", description: "Rows this cell spans." },
  { name: "radius", type: "number", default: "18", description: "Corner radius of the card (px)." },
  { name: "flush", type: '("tl" | "tr" | "bl" | "br")[]', default: "[]", description: "Corners to flatten to radius 0 where the card butts against a neighbour. Pair each with a BentoNotch to carve the concave interlock." },
  { name: "clip", type: "boolean", default: "false", description: "Clip overflowing content (images). Off by default so notches can render outside the box." },
];

const NOTCH_PROPS = [
  { name: "corner", type: '"tl" | "tr" | "bl" | "br"', description: "Which corner of the parent cell to carve. The parent must be a BentoCell (position: relative)." },
  { name: "size", type: "number", default: "22", description: "Radius of the concave quarter-circle carve (px)." },
  { name: "seam", type: "string", description: "Override the carve colour. Defaults to the grid's seam colour, supplied via context." },
];

const FEATURE_PROPS = [
  { name: "icon", type: "ReactNode", description: "24px icon (Lucide or any SVG) rendered at the top-left." },
  { name: "label", type: "string", description: "Primary label pinned to the bottom-left." },
  { name: "body", type: "string", description: "Optional supporting text under the label." },
  { name: "visual", type: "ReactNode", description: "Optional chart / screenshot placed between icon and label." },
  { name: "notches", type: '("tl" | "tr" | "bl" | "br")[]', default: "[]", description: "Convenience: renders a BentoNotch at each listed corner." },
];

export default function BentoPage() {
  return (
    <DocsPage width="wide">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Bento</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          A standalone bento grid in the style of mode.com&apos;s &ldquo;Beyond BI&rdquo; section.
          Feature cards span a 12-column base grid; where they meet, corners are flattened and a
          seam-coloured notch carves a concave interlock, so the cards read as routed into one
          another rather than floating in a plain grid.
        </p>
      </div>

      {/* ── Installation ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* ── How the grid works ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">How it works</h2>
        <ul className="space-y-3 text-sm text-ink-muted leading-relaxed list-disc pl-5">
          <li>
            <strong className="text-foreground">The grid</strong> is a 12-column track. Each card
            sets a <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">colSpan</code>{" "}
            (and optional <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">rowSpan</code>),
            so spans of 7 + 5, or 4 + 3 + 5, fill a row. Auto-flow places them left-to-right, top-to-bottom.
          </li>
          <li>
            <strong className="text-foreground">The seam</strong> is the container background. It
            shows through every gap and the equal outer padding, so the frame and the inner gaps
            are one continuous colour — that&apos;s what the eye reads as the join between cards.
          </li>
          <li>
            <strong className="text-foreground">Radius is managed in two halves.</strong> Cards are
            rounded on every corner by default. Where a card meets a neighbour, that corner is set
            to <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">flush</code>{" "}
            (radius&nbsp;0) so the edge is square, then a <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">BentoNotch</code>{" "}
            — a small seam-coloured square with its <em>inner</em> corner rounded — is laid over
            that corner. The seam colour bites a concave quarter-circle out of the card. Two cards
            carving the corners they share produces the interlocking &ldquo;pocket&rdquo; that
            defines the mode.com look.
          </li>
        </ul>
      </section>

      {/* ── Showcase: interlocking feature grid ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Feature grid</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Six capabilities on a 12-column grid, with one tall accent card and concave notches at the
          interior junctions.
        </p>

        <ComponentPreview label="default seam · interlocking feature cards">
          <BentoGrid seam="default" cols={12} rowHeight={168} gap={12} className="w-full">
            <BentoFeatureCell
              icon={<Code2 />}
              label="Ad hoc analysis"
              body="SQL, R and Python in one notebook."
              tone="secondary"
              colSpan={7}
              flush={["br"]}
              notches={["br"]}
            />
            <BentoFeatureCell
              icon={<LineChart />}
              label="Advanced analytics"
              body="Interactive modelling without the rebuild."
              tone="primary"
              colSpan={5}
              rowSpan={2}
              flush={["bl"]}
              notches={["bl"]}
            />
            <BentoFeatureCell
              icon={<BarChart3 />}
              label="Self-serve reporting"
              tone="secondary"
              colSpan={4}
            />
            <BentoFeatureCell
              icon={<Boxes />}
              label="Custom data apps"
              tone="secondary"
              colSpan={3}
              flush={["tr", "br"]}
              notches={["tr", "br"]}
            />
            <BentoFeatureCell
              icon={<LayoutDashboard />}
              label="Interactive dashboards"
              tone="secondary"
              colSpan={7}
              flush={["tr"]}
              notches={["tr"]}
            />
            <BentoFeatureCell
              icon={<Database />}
              label="Explorable datasets"
              tone="secondary"
              colSpan={5}
              flush={["tl"]}
              notches={["tl"]}
            />
          </BentoGrid>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={SHOWCASE_CODE} language="tsx" />
        </div>
      </section>

      {/* ── The notch in isolation ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">The notch</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          A single concave corner. The card&apos;s bottom-right is flattened, then a seam-coloured{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">BentoNotch</code>{" "}
          carves the curve back in.
        </p>

        <ComponentPreview label="one cell · one notch">
          <BentoGrid seam="default" cols={2} rowHeight={160} gap={12} className="w-full">
            <BentoCell tone="primary" colSpan={1} flush={["br"]} className="flex items-end p-6 text-white">
              <span className="text-sm font-medium">Concave bottom-right</span>
              <BentoNotch corner="br" size={22} />
            </BentoCell>
            <BentoCell tone="secondary" colSpan={1} className="flex items-end p-6">
              <span className="text-sm font-medium">Plain card</span>
            </BentoCell>
          </BentoGrid>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={NOTCH_CODE} language="tsx" />
        </div>
      </section>

      {/* ── Content grid ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Content grid</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          The editorial variant: <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">BentoContentCell</code>{" "}
          for eyebrow + display heading + copy, alongside <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">BentoVisualCell</code>{" "}
          fills for screenshots and UI previews.
        </p>

        <ComponentPreview label="secondary seam · content + visual">
          <BentoGrid seam="secondary" cols={2} rowHeight={220} gap={12} className="w-full">
            <BentoContentCell
              eyebrow="Built for managers"
              heading="Made for your strata team"
              body="Levy notices, maintenance requests, AGM minutes and owner queries: all in one workspace."
              tone="default"
            />
            <BentoVisualCell tone="primary">
              <div className="flex w-full flex-col items-start gap-2 p-6">
                <div className="h-2 w-full rounded-full bg-white/10" />
                <div className="h-2 w-3/4 rounded-full bg-white/10" />
                <div className="mt-3 h-16 w-full rounded-sm border border-white/10 bg-white/5" />
                <div className="mt-2 h-2 w-1/2 rounded-full bg-[#C8F169]/40" />
              </div>
            </BentoVisualCell>
            <BentoVisualCell tone="dark">
              <div className="flex w-full flex-col items-start gap-2 p-6">
                <div className="mb-1 font-mono text-[10px] text-white/30">SP12345</div>
                <div className="mt-1 grid w-full grid-cols-6 gap-1.5">
                  {[40, 65, 50, 80, 55, 70].map((h, i) => (
                    <div key={i} className="flex h-16 items-end">
                      <div className="w-full rounded-sm bg-[#C8F169]/50" style={{ height: `${h}%` }} />
                    </div>
                  ))}
                </div>
              </div>
            </BentoVisualCell>
            <BentoContentCell
              eyebrow="Owner experience"
              heading="And the owners you serve"
              body="A self-service portal means fewer calls, more transparency, and owners who trust you."
              tone="alternative"
            />
          </BentoGrid>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={CONTENT_CODE} language="tsx" />
        </div>
      </section>

      {/* ── Props ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BentoGrid Props</h2>
        <PropTable props={GRID_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BentoCell Props</h2>
        <PropTable props={CELL_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BentoNotch Props</h2>
        <PropTable props={NOTCH_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BentoFeatureCell Props</h2>
        <p className="text-xs text-ink-muted mb-3">Extends BentoCell props.</p>
        <PropTable props={FEATURE_PROPS} />
      </section>
    </DocsPage>
  );
}
