import clsx from "clsx";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { DAY_NAMES, dayRange, weekFromMonday, type Biz } from "@/lib/biz-core";
import type { Locale } from "@/lib/i18n";

/** A preview's "visit us": the business's real address on a Google map, hours and directions. */
export function PreviewMap({ biz, locale, className }: { biz: Biz; locale: Locale; className?: string }) {
  const sr = locale === "sr";
  const query = [biz.name, biz.address.full].filter(Boolean).join(", ");
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  return (
    <section className={clsx("theme-cream py-24 md:py-36 phone:py-12", className)} aria-labelledby="visit-title">
      <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center phone:block">
        <div>
          <p className="t-eyebrow mb-6 text-wine phone:mb-2">{sr ? "Posetite nas" : "Visit us"}</p>
          <SplitReveal id="visit-title" className="t-h2">
            {sr ? (
              <>
                Vidimo se <em>uskoro.</em>
              </>
            ) : (
              <>
                See you <em>soon.</em>
              </>
            )}
          </SplitReveal>
          <Reveal>
            {biz.address.full && (
              <>
                <p className="t-eyebrow mb-3 mt-10 text-muted phone:mb-1.5 phone:mt-5">{sr ? "Adresa" : "Address"}</p>
                <p className="font-serif text-[1.6rem] leading-snug phone:text-[1.25rem]">{biz.address.full}</p>
              </>
            )}
            {biz.areas.length > 1 && (
              <>
                <p className="t-eyebrow mb-3 mt-8 text-muted phone:mb-1.5 phone:mt-4">{sr ? "Dolaze nam iz" : "Serving"}</p>
                <p className="max-w-md leading-relaxed">{biz.areas.join(" · ")}</p>
              </>
            )}
            <OpenBadge locale={locale} className="mt-8 text-[0.9rem] phone:mt-4 phone:whitespace-nowrap" />
            {biz.hours && (
              <dl className="mt-4 grid max-w-xs grid-cols-[auto_1fr] gap-x-6 gap-y-1 text-muted">
                {weekFromMonday(biz.hours).map((h) => (
                  <div key={h.day} className="contents">
                    <dt>{DAY_NAMES[locale][h.day]}</dt>
                    <dd className="text-right text-ink">{dayRange(h, locale)}</dd>
                  </div>
                ))}
              </dl>
            )}
            <div className="mt-10 phone:mt-5">
              <Button href={directions} variant="outline" arrow={false}>
                {sr ? "Kako do nas" : "Get directions"}
              </Button>
            </div>
          </Reveal>
        </div>
        <Reveal className="phone:mt-7">
          <div className="relative aspect-[4/3] overflow-hidden bg-surface">
            {/* Phones: a swipe over the map scrolls the page, a tap opens directions */}
            <iframe src={embed} title={sr ? `Mapa: ${query}` : `Map: ${query}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0 phone:pointer-events-none" />
            <a href={directions} target="_blank" rel="noopener" aria-label={sr ? "Kako do nas" : "Get directions"} className="absolute inset-0 hidden phone:block" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
