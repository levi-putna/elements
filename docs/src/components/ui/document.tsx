"use client"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ChevronRight,
  Download,
  ExternalLink,
  type LucideIcon,
} from "lucide-react"
import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react"

// ─────────────────────────────────────────────────────────
// Document
//
// Represents a file or folder across list, thing, and wide
// layouts. Type is inferred from the filename when omitted.
//
//   list  · dense row for narrow panels and stacked lists
//   thing · card tile for grids and pickers
//   wide  · full-width row with explicit metadata columns
// ─────────────────────────────────────────────────────────

export type DocumentLayout = "list" | "thing" | "wide"

export type DocumentType =
  | "pdf"
  | "doc"
  | "spreadsheet"
  | "presentation"
  | "image"
  | "archive"
  | "text"
  | "folder"
  | "other"

type DocumentTypeConfig = {
  label: string
  bannerClass: string
  placeholder: "lines" | "grid" | "slide" | "image" | "archive" | "folder"
}

const typeConfig: Record<DocumentType, DocumentTypeConfig> = {
  pdf: {
    label: "PDF",
    bannerClass: "bg-forest text-lime",
    placeholder: "lines",
  },
  doc: {
    label: "DOC",
    bannerClass: "bg-forest-mid text-white",
    placeholder: "lines",
  },
  spreadsheet: {
    label: "XLS",
    bannerClass: "bg-forest text-white",
    placeholder: "grid",
  },
  presentation: {
    label: "PPT",
    bannerClass: "bg-warning text-white",
    placeholder: "slide",
  },
  image: {
    label: "IMG",
    bannerClass: "bg-ink-muted text-white",
    placeholder: "image",
  },
  archive: {
    label: "ZIP",
    bannerClass: "bg-off-white text-ink border border-border",
    placeholder: "archive",
  },
  text: {
    label: "TXT",
    bannerClass: "bg-lime-soft text-forest",
    placeholder: "lines",
  },
  folder: {
    label: "Folder",
    bannerClass: "bg-lime text-forest",
    placeholder: "folder",
  },
  other: {
    label: "File",
    bannerClass: "bg-off-white text-ink-muted border border-border",
    placeholder: "lines",
  },
}

const extensionMap: Record<string, DocumentType> = {
  pdf: "pdf",
  doc: "doc",
  docx: "doc",
  xls: "spreadsheet",
  xlsx: "spreadsheet",
  csv: "spreadsheet",
  ppt: "presentation",
  pptx: "presentation",
  png: "image",
  jpg: "image",
  jpeg: "image",
  gif: "image",
  webp: "image",
  svg: "image",
  zip: "archive",
  rar: "archive",
  "7z": "archive",
  txt: "text",
  md: "text",
}

/**
 * Infer a document type from a filename or extension string.
 */
export function inferDocumentType({ value }: { value?: string }): DocumentType {
  if (!value) return "other"

  const normalised = value.trim().toLowerCase()
  if (normalised.endsWith("/") || normalised === "folder") return "folder"

  const extension = normalised.includes(".")
    ? normalised.split(".").pop() ?? ""
    : normalised

  return extensionMap[extension] ?? "other"
}

/**
 * Resolve the badge label from a filename, falling back to the type default.
 */
export function getDocumentExtensionLabel({
  value,
  type = "other",
}: {
  value?: string
  type?: DocumentType
}): string {
  if (!value) return typeConfig[type].label

  const normalised = value.trim()
  const extension = normalised.includes(".")
    ? normalised.split(".").pop()?.toUpperCase()
    : undefined

  if (extension && extension.length <= 5) return extension
  return typeConfig[type].label
}

/**
 * Format a byte count into a compact human-readable size.
 */
export function formatFileSize({ bytes }: { bytes?: number }): string | undefined {
  if (bytes === undefined || Number.isNaN(bytes)) return undefined
  if (bytes < 1024) return `${bytes} B`

  const units = ["KB", "MB", "GB", "TB"] as const
  let size = bytes / 1024
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  const precision = size >= 10 || unitIndex === 0 ? 0 : 1
  return `${size.toFixed(precision)} ${units[unitIndex]}`
}

function formatModifiedDate({ value }: { value?: string | Date }): string | undefined {
  if (!value) return undefined

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return undefined

  return new Intl.DateTimeFormat("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function DocumentPlaceholderLines() {
  return (
    <div className="space-y-1">
      <div className="h-0.5 w-2/3 rounded-full bg-forest/20" />
      <div className="h-0.5 w-full rounded-full bg-forest/10" />
      <div className="h-0.5 w-4/5 rounded-full bg-forest/10" />
      <div className="h-0.5 w-1/2 rounded-full bg-forest/10" />
      <div className="h-0.5 w-3/5 rounded-full bg-forest/10" />
    </div>
  )
}

function DocumentPlaceholderGrid() {
  return (
    <div className="space-y-0.5">
      <div className="grid grid-cols-3 gap-0.5">
        <div className="h-1.5 bg-forest/20" />
        <div className="h-1.5 bg-forest/20" />
        <div className="h-1.5 bg-forest/20" />
      </div>
      <div className="grid grid-cols-3 gap-0.5">
        <div className="h-1.5 bg-forest/10" />
        <div className="h-1.5 bg-forest/10" />
        <div className="h-1.5 bg-forest/10" />
        <div className="h-1.5 bg-forest/10" />
        <div className="h-1.5 bg-forest/10" />
        <div className="h-1.5 bg-forest/10" />
      </div>
      <div className="grid grid-cols-3 gap-0.5">
        <div className="h-1.5 bg-forest/10" />
        <div className="h-1.5 bg-forest/10" />
      </div>
    </div>
  )
}

function DocumentPlaceholderSlide() {
  return (
    <div className="space-y-1">
      <div className="rounded-xs border border-forest/10 bg-lime-soft/50 p-1">
        <div className="mx-auto size-2 rounded-xs bg-lime/70" />
        <div className="mx-auto mt-1 h-0.5 w-5 rounded-full bg-forest/15" />
      </div>
      <div className="h-0.5 w-4 rounded-full bg-forest/10" />
      <div className="h-0.5 w-6 rounded-full bg-forest/10" />
    </div>
  )
}

function DocumentPlaceholderImage() {
  return (
    <div className="rounded-xs border border-forest/10 bg-off-white p-1">
      <div className="mx-auto size-2.5 rounded-xs bg-lime/60" />
      <div className="mx-auto mt-1 h-0.5 w-4 rounded-full bg-forest/15" />
      <div className="mx-auto mt-0.5 h-0.5 w-6 rounded-full bg-forest/10" />
    </div>
  )
}

function DocumentPlaceholderArchive() {
  return (
    <div className="grid grid-cols-4 gap-0.5">
      {Array.from({ length: 12 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "size-1 rounded-[1px]",
            index % 2 === 0 ? "bg-forest/20" : "bg-forest/10"
          )}
        />
      ))}
    </div>
  )
}

function DocumentPlaceholderFolder() {
  return (
    <div className="space-y-1">
      <div className="h-1.5 w-2/5 rounded-t-xs bg-lime/70" />
      <div className="h-5 rounded-xs border border-forest/10 bg-lime-soft/60" />
    </div>
  )
}

function DocumentPlaceholder({ type }: { type: DocumentType }) {
  const placeholder = typeConfig[type].placeholder

  if (placeholder === "grid") return <DocumentPlaceholderGrid />
  if (placeholder === "slide") return <DocumentPlaceholderSlide />
  if (placeholder === "image") return <DocumentPlaceholderImage />
  if (placeholder === "archive") return <DocumentPlaceholderArchive />
  if (placeholder === "folder") return <DocumentPlaceholderFolder />
  return <DocumentPlaceholderLines />
}

export interface DocumentFileThumbProps extends HTMLAttributes<HTMLDivElement> {
  type?: DocumentType
  /** Filename used to derive the extension badge label. */
  name?: string
  size?: "sm" | "md" | "lg"
}

const thumbSizeClass = {
  sm: "w-9 h-11",
  md: "w-11 h-14",
  lg: "w-14 h-[4.5rem]",
}

const thumbBadgeClass = {
  sm: "right-0 bottom-0.5 px-1 py-px text-[6px]",
  md: "right-0 bottom-1 px-1 py-0.5 text-[7px]",
  lg: "-right-1.5 bottom-1.5 px-1.5 py-0.5 text-[8px]",
}

/**
 * Mini file card with type-specific placeholder art and an extension badge.
 */
export function DocumentFileThumb({
  type = "other",
  name,
  size = "md",
  className,
  ...props
}: DocumentFileThumbProps) {
  const config = typeConfig[type]
  const label = getDocumentExtensionLabel({ value: name, type })

  return (
    <div
      data-slot="document-file-thumb"
      aria-hidden
      className={cn("relative shrink-0", className)}
      {...props}
    >
      {/* Extension badge */}
      <span
        className={cn(
          "absolute z-10 rounded-xs font-mono font-semibold uppercase tracking-wide",
          thumbBadgeClass[size],
          config.bannerClass
        )}
      >
        {label}
      </span>

      {/* File body */}
      <div
        className={cn(
          "relative overflow-hidden rounded-sm border border-border bg-white p-1.5 shadow-[0_1px_2px_rgba(4,63,46,0.06)]",
          thumbSizeClass[size]
        )}
      >
        <DocumentPlaceholder type={type} />
      </div>
    </div>
  )
}

export interface DocumentIconProps extends HTMLAttributes<HTMLDivElement> {
  type?: DocumentType
  name?: string
  size?: "sm" | "md" | "lg"
}

/**
 * File type thumbnail. Alias for {@link DocumentFileThumb}.
 */
export function DocumentIcon({
  type = "other",
  name,
  size = "md",
  className,
  ...props
}: DocumentIconProps) {
  return (
    <DocumentFileThumb
      type={type}
      name={name}
      size={size}
      className={className}
      {...props}
    />
  )
}

export interface DocumentTypeBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  type?: DocumentType
  name?: string
}

/**
 * Extension label badge using the same brand colours as the file thumb.
 */
export function DocumentTypeBadge({
  type = "other",
  name,
  className,
  ...props
}: DocumentTypeBadgeProps) {
  const config = typeConfig[type]
  const label = getDocumentExtensionLabel({ value: name, type })

  return (
    <Badge
      variant="mono"
      size="sm"
      data-slot="document-type-badge"
      className={cn("font-semibold", config.bannerClass, className)}
      {...props}
    >
      {label}
    </Badge>
  )
}

export interface DocumentActionButtonProps
  extends HTMLAttributes<HTMLButtonElement> {
  label: string
  icon?: LucideIcon
}

/**
 * Icon-only action control for document rows.
 */
export function DocumentActionButton({
  label,
  icon: Icon = Download,
  className,
  ...props
}: DocumentActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "rounded-sm p-1.5 text-ink-muted transition-colors duration-150 hover:bg-off-white hover:text-ink",
        className
      )}
      {...props}
    >
      <Icon className="size-4" strokeWidth={1.5} aria-hidden />
    </button>
  )
}

export interface DocumentProps extends HTMLAttributes<HTMLElement> {
  /** Human-readable document title. */
  title: string
  /** Filename when different from the title. */
  name?: string
  /** File type. Inferred from `name` or `title` when omitted. */
  type?: DocumentType
  /** File size in bytes. */
  size?: number
  /** Last modified date. */
  modifiedAt?: string | Date
  /** Parent folder or scheme context. */
  folder?: string
  /** Layout density for the surrounding space. */
  layout?: DocumentLayout
  /** When set, the document renders as a link. */
  href?: string
  /** Show a trailing chevron for navigable rows. */
  showChevron?: boolean
  /** Optional download handler. Renders a download action when set. */
  onDownload?: () => void
  /** Optional share/open handler. Renders an external-link action when set. */
  onShare?: () => void
  /** Replace the default trailing actions. */
  actions?: ReactNode
  /** Highlight the row as selected. */
  selected?: boolean
}

function DocumentMetadata({
  items,
  className,
}: {
  items: Array<string | undefined>
  className?: string
}) {
  const visibleItems = items.filter(Boolean)
  if (visibleItems.length === 0) return null

  return (
    <p className={cn("font-sans text-xs text-ink-muted truncate", className)}>
      {visibleItems.join(" · ")}
    </p>
  )
}

function DocumentActions({
  onDownload,
  onShare,
  actions,
}: Pick<DocumentProps, "onDownload" | "onShare" | "actions">) {
  if (actions) return <div className="flex shrink-0 items-center gap-0.5">{actions}</div>
  if (!onDownload && !onShare) return null

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      {onDownload ? (
        <DocumentActionButton label="Download" onClick={onDownload} />
      ) : null}
      {onShare ? (
        <DocumentActionButton
          label="Open"
          icon={ExternalLink}
          onClick={onShare}
        />
      ) : null}
    </div>
  )
}

function DocumentShell({
  layout,
  selected,
  href,
  className,
  children,
  title: _title,
  name: _name,
  type: _type,
  size: _size,
  modifiedAt: _modifiedAt,
  folder: _folder,
  showChevron: _showChevron,
  onDownload: _onDownload,
  onShare: _onShare,
  actions: _actions,
  ...props
}: DocumentProps & { children: ReactNode }) {
  const shellClass = cn(
    "group/document transition-colors duration-150",
    layout === "list" &&
      "flex items-center gap-3 px-4 py-3 hover:bg-off-white/70",
    layout === "thing" &&
      "flex h-full flex-col rounded-md border border-border bg-white p-4 hover:border-ink-muted/40",
    layout === "wide" &&
      "grid grid-cols-[minmax(0,1fr)_72px_88px_120px_auto] items-center gap-4 px-4 py-3 hover:bg-off-white/70",
    selected && "bg-lime-soft/60",
    href && "cursor-pointer",
    className
  )

  if (href) {
    return (
      <a
        data-slot="document"
        href={href}
        className={cn(shellClass, "no-underline text-inherit")}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    )
  }

  return (
    <div data-slot="document" className={shellClass} {...props}>
      {children}
    </div>
  )
}

/**
 * Document row, card, or wide table row for files and folders.
 */
export function Document({
  title,
  name,
  type,
  size,
  modifiedAt,
  folder,
  layout = "list",
  href,
  showChevron = false,
  onDownload,
  onShare,
  actions,
  selected = false,
  className,
  ...props
}: DocumentProps) {
  const resolvedType =
    type ?? inferDocumentType({ value: name ?? title })
  const formattedSize = formatFileSize({ bytes: size })
  const formattedDate = formatModifiedDate({ value: modifiedAt })
  const secondaryLine = name && name !== title ? name : undefined

  if (layout === "thing") {
    return (
      <DocumentShell
        layout={layout}
        title={title}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        {/* File thumb */}
        <div className="mb-4">
          <DocumentFileThumb
            type={resolvedType}
            name={name ?? title}
            size="lg"
          />
        </div>

        {/* Title + metadata */}
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-semibold text-ink line-clamp-2">
            {title}
          </p>
          <DocumentMetadata
            className="mt-1"
            items={[secondaryLine, formattedSize, folder]}
          />
        </div>

        {/* Footer actions */}
        {(actions || onDownload || onShare || showChevron) && (
          <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
            <DocumentActions
              onDownload={onDownload}
              onShare={onShare}
              actions={actions}
            />
            {showChevron ? (
              <ChevronRight
                className="size-4 shrink-0 text-ink-muted"
                strokeWidth={1.5}
                aria-hidden
              />
            ) : null}
          </div>
        )}
      </DocumentShell>
    )
  }

  if (layout === "wide") {
    return (
      <DocumentShell
        layout={layout}
        title={title}
        href={href}
        selected={selected}
        className={className}
        {...props}
      >
        {/* Name column */}
        <div className="flex min-w-0 items-center gap-3">
          <DocumentFileThumb
            type={resolvedType}
            name={name ?? title}
            size="sm"
          />
          <div className="min-w-0">
            <p className="font-sans text-sm font-semibold text-ink truncate">
              {title}
            </p>
            <DocumentMetadata items={[secondaryLine, folder]} />
          </div>
        </div>

        {/* Type column */}
        <div className="hidden sm:flex justify-center">
          <DocumentTypeBadge
            type={resolvedType}
            name={name ?? title}
          />
        </div>

        {/* Size column */}
        <p className="hidden sm:block font-mono text-xs text-ink-muted">
          {formattedSize ?? "-"}
        </p>

        {/* Modified column */}
        <p className="hidden md:block font-sans text-xs text-ink-muted">
          {formattedDate ?? "-"}
        </p>

        {/* Actions column */}
        <div className="flex items-center justify-end gap-1">
          <DocumentActions
            onDownload={onDownload}
            onShare={onShare}
            actions={actions}
          />
          {showChevron ? (
            <ChevronRight
              className="size-4 shrink-0 text-ink-muted"
              strokeWidth={1.5}
              aria-hidden
            />
          ) : null}
        </div>
      </DocumentShell>
    )
  }

  return (
    <DocumentShell
      layout={layout}
      title={title}
      href={href}
      selected={selected}
      className={className}
      {...props}
    >
      {/* Leading file thumb */}
      <DocumentFileThumb
        type={resolvedType}
        name={name ?? title}
        size="sm"
      />

      {/* Title + metadata */}
      <div className="min-w-0 flex-1">
        <p className="font-sans text-sm font-semibold text-ink truncate">
          {title}
        </p>
        <DocumentMetadata
          items={[secondaryLine, formattedSize, folder, formattedDate]}
        />
      </div>

      {/* Trailing actions */}
      <div className="flex shrink-0 items-center gap-1">
        <DocumentActions
          onDownload={onDownload}
          onShare={onShare}
          actions={actions}
        />
        {showChevron ? (
          <ChevronRight
            className="size-4 shrink-0 text-ink-muted"
            strokeWidth={1.5}
            aria-hidden
          />
        ) : null}
      </div>
    </DocumentShell>
  )
}

export interface DocumentListProps extends HTMLAttributes<HTMLDivElement> {
  /** When true, renders column headings for wide rows. */
  showWideHeader?: boolean
}

/**
 * Bordered stack for list and wide document rows.
 */
export function DocumentList({
  showWideHeader = false,
  className,
  children,
  ...props
}: DocumentListProps) {
  return (
    <div
      data-slot="document-list"
      className={cn(
        "overflow-hidden rounded-sm border border-border bg-white",
        className
      )}
      {...props}
    >
      {showWideHeader ? (
        <div className="hidden sm:grid grid-cols-[minmax(0,1fr)_72px_88px_120px_auto] gap-4 border-b border-border bg-off-white px-4 py-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
            Name
          </p>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
            Type
          </p>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
            Size
          </p>
          <p className="hidden md:block font-sans text-[11px] font-semibold uppercase tracking-widest text-ink-muted">
            Modified
          </p>
          <span className="sr-only">Actions</span>
        </div>
      ) : null}
      <div className="divide-y divide-border">{children}</div>
    </div>
  )
}

export interface DocumentGridProps extends HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4
}

const gridColumnsClass: Record<NonNullable<DocumentGridProps["columns"]>, string> = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
}

/**
 * Responsive grid for thing-layout document cards.
 */
export function DocumentGrid({
  columns = 3,
  className,
  children,
  ...props
}: DocumentGridProps) {
  return (
    <div
      data-slot="document-grid"
      className={cn("grid gap-3", gridColumnsClass[columns], className)}
      {...props}
    >
      {children}
    </div>
  )
}

export const DOCUMENT_DEMO_ITEMS = [
  {
    title: "AGM Minutes",
    name: "AGM minutes · March 2026.pdf",
    size: 248_320,
    modifiedAt: "2026-03-14",
    folder: "Harbour View Towers",
    type: "pdf" as const,
  },
  {
    title: "Budget Forecast",
    name: "Budget forecast FY26.xlsx",
    size: 1_048_576,
    modifiedAt: "2026-02-28",
    folder: "Financials",
    type: "spreadsheet" as const,
  },
  {
    title: "By-law Register",
    name: "By-law register.pdf",
    size: 512_000,
    modifiedAt: "2026-01-10",
    folder: "Compliance",
    type: "pdf" as const,
  },
  {
    title: "Insurance Certificate",
    name: "Insurance certificate 2026.pdf",
    size: 892_416,
    modifiedAt: "2026-01-05",
    folder: "Insurance",
    type: "pdf" as const,
  },
] as const
