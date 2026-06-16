import { assetPath, cn } from "@/lib/utils"
import { ChevronRight, Play } from "lucide-react"
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react"
import { FeatureCard } from "@/components/ui/card"
import { InfographicChartPair, InfographicReports } from "@/components/ui/infographic"

// ─────────────────────────────────────────────────────────
// Marketing sections: Mode-inspired composed page blocks
//
// Six layout patterns adapted for Instant Strata marketing pages:
//   · MarketingSpotlight   · modern-bi "End-to-end self-service…"
//   · MarketingBenefits    · ad-hoc "Turn your analytical work up to 11"
//   · MarketingVisual      · self-serve "Visual thinkers welcome"
//   · MarketingCycle       · platform "The cycle of ad hoc…"
//   · MarketingTour        · platform "Take the tour, on your time"
//   · MarketingGoverned    · self-serve "Curated and governed data…"
// ─────────────────────────────────────────────────────────

export interface MarketingEyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  /** When true, uses lime on dark section backgrounds. */
  onDark?: boolean
}

/**
 * Uppercase section label above a Young Serif heading.
 */
export function MarketingEyebrow({
  onDark = false,
  className,
  children,
  ...props
}: MarketingEyebrowProps) {
  return (
    <p
      className={cn(
        "text-[10px] font-semibold uppercase tracking-widest mb-3",
        onDark ? "text-lime" : "text-ink-muted",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export interface MarketingHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h2" | "h3"
  size?: "md" | "lg" | "xl"
  onDark?: boolean
}

const headingSizeClass = {
  md: "text-[clamp(1.65rem,3vw,2.25rem)] leading-[1.12]",
  lg: "text-[clamp(1.85rem,3.5vw,2.75rem)] leading-[1.1]",
  xl: "text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.05]",
}

/**
 * Young Serif section heading for marketing blocks.
 */
export function MarketingHeading({
  as: Tag = "h2",
  size = "lg",
  onDark = false,
  className,
  children,
  ...props
}: MarketingHeadingProps) {
  return (
    <Tag
      className={cn(
        "font-display tracking-[-0.02em]",
        headingSizeClass[size],
        onDark ? "text-white" : "text-ink",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export interface MarketingLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  label?: string
}

/**
 * Trailing text link with chevron for section CTAs.
 */
export function MarketingLink({
  label = "Learn more",
  className,
  children,
  ...props
}: MarketingLinkProps) {
  return (
    <a
      className={cn(
        "group inline-flex items-center gap-1 text-sm font-medium text-ink-muted no-underline transition-colors duration-150 hover:text-forest",
        className
      )}
      {...props}
    >
      {children ?? label}
      <ChevronRight
        className="size-4 transition-transform duration-150 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </a>
  )
}

// ─────────────────────────────────────────────────────────
// MarketingSpotlight: two-column feature + optional quote
// Mode modern-bi "End-to-end self-service reporting, your way"
// ─────────────────────────────────────────────────────────

export interface MarketingSpotlightTestimonial {
  quote: string
  name: string
  role: string
}

export interface MarketingSpotlightProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string
  heading: string
  body: string
  /** Right-hand illustration slot. */
  visual?: ReactNode
  testimonial?: MarketingSpotlightTestimonial
  link?: { href: string; label?: string }
}

/**
 * Two-column spotlight: copy and link on the left, visual on the right,
 * with an optional inline testimonial beneath the grid.
 */
export function MarketingSpotlight({
  eyebrow,
  heading,
  body,
  visual,
  testimonial,
  link,
  className,
  ...props
}: MarketingSpotlightProps) {
  return (
    <section className={cn("w-full", className)} {...props}>
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        {/* Copy column */}
        <div className="max-w-prose">
          {eyebrow && <MarketingEyebrow>{eyebrow}</MarketingEyebrow>}

          <MarketingHeading size="lg" className="mb-5">
            {heading}
          </MarketingHeading>

          <p className="text-sm leading-relaxed text-ink-muted md:text-base">
            {body}
          </p>

          {link && (
            <div className="mt-6">
              <MarketingLink href={link.href} label={link.label} />
            </div>
          )}
        </div>

        {/* Visual column */}
        <div className="min-w-0">
          {visual ?? <MarketingSpotlightVisual />}
        </div>
      </div>

      {/* Optional testimonial */}
      {testimonial && (
        <blockquote className="mt-12 max-w-3xl border-l-2 border-lime pl-6 md:mt-16 md:pl-8">
          <p className="font-display text-lg leading-relaxed text-ink md:text-xl">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
          <footer className="mt-4 text-sm text-ink-muted">
            <cite className="not-italic font-semibold text-ink">
              {testimonial.name}
            </cite>
            <span className="mx-1.5 text-ink-muted/50" aria-hidden="true">
              ·
            </span>
            <span>{testimonial.role}</span>
          </footer>
        </blockquote>
      )}
    </section>
  )
}

/** Default BI-stack style illustration for spotlight demos. */
export function MarketingSpotlightVisual({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-off-white p-6 md:p-8",
        className
      )}
    >
      {/* Layered stack illustration */}
      <div className="absolute left-[10%] top-[18%] h-[52%] w-[38%] rounded-lg bg-forest shadow-md" />
      <div className="absolute left-[22%] top-[28%] h-[48%] w-[40%] rounded-lg bg-forest-mid shadow-md" />
      <div className="absolute right-[8%] top-[12%] h-[62%] w-[44%] overflow-hidden rounded-lg border border-border bg-white p-3 shadow-sm">
        <InfographicReports className="h-full text-[8px]" />
      </div>
      <div className="absolute bottom-[10%] left-[14%] rounded-sm bg-lime px-3 py-1.5 text-[10px] font-semibold text-forest">
        Owner portal
      </div>
    </div>
  )
}

/** Sample spotlight copy adapted from Mode&apos;s Datasets section. */
export const MARKETING_SPOTLIGHT_DEFAULT: Omit<
  MarketingSpotlightProps,
  "className"
> = {
  eyebrow: "Self-serve reporting",
  heading: "End-to-end owner reporting, your way",
  body:
    "Curated building datasets are the reusable foundation for self-serve reporting: a layer between your records and the reports owners rely on, with more control over governance, centralised logic, and data usage.",
  testimonial: {
    quote:
      "Now we have a much more collaborative process. We meet with committees weekly and show them what we are thinking. We are not building a dashboard and handing it over; it is a much more iterative, feedback-based process.",
    name: "Sarah Chen",
    role: "Strata Manager",
  },
  link: { href: "#", label: "Learn more" },
}

// ─────────────────────────────────────────────────────────
// MarketingBenefits: heading + benefit card grid
// Mode ad-hoc "Turn your analytical work up to 11"
// ─────────────────────────────────────────────────────────

export interface MarketingBenefitItem {
  title: string
  description: string
}

export interface MarketingBenefitsProps extends HTMLAttributes<HTMLElement> {
  heading: string
  intro: string
  items: MarketingBenefitItem[]
  /** Number of columns on desktop. */
  cols?: 2 | 3
}

/**
 * Section header with a responsive grid of compact benefit cards.
 */
export function MarketingBenefits({
  heading,
  intro,
  items,
  cols = 3,
  className,
  ...props
}: MarketingBenefitsProps) {
  const gridClass = cols === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3"

  return (
    <section className={cn("w-full", className)} {...props}>
      {/* Section header */}
      <div className="mb-10 max-w-prose md:mb-12">
        <MarketingHeading size="lg" className="mb-4">
          {heading}
        </MarketingHeading>
        <p className="text-sm leading-relaxed text-ink-muted md:text-base">
          {intro}
        </p>
      </div>

      {/* Benefit cards */}
      <div className={cn("grid gap-4", gridClass)}>
        {items.map((item) => (
          <MarketingBenefitCard
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </div>
    </section>
  )
}

export interface MarketingBenefitCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
}

/**
 * Compact benefit tile for use inside {@link MarketingBenefits}.
 */
export function MarketingBenefitCard({
  title,
  description,
  className,
  ...props
}: MarketingBenefitCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-off-white p-6 md:p-7",
        className
      )}
      {...props}
    >
      <h3 className="mb-2 text-sm font-semibold text-ink">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-muted">{description}</p>
    </div>
  )
}

/** Sample benefits adapted from Mode&apos;s ad hoc analysis page. */
export const MARKETING_BENEFITS_DEFAULT: Omit<MarketingBenefitsProps, "className"> = {
  heading: "Turn your building operations up to 11",
  intro:
    "When ad hoc reporting and self-serve owner portals live together on one platform, your team can do so much more, so much faster.",
  items: [
    {
      title: "No need for spreadsheets",
      description:
        "Usually, fresh levy reconciliations require exporting to Excel. With Instant Strata, just share a link.",
    },
    {
      title: "Run reports whenever",
      description:
        "You are no longer a blocker for committees requesting updates. As long as they have the report, they can refresh when they need to.",
    },
    {
      title: "The end of the siloed project",
      description:
        "Save ad hoc work to collections, search by building or lot, and build on work from other managers in one organised platform.",
    },
    {
      title: "Exploration for all",
      description:
        "Let committees dive into other cuts of levy and maintenance data and build their own views, without filing a ticket.",
    },
    {
      title: "Lean into dashboards",
      description:
        "Ever start an ad hoc report and end up with a dashboard? Turn a one-off into a shareable, always-on dashboard in a few clicks.",
    },
    {
      title: "Reusable datasets",
      description:
        "Codify go-to building data into datasets that become code-free starting places for self-serve reporting.",
    },
  ],
}

// ─────────────────────────────────────────────────────────
// MarketingVisual: hero visual + sub-feature row
// Mode self-serve "Visual thinkers welcome"
// ─────────────────────────────────────────────────────────

export interface MarketingVisualFeature {
  title: string
  description: string
}

export interface MarketingVisualProps extends HTMLAttributes<HTMLElement> {
  eyebrow?: string
  heading: string
  intro?: string
  visual?: ReactNode
  features: MarketingVisualFeature[]
}

/**
 * Large visual with a row of sub-features beneath, for data exploration sections.
 */
export function MarketingVisual({
  eyebrow,
  heading,
  intro,
  visual,
  features,
  className,
  ...props
}: MarketingVisualProps) {
  return (
    <section className={cn("w-full", className)} {...props}>
      {/* Section header */}
      <div className="mb-8 max-w-prose md:mb-10">
        {eyebrow && <MarketingEyebrow>{eyebrow}</MarketingEyebrow>}

        <MarketingHeading size="lg" className="mb-4">
          {heading}
        </MarketingHeading>

        {intro && (
          <p className="text-sm leading-relaxed text-ink-muted md:text-base">
            {intro}
          </p>
        )}
      </div>

      {/* Primary visual */}
      <div className="mb-8 overflow-hidden rounded-xl bg-off-white p-4 md:mb-10 md:p-6">
        {visual ?? <MarketingVisualChart />}
      </div>

      {/* Sub-features */}
      <div className="grid gap-6 md:grid-cols-3 md:gap-8">
        {features.map((feature) => (
          <div key={feature.title}>
            <h3 className="mb-2 font-display text-lg text-ink">
              {feature.title}
            </h3>
            <p className="text-sm leading-relaxed text-ink-muted">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

/** Default chart exploration visual for demos. */
export function MarketingVisualChart({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <InfographicChartPair contained />
    </div>
  )
}

/** Sample visual section adapted from Mode&apos;s Visual Explorer page. */
export const MARKETING_VISUAL_DEFAULT: Omit<MarketingVisualProps, "className"> = {
  eyebrow: "Visual explorer",
  heading: "Visual thinkers welcome",
  intro:
    "Drag-and-drop your way through governed building datasets, iterating through as many visualisations as you need to understand levy trends and find that aha moment.",
  features: [
    {
      title: "Simple charts",
      description:
        "Spin up bar and line graphs, levy breakdowns, and maintenance summaries in seconds.",
    },
    {
      title: "Multi-faceted, multi-dimensional",
      description:
        "Building complex charts is possible with drag-and-drop analysis that is anything but basic.",
    },
    {
      title: "Endless iteration",
      description:
        "Visualise your data, then quickly iterate through as many versions of the chart you need to get your point across.",
    },
  ],
}

// ─────────────────────────────────────────────────────────
// MarketingCycle: large editorial statement
// Mode platform "The cycle of ad hoc analysis…"
// ─────────────────────────────────────────────────────────

export interface MarketingCycleProps extends HTMLAttributes<HTMLElement> {
  /** Primary statement lines: each renders as its own display line. */
  lines: string[]
  /** Supporting paragraph beneath the statement. */
  supporting?: string
  /** Background tone for the band. */
  tone?: "off-white" | "accent" | "forest"
}

const cycleToneClass = {
  "off-white": "bg-off-white text-ink",
  accent: "bg-lime-soft text-ink",
  forest: "bg-forest text-white",
}

/**
 * Large editorial statement band for platform overview pages.
 * Each line in `lines` stacks as a Young Serif display row.
 */
export function MarketingCycle({
  lines,
  supporting,
  tone = "off-white",
  className,
  ...props
}: MarketingCycleProps) {
  const onDark = tone === "forest"

  return (
    <section
      className={cn(
        "w-full rounded-xl px-6 py-14 md:px-10 md:py-20 lg:py-24",
        cycleToneClass[tone],
        className
      )}
      {...props}
    >
      {/* Statement lines */}
      <div className="max-w-4xl">
        {lines.map((line, index) => (
          <p
            key={`${line}-${index}`}
            className={cn(
              "font-display leading-[1.08] tracking-[-0.02em]",
              index === 0
                ? "text-[clamp(1.75rem,4vw,3rem)]"
                : "text-[clamp(1.5rem,3.2vw,2.5rem)]",
              onDark ? "text-white" : "text-ink",
              index > 0 && (onDark ? "text-white/80" : "text-ink/70")
            )}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Supporting copy */}
      {supporting && (
        <p
          className={cn(
            "mt-8 max-w-2xl text-base leading-relaxed md:mt-10 md:text-lg",
            onDark ? "text-off-white/90" : "text-ink-muted"
          )}
        >
          {supporting}
        </p>
      )}
    </section>
  )
}

/** Sample cycle statement adapted from Mode&apos;s platform page. */
export const MARKETING_CYCLE_DEFAULT: Omit<MarketingCycleProps, "className"> = {
  lines: [
    "The cycle of ad hoc reporting to self-serve owner portals and back again?",
    "It all happens in Instant Strata.",
  ],
  supporting:
    "A fully integrated suite of management tools for everyone. When strata teams and building stakeholders collaborate on one platform, better decisions arrive faster.",
  tone: "off-white",
}

// ─────────────────────────────────────────────────────────
// MarketingTour: product tour CTA with thumbnail
// Mode platform "Take the tour, on your time"
// ─────────────────────────────────────────────────────────

export interface MarketingTourProps extends HTMLAttributes<HTMLElement> {
  heading: string
  description: string
  /** Tour link destination. */
  href: string
  /** CTA button label. */
  actionLabel?: string
  /** Thumbnail or video preview slot. */
  visual?: ReactNode
}

/**
 * Product tour call-to-action: copy and button beside a playable thumbnail.
 */
export function MarketingTour({
  heading,
  description,
  href,
  actionLabel = "Take the product tour",
  visual,
  className,
  ...props
}: MarketingTourProps) {
  return (
    <section className={cn("w-full", className)} {...props}>
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">
        {/* Copy column */}
        <div className="max-w-prose">
          <MarketingHeading size="lg" className="mb-4">
            {heading}
          </MarketingHeading>

          <p className="mb-8 text-sm leading-relaxed text-ink-muted md:text-base">
            {description}
          </p>

          <a
            href={href}
            className="inline-flex items-center justify-center rounded-sm bg-forest px-7 py-4 text-sm font-medium text-white no-underline transition-colors duration-150 hover:bg-forest-mid"
          >
            {actionLabel}
          </a>
        </div>

        {/* Thumbnail column */}
        <div className="min-w-0">
          {visual ?? <MarketingTourThumbnail href={href} />}
        </div>
      </div>
    </section>
  )
}

export interface MarketingTourThumbnailProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  imageSrc?: string
  imageAlt?: string
}

/**
 * Playable tour thumbnail with forest overlay and play icon.
 */
export function MarketingTourThumbnail({
  imageSrc = assetPath("/img/building/2.webp"),
  imageAlt = "Product tour preview",
  className,
  children,
  ...props
}: MarketingTourThumbnailProps) {
  return (
    <a
      className={cn(
        "group relative block aspect-[16/10] overflow-hidden rounded-xl no-underline",
        className
      )}
      {...props}
    >
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
      />

      {/* Play overlay */}
      <span className="absolute inset-0 flex items-center justify-center bg-forest/40 transition-colors duration-150 group-hover:bg-forest/50">
        <span className="flex size-14 items-center justify-center rounded-full bg-lime text-forest shadow-lg transition-transform duration-150 group-hover:scale-105 md:size-16">
          <Play className="size-6 fill-current md:size-7" aria-hidden="true" />
        </span>
      </span>

      {children}
    </a>
  )
}

/** Sample tour CTA adapted from Mode&apos;s platform page. */
export const MARKETING_TOUR_DEFAULT: Omit<MarketingTourProps, "className"> = {
  heading: "Take the tour, on your time",
  description:
    "See what a fully integrated suite of management tools for everyone can do for your buildings during this guided tour of Instant Strata.",
  href: "#",
  actionLabel: "Take the product tour",
}

// ─────────────────────────────────────────────────────────
// MarketingGoverned: intro + two feature cards
// Mode self-serve "Curated and governed data, ready to be explored"
// ─────────────────────────────────────────────────────────

export interface MarketingGovernedFeature {
  title: string
  description: string
  href?: string
  linkLabel?: string
  visual?: ReactNode
}

export interface MarketingGovernedProps extends HTMLAttributes<HTMLElement> {
  heading: string
  intro: string
  features: MarketingGovernedFeature[]
}

/**
 * Governed data section: heading and intro above a two-column feature card row.
 */
export function MarketingGoverned({
  heading,
  intro,
  features,
  className,
  ...props
}: MarketingGovernedProps) {
  return (
    <section className={cn("w-full", className)} {...props}>
      {/* Section header */}
      <div className="mb-10 max-w-prose md:mb-12">
        <MarketingHeading size="lg" className="mb-4">
          {heading}
        </MarketingHeading>
        <p className="text-sm leading-relaxed text-ink-muted md:text-base">
          {intro}
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid gap-8 md:grid-cols-2 md:gap-10">
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            title={feature.title}
            description={feature.description}
            href={feature.href}
            linkLabel={feature.linkLabel}
            visual={feature.visual}
          />
        ))}
      </div>
    </section>
  )
}

/** Sample governed data section adapted from Mode&apos;s self-serve page. */
export const MARKETING_GOVERNED_DEFAULT: Omit<MarketingGovernedProps, "className"> = {
  heading: "Curated and governed data, ready to be explored",
  intro:
    "The best self-serve reporting comes from confident understanding of data. Starting with trusted records designed by your strata team, owners can explore and build their own analysis, no spreadsheets required.",
  features: [
    {
      title: "Building datasets",
      description:
        "Built by managers in tight partnership with committees, datasets are go-to starting points with all the dimensions and measures needed to answer countless owner questions.",
      href: "#",
      linkLabel: "Learn more",
    },
    {
      title: "Governed levy metrics",
      description:
        "Define your most critical financial metrics once, then serve them up for exploration so every committee sees the same numbers across the board.",
      href: "#",
      linkLabel: "Learn more",
    },
  ],
}
