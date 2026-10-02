import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { DAY_NAMES, dayRange, weekFromMonday, type Biz } from "@/lib/biz-core";
import type { Locale } from "@/lib/i18n";

/** A preview's "visit us": the business's real address on a Google map, hours and directions. */
export function PreviewMap({ biz, locale }: { biz: Biz; locale: Locale }) {
  const sr = locale === "sr";
  const query = [biz.name, biz.address.full].filter(Boolean).join(", ");
  const embed = `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  return (
    <section className="theme-cream py-24 md:py-36" aria-labelledby="visit-title">
      <div className="wrap grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="t-eyebrow mb-6 text-wine">{sr ? "Posetite nas" : "Visit us"}</p>
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
                <p className="t-eyebrow mb-3 mt-10 text-muted">{sr ? "Adresa" : "Address"}</p>
                <p className="font-serif text-[1.6rem] leading-snug">{biz.address.full}</p>
              </>
            )}
            <OpenBadge locale={locale} className="mt-8 text-[0.9rem]" />
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
            <div className="mt-10">
              <Button href={directions} variant="outline" arrow={false}>
                {sr ? "Kako do nas" : "Get directions"}
              </Button>
            </div>
          </Reveal>
        </div>
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden bg-surface">
            <iframe src={embed} title={sr ? `Mapa: ${query}` : `Map: ${query}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="absolute inset-0 h-full w-full border-0" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
