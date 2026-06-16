import Link from "next/link";
import { AuthPreview } from "@/components/docs/auth-preview";
import { CodeBlock } from "@/components/docs/code-block";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { AuthForm } from "@/components/ui/auth-form";
import { AuthLayout } from "@/components/ui/auth-layout";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/auth/registry.json`;

const LOGIN_PAGE = `import { AuthForm } from "@/components/ui/auth-form"
import { AuthLayout } from "@/components/ui/auth-layout"

export default function LoginPage() {
  return (
    <AuthLayout logoHref="/">
      <AuthForm
        mode="login"
        onGoogleSignIn={() => signInWithGoogle()}
        onMicrosoftSignIn={() => signInWithMicrosoft()}
        onEmailPasswordSubmit={({ email, password }) =>
          signInWithPassword({ email, password })
        }
        onMagicLinkSubmit={({ email }) => sendMagicLink({ email })}
        onPinSubmit={({ email, pin }) => verifyMagicLinkPin({ email, pin })}
      />
    </AuthLayout>
  )
}`;

const JOIN_PAGE = `import { AuthForm } from "@/components/ui/auth-form"
import { AuthLayout } from "@/components/ui/auth-layout"

export default function JoinPage() {
  return (
    <AuthLayout logoHref="/">
      <AuthForm
        mode="join"
        onGoogleSignIn={() => signInWithGoogle()}
        onMicrosoftSignIn={() => signInWithMicrosoft()}
        onEmailPasswordSubmit={({ email, password, firstName, lastName }) =>
          signUpWithPassword({ email, password, firstName, lastName })
        }
        onMagicLinkSubmit={({ email }) => sendMagicLink({ email })}
        onPinSubmit={({ email, pin }) => verifyMagicLinkPin({ email, pin })}
      />
    </AuthLayout>
  )
}`;

const MAGIC_LINK_FLOW = `/*
 * Auth form steps
 *
 * 1. credentials (default)
 *    Social buttons (Google, Microsoft), magic link option, then email/password.
 *    Join mode adds first and last name in a two-column row.
 *
 * 2. magic-link-email
 *    Email-only step after "Continue with magic link".
 *
 * 3. magic-link-sent
 *    Confirmation copy plus InputOTP (3 + 3 grouping).
 *
 * Wire onEmailPasswordSubmit to supabase.auth.signInWithPassword / signUp.
 * Wire onMagicLinkSubmit to supabase.auth.signInWithOtp({ email }).
 * Wire onPinSubmit to supabase.auth.verifyOtp({ email, token: pin, type: "email" }).
 */`;

const LAYOUT_PROPS = [
  {
    name: "children",
    type: "ReactNode",
    description: "Form column content, typically AuthForm.",
  },
  {
    name: "logoHref",
    type: "string",
    default: '"/"',
    description: "Destination for the Instant Strata logo link.",
  },
  {
    name: "imageSrc",
    type: "string",
    description: "Cover image for the right column. Defaults to the building photo via assetPath().",
  },
  {
    name: "imageAlt",
    type: "string",
    description: "Accessible description for the cover image.",
  },
  {
    name: "brandContent",
    type: "ReactNode",
    description: "Optional override for the centred brand copy over the image.",
  },
];

const FORM_PROPS = [
  {
    name: "mode",
    type: '"login" | "join"',
    default: '"login"',
    description: "Switches heading, fields, and primary button label.",
  },
  {
    name: "defaultMode",
    type: '"login" | "join"',
    default: '"login"',
    description: "Initial mode when uncontrolled.",
  },
  {
    name: "step",
    type: '"credentials" | "magic-link-email" | "magic-link-sent"',
    description: "Controlled step for the active auth view.",
  },
  {
    name: "defaultStep",
    type: '"credentials" | "magic-link-email" | "magic-link-sent"',
    default: '"credentials"',
    description: "Initial step when uncontrolled.",
  },
  {
    name: "email",
    type: "string",
    description: "Email value (controlled).",
  },
  {
    name: "defaultEmail",
    type: "string",
    description: "Initial email value when uncontrolled.",
  },
  {
    name: "pin",
    type: "string",
    description: "Controlled OTP value for the PIN step.",
  },
  {
    name: "onGoogleSignIn",
    type: "() => void",
    description: "Called when the user chooses Google.",
  },
  {
    name: "onMicrosoftSignIn",
    type: "() => void",
    description: "Called when the user chooses Microsoft.",
  },
  {
    name: "onEmailPasswordSubmit",
    type: "({ email, password, firstName?, lastName? }) => void",
    description: "Called when the user submits the email/password form.",
  },
  {
    name: "onMagicLinkSubmit",
    type: "({ email: string }) => void",
    description: "Called when the user submits their email for a magic link.",
  },
  {
    name: "onPinSubmit",
    type: "({ email: string; pin: string }) => void",
    description: "Called when the user submits the one-time PIN.",
  },
  {
    name: "onModeChange",
    type: "({ mode: AuthMode }) => void",
    description: "Called when the user toggles between login and join.",
  },
  {
    name: "onStepChange",
    type: "({ step: AuthFormStep }) => void",
    description: "Called when the form step changes.",
  },
  {
    name: "passwordLoading",
    type: "boolean",
    default: "false",
    description: "Loading state on the email/password submit button.",
  },
  {
    name: "magicLinkLoading",
    type: "boolean",
    default: "false",
    description: "Loading state on the magic-link submit button.",
  },
  {
    name: "pinLoading",
    type: "boolean",
    default: "false",
    description: "Loading state on the PIN verify button.",
  },
];

const flows = [
  {
    title: "Social OAuth",
    body: "Google and Microsoft sit side by side in a two-column row on wider viewports. Wire to Supabase signInWithOAuth in production.",
  },
  {
    title: "Magic link",
    body: "A third outline button under social options opens a dedicated email step. After submit, the user sees confirmation copy and a 6-digit PIN field.",
  },
  {
    title: "Email and password",
    body: "The default path below the divider. Login uses email and password. Join adds first and last name in a two-column row above email and password.",
  },
  {
    title: "Brand panel",
    body: "The right column shows the building cover image with a forest overlay and centred Instant Strata value props. Uses assetPath() so images resolve under a Next.js basePath.",
  },
];

/**
 * Documentation for Instant Strata authentication UI: layout, flows, and Supabase wiring notes.
 */
export default function AuthenticationPage() {
  return (
    <DocsPage width="wide">
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Application
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Authentication
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          Login and join flows for Instant Strata. The layout follows the two-column{" "}
          <a
            href="https://ui.shadcn.com/blocks/signup#signup-02"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn signup-02
          </a>{" "}
          pattern: form on the left, cover image with brand detail on the right. Sign-in
          options are ordered social first, magic link second, email and password third.
          These components are UI only; wire callbacks to Supabase Auth in production.
          Email copy for each Supabase template is in{" "}
          <Link
            href="/emails/authentication"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Authentication emails
          </Link>
          .
        </p>
      </div>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL} language="bash" />
        <p className="text-sm text-ink-muted mt-3 leading-relaxed max-w-prose">
          Installs{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            auth-layout.tsx
          </code>{" "}
          and{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            auth-form.tsx
          </code>
          . Requires logo, button, field, input, input-otp, separator, and utils from
          this registry.
        </p>
      </section>

      {/* Flow overview */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Flows
        </h2>
        <p className="text-sm text-ink-muted mb-6 leading-relaxed max-w-prose">
          Three sign-in paths share one layout. Social and magic link sit above the
          divider; email and password is the standard fallback below it.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {flows.map((flow) => (
            <div
              key={flow.title}
              className="rounded-sm border border-border bg-off-white p-5"
            >
              <h3 className="font-sans text-sm font-semibold text-foreground mb-2">
                {flow.title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">{flow.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive login preview */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Login
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Email and password below the divider. Click &quot;Continue with magic link&quot;
          to try the alternate flow, or toggle to join via the footer link.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          <AuthPreview defaultMode="login" />
        </div>
      </section>

      {/* Join preview */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Join
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          First and last name share a row. Email and password follow full width.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          <AuthLayout logoHref="#">
            <AuthForm mode="join" />
          </AuthLayout>
        </div>
      </section>

      {/* Magic link sent preview */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Magic link sent
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Final step after magic link submit. Explains that a link and PIN were sent,
          then collects the 6-digit code.
        </p>
        <div className="rounded-sm border border-border overflow-hidden">
          <AuthPreview
            defaultMode="login"
            defaultStep="magic-link-sent"
            defaultEmail="manager@instantstrata.com.au"
          />
        </div>
      </section>

      {/* Supabase notes */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Supabase integration (production)
        </h2>
        <div className="max-w-prose space-y-4 text-sm text-ink-muted leading-relaxed">
          <p>
            These components do not call Supabase directly. When you wire the production
            app, map callbacks as follows:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="font-semibold text-foreground">onGoogleSignIn</strong>{" "}
              and{" "}
              <strong className="font-semibold text-foreground">onMicrosoftSignIn</strong>
              :{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                supabase.auth.signInWithOAuth
              </code>
              .
            </li>
            <li>
              <strong className="font-semibold text-foreground">
                onEmailPasswordSubmit
              </strong>
              :{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                signInWithPassword
              </code>{" "}
              for login,{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                signUp
              </code>{" "}
              for join (pass first and last name as user metadata).
            </li>
            <li>
              <strong className="font-semibold text-foreground">onMagicLinkSubmit</strong>
              :{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                supabase.auth.signInWithOtp
              </code>
              . Advance to{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                magic-link-sent
              </code>{" "}
              on success.
            </li>
            <li>
              <strong className="font-semibold text-foreground">onPinSubmit</strong>:{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                supabase.auth.verifyOtp
              </code>{" "}
              with{" "}
              <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
                type: &quot;email&quot;
              </code>
              .
            </li>
          </ul>
        </div>
        <div className="mt-6">
          <CodeBlock code={MAGIC_LINK_FLOW} language="tsx" />
        </div>
      </section>

      {/* Asset paths */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Cover image and basePath
        </h2>
        <p className="text-sm text-ink-muted leading-relaxed max-w-prose">
          The default cover image uses{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            assetPath()
          </code>{" "}
          from{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            lib/utils
          </code>
          . Apps served under a Next.js{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            basePath
          </code>{" "}
          should set{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            NEXT_PUBLIC_BASE_PATH
          </code>{" "}
          so public assets resolve correctly. Without it, paths like{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">
            /img/building/1.webp
          </code>{" "}
          are used as-is.
        </p>
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Usage
        </h2>
        <h3 className="text-sm font-semibold text-foreground mb-3">Login page</h3>
        <CodeBlock code={LOGIN_PAGE} language="tsx" />
        <h3 className="text-sm font-semibold text-foreground mb-3 mt-8">Join page</h3>
        <CodeBlock code={JOIN_PAGE} language="tsx" />
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          AuthLayout props
        </h2>
        <PropTable props={LAYOUT_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          AuthForm props
        </h2>
        <PropTable props={FORM_PROPS} />
      </section>
    </DocsPage>
  );
}
