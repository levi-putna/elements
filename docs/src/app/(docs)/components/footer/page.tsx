import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Footer, FOOTER_DEFAULT } from "@/components/ui/footer";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/footer/registry.json`;

const USAGE = `import { Footer, LinkedInIcon, XIcon } from "@/components/ui/footer"

export function SiteFooter() {
  return (
    <Footer
      description="Strata management, simplified. One platform for managers, committees, and owners."
      social={[
        { label: "LinkedIn", href: "https://linkedin.com", icon: <LinkedInIcon /> },
        { label: "X", href: "https://x.com", icon: <XIcon /> },
      ]}
      columns={[
        {
          heading: "Platform",
          links: [
            { label: "Explore platform", href: "/platform" },
            { label: "Owner portal", href: "/owner-portal" },
            { label: "Committee tools", href: "/committee" },
            { label: "Levy & billing", href: "/billing" },
          ],
        },
        {
          heading: "Company",
          links: [
            { label: "About", href: "/about" },
            { label: "Customers", href: "/customers" },
            { label: "Careers", href: "/careers" },
            { label: "Contact us", href: "/contact" },
          ],
        },
      ]}
      legal={[
        { label: "Terms of service", href: "/terms" },
        { label: "Privacy statement", href: "/privacy" },
      ]}
      copyright="© Instant Strata Pty Ltd 2026"
    />
  )
}`;

const COMPOSE_USAGE = `import { FooterColumn, FooterBottomBar } from "@/components/ui/footer"

// Drop the parts into a bespoke layout when the structured
// Footer props are not flexible enough.
<footer className="bg-forest text-white">
  <div className="mx-auto max-w-[1200px] px-6 py-16">
    <FooterColumn
      heading="Platform"
      links={[
        { label: "Owner portal", href: "/owner-portal" },
        { label: "Committee tools", href: "/committee" },
      ]}
    />
    <FooterBottomBar
      copyright="© Instant Strata Pty Ltd 2026"
      legal={[{ label: "Privacy statement", href: "/privacy" }]}
    />
  </div>
</footer>`;

const FOOTER_PROPS = [
  { name: "description", type: "string", description: "Short tagline beneath the logo in the brand column." },
  { name: "columns", type: "FooterColumnData[]", description: "Link columns rendered in the grid beside the brand column. Each has a heading and links." },
  { name: "social", type: "FooterSocial[]", description: "Social links shown as circular icon buttons under the tagline. Each has a label, href and icon node." },
  { name: "legal", type: "FooterLink[]", description: "Legal links (Terms, Privacy, …) rendered on the right of the bottom bar." },
  { name: "copyright", type: "string", description: "Copyright line on the left of the bottom bar." },
  { name: "className", type: "string", description: "Additional classes on the outer footer element." },
];

const COLUMN_PROPS = [
  { name: "heading", type: "string", description: "Column title, rendered in lime small caps." },
  { name: "links", type: "FooterLink[]", description: "Array of { label, href } links in the column." },
  { name: "className", type: "string", description: "Additional classes on the column wrapper." },
];

const SOCIAL_LINK_PROPS = [
  { name: "label", type: "string", description: "Accessible label for the icon link (used as aria-label)." },
  { name: "href", type: "string", description: "Profile destination." },
  { name: "children", type: "ReactNode", description: "Icon node, typically a lucide icon at size-4." },
  { name: "className", type: "string", description: "Additional classes on the anchor." },
];

const BOTTOM_BAR_PROPS = [
  { name: "copyright", type: "string", description: "Copyright line on the left." },
  { name: "legal", type: "FooterLink[]", description: "Legal links on the right." },
  { name: "className", type: "string", description: "Additional classes on the bar wrapper." },
];

export default function FooterPage() {
  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Footer</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Site-wide footer inspired by{" "}
          <a
            href="https://mode.com/"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Mode&apos;s footer
          </a>
          , adapted to Instant Strata brand tokens. A full-bleed forest band
          with a brand column (logo, tagline, social links) beside a grid of
          link columns, closed by a bottom bar carrying copyright and legal
          links. Pass structured props for the common case, or compose the
          exported parts for bespoke layouts.
        </p>
      </div>

      {/* Preview */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Default
        </h2>
        <p className="text-sm text-ink-muted mb-6 leading-relaxed max-w-2xl">
          Brand column on the left, four link columns on the right, and a
          bottom bar with copyright and legal links.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          <Footer {...FOOTER_DEFAULT} />
        </div>
      </section>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <CodeBlock code={USAGE} language="tsx" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Composing the parts</h2>
        <CodeBlock code={COMPOSE_USAGE} language="tsx" />
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Footer props</h2>
        <PropTable props={FOOTER_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">FooterColumn props</h2>
        <PropTable props={COLUMN_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">FooterSocialLink props</h2>
        <PropTable props={SOCIAL_LINK_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">FooterBottomBar props</h2>
        <PropTable props={BOTTOM_BAR_PROPS} />
      </section>

    </DocsPage>
  );
}
