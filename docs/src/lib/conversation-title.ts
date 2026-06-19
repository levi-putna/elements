/** Placeholder label for chats that do not yet have a generated title. */
export const NEW_CONVERSATION_TITLE = "New conversation"

/**
 * Derives a short fallback title from the first user message when generation fails.
 */
export function deriveConversationTitleFallback({
  message,
  maxLength = 48,
}: {
  message: string
  maxLength?: number
}): string {
  const normalised = message.replace(/\s+/g, " ").trim()
  if (!normalised) {
    return NEW_CONVERSATION_TITLE
  }

  const firstLine = normalised.split("\n")[0] ?? normalised
  if (firstLine.length <= maxLength) {
    return firstLine
  }

  return `${firstLine.slice(0, maxLength - 1).trimEnd()}…`
}
