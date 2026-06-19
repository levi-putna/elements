import { z } from "zod"

export const meetingAttendeeSchema = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string().optional(),
})

export const busySlotSchema = z.object({
  id: z.string(),
  start: z.string().describe("HH:mm"),
  end: z.string().describe("HH:mm"),
  title: z.string(),
})

export const suggestedMeetingSchema = z.object({
  title: z.string(),
  schemeId: z.string(),
  schemeLabel: z.string(),
  date: z.string().describe("ISO date YYYY-MM-DD"),
  startTime: z.string().describe("Suggested start HH:mm"),
  durationMinutes: z.number().int().positive(),
  location: z.string(),
  attendees: z.array(meetingAttendeeSchema),
  notes: z.string().optional(),
})

export const meetingInviteDraftSchema = z.object({
  to: z.string(),
  from: z.string(),
  subject: z.string(),
  body: z.string(),
  attachments: z.array(
    z.object({
      name: z.string(),
      size: z.string(),
      type: z.enum(["pdf", "xlsx", "doc", "other"]),
    })
  ),
})

export const createMeetingInputSchema = z.object({
  brief: z
    .string()
    .describe(
      "Meeting purpose, scheme, attendees, preferred date or time, and any context from the user"
    ),
  title: z.string().optional(),
  schemeId: z.string().optional(),
  date: z.string().optional().describe("Preferred date YYYY-MM-DD"),
  durationMinutes: z.number().int().positive().optional(),
})

export const createMeetingOutputSchema = z.object({
  suggested: suggestedMeetingSchema,
  busySlots: z.array(busySlotSchema),
})

export type SuggestedMeeting = z.infer<typeof suggestedMeetingSchema>
export type BusySlot = z.infer<typeof busySlotSchema>
export type MeetingInviteDraft = z.infer<typeof meetingInviteDraftSchema>
export type CreateMeetingResult = z.infer<typeof createMeetingOutputSchema>
