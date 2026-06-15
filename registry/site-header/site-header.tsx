"use client"

import * as React from "react"
import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu"
import { ChevronDown, LogOut, Menu, SquareArrowOutUpRight, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────

/** A single link inside a navigation dropdown panel. */
export interface SiteNavLink {
  title: string
  href: string
  /** Optional supporting copy shown beneath the title (Mode-style panels). */
  description?: string
}

/**
 * A top-level navigation entry. Provide `href` for a plain link, or `links`
 * for a dropdown panel of sub-items.
 */
export interface SiteNavItem {
  title: string
  href?: string
  links?: SiteNavLink[]
}

/** The signed-in user shown in the account menu. */
export interface SiteUser {
  name: string
  email?: string
  /** Avatar image URL. Falls back to initials derived from `name`. */
  avatar?: string
}

export interface SiteHeaderProps extends React.ComponentProps<"header"> {
  /** Top-level navigation entries (plain links or dropdown panels). */
  items?: SiteNavItem[]
  /**
   * The signed-in user. When `null`/omitted the header renders the
   * logged-out call to action instead.
   */
  user?: SiteUser | null
  /** Destination for the primary "Get Started" CTA (logged out). */
  getStartedHref?: string
  /** Destination for the secondary "Sign in" link (logged out). */
  signInHref?: string
  /** Destination for "Open app" in the account menu (logged in). */
  appHref?: string
  /** Called when the user chooses "Log out". */
  onSignOut?: () => void
  /** Replace the default Instant Strata logo + home link. */
  logo?: React.ReactNode
  /** Href the logo links to. Ignored when a custom `logo` is supplied. */
  logoHref?: string
  /** Stick the header to the top of the viewport. */
  sticky?: boolean
}

// ─────────────────────────────────────────────────────────
// Navigation menu (shadcn navigation-menu, Base UI primitive)
//
// Styled to the Instant Strata system: forest text, lime hover
// accents, 8px dropdown panels. Triggers reveal a shared viewport
// that animates between items.
// ─────────────────────────────────────────────────────────

const triggerClasses =
  "inline-flex h-9 items-center gap-1 rounded-sm px-3 text-sm font-medium text-ink-muted no-underline outline-none transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground data-[popup-open]:bg-muted data-[popup-open]:text-foreground"

function DesktopNav({ items }: { items: SiteNavItem[] }) {
  return (
    <NavigationMenuPrimitive.Root className="relative hidden md:flex">
      <NavigationMenuPrimitive.List className="flex items-center gap-0.5">
        {items.map((item) =>
          item.links?.length ? (
            <NavigationMenuPrimitive.Item key={item.title}>
              <NavigationMenuPrimitive.Trigger className={triggerClasses}>
                {item.title}
                <ChevronDown className="size-4 transition-transform duration-200 data-[popup-open]:rotate-180" />
              </NavigationMenuPrimitive.Trigger>
              <NavigationMenuPrimitive.Content className="w-full p-2 transition-[opacity,transform,translate] duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 data-[ending-style]:data-[activation-direction=left]:translate-x-2 data-[ending-style]:data-[activation-direction=right]:-translate-x-2 data-[starting-style]:data-[activation-direction=left]:-translate-x-2 data-[starting-style]:data-[activation-direction=right]:translate-x-2">
                <ul className="grid w-[460px] grid-cols-2 gap-1">
                  {item.links.map((link) => (
                    <li key={link.title}>
                      <NavigationMenuPrimitive.Link
                        href={link.href}
                        className="block rounded-md p-3 no-underline outline-none transition-colors duration-150 hover:bg-muted focus-visible:bg-muted"
                      >
                        <div className="text-sm font-medium text-foreground">
                          {link.title}
                        </div>
                        {link.description && (
                          <p className="mt-0.5 text-xs leading-relaxed text-ink-muted">
                            {link.description}
                          </p>
                        )}
                      </NavigationMenuPrimitive.Link>
                    </li>
                  ))}
                </ul>
              </NavigationMenuPrimitive.Content>
            </NavigationMenuPrimitive.Item>
          ) : (
            <NavigationMenuPrimitive.Item key={item.title}>
              <NavigationMenuPrimitive.Link href={item.href} className={triggerClasses}>
                {item.title}
              </NavigationMenuPrimitive.Link>
            </NavigationMenuPrimitive.Item>
          )
        )}
      </NavigationMenuPrimitive.List>

      <NavigationMenuPrimitive.Portal>
        <NavigationMenuPrimitive.Positioner
          className="box-border h-[var(--positioner-height)] w-[var(--positioner-width)] max-w-[var(--available-width)] transition-[top,left,right,bottom] duration-200 data-[instant]:transition-none"
          sideOffset={8}
          collisionPadding={16}
        >
          <NavigationMenuPrimitive.Popup className="relative h-[var(--popup-height)] origin-[var(--transform-origin)] rounded-md bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 transition-[opacity,transform,width,height,scale] duration-200 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
            <NavigationMenuPrimitive.Viewport className="relative h-full w-full overflow-hidden" />
          </NavigationMenuPrimitive.Popup>
        </NavigationMenuPrimitive.Positioner>
      </NavigationMenuPrimitive.Portal>
    </NavigationMenuPrimitive.Root>
  )
}

// ─────────────────────────────────────────────────────────
// Account menu (logged in): avatar + name + dropdown
// ─────────────────────────────────────────────────────────

function AccountMenu({
  user,
  appHref,
  onSignOut,
}: {
  user: SiteUser
  appHref: string
  onSignOut?: () => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-2 rounded-sm py-1 pl-1 pr-2 outline-none transition-colors duration-150 hover:bg-muted focus-visible:bg-muted data-[popup-open]:bg-muted"
          >
            <Avatar src={user.avatar} name={user.name} size="md" />
            <span className="hidden max-w-[10rem] truncate text-sm font-medium text-foreground sm:block">
              {user.name}
            </span>
            <ChevronDown className="size-4 text-ink-muted" />
          </button>
        }
      />
      <DropdownMenuContent className="min-w-56" align="end" side="bottom">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center gap-2 py-1.5">
            <Avatar src={user.avatar} name={user.name} size="md" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-foreground">{user.name}</span>
              {user.email && (
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              )}
            </div>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem render={<a href={appHref} />}>
            <SquareArrowOutUpRight />
            Open app
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onSignOut}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ─────────────────────────────────────────────────────────
// SiteHeader — the marketing website header
//
// Logo on the left, navigation in the centre, and an auth-aware
// right rail: a "Get Started" CTA when logged out, or the account
// menu (avatar + name + dropdown) when a user is supplied.
// ─────────────────────────────────────────────────────────

export function SiteHeader({
  items = [],
  user,
  getStartedHref = "/signup",
  signInHref = "/login",
  appHref = "/app",
  onSignOut,
  logo,
  logoHref = "/",
  sticky = true,
  className,
  ...props
}: SiteHeaderProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  return (
    <header
      data-slot="site-header"
      className={cn(
        "z-40 w-full border-b border-border bg-white/95 backdrop-blur-sm",
        sticky && "sticky top-0",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center gap-6 px-6 md:px-10">
        {/* Logo */}
        {logo ?? (
          <a href={logoHref} className="shrink-0 no-underline" aria-label="Home">
            <Logo size="md" />
          </a>
        )}

        {/* Desktop navigation */}
        {items.length > 0 && (
          <div className="hidden flex-1 md:flex">
            <DesktopNav items={items} />
          </div>
        )}

        {/* Right rail */}
        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <AccountMenu user={user} appHref={appHref} onSignOut={onSignOut} />
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Button variant="ghost" nativeButton={false} render={<a href={signInHref} />}>
                Sign in
              </Button>
              <Button variant="accent" nativeButton={false} render={<a href={getStartedHref} />}>
                Get Started
              </Button>
            </div>
          )}

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="border-t border-border bg-white md:hidden">
          <nav className="mx-auto flex w-full max-w-[1200px] flex-col gap-1 px-6 py-4">
            {items.map((item) =>
              item.links?.length ? (
                <div key={item.title} className="py-1">
                  <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                    {item.title}
                  </p>
                  {item.links.map((link) => (
                    <a
                      key={link.title}
                      href={link.href}
                      className="block rounded-sm px-3 py-2 text-sm text-ink-muted no-underline transition-colors hover:bg-muted hover:text-foreground"
                    >
                      {link.title}
                    </a>
                  ))}
                </div>
              ) : (
                <a
                  key={item.title}
                  href={item.href}
                  className="block rounded-sm px-3 py-2 text-sm font-medium text-foreground no-underline transition-colors hover:bg-muted"
                >
                  {item.title}
                </a>
              )
            )}

            {!user && (
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                <Button variant="ghost" nativeButton={false} render={<a href={signInHref} />}>
                  Sign in
                </Button>
                <Button variant="accent" nativeButton={false} render={<a href={getStartedHref} />}>
                  Get Started
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
