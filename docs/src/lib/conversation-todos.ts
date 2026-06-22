import type { AssistantUIMessage } from "@/agents/types"
import type {
  ConversationTodoList,
  CreateTodoListResult,
  TodoItem,
} from "@/tools/todo-list/types"

/**
 * Counts completed and total todo items.
 */
export function countTodoProgress({ items }: { items: TodoItem[] }): {
  complete: number
  total: number
} {
  const complete = items.filter((item) => item.status === "complete").length

  return {
    complete,
    total: items.length,
  }
}

/**
 * Extracts conversation todo lists from assistant tool parts, oldest first.
 */
export function extractConversationTodoLists({
  messages,
}: {
  messages: AssistantUIMessage[]
}): ConversationTodoList[] {
  const lists: ConversationTodoList[] = []

  for (const message of messages) {
    if (message.role !== "assistant") {
      continue
    }

    for (const part of message.parts) {
      if (part.type !== "tool-createTodoList" || part.state !== "output-available") {
        continue
      }

      const output = part.output as CreateTodoListResult | undefined

      if (!output?.items?.length) {
        continue
      }

      lists.push({
        id: output.id,
        title: output.title,
        items: output.items,
        messageId: message.id,
        toolCallId: part.toolCallId,
        createdAt: lists.length,
      })
    }
  }

  return lists
}
