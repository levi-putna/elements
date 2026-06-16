import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Banknote,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CalendarClock,
  Check,
  ChevronRight,
  CircleHelp,
  ClipboardList,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  FileCheck,
  FileQuestion,
  FileText,
  Files,
  FolderOpen,
  Gavel,
  Hammer,
  Home,
  Info,
  Key,
  Landmark,
  Layers,
  LayoutDashboard,
  LifeBuoy,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Megaphone,
  MessageSquare,
  Mic,
  Paperclip,
  Phone,
  PiggyBank,
  Receipt,
  Scale,
  Search,
  Settings,
  Shield,
  ShieldCheck,
  TrendingUp,
  Upload,
  UserCheck,
  UserCircle,
  Users,
  Wallet,
  Wrench,
  X,
} from "lucide-react";

/* ─── Icon catalogue data ─────────────────────────────── */

interface IconEntry {
  icon: LucideIcon;
  name: string;
  use: string;
}

interface IconCategory {
  id: string;
  title: string;
  description: string;
  icons: IconEntry[];
}

const ICON_CATEGORIES: IconCategory[] = [
  {
    id: "navigation",
    title: "Navigation & shell",
    description:
      "Primary app navigation, workspace switcher, and global actions. Keep one icon per top-level route.",
    icons: [
      { icon: LayoutDashboard, name: "LayoutDashboard", use: "Home dashboard, overview" },
      { icon: Building2, name: "Building2", use: "Buildings and schemes" },
      { icon: Receipt, name: "Receipt", use: "Levies, invoices, billing" },
      { icon: Users, name: "Users", use: "Owners, residents, contacts" },
      { icon: MessageSquare, name: "MessageSquare", use: "Inbox, correspondence" },
      { icon: Calendar, name: "Calendar", use: "Meetings, AGMs, events" },
      { icon: FileText, name: "FileText", use: "Documents library" },
      { icon: Settings, name: "Settings", use: "Workspace settings" },
      { icon: Search, name: "Search", use: "Global search" },
      { icon: Bell, name: "Bell", use: "Notifications" },
    ],
  },
  {
    id: "buildings",
    title: "Buildings & schemes",
    description:
      "Scheme profiles, lot registers, addresses, and portfolio views. Prefer Building2 as the default scheme icon.",
    icons: [
      { icon: Building2, name: "Building2", use: "Scheme or building (default)" },
      { icon: Home, name: "Home", use: "Individual lot or unit" },
      { icon: Layers, name: "Layers", use: "Multi-level or mixed-use" },
      { icon: Landmark, name: "Landmark", use: "Heritage or special-purpose" },
      { icon: MapPin, name: "MapPin", use: "Address, location" },
      { icon: Key, name: "Key", use: "Access, keys, fobs" },
    ],
  },
  {
    id: "owners",
    title: "Owners & residents",
    description:
      "People records, committees, and contact details. Use UserCircle for a single person, Users for groups.",
    icons: [
      { icon: UserCircle, name: "UserCircle", use: "Single owner or resident" },
      { icon: Users, name: "Users", use: "Committee, all owners" },
      { icon: UserCheck, name: "UserCheck", use: "Verified owner, onboarding complete" },
      { icon: Mail, name: "Mail", use: "Email contact" },
      { icon: Phone, name: "Phone", use: "Phone contact" },
    ],
  },
  {
    id: "finance",
    title: "Levies & finance",
    description:
      "Levy notices, payments, arrears, and fund balances. Pair with colour and label text, never rely on icon alone.",
    icons: [
      { icon: Receipt, name: "Receipt", use: "Levy notice, invoice" },
      { icon: DollarSign, name: "DollarSign", use: "Amount, pricing" },
      { icon: CreditCard, name: "CreditCard", use: "Card payment" },
      { icon: Banknote, name: "Banknote", use: "Cash or bank transfer" },
      { icon: Wallet, name: "Wallet", use: "Owner ledger, balance" },
      { icon: PiggyBank, name: "PiggyBank", use: "Sinking fund, reserves" },
      { icon: TrendingUp, name: "TrendingUp", use: "Budget forecast, growth" },
    ],
  },
  {
    id: "maintenance",
    title: "Maintenance & defects",
    description:
      "Work orders, contractor jobs, and defect reports. AlertTriangle signals urgency; Wrench for general maintenance.",
    icons: [
      { icon: Wrench, name: "Wrench", use: "General maintenance" },
      { icon: Hammer, name: "Hammer", use: "Capital works, repairs" },
      { icon: ClipboardList, name: "ClipboardList", use: "Work order, checklist" },
      { icon: CalendarClock, name: "CalendarClock", use: "Scheduled visit" },
      { icon: AlertTriangle, name: "AlertTriangle", use: "Urgent defect, hazard" },
    ],
  },
  {
    id: "compliance",
    title: "Compliance & governance",
    description:
      "By-laws, insurance, audits, and regulatory obligations. Shield for protection; Scale and Gavel for legal.",
    icons: [
      { icon: Shield, name: "Shield", use: "Insurance, protection" },
      { icon: ShieldCheck, name: "ShieldCheck", use: "Compliance met, certified" },
      { icon: FileCheck, name: "FileCheck", use: "Signed document, approval" },
      { icon: Scale, name: "Scale", use: "By-laws, legal" },
      { icon: Gavel, name: "Gavel", use: "Disputes, tribunal" },
      { icon: Mic, name: "Mic", use: "AGM, meeting minutes" },
    ],
  },
  {
    id: "documents",
    title: "Documents & files",
    description:
      "Scheme registers, contracts, and uploaded attachments. FolderOpen for collections; Paperclip for inline attachments.",
    icons: [
      { icon: FileText, name: "FileText", use: "Single document" },
      { icon: Files, name: "Files", use: "Document set" },
      { icon: FolderOpen, name: "FolderOpen", use: "Folder or category" },
      { icon: Upload, name: "Upload", use: "Upload file" },
      { icon: Download, name: "Download", use: "Download export" },
      { icon: Paperclip, name: "Paperclip", use: "Attachment on a record" },
    ],
  },
  {
    id: "help",
    title: "Help & documentation",
    description:
      "In-app help centre, onboarding guides, and support. CircleHelp for tooltips; LifeBuoy for support contact.",
    icons: [
      { icon: CircleHelp, name: "CircleHelp", use: "Contextual help, tooltip" },
      { icon: BookOpen, name: "BookOpen", use: "Guide, knowledge base article" },
      { icon: LifeBuoy, name: "LifeBuoy", use: "Contact support" },
      { icon: FileQuestion, name: "FileQuestion", use: "FAQ entry" },
      { icon: ExternalLink, name: "ExternalLink", use: "Opens in new tab" },
    ],
  },
  {
    id: "status",
    title: "Status & feedback",
    description:
      "Toasts, inline alerts, and record states. Always pair with text; icons reinforce meaning, they do not replace it.",
    icons: [
      { icon: Check, name: "Check", use: "Success, complete" },
      { icon: X, name: "X", use: "Error, dismissed" },
      { icon: AlertCircle, name: "AlertCircle", use: "Warning, attention needed" },
      { icon: Info, name: "Info", use: "Neutral information" },
      { icon: Clock, name: "Clock", use: "Pending, overdue" },
      { icon: Loader2, name: "Loader2", use: "Loading (animate spin)" },
    ],
  },
  {
    id: "communication",
    title: "Communication",
    description:
      "Notices, bulk email, and owner updates. Megaphone for broadcast announcements to a scheme.",
    icons: [
      { icon: MessageSquare, name: "MessageSquare", use: "Thread, conversation" },
      { icon: Mail, name: "Mail", use: "Email, levy notice delivery" },
      { icon: Megaphone, name: "Megaphone", use: "Scheme-wide notice" },
      { icon: Bell, name: "Bell", use: "Notification bell" },
    ],
  },
  {
    id: "security",
    title: "Access & security",
    description:
      "Login, permissions, and sensitive actions. Lock for restricted content; Key for physical access records.",
    icons: [
      { icon: Lock, name: "Lock", use: "Restricted, private" },
      { icon: Key, name: "Key", use: "Access credentials" },
      { icon: ShieldCheck, name: "ShieldCheck", use: "Verified, secure" },
      { icon: UserCheck, name: "UserCheck", use: "Approved user" },
    ],
  },
];

const INSTALL_CODE = `yarn add lucide-react`;

const BASIC_USAGE = `import { Building2, Receipt } from "lucide-react"

// Default: 24px, stroke 1.5, forest on white surfaces
<Building2 className="size-6 text-forest" strokeWidth={1.5} aria-hidden />

// With accessible label when icon is the only content
<Receipt className="size-5" strokeWidth={1.5} aria-label="Levy notice" />`;

const SIZES = [
  { px: 16, className: "size-4", context: "Inline with body text, compact badges" },
  { px: 20, className: "size-5", context: "Buttons, inputs, sidebar nav (expanded)" },
  { px: 24, className: "size-6", context: "Feature cards, list rows, bento cells" },
  { px: 32, className: "size-8", context: "Empty states, section highlights" },
] as const;

interface IconTileProps {
  icon: LucideIcon;
  name: string;
  use: string;
}

/**
 * Renders a single icon from the catalogue with name and usage note.
 */
function IconTile({ icon: Icon, name, use }: IconTileProps) {
  return (
    <div className="rounded-sm border border-border bg-white p-4 flex flex-col gap-3">
      <div className="flex items-center justify-center rounded-sm bg-white border border-border h-14">
        <Icon className="size-6 text-forest" strokeWidth={1.5} aria-hidden />
      </div>
      <div>
        <p className="font-mono text-xs text-foreground">{name}</p>
        <p className="font-sans text-xs text-ink-muted leading-relaxed mt-1">{use}</p>
      </div>
    </div>
  );
}

/**
 * Foundation documentation page for Lucide icons in Instant Strata.
 */
export default function IconsPage() {
  return (
    <DocsPage className="space-y-20">

      {/* ── Page header ───────────────────────────────── */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Foundation
        </p>
        <h1 className="font-display text-4xl text-foreground mb-4 leading-tight">
          Icons
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-2xl">
          Instant Strata uses{" "}
          <a
            href="https://lucide.dev/guide/react/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline decoration-lime underline-offset-[3px]"
          >
            Lucide React
          </a>{" "}
          for all interface icons. Stroke-only, consistent weight, and tree-shakable:
          import only the icons you need. This page lists recommended icons for strata
          management workflows and shows how to apply them across the product.
        </p>
      </div>

      {/* ══════════════════════════════════════════════
          GETTING STARTED
      ══════════════════════════════════════════════ */}
      <section id="getting-started">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Getting Started
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Lucide exports each icon as a React component. Props control size, colour, and
          stroke width. Icons inherit <code className="font-mono text-xs bg-secondary px-1.5 py-0.5 rounded-sm">currentColor</code>{" "}
          from their parent, so Tailwind text utilities work naturally.
        </p>

        <div className="space-y-4">
          <CodeBlock code={INSTALL_CODE} language="bash" />
          <CodeBlock code={BASIC_USAGE} />
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STYLE RULES
      ══════════════════════════════════════════════ */}
      <section id="style">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Style Rules
        </p>

        <div className="rounded-sm border border-border overflow-hidden divide-y divide-border mb-8">
          {[
            { rule: "Library", detail: "Lucide React only. No filled icon sets, no custom SVGs in product UI unless brand-specific." },
            { rule: "Stroke", detail: "Stroke only, never filled. Default strokeWidth={1.5} across the product." },
            { rule: "Colour on light", detail: "text-forest on white surfaces, text-lime for accent or active states on tinted backgrounds, text-ink-muted for decorative." },
            { rule: "Colour on dark", detail: "text-white or text-lime. Never ink on forest backgrounds." },
            { rule: "Accessibility", detail: "Decorative icons: aria-hidden. Meaningful standalone icons: aria-label on the SVG." },
            { rule: "Consistency", detail: "One icon per concept. Building2 for schemes everywhere; do not mix Building and Building2." },
          ].map((row) => (
            <div key={row.rule} className="px-6 py-4 bg-white flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8">
              <span className="font-sans text-sm font-semibold text-foreground shrink-0 sm:w-36">{row.rule}</span>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">{row.detail}</p>
            </div>
          ))}
        </div>

        <ComponentPreview label="Sizes">
          <div className="w-full max-w-[640px] space-y-6 py-2">
            {SIZES.map((size) => (
              <div key={size.px} className="flex items-center gap-6">
                <Building2
                  className={cn(size.className, "text-forest shrink-0")}
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div>
                  <p className="font-mono text-sm text-foreground">{size.px}px · {size.className}</p>
                  <p className="font-sans text-xs text-ink-muted mt-0.5">{size.context}</p>
                </div>
              </div>
            ))}
          </div>
        </ComponentPreview>

        <ComponentPreview label="Colour on light and dark">
          <div className="w-full max-w-[640px] grid gap-4 sm:grid-cols-2 py-2">
            <div className="rounded-sm border border-border bg-white p-6 flex items-center gap-4">
              <Shield className="size-6 text-forest" strokeWidth={1.5} aria-hidden />
              <Shield className="size-6 text-lime" strokeWidth={1.5} aria-hidden />
              <Shield className="size-6 text-ink-muted" strokeWidth={1.5} aria-hidden />
              <span className="text-xs text-ink-muted ml-auto">White · accent · decorative</span>
            </div>
            <div className="rounded-sm bg-forest p-6 flex items-center gap-4">
              <Shield className="size-6 text-white" strokeWidth={1.5} aria-hidden />
              <Shield className="size-6 text-lime" strokeWidth={1.5} aria-hidden />
              <span className="text-xs text-white/60 ml-auto">Dark surface</span>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* ══════════════════════════════════════════════
          IN CONTEXT
      ══════════════════════════════════════════════ */}
      <section id="in-context">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          In Context
        </p>
        <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
          Icons clarify navigation and reinforce labels. They should never be the only cue
          for an action or status. Below are common Instant Strata patterns.
        </p>

        <div className="space-y-8">
          {/* Sidebar nav */}
          <ComponentPreview label="Sidebar navigation">
            <nav className="w-full max-w-[240px] rounded-sm border border-border bg-off-white p-2" aria-label="Example sidebar">
              {[
                { icon: LayoutDashboard, label: "Dashboard", active: true },
                { icon: Building2, label: "Buildings" },
                { icon: Receipt, label: "Levies" },
                { icon: Users, label: "Owners" },
                { icon: Wrench, label: "Maintenance" },
                { icon: BookOpen, label: "Help" },
              ].map(({ icon: Icon, label, active }) => (
                <a
                  key={label}
                  href="#"
                  className={cn(
                    "flex items-center gap-3 rounded-sm px-3 py-2 text-sm no-underline transition-colors duration-150",
                    active
                      ? "bg-lime-soft text-ink font-medium"
                      : "text-ink-muted hover:bg-white hover:text-ink"
                  )}
                >
                  <Icon className="size-5 shrink-0" strokeWidth={1.5} aria-hidden />
                  {label}
                </a>
              ))}
            </nav>
          </ComponentPreview>

          {/* Building list row */}
          <ComponentPreview label="Building / scheme list row">
            <div className="w-full max-w-[520px] rounded-sm border border-border bg-white divide-y divide-border">
              {[
                { name: "Harbour View Towers", lots: 48, suburb: "Darling Harbour" },
                { name: "Parkside Residences", lots: 12, suburb: "Surry Hills" },
              ].map((scheme) => (
                <div key={scheme.name} className="flex items-center gap-4 px-4 py-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-lime-soft">
                    <Building2 className="size-5 text-forest" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm font-semibold text-ink truncate">{scheme.name}</p>
                    <p className="font-sans text-xs text-ink-muted flex items-center gap-1">
                      <MapPin className="size-3.5 shrink-0 text-forest" strokeWidth={1.5} aria-hidden />
                      {scheme.suburb} · {scheme.lots} lots
                    </p>
                  </div>
                  <ChevronRight className="size-4 text-ink-muted shrink-0" strokeWidth={1.5} aria-hidden />
                </div>
              ))}
            </div>
          </ComponentPreview>

          {/* Levy status */}
          <ComponentPreview label="Levy notice status">
            <div className="w-full max-w-[520px] flex flex-wrap gap-3 py-2">
              {[
                { icon: Check, label: "Paid", className: "bg-lime-soft text-ink" },
                { icon: Clock, label: "Due", className: "bg-off-white text-ink-muted" },
                { icon: AlertCircle, label: "Overdue", className: "bg-off-white text-ink" },
              ].map(({ icon: Icon, label, className }) => (
                <span
                  key={label}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xs px-2.5 py-1 text-xs font-medium",
                    className
                  )}
                >
                  <Icon className="size-3.5" strokeWidth={1.5} aria-hidden />
                  {label}
                </span>
              ))}
            </div>
          </ComponentPreview>

          {/* Help centre */}
          <ComponentPreview label="Help centre categories">
            <div className="w-full max-w-[640px] grid gap-3 sm:grid-cols-2 py-2">
              {[
                { icon: BookOpen, title: "Getting started", articles: 8 },
                { icon: Receipt, title: "Levies & payments", articles: 12 },
                { icon: Gavel, title: "By-laws & compliance", articles: 6 },
                { icon: LifeBuoy, title: "Contact support", articles: 1 },
              ].map(({ icon: Icon, title, articles }) => (
                <a
                  key={title}
                  href="#"
                  className="flex items-start gap-3 rounded-md border border-border bg-white p-4 no-underline hover:border-ink-muted/40 transition-colors duration-150"
                >
                  <Icon className="size-5 text-forest shrink-0 mt-0.5" strokeWidth={1.5} aria-hidden />
                  <div>
                    <p className="font-sans text-sm font-semibold text-ink">{title}</p>
                    <p className="font-sans text-xs text-ink-muted mt-0.5">{articles} articles</p>
                  </div>
                </a>
              ))}
            </div>
          </ComponentPreview>

          {/* Work order */}
          <ComponentPreview label="Maintenance work order">
            <div className="w-full max-w-[520px] rounded-md border border-border bg-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-off-white">
                  <Wrench className="size-4 text-forest" strokeWidth={1.5} aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-sm font-semibold text-ink">Lift motor replacement</p>
                  <p className="font-sans text-xs text-ink-muted mt-1">Harbour View Towers · Lot 14</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-xs bg-off-white px-2 py-0.5 text-[11px] font-medium text-ink-muted">
                  <CalendarClock className="size-3" strokeWidth={1.5} aria-hidden />
                  Scheduled
                </span>
              </div>
            </div>
          </ComponentPreview>

          {/* Document actions */}
          <ComponentPreview label="Document row actions">
            <div className="w-full max-w-[520px] rounded-sm border border-border bg-white px-4 py-3 flex items-center gap-3">
              <FileText className="size-5 text-forest shrink-0" strokeWidth={1.5} aria-hidden />
              <span className="font-sans text-sm text-ink flex-1 truncate">AGM minutes · March 2026.pdf</span>
              <button type="button" className="p-1.5 text-ink-muted hover:text-ink transition-colors" aria-label="Download">
                <Download className="size-4" strokeWidth={1.5} />
              </button>
              <button type="button" className="p-1.5 text-ink-muted hover:text-ink transition-colors" aria-label="Share">
                <ExternalLink className="size-4" strokeWidth={1.5} />
              </button>
            </div>
          </ComponentPreview>

          {/* Button with icon */}
          <ComponentPreview label="Button with icon">
            <div className="flex flex-wrap items-center gap-4 py-2">
              <Button>
                <Upload className="size-4" strokeWidth={1.5} aria-hidden />
                Upload document
              </Button>
              <Button variant="outline">
                View scheme
                <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden />
              </Button>
            </div>
          </ComponentPreview>

          {/* Empty state */}
          <ComponentPreview label="Empty state">
            <div className="w-full max-w-[400px] mx-auto text-center py-6">
              <div className="flex justify-center mb-4">
                <div className="flex size-14 items-center justify-center rounded-md bg-lime-soft">
                  <ClipboardList className="size-8 text-forest" strokeWidth={1.5} aria-hidden />
                </div>
              </div>
              <p className="font-sans text-sm font-semibold text-ink mb-1">No work orders yet</p>
              <p className="font-sans text-xs text-ink-muted leading-relaxed max-w-[280px] mx-auto">
                Create a maintenance request to track defects and contractor visits for this scheme.
              </p>
            </div>
          </ComponentPreview>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CATALOGUE
      ══════════════════════════════════════════════ */}
      {ICON_CATEGORIES.map((category) => (
        <section key={category.id} id={category.id}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-4">
            Strata Icon Catalogue
          </p>
          <h2 className="font-display text-2xl text-foreground mb-2">{category.title}</h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-6 max-w-2xl">
            {category.description}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {category.icons.map((entry) => (
              <IconTile key={entry.name} {...entry} />
            ))}
          </div>
        </section>
      ))}

      {/* ══════════════════════════════════════════════
          RULES
      ══════════════════════════════════════════════ */}
      <section id="rules">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-8">
          Rules
        </p>
        <ul className="space-y-3 max-w-2xl">
          {[
            "Import icons by name from lucide-react. Only bundled icons you use are included in the build.",
            "Use strokeWidth={1.5} everywhere unless a specific dense UI needs size-4 at the same weight.",
            "Marketing CTAs use the text arrow (→), not a Lucide arrow icon, unless inside a dense app button.",
            "Do not use filled or duotone icon variants. Stroke-only keeps the interface calm and consistent.",
            "Pair status icons with a text label. Colour alone is not sufficient for overdue, paid, or error states.",
            "Browse the full Lucide library at lucide.dev when you need an icon not listed here, then add it to this catalogue.",
          ].map((rule) => (
            <li key={rule} className="flex gap-3 font-sans text-sm text-ink-muted leading-relaxed">
              <span className="text-lime shrink-0 mt-0.5" aria-hidden="true">-</span>
              {rule}
            </li>
          ))}
        </ul>
      </section>

    </DocsPage>
  );
}
