"use client"

import * as React from "react"
import Link from "next/link"
import { Home, Sparkles } from "lucide-react"

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
  SidebarAgentHistory,
  SidebarExperienceToggle,
  SidebarNav,
  type SidebarExperience,
} from "@/components/ui/app-shell"
import { SidebarOnboarding } from "@/components/ui/onboarding"
import { SidebarSchedule } from "@/components/ui/sidebar-upcoming"
import { AssistantPreview } from "@/components/docs/assistant-preview"
import { assetPath } from "@/lib/utils"
import {
  APP_AGENT_SESSIONS,
  APP_SHELL_NAV,
  APP_SHELL_ONBOARDING,
  APP_SHELL_SEARCH_EXTRAS,
  APP_SHELL_SIDEBAR_THEME,
  getAppShellScheduleEvents,
} from "@/lib/app-shell-nav"
import { Dashboard } from "@/components/preview/dashboard"

/**
 * The full application shell rendered at viewport height — the same pieces
 * documented on /components/app-layout, mounted as a real app would mount
 * them rather than inside the resizable docs demo.
 */
export function AppPreview() {
  const scheduleEvents = React.useMemo(() => getAppShellScheduleEvents(), [])
  const [experience, setExperience] = React.useState<SidebarExperience>("navigate")
  const [activeSessionId, setActiveSessionId] = React.useState<string | undefined>(
    APP_AGENT_SESSIONS[0]?.id
  )
  const [assistantKey, setAssistantKey] = React.useState(0)

  const handleExperienceChange = React.useCallback((value: SidebarExperience) => {
    setExperience(value)
  }, [])

  const handleNewChat = React.useCallback(() => {
    setActiveSessionId(undefined)
    setAssistantKey((key) => key + 1)
  }, [])

  const isAgentic = experience === "agentic"

  return (
    <TooltipProvider>
      <SidebarProvider
        className="h-svh"
        style={APP_SHELL_SIDEBAR_THEME}
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
          <SidebarContent className="flex flex-col overflow-hidden">
            {/* Experience toggle: traditional nav or agentic assistant */}
            <SidebarExperienceToggle
              value={experience}
              onValueChange={handleExperienceChange}
            />

            {isAgentic ? (
              <SidebarAgentHistory
                sessions={APP_AGENT_SESSIONS}
                activeId={activeSessionId}
                onSelect={({ id }) => setActiveSessionId(id)}
                onNewChat={handleNewChat}
              />
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-hidden">
                  <SidebarNav
                    groups={APP_SHELL_NAV}
                    searchExtras={APP_SHELL_SEARCH_EXTRAS}
                    searchPlaceholder="Search…"
                  />
                </div>
                <SidebarSchedule
                  events={scheduleEvents}
                  viewAllHref="#"
                  viewAllLabel="View calendar"
                />
              </>
            )}
          </SidebarContent>
          {/* Onboarding checklist: sits just above the account menu */}
          {!isAgentic ? <SidebarOnboarding steps={APP_SHELL_ONBOARDING} /> : null}
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
              {isAgentic ? (
                <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                  <Sparkles className="size-3.5 text-forest/70" aria-hidden />
                  Assistant
                </span>
              ) : (
                <span className="font-medium text-foreground">Dashboard</span>
              )}
            </nav>
          </AppHeader>

          {/* Main content: dashboard or full assistant view */}
          {isAgentic ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
              <AssistantPreview
                key={assistantKey}
                className="min-h-0 flex-1"
                showDocsLink={false}
              />
            </div>
          ) : (
            <div className="flex-1 overflow-auto bg-white p-4 md:p-6">
              <Dashboard />
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  )
}
