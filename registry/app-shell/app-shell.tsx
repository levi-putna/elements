"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  LifeBuoy,
  LogOut,
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
}

export function SidebarNav({ groups, className }: SidebarNavProps) {
  // Only pay for the stack machinery when an item actually drills in.
  const hasPanels = React.useMemo(
    () => groups.some((g) => g.items.some((i) => i.panel)),
    [groups]
  )

  if (!hasPanels) {
    return <SidebarGroups groups={groups} className={className} />
  }

  return <StackedSidebarNav groups={groups} className={className} />
}

/** Flat rendering of nav groups — the single-tier case and each stack level. */
function SidebarGroups({
  groups,
  className,
  onDrill,
}: {
  groups: NavGroup[]
  className?: string
  onDrill?: (item: NavItem) => void
}) {
  return (
    <>
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

function StackedSidebarNav({ groups, className }: SidebarNavProps) {
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
        <SidebarGroups groups={groups} className={className} onDrill={push} />
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
