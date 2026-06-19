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
  MessageMentionText,
  MessageResponse,
} from "@/components/ui/message"
import {
  PromptInput,
  PromptInputFooter,
  PromptInputMentionEditor,
  PromptInputSelect,
  PromptInputSelectContent,
  PromptInputSelectItem,
  PromptInputSelectTrigger,
  PromptInputSelectValue,
  PromptInputSpeech,
  PromptInputSubmit,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ui/prompt-input"
import {
  ASSISTANT_MODELS,
  DEFAULT_ASSISTANT_MODEL,
} from "@/agents/_lib/models"
import type { AssistantUIMessage } from "@/agents/types"
import { cn, assetPath } from "@/lib/utils"
import {
  deriveConversationTitleFallback,
  NEW_CONVERSATION_TITLE,
} from "@/lib/conversation-title"
import { DraftEmailCard, DraftEmailCardLoading } from "@/tools/email-draft/draft-email-card"
import type { EmailDraft } from "@/tools/email-draft/types"
import { SchemeSetupCard } from "@/tools/scheme-setup/scheme-setup-card"
import type { SchemeSetupPreview } from "@/tools/scheme-setup/types"
import { RandomNumberCard } from "@/tools/random-number/random-number-card"
import type { RandomNumberResult } from "@/tools/random-number/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useChat } from "@ai-sdk/react"
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
  type ChatStatus,
} from "ai"
import { CheckIcon, CopyIcon, PlusIcon, RefreshCcwIcon, SparklesIcon } from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"

const SUGGESTIONS = [
  "Generate a random number between 1 and 100",
  "Draft an email welcoming the committee of Marina Heights (SP 4821)",
  "Set up a new scheme from SP4821_Registration.pdf",
  "What can you help me with as a strata manager?",
]

const THIN_SUGGESTIONS = [
  "Random number 1–100",
  "What can you do?",
]

/**
 * Returns a readable chat error message (avoids dumping HTML error pages into the UI).
 */
function formatChatError({ message }: { message: string }): string {
  if (message.trimStart().startsWith("<!DOCTYPE") || message.trimStart().startsWith("<html")) {
    return "Could not reach the chat API. Check that the dev server is running and AI_GATEWAY_API_KEY is set in .env.local."
  }
  return message
}

/**
 * Extracts plain text from a UI message for copy and regenerate actions.
 */
function getMessageText({ message }: { message: AssistantUIMessage }): string {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
}

export interface AssistantPreviewProps {
  /** When true, fills the viewport height for the full-screen preview route. */
  fullScreen?: boolean
  /** Compact sidebar width for panels docked beside main app content. */
  thin?: boolean
  /** Show a link back to the assistant docs (full-screen preview only). */
  showDocsLink?: boolean
  /** Optional actions rendered in the header beside New chat (for example a back link). */
  headerActions?: ReactNode
  /** Title from a selected sidebar session (shown until a new title is generated). */
  sessionTitle?: string
  /** Called when the user starts a new chat from the header. */
  onNewChat?: () => void
  className?: string
}

/**
 * Interactive Cowork layout preview wired to the Vercel AI Gateway.
 */
export function AssistantPreview({
  fullScreen = false,
  thin = false,
  showDocsLink = fullScreen,
  headerActions,
  sessionTitle,
  onNewChat,
  className,
}: AssistantPreviewProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [model, setModel] = useState<string>(DEFAULT_ASSISTANT_MODEL)
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null)
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false)

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: assetPath("/api/chat/"),
        body: { model },
      }),
    [model]
  )

  const { messages, sendMessage, status, stop, setMessages, regenerate, error, addToolApprovalResponse } =
    useChat<AssistantUIMessage>({
      transport,
      sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    })

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || status === "streaming" || status === "submitted") return
      void sendMessage({ text: trimmed })
    },
    [sendMessage, status]
  )

  const handleSubmit = useCallback(
    (message: PromptInputMessage) => {
      send(message.text)
    },
    [send]
  )

  const handleCopy = useCallback((message: AssistantUIMessage) => {
    navigator.clipboard?.writeText(getMessageText({ message }))
    setCopiedId(message.id)
    setTimeout(() => setCopiedId((id) => (id === message.id ? null : id)), 1500)
  }, [])

  const newChat = useCallback(() => {
    stop()
    setMessages([])
    setGeneratedTitle(null)
    setIsGeneratingTitle(false)
    onNewChat?.()
  }, [onNewChat, setMessages, stop])

  const firstUserMessage = useMemo(
    () => messages.find((message) => message.role === "user"),
    [messages]
  )

  const firstUserMessageText = firstUserMessage
    ? getMessageText({ message: firstUserMessage })
    : ""

  /** Generates a title once the first user message is available. */
  useEffect(() => {
    if (generatedTitle || isGeneratingTitle || !firstUserMessageText.trim()) {
      return
    }

    let cancelled = false

    const generateTitle = async () => {
      setIsGeneratingTitle(true)

      try {
        const response = await fetch(assetPath("/api/chat/title/"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: firstUserMessageText }),
        })

        const payload = (await response.json()) as { title?: string; error?: string }

        if (cancelled) {
          return
        }

        if (response.ok && payload.title?.trim()) {
          setGeneratedTitle(payload.title.trim())
          return
        }

        setGeneratedTitle(
          deriveConversationTitleFallback({ message: firstUserMessageText })
        )
      } catch {
        if (!cancelled) {
          setGeneratedTitle(
            deriveConversationTitleFallback({ message: firstUserMessageText })
          )
        }
      } finally {
        if (!cancelled) {
          setIsGeneratingTitle(false)
        }
      }
    }

    void generateTitle()

    return () => {
      cancelled = true
    }
  }, [firstUserMessageText, generatedTitle, isGeneratingTitle])

  /** Clears a generated title when switching to another sidebar session. */
  useEffect(() => {
    setGeneratedTitle(null)
    setIsGeneratingTitle(false)
  }, [sessionTitle])

  const resolvedTitle = generatedTitle ?? sessionTitle ?? null
  const displayTitle = resolvedTitle ?? NEW_CONVERSATION_TITLE
  const isPlaceholderTitle = !resolvedTitle

  const isBusy = status === "streaming" || status === "submitted"
  const lastMessage = messages.at(-1)
  const suggestions = thin ? THIN_SUGGESTIONS : SUGGESTIONS
  const chatStatus = status as ChatStatus

  return (
    <div
      className={cn(
        "flex flex-col bg-background",
        thin && "w-80 shrink-0",
        fullScreen ? "h-dvh" : thin ? "h-full min-h-[480px]" : "h-[min(70vh,640px)]",
        className
      )}
    >
      {/* Header: h-14 aligns with AppSidebarHeader and AppHeader */}
      <header
        className={cn(
          "flex h-14 shrink-0 items-center justify-between border-b border-border bg-white",
          thin ? "px-3" : "px-4"
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-sm bg-foreground text-background",
              thin ? "size-6" : "size-7"
            )}
          >
            <SparklesIcon className={thin ? "size-3.5" : "size-4"} aria-hidden="true" />
          </div>
          <p className="truncate text-sm font-semibold text-foreground">Cowork</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {headerActions}
          {thin ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={newChat}
                      aria-label="New chat"
                      className="inline-flex size-7 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:bg-muted"
                    >
                      <PlusIcon className="size-3.5" />
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
              className="inline-flex h-7 items-center gap-1.5 rounded-sm border border-border px-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
            >
              <PlusIcon className="size-3.5" aria-hidden="true" />
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

      {/* Conversation title */}
      <div
        className={cn(
          "shrink-0 border-b border-border bg-white",
          thin ? "px-3 py-2" : "px-4 py-2.5"
        )}
      >
        <h1
          className={cn(
            "truncate text-sm font-medium",
            isPlaceholderTitle ? "text-muted-foreground" : "text-foreground"
          )}
        >
          {displayTitle}
        </h1>
      </div>

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
                      ? "Ask below or pick a starter. Use # for schemes and @ for entities."
                      : "Ask about schemes, draft emails, or set up new plans. Type # for schemes and @ for entities."}
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
                from={message.role === "user" ? "user" : "assistant"}
                className={thin ? "max-w-full gap-1.5" : undefined}
              >
                <MessageContent className={cn("space-y-3", thin && "text-xs")}>
                  {message.parts.map((part, index) => {
                    if (part.type === "text") {
                      if (message.role === "user") {
                        return (
                          <MessageMentionText key={`${message.id}-text-${index}`}>
                            {part.text}
                          </MessageMentionText>
                        )
                      }

                      return (
                        <MessageResponse
                          key={`${message.id}-text-${index}`}
                          isAnimating={
                            status === "streaming" &&
                            message.id === lastMessage?.id &&
                            index === message.parts.length - 1
                          }
                        >
                          {part.text}
                        </MessageResponse>
                      )
                    }

                    if (part.type === "tool-randomNumber") {
                      const input = part.input as { min?: number; max?: number } | undefined

                      return (
                        <RandomNumberCard
                          key={`${message.id}-random-${part.toolCallId}`}
                          min={input?.min ?? 0}
                          max={input?.max ?? 0}
                          state={part.state}
                          output={
                            part.state === "output-available"
                              ? (part.output as RandomNumberResult)
                              : undefined
                          }
                          errorText={
                            part.state === "output-error" ? part.errorText : undefined
                          }
                          onApprove={
                            part.state === "approval-requested" && part.approval
                              ? () =>
                                  void addToolApprovalResponse({
                                    id: part.approval.id,
                                    approved: true,
                                  })
                              : undefined
                          }
                          onDeny={
                            part.state === "approval-requested" && part.approval
                              ? () =>
                                  void addToolApprovalResponse({
                                    id: part.approval.id,
                                    approved: false,
                                  })
                              : undefined
                          }
                        />
                      )
                    }

                    if (part.type === "tool-draftEmail") {
                      if (part.state === "output-available" && part.output) {
                        return (
                          <DraftEmailCard
                            key={`${message.id}-draft-${part.toolCallId}`}
                            draft={part.output as EmailDraft & { status?: "ready" | "sent" }}
                          />
                        )
                      }

                      if (part.state === "output-error") {
                        return (
                          <DraftEmailCardLoading
                            key={`${message.id}-draft-error-${part.toolCallId}`}
                            error
                            message={part.errorText ?? "Could not draft email."}
                          />
                        )
                      }

                      return (
                        <DraftEmailCardLoading
                          key={`${message.id}-draft-loading-${part.toolCallId}`}
                        />
                      )
                    }

                    if (
                      part.type === "tool-setupScheme" &&
                      part.state === "output-available" &&
                      part.output
                    ) {
                      return (
                        <SchemeSetupCard
                          key={`${message.id}-scheme-${part.toolCallId}`}
                          preview={
                            part.output as SchemeSetupPreview & {
                              reviewStatus?: "pending" | "approved" | "rejected"
                            }
                          }
                        />
                      )
                    }

                    if (part.type === "tool-setupScheme") {
                      return (
                        <p
                          key={`${message.id}-loading-${part.toolCallId}`}
                          className="text-sm text-muted-foreground"
                        >
                          Preparing preview…
                        </p>
                      )
                    }

                    return null
                  })}
                </MessageContent>
                {message.role === "assistant" && getMessageText({ message }) && !thin && (
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
                      <MessageAction
                        tooltip="Regenerate"
                        onClick={() => void regenerate({ messageId: message.id })}
                      >
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
          {error && (
            <p className="mb-2 rounded-sm border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              {formatChatError({ message: error.message })}
            </p>
          )}
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputMentionEditor
              placeholder={
                thin
                  ? "Ask anything… # schemes · @ entities"
                  : "Message Cowork… # schemes · @ entities"
              }
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
                        {ASSISTANT_MODELS.find((m) => m.value === model)?.label}
                      </PromptInputSelectValue>
                    </PromptInputSelectTrigger>
                    <PromptInputSelectContent>
                      {ASSISTANT_MODELS.map((m) => (
                        <PromptInputSelectItem key={m.value} value={m.value}>
                          {m.label}
                        </PromptInputSelectItem>
                      ))}
                    </PromptInputSelectContent>
                  </PromptInputSelect>
                  <PromptInputSpeech />
                </PromptInputTools>
              )}
              <PromptInputSubmit status={chatStatus} onStop={stop} />
            </PromptInputFooter>
          </PromptInput>
          {fullScreen && (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Powered by the Vercel AI Gateway. Set{" "}
              <code className="font-mono">AI_GATEWAY_API_KEY</code> in{" "}
              <code className="font-mono">.env.local</code>.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
