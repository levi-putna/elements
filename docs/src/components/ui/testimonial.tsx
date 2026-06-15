import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export type TestimonialType =
  | "alternative" // lime-soft card on white/light section  (default)
  | "primary"     // forest card on light section
  | "dark"        // dark section — lime-soft card on forest background

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
   * Portrait image URL. Renders as a square card floating to the top-right,
   * independent of the main quote card.
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
  alternative: "bg-[#EBF8C2]",
  primary:     "bg-[#043F2E]",
  dark:        "bg-[#EBF8C2]",
}

const quoteColor: Record<TestimonialType, string> = {
  alternative: "text-[#043F2E]",
  primary:     "text-white",
  dark:        "text-[#043F2E]",
}

const attributionBorder: Record<TestimonialType, string> = {
  alternative: "border-[#043F2E]/10",
  primary:     "border-white/10",
  dark:        "border-[#043F2E]/10",
}

const nameColor: Record<TestimonialType, string> = {
  alternative: "text-[#043F2E]",
  primary:     "text-white",
  dark:        "text-[#043F2E]",
}

const metaColor: Record<TestimonialType, string> = {
  alternative: "text-[#043F2E]/60",
  primary:     "text-white/60",
  dark:        "text-[#043F2E]/60",
}

const markColor: Record<TestimonialType, string> = {
  alternative: "text-[#C8F169]",
  primary:     "text-[#C8F169]",
  dark:        "text-[#C8F169]",
}

const ctaBg: Record<TestimonialType, string> = {
  alternative: "bg-[#043F2E] text-white hover:bg-[#0A5C3D]",
  primary:     "bg-[#C8F169] text-[#043F2E] hover:bg-[#B5E050]",
  dark:        "bg-[#043F2E] text-white hover:bg-[#0A5C3D]",
}

// ─────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────

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
    <div
      className={cn(
        "relative",
        // Extra bottom padding so the quote marks (which bleed below the card) have room
        "pb-14",
        className
      )}
      {...props}
    >
      <div className="flex items-start gap-5">

        {/* ── Quote card ─────────────────────────────── */}
        <div className={cn("relative flex-1 min-w-0 rounded-xl", cardBg[type])}>

          {/* Quote text */}
          <div className="p-8 md:p-10">
            <p className={cn("font-display font-bold text-xl md:text-2xl leading-snug", quoteColor[type])}>
              {quote}
            </p>
          </div>

          {/* Attribution row */}
          <div
            className={cn(
              "flex flex-wrap items-end justify-between gap-4 px-8 md:px-10 py-6 border-t",
              attributionBorder[type]
            )}
          >
            {/* Name + role + company */}
            <div className="flex flex-col gap-0.5">
              <p className={cn("text-sm font-semibold leading-tight", nameColor[type])}>
                {name}
              </p>
              <p className={cn("text-xs", metaColor[type])}>{role}</p>
              {(company || companyLogo) && (
                <div className="mt-3 flex items-center gap-2">
                  {companyLogo && (
                    <span className={cn("flex items-center [&>*]:h-5 [&>img]:h-5 [&>svg]:h-5", metaColor[type])}>
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
            </div>

            {/* CTA */}
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

          {/* ── Quotation marks — bleed below card ──────
               Positioned absolute so they overflow the card bottom.
               The outer container's pb-14 gives them room.            */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute -bottom-10 left-6 select-none leading-none",
              "font-display font-bold text-[88px]",
              markColor[type]
            )}
          >
            ,,
          </div>
        </div>

        {/* ── Portrait ───────────────────────────────── */}
        {portrait && (
          <div className="hidden sm:block w-44 md:w-52 shrink-0">
            <div className="rounded-xl overflow-hidden aspect-[4/5] bg-[#0A5C3D]">
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
// TestimonialBlock — full-width centred variant
// Used when there is no portrait and the quote should fill width
// ─────────────────────────────────────────────────────────

interface TestimonialBlockProps extends Omit<TestimonialProps, "portrait"> {
  size?: "sm" | "md" | "lg"
}

const blockQuoteSize = {
  sm: "text-xl md:text-2xl",
  md: "text-2xl md:text-3xl",
  lg: "text-3xl md:text-4xl",
}

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
    <div className={cn("relative py-12", className)} {...props}>
      {/* Decorative mark behind card */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute bottom-0 left-0 select-none leading-none font-display",
          "text-[140px]",
          type === "primary" || type === "dark"
            ? "text-[#C8F169]/20"
            : "text-[#043F2E]/10"
        )}
      >
        ,,
      </div>

      <div className={cn("relative z-10 rounded-xl max-w-2xl", cardBg[type], "p-10 md:p-12")}>
        <p className={cn("font-display leading-snug mb-8", blockQuoteSize[size], quoteColor[type])}>
          {quote}
        </p>
        <div className={cn("flex flex-wrap items-end justify-between gap-4 pt-6 border-t", attributionBorder[type])}>
          <div>
            <p className={cn("text-sm font-semibold", nameColor[type])}>{name}</p>
            <p className={cn("text-xs mt-0.5", metaColor[type])}>{role}</p>
            {(company || companyLogo) && (
              <div className="mt-3 flex items-center gap-2">
                {companyLogo && (
                  <span className={cn("flex items-center [&>*]:h-5", metaColor[type])}>
                    {companyLogo}
                  </span>
                )}
                {company && (
                  <span className={cn("text-sm font-semibold", nameColor[type])}>{company}</span>
                )}
              </div>
            )}
          </div>
          {cta && (
            <a
              href={cta.href}
              className={cn(
                "inline-flex items-center rounded-sm px-4 py-2 text-sm font-medium transition-colors duration-150 no-underline shrink-0",
                ctaBg[type]
              )}
            >
              {cta.label}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
