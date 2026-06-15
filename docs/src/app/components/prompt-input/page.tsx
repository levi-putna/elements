"use client";

import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { PropTable } from "@/components/docs/prop-table";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/prompt-input/registry.json`;

const USAGE = `import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputActionMenu,
  PromptInputActionMenuTrigger,
  PromptInputActionMenuContent,
  PromptInputActionAddAttachments,
  PromptInputActionAddScreenshot,
  PromptInputSpeech,
  PromptInputSubmit,
} from "@/components/ui/prompt-input"

export function Example() {
  return (
    <PromptInput onSubmit={({ text, files }) => console.log(text, files)}>
      <PromptInputTextarea />
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger />
            <PromptInputActionMenuContent>
              <PromptInputActionAddAttachments />
              <PromptInputActionAddScreenshot />
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
          <PromptInputSpeech />
        </PromptInputTools>
        <PromptInputSubmit />
      </PromptInputFooter>
    </PromptInput>
  )
}`;

const WITH_STATUS = `import { useChat } from "ai/react"

export function Chat() {
  const { input, handleInputChange, handleSubmit, status, stop } = useChat()

  return (
    <PromptInput
      onSubmit={({ text }) => handleSubmit()}
      value={input}
      onChange={handleInputChange}
    >
      <PromptInputTextarea />
      <PromptInputFooter>
        <PromptInputTools>
          <PromptInputSpeech />
        </PromptInputTools>
        <PromptInputSubmit status={status} onStop={stop} />
      </PromptInputFooter>
    </PromptInput>
  )
}`;

const WITH_MODEL = `<PromptInput onSubmit={handleSubmit}>
  <PromptInputFooter>
    <PromptInputTools>
      <PromptInputSelect value={model} onValueChange={setModel}>
        <PromptInputSelectTrigger>
          <PromptInputSelectValue />
        </PromptInputSelectTrigger>
        <PromptInputSelectContent>
          <PromptInputSelectItem value="gpt-4o">GPT-4o</PromptInputSelectItem>
          <PromptInputSelectItem value="claude-sonnet-4-6">Claude Sonnet</PromptInputSelectItem>
        </PromptInputSelectContent>
      </PromptInputSelect>
    </PromptInputTools>
    <PromptInputSubmit />
  </PromptInputFooter>
</PromptInput>`;

const PROPS = [
  { name: "onSubmit", type: "(message: { text: string; files: FileUIPart[] }, event) => void", description: "Called when the form is submitted. Receives the text and any attached files." },
  { name: "accept", type: "string", description: 'File type filter passed to the hidden file input. e.g. "image/*"' },
  { name: "multiple", type: "boolean", default: "true", description: "Allow multiple file attachments." },
  { name: "globalDrop", type: "boolean", default: "false", description: "Accept file drops anywhere on the document, not just on the form." },
  { name: "maxFiles", type: "number", description: "Maximum number of files that can be attached." },
  { name: "maxFileSize", type: "number", description: "Maximum file size in bytes." },
  { name: "onError", type: "(err: { code, message }) => void", description: "Called when a file validation constraint is violated." },
];

const SUBMIT_PROPS = [
  { name: "status", type: '"idle" | "submitted" | "streaming" | "error"', description: "AI SDK chat status. Controls the submit button icon: idle → arrow, submitted → spinner, streaming → stop square." },
  { name: "onStop", type: "() => void", description: "Called when the stop button is clicked during streaming." },
];

const SPEECH_PROPS = [
  { name: "onTranscript", type: "(text: string) => void", description: "Called with the transcript text after recognition completes. Text is also automatically appended to the textarea value." },
];

export default function PromptInputPage() {
  return (
    <div className="max-w-prose mx-auto px-8 py-14">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / AI
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Prompt Input</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          A fully-featured AI chat input. Extends{" "}
          <a href="https://elements.ai-sdk.dev/components/prompt-input" className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors" target="_blank" rel="noopener noreferrer">ai-elements PromptInput</a>{" "}
          with rectangular styling and built-in speech recognition. Integrates with the Vercel AI SDK <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">useChat</code> hook.
        </p>
      </div>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Usage</h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">
          The component is fully composable. Build the input by assembling sub-components inside <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">PromptInput</code>.
        </p>
        <CodeBlock code={USAGE} language="tsx" />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">Examples</h2>

        <div className="space-y-10">
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">With AI SDK status</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Pass <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">status</code> and <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">onStop</code> to <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">PromptInputSubmit</code> to get automatic icon changes and stop behaviour during streaming.
            </p>
            <CodeBlock code={WITH_STATUS} language="tsx" />
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-1">With model selector</p>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Add <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm text-foreground">PromptInputSelect</code> to the toolbar to let users choose between models.
            </p>
            <CodeBlock code={WITH_MODEL} language="tsx" />
          </div>
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-1">Features</h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed">All features inherited from ai-elements plus additions.</p>
        <div className="rounded-sm border border-border overflow-hidden">
          {[
            ["Auto-resizing textarea", "Grows with content up to max-height, then scrolls."],
            ["File attachments", "Drag-and-drop, paste from clipboard, or file picker. Validates type, size, and count."],
            ["Screenshot capture", "Uses getDisplayMedia to capture a screen region and attach it as a PNG."],
            ["Speech recognition", "Web Speech API. Appends transcript to existing input. Shows mic/mic-off icon. Hides if unsupported."],
            ["Model selector", "Select dropdown styled to match the input toolbar."],
            ["Action menu", "Plus-icon dropdown for extensible actions."],
            ["AI SDK status", "Submit button adapts: idle → send arrow, submitted → spinner, streaming → stop square."],
            ["Keyboard shortcuts", "Enter to submit, Shift+Enter for newline, Backspace on empty removes last attachment."],
          ].map(([feature, description]) => (
            <div key={feature} className="flex gap-4 px-4 py-3 border-b border-border last:border-0">
              <span className="text-sm font-medium text-foreground w-44 shrink-0">{feature}</span>
              <span className="text-sm text-ink-muted">{description}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">PromptInput Props</h2>
        <PropTable props={PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">PromptInputSubmit Props</h2>
        <PropTable props={SUBMIT_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">PromptInputSpeech Props</h2>
        <PropTable props={SPEECH_PROPS} />
      </section>

    </div>
  );
}
