import Link from "next/link";
import clsx from "clsx";
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

/** Google-style rating summary + two counter-moving marquees of review cards (phones: full cards in a stack, the rest in a swipe rail). */
export function ReviewsSection({ locale, biz, className }: { locale: Locale; biz?: Biz; className?: string }) {
  const rating = biz ? biz.rating : site.rating;
  const d = getDictionary(locale);
  // Previews skip the two reviews about visiting Belgrade
  const list = biz ? reviews.filter((r) => r.id !== "r2" && r.id !== "r10") : reviews;
  // A preview's reviewers come from the towns it serves (its own town only, when the CRM has none)
  const towns = biz ? (biz.areas.length ? biz.areas : [biz.area]) : [];
  const areaOf = (id: string) => (biz ? towns[Math.max(0, list.findIndex((r) => r.id === id)) % towns.length] : undefined);
  const a = list.slice(0, 6);
  const b = list.slice(6);
  return (
    <section className={clsx("theme-blush overflow-hidden py-24 md:py-36 phone:py-10", className)} aria-labelledby="reviews-title">
      <div className="wrap grid gap-10 md:grid-cols-[1fr_auto] md:items-end phone:block">
        <div>
          <p className="t-eyebrow mb-6 text-wine phone:mb-2">{biz ? (locale === "sr" ? "Google · primeri" : "Google · samples") : "Google"}</p>
          <SplitReveal id="reviews-title" className="t-h1 max-w-[12ch] phone:max-w-none">
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
        <Reveal className="flex items-end gap-6 phone:mt-4 phone:items-center phone:gap-4">
          <p className="font-serif text-[clamp(4.5rem,9vw,8rem)] leading-[0.8] phone:text-[2.9rem]">
            <CountUp value={rating.value} decimals={1} locale={locale} />
          </p>
          <div className="pb-2 phone:pb-0">
            <Stars value={5} className="text-lg text-wine phone:text-[0.95rem]" label={`${rating.value} / 5`} />
            <p className="mt-2 text-[0.9rem] text-muted phone:mt-0.5 phone:text-[0.82rem]">{d.reviews.basedOn(rating.count)}</p>
            <Link href={pageHref(locale, "reviews")} className="link-draw mt-3 inline-block py-1 text-[0.9rem] font-medium phone:hidden">
              {d.reviews.readAll} →
            </Link>
          </div>
        </Reveal>
        )}
      </div>

      {/* Phones */}
      <div className="wrap mt-5 hidden space-y-3 phone:block">
        {list.slice(0, 4).map((r) => (
          <ReviewCard key={r.id} r={r} locale={locale} area={areaOf(r.id)} />
        ))}
      </div>
      <div className="no-scrollbar mt-3 hidden snap-x snap-mandatory scroll-pl-[var(--gutter)] gap-3 overflow-x-auto px-[var(--gutter)] phone:flex">
        {list.slice(4).map((r) => (
          <ReviewCard key={r.id} r={r} locale={locale} area={areaOf(r.id)} className="w-[80vw] max-w-[26rem] shrink-0 snap-start" />
        ))}
      </div>
      <div className="wrap mt-4 hidden phone:block">
        <Link href={pageHref(locale, "reviews")} className="link-draw inline-block py-2 text-[0.9rem] font-medium">
          {d.reviews.readAll} →
        </Link>
      </div>

      <div className="mt-16 space-y-4 md:mt-24 phone:hidden">
        <Marquee duration={70}>
          {a.map((r) => (
            <ReviewCard key={r.id} r={r} locale={locale} area={areaOf(r.id)} className="mr-4 w-[82vw] max-w-[26rem] shrink-0 self-stretch" />
          ))}
        </Marquee>
        <Marquee duration={80} reverse>
          {b.map((r) => (
            <ReviewCard key={r.id} r={r} locale={locale} area={areaOf(r.id)} className="mr-4 w-[82vw] max-w-[26rem] shrink-0 self-stretch" />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
