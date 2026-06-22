"use client"

import * as React from "react"

import { launchCoworkViaNavigation } from "@/lib/cowork-launch"

type LaunchCoworkFn = ({ prompt }: { prompt: string }) => void

const AgentLaunchContext = React.createContext<LaunchCoworkFn | null>(null)

interface AgentLaunchProviderProps {
  launch: LaunchCoworkFn
  children: React.ReactNode
}

/**
 * Supplies an in-app Cowork launcher when rendered inside AppPreview.
 */
export function AgentLaunchProvider({ launch, children }: AgentLaunchProviderProps) {
  return (
    <AgentLaunchContext.Provider value={launch}>{children}</AgentLaunchContext.Provider>
  )
}

/**
 * Opens Cowork with a preset prompt. Uses in-app navigation when inside AppPreview,
 * otherwise navigates to the full app preview route.
 */
export function useLaunchCowork(): LaunchCoworkFn {
  const launch = React.useContext(AgentLaunchContext)

  return React.useCallback(
    ({ prompt }: { prompt: string }) => {
      const trimmed = prompt.trim()

      if (!trimmed) {
        return
      }

      if (launch) {
        launch({ prompt: trimmed })
        return
      }

      launchCoworkViaNavigation({ prompt: trimmed })
    },
    [launch]
  )
}
