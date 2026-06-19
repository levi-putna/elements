export { assistantAgent, createAssistantAgent } from "@/agents/assistant/agent"
export type { AssistantAgent } from "@/agents/assistant/agent"
export { createEmailDrafterAgent } from "@/agents/email-drafter/agent"
export { createSchemeSetupAgent } from "@/agents/scheme-setup/agent"
export {
  ASSISTANT_MODELS,
  DEFAULT_ASSISTANT_MODEL,
  resolveModelId,
  type AssistantModelId,
} from "@/agents/_lib/models"
export type { AssistantUIMessage } from "@/agents/types"

import type { InferAgentUIMessage } from "ai"
import type { assistantAgent } from "@/agents/assistant/agent"

/** Typed UI messages inferred from the default assistant agent (server-side). */
export type InferredAssistantUIMessage = InferAgentUIMessage<typeof assistantAgent>
