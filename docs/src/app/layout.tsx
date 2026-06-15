import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elements — UI Component Library",
  description: "A personal UI component library extending shadcn/ui.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <header className="border-b border-border px-6 h-14 flex items-center justify-between shrink-0">
          <Link href="/" className="font-semibold text-sm tracking-tight">
            elements
          </Link>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/components/button" className="hover:text-foreground transition-colors">
              Components
            </Link>
            <a
              href="https://github.com/levi-putna/elements"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </nav>
        </header>
        <div className="flex flex-1">
          <aside className="w-56 shrink-0 border-r border-border px-4 py-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">
              Components
            </p>
            <nav className="flex flex-col gap-0.5">
              <Link
                href="/components/button"
                className="rounded-md px-2 py-1.5 text-sm hover:bg-muted transition-colors"
              >
                Button
              </Link>
            </nav>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </body>
    </html>
  );
}
