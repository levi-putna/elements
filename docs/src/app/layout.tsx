import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

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
    default: "Elements — Instant Strata UI Library",
    template: "%s · Elements",
  },
  description:
    "A personal UI component library extending shadcn/ui with Instant Strata brand conventions.",
};

const components = [
  {
    label: "Base",
    items: [{ href: "/components/button", label: "Button" }],
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
    label: "Website",
    items: [{ href: "/components/section", label: "Section" }],
  },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Top nav */}
        <header className="sticky top-0 z-40 h-14 border-b border-border bg-white/95 backdrop-blur-sm flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* IS logo mark */}
            <Link
              href="/"
              className="flex items-center justify-center w-7 h-7 rounded-sm bg-lime text-forest text-sm font-bold font-display tracking-tight shrink-0 select-none [text-decoration:none]"
              aria-label="Elements home"
            >
              IS
            </Link>
            <span className="text-sm font-semibold text-foreground tracking-tight">
              Elements
            </span>
          </div>

          <nav className="flex items-center gap-5">
            <Link
              href="/"
              className="text-sm text-ink-muted hover:text-foreground transition-colors duration-150 no-underline"
            >
              Docs
            </Link>
            <a
              href="https://github.com/levi-putna/elements"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-muted hover:text-foreground transition-colors duration-150 flex items-center gap-1.5 no-underline"
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
        </header>

        <div className="flex flex-1 min-h-0">
          {/* Left sidebar */}
          <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-border bg-white">
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
              {components.map((group) => (
                <div key={group.label}>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted px-2 mb-1.5">
                    {group.label}
                  </p>
                  <nav className="flex flex-col">
                    {group.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="rounded-sm px-2 py-1.5 text-sm text-ink-muted hover:text-foreground hover:bg-secondary transition-colors duration-150 no-underline"
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
      </body>
    </html>
  );
}
