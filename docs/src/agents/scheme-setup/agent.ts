import { loadInstructions } from "@/agents/_lib/load-instructions"
import type { AssistantModelId } from "@/agents/_lib/models"
import { schemeSetupSchema } from "@/tools/scheme-setup/types"
import { Output, ToolLoopAgent } from "ai"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const agentDir = dirname(fileURLToPath(import.meta.url))

/**
 * Specialist sub-agent for scheme registration and onboarding previews.
 */
export function createSchemeSetupAgent({ model }: { model: AssistantModelId }) {
  return new ToolLoopAgent({
    model,
    instructions: loadInstructions({ agentDir }),
    output: Output.object({
      schema: schemeSetupSchema,
    }),
  })
}

export type SchemeSetupAgent = ReturnType<typeof createSchemeSetupAgent>
