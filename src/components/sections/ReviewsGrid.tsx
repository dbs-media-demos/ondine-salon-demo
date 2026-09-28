"use client";

import { useState } from "react";
import clsx from "clsx";
import { ReviewCard } from "./ReviewCard";
import { reviews } from "@/content/reviews";
import { services } from "@/content/services";
import type { Locale } from "@/lib/i18n";

/** Filterable review wall (by service). All reviews stay in the HTML. */
export function ReviewsGrid({ locale, allLabel }: { locale: Locale; allLabel: string }) {
  const [filter, setFilter] = useState<string | null>(null);
  const used = services.filter((s) => reviews.some((r) => r.service === s.id));
  return (
    <div>
      <div className="no-scrollbar -mx-[var(--gutter)] mb-10 flex gap-2 overflow-x-auto px-[var(--gutter)]" role="group" aria-label="Filter">
        {[null, ...used.map((s) => s.id)].map((id) => (
          <button
            key={id ?? "all"}
            type="button"
            aria-pressed={filter === id}
            onClick={() => setFilter(id)}
            className={clsx("min-h-11 shrink-0 rounded-full border px-5 text-[0.9rem] transition-colors", filter === id ? "border-ink bg-ink text-cream" : "border-line hover:border-fg")}
          >
            {id ? services.find((s) => s.id === id)!.short[locale] : allLabel}
          </button>
        ))}
      </div>
      <ul className="columns-1 gap-4 md:columns-2 lg:columns-3">
        {reviews.map((r) => (
          <li key={r.id} className={clsx("mb-4 break-inside-avoid transition-opacity duration-500", filter && r.service !== filter && "hidden")}>
            <ReviewCard r={r} locale={locale} />
          </li>
        ))}
      </ul>
    </div>
  );
}
