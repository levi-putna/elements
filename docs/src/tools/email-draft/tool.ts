import { createEmailDrafterAgent } from "@/agents/email-drafter/agent"
import type { AssistantModelId } from "@/agents/_lib/models"
import { emailDraftSchema } from "@/tools/email-draft/types"
import { tool } from "ai"
import { z } from "zod"

/**
 * Drafts an email via the email-drafter sub-agent and returns a preview payload for the UI.
 */
export function createDraftEmailTool({ model }: { model: AssistantModelId }) {
  const emailDrafter = createEmailDrafterAgent({ model })

  return tool({
    description:
      "Draft a professional email for a strata manager. Shows an interactive preview with Send in the header.",
    inputSchema: z.object({
      brief: z
        .string()
        .describe(
          "Full brief: audience, scheme name and plan, tone, purpose, signatory, and any dates or attachments"
        ),
    }),
    execute: async ({ brief }, { abortSignal }) => {
      const result = await emailDrafter.generate({
        prompt: brief,
        abortSignal,
      })

      if (result.output) {
        return { ...result.output, status: "ready" as const }
      }

      return emailDraftSchema.parse({
        to: "Committee members",
        from: "Sarah Chen <s.chen@instantstrata.com.au>",
        subject: "Strata correspondence",
        body: result.text,
        attachments: [],
        status: "ready",
      })
    },
  })
}
