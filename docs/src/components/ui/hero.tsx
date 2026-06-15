import { cn } from "@/lib/utils"
import type { HTMLAttributes, ReactNode } from "react"

// ─────────────────────────────────────────────────────────
// Hero: Instant Strata marquee hero
//
//   · forest-green canvas (#043F2E)
//   · Young Serif headline split across stepped lime (#C8F169) blocks
//     that read as one descending "ribbon": easy to edit via `lines`
//   · selective flat corners + concave "notch" cut-outs at each junction
//     so the blocks fuse into a single shape
//
// Desktop layout (12-column grid, thirds-based):
//   · lines[0]: 100% (cols 1–12, row 1)   full top width
//   · lines[1]:  2/3 (cols 5–12, row 2)   right 2/3, sits over the photo
//   · lines[2]:  1/3 (cols 9–12, row 3)   right 1/3, clear of the photo
//
//   col start:  1  5  9   (each step = 4 cols = 1 third)
//   col span:  12  8  4   (13 − start)
//
//   photo: absolute lower-left, w-2/3 so its right edge = col-9 boundary,
//          aligning cleanly with where line 2 and the copy begin.
//
// The concave notch (HeroNotch) mirrors the inverted-radius technique:
// a small lime square pushed just outside a block edge, masked by a
// larger forest-coloured pseudo-element with a single rounded corner.
// ─────────────────────────────────────────────────────────

export interface HeroProps extends HTMLAttributes<HTMLElement> {
  /**
   * Headline lines: three separate strings, one per thirds-based zone:
   *   · lines[0] → 100% width (full top)
   *   · lines[1] → 2/3 width (right 2/3, sits over the photo)
   *   · lines[2] → 1/3 width (right 1/3, clear of the photo)
   * Keep each line short enough to fit its zone.
   */
  lines: string[]
  /** Supporting paragraph shown beneath the headline, bottom-right. */
  subtext?: string
  /** Primary + secondary calls-to-action. */
  actions?: ReactNode
  /**
   * Photo block tucked into the lower-left. The headline's last line
   * overflows over it. Use {@link HeroVisual} for the notch masking.
   */
  visual?: ReactNode
}

/**
 * Marquee hero with a stepped Young Serif headline ribbon in clean thirds,
 * concave corner masking, and a 2/3-wide notched photo in the lower-left.
 *
 * lines[0] → 100% width (full top)
 * lines[1] → 2/3 width (right 2/3, sits over the photo)
 * lines[2] → 1/3 width (right 1/3, clear of the photo)
 */
export function Hero({
  lines,
  subtext,
  actions,
  visual,
  className,
  ...props
}: HeroProps) {
  // Column-start per line index, thirds-based:
  //   index 0 → col 1  (span 12 = 100%)
  //   index 1 → col 5  (span  8 =  2/3)
  //   index 2 → col 9  (span  4 =  1/3)
  // colSpan is derived as (13 − colStart) so each line fills to col 12.
  const LINE_COL_START = [1, 5, 9, 11]

  // Row for copy/CTAs is the row after the last headline line.
  const copyRowStart = lines.length + 1

  return (
    <section
      className={cn(
        "relative w-full overflow-hidden bg-forest text-white [container-type:inline-size]",
        className
      )}
      {...props}
    >
      <div className="mx-auto w-full max-w-[1200px] px-6 py-14 md:px-10 md:py-20">

        {/* ── Desktop composition ──────────────────────────
            Thirds-based 12-col grid:
              · line 0 (100%) fills the entire top
              · line 1 ( 2/3) starts at col 5 and sits over the photo
              · line 2 ( 1/3) starts at col 9: the photo's right edge
            Photo is w-2/3 so its right edge aligns exactly with col 9. */}
        <div className="relative hidden grid-cols-12 gap-0 md:grid">

          {/* Photo: lower-left, 2/3 wide so right edge aligns with col 9 */}
          {visual && (
            <div className="pointer-events-none absolute left-0 top-[28%] z-10 h-[68%] w-2/3">
              {visual}
            </div>
          )}

          {/* Headline lines: each in its own fixed grid row & column zone.
              A wrapper div owns the grid placement and the clip-path so that
              text overflow is hidden while still allowing the 24 px topLeft
              notch (which sits outside the block's left edge) to remain
              visible. inset(0 0 0 -24px) expands the clip region 24 px to
              the left without losing right-side clipping. */}
          {lines.map((line, index) => {
            const colStart = LINE_COL_START[index] ?? 10
            const colSpan = 13 - colStart  // fill from colStart to col 12
            const isFirstLine = index === 0
            return (
              <div
                key={`${line}-${index}`}
                className="relative z-20"
                style={{
                  gridColumnStart: colStart,
                  gridColumnEnd: `span ${colSpan}`,
                  gridRowStart: index + 1,
                  // Lines 1+: allow the 24 px topLeft notch to bleed left
                  // while still clipping any rightward text overflow.
                  // Line 0: no topLeft notch, clip all sides normally.
                  clipPath: isFirstLine ? "inset(0 0 0 0)" : "inset(0 0 0 -24px)",
                }}
              >
                <HeroLine index={index} total={lines.length}>
                  {line}
                </HeroLine>
              </div>
            )
          })}

          {/* Supporting copy + CTAs: right 1/3, below the ribbon */}
          {(subtext || actions) && (
            <div
              className="z-20 col-start-9 col-span-4 mt-8 flex flex-col items-start gap-7"
              style={{ gridRowStart: copyRowStart }}
            >
              {subtext && (
                <p className="text-[clamp(15px,1.45cqw,18px)] leading-[1.35] text-off-white">
                  {subtext}
                </p>
              )}
              {actions && (
                <div className="flex flex-wrap items-center gap-3">{actions}</div>
              )}
            </div>
          )}
        </div>

        {/* ── Mobile composition (stacked) ─────────────── */}
        <div className="flex flex-col gap-8 md:hidden">
          {/* Lime headline stack */}
          <h1 className="flex flex-col items-start">
            {lines.map((line, index) => (
              <span
                key={line}
                className={cn(
                  "inline-block max-w-full overflow-hidden whitespace-nowrap bg-lime px-4 py-2 font-display text-[10vw] leading-[0.9] tracking-[-0.02em] text-forest",
                  index === 0 && "rounded-2xl rounded-br-none",
                  index === 1 && "rounded-2xl rounded-tr-none rounded-tl-none rounded-br-none",
                  index >= 2 && "rounded-2xl rounded-tl-none"
                )}
              >
                {line}
              </span>
            ))}
          </h1>

          {/* Photo */}
          {visual && <div className="h-[280px] w-full">{visual}</div>}

          {/* Copy + CTAs */}
          {(subtext || actions) && (
            <div className="flex flex-col gap-6">
              {subtext && (
                <p className="text-base leading-[1.3] text-off-white">{subtext}</p>
              )}
              {actions && (
                <div className="flex flex-wrap items-center gap-3">{actions}</div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────
// HeroLine: one lime block with stepped placement + concave notches
// ─────────────────────────────────────────────────────────

interface HeroLineProps {
  index: number
  total: number
  children: ReactNode
}

/**
 * A single headline block. Grid placement and overflow clipping are
 * handled by the parent wrapper div; this component only owns the
 * visual ribbon styling and concave notches.
 */
function HeroLine({ index, total, children }: HeroLineProps) {
  const isFirst = index === 0
  const isLast = index === total - 1

  return (
    <span
      className={cn(
        "relative z-20 inline-block w-fit whitespace-nowrap bg-lime px-5 py-[22px] font-display",
        "text-[clamp(26px,6.4cqw,92px)] leading-[0.9] tracking-[-0.02em] text-forest",
        "rounded-2xl",
        // block 1 & 2: flat bottom-right where the ribbon steps down.
        !isLast && "rounded-br-none",
        // block 2 & 3: flat top-left where the ribbon steps in.
        !isFirst && "rounded-tl-none",
        // block 2 (middle only): also flat top-right.
        !isFirst && !isLast && "rounded-tr-none",
      )}
    >
      {children}

      {/* Concave notch where this block's top-left meets the block above */}
      {!isFirst && <HeroNotch position="topLeft" />}

      {/* Concave notch where a middle block's bottom-right meets the next */}
      {!isFirst && !isLast && <HeroNotch position="bottomRight" />}
    </span>
  )
}

// ─────────────────────────────────────────────────────────
// HeroNotch: concave / inverted corner (inverted-radius technique)
// ─────────────────────────────────────────────────────────

interface HeroNotchProps {
  position: "topLeft" | "bottomRight"
}

/**
 * Renders a concave corner that carves the forest background into the
 * lime block, smoothing an interior junction of the staircase.
 *
 * A small lime square is pushed just outside the block edge, then a
 * larger forest-coloured ::after with a single rounded corner masks it
 *: leaving a smooth inward curve.
 */
function HeroNotch({ position }: HeroNotchProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "absolute z-10 h-6 w-6 bg-lime",
        "after:absolute after:h-[110%] after:w-[110%] after:bg-forest after:content-['']",
        position === "topLeft" && [
          "left-0 top-0 -translate-x-full",
          "after:right-0 after:top-0 after:rounded-tr-2xl",
        ],
        position === "bottomRight" && [
          "bottom-0 right-0 translate-x-full",
          "after:bottom-0 after:left-0 after:rounded-bl-2xl",
        ]
      )}
    />
  )
}

// ─────────────────────────────────────────────────────────
// HeroVisual: photo block with optional concave corner masking
// ─────────────────────────────────────────────────────────

type VisualCorner = "topLeft" | "topRight" | "bottomLeft" | "bottomRight"

export interface HeroVisualProps extends HTMLAttributes<HTMLDivElement> {
  src: string
  alt: string
  imgClassName?: string
  /**
   * Corners to carve with a concave (inward) notch so the photo
   * interlocks with the headline ribbon. Defaults to the top-right
   * corner, where the final headline line overflows.
   */
  notches?: VisualCorner[]
}

// Forest-coloured cap classes that carve a concave corner into the photo.
const NOTCH_CAP: Record<VisualCorner, string> = {
  topLeft: "left-0 top-0 rounded-br-[28px]",
  topRight: "right-0 top-0 rounded-bl-[28px]",
  bottomLeft: "bottom-0 left-0 rounded-tr-[28px]",
  bottomRight: "bottom-0 right-0 rounded-tl-[28px]",
}

/**
 * Photo block for the hero. Fills its container, crops with
 * object-cover, and carves concave notches so it tucks cleanly
 * beneath the stepped headline ribbon.
 */
export function HeroVisual({
  src,
  alt,
  className,
  imgClassName,
  notches = ["topRight"],
  ...props
}: HeroVisualProps) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-2xl bg-forest-mid",
        className
      )}
      {...props}
    >
      <img
        src={src}
        alt={alt}
        className={cn("absolute inset-0 h-full w-full object-cover", imgClassName)}
      />

      {/* Concave corner masks: forest caps that carve the photo inward */}
      {notches.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          className={cn("absolute z-10 h-7 w-7 bg-forest", NOTCH_CAP[corner])}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// HeroAction: convenience CTA link matching brand styles
// ─────────────────────────────────────────────────────────

interface HeroActionProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string
  variant?: "primary" | "outline"
}

/** Branded call-to-action link for use inside {@link Hero}. */
export function HeroAction({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: HeroActionProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-7 py-4 text-sm font-medium transition-colors duration-150 no-underline",
        variant === "primary"
          ? "bg-off-white text-forest hover:bg-white"
          : "border border-white/40 text-white hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </a>
  )
}
