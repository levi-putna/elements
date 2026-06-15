"use client";

import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { SiteHeader, type SiteNavItem } from "@/components/ui/site-header";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/site-header/registry.json`;

const USAGE_CODE = `import { SiteHeader } from "@/components/ui/site-header"

const items = [
  {
    title: "Product",
    links: [
      { title: "Owners portal", href: "/product/owners", description: "Self-service for every lot owner." },
      { title: "Committee tools", href: "/product/committee", description: "Run meetings, votes, and budgets." },
      { title: "Maintenance", href: "/product/maintenance", description: "Track jobs from request to invoice." },
      { title: "Reporting", href: "/product/reporting", description: "Financials your auditor will love." },
    ],
  },
  { title: "Pricing", href: "/pricing" },
  { title: "Customers", href: "/customers" },
]

{/* Logged out — shows the "Get Started" CTA */}
<SiteHeader items={items} />

{/* Logged in — shows the account menu */}
<SiteHeader
  items={items}
  user={{ name: "Levi Putna", email: "levi@instantstrata.com" }}
  appHref="/app"
  onSignOut={() => signOut()}
/>`;

const NAV_ITEMS: SiteNavItem[] = [
  {
    title: "Product",
    links: [
      { title: "Owners portal", href: "#owners", description: "Self-service for every lot owner." },
      { title: "Committee tools", href: "#committee", description: "Run meetings, votes, and budgets." },
      { title: "Maintenance", href: "#maintenance", description: "Track jobs from request to invoice." },
      { title: "Reporting", href: "#reporting", description: "Financials your auditor will love." },
    ],
  },
  { title: "Pricing", href: "#pricing" },
  { title: "Customers", href: "#customers" },
];

const HEADER_PROPS = [
  { name: "items", type: "SiteNavItem[]", default: "[]", description: "Top-level navigation entries. Provide href for a plain link, or links for a dropdown panel." },
  { name: "user", type: "SiteUser | null", description: "The signed-in user. When null/omitted, the logged-out CTA is shown instead of the account menu." },
  { name: "getStartedHref", type: "string", default: '"/signup"', description: "Destination for the primary Get Started CTA (logged out)." },
  { name: "signInHref", type: "string", default: '"/login"', description: "Destination for the secondary Sign in link (logged out)." },
  { name: "appHref", type: "string", default: '"/app"', description: "Destination for Open app in the account menu (logged in)." },
  { name: "onSignOut", type: "() => void", description: "Called when the user chooses Log out." },
  { name: "logo", type: "ReactNode", description: "Replace the default Instant Strata logo + home link." },
  { name: "logoHref", type: "string", default: '"/"', description: "Href the logo links to. Ignored when a custom logo is supplied." },
  { name: "sticky", type: "boolean", default: "true", description: "Stick the header to the top of the viewport." },
];

const NAVITEM_PROPS = [
  { name: "title", type: "string", description: "The label shown in the nav bar." },
  { name: "href", type: "string", description: "Destination for a plain link item. Omit when using links." },
  { name: "links", type: "SiteNavLink[]", description: "Sub-items rendered as a dropdown panel. Each has title, href, and optional description." },
];

const USER_PROPS = [
  { name: "name", type: "string", description: "Used for the menu label, the avatar alt text, and initials fallback." },
  { name: "email", type: "string", description: "Secondary line shown in the account menu header." },
  { name: "avatar", type: "string", description: "Avatar image URL. Falls back to initials derived from name." },
];

export default function SiteHeaderPage() {
  return (
    <DocsPage width="wide">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Website
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Site Header</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          The marketing website header. A logo on the left, centred dropdown navigation
          (built on the shadcn{" "}
          <a href="https://ui.shadcn.com/docs/components/radix/navigation-menu" target="_blank" rel="noopener noreferrer">navigation-menu</a>{" "}
          and Mode.com layout), and an auth-aware right rail: a <strong>Get Started</strong> CTA
          when logged out, or an account menu (avatar, name, open app, log out) when signed in.
          Collapses to a mobile menu below <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">md</code>.
        </p>
      </div>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* Logged out */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Logged out</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Without a <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">user</code>, the
          right rail shows a <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">Sign in</code> link
          and the lime <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">Get Started</code> CTA.
          Hover a nav item with sub-links to open its panel.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          <SiteHeader items={NAV_ITEMS} sticky={false} getStartedHref="#" signInHref="#" />
          <div className="bg-off-white px-6 py-16 text-center text-sm text-ink-muted">
            Page content
          </div>
        </div>
      </section>

      {/* Logged in */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Logged in</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Pass a <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">user</code> to swap the CTA
          for the account menu — avatar, name, and a dropdown to open the app or log out.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          <SiteHeader
            items={NAV_ITEMS}
            sticky={false}
            appHref="#"
            user={{ name: "Levi Putna", email: "levi@instantstrata.com", avatar: "/elements/img/person/1.jpg" }}
          />
          <div className="bg-off-white px-6 py-16 text-center text-sm text-ink-muted">
            Page content
          </div>
        </div>
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <CodeBlock code={USAGE_CODE} language="tsx" />
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">SiteHeader Props</h2>
        <PropTable props={HEADER_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">SiteNavItem</h2>
        <PropTable props={NAVITEM_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">SiteUser</h2>
        <PropTable props={USER_PROPS} />
      </section>
    </DocsPage>
  );
}
