import { cn } from "@/lib/utils"
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode, SVGProps } from "react"
import { Logo } from "@/components/ui/logo"

// ─────────────────────────────────────────────────────────
// Footer: site-wide forest footer
//
// Inspired by Mode.com's footer, adapted to Instant Strata brand
// tokens. A dark forest band with a brand column (logo, tagline,
// social links) beside a grid of link columns, closed by a bottom
// bar with copyright and legal links.
//
// Pass structured props for the common case, or compose the
// exported parts (FooterColumn, FooterSocialLink, FooterBottomBar)
// directly for bespoke layouts.
// ─────────────────────────────────────────────────────────

export interface FooterLink {
  label: string
  href: string
}

export interface FooterColumnData {
  heading: string
  links: FooterLink[]
}

export interface FooterSocial {
  /** Accessible label, e.g. "LinkedIn". */
  label: string
  href: string
  icon: ReactNode
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  /** Short tagline beneath the logo in the brand column. */
  description?: string
  /** Link columns rendered in the grid beside the brand column. */
  columns: FooterColumnData[]
  /** Social links rendered as icon buttons under the tagline. */
  social?: FooterSocial[]
  /** Legal links in the bottom bar (Terms, Privacy, …). */
  legal?: FooterLink[]
  /** Copyright line in the bottom bar. */
  copyright?: string
}

/**
 * Full-bleed forest footer with a brand column, link columns, and a
 * bottom bar. Width is constrained to the standard marketing grid.
 */
export function Footer({
  description,
  columns,
  social,
  legal,
  copyright,
  className,
  ...props
}: FooterProps) {
  return (
    <footer
      className={cn("w-full bg-forest text-white", className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 md:px-8 md:py-20">
        {/* Brand column + link columns */}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_2fr] lg:gap-16">
          {/* Brand column */}
          <div className="max-w-xs">
            <Logo surface="dark" size="md" />

            {description && (
              <p className="mt-5 text-sm leading-relaxed text-white/60">
                {description}
              </p>
            )}

            {social && social.length > 0 && (
              <div className="mt-6 flex items-center gap-2.5">
                {social.map((item) => (
                  <FooterSocialLink
                    key={item.label}
                    href={item.href}
                    label={item.label}
                  >
                    {item.icon}
                  </FooterSocialLink>
                ))}
              </div>
            )}
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
            {columns.map((column) => (
              <FooterColumn
                key={column.heading}
                heading={column.heading}
                links={column.links}
              />
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <FooterBottomBar legal={legal} copyright={copyright} />
      </div>
    </footer>
  )
}

export interface FooterColumnProps extends HTMLAttributes<HTMLDivElement> {
  heading: string
  links: FooterLink[]
}

/**
 * A single titled column of footer links.
 */
export function FooterColumn({
  heading,
  links,
  className,
  ...props
}: FooterColumnProps) {
  return (
    <div className={cn("min-w-0", className)} {...props}>
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-lime">
        {heading}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="text-sm text-white/70 no-underline transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export interface FooterSocialLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Accessible label for screen readers. */
  label: string
}

/**
 * Circular icon link for a social profile.
 */
export function FooterSocialLink({
  label,
  className,
  children,
  ...props
}: FooterSocialLinkProps) {
  return (
    <a
      aria-label={label}
      className={cn(
        "flex size-9 items-center justify-center rounded-full text-white/70 no-underline transition-colors duration-150 hover:bg-white/10 hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}

export interface FooterBottomBarProps extends HTMLAttributes<HTMLDivElement> {
  legal?: FooterLink[]
  copyright?: string
}

/**
 * Closing bar: copyright on the left, legal links on the right,
 * separated from the columns by a hairline rule.
 */
export function FooterBottomBar({
  legal,
  copyright,
  className,
  ...props
}: FooterBottomBarProps) {
  if (!legal?.length && !copyright) return null

  return (
    <div
      className={cn(
        "mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 md:mt-16 md:flex-row md:items-center md:justify-between",
        className
      )}
      {...props}
    >
      {copyright && (
        <p className="text-sm text-white/50">{copyright}</p>
      )}

      {legal && legal.length > 0 && (
        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {legal.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-white/60 no-underline transition-colors duration-150 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Brand glyphs
//
// lucide-react no longer ships brand marks, so the common social
// icons are inlined here for use in the social slot.
// ─────────────────────────────────────────────────────────

/** LinkedIn glyph. */
export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
      {...props}
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  )
}

/** X (formerly Twitter) glyph. */
export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="size-4"
      {...props}
    >
      <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.46l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41Z" />
    </svg>
  )
}

/** Sample footer content adapted from Mode.com for Instant Strata. */
export const FOOTER_DEFAULT: Omit<FooterProps, "className"> = {
  description:
    "Strata management, simplified. One platform for managers, committees, and owners.",
  social: [
    { label: "LinkedIn", href: "#", icon: <LinkedInIcon /> },
    { label: "X", href: "#", icon: <XIcon /> },
  ],
  columns: [
    {
      heading: "Platform",
      links: [
        { label: "Explore platform", href: "#" },
        { label: "Owner portal", href: "#" },
        { label: "Committee tools", href: "#" },
        { label: "Levy & billing", href: "#" },
        { label: "Maintenance", href: "#" },
        { label: "Reporting", href: "#" },
      ],
    },
    {
      heading: "Resources",
      links: [
        { label: "Resource centre", href: "#" },
        { label: "How we compare", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Help & support", href: "#" },
        { label: "Strata academy", href: "#" },
        { label: "Release notes", href: "#" },
      ],
    },
    {
      heading: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Customers", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact us", href: "#" },
        { label: "System status", href: "#" },
      ],
    },
    {
      heading: "Legal",
      links: [
        { label: "Terms of service", href: "#" },
        { label: "Privacy statement", href: "#" },
        { label: "Security", href: "#" },
        { label: "Cookie settings", href: "#" },
      ],
    },
  ],
  legal: [
    { label: "Terms of service", href: "#" },
    { label: "Privacy statement", href: "#" },
  ],
  copyright: "© Instant Strata Pty Ltd 2026",
}
