import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  PageHeaderAction,
  PageHeaderEditorial,
  PageHeaderEditorialImage,
  PageHeaderFeatured,
  PageHeaderFeaturedImage,
  PageHeaderSplit,
  PageHeaderSplitVisual,
} from "@/components/ui/page-header";
import { StoryGridLogo } from "@/components/ui/story-grid";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/page-header/registry.json`;

const SPLIT_USAGE = `import {
  PageHeaderSplit,
  PageHeaderAction,
} from "@/components/ui/page-header"

export function ComparisonsPage() {
  return (
    <PageHeaderSplit
      eyebrow="Platform comparison"
      title="How Instant Strata compares"
      description="The search for modern strata management software that prioritises speed, flexibility and transparency is hard. See how Instant Strata stacks up against legacy tools and fragmented workflows."
      actions={
        <PageHeaderAction href="/demo" onDark>
          Request demo
        </PageHeaderAction>
      }
    />
  )
}`;

const EDITORIAL_USAGE = `import {
  PageHeaderEditorial,
  PageHeaderEditorialImage,
  PageHeaderAction,
} from "@/components/ui/page-header"

export function CustomersPage() {
  return (
    <PageHeaderEditorial
      title="Trusted by modern buildings"
      description="When every owner and committee pulls from the same trustworthy records, you can be confident better decisions are on the way."
      actions={
        <PageHeaderAction href="/demo">Request demo</PageHeaderAction>
      }
      visual={
        <PageHeaderEditorialImage
          src="/img/people/2.webp"
          alt="Strata managers collaborating in a bright office"
        />
      }
    />
  )
}`;

const FEATURED_USAGE = `import {
  PageHeaderFeatured,
  PageHeaderFeaturedImage,
  PageHeaderAction,
} from "@/components/ui/page-header"

export function FeaturedStory() {
  return (
    <PageHeaderFeatured
      title="The strata team at Harbourview delivers data from the centre"
      description="How Harbourview Towers drives impact with their management team at the centre of every building decision."
      actions={
        <PageHeaderAction href="/stories/harbourview">Read story</PageHeaderAction>
      }
      visual={
        <PageHeaderFeaturedImage
          src="/img/people/3.webp"
          alt="Harbourview strata manager on site"
          logo={<span className="text-sm font-semibold text-forest">Harbourview</span>}
        />
      }
    />
  )
}`;

const SPLIT_PROPS = [
  { name: "eyebrow", type: "string", description: "Small caps label above the headline: rendered in lime on the dark background." },
  { name: "title", type: "string", description: "Primary page title in Young Serif." },
  { name: "description", type: "string", description: "Supporting paragraph beneath the title." },
  { name: "actions", type: "ReactNode", description: "Call-to-action buttons. Use PageHeaderAction with onDark for the split variant." },
  { name: "visual", type: "ReactNode", description: "Right-hand visual slot. Defaults to PageHeaderSplitVisual." },
  { name: "className", type: "string", description: "Additional classes on the outer header element." },
];

const EDITORIAL_PROPS = [
  { name: "title", type: "string", description: "Primary page title in Young Serif." },
  { name: "description", type: "string", description: "Supporting paragraph beneath the title." },
  { name: "actions", type: "ReactNode", description: "Optional calls-to-action below the copy." },
  { name: "visual", type: "ReactNode", description: "Right-hand photo slot. Use PageHeaderEditorialImage." },
  { name: "className", type: "string", description: "Additional classes on the outer header element." },
];

const SPLIT_VISUAL_PROPS = [
  { name: "items", type: "string[]", description: "Faded labels arranged around the centre brand mark. Eight items fill the outer grid cells." },
  { name: "brand", type: "string", default: '"IS"', description: "Centre brand mark text." },
  { name: "className", type: "string", description: "Additional classes on the visual wrapper." },
];

const EDITORIAL_IMAGE_PROPS = [
  { name: "src", type: "string", description: "Image source URL." },
  { name: "alt", type: "string", description: "Accessible alt text for the photo." },
  { name: "className", type: "string", description: "Classes on the rounded wrapper div." },
  { name: "imgClassName", type: "string", description: "Classes on the inner img element." },
];

const FEATURED_PROPS = [
  { name: "eyebrow", type: "string", default: '"Featured customer"', description: "Small caps label above the headline." },
  { name: "title", type: "string", description: "Spotlight headline in Young Serif." },
  { name: "description", type: "string", description: "Supporting paragraph beneath the title." },
  { name: "actions", type: "ReactNode", description: "Call-to-action buttons below the copy." },
  { name: "visual", type: "ReactNode", description: "Left-hand photo slot. Use PageHeaderFeaturedImage." },
  { name: "className", type: "string", description: "Additional classes on the outer header element." },
];

const FEATURED_IMAGE_PROPS = [
  { name: "src", type: "string", description: "Image source URL." },
  { name: "alt", type: "string", description: "Accessible alt text for the photo." },
  { name: "logo", type: "ReactNode", description: "Logo or mark rendered in the top-right corner." },
  { name: "className", type: "string", description: "Classes on the portrait wrapper." },
  { name: "imgClassName", type: "string", description: "Classes on the inner img element." },
];

const ACTION_PROPS = [
  { name: "href", type: "string", description: "Link destination." },
  { name: "variant", type: '"primary" | "outline"', default: '"primary"', description: "Filled or bordered button style." },
  { name: "onDark", type: "boolean", default: "false", description: "When true, uses off-white fill on dark headers (split variant)." },
  { name: "className", type: "string", description: "Additional classes on the anchor." },
];

export default function PageHeaderPage() {
  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Page Header</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Three interior page header patterns inspired by{" "}
          <a
            href="https://mode.com/comparisons"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mode&apos;s comparisons
          </a>{" "}
          and{" "}
          <a
            href="https://mode.com/customers"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            customers
          </a>{" "}
          pages: adapted to Instant Strata brand tokens. Pair the featured header
          with the{" "}
          <a
            href="/components/story-grid"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Story Grid
          </a>{" "}
          for the story index below it.
        </p>
      </div>

      {/* Split variant */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Split header
        </h2>
        <p className="text-sm text-ink-muted mb-6 leading-relaxed max-w-2xl">
          Dark forest background with copy and CTA on the left, and a faded
          competitor grid with a centred brand mark on the right: matching the
          Mode comparisons hero layout.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          <PageHeaderSplit
            eyebrow="Platform comparison"
            title="How Instant Strata compares"
            description="The search for modern strata management software that prioritises speed, flexibility and transparency is hard. See how Instant Strata stacks up against legacy tools and fragmented workflows."
            actions={
              <PageHeaderAction href="#" onDark>
                Request demo
              </PageHeaderAction>
            }
          />
        </div>
      </section>

      {/* Editorial variant */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Editorial header
        </h2>
        <p className="text-sm text-ink-muted mb-6 leading-relaxed max-w-2xl">
          Off-white background with a tall photo on the right and headline plus
          body copy anchored bottom-left: matching the Mode customers page
          layout.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          <PageHeaderEditorial
            title="Trusted by modern buildings"
            description="When every owner and committee pulls from the same trustworthy records, you can be confident better decisions are on the way."
            actions={
              <PageHeaderAction href="#">Request demo</PageHeaderAction>
            }
            visual={
              <PageHeaderEditorialImage
                src="/elements/img/people/2.webp"
                alt="Strata managers collaborating in a bright office"
              />
            }
          />
        </div>
      </section>

      {/* Featured variant */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Featured header
        </h2>
        <p className="text-sm text-ink-muted mb-6 leading-relaxed max-w-2xl">
          White background with a portrait photo and logo badge on the left,
          eyebrow, title, body and CTA on the right: matching Mode&apos;s
          featured customer spotlight below the logo strip.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          <PageHeaderFeatured
            title="The strata team at Harbourview delivers data from the centre"
            description="How Harbourview Towers drives impact with their management team at the centre of every building decision."
            actions={
              <PageHeaderAction href="#">Read story</PageHeaderAction>
            }
            visual={
              <PageHeaderFeaturedImage
                src="/elements/img/people/3.webp"
                alt="Harbourview strata manager on site"
                logo={<StoryGridLogo>Harbourview</StoryGridLogo>}
              />
            }
          />
        </div>
      </section>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Split usage</h2>
        <CodeBlock code={SPLIT_USAGE} language="tsx" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Editorial usage</h2>
        <CodeBlock code={EDITORIAL_USAGE} language="tsx" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Featured usage</h2>
        <CodeBlock code={FEATURED_USAGE} language="tsx" />
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">PageHeaderSplit props</h2>
        <PropTable props={SPLIT_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">PageHeaderEditorial props</h2>
        <PropTable props={EDITORIAL_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">PageHeaderSplitVisual props</h2>
        <PropTable props={SPLIT_VISUAL_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">PageHeaderEditorialImage props</h2>
        <PropTable props={EDITORIAL_IMAGE_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">PageHeaderFeatured props</h2>
        <PropTable props={FEATURED_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">PageHeaderFeaturedImage props</h2>
        <PropTable props={FEATURED_IMAGE_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">PageHeaderAction props</h2>
        <PropTable props={ACTION_PROPS} />
      </section>

    </DocsPage>
  );
}
