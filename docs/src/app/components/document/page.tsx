"use client";

import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  DOCUMENT_DEMO_ITEMS,
  Document,
  DocumentFileThumb,
  DocumentGrid,
  DocumentList,
  DocumentTypeBadge,
} from "@/components/ui/document";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/document/registry.json`;

const USAGE_CODE = `import { Document, DocumentList } from "@/components/ui/document"

<DocumentList>
  <Document
    layout="list"
    title="AGM Minutes"
    name="AGM minutes · March 2026.pdf"
    size={248320}
    modifiedAt="2026-03-14"
    folder="Harbour View Towers"
    onDownload={() => {}}
    onShare={() => {}}
  />
</DocumentList>`;

const THING_CODE = `import { Document, DocumentGrid } from "@/components/ui/document"

<DocumentGrid columns={3}>
  <Document
    layout="thing"
    title="Budget Forecast"
    name="Budget forecast FY26.xlsx"
    size={1048576}
    folder="Financials"
    showChevron
    href="#"
  />
</DocumentGrid>`;

const WIDE_CODE = `import { Document, DocumentList } from "@/components/ui/document"

<DocumentList showWideHeader>
  <Document
    layout="wide"
    title="Insurance Certificate"
    name="Insurance certificate 2026.pdf"
    size={892416}
    modifiedAt="2026-01-05"
    folder="Insurance"
    onDownload={() => {}}
  />
</DocumentList>`;

const DOCUMENT_PROPS = [
  { name: "title", type: "string", description: "Human-readable document title shown as the primary label." },
  { name: "name", type: "string", description: "Filename. Shown as secondary metadata when different from the title." },
  { name: "type", type: 'DocumentType', description: "File type. Inferred from the filename when omitted." },
  { name: "size", type: "number", description: "File size in bytes. Formatted automatically in metadata." },
  { name: "modifiedAt", type: "string | Date", description: "Last modified date. Formatted for Australian locale." },
  { name: "folder", type: "string", description: "Parent folder or scheme context shown in metadata." },
  { name: "layout", type: '"list" | "thing" | "wide"', default: '"list"', description: "list = dense row. thing = card tile. wide = metadata columns for wide spaces." },
  { name: "href", type: "string", description: "When set, renders the document as a link." },
  { name: "showChevron", type: "boolean", default: "false", description: "Shows a trailing chevron for navigable rows." },
  { name: "onDownload", type: "() => void", description: "When set, renders a download action button." },
  { name: "onShare", type: "() => void", description: "When set, renders an open/share action button." },
  { name: "actions", type: "ReactNode", description: "Custom trailing actions. Replaces the default download/share buttons." },
  { name: "selected", type: "boolean", default: "false", description: "Highlights the row with a lime-soft background." },
];

const LIST_PROPS = [
  { name: "showWideHeader", type: "boolean", default: "false", description: "Renders column headings above wide-layout rows." },
];

const GRID_PROPS = [
  { name: "columns", type: "2 | 3 | 4", default: "3", description: "Responsive column count for thing-layout cards." },
];

/**
 * Document component documentation for files and folders.
 */
export default function DocumentPage() {
  return (
    <DocsPage width="wide">

      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Application
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Document</h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          A file and folder element for scheme document libraries. Three layouts cover
          list spaces (dense rows), thing spaces (card tiles), and wide spaces (tabular
          metadata). Type icons, size, and modified date are formatted automatically.
        </p>
      </div>

      {/* Design rationale */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Design rationale
        </h2>
        <div className="max-w-3xl space-y-4 text-sm text-ink-muted leading-relaxed">
          <p>
            File browsers work best when the layout matches the container width. Dense
            list rows suit narrow sidebars and mobile panels. Card tiles suit grids and
            pickers where each file is a discrete object. Wide rows with explicit columns
            suit document managers where users compare size and modified date across many
            files at once.
          </p>
          <p>
            Rather than rainbow file-type colours, the component uses the Instant Strata
            palette: lime-soft icon tiles for primary documents, off-white for secondary
            types, and a mono type badge via{" "}
            <code className="font-mono text-xs text-ink">DocumentTypeBadge</code>, which
            composes{" "}
            <a href="/components/badge" className="text-forest underline underline-offset-2">
              Badge
            </a>
            . See the Badge docs for every file type label.
          </p>
          <p>
            Metadata is joined with middle dots, matching existing card and list patterns.
            Actions stay icon-only with accessible labels, and filenames truncate rather
            than wrapping, which preserves scanability in long document lists.
          </p>
        </div>
      </section>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL} language="bash" />
        <p className="mt-3 text-sm text-ink-muted">
          Requires the <code className="font-mono text-xs text-ink">badge</code> component.
        </p>
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Usage
        </h2>
        <CodeBlock code={USAGE_CODE} language="tsx" />
      </section>

      {/* Examples */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Examples
        </h2>

        <div className="space-y-10">
          {/* List layout */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">List layout</p>
            <p className="text-sm text-ink-muted mb-4 max-w-2xl">
              Dense rows for narrow list spaces, sidebars, and stacked file lists.
            </p>
            <ComponentPreview label="List space · max 520px">
              <DocumentList className="w-full max-w-[520px]">
                {DOCUMENT_DEMO_ITEMS.slice(0, 3).map((item) => (
                  <Document
                    key={item.name}
                    layout="list"
                    {...item}
                    onDownload={() => {}}
                    onShare={() => {}}
                  />
                ))}
              </DocumentList>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={USAGE_CODE} language="tsx" />
            </div>
          </div>

          {/* Thing layout */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Thing layout</p>
            <p className="text-sm text-ink-muted mb-4 max-w-2xl">
              Card tiles for grids, dashboards, and file pickers where each document is
              a discrete object.
            </p>
            <ComponentPreview label="Thing space · responsive grid">
              <DocumentGrid columns={3} className="w-full">
                {DOCUMENT_DEMO_ITEMS.map((item) => (
                  <Document
                    key={item.name}
                    layout="thing"
                    {...item}
                    showChevron
                    href="#"
                  />
                ))}
              </DocumentGrid>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={THING_CODE} language="tsx" />
            </div>
          </div>

          {/* Wide layout */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Wide layout</p>
            <p className="text-sm text-ink-muted mb-4 max-w-2xl">
              Full-width rows with type, size, and modified columns for document manager
              views in wide containers.
            </p>
            <ComponentPreview label="Wide space · full container width">
              <DocumentList showWideHeader className="w-full">
                {DOCUMENT_DEMO_ITEMS.map((item) => (
                  <Document
                    key={item.name}
                    layout="wide"
                    {...item}
                    onDownload={() => {}}
                  />
                ))}
              </DocumentList>
            </ComponentPreview>
            <div className="mt-4">
              <CodeBlock code={WIDE_CODE} language="tsx" />
            </div>
          </div>

          {/* Type indicators */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">File thumbnails</p>
            <p className="text-sm text-ink-muted mb-4 max-w-2xl">
              Mini file cards with type-specific placeholder art and a forest/lime
              extension badge. Sizes scale across list, default, and thing layouts.
            </p>
            <ComponentPreview label="DocumentFileThumb · all sizes">
              <div className="flex flex-wrap items-end gap-6 py-2">
                <DocumentFileThumb type="pdf" name="AGM minutes.pdf" size="sm" />
                <DocumentFileThumb type="spreadsheet" name="Budget FY26.xlsx" size="md" />
                <DocumentFileThumb type="presentation" name="AGM slides.pptx" size="lg" />
              </div>
            </ComponentPreview>
            <ComponentPreview label="DocumentFileThumb · type variants">
              <div className="flex flex-wrap items-end gap-4 py-2">
                <DocumentFileThumb type="pdf" name="minutes.pdf" size="md" />
                <DocumentFileThumb type="doc" name="notice.docx" size="md" />
                <DocumentFileThumb type="spreadsheet" name="budget.xlsx" size="md" />
                <DocumentFileThumb type="presentation" name="slides.pptx" size="md" />
                <DocumentFileThumb type="image" name="photo.jpg" size="md" />
                <DocumentFileThumb type="archive" name="files.zip" size="md" />
                <DocumentFileThumb type="folder" size="md" />
              </div>
            </ComponentPreview>
            <ComponentPreview label="DocumentTypeBadge">
              <div className="flex flex-wrap items-center gap-3 py-2">
                <DocumentTypeBadge type="pdf" name="minutes.pdf" />
                <DocumentTypeBadge type="spreadsheet" name="budget.xlsx" />
                <DocumentTypeBadge type="presentation" name="slides.pptx" />
              </div>
              <p className="mt-4 text-sm text-ink-muted">
                All file type labels and brand colours are listed on the{" "}
                <a href="/components/badge" className="text-forest underline underline-offset-2">
                  Badge
                </a>{" "}
                page.
              </p>
            </ComponentPreview>
          </div>

          {/* Selected state */}
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Selected state</p>
            <ComponentPreview label="Selected row">
              <DocumentList className="w-full max-w-[520px]">
                <Document
                  layout="list"
                  selected
                  title="AGM Minutes"
                  name="AGM minutes · March 2026.pdf"
                  size={248_320}
                  modifiedAt="2026-03-14"
                  folder="Harbour View Towers"
                />
                <Document
                  layout="list"
                  title="Budget Forecast"
                  name="Budget forecast FY26.xlsx"
                  size={1_048_576}
                  folder="Financials"
                  showChevron
                  href="#"
                />
              </DocumentList>
            </ComponentPreview>
          </div>
        </div>
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Props
        </h2>
        <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">Document</p>
            <PropTable props={DOCUMENT_PROPS} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">DocumentList</p>
            <PropTable props={LIST_PROPS} />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground mb-3">DocumentGrid</p>
            <PropTable props={GRID_PROPS} />
          </div>
        </div>
      </section>

    </DocsPage>
  );
}
