"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Logo } from "@/components/brand/Logo";
import { Magnetic } from "@/components/ui/Magnetic";
import { OpenBadge } from "@/components/ui/OpenBadge";
import type { Locale } from "@/lib/i18n";

export type NavLink = { key: string; label: string; href: string; image?: string };

type Props = {
  locale: Locale;
  homeHref: string;
  bookHref: string;
  bookLabel: string;
  menuLabel: string;
  closeLabel: string;
  langLabel: string;
  primary: NavLink[];
  all: NavLink[];
  altMap: Record<string, string>;
  otherHome: string;
  phone: string;
  phoneHref: string;
  address: string;
  instagram: string;
  instagramUrl: string;
};

export function Header(p: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hover, setHover] = useState(0);
  const [onDark, setOnDark] = useState(false);
  const lastY = useRef(0);
  const menuBtn = useRef<HTMLButtonElement>(null);

  // Hide on scroll down, reveal on scroll up; solid background once off the top.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      // Transparent header over a dark section → light text.
      setOnDark(
        Array.from(document.querySelectorAll<HTMLElement>("[data-header='dark']")).some((el) => {
          const r = el.getBoundingClientRect();
          return r.top <= 40 && r.bottom >= 40;
        }),
      );
      setHidden(y > 400 && y > lastY.current + 4);
      if (y < lastY.current - 4 || y < 400) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on navigation (state adjusted during render), then re-check the section under the header.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    const id = window.setTimeout(() => window.dispatchEvent(new Event("scroll")), 60);
    return () => window.clearTimeout(id);
  }, [pathname]);

  // Lock scroll + Escape while the menu is open.
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuBtn.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.__lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const langHref = p.altMap[pathname] ?? p.otherHome;
  const other = p.locale === "sr" ? "EN" : "SR";

  return (
    <>
      <header
        className={clsx(
          "fixed inset-x-0 top-0 z-[130] transition-[transform,background-color,box-shadow] duration-700 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          scrolled && !open ? "bg-cream/88 shadow-[0_1px_0_rgba(15,11,12,0.08)] backdrop-blur-md" : "bg-transparent",
          open || (onDark && !scrolled) ? "text-cream" : "text-ink",
        )}
      >
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href={p.homeHref} prefetch={false} className="relative z-10 -ml-1 p-1" aria-label={p.locale === "sr" ? "Ondine — početna" : "Ondine — home"}>
            <Logo className="h-[1.35rem] w-auto md:h-6" animate />
          </Link>

          <nav aria-label={p.locale === "sr" ? "Glavna navigacija" : "Main navigation"} className="hidden lg:block">
            <ul className="flex items-center gap-9 text-[0.9rem]">
              {p.primary.map((l) => (
                <li key={l.key}>
                  <Link
                    href={l.href}
                    className={clsx("link-draw py-2", pathname.startsWith(l.href) && "bg-[length:100%_1px]")}
                    aria-current={pathname === l.href ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <Link
              href={langHref}
              prefetch={false}
              hrefLang={p.locale === "sr" ? "en" : "sr"}
              aria-label={p.langLabel}
              className="t-eyebrow grid h-11 min-w-11 place-items-center rounded-full px-2 hover:text-wine"
            >
              {other}
            </Link>
            <Magnetic className="hidden md:inline-block">
              <Link
                href={p.bookHref}
                className={clsx(
                  "inline-flex h-11 items-center rounded-full px-6 text-[0.9rem] font-medium transition-colors duration-500",
                  open ? "bg-cream text-ink" : "bg-wine text-cream hover:bg-ink",
                )}
              >
                {p.bookLabel}
              </Link>
            </Magnetic>
            <button
              ref={menuBtn}
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="group flex h-11 items-center gap-3 rounded-full pl-3 pr-1 text-[0.9rem]"
            >
              <span className="hidden sm:inline">{open ? p.closeLabel : p.menuLabel}</span>
              <span className="sr-only sm:hidden">{open ? p.closeLabel : p.menuLabel}</span>
              <span aria-hidden className="relative grid h-10 w-10 place-items-center rounded-full border border-current/25">
                <span className={clsx("absolute h-px w-4 bg-current transition-transform duration-500", open ? "rotate-45" : "-translate-y-[3px]")} />
                <span className={clsx("absolute h-px w-4 bg-current transition-transform duration-500", open ? "-rotate-45" : "translate-y-[3px]")} />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu */}
      <div
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={p.menuLabel}
        inert={!open}
        className={clsx(
          "theme-ink fixed inset-0 z-[125] overflow-y-auto transition-[clip-path] duration-[900ms] ease-[var(--ease-in-out-quart)]",
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
        )}
        data-lenis-prevent
      >
        <div className="wrap grid min-h-full gap-10 pb-28 pt-[calc(var(--header-h)+2rem)] md:grid-cols-[1.2fr_1fr] md:pb-12">
          <nav aria-label={p.menuLabel}>
            <ul className="flex flex-col">
              {p.all.map((l, i) => (
                <li key={l.key} className="overflow-hidden border-b border-line">
                  <Link
                    href={l.href}
                    prefetch={open ? undefined : false}
                    onMouseEnter={() => setHover(i)}
                    onFocus={() => setHover(i)}
                    className="group flex items-baseline gap-5 py-2.5 transition-[transform,opacity] duration-[900ms] ease-[var(--ease-out-expo)] md:py-3"
                    style={{
                      transitionDelay: open ? `${150 + i * 45}ms` : "0ms",
                      transform: open ? "none" : "translateY(110%)",
                    }}
                  >
                    <span className="t-eyebrow w-7 text-champagne">{String(i + 1).padStart(2, "0")}</span>
                    <span className="font-serif text-[clamp(2rem,4.6vw,4.4rem)] leading-[1] tracking-[-0.02em] transition-[font-style,color] duration-300 group-hover:italic group-hover:text-blush">
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col justify-between gap-10">
            <div className="relative hidden aspect-[4/5] overflow-hidden rounded-[2px] md:block">
              {p.all.map((l, i) =>
                l.image ? (
                  <div
                    key={l.key}
                    className="absolute inset-0 transition-[opacity,transform,clip-path] duration-[900ms] ease-[var(--ease-out-expo)]"
                    style={{
                      opacity: hover === i ? 1 : 0,
                      transform: hover === i ? "scale(1)" : "scale(1.08)",
                      clipPath: hover === i ? "inset(0 0 0 0)" : "inset(8% 8% 8% 8%)",
                    }}
                  >
                    {open && <Image src={l.image} alt="" fill sizes="40vw" className="object-cover" />}
                  </div>
                ) : null,
              )}
            </div>
            <div className="grid gap-6 text-[0.95rem] text-muted sm:grid-cols-2">
              <div>
                <p className="t-eyebrow mb-3 text-champagne">Dorćol</p>
                <p>{p.address}</p>
                <a href={p.phoneHref} className="mt-1 block text-cream hover:text-blush">
                  {p.phone}
                </a>
              </div>
              <div>
                <OpenBadge locale={p.locale} className="text-cream" />
                <a href={p.instagramUrl} target="_blank" rel="noopener" className="mt-3 block hover:text-cream">
                  Instagram {p.instagram} ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
