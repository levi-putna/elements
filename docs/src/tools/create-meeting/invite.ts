import { minutesToTime, timeToMinutes } from "@/tools/_lib/demo-calendar-data"
import type { MeetingInviteDraft } from "@/tools/create-meeting/types"

/**
 * Builds a meeting invite email draft for the scheduler card.
 */
export function buildMeetingInviteDraft({
  title,
  schemeLabel,
  date,
  startTime,
  durationMinutes,
  location,
  attendees,
}: {
  title: string
  schemeLabel: string
  date: string
  startTime: string
  durationMinutes: number
  location: string
  attendees: { name: string; email: string }[]
}): MeetingInviteDraft {
  const endMinutes = timeToMinutes({ time: startTime }) + durationMinutes
  const endTime = minutesToTime({ minutes: endMinutes })
  const attendeeNames = attendees.map(({ name }) => name).join(", ")

  return {
    to: attendees.map(({ name, email }) => `${name} <${email}>`).join(", "),
    from: "Levi Putna <levi@instantstrata.com>",
    subject: `Invitation: ${title} · ${schemeLabel}`,
    body: `Hi all,

You're invited to the following meeting for ${schemeLabel}:

${title}
Date: ${date}
Time: ${startTime} – ${endTime}
Location: ${location}

Attendees: ${attendeeNames}

Please find the calendar invite attached. Let me know if you cannot attend.

Kind regards,
Levi Putna
Strata Manager`,
    attachments: [
      {
        name: `${title.toLowerCase().replace(/\s+/g, "-")}.ics`,
        size: "4 KB",
        type: "other",
      },
    ],
  }
}
