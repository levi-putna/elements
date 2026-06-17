"use client"

import type * as React from "react"
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
import { Dashboard } from "@/components/preview/dashboard"

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
      <SidebarProvider
        className="h-svh"
        style={
          {
            // Forest sidebar to match the docs navigation theme.
            "--sidebar": "#043F2E",
            "--sidebar-foreground": "#EEF2E3",
            "--sidebar-primary": "#C8F169",
            "--sidebar-primary-foreground": "#043F2E",
            "--sidebar-accent": "#0A5C3D",
            "--sidebar-accent-foreground": "#FFFFFF",
            "--sidebar-border": "#032B1F",
            "--sidebar-ring": "#C8F169",
          } as React.CSSProperties
        }
      >
        {/* text-current + no-underline neutralise the docs site's global
            anchor styling so sidebar links read correctly on forest. */}
        <Sidebar collapsible="icon" className="[&_a]:text-current [&_a]:no-underline">
          {/* Original workspace-switcher header, placed on a white container.
              The light sidebar tokens are scoped here so its text reads on
              white while the rest of the sidebar stays forest. */}
          <div
            className="border-b border-border bg-white text-sidebar-foreground"
            style={
              {
                "--sidebar-foreground": "#043F2E",
                "--sidebar-accent": "#EEF2E3",
                "--sidebar-accent-foreground": "#043F2E",
              } as React.CSSProperties
            }
          >
            <AppSidebarHeader
              workspace={{ name: "Instant Strata", plan: "Pro plan" }}
              workspaces={[
                { name: "Instant Strata", plan: "Pro plan" },
                { name: "Harbour Body Corp", plan: "Free plan" },
              ]}
            />
          </div>
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
          <div className="flex-1 overflow-auto bg-white p-4 md:p-6">
            <Dashboard />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
