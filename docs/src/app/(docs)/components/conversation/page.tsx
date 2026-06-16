import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/conversation/registry.json`;

const USAGE = `import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ui/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ui/message"

export function Chat({ messages }) {
  return (
    <Conversation>
      <ConversationContent>
        {messages.length === 0 ? (
          <ConversationEmptyState
            title="Start a conversation"
            description="Type a message below to get started."
          />
        ) : (
          messages.map((message) => (
            <Message key={message.id} from={message.role}>
              <MessageContent>
                <MessageResponse>{message.content}</MessageResponse>
              </MessageContent>
            </Message>
          ))
        )}
      </ConversationContent>
      <ConversationScrollButton />
    </Conversation>
  )
}`;

const WITH_AI_SDK = `import { useChat } from "ai/react"
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationDownload,
} from "@/components/ui/conversation"
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSpeech,
  PromptInputSubmit,
} from "@/components/ui/prompt-input"
import { Message, MessageContent, MessageResponse } from "@/components/ui/message"

export function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, status, stop } = useChat()

  return (
    <div className="flex flex-col h-screen">
      <Conversation className="flex-1">
        <ConversationDownload messages={messages} />
        <ConversationContent>
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

      <div className="p-4 border-t border-border">
        <PromptInput onSubmit={() => handleSubmit()}>
          <PromptInputTextarea value={input} onChange={handleInputChange} />
          <PromptInputFooter>
            <PromptInputTools>
              <PromptInputSpeech />
            </PromptInputTools>
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  )
}`;

const DOWNLOAD_CUSTOM = `<ConversationDownload
  messages={messages}
  filename="my-conversation.md"
  formatMessage={(message, index) =>
    \`### Message \${index + 1} (\${message.role})\\n\${message.content}\`
  }
/>`;

const PROPS = [
  { name: "className", type: "string", description: "Additional classes on the outer scroll container." },
  { name: "initial", type: '"instant" | "smooth"', default: '"smooth"', description: "Scroll behaviour when the component first mounts." },
  { name: "resize", type: '"instant" | "smooth"', default: '"smooth"', description: "Scroll behaviour when the container resizes." },
];

const EMPTY_PROPS = [
  { name: "title", type: "string", default: '"No messages yet"', description: "Heading shown in the empty state." },
  { name: "description", type: "string", default: '"Start a conversation…"', description: "Supporting text beneath the heading." },
  { name: "icon", type: "ReactNode", description: "Optional icon rendered above the title." },
  { name: "children", type: "ReactNode", description: "When provided, replaces the default title/description layout entirely." },
];

const DOWNLOAD_PROPS = [
  { name: "messages", type: "UIMessage[]", description: "The messages array from useChat." },
  { name: "filename", type: "string", default: '"conversation.md"', description: "The downloaded file name." },
  { name: "formatMessage", type: "(message, index) => string", description: "Custom formatter. Defaults to bold role label + message text." },
];

export default function ConversationPage() {
  return (
    <DocsPage>

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / AI
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Conversation</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          A scroll container for AI chat messages. Automatically scrolls to the bottom when new
          messages arrive and shows a scroll button when the user has scrolled up. Extends{" "}
          <a href="https://elements.ai-sdk.dev/components/conversation" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors" target="_blank" rel="noopener noreferrer">ai-elements Conversation</a>.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <CodeBlock code={USAGE} language="tsx" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">Examples</h2>
        <div className="space-y-10">
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Full chat page with AI SDK</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              The most common pattern: <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">Conversation</code> fills available height,{" "}
              <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">PromptInput</code> sits pinned to the bottom.
            </p>
            <CodeBlock code={WITH_AI_SDK} language="tsx" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Custom download format</p>
            <CodeBlock code={DOWNLOAD_CUSTOM} language="tsx" />
          </div>
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-1">Sub-components</h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">All sub-components accept standard HTML div/button props via spread.</p>
        <div className="rounded-sm border border-border overflow-hidden mb-6">
          {[
            ["Conversation", "Outer scroll container. Built on use-stick-to-bottom."],
            ["ConversationContent", "Inner flex column. Apply gap between messages here."],
            ["ConversationEmptyState", "Centred placeholder shown when messages is empty."],
            ["ConversationScrollButton", "Floating arrow button. Auto-hides when scrolled to bottom."],
            ["ConversationDownload", "Floating download button. Exports conversation as Markdown."],
          ].map(([name, desc]) => (
            <div key={name} className="flex gap-4 px-4 py-3 border-b border-border last:border-0">
              <code className="font-mono text-xs text-foreground w-52 shrink-0 pt-0.5">{name}</code>
              <span className="text-sm text-ink-muted">{desc}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Conversation Props</h2>
        <PropTable props={PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">ConversationEmptyState Props</h2>
        <PropTable props={EMPTY_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">ConversationDownload Props</h2>
        <PropTable props={DOWNLOAD_PROPS} />
      </section>

    </DocsPage>
  );
}
