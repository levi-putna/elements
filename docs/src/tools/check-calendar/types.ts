import { z } from "zod"

export const calendarEventKindSchema = z.enum([
  "meeting",
  "inspection",
  "deadline",
  "agm",
])

export const calendarEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  schemeId: z.string(),
  schemeLabel: z.string(),
  date: z.string().describe("ISO date YYYY-MM-DD"),
  time: z.string().describe("Start time HH:mm"),
  endTime: z.string().describe("End time HH:mm"),
  kind: calendarEventKindSchema,
})

export const checkCalendarInputSchema = z.object({
  schemeId: z
    .string()
    .optional()
    .describe(
      "Optional scheme plan id filter. When set, returns no events (demo empty state)."
    ),
  dateFrom: z.string().optional().describe("Optional start date filter (YYYY-MM-DD)"),
  dateTo: z.string().optional().describe("Optional end date filter (YYYY-MM-DD)"),
  eventKind: z
    .enum(["all", "meeting", "inspection", "deadline", "agm"])
    .optional()
    .describe("Optional event type filter"),
})

export const checkCalendarOutputSchema = z.object({
  filters: z.object({
    schemeId: z.string().nullable(),
    schemeLabel: z.string().nullable(),
    dateFrom: z.string().nullable(),
    dateTo: z.string().nullable(),
    eventKind: z.string(),
  }),
  events: z.array(calendarEventSchema),
  availableSchemes: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
    })
  ),
})

export type CalendarEvent = z.infer<typeof calendarEventSchema>
export type CheckCalendarInput = z.infer<typeof checkCalendarInputSchema>
export type CheckCalendarResult = z.infer<typeof checkCalendarOutputSchema>
