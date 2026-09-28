"use client";

import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";
import type { Locale } from "@/lib/i18n";
import { bookingHref } from "@/lib/routes";
import { priceCategories, lengthLabels, formatRsd, type Length, type Price, type PriceCategory } from "@/content/prices";
import { Odometer } from "./Odometer";

const LENGTHS: Length[] = ["short", "medium", "long"];

const copy = {
  sr: {
    length: "Dužina kose",
    lengthHint: "Kratka do brade · srednja do ramena · duga ispod lopatica",
    search: "Pretraži cenovnik",
    searchPlaceholder: "npr. balayage, keratin, gel…",
    none: (q: string) => `Nema usluge za „${q}“. Pozovite nas — verovatno je radimo.`,
    book: "Zakaži",
    popular: "Najtraženije",
    from: "od",
    clear: "Obriši pretragu",
    results: (n: number) => `${n} ${n === 1 ? "usluga" : n < 5 ? "usluge" : "usluga"}`,
    categories: "Kategorije",
  },
  en: {
    length: "Hair length",
    lengthHint: "Short to the chin · medium to the shoulders · long below the shoulder blades",
    search: "Search the price list",
    searchPlaceholder: "e.g. balayage, keratin, gel…",
    none: (q: string) => `No service matches “${q}”. Give us a call — we probably do it.`,
    book: "Book",
    popular: "Most booked",
    from: "from",
    clear: "Clear search",
    results: (n: number) => `${n} ${n === 1 ? "service" : "services"}`,
    categories: "Categories",
  },
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "dj");

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = norm(text).indexOf(norm(q));
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-[2px] bg-blush px-0.5 text-ink">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

/**
 * The HTML price list (cenovnik). Every category and price is real text in the
 * page — Google reads it, unlike the JPG menus most salons post. Sticky tabs
 * jump between categories (scroll-spy), the length switch rolls prices live,
 * search filters as you type and every row has its own "Book" link.
 */
export function PriceList({ locale, compact = false, simple = false, only }: { locale: Locale; compact?: boolean; simple?: boolean; only?: string[] }) {
  const full = !compact && !simple;
  const c = copy[locale];
  const [length, setLength] = useState<Length>("medium");
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query.trim());
  const [active, setActive] = useState(priceCategories[0].id);
  const tabsRef = useRef<HTMLDivElement>(null);

  const cats: PriceCategory[] = useMemo(() => {
    const base = only ? priceCategories.filter((p) => only.includes(p.id)) : priceCategories;
    if (compact) return [{ ...base[0], id: "popular", name: { sr: c.popular, en: c.popular }, items: base.flatMap((p) => p.items.filter((i) => i.popular)) }];
    if (!q) return base;
    const nq = norm(q);
    return base
      .map((p) => ({ ...p, items: p.items.filter((i) => norm(`${i.name[locale]} ${i.note?.[locale] ?? ""} ${p.name[locale]}`).includes(nq)) }))
      .filter((p) => p.items.length);
  }, [q, locale, compact, only, c.popular]);

  const count = cats.reduce((n, p) => n + p.items.length, 0);

  // Scroll-spy for the sticky tabs.
  useEffect(() => {
    if (!full) return;
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-price-cat]"));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.getAttribute("data-price-cat")!);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [full, cats]);

  // Keep the active tab visible in the (horizontally scrolling) tab bar.
  useEffect(() => {
    const btn = tabsRef.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`);
    const bar = tabsRef.current;
    if (btn && bar) bar.scrollTo({ left: btn.offsetLeft - bar.clientWidth / 2 + btn.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  const jump = (id: string) => {
    const el = document.getElementById(`cat-${id}`);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 150;
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  const show = (p: Price, from?: boolean): ReactNode => {
    const v = typeof p === "number" ? p : p[length];
    return (
      <>
        {from && <span className="mr-1 text-[0.8em] text-muted">{c.from}</span>}
        <Odometer value={formatRsd(v, locale).replace(" RSD", "")} />
        <span className="ml-1.5 text-[0.62em] tracking-[0.08em] text-muted">RSD</span>
      </>
    );
  };

  return (
    <div>
      {/* Controls */}
      <div
        className={clsx(
          "z-30 -mx-[var(--gutter)] border-b border-line bg-bg/92 px-[var(--gutter)] backdrop-blur-md",
          full && "sticky top-0 pt-3",
        )}
      >
        <div className="flex flex-col gap-4 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <fieldset className="flex flex-wrap items-center gap-3">
            <legend className="sr-only">{c.length}</legend>
            <span className="t-eyebrow text-muted" aria-hidden>
              {c.length}
            </span>
            <div className="relative grid grid-cols-3 rounded-full border border-line p-1">
              <span
                aria-hidden
                className="absolute bottom-1 top-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-ink transition-transform duration-500 ease-[var(--ease-out-expo)]"
                style={{ left: "0.25rem", transform: `translateX(${LENGTHS.indexOf(length) * 100}%)` }}
              />
              {LENGTHS.map((l) => (
                <label key={l} className="relative z-10 cursor-pointer">
                  <input type="radio" name={`len-${compact ? "c" : "f"}`} value={l} checked={length === l} onChange={() => setLength(l)} className="peer sr-only" />
                  <span
                    className={clsx(
                      "flex min-h-10 items-center justify-center gap-2 rounded-full px-4 text-[0.88rem] transition-colors duration-500 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-wine",
                      length === l ? "text-cream" : "text-fg",
                    )}
                  >
                    <HairIcon length={l} />
                    {lengthLabels[l][locale]}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          {full && (
            <label className="relative flex min-h-11 items-center rounded-full border border-line pl-11 pr-3 focus-within:border-fg lg:w-[22rem]">
              <span className="sr-only">{c.search}</span>
              <svg aria-hidden viewBox="0 0 24 24" className="absolute left-4 h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-3.5-3.5" />
              </svg>
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={c.searchPlaceholder}
                className="h-11 w-full bg-transparent text-[0.95rem] outline-none placeholder:text-muted"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label={c.clear} className="grid h-9 w-9 place-items-center rounded-full hover:bg-surface">
                  ×
                </button>
              )}
            </label>
          )}
        </div>
        {full && (
          <div ref={tabsRef} className="no-scrollbar -mb-px flex gap-1 overflow-x-auto" role="navigation" aria-label={c.categories}>
            {priceCategories.map((p) => {
              const hasItems = cats.some((x) => x.id === p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  data-tab={p.id}
                  onClick={() => jump(p.id)}
                  disabled={!hasItems}
                  aria-current={active === p.id ? "true" : undefined}
                  className={clsx(
                    "relative min-h-11 shrink-0 whitespace-nowrap px-4 text-[0.92rem] transition-colors duration-300 disabled:opacity-30",
                    active === p.id ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {p.name[locale]}
                  <span
                    aria-hidden
                    className={clsx(
                      "absolute inset-x-3 bottom-0 h-[2px] origin-left bg-wine transition-transform duration-500 ease-[var(--ease-out-expo)]",
                      active === p.id ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {full && (
        <p className="mt-4 text-[0.85rem] text-muted" aria-live="polite">
          {q ? c.results(count) : c.lengthHint}
        </p>
      )}

      {count === 0 && <p className="py-20 text-center font-serif text-2xl">{c.none(q)}</p>}

      <div className={clsx(full && "mt-6")}>
        {cats.map((p) => (
          <section key={p.id} id={`cat-${p.id}`} data-price-cat={p.id} aria-labelledby={compact ? undefined : `cat-h-${p.id}`} className={clsx(full && "pb-12 pt-10", simple && "pt-10")}>
            {full && (
              <h2 id={`cat-h-${p.id}`} className="t-h2 mb-6 flex items-baseline gap-4">
                {p.name[locale]}
                <span className="t-eyebrow text-muted">{String(p.items.length).padStart(2, "0")}</span>
              </h2>
            )}
            {simple && (
              <h3 id={`cat-h-${p.id}`} className="t-h3 mb-5">
                {p.name[locale]}
              </h3>
            )}
            <ul className="border-t border-line">
              {p.items.map((i) => (
                <li
                  key={i.id}
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 border-b border-line py-5 transition-colors duration-500 hover:bg-surface/60 md:grid-cols-[1fr_6rem_11rem_auto] md:px-3"
                >
                  <div className="col-span-2 md:col-span-1">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[1.08rem] font-medium">
                      <Highlight text={i.name[locale]} q={q} />
                      {i.popular && full && (
                        <span className="t-eyebrow rounded-full bg-blush px-2 py-1 text-[0.6rem] text-wine">★ {c.popular}</span>
                      )}
                      {typeof i.price !== "number" && (
                        <span className="t-eyebrow text-[0.6rem] text-muted">{lengthLabels[length][locale]}</span>
                      )}
                    </p>
                    {i.note && <p className="mt-1 text-[0.9rem] text-muted">{i.note[locale]}</p>}
                  </div>
                  <p className="text-[0.88rem] text-muted md:text-right">
                    {i.duration} min
                  </p>
                  <p className="text-right font-serif text-[1.45rem] leading-none md:col-auto">{show(i.price, i.from)}</p>
                  <Link
                    href={bookingHref(locale, { service: i.id })}
                    className="col-span-2 inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-[0.88rem] font-medium transition-colors duration-500 hover:border-wine hover:bg-wine hover:text-cream md:col-span-1"
                    aria-label={`${c.book}: ${i.name[locale]}`}
                  >
                    {c.book}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

/** Tiny silhouette showing the hair length. */
function HairIcon({ length }: { length: Length }) {
  const h = { short: 9, medium: 14, long: 20 }[length];
  return (
    <svg aria-hidden viewBox="0 0 16 22" className="h-4 w-3" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="8" cy="6" r="3.2" />
      <path d={`M3.6 6.2c0 ${h - 6}-1 ${h - 4}-1.4 ${h - 3}M12.4 6.2c0 ${h - 6} 1 ${h - 4} 1.4 ${h - 3}`} />
    </svg>
  );
}
