import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

/* ─── Palette data ────────────────────────────────────── */

const CORE_COLOURS = [
  {
    name: "White",
    token: "--color-white / bg-background",
    hex: "#FFFFFF",
    role: "Primary page background. Default for all content sections.",
    className: "bg-white",
    textClass: "text-ink",
  },
  {
    name: "Off-white",
    token: "--color-off-white / bg-secondary",
    hex: "#EEF2E3",
    role: "Subtle warm tint. Differentiates adjacent light sections without adding weight.",
    className: "bg-off-white",
    textClass: "text-ink",
  },
  {
    name: "Lime",
    token: "--color-lime / bg-primary",
    hex: "#C8F169",
    role: "Brand accent. CTAs, hover states, active indicators, logo container, eyebrows on dark.",
    className: "bg-lime",
    textClass: "text-ink",
  },
  {
    name: "Lime soft",
    token: "--color-lime-soft / bg-accent",
    hex: "#EBF8C2",
    role: "Lightest green tint. Card fills, highlight bands, tag backgrounds, quote cards.",
    className: "bg-lime-soft",
    textClass: "text-ink",
  },
  {
    name: "Forest",
    token: "--color-forest / bg-forest",
    hex: "#043F2E",
    role: "Deep green. Hero, testimonial, footer, and sidebar. Anchoring contrast.",
    className: "bg-forest",
    textClass: "text-white",
  },
  {
    name: "Forest mid",
    token: "--color-forest-mid",
    hex: "#0A5C3D",
    role: "Mid-tone forest. Card backgrounds inside dark sections, bento wrappers.",
    className: "bg-forest-mid",
    textClass: "text-white",
  },
  {
    name: "Ink",
    token: "--color-ink / text-foreground",
    hex: "#043F2E",
    role: "Headings and primary body text on light backgrounds.",
    className: "bg-white border border-border",
    textClass: "text-ink",
    sample: "Primary heading text",
  },
  {
    name: "Ink muted",
    token: "--color-ink-muted / text-muted-foreground",
    hex: "#4A7A62",
    role: "Secondary text: labels, captions, metadata, eyebrows on light sections.",
    className: "bg-white border border-border",
    textClass: "text-ink-muted",
    sample: "Secondary label text",
  },
  {
    name: "Border",
    token: "--color-border / border-border",
    hex: "#D4E8C2",
    role: "Subtle borders on cards, inputs, and dividers on light backgrounds.",
    className: "bg-white border-2 border-border",
    textClass: "text-ink-muted",
    sample: "1px border",
  },
] as const;

const SECTION_TYPES = [
  {
    type: "Default",
    background: "bg-white",
    hex: "#FFFFFF",
    heading: "text-ink",
    body: "text-ink-muted",
    eyebrow: "text-ink-muted",
    frequency: "Most sections",
  },
  {
    type: "Subtle",
    background: "bg-off-white",
    hex: "#EEF2E3",
    heading: "text-ink",
    body: "text-ink-muted",
    eyebrow: "text-ink-muted",
    frequency: "Alternating light sections",
  },
  {
    type: "Accent",
    background: "bg-lime-soft",
    hex: "#EBF8C2",
    heading: "text-ink",
    body: "text-ink-muted",
    eyebrow: "text-ink-muted",
    frequency: "CTA bands, callouts",
  },
  {
    type: "Dark",
    background: "bg-forest",
    hex: "#043F2E",
    heading: "text-white",
    body: "text-white/70",
    eyebrow: "text-lime",
    frequency: "Hero, testimonial, footer",
  },
] as const;

const FOREGROUND_RULES = [
  {
    token: "text-foreground / text-ink",
    hex: "#043F2E",
    use: "Headings, primary labels, and interactive text on white, off-white, and lime-soft backgrounds.",
  },
  {
    token: "text-ink-muted / text-muted-foreground",
    hex: "#4A7A62",
    use: "Body copy, captions, metadata, and eyebrows on light sections.",
  },
  {
    token: "text-white",
    hex: "#FFFFFF",
    use: "Headings and body on forest and forest-mid backgrounds. Never use ink on dark sections.",
  },
  {
    token: "text-lime",
    hex: "#C8F169",
    use: "Eyebrow labels, links, and emphasis on dark sections. Code syntax highlights.",
  },
  {
    token: "text-primary-foreground",
    hex: "#043F2E",
    use: "Text on lime-filled buttons and primary actions. Never white text on lime.",
  },
] as const;

interface ColourSwatchProps {
  name: string;
  token: string;
  hex: string;
  role: string;
  className: string;
  textClass: string;
  sample?: string;
}

/**
 * Renders a single palette swatch with token, hex, and usage notes.
 */
function ColourSwatch({
  name,
  token,
  hex,
  role,
  className,
  textClass,
  sample,
}: ColourSwatchProps) {
  return (
    <div className="rounded-sm border border-border overflow-hidden">
      {/* Swatch preview */}
      <div className={`px-6 py-8 ${className}`}>
        {sample ? (
          <p className={`font-sans text-sm font-medium ${textClass}`}>{sample}</p>
        ) : (
          <p className={`font-display text-2xl ${textClass}`}>{name}</p>
        )}
      </div>
      {/* Metadata */}
      <div className="px-6 py-4 bg-secondary border-t border-border space-y-1">
        <div className="flex items-center justify-between gap-4">
          <p className="font-sans text-sm font-semibold text-foreground">{name}</p>
          <p className="font-mono text-xs text-ink-muted">{hex}</p>
        </div>
        <p className="font-mono text-[11px] text-ink-muted/80">{token}</p>
        <p className="font-sans text-xs text-ink-muted leading-relaxed pt-1">{role}</p>
      </div>
    </div>
  );
}

/**
 * Foundation documentation page for the Instant Strata colour system.
 */
export default function ColoursPage() {
  return (
    <DocsPage className="space-y-20">

      {/* ── Page header ───────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Colours &amp; Accent
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          White is the dominant background. Forest green and lime create emphasis and rhythm -
          not wallpaper. If in doubt, use white. Reach for colour only when you need to signal
          a transition or draw deliberate attention.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          CORE PALETTE
      ══════════════════════════════════════════════ */}
      <section id="core-palette">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Core Palette
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_COLOURS.map((colour) => (
            <ColourSwatch key={colour.name} {...colour} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SEMANTIC TOKENS
      ══════════════════════════════════════════════ */}
      <section id="semantic-tokens">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Semantic Tokens
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          CSS custom properties in{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            globals.css
          </code>{" "}
          map brand colours to shadcn/ui semantic roles. Use Tailwind utilities where possible.
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">
          {[
            { token: "--background", utility: "bg-background", value: "#FFFFFF", maps: "Page and card surfaces" },
            { token: "--foreground", utility: "text-foreground", value: "#043F2E", maps: "Primary text on light surfaces" },
            { token: "--primary", utility: "bg-primary", value: "#C8F169", maps: "Primary buttons, logo container" },
            { token: "--primary-foreground", utility: "text-primary-foreground", value: "#043F2E", maps: "Text on primary (lime) fills" },
            { token: "--secondary", utility: "bg-secondary", value: "#EEF2E3", maps: "Subtle section and panel backgrounds" },
            { token: "--muted", utility: "bg-muted", value: "#EEF2E3", maps: "Muted backgrounds (same as secondary)" },
            { token: "--muted-foreground", utility: "text-muted-foreground", value: "#4A7A62", maps: "Secondary text" },
            { token: "--accent", utility: "bg-accent", value: "#EBF8C2", maps: "Highlight bands, accent cards" },
            { token: "--accent-foreground", utility: "text-accent-foreground", value: "#043F2E", maps: "Text on accent backgrounds" },
            { token: "--border", utility: "border-border", value: "#D4E8C2", maps: "Card, input, and divider borders" },
            { token: "--ring", utility: "ring-ring", value: "#C8F169", maps: "Focus rings on interactive elements" },
          ].map((row) => (
            <div key={row.token} className="px-6 py-4 bg-white flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <code className="font-mono text-xs text-foreground shrink-0 w-44">{row.token}</code>
              <code className="font-mono text-xs text-lime shrink-0 w-40 hidden sm:block">{row.utility}</code>
              <span className="font-mono text-xs text-ink-muted shrink-0 w-20">{row.value}</span>
              <span className="font-sans text-xs text-ink-muted">{row.maps}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION BACKGROUNDS
      ══════════════════════════════════════════════ */}
      <section id="section-backgrounds">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Section Backgrounds
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Four section types create page rhythm. Dark and accent sections appear at most 2–3 times
          per page. Never place two dark sections back-to-back.
        </p>

        <div className="space-y-4">
          {SECTION_TYPES.map((section) => (
            <div key={section.type} className={`rounded-sm overflow-hidden ${section.background}`}>
              {/* Section preview */}
              <div className="px-8 py-10">
                <p className={`text-[11px] font-semibold uppercase tracking-[0.1em] mb-3 ${section.eyebrow}`}>
                  {section.type} section
                </p>
                <h2 className={`font-display text-3xl leading-tight mb-3 ${section.heading}`}>
                  Everything in one place
                </h2>
                <p className={`font-sans text-base leading-relaxed max-w-md ${section.body}`}>
                  Body copy uses muted foreground on light sections and white at 70% opacity on dark.
                </p>
              </div>
              {/* Metadata bar */}
              <div className={`px-8 py-3 border-t flex flex-wrap items-center gap-4 ${
                section.type === "Dark"
                  ? "border-white/10 bg-forest-mid"
                  : "border-border bg-white/50"
              }`}>
                <span className={`text-xs font-semibold ${section.type === "Dark" ? "text-white" : "text-foreground"}`}>
                  {section.type}
                </span>
                <span className={`font-mono text-xs ${section.type === "Dark" ? "text-white/60" : "text-ink-muted"}`}>
                  {section.hex}
                </span>
                <span className={`text-xs ml-auto ${section.type === "Dark" ? "text-white/50" : "text-ink-muted"}`}>
                  {section.frequency}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FOREGROUND COLOURS
      ══════════════════════════════════════════════ */}
      <section id="foreground">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Foreground Colours
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Text colour always follows the background. Ink on light, white on dark. Lime is reserved
          for accents: eyebrows, links, and syntax, not body copy.
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">
          {FOREGROUND_RULES.map((rule) => (
            <div key={rule.token} className="px-6 py-5 bg-white flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
              <div className="shrink-0 sm:w-52">
                <code className="font-mono text-xs text-foreground">{rule.token}</code>
                <p className="font-mono text-[11px] text-ink-muted mt-1">{rule.hex}</p>
              </div>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">{rule.use}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ACCENT USAGE
      ══════════════════════════════════════════════ */}
      <section id="accent">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Accent Usage
        </p>

        <ComponentPreview label="Lime accent on light and dark">
          <div className="w-full max-w-[640px] space-y-8 py-2">
            {/* Primary button */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="rounded-sm bg-lime px-5 py-2.5 text-sm font-semibold text-ink"
              >
                Try for free
              </button>
              <p className="font-sans text-xs text-ink-muted">
                Primary CTA: lime fill, ink text. One per section maximum.
              </p>
            </div>

            {/* Link underline */}
            <p className="font-sans text-sm text-ink-muted">
              Inline{" "}
              <a href="#" className="text-foreground underline decoration-lime underline-offset-[3px]">
                links use lime underlines
              </a>{" "}
              on light backgrounds.
            </p>

            {/* Focus ring */}
            <div className="flex items-center gap-4">
              <input
                type="text"
                readOnly
                value="Focus ring"
                className="rounded-sm border border-border bg-white px-3 py-2 text-sm text-foreground outline-none ring-2 ring-lime ring-offset-2"
                aria-label="Focus ring example"
              />
              <p className="font-sans text-xs text-ink-muted">Focus ring uses lime via --ring.</p>
            </div>

            {/* Dark section eyebrow */}
            <div className="rounded-sm bg-forest px-6 py-5 -mx-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-lime mb-2">
                What owners love
              </p>
              <p className="font-display text-xl text-white">Eyebrow on dark sections</p>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          CARDS ON BACKGROUNDS
      ══════════════════════════════════════════════ */}
      <section id="cards">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Cards &amp; Surfaces
        </p>

        <ComponentPreview label="Card styles by context">
          <div className="w-full grid gap-6 sm:grid-cols-3 py-2">
            {/* Bordered card */}
            <div className="rounded-md border border-border bg-white p-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
                Bordered
              </p>
              <p className="font-sans text-sm font-semibold text-ink mb-2">White card</p>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                On white or off-white sections. Subtle border, optional light shadow.
              </p>
            </div>

            {/* Accent card */}
            <div className="rounded-md bg-lime-soft p-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
                Accent
              </p>
              <p className="font-sans text-sm font-semibold text-ink mb-2">Lime-soft fill</p>
              <p className="font-sans text-xs text-ink-muted leading-relaxed">
                Featured content, quote cards, highlight panels. No border.
              </p>
            </div>

            {/* Dark card */}
            <div className="rounded-md bg-forest-mid p-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-lime mb-3">
                Dark
              </p>
              <p className="font-sans text-sm font-semibold text-white mb-2">Forest-mid fill</p>
              <p className="font-sans text-xs text-white/70 leading-relaxed">
                Inside dark sections and bento grids. White text, lime eyebrows.
              </p>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          PAGE CADENCE
      ══════════════════════════════════════════════ */}
      <section id="cadence">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Page Cadence
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          A typical landing page alternates light and dark to create rhythm without overwhelming
          colour. Dark sections anchor; accent bands energise.
        </p>

        <div className="rounded-sm border border-border overflow-hidden font-mono text-xs">
          {[
            { section: "Hero", type: "Dark", className: "bg-forest text-white" },
            { section: "Social proof", type: "Default", className: "bg-white text-ink" },
            { section: "Features", type: "Subtle", className: "bg-off-white text-ink" },
            { section: "CTA band", type: "Accent", className: "bg-lime-soft text-ink" },
            { section: "Feature rows", type: "Default", className: "bg-white text-ink" },
            { section: "Testimonial", type: "Dark", className: "bg-forest text-white" },
            { section: "Pricing", type: "Subtle", className: "bg-off-white text-ink" },
            { section: "Final CTA", type: "Accent", className: "bg-lime-soft text-ink" },
            { section: "Footer", type: "Dark", className: "bg-forest text-white" },
          ].map((row, index) => (
            <div
              key={row.section}
              className={`px-6 py-3 flex items-center justify-between ${row.className} ${
                index > 0 ? "border-t border-black/5" : ""
              }`}
            >
              <span>{row.section}</span>
              <span className="opacity-60">{row.type}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          RULES
      ══════════════════════════════════════════════ */}
      <section id="rules">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Rules
        </p>
        <ul className="space-y-3 max-w-2xl">
          {[
            "White is the default. Coloured sections are deliberate moments, not the baseline.",
            "Never use white text on lime buttons: always ink on lime.",
            "Never use ink text on forest backgrounds: always white or white at reduced opacity.",
            "Eyebrows: ink-muted on light sections, lime on dark sections.",
            "Borders on light surfaces use the green-tinted border token, not grey.",
            "No more than three dark sections per page. Never two dark sections in a row.",
            "Logo: forest letterforms on lime container (light bg), forest container with white letterforms (primary bg), or lime letterforms on forest container (dark bg). Container rotated 15°; letterforms upright.",
          ].map((rule) => (
            <li key={rule} className="flex gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <span className="text-lime shrink-0 mt-0.5" aria-hidden="true">-</span>
              {rule}
            </li>
          ))}
        </ul>
      </section>

    </DocsPage>
  );
}
