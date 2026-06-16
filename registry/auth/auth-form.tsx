"use client"

import * as React from "react"
import type { SVGProps } from "react"
import { MailIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputOTP } from "@/components/ui/input-otp"
import { Separator } from "@/components/ui/separator"

export type AuthMode = "login" | "join"

export type AuthFormStep = "credentials" | "magic-link-email" | "magic-link-sent"

/** Google brand glyph for social sign-in buttons. */
export function GoogleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" {...props}>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62Z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
        fill="#EA4335"
      />
    </svg>
  )
}

/** Microsoft brand glyph for social sign-in buttons. */
export function MicrosoftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-4" {...props}>
      <path fill="#F25022" d="M1 1h10v10H1z" />
      <path fill="#00A4EF" d="M13 1h10v10H13z" />
      <path fill="#7FBA00" d="M1 13h10v10H1z" />
      <path fill="#FFB900" d="M13 13h10v10H13z" />
    </svg>
  )
}

export interface AuthFormProps extends React.ComponentProps<"div"> {
  /** Login or join copy and field layout. */
  mode?: AuthMode
  /** Initial mode when uncontrolled. */
  defaultMode?: AuthMode
  /** Controlled step for magic-link verification UI. */
  step?: AuthFormStep
  /** Initial step when uncontrolled. */
  defaultStep?: AuthFormStep
  /** Email shown in the magic-link sent state. */
  email?: string
  /** Initial email when uncontrolled. */
  defaultEmail?: string
  /** PIN value for controlled OTP input. */
  pin?: string
  /** Called when the user submits email and password credentials. */
  onEmailPasswordSubmit?: ({
    email,
    password,
    firstName,
    lastName,
  }: {
    email: string
    password: string
    firstName?: string
    lastName?: string
  }) => void
  /** Called when the user submits a magic-link email. */
  onMagicLinkSubmit?: ({ email }: { email: string }) => void
  /** Called when the user submits the one-time PIN. */
  onPinSubmit?: ({ email, pin }: { email: string; pin: string }) => void
  /** Called when the user chooses Google sign-in. */
  onGoogleSignIn?: () => void
  /** Called when the user chooses Microsoft sign-in. */
  onMicrosoftSignIn?: () => void
  /** Called when the user switches between login and join. */
  onModeChange?: ({ mode }: { mode: AuthMode }) => void
  /** Called when the form step changes. */
  onStepChange?: ({ step }: { step: AuthFormStep }) => void
  /** Shows loading state on the email/password submit button. */
  passwordLoading?: boolean
  /** Shows loading state on the magic-link submit button. */
  magicLinkLoading?: boolean
  /** Shows loading state on the PIN verify button. */
  pinLoading?: boolean
}

/**
 * Authentication form with social providers, magic link, and email/password
 * credentials. UI only: wire callbacks to Supabase in production.
 */
export function AuthForm({
  mode: modeProp,
  defaultMode = "login",
  step: stepProp,
  defaultStep = "credentials",
  email: emailProp,
  defaultEmail = "",
  pin: pinProp,
  onEmailPasswordSubmit,
  onMagicLinkSubmit,
  onPinSubmit,
  onGoogleSignIn,
  onMicrosoftSignIn,
  onModeChange,
  onStepChange,
  passwordLoading = false,
  magicLinkLoading = false,
  pinLoading = false,
  className,
  ...props
}: AuthFormProps) {
  const [mode, setMode] = React.useState<AuthMode>(defaultMode)
  const [step, setStep] = React.useState<AuthFormStep>(defaultStep)
  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState(defaultEmail)
  const [password, setPassword] = React.useState("")
  const [pin, setPin] = React.useState("")

  const activeMode = modeProp ?? mode
  const activeStep = stepProp ?? step
  const activeEmail = emailProp ?? email
  const activePin = pinProp ?? pin

  const isJoin = activeMode === "join"
  const heading = isJoin ? "Create your account" : "Welcome back"
  const subheading = isJoin
    ? "Join Instant Strata to manage schemes, lots, and owner communication in one place."
    : "Sign in to your Instant Strata workspace."

  /** Update the active step when uncontrolled. */
  const goToStep = (nextStep: AuthFormStep) => {
    if (stepProp == null) {
      setStep(nextStep)
    }
    onStepChange?.({ step: nextStep })
  }

  /** Submit email and password credentials. */
  const handleEmailPasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onEmailPasswordSubmit?.({
      email: activeEmail,
      password,
      ...(isJoin ? { firstName, lastName } : {}),
    })
  }

  /** Advance to the magic-link sent step after email submission. */
  const handleMagicLinkSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onMagicLinkSubmit?.({ email: activeEmail })
    goToStep("magic-link-sent")
  }

  /** Submit the one-time PIN for verification. */
  const handlePinSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onPinSubmit?.({ email: activeEmail, pin: activePin })
  }

  /** Toggle between login and join modes. */
  const handleModeToggle = () => {
    const nextMode: AuthMode = isJoin ? "login" : "join"
    if (modeProp == null) {
      setMode(nextMode)
    }
    onModeChange?.({ mode: nextMode })
  }

  if (activeStep === "magic-link-sent") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        {/* Magic link sent header */}
        <div className="flex flex-col gap-2 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-sm bg-lime-soft text-forest">
            <MailIcon className="size-5" aria-hidden="true" />
          </div>
          <h1 className="font-display text-2xl text-foreground">Check your email</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We sent an email to{" "}
            <span className="font-medium text-foreground">{activeEmail}</span> with a
            sign-in link and a one-time PIN. Open the link on this device, or enter
            the PIN below.
          </p>
        </div>

        {/* PIN verification */}
        <form onSubmit={handlePinSubmit} className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="auth-pin">One-time PIN</FieldLabel>
              <div className="flex justify-center pt-1">
                <InputOTP
                  length={6}
                  groupSizes={[3, 3]}
                  value={activePin}
                  onValueChange={(value) => {
                    if (pinProp == null) {
                      setPin(value)
                    }
                  }}
                />
              </div>
              <FieldDescription className="text-center">
                Enter the 6-digit code from your email. Codes expire after 10 minutes.
              </FieldDescription>
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full" loading={pinLoading}>
            Verify PIN
          </Button>
        </form>

        {/* Back to magic link email */}
        <p className="text-center text-sm text-muted-foreground">
          Wrong address?{" "}
          <button
            type="button"
            onClick={() => {
              if (pinProp == null) {
                setPin("")
              }
              goToStep("magic-link-email")
            }}
            className="font-medium text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Use a different email
          </button>
        </p>
      </div>
    )
  }

  if (activeStep === "magic-link-email") {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        {/* Magic link email header */}
        <div className="flex flex-col gap-2 text-center">
          <h1 className="font-display text-2xl text-foreground">Magic link sign-in</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enter your email and we will send a secure sign-in link and a one-time PIN.
            No password required.
          </p>
        </div>

        {/* Magic link email form */}
        <form onSubmit={handleMagicLinkSubmit} className="flex flex-col gap-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="auth-magic-email" required>
                Email
              </FieldLabel>
              <Input
                id="auth-magic-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com.au"
                required
                value={activeEmail}
                onChange={(event) => {
                  if (emailProp == null) {
                    setEmail(event.target.value)
                  }
                }}
              />
            </Field>
          </FieldGroup>

          <Button type="submit" className="w-full" loading={magicLinkLoading}>
            Send magic link
          </Button>
        </form>

        {/* Back to password sign-in */}
        <p className="text-center text-sm text-muted-foreground">
          Prefer a password?{" "}
          <button
            type="button"
            onClick={() => goToStep("credentials")}
            className="font-medium text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Use email and password
          </button>
        </p>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {/* Heading */}
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-display text-2xl text-foreground">{heading}</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">{subheading}</p>
      </div>

      {/* Social and magic link options */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onGoogleSignIn}
          >
            <GoogleIcon />
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onMicrosoftSignIn}
          >
            <MicrosoftIcon />
            Microsoft
          </Button>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => goToStep("magic-link-email")}
        >
          <MailIcon className="size-4" aria-hidden="true" />
          Continue with magic link
        </Button>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Email and password */}
      <form onSubmit={handleEmailPasswordSubmit} className="flex flex-col gap-5">
        <FieldGroup>
          {/* Join: first and last name on one row */}
          {isJoin && (
            <div className="grid grid-cols-2 gap-3">
              <Field>
                <FieldLabel htmlFor="auth-first-name" required>
                  First name
                </FieldLabel>
                <Input
                  id="auth-first-name"
                  autoComplete="given-name"
                  placeholder="Sarah"
                  required
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="auth-last-name" required>
                  Last name
                </FieldLabel>
                <Input
                  id="auth-last-name"
                  autoComplete="family-name"
                  placeholder="Mitchell"
                  required
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                />
              </Field>
            </div>
          )}

          <Field>
            <FieldLabel htmlFor="auth-email" required>
              Email
            </FieldLabel>
            <Input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@company.com.au"
              required
              value={activeEmail}
              onChange={(event) => {
                if (emailProp == null) {
                  setEmail(event.target.value)
                }
              }}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="auth-password" required>
              Password
            </FieldLabel>
            <Input
              id="auth-password"
              type="password"
              autoComplete={isJoin ? "new-password" : "current-password"}
              placeholder={isJoin ? "Create a password" : "Enter your password"}
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            {!isJoin && (
              <FieldDescription>
                <a
                  href="#"
                  className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
                >
                  Forgot password?
                </a>
              </FieldDescription>
            )}
            {isJoin && (
              <FieldDescription>Use at least 8 characters.</FieldDescription>
            )}
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full" loading={passwordLoading}>
          {isJoin ? "Create account" : "Sign in"}
        </Button>
      </form>

      {/* Mode toggle */}
      <p className="text-center text-sm text-muted-foreground">
        {isJoin ? "Already have an account?" : "New to Instant Strata?"}{" "}
        <button
          type="button"
          onClick={handleModeToggle}
          className="font-medium text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
        >
          {isJoin ? "Sign in" : "Create an account"}
        </button>
      </p>

      {/* Legal */}
      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        By continuing, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-foreground">
          Terms of service
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-foreground">
          Privacy statement
        </a>
        .
      </p>
    </div>
  )
}
