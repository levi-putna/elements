import { z } from "zod"

/** Status of a single todo item in a conversation plan. */
export type TodoItemStatus = "complete" | "in_progress" | "pending"

/** A single step in a conversation todo list. */
export type TodoItem = {
  id: string
  label: string
  status: TodoItemStatus
}

/** A todo list attached to a Cowork conversation session. */
export type ConversationTodoList = {
  id: string
  title: string
  items: TodoItem[]
  messageId: string
  toolCallId: string
  createdAt: number
}

export const todoItemStatusSchema = z.enum(["complete", "in_progress", "pending"])

export const todoItemInputSchema = z.object({
  label: z.string().describe("Short action label for this step"),
  status: todoItemStatusSchema
    .optional()
    .describe("Step status. Defaults to pending for new steps."),
})

export const createTodoListInputSchema = z.object({
  title: z.string().describe("Plan title shown in the conversation todo bar"),
  items: z
    .array(todoItemInputSchema)
    .min(1)
    .describe("Ordered list of steps for the manager to track"),
})

export type CreateTodoListInput = z.infer<typeof createTodoListInputSchema>

export type CreateTodoListResult = {
  id: string
  title: string
  items: TodoItem[]
}
