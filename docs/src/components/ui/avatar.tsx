"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────
// Avatar
//
// A rounded-square identity mark for system users (managers, staff).
// Strata roll owners use OwnerAvatar (round) from the owner component.
// Falls back to initials derived from `name`. Two brand variants:
//   • default  — off-white background, forest text (the calm default)
//   • primary  — forest background, white text (high emphasis)
// ─────────────────────────────────────────────────────────

export type AvatarVariant = "default" | "primary"
export type AvatarSize = "sm" | "md" | "lg" | "xl"

const variantStyles: Record<AvatarVariant, string> = {
  default: "bg-secondary text-forest",
  primary: "bg-forest text-white",
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: "size-6 text-[10px]",
  md: "size-8 text-xs",
  lg: "size-10 text-sm",
  xl: "size-12 text-base",
}

const shapeStyles = {
  square: "rounded-md",
  round: "rounded-full",
} as const

export type AvatarShape = keyof typeof shapeStyles

/**
 * Derive up to two initials from a person or entity name.
 * Joint names like "James & Sarah Chen" resolve to JC, not J&.
 */
export function getAvatarInitials({ name }: { name?: string }): string {
  if (!name) return ""

  const normalized = name
    .trim()
    .replace(/\s*&\s*/g, " & ")
    .replace(/\s+and\s+/gi, " & ")

  if (normalized.includes(" & ")) {
    const people = normalized
      .split(" & ")
      .map((part) => part.trim())
      .filter(Boolean)

    if (people.length >= 2) {
      const firstInitial = people[0].split(/\s+/).filter(Boolean)[0]?.[0] ?? ""
      const surname =
        people[people.length - 1].split(/\s+/).filter(Boolean).pop()?.[0] ?? ""
      return `${firstInitial}${surname}`.toUpperCase()
    }
  }

  const words = normalized
    .split(/\s+/)
    .filter((word) => word !== "&" && word.length > 0)

  return words
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function initialsFromName(name?: string) {
  return getAvatarInitials({ name })
}

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image source. Falls back to initials if absent or it fails to load. */
  src?: string
  /** Person/entity name — used for initials and the image alt text. */
  name?: string
  /** Explicit fallback content (overrides initials). */
  fallback?: React.ReactNode
  variant?: AvatarVariant
  size?: AvatarSize
  /**
   * square = rounded-md for system users (managers, staff).
   * round = circle for strata roll owners via {@link OwnerAvatar}.
   */
  shape?: AvatarShape
}

export function Avatar({
  src,
  name,
  fallback,
  variant = "default",
  size = "md",
  shape = "square",
  className,
  ...props
}: AvatarProps) {
  const [failed, setFailed] = React.useState(false)
  const showImage = src && !failed

  return (
    <span
      data-slot="avatar"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden font-semibold select-none",
        shapeStyles[shape],
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? ""}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        (fallback ?? initialsFromName(name))
      )}
    </span>
  )
}

// ─────────────────────────────────────────────────────────
// AvatarGroup
//
// Overlapping stack of avatars. Each child is ringed in the surface
// colour so the overlap reads cleanly. Place an AvatarGroupCount as
// the last child to show a "+N" overflow indicator.
// ─────────────────────────────────────────────────────────

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Ring colour between overlapping avatars (the surface behind the group). */
  ring?: "background" | "secondary" | "forest"
}

const ringStyles: Record<NonNullable<AvatarGroupProps["ring"]>, string> = {
  background: "[&>*]:ring-background",
  secondary: "[&>*]:ring-secondary",
  forest: "[&>*]:ring-forest",
}

export function AvatarGroup({
  ring = "background",
  className,
  children,
  ...props
}: AvatarGroupProps) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "flex items-center -space-x-2 [&>*]:ring-2",
        ringStyles[ring],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// AvatarGroupCount — the trailing "+N" overflow chip
// ─────────────────────────────────────────────────────────

export interface AvatarGroupCountProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  count: number
  variant?: AvatarVariant
  size?: AvatarSize
}

export function AvatarGroupCount({
  count,
  variant = "default",
  size = "md",
  className,
  ...props
}: AvatarGroupCountProps) {
  return (
    <span
      data-slot="avatar-count"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md font-semibold select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      +{count}
    </span>
  )
}
