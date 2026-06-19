import {
  DEMO_BUSY_SLOTS,
  DEMO_CALENDAR_SCHEMES,
  pickRandomCalendarEvents,
} from "@/tools/_lib/demo-calendar-data"
import {
  createMeetingInputSchema,
  type CreateMeetingResult,
} from "@/tools/create-meeting/types"
import { tool } from "ai"
import { addDays, format } from "date-fns"

const DEFAULT_ATTENDEES = [
  { name: "Margaret Chen", email: "margaret.chen@example.com", role: "Chair" },
  { name: "James Okonkwo", email: "james.okonkwo@example.com", role: "Secretary" },
  { name: "Sarah Nguyen", email: "sarah.nguyen@example.com", role: "Treasurer" },
]

/**
 * Creates a suggested meeting and busy slots for the interactive scheduler UI.
 */
export const createMeetingTool = tool({
  description:
    "Create a calendar meeting or event. Shows an interactive day/week/month scheduler with a suggested time slot the manager can drag, busy slots greyed out, and optional invite emails after creation.",
  inputSchema: createMeetingInputSchema,
  execute: async ({
    brief,
    title,
    schemeId,
    date,
    durationMinutes = 60,
  }): Promise<CreateMeetingResult> => {
    const scheme =
      DEMO_CALENDAR_SCHEMES.find(({ id }) => id === schemeId) ??
      DEMO_CALENDAR_SCHEMES[0]

    const meetingDate = date ?? format(addDays(new Date(), 1), "yyyy-MM-dd")
    const meetingTitle =
      title ??
      (brief.toLowerCase().includes("committee")
        ? "Committee meeting"
        : brief.toLowerCase().includes("agm")
          ? "AGM planning session"
          : "Scheme meeting")

    return {
      suggested: {
        title: meetingTitle,
        schemeId: scheme.id,
        schemeLabel: scheme.label,
        date: meetingDate,
        startTime: "10:30",
        durationMinutes,
        location: `${scheme.label} · Committee room / online`,
        attendees: DEFAULT_ATTENDEES,
        notes: brief.slice(0, 240),
      },
      busySlots: DEMO_BUSY_SLOTS,
    }
  },
})
