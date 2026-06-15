import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { PropTable } from "@/components/docs/prop-table";
import { Testimonial, TestimonialBlock } from "@/components/ui/testimonial";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/testimonial/registry.json`;

const CARD_CODE = `import { Testimonial } from "@/components/ui/testimonial"

<Testimonial
  quote="Instant Strata saves approximately 30% of my time, so I can focus on the issues that actually matter to owners."
  name="Sarah Mitchell"
  role="Senior Strata Manager"
  company="Coastal Strata Co."
  portrait={{ src: "/portrait.jpg", alt: "Sarah Mitchell" }}
  cta={{ label: "Read story", href: "/stories/sarah" }}
  type="alternative"
/>`;

const CARD_PRIMARY_CODE = `// Same layout, primary (forest) card — works on white or off-white sections
<Testimonial
  quote="..."
  name="Sarah Mitchell"
  role="Senior Strata Manager"
  company="Coastal Strata Co."
  type="primary"
/>`;

const BLOCK_CODE = `import { TestimonialBlock } from "@/components/ui/testimonial"

// Full-width centred variant — used inside a dark Section
<Section type="primary" contained>
  <TestimonialBlock
    quote="Instant Strata saves approximately 30% of my time, so I can focus on the issues that actually matter to owners."
    name="Sarah Mitchell"
    role="Senior Strata Manager"
    company="Coastal Strata Co."
    type="dark"
    size="lg"
    cta={{ label: "Read story", href: "/stories/sarah" }}
  />
</Section>`;

const PROPS = [
  { name: "quote", type: "string", description: "The testimonial text. Rendered in Grenette display font." },
  { name: "name", type: "string", description: "Person's full name." },
  { name: "role", type: "string", description: "Job title or role." },
  { name: "company", type: "string", description: "Company or organisation name shown next to the logo." },
  { name: "companyLogo", type: "ReactNode", description: "Company logo — any img, svg, or icon. Sized to h-5 automatically." },
  { name: "portrait", type: "{ src: string; alt?: string }", description: "Portrait photo. Renders as an independent floating card to the top-right, 4:5 aspect ratio, rounded-xl. Hidden below sm breakpoint." },
  { name: "cta", type: "{ label: string; href: string }", description: "Optional call-to-action link in the attribution row. Colour adapts to the card type." },
  { name: "type", type: '"alternative" | "primary" | "dark"', default: '"alternative"', description: "Card colour. alternative = lime-soft (for light sections). primary = forest (for light sections). dark = lime-soft card used inside a dark/forest section." },
];

const BLOCK_PROPS = [
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Quote text size. lg suits hero-adjacent sections; sm suits sidebar or compact contexts." },
  { name: "type", type: '"alternative" | "primary" | "dark"', default: '"dark"', description: "Card colour. dark renders a lime-soft card with a very faint decorative mark behind it — designed to sit inside a forest Section." },
];

/* ── Placeholder portrait for demos ───────────── */
function PortraitPlaceholder() {
  return (
    <div className="w-full h-full bg-[#0A5C3D] flex items-end justify-center pb-0 overflow-hidden">
      {/* Silhouette */}
      <svg viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 opacity-30">
        <circle cx="60" cy="45" r="28" fill="white" />
        <ellipse cx="60" cy="140" rx="52" ry="48" fill="white" />
      </svg>
    </div>
  );
}

export default function TestimonialPage() {
  return (
    <div className="max-w-prose mx-auto px-8 py-14">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Testimonial</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          Two testimonial layouts. <strong className="text-foreground font-semibold">Testimonial</strong> — a floating card
          with an independent portrait and <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm">,,</code> quote
          marks that bleed below the card edge. <strong className="text-foreground font-semibold">TestimonialBlock</strong> — a full-width
          card with a faint decorative mark behind it, designed for dark sections.
        </p>
      </div>

      {/* ── Installation ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* ── Testimonial — alternative (lime-soft) ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Card — alternative</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Lime-soft card with the portrait floating independently to the right.
          Quote marks bleed below the card's bottom-left corner.
          Use on white or off-white sections.
        </p>
        <ComponentPreview label="alternative · with portrait">
          <div className="w-full py-4">
            <Testimonial
              quote="Instant Strata saves approximately 30% of my time, so I can focus on the issues that actually matter to owners."
              name="Sarah Mitchell"
              role="Senior Strata Manager"
              company="Coastal Strata Co."
              portrait={{ src: "", alt: "Sarah Mitchell" }}
              cta={{ label: "Read story", href: "#" }}
              type="alternative"
            />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={CARD_CODE} language="tsx" />
        </div>
      </section>

      {/* ── Testimonial — primary (forest) ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Card — primary</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Forest card — high contrast on light backgrounds. CTA automatically switches to lime.
        </p>
        <ComponentPreview label="primary · without portrait">
          <div className="w-full py-4">
            <Testimonial
              quote="The levy notice workflow used to take our team a full day. Now it's done before morning tea."
              name="James O'Brien"
              role="Building Manager"
              company="Harbor View Strata"
              cta={{ label: "Read story", href: "#" }}
              type="primary"
            />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={CARD_PRIMARY_CODE} language="tsx" />
        </div>
      </section>

      {/* ── TestimonialBlock — dark section ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Block — dark section</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Full-width variant for use inside a <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">Section type="primary"</code>.
          Lime-soft card sits against the forest background. Decorative <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">,,</code> marks
          sit behind the card at low opacity.
        </p>
        <ComponentPreview label="dark section · block variant">
          <div className="w-full bg-[#043F2E] rounded-sm px-8 py-12">
            <TestimonialBlock
              quote="Instant Strata saves approximately 30% of my time, so I can focus on the issues that actually matter to owners."
              name="Sarah Mitchell"
              role="Senior Strata Manager"
              company="Coastal Strata Co."
              type="dark"
              size="md"
              cta={{ label: "Read story", href: "#" }}
            />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={BLOCK_CODE} language="tsx" />
        </div>
      </section>

      {/* ── Block size variants ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Block — size variants</h2>
        <ComponentPreview label="alternative section · sm / md / lg sizes">
          <div className="w-full space-y-6">
            {(["sm", "md", "lg"] as const).map((size) => (
              <div key={size} className="relative">
                <p className="text-[9px] font-mono text-ink-muted mb-2 uppercase tracking-widest">{size}</p>
                <TestimonialBlock
                  quote="Managing strata used to mean spreadsheets and sticky notes. Not anymore."
                  name="Sarah Mitchell"
                  role="Senior Strata Manager"
                  type="alternative"
                  size={size}
                />
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* ── Section context guide ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Section context guide</h2>
        <div className="rounded-sm border border-border overflow-hidden">
          {[
            ["Section background", "Recommended type", "Notes"],
            ["white / default", "alternative", "Lime-soft card pops on white"],
            ["secondary (off-white)", "alternative or primary", "Both work; primary gives more contrast"],
            ["primary (forest)", "dark", "Use TestimonialBlock; lime-soft card on forest"],
            ["alternative (lime-soft)", "primary", "Forest card on lime-soft"],
          ].map(([a, b, c], i) => (
            <div
              key={a}
              className={`flex gap-4 px-4 py-3 border-b border-border last:border-0 text-xs ${i === 0 ? "bg-secondary font-semibold text-foreground" : "text-ink-muted"}`}
            >
              <span className={`w-44 shrink-0 ${i > 0 ? "font-mono text-foreground" : ""}`}>{a}</span>
              <span className={`w-40 shrink-0 ${i > 0 ? "font-mono" : ""}`}>{b}</span>
              <span>{c}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Props — Testimonial ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Testimonial Props</h2>
        <PropTable props={PROPS} />
      </section>

      {/* ── Props — TestimonialBlock ── */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">TestimonialBlock Props</h2>
        <p className="text-xs text-ink-muted mb-4">Extends Testimonial props (without portrait).</p>
        <PropTable props={BLOCK_PROPS} />
      </section>

    </div>
  );
}
