import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { Notification } from "@/components/ui/notification";
import {
  Building2,
  CircleCheck,
  MessageSquareText,
  Scale,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/* ─── Principles ──────────────────────────────────────── */

const PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "Trustworthy",
    body: "Owners and committees hand us their homes and their money. Every word should feel capable, honest, and calm. We explain what is happening and what happens next, without hedging or hiding behind process.",
  },
  {
    icon: MessageSquareText,
    title: "Plain",
    body: "Strata has enough complexity already. We use everyday language in the UI and reserve legal precision for documents that need it. If a manager would not say it out loud to an owner, it does not belong on screen.",
  },
  {
    icon: Scale,
    title: "Efficient",
    body: "Managers work at pace. Owners scan on their phones between meetings. Copy is direct, scannable, and free of filler. Say the thing once, in the fewest words that still feel human.",
  },
] as const;

/* ─── How to write ────────────────────────────────────── */

const WRITING_GUIDELINES = [
  {
    title: "Lead with the benefit",
    body: "Tell people what they gain or what changes for them. Marketing headlines and empty states should answer \"why should I care?\" before \"how does it work?\"",
  },
  {
    title: "Be concise",
    body: "Aim for full clarity in as few words as possible. Headlines should work without subcopy. Body text stays under 65 characters per line where layout allows.",
  },
  {
    title: "Use Australian English",
    body: "Colour, organisation, levies, and strata plan numbering follow local convention. Dates read as 30 Jun, not June 30. Currency is AUD unless context says otherwise.",
  },
  {
    title: "Name things consistently",
    body: "Scheme, lot, owner, levy, and work item mean specific things in this product. Use the domain vocabulary table below. Do not mix synonyms (building vs scheme, unit vs lot) in the same surface.",
  },
  {
    title: "Match the moment",
    body: "Marketing can be confident and warm. Product UI stays neutral and helpful. Errors and compliance notices are direct and reassuring, never playful.",
  },
] as const;

/* ─── Right place, right tone ─────────────────────────── */

const TONE_CONTEXTS = [
  {
    id: "standing-out",
    title: "Standing out",
    situation: "Hero bands, social proof, billboards, and anywhere you have seconds to land the message.",
    how: ["Short and confident", "Benefit-first", "Young Serif headlines, plain subcopy"],
    good: [
      "Strata management, simplified.",
      "Everything in one place, from day one.",
      "Levies, compliance, and correspondence. One platform.",
    ],
    avoid: [
      "Revolutionary next-generation strata ecosystem.",
      "Leverage synergistic OC management solutions.",
    ],
  },
  {
    id: "converting",
    title: "Converting customers",
    situation: "Landing pages, pricing, feature rows, and App Store listings where people need a reason to sign up.",
    how: ["Direct and concrete", "Real outcomes, not feature lists", "One primary CTA per section"],
    good: [
      "Send levy notices and track payments without switching systems.",
      "See every open task across your portfolio in one inbox.",
      "Owners get a portal for levies, documents, and updates.",
    ],
    avoid: [
      "Our best-in-class modular workflow engine empowers stakeholders.",
      "Unlock holistic visibility across your asset portfolio.",
    ],
  },
  {
    id: "product-ui",
    title: "Product UI",
    situation: "Labels, table headers, navigation, form fields, and metadata in the manager and owner experience.",
    how: ["Noun-first labels", "Sentence case", "No marketing adjectives"],
    good: [
      "Needs your attention",
      "Levy overdue",
      "Awaiting review",
      "SP 1042",
    ],
    avoid: [
      "Supercharge your workflow!",
      "Mission-critical action items",
      "Leverage the dashboard",
    ],
  },
  {
    id: "delight",
    title: "Adding clarity",
    situation: "Hints, empty states, onboarding steps, and microcopy that guides without patronising.",
    how: ["Helpful, not cute", "One idea per line", "Optional humour only when stakes are low"],
    good: [
      "No open tasks. New items from email and the portal appear here.",
      "Upload the AGM minutes to close this work item.",
      "Owners with overdue levies cannot hold a proxy.",
    ],
    avoid: [
      "You're all caught up! Time for a cuppa.",
      "Oopsie! Something went wrong.",
    ],
  },
  {
    id: "reassurance",
    title: "Providing reassurance",
    situation: "Errors, failed payments, blocked actions, statutory deadlines, and compliance warnings.",
    how: ["State what happened", "Say what to do next", "No jokes, no blame"],
    good: [
      "Levy payment failed. Check the account details and try again, or contact the owner.",
      "This transfer is taking longer than usual. We will email you when it completes.",
      "We have temporarily locked this account after several failed sign-in attempts.",
    ],
    avoid: [
      "Uh oh, something broke!",
      "Invalid input detected in field 3.",
      "User error: payment declined.",
    ],
  },
] as const;

/* ─── Domain vocabulary ───────────────────────────────── */

const VOCABULARY = [
  { term: "Scheme", use: "The owners corporation for a building. Always scheme in product UI, not OC or body corporate.", example: "Harbour View Towers · SP 1042" },
  { term: "Lot", use: "An entry on the strata roll. Pair with lot number.", example: "Lot 12" },
  { term: "Owner", use: "Registered proprietor on the roll. Distinct from tenant or occupant.", example: "James Chen" },
  { term: "Levy", use: "Owner contribution to scheme funds. Status: paid, due, overdue, not assessed.", example: "Levy overdue" },
  { term: "Work item", use: "Operational task in a workflow. Prefer over ticket or case in UI.", example: "Review AGM minutes" },
  { term: "SP number", use: "Strata plan identifier. Uppercase SP prefix, mono styling.", example: "SP 1042" },
  { term: "AGM", use: "Acceptable abbreviation when context is clear. Spell out once on public marketing if needed.", example: "AGM minutes due" },
  { term: "R-A-S", use: "Review-and-sign gate for automatable work. Use the badge label, not the full phrase in dense UI.", example: "R-A-S" },
] as const;

/* ─── Statement library ───────────────────────────────── */

const STATEMENTS = [
  {
    context: "Primary CTA",
    good: "Try for free",
    bad: "Get started now!",
  },
  {
    context: "Secondary CTA",
    good: "Request demo",
    bad: "Book a discovery call with our team",
  },
  {
    context: "Danger notification",
    good: "Levy payment failed",
    bad: "Error: transaction unsuccessful",
  },
  {
    context: "Warning notification",
    good: "AGM date not confirmed",
    bad: "Warning: pending calendar event",
  },
  {
    context: "Empty inbox",
    good: "No open tasks",
    bad: "Your inbox is empty. Enjoy the silence!",
  },
  {
    context: "Required field",
    good: "Scheme name",
    bad: "Please enter the mandatory scheme name field",
  },
] as const;

interface PrincipleCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
}

/**
 * Renders a tone principle with icon, title, and description.
 */
function PrincipleCard({ icon: Icon, title, body }: PrincipleCardProps) {
  return (
    <div className="rounded-sm border border-border bg-white p-6">
      <div className="mb-4 inline-flex size-10 items-center justify-center rounded-sm bg-lime-soft text-forest">
        <Icon className="size-5" strokeWidth={1.5} aria-hidden />
      </div>
      <h3 className="font-display text-xl text-foreground mb-2">{title}</h3>
      <p className="font-sans text-sm text-ink-muted leading-relaxed">{body}</p>
    </div>
  );
}

interface ToneContextBlockProps {
  title: string;
  situation: string;
  how: ReadonlyArray<string>;
  good: ReadonlyArray<string>;
  avoid: ReadonlyArray<string>;
}

/**
 * Renders a contextual tone section with guidance and examples.
 */
function ToneContextBlock({ title, situation, how, good, avoid }: ToneContextBlockProps) {
  return (
    <div className="rounded-sm border border-border overflow-hidden">
      <div className="px-6 py-5 bg-secondary border-b border-border">
        <h3 className="font-display text-xl text-foreground mb-2">{title}</h3>
        <p className="font-sans text-sm text-ink-muted leading-relaxed">{situation}</p>
      </div>

      <div className="px-6 py-4 bg-background border-b border-border">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          How
        </p>
        <ul className="space-y-2">
          {how.map((item) => (
            <li key={item} className="flex gap-2 font-sans text-sm text-ink-muted">
              <span className="text-lime shrink-0" aria-hidden="true">-</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
        <div className="px-6 py-4 bg-background">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
            Write like this
          </p>
          <ul className="space-y-2">
            {good.map((item) => (
              <li key={item} className="font-sans text-sm text-foreground leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="px-6 py-4 bg-background">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
            Not like this
          </p>
          <ul className="space-y-2">
            {avoid.map((item) => (
              <li key={item} className="font-sans text-sm text-ink-muted/70 leading-relaxed line-through decoration-ink-muted/40">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Foundation documentation for Instant Strata tone of voice.
 */
export default function ToneOfVoicePage() {
  return (
    <DocsPage className="space-y-20">

      {/* ── Page header ───────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Overview
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Tone of voice
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl mb-4">
          Instant Strata helps strata managers run schemes with less friction and gives
          owners a clearer picture of their building. The way we write should feel as
          dependable as the product: professional, plain, and respectful of people&apos;s time.
        </p>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          There is one Instant Strata voice. Tone flexes with context: a hero headline can
          carry more energy than a levy overdue badge, but both should sound like they come
          from the same team.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          PRINCIPLES
      ══════════════════════════════════════════════ */}
      <section id="principles">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Principles
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-2xl">
          The foundations that guide every headline, label, notification, and email.
          When you are unsure, return to these three.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <PrincipleCard key={principle.title} {...principle} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          HOW TO WRITE
      ══════════════════════════════════════════════ */}
      <section id="how-to-write">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          How to speak Instant Strata
        </p>
        <div className="space-y-4 max-w-2xl">
          {WRITING_GUIDELINES.map((guideline, index) => (
            <div key={guideline.title} className="flex gap-4">
              <span className="font-mono text-xs text-lime shrink-0 pt-0.5 w-5">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-sans text-sm font-semibold text-foreground mb-1">
                  {guideline.title}
                </h3>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">
                  {guideline.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          RIGHT PLACE, RIGHT TONE
      ══════════════════════════════════════════════ */}
      <section id="right-tone">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Right place, right tone
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-2xl">
          The voice stays consistent. The energy changes. Dial up confidence on marketing
          surfaces; dial down to calm precision in product UI and when something has gone wrong.
        </p>
        <div className="space-y-6">
          {TONE_CONTEXTS.map((context) => (
            <ToneContextBlock key={context.id} {...context} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LIVE EXAMPLES
      ══════════════════════════════════════════════ */}
      <section id="examples">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Examples in UI
        </p>

        <ComponentPreview label="Reassurance · danger and warning notifications">
          <div className="w-full max-w-md space-y-4 py-2">
            <Notification type="danger" title="Levy payment failed">
              Check the account details and try again, or contact the owner directly.
            </Notification>
            <Notification type="warning" title="AGM date not confirmed">
              Set the date in scheme settings before sending the notice pack.
            </Notification>
          </div>
        </ComponentPreview>

        <div className="mt-6">
          <ComponentPreview label="Product UI · metadata and labels">
            <div className="w-full max-w-sm py-2 space-y-3">
              <div className="flex items-center gap-3 rounded-sm border border-border px-4 py-3">
                <Building2 className="size-4 text-ink-muted shrink-0" strokeWidth={1.5} aria-hidden />
                <div>
                  <p className="text-sm font-medium text-foreground">Harbour View Towers</p>
                  <p className="text-xs text-ink-muted">SP 1042 · South Brisbane, QLD</p>
                </div>
              </div>
              <p className="font-sans text-xs text-ink-muted">
                Scheme name first, plan number and location as metadata. No adjectives.
              </p>
            </div>
          </ComponentPreview>
        </div>

        <div className="mt-6">
          <ComponentPreview label="Marketing · hero headline pattern">
            <div className="w-full max-w-xl py-2">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
                For strata managers
              </p>
              <h2 className="font-display text-3xl text-foreground leading-tight mb-4">
                Everything in one place
              </h2>
              <p className="font-sans text-base text-ink-muted leading-relaxed max-w-prose">
                Levies, compliance, correspondence, and owner requests. One inbox, one roll,
                one source of truth for every scheme you manage.
              </p>
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          VOCABULARY
      ══════════════════════════════════════════════ */}
      <section id="vocabulary">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Strata vocabulary
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Domain terms are intentional. Use them consistently so managers and owners learn
          the product language once.
        </p>
        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">
          {VOCABULARY.map((row) => (
            <div key={row.term} className="px-6 py-4 bg-background">
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8 mb-2">
                <code className="font-mono text-sm text-foreground shrink-0 sm:w-28">{row.term}</code>
                <p className="font-sans text-sm text-ink-muted leading-relaxed flex-1">{row.use}</p>
              </div>
              <p className="font-sans text-xs text-ink-muted/80 sm:pl-[7.5rem]">
                Example: {row.example}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STATEMENT LIBRARY
      ══════════════════════════════════════════════ */}
      <section id="statements">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Statement library
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Prefer the left column. The right column shows common drift: too long, too vague,
          or too casual for the context.
        </p>
        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border">
          {STATEMENTS.map((row) => (
            <div key={row.context} className="grid md:grid-cols-[8rem_1fr_1fr] gap-3 md:gap-6 px-6 py-4 bg-background">
              <p className="font-sans text-xs font-semibold text-ink-muted uppercase tracking-wide">
                {row.context}
              </p>
              <div className="flex items-start gap-2">
                <CircleCheck className="size-4 text-lime shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden />
                <p className="font-sans text-sm text-foreground">{row.good}</p>
              </div>
              <p className="font-sans text-sm text-ink-muted/70 md:border-l md:border-border md:pl-6">
                {row.bad}
              </p>
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
            "No legal jargon in the UI. Reserve formal language for generated documents and contracts.",
            "Sentence case for labels and buttons. ALL CAPS only for eyebrows and mono identifiers (SP, Lot).",
            "One primary CTA per section. Button labels are verbs: Try for free, Request demo, View inbox.",
            "Never blame the user in error copy. State the problem, then the next step.",
            "Do not use exclamation marks in product UI. Marketing may use one sparingly in hero copy.",
            "AI-generated copy in the product should follow the same rules as human-written copy.",
            "Tagline: Strata management, simplified. Use it consistently, do not rephrase for variation.",
          ].map((rule) => (
            <li key={rule} className="flex gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <Sparkles className="size-4 text-lime shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden />
              {rule}
            </li>
          ))}
        </ul>
      </section>

    </DocsPage>
  );
}
