"use client"

import * as React from "react"
import { ChevronRight, ChevronsUpDown, LogOut, Settings, Sparkles } from "lucide-react"

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
  /** Optional collapsible sub-navigation. */
  items?: NavSubItem[]
}

export interface NavGroup {
  /** Optional group label rendered above the items. */
  label?: string
  items: NavItem[]
}

// ─────────────────────────────────────────────────────────
// SidebarNav: the sidebar navigation
//
// Renders one or more labelled groups of menu items. Items with
// an `items` array become collapsible sub-navigation (sidebar-07
// style). Pass an active flag to highlight the current route.
// ─────────────────────────────────────────────────────────

export interface SidebarNavProps {
  groups: NavGroup[]
  className?: string
}

export function SidebarNav({ groups, className }: SidebarNavProps) {
  return (
    <>
      {groups.map((group, i) => (
        <SidebarGroup key={group.label ?? i} className={className}>
          {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
          <SidebarMenu className="gap-1">
            {group.items.map((item) => (
              <SidebarNavItem key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  )
}

function SidebarNavItem({ item }: { item: NavItem }) {
  const [open, setOpen] = React.useState(item.isActive ?? false)
  const Icon = item.icon

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
  return (
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground"
                >
                  <LogoMark surface="primary" size="md" decorative />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{workspace.name}</span>
                    {workspace.plan && (
                      <span className="truncate text-xs text-sidebar-foreground/60">
                        {workspace.plan}
                      </span>
                    )}
                  </div>
                  <ChevronsUpDown className="ml-auto" />
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
  onSignOut?: () => void
}

export function AppSidebarFooter({ user, onSignOut }: AppSidebarFooterProps) {
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
