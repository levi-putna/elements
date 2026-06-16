import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AssistantPreview } from "@/components/docs/assistant-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";

const INSTALL = `# Install the three AI primitives this pattern composes
npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/conversation/registry.json
npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/message/registry.json
npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/prompt-input/registry.json`;

const LAYOUT = `"use client"

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
} from "@/components/ui/prompt-input"
import type { ChatStatus } from "ai"

export function AssistantPage({
  messages,
  status,
  onSubmit,
  onStop,
}: {
  messages: { id: string; role: "user" | "assistant"; text: string }[]
  status: ChatStatus
  onSubmit: ({ text }: { text: string }) => void
  onStop?: () => void
}) {
  const lastMessage = messages.at(-1)

  return (
    <div className="flex h-dvh flex-col bg-background">
      {/* Header: title and session actions */}
      <header className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <p className="text-sm font-semibold text-foreground">Assistant</p>
      </header>

      {/* Conversation: scrollable message list */}
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl">
          {messages.length === 0 ? (
            <ConversationEmptyState title="How can I help you today?" />
          ) : (
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  <MessageResponse
                    isAnimating={
                      status === "streaming" && message.id === lastMessage?.id
                    }
                  >
                    {message.text}
                  </MessageResponse>
                </MessageContent>
                {message.role === "assistant" && message.text && (
                  <MessageActions>
                    <MessageAction tooltip="Copy" onClick={() => {}} />
                  </MessageActions>
                )}
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Composer: pinned prompt input */}
      <div className="shrink-0 px-4 pb-4">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput onSubmit={onSubmit}>
            <PromptInputTextarea placeholder="Message the assistant…" />
            <PromptInputFooter>
              <PromptInputTools>
                <PromptInputSelect defaultValue="opus">
                  <PromptInputSelectTrigger>
                    <PromptInputSelectValue />
                  </PromptInputSelectTrigger>
                  <PromptInputSelectContent>
                    <PromptInputSelectItem value="opus">Claude Opus</PromptInputSelectItem>
                  </PromptInputSelectContent>
                </PromptInputSelect>
                <PromptInputSpeech />
              </PromptInputTools>
              <PromptInputSubmit status={status} onStop={onStop} />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}`;

const WITH_AI_SDK = `"use client"

import { useChat } from "ai/react"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ui/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ui/message"
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ui/prompt-input"

export function LiveAssistant() {
  const { messages, input, handleInputChange, handleSubmit, status, stop } = useChat({
    api: "/api/chat",
  })

  return (
    <div className="flex h-dvh flex-col">
      <Conversation className="flex-1">
        <ConversationContent className="mx-auto max-w-3xl">
          {messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                <MessageResponse isAnimating={status === "streaming"}>
                  {message.content}
                </MessageResponse>
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border p-4">
        <PromptInput
          onSubmit={() => {
            handleSubmit()
          }}
        >
          <PromptInputTextarea value={input} onChange={handleInputChange} />
          <PromptInputFooter>
            <PromptInputTools />
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}`;

const PIECES = [
  [
    "Header",
    "Optional chrome above the chat: title, new-chat action, and links back to docs or the parent app.",
  ],
  [
    "Conversation",
    "Fills remaining height. Auto-scrolls to the latest message and shows a scroll-to-bottom control when the user reads history.",
  ],
  [
    "ConversationEmptyState",
    "Centred placeholder with suggestion chips before the first message is sent.",
  ],
  [
    "Message",
    "Renders user and assistant turns. Pair MessageResponse with isAnimating while a reply streams.",
  ],
  [
    "PromptInput",
    "Pinned composer with model selector, speech input, attachments, and submit/stop controls.",
  ],
];

/**
 * Documents the composed assistant chat layout and how to wire it to the Vercel AI SDK.
 */
export default function AssistantPage() {
  return (
    <DocsPage>

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / AI
        </p>
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Assistant</h1>
          <Link
            href="/preview/assistant"
            className="inline-flex items-center gap-1.5 rounded-sm border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition-colors duration-150 no-underline shrink-0"
          >
            Open full-screen preview
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        <p className="text-base text-ink-muted leading-relaxed">
          A full-height assistant layout composed from{" "}
          <Link
            href="/components/conversation"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Conversation
          </Link>
          ,{" "}
          <Link
            href="/components/message"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Message
          </Link>
          , and{" "}
          <Link
            href="/components/prompt-input"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Prompt Input
          </Link>
          . Use it as the reference pattern when building AI chat in Instant Strata, or when
          prompting AI tools to generate on-brand assistant UI.
        </p>
      </div>

      {/* Live preview */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Live preview
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Send a message, try a suggestion chip, or ask for a &quot;markdown example&quot; to see
          streamed formatting. Replies are mocked; the layout and interactions match a production
          assistant built from the primitives below.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          <AssistantPreview />
        </div>
      </section>

      {/* Routes */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Routes in this docs site
        </h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">
          AI coding agents and contributors can use these paths to find the assistant pattern
          and live demo. Paths include the site base path when deployed to GitHub Pages.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          {[
            ["/components/assistant", "This page: anatomy, installation, and composition code."],
            ["/preview/assistant", "Full-screen interactive demo with mocked streaming replies."],
            ["/components/conversation", "Scroll container primitive."],
            ["/components/message", "Chat bubble and markdown response primitive."],
            ["/components/prompt-input", "Composer primitive with model selector and tools."],
          ].map(([path, desc]) => (
            <div
              key={path}
              className="flex flex-col gap-1 border-b border-border px-4 py-3 last:border-0 sm:flex-row sm:gap-4"
            >
              <code className="font-mono text-xs text-foreground shrink-0 sm:w-56">{path}</code>
              <span className="text-sm text-ink-muted">{desc}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-ink-muted mt-3 leading-relaxed">
          Deployed URLs are prefixed with{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground">
            /elements
          </code>
          , for example{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm text-foreground">
            /elements/preview/assistant/
          </code>
          .
        </p>
      </section>

      {/* Anatomy */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Anatomy
        </h2>
        <div className="rounded-sm border border-border overflow-hidden">
          {PIECES.map(([name, desc], index) => (
            <div
              key={name}
              className={`flex gap-4 px-4 py-3 border-b border-border last:border-0 ${index % 2 ? "bg-secondary/30" : ""}`}
            >
              <code className="font-mono text-xs text-foreground w-44 shrink-0">{name}</code>
              <span className="text-xs text-ink-muted leading-relaxed">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <p className="text-sm text-ink-muted mb-3 leading-relaxed">
          The assistant is a composition, not a separate registry entry. Install the three
          primitives below, then copy the layout from the preview or the example on this page.
        </p>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* Composition */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Composition
        </h2>
        <p className="text-sm text-ink-muted mb-3 leading-relaxed">
          The preview at{" "}
          <Link
            href="/preview/assistant"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            /preview/assistant
          </Link>{" "}
          follows this structure. It uses a local{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            mockReply
          </code>{" "}
          helper so the UI can be developed without a model API. Swap that for{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            useChat
          </code>{" "}
          when you are ready to go live.
        </p>
        <CodeBlock code={LAYOUT} language="tsx" />
      </section>

      {/* AI SDK */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Wiring to the Vercel AI SDK
        </h2>
        <p className="text-sm text-ink-muted mb-3 leading-relaxed">
          Point{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            useChat
          </code>{" "}
          at your route handler, pass{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            status
          </code>{" "}
          to{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            PromptInputSubmit
          </code>
          , and set{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            isAnimating
          </code>{" "}
          on the final assistant message while{" "}
          <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">
            status === &quot;streaming&quot;
          </code>
          . See also the examples on the{" "}
          <Link
            href="/components/conversation"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Conversation
          </Link>{" "}
          page.
        </p>
        <CodeBlock code={WITH_AI_SDK} language="tsx" />
      </section>

    </DocsPage>
  );
}
