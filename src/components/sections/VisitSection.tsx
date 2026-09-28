import { CityMap } from "./CityMap";
import { OpenBadge } from "@/components/ui/OpenBadge";
import { Button } from "@/components/ui/Button";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { site } from "@/lib/site";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Strahinjića Bana, Beograd")}`;

/** Where + when: stylised Dorćol map, address, hours with a live open badge, directions. */
export function VisitSection({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const sr = locale === "sr";
  return (
    <section className="theme-ink py-24 md:py-36" aria-labelledby="visit-title">
      <div className="wrap grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="t-eyebrow mb-6 text-champagne">{d.footer.visit}</p>
          <SplitReveal id="visit-title" className="t-h1">
            {sr ? (
              <>
                Dorćol, <em>iza ugla</em> Kalemegdana.
              </>
            ) : (
              <>
                Dorćol, <em>around the corner</em> from Kalemegdan.
              </>
            )}
          </SplitReveal>
          <Reveal stagger={0.08} className="mt-10 grid gap-8 sm:grid-cols-2">
            <div>
              <p className="t-eyebrow mb-3 text-muted">{sr ? "Adresa" : "Address"}</p>
              <address className="not-italic text-[1.05rem] leading-relaxed">
                {site.address.street}
                <br />
                {site.address.postal} {sr ? site.address.city : site.address.cityEn}
              </address>
              <p className="mt-2 text-[0.9rem] text-muted">
                {sr ? "5 min pešice od Studentskog trga. Garaža „Dorćol Centar“." : "5 min walk from Studentski trg. Parking at Dorćol Centar garage."}
              </p>
            </div>
            <div>
              <p className="t-eyebrow mb-3 text-muted">{d.hours.title}</p>
              <p className="text-[1.05rem]">
                {d.hours.weekdays} · 9–21
              </p>
              <p className="text-muted">
                {d.hours.sunMon}: {d.hours.closed}
              </p>
              <OpenBadge locale={locale} className="mt-3 text-[0.9rem]" />
            </div>
          </Reveal>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href={pageHref(locale, "booking")} variant="light">
              {d.book}
            </Button>
            <Button href={mapsUrl} variant="outline">
              {sr ? "Uputstva" : "Directions"}
            </Button>
          </div>
        </div>
        <Reveal>
          <CityMap className="aspect-[4/3] w-full" label={sr ? "Stilizovana mapa Dorćola sa lokacijom salona u Strahinjića Bana" : "Stylised map of Dorćol showing the salon on Strahinjića Bana"} />
        </Reveal>
      </div>
    </section>
  );
}
