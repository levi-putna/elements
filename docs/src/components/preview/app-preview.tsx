"use client"

import Link from "next/link"
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
  AppHeader,
  AppSidebarFooter,
  AppSidebarHeader,
  SidebarNav,
  type NavGroup,
} from "@/components/ui/app-shell"
import { assetPath } from "@/lib/utils"

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

/**
 * The full application shell rendered at viewport height — the same pieces
 * documented on /components/app-layout, mounted as a real app would mount
 * them rather than inside the resizable docs demo.
 */
export function AppPreview() {
  return (
    <TooltipProvider>
      <SidebarProvider className="h-svh">
        <Sidebar collapsible="icon">
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
              avatar: assetPath("/img/person/1.webp"),
            }}
          />
          <SidebarRail />
        </Sidebar>

        <SidebarInset>
          <AppHeader
            actions={
              <Link
                href="/components/app-layout"
                className="text-xs text-ink-muted hover:text-foreground no-underline"
              >
                ← Back to docs
              </Link>
            }
          >
            <nav className="flex items-center gap-1.5 text-sm">
              <a
                href="#"
                className="text-ink-muted hover:text-foreground no-underline"
              >
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
      </SidebarProvider>
    </TooltipProvider>
  )
}
