import {
  DEMO_CALENDAR_SCHEMES,
  pickRandomCalendarEvents,
} from "@/tools/_lib/demo-calendar-data"
import {
  checkCalendarInputSchema,
  type CheckCalendarResult,
} from "@/tools/check-calendar/types"
import { tool } from "ai"

/**
 * Returns calendar events for the manager schedule preview.
 * When a specific scheme is filtered, returns an empty list (demo behaviour).
 */
export const checkCalendarTool = tool({
  description:
    "Check the strata manager calendar with optional filters (scheme, date range, event type). Returns upcoming events. Pass schemeId when the user asks about a specific scheme.",
  inputSchema: checkCalendarInputSchema,
  execute: async ({
    schemeId,
    dateFrom,
    dateTo,
    eventKind = "all",
  }): Promise<CheckCalendarResult> => {
    const scheme = schemeId
      ? DEMO_CALENDAR_SCHEMES.find(({ id }) => id === schemeId)
      : undefined

    const filters = {
      schemeId: schemeId ?? null,
      schemeLabel: scheme?.label ?? null,
      dateFrom: dateFrom ?? null,
      dateTo: dateTo ?? null,
      eventKind,
    }

    if (schemeId) {
      return {
        filters,
        events: [],
        availableSchemes: [...DEMO_CALENDAR_SCHEMES],
      }
    }

    let events = pickRandomCalendarEvents({ count: 3 })

    if (eventKind !== "all") {
      events = events.filter(({ kind }) => kind === eventKind)
    }

    return {
      filters,
      events,
      availableSchemes: [...DEMO_CALENDAR_SCHEMES],
    }
  },
})
