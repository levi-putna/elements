import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  BlogCard,
  BlogCardFeatured,
  BlogCardSimple,
  BLOG_CARD_FEATURED_DEFAULT,
  BLOG_CARD_GRID_DEFAULT,
  BLOG_CARD_SIMPLE_DEFAULT,
  Card,
  CardEyebrow,
  CardGrid,
  CardLink,
  CardMeta,
  CardTitle,
  FeatureCard,
  FEATURE_CARD_DEFAULT,
} from "@/components/ui/card";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/card/registry.json`;

const BASE_USAGE = `import { Card, CardEyebrow, CardTitle } from "@/components/ui/card"

<Card tone="bordered">
  <CardEyebrow>For strata managers</CardEyebrow>
  <CardTitle>Everything in one place</CardTitle>
  <p className="text-sm text-ink-muted mt-3">Levies, maintenance, and owner comms connected.</p>
</Card>`;

const FEATURE_USAGE = `import { CardGrid, FeatureCard } from "@/components/ui/card"

<CardGrid columns={2}>
  <FeatureCard
    href="/features/datasets"
    title="Datasets"
    description="Built by analysts in tight partnership with domain experts…"
  />
  <FeatureCard
    href="/features/metrics"
    title="Levy metrics"
    description="Governed KPIs for levy collection, arrears, and budget variance."
  />
</CardGrid>`;

const BLOG_FEATURED_USAGE = `import { BlogCardFeatured } from "@/components/ui/card"

<BlogCardFeatured
  href="/blog/levy-forecasting"
  category="Product updates"
  title="Beyond spreadsheets: introducing levy forecasting"
  excerpt="Levy forecasting helps you map out a budget structure before diving into the details."
  imageSrc="/img/building/2.webp"
  imageAlt="Strata manager reviewing levy forecast dashboard"
/>`;

const BLOG_SIMPLE_USAGE = `import { CardGrid, BlogCardSimple } from "@/components/ui/card"

<CardGrid columns={3}>
  <BlogCardSimple
    href="/blog/paperless"
    category="Product updates"
    title="How Harbourview went paperless in 36 hours"
    date="15 June 2026"
    readTime="5 min read"
  />
</CardGrid>`;

const BLOG_GRID_USAGE = `import { CardGrid, BlogCard } from "@/components/ui/card"

<CardGrid columns={3}>
  <BlogCard
    href="/blog/levy-forecasting"
    category="Product updates"
    title="Beyond spreadsheets: introducing levy forecasting"
    excerpt="Levy forecasting helps you map out a budget structure…"
    date="31 January 2024"
    readTime="8 min read"
    imageSrc="/img/building/1.webp"
    imageAlt="Levy forecasting dashboard"
    author={{ name: "Samantha Novak", role: "Product Design Lead", avatarSrc: "/img/people/1.webp" }}
  />
</CardGrid>`;

const CARD_PROPS = [
  { name: "tone", type: '"bordered" | "accent" | "dark"', default: '"bordered"', description: "Surface colour. bordered = white + border + shadow. accent = lime-soft. dark = forest-mid for use inside dark sections." },
];

const FEATURE_PROPS = [
  { name: "title", type: "string", description: "Young Serif heading below the visual slot." },
  { name: "description", type: "string", description: "Supporting body copy." },
  { name: "visual", type: "ReactNode", description: "Illustration or screenshot in the off-white visual area. Defaults to an abstract placeholder." },
  { name: "href", type: "string", description: "When set, renders as a link and shows a trailing Learn more label." },
  { name: "linkLabel", type: "string", default: '"Learn more"', description: "Trailing link label with chevron." },
];

const BLOG_SIMPLE_PROPS = [
  { name: "category", type: "string", description: "Uppercase eyebrow label at the top." },
  { name: "title", type: "string", description: "Post headline in Young Serif." },
  { name: "date", type: "string", description: "Publication date." },
  { name: "readTime", type: "string", description: "Optional reading time, appended after the date." },
  { name: "href", type: "string", description: "Link destination: the entire card is clickable." },
];

const BLOG_FEATURED_PROPS = [
  { name: "category", type: "string", description: "Uppercase eyebrow above the title." },
  { name: "title", type: "string", description: "Post headline in Young Serif." },
  { name: "excerpt", type: "string", description: "Short summary paragraph." },
  { name: "imageSrc", type: "string", description: "Hero image for the left column." },
  { name: "imageAlt", type: "string", description: "Accessible alt text for the image." },
  { name: "linkLabel", type: "string", default: '"Read more"', description: "Trailing link label with chevron." },
  { name: "href", type: "string", description: "Link destination: the entire card is clickable." },
];

const BLOG_PROPS = [
  { name: "category", type: "string", description: "Uppercase eyebrow above metadata." },
  { name: "title", type: "string", description: "Post headline in Young Serif." },
  { name: "excerpt", type: "string", description: "Summary paragraph, clamped to three lines." },
  { name: "date", type: "string", description: "Publication date." },
  { name: "readTime", type: "string", description: "Optional reading time." },
  { name: "imageSrc", type: "string", description: "Hero image at the top of the card." },
  { name: "imageAlt", type: "string", description: "Accessible alt text for the image." },
  { name: "author", type: "{ name: string; role?: string; avatarSrc?: string }", description: "Optional author row with Avatar at the bottom." },
  { name: "href", type: "string", description: "Link destination: the entire card is clickable." },
];

/**
 * Card component documentation: base shells and Mode-inspired variants.
 */
export default function CardPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Card</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Base card shells plus Mode-inspired variants for product features and blog indexes.
          Feature cards follow the{" "}
          <a
            href="https://mode.com/self-serve-reporting"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Datasets layout
          </a>
          . Blog cards mirror the{" "}
          <a
            href="https://mode.com/blog/category/general"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mode blog index
          </a>
          : featured hero, editor&apos;s picks, and detailed grid tiles.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
        <p className="text-xs text-ink-muted mt-2">
          Also installs the <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">avatar</code> dependency for blog author rows.
        </p>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Base shells</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Three tones from the design system. Use bordered on white backgrounds, accent for highlights, and dark inside forest sections.
        </p>

        <ComponentPreview label="bordered · accent · dark">
          <div className="grid gap-5 md:grid-cols-3">
            <Card tone="bordered">
              <CardEyebrow>Bordered</CardEyebrow>
              <CardTitle size="md">White surface</CardTitle>
              <p className="text-sm text-ink-muted mt-3">Subtle border and shadow on white backgrounds.</p>
            </Card>
            <Card tone="accent">
              <CardEyebrow>Accent</CardEyebrow>
              <CardTitle size="md">Lime-soft fill</CardTitle>
              <p className="text-sm text-ink/75 mt-3">For featured or highlighted content on light sections.</p>
            </Card>
            <div className="rounded-lg bg-forest p-4">
              <Card tone="dark">
                <CardEyebrow onDark>Dark</CardEyebrow>
                <CardTitle size="md">Forest mid</CardTitle>
                <p className="text-sm text-white/75 mt-3">Secondary card inside a dark section.</p>
              </Card>
            </div>
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={BASE_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Feature card</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Tinted visual slot on top, Young Serif title, body copy, and an optional Learn more link.
          Inspired by the Datasets cards on Mode&apos;s self-serve reporting page.
        </p>

        <ComponentPreview label="FeatureCard · two-column row">
          <CardGrid columns={2}>
            {FEATURE_CARD_DEFAULT.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </CardGrid>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={FEATURE_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Blog: featured</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Hero post layout with image left and copy right. Category eyebrow, title, excerpt, and Read more link.
        </p>

        <ComponentPreview label="BlogCardFeatured · hero post">
          <BlogCardFeatured
            {...BLOG_CARD_FEATURED_DEFAULT}
            imageSrc={`/elements${BLOG_CARD_FEATURED_DEFAULT.imageSrc}`}
          />
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={BLOG_FEATURED_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Blog: simple</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Compact tiles for editor&apos;s picks rows. Category at the top, title in the middle, date and read time anchored to the bottom.
        </p>

        <ComponentPreview label="BlogCardSimple · editor's picks row">
          <CardGrid columns={3}>
            {BLOG_CARD_SIMPLE_DEFAULT.map((item) => (
              <BlogCardSimple key={item.title} {...item} />
            ))}
          </CardGrid>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={BLOG_SIMPLE_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Blog: detailed</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Grid cards with a hero image, metadata, excerpt, and optional author row with avatar.
        </p>

        <ComponentPreview label="BlogCard · three-column grid">
          <CardGrid columns={3}>
            {BLOG_CARD_GRID_DEFAULT.map((item) => (
              <BlogCard
                key={item.title}
                {...item}
                imageSrc={`/elements${item.imageSrc}`}
                author={
                  item.author
                    ? {
                        ...item.author,
                        avatarSrc: item.author.avatarSrc
                          ? `/elements${item.author.avatarSrc}`
                          : undefined,
                      }
                    : undefined
                }
              />
            ))}
          </CardGrid>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={BLOG_GRID_USAGE} language="tsx" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Tone reference</h2>
        <div className="rounded-sm border border-border overflow-hidden font-mono text-xs">
          {[
            ["Variant", "Background", "Use case"],
            ["bordered", "white + border", "Default on white or off-white sections"],
            ["accent", "lime-soft", "Featured content, callouts on light sections"],
            ["dark", "forest-mid", "Cards inside primary (forest) sections"],
            ["FeatureCard", "off-white visual + open copy", "Product feature rows with illustration"],
            ["BlogCardSimple", "white + shadow", "Editor's picks, sidebar lists"],
            ["BlogCardFeatured", "white + shadow", "Category hero post"],
            ["BlogCard", "white + shadow", "Blog index grid with image and author"],
          ].map(([a, b, c], i) => (
            <div
              key={a}
              className={`flex gap-4 px-4 py-3 border-b border-border last:border-0 ${i === 0 ? "bg-secondary" : ""}`}
            >
              <span className={`w-36 shrink-0 ${i === 0 ? "font-semibold text-foreground" : "text-foreground"}`}>{a}</span>
              <span className={`w-40 shrink-0 ${i === 0 ? "font-semibold text-foreground" : "text-ink-muted"}`}>{b}</span>
              <span className={`${i === 0 ? "font-semibold text-foreground" : "text-ink-muted"}`}>{c}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Card props</h2>
        <PropTable props={CARD_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">FeatureCard props</h2>
        <PropTable props={FEATURE_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BlogCardFeatured props</h2>
        <PropTable props={BLOG_FEATURED_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BlogCardSimple props</h2>
        <PropTable props={BLOG_SIMPLE_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">BlogCard props</h2>
        <PropTable props={BLOG_PROPS} />
      </section>

    </DocsPage>
  );
}
