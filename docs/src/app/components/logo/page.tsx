import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Logo, LogoMark } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { Globe, Mail, MapPin, Phone } from "lucide-react";

const INSTALL_CODE = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/logo/registry.json`;

const USAGE_MARK_CODE = `import { LogoMark } from "@/components/ui/logo"

export function Example() {
  return <LogoMark surface="light" />
}`;

const USAGE_LOCKUP_CODE = `import { Logo } from "@/components/ui/logo"

export function Example() {
  return <Logo variant="lockup" surface="light" />
}`;

const PROPS = [
  {
    name: "variant",
    type: '"mark" | "lockup"',
    default: '"lockup"',
    description: "Icon mark only, or lockup with the Instant Strata wordmark beside it.",
  },
  {
    name: "surface",
    type: '"light" | "primary" | "dark"',
    default: '"light"',
    description:
      "Background context. Light: lime container with forest letterforms. Primary: forest container with white letterforms on lime backgrounds. Dark: secondary container with primary (lime) letterforms and wordmark on forest backgrounds.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Scales the mark and wordmark together.",
  },
];

/** Standard Australian business card proportions (90 × 55 mm). */
const BUSINESS_CARD_CLASS =
  "relative w-[340px] max-w-full aspect-[90/55] rounded-sm border border-border overflow-hidden";

interface BusinessCardPerson {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
}

const BUSINESS_CARD_PEOPLE: BusinessCardPerson[] = [
  {
    name: "Levi Putna",
    title: "Co-founder",
    email: "levi@instantstrata.com",
    phone: "+61 400 000 000",
    location: "Sydney, Australia",
  },
  {
    name: "Nikhil Pradhan",
    title: "Co-founder",
    email: "nikhil@instantstrata.com",
    phone: "+61 400 000 000",
    location: "Sydney, Australia",
  },
];

/**
 * Company-facing side: logo lockup, tagline, and website. Shared across the team.
 */
function BusinessCardFront() {
  return (
    <div className={cn(BUSINESS_CARD_CLASS, "bg-white shadow-sm")}>
      {/* Safe zone: generous margins, content grouped toward optical centre */}
      <div className="absolute inset-0 flex flex-col justify-between p-7">
        {/* Brand lockup */}
        <div className="flex flex-col items-start gap-6">
          <Logo variant="lockup" surface="light" size="lg" />
          <p className="font-display text-lg text-ink leading-snug max-w-[220px]">
            Strata management, simplified.
          </p>
        </div>

        {/* Website */}
        <div className="flex items-center gap-2 text-ink-muted">
          <Globe className="size-3.5 shrink-0 text-forest" strokeWidth={1.5} aria-hidden />
          <span className="font-sans text-xs tracking-wide">instantstrata.com</span>
        </div>
      </div>

      {/* Lime accent: anchors the card without filling the surface */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-lime" aria-hidden />
    </div>
  );
}

interface BusinessCardBackProps {
  person: BusinessCardPerson;
}

/**
 * Personal side: name hierarchy, role, and contact details with Lucide icons.
 */
function BusinessCardBack({ person }: BusinessCardBackProps) {
  return (
    <div className={cn(BUSINESS_CARD_CLASS, "bg-off-white shadow-sm")}>
      <div className="absolute inset-0 flex flex-col justify-between p-7">
        {/* Name and role */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
            Instant Strata
          </p>
          <h3 className="font-display text-2xl text-ink leading-tight mb-1">{person.name}</h3>
          <p className="font-sans text-sm text-ink-muted">{person.title}</p>
        </div>

        {/* Contact block: icons paired with labels, never icon-only */}
        <ul className="space-y-2">
          <li className="flex items-center gap-2.5 min-w-0">
            <Mail className="size-3.5 shrink-0 text-forest" strokeWidth={1.5} aria-hidden />
            <span className="font-sans text-xs text-ink truncate">{person.email}</span>
          </li>
          <li className="flex items-center gap-2.5">
            <Phone className="size-3.5 shrink-0 text-forest" strokeWidth={1.5} aria-hidden />
            <span className="font-sans text-xs text-ink">{person.phone}</span>
          </li>
          <li className="flex items-center gap-2.5">
            <MapPin className="size-3.5 shrink-0 text-forest" strokeWidth={1.5} aria-hidden />
            <span className="font-sans text-xs text-ink">{person.location}</span>
          </li>
        </ul>
      </div>

      {/* Forest rule: ties back to brand anchor colour */}
      <div className="absolute top-0 left-7 right-7 h-px bg-border" aria-hidden />
    </div>
  );
}

/**
 * Foundation documentation page for the Instant Strata logo.
 */
export default function LogoPage() {
  return (
    <DocsPage className="space-y-20">

      {/* Page header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Logo
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          The Instant Strata mark is <strong className="font-semibold text-foreground">IS</strong> in
          Young Serif inside a square container. The container is rotated 15° for energy; the
          letterforms stay upright. Use the lockup with the wordmark on marketing surfaces, or the
          icon mark alone where space is tight.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          LOCKUP: WHITE
      ══════════════════════════════════════════════ */}
      <section id="lockup-light">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Lockup · light background
        </p>
        <h2 className="font-display text-2xl text-foreground mb-6">
          Icon + wordmark on white
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-2xl">
          Default treatment for headers, footers, and light sections. Lime container, forest
          letterforms and wordmark.
        </p>

        <ComponentPreview label="surface=&quot;light&quot;">
          <Logo variant="lockup" surface="light" size="lg" />
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          EXAMPLES
      ══════════════════════════════════════════════ */}
      <section id="examples">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Examples
        </p>
        <h2 className="font-display text-2xl text-foreground mb-2">Business cards</h2>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Double-sided cards at standard Australian proportions (90 × 55 mm).
          The company side carries the logo lockup and tagline; the personal side leads with
          name and role, then contact details with Lucide icons at 14px. Keep margins generous,
          limit copy to essentials, and never rely on icons alone for contact information.
        </p>

        <ul className="space-y-2 mb-8 max-w-2xl">
          {[
            "Company side: white background, logo lockup, Young Serif tagline, website with Globe icon.",
            "Personal side: off-white background, eyebrow label, display name, title, then email, phone, and location with icons.",
            "Safe zone: 7 units of padding on all sides. Lime or forest accents as thin rules, not full bleeds.",
            "Print at 300 dpi. Use brand hex values only; no drop shadows on the printed artefact.",
          ].map((rule) => (
            <li key={rule} className="flex gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <span className="text-lime shrink-0 mt-0.5" aria-hidden="true">-</span>
              {rule}
            </li>
          ))}
        </ul>

        <div className="space-y-10">
          <ComponentPreview label="Company side (shared)">
            <div className="py-4">
              <BusinessCardFront />
            </div>
          </ComponentPreview>

          <ComponentPreview label="Personal side">
            <div className="flex flex-wrap gap-8 py-4">
              {BUSINESS_CARD_PEOPLE.map((person) => (
                <div key={person.name} className="space-y-3">
                  <BusinessCardBack person={person} />
                  <p className="font-sans text-xs text-ink-muted text-center">{person.name}</p>
                </div>
              ))}
            </div>
          </ComponentPreview>

          <ComponentPreview label="Full set (front and back)">
            <div className="flex flex-wrap gap-10 py-4">
              {BUSINESS_CARD_PEOPLE.map((person) => (
                <div key={person.name} className="space-y-4">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                    {person.name}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <div className="space-y-2">
                      <p className="font-sans text-[10px] uppercase tracking-wider text-ink-muted">
                        Front
                      </p>
                      <BusinessCardFront />
                    </div>
                    <div className="space-y-2">
                      <p className="font-sans text-[10px] uppercase tracking-wider text-ink-muted">
                        Back
                      </p>
                      <BusinessCardBack person={person} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LOCKUP: PRIMARY
      ══════════════════════════════════════════════ */}
      <section id="lockup-primary">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Lockup · primary background
        </p>
        <h2 className="font-display text-2xl text-foreground mb-6">
          Icon + wordmark on lime
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-2xl">
          On primary (lime) sections the container inverts to forest so the mark remains visible.
          The wordmark stays forest for legibility on the lime surface.
        </p>

        <div className="rounded-sm border border-border overflow-hidden">
          <div className="px-4 py-2 border-b border-border bg-off-white">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
              surface=&quot;primary&quot;
            </span>
          </div>
          <div className="bg-primary flex items-center justify-center p-12 min-h-40">
            <Logo variant="lockup" surface="primary" size="lg" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MARK ONLY
      ══════════════════════════════════════════════ */}
      <section id="mark">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Icon mark
        </p>
        <h2 className="font-display text-2xl text-foreground mb-6">
          Mark without wordmark
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-2xl">
          Use the icon alone in compact UI: nav bars, favicons, app icons, and badges. Always keep
          the square container; never use the letterforms without it.
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          <ComponentPreview label="light">
            <LogoMark surface="light" size="lg" />
          </ComponentPreview>

          <div className="rounded-sm border border-border overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-off-white">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                primary
              </span>
            </div>
            <div className="bg-primary flex items-center justify-center p-12 min-h-40">
              <LogoMark surface="primary" size="lg" />
            </div>
          </div>

          <div className="rounded-sm border border-border overflow-hidden">
            <div className="px-4 py-2 border-b border-border bg-off-white">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                dark
              </span>
            </div>
            <div className="bg-forest flex items-center justify-center p-12 min-h-40">
              <LogoMark surface="dark" size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SIZES
      ══════════════════════════════════════════════ */}
      <section id="sizes">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Sizes
        </p>

        <div className="flex flex-wrap items-end gap-10 rounded-sm border border-border bg-white p-10">
          <Logo variant="lockup" surface="light" size="sm" />
          <Logo variant="lockup" surface="light" size="md" />
          <Logo variant="lockup" surface="light" size="lg" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          INSTALLATION
      ══════════════════════════════════════════════ */}
      <section id="installation">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Installation
        </p>
        <CodeBlock code={INSTALL_CODE} language="bash" />
      </section>

      {/* ══════════════════════════════════════════════
          USAGE
      ══════════════════════════════════════════════ */}
      <section id="usage">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Usage
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Lockup</h3>
            <CodeBlock code={USAGE_LOCKUP_CODE} language="tsx" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Icon mark</h3>
            <CodeBlock code={USAGE_MARK_CODE} language="tsx" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          PROPS
      ══════════════════════════════════════════════ */}
      <section id="props">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Props
        </p>
        <PropTable props={PROPS} />
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
            "Always use the square container: never the IS letterforms alone.",
            "Container rotates 15°; letterforms stay upright.",
            "Minimum mark size: 24×24px (size=\"sm\").",
            "Clear space: equal to the container width on all sides.",
            "Light backgrounds: lime container, forest letterforms.",
            "Primary (lime) backgrounds: forest container, white letterforms.",
            "Dark (forest) backgrounds: secondary container, primary (lime) letterforms and wordmark.",
            "Never stretch, recolour outside these surfaces, or add drop shadows.",
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
