import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  StoryGrid,
  StoryGridCard,
  StoryGridFeatured,
  StoryGridLogo,
  STORY_GRID_DEFAULT,
} from "@/components/ui/story-grid";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/story-grid/registry.json`;

const USAGE = `import {
  StoryGrid,
  StoryGridFeatured,
  StoryGridCard,
  StoryGridLogo,
} from "@/components/ui/story-grid"

export function CustomerStories() {
  return (
    <StoryGrid>
      <StoryGridFeatured
        href="/stories/harbourview"
        title="Harbourview Towers transforms committee reporting across 120 lots"
        logo={<StoryGridLogo>Harbourview</StoryGridLogo>}
        imageSrc="/img/building/1.webp"
        imageAlt="Harbourview Towers committee meeting"
      />
      <StoryGridCard
        href="/stories/coastal"
        title="Coastal Strata builds self-serve owner portals"
        logo={<StoryGridLogo>Coastal</StoryGridLogo>}
      />
      {/* …more cards */}
    </StoryGrid>
  )
}`;

const GRID_PROPS = [
  { name: "gap", type: '"sm" | "md" | "lg"', default: '"md"', description: "Gap between cards." },
  { name: "className", type: "string", description: "Additional classes on the grid container." },
];

const CARD_PROPS = [
  { name: "title", type: "string", description: "Story headline: Young Serif, anchored to the top." },
  { name: "logo", type: "ReactNode", description: "Company mark anchored to the bottom. Use StoryGridLogo." },
  { name: "href", type: "string", description: "Link destination: the entire card is clickable." },
  { name: "className", type: "string", description: "Additional classes on the anchor." },
];

const FEATURED_PROPS = [
  { name: "title", type: "string", description: "Story headline: anchored to the bottom of the copy column." },
  { name: "logo", type: "ReactNode", description: "Company mark at the top of the copy column." },
  { name: "imageSrc", type: "string", description: "Image URL for the right-hand column." },
  { name: "imageAlt", type: "string", description: "Accessible alt text for the image." },
  { name: "linkLabel", type: "string", default: '"Read more"', description: "Trailing link label with chevron." },
  { name: "href", type: "string", description: "Link destination: the entire card is clickable." },
  { name: "className", type: "string", description: "Additional classes on the anchor." },
];

export default function StoryGridPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Story Grid</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          A three-column editorial mosaic inspired by the customer story index on{" "}
          <a
            href="https://mode.com/customers"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mode&apos;s customers page
          </a>
          . Featured tiles span two columns and include an image; standard tiles are
          text-only with a logo mark. Distinct from{" "}
          <a
            href="/components/bento"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Bento
          </a>{" "}
         : this layout follows a simple row flow rather than asymmetric cell spans.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Example
        </h2>
        <p className="text-sm text-ink-muted mb-6 leading-relaxed max-w-2xl">
          The default sample mirrors Mode&apos;s rhythm: featured + standard on row
          one, three standards on row two, standard + featured on row three.
        </p>
        <StoryGrid>
          {STORY_GRID_DEFAULT.map((item) =>
            item.variant === "featured" ? (
              <StoryGridFeatured
                key={item.title}
                href={item.href}
                title={item.title}
                logo={item.logo}
                imageSrc={`/elements${item.imageSrc}`}
                imageAlt={item.imageAlt}
              />
            ) : (
              <StoryGridCard
                key={item.title}
                href={item.href}
                title={item.title}
                logo={item.logo}
              />
            )
          )}
        </StoryGrid>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <CodeBlock code={USAGE} language="tsx" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">StoryGrid props</h2>
        <PropTable props={GRID_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">StoryGridCard props</h2>
        <PropTable props={CARD_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">StoryGridFeatured props</h2>
        <PropTable props={FEATURED_PROPS} />
      </section>

    </DocsPage>
  );
}
