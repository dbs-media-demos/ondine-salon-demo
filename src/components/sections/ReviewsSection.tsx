import Link from "next/link";
import { Stars } from "@/components/ui/Stars";
import { Marquee } from "@/components/ui/Marquee";
import { SplitReveal, Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { reviews } from "@/content/reviews";
import { ReviewCard } from "./ReviewCard";
import { getDictionary } from "@/i18n/dictionary";
import type { Locale } from "@/lib/i18n";
import { pageHref } from "@/lib/routes";
import { site } from "@/lib/site";
import type { Biz } from "@/lib/biz-core";

/** Google-style rating summary + two counter-moving marquees of review cards. */
export function ReviewsSection({ locale, biz }: { locale: Locale; biz?: Biz }) {
  const rating = biz ? biz.rating : site.rating;
  const area = biz?.area;
  const d = getDictionary(locale);
  // Previews skip the two reviews about visiting Belgrade
  const list = biz ? reviews.filter((r) => r.id !== "r2" && r.id !== "r10") : reviews;
  const a = list.slice(0, 6);
  const b = list.slice(6);
  return (
    <section className="theme-blush overflow-hidden py-24 md:py-36" aria-labelledby="reviews-title">
      <div className="wrap grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="t-eyebrow mb-6 text-wine">{biz ? (locale === "sr" ? "Google · primeri" : "Google · samples") : "Google"}</p>
          <SplitReveal id="reviews-title" className="t-h1 max-w-[12ch]">
            {locale === "sr" ? (
              <>
                Šta kažu <em>posle</em> ogledala.
              </>
            ) : (
              <>
                What they say <em>after</em> the mirror.
              </>
            )}
          </SplitReveal>
        </div>
        {rating && (
        <Reveal className="flex items-end gap-6">
          <p className="font-serif text-[clamp(4.5rem,9vw,8rem)] leading-[0.8]">
            <CountUp value={rating.value} decimals={1} locale={locale} />
          </p>
          <div className="pb-2">
            <Stars value={5} className="text-lg text-wine" label={`${rating.value} / 5`} />
            <p className="mt-2 text-[0.9rem] text-muted">{d.reviews.basedOn(rating.count)}</p>
            <Link href={pageHref(locale, "reviews")} className="link-draw mt-3 inline-block py-1 text-[0.9rem] font-medium">
              {d.reviews.readAll} →
            </Link>
          </div>
        </Reveal>
        )}
      </div>

      <div className="mt-16 space-y-4 md:mt-24">
        <Marquee duration={70}>
          {a.map((r) => (
            <ReviewCard key={r.id} r={r} locale={locale} area={area} className="mr-4 w-[82vw] max-w-[26rem] shrink-0 self-stretch" />
          ))}
        </Marquee>
        <Marquee duration={80} reverse>
          {b.map((r) => (
            <ReviewCard key={r.id} r={r} locale={locale} area={area} className="mr-4 w-[82vw] max-w-[26rem] shrink-0 self-stretch" />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
