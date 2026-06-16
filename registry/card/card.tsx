import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import type {
  AnchorHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react"
import { Avatar } from "@/components/ui/avatar"

// ─────────────────────────────────────────────────────────
// Card: composable surface primitives
//
// Three base tones from the design system, plus Mode-inspired
// feature and blog variants for marketing pages.
//
//   bordered  · white + border + subtle shadow
//   accent    · lime-soft fill
//   dark      · forest-mid inside dark sections
// ─────────────────────────────────────────────────────────

export type CardTone = "bordered" | "accent" | "dark"

const toneClass: Record<CardTone, string> = {
  bordered:
    "bg-white border border-border text-ink shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
  accent: "bg-lime-soft text-ink",
  dark: "bg-forest-mid text-white",
}

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Surface colour scheme. */
  tone?: CardTone
}

/**
 * Base card shell. Use for simple content blocks or compose
 * with {@link CardEyebrow}, {@link CardTitle}, and {@link CardLink}.
 */
export function Card({
  tone = "bordered",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn("rounded-lg p-6", toneClass[tone], className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// CardEyebrow: category label above a title
// ─────────────────────────────────────────────────────────

export interface CardEyebrowProps extends HTMLAttributes<HTMLParagraphElement> {
  /** When true, uses lime on dark section backgrounds. */
  onDark?: boolean
}

/**
 * Uppercase category label for cards and blog posts.
 */
export function CardEyebrow({
  onDark = false,
  className,
  children,
  ...props
}: CardEyebrowProps) {
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

// ─────────────────────────────────────────────────────────
// CardTitle: Young Serif heading inside a card
// ─────────────────────────────────────────────────────────

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: "h3" | "h4" | "h5"
  size?: "md" | "lg" | "xl"
}

const titleSizeClass = {
  md: "text-lg leading-snug md:text-xl",
  lg: "text-[clamp(1.15rem,2vw,1.45rem)] leading-[1.2]",
  xl: "text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.12]",
}

/**
 * Display heading for card content.
 */
export function CardTitle({
  as: Tag = "h3",
  size = "lg",
  className,
  children,
  ...props
}: CardTitleProps) {
  return (
    <Tag
      className={cn(
        "font-display tracking-[-0.01em] text-inherit",
        titleSizeClass[size],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

// ─────────────────────────────────────────────────────────
// CardLink: trailing text link with chevron
// ─────────────────────────────────────────────────────────

export interface CardLinkProps extends HTMLAttributes<HTMLSpanElement> {
  label?: string
}

/**
 * Inline link label with chevron for card footers.
 */
export function CardLink({
  label = "Learn more",
  className,
  ...props
}: CardLinkProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium text-ink-muted transition-colors duration-150 group-hover:text-forest",
        className
      )}
      {...props}
    >
      {label}
      <ChevronRight className="size-4" aria-hidden="true" />
    </span>
  )
}

// ─────────────────────────────────────────────────────────
// CardMeta: date and read time for blog cards
// ─────────────────────────────────────────────────────────

export interface CardMetaProps extends HTMLAttributes<HTMLParagraphElement> {
  date: string
  readTime?: string
}

/**
 * Blog metadata row: date and optional read time separated by a bullet.
 */
export function CardMeta({ date, readTime, className, ...props }: CardMetaProps) {
  return (
    <p
      className={cn("text-xs text-ink-muted", className)}
      {...props}
    >
      {date}
      {readTime ? ` · ${readTime}` : null}
    </p>
  )
}

// ─────────────────────────────────────────────────────────
// FeatureCard: Mode self-serve Datasets style
//
// Tinted visual slot on top, Young Serif title, body copy,
// and an optional trailing link.
// ─────────────────────────────────────────────────────────

export interface FeatureCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string
  description: string
  /** Illustration or screenshot above the copy. */
  visual?: ReactNode
  linkLabel?: string
  href?: string
}

/**
 * Product feature tile inspired by Mode&apos;s Datasets cards.
 */
export function FeatureCard({
  title,
  description,
  visual,
  linkLabel = "Learn more",
  className,
  children,
  href,
  ...props
}: FeatureCardProps) {
  const body = (
    <>
      {/* Visual slot */}
      <div className="overflow-hidden rounded-xl bg-off-white p-5 md:p-6">
        {visual ?? <FeatureCardVisualPlaceholder />}
      </div>

      {/* Copy */}
      <div className="pt-5 md:pt-6">
        <CardTitle size="lg" className="mb-3">
          {title}
        </CardTitle>
        <p className="text-sm leading-relaxed text-ink/75 max-w-prose">
          {description}
        </p>
        {href && (
          <div className="mt-5">
            <CardLink label={linkLabel} />
          </div>
        )}
      </div>

      {children}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cn(
          "group block text-ink no-underline transition-opacity duration-150 hover:opacity-95",
          className
        )}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {body}
      </a>
    )
  }

  return (
    <div
      className={cn("block text-ink", className)}
      {...(props as HTMLAttributes<HTMLDivElement>)}
    >
      {body}
    </div>
  )
}

/** Default abstract visual for feature card demos. */
function FeatureCardVisualPlaceholder() {
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-lime-soft/60">
      {/* Mock UI panels */}
      <div className="absolute left-[8%] top-[14%] h-[58%] w-[42%] rounded-md bg-forest shadow-sm" />
      <div className="absolute right-[6%] top-[22%] h-[52%] w-[46%] rounded-md border border-border bg-white p-3">
        <div className="mb-2 h-2 w-1/2 rounded-sm bg-lime" />
        <div className="space-y-1.5">
          <div className="h-1.5 w-full rounded-sm bg-off-white" />
          <div className="h-1.5 w-4/5 rounded-sm bg-off-white" />
          <div className="h-1.5 w-3/5 rounded-sm bg-off-white" />
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// BlogCardSimple: Mode blog editor&apos;s picks style
//
// Compact white card: category, title, metadata at the bottom.
// ─────────────────────────────────────────────────────────

export interface BlogCardSimpleProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  category: string
  title: string
  date: string
  readTime?: string
}

/**
 * Compact blog tile for sidebars and editor&apos;s pick rows.
 */
export function BlogCardSimple({
  category,
  title,
  date,
  readTime,
  className,
  ...props
}: BlogCardSimpleProps) {
  return (
    <a
      className={cn(
        "group flex min-h-[200px] flex-col justify-between rounded-lg bg-white p-6 text-ink no-underline shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] md:min-h-[220px]",
        className
      )}
      {...props}
    >
      {/* Top: category + title */}
      <div>
        <CardEyebrow className="mb-4">{category}</CardEyebrow>
        <CardTitle size="md">{title}</CardTitle>
      </div>

      {/* Bottom: metadata */}
      <CardMeta date={date} readTime={readTime} className="mt-6" />
    </a>
  )
}

// ─────────────────────────────────────────────────────────
// BlogCardFeatured: Mode blog hero post style
//
// Image left, copy right on desktop. Category, title, excerpt,
// and a read-more link.
// ─────────────────────────────────────────────────────────

export interface BlogCardFeaturedProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  category: string
  title: string
  excerpt: string
  imageSrc: string
  imageAlt: string
  linkLabel?: string
}

/**
 * Featured blog post with a side-by-side image and copy column.
 */
export function BlogCardFeatured({
  category,
  title,
  excerpt,
  imageSrc,
  imageAlt,
  linkLabel = "Read more",
  className,
  ...props
}: BlogCardFeaturedProps) {
  return (
    <a
      className={cn(
        "group grid overflow-hidden rounded-xl bg-white text-ink no-underline shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]",
        className
      )}
      {...props}
    >
      {/* Image column */}
      <div className="relative min-h-[220px] md:min-h-[320px]">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* Copy column */}
      <div className="flex flex-col justify-center p-7 md:p-9 lg:p-10">
        <CardEyebrow>{category}</CardEyebrow>
        <CardTitle size="xl" className="mb-4">
          {title}
        </CardTitle>
        <p className="text-sm leading-relaxed text-ink/75 max-w-prose">
          {excerpt}
        </p>
        <div className="mt-6">
          <CardLink label={linkLabel} />
        </div>
      </div>
    </a>
  )
}

// ─────────────────────────────────────────────────────────
// BlogCard: Mode blog grid card style
//
// Image on top, category and metadata, title, excerpt, author.
// ─────────────────────────────────────────────────────────

export interface BlogCardAuthor {
  name: string
  role?: string
  avatarSrc?: string
}

export interface BlogCardProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  category: string
  title: string
  excerpt: string
  date: string
  readTime?: string
  imageSrc: string
  imageAlt: string
  author?: BlogCardAuthor
}

/**
 * Detailed blog grid card with image, excerpt, and author row.
 */
export function BlogCard({
  category,
  title,
  excerpt,
  date,
  readTime,
  imageSrc,
  imageAlt,
  author,
  className,
  ...props
}: BlogCardProps) {
  return (
    <a
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl bg-white text-ink no-underline shadow-[0_1px_3px_rgba(0,0,0,0.08)] transition-shadow duration-150 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
        className
      )}
      {...props}
    >
      {/* Hero image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <CardEyebrow className="mb-2">{category}</CardEyebrow>
        <CardMeta date={date} readTime={readTime} className="mb-4" />

        {/* Title + excerpt */}
        <CardTitle size="lg" className="mb-3">
          {title}
        </CardTitle>
        <p className="text-sm leading-relaxed text-ink/75 line-clamp-3">
          {excerpt}
        </p>

        {/* Author row */}
        {author && (
          <div className="mt-auto flex items-center gap-3 pt-6">
            <Avatar
              src={author.avatarSrc}
              name={author.name}
              size="md"
            />
            <div>
              <p className="text-sm font-medium text-ink">{author.name}</p>
              {author.role && (
                <p className="text-xs text-ink-muted">{author.role}</p>
              )}
            </div>
          </div>
        )}
      </div>
    </a>
  )
}

// ─────────────────────────────────────────────────────────
// CardGrid: layout helpers for card rows
// ─────────────────────────────────────────────────────────

export interface CardGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3
  gap?: "sm" | "md" | "lg"
}

const gridGapClass = {
  sm: "gap-4",
  md: "gap-5 md:gap-6",
  lg: "gap-6 md:gap-8",
}

/**
 * Responsive grid for feature or blog cards.
 */
export function CardGrid({
  columns = 3,
  gap = "md",
  className,
  children,
  ...props
}: CardGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1",
        columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3",
        gridGapClass[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/** Sample feature cards for documentation. */
export const FEATURE_CARD_DEFAULT = [
  {
    href: "#datasets",
    title: "Datasets",
    description:
      "Built by analysts in tight partnership with domain experts, datasets are go-to starting points with all the dimensions and measures needed to answer everyday strata questions.",
  },
  {
    href: "#metrics",
    title: "Levy metrics",
    description:
      "Governed at the source, curated KPIs for levy collection, arrears, and budget variance keep every stakeholder aligned on the same numbers.",
  },
] as const

/** Sample blog content for documentation. */
export const BLOG_CARD_FEATURED_DEFAULT = {
  href: "#",
  category: "Product updates",
  title: "Beyond spreadsheets: introducing levy forecasting for strata managers",
  excerpt:
    "Levy forecasting helps you map out a budget structure before diving into the details. See how it assists managers make faster decisions with clearer cashflow visibility.",
  imageSrc: "/img/building/2.webp",
  imageAlt: "Strata manager reviewing levy forecast dashboard",
} as const

export const BLOG_CARD_SIMPLE_DEFAULT = [
  {
    href: "#",
    category: "Product updates",
    title: "How Harbourview went paperless in 36 hours, and 7 tips we learned along the way",
    date: "15 June 2026",
    readTime: "5 min read",
  },
  {
    href: "#",
    category: "Product updates",
    title: "How to set up data for launch: a playbook for new schemes",
    date: "15 June 2026",
    readTime: "7 min read",
  },
  {
    href: "#",
    category: "Product updates",
    title: "We are sharing our owner portal guidelines and how they help remote committees",
    date: "15 June 2026",
    readTime: "17 min read",
  },
] as const

export const BLOG_CARD_GRID_DEFAULT = [
  {
    href: "#",
    category: "Product updates",
    title: "Beyond spreadsheets: introducing levy forecasting for strata managers",
    excerpt:
      "Levy forecasting helps you map out a budget structure before diving into the details.",
    date: "31 January 2024",
    readTime: "8 min read",
    imageSrc: "/img/building/1.webp",
    imageAlt: "Levy forecasting dashboard on laptop",
    author: {
      name: "Samantha Novak",
      role: "Product Design Lead",
      avatarSrc: "/img/people/1.webp",
    },
  },
  {
    href: "#",
    category: "Product updates",
    title: "New colour controls to elevate your owner communications",
    excerpt:
      "Instant Strata took a leap forward with brand controls, providing managers with a powerful toolkit for consistent building communications.",
    date: "8 January 2024",
    readTime: "4 min read",
    imageSrc: "/img/building/4.webp",
    imageAlt: "Owner communication template preview",
    author: {
      name: "Christine Sotelo",
      role: "Director of Product Marketing",
      avatarSrc: "/img/people/2.webp",
    },
  },
  {
    href: "#",
    category: "Company",
    title: "A note from the Instant Strata founders",
    excerpt:
      "A note from our founders on how Instant Strata's journey is shaping the next generation of strata management software.",
    date: "26 June 2023",
    readTime: "6 min read",
    imageSrc: "/img/building/5.webp",
    imageAlt: "Instant Strata team meeting",
    author: {
      name: "Benn Stancil",
      role: "CTO and Co-founder",
      avatarSrc: "/img/people/3.webp",
    },
  },
] as const
