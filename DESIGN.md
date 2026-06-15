# Instant Strata — Design System

> Independent design specification for Instant Strata. Use this file as the single source of truth for brand decisions when building UI, reviewing designs, or prompting AI tools.

---

## Brand Identity

**Name:** Instant Strata  
**Tagline:** Strata management, simplified.  
**Personality:** Professional, trustworthy, efficient. Not corporate. Not cold. Friendly expertise.  
**Voice:** Direct and clear. Confident without being aggressive. Plain language — no legal jargon in the UI.

### Logo

The mark is the letters **IS** set in a bold weight inside a square container with a small border radius (`4px` / `rounded-sm`). The letterforms fill most of the square — tight, compact, grounded.

```
┌──────┐
│  IS  │
└──────┘
```

- Always use the square container — never the letterform alone
- On dark backgrounds: white letterforms, lime green container
- On light backgrounds: dark green letterforms, lime green container
- Minimum size: 24×24px
- Clear space: equal to the container width on all sides
- Never stretch, rotate, recolour, or add drop shadows

---

## Colour System

The palette is built around two greens — a deep forest for authority and depth, and a bright lime for energy and action — with white as the primary canvas.

### Core Palette

| Token | Hex | Usage |
|---|---|---|
| `--color-forest` | `#0B2B1A` | Deep section backgrounds, navbar, footers |
| `--color-forest-mid` | `#164E2E` | Secondary dark backgrounds, card backgrounds on dark |
| `--color-lime` | `#A3E635` | Primary accent, CTAs, highlights, hover states |
| `--color-lime-soft` | `#D9F99D` | Light section backgrounds, card fill on dark sections |
| `--color-white` | `#FFFFFF` | Primary light background, text on dark |
| `--color-cream` | `#F0F9E6` | Warm section backgrounds, feature card fill |
| `--color-ink` | `#0B2B1A` | Body text on light backgrounds (same as forest) |
| `--color-ink-muted` | `#3D6B4F` | Secondary text, labels, captions |

### Semantic Colour Mapping

```css
/* Backgrounds */
--background:          var(--color-white);
--background-section:  var(--color-cream);
--background-dark:     var(--color-forest);
--background-accent:   var(--color-lime-soft);

/* Text */
--foreground:          var(--color-ink);
--foreground-muted:    var(--color-ink-muted);
--foreground-inverse:  var(--color-white);

/* Interactive */
--primary:             var(--color-lime);
--primary-foreground:  var(--color-ink);
--primary-hover:       #8BC926;

/* Border */
--border:              #D1E8C2;
--border-dark:         #1E6B3A;
```

### Section Colour Patterns

Sections alternate to create visual rhythm and separate concepts:

| Section Type | Background | Text | Use for |
|---|---|---|---|
| **Light** | `--color-white` | `--color-ink` | Default content, forms, docs |
| **Warm** | `--color-cream` | `--color-ink` | Features, benefits, secondary content |
| **Accent** | `--color-lime-soft` | `--color-ink` | CTAs, highlights, callout sections |
| **Dark** | `--color-forest` | `--color-white` | Hero, headers, testimonials, footers |
| **Dark-mid** | `--color-forest-mid` | `--color-white` | Nested cards on dark sections |

Never place two dark sections or two light sections back-to-back without an accent or warm section between them.

---

## Typography

### Type Scale

The system uses a humanist serif for display headings to convey expertise and trust, paired with a clean geometric sans-serif for everything else.

| Role | Font | Weight | Size (desktop) | Size (mobile) |
|---|---|---|---|---|
| **Display** | Lora | 700 | 56–72px | 36–48px |
| **Heading 1** | Lora | 700 | 48px | 32px |
| **Heading 2** | Lora | 600 | 36px | 28px |
| **Heading 3** | Inter | 600 | 24px | 20px |
| **Eyebrow** | Inter | 600 | 11px, ALL CAPS, tracking: 0.1em | — |
| **Body** | Inter | 400 | 16px, line-height: 1.6 | — |
| **Body Large** | Inter | 400 | 18px, line-height: 1.7 | — |
| **Caption / Label** | Inter | 500 | 12px | — |
| **Mono / Code** | JetBrains Mono | 400 | 14px | — |

### Font Loading (Next.js)

```tsx
import { Lora, Inter, JetBrains_Mono } from "next/font/google";

const lora = Lora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});
```

### Typographic Rules

- Display headlines can run across 2 lines — this is intentional, creates visual weight
- Eyebrow labels always precede section headings. Format: `CATEGORY NAME` in lime green or muted colour
- Never use more than 65 characters per line for body text
- Serif headlines on dark backgrounds: use white
- Serif headlines on light/cream backgrounds: use `--color-ink` (dark forest)
- Avoid centre-aligning body paragraphs

---

## Spacing & Layout

### Base Scale (4px)

```
--space-1:   4px
--space-2:   8px
--space-3:  12px
--space-4:  16px
--space-5:  20px
--space-6:  24px
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
--space-32: 128px
```

### Page Layout

- Max content width: `1200px`
- Horizontal page padding: `24px` (mobile), `48px` (tablet), `96px` (desktop)
- Section vertical padding: `80px` (desktop), `48px` (mobile)

### Grid

- Default: 12-column grid, `24px` gutters
- Bento grid sections: free-form grid using `grid-template-areas` — cards span different column counts to create visual interest
- Card minimum width: `280px`

---

## Border Radius

The brand uses **rectangular forms with a small radius**. This reflects precision and professionalism — distinct from the fully-rounded "bubbly" trend.

```css
--radius-xs:  2px   /* Almost square — inputs, tags */
--radius-sm:  4px   /* Default — buttons, cards, badges, logo mark */
--radius-md:  8px   /* Larger cards, modals, panels */
--radius-lg: 12px   /* Section containers, bento grid outer wrapper */
```

**Rule:** Never use `rounded-full` (pill) on primary UI elements. Use it only for avatar images and status indicators. All buttons, cards, inputs, and the logo use `rounded-sm` (4px).

---

## Components

### Button

Primary buttons use the lime green fill with dark ink text. Square-ish corners.

```tsx
// Primary
<Button variant="default">Try for free</Button>         // lime fill, ink text

// Secondary (outline)
<Button variant="outline">Request demo</Button>          // transparent, border, ink text

// Ghost (dark context)
<Button variant="ghost">Learn more →</Button>           // transparent, white text on dark
```

**Button rules:**
- Primary: `bg-lime` with `text-ink` — never white text on lime (insufficient contrast)
- On dark section backgrounds: outline buttons use white border + white text
- The arrow `→` is often appended to text links and ghost buttons, no icon component needed
- No pill buttons — use `rounded-sm`
- Loading state shows spinner inline before label text

### Card

Cards are the primary content container. They appear in three contexts:

**Light card** (on white or cream background):
- Background: `--color-cream` or `--color-white`
- Border: `1px solid var(--border)`
- Radius: `rounded-md` (8px)
- Padding: `24px`

**Accent card** (on dark background):
- Background: `--color-lime-soft`
- No border
- Radius: `rounded-md`
- Text: `--color-ink`
- Often contains an icon + label at bottom-left

**Dark card** (nested inside dark section):
- Background: `--color-forest-mid`
- Radius: `rounded-md`
- Text: white

### Bento Grid

A signature layout pattern. Cards of varying sizes arranged in a grid that is intentionally asymmetric. The outer wrapper has `rounded-lg` (12px). Individual cells have `rounded-md` (8px).

```
┌─────────────────────────────────────────┐  ← outer: rounded-lg, bg-forest-mid
│  ┌──────────┐  ┌─────────────────────┐  │
│  │  Small   │  │                     │  │
│  │  card    │  │    Wide card        │  │
│  └──────────┘  │                     │  │
│  ┌──────────┐  └─────────────────────┘  │
│  │          │  ┌──────────┐ ┌────────┐  │
│  │  Tall    │  │  Small   │ │ Small  │  │
│  │  card    │  │  card    │ │ card   │  │
│  │          │  └──────────┘ └────────┘  │
│  └──────────┘                           │
└─────────────────────────────────────────┘
```

Each card in a bento grid includes:
- An icon (24px, `--color-lime` on dark cards, `--color-ink` on light cards)
- A short label beneath the icon

### Eyebrow + Heading Pattern

Used to open every major section:

```tsx
<section>
  <p className="text-lime text-xs font-semibold uppercase tracking-widest mb-2">
    Section category
  </p>
  <h2 className="font-display text-4xl font-bold text-white">
    The headline that matters
  </h2>
</section>
```

### Testimonial Block

Oversized decorative quotation mark (the `"` character) rendered in `--color-lime` at 120px+, positioned behind the quote card as a graphic element.

```tsx
<div className="relative">
  {/* Decorative mark */}
  <span className="absolute -bottom-4 left-0 text-[120px] font-bold leading-none text-lime select-none">
    "
  </span>
  {/* Quote card */}
  <div className="rounded-md bg-lime-soft p-8 relative z-10">
    <p className="text-ink text-xl leading-relaxed">{quote}</p>
    <div className="mt-6 flex items-center justify-between">
      <div>
        <p className="font-semibold text-ink">{name}</p>
        <p className="text-sm text-ink-muted">{role}</p>
      </div>
      <Logo />
    </div>
  </div>
</div>
```

### Logo Strip (Social Proof)

Horizontal strip of logos, muted to white or `--color-lime-soft` opacity. No borders, no cards.

### Section Divider

No horizontal rules. Section breaks are created purely through **alternating background colours**. The contrast between section colours is the divider.

---

## Iconography

- Style: **Lucide React** — stroke-based, 1.5px stroke weight, no fill
- Size: `16px` inline, `20px` feature icons, `24px` bento grid icons
- Colour: Inherits from context. On lime backgrounds: `--color-ink`. On dark: white or lime.
- Never mix icon styles (no filled icons alongside stroke icons)

---

## Imagery & Illustration

- Photography: Real people working, warm natural light, collaborative settings
- Photos are cropped and used as floating elements, not full-bleed backgrounds
- Never use stock-looking posed photography
- Photo containers: `rounded-md` with slight overlap onto adjacent card/section

---

## Motion

Minimal. This is a professional tool, not a consumer app.

- Hover transitions: `150ms ease`
- Section entry: fade up `200ms`, `translateY(8px)` start
- No parallax
- No auto-playing animations
- Loading spinner: single ring, `800ms` linear spin

---

## Dark Section Rules

When a section has `background: --color-forest`:

1. All headings: `color: white`
2. Body text: `color: rgba(255,255,255,0.80)`
3. Primary button: `bg-lime text-ink` (unchanged)
4. Outline button: `border-white text-white hover:bg-white/10`
5. Borders: `border-white/15`
6. Cards within dark sections use `--color-forest-mid` background
7. The accent card in a dark section uses `--color-lime-soft` background with `--color-ink` text

---

## Page Structure Patterns

### Landing Page Section Order

```
1. Hero            → dark (forest)     — headline, subtext, 2 CTAs
2. Social Proof    → dark (forest)     — logo strip
3. Feature Bento   → dark (forest)     — bento grid with lime-soft cards
4. CTA Band        → lime-soft         — short punchy CTA, 2 buttons
5. Feature Detail  → white             — alternating text+visual rows
6. Feature Detail  → cream             — continues alternating
7. Testimonial     → mid-forest        — quote + person + logo
8. Pricing         → white or cream    — pricing cards
9. FAQ             → cream             — accordion
10. Final CTA      → lime-soft         — large heading + 2 buttons
11. Footer         → forest (darkest)  — links, logo, legal
```

### Docs / Internal App Pages

- Light mode default (white background)
- Left sidebar navigation
- Content max-width: `740px`
- Headings: Inter (not Lora) for readability at small sizes
- Code blocks: dark (`--color-forest`) with lime syntax highlighting

---

## Tailwind Config Reference

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#0B2B1A",
          mid:     "#164E2E",
        },
        lime: {
          DEFAULT: "#A3E635",
          soft:    "#D9F99D",
        },
        cream:  "#F0F9E6",
        ink: {
          DEFAULT: "#0B2B1A",
          muted:   "#3D6B4F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xs:  "2px",
        sm:  "4px",
        md:  "8px",
        lg:  "12px",
      },
    },
  },
} satisfies Config;
```

---

## AI Prompt Reference

When using AI tools to build UI for Instant Strata, include this brief:

> **Brand:** Instant Strata — strata property management platform.  
> **Palette:** Deep forest green (`#0B2B1A`), bright lime green (`#A3E635`), lime-soft (`#D9F99D`), cream (`#F0F9E6`), white.  
> **Typography:** Lora serif for headlines, Inter for UI and body text.  
> **Style:** Rectangular forms (4px border radius on all interactive elements). Professional, clean, not corporate. Alternating light/dark sections. Bento grid layouts for feature showcases.  
> **Buttons:** Lime fill + dark text for primary. White border + white text for outline on dark backgrounds. No pill shapes.  
> **Logo:** IS letterforms inside a small-radius square. Lime background.

---

## Changelog

| Date | Change |
|---|---|
| 2026-06-15 | Initial specification |
