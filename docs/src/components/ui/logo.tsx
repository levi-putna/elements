import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

/** Container rotation in degrees: letterforms are counter-rotated to stay upright. */
const LOGO_ROTATION = 15

const SURFACE_STYLES = {
  light: {
    container: "bg-lime",
    mark: "text-forest",
    wordmark: "text-forest",
  },
  primary: {
    container: "bg-forest",
    mark: "text-white",
    wordmark: "text-forest",
  },
  dark: {
    container: "bg-secondary",
    mark: "text-forest",
    wordmark: "text-forest",
  },
} as const

export type LogoSurface = keyof typeof SURFACE_STYLES

const SIZE_CLASSES = {
  sm: {
    container: "size-6",
    mark: "text-[13px]",
    nudge: "translate-y-[0.05em]",
    wordmark: "text-base",
  },
  md: {
    container: "size-7",
    mark: "text-[15px]",
    nudge: "translate-y-[0.06em]",
    wordmark: "text-lg",
  },
  lg: {
    container: "size-10",
    mark: "text-[21px]",
    nudge: "translate-y-[0.07em]",
    wordmark: "text-2xl",
  },
} as const

export type LogoSize = keyof typeof SIZE_CLASSES

export interface LogoMarkProps extends HTMLAttributes<HTMLDivElement> {
  /** Background context: adjusts container and letterform colours for contrast. */
  surface?: LogoSurface
  /** Mark dimensions. */
  size?: LogoSize
  /** When true, hides the mark from assistive tech (e.g. inside a labelled link). */
  decorative?: boolean
}

/**
 * IS icon mark: lime or forest square rotated 15°, with upright Young Serif letterforms.
 */
export function LogoMark({
  surface = "light",
  size = "md",
  decorative = false,
  className,
  ...props
}: LogoMarkProps) {
  const styles = SURFACE_STYLES[surface]
  const sizes = SIZE_CLASSES[size]

  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : "Instant Strata"}
      aria-hidden={decorative ? true : undefined}
      className={cn(
        "relative shrink-0 rounded-sm select-none",
        sizes.container,
        styles.container,
        className
      )}
      style={{ transform: `rotate(${LOGO_ROTATION}deg)` }}
      {...props}
    >
      {/* Counter-rotate from the container centre so letterforms stay upright */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: `rotate(-${LOGO_ROTATION}deg)` }}
        aria-hidden="true"
      >
        {/* Cap-height optical centre: serif caps sit high in the line box */}
        <span
          className={cn(
            "block font-display leading-none tracking-tighter",
            sizes.mark,
            sizes.nudge,
            styles.mark
          )}
        >
          IS
        </span>
      </div>
    </div>
  )
}

export interface LogoProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon mark only, or lockup with the Instant Strata wordmark. */
  variant?: "mark" | "lockup"
  /** Background context: adjusts colours for contrast on light, lime, or dark surfaces. */
  surface?: LogoSurface
  /** Mark and wordmark scale. */
  size?: LogoSize
}

/**
 * Instant Strata logo: rotated IS mark, optionally paired with the wordmark.
 */
export function Logo({
  variant = "lockup",
  surface = "light",
  size = "md",
  className,
  ...props
}: LogoProps) {
  const styles = SURFACE_STYLES[surface]
  const sizes = SIZE_CLASSES[size]

  if (variant === "mark") {
    return <LogoMark surface={surface} size={size} className={className} {...props} />
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)} {...props}>
      {/* Rotated icon mark */}
      <LogoMark surface={surface} size={size} />

      {/* Wordmark */}
      <span
        className={cn(
          "font-display leading-none tracking-tight",
          sizes.wordmark,
          styles.wordmark
        )}
      >
        Instant Strata
      </span>
    </div>
  )
}
