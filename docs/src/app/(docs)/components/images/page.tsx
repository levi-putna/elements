import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { AuthBrandPanel } from "@/components/ui/auth-layout";
import { MarketingTourThumbnail } from "@/components/ui/marketing-section";
import { PageHeaderFeaturedImage } from "@/components/ui/page-header";
import { LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { Play } from "lucide-react";

/* eslint-disable @next/next/no-img-element */

/** Public assets under the docs site basePath. */
const IMG = "/elements/img";

/* ─── Asset catalogue ─────────────────────────────────── */

const ASSET_FOLDERS = [
  {
    folder: "building/",
    use: "Architecture, facades, common areas. Auth covers, story features, tour thumbnails.",
    files: ["1.webp", "2.webp", "3.webp", "4.webp", "5.webp", "6.webp", "7.webp"],
  },
  {
    folder: "people/",
    use: "Teams at work, editorial hero shots, page headers. Prefer warm natural light.",
    files: ["0.webp", "1.webp", "2.webp", "3.webp", "4.webp", "5.webp", "6.webp", "7.webp", "8.webp", "9.webp"],
  },
  {
    folder: "person/",
    use: "Tight portraits for avatars, testimonials, and featured customer blocks.",
    files: ["1.webp", "2.webp", "3.webp"],
  },
] as const;

const GUIDELINES = [
  {
    rule: "Photos are content, not wallpaper",
    detail:
      "Place images inside rounded frames with intentional aspect ratios. Full-bleed page backgrounds are avoided; cover panels (auth, hero) are the exception.",
  },
  {
    rule: "Crop with object-cover",
    detail:
      "Use a relative wrapper, absolute inset-0 img, and object-cover so photos fill their frame without distortion.",
  },
  {
    rule: "Tint for legibility",
    detail:
      "When white copy sits on photography, add a forest overlay (40–50% opacity). In dark mode, reduce photo brightness so overlays stay balanced.",
  },
  {
    rule: "Rounded corners, no drop shadows",
    detail:
      "rounded-xl for cards and thumbnails, rounded-2xl for hero and editorial frames. Let colour and layout create depth, not box-shadow on photos.",
  },
  {
    rule: "Meaningful alt text",
    detail:
      "Describe what the image communicates (who, where, action). Decorative overlays use aria-hidden. Portraits fall back to the person's name.",
  },
  {
    rule: "Resolve paths with assetPath()",
    detail:
      "Apps under a Next.js basePath should use assetPath('/img/...') so public files resolve in dev and production.",
  },
] as const;

const ASPECT_RATIOS = [
  { ratio: "16 / 10", className: "aspect-[16/10]", use: "Tour thumbnails, video previews (MarketingTourThumbnail)" },
  { ratio: "4 / 5", className: "aspect-[4/5]", use: "Featured customer portraits (PageHeaderFeaturedImage)" },
  { ratio: "4 / 3", className: "aspect-[4/3]", use: "Feature illustrations, editorial side images" },
  { ratio: "1 / 1", className: "aspect-square", use: "Testimonial portraits, avatars" },
  { ratio: "Fill parent", className: "min-h-48", use: "Auth cover panels, story grid image columns" },
] as const;

const OVERLAY_VARIANTS = [
  {
    label: "Forest 50%",
    overlayClass: "bg-forest/50",
    imgClass: "",
    note: "Auth brand panel. White and lime copy on building photography.",
  },
  {
    label: "Forest 40%",
    overlayClass: "bg-forest/40",
    imgClass: "",
    note: "Tour thumbnails. Play icon centred on a lighter wash.",
  },
  {
    label: "Forest mid placeholder",
    overlayClass: "",
    imgClass: "",
    wrapperClass: "bg-forest-mid/10",
    note: "Empty frame before the image loads. Used on editorial and story images.",
  },
  {
    label: "Dark mode brightness",
    overlayClass: "bg-forest/50",
    imgClass: "dark:brightness-[0.65]",
    note: "Pair with forest overlay so auth panels do not blow out in dark theme.",
  },
] as const;

const STANDARD_FRAME = `import { cn } from "@/lib/utils"

/**
 * Standard photo frame: relative wrapper, absolute cover image.
 */
export function PhotoFrame({
  src,
  alt,
  className,
  imgClassName,
}: {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-forest-mid/10",
        className
      )}
    >
      <img
        src={src}
        alt={alt}
        className={cn(
          "absolute inset-0 h-full w-full object-cover",
          imgClassName
        )}
      />
    </div>
  )
}`;

const AUTH_COVER = `import { AuthLayout } from "@/components/ui/auth-layout"
import { AuthForm } from "@/components/ui/auth-form"
import { assetPath } from "@/lib/utils"

export function LoginPage() {
  return (
    <AuthLayout
      imageSrc={assetPath("/img/building/1.webp")}
      imageAlt="Residents on balconies of a modern apartment building"
    >
      <AuthForm mode="login" />
    </AuthLayout>
  )
}

/*
 * AuthBrandPanel layers:
 *   1. object-cover photo (dark:brightness-[0.65])
 *   2. bg-forest/50 overlay for legibility
 *   3. Centred brand copy (white + lime eyebrow)
 */`;

const ASSET_PATH = `import { assetPath } from "@/lib/utils"

// Without basePath → "/img/building/1.webp"
// With NEXT_PUBLIC_BASE_PATH="/elements" → "/elements/img/building/1.webp"
const src = assetPath("/img/building/1.webp")`;

/* ─── Inline demos ──────────────────────────────────────── */

type OverlayDemoProps = {
  label: string;
  overlayClass?: string;
  imgClass?: string;
  wrapperClass?: string;
  note: string;
};

/** Side-by-side overlay variant on the same building photo. */
function OverlayDemo({
  label,
  overlayClass,
  imgClass,
  wrapperClass,
  note,
}: OverlayDemoProps) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-xl",
          wrapperClass ?? "bg-forest-mid/10"
        )}
      >
        {/* Photo */}
        <img
          src={`${IMG}/building/2.webp`}
          alt=""
          className={cn(
            "absolute inset-0 h-full w-full object-cover",
            imgClass
          )}
        />

        {/* Tint overlay */}
        {overlayClass && (
          <div className={cn("absolute inset-0", overlayClass)} aria-hidden="true" />
        )}

        {/* Sample copy to show legibility */}
        <div className="relative flex h-full items-end p-4">
          <p className="text-sm font-medium text-white drop-shadow-sm">
            Sample headline
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-xs text-ink-muted leading-relaxed mt-0.5">{note}</p>
      </div>
    </div>
  );
}

/** Aspect ratio reference tiles. */
function AspectRatioTile({
  ratio,
  className,
  use,
}: {
  ratio: string;
  className: string;
  use: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className={cn("relative w-full overflow-hidden rounded-xl bg-forest-mid/10", className)}>
        <img
          src={`${IMG}/building/3.webp`}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div>
        <p className="text-xs font-mono text-foreground">{ratio}</p>
        <p className="text-xs text-ink-muted leading-relaxed mt-0.5">{use}</p>
      </div>
    </div>
  );
}

export default function ImagesPage() {
  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Images
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-prose">
          Guidelines for photography, overlays, and asset paths across
          Instant Strata. Patterns follow shadcn-style composition (rounded
          frames, object-cover, semantic overlays) and editorial layouts seen on
          sites like{" "}
          <a
            href="https://mode.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest underline underline-offset-2 hover:text-forest-mid"
          >
            Mode
          </a>
          : portrait spotlights with logo badges, story cards with side
          photography, and tinted cover panels for copy legibility.
        </p>
      </div>

      {/* Principles */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Principles
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-prose mb-6">
          Real people in real work environments. Warm, natural light.
          Collaborative. Photos support the story; they do not compete with lime
          and forest brand colour. When in doubt, crop tighter and add a soft
          forest tint rather than shrinking the type.
        </p>

        <div className="rounded-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted w-1/4">
                  Rule
                </th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                  Detail
                </th>
              </tr>
            </thead>
            <tbody>
              {GUIDELINES.map((row, i) => (
                <tr
                  key={row.rule}
                  className={cn(i < GUIDELINES.length - 1 && "border-b border-border")}
                >
                  <td className="px-4 py-3 font-medium text-foreground align-top">
                    {row.rule}
                  </td>
                  <td className="px-4 py-3 text-ink-muted leading-relaxed align-top">
                    {row.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mode reference */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Editorial reference: Mode
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-prose mb-4">
          Mode treats photography as structured content, not decoration. Useful
          patterns to adapt:
        </p>
        <ul className="text-sm text-ink-muted leading-relaxed max-w-prose space-y-2 list-disc pl-5 mb-6">
          <li>
            <strong className="text-foreground font-medium">Featured customer block:</strong>{" "}
            tall portrait (4:5) with a logo badge in the top-right corner.
            Implemented as{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
              PageHeaderFeaturedImage
            </code>
            .
          </li>
          <li>
            <strong className="text-foreground font-medium">Story mosaic:</strong>{" "}
            featured cards span two columns with copy left and a rounded image
            right. See{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
              StoryGridFeatured
            </code>
            .
          </li>
          <li>
            <strong className="text-foreground font-medium">Product tour CTA:</strong>{" "}
            16:10 thumbnail, forest wash, centred play control, subtle hover
            scale. See{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
              MarketingTourThumbnail
            </code>
            .
          </li>
          <li>
            <strong className="text-foreground font-medium">Testimonial portraits:</strong>{" "}
            square headshots sit beside quote cards, separate from the lime
            stepped block.
          </li>
        </ul>

        <ComponentPreview label="Featured customer portrait + logo badge">
          <div className="w-full max-w-xs">
            <PageHeaderFeaturedImage
              src={`${IMG}/person/1.webp`}
              alt="Strata manager at Harbourview Towers"
              logo={<LogoMark surface="light" size="lg" decorative />}
            />
          </div>
        </ComponentPreview>
      </section>

      {/* Asset library */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Asset library
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-prose mb-6">
          Sample photography ships in{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            public/img/
          </code>
          . Use building shots for architecture and auth covers; people for
          editorial hero and headers; person for tight portraits.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {ASSET_FOLDERS.map((folder) => (
            <div
              key={folder.folder}
              className="rounded-sm border border-border overflow-hidden"
            >
              <div className="px-4 py-2.5 border-b border-border bg-secondary">
                <p className="text-xs font-semibold text-foreground">
                  img/{folder.folder}
                </p>
                <p className="text-xs text-ink-muted mt-0.5">{folder.use}</p>
              </div>
              <div className="grid grid-cols-3 gap-1 p-2 bg-background">
                {folder.files.map((file) => (
                  <div
                    key={file}
                    className="relative aspect-square overflow-hidden rounded-sm bg-forest-mid/10"
                  >
                    <img
                      src={`${IMG}/${folder.folder}${file}`}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Standard frame */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Standard frame
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-prose mb-6">
          The default pattern across shadcn-style apps: a{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            relative
          </code>{" "}
          wrapper with{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            overflow-hidden
          </code>
          , an absolutely positioned{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            img
          </code>{" "}
          with{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            object-cover
          </code>
          , and a{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            bg-forest-mid/10
          </code>{" "}
          placeholder while loading.
        </p>

        <ComponentPreview label="rounded-xl · aspect 4/3 · object-cover">
          <div className="w-full max-w-md">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-forest-mid/10">
              <img
                src={`${IMG}/people/2.webp`}
                alt="Committee members reviewing strata documents"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </div>
        </ComponentPreview>

        <div className="mt-6">
          <CodeBlock code={STANDARD_FRAME} language="tsx" />
        </div>
      </section>

      {/* Aspect ratios */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Aspect ratios
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-prose mb-6">
          Lock aspect ratio on the wrapper, not the img. Tailwind{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            aspect-*
          </code>{" "}
          utilities keep layouts stable while object-cover handles crop.
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ASPECT_RATIOS.map((item) => (
            <AspectRatioTile
              key={item.ratio}
              ratio={item.ratio}
              className={item.className}
              use={item.use}
            />
          ))}
        </div>
      </section>

      {/* Overlays and tints */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Overlays and tints
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-prose mb-6">
          Forest green overlays tie photography to the brand palette and keep
          white or lime copy readable. Use{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            aria-hidden=&quot;true&quot;
          </code>{" "}
          on decorative overlay divs. The photo keeps its own{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            alt
          </code>
          .
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          {OVERLAY_VARIANTS.map((variant) => (
            <OverlayDemo
              key={variant.label}
              label={variant.label}
              overlayClass={variant.overlayClass}
              imgClass={variant.imgClass}
              wrapperClass={"wrapperClass" in variant ? variant.wrapperClass : undefined}
              note={variant.note}
            />
          ))}
        </div>

        <div className="mt-8">
          <ComponentPreview label="Auth brand panel: cover + forest/50 + centred copy">
            <div className="w-full max-w-lg overflow-hidden rounded-sm border border-border">
              <AuthBrandPanel className="block min-h-[20rem]" />
            </div>
          </ComponentPreview>
        </div>

        <div className="mt-6">
          <CodeBlock code={AUTH_COVER} language="tsx" />
        </div>
      </section>

      {/* Component examples */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Component examples
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-prose mb-6">
          Common image treatments used across marketing and product surfaces.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          <ComponentPreview label="Tour thumbnail: forest/40 + play control">
            <div className="w-full max-w-sm">
              <MarketingTourThumbnail href="#">
                <span className="sr-only">Take the product tour</span>
              </MarketingTourThumbnail>
            </div>
          </ComponentPreview>

          <ComponentPreview label="Testimonial portrait: 1:1 · rounded-xl">
            <div className="w-36">
              <div className="rounded-xl overflow-hidden aspect-square bg-forest-mid">
                <img
                  src={`${IMG}/person/2.webp`}
                  alt="Adam Smith"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* Motion on images */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Hover and motion
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-prose mb-6">
          Image motion is subtle. Scale photos inside{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            overflow-hidden
          </code>{" "}
          parents so corners stay clipped. Pair with overlay darkening on hover
          for interactive tiles.
        </p>

        <ComponentPreview label="group-hover:scale-[1.02] + overlay shift">
          <a
            href="#"
            className="group relative block w-full max-w-sm aspect-[16/10] overflow-hidden rounded-xl no-underline"
          >
            <img
              src={`${IMG}/building/4.webp`}
              alt="Apartment building facade"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-forest/40 transition-colors duration-150 group-hover:bg-forest/50">
              <span className="flex size-14 items-center justify-center rounded-full bg-lime text-forest shadow-lg transition-transform duration-150 group-hover:scale-105">
                <Play className="size-6 fill-current" aria-hidden="true" />
              </span>
            </span>
          </a>
        </ComponentPreview>
      </section>

      {/* Accessibility */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Accessibility
        </h2>
        <ul className="text-sm text-ink-muted leading-relaxed max-w-prose space-y-2 list-disc pl-5">
          <li>
            Every informative{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
              img
            </code>{" "}
            needs descriptive{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
              alt
            </code>{" "}
            text. Empty alt is only for purely decorative images.
          </li>
          <li>
            Overlay divs are decorative:{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
              aria-hidden=&quot;true&quot;
            </code>
            .
          </li>
          <li>
            Interactive thumbnails need visible or screen-reader text (link
            label,{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
              sr-only
            </code>{" "}
            span, or{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
              aria-label
            </code>
            ).
          </li>
          <li>
            Do not convey meaning by colour alone on top of photos. Keep
            contrast at WCAG AA for any text placed over imagery.
          </li>
        </ul>
      </section>

      {/* Performance */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Performance
        </h2>
        <ul className="text-sm text-ink-muted leading-relaxed max-w-prose space-y-2 list-disc pl-5 mb-6">
          <li>
            Export JPEG for photos, PNG or SVG for logos and UI marks. Target
            display size: avoid shipping 4000px wide files for 400px frames.
          </li>
          <li>
            This docs site uses static export with{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
              images: {"{ unoptimized: true }"}
            </code>
            . Product apps can use{" "}
            <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
              next/image
            </code>{" "}
            with explicit width/height or fill + sizes.
          </li>
          <li>
            Lazy-load below-the-fold photography. Hero and auth cover images
            should load eagerly (default for img in viewport).
          </li>
        </ul>

        <h3 className="text-sm font-semibold text-foreground mb-3">
          basePath and assetPath()
        </h3>
        <p className="text-sm text-ink-muted leading-relaxed max-w-prose mb-4">
          The Elements docs site is served at{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            /elements
          </code>
          . Consumer apps should set{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            NEXT_PUBLIC_BASE_PATH
          </code>{" "}
          and resolve public URLs through{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            assetPath()
          </code>
          .
        </p>
        <CodeBlock code={ASSET_PATH} language="tsx" />
      </section>

      {/* Component map */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Where images appear
        </h2>
        <div className="rounded-sm border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                  Component
                </th>
                <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                  Image treatment
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                ["AuthBrandPanel", "Full cover, bg-forest/50, dark brightness"],
                ["HeroVisual", "rounded-2xl, object-cover"],
                ["PageHeaderFeaturedImage", "4:5 portrait, logo badge"],
                ["PageHeaderEditorialImage", "Tall editorial, rounded-2xl"],
                ["StoryGridFeatured", "Side image in rounded-xl frame"],
                ["MarketingTourThumbnail", "16:10, forest/40, play overlay"],
                ["Testimonial", "1:1 portrait beside quote card"],
                ["Avatar", "1:1, initials fallback"],
              ].map(([component, treatment], i, arr) => (
                <tr
                  key={component}
                  className={cn(i < arr.length - 1 && "border-b border-border")}
                >
                  <td className="px-4 py-3 font-mono text-xs text-foreground align-top">
                    {component}
                  </td>
                  <td className="px-4 py-3 text-ink-muted leading-relaxed align-top">
                    {treatment}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </DocsPage>
  );
}
