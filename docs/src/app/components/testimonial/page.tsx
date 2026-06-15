import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Testimonial, TestimonialBlock } from "@/components/ui/testimonial";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/testimonial/registry.json`;

const CARD_CODE = `import { Testimonial } from "@/components/ui/testimonial"

<Testimonial
  quote="Instant Strata saves approximately 30% of my time, so I can focus on the issues that actually matter to owners."
  name="Sarah Mitchell"
  role="Senior Strata Manager"
  company="Coastal Strata Co."
  portrait={{ src: "/img/person/1.jpg", alt: "Sarah Mitchell" }}
  cta={{ label: "Read story", href: "/stories/sarah" }}
  type="alternative"
/>`;

const CARD_DARK_CODE = `import { Testimonial } from "@/components/ui/testimonial"

// Inside a forest Section — bright lime card on dark background
<Section type="primary" contained>
  <Testimonial
    quote="Instant Strata is incredibly valuable as a full stack platform from strata managers all the way to committee members."
    name="James O'Brien"
    role="Building Manager"
    company="Harbor View Strata"
    portrait={{ src: "/img/person/2.jpg", alt: "James O'Brien" }}
    type="dark"
  />
</Section>`;

const CARD_PRIMARY_CODE = `// Forest card on a light section — quote marks use lime in the cutout
<Testimonial
  quote="The levy notice workflow used to take our team a full day. Now it's done before morning tea."
  name="James O'Brien"
  role="Building Manager"
  company="Harbor View Strata"
  type="primary"
/>`;

const BLOCK_CODE = `import { TestimonialBlock } from "@/components/ui/testimonial"

// Full-width variant without a portrait
<TestimonialBlock
  quote="Instant Strata saves approximately 30% of my time, so I can focus on the issues that actually matter to owners."
  name="Sarah Mitchell"
  role="Senior Strata Manager"
  company="Coastal Strata Co."
  type="dark"
  size="lg"
  cta={{ label: "Read story", href: "/stories/sarah" }}
/>`;

const PROPS = [
  { name: "quote", type: "string", description: "The testimonial text. Rendered in Young Serif display font." },
  { name: "name", type: "string", description: "Person's full name." },
  { name: "role", type: "string", description: "Job title or role." },
  { name: "company", type: "string", description: "Company or organisation name shown beside the logo." },
  { name: "companyLogo", type: "ReactNode", description: "Company logo — any img, svg, or icon. Sized to h-5 automatically." },
  { name: "portrait", type: "{ src: string; alt?: string }", description: "Portrait photo. Renders as a square card top-aligned to the right of the quote card. Hidden below sm breakpoint." },
  { name: "cta", type: "{ label: string; href: string }", description: "Optional call-to-action link in the attribution row. Forest button with lime text on lime cards." },
  { name: "type", type: '"alternative" | "primary" | "dark"', default: '"alternative"', description: "Card colour. alternative = bright lime on light sections. primary = forest on light sections. dark = bright lime card for use inside a forest Section." },
];

const BLOCK_PROPS = [
  { name: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Quote text size. lg suits hero-adjacent sections; sm suits sidebar or compact contexts." },
  { name: "type", type: '"alternative" | "primary" | "dark"', default: '"dark"', description: "Card colour. Uses the same stepped cutout layout as Testimonial, without a portrait." },
];

export default function TestimonialPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Testimonial</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          Mode-inspired testimonial layouts. A <strong className="text-foreground font-semibold">stepped lime card</strong> holds
          the quote and attribution, with an oversized <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm">,,</code> mark
          in a bottom-left cutout. An optional <strong className="text-foreground font-semibold">square portrait</strong> sits
          top-aligned to the right. <strong className="text-foreground font-semibold">TestimonialBlock</strong> is the same card
          without a portrait for full-width dark sections.
        </p>
      </div>

      {/* ── Installation ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* ── Testimonial — alternative (lime) ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Card — alternative</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Bright lime card on a light background. Quote marks sit in the bottom-left cutout on the page background.
          Portrait is a separate square image, top-aligned to the card.
        </p>
        <ComponentPreview label="alternative · with portrait">
          <div className="w-full py-4">
            <Testimonial
              quote="Instant Strata saves approximately 30% of my time, so I can focus on the issues that actually matter to owners."
              name="Sarah Mitchell"
              role="Senior Strata Manager"
              company="Coastal Strata Co."
              portrait={{ src: "/img/person/1.jpg", alt: "Sarah Mitchell" }}
              cta={{ label: "Read story", href: "#" }}
              type="alternative"
            />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={CARD_CODE} language="tsx" />
        </div>
      </section>

      {/* ── Testimonial — dark section with portrait ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Card — dark section</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          The primary homepage pattern from{" "}
          <a href="https://mode.com/" className="underline underline-offset-2 hover:text-foreground">
            Mode.com
          </a>
          : bright lime card on a forest section, square portrait to the right, company logo in the attribution row.
        </p>
        <ComponentPreview label="dark · with portrait">
          <div className="w-full bg-forest rounded-sm px-6 md:px-8 py-10 md:py-12">
            <Testimonial
              quote="Instant Strata is incredibly valuable as a full stack platform from strata managers all the way to committee members. Managers can go deep, owners get the updates they need, and our team gets to make everyone part of the strategy."
              name="James O'Brien"
              role="Building Manager"
              company="Harbor View Strata"
              portrait={{ src: "/img/person/2.jpg", alt: "James O'Brien" }}
              type="dark"
            />
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={CARD_DARK_CODE} language="tsx" />
        </div>
      </section>

      {/* ── Testimonial — primary (forest) ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Card — primary</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Forest card on a light background. Quote marks use lime in the cutout. CTA switches to lime fill.
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

      {/* ── TestimonialBlock — no portrait ── */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Block — without portrait</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Same stepped cutout card at full width when a portrait is not needed.
        </p>
        <ComponentPreview label="dark section · block variant">
          <div className="w-full bg-forest rounded-sm px-6 md:px-8 py-10 md:py-12">
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
        <ComponentPreview label="light section · sm / md / lg sizes">
          <div className="w-full space-y-8">
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
            ["white / default", "alternative", "Bright lime card on white"],
            ["secondary (off-white)", "alternative or primary", "Lime for Mode-style; forest for high contrast"],
            ["primary (forest)", "dark", "Bright lime card — use Testimonial with portrait"],
            ["alternative (lime-soft)", "primary", "Forest card on lime-soft accent"],
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

    </DocsPage>
  );
}
