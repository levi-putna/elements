# Instant Strata: Design System

> Single source of truth for brand, visual design, and component decisions. Use this file when building UI, reviewing designs, or prompting AI tools.

---

## Brand Identity

**Name:** Instant Strata  
**Tagline:** Strata management, simplified.  
**Personality:** Professional, trustworthy, efficient. Not corporate. Not cold. Confident without being aggressive.  
**Voice:** Plain language. No legal jargon in the UI. Direct and clear.

See the [Tone of voice](/tone-of-voice) docs for principles, contextual tone, vocabulary, and a statement library.

### Logo

The mark is the letters **IS** set in Young Serif inside a square container with `4px` border radius. The container is rotated **15°** for energy; the letterforms stay upright. Tight and compact.

```
  ┌──────┐
 ╱  IS  ╲
└──────┘
```

| Context | Letterforms | Container |
|---|---|---|
| White or light background | `--color-forest` | `--color-lime` |
| Primary (lime) background | `#FFFFFF` | `--color-forest` |
| Dark (forest) background | `--color-lime` (`--primary`) | `--color-forest` |

Lockup: icon mark beside the **Instant Strata** wordmark in Young Serif.

- Always use the square container; never use the letterforms alone
- Minimum size: 24×24px
- Clear space: equal to the container width on all sides
- Never stretch, recolour outside the surface rules, or add drop shadows

---

## Colour System

White is the dominant background colour. Forest green and lime are used to create emphasis, break apart major sections, and draw attention, not as wallpaper.

**The rule of thumb:** if in doubt, use white. Reach for a coloured section only when you need to signal a transition or create a deliberate moment of emphasis.

### Core Palette

| Token | Hex | Role |
|---|---|---|
| `--color-white` | `#FFFFFF` | Primary page background. Default for all content sections. |
| `--color-off-white` | `#EEF2E3` | Subtle warm tint. Used to softly differentiate adjacent light sections without adding visual weight. |
| `--color-lime` | `#C8F169` | Brand accent. CTAs, hover states, active indicators, logo container, eyebrow labels. |
| `--color-lime-soft` | `#EBF8C2` | Lightest green tint. Card fills on white sections, highlight bands, tag backgrounds. |
| `--color-forest` | `#043F2E` | Deep green. Used sparingly for hero, testimonial, and footer sections. Provides anchoring contrast. |
| `--color-forest-mid` | `#0A5C3D` | Mid-tone forest. Card backgrounds inside dark sections. |
| `--color-ink` | `#043F2E` | Body and heading text on light backgrounds. Same value as forest, keeps the palette unified. |
| `--color-ink-muted` | `#4A7A62` | Secondary text: labels, captions, metadata. |
| `--color-border` | `#D4E8C2` | Subtle border on cards and inputs. |
| `--color-danger` | `#C44B47` | Errors, destructive actions, required markers. Earthy terracotta red. |
| `--color-danger-soft` | `#F5E0DE` | Error banners and validation backgrounds. Pair with ink text. |
| `--color-warning` | `#A8651A` | Caution states and pending actions. Warm amber, distinct from lime. |
| `--color-warning-soft` | `#F8ECDC` | Warning bands and subtle highlights. Pair with `text-warning` on badges and compact labels. |
| `--color-info` | `#2D6A9F` | Informational states and neutral updates. Muted steel blue, distinct from brand greens. |
| `--color-info-soft` | `#E0ECF5` | Info banners, notification backgrounds, and callouts. Pair with `text-info` on badges and compact labels. |

### Semantic Mapping

```css
--background:           #FFFFFF;
--background-subtle:    #EEF2E3;
--background-accent:    #EBF8C2;
--background-dark:      #043F2E;

--foreground:           #043F2E;
--foreground-muted:     #4A7A62;
--foreground-inverse:   #FFFFFF;

--primary:              #C8F169;
--primary-foreground:   #043F2E;
--primary-hover:        #B5E050;

--danger:               #C44B47;
--danger-soft:          #F5E0DE;
--warning:              #A8651A;
--warning-soft:         #F8ECDC;
--info:                 #2D6A9F;
--info-soft:            #E0ECF5;
--destructive:          #C44B47;

--border:               #D4E8C2;
--border-dark:          rgba(255,255,255,0.12);
```

### Section Colour System

Most sections use white or off-white. Dark and accent sections are used at most 2–3 times per page to create rhythm, not as the default.

| Type | Background | Text colour | Frequency |
|---|---|---|---|
| **Default** | `#FFFFFF` white | `--color-ink` | Most sections |
| **Subtle** | `#EEF2E3` off-white | `--color-ink` | Alternating light sections |
| **Accent** | `#EBF8C2` lime-soft | `--color-ink` | CTA bands, callout sections |
| **Dark** | `#043F2E` forest | `#FFFFFF` | Hero, major testimonial, footer |

**Cadence example for a landing page:**

```
Hero          → Dark          (strong opening)
Social proof  → White         (breathing room)
Features      → Off-white     (differentiated but light)
CTA band      → Accent        (lime-soft, draws attention)
Feature rows  → White         (content, spacious)
Testimonial   → Dark          (one more dark moment)
Pricing       → Off-white     (calm, readable)
Final CTA     → Accent        (closes with energy)
Footer        → Dark          (grounds the page)
```

Avoid placing two dark sections back-to-back. Never use more than 3 dark sections on a single page.

---

## Typography

A refined serif for display headings signals expertise and trust. Inter handles everything else: UI, body, labels, cleanly and at scale.

### Typefaces

| Role | Typeface | Source |
|---|---|---|
| **Display / Headings** | Young Serif | [Google Fonts](https://fonts.google.com/specimen/Young+Serif) (free) |
| **UI / Body / Labels** | Inter | Google Fonts (free) |
| **Code** | JetBrains Mono | Google Fonts (free) |

Young Serif's elegant serifs and high contrast give headings authority and warmth. Weight 400 only; never use bold or medium with this font.

### Type Scale

| Role | Font | Weight | Desktop | Mobile |
|---|---|---|---|---|
| **Display** | Young Serif | 400 | 60–72px | 40–48px |
| **H1** | Young Serif | 400 | 48px | 32px |
| **H2** | Young Serif | 400 | 36px | 26px |
| **H3** | Inter | 600 | 22px | 18px |
| **H4** | Inter | 600 | 18px | 16px |
| **Eyebrow** | Inter | 600 | 11px · ALL CAPS · 0.1em tracking | - |
| **Body** | Inter | 400 | 16px · 1.65 line-height | - |
| **Body Large** | Inter | 400 | 18px · 1.7 line-height | - |
| **Caption** | Inter | 500 | 12px | - |
| **Mono** | JetBrains Mono | 400 | 14px | - |

### Font Setup

All three typefaces are loaded via `next/font/google` in `docs/src/app/layout.tsx`:

```tsx
import { Inter, JetBrains_Mono, Young_Serif } from "next/font/google";

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin"],
  weight: "400",
});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["400", "500"] });
```

The CSS variable `--font-display` maps to `--font-young-serif` via `@theme inline` in `globals.css`. Use `font-display` utility class (never pair with `font-bold` or `font-medium`: Young Serif is weight 400 only).

### Typography Rules

- Display and H1 headlines intentionally run to 2 lines, this creates weight. Don't fight it.
- Every major section opens with an eyebrow label followed by a Young Serif heading.
- Eyebrow colour: `--color-lime` on dark sections, `--color-ink-muted` on light sections.
- Body text max width: 65 characters (approx `640px`). Never stretch body copy full-width.
- Never centre-align paragraphs. Centre only: eyebrows and headings in hero/CTA sections.
- Headings on white or off-white: `--color-ink`.
- Headings on dark: `#FFFFFF`.

### Logo Typography

The **IS** logo mark uses Young Serif inside the lime square container. The serif letterforms give the mark character at small sizes.

---

## Spacing & Whitespace

Whitespace is the primary design tool. Sections should feel uncrowded. When in doubt, add more vertical space, not less.

### Base Scale (4px grid)

```
4px   · --space-1   · micro gaps, icon padding
8px   · --space-2   · tight inline spacing, padding-xs
12px  · --space-3   · small element gaps, list row vertical
16px  · --space-4   · default element spacing, padding-sm
24px  · --space-6   · card padding, padding-md, group spacing
32px  · --space-8   · section sub-divisions, padding-lg
48px  · --space-12  · component-level spacing, tablet gutter
64px  · --space-16  · between major content blocks
96px  · --space-24  · section vertical padding (desktop), padding-2xl
128px · --space-32  · hero vertical padding
```

### Padding

Padding is internal spacing that separates content from a component's outer boundary.

| Token | Utility | Value | Use |
|---|---|---|---|
| `--padding-xs` | `p-2` | 8px | Micro insets, tag padding, bento cell gaps |
| `--padding-sm` | `p-4` | 16px | Compact data: list rows, dialog body, dense tables |
| `--padding-md` | `p-6` | 24px | Cards, widgets, notifications, app content area |
| `--padding-lg` | `p-8` | 32px | Featured marketing cards, testimonial blocks |
| `--padding-xl` | `px-12` | 48px | Section horizontal gutter (tablet+) |
| `--padding-2xl` | `py-24` | 96px | Section vertical padding (desktop) |

**By context:**

| Context | Token | Examples |
|---|---|---|
| **Compact data** | 16px (`p-4`) | Widget list rows, dialog padding, sidebar items |
| **Variable height content** | 24px (`p-6`) | Cards, notifications, widget body, app shell content |
| **Marketing cards** | 24–32px, responsive | Base card `p-6`; wide cards scale to `p-8`/`p-10` at lg |
| **Section layout** | gutter + vertical | Container `px-6 md:px-12`; Section `spacing` prop |

### Spacing (gaps between elements)

Spacing tokens separate elements horizontally and vertically. They use the same foundational scale as padding but apply to `gap`, `margin`, and stack rhythm between siblings. See the [Spacing](/components/spacing) docs page for semantic tokens split by application vs website.

**Foundational scale** (4px grid): `size-4` (4px) through `size-128` (128px), mapped to Tailwind utilities `1` through `32`.

**Application semantic tokens:**

| Direction | Token | Value | Utility |
|---|---|---|---|
| Horizontal | between-inline | 8px | `gap-2` |
| Horizontal | between-controls | 12px | `gap-3` |
| Horizontal | component-default | 16px | `gap-4` |
| Horizontal | screen-inset | 24px | `px-6` |
| Vertical | between-text | 8px | `gap-2` |
| Vertical | form-fields | 20px | `gap-5` |
| Vertical | text-to-component | 16px | `gap-4` |
| Vertical | content-to-action | 24px | `gap-6` |

**Website semantic tokens:**

| Direction | Token | Value | Utility |
|---|---|---|---|
| Horizontal | between-chips | 12px | `gap-3` |
| Horizontal | between-cards | 16px | `gap-4` |
| Horizontal | between-columns | 32px+ | `gap-8 md:gap-12` |
| Horizontal | screen-mobile | 24px | `px-6` |
| Horizontal | screen-desktop | 48px | `md:px-12` |
| Vertical | eyebrow-to-heading | 12px | `mb-3` |
| Vertical | heading-to-body | 16px | `mb-4` |
| Vertical | text-to-component | 24px | `mt-6` |
| Vertical | content-to-button | 32px | `mt-8` |
| Vertical | between-sections | 96px+ | `py-24 md:py-32` |

### Page Layout

- Max content width: `1200px`
- Horizontal padding: `24px` mobile · `48px` tablet · `96px` desktop
- Section vertical padding: `96px` desktop · `64px` tablet · `48px` mobile
- Text content columns: max `740px` for body-heavy sections

### Responsive design

Instant Strata is **desktop-first, mobile-aware**. Dashboards and portfolio views are optimised for managers at a desk. The same flows must remain usable on a phone: checking an inbox item, looking up a scheme, or reading a notification between site visits.

This is not mobile-first design. We do not strip the desktop experience down to fit mobile. We make deliberate choices about what appears at each breakpoint.

**Philosophy:**

| Principle | Meaning |
|---|---|
| **Desktop-first** | Wide tables, multi-column dashboards, and full metadata are the default target. |
| **Mobile-aware** | Primary manager paths work on a phone without horizontal scroll. |
| **Progressive detail** | Add columns, badges, and side panels as viewport width increases. |

**Breakpoints** (Tailwind defaults):

| Token | Min width | Role |
|---|---|---|
| `sm` | 640px | Secondary metadata, plan badges, file size columns |
| `md` | 768px | Mobile/desktop boundary: sidebar sheet, site header nav |
| `lg` | 1024px | Multi-column dashboard grids, wide table layouts |
| `xl` | 1280px | Full three-column widget grids, portfolio side panels |

The `useIsMobile()` hook (`@/hooks/use-mobile`) uses `768px` as the mobile threshold for behaviour CSS cannot handle (sheet vs rail).

**Application patterns:**

| Surface | Mobile / tablet | Desktop |
|---|---|---|
| Sidebar | Slide-in sheet | Fixed 240px rail with labels |
| Dashboard grids | Single column stack | `WidgetGrid` with `lg:col-span-*` |
| Identity rows | `layout="list"` or `layout="compact"` | `layout="wide"` with column headings |
| Table columns | Hide with `hidden sm:block`, `hidden md:inline-flex` | Full metadata visible |
| Forms | Single column | Two columns from `md` for short field pairs |

**Content priority (what to hide first on narrow viewports):**

1. Secondary metadata (dates, assignee, location lines)
2. Decorative or redundant badges
3. Column headings (when switching to list layout instead)
4. Never hide: primary identifier, workflow status, or the action that unblocks the user

**Layout variants by domain element:**

| Element | Mobile | Desktop |
|---|---|---|
| `SchemeCard` | list, compact | wide, card |
| `LotCard` / `OwnerRollRow` | list, compact | wide |
| `WorkItem` | list, compact | list with full trailing column |
| `Document` | list, thing | wide with headings |
| `WidgetGrid` | 1 column | 2–3 columns at lg |

**Website:** marketing sections stack at `md`. Hero, feature grids, and footer columns collapse to single column with compressed gutter (`px-6` mobile, `md:px-12` desktop). See [Responsive design](/components/responsive-design) docs for the full checklist.

**Review checklist:**

- Primary task completable at 375px width without horizontal scroll
- Inbox and list rows at least 44px tap height
- Desktop shows strictly more detail than mobile, not different data
- Wide layouts only where column headings fit

**Testing in documentation:** use `ResizableViewport` (`@/components/docs/resizable-viewport`) to drag-resize an iframe-backed preview. CSS breakpoints follow the panel width; JavaScript viewport hooks (`useIsMobile`) follow the browser window. See [Responsive design](/components/responsive-design) docs.

### Whitespace Principles

1. **Let headings breathe.** `mb-6` minimum below eyebrow, `mb-4` minimum below H2 before body.
2. **Cards don't touch edges.** Always `24px` internal padding minimum.
3. **Feature grids:** `32px` gap between cards. Don't compress the grid.
4. **Hero text:** Left-aligned text column should not exceed 55% of the viewport width on desktop. The right half is either empty (creating space) or holds a visual.
5. **Don't fill every pixel.** Empty space in a card or section is intentional. Resist adding more content.

---

## Border Radius

Rectangular with a small radius in product UI. Marketing surfaces use larger values for expressive layout blocks.

### Product scale

| Token | Utility | Value | Use |
|---|---|---|---|
| `--radius-xs` | `rounded-xs` | 2px | Badges, tags, status pills, mention chips |
| `--radius-sm` | `rounded-sm` | 4px | Buttons, inputs, notifications, widgets, dialogs, logo mark. **Default for app UI.** |
| `--radius-md` | `rounded-md` | 8px | Dropdown items, sidebar nav, system avatars, inner marketing visuals |

### Marketing scale

| Token | Utility | Value | Use |
|---|---|---|---|
| `--radius-lg` | `rounded-lg` | 12px | Marketing cards, infographic shells, bento inner cells |
| `--radius-xl` | `rounded-xl` | 16px | Story grid tiles, wide blog cards, visual frames |
| `--radius-2xl` | `rounded-2xl` | 24px | Hero headline bands, page header visuals |
| `--radius-expressive` | `rounded-[28px]` | 28px | Bento outer wrapper, feature-split seam, hero corner curves |

**Hard rules:**
- Product UI defaults to `rounded-sm` (4px). Use `rounded-xs` (2px) only for tags and badges.
- Do not carry marketing radii (`rounded-lg` and above) into the app shell or dense dashboards.
- All interactive elements (buttons, inputs) use `4px`.
- Marketing cards use `12px` (`rounded-lg`) minimum; wide editorial cards step up to `16px` (`rounded-xl`).
- `border-radius: 9999px` (pill) is reserved for owner avatars (`OwnerAvatar`) and decorative play buttons. System user avatars use `4px` (`rounded-md`).
- The logo mark always uses `4px`.
- Pair larger radii with more internal padding. See [Padding](#padding) below.

---

## Components

### Button

```tsx
// Primary: lime fill, dark text. Used once per section maximum.
<Button variant="default">Try for free</Button>

// Outline: used alongside primary for secondary actions.
<Button variant="outline">Request demo</Button>

// Ghost: text links with directional arrow, no border.
<Button variant="ghost">See how it works →</Button>
```

**Rules:**
- Primary fill is always `--color-lime` with `--color-ink` text. Never white text on lime.
- On dark sections: outline button uses `border: 1px solid rgba(255,255,255,0.4)` with white text.
- Arrow `→` on text links is a text character, not an icon component.
- No pill buttons. `border-radius: 4px` always.
- Loading state: spinner appears inline, before the label. Label stays visible.
- Never more than 2 buttons in a CTA group.

### Badge

Foundation label primitive for status pills, identifiers, and metadata. All domain badges (`SchemeStatusBadge`, `LotLevyBadge`, `WorkItemStatusBadge`, etc.) compose `Badge` so tone and sizing stay consistent.

**Variant mapping (use everywhere):**

| Variant | Meaning | Examples |
|---|---|---|
| `accent` | Positive / active / success | Active scheme, paid levy, automatable, portal active, in progress |
| `warning` | Caution / pending review | Onboarding, awaiting review, R-A-S, invited |
| `info` | Informational / neutral updates | System notices, tips, portal updates |
| `destructive` | Error / overdue / attention | Needs attention, overdue levy, failed, escalated |
| `default` | Neutral metadata | Archived, manual, not registered, snoozed |
| `mono` | Identifiers | SP plan numbers, lot numbers, file extensions |
| `outline` | Low-emphasis bordered | Correspondence preference, work item domain |

**Rules:**
- Prefer domain badges in product UI over raw `Badge`.
- Identifier badges use `size="sm"` and `variant="mono"`.
- Status badges use `size="md"` with optional `hideIcon` in dense tables.
- Danger-soft backgrounds always pair with `text-danger`, never `text-ink`.
- Warning-soft backgrounds always pair with `text-warning`, never `text-ink`.
- Info-soft backgrounds always pair with `text-info`, never `text-ink`.
- `border-radius: 2px` (`rounded-xs`) on all badges.

### Notification

Inline alert banners for toasts, page callouts, and form feedback. Compose `Notification` for consistent status styling.

**Type mapping:**

| Type | Meaning | Examples |
|---|---|---|
| `default` | Neutral metadata | Low-priority notes, general reminders |
| `info` | Informational updates | Portal announcements, feature tips, FYI notices |
| `warning` | Caution / pending review | Pending approvals, incomplete setup |
| `danger` | Errors / destructive outcomes | Failed payments, validation errors |

**Rules:**
- Always pair icons with text. Icons reinforce meaning; they do not replace it.
- Use `type="danger"` with `role="alert"` for errors that need immediate attention.
- Info, warning, and danger types use soft tinted backgrounds with saturated headings (`text-info`, `text-warning`, `text-danger`). Body copy uses `text-ink-muted`.
- `border-radius: 4px` (`rounded-sm`) on all notification banners.

### Card

Three card styles. Each has a clearly defined home context.

**Bordered card**: on white or off-white backgrounds:
```
bg: white   border: 1px solid var(--border)   radius: 12px (rounded-lg)   padding: 24px
```

**Accent card**: on white or off-white backgrounds, for featured/highlighted content:
```
bg: --color-lime-soft   border: none   radius: 12px (rounded-lg)   padding: 24px
text: --color-ink
```

**Dark card**: inside a dark section:
```
bg: --color-forest-mid   border: none   radius: 12px (rounded-lg)   padding: 24px
text: white
```

Product dashboard panels (Widget) use `rounded-sm` (4px) and `padding-md` (24px) for the body.

Card shadows: use sparingly. `box-shadow: 0 1px 3px rgba(0,0,0,0.08)` only on bordered cards to lift them off a white background. Never use drop shadows on dark or accent cards.

### Scheme (strata building identity)

A **scheme** is the owners corporation for a building. It is identified consistently everywhere using the `SchemeSummary` contract: name, strata plan number (`SP 1042`), location, lot count, financial year end, manager, status, and health.

**When to use each element:**

| Element | Use for |
|---|---|
| `SchemeCard` (list) | Scheme directories, pickers, mobile lists |
| `SchemeCard` (card) | Manager portfolio dashboards with stats |
| `SchemeCard` (wide) | Tabular portfolio views with column headings |
| `SchemeCard` (compact) | Dropdown rows, tight mentions |
| `SchemeContextBar` | Top of every scheme-scoped page (sticky) |
| `SchemeIdentity` | Breadcrumbs, inline references, table cells |
| `SchemePlanBadge` | Mono SP number label |
| `SchemeStatusBadge` | active · onboarding · archived · attention |
| `SchemeHealthIndicator` | good · warning · critical compliance signal |
| `SchemeSwitcher` | Portfolio scheme picker |

**Rules:**
- Building2 (or initials on lime-soft) is the scheme icon. One icon per scheme everywhere.
- `SchemePlanBadge` and `SchemeStatusBadge` compose the shared `Badge` primitive (see Badge docs for variant mapping).
- Plan numbers display as `SP 1042` (mono, uppercase prefix).
- Location metadata format: `Suburb, STATE · N lots · FY end 30 Jun`.
- `SchemeContextBar` appears on all pages inside a scheme. Portfolio-only pages use `SchemeList` without the bar.
- Extend `SchemeSummary` in the app for fund balances and compliance dates. Do not fork the display primitives.

### Lot (strata roll entry)

A **lot** is an entry on the strata roll within a scheme. It is identified by lot number, unit label, entitlement, owner, levy status, and proxy eligibility.

**When to use each element:**

| Element | Use for |
|---|---|
| `LotBadge` | Inline lot references in correspondence and tables |
| `LotCard` (list) | Strata roll rows (lot-centric) |
| `LotCard` (wide) | Full roll tables with entitlement, levy, and proxy columns |
| `LotCard` (card) | Lot picker grids (maintenance, complaints) |
| `LotCard` (compact) | Dropdown and search result rows |
| `LotIdentity` | Breadcrumbs and lot detail headers |
| `LotLevyBadge` | paid · due · overdue · not assessed |
| `LotProxyBadge` | AGM proxy eligibility |
| `LotList` / `LotRollHeader` | Bordered roll container with summary counts |

**Rules:**
- Lot numbers display as `Lot 12` (mono badge or number tile).
- `LotBadge`, `LotLevyBadge`, and `LotProxyBadge` compose `Badge`. `LotRollHeader` summary counts use `Badge` directly.
- Entitlement displays as `UE 85` in metadata.
- Occupant line shows tenant when tenanted, otherwise owner. Vacant lots show `Vacant`.
- Proxy ineligible lots typically correlate with levy arrears: surface both in wide roll views.
- Extend `LotSummary` in the app for contact details and correspondence prefs.

### Owner (registered proprietor)

An **owner** is a person or entity on the strata roll who holds one or more lots. Owners receive levy notices, official correspondence, and portal access.

**When to use each element:**

| Element | Use for |
|---|---|
| `OwnerRollRow` (list) | Owner directory rows, correspondence pickers |
| `OwnerRollRow` (wide) | Tabular directories with contact, levy, and portal columns |
| `OwnerCard` | Profile tiles, portal admin, onboarding views |
| `OwnerCard` (compact) | Search and dropdown picker rows |
| `OwnerIdentity` | Breadcrumbs and inline owner references |
| `OwnerAvatar` | Round avatar for proprietors (distinct from square system `Avatar`) |
| `OwnerLotChips` | Owned lots via composed `LotBadge` chips |
| `OwnerTypeBadge` | individual · company · joint |
| `OwnerPortalBadge` | active · invited · not registered |
| `OwnerCorrespondenceBadge` | email · post · portal preference |
| `OwnerCommitteeBadge` | Committee member indicator |
| `OwnerList` / `OwnerRollHeader` | Bordered directory with summary counts |

**Rules:**
- Use `OwnerRollRow` for owner-centric views; `LotCard` for lot-centric views.
- Owner badges and `OwnerRollHeader` summary counts compose `Badge` (see Badge docs).
- Multi-lot owners appear once with `OwnerLotChips`, not duplicated per lot.
- Levy status on owners reflects worst-case or primary lot status: document which in the app layer.
- Avatar uses `OwnerAvatar` (round). System users use square `Avatar` in app chrome.
- Joint owner names like `James & Sarah Chen` initialise as `JC` (not `J&`).
- Extend `OwnerSummary` in the app for mortgagee, tenant, and settlement history.

### Task (work items and queues)

A **work item** is an operational task in a strata workflow. Items carry workflow state, AI automation class, domain, priority, and optional statutory due dates.

**When to use each element:**

| Element | Use for |
|---|---|
| `WorkItem` (list) | Manager inbox rows with priority bar |
| `WorkItem` (detail) | R-A-S review panels with missing items and advisory |
| `WorkItem` (card) | Dashboard and kanban tiles |
| `WorkItem` (compact) | Sidebar and notification rows |
| `TaskQueue` | Bordered inbox container with empty state |
| `TaskQueue` (sectioned) | Grouped inbox: Escalated, Awaiting review, Active |
| `TaskQueueHeader` | Open, review, overdue, and escalated counts |
| `TaskQueueSection` | Labelled group with tone (default, warning, danger) |
| `WorkItemStatusBadge` | Full workflow state set |
| `WorkItemAutomationBadge` | automatable · R-A-S · manual |
| `WorkItemDueBadge` | Due, statutory, or follow-up with overdue emphasis |
| `WorkItemMissingItems` | Unmet prerequisites block |
| `WorkItemAdvisory` | Non-blocking AI advisory note |

**Rules:**
- List layout scan order: priority bar → title → meta → badges → assignee.
- Work item badges and `TaskQueueHeader` summary counts compose `Badge` (see Badge docs).
- R-A-S items use `awaiting_review` status and the amber `R-A-S` automation badge.
- AI failures map to `failed` or `manual_required`, never silent success.
- Statutory due dates use `dueKind: "statutory"` and overdue danger styling.
- Group queues by urgency: Escalated first, then Awaiting review, then Active.

### Bento Grid

Signature layout for feature showcase sections. Asymmetric card sizes create hierarchy without needing headings on every card.

```
┌──────────────────────────────────────────┐  ← outer: 28px (radius-expressive)
│  ┌──────────┐  ┌──────────────────────┐  │
│  │  Small   │  │                      │  │
│  │  card    │  │   Wide card          │  │  ← inner cells: rounded-lg (12px)
│  └──────────┘  │                      │  │
│  ┌──────────┐  └──────────────────────┘  │
│  │          │  ┌──────────┐  ┌────────┐  │
│  │  Tall    │  │  Small   │  │ Small  │  │
│  │  card    │  └──────────┘  └────────┘  │
│  └──────────┘                            │
└──────────────────────────────────────────┘
```

- Outer wrapper background: `--color-forest-mid` when inside a dark section, `--color-off-white` on a light section
- Each cell: icon (24px) at top-left, label at bottom-left
- Gap between cells: `8px`
- Used at most once per page

### Eyebrow + Section Heading

Every major section opens with this pattern:

```tsx
// On a light section
<p className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
  For strata managers
</p>
<h2 className="font-display text-4xl font-bold text-ink leading-tight">
  Everything in one place
</h2>

// On a dark section
<p className="text-xs font-semibold uppercase tracking-widest text-lime mb-3">
  For strata managers
</p>
<h2 className="font-display text-4xl font-bold text-white leading-tight">
  Everything in one place
</h2>
```

### Feature Row (Alternating)

Two-column layout: text left + visual right, then next row flips. Used in the white and off-white sections for detailed feature explanation.

```
[  Text column (45%)  ]  [  Visual/screenshot (55%)  ]
[  Visual (55%)  ]  [  Text column (45%)  ]
```

- Text column: eyebrow, H3, body (max 2 short paragraphs), optional CTA link
- Visual: screenshot or illustration in a `rounded-md` container, subtle border
- Vertical gap between rows: `96px`

### Testimonial Block

Oversized quotation mark as a graphic device, positioned behind the quote card.

```tsx
<div className="relative py-12">
  <span
    aria-hidden="true"
    className="absolute bottom-0 left-0 font-display text-[160px] font-bold leading-none text-lime/30 select-none"
  >
    "
  </span>
  <div className="relative z-10 rounded-md bg-lime-soft p-10 max-w-2xl">
    <p className="font-display text-xl font-semibold leading-relaxed text-ink">
      {quote}
    </p>
    <div className="mt-8 flex items-center justify-between">
      <div>
        <p className="font-semibold text-sm text-ink">{name}</p>
        <p className="text-sm text-ink-muted">{role}</p>
      </div>
      <img src={logoSrc} alt={company} className="h-6 opacity-60" />
    </div>
  </div>
</div>
```

Used inside a dark section so the lime-soft card pops against the forest background.

### Social Proof Strip

Logo strip on a white or dark background. Logos rendered at `opacity-40` (dark bg) or `opacity-30` (light bg): greyscale. No borders, no cards.

### Section Divider

No `<hr>` tags. Section transitions are created entirely by alternating background colours.

---

## Iconography

- **Library:** Lucide React
- **Style:** Stroke only, `strokeWidth={1.5}`. Never filled icons.
- **Sizes:** `16px` inline text · `20px` UI controls · `24px` feature cards · `32px` section icons
- **Colour on light backgrounds:** `--color-ink` or `--color-lime`
- **Colour on dark backgrounds:** `white` or `--color-lime`

---

## Imagery

- Real people in real work environments. Warm, natural light. Collaborative.
- Never full-bleed background images. Photos sit as content elements.
- Photo containers: `rounded-md` (`8px`). No drop shadows.
- Photos in feature rows: slight overlap across the section boundary for depth.
- Aspect ratios: `4:3` for feature illustrations, `1:1` for testimonial portraits.

---

## Motion

Professional tool. Motion is subtle and purposeful, never decorative.

| Interaction | Duration | Easing |
|---|---|---|
| Button hover | `150ms` | `ease` |
| Card hover | `150ms` | `ease` |
| Dropdown open | `120ms` | `ease-out` |
| Section entry (scroll) | `300ms` | `ease-out` |
| Loading spinner | `700ms` | `linear` |

Section entry animation: `opacity: 0 → 1`, `translateY: 12px → 0`. No bounce, no spring.

---

## Dark Section Rules

When `background: --color-forest`:

1. Headings: `color: white`
2. Body: `color: rgba(255,255,255,0.75)`
3. Eyebrows: `color: --color-lime`
4. Primary button: `bg-lime text-ink` (unchanged)
5. Outline button: `border-white/40 text-white hover:bg-white/10`
6. Borders: `rgba(255,255,255,0.12)`
7. Cards: use `--color-forest-mid` background
8. Accent cards: use `--color-lime-soft` background with `--color-ink` text
9. Links: `--color-lime` with `hover:underline`

---

## Page Structure

### Landing Page

```
1. Nav             → transparent over dark hero
2. Hero            → Dark · Young Serif headline · subtext · 2 CTAs · right-side visual
3. Social Proof    → White · logo strip · minimal, spacious
4. Features Bento  → Off-white · eyebrow + H2 left · bento grid right
5. Feature Rows    → White · 2–3 alternating text+visual rows
6. CTA Band        → Accent (lime-soft) · short bold heading · 2 CTAs
7. Feature Rows    → Off-white · continues feature detail
8. Testimonial     → Dark · quote card + oversized quote mark
9. Pricing         → White · 3-column cards
10. FAQ            → Off-white · accordion
11. Final CTA      → Accent (lime-soft) · big heading + 2 CTAs
12. Footer         → Dark · links, logo, legal
```

### App / Dashboard Pages

- Light mode, white background always
- Left sidebar: `240px` wide, `--color-off-white` background, `1px` right border. Slide-in sheet below `md` (768px)
- Content area: white, `24px` padding
- Max content width for text-heavy pages: `740px`
- Headings: Inter only (Young Serif is for marketing, not dense UI)
- Mobile: use list/compact layout variants; progressive column visibility on wide rows. See [Responsive design](#responsive-design)

### Docs Pages

- White background
- Left nav sidebar
- `740px` max content width
- Code blocks: `--color-forest` background, `--color-lime` for keywords
- No decorative elements, clean, functional

---

## Tailwind Config

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

export default {
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#043F2E",
          mid:     "#0A5C3D",
        },
        lime: {
          DEFAULT: "#C8F169",
          soft:    "#EBF8C2",
        },
        "off-white": "#EEF2E3",
        ink: {
          DEFAULT: "#043F2E",
          muted:   "#4A7A62",
        },
        danger: {
          DEFAULT: "#C44B47",
          soft:    "#F5E0DE",
        },
        warning: {
          DEFAULT: "#A8651A",
          soft:    "#F8ECDC",
        },
        info: {
          DEFAULT: "#2D6A9F",
          soft:    "#E0ECF5",
        },
        border: "#D4E8C2",
      },
      fontFamily: {
        display: ["var(--font-young-serif)", "Georgia", "serif"],
        sans:    ["var(--font-sans)", "system-ui", "sans-serif"],
        mono:    ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        xs:  "2px",
        sm:  "4px",
        md:  "8px",
        lg:  "12px",
        xl:  "16px",
        "2xl": "24px",
      },
      maxWidth: {
        content: "1200px",
        prose:   "740px",
      },
    },
  },
} satisfies Config;
```

---

## AI Prompt Snippet

Include this block when prompting AI tools to build Instant Strata UI:

> **Brand:** Instant Strata: strata property management platform.
>
> **Colours:** White (`#FFFFFF`) is the dominant background. Off-white (`#EEF2E3`) for subtle section alternation. Lime (`#C8F169`) is the brand accent: buttons, eyebrows, highlights. Forest green (`#043F2E`) for dark sections (hero, testimonial, footer) and all text. Lime-soft (`#EBF8C2`) for accent sections and card fills.
>
> **Typography:** Young Serif (Google Fonts, weight 400 only) for all display and section headings. Inter for UI, body, and labels. Logo mark uses Young Serif inside the lime square.
>
> **Style:** Rectangular forms in product UI: `4px` radius (`rounded-sm`) on buttons, inputs, and panels; `2px` on badges. Marketing cards use `12px` (`rounded-lg`) and above. No pill shapes in product UI. Generous whitespace. Professional but not corporate.
>
> **Sections:** Most content sections are white or off-white. Dark sections (forest) used sparingly: hero, one testimonial, footer. Lime-soft accent sections used for CTA bands. Max 3 dark sections per page.
>
> **Buttons:** Lime fill + dark text for primary. Outline (dark border on light, white border on dark) for secondary. No pill shapes.
>
> **Logo:** IS letterforms in a `4px` radius square, container rotated 15° with upright letterforms. Lime container + forest letterforms on light backgrounds; forest container + white letterforms on lime; forest container + lime letterforms on dark.

---

## Changelog

| Date | Change |
|---|---|
| 2026-06-15 | Initial specification |
| 2026-06-15 | Revised, white as dominant background, dark sections used sparingly, updated colours to match brand reference palette, expanded whitespace guidance |
| 2026-06-15 | Added Scheme identity component guidance (SchemeCard, SchemeContextBar, primitives) |
| 2026-06-15 | Added Lot identity component guidance (LotCard, LotBadge, roll lists) |
| 2026-06-15 | Added Owner identity component guidance (OwnerRollRow, OwnerCard, directory) |
| 2026-06-19 | Added responsive design foundation: desktop-first, mobile-aware application and website patterns |
| 2026-06-19 | Added tone of voice foundation docs under Overview |
| 2026-06-19 | Added spacing foundation docs with app vs website semantic tokens |
| 2026-06-19 | Added product vs marketing radius scale, semantic padding tokens, radius and padding foundation docs |
