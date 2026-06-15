import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { AppLayoutDemo } from "@/components/docs/app-shell-demo";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/app-shell/registry.json`;

const LAYOUT_CODE = `import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  AppHeader,
  AppSidebarHeader,
  AppSidebarFooter,
  SidebarNav,
  type NavGroup,
} from "@/components/ui/app-shell"
import { LayoutDashboard, Building2, Receipt } from "lucide-react"

const nav: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard, isActive: true },
      {
        title: "Buildings",
        href: "/buildings",
        icon: Building2,
        items: [
          { title: "All schemes", href: "/buildings" },
          { title: "Add scheme", href: "/buildings/new" },
        ],
      },
      { title: "Levies", href: "/levies", icon: Receipt },
    ],
  },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <AppSidebarHeader
          workspace={{ name: "Instant Strata", plan: "Pro plan" }}
          workspaces={[
            { name: "Instant Strata", plan: "Pro plan" },
            { name: "Harbour Body Corp", plan: "Free plan" },
          ]}
        />
        <SidebarContent>
          <SidebarNav groups={nav} />
        </SidebarContent>
        <AppSidebarFooter
          user={{ name: "Levi Putna", email: "levi@instantstrata.com" }}
        />
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <AppHeader>
          <Breadcrumbs />
        </AppHeader>
        <div className="flex-1 overflow-auto p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}`;

const RESIZABLE_CODE = `import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

// In the docs we wrap the whole layout in a Resizable panel group so
// you can drag to see how the inset and content reflow. In a real app
// you mount <AppLayout> directly at full height.
<ResizablePanelGroup orientation="horizontal" className="h-[600px]">
  <ResizablePanel defaultSize="78%" minSize="35%">
    <AppLayout>{children}</AppLayout>
  </ResizablePanel>
  <ResizableHandle withHandle />
  <ResizablePanel defaultSize="22%" minSize="8%">
    {/* drag affordance */}
  </ResizablePanel>
</ResizablePanelGroup>`;

const PIECES = [
  ["SidebarProvider", "Holds open/collapsed state, the ⌘B shortcut, and the mobile sheet. Wrap the whole layout."],
  ["Sidebar", "The sidebar shell. collapsible=\"icon\" collapses to an icon rail; on mobile it becomes a slide-in sheet."],
  ["AppSidebarHeader", "Workspace switcher in the header slot — lime logo mark, workspace name, and a dropdown to switch workspaces."],
  ["SidebarNav", "The navigation. Renders labelled groups; items with sub-items become collapsible sub-navigation."],
  ["AppSidebarFooter", "User menu in the footer slot — avatar initials, name/email, and an account dropdown."],
  ["AppHeader", "Top bar inside the content area — holds the SidebarTrigger and a breadcrumb/title slot."],
  ["SidebarInset", "The main content region beside the sidebar."],
  ["SidebarRail", "A thin draggable rail on the sidebar edge for toggling collapse."],
];

const APP_HEADER_PROPS = [
  { name: "children", type: "ReactNode", description: "Breadcrumbs or page title, rendered to the right of the trigger." },
  { name: "actions", type: "ReactNode", description: "Optional actions pinned to the right edge of the bar." },
  { name: "className", type: "string", description: "Additional classes on the header element." },
];

export default function AppLayoutPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Application
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">App Layout</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          The full application shell — a collapsible sidebar (workspace switcher, navigation,
          user menu) beside a content area with its own header. Built on the shadcn sidebar
          (sidebar-07 pattern) with Instant Strata branding. Drag the handle below to resize
          the layout, or use the trigger in the header to collapse the sidebar to icons.
        </p>
      </div>

      {/* Live demo */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Live layout
        </h2>
        <AppLayoutDemo />
      </section>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <p className="text-sm text-ink-muted mb-3 leading-relaxed">
          Installs the branded shell pieces and pulls the shadcn{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">sidebar</code>,{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">dropdown-menu</code> and{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">separator</code> dependencies.
        </p>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* Anatomy */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Anatomy</h2>
        <div className="rounded-sm border border-border overflow-hidden">
          {PIECES.map(([name, desc], i) => (
            <div
              key={name}
              className={`flex gap-4 px-4 py-3 border-b border-border last:border-0 ${i % 2 ? "bg-secondary/30" : ""}`}
            >
              <code className="font-mono text-xs text-foreground w-44 shrink-0">{name}</code>
              <span className="text-xs text-ink-muted leading-relaxed">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Composition */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Composition</h2>
        <CodeBlock code={LAYOUT_CODE} language="tsx" />
      </section>

      {/* Resizable wrapper */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Resizable preview</h2>
        <p className="text-sm text-ink-muted mb-3 leading-relaxed">
          The demo above wraps the layout in a{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">ResizablePanelGroup</code>{" "}
          so you can drag to see how the content reflows — the same technique the shadcn blocks
          gallery uses. In production you mount the layout directly at full height.
        </p>
        <CodeBlock code={RESIZABLE_CODE} language="tsx" />
      </section>

      {/* Props */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">AppHeader Props</h2>
        <PropTable props={APP_HEADER_PROPS} />
      </section>

    </DocsPage>
  );
}
