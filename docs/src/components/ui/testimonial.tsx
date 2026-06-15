import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export type TestimonialType =
  | "alternative" // bright lime card on white/light section  (default)
  | "primary"     // forest card on light section
  | "dark"        // bright lime card on forest section background

interface TestimonialProps extends HTMLAttributes<HTMLDivElement> {
  /** The quote text. */
  quote: string
  /** Person's full name. */
  name: string
  /** Job title or role. */
  role: string
  /** Company or organisation name. */
  company?: string
  /** Company logo — any ReactNode (img, svg, icon). Sized to h-5. */
  companyLogo?: ReactNode
  /**
   * Portrait image URL. Renders as a square card to the right of the quote card,
   * top-aligned with the lime panel.
   */
  portrait?: { src: string; alt?: string }
  /** Optional call-to-action rendered in the attribution row. */
  cta?: { label: string; href: string }
  /** Card colour scheme. */
  type?: TestimonialType
}

// ─────────────────────────────────────────────────────────
// Style maps
// ─────────────────────────────────────────────────────────

const cardBg: Record<TestimonialType, string> = {
  alternative: "bg-lime",
  primary:     "bg-forest",
  dark:        "bg-lime",
}

const quoteColor: Record<TestimonialType, string> = {
  alternative: "text-forest",
  primary:     "text-white",
  dark:        "text-forest",
}

const nameColor: Record<TestimonialType, string> = {
  alternative: "text-forest",
  primary:     "text-white",
  dark:        "text-forest",
}

const metaColor: Record<TestimonialType, string> = {
  alternative: "text-forest/70",
  primary:     "text-white/70",
  dark:        "text-forest/70",
}

/** Quote marks sit in the bottom-left cutout — darker green on page/section bg. */
const markColor: Record<TestimonialType, string> = {
  alternative: "text-[#78C51C]",
  primary:     "text-lime",
  dark:        "text-[#78C51C]",
}

const ctaBg: Record<TestimonialType, string> = {
  alternative: "bg-forest text-lime hover:bg-forest-mid",
  primary:     "bg-lime text-forest hover:bg-lime/90",
  dark:        "bg-forest text-lime hover:bg-forest-mid",
}

/** Solid fill for inverse-radius fillets on the stepped card. */
const cardFill: Record<TestimonialType, string> = {
  alternative: "#C8F169",
  primary:     "#043F2E",
  dark:        "#C8F169",
}

/** Oversized ,, marks — 200% larger than the previous scale. */
const markSize =
  "text-[136px] sm:text-[152px] md:text-[176px] leading-[0.78]"

/** Cutout column width sized to the enlarged quote marks. */
const cutoutCols =
  "grid-cols-[140px_1fr] sm:grid-cols-[168px_1fr] md:grid-cols-[196px_1fr]"

/**
 * Inverse-radius fillet where the card steps inward above the cutout.
 * Creates the concave inside corner on the lime (or forest) fill.
 */
function StepFillet({ fill }: { fill: string }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute top-0 right-0 size-4 rounded-bl-xl"
      style={{ boxShadow: `-16px 0 0 0 ${fill}` }}
    />
  )
}

// ─────────────────────────────────────────────────────────
// Shared card internals
// ─────────────────────────────────────────────────────────

interface TestimonialCardContentProps {
  quote: string
  name: string
  role: string
  company?: string
  companyLogo?: ReactNode
  cta?: { label: string; href: string }
  type: TestimonialType
  quoteSize?: string
}

/**
 * Stepped lime (or forest) card with a bottom-left cutout for oversized quote marks.
 * Matches the Mode.com testimonial layout: quote on top, attribution footer to the right
 * of the cutout, company logo and CTA aligned to the trailing edge.
 */
function TestimonialCardContent({
  quote,
  name,
  role,
  company,
  companyLogo,
  cta,
  type,
  quoteSize = "text-xl md:text-2xl",
}: TestimonialCardContentProps) {
  return (
    <div className="relative flex-1 min-w-0">
      {/* Quote area */}
      <div className={cn("rounded-t-xl px-8 md:px-10 pt-8 md:pt-10 pb-4 md:pb-6", cardBg[type])}>
        <p className={cn("font-display leading-snug", quoteSize, quoteColor[type])}>
          {quote}
        </p>
      </div>

      {/* Stepped footer — cutout cell + attribution cell */}
      <div className={cn("grid", cutoutCols)}>
        {/* Bottom-left cutout — quote marks sit on section/page background */}
        <div className="relative flex items-end justify-start pb-0">
          <StepFillet fill={cardFill[type]} />
          <span
            aria-hidden="true"
            className={cn("font-display select-none", markSize, markColor[type])}
          >
            ,,
          </span>
        </div>

        {/* Attribution — continues the card fill to the bottom-right */}
        <div
          className={cn(
            "flex flex-wrap items-end justify-between gap-x-6 gap-y-3",
            "px-5 sm:px-6 md:px-8 pt-2 pb-5 md:pb-6 rounded-tl-xl rounded-br-xl",
            cardBg[type]
          )}
        >
          {/* Name and role */}
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className={cn("text-sm font-semibold leading-tight", nameColor[type])}>
              {name}
            </p>
            <p className={cn("text-xs", metaColor[type])}>{role}</p>
          </div>

          {/* Company logo, name, and optional CTA */}
          <div className="flex flex-wrap items-center gap-4 shrink-0 ml-auto">
            {(company || companyLogo) && (
              <div className="flex items-center gap-2">
                {companyLogo && (
                  <span
                    className={cn(
                      "flex items-center [&>*]:h-5 [&>img]:h-5 [&>svg]:h-5",
                      metaColor[type]
                    )}
                  >
                    {companyLogo}
                  </span>
                )}
                {company && (
                  <span className={cn("text-sm font-semibold", nameColor[type])}>
                    {company}
                  </span>
                )}
              </div>
            )}
            {cta && (
              <a
                href={cta.href}
                className={cn(
                  "inline-flex items-center rounded-sm px-4 py-2 text-sm transition-colors duration-150 no-underline shrink-0",
                  ctaBg[type]
                )}
              >
                {cta.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Testimonial — card + optional portrait
// ─────────────────────────────────────────────────────────

/**
 * Mode-style testimonial: stepped lime card with bottom-left quote cutout,
 * optional square portrait top-aligned to the right.
 */
export function Testimonial({
  quote,
  name,
  role,
  company,
  companyLogo,
  portrait,
  cta,
  type = "alternative",
  className,
  ...props
}: TestimonialProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="flex items-start gap-4 md:gap-5">
        {/* Stepped quote card */}
        <TestimonialCardContent
          quote={quote}
          name={name}
          role={role}
          company={company}
          companyLogo={companyLogo}
          cta={cta}
          type={type}
        />

        {/* Square portrait — top-aligned, separate from the card */}
        {portrait && (
          <div className="hidden sm:block w-32 md:w-40 lg:w-44 shrink-0">
            <div className="rounded-xl overflow-hidden aspect-square bg-forest-mid">
              <img
                src={portrait.src}
                alt={portrait.alt ?? name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// TestimonialBlock — full-width variant without portrait
// ─────────────────────────────────────────────────────────

interface TestimonialBlockProps extends Omit<TestimonialProps, "portrait"> {
  size?: "sm" | "md" | "lg"
}

const blockQuoteSize = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
}

/**
 * Full-width testimonial card without a portrait — same stepped cutout layout,
 * designed for dark forest sections or centred feature bands.
 */
export function TestimonialBlock({
  quote,
  name,
  role,
  company,
  companyLogo,
  cta,
  type = "dark",
  size = "md",
  className,
  ...props
}: TestimonialBlockProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <TestimonialCardContent
        quote={quote}
        name={name}
        role={role}
        company={company}
        companyLogo={companyLogo}
        cta={cta}
        type={type}
        quoteSize={blockQuoteSize[size]}
      />
    </div>
  )
}
