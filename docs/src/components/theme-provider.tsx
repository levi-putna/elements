"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Wraps the app with next-themes so light, dark, and system preferences apply via the `.dark` class.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // next-themes injects a blocking script to prevent theme flash on first paint.
  // React 19 rejects executable script tags inside client components on re-render.
  // SSR keeps the default script type; client re-renders use a non-executable type.
  const scriptProps = React.useMemo(
    () =>
      typeof window === "undefined"
        ? undefined
        : ({ type: "application/json" } as const),
    []
  )

  return (
    <NextThemesProvider {...props} scriptProps={scriptProps}>
      {children}
    </NextThemesProvider>
  )
}
