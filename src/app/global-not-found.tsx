import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { fontVariables } from "@/lib/fonts";
import { Logo } from "@/components/brand/Logo";
import { Photo } from "@/components/ui/Photo";
import { getDictionary } from "@/i18n/dictionary";

export const metadata: Metadata = {
  title: "404 — Stranica nije pronađena | Ondine",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  const sr = getDictionary("sr").notFound;
  const en = getDictionary("en").notFound;
  return (
    <html lang="sr-Latn" className={fontVariables}>
      <body className="theme-cream min-h-screen">
        <main className="grid min-h-screen lg:grid-cols-2">
          <div className="flex flex-col justify-between p-[var(--gutter)]">
            <Link href="/" aria-label="Ondine" className="inline-block w-fit py-4">
              <Logo className="h-6 w-auto" animate />
            </Link>
            <div className="py-16">
              <p className="t-eyebrow text-wine">Error 404</p>
              <h1 className="t-display mt-6">
                4<em className="text-wine">0</em>4
              </h1>
              <div className="mt-12 grid max-w-3xl gap-10 sm:grid-cols-2">
                <div>
                  <p className="font-serif text-2xl leading-tight">{sr.title}</p>
                  <p className="mt-3 text-muted">{sr.text}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-wine px-6 font-medium text-cream hover:bg-ink">
                      {sr.home}
                    </Link>
                    <Link href="/cenovnik" className="inline-flex min-h-12 items-center rounded-full border border-line px-6 font-medium hover:border-ink">
                      Cenovnik
                    </Link>
                  </div>
                </div>
                <div lang="en">
                  <p className="font-serif text-2xl leading-tight">{en.title}</p>
                  <p className="mt-3 text-muted">{en.text}</p>
                  <Link href="/en" className="mt-6 inline-flex min-h-12 items-center rounded-full border border-line px-6 font-medium hover:border-ink">
                    {en.home}
                  </Link>
                </div>
              </div>
            </div>
            <p className="text-[0.8rem] text-muted">Ondine · Strahinjića Bana 44, Beograd</p>
          </div>
          <div className="relative hidden lg:block">
            <Photo k="look-blonde-motion" alt="" sizes="50vw" />
          </div>
        </main>
      </body>
    </html>
  );
}
