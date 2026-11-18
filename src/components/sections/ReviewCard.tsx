import clsx from "clsx";
import { Stars } from "@/components/ui/Stars";
import { type Review } from "@/content/reviews";
import { stylistById } from "@/content/team";
import { serviceById } from "@/content/services";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { enPreview } from "@/i18n/en-preview";
import { srPreview } from "@/i18n/sr-preview";

export function ReviewCard({ r, locale, className, area }: { r: Review; locale: Locale; className?: string; area?: string }) {
  const d = getDictionary(locale);
  // A preview's sample reviews don't name the concept salon's stylists
  // `area` set (even "") = a preview's card
  const preview = area !== undefined;
  const text = preview ? ((locale === "sr" ? srPreview : enPreview)[r.text[locale]] ?? r.text[locale]) : r.text[locale];
  const date = new Intl.DateTimeFormat(locale === "sr" ? "sr-Latn-RS" : "en-GB", { month: "long", year: "numeric" }).format(new Date(r.date));
  return (
    <figure className={clsx("flex flex-col justify-between gap-8 bg-surface p-7 md:p-8 phone:gap-3 phone:p-4", className)}>
      <div>
        <div className="flex items-center justify-between gap-4">
          <Stars value={r.rating} className="text-wine" label={`${r.rating} / 5`} />
          <span className="text-[0.78rem] text-muted">{date}</span>
        </div>
        <blockquote className="mt-5 font-serif text-[1.3rem] leading-snug phone:mt-2 phone:text-[1.02rem] phone:leading-[1.36]" lang={locale === "sr" ? "sr-Latn" : "en"}>
          “{text}”
        </blockquote>
        {r.lang !== locale && <p className="mt-3 text-[0.75rem] text-muted phone:mt-1.5 phone:text-[0.7rem]">{locale === "en" ? d.reviews.written : "Prevedeno sa engleskog"}</p>}
      </div>
      <figcaption className="flex items-center gap-3 text-[0.88rem] phone:gap-2.5 phone:text-[0.8rem] phone:leading-tight">
        <span aria-hidden className="grid h-10 w-10 place-items-center rounded-full bg-blush font-serif text-lg text-wine phone:h-8 phone:w-8 phone:shrink-0 phone:text-base">
          {r.name[0]}
        </span>
        <span>
          <span className="block font-medium">{r.name}</span>
          <span className="text-muted">
            {preview ? `${area ? `${area} · ` : ""}${serviceById(r.service).short[locale]}` : `${r.area} · ${serviceById(r.service).short[locale]} · ${stylistById(r.stylist)?.name.split(" ")[0]}`}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
