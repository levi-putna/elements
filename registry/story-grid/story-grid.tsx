import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react"

// ─────────────────────────────────────────────────────────
// StoryGrid: Mode /customers editorial card mosaic
//
// A 3-column mosaic distinct from BentoGrid: uniform lime-soft
// cards in a simple row flow, where featured items span two columns
// and carry a portrait image beside the copy.
//
// Typical row rhythm:
//   [ featured (2) ] [ standard (1) ]
//   [ standard (1) ] [ standard (1) ] [ standard (1) ]
//   [ standard (1) ] [ featured (2) ]
// ─────────────────────────────────────────────────────────

export interface StoryGridProps extends HTMLAttributes<HTMLDivElement> {
  /** Gap between cards. */
  gap?: "sm" | "md" | "lg"
}

const gapClass = {
  sm: "gap-3 md:gap-4",
  md: "gap-4 md:gap-5",
  lg: "gap-5 md:gap-6",
}

/**
 * Three-column editorial mosaic for story indexes. Compose with
 * {@link StoryGridFeatured} and {@link StoryGridCard} children.
 */
export function StoryGrid({
  gap = "md",
  className,
  children,
  ...props
}: StoryGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3",
        gapClass[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// StoryGridCard: standard single-column story tile
// ─────────────────────────────────────────────────────────

export interface StoryGridCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Story headline: rendered in Young Serif at the top. */
  title: string
  /** Logo or company mark anchored to the bottom. */
  logo?: ReactNode
}

/**
 * Standard story tile: title top, logo bottom, single column width.
 */
export function StoryGridCard({
  title,
  logo,
  className,
  children,
  ...props
}: StoryGridCardProps) {
  return (
    <a
      className={cn(
        "group flex min-h-[220px] flex-col justify-between rounded-xl bg-lime-soft p-7 text-ink no-underline transition-colors duration-150 hover:bg-[#E2F4A8] md:min-h-[260px] md:p-8",
        className
      )}
      {...props}
    >
      {/* Headline */}
      <h3 className="font-display text-[clamp(1.25rem,2.2vw,1.65rem)] leading-[1.15] tracking-[-0.01em] text-ink">
        {title}
      </h3>

      {/* Logo mark */}
      {logo && (
        <div className="mt-8 opacity-70 transition-opacity duration-150 group-hover:opacity-100">
          {logo}
        </div>
      )}

      {children}
    </a>
  )
}

// ─────────────────────────────────────────────────────────
// StoryGridFeatured: wide two-column story tile with image
// ─────────────────────────────────────────────────────────

export interface StoryGridFeaturedProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Story headline: anchored to the bottom of the copy column. */
  title: string
  /** Logo or company mark at the top of the copy column. */
  logo?: ReactNode
  /** Portrait or scene image on the right. */
  imageSrc: string
  imageAlt: string
  /** Link label: defaults to &quot;Read more&quot;. */
  linkLabel?: string
  imgClassName?: string
}

/**
 * Featured story tile: spans two columns on desktop. Copy and logo
 * on the left, rounded image on the right, with a trailing link label.
 */
export function StoryGridFeatured({
  title,
  logo,
  imageSrc,
  imageAlt,
  linkLabel = "Read more",
  imgClassName,
  className,
  ...props
}: StoryGridFeaturedProps) {
  return (
    <a
      className={cn(
        "group grid overflow-hidden rounded-xl bg-lime-soft text-ink no-underline transition-colors duration-150 hover:bg-[#E2F4A8] md:col-span-2 md:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]",
        className
      )}
      {...props}
    >
      {/* Copy column */}
      <div className="flex min-h-[220px] flex-col justify-between p-7 md:min-h-[280px] md:p-8">
        {logo && (
          <div className="opacity-70 transition-opacity duration-150 group-hover:opacity-100">
            {logo}
          </div>
        )}

        <div className={cn(!logo && "mt-auto")}>
          <h3 className="font-display text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.12] tracking-[-0.01em] text-ink">
            {title}
          </h3>

          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors duration-150 group-hover:text-forest">
            {linkLabel}
            <ChevronRight className="size-4" aria-hidden="true" />
          </span>
        </div>
      </div>

      {/* Image column */}
      <div className="relative min-h-[200px] p-4 pt-0 md:min-h-0 md:p-5 md:pl-0">
        <div className="relative h-full min-h-[180px] overflow-hidden rounded-xl bg-forest-mid/10 md:min-h-[240px]">
          <img
            src={imageSrc}
            alt={imageAlt}
            className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
          />
        </div>
      </div>
    </a>
  )
}

// ─────────────────────────────────────────────────────────
// StoryGridLogo: convenience text mark for demo / placeholder logos
// ─────────────────────────────────────────────────────────

interface StoryGridLogoProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode
}

/** Uppercase wordmark placeholder for story grid logos. */
export function StoryGridLogo({ children, className, ...props }: StoryGridLogoProps) {
  return (
    <span
      className={cn(
        "inline-block text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/80",
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/** Sample stories mirroring the Mode customers mosaic rhythm. */
export const STORY_GRID_DEFAULT: Array<
  | ({ variant: "featured" } & Pick<StoryGridFeaturedProps, "href" | "title" | "logo" | "imageSrc" | "imageAlt">)
  | ({ variant: "card" } & Pick<StoryGridCardProps, "href" | "title" | "logo">)
> = [
  {
    variant: "featured",
    href: "#",
    title: "Harbourview Towers transforms committee reporting across 120 lots",
    logo: <StoryGridLogo>Harbourview</StoryGridLogo>,
    imageSrc: "/img/building/1.jpeg",
    imageAlt: "Harbourview Towers strata committee meeting",
  },
  {
    variant: "card",
    href: "#",
    title: "Coastal Strata builds self-serve owner portals",
    logo: <StoryGridLogo>Coastal</StoryGridLogo>,
  },
  {
    variant: "card",
    href: "#",
    title: "Parkside Group accelerates levy reconciliation 10x",
    logo: <StoryGridLogo>Parkside</StoryGridLogo>,
  },
  {
    variant: "card",
    href: "#",
    title: "Northbridge Estates streamlines AGM preparation",
    logo: <StoryGridLogo>Northbridge</StoryGridLogo>,
  },
  {
    variant: "card",
    href: "#",
    title: "Greenline managers cut maintenance response times by 40%",
    logo: <StoryGridLogo>Greenline</StoryGridLogo>,
  },
  {
    variant: "featured",
    href: "#",
    title: "Metro Strata increases owner satisfaction with daily building metrics",
    logo: <StoryGridLogo>Metro Strata</StoryGridLogo>,
    imageSrc: "/img/building/3.jpg",
    imageAlt: "Metro Strata building management dashboard review",
  },
]
