import { loadInstructions } from "@/agents/_lib/load-instructions"
import type { AssistantModelId } from "@/agents/_lib/models"
import { emailDraftSchema } from "@/tools/email-draft/types"
import { Output, ToolLoopAgent } from "ai"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const agentDir = dirname(fileURLToPath(import.meta.url))

/**
 * Specialist sub-agent for drafting strata manager emails with structured output.
 */
export function createEmailDrafterAgent({ model }: { model: AssistantModelId }) {
  return new ToolLoopAgent({
    model,
    instructions: loadInstructions({ agentDir }),
    output: Output.object({
      schema: emailDraftSchema,
    }),
  })
}

export type EmailDrafterAgent = ReturnType<typeof createEmailDrafterAgent>
