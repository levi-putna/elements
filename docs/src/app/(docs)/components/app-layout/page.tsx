import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { AppLayoutDemo } from "@/components/docs/app-shell-demo";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/app-shell/registry.json
npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/sidebar-upcoming/registry.json`;

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
  type NavPanel,
} from "@/components/ui/app-shell"
import { SidebarOnboarding } from "@/components/ui/onboarding"
import { SidebarUpcoming } from "@/components/ui/sidebar-upcoming"
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  SlidersHorizontal,
  Users,
} from "lucide-react"

const settingsPanel: NavPanel = {
  title: "Settings",
  groups: [
    {
      label: "Workspace",
      items: [
        { title: "General", href: "/settings", icon: SlidersHorizontal, isActive: true },
        { title: "Members", href: "/settings/members", icon: Users },
      ],
    },
  ],
}

const nav: NavGroup[] = [
  {
    items: [
      { title: "Dashboard", href: "/", icon: LayoutDashboard, isActive: true },
      { title: "Inbox", href: "/inbox", icon: MessageSquare },
      {
        title: "Settings",
        href: "/settings",
        icon: Settings,
        panel: settingsPanel,
      },
    ],
  },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={{
        "--sidebar": "#043F2E",
        "--sidebar-foreground": "#EEF2E3",
        "--sidebar-primary": "#C8F169",
        "--sidebar-primary-foreground": "#043F2E",
        "--sidebar-accent": "#0A5C3D",
        "--sidebar-accent-foreground": "#FFFFFF",
        "--sidebar-border": "#032B1F",
        "--sidebar-ring": "#C8F169",
      } as React.CSSProperties}
    >
      <Sidebar collapsible="icon">
        <AppSidebarHeader
          workspace={{ name: "Instant Strata", plan: "Pro plan" }}
          workspaces={[
            { name: "Instant Strata", plan: "Pro plan" },
            { name: "Harbour Body Corp", plan: "Free plan" },
          ]}
        />
        <SidebarContent className="flex flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-hidden">
            <SidebarNav groups={nav} searchPlaceholder="Search…" />
          </div>
          <SidebarUpcoming
            events={upcomingEvents}
            viewAllHref="/calendar"
            viewAllLabel="View calendar"
          />
        </SidebarContent>
        <SidebarOnboarding steps={onboardingSteps} />
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

const SEARCH_CODE = `// SidebarNav includes a search overlay by default.
// Click the search field at the top of the nav, or press ⌘K.
// Results filter across root links, drill-in panel items, and
// optional entity rows passed via searchExtras.

<SidebarContent className="overflow-hidden">
  <SidebarNav
    groups={nav}
    searchExtras={[
      {
        title: "Harbour View Towers",
        subtitle: "SP 48291 · 42 lots",
        href: "/schemes/harbour-view",
        kind: "scheme",
      },
      {
        title: "Lot 14",
        subtitle: "Harbour View Towers · Levy due",
        href: "/lots/14",
        kind: "lot",
      },
    ]}
    searchPlaceholder="Search schemes, lots, owners…"
  />
</SidebarContent>

// Disable search on a minimal shell:
<SidebarNav groups={nav} search={false} />`;

const UPCOMING_CODE = `import { SidebarUpcoming } from "@/components/ui/sidebar-upcoming"

// Below SidebarNav, inside SidebarContent. Shows today + next 5 days,
// max 5 rows, then a view-all link. Hidden when the sidebar is icon-only.
<SidebarContent className="flex flex-col overflow-hidden">
  <div className="min-h-0 flex-1 overflow-hidden">
    <SidebarNav groups={nav} />
  </div>
  <SidebarUpcoming
    events={[
      {
        id: "agm",
        title: "AGM · Harbour View Towers",
        href: "/meetings/agm",
        date: "2026-06-17",
        time: "6:00 pm",
        scheme: "Committee",
        kind: "agm",
      },
    ]}
    viewAllHref="/calendar"
    viewAllLabel="View calendar"
  />
</SidebarContent>`;

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
  ["SidebarProvider", "Holds open/collapsed state, the ⌘B shortcut, and the mobile sheet. Wrap the whole layout. Set forest sidebar tokens here when using Instant Strata branding."],
  ["Sidebar", "The sidebar shell. collapsible=\"icon\" collapses to an icon rail; on mobile it becomes a slide-in sheet."],
  ["AppSidebarHeader", "Workspace switcher in the header slot: lime logo mark, workspace name, and a dropdown to switch workspaces."],
  ["SidebarNav", "The navigation with optional search overlay, inline collapsible sub-items, and drill-in stacked panels (e.g. Settings)."],
  ["SidebarUpcoming", "Optional strip below the nav: upcoming events from today through the next few days. Collapsed by default with a count; expand for up to five rows and a view-all link. Hidden when collapsed to icons."],
  ["SidebarOnboarding", "Optional setup checklist in the footer slot, above the user menu. Collapses to a progress row when the sidebar is icon-only."],
  ["AppSidebarFooter", "User menu in the footer slot: avatar initials, name/email, and an account dropdown."],
  ["AppHeader", "Top bar inside the content area: holds the SidebarTrigger and a breadcrumb/title slot."],
  ["SidebarInset", "The main content region beside the sidebar."],
  ["SidebarRail", "A thin draggable rail on the sidebar edge for toggling collapse."],
];

const SIDEBAR_NAV_PROPS = [
  { name: "groups", type: "NavGroup[]", description: "Labelled groups of nav items. NavItem = { title, href, icon?, isActive?, items?, panel? }." },
  { name: "search", type: "boolean", default: "true", description: "Show the sidebar search overlay on the root nav. Opens via the search field or ⌘K." },
  { name: "searchPlaceholder", type: "string", description: "Placeholder copy for the search input." },
  { name: "searchExtras", type: "NavSearchResult[]", description: "Extra searchable rows for schemes, lots, owners, documents, and other entities not shown in the main nav." },
  { name: "className", type: "string", description: "Additional classes applied to each SidebarGroup." },
];

const UPCOMING_PROPS = [
  { name: "events", type: "UpcomingEvent[]", description: "Events to consider. Each row: { id, title, href, date (YYYY-MM-DD), time?, scheme?, kind? }." },
  { name: "maxItems", type: "number", default: "5", description: "Maximum rows shown after filtering and sorting." },
  { name: "horizonDays", type: "number", default: "5", description: "Include events from today through this many calendar days (inclusive)." },
  { name: "title", type: "string", default: '"Upcoming"', description: "Section heading." },
  { name: "viewAllHref", type: "string", description: "Optional href for the view-all link at the bottom." },
  { name: "viewAllLabel", type: "string", default: '"View all"', description: "Label for the view-all link." },
  { name: "defaultOpen", type: "boolean", default: "false", description: "Whether the event list starts expanded. When collapsed, only the section heading and upcoming count are shown." },
  { name: "className", type: "string", description: "Additional classes on the section wrapper." },
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
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">App Layout</h1>
          <Link
            href="/preview/app"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors duration-150 no-underline shrink-0"
          >
            Open full-screen preview
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <p className="text-base text-ink-muted leading-relaxed">
          The full application shell: a collapsible forest-green sidebar (workspace switcher,
          searchable navigation with Settings drill-in, an upcoming events strip,
          onboarding checklist, user menu) beside
          a content area with its own header. Built on the shadcn sidebar (sidebar-07 pattern)
          with Instant Strata branding. Drag the handle below to resize the layout, or use the
          trigger in the header to collapse the sidebar to icons.
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
          Pair with the <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">SidebarOnboarding</code> and{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">SidebarUpcoming</code> elements for the setup checklist and upcoming events strip.
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

      {/* Search */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Sidebar search</h2>
        <p className="text-sm text-ink-muted mb-3 leading-relaxed">
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">SidebarNav</code>{" "}
          includes a search overlay at the top of the root navigation. Click the search field or
          press <kbd className="rounded border border-border bg-secondary px-1 py-0.5 font-mono text-[10px]">⌘K</kbd>{" "}
          to open it.           Results filter client-side across root links, inline sub-items, drill-in
          panel pages (e.g. Settings → Billing), and optional entity rows passed
          via <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">searchExtras</code>. The overlay sits above stacked nav panels without
          disturbing the back animation. Set{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">overflow-hidden</code>{" "}
          on <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">SidebarContent</code>{" "}
          so the overlay clips correctly.
        </p>
        <CodeBlock code={SEARCH_CODE} language="tsx" />
      </section>

      {/* Upcoming */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Upcoming events</h2>
        <p className="text-sm text-ink-muted mb-3 leading-relaxed">
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">SidebarUpcoming</code>{" "}
          sits below the main nav inside{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">SidebarContent</code>.
          It filters to today and the next five days, shows at most five rows when
          expanded, and ends with a view-all link. Collapsed by default, the section
          shows the total upcoming count; click to expand the list. Typography is
          deliberately lighter than primary nav items so agents can scan what is
          ahead without competing with wayfinding.
        </p>
        <CodeBlock code={UPCOMING_CODE} language="tsx" />
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
          so you can drag to see how the content reflows; the same technique the shadcn blocks
          gallery uses. In production you mount the layout directly at full height.
        </p>
        <CodeBlock code={RESIZABLE_CODE} language="tsx" />
      </section>

      {/* Props */}
      <section className="pt-10 border-t border-border space-y-10">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">SidebarNav Props</h2>
          <PropTable props={SIDEBAR_NAV_PROPS} />
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">SidebarUpcoming Props</h2>
          <PropTable props={UPCOMING_PROPS} />
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">AppHeader Props</h2>
          <PropTable props={APP_HEADER_PROPS} />
        </div>
      </section>

    </DocsPage>
  );
}
