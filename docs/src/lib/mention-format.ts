import type { MentionEntityType } from "@/lib/mention-entities"

/** Wire format for a mention token in message text. */
export const MENTION_TOKEN_PATTERN =
  /@\[([^\]]+)\]\{([^:}]+):([^}]+)\}/g

export interface ParsedMention {
  label: string
  type: MentionEntityType | string
  id: string
  /** Full token as it appears in the source string. */
  raw: string
}

/**
 * Serialises a mention into the wire format: @[label]{type:id}
 */
export function serializeMention({
  label,
  type,
  id,
}: {
  label: string
  type: string
  id: string
}): string {
  return `@[${label}]{${type}:${id}}`
}

/**
 * Extracts mention tokens from message text.
 */
export function parseMentions({ text }: { text: string }): ParsedMention[] {
  const mentions: ParsedMention[] = []
  const pattern = new RegExp(MENTION_TOKEN_PATTERN.source, "g")
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    mentions.push({
      label: match[1],
      type: match[2],
      id: match[3],
      raw: match[0],
    })
  }

  return mentions
}

/**
 * Extracts scheme ids from mention tokens in text.
 */
export function parseMentionedSchemeIds({ text }: { text: string }): string[] {
  return parseMentions({ text })
    .filter((mention) => mention.type === "scheme")
    .map((mention) => mention.id)
}

/**
 * Converts mention tokens to Streamdown custom tags for rendering.
 */
export function mentionsToMarkup(text: string): string {
  return text.replace(
    MENTION_TOKEN_PATTERN,
    (_match, label: string, type: string, id: string) =>
      `<mention type="${type}" id="${id}" label="${label}">${label}</mention>`
  )
}

/**
 * Splits message text into plain text and mention segments for inline rendering.
 */
export function splitMessageWithMentions(text: string): Array<
  | { kind: "text"; value: string }
  | { kind: "mention"; label: string; type: string; id: string }
> {
  const segments: Array<
    | { kind: "text"; value: string }
    | { kind: "mention"; label: string; type: string; id: string }
  > = []
  const pattern = new RegExp(MENTION_TOKEN_PATTERN.source, "g")
  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ kind: "text", value: text.slice(lastIndex, match.index) })
    }
    segments.push({
      kind: "mention",
      label: match[1],
      type: match[2],
      id: match[3],
    })
    lastIndex = pattern.lastIndex
  }

  if (lastIndex < text.length) {
    segments.push({ kind: "text", value: text.slice(lastIndex) })
  }

  return segments
}
