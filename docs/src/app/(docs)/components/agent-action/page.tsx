"use client"

import {
  AlertTriangle,
  Building2,
  CalendarDays,
  CreditCard,
  FileText,
  Info,
  ShieldCheck,
  Wrench,
} from "lucide-react"

import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { DocsPage } from "@/components/docs/docs-page"
import { PropTable } from "@/components/docs/prop-table"
import { useLaunchCowork } from "@/components/preview/agent-launch-context"
import {
  AgentAction,
  AgentActionList,
} from "@/components/ui/agent-action"

const INSTALL_CODE = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/agent-action/registry.json`

const USAGE_CODE = `import { AgentAction } from "@/components/ui/agent-action"
import { ShieldCheck } from "lucide-react"

<AgentAction
  title="Renew Building Insurance"
  description="The agent will review the current policy expiry, compare market quotes, and prepare a renewal recommendation for committee approval."
  prompt="You are helping a strata manager renew the building insurance for Harbour View Towers..."
  category="Insurance"
  icon={ShieldCheck}
  onTrigger={(prompt) => openAgentView(prompt)}
/>`

const CARD_CODE = `<AgentAction
  variant="card"
  title="Renew Building Insurance"
  description="The agent will review the current policy expiry, compare market quotes, and prepare a renewal recommendation for committee approval."
  prompt="[full agent prompt]"
  category="Insurance"
  icon={ShieldCheck}
  onTrigger={(prompt) => openAgentView(prompt)}
/>`

const ROW_CODE = `import { AgentAction, AgentActionList } from "@/components/ui/agent-action"
import { ShieldCheck, Wrench } from "lucide-react"

<AgentActionList title="Suggested agent actions">
  <AgentAction
    variant="row"
    title="Renew Building Insurance"
    description="Policy expiring in 9 days. Get quotes and prepare a renewal recommendation."
    prompt="[full prompt]"
    category="Insurance"
    icon={ShieldCheck}
    onTrigger={openAgent}
  />
  <AgentAction
    variant="row"
    title="Chase lift maintenance quotes"
    description="Three quotes are outstanding for the lift upgrade. Follow up each contractor."
    prompt="[full prompt]"
    category="Maintenance"
    icon={Wrench}
    onTrigger={openAgent}
  />
</AgentActionList>`

const INLINE_CODE = `<AgentAction
  variant="inline"
  title="Draft levy reminder"
  prompt="[full prompt]"
  onTrigger={(prompt) => openAgentView(prompt)}
/>`

const BANNER_CODE = `// danger: expired or overdue item — sits at the top of a page
<AgentAction
  variant="banner"
  urgency="danger"
  title="Insurance Expired"
  description="The building insurance for Sunset Gardens expired 3 days ago. Renew immediately."
  prompt="[full prompt]"
  category="Insurance"
  icon={ShieldCheck}
  onTrigger={openAgent}
/>

// warning: approaching deadline
<AgentAction
  variant="banner"
  urgency="warning"
  title="AGM Notice Pack Due in 9 Days"
  description="Draft and send the AGM notice pack before the 21-day statutory window closes."
  prompt="[full prompt]"
  category="AGM"
  icon={CalendarDays}
  onTrigger={openAgent}
/>

// info: guidance update or non-urgent advisory
<AgentAction
  variant="banner"
  urgency="info"
  title="New Strata Hub Lodgement Requirements"
  description="Updated forms are required from 1 July 2026. Review and update your lodgement templates."
  prompt="[full prompt]"
  category="Compliance"
  icon={Info}
  onTrigger={openAgent}
/>`

const GRID_CODE = `<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <AgentAction
    variant="card"
    title="Renew Building Insurance"
    description="Review expiring policy, get quotes, prepare renewal recommendation."
    prompt="[full prompt]"
    category="Insurance"
    icon={ShieldCheck}
    onTrigger={openAgent}
  />
  <AgentAction
    variant="card"
    title="Prepare AGM Notice Pack"
    description="Draft motions, proxy forms, and the cover letter for the upcoming AGM."
    prompt="[full prompt]"
    category="AGM"
    icon={CalendarDays}
    onTrigger={openAgent}
  />
  <AgentAction
    variant="card"
    title="Send Levy Notices"
    description="Generate and send levy notices for Q3 to all 42 lot owners."
    prompt="[full prompt]"
    category="Levies"
    icon={CreditCard}
    onTrigger={openAgent}
  />
</div>`

const AGENT_ACTION_PROPS = [
  {
    name: "title",
    type: "string",
    description: "User-facing label. Short enough to fit on one line in row and inline variants.",
  },
  {
    name: "description",
    type: "string",
    description: "Brief summary of what the agent will do. Shown to the user; not the full prompt.",
  },
  {
    name: "prompt",
    type: "string",
    description: "Full prompt passed to the agent on trigger. Never rendered to the user.",
  },
  {
    name: "category",
    type: "string",
    description: "Context label rendered as a small badge (e.g. Insurance, Compliance, AGM).",
  },
  {
    name: "icon",
    type: "LucideIcon",
    default: "Sparkles",
    description: "Leading icon for the card header, row chip, or banner.",
  },
  {
    name: "variant",
    type: '"card" | "row" | "inline" | "banner"',
    default: '"card"',
    description:
      "Visual layout. card = bordered panel. row = compact list item. inline = button-like trigger. banner = wide low-height strip.",
  },
  {
    name: "urgency",
    type: '"default" | "info" | "warning" | "danger"',
    default: '"default"',
    description:
      "Tints the surface to draw attention. Use danger for expired/overdue items, warning for approaching deadlines, info for guidance updates.",
  },
  {
    name: "onTrigger",
    type: "(prompt: string) => void",
    description: "Called when the action is triggered; receives the full prompt string.",
  },
  {
    name: "href",
    type: "string",
    description: "Navigate to this URL instead of calling onTrigger. Useful for server-side agent routing.",
  },
  {
    name: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables the trigger.",
  },
  {
    name: "loading",
    type: "boolean",
    default: "false",
    description: "Shows a spinner and disables interaction. Use while the agent view is loading.",
  },
]

const AGENT_ACTION_LIST_PROPS = [
  {
    name: "title",
    type: "string",
    description: "Optional section heading rendered above the list with a Sparkles icon.",
  },
]

/**
 * AgentAction element documentation page.
 */
export default function AgentActionPage() {
  const launchCowork = useLaunchCowork()

  /** Opens Cowork with the full agent prompt so the user can continue in chat. */
  function handleTrigger(prompt: string) {
    launchCowork({ prompt })
  }

  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / AI
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Agent Action</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          A call-to-action element that launches an AI agent with a preset prompt. The full
          instruction set is stored in the component and never shown to the user; only a friendly
          title and brief description are rendered. Four variants cover placement contexts from
          priority page-topper banners to dashboard rows and compact toolbar triggers. Use the
          urgency prop to tint the surface for time-sensitive items.
        </p>
      </div>

      {/* Banner variant */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Banner variant
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Wide, low-height strip that spans the full content width. Designed to sit at the top
          of a page as a priority prompt without taking up much vertical space. Combine with
          urgency to draw the manager&apos;s eye to expired, overdue, or deadline-driven items.
        </p>

        <div className="space-y-3">
          {/* Danger: expired */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">
              Danger — expired or overdue
            </p>
            <AgentAction
              variant="banner"
              urgency="danger"
              title="Insurance Expired"
              description="The building insurance for Sunset Gardens expired 3 days ago. Renew immediately to avoid an uninsured period."
              prompt="You are helping a strata manager urgently renew building insurance for Sunset Gardens (SP 12045). The current Allianz policy (Policy No. AL-88821) expired on 17 June 2026 — three days ago. The scheme is currently uninsured. Please: 1) Draft an urgent email to Allianz requesting a backdated renewal or cover note. 2) Simultaneously source emergency quotes from CHU and Vero. 3) Prepare a committee resolution authorising emergency expenditure up to $25,000 for the premium. 4) Draft a disclosure notice to all lot owners about the lapsed coverage period."
              category="Insurance"
              icon={ShieldCheck}
              onTrigger={handleTrigger}
            />
          </div>

          {/* Warning: approaching deadline */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">
              Warning — approaching deadline
            </p>
            <AgentAction
              variant="banner"
              urgency="warning"
              title="AGM Notice Pack Due in 9 Days"
              description="Draft and send the AGM notice pack before the 21-day statutory window closes on 6 July."
              prompt="You are preparing the AGM notice pack for Harbour View Towers (SP 48291). The AGM is on 27 July 2026. The 21-day notice deadline is 6 July. Please draft the full notice pack now."
              category="AGM"
              icon={CalendarDays}
              onTrigger={handleTrigger}
            />
          </div>

          {/* Info: advisory */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">
              Info — guidance or advisory
            </p>
            <AgentAction
              variant="banner"
              urgency="info"
              title="New Strata Hub Lodgement Requirements from 1 July"
              description="Updated forms are required. Review and update your lodgement templates before the deadline."
              prompt="NSW Fair Trading has updated Strata Hub lodgement requirements effective 1 July 2026. Please: 1) Summarise the key changes relevant to our schemes. 2) Identify which of our current templates need updating. 3) Draft updated versions of any affected standard documents."
              category="Compliance"
              icon={Info}
              onTrigger={handleTrigger}
            />
          </div>

          {/* Default */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-2">
              Default
            </p>
            <AgentAction
              variant="banner"
              urgency="default"
              title="Prepare Q3 Levy Notices"
              description="Generate and send levy notices to all lot owners for the July quarter."
              prompt="[full levy notices prompt]"
              category="Levies"
              icon={CreditCard}
              onTrigger={handleTrigger}
            />
          </div>
        </div>

        <div className="mt-6">
          <CodeBlock code={BANNER_CODE} language="tsx" />
        </div>
      </section>

      {/* Urgency on cards */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Urgency on cards and rows
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          The urgency prop also tints cards and rows, giving consistent visual priority signals
          across all variants. Icon chips change colour to match the urgency tone.
        </p>

        <div className="space-y-6">
          {/* Urgency cards */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Cards</p>
            <ComponentPreview label="Urgency tones on card variant">
              <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <AgentAction
                  variant="card"
                  urgency="danger"
                  title="Insurance Expired"
                  description="Policy lapsed 3 days ago. Act immediately."
                  prompt="[full prompt]"
                  category="Insurance"
                  icon={ShieldCheck}
                  onTrigger={handleTrigger}
                />
                <AgentAction
                  variant="card"
                  urgency="warning"
                  title="AGM Notice Due"
                  description="Statutory notice window closes in 9 days."
                  prompt="[full prompt]"
                  category="AGM"
                  icon={AlertTriangle}
                  onTrigger={handleTrigger}
                />
                <AgentAction
                  variant="card"
                  urgency="info"
                  title="New Lodgement Forms"
                  description="Updated templates required from 1 July."
                  prompt="[full prompt]"
                  category="Compliance"
                  icon={Info}
                  onTrigger={handleTrigger}
                />
                <AgentAction
                  variant="card"
                  urgency="default"
                  title="Send Levy Notices"
                  description="Generate Q3 levy notices for all lot owners."
                  prompt="[full prompt]"
                  category="Levies"
                  icon={CreditCard}
                  onTrigger={handleTrigger}
                />
              </div>
            </ComponentPreview>
          </div>

          {/* Urgency rows */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Rows</p>
            <ComponentPreview label="Urgency tones on row variant">
              <div className="w-full max-w-lg">
                <AgentActionList title="Action required">
                  <AgentAction
                    variant="row"
                    urgency="danger"
                    title="Insurance Expired"
                    description="Policy lapsed 3 days ago — scheme is currently uninsured."
                    prompt="[full prompt]"
                    category="Insurance"
                    icon={ShieldCheck}
                    onTrigger={handleTrigger}
                  />
                  <AgentAction
                    variant="row"
                    urgency="warning"
                    title="AGM Notice Due in 9 Days"
                    description="Draft and send before the 21-day statutory window closes."
                    prompt="[full prompt]"
                    category="AGM"
                    icon={AlertTriangle}
                    onTrigger={handleTrigger}
                  />
                  <AgentAction
                    variant="row"
                    urgency="info"
                    title="New Lodgement Forms"
                    description="Updated Strata Hub templates required from 1 July."
                    prompt="[full prompt]"
                    category="Compliance"
                    icon={Info}
                    onTrigger={handleTrigger}
                  />
                  <AgentAction
                    variant="row"
                    urgency="default"
                    title="Send Q3 Levy Notices"
                    description="Generate and send levy notices to all 42 lot owners."
                    prompt="[full prompt]"
                    category="Levies"
                    icon={CreditCard}
                    onTrigger={handleTrigger}
                  />
                </AgentActionList>
              </div>
            </ComponentPreview>
          </div>
        </div>
      </section>

      {/* Card variant */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Card variant
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Standalone bordered panel. Good for detail views, sidebars, and 2-3 column grids.
          Each card shows the icon, title, optional category badge, a description, and a
          forest-green launch button.
        </p>

        <div className="space-y-8">
          {/* Insurance renewal */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Insurance renewal</p>
            <ComponentPreview label="Scheme detail page">
              <div className="w-full max-w-xs">
                <AgentAction
                  variant="card"
                  title="Renew Building Insurance"
                  description="The agent will review the current policy expiry, compare market quotes from at least three insurers, and prepare a renewal recommendation for committee approval."
                  prompt="You are helping a strata manager renew the building insurance for Harbour View Towers (SP 48291). The current policy with Allianz expires on 30 June 2026 and the annual premium is $18,200. Please: 1) Review the existing policy schedule (attached). 2) Source competitive quotes from CHU, Strata Community Insurance, and Vero. 3) Prepare a premium and coverage comparison table. 4) Draft a committee recommendation memo recommending the best option, noting any coverage changes."
                  category="Insurance"
                  icon={ShieldCheck}
                  onTrigger={handleTrigger}
                />
              </div>
            </ComponentPreview>
          </div>

          {/* AGM notice */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">AGM notice pack</p>
            <ComponentPreview label="Compliance task">
              <div className="w-full max-w-xs">
                <AgentAction
                  variant="card"
                  title="Prepare AGM Notice Pack"
                  description="Draft the AGM notice, motions, proxy form, and cover letter using this year&apos;s financials and the committee-approved agenda."
                  prompt="You are preparing the AGM notice pack for Harbour View Towers (SP 48291). The AGM is scheduled for 15 July 2026. Please draft the full notice pack meeting all NSW strata legislative requirements."
                  category="AGM"
                  icon={CalendarDays}
                  onTrigger={handleTrigger}
                />
              </div>
            </ComponentPreview>
          </div>

          {/* Card grid */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">3-column action grid</p>
            <ComponentPreview label="Dashboard — agent actions panel">
              <div className="w-full grid gap-4 sm:grid-cols-3">
                <AgentAction
                  variant="card"
                  title="Renew Building Insurance"
                  description="Policy expires in 9 days. Review quotes and prepare the renewal recommendation."
                  prompt="[full insurance renewal prompt]"
                  category="Insurance"
                  icon={ShieldCheck}
                  onTrigger={handleTrigger}
                />
                <AgentAction
                  variant="card"
                  title="Prepare AGM Notice Pack"
                  description="Draft motions, proxy forms, and the cover letter for the 15 July AGM."
                  prompt="[full AGM prompt]"
                  category="AGM"
                  icon={CalendarDays}
                  onTrigger={handleTrigger}
                />
                <AgentAction
                  variant="card"
                  title="Send Q3 Levy Notices"
                  description="Generate and send levy notices to all 42 lot owners for the July quarter."
                  prompt="[full levy notice prompt]"
                  category="Levies"
                  icon={CreditCard}
                  onTrigger={handleTrigger}
                />
              </div>
            </ComponentPreview>
            <div className="mt-6">
              <CodeBlock code={GRID_CODE} language="tsx" />
            </div>
          </div>
        </div>
      </section>

      {/* Row variant */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Row variant
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Compact list item. Wrap in{" "}
          <code className="font-mono text-xs text-ink">AgentActionList</code> for a titled,
          divided list panel. Rows sit comfortably inside a{" "}
          <a href="/components/widgets" className="text-forest underline underline-offset-2">Widget</a>{" "}
          flush content area.
        </p>

        <div className="space-y-8">
          {/* Deadline-driven list */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Deadline-driven action list</p>
            <ComponentPreview label="Dashboard widget">
              <div className="w-full max-w-lg">
                <AgentActionList title="Suggested agent actions">
                  <AgentAction
                    variant="row"
                    title="Renew Building Insurance"
                    description="Policy expires in 9 days. Get competitive quotes and prepare a renewal recommendation."
                    prompt="[full insurance renewal prompt]"
                    category="Insurance"
                    icon={ShieldCheck}
                    onTrigger={handleTrigger}
                  />
                  <AgentAction
                    variant="row"
                    title="Chase lift maintenance quotes"
                    description="Three quotes are outstanding for the lift upgrade. Follow up each contractor and update the committee."
                    prompt="[full maintenance prompt]"
                    category="Maintenance"
                    icon={Wrench}
                    onTrigger={handleTrigger}
                  />
                  <AgentAction
                    variant="row"
                    title="Lodge Strata Hub annual return"
                    description="The annual return for Harbour View Towers is overdue. Complete and lodge via the Strata Hub portal."
                    prompt="[full lodgement prompt]"
                    category="Compliance"
                    icon={FileText}
                    onTrigger={handleTrigger}
                  />
                </AgentActionList>
              </div>
            </ComponentPreview>
            <div className="mt-6">
              <CodeBlock code={ROW_CODE} language="tsx" />
            </div>
          </div>

          {/* Property context list */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Property-contextual actions</p>
            <ComponentPreview label="Scheme detail — available agent actions">
              <div className="w-full max-w-lg">
                <AgentActionList title="Available agent actions">
                  <AgentAction
                    variant="row"
                    title="Draft committee meeting minutes"
                    description="Convert the meeting recording transcript into formatted minutes ready for committee approval."
                    prompt="[full minutes prompt]"
                    category="Admin"
                    icon={FileText}
                    onTrigger={handleTrigger}
                  />
                  <AgentAction
                    variant="row"
                    title="Review by-law breach notice"
                    description="Assess the reported breach, check the applicable by-law, and draft a formal notice to the lot owner."
                    prompt="[full by-law prompt]"
                    category="Compliance"
                    icon={Building2}
                    onTrigger={handleTrigger}
                  />
                  <AgentAction
                    variant="row"
                    title="Prepare levy hardship response"
                    description="Review the hardship request and draft a payment plan offer in line with the committee policy."
                    prompt="[full hardship prompt]"
                    category="Levies"
                    icon={CreditCard}
                    onTrigger={handleTrigger}
                  />
                </AgentActionList>
              </div>
            </ComponentPreview>
          </div>
        </div>
      </section>

      {/* Inline variant */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Inline variant
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Compact button-like trigger. Use in page toolbars, action bars, or inline
          within content. No description is shown; the title must be self-explanatory at this size.
        </p>

        <ComponentPreview label="Page toolbar — contextual inline actions">
          <div className="flex flex-wrap items-center gap-2">
            <AgentAction
              variant="inline"
              title="Renew Insurance"
              prompt="[full insurance renewal prompt]"
              icon={ShieldCheck}
              onTrigger={handleTrigger}
            />
            <AgentAction
              variant="inline"
              title="Prepare AGM Pack"
              prompt="[full AGM prompt]"
              icon={CalendarDays}
              onTrigger={handleTrigger}
            />
            <AgentAction
              variant="inline"
              title="Draft levy reminder"
              prompt="[full levy prompt]"
              icon={CreditCard}
              onTrigger={handleTrigger}
            />
            <AgentAction
              variant="inline"
              urgency="danger"
              title="Chase overdue quotes"
              prompt="[full maintenance prompt]"
              icon={Wrench}
              onTrigger={handleTrigger}
            />
          </div>
        </ComponentPreview>
        <div className="mt-6">
          <CodeBlock code={INLINE_CODE} language="tsx" />
        </div>
      </section>

      {/* States */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          States
        </h2>

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Loading</p>
            <ComponentPreview label="Agent starting">
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-64">
                  <AgentAction
                    variant="card"
                    title="Renew Building Insurance"
                    description="Gathering policy documents..."
                    prompt="[full prompt]"
                    category="Insurance"
                    icon={ShieldCheck}
                    loading
                  />
                </div>
                <AgentAction
                  variant="inline"
                  title="Renew Insurance"
                  prompt="[full prompt]"
                  icon={ShieldCheck}
                  loading
                />
              </div>
            </ComponentPreview>
          </div>

          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Disabled</p>
            <ComponentPreview label="Agent unavailable">
              <div className="flex flex-wrap items-center gap-4">
                <div className="w-64">
                  <AgentAction
                    variant="card"
                    title="Renew Building Insurance"
                    description="This action requires the policy document to be uploaded first."
                    prompt="[full prompt]"
                    category="Insurance"
                    icon={ShieldCheck}
                    disabled
                  />
                </div>
                <AgentAction
                  variant="inline"
                  title="Renew Insurance"
                  prompt="[full prompt]"
                  icon={ShieldCheck}
                  disabled
                />
              </div>
            </ComponentPreview>
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL_CODE} language="bash" />
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Usage
        </h2>
        <CodeBlock code={USAGE_CODE} language="tsx" />
      </section>

      {/* Card code */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Card example
        </h2>
        <CodeBlock code={CARD_CODE} language="tsx" />
      </section>

      {/* Props */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Reference
        </h2>

        <h3 className="text-sm font-semibold text-ink mb-3">AgentAction</h3>
        <div className="mb-8">
          <PropTable props={AGENT_ACTION_PROPS} />
        </div>

        <h3 className="text-sm font-semibold text-ink mb-3">AgentActionList</h3>
        <PropTable props={AGENT_ACTION_LIST_PROPS} />
      </section>

    </DocsPage>
  )
}
