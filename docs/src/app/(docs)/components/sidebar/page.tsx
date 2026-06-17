import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { SidebarDemo } from "@/components/docs/app-shell-demo";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/app-shell/registry.json`;

const NAV_CODE = `import { SidebarNav, type NavGroup } from "@/components/ui/app-shell"
import {
  LayoutDashboard,
  MessageSquare,
  AlertCircle,
  Calendar,
  ClipboardList,
  Building2,
  Users,
  Settings,
} from "lucide-react"

const groups: NavGroup[] = [
  {
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard, isActive: true },
      { title: "Inbox", href: "/inbox", icon: MessageSquare },
      { title: "Issues", href: "/issues", icon: AlertCircle },
      { title: "Meetings", href: "/meetings", icon: Calendar },
      { title: "Tasks", href: "/tasks", icon: ClipboardList },
      { title: "Schemes", href: "/schemes", icon: Building2 },
      { title: "Contacts", href: "/contacts", icon: Users },
      { title: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

<SidebarContent>
  <SidebarNav groups={groups} />
</SidebarContent>`;

const HEADER_CODE = `import { AppSidebarHeader } from "@/components/ui/app-shell"

// Sits in the SidebarHeader slot: the primary LogoMark + workspace
// name, with a dropdown to switch workspaces.
<AppSidebarHeader
  workspace={{ name: "Instant Strata", plan: "Pro plan" }}
  workspaces={[
    { name: "Instant Strata", plan: "Pro plan" },
    { name: "Harbour Body Corp", plan: "Free plan" },
  ]}
  onSelect={(w) => switchWorkspace(w)}
/>`;

const FOOTER_CODE = `import { AppSidebarFooter } from "@/components/ui/app-shell"

// Sits in the SidebarFooter slot: avatar initials + name/email,
// opening an account dropdown (upgrade, settings, support, sign out).
<AppSidebarFooter
  user={{ name: "Levi Putna", email: "levi@instantstrata.com" }}
  supportHref="/support"
  onSignOut={() => signOut()}
/>`;

const NAV_PROPS = [
  { name: "groups", type: "NavGroup[]", description: "Labelled groups of nav items. NavItem = { title, href, icon?, isActive?, items? }. An items array makes the entry collapsible sub-navigation." },
  { name: "className", type: "string", description: "Additional classes applied to each SidebarGroup." },
];

const HEADER_PROPS = [
  { name: "workspace", type: "{ name, plan? }", description: "The active workspace shown in the header." },
  { name: "workspaces", type: "Workspace[]", description: "Optional list of workspaces shown in the switcher dropdown." },
  { name: "onSelect", type: "(workspace) => void", description: "Called when a workspace is chosen from the dropdown." },
];

const FOOTER_PROPS = [
  { name: "user", type: "{ name, email, avatar? }", description: "The signed-in user. Falls back to initials when no avatar URL is given." },
  { name: "supportHref", type: "string", default: '"#"', description: "Href for the Support item in the account dropdown." },
  { name: "onSignOut", type: "() => void", description: "Called when the user selects Sign out." },
];

export default function SidebarPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Application
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Sidebar</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          The Instant Strata application sidebar, built on the shadcn sidebar primitives
          and composed from three branded pieces: a workspace switcher header, the navigation,
          and a user-menu footer. Collapses to an icon rail and becomes a slide-in sheet on
          mobile. See <a href="/components/app-layout">App Layout</a> for the full shell.
        </p>
      </div>

      {/* Live demo */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Preview</h2>
        <SidebarDemo />
      </section>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* SidebarNav */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Navigation: SidebarNav</h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">
          Renders labelled groups of menu items. Each item takes an icon and href; supply an{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">items</code> array
          to turn it into collapsible sub-navigation.
        </p>
        <CodeBlock code={NAV_CODE} language="tsx" />
        <div className="mt-5">
          <PropTable props={NAV_PROPS} />
        </div>
      </section>

      {/* Header */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Header: AppSidebarHeader</h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">
          The workspace switcher. Drop it in the <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">SidebarHeader</code> slot.
        </p>
        <CodeBlock code={HEADER_CODE} language="tsx" />
        <div className="mt-5">
          <PropTable props={HEADER_PROPS} />
        </div>
      </section>

      {/* Footer */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Footer: AppSidebarFooter</h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">
          The user menu. Drop it in the <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">SidebarFooter</code> slot.
        </p>
        <CodeBlock code={FOOTER_CODE} language="tsx" />
        <div className="mt-5">
          <PropTable props={FOOTER_PROPS} />
        </div>
      </section>

    </DocsPage>
  );
}
