import { z } from "zod"

/** Input for generating a random integer in an inclusive range. */
export const randomNumberInputSchema = z.object({
  min: z.number().int().describe("Minimum value (inclusive)"),
  max: z.number().int().describe("Maximum value (inclusive)"),
})

/** Result returned after the tool runs. */
export const randomNumberResultSchema = z.object({
  min: z.number().int(),
  max: z.number().int(),
  value: z.number().int(),
})

export type RandomNumberInput = z.infer<typeof randomNumberInputSchema>
export type RandomNumberResult = z.infer<typeof randomNumberResultSchema>
