import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

/* ─── Specimen text ───────────────────────────────────── */
const ALPHABET = "Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz";
const NUMERALS = "0 1 2 3 4 5 6 7 8 9";

export default function TypographyPage() {
  return (
    <DocsPage className="space-y-20">

      {/* ── Page header ───────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Typography
        </h1>
        <p className="text-base text-ink-muted leading-relaxed">
          Two typefaces. Young Serif for display headings: authority and warmth at scale.
          Inter for everything else, clean, legible, neutral. JetBrains Mono for code.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          TYPEFACES
      ══════════════════════════════════════════════ */}
      <section id="typefaces">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Typefaces
        </p>

        {/* Young Serif */}
        <div className="mb-10 rounded-sm border border-border overflow-hidden">
          <div className="px-8 pt-10 pb-8 bg-background">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-6">
              Young Serif · Display &amp; Headings
            </p>
            <p className="font-display text-6xl text-foreground leading-none mb-6">
              Strata
            </p>
            <p className="font-display text-2xl text-foreground mb-2 leading-snug">
              Strata management, simplified.
            </p>
            <p className="font-display text-base font-normal text-ink-muted italic mb-8">
              Everything in one place, from day one.
            </p>
            <p className="font-display text-sm text-foreground/50 tracking-wide">
              {ALPHABET}
            </p>
            <p className="font-display text-sm text-foreground/50 tracking-wide mt-1">
              {NUMERALS} &amp; ! @ # $ % &amp; * ( ): " "
            </p>
          </div>
          <div className="px-8 py-3 bg-secondary border-t border-border flex items-center gap-6">
            <span className="text-xs text-ink-muted">Google Fonts · Free</span>
            <span className="text-xs text-ink-muted">Weight used: Regular (400)</span>
            <a href="https://fonts.google.com/specimen/Young+Serif" target="_blank" rel="noopener noreferrer" className="text-xs ml-auto">
              fonts.google.com →
            </a>
          </div>
        </div>

        {/* Inter */}
        <div className="mb-10 rounded-sm border border-border overflow-hidden">
          <div className="px-8 pt-10 pb-8 bg-background">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-6">
              Inter · UI, Body &amp; Labels
            </p>
            <p className="font-sans text-6xl font-semibold text-foreground leading-none mb-6">
              Inter
            </p>
            <p className="font-sans text-2xl font-normal text-foreground mb-2 leading-snug">
              Strata management, simplified.
            </p>
            <p className="font-sans text-base text-ink-muted leading-relaxed mb-8">
              Clear, neutral, and legible at every size. Inter handles UI labels, body copy,
              captions, and any context where Young Serif would feel too heavy.
            </p>
            <p className="font-sans text-sm text-foreground/50 tracking-wide">
              {ALPHABET}
            </p>
            <p className="font-sans text-sm text-foreground/50 tracking-wide mt-1">
              {NUMERALS} &amp; ! @ # $ % &amp; * ( ): " "
            </p>
          </div>
          <div className="px-8 py-3 bg-secondary border-t border-border flex items-center gap-6">
            <span className="text-xs text-ink-muted">Google Fonts · Free &amp; open source</span>
            <span className="text-xs text-ink-muted">Variable font: all weights</span>
          </div>
        </div>

        {/* JetBrains Mono */}
        <div className="rounded-sm border border-border overflow-hidden">
          <div className="px-8 pt-10 pb-8 bg-background">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-6">
              JetBrains Mono · Code
            </p>
            <p className="font-mono text-5xl font-normal text-foreground leading-none mb-6">
              01_AB
            </p>
            <p className="font-mono text-sm text-foreground mb-8 leading-relaxed">
              <span className="text-[#C8F169]">const</span> strata = <span className="text-[#C8F169]">await</span> scheme.getLevies(&#123; plan: <span className="text-ink-muted">"SP12345"</span> &#125;)
            </p>
            <p className="font-mono text-sm text-foreground/50">
              {ALPHABET}
            </p>
            <p className="font-mono text-sm text-foreground/50 mt-1">
              {NUMERALS} &amp; ! @ # $ % &amp; * ( ): " "
            </p>
          </div>
          <div className="px-8 py-3 bg-secondary border-t border-border flex items-center gap-6">
            <span className="text-xs text-ink-muted">Google Fonts · Free &amp; open source</span>
            <span className="text-xs text-ink-muted">14px · weight 400–500</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TYPE SCALE
      ══════════════════════════════════════════════ */}
      <section id="type-scale">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Type Scale
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">

          {/* Display */}
          <div className="px-8 py-10 bg-background">
            <div className="flex items-start justify-between gap-4 mb-4">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted shrink-0 pt-1">Display</span>
              <span className="text-[10px] text-ink-muted/60 text-right shrink-0">Young Serif · 400 · 64px · −0.02em</span>
            </div>
            <p className="font-display text-[64px] text-foreground leading-none">
              Strata
            </p>
          </div>

          {/* H1 */}
          <div className="px-8 py-8 bg-background">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted shrink-0 pt-0.5">H1</span>
              <span className="text-[10px] text-ink-muted/60 text-right shrink-0">Young Serif · 400 · 48px</span>
            </div>
            <h1 className="font-display text-5xl text-foreground leading-tight">
              Everything in one place
            </h1>
          </div>

          {/* H2 */}
          <div className="px-8 py-7 bg-background">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted shrink-0 pt-0.5">H2</span>
              <span className="text-[10px] text-ink-muted/60 text-right shrink-0">Young Serif · 400 · 36px</span>
            </div>
            <h2 className="font-display text-4xl text-foreground leading-snug">
              Simplify your strata management
            </h2>
          </div>

          {/* H3 */}
          <div className="px-8 py-6 bg-background">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted shrink-0 pt-0.5">H3</span>
              <span className="text-[10px] text-ink-muted/60 text-right shrink-0">Inter · 600 · 22px</span>
            </div>
            <h3 className="font-sans text-[22px] font-semibold text-foreground leading-snug">
              Levy notices, levies and budgets
            </h3>
          </div>

          {/* H4 */}
          <div className="px-8 py-5 bg-background">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted shrink-0 pt-0.5">H4</span>
              <span className="text-[10px] text-ink-muted/60 text-right shrink-0">Inter · 600 · 18px</span>
            </div>
            <h4 className="font-sans text-lg font-semibold text-foreground">
              Annual general meeting schedule
            </h4>
          </div>

          {/* Eyebrow */}
          <div className="px-8 py-5 bg-background">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted shrink-0 pt-0.5">Eyebrow</span>
              <span className="text-[10px] text-ink-muted/60 text-right shrink-0">Inter · 600 · 11px · All caps · 0.1em tracking</span>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
              For strata managers
            </p>
          </div>

          {/* Body Large */}
          <div className="px-8 py-5 bg-background">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted shrink-0 pt-0.5">Body Large</span>
              <span className="text-[10px] text-ink-muted/60 text-right shrink-0">Inter · 400 · 18px · 1.7 leading</span>
            </div>
            <p className="font-sans text-lg font-normal text-ink-muted leading-[1.7]">
              Instant Strata brings levy management, maintenance tracking, and owner communications into a single workspace: so nothing falls through the cracks.
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-5 bg-background">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted shrink-0 pt-0.5">Body</span>
              <span className="text-[10px] text-ink-muted/60 text-right shrink-0">Inter · 400 · 16px · 1.65 leading</span>
            </div>
            <p className="font-sans text-base font-normal text-ink-muted leading-[1.65]">
              Instant Strata brings levy management, maintenance tracking, and owner communications into a single workspace: so nothing falls through the cracks.
            </p>
          </div>

          {/* Caption */}
          <div className="px-8 py-5 bg-background">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted shrink-0 pt-0.5">Caption</span>
              <span className="text-[10px] text-ink-muted/60 text-right shrink-0">Inter · 500 · 12px</span>
            </div>
            <p className="font-sans text-xs font-medium text-ink-muted">
              Last updated 12 June 2026 · SP12345 Sunrise Apartments
            </p>
          </div>

          {/* Mono */}
          <div className="px-8 py-5 bg-background">
            <div className="flex items-start justify-between gap-4 mb-3">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted shrink-0 pt-0.5">Mono</span>
              <span className="text-[10px] text-ink-muted/60 text-right shrink-0">JetBrains Mono · 400 · 14px</span>
            </div>
            <p className="font-mono text-sm font-normal text-foreground">
              npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/button/registry.json
            </p>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PARAGRAPH
      ══════════════════════════════════════════════ */}
      <section id="paragraph">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Paragraph
        </p>
        <ComponentPreview label="Light section">
          <div className="w-full max-w-[640px] mx-auto space-y-4 py-4">
            <h2 className="font-display text-3xl text-foreground leading-snug">
              One platform for every strata task
            </h2>
            <p className="font-sans text-base text-ink-muted leading-[1.65]">
              Managing a strata scheme means juggling levy notices, maintenance requests,
              AGM minutes, insurance renewals, and owner queries: often simultaneously.
              Instant Strata gives every role in your team a single place to work, so
              context is never lost and nothing gets overlooked.
            </p>
            <p className="font-sans text-base text-ink-muted leading-[1.65]">
              Whether you manage five lots or five hundred, the workflow is the same:
              raise a levy, send a notice, log a job. Every action is audited and every
              document is versioned. Your team stays aligned. Your owners stay informed.
            </p>
          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          BLOCKQUOTE / TESTIMONIAL
      ══════════════════════════════════════════════ */}
      <section id="quote">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Quote
        </p>
        <ComponentPreview label="Dark section: quote card">
          <div className="w-full bg-[#043F2E] rounded-sm px-8 py-14">
            <div className="flex gap-6 items-start">
              {/* Card + oversized quote mark */}
              <div className="relative flex-1 min-w-0">
                {/* Quote card */}
                <div className="relative z-10 rounded-sm bg-[#EBF8C2] px-8 pt-8 pb-6">
                  <p className="font-display text-xl leading-relaxed text-[#043F2E] mb-8">
                    Instant Strata is incredibly valuable: our team can raise a levy, send notices, and log a maintenance job in minutes, not hours. Owners actually read our communications now.
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-sans text-sm font-semibold text-[#043F2E]">Sarah Mitchell</p>
                      <p className="font-sans text-xs text-[#043F2E]/60">Senior Strata Manager</p>
                    </div>
                    <p className="font-sans text-xs font-semibold uppercase tracking-widest text-[#043F2E]/40">
                      Coastal Strata Co.
                    </p>
                  </div>
                </div>

                {/* Oversized quotation mark: graphic device */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-5 -left-3 font-display text-[120px] leading-none text-[#C8F169]/30 select-none z-0 translate-y-2"
                >
                  ,,
                </div>
              </div>

              {/* Portrait: breaks out of card */}
              <div className="shrink-0 w-28 h-36 rounded-sm bg-[#0A5C3D] overflow-hidden mt-4 hidden sm:block">
                <div className="w-full h-full flex items-center justify-center text-white/20 text-xs font-mono">
                  photo
                </div>
              </div>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          INLINE COMMENT / ANNOTATION
      ══════════════════════════════════════════════ */}
      <section id="comment">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Comment &amp; Annotation
        </p>
        <ComponentPreview label="Inline annotation styles">
          <div className="w-full max-w-[600px] space-y-5 py-2">

            {/* Inline note */}
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 w-1 self-stretch rounded-full bg-[#C8F169] shrink-0" />
              <p className="font-sans text-sm text-ink-muted leading-relaxed">
                <span className="font-semibold text-foreground">Note:</span>{" "}
                Levy notices are sent automatically 14 days before the due date.
                You can adjust the lead time in Settings → Levy Schedule.
              </p>
            </div>

            {/* Warning note */}
            <div className="flex gap-3 items-start">
              <div className="mt-0.5 w-1 self-stretch rounded-full bg-amber-400 shrink-0" />
              <p className="font-sans text-sm text-ink-muted leading-relaxed">
                <span className="font-semibold text-foreground">Warning:</span>{" "}
                Changing the plan administrator will revoke access for the current
                administrator immediately. This action cannot be undone.
              </p>
            </div>

            {/* Code comment */}
            <div className="rounded-sm bg-[#043F2E] px-4 py-3">
              <p className="font-mono text-xs text-white/40 leading-relaxed">
                {`// Returns the levy schedule for the given strata plan.`}
              </p>
              <p className="font-mono text-xs text-white/40 leading-relaxed">
                {`// Raises NotFoundError if the plan does not exist.`}
              </p>
              <p className="font-mono text-xs text-white leading-relaxed mt-1">
                <span className="text-[#C8F169]">async function</span>{" "}getLevySchedule(plan:{" "}
                <span className="text-[#C8F169]">string</span>)
              </p>
            </div>

            {/* Caption / meta */}
            <p className="font-sans text-xs font-medium text-ink-muted">
              Fig. 1: Levy schedule for SP12345 · Updated 12 June 2026 · Draft
            </p>

          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          EYEBROW + HEADING PATTERN
      ══════════════════════════════════════════════ */}
      <section id="eyebrow">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Eyebrow + Heading
        </p>
        <ComponentPreview label="Light section">
          <div className="w-full max-w-[500px] space-y-6 py-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted mb-3">
                For strata managers
              </p>
              <h2 className="font-display text-3xl text-foreground leading-tight">
                Everything in one place
              </h2>
            </div>
            <div className="h-px bg-border" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#C8F169] mb-3">
                What owners love
              </p>
              <h2 className="font-display text-3xl text-white leading-tight bg-[#043F2E] -mx-8 -mb-6 px-8 pt-6 pb-8 rounded-b-sm">
                Always in the loop
              </h2>
            </div>
          </div>
        </ComponentPreview>
      </section>

    </DocsPage>
  );
}
