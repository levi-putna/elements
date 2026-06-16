"use client"

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ui/conversation"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse,
} from "@/components/ui/message"
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSpeech,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ui/prompt-input"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { ChatStatus } from "ai"
import { CheckIcon, CopyIcon, PlusIcon, RefreshCcwIcon, SparklesIcon } from "lucide-react"
import { nanoid } from "nanoid"
import Link from "next/link"
import { useCallback, useRef, useState } from "react"

type ChatRole = "user" | "assistant"

interface ChatMessage {
  id: string
  role: ChatRole
  text: string
}

const SUGGESTIONS = [
  "What can this assistant do?",
  "Show me a markdown example",
  "Write a haiku about strata living",
  "Explain how the Conversation component works",
]

const THIN_SUGGESTIONS = ["What can you do?", "Markdown example"]

const MODELS = [
  { value: "opus", label: "Claude Opus 4.8" },
  { value: "sonnet", label: "Claude Sonnet 4.6" },
  { value: "haiku", label: "Claude Haiku 4.5" },
]

/**
 * Picks a canned, markdown-rich reply based on the prompt and conversation so far.
 */
function mockReply(prompt: string, history: ChatMessage[]): string {
  const text = prompt.toLowerCase()
  const turn = history.filter((m) => m.role === "user").length

  if (text.includes("markdown") || text.includes("example")) {
    return `Here's a quick tour of the markdown this assistant can render:

## Headings keep their hierarchy

- **Bold**, *italic*, and \`inline code\`
- Ordered and unordered lists
- Links like [the docs](/elements)

\`\`\`ts
function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`

> Block quotes work too, handy for callouts.

All of it streams in token by token, just like a real model response.`
  }

  if (text.includes("haiku")) {
    return `Sure, a haiku for strata living:

> Shared walls, single roof,
> a hundred quiet neighbours
> split one winter bill.`
  }

  if (text.includes("conversation") && text.includes("component")) {
    return `The **Conversation** component is a scroll container built on \`use-stick-to-bottom\`.

1. It **auto-scrolls** to the newest message as replies stream in.
2. When you scroll up, a **scroll-to-bottom** button appears (\`ConversationScrollButton\`).
3. \`ConversationContent\` is the inner flex column — set the gap between messages there.
4. \`ConversationEmptyState\` renders the placeholder you saw before this chat started.

This page wires it to \`PromptInput\` and \`Message\` to form a full assistant layout.`
  }

  if (text.includes("what can") || text.includes("do?") || turn <= 1) {
    return `I'm a **mocked assistant** demonstrating the Elements AI components working together:

- **PromptInput** — the composer at the bottom (try Shift+Enter for a newline)
- **Conversation** — the scrolling message list, pinned to the latest reply
- **Message** — these chat bubbles, with streamed markdown responses

I don't call a real model, so my answers are canned — but the layout, streaming, and interactions are the real thing. Ask for a *"markdown example"* to see formatting in action.`
  }

  return `You said: "${prompt}".

This is a self-contained demo, so I'm echoing rather than reasoning — but in a real build you'd swap \`mockReply\` for the Vercel AI SDK's \`useChat\` and a model provider. That's message #${turn} in our conversation.`
}

export interface AssistantPreviewProps {
  /** When true, fills the viewport height for the full-screen preview route. */
  fullScreen?: boolean
  /** Compact sidebar width for panels docked beside main app content. */
  thin?: boolean
  /** Show a link back to the assistant docs (full-screen preview only). */
  showDocsLink?: boolean
  className?: string
}

/**
 * Interactive assistant layout preview for the documentation site.
 */
export function AssistantPreview({
  fullScreen = false,
  thin = false,
  showDocsLink = fullScreen,
  className,
}: AssistantPreviewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>("ready")
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [model, setModel] = useState("opus")
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const stopStreaming = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setStatus("ready")
  }, [])

  const streamReply = useCallback((fullText: string) => {
    const assistantId = nanoid()
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", text: "" }])
    setStatus("streaming")

    let index = 0
    timerRef.current = setInterval(() => {
      index = Math.min(index + 3, fullText.length)
      const slice = fullText.slice(0, index)
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, text: slice } : m))
      )
      if (index >= fullText.length && timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
        setStatus("ready")
      }
    }, 16)
  }, [])

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || status === "streaming" || status === "submitted") return

      const userMessage: ChatMessage = { id: nanoid(), role: "user", text: trimmed }
      const history = [...messages, userMessage]
      const reply = mockReply(trimmed, history)
      setMessages(history)
      setStatus("submitted")
      window.setTimeout(() => streamReply(reply), 120)
    },
    [messages, status, streamReply]
  )

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      send(message.text)
    },
    [send]
  )

  const handleCopy = useCallback((message: ChatMessage) => {
    navigator.clipboard?.writeText(message.text)
    setCopiedId(message.id)
    setTimeout(() => setCopiedId((id) => (id === message.id ? null : id)), 1500)
  }, [])

  const regenerate = useCallback(() => {
    if (status === "streaming" || status === "submitted") return
    const lastUser = [...messages].reverse().find((m) => m.role === "user")
    if (!lastUser) return
    const trimmed =
      messages[messages.length - 1]?.role === "assistant" ? messages.slice(0, -1) : messages
    const reply = mockReply(lastUser.text, trimmed)
    setMessages(trimmed)
    setStatus("submitted")
    window.setTimeout(() => streamReply(reply), 120)
  }, [messages, status, streamReply])

  const newChat = useCallback(() => {
    stopStreaming()
    setMessages([])
  }, [stopStreaming])

  const isBusy = status === "streaming" || status === "submitted"
  const lastMessage = messages.at(-1)
  const suggestions = thin ? THIN_SUGGESTIONS : SUGGESTIONS

  return (
    <div
      className={cn(
        "flex flex-col bg-background",
        thin && "w-80 shrink-0",
        fullScreen ? "h-dvh" : thin ? "h-full min-h-[480px]" : "h-[min(70vh,640px)]",
        className
      )}
    >
      {/* Header */}
      <header
        className={cn(
          "flex shrink-0 items-center justify-between border-b border-border",
          thin ? "px-3 py-2" : "px-4 py-3"
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-sm bg-foreground text-background",
              thin ? "size-6" : "size-7"
            )}
          >
            <SparklesIcon className={thin ? "size-3.5" : "size-4"} />
          </div>
          <div className={cn("min-w-0 leading-tight", thin && "truncate")}>
            <p className="text-sm font-semibold text-foreground">Assistant</p>
            {!thin && (
              <p className="text-xs text-muted-foreground">Elements demo · mocked replies</p>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {thin ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={newChat}
                      aria-label="New chat"
                      className="inline-flex size-8 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-muted"
                    >
                      <PlusIcon className="size-4" />
                    </button>
                  }
                />
                <TooltipContent side="bottom">New chat</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <button
              type="button"
              onClick={newChat}
              className="inline-flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <PlusIcon className="size-3.5" />
              New chat
            </button>
          )}
          {showDocsLink && (
            <Link
              href="/components/assistant"
              className="hidden text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:inline"
            >
              View docs
            </Link>
          )}
        </div>
      </header>

      {/* Conversation */}
      <Conversation className="flex-1">
        <ConversationContent
          className={cn(
            "mx-auto w-full",
            thin ? "gap-4 p-3" : "max-w-3xl gap-8 p-4"
          )}
        >
          {messages.length === 0 ? (
            <ConversationEmptyState
              className={
                fullScreen ? "min-h-[60vh]" : thin ? "min-h-[240px]" : "min-h-[320px]"
              }
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-sm bg-muted text-muted-foreground",
                    thin ? "size-10" : "size-12"
                  )}
                >
                  <SparklesIcon className={thin ? "size-5" : "size-6"} />
                </div>
                <div className="space-y-1 text-center">
                  <h3 className="font-medium text-sm">How can I help?</h3>
                  <p className="text-muted-foreground text-sm">
                    {thin
                      ? "Ask below or pick a starter:"
                      : "Ask anything below, or start with one of these:"}
                  </p>
                </div>
                <div
                  className={cn(
                    "mt-2 flex gap-2",
                    thin ? "w-full flex-col" : "flex-wrap justify-center"
                  )}
                >
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className={cn(
                        "rounded-sm border border-border text-xs text-foreground transition-colors hover:bg-muted",
                        thin ? "w-full px-3 py-2 text-left" : "px-3 py-1.5"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </ConversationEmptyState>
          ) : (
            messages.map((message) => (
              <Message
                key={message.id}
                from={message.role}
                className={thin ? "max-w-full gap-1.5" : undefined}
              >
                <MessageContent className={thin ? "text-xs" : undefined}>
                  <MessageResponse
                    isAnimating={status === "streaming" && message.id === lastMessage?.id}
                  >
                    {message.text}
                  </MessageResponse>
                </MessageContent>
                {message.role === "assistant" && message.text && !thin && (
                  <MessageActions className="opacity-0 transition-opacity group-hover:opacity-100">
                    <MessageAction
                      tooltip={copiedId === message.id ? "Copied" : "Copy"}
                      onClick={() => handleCopy(message)}
                    >
                      {copiedId === message.id ? (
                        <CheckIcon className="size-4" />
                      ) : (
                        <CopyIcon className="size-4" />
                      )}
                    </MessageAction>
                    {message.id === lastMessage?.id && !isBusy && (
                      <MessageAction tooltip="Regenerate" onClick={regenerate}>
                        <RefreshCcwIcon className="size-4" />
                      </MessageAction>
                    )}
                  </MessageActions>
                )}
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Composer */}
      <div className={cn("shrink-0", thin ? "px-3 pb-3" : "px-4 pb-4")}>
        <div className={cn("mx-auto w-full", !thin && "max-w-3xl")}>
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputTextarea
              placeholder={thin ? "Ask anything…" : "Message the assistant…"}
            />
            <PromptInputFooter className={thin ? "justify-end" : undefined}>
              {!thin && (
                <PromptInputTools>
                  <PromptInputSelect
                    value={model}
                    onValueChange={(value) => setModel(value as string)}
                  >
                    <PromptInputSelectTrigger>
                      <PromptInputSelectValue>
                        {MODELS.find((m) => m.value === model)?.label}
                      </PromptInputSelectValue>
                    </PromptInputSelectTrigger>
                    <PromptInputSelectContent>
                      {MODELS.map((m) => (
                        <PromptInputSelectItem key={m.value} value={m.value}>
                          {m.label}
                        </PromptInputSelectItem>
                      ))}
                    </PromptInputSelectContent>
                  </PromptInputSelect>
                  <PromptInputSpeech />
                </PromptInputTools>
              )}
              <PromptInputSubmit status={status} onStop={stopStreaming} />
            </PromptInputFooter>
          </PromptInput>
          {fullScreen && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Responses are mocked for this demo. Swap <code className="font-mono">mockReply</code>{" "}
              for <code className="font-mono">useChat</code> to go live.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
