import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  BentoGrid,
  BentoCell,
  BentoFeatureCell,
  BentoContentCell,
  BentoVisualCell,
  BentoSplit,
  BentoSplitPanel,
  BentoBleed,
} from "@/components/ui/bento";
import {
  BarChart3,
  Bell,
  FileText,
  Globe,
  LayoutGrid,
  MessageSquare,
  Search,
  Settings,
  Shield,
  Users,
  Zap,
} from "lucide-react";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/bento/registry.json`;

const FEATURE_GRID_CODE = `import {
  BentoGrid,
  BentoFeatureCell,
} from "@/components/ui/bento"
import { BarChart3, FileText, Globe, LayoutGrid, MessageSquare, Shield } from "lucide-react"

// Feature grid — icon top-left, label bottom-left
// Outer: lime-soft. Cells: forest green.
<BentoGrid type="alternative" cols={3}>
  <BentoFeatureCell
    icon={<FileText />}
    label="Levy management"
    type="primary"
  />
  <BentoFeatureCell
    icon={<BarChart3 />}
    label="Financial reporting"
    type="primary"
    rowSpan={2}
    minH="min-h-64"
  />
  <BentoFeatureCell
    icon={<Bell />}
    label="Owner notifications"
    type="primary"
  />
  <BentoFeatureCell
    icon={<Globe />}
    label="Online portal"
    type="primary"
    colSpan={2}
  />
</BentoGrid>`;

const CONTENT_GRID_CODE = `import {
  BentoGrid,
  BentoContentCell,
  BentoVisualCell,
} from "@/components/ui/bento"

// Content bento — alternating text + visual cells
// Outer: off-white. Cells: white text blocks + dark visual cards.
<BentoGrid type="secondary" cols={2} gap="lg">
  <BentoContentCell
    eyebrow="Built for managers"
    heading="Made for your strata team"
    body="Levy notices, maintenance requests, AGM minutes and owner queries — all in one workspace."
    type="default"
  />
  <BentoVisualCell type="primary" rowSpan={1}>
    {/* screenshot / illustration */}
  </BentoVisualCell>
  <BentoVisualCell type="dark-card">
    {/* screenshot / illustration */}
  </BentoVisualCell>
  <BentoContentCell
    eyebrow="Owner experience"
    heading="And the owners you serve"
    body="A self-service portal means fewer calls and more trust."
    type="alternative"
  />
</BentoGrid>`;

const DARK_FEATURE_CODE = `// Forest background — cells use lime-soft (alternative)
<BentoGrid type="primary" cols={3}>
  <BentoFeatureCell icon={<Shield />} label="Audit trail"      type="dark-card" />
  <BentoFeatureCell icon={<Zap />}    label="Automation"       type="alternative" rowSpan={2} />
  <BentoFeatureCell icon={<Users />}  label="Role permissions" type="dark-card" />
  <BentoFeatureCell icon={<Search />} label="Global search"    type="dark-card" colSpan={2} />
</BentoGrid>`;

const SPLIT_CODE = `import {
  BentoSplit,
  BentoSplitPanel,
  BentoBleed,
} from "@/components/ui/bento"

// Two-column interlocking overlap — the signature brand element.
// Right column staggers down; media bleeds across the seam.
<BentoSplit
  stagger={56}
  left={[
    <BentoSplitPanel type="secondary">
      <h3 className="font-display text-2xl">Made for your data team</h3>
      <p>SQL, R, Python and data viz, all connected.</p>
    </BentoSplitPanel>,
    <BentoSplitPanel type="secondary" padding="none" className="overflow-visible">
      <BentoBleed bleed={{ right: 40, bottom: 24 }} className="p-6">
        {/* dark mockup card that overhangs onto the next panel */}
      </BentoBleed>
    </BentoSplitPanel>,
  ]}
  right={[
    <BentoSplitPanel type="alternative">{/* chart */}</BentoSplitPanel>,
    <BentoSplitPanel type="alternative">
      <h3 className="font-display text-2xl">And the teams you work with</h3>
      <p>Easy, trusted self-service for everyone.</p>
    </BentoSplitPanel>,
  ]}
/>`;

const SPLIT_PROPS = [
  { name: "left", type: "ReactNode[]", description: "Panels stacked in the left column. Typically BentoSplitPanel elements." },
  { name: "right", type: "ReactNode[]", description: "Panels stacked in the right column. Offset downward by stagger to create the interlocking rhythm." },
  { name: "stagger", type: "number", default: "64", description: "Vertical offset (px) applied to the right column. This downward shift is what makes the columns appear to interlock." },
  { name: "gap", type: '"sm" | "md" | "lg"', default: '"md"', description: "Gap between all panels — also the visual seam width between columns." },
];

const BLEED_PROPS = [
  { name: "bleed", type: "{ top?, right?, bottom?, left? }", description: "Pixels each edge overhangs its panel via negative margin. The wrapper is raised with z-index so media spills across the seam onto the neighbouring panel." },
];

const GRID_PROPS = [
  { name: "type", type: '"default" | "secondary" | "primary" | "alternative"', default: '"secondary"', description: "Background of the outer container. Also sets the gap and padding colour, creating the notch effect where cell corners meet." },
  { name: "cols", type: "2 | 3 | 4", default: "3", description: "Number of equal-width columns." },
  { name: "gap", type: '"sm" | "md" | "lg"', default: '"md"', description: "Gap between cells. Equal to the outer padding so the grid border and inner gaps are visually consistent." },
  { name: "rounded", type: '"md" | "lg" | "xl"', default: '"xl"', description: "Border radius of the outer container. Should be slightly larger than the cell radius to avoid sharp corners." },
];

const CELL_PROPS = [
  { name: "type", type: '"default" | "secondary" | "primary" | "alternative" | "dark-card"', default: '"primary"', description: "Cell background. Choose based on the container type — primary cells on alternative containers, dark-card or alternative cells on primary containers." },
  { name: "colSpan", type: "1 | 2 | 3 | 4", default: "1", description: "Columns this cell spans." },
  { name: "rowSpan", type: "1 | 2 | 3", default: "1", description: "Rows this cell spans. Use rowSpan={2} for tall feature cells." },
  { name: "minH", type: "string", description: 'Tailwind min-height class, e.g. "min-h-36". Keeps cells proportional when row content is short.' },
];

const FEATURE_PROPS = [
  { name: "icon", type: "ReactNode", description: "Lucide icon (or any SVG). Rendered at the top of the cell." },
  { name: "label", type: "string", description: "Primary label pinned to the bottom-left of the cell." },
  { name: "description", type: "string", description: "Optional secondary text beneath the label." },
  { name: "visual", type: "ReactNode", description: "Optional visual element (illustration, chart, screenshot) placed between icon and label." },
];

const CONTENT_PROPS = [
  { name: "eyebrow", type: "string", description: "Small all-caps label above the heading. Colour adapts to cell type (lime on dark, muted on light)." },
  { name: "heading", type: "string", description: "Section heading in the Young Serif display font." },
  { name: "body", type: "string", description: "Supporting paragraph text." },
  { name: "footer", type: "ReactNode", description: "Optional slot for a CTA button or link below the body copy." },
  { name: "padding", type: '"sm" | "md" | "lg"', default: '"md"', description: "Internal padding of the cell." },
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
          A composable bento grid system. The outer container background doubles as the gap
          colour, creating the characteristic notch effect at inner corners. Four background
          types work across all Section states — light, dark, and accent.
        </p>
      </div>

      {/* ── Installation ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* ── Feature grid — alternative (lime-soft) ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Feature grid</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Icon top-left, label bottom-left. Outer container is <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">alternative</code> (lime-soft),
          cells are <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">primary</code> (forest). Use{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">rowSpan</code> and{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">colSpan</code> to create asymmetric hierarchy.
        </p>

        <ComponentPreview label="alternative container · primary cells">
          <BentoGrid type="alternative" cols={3} className="w-full">
            <BentoFeatureCell
              icon={<FileText />}
              label="Levy management"
              type="primary"
            />
            <BentoFeatureCell
              icon={<BarChart3 />}
              label="Financial reporting"
              type="primary"
              rowSpan={2}
              minH="min-h-52"
            />
            <BentoFeatureCell
              icon={<Bell />}
              label="Owner notifications"
              type="primary"
            />
            <BentoFeatureCell
              icon={<Globe />}
              label="Online owner portal"
              type="primary"
              colSpan={2}
            />
          </BentoGrid>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={FEATURE_GRID_CODE} language="tsx" />
        </div>
      </section>

      {/* ── Feature grid — primary (forest) ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Feature grid — dark</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Same structure on a <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">primary</code> (forest) container.
          Mix <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">dark-card</code> and{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">alternative</code> cells to create emphasis within the dark section.
        </p>

        <ComponentPreview label="primary container · dark-card + alternative cells">
          <BentoGrid type="primary" cols={3} className="w-full">
            <BentoFeatureCell
              icon={<Shield />}
              label="Audit trail"
              type="dark-card"
            />
            <BentoFeatureCell
              icon={<Zap />}
              label="Automation"
              description="Set and forget recurring tasks."
              type="alternative"
              rowSpan={2}
              minH="min-h-52"
            />
            <BentoFeatureCell
              icon={<Users />}
              label="Role permissions"
              type="dark-card"
            />
            <BentoFeatureCell
              icon={<Search />}
              label="Global search"
              type="dark-card"
              colSpan={2}
            />
          </BentoGrid>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={DARK_FEATURE_CODE} language="tsx" />
        </div>
      </section>

      {/* ── Content grid — secondary ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Content grid</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Alternating text and visual cells. The <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">BentoContentCell</code> handles
          eyebrow + Young Serif heading + body copy. The <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">BentoVisualCell</code> is a
          fill container for screenshots, illustrations, or UI previews.
        </p>

        <ComponentPreview label="secondary container · content + visual cells">
          <BentoGrid type="secondary" cols={2} gap="lg" className="w-full">
            <BentoContentCell
              eyebrow="Built for managers"
              heading="Made for your strata team"
              body="Levy notices, maintenance requests, AGM minutes and owner queries — all in one place."
              type="default"
              padding="lg"
            />
            <BentoVisualCell type="primary" minH="min-h-48">
              <div className="flex flex-col items-start gap-2 p-5 w-full">
                <div className="w-full h-2 rounded-full bg-white/10" />
                <div className="w-3/4 h-2 rounded-full bg-white/10" />
                <div className="mt-3 w-full h-16 rounded-sm bg-white/5 border border-white/10" />
                <div className="w-1/2 h-2 rounded-full bg-[#C8F169]/40 mt-2" />
                <div className="w-2/3 h-2 rounded-full bg-white/10" />
              </div>
            </BentoVisualCell>
            <BentoVisualCell type="dark-card" minH="min-h-48">
              <div className="flex flex-col items-start gap-2 p-5 w-full">
                <div className="text-[10px] font-mono text-white/30 mb-1">SP12345</div>
                <div className="w-full h-2 rounded-full bg-white/10" />
                <div className="w-2/3 h-2 rounded-full bg-white/10" />
                <div className="mt-3 grid grid-cols-3 gap-1.5 w-full">
                  {[40, 65, 50, 80, 55, 70].map((h, i) => (
                    <div key={i} className="flex items-end h-10">
                      <div
                        className="w-full rounded-sm bg-[#C8F169]/50"
                        style={{ height: `${h}%` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </BentoVisualCell>
            <BentoContentCell
              eyebrow="Owner experience"
              heading="And the owners you serve"
              body="A self-service portal means fewer calls, more transparency, and owners who trust you."
              type="alternative"
              padding="lg"
            />
          </BentoGrid>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={CONTENT_GRID_CODE} language="tsx" />
        </div>
      </section>

      {/* ── Split overlap — the signature brand element ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Split overlap</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          The signature interlocking layout. Two columns of stacked panels where the right
          column is <strong className="font-semibold text-foreground">staggered down</strong> to
          create a woven rhythm, panels alternate off-white ↔ lime, and media can{" "}
          <strong className="font-semibold text-foreground">bleed across the seam</strong> with{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">BentoBleed</code> for depth.
        </p>

        <ComponentPreview label="BentoSplit · staggered columns with cross-seam bleed">
          <div className="w-full">
            <BentoSplit
              stagger={56}
              left={[
                <BentoSplitPanel key="a" type="secondary">
                  <h3 className="font-display text-2xl text-[#043F2E] mb-3">Made for your data team</h3>
                  <p className="text-sm text-[#4A7A62] leading-relaxed">
                    SQL, R, Python and data viz, all connected to help you deliver insights faster.
                    No rigid data model stands in the way of the analysis you need.
                  </p>
                </BentoSplitPanel>,
                <BentoSplitPanel key="b" type="secondary" padding="none" className="overflow-visible">
                  <BentoBleed bleed={{ right: 40, bottom: 24 }} className="p-6">
                    <div className="rounded-xl bg-[#043F2E] p-4 shadow-lg">
                      <p className="text-[10px] font-mono text-white/40 mb-2">SQL Editor</p>
                      <div className="space-y-1.5">
                        <div className="h-1.5 w-3/4 rounded-full bg-[#C8F169]/40" />
                        <div className="h-1.5 w-1/2 rounded-full bg-white/15" />
                        <div className="h-1.5 w-2/3 rounded-full bg-white/15" />
                      </div>
                      <div className="mt-3 h-8 rounded-sm bg-[#C8F169]" />
                    </div>
                  </BentoBleed>
                </BentoSplitPanel>,
              ]}
              right={[
                <BentoSplitPanel key="c" type="alternative" minH="min-h-44">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-[10px] font-mono text-[#043F2E]/50">Faceted Combo</p>
                    <span className="rounded-sm bg-[#043F2E] px-2 py-1 text-[10px] text-white">Share</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1.5 items-end h-20">
                    {[50, 70, 45, 85, 60, 75].map((h, i) => (
                      <div key={i} className="rounded-sm bg-[#043F2E]/70" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </BentoSplitPanel>,
                <BentoSplitPanel key="d" type="alternative">
                  <h3 className="font-display text-2xl text-[#043F2E] mb-3">And the teams you work with</h3>
                  <p className="text-sm text-[#043F2E]/70 leading-relaxed">
                    Deliver tools for easy, trusted self-service. Everyone&apos;s analytical tools live
                    in one place, without long implementation times or tedious maintenance.
                  </p>
                </BentoSplitPanel>,
              ]}
            />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={SPLIT_CODE} language="tsx" />
        </div>
      </section>

      {/* ── 4-up small grid ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">4-column icon grid</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Uniform small cards — good for listing many capabilities at a glance. Works on any section background.
        </p>

        <ComponentPreview label="alternative container · 4-col · primary cells">
          <BentoGrid type="alternative" cols={4} gap="sm" className="w-full">
            {[
              { icon: <FileText />, label: "Levy notices" },
              { icon: <MessageSquare />, label: "Communications" },
              { icon: <LayoutGrid />, label: "Scheme overview" },
              { icon: <BarChart3 />, label: "Financials" },
              { icon: <Users />, label: "Owner directory" },
              { icon: <Settings />, label: "Settings" },
              { icon: <Shield />, label: "Compliance" },
              { icon: <Bell />, label: "Notifications" },
            ].map(({ icon, label }) => (
              <BentoFeatureCell
                key={label}
                icon={icon}
                label={label}
                type="primary"
                minH="min-h-28"
              />
            ))}
          </BentoGrid>
        </ComponentPreview>
      </section>

      {/* ── Background context guide ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Background context guide</h2>
        <div className="rounded-sm border border-border overflow-hidden">
          {[
            ["Section type", "Grid container type", "Recommended cell types"],
            ["default / white", "secondary", "default, alternative"],
            ["secondary (off-white)", "default or alternative", "default, primary, dark-card"],
            ["primary (forest)", "primary", "dark-card, alternative"],
            ["alternative (lime-soft)", "alternative", "primary, dark-card"],
          ].map(([a, b, c], i) => (
            <div
              key={a}
              className={`flex gap-4 px-4 py-3 border-b border-border last:border-0 ${i === 0 ? "bg-secondary" : ""}`}
            >
              <span className={`text-xs w-40 shrink-0 ${i === 0 ? "font-semibold text-foreground" : "font-mono text-foreground"}`}>{a}</span>
              <span className={`text-xs w-44 shrink-0 ${i === 0 ? "font-semibold text-foreground" : "font-mono text-ink-muted"}`}>{b}</span>
              <span className={`text-xs ${i === 0 ? "font-semibold text-foreground" : "font-mono text-ink-muted"}`}>{c}</span>
            </div>
          ))}
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
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BentoFeatureCell Props</h2>
        <p className="text-xs text-ink-muted mb-3">Extends BentoCell props.</p>
        <PropTable props={FEATURE_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BentoContentCell Props</h2>
        <p className="text-xs text-ink-muted mb-3">Extends BentoCell props.</p>
        <PropTable props={CONTENT_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BentoSplit Props</h2>
        <PropTable props={SPLIT_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BentoBleed Props</h2>
        <p className="text-xs text-ink-muted mb-3">BentoSplitPanel extends BentoCell props with a padding prop.</p>
        <PropTable props={BLEED_PROPS} />
      </section>

    </DocsPage>
  );
}
