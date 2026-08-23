import type { Metadata } from "next";
import Link from "next/link";
import { Syne, Figtree, IBM_Plex_Mono } from "next/font/google";
import { WizardProvider } from "@/components/WizardProvider";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const body = Figtree({
  variable: "--font-body",
  subsets: ["latin"],
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Promptia — un prompt, zéro allers-retours",
  description:
    "Transformez une idée vague en prompt IA dense via des questions ciblées. Économisez des tokens en évitant les conversations inutiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <WizardProvider>
          <header className="site-shell flex items-center justify-between py-6">
            <Link
              href="/"
              className="brand text-lg tracking-tight text-[var(--ink)] sm:text-xl"
            >
              Promptia
            </Link>
            <nav className="flex items-center gap-5 text-sm font-medium text-[var(--muted)]">
              <Link
                className="transition-colors hover:text-[var(--ink)]"
                href="/builder"
              >
                Générer
              </Link>
            </nav>
          </header>
          <main className="flex flex-1 flex-col">{children}</main>
          <footer className="site-shell border-t border-[var(--line)] py-8 text-xs text-[var(--muted)]">
            Promptia — clarification avant génération. Estimations de tokens
            indicatives.
          </footer>
        </WizardProvider>
      </body>
    </html>
  );
}
