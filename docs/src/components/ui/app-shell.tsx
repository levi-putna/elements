"use client"

import * as React from "react"
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LayoutGrid,
  LifeBuoy,
  LogOut,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { LogoMark } from "@/components/ui/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

export interface NavSubItem {
  title: string
  href: string
}

export interface NavItem {
  title: string
  href: string
  icon?: React.ElementType
  /** Marks the active route. */
  isActive?: boolean
  /** Optional inline collapsible sub-navigation (expands in place). */
  items?: NavSubItem[]
  /**
   * Optional second-tier navigation. When present, the item "drills in":
   * clicking it slides the root nav out and this panel in, with a back
   * header to return. Use for sections like Settings that have their own
   * deep navigation. Takes precedence over `items`.
   */
  panel?: NavPanel
}

export interface NavGroup {
  /** Optional group label rendered above the items. */
  label?: string
  items: NavItem[]
}

export interface NavPanel {
  /** Title shown beside the back button at the top of the panel. */
  title: string
  /** Groups of links rendered inside the panel (icons supported). */
  groups: NavGroup[]
}

export interface NavSearchResult {
  title: string
  href: string
  icon?: React.ElementType
  groupLabel?: string
  panelTitle?: string
  /** Secondary line shown under the title (e.g. scheme name, lot context). */
  subtitle?: string
  /** Groups results in the search overlay. Defaults to navigation. */
  kind?: NavSearchResultKind
}

export type NavSearchResultKind =
  | "navigation"
  | "scheme"
  | "lot"
  | "owner"
  | "document"

const SEARCH_RESULT_KIND_ORDER: NavSearchResultKind[] = [
  "scheme",
  "lot",
  "owner",
  "document",
  "navigation",
]

const SEARCH_RESULT_KIND_LABELS: Record<NavSearchResultKind, string> = {
  scheme: "Schemes",
  lot: "Lots",
  owner: "Owners",
  document: "Documents",
  navigation: "Navigation",
}

/**
 * Flattens nav groups (including drill-in panels) into searchable rows.
 */
export function collectNavSearchResults({
  groups,
}: {
  groups: NavGroup[]
}): NavSearchResult[] {
  const results: NavSearchResult[] = []

  for (const group of groups) {
    for (const item of group.items) {
      if (item.panel) {
        for (const panelGroup of item.panel.groups) {
          for (const panelItem of panelGroup.items) {
            results.push({
              title: panelItem.title,
              href: panelItem.href,
              icon: panelItem.icon,
              groupLabel: panelGroup.label ?? group.label,
              panelTitle: item.panel.title,
              kind: "navigation",
            })
          }
        }
        continue
      }

      if (item.items?.length) {
        for (const subItem of item.items) {
          results.push({
            title: subItem.title,
            href: subItem.href,
            groupLabel: group.label,
            panelTitle: item.title,
            kind: "navigation",
          })
        }
      }

      results.push({
        title: item.title,
        href: item.href,
        icon: item.icon,
        groupLabel: group.label,
        kind: "navigation",
      })
    }
  }

  return results
}

/**
 * Filters flattened nav rows by title, group, panel, or href segment.
 */
export function filterNavSearchResults({
  results,
  query,
}: {
  results: NavSearchResult[]
  query: string
}): NavSearchResult[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) {
    return []
  }

  return results.filter((result) => {
    const haystack = [
      result.title,
      result.subtitle,
      result.groupLabel,
      result.panelTitle,
      result.href,
      result.kind,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    return haystack.includes(trimmed)
  })
}

/**
 * Groups filtered search rows by entity kind for the overlay layout.
 */
export function groupNavSearchResults({
  results,
}: {
  results: NavSearchResult[]
}): Array<{ kind: NavSearchResultKind; label: string; items: NavSearchResult[] }> {
  return SEARCH_RESULT_KIND_ORDER.map((kind) => ({
    kind,
    label: SEARCH_RESULT_KIND_LABELS[kind],
    items: results.filter((result) => (result.kind ?? "navigation") === kind),
  })).filter((group) => group.items.length > 0)
}

/**
 * Resolves the subtitle line for a search result row.
 */
function getNavSearchResultSubtitle({ result }: { result: NavSearchResult }): string | undefined {
  if (result.subtitle) {
    return result.subtitle
  }

  const parts = [result.panelTitle, result.groupLabel].filter(Boolean)
  return parts.length > 0 ? parts.join(" · ") : undefined
}

type SidebarSearchResultItemProps = {
  result: NavSearchResult
  onSelect: () => void
}

/**
 * Search result row: slightly taller than a standard nav item, with a
 * primary title and optional subtitle for entity context.
 */
function SidebarSearchResultItem({ result, onSelect }: SidebarSearchResultItemProps) {
  const Icon = result.icon ?? Search
  const subtitle = getNavSearchResultSubtitle({ result })

  return (
    <SidebarMenuItem>
      <a
        href={result.href}
        onClick={onSelect}
        className="flex min-h-10 w-full items-center gap-2.5 rounded-md px-2 py-2 text-left text-sidebar-foreground transition-colors duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
      >
        <Icon className="size-4 shrink-0 text-sidebar-foreground/70" aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-sm font-medium leading-snug">{result.title}</span>
          {subtitle ? (
            <span className="truncate text-xs leading-snug text-sidebar-foreground/55">
              {subtitle}
            </span>
          ) : null}
        </div>
      </a>
    </SidebarMenuItem>
  )
}

type SidebarSearchTriggerProps = {
  onOpen: () => void
  placeholder?: string
}

/**
 * Read-only search affordance at the top of the root nav list.
 */
function SidebarSearchTrigger({
  onOpen,
  placeholder = "Search",
}: SidebarSearchTriggerProps) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            type="button"
            tooltip="Search"
            onClick={onOpen}
            className="h-8 cursor-text border border-sidebar-border/30 bg-sidebar-accent/45 shadow-none hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent/45"
          >
            <Search />
            <span className="flex-1 truncate text-left text-sidebar-foreground/40">
              {placeholder}
            </span>
            <kbd className="pointer-events-none hidden h-4 select-none items-center rounded border border-sidebar-border bg-sidebar px-1 font-mono text-[10px] text-sidebar-foreground/50 sm:inline-flex">
              ⌘K
            </kbd>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}

type SidebarSearchOverlayProps = {
  searchInputRef: React.RefObject<HTMLInputElement | null>
  searchQuery: string
  onSearchQueryChange: ({ value }: { value: string }) => void
  results: NavSearchResult[]
  placeholder?: string
  onClose: () => void
  onClear: () => void
  onResultSelect: () => void
}

/**
 * Full-height search overlay layered over SidebarNav drill-down panels.
 */
function SidebarSearchOverlay({
  searchInputRef,
  searchQuery,
  onSearchQueryChange,
  results,
  placeholder = "Search navigation…",
  onClose,
  onClear,
  onResultSelect,
}: SidebarSearchOverlayProps) {
  const hasQuery = searchQuery.trim().length > 0
  const groupedResults = groupNavSearchResults({ results })

  return (
    <div className="absolute inset-0 z-10 flex animate-in fade-in flex-col overflow-y-auto bg-sidebar duration-100">
      {/* Back nav row */}
      <SidebarGroup>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="button"
              tooltip="Back"
              onClick={onClose}
              className="relative justify-center font-medium"
            >
              <ArrowLeft className="absolute left-2" aria-hidden />
              <span className="text-sidebar-foreground">Search</span>
              {hasQuery ? (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(event) => {
                    event.stopPropagation()
                    onClear()
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.stopPropagation()
                      onClear()
                    }
                  }}
                  className="absolute right-2 cursor-pointer text-xs text-sidebar-foreground/50 hover:text-sidebar-foreground"
                >
                  Clear
                </span>
              ) : null}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      {/* Search input */}
      <SidebarGroup className="pt-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex h-8 w-full items-center gap-2 rounded-md bg-sidebar-accent/50 px-2 ring-sidebar-ring focus-within:ring-1">
              <Search
                className="size-4 shrink-0 text-sidebar-foreground/40"
                aria-hidden
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(event) =>
                  onSearchQueryChange({ value: event.target.value })
                }
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    onClose()
                  }
                }}
                className="min-w-0 flex-1 border-0 bg-transparent text-sm text-sidebar-foreground outline-none placeholder:text-sidebar-foreground/40"
              />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>

      <SidebarSeparator />

      {/* Results */}
      <SidebarGroup className="min-h-0 flex-1 overflow-y-auto pt-0">
        {!hasQuery ? (
          <p className="py-6 text-center text-xs text-sidebar-foreground/50">
            Type to find pages and settings
          </p>
        ) : results.length > 0 ? (
          <div className="flex flex-col gap-3">
            {groupedResults.map((group) => (
              <div key={group.kind}>
                <SidebarGroupLabel className="h-7 px-2 text-[10px] uppercase tracking-widest text-sidebar-foreground/45">
                  {group.label}
                </SidebarGroupLabel>
                <SidebarMenu className="gap-0.5">
                  {group.items.map((result) => (
                    <SidebarSearchResultItem
                      key={`${group.kind}-${result.href}-${result.title}`}
                      result={result}
                      onSelect={onResultSelect}
                    />
                  ))}
                </SidebarMenu>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-2 py-8 text-center">
            <Search className="size-6 text-sidebar-foreground/30" aria-hidden />
            <p className="text-xs text-sidebar-foreground/50">
              No results for &ldquo;{searchQuery.trim()}&rdquo;
            </p>
          </div>
        )}
      </SidebarGroup>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SidebarNav: the sidebar navigation
//
// Renders one or more labelled groups of menu items. Items with
// an `items` array become inline collapsible sub-navigation
// (sidebar-07 style). Items with a `panel` "drill in" to a
// second-tier stacked navigation (Vercel-dashboard style): the
// root slides out, the panel slides in with a back header.
// Pass an active flag to highlight the current route.
// ─────────────────────────────────────────────────────────

export interface SidebarNavProps {
  groups: NavGroup[]
  className?: string
  /** Show the sidebar search overlay on the root nav. Default true. */
  search?: boolean
  /** Placeholder copy for the search input. */
  searchPlaceholder?: string
  /** Extra searchable rows (schemes, lots, owners, documents) not shown in the nav. */
  searchExtras?: NavSearchResult[]
}

export function SidebarNav({
  groups,
  className,
  search = true,
  searchPlaceholder,
  searchExtras = [],
}: SidebarNavProps) {
  const { state, setOpen } = useSidebar()
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const searchResults = React.useMemo(() => {
    const allResults = [
      ...collectNavSearchResults({ groups }),
      ...searchExtras,
    ]
    return filterNavSearchResults({ results: allResults, query: searchQuery })
  }, [groups, searchExtras, searchQuery])

  const openSearch = React.useCallback(() => {
    if (state === "collapsed") {
      setOpen(true)
    }
    setIsSearchOpen(true)
  }, [setOpen, state])

  const closeSearch = React.useCallback(() => {
    setIsSearchOpen(false)
    setSearchQuery("")
  }, [])

  const clearSearch = React.useCallback(() => {
    setSearchQuery("")
    searchInputRef.current?.focus()
  }, [])

  React.useEffect(() => {
    if (!search) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        setIsSearchOpen((open) => {
          if (open) {
            setSearchQuery("")
            return false
          }
          if (state === "collapsed") {
            setOpen(true)
          }
          return true
        })
      }

      if (event.key === "Escape" && isSearchOpen) {
        closeSearch()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [closeSearch, isSearchOpen, search, setOpen, state])

  React.useEffect(() => {
    if (!isSearchOpen) {
      return
    }

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [isSearchOpen])

  const searchTrigger = search ? (
    <SidebarSearchTrigger
      onOpen={openSearch}
      placeholder={searchPlaceholder}
    />
  ) : null

  // Only pay for the stack machinery when an item actually drills in.
  const hasPanels = React.useMemo(
    () => groups.some((g) => g.items.some((i) => i.panel)),
    [groups]
  )

  const nav = hasPanels ? (
    <StackedSidebarNav
      groups={groups}
      className={className}
      searchTrigger={searchTrigger}
    />
  ) : (
    <SidebarGroups
      groups={groups}
      className={className}
      searchTrigger={searchTrigger}
    />
  )

  if (!search) {
    return nav
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
      <div className={cn("min-h-0 flex-1 overflow-hidden", isSearchOpen && "invisible")}>
        {nav}
      </div>
      {isSearchOpen ? (
        <SidebarSearchOverlay
          searchInputRef={searchInputRef}
          searchQuery={searchQuery}
          onSearchQueryChange={({ value }) => setSearchQuery(value)}
          results={searchResults}
          placeholder={searchPlaceholder}
          onClose={closeSearch}
          onClear={clearSearch}
          onResultSelect={closeSearch}
        />
      ) : null}
    </div>
  )
}

/** Flat rendering of nav groups — the single-tier case and each stack level. */
function SidebarGroups({
  groups,
  className,
  onDrill,
  searchTrigger,
}: {
  groups: NavGroup[]
  className?: string
  onDrill?: (item: NavItem) => void
  searchTrigger?: React.ReactNode
}) {
  return (
    <>
      {searchTrigger}
      {groups.map((group, i) => (
        <SidebarGroup key={group.label ?? i} className={className}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarMenu className="gap-1">
            {group.items.map((item) => (
              <SidebarNavItem key={item.title} item={item} onDrill={onDrill} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}

function SidebarNavItem({
  item,
  onDrill,
}: {
  item: NavItem
  onDrill?: (item: NavItem) => void
}) {
  const [open, setOpen] = React.useState(item.isActive ?? false)
  const Icon = item.icon

  // Drill-in item: opens a second-tier stacked panel.
  if (item.panel) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={item.isActive}
          tooltip={item.title}
          onClick={() => onDrill?.(item)}
        >
          {Icon && <Icon />}
          <span>{item.title}</span>
          <ChevronRight className="ml-auto text-sidebar-foreground/50" />
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  // Plain link.
  if (!item.items?.length) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={item.isActive}
          tooltip={item.title}
          render={<a href={item.href} />}
        >
          {Icon && <Icon />}
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  // Inline collapsible sub-navigation.
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={item.isActive}
        tooltip={item.title}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {Icon && <Icon />}
        <span>{item.title}</span>
        <ChevronRight
          className={cn(
            "ml-auto transition-transform duration-200",
            open && "rotate-90"
          )}
        />
      </SidebarMenuButton>
      {open && (
        <SidebarMenuSub>
          {item.items.map((sub) => (
            <SidebarMenuSubItem key={sub.title}>
              <SidebarMenuSubButton render={<a href={sub.href} />}>
                <span>{sub.title}</span>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  )
}

// ─────────────────────────────────────────────────────────
// StackedSidebarNav: two-tier stacked navigation
//
// Holds a stack of nav levels. The root level and any pushed
// panel are layered in the same grid cell and cross-fade /
// slide horizontally — root exits left, panel enters from the
// right (and reverses on back). Both directions ease-out so the
// arriving level decelerates and settles into place. Fast
// (300ms), and fully disabled under prefers-reduced-motion.
// ─────────────────────────────────────────────────────────

function StackedSidebarNav({
  groups,
  className,
  searchTrigger,
}: SidebarNavProps & { searchTrigger?: React.ReactNode }) {
  // Open straight into a panel if its drill item is the active route.
  const initial = React.useMemo(() => {
    for (const group of groups) {
      for (const item of group.items) {
        if (item.panel && item.isActive) return item.panel
      }
    }
    return null
  }, [groups])

  // `panel` is the panel kept mounted (null only at rest on root).
  // `view` is where we're animating *to* — drives the enter/exit.
  const [panel, setPanel] = React.useState<NavPanel | null>(initial)
  const [view, setView] = React.useState<"root" | "panel">(
    initial ? "panel" : "root"
  )
  const backRef = React.useRef<HTMLButtonElement>(null)

  const push = React.useCallback((item: NavItem) => {
    if (!item.panel) return
    setPanel(item.panel)
    // Two frames before flipping view: the first rAF still runs before paint, so
    // a single rAF would commit translate-x-0 in the same frame as the new
    // panel content and the slide would snap. Back works because the panel was
    // already painted on-screen; forward needs one painted frame off-screen first.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setView("panel")
        requestAnimationFrame(() => backRef.current?.focus())
      })
    })
  }, [])

  const pop = React.useCallback(() => setView("root"), [])

  // Escape pops the panel — matches the back button.
  React.useEffect(() => {
    if (view !== "panel") return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") pop()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [view, pop])

  // Both levels share one grid cell and travel the full width in lockstep —
  // the active one sits at 0, the inactive one is pushed a full panel-width
  // off-screen. With the container clipped, that reads as a filmstrip slide:
  // the parent leaves to the left exactly as the child arrives from the right.
  const layer =
    "[grid-area:1/1] min-w-0 transition-transform duration-300 " +
    "ease-out motion-reduce:transition-none data-[active=false]:pointer-events-none"

  return (
    <div className="grid overflow-hidden">
      {/* Root level — slides fully out to the left when a panel is open. */}
      <div
        data-active={view === "root"}
        aria-hidden={view !== "root"}
        className={cn(layer, "data-[active=false]:-translate-x-full")}
      >
        <SidebarGroups
          groups={groups}
          className={className}
          onDrill={push}
          searchTrigger={searchTrigger}
        />
      </div>

      {/* Pushed panel — always mounted so it sits pre-painted off the right
          edge; that lets it slide in reliably (a freshly mounted layer would
          just snap). Content is cleared only after it has slid back out. */}
      <div
        data-active={view === "panel"}
        aria-hidden={view !== "panel"}
        onTransitionEnd={(e) => {
          // Only the panel layer's *own* slide finishing should clear it.
          // onTransitionEnd bubbles, so without this guard a child button's
          // hover/layout transition would fire mid-pop and clear the content
          // before it finished sliding away (making "back" look abrupt).
          if (
            e.target === e.currentTarget &&
            (e.propertyName === "translate" || e.propertyName === "transform") &&
            view === "root"
          ) {
            setPanel(null)
          }
        }}
        className={cn(layer, "translate-x-full data-[active=true]:translate-x-0")}
      >
        {panel && (
          <>
            <SidebarGroup className={className}>
              <SidebarMenu className="gap-1">
                <SidebarMenuItem>
                  <SidebarMenuButton
                    ref={backRef}
                    tooltip="Back"
                    onClick={pop}
                    className="font-medium"
                  >
                    <ChevronLeft />
                    <span>{panel.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroups groups={panel.groups} className={className} />
          </>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// AppSidebarHeader: branded workspace switcher
//
// Lives in the SidebarHeader slot. A lime logo mark + workspace
// name, opening a dropdown to switch between workspaces.
// ─────────────────────────────────────────────────────────

export interface Workspace {
  name: string
  plan?: string
}

export interface AppSidebarHeaderProps {
  workspace: Workspace
  workspaces?: Workspace[]
  onSelect?: (workspace: Workspace) => void
}

export function AppSidebarHeader({
  workspace,
  workspaces = [],
  onSelect,
}: AppSidebarHeaderProps) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  return (
    <SidebarHeader
      className={cn(
        "h-14 shrink-0 gap-0 border-b border-border bg-white p-0 text-sidebar-foreground",
        collapsed && "flex items-center justify-center"
      )}
      style={
        {
          // Light tokens so the workspace switcher reads on the white band
          // even when the sidebar below uses forest/dark tokens.
          "--sidebar-foreground": "#043F2E",
          "--sidebar-accent": "#EEF2E3",
          "--sidebar-accent-foreground": "#043F2E",
        } as React.CSSProperties
      }
    >
      <SidebarMenu className={cn("h-full", collapsed && "h-auto w-auto")}>
        <SidebarMenuItem className={cn("h-full", collapsed && "h-auto")}>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  tooltip={collapsed ? workspace.name : undefined}
                  className={cn(
                    "data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground",
                    collapsed
                      ? "size-8 justify-center gap-0 rounded-md p-0"
                      : "h-full rounded-none px-4"
                  )}
                >
                  <LogoMark
                    surface="primary"
                    size={collapsed ? "sm" : "md"}
                    decorative
                  />
                  {!collapsed && (
                    <>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">{workspace.name}</span>
                        {workspace.plan && (
                          <span className="truncate text-xs text-sidebar-foreground/60">
                            {workspace.plan}
                          </span>
                        )}
                      </div>
                      <ChevronsUpDown className="ml-auto" />
                    </>
                  )}
                </SidebarMenuButton>
              }
            />
            <DropdownMenuContent className="min-w-56" align="start" side="bottom">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Workspaces
                </DropdownMenuLabel>
                {(workspaces.length ? workspaces : [workspace]).map((w) => (
                  <DropdownMenuItem key={w.name} onClick={() => onSelect?.(w)} className="gap-2">
                    <div className="flex size-6 items-center justify-center rounded-sm bg-secondary text-[10px] font-display text-forest">
                      {w.name.slice(0, 2).toUpperCase()}
                    </div>
                    {w.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  )
}

// ─────────────────────────────────────────────────────────
// AppSidebarFooter: branded user menu
//
// Lives in the SidebarFooter slot. Avatar initials + name/email,
// opening an account dropdown (upgrade, settings, sign out).
// ─────────────────────────────────────────────────────────

export interface AppUser {
  name: string
  email: string
  /** Optional avatar image URL. Falls back to initials. */
  avatar?: string
}

export interface AppSidebarFooterProps {
  user: AppUser
  /** Optional href for the Support item in the account menu. */
  supportHref?: string
  onSignOut?: () => void
}

export function AppSidebarFooter({
  user,
  supportHref = "#",
  onSignOut,
}: AppSidebarFooterProps) {
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
                >
                  <Avatar src={user.avatar} name={user.name} size="md" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-sidebar-foreground/60">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto" />
                </SidebarMenuButton>
              }
            />
            <DropdownMenuContent className="min-w-56" align="end" side="top">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center gap-2 py-1.5">
                  <Avatar src={user.avatar} name={user.name} size="md" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <Sparkles />
                  Upgrade plan
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem render={<a href={supportHref} />}>
                  <LifeBuoy />
                  Support
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onSignOut}>
                  <LogOut />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}

// ─────────────────────────────────────────────────────────
// SidebarExperienceToggle: switch between traditional nav and agentic UI
//
// Sits at the top of SidebarContent, below the workspace header. Lets the
// user choose the navigate stack (search, links, schedule) or an agentic
// experience where the sidebar becomes conversation history.
// ─────────────────────────────────────────────────────────

export type SidebarExperience = "navigate" | "agentic"

export interface SidebarExperienceToggleProps {
  value: SidebarExperience
  onValueChange: (value: SidebarExperience) => void
  className?: string
}

/**
 * Segmented control for switching between traditional navigation and agentic mode.
 */
export function SidebarExperienceToggle({
  value,
  onValueChange,
  className,
}: SidebarExperienceToggleProps) {
  const { state } = useSidebar()

  if (state === "collapsed") {
    return null
  }

  return (
    <div
      className={cn(
        "shrink-0 border-b border-sidebar-border/50 px-2 py-2 group-data-[collapsible=icon]:hidden",
        className
      )}
      role="tablist"
      aria-label="Sidebar experience"
    >
      <div className="grid grid-cols-2 gap-1 rounded-md bg-sidebar-accent/25 p-1">
        <button
          type="button"
          role="tab"
          aria-selected={value === "navigate"}
          onClick={() => onValueChange("navigate")}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 text-[11px] font-medium transition-colors duration-150",
            value === "navigate"
              ? "bg-sidebar text-sidebar-foreground shadow-sm"
              : "text-sidebar-foreground/55 hover:text-sidebar-foreground/80"
          )}
        >
          <LayoutGrid className="size-3.5 shrink-0" aria-hidden />
          Navigate
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={value === "agentic"}
          onClick={() => onValueChange("agentic")}
          className={cn(
            "inline-flex items-center justify-center gap-1.5 rounded-sm px-2 py-1.5 text-[11px] font-medium transition-colors duration-150",
            value === "agentic"
              ? "bg-sidebar text-sidebar-foreground shadow-sm"
              : "text-sidebar-foreground/55 hover:text-sidebar-foreground/80"
          )}
        >
          <Sparkles className="size-3.5 shrink-0" aria-hidden />
          Assistant
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// SidebarAgentHistory: conversation list for agentic mode
//
// Replaces SidebarNav when the user switches to the assistant experience.
// Shows prior chats with a new-chat action at the top.
// ─────────────────────────────────────────────────────────

export interface AgentSession {
  id: string
  title: string
  preview: string
  /** Relative or absolute time label, e.g. "Today" or "Yesterday". */
  when: string
}

export interface SidebarAgentHistoryProps {
  sessions: AgentSession[]
  activeId?: string
  onSelect?: (session: AgentSession) => void
  onNewChat?: () => void
  className?: string
}

/**
 * Agent conversation history for the sidebar in agentic mode.
 */
export function SidebarAgentHistory({
  sessions,
  activeId,
  onSelect,
  onNewChat,
  className,
}: SidebarAgentHistoryProps) {
  const { state } = useSidebar()

  if (state === "collapsed") {
    return null
  }

  return (
    <div
      className={cn("flex min-h-0 flex-1 flex-col overflow-hidden", className)}
      aria-label="Assistant history"
    >
      {/* New chat action */}
      <div className="shrink-0 px-2 py-2">
        <button
          type="button"
          onClick={onNewChat}
          className="flex w-full items-center gap-2 rounded-md border border-sidebar-border/60 bg-sidebar-accent/15 px-2.5 py-2 text-left text-xs font-medium text-sidebar-foreground/90 transition-colors duration-150 hover:bg-sidebar-accent/30"
        >
          <Plus className="size-3.5 shrink-0 text-sidebar-primary" aria-hidden />
          New chat
        </button>
      </div>

      {/* Session list */}
      <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-2">
        {sessions.length === 0 ? (
          <p className="px-2 py-4 text-center text-[11px] text-sidebar-foreground/45">
            No conversations yet. Start a new chat.
          </p>
        ) : (
          <ul className="flex flex-col gap-0.5">
            {sessions.map((session) => {
              const isActive = session.id === activeId

              return (
                <li key={session.id}>
                  <button
                    type="button"
                    onClick={() => onSelect?.(session)}
                    aria-current={isActive ? "true" : undefined}
                    className={cn(
                      "flex w-full items-start gap-2 rounded-md px-2 py-2 text-left transition-colors duration-150",
                      isActive
                        ? "bg-sidebar-accent/50 text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/75 hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    <MessageSquare
                      className="mt-0.5 size-3.5 shrink-0 text-sidebar-foreground/40"
                      aria-hidden
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-xs font-medium leading-snug">
                        {session.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[10px] leading-snug text-sidebar-foreground/45">
                        {session.preview}
                      </span>
                      <span className="mt-1 block text-[10px] text-sidebar-foreground/40">
                        {session.when}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// AppHeader: the top bar inside the content area
//
// Holds the SidebarTrigger and a breadcrumb / title slot (children).
// Sticks to the top of the SidebarInset.
// ─────────────────────────────────────────────────────────

export interface AppHeaderProps extends React.ComponentProps<"header"> {
  /** Content rendered to the right of the trigger (breadcrumbs, title). */
  children?: React.ReactNode
  /** Optional actions pinned to the right edge. */
  actions?: React.ReactNode
}

export function AppHeader({ children, actions, className, ...props }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-2 border-b border-border bg-white px-4",
        className
      )}
      {...props}
    >
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center gap-2 min-w-0">{children}</div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  )
}

// Re-export the SidebarInset wrapper for convenience so consumers can
// build the full shell from a single import.
export { useSidebar }
