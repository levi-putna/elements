import { deriveConversationTitleFallback } from "@/lib/conversation-title"
import { generateText } from "ai"

export const maxDuration = 30

/**
 * Generates a short conversation title from the first user message.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { message } = body as { message?: string }

    if (!message?.trim()) {
      return Response.json({ error: "Message is required." }, { status: 400 })
    }

    const { text } = await generateText({
      model: "anthropic/claude-haiku-4.5",
      prompt: `Write a short conversation title (maximum 6 words) for a strata management assistant chat that begins with this user message. Use sentence case. Reply with only the title, no quotes or punctuation at the end.

User message:
${message.trim()}`,
    })

    const title = text.trim().replace(/^["']|["']$/g, "")

    return Response.json({
      title: title || deriveConversationTitleFallback({ message }),
    })
  } catch (error) {
    const fallbackMessage =
      error instanceof Error ? error.message : "Title generation failed."

    return Response.json({ error: fallbackMessage }, { status: 500 })
  }
}
