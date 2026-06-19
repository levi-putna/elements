"use client"

import * as React from "react"
import { Home } from "lucide-react"

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
  SidebarAgentHistory,
  SidebarExperienceToggle,
  SidebarNav,
  SidebarSearch,
  type SidebarExperience,
} from "@/components/ui/app-shell"
import { AssistantPreview } from "@/components/docs/assistant-preview"
import { SidebarOnboarding } from "@/components/ui/onboarding"
import { SidebarSchedule } from "@/components/ui/sidebar-upcoming"
import {
  APP_AGENT_SESSIONS,
  APP_SHELL_NAV,
  APP_SHELL_ONBOARDING,
  APP_SHELL_SEARCH_EXTRAS,
  APP_SHELL_SIDEBAR_THEME,
  getAppShellScheduleEvents,
} from "@/lib/app-shell-nav"

function Shell({ withContent = true }: { withContent?: boolean }) {
  const scheduleEvents = React.useMemo(() => getAppShellScheduleEvents(), [])
  const [experience, setExperience] = React.useState<SidebarExperience>("navigate")
  const [activeSessionId, setActiveSessionId] = React.useState<string | undefined>()
  const isAgentic = experience === "agentic"
  const activeSession = APP_AGENT_SESSIONS.find(({ id }) => id === activeSessionId)

  const handleExperienceChange = React.useCallback((value: SidebarExperience) => {
    setExperience(value)
    if (value === "agentic") {
      setActiveSessionId(undefined)
    }
  }, [])

  return (
    // A transformed ancestor makes the sidebar's `fixed` container resolve
    // against this box instead of the viewport, so the demo stays contained.
    <div className="relative h-[600px] w-full overflow-hidden [transform:translateZ(0)]">
      <TooltipProvider>
        <SidebarProvider
          className="!min-h-0 h-full w-full"
          style={APP_SHELL_SIDEBAR_THEME}
        >
          <Sidebar
            collapsible="icon"
            className="!h-full [&_a]:text-current [&_a]:no-underline"
          >
            <AppSidebarHeader
              workspace={{ name: "Instant Strata", plan: "Pro plan" }}
              workspaces={[
                { name: "Instant Strata", plan: "Pro plan" },
                { name: "Harbour Body Corp", plan: "Free plan" },
              ]}
            />
            <SidebarContent className="flex flex-col overflow-hidden">
              <SidebarExperienceToggle
                value={experience}
                onValueChange={handleExperienceChange}
              />
              <SidebarSearch
                groups={APP_SHELL_NAV}
                searchExtras={APP_SHELL_SEARCH_EXTRAS}
                conversations={APP_AGENT_SESSIONS}
                searchPlaceholder="Search…"
                onConversationSelect={({ session }) => {
                  setExperience("agentic")
                  setActiveSessionId(session.id)
                }}
              >
                {isAgentic ? (
                  <>
                    <SidebarAgentHistory
                      sessions={APP_AGENT_SESSIONS}
                      activeId={activeSessionId}
                      onSelect={({ id }) => setActiveSessionId(id)}
                      onNewChat={() => setActiveSessionId(undefined)}
                    />
                    <SidebarSchedule
                      events={scheduleEvents}
                      viewAllHref="#"
                      viewAllLabel="View calendar"
                    />
                  </>
                ) : (
                  <>
                    <div className="min-h-0 flex-1 overflow-hidden">
                      <SidebarNav groups={APP_SHELL_NAV} search={false} />
                    </div>
                    <SidebarSchedule
                      events={scheduleEvents}
                      viewAllHref="#"
                      viewAllLabel="View calendar"
                    />
                  </>
                )}
              </SidebarSearch>
            </SidebarContent>
            {/* Onboarding checklist: sits just above the account menu */}
            <SidebarOnboarding steps={APP_SHELL_ONBOARDING} />
            <AppSidebarFooter
              user={{
                name: "Levi Putna",
                email: "levi@instantstrata.com",
                avatar: "/elements/img/person/1.webp",
              }}
            />
            <SidebarRail />
          </Sidebar>

          {withContent && (
            <SidebarInset className="!min-h-0 h-full overflow-hidden">
              {!isAgentic ? (
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
              ) : null}
              {isAgentic ? (
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                  <AssistantPreview
                    key={activeSessionId ?? "new"}
                    className="min-h-0 flex-1"
                    showDocsLink={false}
                    showSidebarTrigger
                    sessionTitle={activeSession?.title}
                    onNewChat={() => setActiveSessionId(undefined)}
                  />
                </div>
              ) : (
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
              )}
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
