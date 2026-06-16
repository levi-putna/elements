"use client"

import * as React from "react"

import { AuthForm, type AuthFormStep, type AuthMode } from "@/components/ui/auth-form"
import { AuthLayout } from "@/components/ui/auth-layout"

export interface AuthPreviewProps {
  /** Login or join mode for the preview. */
  defaultMode?: AuthMode
  /** Starting step for the preview. */
  defaultStep?: AuthFormStep
  /** Email prefilled for the magic-link sent preview. */
  defaultEmail?: string
}

/**
 * Interactive auth layout preview for the documentation site.
 */
export function AuthPreview({
  defaultMode = "login",
  defaultStep = "credentials",
  defaultEmail = "",
}: AuthPreviewProps) {
  const [mode, setMode] = React.useState<AuthMode>(defaultMode)
  const [step, setStep] = React.useState<AuthFormStep>(defaultStep)
  const [email, setEmail] = React.useState(defaultEmail)

  return (
    <AuthLayout logoHref="#">
      <AuthForm
        mode={mode}
        step={step}
        email={email}
        onModeChange={({ mode: nextMode }) => setMode(nextMode)}
        onStepChange={({ step: nextStep }) => setStep(nextStep)}
        onMagicLinkSubmit={({ email: submittedEmail }) => setEmail(submittedEmail)}
      />
    </AuthLayout>
  )
}
