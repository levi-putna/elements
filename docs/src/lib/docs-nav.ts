export type DocsNavItem = {
  href: string
  label: string
}

export type DocsNavGroup = {
  label: string
  items: DocsNavItem[]
}

/** Overview-level pages shown under Overview in the sidebar. */
export const docsOverviewItems: DocsNavItem[] = [
  { href: "/tone-of-voice", label: "Tone of voice" },
]

/** Docs sidebar navigation groups and page links. */
export const docsNavGroups: DocsNavGroup[] = [
  {
    label: "Overview",
    items: [{ href: "/", label: "Overview" }, ...docsOverviewItems],
  },
  {
    label: "Foundation",
    items: [
      { href: "/components/colours", label: "Colours & Accent" },
      { href: "/components/typography", label: "Typography" },
      { href: "/components/radius", label: "Radius" },
      { href: "/components/padding", label: "Padding" },
      { href: "/components/spacing", label: "Spacing" },
      { href: "/components/responsive-design", label: "Responsive design" },
      { href: "/components/logo", label: "Logo" },
      { href: "/components/favicon", label: "Favicon" },
      { href: "/components/icons", label: "Icons" },
      { href: "/components/images", label: "Images" },
    ],
  },
  {
    label: "Base",
    items: [
      { href: "/components/button", label: "Button" },
      { href: "/components/badge", label: "Badge" },
      { href: "/components/notification", label: "Notification" },
      { href: "/components/avatar", label: "Avatar" },
      { href: "/components/dialog", label: "Dialog" },
      { href: "/components/alert-dialog", label: "Alert Dialog" },
      { href: "/components/tabs", label: "Tabs" },
      { href: "/components/skeleton", label: "Skeleton" },
      { href: "/components/shimmer", label: "Shimmer" },
    ],
  },
  {
    label: "Forms",
    items: [
      { href: "/components/forms", label: "Form Layouts" },
      { href: "/components/field", label: "Field" },
      { href: "/components/label", label: "Label" },
      { href: "/components/hint", label: "Hint" },
      { href: "/components/input", label: "Input" },
      { href: "/components/textarea", label: "Textarea" },
      { href: "/components/input-group", label: "Input Group" },
      { href: "/components/input-otp", label: "Input OTP" },
      { href: "/components/select", label: "Select" },
      { href: "/components/combobox", label: "Combobox" },
      { href: "/components/calendar", label: "Calendar" },
      { href: "/components/date-input", label: "Date Input" },
      { href: "/components/checkbox", label: "Checkbox" },
      { href: "/components/radio-group", label: "Radio Group" },
      { href: "/components/switch", label: "Switch" },
    ],
  },
  {
    label: "AI",
    items: [
      { href: "/components/assistant", label: "Cowork" },
      { href: "/components/agent-action", label: "Agent Action" },
      { href: "/components/prompt-input", label: "Prompt Input" },
      { href: "/components/conversation", label: "Conversation" },
      { href: "/components/message", label: "Message" },
    ],
  },
  {
    label: "Audio",
    items: [
      { href: "/components/audio-player", label: "Audio Player" },
      { href: "/components/transcript-viewer", label: "Transcript Viewer" },
    ],
  },
  {
    label: "Application",
    items: [
      { href: "/components/sidebar", label: "Sidebar" },
      { href: "/components/app-layout", label: "App Layout" },
      { href: "/components/document", label: "Document" },
      { href: "/components/scheme", label: "Scheme" },
      { href: "/components/lot", label: "Lot" },
      { href: "/components/owner", label: "Owner" },
      { href: "/components/task", label: "Task" },
      { href: "/components/data-table", label: "Data Table" },
      { href: "/components/widgets", label: "Widgets" },
      { href: "/components/authentication", label: "Authentication" },
    ],
  },
  {
    label: "Email",
    items: [{ href: "/emails/authentication", label: "Authentication emails" }],
  },
  {
    label: "Website",
    items: [
      { href: "/components/site-header", label: "Site Header" },
      { href: "/components/section", label: "Section" },
      { href: "/components/card", label: "Card" },
      { href: "/components/hero", label: "Hero" },
      { href: "/components/statement", label: "Statement" },
      { href: "/components/page-header", label: "Page Header" },
      { href: "/components/story-grid", label: "Story Grid" },
      { href: "/components/bento", label: "Bento" },
      { href: "/components/infographic", label: "Infographic" },
      { href: "/components/feature-split", label: "Feature Split" },
      { href: "/components/marketing-section", label: "Marketing Section" },
      { href: "/components/testimonial", label: "Testimonial" },
      { href: "/components/footer", label: "Footer" },
    ],
  },
]

/**
 * Returns nav groups with items matching the query (label, group, or path segment).
 */
export function filterDocsNavGroups({
  groups,
  query,
}: {
  groups: DocsNavGroup[]
  query: string
}): DocsNavGroup[] {
  const trimmed = query.trim().toLowerCase()
  if (!trimmed) {
    return groups
  }

  return groups
    .map((group) => {
      const groupMatches = group.label.toLowerCase().includes(trimmed)
      const items = group.items.filter((item) => {
        if (groupMatches) {
          return true
        }

        const labelMatches = item.label.toLowerCase().includes(trimmed)
        const pathMatches = item.href.toLowerCase().includes(trimmed)
        return labelMatches || pathMatches
      })

      return { ...group, items }
    })
    .filter((group) => group.items.length > 0)
}
