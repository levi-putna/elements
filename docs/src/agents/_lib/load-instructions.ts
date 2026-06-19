import { readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * Loads an agent's system prompt from its `instructions.md` file.
 */
export function loadInstructions({ agentDir }: { agentDir: string }): string {
  const filePath = join(agentDir, "instructions.md")
  return readFileSync(filePath, "utf-8").trim()
}
