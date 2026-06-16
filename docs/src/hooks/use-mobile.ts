import * as React from "react"

const MOBILE_BREAKPOINT = 768

function subscribeToMobileQuery(onChange: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
  mql.addEventListener("change", onChange)
  return () => mql.removeEventListener("change", onChange)
}

function getIsMobileSnapshot() {
  return window.innerWidth < MOBILE_BREAKPOINT
}

/**
 * Returns whether the viewport is below the mobile breakpoint.
 */
export function useIsMobile() {
  return React.useSyncExternalStore(
    subscribeToMobileQuery,
    getIsMobileSnapshot,
    () => false
  )
}
