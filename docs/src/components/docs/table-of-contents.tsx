"use client"

import { startTransition, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: 2 | 3
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
}

/** Ensures heading ids stay unique when demo pages repeat the same title. */
function ensureUniqueId({ baseId, usedIds }: { baseId: string; usedIds: Set<string> }) {
  if (!usedIds.has(baseId)) {
    usedIds.add(baseId)
    return baseId
  }

  let suffix = 2
  let uniqueId = `${baseId}-${suffix}`
  while (usedIds.has(uniqueId)) {
    suffix += 1
    uniqueId = `${baseId}-${suffix}`
  }

  usedIds.add(uniqueId)
  return uniqueId
}

export function TableOfContents() {
  const pathname = usePathname()
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState("")
  const [hovered, setHovered] = useState(false)

  // Re-scan headings when route changes
  useEffect(() => {
    const main = document.querySelector("main")
    if (!main) return

    const els = Array.from(main.querySelectorAll("h2, h3")) as HTMLElement[]
    const usedIds = new Set<string>()
    const items: Heading[] = els
      .filter((el) => el.textContent?.trim())
      .map((el) => {
        const baseId = el.id || slugify(el.textContent ?? "")
        const id = ensureUniqueId({ baseId, usedIds })
        if (el.id !== id) {
          el.id = id
        }
        return {
          id,
          text: el.textContent?.trim() ?? "",
          level: (el.tagName === "H3" ? 3 : 2) as 2 | 3,
        }
      })

    startTransition(() => {
      setHeadings(items)
      setActiveId(items[0]?.id ?? "")
    })
  }, [pathname])

  // Intersection observer: tracks which heading is in view
  useEffect(() => {
    if (!headings.length) return
    const main = document.querySelector("main")

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible.length) setActiveId(visible[0].target.id)
      },
      { root: main, rootMargin: "-10% 0px -55% 0px", threshold: 0 }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [headings])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const main = document.querySelector("main")
    if (!main) return
    const offset = el.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop - 80
    main.scrollTo({ top: offset, behavior: "smooth" })
  }

  if (headings.length < 2) return null

  return (
    <div className="fixed right-5 top-20 z-30 hidden xl:block">
      {/* Hover zone: only the compressed lines column; popover is absolute so it does not widen the hit area */}
      <div
        className="relative inline-flex"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Text popover: slides in from the lines column on hover */}
        <div
          className={cn(
            "absolute top-0 right-full pr-3 transition-all duration-200 ease-out",
            hovered
              ? "opacity-100 translate-x-0 pointer-events-auto"
              : "opacity-0 translate-x-2 pointer-events-none"
          )}
        >
          <div className="rounded-sm border border-border bg-card shadow-md py-2 w-48">
            <p className="text-[9px] font-semibold uppercase tracking-widest text-ink-muted/60 px-3 pb-1.5">
              On this page
            </p>
            {headings.map(({ id, text, level }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={cn(
                  "w-full text-left px-3 py-1 text-xs transition-colors duration-100 no-underline",
                  level === 3 && "pl-5",
                  activeId === id
                    ? "text-foreground font-medium"
                    : "text-ink-muted hover:text-foreground"
                )}
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* Lines column */}
        <div className="flex flex-col gap-[5px] cursor-pointer">
        {headings.map(({ id, level }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            aria-label={`Go to section`}
            className={cn(
              "block h-px rounded-full transition-all duration-200 cursor-pointer",
              level === 2 ? "w-5" : "w-3 ml-2",
              activeId === id
                ? "bg-foreground h-0.5"
                : hovered
                  ? "bg-foreground/30 hover:bg-foreground/60"
                  : "bg-foreground/20"
            )}
          />
        ))}
        </div>
      </div>
    </div>
  )
}
