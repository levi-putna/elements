import { createSchemeSetupAgent } from "@/agents/scheme-setup/agent"
import type { AssistantModelId } from "@/agents/_lib/models"
import { schemeSetupSchema } from "@/tools/scheme-setup/types"
import { tool } from "ai"
import { z } from "zod"

/**
 * Extracts scheme details via the scheme-setup sub-agent and returns a preview for the UI.
 */
export function createSetupSchemeTool({ model }: { model: AssistantModelId }) {
  const schemeSetup = createSchemeSetupAgent({ model })

  return tool({
    description:
      "Extract scheme registration details and show a create-scheme preview for manager approval.",
    inputSchema: z.object({
      brief: z
        .string()
        .describe(
          "Registration document summary or scheme details to extract and structure"
        ),
    }),
    execute: async ({ brief }, { abortSignal }) => {
      const result = await schemeSetup.generate({
        prompt: brief,
        abortSignal,
      })

      if (result.output) {
        return { ...result.output, reviewStatus: "pending" as const }
      }

      return {
        ...schemeSetupSchema.parse({
          name: "New scheme",
          planNumber: "SP TBC",
          location: "TBC",
          lots: 1,
          manager: "Sarah Chen",
          financialYearEnd: "30 Jun",
          registered: "TBC",
          status: "ONBOARDING",
          source: undefined,
        }),
        reviewStatus: "pending" as const,
      }
    },
  })
}
