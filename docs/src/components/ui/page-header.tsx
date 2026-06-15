import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

// ─────────────────────────────────────────────────────────
// PageHeaderSplit: Mode /comparisons-style header
//
//   · forest-green canvas
//   · left column: lime eyebrow, Young Serif H1, body, CTA
//   · right column: faded competitor grid with centred brand mark
//
// PageHeaderEditorial: Mode /customers-style header
//
//   · off-white canvas
//   · right column: tall photo spanning two grid rows
//   · bottom-left: Young Serif H1 + body (+ optional CTA)
//
// PageHeaderFeatured: Mode /customers featured spotlight
//
//   · white canvas
//   · left column: portrait photo with logo notch
//   · right column: eyebrow, Young Serif title, body, CTA
// ─────────────────────────────────────────────────────────

export interface PageHeaderSplitProps extends HTMLAttributes<HTMLElement> {
  /** Small caps label above the headline: lime on dark. */
  eyebrow?: string
  /** Primary page title. */
  title: string
  /** Supporting paragraph beneath the title. */
  description?: string
  /** Call-to-action buttons: use {@link PageHeaderAction}. */
  actions?: ReactNode
  /** Right-hand visual slot. Defaults to {@link PageHeaderSplitVisual}. */
  visual?: ReactNode
}

/**
 * Dark split page header inspired by Mode&apos;s comparisons page.
 * Copy and CTA on the left, a competitor grid visual on the right.
 */
export function PageHeaderSplit({
  eyebrow,
  title,
  description,
  actions,
  visual,
  className,
  ...props
}: PageHeaderSplitProps) {
  return (
    <header
      className={cn(
        "relative w-full overflow-hidden bg-forest text-white",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-14 md:px-10 md:py-20 lg:py-24">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16">

          {/* Copy column */}
          <div className="flex flex-col items-start">
            {eyebrow && (
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-lime">
                {eyebrow}
              </p>
            )}

            <h1 className="font-display text-[clamp(2rem,4.5vw,3.75rem)] leading-[1.05] tracking-[-0.02em] text-white">
              {title}
            </h1>

            {description && (
              <p className="mt-6 max-w-lg text-base leading-[1.65] text-off-white/90 md:text-lg">
                {description}
              </p>
            )}

            {actions && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}
          </div>

          {/* Visual column */}
          <div className="relative w-full">
            {visual ?? <PageHeaderSplitVisual />}
          </div>
        </div>
      </div>
    </header>
  )
}

export interface PageHeaderSplitVisualProps extends HTMLAttributes<HTMLDivElement> {
  /** Faded labels arranged around the centre brand mark. */
  items?: string[]
  /** Centre brand mark: defaults to &quot;IS&quot;. */
  brand?: string
}

/** Default competitor labels for the split header visual. */
export const PAGE_HEADER_SPLIT_DEFAULT_ITEMS = [
  "Legacy ERP",
  "Spreadsheets",
  "Email chains",
  "Paper ledgers",
  "Generic CRM",
  "Ad-hoc tools",
  "Siloed portals",
  "Manual reports",
] as const

/**
 * Faded label grid with a prominent lime brand mark in the centre -
 * the &quot;us vs alternatives&quot; visual from Mode&apos;s comparisons hero.
 */
export function PageHeaderSplitVisual({
  items = [...PAGE_HEADER_SPLIT_DEFAULT_ITEMS],
  brand = "IS",
  className,
  ...props
}: PageHeaderSplitVisualProps) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-[420px] md:max-w-none",
        className
      )}
      {...props}
    >
      {/* Faded competitor grid */}
      <div
        className="grid h-full w-full grid-cols-3 grid-rows-3 gap-2 md:gap-3"
        aria-hidden="true"
      >
        {items.slice(0, 8).map((item, index) => {
          // Skip centre cells: the brand mark occupies the middle.
          const cellIndex = index < 4 ? index : index + 1
          const row = Math.floor(cellIndex / 3) + 1
          const col = (cellIndex % 3) + 1

          return (
            <div
              key={item}
              className="flex items-center justify-center rounded-lg border border-white/8 bg-white/5 px-2 py-3 text-center"
              style={{ gridRow: row, gridColumn: col }}
            >
              <span className="text-[10px] font-medium uppercase tracking-wide text-white/25 md:text-xs">
                {item}
              </span>
            </div>
          )
        })}
      </div>

      {/* Centre brand mark */}
      <div
        className="absolute left-1/2 top-1/2 z-10 flex size-[76%] min-h-[200px] min-w-[200px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl bg-lime shadow-[0_0_0_24px_rgba(4,63,46,0.65)]"
        aria-hidden="true"
      >
        <span className="font-display text-[clamp(5rem,16cqw,9rem)] leading-none tracking-tight text-forest">
          {brand}
        </span>
      </div>
    </div>
  )
}

export interface PageHeaderEditorialProps extends HTMLAttributes<HTMLElement> {
  /** Primary page title. */
  title: string
  /** Supporting paragraph beneath the title. */
  description?: string
  /** Optional calls-to-action below the copy. */
  actions?: ReactNode
  /** Right-hand photo slot. Use {@link PageHeaderEditorialImage}. */
  visual?: ReactNode
}

/**
 * Light editorial page header inspired by Mode&apos;s customers page.
 * A tall photo anchors the right column; headline and body sit bottom-left.
 */
export function PageHeaderEditorial({
  title,
  description,
  actions,
  visual,
  className,
  ...props
}: PageHeaderEditorialProps) {
  return (
    <header
      className={cn(
        "relative w-full overflow-hidden bg-off-white text-ink",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:px-10 md:py-16 lg:py-20">

        {/* Desktop: asymmetric grid with image spanning right column */}
        <div className="hidden min-h-[480px] grid-cols-2 grid-rows-[1fr_auto] gap-x-10 gap-y-8 md:grid lg:gap-x-14">
          {/* Top-left breathing room */}
          <div className="col-start-1 row-start-1" aria-hidden="true" />

          {/* Photo: spans both rows on the right */}
          {visual && (
            <div className="col-start-2 row-span-2 row-start-1 min-h-[420px]">
              {visual}
            </div>
          )}

          {/* Copy: bottom-left */}
          <div className="col-start-1 row-start-2 flex flex-col items-start justify-end pb-2">
            <h1 className="font-display text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.08] tracking-[-0.02em] text-ink">
              {title}
            </h1>

            {description && (
              <p className="mt-5 max-w-md text-base leading-[1.65] text-ink-muted md:text-lg">
                {description}
              </p>
            )}

            {actions && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>

        {/* Mobile: photo first, copy below */}
        <div className="flex flex-col gap-8 md:hidden">
          {visual && <div className="h-[280px] w-full sm:h-[340px]">{visual}</div>}

          <div className="flex flex-col items-start">
            <h1 className="font-display text-[clamp(1.875rem,7vw,2.5rem)] leading-[1.08] tracking-[-0.02em] text-ink">
              {title}
            </h1>

            {description && (
              <p className="mt-4 text-base leading-[1.65] text-ink-muted">
                {description}
              </p>
            )}

            {actions && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export interface PageHeaderEditorialImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string
  alt: string
  imgClassName?: string
}

/**
 * Tall photo for {@link PageHeaderEditorial} with heavily rounded outer corners.
 */
export function PageHeaderEditorialImage({
  src,
  alt,
  className,
  imgClassName,
  ...props
}: PageHeaderEditorialImageProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl bg-forest-mid/10",
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
      />
    </div>
  )
}

export interface PageHeaderFeaturedProps extends HTMLAttributes<HTMLElement> {
  /** Small caps label: defaults to &quot;Featured customer&quot;. */
  eyebrow?: string
  /** Primary spotlight headline. */
  title: string
  /** Supporting paragraph beneath the title. */
  description?: string
  /** Call-to-action buttons: use {@link PageHeaderAction}. */
  actions?: ReactNode
  /** Left-hand visual slot. Use {@link PageHeaderFeaturedImage}. */
  visual?: ReactNode
}

/**
 * Featured spotlight header inspired by Mode&apos;s featured customer block.
 * Portrait photo with logo notch on the left; eyebrow, title, body and CTA on the right.
 */
export function PageHeaderFeatured({
  eyebrow = "Featured customer",
  title,
  description,
  actions,
  visual,
  className,
  ...props
}: PageHeaderFeaturedProps) {
  return (
    <header
      className={cn(
        "relative w-full overflow-hidden bg-white text-ink",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-12 md:px-10 md:py-16 lg:py-20">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-12 lg:gap-16">

          {/* Photo column */}
          {visual && (
            <div className="w-full max-w-[420px] md:max-w-none">
              {visual}
            </div>
          )}

          {/* Copy column */}
          <div className="flex flex-col items-start">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink-muted">
              {eyebrow}
            </p>

            <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.08] tracking-[-0.02em] text-ink">
              {title}
            </h2>

            {description && (
              <p className="mt-5 max-w-xl text-base leading-[1.65] text-ink-muted md:text-lg">
                {description}
              </p>
            )}

            {actions && (
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export interface PageHeaderFeaturedImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string
  alt: string
  /** Logo or mark rendered in the top-right notch. */
  logo?: ReactNode
  imgClassName?: string
}

/**
 * Portrait photo for {@link PageHeaderFeatured} with a logo badge tucked
 * into the top-right corner: matching Mode&apos;s featured customer image.
 */
export function PageHeaderFeaturedImage({
  src,
  alt,
  logo,
  className,
  imgClassName,
  ...props
}: PageHeaderFeaturedImageProps) {
  return (
    <div
      className={cn("relative aspect-[4/5] w-full max-h-[520px]", className)}
      {...props}
    >
      {/* Portrait frame */}
      <div className="relative h-full w-full overflow-hidden rounded-2xl bg-forest-mid/10">
        <img
          src={src}
          alt={alt}
          className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
        />

        {/* Concave top-right notch: forest cap carves room for the logo badge */}
        {logo && (
          <span
            aria-hidden="true"
            className="absolute right-0 top-0 z-10 h-16 w-28 rounded-bl-2xl bg-white"
          />
        )}
      </div>

      {/* Logo badge overlapping the notch */}
      {logo && (
        <div className="absolute right-4 top-4 z-20 max-w-[45%]">
          {logo}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// PageHeaderAction: branded CTA link for page headers
// ─────────────────────────────────────────────────────────

interface PageHeaderActionProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string
  /** primary = filled; outline = bordered. Tone adapts to parent header. */
  variant?: "primary" | "outline"
  /** When true, styles for use on dark (split) headers. */
  onDark?: boolean
}

/** Branded call-to-action link for page header components. */
export function PageHeaderAction({
  href,
  variant = "primary",
  onDark = false,
  className,
  children,
  ...props
}: PageHeaderActionProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-7 py-4 text-sm font-medium transition-colors duration-150 no-underline",
        onDark
          ? variant === "primary"
            ? "bg-off-white text-forest hover:bg-white"
            : "border border-white/40 text-white hover:bg-white/10"
          : variant === "primary"
            ? "bg-forest text-white hover:bg-forest-mid"
            : "border border-border bg-white text-forest hover:bg-lime-soft",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
