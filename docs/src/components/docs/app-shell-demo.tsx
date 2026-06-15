"use client"

import {
  LayoutDashboard,
  Building2,
  Receipt,
  Wrench,
  Users,
  FileText,
  Settings2,
  LifeBuoy,
  Home,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  AppHeader,
  AppSidebarFooter,
  AppSidebarHeader,
  SidebarNav,
  type NavGroup,
} from "@/components/ui/app-shell"

const NAV: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { title: "Dashboard", href: "#", icon: LayoutDashboard, isActive: true },
      {
        title: "Buildings",
        href: "#",
        icon: Building2,
        items: [
          { title: "All schemes", href: "#" },
          { title: "Add scheme", href: "#" },
        ],
      },
      { title: "Levies", href: "#", icon: Receipt },
      { title: "Maintenance", href: "#", icon: Wrench },
      { title: "Owners", href: "#", icon: Users },
      { title: "Documents", href: "#", icon: FileText },
    ],
  },
  {
    label: "Workspace",
    items: [
      { title: "Settings", href: "#", icon: Settings2 },
      { title: "Support", href: "#", icon: LifeBuoy },
    ],
  },
]

function Shell({ withContent = true }: { withContent?: boolean }) {
  return (
    // A transformed ancestor makes the sidebar's `fixed` container resolve
    // against this box instead of the viewport, so the demo stays contained.
    <div className="relative h-[600px] w-full overflow-hidden [transform:translateZ(0)]">
      <TooltipProvider>
        <SidebarProvider className="!min-h-0 h-full w-full">
          <Sidebar collapsible="icon" className="!h-full">
            <AppSidebarHeader
              workspace={{ name: "Instant Strata", plan: "Pro plan" }}
              workspaces={[
                { name: "Instant Strata", plan: "Pro plan" },
                { name: "Harbour Body Corp", plan: "Free plan" },
              ]}
            />
            <SidebarContent>
              <SidebarNav groups={NAV} />
            </SidebarContent>
            <AppSidebarFooter
              user={{
                name: "Levi Putna",
                email: "levi@instantstrata.com",
                avatar: "/elements/img/person/1.jpg",
              }}
            />
            <SidebarRail />
          </Sidebar>

          {withContent && (
            <SidebarInset className="!min-h-0 h-full overflow-hidden">
              <AppHeader>
                <nav className="flex items-center gap-1.5 text-sm">
                  <a href="#" className="text-ink-muted hover:text-foreground no-underline">
                    <Home className="size-4" />
                    <span className="sr-only">Home</span>
                  </a>
                  <span className="text-ink-muted/40">/</span>
                  <span className="font-medium text-foreground">Dashboard</span>
                </nav>
              </AppHeader>
              <div className="flex-1 overflow-auto p-4">
                <div className="grid auto-rows-min gap-3 md:grid-cols-3">
                  {[
                    { t: "Active schemes", v: 48 },
                    { t: "Open levies", v: 23 },
                    { t: "Maintenance jobs", v: 16 },
                  ].map(({ t, v }) => (
                    <div
                      key={t}
                      className="rounded-lg border border-border bg-secondary/40 p-4"
                    >
                      <p className="text-xs text-ink-muted">{t}</p>
                      <p className="mt-1 font-display text-2xl text-foreground">{v}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3 rounded-lg border border-border bg-secondary/40 min-h-48" />
              </div>
            </SidebarInset>
          )}
        </SidebarProvider>
      </TooltipProvider>
    </div>
  )
}

/**
 * The full app layout wrapped in a Resizable panel group. Drag the handle
 * to resize the layout; use the trigger in the header to collapse the
 * sidebar to icons.
 */
export function AppLayoutDemo() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <ResizablePanelGroup orientation="horizontal" className="h-[600px]">
        <ResizablePanel defaultSize="78%" minSize="35%">
          <Shell withContent />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="22%" minSize="8%">
          <div className="flex h-full items-center justify-center bg-secondary/50 px-4 text-center">
            <p className="text-xs text-ink-muted">
              Drag the handle to resize the layout
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

/** The sidebar building blocks on their own, without the content inset. */
export function SidebarDemo() {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <Shell withContent={false} />
    </div>
  )
}
