import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";

/* eslint-disable @next/next/no-img-element */

/** Public assets live under the configured basePath (see next.config.ts). */
const ASSET_BASE = "/elements/favicon";

const ASSETS = [
  {
    file: "favicon.svg",
    label: "favicon.svg",
    size: "Scalable",
    description: "Vector source. Modern browsers prefer this; renders crisp at any size.",
  },
  {
    file: "favicon.ico",
    label: "favicon.ico",
    size: "16 · 32 · 48",
    description: "Multi-resolution legacy fallback served from the site root.",
  },
  {
    file: "favicon-16x16.png",
    label: "favicon-16x16.png",
    size: "16 × 16",
    description: "Browser tab at standard density.",
  },
  {
    file: "favicon-32x32.png",
    label: "favicon-32x32.png",
    size: "32 × 32",
    description: "Browser tab on retina displays and taskbar shortcuts.",
  },
  {
    file: "apple-touch-icon.png",
    label: "apple-touch-icon.png",
    size: "180 × 180",
    description: "iOS home screen. Opaque white background; iOS applies its own rounding.",
  },
  {
    file: "android-chrome-192x192.png",
    label: "android-chrome-192x192.png",
    size: "192 × 192",
    description: "Android home screen and PWA install.",
  },
  {
    file: "android-chrome-512x512.png",
    label: "android-chrome-512x512.png",
    size: "512 × 512",
    description: "Splash screens and high-density PWA contexts.",
  },
  {
    file: "site.webmanifest",
    label: "site.webmanifest",
    size: "JSON",
    description: "Web app manifest wiring the Android icons, name, and theme colours.",
  },
];

const HEAD_CODE = `<!-- In the document <head> -->
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />`;

const NEXT_CODE = `// app/layout.tsx — Next.js App Router
import type { Metadata } from "next"

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}`;

const MANIFEST_CODE = `{
  "name": "Instant Strata",
  "short_name": "Instant Strata",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "theme_color": "#C8F169",
  "background_color": "#043F2E",
  "display": "standalone"
}`;

/**
 * Foundation documentation page for the Instant Strata favicon set.
 */
export default function FaviconPage() {
  return (
    <DocsPage className="space-y-20">

      {/* Page header */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Favicon
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          The browser-tab and home-screen icons derived from the{" "}
          <strong className="font-semibold text-foreground">IS</strong> mark: a lime container
          rotated 15° with upright forest letterforms. Download the full set, drop it in your
          site root, and wire it up with the snippets below.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          PREVIEW
      ══════════════════════════════════════════════ */}
      <section id="preview">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Preview
        </p>
        <h2 className="font-display text-2xl text-foreground mb-6">
          At every size
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-2xl">
          The mark holds up from a 16px tab icon to a 512px splash. Letterforms stay legible
          because the container fills the frame and the IS pairing keeps generous counters.
        </p>

        <ComponentPreview label="Browser tab → home screen">
          <div className="flex flex-wrap items-end justify-center gap-10">
            {[16, 32, 48, 64, 128].map((px) => (
              <div key={px} className="flex flex-col items-center gap-3">
                <img
                  src={`${ASSET_BASE}/favicon.svg`}
                  alt={`Instant Strata favicon at ${px} pixels`}
                  width={px}
                  height={px}
                  style={{ width: px, height: px }}
                />
                <span className="font-mono text-[10px] text-ink-muted">{px}px</span>
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          DOWNLOAD
      ══════════════════════════════════════════════ */}
      <section id="download">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Download
        </p>
        <h2 className="font-display text-2xl text-foreground mb-6">
          The full set
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed mb-8 max-w-2xl">
          One archive with every format plus the web manifest, ready to drop in your project&apos;s
          public root.
        </p>

        <a
          href={`${ASSET_BASE}/favicon.zip`}
          download
          className="inline-flex items-center gap-2 rounded-sm bg-forest px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-forest-mid transition-colors duration-150"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download favicon.zip
        </a>

        <ul className="mt-10 divide-y divide-border rounded-sm border border-border overflow-hidden">
          {ASSETS.map((asset) => (
            <li key={asset.file} className="flex items-center gap-4 bg-background px-4 py-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-sm border border-border bg-secondary">
                {asset.file.endsWith(".png") ||
                asset.file === "favicon.svg" ||
                asset.file === "favicon.ico" ? (
                  <img
                    src={`${ASSET_BASE}/${asset.file}`}
                    alt={asset.label}
                    className="size-7 object-contain"
                  />
                ) : (
                  <span className="font-mono text-[9px] uppercase text-ink-muted">json</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-3">
                  <a
                    href={`${ASSET_BASE}/${asset.file}`}
                    download
                    className="font-mono text-sm text-foreground no-underline hover:text-forest-mid"
                  >
                    {asset.label}
                  </a>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {asset.size}
                  </span>
                </div>
                <p className="text-xs text-ink-muted leading-relaxed mt-0.5">
                  {asset.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ══════════════════════════════════════════════
          INSTALLATION
      ══════════════════════════════════════════════ */}
      <section id="installation">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Installation
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Unzip the archive into your site&apos;s public root (so the files sit at{" "}
          <code className="font-mono text-xs text-foreground">/favicon.ico</code>,{" "}
          <code className="font-mono text-xs text-foreground">/favicon.svg</code>, and so on),
          then reference them.
        </p>

        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Plain HTML</h3>
            <CodeBlock code={HEAD_CODE} language="html" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Next.js (App Router)</h3>
            <CodeBlock code={NEXT_CODE} language="tsx" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          MANIFEST
      ══════════════════════════════════════════════ */}
      <section id="manifest">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Web manifest
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          <code className="font-mono text-xs text-foreground">site.webmanifest</code> registers the
          Android icons and sets the install colours: lime as the theme colour, forest as the
          background.
        </p>
        <CodeBlock code={MANIFEST_CODE} language="json" />
      </section>

      {/* ══════════════════════════════════════════════
          RULES
      ══════════════════════════════════════════════ */}
      <section id="rules">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Rules
        </p>
        <ul className="space-y-3 max-w-2xl">
          {[
            "Serve favicon.svg and favicon.ico from the site root, not a subfolder, so default browser requests resolve.",
            "Keep the lime container filling the frame: never pad the mark down to a small badge inside the icon.",
            "apple-touch-icon stays opaque (white background); iOS does not honour transparency and adds its own corner radius.",
            "Android icons (192 / 512) keep transparent corners and are wired through site.webmanifest.",
            "Do not recolour the mark for favicons — lime container, forest letterforms, always.",
            "Regenerate the whole set from the SVG source if the brand mark changes; never hand-edit a single PNG.",
          ].map((rule) => (
            <li key={rule} className="flex gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <span className="text-lime shrink-0 mt-0.5" aria-hidden="true">-</span>
              {rule}
            </li>
          ))}
        </ul>
      </section>

    </DocsPage>
  );
}
