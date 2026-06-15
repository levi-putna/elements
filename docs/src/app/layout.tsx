import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Young_Serif } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ModeToggle } from "@/components/docs/mode-toggle";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { ThemeProvider } from "@/components/theme-provider";
import { LogoMark } from "@/components/ui/logo";

const youngSerif = Young_Serif({
  variable: "--font-young-serif",
  subsets: ["latin"],
  weight: "400",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: {
    default: "Elements: Instant Strata UI Library",
    template: "%s · Elements",
  },
  description:
    "Design system repository for Instant Strata: brand guidelines, UI patterns, and copy-paste components.",
};

const components = [
  {
    label: "Foundation",
    items: [
      { href: "/components/colours", label: "Colours & Accent" },
      { href: "/components/typography", label: "Typography" },
      { href: "/components/logo", label: "Logo" },
      { href: "/components/icons", label: "Icons" },
    ],
  },
  {
    label: "Base",
    items: [
      { href: "/components/button", label: "Button" },
      { href: "/components/badge", label: "Badge" },
      { href: "/components/avatar", label: "Avatar" },
      { href: "/components/dialog", label: "Dialog" },
      { href: "/components/skeleton", label: "Skeleton" },
      { href: "/components/shimmer", label: "Shimmer" },
    ],
  },
  {
    label: "AI",
    items: [
      { href: "/components/prompt-input", label: "Prompt Input" },
      { href: "/components/conversation", label: "Conversation" },
      { href: "/components/message", label: "Message" },
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
    ],
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
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${youngSerif.variable} ${inter.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
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
          {/* Left sidebar */}
          <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[#032B1F] bg-[#043F2E]">
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {/* Overview: return to homepage */}
              <nav>
                <Link
                  href="/"
                  className="block rounded-sm px-2 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors duration-150 no-underline"
                >
                  Overview
                </Link>
              </nav>

              {components.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/40 px-2 mb-1.5">
                    {group.label}
                  </p>
                  <nav className="flex flex-col">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-sm px-2 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-150 no-underline"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              ))}
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 overflow-y-auto">
            {children}
          </main>
        </div>

        <TableOfContents />
        </ThemeProvider>
      </body>
    </html>
  );
}
