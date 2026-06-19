import { createAssistantAgent } from "@/agents/assistant/agent"
import { resolveModelId } from "@/agents/_lib/models"
import { createAgentUIStreamResponse } from "ai"

export const maxDuration = 60

/**
 * Streams assistant responses via the Vercel AI Gateway.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { messages, model: modelParam } = body as {
      messages: unknown[]
      model?: string
    }

    const model = resolveModelId({ model: modelParam })
    const agent = createAssistantAgent({ model })

    return createAgentUIStreamResponse({
      agent,
      uiMessages: messages,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The chat request could not be completed."

    return Response.json({ error: message }, { status: 500 })
  }
}
