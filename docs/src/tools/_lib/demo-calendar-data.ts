/** Demo scheme options for calendar tool filters. */
export const DEMO_CALENDAR_SCHEMES = [
  { id: "SP1042", label: "Harbour View Towers" },
  { id: "SP4821", label: "Northbridge Estate" },
  { id: "SP12045", label: "Sunset Gardens" },
  { id: "SP2287", label: "Parkside Residences" },
] as const

/** Demo calendar events used when no scheme filter is applied. */
export const DEMO_CALENDAR_EVENT_POOL = [
  {
    id: "cal_agm",
    title: "AGM preparation call",
    schemeId: "SP1042",
    schemeLabel: "Harbour View Towers",
    date: "2026-06-19",
    time: "09:30",
    endTime: "10:00",
    kind: "meeting" as const,
  },
  {
    id: "cal_inspection",
    title: "Roof inspection",
    schemeId: "SP4821",
    schemeLabel: "Northbridge Estate",
    date: "2026-06-20",
    time: "11:00",
    endTime: "12:30",
    kind: "inspection" as const,
  },
  {
    id: "cal_levy",
    title: "Levy arrears review",
    schemeId: "SP12045",
    schemeLabel: "Sunset Gardens",
    date: "2026-06-21",
    time: "14:00",
    endTime: "14:45",
    kind: "deadline" as const,
  },
  {
    id: "cal_committee",
    title: "Committee meeting",
    schemeId: "SP2287",
    schemeLabel: "Parkside Residences",
    date: "2026-06-22",
    time: "16:00",
    endTime: "17:00",
    kind: "meeting" as const,
  },
  {
    id: "cal_hub",
    title: "Strata Hub lodgement",
    schemeId: "SP4821",
    schemeLabel: "Northbridge Estate",
    date: "2026-06-23",
    time: "10:00",
    endTime: "10:30",
    kind: "deadline" as const,
  },
  {
    id: "cal_agm2",
    title: "Pre-AGM walkthrough",
    schemeId: "SP1042",
    schemeLabel: "Harbour View Towers",
    date: "2026-06-24",
    time: "13:30",
    endTime: "14:30",
    kind: "agm" as const,
  },
]

/** Default busy slots for the meeting scheduler day view. */
export const DEMO_BUSY_SLOTS = [
  { id: "busy_1", start: "09:00", end: "10:00", title: "Daily stand-up" },
  { id: "busy_2", start: "13:00", end: "14:30", title: "Contractor site visit" },
  { id: "busy_3", start: "16:00", end: "17:00", title: "Levy review" },
]

/**
 * Picks a random subset of demo calendar events.
 */
export function pickRandomCalendarEvents({ count = 3 }: { count?: number } = {}) {
  const shuffled = [...DEMO_CALENDAR_EVENT_POOL].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

/**
 * Converts HH:mm to minutes from midnight.
 */
export function timeToMinutes({ time }: { time: string }): number {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

/**
 * Converts minutes from midnight to HH:mm.
 */
export function minutesToTime({ minutes }: { minutes: number }): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`
}
