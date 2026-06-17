import Link from "next/link";
import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { ModeToggle } from "@/components/docs/mode-toggle";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { LogoMark } from "@/components/ui/logo";

export default function DocsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-full flex flex-col">
      {/* Top nav: left column width matches sidebar on md+ */}
      <header className="sticky top-0 z-40 h-14 border-b border-border bg-background/95 backdrop-blur-sm shrink-0">
        <div className="flex h-full items-stretch">
          {/* Logo column: bordered cell aligned to sidebar width */}
          <div className="flex items-center gap-3 px-6 md:w-60 md:shrink-0 md:border-r md:border-border md:px-4">
            {/* IS logo mark */}
            <Link
              href="/"
              className="shrink-0 [text-decoration:none]"
              aria-label="Elements home"
            >
              <LogoMark surface="light" size="md" decorative />
            </Link>
            <span className="text-sm font-semibold text-foreground tracking-tight">
              Elements
            </span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-1 items-center justify-end gap-3 px-6">
            <ModeToggle />
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 no-underline"
            >
              Docs
            </Link>
            <a
              href="https://github.com/levi-putna/elements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150 flex items-center gap-1.5 no-underline"
            >
              <svg
                className="size-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
                  clipRule="evenodd"
                />
              </svg>
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <DocsSidebar />

        {/* Main content */}
        <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
      </div>

      <TableOfContents />
    </div>
  );
}
