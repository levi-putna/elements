import { assetPath } from "@/lib/utils"

/** Session storage key for a prompt queued before navigating to Cowork. */
export const PENDING_COWORK_PROMPT_KEY = "elements.pendingCoworkPrompt"

/**
 * Stores a prompt to send when the app preview opens Cowork.
 */
export function stashCoworkPrompt({ prompt }: { prompt: string }) {
  sessionStorage.setItem(PENDING_COWORK_PROMPT_KEY, prompt)
}

/**
 * Reads and clears a queued Cowork prompt, if any.
 */
export function consumeCoworkPrompt(): string | null {
  const prompt = sessionStorage.getItem(PENDING_COWORK_PROMPT_KEY)

  if (prompt) {
    sessionStorage.removeItem(PENDING_COWORK_PROMPT_KEY)
  }

  return prompt
}

/**
 * Navigates to the full app preview and opens Cowork with the given prompt.
 */
export function launchCoworkViaNavigation({ prompt }: { prompt: string }) {
  stashCoworkPrompt({ prompt })
  window.location.assign(assetPath("/preview/app/"))
}
