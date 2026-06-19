import { z } from "zod"

/** Structured scheme setup preview for manager approval. */
export const schemeSetupSchema = z.object({
  name: z.string().describe("Scheme or building name"),
  planNumber: z.string().describe("Strata plan number, for example SP 4821"),
  location: z.string().describe("Suburb and state"),
  lots: z.number().int().positive().describe("Number of lots"),
  manager: z.string().describe("Assigned strata manager"),
  financialYearEnd: z.string().describe("Financial year end, for example 30 Jun"),
  registered: z.string().describe("Registration date"),
  status: z.enum(["ONBOARDING", "ACTIVE", "INACTIVE"]).describe("Scheme status"),
  source: z.string().optional().describe("Source document filename"),
})

export type SchemeSetupPreview = z.infer<typeof schemeSetupSchema>
