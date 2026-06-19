import { loadInstructions } from "@/agents/_lib/load-instructions"
import {
  DEFAULT_ASSISTANT_MODEL,
  type AssistantModelId,
} from "@/agents/_lib/models"
import { createDraftEmailTool } from "@/tools/email-draft/tool"
import { randomNumberTool } from "@/tools/random-number/tool"
import { createSetupSchemeTool } from "@/tools/scheme-setup/tool"
import { ToolLoopAgent } from "ai"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

const agentDir = dirname(fileURLToPath(import.meta.url))

/**
 * Main Cowork agent for strata managers.
 */
export function createAssistantAgent({ model }: { model: AssistantModelId }) {
  return new ToolLoopAgent({
    model,
    instructions: loadInstructions({ agentDir }),
    tools: {
      draftEmail: createDraftEmailTool({ model }),
      setupScheme: createSetupSchemeTool({ model }),
      randomNumber: randomNumberTool,
    },
  })
}

/** Default Cowork instance for the docs preview. */
export const assistantAgent = createAssistantAgent({
  model: DEFAULT_ASSISTANT_MODEL,
})

export type AssistantAgent = ReturnType<typeof createAssistantAgent>
