import { z } from "zod"

/** Attachment shown on an email draft preview card. */
export const emailAttachmentSchema = z.object({
  name: z.string().describe("File name including extension"),
  size: z.string().describe("Human-readable size, for example 2.4 MB"),
  type: z.enum(["pdf", "xlsx", "doc", "other"]).describe("File type for icon display"),
})

/** Structured email draft returned by the email drafter agent. */
export const emailDraftSchema = z.object({
  to: z.string().describe("Recipient line, for example committee members and scheme name"),
  from: z.string().describe("Sender with email address"),
  subject: z.string().describe("Email subject line"),
  body: z.string().describe("Full email body text"),
  attachments: z
    .array(emailAttachmentSchema)
    .optional()
    .describe("Suggested attachments for the draft"),
})

export type EmailAttachment = z.infer<typeof emailAttachmentSchema>
export type EmailDraft = z.infer<typeof emailDraftSchema>
