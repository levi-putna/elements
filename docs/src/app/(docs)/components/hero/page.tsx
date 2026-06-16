import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Hero, HeroAction, HeroVisual } from "@/components/ui/hero";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/hero/registry.json`;

const USAGE = `import { Hero, HeroAction, HeroVisual } from "@/components/ui/hero"

export function Page() {
  return (
    <Hero
      lines={["Strata Intelligence", "built around", "your clients"]}
      subtext="Instant Strata is the command centre for your portfolio, uniting owners, committees and managers around the data that keeps every building running."
      actions={
        <>
          <HeroAction href="/signup">Book a demo</HeroAction>
          <HeroAction href="/tour" variant="outline">Take a tour</HeroAction>
        </>
      }
      visual={
        <HeroVisual
          src="/img/people/1.webp"
          alt="Strata managers reviewing a building portfolio"
        />
      }
    />
  )
}`;

const ANATOMY = `<Hero
  lines={[
    "Strata Intelligence",  // lines[0]: 100% width  (cols 1–12, row 1)
    "built around",         // lines[1]:  2/3 width  (cols 5–12, row 2) over photo
    "your clients",         // lines[2]:  1/3 width  (cols 9–12, row 3) clear of photo
  ]}
  subtext="..."             // supporting paragraph: right 1/3, below ribbon
  actions={...}             // dual CTA (HeroAction primary + outline)
  visual={...}              // lower-left photo (w-2/3): use <HeroVisual> for notch masking
/>`;

const HOW_IT_WORKS = `/*
 * Instant Strata hero: how the layout works
 *
 * 1. THIRDS-BASED LAYOUT (12-column grid on desktop)
 *    Each step = 4 columns = 1 third. Starts and spans are derived as:
 *      col start = 1, 5, 9   →   col span = 13 − start = 12, 8, 4
 *
 *    lines[0] → cols  1–12, row 1  (100%: full top width)
 *    lines[1] → cols  5–12, row 2  ( 2/3: sits over the photo)
 *    lines[2] → cols  9–12, row 3  ( 1/3: clear of the photo)
 *
 *    The photo is absolutely positioned at w-2/3 (8 cols wide) so its
 *    right edge falls exactly at the col-9 boundary: the same column
 *    where lines[2] and the copy block begin.
 *
 * 2. THE LIME RIBBON
 *    Each line is its own lime block. Selective corner flattening fuses them
 *    into one continuous ribbon:
 *      · lines[0]: flat bottom-right
 *      · lines[1]: flat top-left, top-right, bottom-right
 *      · lines[2]: flat top-left
 *
 * 3. CONCAVE NOTCH MASKING  ← the signature detail
 *    At each interior junction, a HeroNotch carves a concave (inward) curve
 *    so adjacent blocks fuse smoothly. The trick:
 *      a) a small lime square is pushed just OUTSIDE the block edge
 *         (translateX ±100%), extending the block by 24 px;
 *      b) a larger ::after (110%, forest-coloured) with ONE rounded corner
 *         masks it: leaving a smooth inward curve.
 *    Notch positions: top-left on lines[1] and lines[2]; bottom-right on lines[1].
 *    The photo's HeroVisual \`notches={["topRight"]}\` carves the same concave
 *    curve at the photo's top-right corner, interlocking it with lines[1].
 *
 * 4. OVERFLOW CLIPPING
 *    Each line sits inside a clip-path wrapper:
 *      lines[0]  → inset(0 0 0 0)     standard clip
 *      lines[1+] → inset(0 0 0 -24px) expands 24 px left so the
 *                  topLeft notch remains visible, right side still clips.
 *
 * 5. FLUID TYPE
 *    The section is a CSS container ([container-type:inline-size]) and the
 *    headline uses cqw units (clamp(26px, 6.4cqw, 92px)) so it scales with
 *    the hero's own width: not the viewport.
 */`;

const PROPS = [
  { name: "lines", type: "string[]", description: "Three headline strings in thirds-based zones: lines[0] = 100% full top; lines[1] = right 2/3 (sits over the photo); lines[2] = right 1/3 (clear of photo). Keep each line short enough for its zone." },
  { name: "subtext", type: "string", description: "Supporting paragraph in the right-hand column (desktop) or below the media stack (mobile)." },
  { name: "actions", type: "ReactNode", description: "Call-to-action buttons. Use HeroAction for brand-styled primary/outline links." },
  { name: "visual", type: "ReactNode", description: "Photo tucked into the lower-left, behind the ribbon's final line. Use HeroVisual for the notch masking." },
  { name: "className", type: "string", description: "Additional classes on the outer forest-green section." },
];

const HERO_VISUAL_PROPS = [
  { name: "src", type: "string", description: "Image source URL." },
  { name: "alt", type: "string", description: "Accessible alt text for the photo." },
  { name: "notches", type: 'VisualCorner[]', default: '["topRight"]', description: "Corners to carve with a concave notch so the photo interlocks with the ribbon." },
  { name: "className", type: "string", description: "Classes on the rounded wrapper div." },
  { name: "imgClassName", type: "string", description: "Classes on the inner img element (object-cover by default)." },
];

const HERO_ACTION_PROPS = [
  { name: "href", type: "string", description: "Link destination." },
  { name: "variant", type: '"primary" | "outline"', default: '"primary"', description: "primary = off-white fill; outline = transparent with white border." },
  { name: "className", type: "string", description: "Additional classes on the anchor." },
];

export default function HeroPage() {
  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Hero</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          A bold marquee hero on a forest-green canvas. Three headline lines step
          in clean thirds: the first fills 100% of the top, the second spans the
          right 2/3 and sits over a 2/3-wide photo, the third occupies the right
          1/3: clear of the photo. Concave masking fuses the stepped lime blocks
          into one ribbon, with supporting copy and CTAs in the right 1/3 below.
        </p>
      </div>

      {/* How it works */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          How it works
        </h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">
          Each headline string is a direct grid item in its own row. The layout
          uses a clean thirds system: each step is 4 columns (one third).{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground text-xs">lines[0]</code>{" "}
          fills the full 100% (cols 1–12),{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground text-xs">lines[1]</code>{" "}
          spans the right 2/3 (cols 5–12) and sits over the photo, and{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground text-xs">lines[2]</code>{" "}
          occupies the right 1/3 (cols 9–12). The photo is{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground text-xs">w-2/3</code>{" "}
          wide so its right edge aligns exactly with col 9: where line 2 and
          the copy block both begin. Selective corner flattening fuses all three
          blocks into one continuous ribbon.
        </p>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">
          The signature detail is the{" "}
          <strong className="text-foreground font-semibold">concave notch masking</strong>{" "}
          at each step. A small lime square is pushed just outside the block edge
          ({" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground text-xs">
            translateX(-100%)
          </code>{" "}
          ), then a larger forest-coloured{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground text-xs">
            ::after
          </code>{" "}
          with a single rounded corner masks it: carving a smooth inward curve
          so the steps fuse together.
        </p>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">
          The photo sits in the lower-left at{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground text-xs">
            w-2/3
          </code>
          , matching the width of lines[1] so its right edge lands exactly at
          col 9. The{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground text-xs">
            notches={`{["topRight"]}`}
          </code>{" "}
          prop on HeroVisual carves a concave corner into the photo&apos;s
          top-right, interlocking it with lines[1] above. The headline uses
          container-query units ({" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground text-xs">
            cqw
          </code>
          ) so it scales with the hero&apos;s own width, not the viewport.
        </p>
        <CodeBlock code={HOW_IT_WORKS} language="tsx" />
      </section>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* Anatomy */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Anatomy</h2>
        <CodeBlock code={ANATOMY} language="tsx" />
      </section>

      {/* Preview: break out of the prose column so the hero has full width */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">Example</h2>
        <div className="rounded-sm border border-border overflow-hidden">
          <Hero
            lines={["Strata Intelligence", "built around", "your clients"]}
            subtext="Instant Strata is the command centre for your portfolio, uniting owners, committees and managers around the data that keeps every building running."
            actions={
              <>
                <HeroAction href="#">Book a demo</HeroAction>
                <HeroAction href="#" variant="outline">Take a tour</HeroAction>
              </>
            }
            visual={
              <HeroVisual
                src="/elements/img/people/1.webp"
                alt="Strata managers reviewing a building portfolio"
              />
            }
          />
        </div>
        <p className="text-xs text-ink-muted mt-3 leading-relaxed">
          Resize the browser to see the mobile stack: headline lines collapse
          into a single lime block, with the photo below.
        </p>
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <CodeBlock code={USAGE} language="tsx" />
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Hero props</h2>
        <PropTable props={PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">HeroVisual props</h2>
        <PropTable props={HERO_VISUAL_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">HeroAction props</h2>
        <PropTable props={HERO_ACTION_PROPS} />
      </section>

    </DocsPage>
  );
}
