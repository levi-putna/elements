import {
  createTodoListInputSchema,
  type CreateTodoListResult,
  type TodoItem,
} from "@/tools/todo-list/types"
import { tool } from "ai"

/**
 * Creates a structured todo list for the current conversation.
 * The list appears in the conversation todo bar and as an in-chat notice.
 */
export const createTodoListTool = tool({
  description:
    "Create a structured plan with trackable steps for a multi-step workflow. Use when the user asks for a plan, checklist, or todo list. Each item can be complete, in_progress, or pending.",
  inputSchema: createTodoListInputSchema,
  execute: async ({ title, items }): Promise<CreateTodoListResult> => {
    const resolvedItems: TodoItem[] = items.map((item, index) => ({
      id: `step-${index + 1}`,
      label: item.label,
      status: item.status ?? "pending",
    }))

    return {
      id: crypto.randomUUID(),
      title,
      items: resolvedItems,
    }
  },
})
