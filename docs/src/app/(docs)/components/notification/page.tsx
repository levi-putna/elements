import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import { Notification } from "@/components/ui/notification";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/notification/registry.json`;

const USAGE = `import { Notification } from "@/components/ui/notification"

<Notification type="info" title="Owner portal update available">
  A new self-service levy statement view is now live for all owners.
</Notification>`;

const ALL_TYPES = `<Notification type="default" title="Reminder">
  Committee meeting minutes are due within 7 days of the meeting.
</Notification>

<Notification type="info" title="Owner portal update available">
  A new self-service levy statement view is now live for all owners.
</Notification>

<Notification type="warning" title="AGM date not confirmed">
  The proposed date still needs committee approval before notices can go out.
</Notification>

<Notification type="danger" title="Levy payment failed">
  Direct debit for Lot 12 was declined. Follow up with the owner before the due date.
</Notification>`;

const NOTIFICATION_PROPS = [
  {
    name: "title",
    type: "string",
    description: "Short heading shown above the body copy.",
  },
  {
    name: "children",
    type: "ReactNode",
    description: "Supporting detail beneath the title.",
  },
  {
    name: "type",
    type: '"default" | "info" | "warning" | "danger"',
    default: '"default"',
    description:
      "Semantic colour theme. info uses the blue notification palette; warning and danger match the status colours.",
  },
  {
    name: "showIcon",
    type: "boolean",
    default: "true",
    description: "When false, hides the leading icon. Icons should always pair with text.",
  },
];

const NOTIFICATION_TYPES = [
  {
    type: "default" as const,
    title: "Reminder",
    body: "Committee meeting minutes are due within 7 days of the meeting.",
  },
  {
    type: "info" as const,
    title: "Owner portal update available",
    body: "A new self-service levy statement view is now live for all owners.",
  },
  {
    type: "warning" as const,
    title: "AGM date not confirmed",
    body: "The proposed date still needs committee approval before notices can go out.",
  },
  {
    type: "danger" as const,
    title: "Levy payment failed",
    body: "Direct debit for Lot 12 was declined. Follow up with the owner before the due date.",
  },
];

/**
 * Notification documentation: inline alert banners with semantic colour themes.
 */
export default function NotificationPage() {
  return (
    <DocsPage>
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Base
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Notification
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Inline alert banners for toasts, page callouts, and form feedback. Four semantic
          types map to the status palette, including a blue{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">info</code> theme
          for neutral informational updates.
        </p>
      </div>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL} language="bash" />
        <p className="text-xs text-ink-muted mt-2">
          Requires the{" "}
          <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">info</code> colour
          tokens from{" "}
          <a
            href="/components/colours"
            className="text-foreground underline underline-offset-4 hover:text-forest-mid transition-colors"
          >
            Colours &amp; Accent
          </a>
          .
        </p>
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Usage
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Use <code className="font-mono bg-secondary px-1 py-0.5 rounded-sm">type=&quot;info&quot;</code>{" "}
          for FYI notices, feature announcements, and neutral system updates.
        </p>
        <ComponentPreview label="Notification · info">
          <div className="w-full max-w-lg">
            <Notification type="info" title="Owner portal update available">
              A new self-service levy statement view is now live for all owners.
            </Notification>
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={USAGE} language="tsx" />
        </div>
      </section>

      {/* All types */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">
          Types
        </h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-2xl">
          Default for low-priority notes. Info, warning, and danger use soft tinted
          backgrounds with saturated headings.
        </p>
        <ComponentPreview label="All notification types">
          <div className="w-full max-w-lg space-y-3">
            {NOTIFICATION_TYPES.map(({ type, title, body }) => (
              <Notification key={type} type={type} title={title}>
                {body}
              </Notification>
            ))}
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={ALL_TYPES} language="tsx" />
        </div>
      </section>

      {/* Props */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
          Notification props
        </h2>
        <PropTable props={NOTIFICATION_PROPS} />
      </section>
    </DocsPage>
  );
}
