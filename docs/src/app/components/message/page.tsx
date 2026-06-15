"use client";

import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Message, MessageActions, MessageAction, MessageContent, MessageResponse, MessageToolbar } from "@/components/ui/message";
import { CopyIcon } from "lucide-react";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/message/registry.json`;

const GLOBALS_CSS = `/* Add to globals.css — required for MessageResponse code block styles */
@source "../node_modules/streamdown/dist/*.js";`;

const USAGE = `import { Message, MessageContent, MessageResponse } from "@/components/ui/message"

export function ChatMessage({ message }) {
  return (
    <Message from={message.role}>
      <MessageContent>
        <MessageResponse isAnimating={false}>
          {message.content}
        </MessageResponse>
      </MessageContent>
    </Message>
  )
}`;

const WITH_ACTIONS = `import {
  Message,
  MessageContent,
  MessageResponse,
  MessageToolbar,
  MessageActions,
  MessageAction,
} from "@/components/ui/message"
import { CopyIcon, RotateCcwIcon } from "lucide-react"

export function AssistantMessage({ message, onRetry }) {
  return (
    <Message from="assistant">
      <MessageContent>
        <MessageResponse>{message.content}</MessageResponse>
      </MessageContent>
      <MessageToolbar>
        <MessageActions>
          <MessageAction
            tooltip="Copy"
            onClick={() => navigator.clipboard.writeText(message.content)}
          >
            <CopyIcon />
          </MessageAction>
          <MessageAction tooltip="Retry" onClick={onRetry}>
            <RotateCcwIcon />
          </MessageAction>
        </MessageActions>
      </MessageToolbar>
    </Message>
  )
}`;

const ENTITY_TAGS = `// The AI response markdown can include custom entity tags:
// <person name="Jane Smith" id="u_123">Jane Smith</person>
// <location address="42 Park Rd" suburb="Bondi" state="NSW" />
// <strata-scheme plan="SP12345" name="Sunrise Apartments" />

// MessageResponse will render these as styled inline badges automatically.
// No extra setup needed — the plugins are built in.

const exampleContent = \`
The lot is managed by <person name="Jane Smith" id="u_123">Jane Smith</person>
and located at <location address="42 Park Rd" suburb="Bondi" state="NSW" />.
It belongs to <strata-scheme plan="SP12345" name="Sunrise Apartments" />.
\`;

<MessageResponse>{exampleContent}</MessageResponse>`;

const ADDING_ENTITY = `// To add a new entity type, open registry/message/message.tsx
// and add a plugin to the streamdownPlugins object:

const myPlugin = {
  name: "document",           // matches the HTML tag name
  render: ({ title, id, children }) => (
    <span
      className="inline-flex items-center gap-1 rounded-sm bg-purple-50 px-1.5 py-0.5 text-purple-700 text-xs font-medium ring-1 ring-purple-200"
      data-entity="document"
      data-id={id}
    >
      {children ?? title}
    </span>
  ),
};

const streamdownPlugins = {
  cjk, code, math, mermaid,
  person: personPlugin,
  location: locationPlugin,
  "strata-scheme": strataSchemePlugin,
  document: myPlugin,          // ← add here
};`;

const MESSAGE_PROPS = [
  { name: "from", type: '"user" | "assistant" | "system"', description: "The message role. Controls alignment and styling: user messages are right-aligned with secondary background, assistant messages are left-aligned full-width." },
];

const RESPONSE_PROPS = [
  { name: "children", type: "string", description: "The markdown content to render. Supports GFM, code blocks with syntax highlighting, math (KaTeX), mermaid diagrams, and custom entity tags." },
  { name: "isAnimating", type: "boolean", default: "false", description: 'Pass true while status is "streaming" to enable streaming-optimised rendering.' },
  { name: "parseIncompleteMarkdown", type: "boolean", default: "true", description: "Enables graceful rendering of partial markdown during streaming." },
];

const ACTION_PROPS = [
  { name: "tooltip", type: "string", description: "Tooltip label shown on hover." },
  { name: "label", type: "string", description: "Screen reader label. Falls back to tooltip if not provided." },
  { name: "variant", type: "string", default: '"ghost"', description: "Button variant." },
  { name: "size", type: "string", default: '"icon-sm"', description: "Button size." },
];

export default function MessagePage() {
  return (
    <DocsPage>

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / AI
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Message</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          Composable AI chat message components with streaming markdown, syntax-highlighted code blocks,
          math equations, mermaid diagrams, and custom entity tags for people, locations, and strata schemes.
          Extends{" "}
          <a href="https://elements.ai-sdk.dev/components/message" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors" target="_blank" rel="noopener noreferrer">ai-elements Message</a>.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
        <div className="mt-3 rounded-sm border border-border bg-off-white px-4 py-3">
          <p className="text-xs font-semibold text-foreground mb-1">Required: globals.css</p>
          <p className="text-xs text-ink-muted mb-2 leading-relaxed">
            Add this import to your <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">globals.css</code> so Streamdown code block styles are included in the Tailwind build.
          </p>
          <CodeBlock code={GLOBALS_CSS} language="css" />
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <CodeBlock code={USAGE} language="tsx" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">Examples</h2>

        <div className="space-y-10">

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">User and assistant messages</p>
            <ComponentPreview label="Preview">
              <div className="flex flex-col gap-6 w-full max-w-sm">
                <Message from="user">
                  <MessageContent>What strata fees apply to SP12345?</MessageContent>
                </Message>
                <Message from="assistant">
                  <MessageContent>
                    <MessageResponse>
                      The quarterly levy for **SP12345** is $842. This covers building insurance, common area maintenance, and the sinking fund contribution.
                    </MessageResponse>
                  </MessageContent>
                </Message>
              </div>
            </ComponentPreview>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">With action toolbar</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Use <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">MessageToolbar</code> with <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">MessageActions</code> to add copy, retry, and other actions beneath a message.
            </p>
            <ComponentPreview label="Preview">
              <div className="w-full max-w-sm">
                <Message from="assistant">
                  <MessageContent>
                    <MessageResponse>
                      The annual general meeting is scheduled for **15 August**.
                    </MessageResponse>
                  </MessageContent>
                  <MessageToolbar>
                    <MessageActions>
                      <MessageAction tooltip="Copy" onClick={() => {}}>
                        <CopyIcon />
                      </MessageAction>
                    </MessageActions>
                  </MessageToolbar>
                </Message>
              </div>
            </ComponentPreview>
            <div className="mt-3">
              <CodeBlock code={WITH_ACTIONS} language="tsx" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Custom entity tags</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              The AI can include structured entity references in its markdown. They render as styled inline badges without any extra parsing on your side.
            </p>
            <ComponentPreview label="Preview">
              <div className="w-full max-w-sm">
                <Message from="assistant">
                  <MessageContent>
                    <MessageResponse>
                      {`Managed by <person name="Jane Smith" id="u_1">Jane Smith</person> at <location address="42 Park Rd" suburb="Bondi" state="NSW" />. Part of <strata-scheme plan="SP12345" name="Sunrise Apartments" />.`}
                    </MessageResponse>
                  </MessageContent>
                </Message>
              </div>
            </ComponentPreview>
            <div className="mt-3">
              <CodeBlock code={ENTITY_TAGS} language="tsx" />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Adding a new entity type</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Add a plugin object to <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">streamdownPlugins</code> in <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">registry/message/message.tsx</code>.
            </p>
            <CodeBlock code={ADDING_ENTITY} language="tsx" />
          </div>

        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Message Props</h2>
        <PropTable props={MESSAGE_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">MessageResponse Props</h2>
        <PropTable props={RESPONSE_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">MessageAction Props</h2>
        <PropTable props={ACTION_PROPS} />
      </section>

    </DocsPage>
  );
}
