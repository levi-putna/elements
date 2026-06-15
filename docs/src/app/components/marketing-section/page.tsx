import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Container, Section } from "@/components/ui/section";
import {
  MarketingSpotlight,
  MARKETING_SPOTLIGHT_DEFAULT,
  MarketingBenefits,
  MARKETING_BENEFITS_DEFAULT,
  MarketingVisual,
  MARKETING_VISUAL_DEFAULT,
  MarketingCycle,
  MARKETING_CYCLE_DEFAULT,
  MarketingTour,
  MARKETING_TOUR_DEFAULT,
  MarketingGoverned,
  MARKETING_GOVERNED_DEFAULT,
} from "@/components/ui/marketing-section";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/marketing-section/registry.json`;

const SPOTLIGHT_USAGE = `import {
  MarketingSpotlight,
  MARKETING_SPOTLIGHT_DEFAULT,
} from "@/components/ui/marketing-section"
import { Section, Container } from "@/components/ui/section"

export function SelfServeSection() {
  return (
    <Section type="default" spacing="lg">
      <Container>
        <MarketingSpotlight {...MARKETING_SPOTLIGHT_DEFAULT} />
      </Container>
    </Section>
  )
}`;

const BENEFITS_USAGE = `import {
  MarketingBenefits,
  MARKETING_BENEFITS_DEFAULT,
} from "@/components/ui/marketing-section"

<MarketingBenefits {...MARKETING_BENEFITS_DEFAULT} />`;

const VISUAL_USAGE = `import {
  MarketingVisual,
  MARKETING_VISUAL_DEFAULT,
} from "@/components/ui/marketing-section"

<MarketingVisual {...MARKETING_VISUAL_DEFAULT} />`;

const CYCLE_USAGE = `import {
  MarketingCycle,
  MARKETING_CYCLE_DEFAULT,
} from "@/components/ui/marketing-section"

<MarketingCycle {...MARKETING_CYCLE_DEFAULT} />`;

const TOUR_USAGE = `import {
  MarketingTour,
  MARKETING_TOUR_DEFAULT,
} from "@/components/ui/marketing-section"

<MarketingTour {...MARKETING_TOUR_DEFAULT} />`;

const GOVERNED_USAGE = `import {
  MarketingGoverned,
  MARKETING_GOVERNED_DEFAULT,
} from "@/components/ui/marketing-section"

<MarketingGoverned {...MARKETING_GOVERNED_DEFAULT} />`;

const SPOTLIGHT_PROPS = [
  { name: "eyebrow", type: "string", description: "Optional uppercase label above the heading." },
  { name: "heading", type: "string", description: "Young Serif section title." },
  { name: "body", type: "string", description: "Supporting paragraph." },
  { name: "visual", type: "ReactNode", description: "Right-hand illustration slot. Defaults to MarketingSpotlightVisual." },
  { name: "testimonial", type: "{ quote, name, role }", description: "Optional blockquote beneath the grid." },
  { name: "link", type: "{ href, label? }", description: "Optional trailing learn-more link." },
];

const BENEFITS_PROPS = [
  { name: "heading", type: "string", description: "Section title." },
  { name: "intro", type: "string", description: "Introductory paragraph beneath the title." },
  { name: "items", type: "MarketingBenefitItem[]", description: "Grid of { title, description } benefit cards." },
  { name: "cols", type: "2 | 3", default: "3", description: "Desktop column count for the benefit grid." },
];

const VISUAL_PROPS = [
  { name: "eyebrow", type: "string", description: "Optional uppercase label." },
  { name: "heading", type: "string", description: "Section title." },
  { name: "intro", type: "string", description: "Optional supporting paragraph." },
  { name: "visual", type: "ReactNode", description: "Large chart or screenshot slot. Defaults to MarketingVisualChart." },
  { name: "features", type: "MarketingVisualFeature[]", description: "Row of sub-features beneath the visual." },
];

const CYCLE_PROPS = [
  { name: "lines", type: "string[]", description: "Display statement lines, each rendered as a Young Serif row." },
  { name: "supporting", type: "string", description: "Optional paragraph beneath the statement." },
  { name: "tone", type: '"off-white" | "accent" | "forest"', default: '"off-white"', description: "Background tone for the statement band." },
];

const TOUR_PROPS = [
  { name: "heading", type: "string", description: "Section title." },
  { name: "description", type: "string", description: "Supporting paragraph." },
  { name: "href", type: "string", description: "Tour link destination." },
  { name: "actionLabel", type: "string", default: '"Take the product tour"', description: "CTA button label." },
  { name: "visual", type: "ReactNode", description: "Thumbnail slot. Defaults to MarketingTourThumbnail." },
];

const GOVERNED_PROPS = [
  { name: "heading", type: "string", description: "Section title." },
  { name: "intro", type: "string", description: "Introductory paragraph." },
  { name: "features", type: "MarketingGovernedFeature[]", description: "Two (or more) FeatureCard items with title, description, href, and optional visual." },
];

const SECTIONS = [
  {
    id: "spotlight",
    modeRef: "End-to-end self-service reporting, your way",
    modeUrl: "https://mode.com/toolkits/modern-business-intelligence",
    title: "MarketingSpotlight",
    description:
      "Two-column feature spotlight with optional testimonial. Inspired by Mode's Datasets section on the Modern BI toolkit page.",
    preview: <MarketingSpotlight {...MARKETING_SPOTLIGHT_DEFAULT} />,
    code: SPOTLIGHT_USAGE,
    props: SPOTLIGHT_PROPS,
    propsTitle: "MarketingSpotlight Props",
  },
  {
    id: "benefits",
    modeRef: "Turn your analytical work up to 11",
    modeUrl: "https://mode.com/ad-hoc-analysis",
    title: "MarketingBenefits",
    description:
      "Section header with a responsive grid of compact benefit cards. Inspired by Mode's ad hoc analysis benefits grid.",
    preview: <MarketingBenefits {...MARKETING_BENEFITS_DEFAULT} />,
    code: BENEFITS_USAGE,
    props: BENEFITS_PROPS,
    propsTitle: "MarketingBenefits Props",
  },
  {
    id: "visual",
    modeRef: "Visual thinkers welcome",
    modeUrl: "https://mode.com/self-serve-reporting",
    title: "MarketingVisual",
    description:
      "Large visual with a row of sub-features beneath. Inspired by Mode's Visual Explorer section on the self-serve page.",
    preview: <MarketingVisual {...MARKETING_VISUAL_DEFAULT} />,
    code: VISUAL_USAGE,
    props: VISUAL_PROPS,
    propsTitle: "MarketingVisual Props",
  },
  {
    id: "cycle",
    modeRef: "The cycle of ad hoc analysis to self-serve reporting…",
    modeUrl: "https://mode.com/platform",
    title: "MarketingCycle",
    description:
      "Large editorial statement band with stacked display lines. Inspired by Mode's platform overview cycle statement.",
    preview: <MarketingCycle {...MARKETING_CYCLE_DEFAULT} />,
    code: CYCLE_USAGE,
    props: CYCLE_PROPS,
    propsTitle: "MarketingCycle Props",
  },
  {
    id: "tour",
    modeRef: "Take the tour, on your time",
    modeUrl: "https://mode.com/platform",
    title: "MarketingTour",
    description:
      "Product tour CTA with copy and a playable thumbnail. Inspired by Mode's platform product tour section.",
    preview: <MarketingTour {...MARKETING_TOUR_DEFAULT} />,
    code: TOUR_USAGE,
    props: TOUR_PROPS,
    propsTitle: "MarketingTour Props",
  },
  {
    id: "governed",
    modeRef: "Curated and governed data, ready to be explored",
    modeUrl: "https://mode.com/self-serve-reporting",
    title: "MarketingGoverned",
    description:
      "Intro plus two FeatureCard columns for governed datasets. Inspired by Mode's self-serve governed data section.",
    preview: <MarketingGoverned {...MARKETING_GOVERNED_DEFAULT} />,
    code: GOVERNED_USAGE,
    props: GOVERNED_PROPS,
    propsTitle: "MarketingGoverned Props",
  },
] as const;

/**
 * Documentation for Mode-inspired marketing section blocks.
 */
export default function MarketingSectionPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Marketing Section
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Six composed landing page sections adapted from{" "}
          <a
            href="https://mode.com/platform"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mode
          </a>
          {" "}marketing layouts, restyled for Instant Strata. Wrap each block in{" "}
          <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            Section
          </code>{" "}
          and{" "}
          <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            Container
          </code>{" "}
          for full-bleed backgrounds and constrained content width.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL} language="bash" />
        <p className="text-xs text-ink-muted mt-2">
          Also installs{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">card</code> and{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">infographic</code>{" "}
          dependencies.
        </p>
      </section>

      {SECTIONS.map((section, index) => (
        <section
          key={section.id}
          className={index === 0 ? "mb-10" : "mb-10 pt-10 border-t border-border"}
        >
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
            Mode reference
          </p>
          <p className="text-sm text-ink-muted mb-1">
            <a
              href={section.modeUrl}
              className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {section.modeRef}
            </a>
          </p>

          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2 mt-6">
            {section.title}
          </h2>
          <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
            {section.description}
          </p>

          <ComponentPreview label={`${section.title} preview`}>
            <Section type="default" spacing="md" className="!py-8 md:!py-12">
              <Container>{section.preview}</Container>
            </Section>
          </ComponentPreview>

          <div className="mt-4">
            <CodeBlock code={section.code} language="tsx" />
          </div>

          <div className="mt-8">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
              {section.propsTitle}
            </h3>
            <PropTable props={section.props} />
          </div>
        </section>
      ))}

    </DocsPage>
  );
}
