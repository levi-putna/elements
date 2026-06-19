"use client"

import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import * as React from "react"

import {
  docsNavGroups,
  docsOverviewItems,
  filterDocsNavGroups,
  type DocsNavGroup,
} from "@/lib/docs-nav"
import { cn } from "@/lib/utils"

const linkClassName =
  "rounded-sm px-2 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-150 no-underline"

const overviewLinkClassName =
  "block rounded-sm px-2 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-150 no-underline"

type DocsSidebarSearchOverlayProps = {
  searchInputRef: React.RefObject<HTMLInputElement | null>
  searchQuery: string
  onSearchQueryChange: ({ value }: { value: string }) => void
  filteredGroups: DocsNavGroup[]
  onClose: () => void
  onClear: () => void
}

/**
 * Full-height search overlay inside the docs sidebar content region.
 */
function DocsSidebarSearchOverlay({
  searchInputRef,
  searchQuery,
  onSearchQueryChange,
  filteredGroups,
  onClose,
  onClear,
}: DocsSidebarSearchOverlayProps) {
  const hasQuery = searchQuery.trim().length > 0
  const hasResults = filteredGroups.length > 0

  return (
    <div className="absolute inset-0 z-10 flex flex-col overflow-y-auto bg-[#043F2E] animate-in fade-in duration-100">
      {/* Back nav row: arrow left closes, "Search" centred, "Clear" on right */}
      <div className="px-2 pt-2 pb-1">
        <button
          type="button"
          onClick={onClose}
          className="relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm text-white/60 transition-colors duration-150 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="absolute left-2 size-4" aria-hidden />
          <span className="flex-1 text-center font-medium text-white">Search</span>
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
              className="absolute right-2 cursor-pointer text-xs text-white/50 hover:text-white"
            >
              Clear
            </span>
          ) : null}
        </button>
      </div>

      {/* Search input */}
      <div className="px-2 pb-2">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-white/40"
            aria-hidden
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search components…"
            value={searchQuery}
            onChange={(event) =>
              onSearchQueryChange({ value: event.target.value })
            }
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                onClose()
              }
            }}
            className="h-7 w-full rounded-sm border-0 bg-white/10 pl-7 pr-3 text-sm text-white outline-none placeholder:text-white/40 hover:bg-white/15 focus-visible:ring-1 focus-visible:ring-white/30"
          />
        </div>
      </div>

      <div className="mx-2 h-px bg-white/10" />

      {/* Results */}
      <div className="flex-1 overflow-y-auto px-2 py-3">
        {!hasQuery ? (
          <p className="py-6 text-center text-xs text-white/40">
            Type to find components, foundations, and pages
          </p>
        ) : hasResults ? (
          <div className="space-y-4">
            {filteredGroups.map((group) => (
              <div key={group.label}>
                <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
                  {group.label}
                </p>
                <nav className="flex flex-col">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={linkClassName}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <Search className="size-6 text-white/30" aria-hidden />
            <p className="text-xs text-white/50">
              No results for &ldquo;{searchQuery.trim()}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

type DocsNavListProps = {
  groups: DocsNavGroup[]
  onOpenSearch: () => void
  showSearchTrigger?: boolean
}

/**
 * Default docs sidebar navigation with a search trigger at the top.
 */
function DocsNavList({
  groups,
  onOpenSearch,
  showSearchTrigger = true,
}: DocsNavListProps) {
  return (
    <div className="space-y-6">
      {/* Search trigger */}
      {showSearchTrigger ? (
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-white/40"
            aria-hidden
          />
          <input
            readOnly
            type="text"
            placeholder="Search"
            value=""
            onClick={onOpenSearch}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                onOpenSearch()
              }
            }}
            className="h-7 w-full cursor-pointer rounded-sm border-0 bg-white/10 pl-7 pr-12 text-sm text-white outline-none placeholder:text-white/40 hover:bg-white/15 focus-visible:ring-1 focus-visible:ring-white/30"
            aria-label="Search documentation"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center rounded bg-white/10 px-1 font-mono text-[10px] text-white/50 sm:inline-flex">
            ⌘K
          </kbd>
        </div>
      ) : null}

      {/* Overview */}
      <nav className="flex flex-col gap-0.5">
        <Link href="/" className={overviewLinkClassName}>
          Overview
        </Link>
        {docsOverviewItems.map((item) => (
          <Link key={item.href} href={item.href} className={linkClassName}>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Component groups (skip Overview; rendered above) */}
      {groups.filter((group) => group.label !== "Overview").map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-white/40">
            {group.label}
          </p>
          <nav className="flex flex-col">
            {group.items.map((item) => (
              <Link key={item.href} href={item.href} className={linkClassName}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ))}
    </div>
  )
}

/**
 * Forest-green docs sidebar with overlay search (stratahuman / ai-search pattern).
 */
export function DocsSidebar() {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const searchInputRef = React.useRef<HTMLInputElement>(null)

  const filteredGroups = React.useMemo(
    () =>
      filterDocsNavGroups({
        groups: docsNavGroups,
        query: searchQuery,
      }),
    [searchQuery]
  )

  /** Close the overlay and reset search state. */
  function closeSearch() {
    setIsSearchOpen(false)
    setSearchQuery("")
  }

  /** Clear the query but keep the overlay open. */
  function clearSearch() {
    setSearchQuery("")
    searchInputRef.current?.focus()
  }

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault()
        setIsSearchOpen((open) => !open)
      }

      if (event.key === "Escape" && isSearchOpen) {
        closeSearch()
      }
    }

    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isSearchOpen])

  React.useEffect(() => {
    if (!isSearchOpen) {
      return
    }

    const frame = requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })

    return () => cancelAnimationFrame(frame)
  }, [isSearchOpen])

  return (
    <aside
      className={cn(
        "relative hidden w-60 shrink-0 flex-col border-r border-[#032B1F] bg-[#043F2E] md:flex"
      )}
    >
      <div className="relative flex-1 overflow-hidden">
        {/* Default navigation */}
        <div
          className={cn(
            "h-full overflow-y-auto px-4 py-6",
            isSearchOpen && "invisible"
          )}
        >
          <DocsNavList
            groups={docsNavGroups}
            onOpenSearch={() => setIsSearchOpen(true)}
            showSearchTrigger={!isSearchOpen}
          />
        </div>

        {/* Search overlay */}
        {isSearchOpen ? (
          <DocsSidebarSearchOverlay
            searchInputRef={searchInputRef}
            searchQuery={searchQuery}
            onSearchQueryChange={({ value }) => setSearchQuery(value)}
            filteredGroups={filteredGroups}
            onClose={closeSearch}
            onClear={clearSearch}
          />
        ) : null}
      </div>
    </aside>
  )
}
