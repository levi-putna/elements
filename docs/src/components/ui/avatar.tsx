"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────────────────
// Avatar
//
// A rounded-square identity mark showing a photo when available,
// falling back to initials derived from `name`. Two brand variants:
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

function initialsFromName(name?: string) {
  if (!name) return ""
  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
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
}

export function Avatar({
  src,
  name,
  fallback,
  variant = "default",
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const [failed, setFailed] = React.useState(false)
  const showImage = src && !failed

  return (
    <span
      data-slot="avatar"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md font-semibold select-none",
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
