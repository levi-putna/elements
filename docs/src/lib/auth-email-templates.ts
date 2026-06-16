/**
 * Supabase Auth email template content for Instant Strata.
 * Copy subject and HTML into the Supabase dashboard (Authentication → Email Templates).
 * Each template includes branded header, body content, and a lite website footer.
 */

export type AuthEmailTemplateKind = "action" | "notification"

export interface AuthEmailTemplate {
  /** Stable id for anchors and keys. */
  id: string
  /** Human-readable name matching the Supabase dashboard label. */
  name: string
  /** Whether the user must act (link/PIN) or this is informational only. */
  kind: AuthEmailTemplateKind
  /** Where to paste this template in the Supabase dashboard. */
  dashboardPath: string
  /** Supabase template key or notification identifier. */
  supabaseKey: string
  /** When Supabase sends this email. */
  trigger: string
  /** Recommended subject line (Go template syntax). */
  subject: string
  /** HTML body content for the Supabase template editor. */
  html: string
  /** Plain-text fallback body. */
  plainText: string
  /** Go template variables used in this template. */
  variables: string[]
}

/** Brand colours for inline email styles. */
const COLOURS = {
  forest: "#043F2E",
  inkMuted: "#4A7A62",
  lime: "#C8F169",
  limeSoft: "#EBF8C2",
  offWhite: "#EEF2E3",
  white: "#FFFFFF",
  border: "#D4E8C2",
} as const

/** Branded header: IS mark lockup and tagline eyebrow. */
const EMAIL_HEADER = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
  <tr>
    <td>
      <table role="presentation" cellspacing="0" cellpadding="0">
        <tr>
          <td width="32" height="32" align="center" valign="middle" style="background-color: ${COLOURS.lime}; border-radius: 4px; width: 32px; height: 32px;">
            <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 15px; font-weight: 400; color: ${COLOURS.forest}; line-height: 1;">IS</span>
          </td>
          <td style="padding-left: 10px;">
            <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 20px; color: ${COLOURS.forest}; line-height: 1.2;">Instant Strata</span>
          </td>
        </tr>
      </table>
      <p style="margin: 12px 0 0; font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: ${COLOURS.inkMuted}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">Strata management, simplified</p>
    </td>
  </tr>
</table>`

/** Lime accent rule beneath the header. */
const EMAIL_ACCENT_RULE = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
  <tr>
    <td height="3" style="background-color: ${COLOURS.lime}; border-radius: 2px; font-size: 0; line-height: 0;">&nbsp;</td>
  </tr>
</table>`

/** Primary CTA button styled like the website. */
function emailCta({ href, label }: { href: string; label: string }) {
  return `<table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 20px;">
  <tr>
    <td style="background-color: ${COLOURS.forest}; border-radius: 4px;">
      <a href="${href}" style="display: inline-block; padding: 12px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; color: ${COLOURS.white}; text-decoration: none; line-height: 1;">${label}</a>
    </td>
  </tr>
</table>`
}

/** Outline link for notification emails (support, help). */
function emailOutlineLink({ href, label }: { href: string; label: string }) {
  return `<p style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6;">
  <a href="${href}" style="color: ${COLOURS.forest}; font-weight: 600; text-decoration: underline;">${label}</a>
</p>`
}

/** PIN block with lime-soft background. */
function emailPinBlock({ label = "One-time PIN" }: { label?: string } = {}) {
  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px; background-color: ${COLOURS.limeSoft}; border-radius: 4px; border: 1px solid ${COLOURS.border};">
  <tr>
    <td align="center" style="padding: 20px 16px;">
      <p style="margin: 0 0 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: ${COLOURS.inkMuted};">${label}</p>
      <p style="margin: 0; font-family: 'JetBrains Mono', Menlo, Monaco, Consolas, monospace; font-size: 28px; font-weight: 600; letter-spacing: 0.18em; color: ${COLOURS.forest};">{{ .Token }}</p>
    </td>
  </tr>
</table>`
}

/** Notification banner for security emails. */
const NOTIFICATION_BANNER = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin: 0 0 20px; background-color: ${COLOURS.limeSoft}; border-radius: 4px; border: 1px solid ${COLOURS.border};">
  <tr>
    <td style="padding: 12px 14px;">
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: ${COLOURS.forest};">Security notification</p>
      <p style="margin: 4px 0 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: ${COLOURS.inkMuted};">For your records. No action is required if you made this change.</p>
    </td>
  </tr>
</table>`

/** Action email security note before the footer. */
const ACTION_SECURITY_NOTE = `<p style="margin: 24px 0 0; padding-top: 20px; border-top: 1px solid ${COLOURS.border}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.55; color: ${COLOURS.inkMuted};">If you did not request this email, you can safely ignore it. This link or code expires shortly and can only be used once.</p>`

/** Notification security note before the footer. */
const NOTIFICATION_SECURITY_NOTE = `<p style="margin: 24px 0 0; padding-top: 20px; border-top: 1px solid ${COLOURS.border}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.55; color: ${COLOURS.inkMuted};">If you did not make this change, <a href="{{ .SiteURL }}/help" style="color: ${COLOURS.forest}; font-weight: 600; text-decoration: underline;">contact support</a> immediately to secure your account.</p>`

/** Lite footer inspired by the website bottom bar: compact legal row and copyright. */
const EMAIL_LITE_FOOTER = `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top: 28px; border-top: 1px solid ${COLOURS.border};">
  <tr>
    <td style="padding: 20px 28px 16px; background-color: ${COLOURS.offWhite};">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td align="left" style="padding-bottom: 12px;">
            <span style="font-family: Georgia, 'Times New Roman', serif; font-size: 14px; color: ${COLOURS.forest};">Instant Strata</span>
            <span style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${COLOURS.inkMuted};">&nbsp;&nbsp;Strata management, simplified.</span>
          </td>
        </tr>
        <tr>
          <td>
            <a href="{{ .SiteURL }}/terms" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${COLOURS.forest}; text-decoration: underline;">Terms of service</a>
            <span style="color: ${COLOURS.border};">&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span>
            <a href="{{ .SiteURL }}/privacy" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${COLOURS.forest}; text-decoration: underline;">Privacy statement</a>
            <span style="color: ${COLOURS.border};">&nbsp;&nbsp;&middot;&nbsp;&nbsp;</span>
            <a href="{{ .SiteURL }}/help" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; color: ${COLOURS.forest}; text-decoration: underline;">Help &amp; support</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td align="center" style="padding: 10px 28px; background-color: ${COLOURS.forest};">
      <p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; color: rgba(255,255,255,0.55);">&copy; Instant Strata Pty Ltd 2026</p>
    </td>
  </tr>
</table>`

const PLAIN_FOOTER = `---
Instant Strata
Strata management, simplified.

Terms of service: {{ .SiteURL }}/terms
Privacy statement: {{ .SiteURL }}/privacy
Help & support: {{ .SiteURL }}/help

© Instant Strata Pty Ltd 2026`

const PLAIN_ACTION_NOTE =
  "If you did not request this email, you can safely ignore it. This link or code expires shortly and can only be used once."

const PLAIN_NOTIFICATION_NOTE =
  "If you did not make this change, contact support immediately: {{ .SiteURL }}/help"

/** Wrap body copy in the branded email shell. */
function wrapAuthEmailHtml({
  body,
  kind,
}: {
  body: string
  kind: AuthEmailTemplateKind
}) {
  const trailingNote =
    kind === "notification" ? NOTIFICATION_SECURITY_NOTE : ACTION_SECURITY_NOTE

  return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: ${COLOURS.offWhite}; margin: 0; padding: 0;">
  <tr>
    <td align="center" style="padding: 32px 16px;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 560px; background-color: ${COLOURS.white}; border: 1px solid ${COLOURS.border}; border-radius: 4px; overflow: hidden;">
        <tr>
          <td style="padding: 32px 28px 0;">
            ${EMAIL_HEADER}
            ${EMAIL_ACCENT_RULE}
            ${body}
            ${trailingNote}
          </td>
        </tr>
        <tr>
          <td style="padding: 0;">
            ${EMAIL_LITE_FOOTER}
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`
}

/** Shared body typography helpers. */
const H2 = (text: string) =>
  `<h2 style="margin: 0 0 14px; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 400; color: ${COLOURS.forest}; line-height: 1.25;">${text}</h2>`

const P = (text: string) =>
  `<p style="margin: 0 0 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: ${COLOURS.forest};">${text}</p>`

const PIN_INTRO = (text: string) =>
  `<p style="margin: 0 0 12px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.55; color: ${COLOURS.inkMuted};">${text}</p>`

/** Templates that require user action (link and/or PIN). */
export const AUTH_ACTION_EMAIL_TEMPLATES: AuthEmailTemplate[] = [
  {
    id: "confirm-signup",
    name: "Confirm signup",
    kind: "action",
    dashboardPath: "Authentication → Email Templates",
    supabaseKey: "mailer_templates_confirmation_content",
    trigger:
      "Sent when a user creates an account with email and password and email confirmation is enabled.",
    subject: "Confirm your Instant Strata account",
    html: wrapAuthEmailHtml({
      kind: "action",
      body: `
${H2("Confirm your email address")}
${P("Thanks for joining Instant Strata. Confirm <strong>{{ .Email }}</strong> to finish setting up your account and access your workspace.")}
${emailCta({ href: "{{ .ConfirmationURL }}", label: "Confirm email address" })}
${PIN_INTRO("Or enter this one-time code on the sign-in page:")}
${emailPinBlock({ label: "Confirmation code" })}
`,
    }),
    plainText: `Instant Strata
Strata management, simplified.

Confirm your email address

Thanks for joining Instant Strata. Confirm {{ .Email }} to finish setting up your account.

Confirm your email: {{ .ConfirmationURL }}

Or enter this one-time code on the sign-in page: {{ .Token }}

${PLAIN_FOOTER}

${PLAIN_ACTION_NOTE}`,
    variables: ["ConfirmationURL", "Token", "Email", "SiteURL"],
  },
  {
    id: "magic-link",
    name: "Magic link",
    kind: "action",
    dashboardPath: "Authentication → Email Templates",
    supabaseKey: "mailer_templates_magic_link_content",
    trigger:
      "Sent when a user chooses Continue with magic link or requests a passwordless sign-in via signInWithOtp.",
    subject: "Sign in to Instant Strata",
    html: wrapAuthEmailHtml({
      kind: "action",
      body: `
${H2("Sign in to Instant Strata")}
${P("Use the button below to sign in to <strong>{{ .Email }}</strong>. No password needed.")}
${emailCta({ href: "{{ .ConfirmationURL }}", label: "Sign in to Instant Strata" })}
${PIN_INTRO("Or enter this one-time PIN on the sign-in page:")}
${emailPinBlock()}
`,
    }),
    plainText: `Instant Strata
Strata management, simplified.

Sign in to Instant Strata

Use the link below to sign in to {{ .Email }}. No password needed.

Sign in: {{ .ConfirmationURL }}

Or enter this one-time PIN on the sign-in page: {{ .Token }}

${PLAIN_FOOTER}

${PLAIN_ACTION_NOTE}`,
    variables: ["ConfirmationURL", "Token", "Email", "SiteURL", "RedirectTo"],
  },
  {
    id: "reset-password",
    name: "Reset password",
    kind: "action",
    dashboardPath: "Authentication → Email Templates",
    supabaseKey: "mailer_templates_recovery_content",
    trigger:
      "Sent when a user clicks Forgot password? and requests a password reset via resetPasswordForEmail.",
    subject: "Reset your Instant Strata password",
    html: wrapAuthEmailHtml({
      kind: "action",
      body: `
${H2("Reset your password")}
${P("We received a request to reset the password for <strong>{{ .Email }}</strong>. Choose a new password to regain access to your workspace.")}
${emailCta({ href: "{{ .ConfirmationURL }}", label: "Choose a new password" })}
${PIN_INTRO("Or enter this one-time code on the reset page:")}
${emailPinBlock({ label: "Reset code" })}
`,
    }),
    plainText: `Instant Strata
Strata management, simplified.

Reset your password

We received a request to reset the password for {{ .Email }}.

Choose a new password: {{ .ConfirmationURL }}

Or enter this one-time code on the reset page: {{ .Token }}

${PLAIN_FOOTER}

${PLAIN_ACTION_NOTE}`,
    variables: ["ConfirmationURL", "Token", "Email", "SiteURL"],
  },
  {
    id: "invite-user",
    name: "Invite user",
    kind: "action",
    dashboardPath: "Authentication → Email Templates",
    supabaseKey: "mailer_templates_invite_content",
    trigger:
      "Sent when an administrator invites a user via inviteUserByEmail (e.g. a new strata manager or committee member).",
    subject: "You have been invited to Instant Strata",
    html: wrapAuthEmailHtml({
      kind: "action",
      body: `
${H2("You have been invited")}
${P("You have been invited to join Instant Strata as <strong>{{ .Email }}</strong>. Accept the invitation to set up your account and access your scheme workspace.")}
${emailCta({ href: "{{ .ConfirmationURL }}", label: "Accept invitation" })}
${PIN_INTRO("Or enter this one-time code on the sign-in page:")}
${emailPinBlock({ label: "Invitation code" })}
`,
    }),
    plainText: `Instant Strata
Strata management, simplified.

You have been invited

You have been invited to join Instant Strata as {{ .Email }}.

Accept invitation: {{ .ConfirmationURL }}

Or enter this one-time code on the sign-in page: {{ .Token }}

${PLAIN_FOOTER}

${PLAIN_ACTION_NOTE}`,
    variables: ["ConfirmationURL", "Token", "Email", "SiteURL", "Data"],
  },
  {
    id: "reauthentication",
    name: "Reauthentication",
    kind: "action",
    dashboardPath: "Authentication → Email Templates",
    supabaseKey: "mailer_templates_reauthentication_content",
    trigger:
      "Sent when a sensitive action requires the user to re-verify their identity (e.g. changing account settings or confirming a high-risk operation).",
    subject: "Your Instant Strata verification code",
    html: wrapAuthEmailHtml({
      kind: "action",
      body: `
${H2("Verify it is you")}
${P("Enter this verification code to continue with your request for <strong>{{ .Email }}</strong>.")}
${emailPinBlock({ label: "Verification code" })}
<p style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.55; color: ${COLOURS.inkMuted};">This code expires shortly. Do not share it with anyone.</p>
`,
    }),
    plainText: `Instant Strata
Strata management, simplified.

Verify it is you

Enter this verification code to continue with your request for {{ .Email }}.

Verification code: {{ .Token }}

This code expires shortly. Do not share it with anyone.

${PLAIN_FOOTER}

${PLAIN_ACTION_NOTE}`,
    variables: ["Token", "Email", "SiteURL"],
  },
]

/** Informational security notifications. No approval link or PIN. */
export const AUTH_NOTIFICATION_EMAIL_TEMPLATES: AuthEmailTemplate[] = [
  {
    id: "email-changed",
    name: "Email address changed",
    kind: "notification",
    dashboardPath: "Authentication → Email Templates → Security notifications",
    supabaseKey: "email_changed_notification",
    trigger:
      "Sent to the previous address after an email change completes. Instant Strata applies email changes without a separate confirmation step, so this is a record-only notice.",
    subject: "Your Instant Strata email address was changed",
    html: wrapAuthEmailHtml({
      kind: "notification",
      body: `
${NOTIFICATION_BANNER}
${H2("Your email address was changed")}
${P("The email on your Instant Strata account was updated from <strong>{{ .OldEmail }}</strong> to <strong>{{ .Email }}</strong>.")}
${P("You do not need to approve this change. Sign in with your new email address next time.")}
${emailOutlineLink({ href: "{{ .SiteURL }}/help", label: "Contact support if this was not you" })}
`,
    }),
    plainText: `Instant Strata
Strata management, simplified.

Security notification

Your email address was changed

The email on your Instant Strata account was updated from {{ .OldEmail }} to {{ .Email }}.

You do not need to approve this change. Sign in with your new email address next time.

Contact support if this was not you: {{ .SiteURL }}/help

${PLAIN_FOOTER}

${PLAIN_NOTIFICATION_NOTE}`,
    variables: ["Email", "OldEmail", "SiteURL", "Data"],
  },
  {
    id: "password-changed",
    name: "Password changed",
    kind: "notification",
    dashboardPath: "Authentication → Email Templates → Security notifications",
    supabaseKey: "password_changed_notification",
    trigger:
      "Sent after a user successfully sets a new password. Informational only: no link or PIN required.",
    subject: "Your Instant Strata password was changed",
    html: wrapAuthEmailHtml({
      kind: "notification",
      body: `
${NOTIFICATION_BANNER}
${H2("Your password was changed")}
${P("The password for your Instant Strata account (<strong>{{ .Email }}</strong>) was changed successfully.")}
${P("If you made this change, no further action is needed.")}
${emailOutlineLink({ href: "{{ .SiteURL }}/help", label: "Contact support if this was not you" })}
`,
    }),
    plainText: `Instant Strata
Strata management, simplified.

Security notification

Your password was changed

The password for your Instant Strata account ({{ .Email }}) was changed successfully.

If you made this change, no further action is needed.

Contact support if this was not you: {{ .SiteURL }}/help

${PLAIN_FOOTER}

${PLAIN_NOTIFICATION_NOTE}`,
    variables: ["Email", "SiteURL", "Data"],
  },
]

/** All auth-related email templates. */
export const AUTH_EMAIL_TEMPLATES: AuthEmailTemplate[] = [
  ...AUTH_ACTION_EMAIL_TEMPLATES,
  ...AUTH_NOTIFICATION_EMAIL_TEMPLATES,
]

/** Supabase Go template variables available across auth emails. */
export const SUPABASE_EMAIL_VARIABLES = [
  {
    name: "ConfirmationURL",
    description: "Full verification URL. Action templates only. Single-use; may be consumed by link prefetching in some inboxes.",
  },
  {
    name: "Token",
    description: "Six-digit one-time password. Action templates only.",
  },
  {
    name: "TokenHash",
    description: "Hashed token for building custom confirmation URLs on your own domain.",
  },
  {
    name: "SiteURL",
    description: "Site URL from Supabase project settings. Used for footer legal links.",
  },
  {
    name: "RedirectTo",
    description: "Redirect URL passed from the client when initiating auth.",
  },
  {
    name: "Email",
    description: "The user's email address. In email-changed notifications, this is the new address.",
  },
  {
    name: "OldEmail",
    description: "Previous email address. Email address changed notification only.",
  },
  {
    name: "NewEmail",
    description: "Requested new email. Only used if secure email change confirmation is enabled in Supabase.",
  },
  {
    name: "Data",
    description: "User metadata object (e.g. first_name from signUp options).",
  },
]
