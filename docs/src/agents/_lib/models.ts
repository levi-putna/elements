/** Gateway model identifiers for the assistant preview model picker. */
export const ASSISTANT_MODELS = [
  { value: "anthropic/claude-opus-4.6", label: "Claude Opus 4.6" },
  { value: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
  { value: "anthropic/claude-haiku-4.5", label: "Claude Haiku 4.5" },
] as const

export type AssistantModelId = (typeof ASSISTANT_MODELS)[number]["value"]

/** Default model when none is selected. */
export const DEFAULT_ASSISTANT_MODEL: AssistantModelId =
  "anthropic/claude-sonnet-4.6"

/**
 * Resolves a model id from the chat request body, falling back to the default.
 */
export function resolveModelId({
  model,
}: {
  model?: string
}): AssistantModelId {
  const match = ASSISTANT_MODELS.find(({ value }) => value === model)
  return match?.value ?? DEFAULT_ASSISTANT_MODEL
}
