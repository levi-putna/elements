import Link from "next/link"

import { CodeBlock } from "@/components/docs/code-block"
import { DocsPage } from "@/components/docs/docs-page"
import { EmailTemplateCard } from "@/components/docs/email-template-card"
import { PropTable } from "@/components/docs/prop-table"
import {
  AUTH_ACTION_EMAIL_TEMPLATES,
  AUTH_NOTIFICATION_EMAIL_TEMPLATES,
  SUPABASE_EMAIL_VARIABLES,
} from "@/lib/auth-email-templates"

const SUPABASE_SETUP = `# Supabase dashboard

# Action templates: Authentication → Email Templates
# Notifications: Authentication → Email Templates → Security notifications

# Instant Strata applies email changes without a separate confirmation step.
# Enable the security notifications below and leave "Change email address"
# unused, or disable secure email change in project auth settings.

# Local development (config.toml excerpt):
[auth.email.template.magic_link]
subject = "Sign in to Instant Strata"
content_path = "./supabase/templates/magic-link.html"

[auth.email.notification.email_changed]
subject = "Your Instant Strata email address was changed"
content_path = "./supabase/templates/email-changed.html"`

const VERIFY_OTP = `// Client: verify the PIN from action emails (matches AuthForm onPinSubmit)
const { data, error } = await supabase.auth.verifyOtp({
  email,
  token: pin,
  type: "email", // or "signup" | "recovery" | "invite"
})

// Notification emails (email changed, password changed) do not use verifyOtp.`

const VARIABLE_PROPS = SUPABASE_EMAIL_VARIABLES.map((variable) => ({
  name: variable.name,
  type: "string",
  description: variable.description,
}))

/**
 * Documentation for Instant Strata Supabase authentication email templates.
 */
export default function AuthenticationEmailsPage() {
  return (
    <DocsPage width="wide">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Emails / Authentication
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Authentication emails
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          Branded Supabase Auth email templates for Instant Strata. Templates fall into two
          groups:{" "}
          <strong className="font-semibold text-foreground">action required</strong> (sign-in,
          signup, reset, invite) and{" "}
          <strong className="font-semibold text-foreground">notifications</strong> (email or
          password changed). Notifications are informational only: no approval link, no PIN.
          Email changes in Instant Strata do not require a separate confirmation step; users
          receive a security notification after the change completes. Copy HTML into the
          Supabase dashboard. Templates pair with the{" "}
          <Link
            href="/components/authentication"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Authentication
          </Link>{" "}
          UI for action flows.
        </p>
      </div>

      {/* Action templates overview */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Action required
        </h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed max-w-prose">
          User must click a link or enter a PIN. Includes confirmation link and{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            {"{{ .Token }}"}
          </code>{" "}
          where applicable.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {AUTH_ACTION_EMAIL_TEMPLATES.map((template) => (
            <a
              key={template.id}
              href={`#${template.id}`}
              className="rounded-sm border border-border bg-off-white p-4 no-underline hover:bg-secondary transition-colors"
            >
              <p className="text-sm font-semibold text-foreground">{template.name}</p>
              <p className="mt-1 text-xs text-ink-muted leading-relaxed line-clamp-2">
                {template.trigger}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Notification templates overview */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Notifications
        </h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed max-w-prose">
          Security notices sent after a change completes. No approval step. Includes a
          support link if the user did not authorise the change.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {AUTH_NOTIFICATION_EMAIL_TEMPLATES.map((template) => (
            <a
              key={template.id}
              href={`#${template.id}`}
              className="rounded-sm border border-border bg-off-white p-4 no-underline hover:bg-secondary transition-colors"
            >
              <p className="text-sm font-semibold text-foreground">{template.name}</p>
              <p className="mt-1 text-xs text-ink-muted leading-relaxed line-clamp-3">
                {template.trigger}
              </p>
            </a>
          ))}
        </div>
      </section>

      {/* Design principles */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Design principles
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-sm border border-border bg-off-white p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Action vs notification</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Action emails include a forest CTA and optional PIN block. Notifications use
              a lime-soft banner, plain copy, and a support link. Never ask users to approve
              an email change that has already happened.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-off-white p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Branded shell</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Each template includes the IS mark header, lime accent rule, and lite footer
              with legal links and copyright.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-off-white p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Plain language</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Copy follows Instant Strata voice: direct, professional, no legal jargon. Say
              what happened, what to do next, and when to contact support.
            </p>
          </div>
          <div className="rounded-sm border border-border bg-off-white p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">Production delivery</h3>
            <p className="text-sm text-ink-muted leading-relaxed">
              Use custom SMTP with a dedicated subdomain (e.g.{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                auth.instantstrata.com.au
              </code>
              ). Disable link tracking on auth emails.
            </p>
          </div>
        </div>
      </section>

      {/* Action template cards */}
      <section className="mb-10 pt-10 border-t border-border space-y-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
          Action template content
        </h2>
        {AUTH_ACTION_EMAIL_TEMPLATES.map((template) => (
          <EmailTemplateCard key={template.id} template={template} />
        ))}
      </section>

      {/* Notification template cards */}
      <section className="mb-10 pt-10 border-t border-border space-y-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted">
          Notification template content
        </h2>
        {AUTH_NOTIFICATION_EMAIL_TEMPLATES.map((template) => (
          <EmailTemplateCard key={template.id} template={template} />
        ))}
      </section>

      {/* Supabase setup */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Supabase setup
        </h2>
        <CodeBlock code={SUPABASE_SETUP} language="bash" />
      </section>

      {/* OTP verification */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Verify OTP on the client
        </h2>
        <p className="text-sm text-ink-muted mb-4 leading-relaxed max-w-prose">
          Action templates only. Match the{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">type</code>{" "}
          to the flow:{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">email</code>{" "}
          for magic link,{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">signup</code>{" "}
          for confirm signup,{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            recovery
          </code>{" "}
          for reset password. Notification emails do not use OTP.
        </p>
        <CodeBlock code={VERIFY_OTP} language="tsx" />
      </section>

      {/* Variables reference */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Supabase template variables
        </h2>
        <PropTable props={VARIABLE_PROPS} />
      </section>
    </DocsPage>
  )
}
