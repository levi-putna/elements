import {
  randomNumberInputSchema,
  type RandomNumberResult,
} from "@/tools/random-number/types"
import { tool } from "ai"

/**
 * Generates a random integer between min and max (inclusive).
 * Requires manager approval before execution (for testing tool approval flows).
 */
export const randomNumberTool = tool({
  description:
    "Generate a random integer between a minimum and maximum value (inclusive). Requires approval before running.",
  inputSchema: randomNumberInputSchema,
  needsApproval: true,
  execute: async ({ min, max }): Promise<RandomNumberResult> => {
    const lower = Math.min(min, max)
    const upper = Math.max(min, max)
    const value = lower + Math.floor(Math.random() * (upper - lower + 1))

    return { min: lower, max: upper, value }
  },
})
