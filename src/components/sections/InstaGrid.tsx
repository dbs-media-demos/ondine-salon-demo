import { Photo } from "@/components/ui/Photo";
import { Parallax, SplitReveal } from "@/components/ui/Reveal";
import type { ImgKey } from "@/content/images";
import type { Locale } from "@/lib/i18n";
import { site } from "@/lib/site";

const cols: { key: ImgKey; alt: { sr: string; en: string } }[][] = [
  [
    { key: "look-honey-dark", alt: { sr: "Medeni pramenovi", en: "Honey highlights" } },
    { key: "nails-pastel", alt: { sr: "Pastelni nokti", en: "Pastel nails" } },
  ],
  [
    { key: "interior-arch", alt: { sr: "Lučno ogledalo u salonu", en: "Arched mirror in the salon" } },
    { key: "colour-ash-melt", alt: { sr: "Pepeljasti prelaz", en: "Ash colour melt" } },
    { key: "brows-warm", alt: { sr: "Tople obrve", en: "Warm-toned brows" } },
  ],
  [
    { key: "cut-red-bob", alt: { sr: "Crveni bob", en: "Red bob" } },
    { key: "product-trio", alt: { sr: "Preparati za negu", en: "Care products" } },
  ],
  [
    { key: "style-auburn-waves", alt: { sr: "Kestenjasti talasi", en: "Auburn waves" } },
    { key: "portrait-fringe", alt: { sr: "Šiške i talasi", en: "Fringe and waves" } },
    { key: "men-texture", alt: { sr: "Muška tekstura", en: "Men's texture" } },
  ],
];

/** Instagram-style grid: four columns drifting at different speeds. */
export function InstaGrid({ locale }: { locale: Locale }) {
  return (
    <section className="theme-cream overflow-hidden py-24 md:py-36" aria-labelledby="insta-title">
      <div className="wrap mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SplitReveal id="insta-title" className="t-h2 max-w-[16ch]">
          {locale === "sr" ? (
            <>
              Iz stolice, <em>pravo</em> na Instagram.
            </>
          ) : (
            <>
              From the chair, <em>straight</em> to Instagram.
            </>
          )}
        </SplitReveal>
        <a href={site.instagramUrl} target="_blank" rel="noopener" className="font-serif text-[clamp(1.6rem,2.6vw,2.6rem)] italic hover:text-wine">
          {site.instagram} ↗
        </a>
      </div>
      <div className="wrap grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
        {cols.map((col, ci) => (
          <div key={ci} className={ci % 2 ? "space-y-3 pt-16 md:space-y-5 md:pt-28" : "space-y-3 md:space-y-5"}>
            {col.map((c) => (
              <a key={c.key} href={site.instagramUrl} target="_blank" rel="noopener" data-cursor="Instagram" className="group block">
                <Parallax amount={ci % 2 ? 16 : 8} className="aspect-square">
                  <div className="absolute inset-0">
                    <Photo k={c.key} alt={c.alt[locale]} sizes="(min-width: 768px) 24vw, 48vw" className="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
                  </div>
                </Parallax>
              </a>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
