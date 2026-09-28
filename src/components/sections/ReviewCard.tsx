import clsx from "clsx";
import { Stars } from "@/components/ui/Stars";
import { type Review } from "@/content/reviews";
import { stylistById } from "@/content/team";
import { serviceById } from "@/content/services";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";

export function ReviewCard({ r, locale, className }: { r: Review; locale: Locale; className?: string }) {
  const d = getDictionary(locale);
  const date = new Intl.DateTimeFormat(locale === "sr" ? "sr-Latn-RS" : "en-GB", { month: "long", year: "numeric" }).format(new Date(r.date));
  return (
    <figure className={clsx("flex flex-col justify-between gap-8 bg-surface p-7 md:p-8", className)}>
      <div>
        <div className="flex items-center justify-between gap-4">
          <Stars value={r.rating} className="text-wine" label={`${r.rating} / 5`} />
          <span className="text-[0.78rem] text-muted">{date}</span>
        </div>
        <blockquote className="mt-5 font-serif text-[1.3rem] leading-snug" lang={locale === "sr" ? "sr-Latn" : "en"}>
          “{r.text[locale]}”
        </blockquote>
        {r.lang !== locale && <p className="mt-3 text-[0.75rem] text-muted">{locale === "en" ? d.reviews.written : "Prevedeno sa engleskog"}</p>}
      </div>
      <figcaption className="flex items-center gap-3 text-[0.88rem]">
        <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-blush font-serif text-lg text-wine">
          {r.name[0]}
        </span>
        <span>
          <span className="block font-medium">{r.name}</span>
          <span className="text-muted">
            {r.area} · {serviceById(r.service).short[locale]} · {stylistById(r.stylist)?.name.split(" ")[0]}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
