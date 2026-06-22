"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown, ChevronLeft, ChevronRight, Home, Search } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
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
import { SidebarOnboarding } from "@/components/ui/onboarding"
import { SidebarSchedule } from "@/components/ui/sidebar-upcoming"
import { AssistantPreview } from "@/components/docs/assistant-preview"
import { AgentLaunchProvider } from "@/components/preview/agent-launch-context"
import { SchemeIcon } from "@/components/ui/scheme"
import { assetPath, cn } from "@/lib/utils"
import { consumeCoworkPrompt } from "@/lib/cowork-launch"
import {
  APP_AGENT_SESSIONS,
  APP_SHELL_ONBOARDING,
  APP_SHELL_SEARCH_EXTRAS,
  APP_SHELL_SIDEBAR_THEME,
  getAppShellNav,
  getAppShellScheduleEvents,
} from "@/lib/app-shell-nav"
import { Dashboard } from "@/components/preview/dashboard"
import { PORTFOLIO_PROPERTIES } from "@/components/preview/properties-index"
import { PropertiesIndex } from "@/components/preview/properties-index"
import {
  PropertyDetail,
  PropertySidebarHeader,
  SUB_NAV_ITEMS,
  type PropertyTab,
} from "@/components/preview/property-detail"
import { OwnerDetail } from "@/components/preview/owner-detail"
import { getPreviewOwner } from "@/lib/preview-owners"

// ─────────────────────────────────────────────────────────
// CSS classes shared by both filmstrip layers — identical to
// the SidebarNav panel system so the motion matches exactly.
// ─────────────────────────────────────────────────────────

const FILMSTRIP_LAYER =
  "[grid-area:1/1] flex flex-col min-w-0 transition-transform duration-300 " +
  "ease-out motion-reduce:transition-none data-[active=false]:pointer-events-none"

/** Simple page model for the preview shell. */
type PreviewPage =
  | { kind: "dashboard" }
  | { kind: "properties" }
  | { kind: "property"; id: string }
  | { kind: "owner"; propertyId: string; ownerId: string }

// ─────────────────────────────────────────────────────────
// PropertyJumper
//
// Dropdown triggered from the property name in the breadcrumb.
// Two sections: switch property (full portfolio list) and
// jump to section (all 11 sub-pages for the current property).
// Keyboard: ESC closes, typing filters both lists.
// ─────────────────────────────────────────────────────────

interface PropertyJumperProps {
  propertyId: string
  activeTab: PropertyTab
  onSelectProperty: (id: string) => void
  onSelectTab: (tab: PropertyTab) => void
  onClose: () => void
}

function PropertyJumper({
  propertyId,
  activeTab,
  onSelectProperty,
  onSelectTab,
  onClose,
}: PropertyJumperProps) {
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    inputRef.current?.focus()
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [onClose])

  const q = query.toLowerCase()
  const filteredProperties = q
    ? PORTFOLIO_PROPERTIES.filter(
        (p) => p.name.toLowerCase().includes(q) || (p.plan ?? "").toLowerCase().includes(q)
      )
    : PORTFOLIO_PROPERTIES
  const filteredTabs = q
    ? SUB_NAV_ITEMS.filter((s) => s.label.toLowerCase().includes(q))
    : SUB_NAV_ITEMS

  const currentProperty = PORTFOLIO_PROPERTIES.find((p) => p.id === propertyId)

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />

      {/* Panel */}
      <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-[440px] overflow-hidden rounded-sm border border-border bg-white shadow-xl">
        {/* Search */}
        <div className="flex items-center gap-2.5 border-b border-border px-3 py-2.5">
          <Search className="size-4 shrink-0 text-ink-muted" aria-hidden />
          <input
            ref={inputRef}
            type="text"
            placeholder="Jump to a property or section..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-ink-muted outline-none"
          />
          <kbd className="rounded-xs border border-border px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
            ESC
          </kbd>
        </div>

        {/* Scrollable list */}
        <div className="max-h-[400px] overflow-y-auto py-1">
          {/* Switch property */}
          {filteredProperties.length > 0 && (
            <>
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                Switch Property
              </p>
              {filteredProperties.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { onSelectProperty(p.id); onClose() }}
                  className={cn(
                    "flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-off-white",
                    p.id === propertyId && "bg-lime/20"
                  )}
                >
                  <SchemeIcon name={p.name} imageUrl={p.imageUrl} size="sm" />
                  <span className="flex-1 text-sm font-medium text-foreground">{p.name}</span>
                  <span className="font-mono text-xs text-ink-muted">{p.plan}</span>
                </button>
              ))}
            </>
          )}

          {/* Go to section */}
          {filteredTabs.length > 0 && (
            <div className={filteredProperties.length > 0 ? "mt-1 border-t border-border pt-1" : ""}>
              <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                Go to section{currentProperty ? ` · ${currentProperty.name.toUpperCase()}` : ""}
              </p>
              {filteredTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => { onSelectTab(tab.id); onClose() }}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-off-white",
                      tab.id === activeTab && "bg-lime/20"
                    )}
                  >
                    <Icon className="size-4 shrink-0 text-ink-muted" aria-hidden />
                    <span className="text-sm text-foreground">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────
// PropertySidebarNav
//
// Renders inside the sidebar when a property is open.
// Uses the same SidebarGroup/Menu/Button primitives as the
// global nav so active-state highlights and collapsed-icon
// tooltips are automatically consistent.
//
// Structure:
//   ← Portfolio (back button)
//   ─────────────────────────
//   [icon] Property name · plan
//   ─────────────────────────
//   11 section items with alert badges
// ─────────────────────────────────────────────────────────

interface PropertySidebarNavProps {
  propertyId: string
  activeTab: PropertyTab
  onTabChange: (tab: PropertyTab) => void
  onBack: () => void
}

function PropertySidebarNav({
  propertyId,
  activeTab,
  onTabChange,
  onBack,
}: PropertySidebarNavProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
      {/* Back to portfolio */}
      <SidebarGroup className="py-2 shrink-0">
        <SidebarMenu className="gap-1">
          <SidebarMenuItem>
            <SidebarMenuButton type="button" onClick={onBack} tooltip="Back to Portfolio">
              <ChevronLeft />
              <span>Portfolio</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarSeparator className="shrink-0" />

      {/* Rich property header: map thumbnail + identity + stats */}
      <PropertySidebarHeader propertyId={propertyId} />

      <SidebarSeparator className="shrink-0 group-data-[collapsible=icon]:hidden" />

      {/* Section navigation */}
      <SidebarGroup className="min-h-0 flex-1 py-2">
        <SidebarMenu className="gap-1">
          {SUB_NAV_ITEMS.map((item) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  type="button"
                  isActive={item.id === activeTab}
                  tooltip={item.label}
                  onClick={() => onTabChange(item.id)}
                >
                  <Icon />
                  <span>{item.label}</span>
                  {item.badge ? (
                    <span
                      className={cn(
                        "ml-auto flex min-w-[16px] items-center justify-center rounded-xs px-1 text-[10px] font-semibold",
                        item.badgeTone === "danger"
                          ? "bg-danger/15 text-danger"
                          : "bg-warning/15 text-warning"
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroup>
    </div>
  )
}

/**
 * The full application shell rendered at viewport height — the same pieces
 * documented on /components/app-layout, mounted as a real app would mount
 * them rather than inside the resizable docs demo.
 */
export function AppPreview() {
  const scheduleEvents = React.useMemo(() => getAppShellScheduleEvents(), [])
  const [experience, setExperience] = React.useState<SidebarExperience>("navigate")
  const [activeSessionId, setActiveSessionId] = React.useState<string | undefined>()
  const [previewPage, setPreviewPage] = React.useState<PreviewPage>({ kind: "dashboard" })
  const [previewActiveTab, setPreviewActiveTab] = React.useState<PropertyTab>("overview")
  const [jumperOpen, setJumperOpen] = React.useState(false)
  const jumperAnchorRef = React.useRef<HTMLDivElement>(null)
  const [pendingCoworkPrompt, setPendingCoworkPrompt] = React.useState<string | null>(null)
  const [assistantInstanceKey, setAssistantInstanceKey] = React.useState(0)

  const launchCowork = React.useCallback(({ prompt }: { prompt: string }) => {
    setExperience("agentic")
    setActiveSessionId(undefined)
    setPendingCoworkPrompt(prompt)
    setAssistantInstanceKey((key) => key + 1)
  }, [])

  /** Pick up prompts queued from docs pages before the app preview mounted. */
  React.useEffect(() => {
    const queuedPrompt = consumeCoworkPrompt()

    if (queuedPrompt) {
      launchCowork({ prompt: queuedPrompt })
    }
  }, [launchCowork])

  // Filmstrip: tracks whether the property layer is slid into view.
  // Uses the two-rAF trick for forward transitions so the panel is
  // painted off-screen before we flip translate — same as SidebarNav panels.
  const [propertyNavActive, setPropertyNavActive] = React.useState(false)
  React.useEffect(() => {
    if (previewPage.kind === "property" || previewPage.kind === "owner") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPropertyNavActive(true))
      })
    } else {
      setPropertyNavActive(false)
    }
  }, [previewPage.kind])

  const handleExperienceChange = React.useCallback((value: SidebarExperience) => {
    setExperience(value)
    if (value === "agentic") {
      setActiveSessionId(undefined)
    }
  }, [])

  const handleConversationSelect = React.useCallback(
    ({ session }: { session: { id: string } }) => {
      setExperience("agentic")
      setPendingCoworkPrompt(null)
      setActiveSessionId(session.id)
    },
    []
  )

  const handleNavItem = React.useCallback((title: string) => {
    if (title === "Property") setPreviewPage({ kind: "properties" })
    else if (title === "Dashboard") setPreviewPage({ kind: "dashboard" })
  }, [])

  const handleSwitchProperty = React.useCallback((id: string) => {
    setPreviewPage({ kind: "property", id })
    setPreviewActiveTab("overview")
  }, [])

  const handleOwnerSelect = React.useCallback(
    ({ propertyId, ownerId }: { propertyId: string; ownerId: string }) => {
      setPreviewPage({ kind: "owner", propertyId, ownerId })
    },
    []
  )

  const handleOwnerBack = React.useCallback(() => {
    if (previewPage.kind !== "owner") return
    setPreviewPage({ kind: "property", id: previewPage.propertyId })
    setPreviewActiveTab("owners")
  }, [previewPage])

  const handleSelectTab = React.useCallback((tab: PropertyTab) => {
    setPreviewActiveTab(tab)
    // The tab change is handled inside PropertyDetail via onTabChange;
    // this keeps the breadcrumb in sync without needing to lift full state.
  }, [])

  const activeTabLabel = React.useMemo(
    () => SUB_NAV_ITEMS.find((s) => s.id === previewActiveTab)?.label ?? "",
    [previewActiveTab]
  )

  const currentPropertyName = React.useMemo(() => {
    if (previewPage.kind === "property") {
      return PORTFOLIO_PROPERTIES.find((p) => p.id === previewPage.id)?.name ?? ""
    }
    if (previewPage.kind === "owner") {
      return PORTFOLIO_PROPERTIES.find((p) => p.id === previewPage.propertyId)?.name ?? ""
    }
    return ""
  }, [previewPage])

  const currentOwnerName = React.useMemo(() => {
    if (previewPage.kind !== "owner") return ""
    return getPreviewOwner({
      propertyId: previewPage.propertyId,
      ownerId: previewPage.ownerId,
    })?.name ?? ""
  }, [previewPage])

  const isAgentic = experience === "agentic"
  const activeSession = APP_AGENT_SESSIONS.find(({ id }) => id === activeSessionId)
  const assistantPreviewKey = `${activeSessionId ?? "new"}-${assistantInstanceKey}`
  const appShellNav = React.useMemo(
    () => getAppShellNav({ page: previewPage, onNavigate: handleNavItem }),
    [previewPage, handleNavItem]
  )

  return (
    <AgentLaunchProvider launch={launchCowork}>
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
            <SidebarExperienceToggle
              value={experience}
              onValueChange={handleExperienceChange}
            />
            <SidebarSearch
              groups={appShellNav}
              searchExtras={APP_SHELL_SEARCH_EXTRAS}
              conversations={APP_AGENT_SESSIONS}
              searchPlaceholder="Search…"
              onConversationSelect={handleConversationSelect}
            >
              {isAgentic ? (
                /* Agentic mode: agent history + schedule, no filmstrip */
                <>
                  <SidebarAgentHistory
                    sessions={APP_AGENT_SESSIONS}
                    activeId={activeSessionId}
                    onSelect={({ id }) => {
                      setPendingCoworkPrompt(null)
                      setActiveSessionId(id)
                    }}
                    onNewChat={() => {
                      setPendingCoworkPrompt(null)
                      setActiveSessionId(undefined)
                      setAssistantInstanceKey((key) => key + 1)
                    }}
                  />
                  <SidebarSchedule
                    events={scheduleEvents}
                    viewAllHref="#"
                    viewAllLabel="View calendar"
                  />
                </>
              ) : (
                /* Navigate mode: filmstrip grid — root nav ↔ property nav.
                   Same translate mechanic as SidebarNav panel pushes so
                   the motion is indistinguishable from native drill-in. */
                <div className="grid min-h-0 flex-1 overflow-hidden">
                  {/* Root layer: global nav + schedule, slides out to the left */}
                  <div
                    data-active={!propertyNavActive}
                    aria-hidden={propertyNavActive}
                    className={cn(FILMSTRIP_LAYER, "data-[active=false]:-translate-x-full")}
                  >
                    <div className="min-h-0 flex-1 overflow-hidden">
                      <SidebarNav groups={appShellNav} search={false} />
                    </div>
                    <SidebarSchedule
                      events={scheduleEvents}
                      viewAllHref="#"
                      viewAllLabel="View calendar"
                    />
                  </div>

                  {/* Property layer: always mounted off the right edge so the
                      slide-in starts from a painted frame, not a fresh mount. */}
                  <div
                    data-active={propertyNavActive}
                    aria-hidden={!propertyNavActive}
                    className={cn(
                      FILMSTRIP_LAYER,
                      "translate-x-full data-[active=true]:translate-x-0"
                    )}
                  >
                    {previewPage.kind === "property" && (
                      <PropertySidebarNav
                        propertyId={previewPage.id}
                        activeTab={previewActiveTab}
                        onTabChange={setPreviewActiveTab}
                        onBack={() => setPreviewPage({ kind: "properties" })}
                      />
                    )}
                    {previewPage.kind === "owner" && (
                      <PropertySidebarNav
                        propertyId={previewPage.propertyId}
                        activeTab="owners"
                        onTabChange={(tab) => {
                          setPreviewPage({ kind: "property", id: previewPage.propertyId })
                          setPreviewActiveTab(tab)
                        }}
                        onBack={() => setPreviewPage({ kind: "properties" })}
                      />
                    )}
                  </div>
                </div>
              )}
            </SidebarSearch>
          </SidebarContent>
          {/* Onboarding checklist: sits just above the account menu */}
          <SidebarOnboarding steps={APP_SHELL_ONBOARDING} />
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
          {/* App header with breadcrumb — always visible outside agentic mode */}
          {!isAgentic ? (
            <AppHeader
              actions={
                <Link
                  href="/components/app-layout"
                  className="text-xs text-ink-muted hover:text-foreground no-underline"
                >
                  Back to docs
                </Link>
              }
            >
              <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
                {/* Home */}
                <button
                  type="button"
                  onClick={() => setPreviewPage({ kind: "dashboard" })}
                  className="text-ink-muted hover:text-foreground"
                >
                  <Home className="size-4" aria-hidden />
                  <span className="sr-only">Home</span>
                </button>

                {/* Dashboard */}
                {previewPage.kind === "dashboard" && (
                  <>
                    <ChevronRight className="size-3 text-ink-muted/40" aria-hidden />
                    <span className="font-medium text-foreground">Dashboard</span>
                  </>
                )}

                {/* Properties index */}
                {previewPage.kind === "properties" && (
                  <>
                    <ChevronRight className="size-3 text-ink-muted/40" aria-hidden />
                    <span className="font-medium text-foreground">Portfolio</span>
                  </>
                )}

                {/* Property detail: Portfolio > Property name (dropdown) > Section */}
                {previewPage.kind === "property" && (
                  <>
                    <ChevronRight className="size-3 text-ink-muted/40" aria-hidden />
                    <button
                      type="button"
                      onClick={() => setPreviewPage({ kind: "properties" })}
                      className="text-ink-muted hover:text-foreground"
                    >
                      Portfolio
                    </button>

                    <ChevronRight className="size-3 text-ink-muted/40" aria-hidden />

                    {/* Property switcher with jumper dropdown */}
                    <div ref={jumperAnchorRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setJumperOpen((o) => !o)}
                        className="flex items-center gap-1 font-semibold text-foreground hover:text-forest transition-colors duration-150"
                      >
                        {currentPropertyName}
                        <ChevronDown
                          className={cn(
                            "size-3 text-ink-muted transition-transform duration-150",
                            jumperOpen && "rotate-180"
                          )}
                          aria-hidden
                        />
                      </button>

                      {jumperOpen && (
                        <PropertyJumper
                          propertyId={previewPage.id}
                          activeTab={previewActiveTab}
                          onSelectProperty={handleSwitchProperty}
                          onSelectTab={(tab) => {
                            handleSelectTab(tab)
                            setJumperOpen(false)
                          }}
                          onClose={() => setJumperOpen(false)}
                        />
                      )}
                    </div>

                    <ChevronRight className="size-3 text-ink-muted/40" aria-hidden />
                    <span className="text-ink-muted">{activeTabLabel}</span>
                  </>
                )}

                {/* Owner detail: Portfolio > Property > Owners > Proprietor */}
                {previewPage.kind === "owner" && (
                  <>
                    <ChevronRight className="size-3 text-ink-muted/40" aria-hidden />
                    <button
                      type="button"
                      onClick={() => setPreviewPage({ kind: "properties" })}
                      className="text-ink-muted hover:text-foreground"
                    >
                      Portfolio
                    </button>

                    <ChevronRight className="size-3 text-ink-muted/40" aria-hidden />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewPage({ kind: "property", id: previewPage.propertyId })
                        setPreviewActiveTab("overview")
                      }}
                      className="text-ink-muted hover:text-foreground"
                    >
                      {currentPropertyName}
                    </button>

                    <ChevronRight className="size-3 text-ink-muted/40" aria-hidden />
                    <button
                      type="button"
                      onClick={handleOwnerBack}
                      className="text-ink-muted hover:text-foreground"
                    >
                      Owners
                    </button>

                    <ChevronRight className="size-3 text-ink-muted/40" aria-hidden />
                    <span className="font-medium text-foreground">{currentOwnerName}</span>
                  </>
                )}
              </nav>
            </AppHeader>
          ) : null}

          {/* Agentic mode: Cowork assistant */}
          {isAgentic ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
              <AssistantPreview
                key={assistantPreviewKey}
                className="min-h-0 flex-1"
                showDocsLink={false}
                showSidebarTrigger
                sessionTitle={activeSession?.title}
                initialPrompt={pendingCoworkPrompt ?? undefined}
                onInitialPromptSent={() => setPendingCoworkPrompt(null)}
                onNewChat={() => {
                  setActiveSessionId(undefined)
                  setPendingCoworkPrompt(null)
                  setAssistantInstanceKey((key) => key + 1)
                }}
                headerActions={
                  <Link
                    href="/components/app-layout"
                    className="hidden text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:inline"
                  >
                    Back to docs
                  </Link>
                }
              />
            </div>
          ) : previewPage.kind === "dashboard" ? (
            /* Dashboard */
            <div className="flex-1 overflow-auto bg-white p-4 md:p-6">
              <Dashboard />
            </div>
          ) : previewPage.kind === "properties" ? (
            /* Properties portfolio index */
            <div className="flex-1 overflow-auto bg-white p-4 md:p-6">
              <PropertiesIndex
                onPropertySelect={({ id }) => setPreviewPage({ kind: "property", id })}
              />
            </div>
          ) : previewPage.kind === "owner" ? (
            /* Owner proprietor profile */
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
              <div className="flex-1 overflow-auto p-4 md:p-6">
                <OwnerDetail
                  propertyId={previewPage.propertyId}
                  ownerId={previewPage.ownerId}
                  onBack={handleOwnerBack}
                />
              </div>
            </div>
          ) : (
            /* Property detail: activeTab is fully controlled from the sidebar */
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white">
              <PropertyDetail
                propertyId={previewPage.id}
                onBack={() => setPreviewPage({ kind: "properties" })}
                activeTab={previewActiveTab}
                onNavigate={setPreviewActiveTab}
                onOwnerSelect={({ ownerId }) =>
                  handleOwnerSelect({ propertyId: previewPage.id, ownerId })
                }
              />
            </div>
          )}
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
    </AgentLaunchProvider>
  )
}
