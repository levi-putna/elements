"use client"

import * as React from "react"
import { createRoot, type Root } from "react-dom/client"
import { useEditor, EditorContent, mergeAttributes } from "@tiptap/react"
import Document from "@tiptap/extension-document"
import Paragraph from "@tiptap/extension-paragraph"
import Text from "@tiptap/extension-text"
import HardBreak from "@tiptap/extension-hard-break"
import { Placeholder } from "@tiptap/extensions"
import Mention from "@tiptap/extension-mention"
import type { Editor, Range } from "@tiptap/core"
import type { SuggestionProps } from "@tiptap/suggestion"
import { PluginKey } from "@tiptap/pm/state"

import { cn } from "@/lib/utils"
import {
  searchEntityMentions,
  searchSchemeMentions,
  type MentionEntity,
} from "@/lib/mention-entities"
import {
  parseMentionedSchemeIds,
  serializeMention,
} from "@/lib/mention-format"
import { MentionTag } from "@/components/ui/mention-tag"

// ─────────────────────────────────────────────────────────
// TipTap mention editor for PromptInput
// ─────────────────────────────────────────────────────────

interface MentionListProps extends SuggestionProps<MentionEntity, MentionEntity> {
  title: string
}

/**
 * Floating suggestion list for scheme and entity mentions.
 */
function MentionList({
  title,
  items,
  command,
  loading,
}: MentionListProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  React.useEffect(() => {
    setSelectedIndex(0)
  }, [items])

  const selectItem = React.useCallback(
    (index: number) => {
      const item = items[index]
      if (item) command(item)
    },
    [command, items]
  )

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault()
        setSelectedIndex((index) => (index + items.length - 1) % Math.max(items.length, 1))
      }
      if (event.key === "ArrowDown") {
        event.preventDefault()
        setSelectedIndex((index) => (index + 1) % Math.max(items.length, 1))
      }
      if (event.key === "Enter") {
        event.preventDefault()
        selectItem(selectedIndex)
      }
    }

    document.addEventListener("keydown", onKeyDown, true)
    return () => document.removeEventListener("keydown", onKeyDown, true)
  }, [items.length, selectItem, selectedIndex])

  return (
    <div className="z-50 w-64 overflow-hidden rounded-sm border border-border bg-white shadow-md">
      <p className="border-b border-border px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
        {title}
      </p>
      <ul className="max-h-52 overflow-y-auto p-1">
        {loading ? (
          <li className="px-2 py-2 text-xs text-ink-muted">Loading…</li>
        ) : items.length === 0 ? (
          <li className="px-2 py-2 text-xs text-ink-muted">No matches</li>
        ) : (
          items.map((item, index) => (
            <li key={`${item.type}-${item.id}`}>
              <button
                type="button"
                onClick={() => selectItem(index)}
                className={cn(
                  "flex w-full flex-col rounded-xs px-2 py-1.5 text-left transition-colors",
                  index === selectedIndex
                    ? "bg-secondary text-foreground"
                    : "text-foreground hover:bg-secondary/70"
                )}
              >
                <span className="text-xs font-medium leading-snug">{item.label}</span>
                {item.subtitle ? (
                  <span className="text-[10px] leading-snug text-ink-muted">
                    {item.subtitle}
                  </span>
                ) : null}
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

/**
 * Creates a TipTap suggestion renderer backed by a React list.
 */
function createMentionSuggestionRenderer({ title }: { title: string }) {
  let root: Root | null = null
  let unmountFloating: (() => void) | null = null

  return () => ({
    onStart: (props: SuggestionProps<MentionEntity, MentionEntity>) => {
      const element = document.createElement("div")
      unmountFloating = props.mount(element)
      root = createRoot(element)
      root.render(<MentionList {...props} title={title} />)
    },
    onUpdate: (props: SuggestionProps<MentionEntity, MentionEntity>) => {
      root?.render(<MentionList {...props} title={title} />)
    },
    onExit: () => {
      unmountFloating?.()
      unmountFloating = null
      root?.unmount()
      root = null
    },
  })
}

const SchemeMention = Mention.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      mentionType: {
        default: "scheme",
        parseHTML: (element) => element.getAttribute("data-mention-type"),
        renderHTML: (attributes) => ({
          "data-mention-type": attributes.mentionType,
        }),
      },
    }
  },
})

/**
 * Inserts a mention node at the suggestion range.
 */
function insertMention({
  editor,
  range,
  entity,
}: {
  editor: Editor
  range: Range
  entity: MentionEntity
}) {
  editor
    .chain()
    .focus()
    .insertContentAt(range, [
      {
        type: "mention",
        attrs: {
          id: entity.id,
          label: entity.label,
          mentionType: entity.type,
        },
      },
      { type: "text", text: " " },
    ])
    .run()
}

/**
 * Reads scheme ids already present in the editor document.
 */
function getEditorSchemeIds(editor: Editor): string[] {
  const text = editor.getText()
  return parseMentionedSchemeIds({ text })
}

/**
 * Builds TipTap extensions for the mention prompt editor.
 */
function createMentionEditorExtensions({
  placeholder,
}: {
  placeholder: string
}) {
  return [
    Document,
    Paragraph,
    Text,
    HardBreak,
    Placeholder.configure({ placeholder }),
    SchemeMention.configure({
      deleteTriggerWithBackspace: true,
      renderText({ node }) {
        return serializeMention({
          label: node.attrs.label ?? node.attrs.id ?? "",
          type: node.attrs.mentionType ?? "scheme",
          id: node.attrs.id ?? "",
        })
      },
      renderHTML({ node }) {
        const label = node.attrs.label ?? node.attrs.id ?? ""
        const type = node.attrs.mentionType ?? "scheme"
        return [
          "span",
          mergeAttributes({
            "data-type": "mention",
            "data-id": node.attrs.id,
            "data-label": label,
            "data-mention-type": type,
            class:
              "mention-inline-tag mx-0.5 inline-flex max-w-full align-baseline items-center gap-1 rounded-xs bg-lime-soft px-1.5 py-0.5 text-[0.8125rem] font-medium leading-none text-forest",
          }),
          ["span", { class: "mention-inline-label truncate" }, label],
        ]
      },
      suggestions: [
        {
          char: "#",
          pluginKey: new PluginKey("schemeMention"),
          items: ({ query }) => searchSchemeMentions({ query }),
          command: ({ editor, range, props }) => {
            insertMention({ editor, range, entity: props as MentionEntity })
          },
          render: createMentionSuggestionRenderer({ title: "Property" }),
        },
        {
          char: "@",
          pluginKey: new PluginKey("entityMention"),
          items: ({ query, editor }) =>
            searchEntityMentions({
              query,
              schemeIds: getEditorSchemeIds(editor),
            }),
          command: ({ editor, range, props }) => {
            insertMention({ editor, range, entity: props as MentionEntity })
          },
          render: createMentionSuggestionRenderer({
            title: "Owners, lots and documents",
          }),
        },
      ],
    }),
  ]
}

export interface PromptMentionEditorProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  onEnterSubmit?: () => void
  onBackspaceEmpty?: () => void
  disabled?: boolean
}

/**
 * TipTap-based prompt field with # scheme and @ entity mentions.
 */
export function PromptMentionEditor({
  value = "",
  onValueChange,
  placeholder = "Message Cowork…",
  className,
  onEnterSubmit,
  onBackspaceEmpty,
  disabled = false,
}: PromptMentionEditorProps) {
  const onValueChangeRef = React.useRef(onValueChange)
  onValueChangeRef.current = onValueChange

  const editor = useEditor({
    editable: !disabled,
    extensions: createMentionEditorExtensions({ placeholder }),
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm max-w-none focus:outline-none",
          "[&_.mention-inline-tag]:before:content-none",
          "[&_p]:m-0 [&_p+p]:mt-2"
        ),
      },
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault()
          onEnterSubmit?.()
          return true
        }

        if (
          event.key === "Backspace" &&
          view.state.doc.textContent.length === 0
        ) {
          onBackspaceEmpty?.()
        }

        return false
      },
    },
    content: value ? `<p>${escapeHtml(value)}</p>` : "",
    onUpdate: ({ editor: currentEditor }) => {
      onValueChangeRef.current?.(currentEditor.getText())
    },
  })

  React.useEffect(() => {
    if (!editor) return
    editor.setEditable(!disabled)
  }, [disabled, editor])

  React.useEffect(() => {
    if (!editor) return
    const current = editor.getText()
    if (current === value) return
    if (!value) {
      editor.commands.clearContent(true)
      editor.commands.focus("end")
      return
    }
    editor.commands.setContent(`<p>${escapeHtml(value)}</p>`)
  }, [editor, value])

  return (
    <div
      className={cn(
        "prompt-mention-editor relative w-full",
        "[&_.tiptap]:min-h-16 [&_.tiptap]:max-h-48 [&_.tiptap]:w-full [&_.tiptap]:px-3 [&_.tiptap]:py-2",
        "[&_.tiptap]:text-sm [&_.tiptap]:text-foreground [&_.tiptap]:outline-none",
        "[&_.tiptap_p]:m-0 [&_.tiptap_p+p]:mt-2",
        "[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none",
        "[&_.tiptap_p.is-editor-empty:first-child::before]:float-left",
        "[&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
        "[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground",
        "[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
        className
      )}
      data-slot="input-group-control"
    >
      <EditorContent editor={editor} />
    </div>
  )
}

/**
 * Escapes plain text when hydrating the editor from a string value.
 */
function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
}
