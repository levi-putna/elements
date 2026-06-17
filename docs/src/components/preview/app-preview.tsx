"use client"

import type * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  MessageSquare,
  AlertCircle,
  Calendar,
  ClipboardList,
  Building2,
  Users,
  Settings,
  Home,
  SlidersHorizontal,
  CreditCard,
  Bell,
  ShieldCheck,
  Plug,
  UserCog,
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
  type NavPanel,
} from "@/components/ui/app-shell"
import {
  SidebarOnboarding,
  type OnboardingStep,
} from "@/components/ui/onboarding"
import { assetPath } from "@/lib/utils"
import { Dashboard } from "@/components/preview/dashboard"

// Second-tier navigation that "Settings" drills into. Only Settings uses
// the stacked pattern for now — every other item is a flat link.
const SETTINGS_PANEL: NavPanel = {
  title: "Settings",
  groups: [
    {
      label: "Workspace",
      items: [
        { title: "General", href: "#", icon: SlidersHorizontal, isActive: true },
        { title: "Members", href: "#", icon: Users },
        { title: "Billing", href: "#", icon: CreditCard },
        { title: "Integrations", href: "#", icon: Plug },
      ],
    },
    {
      label: "Account",
      items: [
        { title: "Profile", href: "#", icon: UserCog },
        { title: "Notifications", href: "#", icon: Bell },
        { title: "Security", href: "#", icon: ShieldCheck },
      ],
    },
  ],
}

const NAV: NavGroup[] = [
  {
    items: [
      { title: "Dashboard", href: "#", icon: LayoutDashboard, isActive: true },
      { title: "Inbox", href: "#", icon: MessageSquare },
      { title: "Issues", href: "#", icon: AlertCircle },
      { title: "Meetings", href: "#", icon: Calendar },
      { title: "Tasks", href: "#", icon: ClipboardList },
      { title: "Schemes", href: "#", icon: Building2 },
      { title: "Contacts", href: "#", icon: Users },
      { title: "Settings", href: "#", icon: Settings, panel: SETTINGS_PANEL },
    ],
  },
]

// Setup checklist surfaced in the sidebar footer until onboarding is done.
const ONBOARDING: OnboardingStep[] = [
  { title: "Create your workspace", href: "#", status: "complete" },
  { title: "Add your first scheme", href: "#", status: "complete" },
  { title: "Invite a committee member", href: "#", status: "current" },
  { title: "Connect your bank feed", href: "#", status: "todo" },
  { title: "Import owner contacts", href: "#", status: "todo" },
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
          {/* Onboarding checklist: sits just above the account menu */}
          <SidebarOnboarding steps={ONBOARDING} />
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
