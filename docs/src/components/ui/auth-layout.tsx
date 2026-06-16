import Link from "next/link"
import type { HTMLAttributes, ReactNode } from "react"

import { assetPath, cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo"

export interface AuthBrandPanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Cover image shown on the right column. */
  imageSrc?: string
  /** Accessible description for the cover image. */
  imageAlt?: string
  /** Optional override for the brand copy block over the image. */
  brandContent?: ReactNode
}

const DEFAULT_IMAGE = assetPath("/img/building/1.webp")

const DEFAULT_BRAND_CONTENT = (
  <>
    <p className="text-[10px] font-semibold uppercase tracking-widest text-lime mb-4">
      Instant Strata
    </p>
    <h2 className="font-display text-3xl text-white leading-tight mb-4">
      Strata management, simplified
    </h2>
    <p className="text-sm text-white/80 leading-relaxed mb-8 max-w-sm">
      One platform for managers, committees, and owners. Levies, maintenance,
      compliance, and communication in a single calm workspace.
    </p>
    <ul className="space-y-3 text-sm text-white/90 text-left max-w-sm mx-auto">
      <li className="flex items-start gap-2.5">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
        <span>Portfolio-wide visibility without spreadsheet sprawl</span>
      </li>
      <li className="flex items-start gap-2.5">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
        <span>Owner and committee portals that reduce inbox noise</span>
      </li>
      <li className="flex items-start gap-2.5">
        <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-lime" aria-hidden="true" />
        <span>Audit-ready records your strata manager can trust</span>
      </li>
    </ul>
  </>
)

/**
 * Brand panel overlaid on the auth cover image: centred copy selling Instant Strata.
 */
export function AuthBrandPanel({
  imageSrc = DEFAULT_IMAGE,
  imageAlt = "Residents on balconies of a modern apartment building",
  brandContent = DEFAULT_BRAND_CONTENT,
  className,
  ...props
}: AuthBrandPanelProps) {
  return (
    <div
      className={cn("relative hidden min-h-full bg-muted md:block", className)}
      {...props}
    >
      {/* Cover image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.65]"
      />

      {/* Forest overlay for legibility */}
      <div
        className="absolute inset-0 bg-forest/50"
        aria-hidden="true"
      />

      {/* Centred brand detail */}
      <div className="relative flex h-full min-h-[28rem] flex-col items-center justify-center px-10 py-16 text-center">
        <div className="max-w-md">{brandContent}</div>
      </div>
    </div>
  )
}

export interface AuthLayoutProps extends HTMLAttributes<HTMLDivElement> {
  /** Form column content, typically AuthForm. */
  children: ReactNode
  /** Logo link destination. */
  logoHref?: string
  /** Cover image shown on the right column. */
  imageSrc?: string
  /** Accessible description for the cover image. */
  imageAlt?: string
  /** Optional override for the brand copy block over the image. */
  brandContent?: ReactNode
}

/**
 * Two-column authentication shell inspired by shadcn signup-02: form on the left,
 * cover image with brand detail on the right.
 */
export function AuthLayout({
  children,
  logoHref = "/",
  imageSrc,
  imageAlt,
  brandContent,
  className,
  ...props
}: AuthLayoutProps) {
  return (
    <div
      className={cn("grid min-h-[36rem] md:min-h-[32rem] md:grid-cols-2", className)}
      {...props}
    >
      {/* Form column */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Logo */}
        <div className="flex justify-center gap-2 md:justify-start">
          <Link
            href={logoHref}
            className="flex items-center gap-2 font-medium no-underline"
          >
            <Logo surface="light" size="md" />
          </Link>
        </div>

        {/* Centred form slot */}
        <div className="flex flex-1 items-center justify-center py-4">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      {/* Cover image with brand panel */}
      <AuthBrandPanel
        imageSrc={imageSrc}
        imageAlt={imageAlt}
        brandContent={brandContent}
      />
    </div>
  )
}

export { DEFAULT_IMAGE as AUTH_DEFAULT_IMAGE }
