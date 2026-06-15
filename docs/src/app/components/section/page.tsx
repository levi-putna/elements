import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Section, Container } from "@/components/ui/section";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/section/registry.json`;

const USAGE = `import { Section } from "@/components/ui/section"

export function Page() {
  return (
    <>
      <Section type="default" contained>
        <h1>Welcome</h1>
        <p>White background — the default for most sections.</p>
      </Section>

      <Section type="secondary" contained>
        <p>Off-white differentiation between adjacent sections.</p>
      </Section>

      <Section type="primary" contained>
        <p className="text-white">Forest green — hero, footer, or testimonial band.</p>
      </Section>

      <Section type="alternative" contained>
        <p>Lime-soft accent — call-to-action strips.</p>
      </Section>
    </>
  )
}`;

const WITHOUT_CONTAINED = `{/* No contained prop — children span full width */}
<Section type="primary">
  <div className="w-full h-64 flex items-center justify-center">
    Full-bleed hero image or video here
  </div>
</Section>

{/* contained prop — wraps in max-w-[1200px] with standard padding */}
<Section type="primary" contained>
  <h1 className="text-white text-4xl font-bold">Build faster.</h1>
</Section>`;

const AS_PROP = `{/* Semantic HTML via the as prop */}
<Section as="header" type="primary" contained>
  <nav>…</nav>
</Section>

<Section as="footer" type="secondary" contained>
  <p>© 2025 Instant Strata</p>
</Section>

<Section as="main" type="default" contained>
  {children}
</Section>`;

const CONTAINER_CODE = `import { Section, Container } from "@/components/ui/section"

{/* The colour band is full-bleed; Container manages width.
    Use them separately when one band needs both a full-bleed
    visual and a constrained text column. */}
<Section type="primary" spacing="lg">
  <FullBleedVisual />
  <Container width="prose">
    <h2>Constrained reading column inside a full-bleed band</h2>
  </Container>
</Section>

{/* Or let Section wrap children for you. contained accepts a
    width name: "prose" | "default" | "wide" | "full". */}
<Section type="secondary" contained="wide">
  <BentoGrid>…</BentoGrid>
</Section>`;

const PROPS = [
  { name: "type", type: '"default" | "white" | "secondary" | "primary" | "alternative"', default: '"default"', description: 'Background style. "default" and "white" are identical (white bg, forest text). "secondary" uses off-white. "primary" uses forest green with white text. "alternative" uses lime-soft.' },
  { name: "spacing", type: '"none" | "sm" | "md" | "lg"', default: '"lg"', description: "Vertical padding of the band. lg = py-24 md:py-32, md = py-20 md:py-28, sm = py-12 md:py-16." },
  { name: "as", type: '"section" | "div" | "article" | "header" | "footer" | "main"', default: '"section"', description: "The HTML element to render. Choose semantically: use header for page headers, footer for footers, main for the primary content area." },
  { name: "contained", type: 'boolean | "prose" | "default" | "wide" | "full"', default: "false", description: "Convenience: wrap children in a Container of this width. true maps to \"default\" (1200px). Pass false to manage the Container yourself." },
  { name: "className", type: "string", description: "Additional classes applied to the outer element. The type's background and text classes are always included." },
  { name: "children", type: "ReactNode", description: "Section content." },
];

const CONTAINER_PROPS = [
  { name: "width", type: '"prose" | "default" | "wide" | "full"', default: '"default"', description: "Max content width. prose = 740px, default = 1200px, wide = 1360px, full = no limit (gutter only)." },
  { name: "gutter", type: "boolean", default: "true", description: "Apply the responsive horizontal gutter (px-6 md:px-12)." },
  { name: "className", type: "string", description: "Additional classes on the container." },
];

const TYPES = [
  { type: "default", bg: "bg-white", label: "Default / White", usage: "Most sections. White background with forest text." },
  { type: "secondary", bg: "bg-[#EEF2E3]", label: "Secondary", usage: "Off-white. Alternate adjacent sections to create rhythm without heavy contrast." },
  { type: "primary", bg: "bg-[#043F2E]", label: "Primary", usage: "Forest green with white text. Hero sections, footers, testimonial bands. Use sparingly — max 2–3 per page." },
  { type: "alternative", bg: "bg-[#EBF8C2]", label: "Alternative", usage: "Lime-soft. Call-to-action strips or feature highlights." },
] as const;

export default function SectionPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Section</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          Page section wrapper with typed backgrounds. Keeps Instant Strata colour usage
          consistent across pages — four named background types, an optional max-width container,
          and a semantic <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">as</code> prop for correct HTML structure.
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
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">Types</h2>
        <div className="space-y-3">
          {TYPES.map(({ type, bg, label, usage }) => (
            <div key={type} className="rounded-sm border border-border overflow-hidden">
              <div className={`${bg} px-4 py-6 flex items-center gap-3`}>
                <span className={`text-xs font-mono ${type === "primary" ? "text-white/60" : "text-[#043F2E]/50"}`}>{type}</span>
                <span className={`text-sm font-semibold ${type === "primary" ? "text-white" : "text-[#043F2E]"}`}>{label}</span>
              </div>
              <div className="px-4 py-2.5 bg-white border-t border-border">
                <p className="text-xs text-ink-muted">{usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">Examples</h2>

        <div className="space-y-10">

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Live preview</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              All four types stacked with <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">contained</code> enabled.
            </p>
            <ComponentPreview label="Preview">
              <div className="w-full rounded-sm overflow-hidden border border-border">
                <Section type="default" contained className="!py-6">
                  <p className="text-sm font-semibold">default</p>
                  <p className="text-xs text-ink-muted">White background</p>
                </Section>
                <Section type="secondary" contained className="!py-6">
                  <p className="text-sm font-semibold">secondary</p>
                  <p className="text-xs text-ink-muted">Off-white background</p>
                </Section>
                <Section type="primary" contained className="!py-6">
                  <p className="text-sm font-semibold text-white">primary</p>
                  <p className="text-xs text-white/60">Forest green background</p>
                </Section>
                <Section type="alternative" contained className="!py-6">
                  <p className="text-sm font-semibold">alternative</p>
                  <p className="text-xs text-ink-muted">Lime-soft background</p>
                </Section>
              </div>
            </ComponentPreview>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">contained vs full-bleed</p>
            <CodeBlock code={WITHOUT_CONTAINED} language="tsx" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Semantic elements with as prop</p>
            <CodeBlock code={AS_PROP} language="tsx" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Width system — Section + Container</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              The colour band is full-bleed; <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">Container</code> is
              the single source of truth for content width. Use them together when a band needs both
              a full-bleed visual and a constrained text column.
            </p>
            <ComponentPreview label="Container widths">
              <div className="w-full space-y-2">
                {(["prose", "default", "wide", "full"] as const).map((w) => (
                  <div key={w} className="bg-secondary rounded-sm py-2">
                    <Container width={w} gutter={false} className="bg-[#043F2E] rounded-sm py-2 text-center">
                      <span className="text-xs font-mono text-white/80">width=&quot;{w}&quot;</span>
                    </Container>
                  </div>
                ))}
              </div>
            </ComponentPreview>
            <div className="mt-3">
              <CodeBlock code={CONTAINER_CODE} language="tsx" />
            </div>
          </div>

        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Section Props</h2>
        <PropTable props={PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Container Props</h2>
        <PropTable props={CONTAINER_PROPS} />
      </section>

    </DocsPage>
  );
}
